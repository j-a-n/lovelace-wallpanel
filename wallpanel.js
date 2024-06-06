/**
 * (C) 2020-2024 by Jan Schneider (oss@janschneider.net)
 * Released under the GNU General Public License v3.0
 */


class ScreenWakeLock {
	constructor() {
		this.enabled = false;
		this.error = null;
		// The Screen Wake Lock API is only available when served over HTTPS
		this.nativeWakeLockSupported = "wakeLock" in navigator;
		this._lock = null;
		this._player = null;
		this._isPlaying = false;

		const handleVisibilityChange = () => {
			logger.debug("handleVisibilityChange");
			if (this.enabled && !document.hidden) {
				this.enable();
			}
		};
		document.addEventListener("visibilitychange", handleVisibilityChange);
		document.addEventListener("fullscreenchange", handleVisibilityChange);

		if (!this.nativeWakeLockSupported) {
			let videoData = 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAA1NtZGF0AAACrwYF//+r3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE2NCByMzA5NSBiYWVlNDAwIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAyMiAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTMgZGVibG9jaz0xOi0zOi0zIGFuYWx5c2U9MHgzOjB4MTEzIG1lPWhleCBzdWJtZT03IHBzeT0xIHBzeV9yZD0yLjAwOjAuNzAgbWl4ZWRfcmVmPTEgbWVfcmFuZ2U9MTYgY2hyb21hX21lPTEgdHJlbGxpcz0xIDh4OGRjdD0xIGNxbT0wIGRlYWR6b25lPTIxLDExIGZhc3RfcHNraXA9MSBjaHJvbWFfcXBfb2Zmc2V0PS00IHRocmVhZHM9MSBsb29rYWhlYWRfdGhyZWFkcz0xIHNsaWNlZF90aHJlYWRzPTAgbnI9MCBkZWNpbWF0ZT0xIGludGVybGFjZWQ9MCBibHVyYXlfY29tcGF0PTAgY29uc3RyYWluZWRfaW50cmE9MCBiZnJhbWVzPTMgYl9weXJhbWlkPTIgYl9hZGFwdD0xIGJfYmlhcz0wIGRpcmVjdD0xIHdlaWdodGI9MSBvcGVuX2dvcD0wIHdlaWdodHA9MiBrZXlpbnQ9MjUwIGtleWludF9taW49MSBzY2VuZWN1dD00MCBpbnRyYV9yZWZyZXNoPTAgcmNfbG9va2FoZWFkPTQwIHJjPWNyZiBtYnRyZWU9MSBjcmY9MjMuMCBxY29tcD0wLjYwIHFwbWluPTAgcXBtYXg9NjkgcXBzdGVwPTQgaXBfcmF0aW89MS40MCBhcT0xOjEuMjAAgAAAABFliIQAF85//vfUt8yy7VNwgQAAAAlBmiRsQXzn/vAAAAAJQZ5CeIL5z4aBAAAACQGeYXRBfOeGgAAAAAkBnmNqQXznhoEAAAAPQZpoSahBaJlMCC+c//7xAAAAC0GehkURLBfOf4aBAAAACQGepXRBfOeGgQAAAAkBnqdqQXznhoAAAAAPQZqpSahBbJlMCC+c//7wAAADs21vb3YAAABsbXZoZAAAAAAAAAAAAAAAAAAAA+gAACcQAAEAAAEAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAALddHJhawAAAFx0a2hkAAAAAwAAAAAAAAAAAAAAAQAAAAAAACcQAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAIAAAACAAAAAAAJGVkdHMAAAAcZWxzdAAAAAAAAAABAAAnEAAAgAAAAQAAAAACVW1kaWEAAAAgbWRoZAAAAAAAAAAAAAAAAAAAQAAAAoAAVcQAAAAAAC1oZGxyAAAAAAAAAAB2aWRlAAAAAAAAAAAAAAAAVmlkZW9IYW5kbGVyAAAAAgBtaW5mAAAAFHZtaGQAAAABAAAAAAAAAAAAAAAkZGluZgAAABxkcmVmAAAAAAAAAAEAAAAMdXJsIAAAAAEAAAHAc3RibAAAAMBzdHNkAAAAAAAAAAEAAACwYXZjMQAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAIAAgASAAAAEgAAAAAAAAAARVMYXZjNTkuMzcuMTAwIGxpYngyNjQAAAAAAAAAAAAAABj//wAAADZhdmNDAWQACv/hABlnZAAKrNlfllwEQAAAAwBAAAADAIPEiWWAAQAGaOvjxMhM/fj4AAAAABBwYXNwAAAAAQAAAAEAAAAUYnRydAAAAAAAAAKiAAACogAAABhzdHRzAAAAAAAAAAEAAAAKAABAAAAAABRzdHNzAAAAAAAAAAEAAAABAAAAYGN0dHMAAAAAAAAACgAAAAEAAIAAAAAAAQABQAAAAAABAACAAAAAAAEAAAAAAAAAAQAAQAAAAAABAAFAAAAAAAEAAIAAAAAAAQAAAAAAAAABAABAAAAAAAEAAIAAAAAAHHN0c2MAAAAAAAAAAQAAAAEAAAAKAAAAAQAAADxzdHN6AAAAAAAAAAAAAAAKAAACyAAAAA0AAAANAAAADQAAAA0AAAATAAAADwAAAA0AAAANAAAAEwAAABRzdGNvAAAAAAAAAAEAAAAwAAAAYnVkdGEAAABabWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAbWRpcmFwcGwAAAAAAAAAAAAAAAAtaWxzdAAAACWpdG9vAAAAHWRhdGEAAAABAAAAAExhdmY1OS4yNy4xMDA=';
			this._player = document.createElement("video");
			this._player.setAttribute("id", "ScreenWakeLockVideo");
			this._player.setAttribute("src", videoData);
			this._player.setAttribute("playsinline", "");
			this._player.setAttribute("muted", "");
			this._player.addEventListener('ended', (event) => {
				logger.debug("Video ended");
				if (this.enabled) {
					this.enable();
				}
			});
			this._player.addEventListener('playing', (event) => {
				logger.debug("Video playing");
				this._isPlaying = true;
			});
			this._player.addEventListener('pause', (event) => {
				logger.debug("Video pause");
				this._isPlaying = false;
			});
		}
	}

	enable() {
		if (this.nativeWakeLockSupported) {
			logger.debug("Requesting native screen wakelock");
			//if (this._lock) {
			//	this._lock.release();
			//}
			navigator.wakeLock
				.request("screen")
				.then((wakeLock) => {
					logger.debug("Request screen wakelock successful");
					this._lock = wakeLock;
					this.enabled = true;
					this.error = null;
				})
				.catch((e) => {
					this.enabled = false;
					this.error = e;
					logger.error(`Failed to request screen wakeLock: ${e}`);
				});
		}
		else {
			logger.debug("Starting video player");
			if (!this._player.paused && this._player._isPlaying) {
				this._player.pause();
			}
			let playPromise = this._player.play();
			if (playPromise) {
				playPromise
					.then((r) => {
						this.enabled = true;
						this.error = null;
						logger.debug("Video play successful");
					})
					.catch((e) => {
						this.enabled = false;
						this.error = e;
						logger.error(`Failed to play video: ${e}`);
					});
			}
		}
	}

	disable() {
		if (this.nativeWakeLockSupported) {
			logger.debug("Releasing native screen wakelock");
			if (this._lock) {
				this._lock.release();
			}
			this._lock = null;
		}
		else {
			logger.debug("Stopping video player");
			if (!this._player.paused && this._player._isPlaying) {
				this._player.pause();
			}
		}
		this.enabled = false;
	}
}

const version = "4.25.2";
const defaultConfig = {
	enabled: false,
	enabled_on_tabs: [],
	debug: false,
	hide_toolbar: false,
	hide_toolbar_action_icons: false,
	hide_sidebar: false,
	fullscreen: false,
	z_index: 1000,
	idle_time: 15,
	fade_in_time: 3.0,
	crossfade_time: 3.0,
	display_time: 15.0,
	keep_screen_on_time: 0,
	black_screen_after_time: 0,
	control_reactivation_time: 1.0,
	screensaver_stop_navigation_path: '',
	screensaver_entity: '',
	stop_screensaver_on_mouse_move: true,
	stop_screensaver_on_mouse_click: true,
	stop_screensaver_on_key_down: true,
	stop_screensaver_on_location_change: true,
	show_images: true,
	image_url: "https://picsum.photos/${width}/${height}?random=${timestamp}",
	image_fit: 'cover', // cover / contain / fill
	image_list_update_interval: 3600,
	image_order: 'sorted', // sorted / random
	image_excludes: [],
	image_background: 'color', // color / image
	touch_zone_size_next_image: 15,
	touch_zone_size_previous_image: 15,
	show_progress_bar: false,
	show_image_info: false,
	fetch_address_data: false,
	image_info_template: '${DateTimeOriginal}',
	info_animation_duration_x: 0,
	info_animation_duration_y: 0,
	info_animation_timing_function_x: 'ease',
	info_animation_timing_function_y: 'ease',
	info_move_pattern: 'random',
	info_move_interval: 0,
	info_move_fade_duration: 2.0,
	image_animation_ken_burns: false,
	image_animation_ken_burns_zoom: 1.3,
	image_animation_ken_burns_delay: 0,
	style: {},
	badges: [],
	cards: [
		{type: 'weather-forecast', entity: 'weather.home', show_forecast: true}
	],
	card_interaction: false,
	profile: '',
	profile_entity: '',
	profiles: {}
};

let dashboardConfig = {};
let config = {};
let activePanel = null;
let activeTab = null;
let fullscreen = false;
let screenWakeLock = new ScreenWakeLock();
let wallpanel = null;
let skipDisableScreensaverOnLocationChanged = false;
let classStyles = {
	"wallpanel-screensaver-image-background": {
		"filter": "blur(15px)",
		"background": "#00000000",
		"background-position": "center",
		"background-size": "cover"
	},
	"wallpanel-screensaver-image-info": {
		"position": "absolute",
		"bottom": "0.5em",
		"right": "0.5em",
		"padding": "0.1em 0.5em 0.1em 0.5em",
		"font-size": "2em",
		"background": "#00000055",
		"backdrop-filter": "blur(2px)",
		"border-radius": "0.1em"
	},
	"wallpanel-progress": {
		"position": "absolute",
		"bottom": "0",
		"height": "2px",
		"width": "100%",
	},
	"wallpanel-progress-inner": {
		"height": "100%",
		"background-color": "white"
	}
}
let imageInfoCache = {};
let imageInfoCacheKeys = [];
const imageInfoCacheMaxSize = 1000;
let configEntityStates = {};

const elHass = document.querySelector("body > home-assistant");
const LitElement = Object.getPrototypeOf(customElements.get("hui-masonry-view"));
const HuiView = customElements.get("hui-view");
let elHaMain = null;

let browserId = null;
if (window.browser_mod) {
	if (window.browser_mod.entity_id) {
		// V1
		browserId = window.browser_mod.entity_id;
	}
	else if (window.browser_mod.browserID) {
		// V2
		browserId = window.browser_mod.browserID.replace('-', '_');
	}
}

function isObject(item) {
	return (item && typeof item === 'object' && !Array.isArray(item));
}

function stringify(obj) {
	let processedObjects = [];
	let json = JSON.stringify(obj, function(key, value) {
		if (typeof value === "object" && value !== null) {
			if (processedObjects.indexOf(value) !== -1) {
				// Circular reference found, discard key
				return;
			}
			processedObjects.push(value);
		}
		return value;
	});
	return json;
}

const logger = {
	messages: [],
	addMessage: function(level, args) {
		if (!config.debug) {
			return;
		}
		let msg = {
			"level": level,
			"date": (new Date()).toISOString(),
			"text": "",
			"objs": [],
			"stack": ""
		}
		const err = new Error();
		if (err.stack) {
			msg.stack = err.stack.toString().replace(/^Error\r?\n/, '');
		}
		for (let i = 0; i < args.length; i++) {
			if (i == 0 && (typeof args[0] === 'string' || args[0] instanceof String)) {
				msg.text = args[i];
			}
			else {
				msg.objs.push(args[i]);
			}
		}
		logger.messages.push(msg);
		if (logger.messages.length > 1000) {
			// Max 1000 messages
			logger.messages.shift();
		}
	},
	downloadMessages: function() {
		const data = new Blob([stringify(logger.messages)], {type: 'text/plain'});
		const url = window.URL.createObjectURL(data);
		const el = document.createElement('a');
		el.href = url;
		el.target = '_blank';
		el.download = 'wallpanel_log.txt';
		el.click();
	},
	purgeMessages: function() {
		logger.messages = [];
	},
	log: function(text){
		console.log.apply(this, arguments);
		logger.addMessage("info", arguments);
	},
	debug: function (text) {
		//console.debug.apply(this, arguments);
		logger.addMessage("debug", arguments);
	},
	info: function (text) {
		console.info.apply(this, arguments);
		logger.addMessage("info", arguments);
	},
	warn: function (text) {
		console.warn.apply(this, arguments);
		logger.addMessage("warn", arguments);
	},
	error: function (text) {
		console.error.apply(this, arguments);
		logger.addMessage("error", arguments);
	}
};

function mergeConfig(target, ...sources) {
	// https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
	if (!sources.length) return target;
	const source = sources.shift();

	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				if (!target[key]) Object.assign(target, { [key]: {} });
				mergeConfig(target[key], source[key]);
			} else {
				let val = source[key];
				function replacer(match, entityId, offset, string) {
					if (!(entityId in configEntityStates)) {
						configEntityStates[entityId] = "";
						const entity = elHass.__hass.states[entityId];
						if (entity) {
							configEntityStates[entityId] = entity.state;
						}
						else {
							logger.error(`Entity used in placeholder not found: ${entityId} (${match})`)
						}
					}
					const state = configEntityStates[entityId];
					logger.debug(`Replace ${match} with ${state}`);
					return state;
				}
				if (typeof val === 'string' || val instanceof String) {
					val = val.replace(/\$\{entity:\s*([^}]+\.[^}]+)\}/g, replacer);
				}
				Object.assign(target, { [key]: val });
			}
		}
	}
	return mergeConfig(target, ...sources);
}

