const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

// Exercise the actual watcher without Home Assistant's browser-only view class.
const source = fs.readFileSync(path.join(__dirname, "../wallpanel-src.js"), "utf8");
const start = source.indexOf("\t\thandleCommandEntity() {");
const end = source.indexOf("\n\t\texecuteCommand(command) {", start);
assert.ok(start >= 0 && end > start, "Command entity watcher must be present");
const makeHandler = new Function("config", `return ({${source.slice(start, end)}}).handleCommandEntity;`);

function watcher() {
	const config = { command_entity: "input_text.wallpanel_command" };
	const commands = [];
	const panel = {
		__hass: { states: {} },
		executeCommand: (command) => commands.push(command)
	};
	const handle = makeHandler(config);
	return {
		config,
		commands,
		update(state, lastChanged = "initial") {
			panel.__hass.states = state === null ? {} : { [config.command_entity]: { state, last_changed: lastChanged } };
			handle.call(panel);
		}
	};
}

test("the initial state is remembered without executing its command", () => {
	const w = watcher();
	w.update("next|42");
	w.update("next|42");
	assert.deepEqual(w.commands, []);
});

test("a restored timestamp does not replay an unchanged command value", () => {
	const w = watcher();
	w.update("next|42", "before-restart");
	w.update("next|42", "after-restart");
	assert.deepEqual(w.commands, []);
});

for (const unavailable of ["unknown", "unavailable", null]) {
	test(`an old toggle command is not replayed after ${unavailable}`, () => {
		const w = watcher();
		w.update("");
		w.update("toggle_pause|42", "sent");
		w.update(unavailable, "disconnected");
		w.update("toggle_pause|42", "restored");
		assert.deepEqual(w.commands, ["toggle_pause"]);
	});
}

test("a first valid value after startup unavailability is only remembered", () => {
	const w = watcher();
	w.update("unavailable");
	w.update(null);
	w.update("unknown");
	w.update("next|42", "restored");
	assert.deepEqual(w.commands, []);
});

test("a new nonce executes the same command again exactly once", () => {
	const w = watcher();
	w.update("");
	w.update("next|42", "first");
	w.update("next|42", "changed-timestamp");
	w.update("next|43", "second");
	w.update("next|43", "another-timestamp");
	assert.deepEqual(w.commands, ["next", "next"]);
});

test("a new command sent while disconnected executes on recovery", () => {
	const w = watcher();
	w.update("next|42");
	w.update("unavailable");
	w.update("previous|43", "recovered");
	assert.deepEqual(w.commands, ["previous"]);
});

test("changing the configured entity establishes a new baseline", () => {
	const w = watcher();
	w.update("next|42");
	w.config.command_entity = "input_text.other_wallpanel_command";
	w.update(null);
	w.update("stop|99");
	assert.deepEqual(w.commands, []);
	w.update("start|100");
	assert.deepEqual(w.commands, ["start"]);
	w.config.command_entity = "input_text.wallpanel_command";
	w.update("next|42");
	assert.deepEqual(w.commands, ["start"]);
});

test("blank values allow commands without nonces to be sent again", () => {
	const w = watcher();
	w.update("");
	w.update("next");
	w.update("");
	w.update("next");
	assert.deepEqual(w.commands, ["next", "next"]);
});

test("command parsing retains whitespace and case normalization", () => {
	const w = watcher();
	w.update("");
	w.update("  PREVIOUS  |42");
	assert.deepEqual(w.commands, ["previous"]);
});
