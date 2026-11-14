const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const source = fs.readFileSync(path.join(__dirname, "../wallpanel-src.js"), "utf8");
function method(from, to) {
	const start = source.indexOf(`\t\tasync ${from}(`);
	const end = source.indexOf(`\n\t\t${to}(`, start);
	assert.ok(start >= 0 && end > start, `${from} must be present`);
	return source.slice(start, end);
}
const makePanel = new Function(
	"config",
	"logger",
	"fetch",
	"URL",
	`return new (class {
		${method("updateMediaFromUrl", "getNextMediaURL")}
		${method("updateMediaFromOtherSrc", "async updateMedia")}
		${method("updateMediaFromMediaSource", "async updateMediaFromImmichAPI")}
	})();`
);
const stringifyStart = source.indexOf("function stringify(obj) {");
const stringifyEnd = source.indexOf("\nfunction ", stringifyStart + 1);
assert.ok(stringifyStart >= 0 && stringifyEnd > stringifyStart);
const serialize = new Function(`${source.slice(stringifyStart, stringifyEnd)}; return stringify;`)();

function harness(options = {}) {
	const config = { media_type: "auto", ...options.config };
	const attempts = [];
	const fetches = [];
	const elements = [];
	const url = "https://example.test/${width}/media";
	const panel = makePanel(
		config,
		{ debug() {} },
		async (url) => {
			fetches.push(url);
			return new Response("media bytes", { status: options.httpStatus || 200 });
		},
		{ createObjectURL: () => "blob:test", revokeObjectURL() {} }
	);
	function element(tagName) {
		const listeners = new Map();
		const elem = {
			tagName,
			mediaUrl: url,
			listeners,
			addEventListener(name, handler) {
				listeners.set(name, handler);
			},
			removeEventListener(name) {
				listeners.delete(name);
			},
			set src(value) {
				this.currentSrc = value;
				attempts.push(tagName);
				queueMicrotask(() => {
					if (options.succeeds?.includes(tagName)) {
						listeners.get(tagName === "IMG" ? "load" : "loadeddata")?.();
					} else {
						if (tagName === "VIDEO") this.error = { code: 4, message: "MEDIA_ELEMENT_ERROR: Format error" };
						this.onerror?.();
					}
				});
			}
		};
		elements.push(elem);
		return elem;
	}
	panel.current = element(options.startTag || "IMG");
	panel.replaceMediaElement = (old, tag) => {
		panel.current = element(tag.toUpperCase());
		panel.current.mediaUrl = old.mediaUrl;
		return panel.current;
	};
	panel.fillPlaceholders = (value) => value.replace("${width}", "1920");
	return { panel, config, attempts, fetches, elements };
}

test("HTTP URLs default to automatic media detection", () => {
	const start = source.indexOf("const defaultConfig = ") + "const defaultConfig = ".length;
	const end = source.indexOf("\n};", start) + 2;
	assert.equal(new Function(`return (${source.slice(start, end)});`)().media_type, "auto");
});

test("automatic detection loads a valid image without a video attempt", async () => {
	const h = harness({ succeeds: ["IMG"] });
	const loaded = await h.panel.updateMediaFromOtherSrc(h.panel.current);
	assert.equal(loaded.tagName, "IMG");
	assert.equal(loaded.mediaUrl, "https://example.test/1920/media");
	assert.equal(loaded.infoCacheUrl, loaded.mediaUrl);
	assert.deepEqual(h.attempts, ["IMG"]);
});