function updateConfig() {
	const params = new URLSearchParams(window.location.search);
	const user = elHass.__hass.user.name ? elHass.__hass.user.name.toLowerCase().replace(/\s/g, '_') : null;

	let oldConfig = config;
	config = {};
	mergeConfig(config, defaultConfig);

	if (Object.keys(dashboardConfig).length === 0) {
		dashboardConfig = getHaPanelLovelaceConfig();
	}
	mergeConfig(config, dashboardConfig);

	let paramConfig = {}
	for (let [key, value] of params) {
		if (key.startsWith("wp_")) {
			key = key.substring(3);
			if (key in defaultConfig && value) {
				// Convert to the right type
				paramConfig[key] = defaultConfig[key].constructor(JSON.parse(value));
			}
		}
	}
	config = mergeConfig(config, paramConfig);
	const profile = insertBrowserID(config.profile);

	if (config.profiles && profile && config.profiles[profile]) {
		config = mergeConfig(config, config.profiles[profile]);
		logger.debug(`Profile set from config: ${profile}`);
	}
	if (config.profiles && user && config.profiles[`user.${user}`]) {
		let profile = `user.${user}`;
		config = mergeConfig(config, config.profiles[profile]);
		logger.debug(`Profile set from user: ${profile}`);
	}
	config = mergeConfig(config, paramConfig);
	const profile_entity = insertBrowserID(config.profile_entity);
	if (config.profiles && profile_entity && elHass.__hass.states[profile_entity] && config.profiles[elHass.__hass.states[profile_entity].state]) {
		let profile = elHass.__hass.states[profile_entity].state;
		config = mergeConfig(config, config.profiles[profile]);
		logger.debug(`Profile set from entity state: ${profile}`);
	}

	if (config.card_interaction) {
		config.stop_screensaver_on_mouse_move = false;
	}

	if (config.image_url) {
		if (config.image_url.startsWith("/")) {
			config.image_url = `media-source://media_source${config.image_url}`;
		}
		if (imageSourceType() == "media-source") {
			config.image_url = config.image_url.replace(/\/+$/, '');
		}
		if (imageSourceType() == "unsplash-api" && config.image_list_update_interval < 90) {
			// Unsplash API currently places a limit of 50 requests per hour
			config.image_list_update_interval = 90;
		}
	}
	else {
		config.show_images = false;
	}

	if (!config.enabled) {
		config.debug = false;
		config.hide_toolbar = false;
		config.hide_sidebar = false;
		config.hide_toolbar_action_icons = false;
		config.fullscreen = false;
		config.show_images = false;
	}

	logger.debug(`Wallpanel config is now: ${JSON.stringify(config)}`);
	if (wallpanel) {
		if (isActive()) {
			wallpanel.reconfigure(oldConfig);
		}
		else if (wallpanel.screensaverRunning()) {
			wallpanel.stopScreensaver();
		}
	}
}


function isActive() {
	const params = new URLSearchParams(window.location.search);
	if (params.get("edit") == "1") {
		return false;
	}
	if (!config.enabled) {
		return false;
	}
	if (config.enabled_on_tabs && config.enabled_on_tabs.length > 0 && activeTab && !config.enabled_on_tabs.includes(activeTab)) {
		return false;
	}
	return true;
}


function imageSourceType() {
	if ((!config.show_images) || (!config.image_url)) {
		return "";
	}
	if (config.image_url.startsWith("media-entity://")) return "media-entity";
	if (config.image_url.startsWith("media-source://")) return "media-source";
	if (config.image_url.startsWith("https://api.unsplash")) return "unsplash-api";
	return "url";
}


function getHaPanelLovelace() {
	try {
		return elHaMain.shadowRoot.querySelector('ha-panel-lovelace')
	}
	catch (e) {
		logger.error(e);
	}
}


function getHaPanelLovelaceConfig() {
	let pl = getHaPanelLovelace();
	let conf = {};
	if (pl && pl.lovelace && pl.lovelace.config && pl.lovelace.config.wallpanel) {
		for (let key in pl.lovelace.config.wallpanel) {
			if (key in defaultConfig) {
				conf[key] = pl.lovelace.config.wallpanel[key];
			}
		}
	}
	return conf;
}


function getCurrentView() {
	try {
		return elHaMain.shadowRoot
		.querySelector('ha-panel-lovelace').shadowRoot
		.querySelector('hui-root').shadowRoot
		.querySelector('hui-view')
	}
	catch (e) {
		logger.error(e);
	}
}


function setSidebarHidden(hidden) {
	try {
		const panelLovelace = elHaMain.shadowRoot.querySelector("ha-panel-lovelace");
		if (!panelLovelace) {
			return;
		}
		const menuButton = panelLovelace.shadowRoot
			.querySelector("hui-root").shadowRoot
			.querySelector("ha-menu-button");
		if (hidden) {
			menuButton.style.display = "none";
		}
		else {
			menuButton.style.removeProperty("display");
		}
	}
	catch (e) {
		logger.warn(e);
	}

	try {
		const aside = elHaMain.shadowRoot.querySelector("ha-drawer").shadowRoot.querySelector("aside");
		aside.style.display = (hidden ? "none" : "");
		if (hidden) {
			elHaMain.style.setProperty("--mdc-drawer-width", "env(safe-area-inset-left)");
		}
		else {
			elHaMain.style.removeProperty("--mdc-drawer-width");
		}
		window.dispatchEvent(new Event('resize'));
	}
	catch (e) {
		logger.warn(e);
	}
}


function setToolbarHidden(hidden) {
	try {
		const panelLovelace = elHaMain.shadowRoot.querySelector("ha-panel-lovelace");
		if (!panelLovelace) {
			return;
		}
		let huiRoot = panelLovelace.shadowRoot.querySelector("hui-root");
		if (!huiRoot) {
			return;
		}
		huiRoot = huiRoot.shadowRoot;
		const view = huiRoot.querySelector("#view");
		let appToolbar = huiRoot.querySelector("app-toolbar");
		if (!appToolbar) {
			// Changed with 2023.04
			appToolbar = huiRoot.querySelector("div.toolbar");
		}
		if (hidden) {
			appToolbar.style.setProperty("display", "none");
			view.style.minHeight = "100vh";
			view.style.marginTop = "0";
			view.style.paddingTop = "0";
		}
		else {
			appToolbar.style.removeProperty("display");
			view.style.removeProperty("min-height");
			view.style.removeProperty("margin-top");
			view.style.removeProperty("padding-top");
			const actionItems = appToolbar.querySelector("div.action-items");
			if (config.hide_toolbar_action_icons) {
				actionItems.style.setProperty("display", "none");
			}
			else {
				actionItems.style.setProperty("display", "flex");
			}
		}
		window.dispatchEvent(new Event('resize'));
	}
	catch (e) {
		logger.warn(e);
	}
}


function navigate(path, keepSearch=true) {
	if (keepSearch && (!path.includes('?'))) {
		path += window.location.search;
	}
	history.pushState(null, "", path);
	elHass.dispatchEvent(
		new Event(
			"location-changed", {
				bubbles: true,
				cancelable: false,
				composed: true,
			}
		)
	);
}


function insertBrowserID(string) {
	if (!string) {
		logger.debug(`insertBrowserID(${string}): no string`);
		return string
	}
	if (!browserId) {
		logger.debug(`insertBrowserID(${string}): no browser_mod`);
		return string
	}
	let res = string.replace("${browser_id}", browserId);
	logger.debug(`insertBrowserID(${string}): return ${res}`);
	return res;
}


document.addEventListener('fullscreenerror', (event) => {
	logger.error('Failed to enter fullscreen');
});


document.addEventListener('fullscreenchange', (event) => {
	fullscreen = Boolean(document.fullscreenElement);
});


function enterFullscreen() {
	logger.debug("Enter fullscreen");
	// Will need user input event to work
	let el = document.documentElement;
	if (el.requestFullscreen) {
		el.requestFullscreen().then(
			result => {
				logger.debug("Successfully requested fullscreen");
			},
			error => {
				logger.error(error);
			}
		)
	}
	else if (el.mozRequestFullScreen) {
		el.mozRequestFullScreen();
	}
	else if (el.msRequestFullscreen) {
		el.msRequestFullscreen();
	}
	else if (el.webkitRequestFullscreen) {
		el.webkitRequestFullscreen();
	}
}


class WallpanelView extends HuiView {
	constructor() {
		super();

		this.imageList = [];
		this.imageIndex = -1;
		this.imageListDirection = "forwards"; // forwards, backwards
		this.lastImageListUpdate;
		this.updatingImageList = false;
		this.cancelUpdatingImageList = false;
		this.lastImageUpdate = 0;
		this.messageBoxTimeout = null;
		this.blockEventsUntil = 0;
		this.screensaverStartedAt;
		this.screensaverStoppedAt = new Date();
		this.infoBoxContentCreatedDate;
		this.idleSince = Date.now();
		this.lastProfileSet = insertBrowserID(config.profile);
		this.lastMove = null;
		this.lastCorner = 0; // 0 - top left, 1 - bottom left, 2 - bottom right, 3 - top right
		this.translateInterval = null;
		this.lastClickTime = 0;
		this.clickCount = 0;
		this.energyCollectionUpdateEnabled = false;
		this.energyCollectionUpdateInterval = 60;
		this.lastEnergyCollectionUpdate = 0;
		this.screensaverStopNavigationPathTimeout = null;

		this.__hass = elHass.__hass;
		this.__cards = [];
		this.__badges = [];

		elHass.provideHass(this);
		setInterval(this.timer.bind(this), 1000);
	}

	// Whenever the state changes, a new `hass` object is set.
	set hass(hass) {
		logger.debug("Update hass");
		this.__hass = hass;

		let changed = false;
		for (const entityId in configEntityStates) {
			const entity = this.__hass.states[entityId];
			if (entity && entity.state != configEntityStates[entityId]) {
				configEntityStates[entityId] = entity.state;
				changed = true;
			}
		}
		let profileUpdated = this.updateProfile();
		if (!profileUpdated && changed) {
			updateConfig();
		}

		if (!isActive()) {
			return;
		}

		const screensaver_entity = insertBrowserID(config.screensaver_entity);

		if (screensaver_entity && this.__hass.states[screensaver_entity]) {
			let lastChanged = new Date(this.__hass.states[screensaver_entity].last_changed);
			let state = this.__hass.states[screensaver_entity].state;

			if (state == "off" && this.screensaverStartedAt && lastChanged.getTime() - this.screensaverStartedAt > 0) {
				this.stopScreensaver();
			}
			else if (state == "on" && this.screensaverStoppedAt && lastChanged.getTime() - this.screensaverStoppedAt > 0) {
				this.startScreensaver();
			}
		}

		if (this.screensaverRunning()) {
			this.__cards.forEach(card => {
				card.hass = this.hass;
			});
			this.__badges.forEach(badge => {
				badge.hass = this.hass;
			});
		}
	}

	get hass() {
		return this.__hass;
	}

	setScreensaverEntityState() {
		const screensaver_entity = insertBrowserID(config.screensaver_entity);
		if (!screensaver_entity || !this.__hass.states[screensaver_entity]) return;
		if (this.screensaverRunning() && this.__hass.states[screensaver_entity].state == 'on') return;
		if (!this.screensaverRunning() && this.__hass.states[screensaver_entity].state == 'off') return;

		this.__hass.callService('input_boolean', this.screensaverRunning() ? "turn_on" : "turn_off", {
			entity_id: screensaver_entity
		}).then(
			result => {
				logger.debug(result);
			},
			error => {
				logger.error("Failed to set screensaver entity state:", error);
			}
		);
	}

	updateProfile() {
		const profile_entity = insertBrowserID(config.profile_entity);
		if (profile_entity && this.__hass.states[profile_entity]) {
			const profile = this.__hass.states[profile_entity].state;
			if ((profile && profile != this.lastProfileSet) || (!profile && this.lastProfileSet)) {
				logger.debug(`Set profile to ${profile}`);
				this.lastProfileSet = profile;
				updateConfig();
				return true;
			}
		}
		return false;
	}

	timer() {
		if (!config.enabled || !activePanel) {
			return;
		}
		if (this.screensaverRunning()) {
			this.updateScreensaver();
		}
		else {
			if (config.idle_time > 0 && Date.now() - this.idleSince >= config.idle_time*1000) {
				this.startScreensaver();
			}
		}
	}

	setDefaultStyle() {
		this.messageBox.removeAttribute('style');
		this.messageBox.style.position = 'fixed';
		this.messageBox.style.pointerEvents = "none";
		this.messageBox.style.top = 0;
		this.messageBox.style.left = 0;
		this.messageBox.style.width = '100%';
		this.messageBox.style.height = '10%';
		this.messageBox.style.zIndex = this.style.zIndex + 1;
		if (!this.screensaverRunning()) {
			this.messageBox.style.visibility = 'hidden';
		}
		//this.messageBox.style.margin = '5vh auto auto auto';
		this.messageBox.style.padding = '5vh 0 0 0';
		this.messageBox.style.fontSize = '5vh';
		this.messageBox.style.textAlign = 'center';
		this.messageBox.style.transition = 'visibility 200ms ease-in-out';

		this.debugBox.removeAttribute('style');
		this.debugBox.style.position = 'fixed';
		this.debugBox.style.pointerEvents = "none";
		this.debugBox.style.top = '0%';
		this.debugBox.style.left = '0%';
		this.debugBox.style.width = '100%';
		this.debugBox.style.height = '100%';
		this.debugBox.style.background = '#00000099';
		this.debugBox.style.color = '#ffffff';
		this.debugBox.style.zIndex = this.style.zIndex + 2;
		if (!this.screensaverRunning()) {
			this.debugBox.style.visibility = 'hidden';
		}
		this.debugBox.style.fontFamily = 'monospace';
		this.debugBox.style.fontSize = '12px';
		this.debugBox.style.overflowWrap = 'break-word';
		this.debugBox.style.overflowY = 'auto';

		this.screensaverContainer.removeAttribute('style');
		this.screensaverContainer.style.position = 'fixed';
		this.screensaverContainer.style.top = 0;
		this.screensaverContainer.style.left = 0;
		this.screensaverContainer.style.width = '100vw';
		this.screensaverContainer.style.height = '100vh';
		this.screensaverContainer.style.background = '#000000';

		if (!this.screensaverRunning()) {
			this.imageOneContainer.removeAttribute('style');
			this.imageOneContainer.style.opacity = 1;
		}
		this.imageOneContainer.style.position = 'absolute';
		this.imageOneContainer.style.pointerEvents = 'none';
		this.imageOneContainer.style.top = 0;
		this.imageOneContainer.style.left = 0;
		this.imageOneContainer.style.width = '100%';
		this.imageOneContainer.style.height = '100%';

		this.imageOneBackground.style.position = 'absolute';
		this.imageOneBackground.style.pointerEvents = 'none';
		this.imageOneBackground.style.top = 0;
		this.imageOneBackground.style.left = 0;
		this.imageOneBackground.style.width = '100%';
		this.imageOneBackground.style.height = '100%';

		if (!this.screensaverRunning()) {
			this.imageOne.removeAttribute('style');
		}
		this.imageOne.style.position = 'relative';
		this.imageOne.style.pointerEvents = 'none';
		this.imageOne.style.width = '100%';
		this.imageOne.style.height = '100%';
		this.imageOne.style.objectFit = 'contain';

		this.imageOneInfoContainer.removeAttribute('style');
		this.imageOneInfoContainer.style.position = 'absolute';
		this.imageOneInfoContainer.style.pointerEvents = 'none';
		this.imageOneInfoContainer.style.top = 0;
		this.imageOneInfoContainer.style.left = 0;
		this.imageOneInfoContainer.style.width = '100%';
		this.imageOneInfoContainer.style.height = '100%';

		if (!this.screensaverRunning()) {
			this.imageTwoContainer.removeAttribute('style');
			this.imageTwoContainer.style.opacity = 0;
		}
		this.imageTwoContainer.style.position = 'absolute';
		this.imageTwoContainer.style.pointerEvents = 'none';
		this.imageTwoContainer.style.top = 0;
		this.imageTwoContainer.style.left = 0;
		this.imageTwoContainer.style.width = '100%';
		this.imageTwoContainer.style.height = '100%';

		this.imageTwoBackground.style.position = 'absolute';
		this.imageTwoBackground.style.pointerEvents = 'none';
		this.imageTwoBackground.style.top = 0;
		this.imageTwoBackground.style.left = 0;
		this.imageTwoBackground.style.width = '100%';
		this.imageTwoBackground.style.height = '100%';

		if (!this.screensaverRunning()) {
			this.imageTwo.removeAttribute('style');
		}
		this.imageTwo.style.position = 'relative';
		this.imageTwo.style.pointerEvents = 'none';
		this.imageTwo.style.width = '100%';
		this.imageTwo.style.height = '100%';
		this.imageTwo.style.objectFit = 'contain';

		this.imageTwoInfoContainer.removeAttribute('style');
		this.imageTwoInfoContainer.style.position = 'absolute';
		this.imageTwoInfoContainer.style.pointerEvents = 'none';
		this.imageTwoInfoContainer.style.top = 0;
		this.imageTwoInfoContainer.style.left = 0;
		this.imageTwoInfoContainer.style.width = '100%';
		this.imageTwoInfoContainer.style.height = '100%';

		this.screensaverImageOverlay.removeAttribute('style');
		this.screensaverImageOverlay.style.position = 'absolute';
		if (config.card_interaction) {
			this.screensaverImageOverlay.style.pointerEvents = 'none';
		}
		this.screensaverImageOverlay.style.top = 0;
		this.screensaverImageOverlay.style.left = 0;
		this.screensaverImageOverlay.style.width = '100%';
		this.screensaverImageOverlay.style.height = '100%';
		this.screensaverImageOverlay.style.background = '#00000000';

		this.infoContainer.removeAttribute('style');
		this.infoContainer.style.position = 'absolute';
		this.infoContainer.style.pointerEvents = 'none';
		this.infoContainer.style.top = 0;
		this.infoContainer.style.left = 0;
		this.infoContainer.style.width = '100%';
		this.infoContainer.style.height = '100%';
		this.infoContainer.style.transition = 'opacity 2000ms ease-in-out';
		this.infoContainer.style.padding = '25px';

		this.fixedInfoContainer.removeAttribute('style');
		this.fixedInfoContainer.style.position = 'fixed';
		this.fixedInfoContainer.style.pointerEvents = 'none';
		this.fixedInfoContainer.style.top = 0;
		this.fixedInfoContainer.style.left = 0;
		this.fixedInfoContainer.style.width = '100%';
		this.fixedInfoContainer.style.height = '100%';

		this.infoBox.removeAttribute('style');
		this.infoBox.style.pointerEvents = 'none';
		this.infoBox.style.width = 'fit-content';
		this.infoBox.style.height = 'fit-content';
		this.infoBox.style.borderRadius = '10px';
		this.infoBox.style.setProperty('--wp-card-width', '500px');
		this.infoBox.style.setProperty('--wp-card-padding', '0');
		this.infoBox.style.setProperty('--wp-card-margin', '5px');
		this.infoBox.style.setProperty('--wp-card-backdrop-filter', 'none');

		this.fixedInfoBox.style.cssText = this.infoBox.style.cssText;
		this.fixedInfoBox.style.pointerEvents = 'none';

		this.screensaverOverlay.removeAttribute('style');
		this.screensaverOverlay.style.position = 'absolute';
		if (config.card_interaction) {
			this.screensaverOverlay.style.pointerEvents = 'none';
		}
		this.screensaverOverlay.style.top = 0;
		this.screensaverOverlay.style.left = 0;
		this.screensaverOverlay.style.width = '100%';
		this.screensaverOverlay.style.height = '100%';
		this.screensaverOverlay.style.background = '#00000000';
	}

