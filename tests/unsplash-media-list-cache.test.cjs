const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

// Run the actual Unsplash playlist method and its localStorage helpers without
// requiring Home Assistant's custom elements or a browser.
const source = fs.readFileSync(path.join(__dirname, "../wallpanel-src.js"), "utf8");

function slice(startMarker, endMarker) {
	const start = source.indexOf(startMarker);
	const end = source.indexOf(endMarker, start);
	assert.ok(start >= 0 && end > start, `${startMarker} must be present`);
	return source.slice(start, end);
}

const helpers = slice(
	'const unsplashMediaListStorageKey = "wallpanel-unsplash-media-list";',
	"// The message container lives in the document"
);
const method = slice("\t\tasync updateMediaListFromUnsplashAPI() {", "\t\tasync _immichFetch(");
const makeUpdate = new Function(
	"config",
	"logger",
	"addToMediaInfoCache",
	"localStorage",
	"fetch",
	`${helpers}\nreturn ({${method}}).updateMediaListFromUnsplashAPI;`
);

const imageUrl = "https://api.unsplash.com/photos/random?client_id=KEY&query=nature";
const entry = (id) => ({ id, urls: { raw: `https://images.unsplash.com/${id}?ixid=x` } });

function setup({ storage = new Map(), interval = 3600, response = [entry("a"), entry("b")], fail, onFetch } = {}) {
	const requests = [];
	const updates = [];
	const config = { image_url: imageUrl, media_list_update_interval: interval, immich_api_request_timeout: 10 };
	const localStorage = {
		getItem: (key) => (storage.has(key) ? storage.get(key) : null),
		setItem: (key, value) => storage.set(key, value)
	};
	const fetch = async (url) => {
		requests.push(url);
		if (onFetch) onFetch(config, url);
		if (fail) throw fail;
		return { ok: true, json: async () => JSON.parse(JSON.stringify(response)) };
	};
	const logger = { debug() {} };
	const update = makeUpdate(config, logger, () => {}, localStorage, fetch);
	const wp = {
		mediaList: [],
		lastMediaListUpdate: Date.now(),
		updateMediaList: (...args) => updates.push(args)
	};
	return { config, storage, requests, updates, wp, run: () => update.call(wp) };
}

test("a reload reuses the stored list until media_list_update_interval elapses", async () => {
	const first = setup();
	await first.run();
	assert.equal(first.requests.length, 1);

	const reloaded = setup({ storage: first.storage });
	reloaded.wp.lastMediaListUpdate = Date.now() + 1000;
	await reloaded.run();
	assert.equal(reloaded.requests.length, 0);
	assert.deepEqual(reloaded.wp.mediaList, first.wp.mediaList);
	const stored = JSON.parse(first.storage.get("wallpanel-unsplash-media-list"));
	assert.equal(reloaded.wp.lastMediaListUpdate, stored.fetchedAt, "Keep the original fetch time");
});

test("an expired list is fetched again", async () => {
	const storage = new Map();
	storage.set(
		"wallpanel-unsplash-media-list",
		JSON.stringify({ source: imageUrl, fetchedAt: Date.now() - 3601 * 1000, entries: [entry("old")] })
	);
	const { requests, wp, run } = setup({ storage });
	await run();
	assert.equal(requests.length, 1);
	assert.ok(wp.mediaList[0].includes("/a?"));
});

test("a different image_url does not reuse the stored list", async () => {
	const first = setup();
	await first.run();
	const changed = setup({ storage: first.storage });
	changed.config.image_url = `${imageUrl}&orientation=landscape`;
	await changed.run();
	assert.equal(changed.requests.length, 1);
});

test("corrupt or invalid stored data falls back to the API", async () => {
	for (const value of [
		"not json",
		JSON.stringify({ source: imageUrl, fetchedAt: Date.now(), entries: [] }),
		JSON.stringify({ source: imageUrl, fetchedAt: Date.now(), entries: [{ id: "no-urls" }] }),
		JSON.stringify({ source: imageUrl, fetchedAt: Date.now() + 60000, entries: [entry("future")] })
	]) {
		const storage = new Map([["wallpanel-unsplash-media-list", value]]);
		const { requests, run } = setup({ storage });
		await run();
		assert.equal(requests.length, 1, value);
	}
});

test("unavailable localStorage keeps the uncached behaviour", async () => {
	const { requests, wp } = setup();
	const broken = makeUpdate(
		{ image_url: imageUrl, media_list_update_interval: 3600, immich_api_request_timeout: 10 },
		{ debug() {} },
		() => {},
		{
			getItem() {
				throw new Error("SecurityError");
			},
			setItem() {
				throw new Error("QuotaExceededError");
			}
		},
		async (url) => {
			requests.push(url);
			return { ok: true, json: async () => [entry("a")] };
		}
	);
	await broken.call(wp);
	await broken.call(wp);
	assert.equal(requests.length, 2);
	assert.equal(wp.mediaList.length, 1);
});

test("API errors still propagate to the existing retry handling", async () => {
	const { storage, run } = setup({ fail: new Error("Failed to fetch") });
	await assert.rejects(run(), /Failed to fetch/);
	assert.equal(storage.size, 0);
});

test("cached entries without a usable raw URL fall back to the API", async () => {
	for (const badEntry of [
		{ id: "no-urls" },
		{ id: "empty-urls", urls: {} },
		{ id: "blank-url", urls: { raw: "   " } },
		{ id: "null-url", urls: { raw: null } }
	]) {
		const label = JSON.stringify(badEntry);
		const storage = new Map([
			[
				"wallpanel-unsplash-media-list",
				JSON.stringify({ source: imageUrl, fetchedAt: Date.now(), entries: [badEntry] })
			]
		]);
		const { requests, wp, run } = setup({ storage });
		await run();
		assert.equal(requests.length, 1, label);
		assert.ok(wp.mediaList.length > 0, label);
		assert.ok(
			wp.mediaList.every((url) => !url.startsWith("undefined")),
			`${label} must not become an image URL`
		);
	}
});

test("an API response with an entry without a raw URL is rejected instead of applied", async () => {
	const { storage, wp, run } = setup({ response: [entry("a"), { id: "broken", urls: {} }] });
	await assert.rejects(run(), /without a raw URL/);
	assert.deepEqual(wp.mediaList, []);
	assert.equal(storage.size, 0);
});

test("a response for a source that changed mid-request is neither applied nor cached", async () => {
	const { storage, updates, wp, run, requests } = setup({
		onFetch: (config) => {
			config.image_url = `${imageUrl}&query=cats`;
		}
	});
	await run();
	assert.equal(requests.length, 1);
	assert.deepEqual(wp.mediaList, [], "the stale list must not be applied");
	assert.equal(storage.size, 0, "the stale list must not be cached under the new source");
	await new Promise((resolve) => setTimeout(resolve, 5));
	assert.deepEqual(updates, [[null, true]], "the new source is fetched after the running update");
});

test("the request and the cache key use the source captured before the request", async () => {
	let changed = false;
	const newSource = `${imageUrl}&query=cats`;
	const { storage, wp, run, requests } = setup({
		onFetch: (config) => {
			if (!changed) {
				changed = true;
				config.image_url = newSource;
			}
		}
	});
	await run();
	await new Promise((resolve) => setTimeout(resolve, 5));
	await run();

	assert.deepEqual(requests, [`${imageUrl}&count=30`, `${newSource}&count=30`]);
	const stored = JSON.parse(storage.get("wallpanel-unsplash-media-list"));
	assert.equal(stored.source, newSource);
	assert.ok(wp.mediaList.length > 0);
});
