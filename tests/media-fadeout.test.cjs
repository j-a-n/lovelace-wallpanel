const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const source = fs.readFileSync(path.join(__dirname, "../wallpanel-src.js"), "utf8");
function methods(from, to) {
	const start = source.indexOf(`\t\t${from}`);
	const end = source.indexOf(`\n\t\t${to}`, start);
	assert.ok(start >= 0 && end > start, `${from} must be present`);
	return source.slice(start, end);
}
const makeMethods = new Function(
	"config",
	"setTimeout",
	"logger",
	"getHaCameraStreamPlayerAndVideo",
	`return new (class {${methods("_switchActiveMedia(", "setupScreensaver(")}
	${methods("releaseAllMedia(", "replaceMediaElement(")}})();`
);

function harness(option = true) {
	const timers = [];
	const releases = [];
	const errors = [];
	const config = { release_inactive_media: option };
	const panel = makeMethods(
		config,
		(callback, delay) => {
			timers.push({ callback, delay });
			return timers.length;
		},
		{ debug: (...args) => errors.push(args) },
		(element) => [element.player, element.video]
	);
	panel.imageOne = { tagName: "IMG", style: {}, src: "blob:one" };
	panel.imageTwo = { tagName: "IMG", style: {}, src: "blob:two" };
	panel.imageOneContainer = { style: { opacity: 1 } };
	panel.imageTwoContainer = { style: { opacity: 0 } };
	panel.getInactiveMediaElement = () => (panel.imageOneContainer.style.opacity == 0 ? panel.imageOne : panel.imageTwo);
	panel.releaseMediaElement = (element) => releases.push(element);
	for (const method of [
		"setMediaDataInfo",
		"setMediaDimensions",
		"setImageURLEntityState",
		"startPlayingActiveMedia",
		"restartProgressBarAnimation",
		"restartKenBurnsEffect"
	]) {
		panel[method] = () => {};
	}
	return { panel, timers, releases, errors };
}

test("media release is enabled in the default configuration", () => {
	const start = source.indexOf("const defaultConfig = ") + "const defaultConfig = ".length;
	const end = source.indexOf("\n};", start) + 2;
	const config = new Function(`return (${source.slice(start, end)});`)();
	assert.equal(config.release_inactive_media, true);
});

for (const option of [true, undefined]) {
	test(`normal cleanup still runs after the fade with option ${option}`, () => {
		const { panel, timers, releases } = harness(option);
		panel._switchActiveMedia(panel.imageTwo, 3000);
		assert.deepEqual(releases, []);
		assert.equal(timers[0].delay, 3000);
		timers[0].callback();
		assert.deepEqual(releases, [panel.imageOne]);
	});
}

test("the workaround retains image buffers after the fade", () => {
	const { panel, timers, releases } = harness(false);
	panel.imageOne.style.animation = "kenBurnsEffect-simple 30s linear forwards";
	panel._switchActiveMedia(panel.imageTwo, 3000);
	timers[0].callback();
	assert.deepEqual(releases, []);
	assert.equal(panel.imageOne.src, "blob:one");
	assert.equal(panel.imageOne.style.animation, "kenBurnsEffect-simple 30s linear forwards");
});

test("the workaround still pauses outgoing videos", () => {
	const { panel, timers, releases } = harness(false);
	let pauses = 0;
	panel.imageOne.tagName = "VIDEO";
	panel.imageOne.pause = () => pauses++;
	panel._switchActiveMedia(panel.imageTwo, 3000);
	assert.equal(pauses, 0);
	timers[0].callback();
	assert.equal(pauses, 1);
	assert.deepEqual(releases, []);
});

test("the workaround stops outgoing camera playback", () => {
	const { panel, timers } = harness(false);
	let pauses = 0;
	let stops = 0;
	panel.imageOne.tagName = "HA-CAMERA-STREAM";
	panel.imageOne.video = { pause: () => pauses++ };
	panel.imageOne.player = { stop: () => stops++ };
	panel._switchActiveMedia(panel.imageTwo, 3000);
	timers[0].callback();
	assert.equal(pauses, 1);
	assert.equal(stops, 1);
});

for (const option of [true, false]) {
	test(`an old fade callback cannot affect a reused buffer with option ${option}`, () => {
		const { panel, timers, releases } = harness(option);
		panel.imageOne.tagName = "VIDEO";
		let pauses = 0;
		panel.imageOne.pause = () => pauses++;
		panel._switchActiveMedia(panel.imageTwo, 3000);
		panel._switchActiveMedia(panel.imageOne, 250);
		timers[0].callback();
		assert.deepEqual(releases, []);
		assert.equal(pauses, 0);
	});
}

test("playback errors are contained when retaining media", () => {
	const { panel, errors } = harness(false);
	panel.imageOne.pause = () => {
		throw new Error("Playback unavailable");
	};
	assert.doesNotThrow(() => panel.finishMediaFadeout(panel.imageOne));
	assert.equal(errors.length, 1);
});

test("stop/disconnect cleanup still releases both buffers with the workaround enabled", () => {
	const { panel, releases } = harness(false);
	panel.releaseAllMedia();
	assert.deepEqual(releases, [panel.imageOne, panel.imageTwo]);
});

test("zero-duration fades still release the outgoing buffer", () => {
	const { panel, timers, releases } = harness();
	panel._switchActiveMedia(panel.imageTwo, 0);
	assert.equal(timers[0].delay, 0);
	timers[0].callback();
	assert.deepEqual(releases, [panel.imageOne]);
});