	updateStyle() {
		this.screensaverOverlay.style.background = '#00000000';
		this.debugBox.style.visibility = config.debug ? 'visible' : 'hidden';
		//this.screensaverContainer.style.transition = `opacity ${Math.round(config.fade_in_time*1000)}ms ease-in-out`;
		this.style.transition = `opacity ${Math.round(config.fade_in_time*1000)}ms ease-in-out`;
		this.imageOneContainer.style.transition = `opacity ${Math.round(config.crossfade_time*1000)}ms ease-in-out`;
		this.imageTwoContainer.style.transition = `opacity ${Math.round(config.crossfade_time*1000)}ms ease-in-out`;
		this.imageOne.style.objectFit = config.image_fit;
		this.imageTwo.style.objectFit = config.image_fit;

		if (config.info_animation_duration_x) {
			this.infoBoxPosX.style.animation = `moveX ${config.info_animation_duration_x}s ${config.info_animation_timing_function_x} infinite alternate`;
		}
		else {
			this.infoBoxPosX.style.animation = '';
		}

		if (config.info_animation_duration_y) {
			this.infoBoxPosY.style.animation = `moveY ${config.info_animation_duration_y}s ${config.info_animation_timing_function_y} infinite alternate`;
		}
		else {
			this.infoBoxPosY.style.animation = '';
		}

		if (config.style) {
			for (const elId in config.style) {
				if (elId.startsWith('wallpanel-') && elId != 'wallpanel-shadow-host' && !classStyles[elId]) {
					let el = this.shadowRoot.getElementById(elId);
					if (el) {
						logger.debug(`Setting style attributes for element #${elId}`);
						for (const attr in config.style[elId]) {
							logger.debug(`Setting style attribute ${attr} to ${config.style[elId][attr]}`);
							el.style.setProperty(attr, config.style[elId][attr]);
						}
						if (el == this.infoBox) {
							this.fixedInfoBox.style.cssText = this.infoBox.style.cssText;
						}
						else if (el == this.infoBoxContent) {
							this.fixedInfoBoxContent.style.cssText = this.infoBoxContent.style.cssText;
						}
					}
					else {
						logger.error(`Element #${elId} not found`);
					}
				}
			}
		}
	}

	updateShadowStyle() {
		let computed = getComputedStyle(this.infoContainer);
		let maxX = this.infoContainer.offsetWidth - parseInt(computed.paddingLeft) * 2 - parseInt(computed.paddingRight) * 2 - this.infoBox.offsetWidth;
		let maxY = this.infoContainer.offsetHeight - parseInt(computed.paddingTop) * 2 - parseInt(computed.paddingBottom) * 2 - this.infoBox.offsetHeight;
		let host = '';

		if (config.style) {
			if (config.style['wallpanel-shadow-host']) {
				for (const attr in config.style['wallpanel-shadow-host']) {
					host += `${attr}: ${config.style['wallpanel-shadow-host'][attr]};\n`;
				}
			}
			for (const className in classStyles) {
				if (config.style[className]) {
					mergeConfig(classStyles[className], config.style[className]);
				}
			}
		}

		let classCss = "";
		for (const className in classStyles) {
			classCss += `.${className} {\n`;
			for (const attr in classStyles[className]) {
				classCss += `${attr}: ${classStyles[className][attr]};\n`;
			}
			classCss += `}\n`;
		}

		this.shadowStyle.innerHTML = `
			:host {
				${host}
			}
			@keyframes moveX {
				100% {
					transform: translate3d(${maxX}px, 0, 0);
				}
			}
			@keyframes moveY {
				100% {
					transform: translate3d(0, ${maxY}px, 0);
				}
			}
			@keyframes horizontalProgress {
				0% {
					width: 0%;
				}
				100% {
					width: 100%;
				}
			}
			@keyframes kenBurnsEffect {
				0% {
					transform-origin: bottom left;
					transform: scale(1.0);
				}
				100% {
					transform: scale(${config.image_animation_ken_burns_zoom});
				}
			}
			${classCss}
		`
	}

	randomMove() {
		let computed = getComputedStyle(this.infoContainer);
		let maxX = this.infoContainer.offsetWidth - parseInt(computed.paddingLeft) * 2 - parseInt(computed.paddingRight) * 2 - this.infoBox.offsetWidth;
		let maxY = this.infoContainer.offsetHeight - parseInt(computed.paddingTop) * 2 - parseInt(computed.paddingBottom) * 2 - this.infoBox.offsetHeight;
		let x = Math.floor(Math.random() * maxX);
		let y = Math.floor(Math.random() * maxY);
		this.moveInfoBox(x, y);
	}

	moveAroundCorners() {
		this.lastCorner = (this.lastCorner + 1) % 4;
		let computed = getComputedStyle(this.infoContainer);
		let x = [2, 3].includes(this.lastCorner) ? this.infoContainer.offsetWidth - parseInt(computed.paddingLeft) * 2 - parseInt(computed.paddingRight) * 2 - this.infoBox.offsetWidth : 0;
		let y = [1, 2].includes(this.lastCorner) ? this.infoContainer.offsetHeight - parseInt(computed.paddingTop) * 2 - parseInt(computed.paddingBottom) * 2 - this.infoBox.offsetHeight : 0;
		this.moveInfoBox(x, y);
	}

	moveInfoBox(x, y) {
		this.lastMove = Date.now();
		if (config.info_move_fade_duration > 0) {
			if (this.infoBox.animate) {
				let keyframes = [
					{ opacity: 1 },
					{ opacity: 0, offset: 0.5 },
					{ opacity: 1 }
				];
				this.infoBox.animate(
					keyframes, {
						duration: Math.round(config.info_move_fade_duration * 1000),
						iterations: 1
					}
				);
			}
			else {
				logger.warn("This browser does not support the animate() method, please set info_move_fade_duration to 0");
			}
		}
		let wp = this;
		let ms = Math.round(config.info_move_fade_duration * 500);
		if (ms < 0) {
			ms = 0;
		}
		if (wp.translateInterval) {
			clearInterval(wp.translateInterval);
		}
		wp.translateInterval = setInterval(function() {
			wp.infoBoxPosX.style.transform = `translate3d(${x}px, 0, 0)`;
			wp.infoBoxPosY.style.transform = `translate3d(0, ${y}px, 0)`;
		}, ms);
	}

	createInfoBoxContent() {
		logger.debug("Creating info box content");
		this.infoBoxContentCreatedDate = new Date();
		this.infoBoxContent.innerHTML = '';
		this.__badges = [];
		this.__cards = [];
		this.energyCollectionUpdateEnabled = false;

		this.shadowRoot.querySelectorAll(".wp-card").forEach(card => {
			card.parentElement.removeChild(card);
		})

		if (config.badges) {
			const div = document.createElement('div');
			div.style.padding = 'var(--wp-card-padding)';
			div.style.margin = 'var(--wp-card-margin)';
			div.style.textAlign = 'center';
			config.badges.forEach(badgeConfig => {
				logger.debug("Creating badge:", badgeConfig);
				const badgeElement = this.createBadgeElement(badgeConfig);
				badgeElement.hass = this.hass;
				this.__badges.push(badgeElement);
				div.append(badgeElement);
			});
			this.infoBoxContent.appendChild(div);
		}
		if (config.cards) {
			config.cards.forEach(card => {
				// Copy object
				let cardConfig = JSON.parse(JSON.stringify(card));
				logger.debug("Creating card:", cardConfig);
				let style = {};
				if (cardConfig.wp_style) {
					style = cardConfig.wp_style;
					delete cardConfig.wp_style;
				}
				if (cardConfig.type && cardConfig.type.includes("energy")) {
					cardConfig.collection_key = "energy_wallpanel";
					this.energyCollectionUpdateEnabled = true;
				}
				const createCardElement = this._createCardElement ? this._createCardElement : this.createCardElement;
				const cardElement = createCardElement.bind(this)(cardConfig);
				cardElement.hass = this.hass;

				this.__cards.push(cardElement);

				let parent = this.infoBoxContent;
				const div = document.createElement('div');
				div.classList.add("wp-card");
				div.style.width = 'var(--wp-card-width)';
				div.style.padding = 'var(--wp-card-padding)';
				div.style.margin = 'var(--wp-card-margin)';
				div.style.backdropFilter = 'var(--wp-card-backdrop-filter)';
				for (const attr in style) {
					if (attr == "parent") {
						let pel = this.shadowRoot.getElementById(style[attr]);
						if (pel) {
							parent = pel;
						}
					}
					else {
						div.style.setProperty(attr, style[attr]);
					}
				}
				if (config.card_interaction) {
					div.style.pointerEvents = "initial";
				}
				div.append(cardElement);
				parent.appendChild(div);
			});
		}

		setTimeout(this.updateShadowStyle.bind(this), 500);
	}

	restartProgressBarAnimation() {
		if (!this.progressBarContainer) {
			return;
		}
		this.progressBar.style.animation = 'none';
		if (!config.show_progress_bar) {
			return;
		}
		const wp = this;
		setTimeout(function() {
			// Restart CSS animation.
			wp.progressBar.style.animation = `horizontalProgress ${config.display_time}s linear`
		}, 25);
	}

	restartKenBurnsEffect() {
		if (!config.image_animation_ken_burns) {
			return;
		}
		const activeImage = this.getActiveImageElement();
		activeImage.style.animation = "none";
		let delay = Math.floor(config.image_animation_ken_burns_delay * 1000);
		if (delay < 50) {
			delay = 50;
		}
		setTimeout(function() {
			activeImage.style.animation = `kenBurnsEffect ${config.display_time + Math.ceil(config.crossfade_time * 2) + 1}s ease`;
		}, delay);
	}

	getActiveImageElement() {
		if (this.imageOneContainer.style.opacity == 1) {
			return this.imageOne;
		}
		return this.imageTwo;
	}

	getInactiveImageElement() {
		if (this.imageOneContainer.style.opacity == 1) {
			return this.imageTwo;
		}
		return this.imageOne;
	}

