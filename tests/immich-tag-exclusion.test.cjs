const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

// The view class lives inside initWallpanel(). Run its actual playlist method
// without requiring Home Assistant's custom elements or a browser.
const source = fs.readFileSync(path.join(__dirname, "../wallpanel-src.js"), "utf8");
const start = source.indexOf("\t\tasync updateMediaListFromImmichAPI() {");
const end = source.indexOf("\t\tfillPlaceholders(url) {", start);
assert.ok(start >= 0 && end > start, "Immich playlist method must be present");
const makeUpdate = new Function(
	"config",
	"logger",
	"addToMediaInfoCache",
	`return ({${source.slice(start, end)}}).updateMediaListFromImmichAPI;`
);

const tag = (id, value) => ({ id, value, name: value.split("/").at(-1) });
const asset = (id, ownerId = "owner") => ({
	id,
	ownerId,
	type: "IMAGE",
	width: 1000,
	height: 1000,
	isEdited: false,
	exifInfo: {},
	originalFileName: `${id}.jpg`
});

async function playlist(accounts, overrides = {}) {
	const requests = [];
	const warnings = [];
	const config = {
		immich_api_keys: Object.keys(accounts),
		image_url: "immich+https://example.test/api",
		immich_exclude_tag_names: ["Private"],
		immich_shared_albums: true,
		immich_album_names: [],
		media_order: "sorted",
		media_list_max_size: 100,
		...overrides
	};
	const wp = {
		screensaverContainer: { clientWidth: 1920, clientHeight: 1080 },
		mediaList: [],
		async _immichFetch(url, key, options = {}) {
			const account = accounts[key];
			const route = new URL(url).pathname.replace(/^\/api/, "");
			const body = options.body ? JSON.parse(options.body) : null;
			requests.push({ key, route, body });
			const error = account.fail?.(route, body);
			if (error) throw new Error(error);
			if (route === "/tags") return structuredClone(account.tags || []);
			if (route === "/users/me") return { id: account.userId || "owner" };
			if (route === "/server/version") return { major: 3 };
			if (route === "/albums") return [{ id: "album", albumName: "Selected" }];
			if (route === "/search/metadata") {
				if (body.tagIds) {
					assert.equal(body.tagIds.length, 1, "Search tags separately to preserve union semantics");
					const pages = account.tagPages?.[body.tagIds[0]] || [[]];
					const items = pages[body.page - 1] || [];
					return {
						assets: {
							items: structuredClone(items),
							nextPage: body.page < pages.length ? String(body.page + 1) : null
						}
					};
				}
				assert.deepEqual(body.albumIds, ["album"]);
				return {
					assets: { items: structuredClone(account.assets), nextPage: null }
				};
			}
			if (route.startsWith("/assets/")) {
				const id = route.slice("/assets/".length);
				const original = account.assets.find((entry) => entry.id === id);
				assert.ok(original, `Unexpected asset detail request: ${id}`);
				return structuredClone({
					...original,
					tags: account.assetTags?.[id] || []
				});
			}
			throw new Error(`Unexpected request: ${route}`);
		}
	};
	const logger = {
		debug() {},
		info() {},
		error() {},
		warning: (...args) => warnings.push(args)
	};
	await makeUpdate(config, logger, () => {}).call(wp);
	return {
		ids: wp.mediaList.map((url) => url.match(/\/assets\/([^/]+)\//)[1]).sort(),
		details: requests.filter(({ route }) => route.startsWith("/assets/")),
		requests,
		warnings
	};
}

test("bulk exclusions use full paths and union all pages without fetching asset details", async () => {
	const assets = [asset("first"), asset("second"), asset("third"), asset("keep")];
	const result = await playlist(
		{
			key: {
				assets,
				tags: [tag("private", "Family/Private"), tag("hidden", "Hidden"), tag("other", "Work/Private")],
				tagPages: {
					private: [[assets[0]], [assets[1]]],
					hidden: [[assets[2]]]
				}
			}
		},
		{ immich_exclude_tag_names: ["family/private", "hidden"] }
	);
	assert.deepEqual(result.ids, ["keep"]);
	assert.equal(result.details.length, 0);
	assert.equal(result.requests.filter(({ body }) => body?.tagIds).length, 3);
});

test("a leaf name does not match an unrelated full tag path", async () => {
	const photo = asset("keep");
	const result = await playlist({
		key: {
			assets: [photo],
			tags: [tag("nested", "Family/Private")],
			tagPages: { nested: [[photo]] }
		}
	});
	assert.deepEqual(result.ids, ["keep"]);
	assert.equal(result.details.length, 0);
});

test("parent searches check exact tags instead of excluding descendants automatically", async () => {
	const assets = [asset("parent"), asset("child"), asset("untagged")];
	const parent = tag("parent-tag", "Private");
	const child = tag("child-tag", "Private/Family");
	const result = await playlist({
		key: {
			assets,
			tags: [parent, child],
			tagPages: { "parent-tag": [[assets[0], assets[1]]] },
			assetTags: { parent: [parent], child: [child] }
		}
	});
	assert.deepEqual(result.ids, ["child", "untagged"]);
	assert.deepEqual(result.details.map(({ route }) => route).sort(), ["/assets/child", "/assets/parent"]);
});

test("shared assets use detail tags even when their owner has no tags in this account", async () => {
	const assets = [asset("own"), asset("private", "other-user"), asset("public", "other-user")];
	const result = await playlist({
		key: { assets, assetTags: { private: [tag("foreign", "Private")] } }
	});
	assert.deepEqual(result.ids, ["own", "public"]);
	assert.deepEqual(result.details.map(({ route }) => route).sort(), ["/assets/private", "/assets/public"]);
});

for (const route of ["/tags", "/users/me"]) {
	test(`missing permission for ${route} falls back to detail filtering`, async () => {
		const result = await playlist({
			key: {
				assets: [asset("private"), asset("public")],
				tags: [tag("private-tag", "Private")],
				assetTags: { private: [tag("private-tag", "Private")] },
				fail: (requestRoute) => requestRoute === route && "403: missing permission"
			}
		});
		assert.deepEqual(result.ids, ["public"]);
		assert.equal(result.details.length, 2);
		assert.equal(result.warnings.length, 1);
	});
}

test("a partial bulk search failure discards its results before falling back", async () => {
	const assets = [asset("private"), asset("public")];
	const result = await playlist({
		key: {
			assets,
			tags: [tag("private-tag", "Private")],
			tagPages: { "private-tag": [[assets[1]], [assets[0]]] },
			assetTags: { private: [tag("private-tag", "Private")] },
			fail: (route, body) => route === "/search/metadata" && body.tagIds && body.page === 2 && "Search failed"
		}
	});
	assert.deepEqual(result.ids, ["public"]);
	assert.equal(result.details.length, 2);
});

test("tag lookup state is scoped to each API key", async () => {
	const first = asset("excluded", "first-owner");
	const result = await playlist({
		first: {
			userId: "first-owner",
			assets: [first],
			tags: [tag("private", "Private")],
			tagPages: { private: [[first]] }
		},
		second: { userId: "second-owner", assets: [asset("keep", "second-owner")] }
	});
	assert.deepEqual(result.ids, ["keep"]);
	assert.equal(result.details.length, 0);
});

test("disabled exclusions do not add tag or user lookups", async () => {
	const result = await playlist({ key: { assets: [asset("keep")] } }, { immich_exclude_tag_names: [] });
	assert.deepEqual(result.ids, ["keep"]);
	assert.equal(result.details.length, 0);
	assert.ok(!result.requests.some(({ route }) => route === "/tags" || route === "/users/me"));
});