for (const [first, second] of [
	["IMG", "VIDEO"],
	["VIDEO", "IMG"]
]) {
	test(`automatic detection still loads ${second} after ${first} fails`, async () => {
		const h = harness({ startTag: first, succeeds: [second] });
		assert.equal((await h.panel.updateMediaFromOtherSrc(h.panel.current)).tagName, second);
		assert.deepEqual(h.attempts, [first, second]);
	});

	test(`both errors survive logging when detection starts with ${first}`, async () => {
		const h = harness({ startTag: first });
		await assert.rejects(h.panel.updateMediaFromOtherSrc(h.panel.current), (error) => {
			assert.match(error.message, new RegExp(`as both ${first} and ${second}`));
			assert.equal(error.errors.length, 2);
			const logged = JSON.parse(serialize(error));
			assert.deepEqual(
				logged.errors.map((e) => e.mediaElement.tagName),
				[first, second]
			);
			assert.equal(logged.errors.find((e) => e.mediaElement.tagName === "VIDEO").mediaElement.error.code, 4);
			assert.ok(logged.errors.every((e) => e.message.includes("https://example.test/1920/media")));
			return true;
		});
		assert.deepEqual(h.attempts, [first, second]);
		for (const elem of h.elements) {
			assert.equal(elem.listeners.size, 0);
			assert.equal(elem.onerror, null);
		}
	});
}

for (const [type, tag, previous] of [
	["image", "IMG", "VIDEO"],
	["video", "VIDEO", "IMG"]
]) {
	for (const startTag of [tag, previous]) {
		test(`explicit ${type} loads only ${tag} when the buffer starts as ${startTag}`, async () => {
			const h = harness({ config: { media_type: type }, startTag, succeeds: [tag] });
			assert.equal((await h.panel.updateMediaFromOtherSrc(h.panel.current)).tagName, tag);
			assert.deepEqual(h.attempts, [tag]);
		});

		test(`failed explicit ${type} never probes another type from ${startTag}`, async () => {
			const h = harness({ config: { media_type: type }, startTag });
			await assert.rejects(h.panel.updateMediaFromOtherSrc(h.panel.current), (error) => {
				assert.equal(error.mediaElement.tagName, tag);
				assert.equal(error.errors, undefined);
				return true;
			});
			assert.deepEqual(h.attempts, [tag]);
		});
	}
}

test("changing media_type between loads uses the new setting", async () => {
	const h = harness({ succeeds: ["IMG", "VIDEO"] });
	await h.panel.updateMediaFromOtherSrc(h.panel.current);
	h.config.media_type = "video";
	await h.panel.updateMediaFromOtherSrc(h.panel.current);
	assert.deepEqual(h.attempts, ["IMG", "VIDEO"]);
});

test("invalid media_type fails clearly before making a request", async () => {
	const h = harness({ config: { media_type: "audio" } });
	await assert.rejects(h.panel.updateMediaFromOtherSrc(h.panel.current), /Invalid media_type "audio"/);
	assert.deepEqual(h.attempts, []);
});

for (const stream of [false, true]) {
	test(`forced fetch respects explicit image type (stream_load_media=${stream})`, async () => {
		const h = harness({
			config: { media_type: "image", force_load_media_with_fetch: true, stream_load_media: stream },
			startTag: "VIDEO",
			succeeds: ["IMG"]
		});
		assert.equal((await h.panel.updateMediaFromOtherSrc(h.panel.current)).tagName, "IMG");
		assert.deepEqual(h.attempts, ["IMG"]);
		assert.deepEqual(h.fetches, ["https://example.test/1920/media"]);
	});
}

test("failed fetch attempts preserve both HTTP response diagnostics", async () => {
	const h = harness({ config: { force_load_media_with_fetch: true }, httpStatus: 503 });
	await assert.rejects(h.panel.updateMediaFromOtherSrc(h.panel.current), (error) => {
		assert.deepEqual(
			error.errors.map((e) => e.response.status),
			[503, 503]
		);
		return true;
	});
	assert.equal(h.fetches.length, 2);
});

test("Home Assistant MIME information takes precedence over the HTTP-only setting", async () => {
	const h = harness({ config: { media_type: "image" }, succeeds: ["VIDEO"] });
	h.panel.hass = { callWS: async () => ({ mime_type: "video/mp4", url: "https://example.test/video" }) };
	assert.equal((await h.panel.updateMediaFromMediaSource(h.panel.current)).tagName, "VIDEO");
	assert.deepEqual(h.attempts, ["VIDEO"]);
});