	connectedCallback() {
		this.style.zIndex = config.z_index;
		this.style.visibility = 'hidden';
		this.style.opacity = 0;
		this.style.position = 'fixed';

		this.messageBox = document.createElement('div');
		this.messageBox.id = 'wallpanel-message-box';

		this.debugBox = document.createElement('div');
		this.debugBox.id = 'wallpanel-debug-box';

		this.screensaverContainer = document.createElement('div');
		this.screensaverContainer.id = 'wallpanel-screensaver-container';

		this.imageOneContainer = document.createElement('div');
		this.imageOneContainer.id = 'wallpanel-screensaver-image-one-container';

		this.imageOneBackground = document.createElement('div');
		this.imageOneBackground.className = 'wallpanel-screensaver-image-background';
		this.imageOneBackground.id = 'wallpanel-screensaver-image-one-background';

		this.imageOne = document.createElement('img');
		this.imageOne.id = 'wallpanel-screensaver-image-one';
		this.imageOne.setAttribute('data-loading', false);

		this.imageOneInfoContainer = document.createElement('div');
		this.imageOneInfoContainer.id = 'wallpanel-screensaver-image-one-info-container';

		this.imageOneInfo = document.createElement('div');
		this.imageOneInfo.className = 'wallpanel-screensaver-image-info';
		this.imageOneInfo.id = 'wallpanel-screensaver-image-one-info';

		this.imageOneInfoContainer.appendChild(this.imageOneInfo);
		this.imageOneContainer.appendChild(this.imageOneBackground);
		this.imageOneContainer.appendChild(this.imageOne);
		this.imageOneContainer.appendChild(this.imageOneInfoContainer);
		this.screensaverContainer.appendChild(this.imageOneContainer);

		this.imageTwoContainer = document.createElement('div');
		this.imageTwoContainer.id = 'wallpanel-screensaver-image-two-container';

		this.imageTwoBackground = document.createElement('div');
		this.imageTwoBackground.className = 'wallpanel-screensaver-image-background';
		this.imageTwoBackground.id = 'wallpanel-screensaver-image-two-background';

		this.imageTwo = document.createElement('img');
		this.imageTwo.id = 'wallpanel-screensaver-image-two';
		this.imageTwo.setAttribute('data-loading', false);

		this.imageTwoInfoContainer = document.createElement('div');
		this.imageTwoInfoContainer.id = 'wallpanel-screensaver-image-two-info-container';

		this.imageTwoInfo = document.createElement('div');
		this.imageTwoInfo.className = 'wallpanel-screensaver-image-info';
		this.imageTwoInfo.id = 'wallpanel-screensaver-image-two-info';

		this.imageTwoInfoContainer.appendChild(this.imageTwoInfo);
		this.imageTwoContainer.appendChild(this.imageTwoBackground);
		this.imageTwoContainer.appendChild(this.imageTwo);
		this.imageTwoContainer.appendChild(this.imageTwoInfoContainer);
		this.screensaverContainer.appendChild(this.imageTwoContainer);

		this.screensaverImageOverlay = document.createElement('div');
		this.screensaverImageOverlay.id = 'wallpanel-screensaver-image-overlay';
		this.screensaverContainer.appendChild(this.screensaverImageOverlay);

		this.progressBarContainer = document.createElement('div');
		this.progressBarContainer.className = 'wallpanel-progress';
		this.progressBar = document.createElement('div');
		this.progressBar.className = 'wallpanel-progress-inner';
		this.progressBar.id = 'wallpanel-progress-inner';
		this.progressBarContainer.appendChild(this.progressBar);

		if (config.show_progress_bar) {
			this.screensaverContainer.appendChild(this.progressBarContainer);
		}

		this.infoContainer = document.createElement('div');
		this.infoContainer.id = 'wallpanel-screensaver-info-container';

		this.fixedInfoContainer = document.createElement('div');
		this.fixedInfoContainer.id = 'wallpanel-screensaver-fixed-info-container';

		this.fixedInfoBox = document.createElement('div');
		this.fixedInfoBox.id = 'wallpanel-screensaver-fixed-info-box';

		this.fixedInfoBoxContent = document.createElement('div');
		this.fixedInfoBoxContent.id = 'wallpanel-screensaver-fixed-info-box-content';

		this.screensaverContainer.appendChild(this.infoContainer);

		this.infoBoxPosX = document.createElement('div');
		this.infoBoxPosX.id = 'wallpanel-screensaver-info-box-pos-x';
		this.infoBoxPosX.x = '0';

		this.infoBoxPosY = document.createElement('div');
		this.infoBoxPosY.id = 'wallpanel-screensaver-info-box-pos-y';
		this.infoBoxPosX.y = '0';

		this.infoBox = document.createElement('div');
		this.infoBox.id = 'wallpanel-screensaver-info-box';

		this.infoBoxContent = document.createElement('div');
		this.infoBoxContent.id = 'wallpanel-screensaver-info-box-content';
		this.infoBoxContent.style.display = 'grid';

		this.infoBox.appendChild(this.infoBoxContent);
		this.infoBoxPosX.appendChild(this.infoBox);
		this.infoBoxPosY.appendChild(this.infoBoxPosX);
		this.infoContainer.appendChild(this.infoBoxPosY);

		this.fixedInfoBox.appendChild(this.fixedInfoBoxContent);
		this.fixedInfoContainer.appendChild(this.fixedInfoBox);
		this.infoContainer.appendChild(this.fixedInfoContainer);

		this.screensaverOverlay = document.createElement('div');
		this.screensaverOverlay.id = 'wallpanel-screensaver-overlay';
		this.screensaverContainer.appendChild(this.screensaverOverlay);

		this.shadowStyle = document.createElement('style');

		let shadow = this.attachShadow({mode: 'open'});
		shadow.appendChild(this.shadowStyle);
		shadow.appendChild(this.screensaverContainer);
		shadow.appendChild(this.messageBox);
		shadow.appendChild(this.debugBox);

		const wp = this;
		let eventNames = ['click', 'touchstart', 'wheel'];
		if (config.stop_screensaver_on_key_down) {
			eventNames.push('keydown');
		}
		if (config.stop_screensaver_on_mouse_move) {
			eventNames.push('mousemove');
		}
		eventNames.forEach(function(eventName) {
			let click = ['click', 'touchstart'].includes(eventName);
			window.addEventListener(eventName, event => {
				wp.handleInteractionEvent(event, click);
			}, { capture: true, passive: !click });
		});
		window.addEventListener("resize", event => {
			if (wp.screensaverRunning()) {
				wp.updateShadowStyle();
			}
		});
		window.addEventListener("hass-more-info", event => {
			if (wp.screensaverRunning()) {
				wp.moreInfoDialogToForeground();
			}
		});

		[this.imageOne, this.imageTwo].forEach(function(img) {
			img.addEventListener('load', function() {
				img.setAttribute('data-loading', false);
				if (config.image_background == "image") {
					let cont = wp.imageOneBackground;
					if (img == wp.imageTwo) {
						cont = wp.imageTwoBackground;
					}
					cont.style.backgroundImage = "url(" + img.src + ")";
				}
				if (config.show_image_info && /.*\.jpe?g$/i.test(img.imageUrl)) {
					wp.fetchEXIFInfo(img);
				}
			});
			img.addEventListener('error', function() {
				img.setAttribute('data-loading', false);
				logger.error(`Failed to load image: ${img.src}`);
				if (img.imageUrl) {
					const idx = wp.imageList.indexOf(img.imageUrl);
					if (idx > -1) {
						logger.debug(`Removing image from list: ${img.imageUrl}`);
						wp.imageList.splice(idx, 1);
					}
					wp.updateImage(img);
				}
				else {
					wp.displayMessage(`Failed to load image: ${img.src}`, 5000)
				}
			})
		});

		this.reconfigure();
	}

	reconfigure(oldConfig) {
		this.setDefaultStyle();
		this.updateStyle();
		if (this.screensaverRunning()) {
			this.createInfoBoxContent();
		}

		if (!config.info_move_interval && oldConfig && oldConfig.info_move_interval) {
			wallpanel.moveInfoBox(0, 0);
		}

		if (config.show_images && (!oldConfig || !oldConfig.show_images || oldConfig.image_url != config.image_url)) {
			let switchImages = false;
			if (oldConfig) {
				switchImages = true;
			}

			function preloadCallback(wp) {
				if (switchImages) {
					wp.switchActiveImage();
				}
			}

			if (imageSourceType() == "unsplash-api" || imageSourceType() == "media-source") {
				this.updateImageList(true, preloadCallback);
			}
			else {
				this.imageList = [];
				this.preloadImages(preloadCallback);
			}
		}
	}

	getMoreInfoDialog() {
		const moreInfoDialog = elHass.shadowRoot.querySelector("ha-more-info-dialog");
		if (!moreInfoDialog) {
			return;
		}
		const dialog = moreInfoDialog.shadowRoot.querySelector("ha-dialog");
		if (dialog) {
			return dialog;
		}
	}

	moreInfoDialogToForeground() {
		const wp = this;
		function showDialog(attempt = 1) {
			const dialog = wp.getMoreInfoDialog();
			if (dialog) {
				dialog.style.position = "absolute";
				dialog.style.zIndex = wp.style.zIndex + 1;
				return;
			}
			if (attempt < 10) {
				setTimeout(showDialog, 50, attempt + 1);
			}
		}
		showDialog();
	}

	fetchEXIFInfo(img) {
		let wp = this;
		if (imageInfoCache[img.imageUrl]) {
			return;
		}
		if (imageInfoCacheKeys.length >= imageInfoCacheMaxSize) {
			let oldest = imageInfoCacheKeys.shift();
			if (imageInfoCache[oldest]) {
				delete imageInfoCache[oldest];
			}
		}

		const tmpImg = document.createElement("img");
		tmpImg.src = img.src;
		tmpImg.imageUrl = img.imageUrl;
		getImageData(tmpImg, function() {
			logger.debug("EXIF data:", tmpImg.exifdata);
			imageInfoCacheKeys.push(tmpImg.imageUrl);
			imageInfoCache[tmpImg.imageUrl] = tmpImg.exifdata;
			wp.setImageDataInfo(tmpImg);

			let exifLong = tmpImg.exifdata["GPSLongitude"];
			let exifLat = tmpImg.exifdata["GPSLatitude"];
			if (config.fetch_address_data && exifLong && !isNaN(exifLong[0]) && exifLat && !isNaN(exifLat[0])) {
				let m = (tmpImg.exifdata["GPSLatitudeRef"] == "S") ? -1 : 1;
				let latitude = (exifLat[0] * m) + (((exifLat[1] * m  * 60) + (exifLat[2] * m)) / 3600);
				m = (tmpImg.exifdata["GPSLongitudeRef"] == "W") ? -1 : 1;
				let longitude = (exifLong[0] * m) + (((exifLong[1] * m * 60) + (exifLong[2] * m)) / 3600);

				const xhr = new XMLHttpRequest();
				xhr.onload = function(event) {
					if (this.status == 200 || this.status === 0) {
						let info = JSON.parse(xhr.responseText);
						logger.debug("nominatim data:", info);
						if (info && info.address) {
							imageInfoCache[tmpImg.imageUrl].address = info.address;
							wp.setImageDataInfo(tmpImg);
						}
					}
					else {
						logger.error("nominatim error:", this.status, xhr.status, xhr.responseText);
						delete imageInfoCache[tmpImg.imageUrl];
					}
				}
				xhr.onerror = function(event) {
					logger.error("nominatim error:", event);
					delete imageInfoCache[tmpImg.imageUrl];
				}
				xhr.ontimeout = function(event) {
					logger.error("nominatim timeout:", event);
					delete imageInfoCache[tmpImg.imageUrl];
				}
				xhr.open("GET", `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
				//xhr.setRequestHeader("User-Agent", `lovelace-wallpanel/${version}`);
				xhr.timeout = 15000;
				xhr.send();
			}
		});
	}

	setImageDataInfo(img) {
		let infoElement = null;
		if (this.imageOne.imageUrl == img.imageUrl) {
			infoElement = this.imageOneInfo;
		}
		else if (this.imageTwo.imageUrl == img.imageUrl) {
			infoElement = this.imageTwoInfo;
		}
		if (!infoElement) {
			return;
		}

		if (!config.show_image_info) {
			infoElement.innerHTML = "";
			infoElement.style.display = "none";
			return;
		}

		infoElement.style.display = "block";

		let imageInfo = imageInfoCache[img.imageUrl];
		if (!imageInfo) {
			imageInfo = {};
		}
		let html = config.image_info_template;
		html = html.replace(/\${([^}]+)}/g, (match, tags, offset, string) => {
			imageInfo.image = {
				url: img.imageUrl,
				path: img.imageUrl.replace(/^[^:]+:\/\/[^/]+/, ""),
				relativePath: img.imageUrl.replace(config.image_url, "").replace(/^\/+/, ""),
				filename: img.imageUrl.replace(/^.*[\\/]/, ""),
				folderName: ""
			};
			const parts = img.imageUrl.split("/");
			if (parts.length >= 2) {
				imageInfo.image.folderName = parts[parts.length - 2];
			}
			let prefix = "";
			let suffix = "";
			let options = null;
			if (tags.includes("!")) {
				let tmp = tags.split("!");
				tags = tmp[0];
				for (let i=1; i<tmp.length; i++) {
					let tmp2 = tmp[i].split("=", 2);
					if (tmp2[0] == "prefix") {
						prefix = tmp2[1];
					}
					else if (tmp2[0] == "suffix") {
						suffix = tmp2[1];
					}
					else if (tmp2[0] == "options") {
						options = {};
						tmp2[1].split(",").forEach(optVal => {
							let tmp3 = optVal.split(":", 2);
							if (tmp3[0] && tmp3[1]) {
								options[tmp3[0].replace(/\s/g, '')] = tmp3[1].replace(/\s/g, '');
							}
						});
					}
				}
			}

			let val = "";
			let tagList = tags.split("|");
			let tag = "";
			for (let i=0; i<tagList.length; i++) {
				tag = tagList[i];
				let keys = tag.replace(/\s/g, '').split(".");
				val = imageInfo;
				keys.forEach(key => {
					if (val) {
						val = val[key];
					}
				});
				if (val) {
					break
				}
			};
			if (!val) {
				return "";
			}
			if (/DateTime/.test(tag)) {
				let date = new Date(val.replace(/(\d\d\d\d):(\d\d):(\d\d) (\d\d):(\d\d):(\d\d)/, '$1-$2-$3T$4:$5:$6'));
				if (!options) {
					options = {year: "numeric", month: "2-digit", day: "2-digit"};
				}
				val = date.toLocaleDateString(elHass.__hass.locale.language, options);
			}
			if (typeof val === 'object') {
				val = JSON.stringify(val);
			}
			return prefix + val + suffix;
		});
		infoElement.innerHTML = html;
	}

	updateImageList(preload = false, preloadCallback = null) {
		if (!config.image_url) return;

		let updateFunction = null;
		if (imageSourceType() == "unsplash-api") {
			updateFunction = this.updateImageListFromUnsplashAPI;
		}
		else if (imageSourceType() == "media-source") {
			updateFunction = this.updateImageListFromMediaSource;
		}
		else {
			return;
		}

		const wp = this;
		if (this.updatingImageList) {
			this.cancelUpdatingImageList = true;
			const start = Date.now();
			function _checkUpdating() {
				if ((!this.updatingImageList) || Date.now() - start >= 5000) {
					this.cancelUpdatingImageList = false;
					updateFunction.bind(wp)(preload, preloadCallback);
				}
				else {
					setTimeout(_checkUpdating, 50);
				}
			}
			setTimeout(_checkUpdating, 1);
		}
		else {
			this.cancelUpdatingImageList = false;
			updateFunction.bind(wp)(preload, preloadCallback);
		}
	}

	findImages(mediaContentId) {
		const wp = this;
		logger.debug(`findImages: ${mediaContentId}`);
		let excludeRegExp = [];
		if (config.image_excludes) {
			for (let imageExclude of config.image_excludes) {
				excludeRegExp.push(new RegExp(imageExclude));
			}
		}

		return new Promise(
			function(resolve, reject) {
				wp.hass.callWS({
					type: "media_source/browse_media",
					media_content_id: mediaContentId
				}).then(
					mediaEntry => {
						logger.debug("Found media entry", mediaEntry);
						var promises = mediaEntry.children.map(child => {
							let filename = child.media_content_id.replace(/^media-source:\/\/[^/]+/, '');
							for (let exclude of excludeRegExp) {
								if (exclude.test(filename)) {
									return;
								}
							}
							if (child.media_class == "image") {
								//logger.debug(child);
								return child.media_content_id;
							}
							if (child.media_class == "directory") {
								if (wp.cancelUpdatingImageList) {
									return;
								}
								return wp.findImages(child.media_content_id);
							}
						});
						Promise.all(promises).then(results => {
							let result = [];
							for (let res of results) {
								if (res) {
									result = result.concat(res);
								}
							}
							resolve(result);
						})
					},
					error => {
						//logger.warn(error);
						reject(error);
					}
				);
			}
		);
	}

	updateImageListFromMediaSource(preload, preloadCallback = null) {
		this.updatingImageList = true;
		this.lastImageListUpdate = Date.now();
		const mediaContentId = config.image_url;
		const wp = this;
		wp.findImages(mediaContentId).then(
			result => {
				wp.updatingImageList = false;
				if (!wp.cancelUpdatingImageList) {
					if (config.image_order == "random") {
						wp.imageList = result.sort((a, b) => 0.5 - Math.random());
					}
					else {
						wp.imageList = result.sort();
					}
					logger.debug("Image list from media-source is now:", wp.imageList);
					if (preload) {
						wp.preloadImages(preloadCallback);
					}
				}
			},
			error => {
				wp.updatingImageList = false;
				error = `Failed to update image list from ${config.image_url}: ${JSON.stringify(error)}`;
				logger.error(error);
				wp.displayMessage(error, 10000)
			}
		)
	}

	updateImageListFromUnsplashAPI(preload, preloadCallback = null) {
		this.updatingImageList = true;
		this.lastImageListUpdate = Date.now();
		let wp = this;
		let urls = [];
		let data = {};
		const http = new XMLHttpRequest();
		http.responseType = "json";
		// count: The number of photos to return. (Default: 1; max: 30)
		http.open("GET", `${config.image_url}&count=30`, true);
		http.onload = function() {
			if (http.status == 200 || http.status === 0) {
				logger.debug(`Got unsplash API response`);
				http.response.forEach(entry => {
					logger.debug(entry);
					const url = entry.urls.raw + "&w=${width}&h=${height}&auto=format";
					urls.push(url);
					data[url] = entry;
				});
			} else {
				logger.warn("Unsplash API error, get random images", http);
				urls.push("https://source.unsplash.com/random/${width}x${height}?sig=${timestamp}");
			}
			wp.updatingImageList = false;
			if (!wp.cancelUpdatingImageList) {
				wp.imageList = urls;
				imageInfoCache = data;
				logger.debug("Image list from unsplash is now:", wp.imageList);
				if (preload) {
					wp.preloadImages(preloadCallback);
				}
			}
		};
		logger.debug(`Unsplash API request: ${config.image_url}`);
		http.send();
	}

	fillPlaceholders(url) {
		let width = this.screensaverContainer.clientWidth;
		let height = this.screensaverContainer.clientHeight;
		let timestamp_ms = Date.now();
		let timestamp = Math.floor(timestamp_ms / 1000);
		url = url.replace(/\${width}/g, width);
		url = url.replace(/\${height}/g, height);
		url = url.replace(/\${timestamp_ms}/g, timestamp_ms);
		url = url.replace(/\${timestamp}/g, timestamp);
		return url;
	}

	updateImageFromUrl(img, url) {
		const realUrl = this.fillPlaceholders(url);
		if (realUrl != url && imageInfoCache[url]) {
			imageInfoCache[realUrl] = imageInfoCache[url];
		}
		img.imageUrl = realUrl;
		logger.debug(`Updating image '${img.id}' from '${realUrl}'`);
		if (imageSourceType() == "media-entity") {
			this.updateImageUrlWithHttpFetch(img, realUrl);
		} else {
			img.src = realUrl;
		}
	}

	updateImageUrlWithHttpFetch(img, url) {
		var http = new XMLHttpRequest();
		http.onload = function() {
			if (this.status == 200 || this.status === 0) {
				img.src = "data:image/jpeg;base64," + arrayBufferToBase64(http.response);
			}
			http = null;
		};
		http.open("GET", url, true);
		http.responseType = "arraybuffer";
		http.send(null);
	}

	updateImageIndex() {
		if (this.imageListDirection == "forwards") {
			this.imageIndex++;
		}
		else {
			this.imageIndex--;
		}
		if (this.imageIndex >= this.imageList.length) {
			this.imageIndex = 0;
		}
		else if (this.imageIndex < 0) {
			this.imageIndex = this.imageList.length - 1;
		}
	}

	updateImageFromMediaSource(img) {
		if (this.imageList.length == 0) {
			return;
		}
		this.updateImageIndex();
		img.imageUrl = this.imageList[this.imageIndex];
		this.hass.callWS({
			type: "media_source/resolve_media",
			media_content_id: img.imageUrl
		}).then(
			result => {
				let src = result.url;
				if ((!src.startsWith("http://")) && (!src.startsWith("https://"))) {
					src = `${document.location.origin}${src}`;
				}
				logger.debug(`Setting image src: ${src}`);
				img.src = src;
			},
			error => {
				logger.error(`media_source/resolve_media error for ${imageUrl}:`, error);
			}
		);
	}

	updateImageFromUnsplashAPI(img) {
		if (this.imageList.length == 0) {
			return;
		}
		this.updateImageIndex();
		this.updateImageFromUrl(img, this.imageList[this.imageIndex]);
	}

	updateImageFromMediaEntity(img) {
		const imageEntity = config.image_url.replace(/^media-entity:\/\//, '')
		const entity = this.hass.states[imageEntity];
		if (!entity || !entity.attributes || !entity.attributes.entity_picture) {
			return;
		}
		let entityPicture = entity.attributes.entity_picture;
		let querySuffix = entityPicture.indexOf('?') > 0 ? '&' : '?';
		querySuffix += "width=${width}&height=${height}";
		this.updateImageFromUrl(img, entityPicture + querySuffix);
	}

	updateImage(img, callback = null) {
		if (!config.show_images) {
			return;
		}
		img.setAttribute('data-loading', true);
		img.imageUrl = null;

		if (imageSourceType() == "media-source") {
			this.updateImageFromMediaSource(img);
		}
		else if (imageSourceType() == "unsplash-api") {
			this.updateImageFromUnsplashAPI(img);
		}
		else if (imageSourceType() == "media-entity") {
			this.updateImageFromMediaEntity(img);
		}
		else {
			this.updateImageFromUrl(img, config.image_url);
		}

		if (callback) {
			const wp = this;
			const start = Date.now();

			function _checkLoading() {
				if (img.getAttribute('data-loading') == "false" || Date.now() - start >= 2000) {
					callback(wp, img);
				}
				else {
					setTimeout(_checkLoading, 50);
				}
			}
			setTimeout(_checkLoading, 1);
		}
	}

	preloadImage(img, callback = null) {
		const wp = this;
		if ((this.updatingImageList) || (img.getAttribute('data-loading') == "true") || (this.screensaverRunning() && img.parentNode.style.opacity == 1)) {
			if (callback) {
				callback(wp, img);
			}
			return;
		}
		this.updateImage(img,
			function(wp, updatedImg) {
				wp.setImageDataInfo(updatedImg);
				if (callback) {
					callback(wp, updatedImg);
				}
			}
		);
	}

	preloadImages(callback = null) {
		logger.debug("Preloading images");
		if (imageSourceType() === "media-entity") {
			this.preloadImage(this.imageOne,
				function(wp, updatedImg) {
					if (callback) {
						callback(wp);
					}
				}
			);
		}
		else {
			this.preloadImage(this.imageOne,
				function(wp, updatedImg) {
					wp.preloadImage(wp.imageTwo,
						function(wp, updatedImg) {
							if (callback) {
								callback(wp);
							}
						}
					);
				}
			);
		}
	}

	switchActiveEntityImage(crossfadeMillis = null) {
		this.lastImageUpdate = Date.now();
		let next = this.imageTwo;
		let current = this.imageOne;
		if (this.imageTwoContainer.style.opacity == 1) {
			next = this.imageOne;
			current = this.imageTwo;
		}
		const wp = this;
		const onLoad = function(e) {
			next.removeEventListener('load', onLoad);
			if (next.complete && next.src !== current.src) {
				wp.switchActiveImage(crossfadeMillis)
			}
		}
		next.addEventListener('load', onLoad);
		this.updateImage(next);
	}

	switchActiveImage(crossfadeMillis = null) {
		if (this.afterFadeoutTimer) {
			clearTimeout(this.afterFadeoutTimer);
		}
		this.lastImageUpdate = Date.now();

		if (crossfadeMillis === null) {
			crossfadeMillis = Math.round(config.crossfade_time*1000);
		}

		this.imageOneContainer.style.transition = `opacity ${crossfadeMillis}ms ease-in-out`;
		this.imageTwoContainer.style.transition = `opacity ${crossfadeMillis}ms ease-in-out`;

		let curActive = this.imageOneContainer;
		let newActive = this.imageTwoContainer;
		let infoElement = this.imageTwoInfo;
		let curImg = this.imageOne;
		let newImg = this.imageTwo;
		if (this.imageTwoContainer.style.opacity == 1) {
			curActive = this.imageTwoContainer;
			newActive = this.imageOneContainer;
			infoElement = this.imageOneInfo;
			curImg = this.imageTwo;
			newImg = this.imageOne;
		}
		logger.debug(`Switching active image to '${newActive.id}'`);

		this.setImageDataInfo(newImg);

		if (newActive.style.opacity != 1) {
			newActive.style.opacity = 1;
		}
		if (curActive.style.opacity != 0) {
			curActive.style.opacity = 0;
		}

		this.restartProgressBarAnimation();
		this.restartKenBurnsEffect();

		// Load next image after fade out
		// only if not media-entity, which will not yet have changed already
		if (imageSourceType() !== "media-entity") {
			let wp = this;
			this.afterFadeoutTimer = setTimeout(function() {
				wp.updateImage(curImg);
			}, crossfadeMillis);
		}
	}

	displayMessage(message, timeout=15000) {
		this.hideMessage();
		this.messageBox.innerHTML = message;
		this.messageBox.style.visibility = 'visible';
		let wp = this;
		this.messageBoxTimeout = setTimeout(function() {
			wp.hideMessage();
		}, timeout);
	}

	hideMessage() {
		if (!this.messageBoxTimeout) {
			return;
		}
		clearTimeout(this.messageBoxTimeout);
		this.messageBoxTimeout = null;
		this.messageBox.style.visibility = 'hidden';
		this.messageBox.innerHTML = '';
	}

	setupScreensaver() {
		logger.debug("Setup screensaver");
		if (config.fullscreen && !fullscreen) {
			enterFullscreen();
		}
		if (config.keep_screen_on_time > 0 && !screenWakeLock.enabled) {
			screenWakeLock.enable();
		}
	}

	startScreensaver() {
		updateConfig();
		logger.debug("Start screensaver");
		if (!isActive()) {
			logger.debug("Wallpanel not active, not starting screensaver");
			return;
		}

		this.updateStyle();
		this.setupScreensaver();
		this.restartProgressBarAnimation();
		this.restartKenBurnsEffect();

		if (config.keep_screen_on_time > 0) {
			let wp = this;
			setTimeout(function() {
				if (wp.screensaverRunning() && !screenWakeLock.enabled) {
					logger.error("Keep screen on will not work because the user didn't interact with the document first. https://goo.gl/xX8pDD");
					wp.displayMessage("Please interact with the screen for a moment to request wake lock.", 15000)
				}
			}, 2000);
		}

		this.lastMove = Date.now();
		this.lastImageUpdate = Date.now();
		this.screensaverStartedAt = Date.now();
		this.screensaverStoppedAt = null;
		document.documentElement.style.overflow = 'hidden';

		this.createInfoBoxContent();

		this.style.visibility = 'visible';
		this.style.opacity = 1;
		if (config.debug) {
			this.debugBox.style.pointerEvents = 'auto';
		}

		this.setScreensaverEntityState();

		if (config.screensaver_stop_navigation_path) {
			this.screensaverStopNavigationPathTimeout = setTimeout(() => {
				skipDisableScreensaverOnLocationChanged = true;
				navigate(config.screensaver_stop_navigation_path);
				setTimeout(() => {
					skipDisableScreensaverOnLocationChanged = false;
				}, 250);
			}, (config.fade_in_time + 1) * 1000);
		}
	}

	screensaverRunning() {
		return this.screensaverStartedAt && this.screensaverStartedAt > 0;
	}

	stopScreensaver() {
		logger.debug("Stop screensaver");

		this.screensaverStartedAt = null;
		this.screensaverStoppedAt = Date.now();

		document.documentElement.style.removeProperty("overflow");

		if (this.screensaverStopNavigationPathTimeout) {
			clearTimeout(this.screensaverStopNavigationPathTimeout);
		}
		this.hideMessage();

		this.debugBox.style.pointerEvents = 'none';
		this.style.transition = '';
		this.style.opacity = 0;
		this.style.visibility = 'hidden';
		this.infoBoxPosX.style.animation = '';
		this.infoBoxPosY.style.animation = '';

		this.idleSince = Date.now();
		if (screenWakeLock.enabled) {
			screenWakeLock.disable();
		}

		this.setScreensaverEntityState();
	}

	updateScreensaver() {
		let currentDate = new Date();
		let now = currentDate.getTime();

		if (this.energyCollectionUpdateEnabled && now - this.lastEnergyCollectionUpdate >= this.energyCollectionUpdateInterval * 1000) {
			if (this.hass.connection._energy_wallpanel) {
				this.hass.connection._energy_wallpanel.refresh();
			}
			this.lastEnergyCollectionUpdate = now;
		}
		if (this.infoBoxContentCreatedDate && this.infoBoxContentCreatedDate.getDate() != currentDate.getDate()) {
			// Day changed since creation of info box content.
			// Recreate to update energy cards / energy collection start / end date.
			this.createInfoBoxContent();
		}

		if (config.info_move_interval > 0 && now - this.lastMove >= config.info_move_interval*1000) {
			if (config.info_move_pattern === 'random') {
				this.randomMove();
			}
			else if (config.info_move_pattern === 'corners') {
				this.moveAroundCorners();
			}
			else {
				logger.error(`Unknown info move type ${config.info_move_pattern}`);
			}
		}

		if (config.black_screen_after_time > 0 && now - this.screensaverStartedAt >= config.black_screen_after_time*1000) {
			logger.debug("Setting screen to black");
			this.screensaverOverlay.style.background = '#000000';
		}
		else if (config.show_images) {
			if (now - this.lastImageUpdate >= config.display_time*1000) {
				if (imageSourceType() === "media-entity") {
					this.switchActiveEntityImage();
				} else {
					this.switchActiveImage();
				}
			}
			if (now - this.lastImageListUpdate >= config.image_list_update_interval*1000) {
				this.updateImageList();
			}
			if (this.imageOneContainer.style.visibility != 'visible') {
				this.imageOneContainer.style.visibility = 'visible';
			}
			if (this.imageTwoContainer.style.visibility != 'visible') {
				this.imageTwoContainer.style.visibility = 'visible';
			}
		}
		else {
			if (this.imageOneContainer.style.visibility != 'hidden') {
				this.imageOneContainer.style.visibility = 'hidden';
			}
			if (this.imageTwoContainer.style.visibility != 'hidden') {
				this.imageTwoContainer.style.visibility = 'hidden';
			}
		}

		if (config.debug) {
			let html = '';
			let conf = {};
			for (const key in config) {
				if (["profiles"].includes(key)) {
					conf[key] = "...";
				}
				else {
					conf[key] = config[key];
				}
			}

			html += '<a id="download_log" href="">Download log</a><br />';
			html += `Version: ${version}<br/>`;
			html += `Config: ${JSON.stringify(conf)}<br/>`;
			html += `Fullscreen: ${fullscreen}<br/>`;
			html += `Screensaver started at: ${wallpanel.screensaverStartedAt}<br/>`;
			html += `Screen wake lock: enabled=${screenWakeLock.enabled} native=${screenWakeLock.nativeWakeLockSupported} lock=${screenWakeLock._lock} player=${screenWakeLock._player} error=${screenWakeLock.error}<br/>`;
			if (screenWakeLock._player) {
				let p = screenWakeLock._player;
				html += `Screen wake lock video: readyState=${p.readyState} currentTime=${p.currentTime} paused=${p.paused} ended=${p.ended}<br/>`;
			}
			const activeImage = this.getActiveImageElement();
			if (activeImage) {
				html += `Current image: ${activeImage.imageUrl}`;
			}
			this.debugBox.innerHTML = html;
			this.debugBox.querySelector("#download_log").addEventListener(
				'click',
				function(event) {
					logger.downloadMessages();
					event.preventDefault();
				}
			);
			this.debugBox.scrollTop = this.debugBox.scrollHeight;
		}
		if (screenWakeLock.enabled && now - this.screensaverStartedAt >= config.keep_screen_on_time*1000) {
			logger.info(`Disable wake lock after ${config.keep_screen_on_time} seconds`);
			screenWakeLock.disable();
		}
	}

	switchImageDirection(direction) {
		this.imageListDirection = direction;
		if (this.afterFadeoutTimer) {
			clearTimeout(this.afterFadeoutTimer);
		}
		this.updateImageIndex();
		const inactiveImage = this.getInactiveImageElement();
		this.updateImage(inactiveImage,
			function(wp, img) {
				wp.switchActiveImage(500);
			}
		);
	}

	handleInteractionEvent(evt, isClick) {
		let now = Date.now();
		this.idleSince = now;

		if (! this.screensaverRunning()) {
			if (this.blockEventsUntil > now) {
				if (isClick) {
					evt.preventDefault();
				}
				evt.stopImmediatePropagation();
			}
			if (isClick) {
				this.setupScreensaver();
			}
			return;
		}

		// Screensaver is active
		if (this.messageBoxTimeout) {
			// Message on screen
			if (isClick) {
				this.blockEventsUntil = now + 1000;
				this.hideMessage();
				return;
			}
		}

		let x = evt.clientX;
		let y = evt.clientY;
		if (!x && evt.touches && evt.touches[0]) {
			x = evt.touches[0].clientX;
		}
		if (!y && evt.touches && evt.touches[0]) {
			y = evt.touches[0].clientY;
		}

		if (config.debug && x && x < 100 && y && y < 100) {
			// Download link
			return;
		}

		if (config.card_interaction) {
			if (this.getMoreInfoDialog()) {
				return;
			}
			let elements = this.__cards;
			elements.push(this.shadowRoot.getElementById("wallpanel-screensaver-info-box-content"));
			elements.push(this.shadowRoot.getElementById("wallpanel-screensaver-fixed-info-box-content"));
			for (let i=0; i<elements.length; i++) {
				const pos = elements[i].getBoundingClientRect();
				logger.debug("Event position:", elements[i], x, y, pos.left, pos.right, pos.top, pos.bottom);
				if (x >= pos.left && x <= pos.right && y >= pos.top && y <= pos.bottom) {
					logger.debug("Event on:", elements[i]);
					return;
				}
			}
		}

		if (isClick) {
			evt.preventDefault();
		}
		evt.stopImmediatePropagation();

		if (evt instanceof MouseEvent || evt instanceof TouchEvent) {
			let right = 0.0;
			let bottom = 0.0;
			if (x) {
				right = (this.screensaverContainer.clientWidth - x) / this.screensaverContainer.clientWidth;
			}
			if (y) {
				bottom = (this.screensaverContainer.clientHeight - y) / this.screensaverContainer.clientHeight;
			}
			if ((config.touch_zone_size_next_image > 0) && (right <= config.touch_zone_size_next_image / 100)) {
				if (isClick) {
					if (this.imageListDirection != "forwards") {
						this.switchImageDirection("forwards");
					}
					else if (
						(now - this.lastImageUpdate > 500) &&
						(this.imageOne.getAttribute('data-loading') == "false") &&
						(this.imageTwo.getAttribute('data-loading') == "false")
					) {
						this.switchActiveImage(500);
					}
				}
				return;
			}
			else if ((config.touch_zone_size_previous_image > 0) && (right >= (100 - config.touch_zone_size_previous_image) / 100)) {
				if (isClick) {
					if (this.imageListDirection != "backwards") {
						this.switchImageDirection("backwards");
					}
					else if (
						isClick && (now - this.lastImageUpdate > 500) &&
						(this.imageOne.getAttribute('data-loading') == "false") &&
						(this.imageTwo.getAttribute('data-loading') == "false")
					) {
						this.switchActiveImage(500);
					}
				}
				return;
			}
			else if (right >= 0.40 && right <= 0.60 && bottom <= 0.10) {
				let now = new Date();
				if (isClick && now - this.lastClickTime < 500) {
					this.clickCount += 1;
					if (this.clickCount == 3) {
						logger.purgeMessages();
						config.debug = ! config.debug;
						this.debugBox.style.visibility = config.debug ? 'visible' : 'hidden';
						this.debugBox.style.pointerEvents = config.debug ? 'auto' : 'none';
					}
				}
				else {
					this.clickCount = 1;
				}
				this.lastClickTime = now;
				return;
			}
		}
		if (!isClick || config.stop_screensaver_on_mouse_click) {
			// Prevent interaction with the dashboards after screensaver was stopped
			this.blockEventsUntil = now + config.control_reactivation_time * 1000;
			this.stopScreensaver();
		}
	}
}

function activateWallpanel() {
	setToolbarHidden(config.hide_toolbar);
	setSidebarHidden(config.hide_sidebar);
}


function deactivateWallpanel() {
	if (wallpanel.screensaverRunning()) {
		wallpanel.stopScreensaver();
	}
	setToolbarHidden(false);
	setSidebarHidden(false);
}


function reconfigure() {
	if (!activePanel || !activeTab) {
		deactivateWallpanel();
		return;
	}

	updateConfig();
	if (isActive()) {
		activateWallpanel();
	}
	else {
		deactivateWallpanel();
	}
}


function locationChanged() {
	if (wallpanel.screensaverRunning()) {
		if (!config.stop_screensaver_on_location_change || skipDisableScreensaverOnLocationChanged) {
			return;
		}
		wallpanel.stopScreensaver();
	}

	let panel = null;
	let tab = null;
	let path = window.location.pathname.split("/");
	if (path.length > 1) {
		panel = path[1];
		if (path.length > 2) {
			tab = path[2];
		}
	}
	if (panel != activePanel || tab != activeTab) {
		logger.info(`Location changed from panel '${activePanel}/${activeTab}' to '${panel}/${tab}'`);
		if (panel != activePanel) {
			dashboardConfig = {};
		}
		activePanel = panel;
		activeTab = tab;
		reconfigure();
	}
}

function startup() {
	elHaMain = elHass.shadowRoot.querySelector("home-assistant-main");
	if (!elHaMain) {
		setTimeout(startup, 1000);
		return;
	}
	logger.info(`%c🖼️ Wallpanel version ${version}`, "color: #34b6f9; font-weight: bold;");
	updateConfig();
	customElements.define("wallpanel-view", WallpanelView);
	wallpanel = document.createElement("wallpanel-view");
	elHaMain.shadowRoot.appendChild(wallpanel);
	locationChanged();
	window.addEventListener("location-changed", event => {
		logger.debug("location-changed", event);
		locationChanged();
	});
	elHass.__hass.connection.subscribeEvents(
		function(event) {
			logger.debug("lovelace_updated", event);
			const dashboard = event.data.url_path ? event.data.url_path : "lovelace";
			if (dashboard == activePanel) {
				elHass.__hass.connection.sendMessagePromise({
					type: "lovelace/config",
					url_path: event.data.url_path
				})
				.then((data) => {
					dashboardConfig = {};
					if (data.wallpanel) {
						for (let key in data.wallpanel) {
							if (key in defaultConfig) {
								dashboardConfig[key] = data.wallpanel[key];
							}
						}
					}
					reconfigure();
				});
			}
		},
		"lovelace_updated"
	);
}

setTimeout(startup, 25);


/**
 * https://github.com/exif-js/exif-js
 *
 * Copyright (c) 2008 Jacob Seidelin
 * Released under the MIT License
 */

var debug = false;

var EXIF = function(obj) {
	if (obj instanceof EXIF) return obj;
	if (!(this instanceof EXIF)) return new EXIF(obj);
	this.EXIFwrapped = obj;
};

var ExifTags = EXIF.Tags = {

	// version tags
	0x9000 : "ExifVersion",             // EXIF version
	0xA000 : "FlashpixVersion",         // Flashpix format version

	// colorspace tags
	0xA001 : "ColorSpace",              // Color space information tag

	// image configuration
	0xA002 : "PixelXDimension",         // Valid width of meaningful image
	0xA003 : "PixelYDimension",         // Valid height of meaningful image
	0x9101 : "ComponentsConfiguration", // Information about channels
	0x9102 : "CompressedBitsPerPixel",  // Compressed bits per pixel

	// user information
	0x927C : "MakerNote",               // Any desired information written by the manufacturer
	0x9286 : "UserComment",             // Comments by user

	// related file
	0xA004 : "RelatedSoundFile",        // Name of related sound file

	// date and time
	0x9003 : "DateTimeOriginal",        // Date and time when the original image was generated
	0x9004 : "DateTimeDigitized",       // Date and time when the image was stored digitally
	0x9290 : "SubsecTime",              // Fractions of seconds for DateTime
	0x9291 : "SubsecTimeOriginal",      // Fractions of seconds for DateTimeOriginal
	0x9292 : "SubsecTimeDigitized",     // Fractions of seconds for DateTimeDigitized

	// picture-taking conditions
	0x829A : "ExposureTime",            // Exposure time (in seconds)
	0x829D : "FNumber",                 // F number
	0x8822 : "ExposureProgram",         // Exposure program
	0x8824 : "SpectralSensitivity",     // Spectral sensitivity
	0x8827 : "ISOSpeedRatings",         // ISO speed rating
	0x8828 : "OECF",                    // Optoelectric conversion factor
	0x9201 : "ShutterSpeedValue",       // Shutter speed
	0x9202 : "ApertureValue",           // Lens aperture
	0x9203 : "BrightnessValue",         // Value of brightness
	0x9204 : "ExposureBias",            // Exposure bias
	0x9205 : "MaxApertureValue",        // Smallest F number of lens
	0x9206 : "SubjectDistance",         // Distance to subject in meters
	0x9207 : "MeteringMode",            // Metering mode
	0x9208 : "LightSource",             // Kind of light source
	0x9209 : "Flash",                   // Flash status
	0x9214 : "SubjectArea",             // Location and area of main subject
	0x920A : "FocalLength",             // Focal length of the lens in mm
	0xA20B : "FlashEnergy",             // Strobe energy in BCPS
	0xA20C : "SpatialFrequencyResponse",    //
	0xA20E : "FocalPlaneXResolution",   // Number of pixels in width direction per FocalPlaneResolutionUnit
	0xA20F : "FocalPlaneYResolution",   // Number of pixels in height direction per FocalPlaneResolutionUnit
	0xA210 : "FocalPlaneResolutionUnit",    // Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
	0xA214 : "SubjectLocation",         // Location of subject in image
	0xA215 : "ExposureIndex",           // Exposure index selected on camera
	0xA217 : "SensingMethod",           // Image sensor type
	0xA300 : "FileSource",              // Image source (3 == DSC)
	0xA301 : "SceneType",               // Scene type (1 == directly photographed)
	0xA302 : "CFAPattern",              // Color filter array geometric pattern
	0xA401 : "CustomRendered",          // Special processing
	0xA402 : "ExposureMode",            // Exposure mode
	0xA403 : "WhiteBalance",            // 1 = auto white balance, 2 = manual
	0xA404 : "DigitalZoomRation",       // Digital zoom ratio
	0xA405 : "FocalLengthIn35mmFilm",   // Equivalent foacl length assuming 35mm film camera (in mm)
	0xA406 : "SceneCaptureType",        // Type of scene
	0xA407 : "GainControl",             // Degree of overall image gain adjustment
	0xA408 : "Contrast",                // Direction of contrast processing applied by camera
	0xA409 : "Saturation",              // Direction of saturation processing applied by camera
	0xA40A : "Sharpness",               // Direction of sharpness processing applied by camera
	0xA40B : "DeviceSettingDescription",    //
	0xA40C : "SubjectDistanceRange",    // Distance to subject

	// other tags
	0xA005 : "InteroperabilityIFDPointer",
	0xA420 : "ImageUniqueID"            // Identifier assigned uniquely to each image
};

var TiffTags = EXIF.TiffTags = {
	0x0100 : "ImageWidth",
	0x0101 : "ImageHeight",
	0x8769 : "ExifIFDPointer",
	0x8825 : "GPSInfoIFDPointer",
	0xA005 : "InteroperabilityIFDPointer",
	0x0102 : "BitsPerSample",
	0x0103 : "Compression",
	0x0106 : "PhotometricInterpretation",
	0x0112 : "Orientation",
	0x0115 : "SamplesPerPixel",
	0x011C : "PlanarConfiguration",
	0x0212 : "YCbCrSubSampling",
	0x0213 : "YCbCrPositioning",
	0x011A : "XResolution",
	0x011B : "YResolution",
	0x0128 : "ResolutionUnit",
	0x0111 : "StripOffsets",
	0x0116 : "RowsPerStrip",
	0x0117 : "StripByteCounts",
	0x0201 : "JPEGInterchangeFormat",
	0x0202 : "JPEGInterchangeFormatLength",
	0x012D : "TransferFunction",
	0x013E : "WhitePoint",
	0x013F : "PrimaryChromaticities",
	0x0211 : "YCbCrCoefficients",
	0x0214 : "ReferenceBlackWhite",
	0x0132 : "DateTime",
	0x010E : "ImageDescription",
	0x010F : "Make",
	0x0110 : "Model",
	0x0131 : "Software",
	0x013B : "Artist",
	0x8298 : "Copyright"
};

var GPSTags = EXIF.GPSTags = {
	0x0000 : "GPSVersionID",
	0x0001 : "GPSLatitudeRef",
	0x0002 : "GPSLatitude",
	0x0003 : "GPSLongitudeRef",
	0x0004 : "GPSLongitude",
	0x0005 : "GPSAltitudeRef",
	0x0006 : "GPSAltitude",
	0x0007 : "GPSTimeStamp",
	0x0008 : "GPSSatellites",
	0x0009 : "GPSStatus",
	0x000A : "GPSMeasureMode",
	0x000B : "GPSDOP",
	0x000C : "GPSSpeedRef",
	0x000D : "GPSSpeed",
	0x000E : "GPSTrackRef",
	0x000F : "GPSTrack",
	0x0010 : "GPSImgDirectionRef",
	0x0011 : "GPSImgDirection",
	0x0012 : "GPSMapDatum",
	0x0013 : "GPSDestLatitudeRef",
	0x0014 : "GPSDestLatitude",
	0x0015 : "GPSDestLongitudeRef",
	0x0016 : "GPSDestLongitude",
	0x0017 : "GPSDestBearingRef",
	0x0018 : "GPSDestBearing",
	0x0019 : "GPSDestDistanceRef",
	0x001A : "GPSDestDistance",
	0x001B : "GPSProcessingMethod",
	0x001C : "GPSAreaInformation",
	0x001D : "GPSDateStamp",
	0x001E : "GPSDifferential"
};

	// EXIF 2.3 Spec
var IFD1Tags = EXIF.IFD1Tags = {
	0x0100: "ImageWidth",
	0x0101: "ImageHeight",
	0x0102: "BitsPerSample",
	0x0103: "Compression",
	0x0106: "PhotometricInterpretation",
	0x0111: "StripOffsets",
	0x0112: "Orientation",
	0x0115: "SamplesPerPixel",
	0x0116: "RowsPerStrip",
	0x0117: "StripByteCounts",
	0x011A: "XResolution",
	0x011B: "YResolution",
	0x011C: "PlanarConfiguration",
	0x0128: "ResolutionUnit",
	0x0201: "JpegIFOffset",    // When image format is JPEG, this value show offset to JPEG data stored.(aka "ThumbnailOffset" or "JPEGInterchangeFormat")
	0x0202: "JpegIFByteCount", // When image format is JPEG, this value shows data size of JPEG image (aka "ThumbnailLength" or "JPEGInterchangeFormatLength")
	0x0211: "YCbCrCoefficients",
	0x0212: "YCbCrSubSampling",
	0x0213: "YCbCrPositioning",
	0x0214: "ReferenceBlackWhite"
};

var StringValues = EXIF.StringValues = {
	ExposureProgram : {
		0 : "Not defined",
		1 : "Manual",
		2 : "Normal program",
		3 : "Aperture priority",
		4 : "Shutter priority",
		5 : "Creative program",
		6 : "Action program",
		7 : "Portrait mode",
		8 : "Landscape mode"
	},
	MeteringMode : {
		0 : "Unknown",
		1 : "Average",
		2 : "CenterWeightedAverage",
		3 : "Spot",
		4 : "MultiSpot",
		5 : "Pattern",
		6 : "Partial",
		255 : "Other"
	},
	LightSource : {
		0 : "Unknown",
		1 : "Daylight",
		2 : "Fluorescent",
		3 : "Tungsten (incandescent light)",
		4 : "Flash",
		9 : "Fine weather",
		10 : "Cloudy weather",
		11 : "Shade",
		12 : "Daylight fluorescent (D 5700 - 7100K)",
		13 : "Day white fluorescent (N 4600 - 5400K)",
		14 : "Cool white fluorescent (W 3900 - 4500K)",
		15 : "White fluorescent (WW 3200 - 3700K)",
		17 : "Standard light A",
		18 : "Standard light B",
		19 : "Standard light C",
		20 : "D55",
		21 : "D65",
		22 : "D75",
		23 : "D50",
		24 : "ISO studio tungsten",
		255 : "Other"
	},
	Flash : {
		0x0000 : "Flash did not fire",
		0x0001 : "Flash fired",
		0x0005 : "Strobe return light not detected",
		0x0007 : "Strobe return light detected",
		0x0009 : "Flash fired, compulsory flash mode",
		0x000D : "Flash fired, compulsory flash mode, return light not detected",
		0x000F : "Flash fired, compulsory flash mode, return light detected",
		0x0010 : "Flash did not fire, compulsory flash mode",
		0x0018 : "Flash did not fire, auto mode",
		0x0019 : "Flash fired, auto mode",
		0x001D : "Flash fired, auto mode, return light not detected",
		0x001F : "Flash fired, auto mode, return light detected",
		0x0020 : "No flash function",
		0x0041 : "Flash fired, red-eye reduction mode",
		0x0045 : "Flash fired, red-eye reduction mode, return light not detected",
		0x0047 : "Flash fired, red-eye reduction mode, return light detected",
		0x0049 : "Flash fired, compulsory flash mode, red-eye reduction mode",
		0x004D : "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
		0x004F : "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
		0x0059 : "Flash fired, auto mode, red-eye reduction mode",
		0x005D : "Flash fired, auto mode, return light not detected, red-eye reduction mode",
		0x005F : "Flash fired, auto mode, return light detected, red-eye reduction mode"
	},
	SensingMethod : {
		1 : "Not defined",
		2 : "One-chip color area sensor",
		3 : "Two-chip color area sensor",
		4 : "Three-chip color area sensor",
		5 : "Color sequential area sensor",
		7 : "Trilinear sensor",
		8 : "Color sequential linear sensor"
	},
	SceneCaptureType : {
		0 : "Standard",
		1 : "Landscape",
		2 : "Portrait",
		3 : "Night scene"
	},
	SceneType : {
		1 : "Directly photographed"
	},
	CustomRendered : {
		0 : "Normal process",
		1 : "Custom process"
	},
	WhiteBalance : {
		0 : "Auto white balance",
		1 : "Manual white balance"
	},
	GainControl : {
		0 : "None",
		1 : "Low gain up",
		2 : "High gain up",
		3 : "Low gain down",
		4 : "High gain down"
	},
	Contrast : {
		0 : "Normal",
		1 : "Soft",
		2 : "Hard"
	},
	Saturation : {
		0 : "Normal",
		1 : "Low saturation",
		2 : "High saturation"
	},
	Sharpness : {
		0 : "Normal",
		1 : "Soft",
		2 : "Hard"
	},
	SubjectDistanceRange : {
		0 : "Unknown",
		1 : "Macro",
		2 : "Close view",
		3 : "Distant view"
	},
	FileSource : {
		3 : "DSC"
	},

	Components : {
		0 : "",
		1 : "Y",
		2 : "Cb",
		3 : "Cr",
		4 : "R",
		5 : "G",
		6 : "B"
	}
};


function imageHasData(img) {
	return !!(img.exifdata);
}

function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return btoa(binary);
}

function base64ToArrayBuffer(base64, contentType) {
	contentType = contentType || base64.match(/^data\:([^\;]+)\;base64,/mi)[1] || ''; // e.g. 'data:image/jpeg;base64,...' => 'image/jpeg'
	base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
	var binary = atob(base64);
	var len = binary.length;
	var buffer = new ArrayBuffer(len);
	var view = new Uint8Array(buffer);
	for (var i = 0; i < len; i++) {
		view[i] = binary.charCodeAt(i);
	}
	return buffer;
}

function objectURLToBlob(url, callback) {
	var http = new XMLHttpRequest();
	http.open("GET", url, true);
	http.responseType = "blob";
	http.onload = function(e) {
		if (this.status == 200 || this.status === 0) {
			callback(this.response);
		}
	};
	http.send();
}

function getImageData(img, callback) {
	function handleBinaryFile(binFile) {
		var data = findEXIFinJPEG(binFile);
		img.exifdata = data || {};
		var iptcdata = findIPTCinJPEG(binFile);
		img.iptcdata = iptcdata || {};
		if (EXIF.isXmpEnabled) {
			var xmpdata= findXMPinJPEG(binFile);
			img.xmpdata = xmpdata || {};
		}
		if (callback) {
			callback.call(img);
		}
	}

	if (img.src) {
		if (/^data\:/i.test(img.src)) { // Data URI
			var arrayBuffer = base64ToArrayBuffer(img.src);
			handleBinaryFile(arrayBuffer);

		} else if (/^blob\:/i.test(img.src)) { // Object URL
			var fileReader = new FileReader();
			fileReader.onload = function(e) {
				handleBinaryFile(e.target.result);
			};
			objectURLToBlob(img.src, function (blob) {
				fileReader.readAsArrayBuffer(blob);
			});
		} else {
			var http = new XMLHttpRequest();
			http.onload = function() {
				if (this.status == 200 || this.status === 0) {
					handleBinaryFile(http.response);
				} else {
					throw "Could not load image";
				}
				http = null;
			};
			http.open("GET", img.src, true);
			http.responseType = "arraybuffer";
			http.send(null);
		}
	} else if (self.FileReader && (img instanceof self.Blob || img instanceof self.File)) {
		var fileReader = new FileReader();
		fileReader.onload = function(e) {
			if (debug) logger.log("Got file of length " + e.target.result.byteLength);
			handleBinaryFile(e.target.result);
		};

		fileReader.readAsArrayBuffer(img);
	}
}

function findEXIFinJPEG(file) {
	var dataView = new DataView(file);

	if (debug) logger.log("Got file of length " + file.byteLength);
	if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
		if (debug) logger.log("Not a valid JPEG");
		return false; // not a valid jpeg
	}

	var offset = 2,
		length = file.byteLength,
		marker;

	while (offset < length) {
		if (dataView.getUint8(offset) != 0xFF) {
			if (debug) logger.log("Not a valid marker at offset " + offset + ", found: " + dataView.getUint8(offset));
			return false; // not a valid marker, something is wrong
		}

		marker = dataView.getUint8(offset + 1);
		if (debug) logger.log(marker);

		// we could implement handling for other markers here,
		// but we're only looking for 0xFFE1 for EXIF data

		if (marker == 225) {
			if (debug) logger.log("Found 0xFFE1 marker");

			return readEXIFData(dataView, offset + 4, dataView.getUint16(offset + 2) - 2);

			// offset += 2 + file.getShortAt(offset+2, true);

		} else {
			offset += 2 + dataView.getUint16(offset+2);
		}

	}

}

function findIPTCinJPEG(file) {
	var dataView = new DataView(file);

	if (debug) logger.log("Got file of length " + file.byteLength);
	if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
		if (debug) logger.log("Not a valid JPEG");
		return false; // not a valid jpeg
	}

	var offset = 2,
		length = file.byteLength;


	var isFieldSegmentStart = function(dataView, offset){
		return (
			dataView.getUint8(offset) === 0x38 &&
			dataView.getUint8(offset+1) === 0x42 &&
			dataView.getUint8(offset+2) === 0x49 &&
			dataView.getUint8(offset+3) === 0x4D &&
			dataView.getUint8(offset+4) === 0x04 &&
			dataView.getUint8(offset+5) === 0x04
		);
	};

	while (offset < length) {

		if ( isFieldSegmentStart(dataView, offset )){

			// Get the length of the name header (which is padded to an even number of bytes)
			var nameHeaderLength = dataView.getUint8(offset+7);
			if(nameHeaderLength % 2 !== 0) nameHeaderLength += 1;
			// Check for pre photoshop 6 format
			if(nameHeaderLength === 0) {
				// Always 4
				nameHeaderLength = 4;
			}

			var startOffset = offset + 8 + nameHeaderLength;
			var sectionLength = dataView.getUint16(offset + 6 + nameHeaderLength);

			return readIPTCData(file, startOffset, sectionLength);

			break;

		}


		// Not the marker, continue searching
		offset++;

	}

}
var IptcFieldMap = {
	0x78 : 'caption',
	0x6E : 'credit',
	0x19 : 'keywords',
	0x37 : 'dateCreated',
	0x50 : 'byline',
	0x55 : 'bylineTitle',
	0x5A : 'city',
	0x5C : 'sublocation',
	0x5E : 'state',
	0x64 : 'countryCode',
	0x65 : 'countryName',
	0x67 : 'OriginalTransmissionReference',
	0x69 : 'headline',
	0x6D : 'credit',
	0x74 : 'copyright',
	0x76 : 'contact',
	0x78 : 'caption',
	0x7A : 'captionWriter',
	0x7D : 'rasterizedCaption',
	0x82 : 'imageType',
	0x83 : 'imageOrientation',
	0x87 : 'languageID',
	0x96 : 'audioType',
	0x97 : 'audioSamplingRate',
	0x98 : 'audioSamplingRes',
	0x99 : 'audioDuration',
	0x9A : 'audioOutcue',
	0xC8 : 'previewFileFormat',
	0xC9 : 'previewFileFormatVer',
	0xCA : 'previewData',
	0x0F : 'category'
};

function readIPTCData(file, startOffset, sectionLength){
	var dataView = new DataView(file);
	var data = {};
	var fieldValue, fieldName, dataSize, segmentType, segmentSize;
	var segmentStartPos = startOffset;
	while(segmentStartPos < startOffset+sectionLength) {
		if(dataView.getUint8(segmentStartPos) === 0x1C && dataView.getUint8(segmentStartPos+1) === 0x02){
			segmentType = dataView.getUint8(segmentStartPos+2);
			if(segmentType in IptcFieldMap) {
				dataSize = dataView.getInt16(segmentStartPos+3);
				segmentSize = dataSize + 5;
				fieldName = IptcFieldMap[segmentType];
				fieldValue = getStringFromDB(dataView, segmentStartPos+5, dataSize);
				// Check if we already stored a value with this name
				if(data.hasOwnProperty(fieldName)) {
					// Value already stored with this name, create multivalue field
					if(data[fieldName] instanceof Array) {
						data[fieldName].push(fieldValue);
					}
					else {
						data[fieldName] = [data[fieldName], fieldValue];
					}
				}
				else {
					data[fieldName] = fieldValue;
				}
			}

		}
		segmentStartPos++;
	}
	return data;
}



function readTags(file, tiffStart, dirStart, strings, bigEnd) {
	var entries = file.getUint16(dirStart, !bigEnd),
		tags = {},
		entryOffset, tag,
		i;

	for (i=0;i<entries;i++) {
		entryOffset = dirStart + i*12 + 2;
		tag = strings[file.getUint16(entryOffset, !bigEnd)];
		if (!tag && debug) logger.log("Unknown tag: " + file.getUint16(entryOffset, !bigEnd));
		tags[tag] = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
	}
	return tags;
}


function readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd) {
	var type = file.getUint16(entryOffset+2, !bigEnd),
		numValues = file.getUint32(entryOffset+4, !bigEnd),
		valueOffset = file.getUint32(entryOffset+8, !bigEnd) + tiffStart,
		offset,
		vals, val, n,
		numerator, denominator;

	switch (type) {
		case 1: // byte, 8-bit unsigned int
		case 7: // undefined, 8-bit byte, value depending on field
			if (numValues == 1) {
				return file.getUint8(entryOffset + 8, !bigEnd);
			} else {
				offset = numValues > 4 ? valueOffset : (entryOffset + 8);
				vals = [];
				for (n=0;n<numValues;n++) {
					vals[n] = file.getUint8(offset + n);
				}
				return vals;
			}

		case 2: // ascii, 8-bit byte
			offset = numValues > 4 ? valueOffset : (entryOffset + 8);
			return getStringFromDB(file, offset, numValues-1);

		case 3: // short, 16 bit int
			if (numValues == 1) {
				return file.getUint16(entryOffset + 8, !bigEnd);
			} else {
				offset = numValues > 2 ? valueOffset : (entryOffset + 8);
				vals = [];
				for (n=0;n<numValues;n++) {
					vals[n] = file.getUint16(offset + 2*n, !bigEnd);
				}
				return vals;
			}

		case 4: // long, 32 bit int
			if (numValues == 1) {
				return file.getUint32(entryOffset + 8, !bigEnd);
			} else {
				vals = [];
				for (n=0;n<numValues;n++) {
					vals[n] = file.getUint32(valueOffset + 4*n, !bigEnd);
				}
				return vals;
			}

		case 5:    // rational = two long values, first is numerator, second is denominator
			if (numValues == 1) {
				numerator = file.getUint32(valueOffset, !bigEnd);
				denominator = file.getUint32(valueOffset+4, !bigEnd);
				val = new Number(numerator / denominator);
				val.numerator = numerator;
				val.denominator = denominator;
				return val;
			} else {
				vals = [];
				for (n=0;n<numValues;n++) {
					numerator = file.getUint32(valueOffset + 8*n, !bigEnd);
					denominator = file.getUint32(valueOffset+4 + 8*n, !bigEnd);
					vals[n] = new Number(numerator / denominator);
					vals[n].numerator = numerator;
					vals[n].denominator = denominator;
				}
				return vals;
			}

		case 9: // slong, 32 bit signed int
			if (numValues == 1) {
				return file.getInt32(entryOffset + 8, !bigEnd);
			} else {
				vals = [];
				for (n=0;n<numValues;n++) {
					vals[n] = file.getInt32(valueOffset + 4*n, !bigEnd);
				}
				return vals;
			}

		case 10: // signed rational, two slongs, first is numerator, second is denominator
			if (numValues == 1) {
				return file.getInt32(valueOffset, !bigEnd) / file.getInt32(valueOffset+4, !bigEnd);
			} else {
				vals = [];
				for (n=0;n<numValues;n++) {
					vals[n] = file.getInt32(valueOffset + 8*n, !bigEnd) / file.getInt32(valueOffset+4 + 8*n, !bigEnd);
				}
				return vals;
			}
	}
}

/**
* Given an IFD (Image File Directory) start offset
* returns an offset to next IFD or 0 if it's the last IFD.
*/
function getNextIFDOffset(dataView, dirStart, bigEnd){
	//the first 2bytes means the number of directory entries contains in this IFD
	var entries = dataView.getUint16(dirStart, !bigEnd);

	// After last directory entry, there is a 4bytes of data,
	// it means an offset to next IFD.
	// If its value is '0x00000000', it means this is the last IFD and there is no linked IFD.

	return dataView.getUint32(dirStart + 2 + entries * 12, !bigEnd); // each entry is 12 bytes long
}

function readThumbnailImage(dataView, tiffStart, firstIFDOffset, bigEnd){
	// get the IFD1 offset
	var IFD1OffsetPointer = getNextIFDOffset(dataView, tiffStart+firstIFDOffset, bigEnd);

	if (!IFD1OffsetPointer) {
		// logger.log('******** IFD1Offset is empty, image thumb not found ********');
		return {};
	}
	else if (IFD1OffsetPointer > dataView.byteLength) { // this should not happen
		// logger.log('******** IFD1Offset is outside the bounds of the DataView ********');
		return {};
	}
	// logger.log('*******  thumbnail IFD offset (IFD1) is: %s', IFD1OffsetPointer);

	var thumbTags = readTags(dataView, tiffStart, tiffStart + IFD1OffsetPointer, IFD1Tags, bigEnd)

	// EXIF 2.3 specification for JPEG format thumbnail

	// If the value of Compression(0x0103) Tag in IFD1 is '6', thumbnail image format is JPEG.
	// Most of Exif image uses JPEG format for thumbnail. In that case, you can get offset of thumbnail
	// by JpegIFOffset(0x0201) Tag in IFD1, size of thumbnail by JpegIFByteCount(0x0202) Tag.
	// Data format is ordinary JPEG format, starts from 0xFFD8 and ends by 0xFFD9. It seems that
	// JPEG format and 160x120pixels of size are recommended thumbnail format for Exif2.1 or later.

	if (thumbTags['Compression']) {
		// logger.log('Thumbnail image found!');

		switch (thumbTags['Compression']) {
			case 6:
				// logger.log('Thumbnail image format is JPEG');
				if (thumbTags.JpegIFOffset && thumbTags.JpegIFByteCount) {
				// extract the thumbnail
					var tOffset = tiffStart + thumbTags.JpegIFOffset;
					var tLength = thumbTags.JpegIFByteCount;
					thumbTags['blob'] = new Blob([new Uint8Array(dataView.buffer, tOffset, tLength)], {
						type: 'image/jpeg'
					});
				}
			break;

		case 1:
			logger.log("Thumbnail image format is TIFF, which is not implemented.");
			break;
		default:
			logger.log("Unknown thumbnail image format '%s'", thumbTags['Compression']);
		}
	}
	else if (thumbTags['PhotometricInterpretation'] == 2) {
		logger.log("Thumbnail image format is RGB, which is not implemented.");
	}
	return thumbTags;
}

function getStringFromDB(buffer, start, length) {
	// Manage UTF-8 string
	//use of an Array of bytes convert in hexa (arOut[])
	var outstr = "";
	var arOut = [];
	var j = 0;
	for (var n = start; n < start+length; n++) {
		//outstr += String.fromCharCode(buffer.getUint8(n));
		arOut[j] = '0x' + buffer.getUint8(n).toString(16);
		j++;
	}
	//transform array to UTF-8 String with Utf8ArrayToStr function
	outstr =  Utf8ArrayToStr(arOut);
	return outstr;
}

// adopted from:
//   http://www.onicos.com/staff/iz/amuse/javascript/expert/utf.txt

/* utf.js - UTF-8 <=> UTF-16 convertion
 *
 * Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
 * Version: 1.0
 * LastModified: Dec 25 1999
 * This library is free.  You can redistribute it and/or modify it.
 */

function Utf8ArrayToStr(array) {
	var out, i, len, c;
	var char2, char3;

	out = "";
	len = array.length;
	i = 0;
	while(i < len) {
		c = array[i++];
		switch(c >> 4) {
			case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
			// 0xxxxxxx
			out += String.fromCharCode(c);
			break;
			case 12: case 13:
			// 110x xxxx   10xx xxxx
			char2 = array[i++];
			out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
			break;
			case 14:
			// 1110 xxxx  10xx xxxx  10xx xxxx
			char2 = array[i++];
			char3 = array[i++];
			out += String.fromCharCode(((c & 0x0F) << 12) |
							((char2 & 0x3F) << 6) |
							((char3 & 0x3F) << 0));
			break;
		}
	}

	return out;
}

function readEXIFData(file, start) {
	if (getStringFromDB(file, start, 4) != "Exif") {
		if (debug) logger.log("Not valid EXIF data! " + getStringFromDB(file, start, 4));
		return false;
	}

	var bigEnd,
		tags, tag,
		exifData, gpsData,
		tiffOffset = start + 6;

	// test for TIFF validity and endianness
	if (file.getUint16(tiffOffset) == 0x4949) {
		bigEnd = false;
	} else if (file.getUint16(tiffOffset) == 0x4D4D) {
		bigEnd = true;
	} else {
		if (debug) logger.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
		return false;
	}

	if (file.getUint16(tiffOffset+2, !bigEnd) != 0x002A) {
		if (debug) logger.log("Not valid TIFF data! (no 0x002A)");
		return false;
	}

	var firstIFDOffset = file.getUint32(tiffOffset+4, !bigEnd);

	if (firstIFDOffset < 0x00000008) {
		if (debug) logger.log("Not valid TIFF data! (First offset less than 8)", file.getUint32(tiffOffset+4, !bigEnd));
		return false;
	}

	tags = readTags(file, tiffOffset, tiffOffset + firstIFDOffset, TiffTags, bigEnd);

	if (tags.ExifIFDPointer) {
		exifData = readTags(file, tiffOffset, tiffOffset + tags.ExifIFDPointer, ExifTags, bigEnd);
		for (tag in exifData) {
			switch (tag) {
				case "LightSource" :
				case "Flash" :
				case "MeteringMode" :
				case "ExposureProgram" :
				case "SensingMethod" :
				case "SceneCaptureType" :
				case "SceneType" :
				case "CustomRendered" :
				case "WhiteBalance" :
				case "GainControl" :
				case "Contrast" :
				case "Saturation" :
				case "Sharpness" :
				case "SubjectDistanceRange" :
				case "FileSource" :
					exifData[tag] = StringValues[tag][exifData[tag]];
					break;

				case "ExifVersion" :
				case "FlashpixVersion" :
					exifData[tag] = String.fromCharCode(exifData[tag][0], exifData[tag][1], exifData[tag][2], exifData[tag][3]);
					break;

				case "ComponentsConfiguration" :
					exifData[tag] =
						StringValues.Components[exifData[tag][0]] +
						StringValues.Components[exifData[tag][1]] +
						StringValues.Components[exifData[tag][2]] +
						StringValues.Components[exifData[tag][3]];
					break;
			}
			tags[tag] = exifData[tag];
		}
	}

	if (tags.GPSInfoIFDPointer) {
		gpsData = readTags(file, tiffOffset, tiffOffset + tags.GPSInfoIFDPointer, GPSTags, bigEnd);
		for (tag in gpsData) {
			switch (tag) {
				case "GPSVersionID" :
					gpsData[tag] = gpsData[tag][0] +
						"." + gpsData[tag][1] +
						"." + gpsData[tag][2] +
						"." + gpsData[tag][3];
					break;
			}
			tags[tag] = gpsData[tag];
		}
	}

	// extract thumbnail
	tags['thumbnail'] = readThumbnailImage(file, tiffOffset, firstIFDOffset, bigEnd);

	return tags;
}

function findXMPinJPEG(file) {

	if (!('DOMParser' in self)) {
		// logger.warn('XML parsing not supported without DOMParser');
		return;
	}
	var dataView = new DataView(file);

	if (debug) logger.log("Got file of length " + file.byteLength);
	if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
		if (debug) logger.log("Not a valid JPEG");
		return false; // not a valid jpeg
	}

	var offset = 2,
		length = file.byteLength,
		dom = new DOMParser();

	while (offset < (length-4)) {
		if (getStringFromDB(dataView, offset, 4) == "http") {
			var startOffset = offset - 1;
			var sectionLength = dataView.getUint16(offset - 2) - 1;
			var xmpString = getStringFromDB(dataView, startOffset, sectionLength)
			var xmpEndIndex = xmpString.indexOf('xmpmeta>') + 8;
			xmpString = xmpString.substring( xmpString.indexOf( '<x:xmpmeta' ), xmpEndIndex );

			var indexOfXmp = xmpString.indexOf('x:xmpmeta') + 10
			//Many custom written programs embed xmp/xml without any namespace. Following are some of them.
			//Without these namespaces, XML is thought to be invalid by parsers
			xmpString = xmpString.slice(0, indexOfXmp)
						+ 'xmlns:Iptc4xmpCore="http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/" '
						+ 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" '
						+ 'xmlns:tiff="http://ns.adobe.com/tiff/1.0/" '
						+ 'xmlns:plus="http://schemas.android.com/apk/lib/com.google.android.gms.plus" '
						+ 'xmlns:ext="http://www.gettyimages.com/xsltExtension/1.0" '
						+ 'xmlns:exif="http://ns.adobe.com/exif/1.0/" '
						+ 'xmlns:stEvt="http://ns.adobe.com/xap/1.0/sType/ResourceEvent#" '
						+ 'xmlns:stRef="http://ns.adobe.com/xap/1.0/sType/ResourceRef#" '
						+ 'xmlns:crs="http://ns.adobe.com/camera-raw-settings/1.0/" '
						+ 'xmlns:xapGImg="http://ns.adobe.com/xap/1.0/g/img/" '
						+ 'xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/" '
						+ xmpString.slice(indexOfXmp)

			var domDocument = dom.parseFromString( xmpString, 'text/xml' );
			return xml2Object(domDocument);
		} else{
			offset++;
		}
	}
}

function xml2json(xml) {
	var json = {};

	if (xml.nodeType == 1) { // element node
		if (xml.attributes.length > 0) {
		json['@attributes'] = {};
		for (var j = 0; j < xml.attributes.length; j++) {
			var attribute = xml.attributes.item(j);
			json['@attributes'][attribute.nodeName] = attribute.nodeValue;
		}
		}
	} else if (xml.nodeType == 3) { // text node
		return xml.nodeValue;
	}

	// deal with children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
		var child = xml.childNodes.item(i);
		var nodeName = child.nodeName;
		if (json[nodeName] == null) {
			json[nodeName] = xml2json(child);
		} else {
			if (json[nodeName].push == null) {
			var old = json[nodeName];
			json[nodeName] = [];
			json[nodeName].push(old);
			}
			json[nodeName].push(xml2json(child));
		}
		}
	}

	return json;
}

function xml2Object(xml) {
	try {
		var obj = {};
		if (xml.children.length > 0) {
			for (var i = 0; i < xml.children.length; i++) {
			var item = xml.children.item(i);
			var attributes = item.attributes;
			for(var idx in attributes) {
				var itemAtt = attributes[idx];
				var dataKey = itemAtt.nodeName;
				var dataValue = itemAtt.nodeValue;

				if(dataKey !== undefined) {
					obj[dataKey] = dataValue;
				}
			}
			var nodeName = item.nodeName;

			if (typeof (obj[nodeName]) == "undefined") {
				obj[nodeName] = xml2json(item);
			} else {
				if (typeof (obj[nodeName].push) == "undefined") {
				var old = obj[nodeName];

				obj[nodeName] = [];
				obj[nodeName].push(old);
				}
				obj[nodeName].push(xml2json(item));
			}
			}
		} else {
			obj = xml.textContent;
		}
		return obj;
		} catch (e) {
			logger.log(e.message);
		}
}

EXIF.enableXmp = function() {
	EXIF.isXmpEnabled = true;
}

EXIF.disableXmp = function() {
	EXIF.isXmpEnabled = false;
}

EXIF.getData = function(img, callback) {
	if (((self.Image && img instanceof self.Image)
		|| (self.HTMLImageElement && img instanceof self.HTMLImageElement))
		&& !img.complete)
		return false;

	if (!imageHasData(img)) {
		getImageData(img, callback);
	} else {
		if (callback) {
			callback.call(img);
		}
	}
	return true;
}

EXIF.getTag = function(img, tag) {
	if (!imageHasData(img)) return;
	return img.exifdata[tag];
}

EXIF.getIptcTag = function(img, tag) {
	if (!imageHasData(img)) return;
	return img.iptcdata[tag];
}

EXIF.getAllTags = function(img) {
	if (!imageHasData(img)) return {};
	var a,
		data = img.exifdata,
		tags = {};
	for (a in data) {
		if (data.hasOwnProperty(a)) {
			tags[a] = data[a];
		}
	}
	return tags;
}

EXIF.getAllIptcTags = function(img) {
	if (!imageHasData(img)) return {};
	var a,
		data = img.iptcdata,
		tags = {};
	for (a in data) {
		if (data.hasOwnProperty(a)) {
			tags[a] = data[a];
		}
	}
	return tags;
}

//***************************************************************************
// Written by Stanko Milosev
// Published: 30 January 2015
// http://www.milosev.com/425-reading-exif-meta-data-from-jpeg-image-files.html
// gps conversion for google map use
EXIF.ConvertDMSToDD = function (degrees, minutes, seconds, direction) {
	var dd = degrees + minutes/60 + seconds/(60*60);
	if (direction == "S" || direction == "W") {
		dd = dd * -1;
	} // Don't do anything for N or E
	return dd;
}
//*******************************************************************************

EXIF.pretty = function(img) {
	if (!imageHasData(img)) return "";
	var a,
		data = img.exifdata,
		strPretty = "";
	for (a in data) {
		if (data.hasOwnProperty(a)) {
			if (typeof data[a] == "object") {
				if (data[a] instanceof Number) {
					strPretty += a + " : " + data[a] + " [" + data[a].numerator + "/" + data[a].denominator + "]\r\n";
				} else {
					strPretty += a + " : [" + data[a].length + " values]\r\n";
				}
			} else {
				strPretty += a + " : " + data[a] + "\r\n";
			}
		}
	}
	return strPretty;
}

EXIF.readFromBinaryFile = function(file) {
	return findEXIFinJPEG(file);
}

