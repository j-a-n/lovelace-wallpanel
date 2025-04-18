/**
 * (C) 2020-2025 by Jan Schneider (oss@janschneider.net)
 * Released under the GNU General Public License v3.0
 */

const version = "4.44.0";
const defaultConfig = {
	enabled: false,
	enabled_on_tabs: [],
	debug: false,
	wait_for_browser_mod_time: 0.25,
	log_level_console: "info",
	alert_errors: false,
	hide_toolbar: false,
	keep_toolbar_space: false,
	hide_toolbar_action_icons: false,
	hide_toolbar_on_subviews: false,
	hide_sidebar: false,
	fullscreen: false,
	z_index: 1000,
	idle_time: 15,
	fade_in_time: 3.0,
	fade_out_time_motion_detected: 1.0,
	fade_out_time_screensaver_entity: 3.0,
	fade_out_time_browser_mod_popup: 1.0,
	fade_out_time_interaction: 0.3,
	crossfade_time: 3.0,
	display_time: 15.0,
	keep_screen_on_time: 0,
	black_screen_after_time: 0,
	control_reactivation_time: 1.0,
	screensaver_stop_navigation_path: "",
	screensaver_stop_close_browser_mod_popup: false,
	screensaver_entity: "",
	stop_screensaver_on_mouse_move: true,
	stop_screensaver_on_mouse_click: true,
	stop_screensaver_on_key_down: true,
	stop_screensaver_on_location_change: true,
	disable_screensaver_on_browser_mod_popup: false,
	disable_screensaver_on_browser_mod_popup_func: "",
	show_images: true,
	image_url: "https://picsum.photos/${width}/${height}?random=${timestamp}",
	image_url_entity: "",
	media_entity_load_unchanged: true,
	immich_api_key: "",
	immich_album_names: [],
	immich_shared_albums: true,
	immich_tag_names: [],
	immich_persons: [],
	immich_memories: false,
	immich_resolution: "preview",
	image_fit: "cover", // cover / contain / fill
	image_list_update_interval: 3600,
	image_order: "sorted", // sorted / random
	exclude_filenames: [], // Excluded filenames (regex)
	exclude_media_types: [], // Exclude media types (image / video)
	image_background: "color", // color / image
	video_loop: false,
	touch_zone_size_next_image: 15,
	touch_zone_size_previous_image: 15,
	show_progress_bar: false,
	show_image_info: false,
	fetch_address_data: false,
	image_info_template: "${DateTimeOriginal}",
	info_animation_duration_x: 0,
	info_animation_duration_y: 0,
	info_animation_timing_function_x: "ease",
	info_animation_timing_function_y: "ease",
	info_move_pattern: "random",
	info_move_interval: 0,
	info_move_fade_duration: 2.0,
	image_animation_ken_burns: false,
	image_animation_ken_burns_zoom: 1.3,
	image_animation_ken_burns_delay: 0,
	camera_motion_detection_enabled: false,
	camera_motion_detection_facing_mode: "user",
	camera_motion_detection_threshold: 5,
	camera_motion_detection_capture_width: 64,
	camera_motion_detection_capture_height: 48,
	camera_motion_detection_capture_interval: 0.3,
	camera_motion_detection_capture_visible: false,
	style: {},
	badges: [],
	cards: [{ type: "weather-forecast", entity: "weather.home", show_forecast: true }],
	views: [],
	card_interaction: false,
	profile: "",
	profile_entity: "",
	profiles: {}
};

let dashboardConfig = {};
let config = {};
let currentLocation = null;
let activePanel = null;
let activeTab = null;
let fullscreen = false;
let wallpanel = null;
let skipDisableScreensaverOnLocationChanged = false;
const classStyles = {
	"wallpanel-screensaver-image-background": {
		filter: "blur(15px)",
		background: "#00000000",
		"background-position": "center",
		"background-size": "cover"
	},
	"wallpanel-screensaver-image-info": {
		position: "absolute",
		bottom: "0.5em",
		right: "0.5em",
		padding: "0.1em 0.5em 0.1em 0.5em",
		"font-size": "2em",
		background: "#00000055",
		"backdrop-filter": "blur(2px)",
		"border-radius": "0.1em"
	},
	"wallpanel-progress": {
		position: "absolute",
		bottom: "0",
		height: "2px",
		width: "100%"
	},
	"wallpanel-progress-inner": {
		height: "100%",
		"background-color": "white"
	}
};
const imageInfoCacheMaxSize = 1000;
let imageInfoCache = {};
const imageInfoCacheKeys = [];
const configEntityStates = {};
let mediaEntityState = null;
let elHass = null;
let elHaMain = null;
let browserId = null;
let userId = null;
const userName = null;
let userDisplayname = null;

function isObject(item) {
	return item && typeof item === "object" && !Array.isArray(item);
}

function stringify(obj) {
	const processedObjects = [];
	const json = JSON.stringify(obj, function (key, value) {
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
	logLevel: "warn",
	addMessage: function (level, args) {
		if (!config.debug) {
			return;
		}
		const msg = {
			level: level,
			date: new Date().toISOString(),
			text: "",
			objs: [],
			stack: ""
		};
		const err = new Error();
		if (err.stack) {
			msg.stack = err.stack.toString().replace(/^Error\r?\n/, "");
		}
		for (let i = 0; i < args.length; i++) {
			if (i == 0 && (typeof args[0] === "string" || args[0] instanceof String)) {
				msg.text = args[i];
			} else {
				msg.objs.push(args[i]);
			}
		}
		logger.messages.push(msg);
		if (logger.messages.length > 1000) {
			// Max 1000 messages
			logger.messages.shift();
		}
	},
	downloadMessages: function () {
		const data = new Blob([stringify(logger.messages)], { type: "text/plain" });
		const url = window.URL.createObjectURL(data);
		const el = document.createElement("a");
		el.href = url;
		el.target = "_blank";
		el.download = "wallpanel_log.txt";
		el.click();
	},
	purgeMessages: function () {
		logger.messages = [];
	},
	log: function () {
		console.log.apply(this, arguments);
		logger.addMessage("info", arguments);
	},
	debug: function () {
		if (["debug"].includes(logger.logLevel)) {
			console.debug.apply(this, arguments);
		}
		logger.addMessage("debug", arguments);
	},
	info: function () {
		if (["debug", "info"].includes(logger.logLevel)) {
			console.info.apply(this, arguments);
		}
		logger.addMessage("info", arguments);
	},
	warn: function () {
		if (["debug", "info", "warn"].includes(logger.logLevel)) {
			console.warn.apply(this, arguments);
		}
		logger.addMessage("warn", arguments);
	},
	error: function () {
		if (["debug", "info", "warn", "error"].includes(logger.logLevel)) {
			console.error.apply(this, arguments);
		}
		logger.addMessage("error", arguments);
		if (config.alert_errors) {
			alert(`Wallpanel error: ${stringify(arguments)}`);
		}
	}
};

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
			const videoData =
				"data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAA1NtZGF0AAACrwYF//+r3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE2NCByMzA5NSBiYWVlNDAwIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAyMiAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTMgZGVibG9jaz0xOi0zOi0zIGFuYWx5c2U9MHgzOjB4MTEzIG1lPWhleCBzdWJtZT03IHBzeT0xIHBzeV9yZD0yLjAwOjAuNzAgbWl4ZWRfcmVmPTEgbWVfcmFuZ2U9MTYgY2hyb21hX21lPTEgdHJlbGxpcz0xIDh4OGRjdD0xIGNxbT0wIGRlYWR6b25lPTIxLDExIGZhc3RfcHNraXA9MSBjaHJvbWFfcXBfb2Zmc2V0PS00IHRocmVhZHM9MSBsb29rYWhlYWRfdGhyZWFkcz0xIHNsaWNlZF90aHJlYWRzPTAgbnI9MCBkZWNpbWF0ZT0xIGludGVybGFjZWQ9MCBibHVyYXlfY29tcGF0PTAgY29uc3RyYWluZWRfaW50cmE9MCBiZnJhbWVzPTMgYl9weXJhbWlkPTIgYl9hZGFwdD0xIGJfYmlhcz0wIGRpcmVjdD0xIHdlaWdodGI9MSBvcGVuX2dvcD0wIHdlaWdodHA9MiBrZXlpbnQ9MjUwIGtleWludF9taW49MSBzY2VuZWN1dD00MCBpbnRyYV9yZWZyZXNoPTAgcmNfbG9va2FoZWFkPTQwIHJjPWNyZiBtYnRyZWU9MSBjcmY9MjMuMCBxY29tcD0wLjYwIHFwbWluPTAgcXBtYXg9NjkgcXBzdGVwPTQgaXBfcmF0aW89MS40MCBhcT0xOjEuMjAAgAAAABFliIQAF85//vfUt8yy7VNwgQAAAAlBmiRsQXzn/vAAAAAJQZ5CeIL5z4aBAAAACQGeYXRBfOeGgAAAAAkBnmNqQXznhoEAAAAPQZpoSahBaJlMCC+c//7xAAAAC0GehkURLBfOf4aBAAAACQGepXRBfOeGgQAAAAkBnqdqQXznhoAAAAAPQZqpSahBbJlMCC+c//7wAAADs21vb3YAAABsbXZoZAAAAAAAAAAAAAAAAAAAA+gAACcQAAEAAAEAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAALddHJhawAAAFx0a2hkAAAAAwAAAAAAAAAAAAAAAQAAAAAAACcQAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAIAAAACAAAAAAAJGVkdHMAAAAcZWxzdAAAAAAAAAABAAAnEAAAgAAAAQAAAAACVW1kaWEAAAAgbWRoZAAAAAAAAAAAAAAAAAAAQAAAAoAAVcQAAAAAAC1oZGxyAAAAAAAAAAB2aWRlAAAAAAAAAAAAAAAAVmlkZW9IYW5kbGVyAAAAAgBtaW5mAAAAFHZtaGQAAAABAAAAAAAAAAAAAAAkZGluZgAAABxkcmVmAAAAAAAAAAEAAAAMdXJsIAAAAAEAAAHAc3RibAAAAMBzdHNkAAAAAAAAAAEAAACwYXZjMQAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAIAAgASAAAAEgAAAAAAAAAARVMYXZjNTkuMzcuMTAwIGxpYngyNjQAAAAAAAAAAAAAABj//wAAADZhdmNDAWQACv/hABlnZAAKrNlfllwEQAAAAwBAAAADAIPEiWWAAQAGaOvjxMhM/fj4AAAAABBwYXNwAAAAAQAAAAEAAAAUYnRydAAAAAAAAAKiAAACogAAABhzdHRzAAAAAAAAAAEAAAAKAABAAAAAABRzdHNzAAAAAAAAAAEAAAABAAAAYGN0dHMAAAAAAAAACgAAAAEAAIAAAAAAAQABQAAAAAABAACAAAAAAAEAAAAAAAAAAQAAQAAAAAABAAFAAAAAAAEAAIAAAAAAAQAAAAAAAAABAABAAAAAAAEAAIAAAAAAHHN0c2MAAAAAAAAAAQAAAAEAAAAKAAAAAQAAADxzdHN6AAAAAAAAAAAAAAAKAAACyAAAAA0AAAANAAAADQAAAA0AAAATAAAADwAAAA0AAAANAAAAEwAAABRzdGNvAAAAAAAAAAEAAAAwAAAAYnVkdGEAAABabWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAbWRpcmFwcGwAAAAAAAAAAAAAAAAtaWxzdAAAACWpdG9vAAAAHWRhdGEAAAABAAAAAExhdmY1OS4yNy4xMDA=";
			this._player = document.createElement("video");
			this._player.setAttribute("id", "ScreenWakeLockVideo");
			this._player.setAttribute("src", videoData);
			this._player.setAttribute("playsinline", "");
			this._player.setAttribute("muted", "");
			this._player.addEventListener("ended", () => {
				logger.debug("Video ended");
				if (this.enabled) {
					this.enable();
				}
			});
			this._player.addEventListener("playing", () => {
				logger.debug("Video playing");
				this._isPlaying = true;
			});
			this._player.addEventListener("pause", () => {
				logger.debug("Video pause");
				this._isPlaying = false;
			});
		}
	}

	enable() {
		if (this.nativeWakeLockSupported) {
			logger.debug("Requesting native screen wakelock");
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
		} else {
			logger.debug("Starting video player");
			if (!this._player.paused && this._player._isPlaying) {
				this._player.pause();
			}
			const playPromise = this._player.play();
			if (playPromise) {
				playPromise
					.then(() => {
						this.enabled = true;
						this.error = null;
						logger.debug("Video play successful");
					})
					.catch((error) => {
						this.enabled = false;
						this.error = error;
						logger.error(`Failed to play video: ${error}`);
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
		} else {
			logger.debug("Stopping video player");
			if (!this._player.paused && this._player._isPlaying) {
				this._player.pause();
			}
		}
		this.enabled = false;
	}
}

class CameraMotionDetection {
	constructor() {
		this.enabled = false;
		this.error = false;
		this.width = 64;
		this.height = 48;
		this.threshold = this.width * this.height * 0.05;
		this.captureInterval = 300;

		this.videoElement = document.createElement("video");
		this.videoElement.setAttribute("id", "wallpanelMotionDetectionVideo");
		this.videoElement.style.display = "none";
		document.body.appendChild(this.videoElement);

		this.canvasElement = document.createElement("canvas");
		this.canvasElement.setAttribute("id", "wallpanelMotionDetectionCanvas");
		this.canvasElement.style.display = "none";
		document.body.appendChild(this.canvasElement);

		this.context = this.canvasElement.getContext("2d", { willReadFrequently: true });
	}

	capture() {
		let diffPixels = 0;
		this.context.globalCompositeOperation = "difference";
		this.context.drawImage(this.videoElement, 0, 0, this.width, this.height);
		const diffImageData = this.context.getImageData(0, 0, this.width, this.height);
		const rgba = diffImageData.data;
		for (let i = 0; i < rgba.length; i += 4) {
			const pixelDiff = rgba[i] + rgba[i + 1] + rgba[i + 2];
			if (pixelDiff >= 256) {
				diffPixels++;
				if (diffPixels >= this.threshold) {
					break;
				}
			}
		}
		if (diffPixels >= this.threshold) {
			logger.debug("Motion detetcted:", diffPixels, this.threshold);
			wallpanel.motionDetected();
		}
		this.context.globalCompositeOperation = "source-over";
		this.context.drawImage(this.videoElement, 0, 0, this.width, this.height);
	}

	start() {
		if (this.enabled || this.error) {
			return;
		}

		if (!navigator.mediaDevices) {
			this.error = true;
			logger.error("No media devices found");
			return;
		}

		this.enabled = true;
		this.width = config.camera_motion_detection_capture_width;
		this.height = config.camera_motion_detection_capture_height;
		this.threshold = this.width * this.height * config.camera_motion_detection_threshold * 0.01;
		this.captureInterval = config.camera_motion_detection_capture_interval * 1000;

		this.videoElement.width = this.width;
		this.videoElement.height = this.height;
		this.canvasElement.width = this.width;
		this.canvasElement.height = this.height;
		if (config.camera_motion_detection_capture_visible) {
			this.canvasElement.style.position = "fixed";
			this.canvasElement.style.top = 0;
			this.canvasElement.style.left = 0;
			this.canvasElement.style.zIndex = 10000;
			this.canvasElement.style.border = "1px solid black";
			this.canvasElement.style.display = "block";
		} else {
			this.canvasElement.style.display = "none";
		}

		navigator.mediaDevices
			.getUserMedia({
				audio: false,
				video: {
					facingMode: { ideal: config.camera_motion_detection_facing_mode },
					width: this.width,
					height: this.height
				}
			})
			.then((stream) => {
				this.videoElement.srcObject = stream;
				this.videoElement.play();
				if (this.enabled) {
					setInterval(this.capture.bind(this), this.captureInterval);
				}
			})
			.catch((err) => {
				logger.error("Camera motion detection error:", err);
			});
	}

	stop() {
		if (!this.enabled) {
			return;
		}
		this.enabled = false;
		this.videoElement.pause();
		this.videoElement.srcObject.getTracks().forEach((track) => {
			track.stop();
		});
	}
}

function mergeConfig(target, ...sources) {
	// https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
	if (!sources.length) return target;
	const source = sources.shift();

	if (isObject(target) && isObject(source)) {
		for (let key in source) {
			let val = source[key];
			if (key == "image_excludes") {
				logger.warn(
					"The configuration option 'image_excludes' has been renamed to 'exclude_filenames'. Please update your wallpanel configuration accordingly."
				);
				key = "exclude_filenames";
			}

			if (isObject(val)) {
				if (!target[key]) Object.assign(target, { [key]: {} });
				mergeConfig(target[key], val);
			} else {
				function replacer(match, entityId) {
					if (!(entityId in configEntityStates)) {
						configEntityStates[entityId] = "";
						const entity = elHass.__hass.states[entityId];
						if (entity) {
							configEntityStates[entityId] = entity.state;
						} else {
							logger.error(`Entity used in placeholder not found: ${entityId} (${match})`);
						}
					}
					const state = configEntityStates[entityId];
					logger.debug(`Replace ${match} with ${state}`);
					return state;
				}
				if (typeof val === "string" || val instanceof String) {
					val = val.replace("${browser_id}", browserId ? browserId : "browser-id-unset");
					val = val.replace(/\$\{entity:\s*([^}]+\.[^}]+)\}/g, replacer);
				}
				if (typeof target[key] === "boolean") {
					val = ["true", "on", "yes", "1"].includes(val.toString());
				}
				Object.assign(target, { [key]: val });
			}
		}
	}
	return mergeConfig(target, ...sources);
}

function updateConfig() {
	const params = new URLSearchParams(window.location.search);

	const oldConfig = config;
	config = {};
	mergeConfig(config, defaultConfig);

	if (Object.keys(dashboardConfig).length === 0) {
		dashboardConfig = getDashboardWallpanelConfig();
		if (Object.keys(dashboardConfig).length === 0) {
			logger.debug("No wallpanel config found in dashboard config");
		}
	}

	mergeConfig(config, dashboardConfig);

	const paramConfig = {};
	for (let [key, value] of params) {
		if (key.startsWith("wp_")) {
			key = key.substring(3);
			if (key in defaultConfig && value) {
				// Convert to the right type
				try {
					value = JSON.parse(value);
				} catch {
					// Invalid JSON, just take the string
				}
				paramConfig[key] = defaultConfig[key].constructor(value);
			}
		}
	}
	config = mergeConfig(config, paramConfig);
	const profile = config.profile;

	if (config.profiles && profile && config.profiles[profile]) {
		config = mergeConfig(config, config.profiles[profile]);
		logger.debug(`Profile set from config: ${profile}`);
	}
	if (config.profiles && browserId && config.profiles[`device.${browserId}`]) {
		const profile = `device.${browserId}`;
		config = mergeConfig(config, config.profiles[profile]);
		logger.debug(`Profile set from device: ${profile}`);
	}
	if (config.profiles) {
		const userIds = [userId, userName, userDisplayname];
		for (let i = 0; i < userIds.length; i++) {
			let user = userIds[i];
			if (user) {
				user = user.toLowerCase().replace(/\s/g, "_");
				if (config.profiles[`user.${user}`]) {
					const profile = `user.${user}`;
					config = mergeConfig(config, config.profiles[profile]);
					logger.debug(`Profile set from user: ${profile}`);
					break;
				}
			}
		}
	}
	config = mergeConfig(config, paramConfig);
	const profile_entity = config.profile_entity;
	if (
		config.profiles &&
		profile_entity &&
		elHass.__hass.states[profile_entity] &&
		config.profiles[elHass.__hass.states[profile_entity].state]
	) {
		const profile = elHass.__hass.states[profile_entity].state;
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
			config.image_url = config.image_url.replace(/\/+$/, "");
		}
		if (imageSourceType() == "unsplash-api" && config.image_list_update_interval < 90) {
			// Unsplash API currently places a limit of 50 requests per hour
			config.image_list_update_interval = 90;
		}
	} else {
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

	if (!oldConfig || !Object.keys(oldConfig).length) {
		// Keep old log level to get log messages when navigating between different dashboards
		logger.logLevel = config.log_level_console;
	}
	logger.debug("Wallpanel config is now:", config);

	if (wallpanel) {
		if (isActive()) {
			wallpanel.reconfigure(oldConfig);
		} else if (wallpanel.screensaverRunning && wallpanel.screensaverRunning()) {
			wallpanel.stopScreensaver();
		}
	}
}

function getActiveBrowserModPopup() {
	if (!browserId) {
		return null;
	}
	const bmp = document.getElementsByTagName("browser-mod-popup");
	if (!bmp || !bmp[0] || !bmp[0].shadowRoot || bmp[0].shadowRoot.children.length == 0) {
		return null;
	}
	return bmp[0];
}

function isActive() {
	const params = new URLSearchParams(window.location.search);
	if (params.get("edit") == "1") {
		logger.debug("Edit mode active");
		return false;
	}
	if (!config.enabled) {
		logger.debug("Wallpanel not enabled in config");
		return false;
	}
	if (
		config.enabled_on_tabs &&
		config.enabled_on_tabs.length > 0 &&
		activeTab &&
		!config.enabled_on_tabs.includes(activeTab)
	) {
		logger.debug(`Wallpanel not enabled on current tab ${activeTab}`);
		return false;
	}
	if (
		wallpanel &&
		wallpanel.disable_screensaver_on_browser_mod_popup_function &&
		getActiveBrowserModPopup() &&
		wallpanel.disable_screensaver_on_browser_mod_popup_function(getActiveBrowserModPopup())
	) {
		logger.debug("Browser mod popup function returned true, wallpanel disabled");
		return false;
	}
	if (config.disable_screensaver_on_browser_mod_popup && getActiveBrowserModPopup()) {
		logger.debug("Browser mod popup active, wallpanel disabled");
		return false;
	}
	return true;
}

function imageSourceType() {
	if (!config.show_images || !config.image_url) {
		return "";
	}
	if (config.image_url.startsWith("media-entity://")) return "media-entity";
	if (config.image_url.startsWith("media-source://")) return "media-source";
	if (config.image_url.startsWith("https://api.unsplash")) return "unsplash-api";
	if (config.image_url.startsWith("immich+")) return "immich-api";
	if (config.image_url.startsWith("iframe+")) return "iframe";
	return "url";
}

function getHaPanelLovelace() {
	try {
		return elHaMain.shadowRoot.querySelector("ha-panel-lovelace");
	} catch (err) {
		logger.error("Failed to get ha-panel-lovelace:", err);
	}
}

function getDashboardWallpanelConfig(keys = []) {
	const pl = getHaPanelLovelace();
	const conf = {};
	if (pl && pl.lovelace) {
		let wallpanelConfig;
		if (pl.lovelace.config && pl.lovelace.config.wallpanel) {
			wallpanelConfig = pl.lovelace.config.wallpanel;
		} else if (pl.lovelace.rawConfig && pl.lovelace.rawConfig.wallpanel) {
			wallpanelConfig = pl.lovelace.rawConfig.wallpanel;
		}
		if (wallpanelConfig) {
			if (keys.length === 0) {
				keys = Object.keys(wallpanelConfig);
			}
			keys.forEach((key) => {
				if (key in defaultConfig) {
					conf[key] = wallpanelConfig[key];
				}
			});
		}
	}
	return conf;
}

function setSidebarVisibility(hidden) {
	logger.debug(`setSidebarVisibility: hidden=${hidden}`);
	try {
		const panelLovelace = elHaMain.shadowRoot.querySelector("ha-panel-lovelace");
		if (panelLovelace) {
			const huiRoot = panelLovelace.shadowRoot.querySelector("hui-root");
			if (huiRoot) {
				const menuButton = huiRoot.shadowRoot.querySelector("ha-menu-button");
				if (menuButton) {
					if (hidden) {
						menuButton.style.display = "none";
					} else {
						menuButton.style.removeProperty("display");
					}
				}
			}
		}
	} catch (e) {
		logger.warn(e);
	}

	try {
		const aside = elHaMain.shadowRoot.querySelector("ha-drawer").shadowRoot.querySelector("aside");
		aside.style.display = hidden ? "none" : "";
		if (hidden) {
			elHaMain.style.setProperty("--mdc-drawer-width", "env(safe-area-inset-left)");
		} else {
			elHaMain.style.removeProperty("--mdc-drawer-width");
		}
		window.dispatchEvent(new Event("resize"));
	} catch (e) {
		logger.warn(e);
	}
}

function setToolbarVisibility(hideToolbar, hideActionItems) {
	logger.debug(`setToolbarVisibility: hideToolbar=${hideToolbar}, hideActionItems=${hideActionItems}`);
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
		if (hideToolbar) {
			appToolbar.style.setProperty("display", "none");
			if (!config.keep_toolbar_space) {
				view.style.minHeight = "100vh";
				view.style.marginTop = "0";
				view.style.paddingTop = "0";
			}
		} else {
			appToolbar.style.removeProperty("display");
			view.style.removeProperty("min-height");
			view.style.removeProperty("margin-top");
			view.style.removeProperty("padding-top");
			const actionItems = appToolbar.querySelector("div.action-items");
			if (hideActionItems) {
				actionItems.style.setProperty("display", "none");
			} else {
				actionItems.style.setProperty("display", "flex");
			}
		}
		window.dispatchEvent(new Event("resize"));
	} catch (e) {
		logger.warn(e);
	}
}

function navigate(path, keepSearch = true) {
	if (keepSearch && !path.includes("?")) {
		path += window.location.search;
	}
	history.pushState(null, "", path);
	elHass.dispatchEvent(
		new Event("location-changed", {
			bubbles: true,
			cancelable: false,
			composed: true
		})
	);
}

document.addEventListener("fullscreenerror", () => {
	logger.error("Failed to enter fullscreen");
});

document.addEventListener("fullscreenchange", () => {
	if (typeof document.webkitCurrentFullScreenElement !== "undefined") {
		fullscreen = Boolean(document.webkitCurrentFullScreenElement);
	} else if (typeof document.fullscreenElement !== "undefined") {
		fullscreen = Boolean(document.fullscreenElement);
	}
});

function enterFullscreen() {
	logger.debug("Enter fullscreen");
	// Will need user input event to work
	const el = document.documentElement;
	if (el.requestFullscreen) {
		el.requestFullscreen().then(
			() => {
				logger.debug("Successfully requested fullscreen");
			},
			(error) => {
				logger.error("Failed to enter fullscreen:", error);
			}
		);
	} else if (el.mozRequestFullScreen) {
		el.mozRequestFullScreen();
	} else if (el.msRequestFullscreen) {
		el.msRequestFullscreen();
	} else if (el.webkitRequestFullscreen) {
		el.webkitRequestFullscreen();
	}
}

function initWallpanel() {
	const HuiView = customElements.get("hui-view");
	if (!HuiView) {
		const error = "Failed to get hui-view from customElements";
		throw new Error(error);
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
			this.lastProfileSet = config.profile;
			this.lastMove = null;
			this.lastCorner = 0; // 0 - top left, 1 - bottom left, 2 - bottom right, 3 - top right
			this.translateInterval = null;
			this.lastClickTime = 0;
			this.clickCount = 0;
			this.touchStartX = -1;
			this.energyCollectionUpdateEnabled = false;
			this.energyCollectionUpdateInterval = 60;
			this.lastEnergyCollectionUpdate = 0;
			this.screensaverStopNavigationPathTimeout = null;
			this.disable_screensaver_on_browser_mod_popup_function = null;

			this.screenWakeLock = new ScreenWakeLock();
			this.cameraMotionDetection = new CameraMotionDetection();

			this.lovelace = null;
			this.__hass = elHass.__hass;
			this.__cards = [];
			this.__badges = [];
			this.__views = [];

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
			const profileUpdated = this.updateProfile();
			if (!profileUpdated && changed) {
				updateConfig();
			}

			if (!isActive()) {
				return;
			}

			const screensaver_entity = config.screensaver_entity;

			if (screensaver_entity && this.__hass.states[screensaver_entity]) {
				const lastChanged = new Date(this.__hass.states[screensaver_entity].last_changed);
				const state = this.__hass.states[screensaver_entity].state;

				if (state == "off" && this.screensaverStartedAt && lastChanged.getTime() - this.screensaverStartedAt > 0) {
					this.stopScreensaver(config.fade_out_time_screensaver_entity);
				} else if (
					state == "on" &&
					this.screensaverStoppedAt &&
					lastChanged.getTime() - this.screensaverStoppedAt > 0
				) {
					this.startScreensaver();
				}
			}

			if (this.screensaverRunning()) {
				this.__cards.forEach((card) => {
					card.hass = this.hass;
				});
				this.__badges.forEach((badge) => {
					badge.hass = this.hass;
				});
				this.__views.forEach((view) => {
					view.hass = this.hass;
				});

				if (imageSourceType() == "media-entity") {
					this.switchActiveImage("entity_update");
				}
			}
		}

		get hass() {
			return this.__hass;
		}

		setScreensaverEntityState() {
			const screensaver_entity = config.screensaver_entity;
			if (!screensaver_entity || !this.__hass.states[screensaver_entity]) return;
			if (this.screensaverRunning() && this.__hass.states[screensaver_entity].state == "on") return;
			if (!this.screensaverRunning() && this.__hass.states[screensaver_entity].state == "off") return;

			const service = this.screensaverRunning() ? "turn_on" : "turn_off";
			logger.debug("Updating screensaver_entity", screensaver_entity, service);
			this.__hass
				.callService("input_boolean", service, {
					entity_id: screensaver_entity
				})
				.then(
					(result) => {
						logger.debug(result);
					},
					(error) => {
						logger.error("Failed to set screensaver entity state:", error);
					}
				);
		}

		setImageURLEntityState() {
			const image_url_entity = config.image_url_entity;
			if (!image_url_entity || !this.__hass.states[image_url_entity]) return;
			const activeImage = this.getActiveImageElement();
			if (!activeImage || !activeImage.imageUrl) return;

			logger.debug("Updating image_url_entity", image_url_entity, activeImage.imageUrl);
			this.__hass
				.callService("input_text", "set_value", {
					entity_id: image_url_entity,
					value: activeImage.imageUrl
				})
				.then(
					(result) => {
						logger.debug(result);
					},
					(error) => {
						logger.error("Failed to set image url entity state:", error);
					}
				);
		}

		updateProfile() {
			const profile_entity = config.profile_entity;
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
				if (config.disable_screensaver_on_browser_mod_popup && getActiveBrowserModPopup()) {
					this.stopScreensaver(config.fade_out_time_browser_mod_popup);
				} else {
					this.updateScreensaver();
				}
			} else if (isActive()) {
				if (config.idle_time > 0 && Date.now() - this.idleSince >= config.idle_time * 1000) {
					this.startScreensaver();
				}
			}
		}

		setDefaultStyle() {
			this.messageBox.removeAttribute("style");
			this.messageBox.style.position = "fixed";
			this.messageBox.style.pointerEvents = "none";
			this.messageBox.style.top = 0;
			this.messageBox.style.left = 0;
			this.messageBox.style.width = "100%";
			this.messageBox.style.height = "10%";
			this.messageBox.style.zIndex = this.style.zIndex + 1;
			if (!this.screensaverRunning()) {
				this.messageBox.style.visibility = "hidden";
			}
			//this.messageBox.style.margin = '5vh auto auto auto';
			this.messageBox.style.padding = "5vh 0 0 0";
			this.messageBox.style.fontSize = "5vh";
			this.messageBox.style.textAlign = "center";
			this.messageBox.style.transition = "visibility 200ms ease-in-out";

			this.debugBox.removeAttribute("style");
			this.debugBox.style.position = "fixed";
			this.debugBox.style.pointerEvents = "none";
			this.debugBox.style.top = "0%";
			this.debugBox.style.left = "0%";
			this.debugBox.style.width = "100%";
			this.debugBox.style.height = "100%";
			this.debugBox.style.background = "#00000099";
			this.debugBox.style.color = "#ffffff";
			this.debugBox.style.zIndex = this.style.zIndex + 2;
			if (!this.screensaverRunning()) {
				this.debugBox.style.visibility = "hidden";
			}
			this.debugBox.style.fontFamily = "monospace";
			this.debugBox.style.fontSize = "12px";
			this.debugBox.style.overflowWrap = "break-word";
			this.debugBox.style.overflowY = "auto";

			this.screensaverContainer.removeAttribute("style");
			this.screensaverContainer.style.position = "fixed";
			this.screensaverContainer.style.top = 0;
			this.screensaverContainer.style.left = 0;
			this.screensaverContainer.style.width = "100vw";
			this.screensaverContainer.style.height = "100vh";
			this.screensaverContainer.style.background = "#000000";

			if (!this.screensaverRunning()) {
				this.imageOneContainer.removeAttribute("style");
				this.imageOneContainer.style.opacity = 1;
			}
			this.imageOneContainer.style.position = "absolute";
			this.imageOneContainer.style.pointerEvents = "none";
			this.imageOneContainer.style.top = 0;
			this.imageOneContainer.style.left = 0;
			this.imageOneContainer.style.width = "100%";
			this.imageOneContainer.style.height = "100%";
			this.imageOneContainer.style.border = "none";

			this.imageOneBackground.style.position = "absolute";
			this.imageOneBackground.style.pointerEvents = "none";
			this.imageOneBackground.style.top = 0;
			this.imageOneBackground.style.left = 0;
			this.imageOneBackground.style.width = "100%";
			this.imageOneBackground.style.height = "100%";
			this.imageOneBackground.style.border = "none";

			if (!this.screensaverRunning()) {
				this.imageOne.removeAttribute("style");
			}
			this.imageOne.style.position = "relative";
			this.imageOne.style.pointerEvents = "none";
			this.imageOne.style.width = "100%";
			this.imageOne.style.height = "100%";
			this.imageOne.style.objectFit = "contain";
			this.imageOne.style.border = "none";

			this.imageOneInfoContainer.removeAttribute("style");
			this.imageOneInfoContainer.style.position = "absolute";
			this.imageOneInfoContainer.style.pointerEvents = "none";
			this.imageOneInfoContainer.style.top = 0;
			this.imageOneInfoContainer.style.left = 0;
			this.imageOneInfoContainer.style.width = "100%";
			this.imageOneInfoContainer.style.height = "100%";
			this.imageOneInfoContainer.style.border = "none";

			if (!this.screensaverRunning()) {
				this.imageTwoContainer.removeAttribute("style");
				this.imageTwoContainer.style.opacity = 0;
			}
			this.imageTwoContainer.style.position = "absolute";
			this.imageTwoContainer.style.pointerEvents = "none";
			this.imageTwoContainer.style.top = 0;
			this.imageTwoContainer.style.left = 0;
			this.imageTwoContainer.style.width = "100%";
			this.imageTwoContainer.style.height = "100%";
			this.imageTwoContainer.style.border = "none";

			this.imageTwoBackground.style.position = "absolute";
			this.imageTwoBackground.style.pointerEvents = "none";
			this.imageTwoBackground.style.top = 0;
			this.imageTwoBackground.style.left = 0;
			this.imageTwoBackground.style.width = "100%";
			this.imageTwoBackground.style.height = "100%";
			this.imageTwoBackground.style.border = "none";

			if (!this.screensaverRunning()) {
				this.imageTwo.removeAttribute("style");
			}
			this.imageTwo.style.position = "relative";
			this.imageTwo.style.pointerEvents = "none";
			this.imageTwo.style.width = "100%";
			this.imageTwo.style.height = "100%";
			this.imageTwo.style.objectFit = "contain";
			this.imageTwo.style.border = "none";

			this.imageTwoInfoContainer.removeAttribute("style");
			this.imageTwoInfoContainer.style.position = "absolute";
			this.imageTwoInfoContainer.style.pointerEvents = "none";
			this.imageTwoInfoContainer.style.top = 0;
			this.imageTwoInfoContainer.style.left = 0;
			this.imageTwoInfoContainer.style.width = "100%";
			this.imageTwoInfoContainer.style.height = "100%";
			this.imageTwoInfoContainer.style.border = "none";

			this.screensaverImageOverlay.removeAttribute("style");
			this.screensaverImageOverlay.style.position = "absolute";
			if (config.card_interaction) {
				this.screensaverImageOverlay.style.pointerEvents = "none";
			}
			this.screensaverImageOverlay.style.top = 0;
			this.screensaverImageOverlay.style.left = 0;
			this.screensaverImageOverlay.style.width = "100%";
			this.screensaverImageOverlay.style.height = "100%";
			this.screensaverImageOverlay.style.background = "#00000000";

			this.infoContainer.removeAttribute("style");
			this.infoContainer.style.position = "absolute";
			this.infoContainer.style.pointerEvents = "none";
			this.infoContainer.style.top = 0;
			this.infoContainer.style.left = 0;
			this.infoContainer.style.width = "100%";
			this.infoContainer.style.height = "100%";
			this.infoContainer.style.transition = "opacity 2000ms ease-in-out";
			this.infoContainer.style.padding = "25px";
			this.infoContainer.style.boxSizing = "border-box";

			this.infoBox.removeAttribute("style");
			this.infoBox.style.pointerEvents = "none";
			this.infoBox.style.width = "fit-content";
			this.infoBox.style.maxHeight = "100%";
			this.infoBox.style.borderRadius = "10px";
			this.infoBox.style.overflowY = "auto";
			this.infoBox.style.scrollbarWidth = "none";
			this.infoBox.style.setProperty("--wp-card-width", "500px");
			this.infoBox.style.setProperty("--wp-card-padding", "0");
			this.infoBox.style.setProperty("--wp-card-margin", "5px");
			this.infoBox.style.setProperty("--wp-card-backdrop-filter", "none");
			this.infoBox.style.setProperty("--wp-badges-minwidth", "200px");

			this.infoBoxPosX.style.height = "100%";
			this.infoBoxPosX.style.width = "100%";

			this.infoBoxPosY.style.height = "100%";
			this.infoBoxPosY.style.width = "100%";

			this.infoBoxContent.style.width = "fit-content";
			this.infoBoxContent.style.height = "100%";
			this.infoBoxContent.style.display = "grid";

			this.fixedInfoContainer.removeAttribute("style");
			this.fixedInfoContainer.style.position = "fixed";
			this.fixedInfoContainer.style.pointerEvents = "none";
			this.fixedInfoContainer.style.top = 0;
			this.fixedInfoContainer.style.left = 0;
			this.fixedInfoContainer.style.width = "100%";
			this.fixedInfoContainer.style.height = "100%";

			this.fixedInfoBox.style.cssText = this.infoBox.style.cssText;
			this.fixedInfoBox.style.pointerEvents = "none";

			this.screensaverOverlay.removeAttribute("style");
			this.screensaverOverlay.style.position = "absolute";
			if (config.card_interaction) {
				this.screensaverOverlay.style.pointerEvents = "none";
			}
			this.screensaverOverlay.style.top = 0;
			this.screensaverOverlay.style.left = 0;
			this.screensaverOverlay.style.width = "100%";
			this.screensaverOverlay.style.height = "100%";
			this.screensaverOverlay.style.background = "#00000000";
		}

		updateStyle() {
			this.screensaverOverlay.style.background = "#00000000";
			this.debugBox.style.visibility = config.debug ? "visible" : "hidden";
			//this.screensaverContainer.style.transition = `opacity ${Math.round(config.fade_in_time*1000)}ms ease-in-out`;
			this.style.transition = `opacity ${Math.round(config.fade_in_time * 1000)}ms ease-in-out`;
			this.imageOneContainer.style.transition = `opacity ${Math.round(config.crossfade_time * 1000)}ms ease-in-out`;
			this.imageTwoContainer.style.transition = `opacity ${Math.round(config.crossfade_time * 1000)}ms ease-in-out`;
			this.imageOne.style.objectFit = config.image_fit;
			this.imageTwo.style.objectFit = config.image_fit;

			if (config.info_animation_duration_x) {
				this.infoBoxPosX.style.animation = `moveX ${config.info_animation_duration_x}s ${config.info_animation_timing_function_x} infinite alternate`;
			} else {
				this.infoBoxPosX.style.animation = "";
			}

			if (config.info_animation_duration_y) {
				this.infoBoxPosY.style.animation = `moveY ${config.info_animation_duration_y}s ${config.info_animation_timing_function_y} infinite alternate`;
			} else {
				this.infoBoxPosY.style.animation = "";
			}

			if (config.style) {
				for (const elId in config.style) {
					if (
						elId.startsWith("wallpanel-") &&
						elId != "wallpanel-shadow-host" &&
						elId != "wallpanel-screensaver-info-box-badges" &&
						elId != "wallpanel-screensaver-info-box-views" &&
						!classStyles[elId]
					) {
						const el = this.shadowRoot.getElementById(elId);
						if (el) {
							logger.debug(`Setting style attributes for element #${elId}`);
							for (const attr in config.style[elId]) {
								logger.debug(`Setting style attribute ${attr} to ${config.style[elId][attr]}`);
								el.style.setProperty(attr, config.style[elId][attr]);
							}
							if (el == this.infoBox) {
								this.fixedInfoBox.style.cssText = this.infoBox.style.cssText;
							} else if (el == this.infoBoxContent) {
								this.fixedInfoBoxContent.style.cssText = this.infoBoxContent.style.cssText;
							}
						} else {
							logger.error(`Element #${elId} not found`);
						}
					}
				}
			}
		}

		updateShadowStyle() {
			const computed = getComputedStyle(this.infoContainer);
			const maxX =
				this.infoContainer.offsetWidth -
				parseInt(computed.paddingLeft) -
				parseInt(computed.paddingRight) -
				this.infoBox.offsetWidth;
			const maxY =
				this.infoContainer.offsetHeight -
				parseInt(computed.paddingTop) -
				parseInt(computed.paddingBottom) -
				this.infoBox.offsetHeight;
			let host = "";

			if (config.style) {
				if (config.style["wallpanel-shadow-host"]) {
					for (const attr in config.style["wallpanel-shadow-host"]) {
						host += `${attr}: ${config.style["wallpanel-shadow-host"][attr]};\n`;
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
			`;
		}

		randomMove() {
			const computed = getComputedStyle(this.infoContainer);
			const maxX =
				this.infoContainer.offsetWidth -
				parseInt(computed.paddingLeft) -
				parseInt(computed.paddingRight) -
				this.infoBox.offsetWidth;
			const maxY =
				this.infoContainer.offsetHeight -
				parseInt(computed.paddingTop) -
				parseInt(computed.paddingBottom) -
				this.infoBox.offsetHeight;
			const x = Math.floor(Math.random() * maxX);
			const y = Math.floor(Math.random() * maxY);
			this.moveInfoBox(x, y);
		}

		moveAroundCorners(correctPostion = false) {
			let fadeDuration = null;
			if (correctPostion) {
				fadeDuration = 0;
			} else {
				this.lastCorner = (this.lastCorner + 1) % 4;
			}
			const computed = getComputedStyle(this.infoContainer);
			const x = [2, 3].includes(this.lastCorner)
				? this.infoContainer.offsetWidth -
					parseInt(computed.paddingLeft) -
					parseInt(computed.paddingRight) -
					this.infoBox.offsetWidth
				: 0;
			const y = [1, 2].includes(this.lastCorner)
				? this.infoContainer.offsetHeight -
					parseInt(computed.paddingTop) -
					parseInt(computed.paddingBottom) -
					this.infoBox.offsetHeight
				: 0;
			this.moveInfoBox(x, y, fadeDuration);
		}

		moveInfoBox(x, y, fadeDuration = null) {
			this.lastMove = Date.now();
			if (fadeDuration === null) {
				fadeDuration = config.info_move_fade_duration;
			}
			if (fadeDuration > 0) {
				if (this.infoBox.animate) {
					const keyframes = [{ opacity: 1 }, { opacity: 0, offset: 0.5 }, { opacity: 1 }];
					this.infoBox.animate(keyframes, {
						duration: Math.round(fadeDuration * 1000),
						iterations: 1
					});
				} else {
					logger.warn("This browser does not support the animate() method, please set info_move_fade_duration to 0");
				}
			}
			const wp = this;
			let ms = Math.round(fadeDuration * 500);
			if (ms < 0) {
				ms = 0;
			}
			if (wp.translateInterval) {
				clearInterval(wp.translateInterval);
			}
			wp.translateInterval = setInterval(function () {
				wp.infoBoxPosX.style.transform = `translate3d(${x}px, 0, 0)`;
				wp.infoBoxPosY.style.transform = `translate3d(0, ${y}px, 0)`;
			}, ms);
		}

		createInfoBoxContent() {
			logger.debug("Creating info box content");
			const haPanelLovelace = getHaPanelLovelace();
			if (!haPanelLovelace) {
				return;
			}
			this.lovelace = haPanelLovelace.__lovelace;
			this.infoBoxContentCreatedDate = new Date();
			this.infoBoxContent.innerHTML = "";
			this.__badges = [];
			this.__cards = [];
			this.__views = [];
			this.energyCollectionUpdateEnabled = false;

			this.shadowRoot.querySelectorAll(".wp-card").forEach((card) => {
				card.parentElement.removeChild(card);
			});

			if (config.badges && config.badges.length > 0) {
				const div = document.createElement("div");
				div.id = "wallpanel-screensaver-info-box-badges";
				div.classList.add("wp-badges");
				div.style.padding = "var(--wp-card-padding)";
				div.style.margin = "var(--wp-card-margin)";
				div.style.textAlign = "center";
				div.style.display = "flex";
				div.style.alignItems = "flex-start";
				div.style.flexWrap = "wrap";
				div.style.justifyContent = "center";
				div.style.gap = "8px";
				div.style.margin = "0px";
				div.style.minWidth = "var(--wp-badges-minwidth)";
				if (config.style[div.id]) {
					for (const attr in config.style[div.id]) {
						logger.debug(`Setting style attribute ${attr} to ${config.style[div.id][attr]}`);
						div.style.setProperty(attr, config.style[div.id][attr]);
					}
				}
				config.badges.forEach((badge) => {
					const badgeConfig = JSON.parse(JSON.stringify(badge));
					logger.debug("Creating badge:", badgeConfig);
					let style = {};
					if (badgeConfig.wp_style) {
						style = badgeConfig.wp_style;
						delete badgeConfig.wp_style;
					}
					const createBadgeElement = this._createBadgeElement ? this._createBadgeElement : this.createBadgeElement;
					const badgeElement = createBadgeElement.bind(this)(badgeConfig);
					badgeElement.hass = this.hass;
					for (const attr in style) {
						badgeElement.style.setProperty(attr, style[attr]);
					}
					this.__badges.push(badgeElement);
					div.append(badgeElement);
				});
				this.infoBoxContent.appendChild(div);
			}

			if (config.views && config.views.length > 0) {
				const div = document.createElement("div");
				div.id = "wallpanel-screensaver-info-box-views";
				div.classList.add("wp-views");
				if (config.style[div.id]) {
					for (const attr in config.style[div.id]) {
						logger.debug(`Setting style attribute ${attr} to ${config.style[div.id][attr]}`);
						div.style.setProperty(attr, config.style[div.id][attr]);
					}
				}

				const viewConfigs = this.lovelace.config.views;
				config.views.forEach((view) => {
					let viewIndex = -1;
					const viewConfig = JSON.parse(JSON.stringify(view));
					for (var i = 0; i < viewConfigs.length; i++) {
						if (
							(viewConfigs[i].path && view.path && viewConfigs[i].path.toLowerCase() == view.path.toLowerCase()) ||
							(viewConfigs[i].title && view.title && viewConfigs[i].title.toLowerCase() == view.title.toLowerCase())
						) {
							viewIndex = i;
							viewConfig.title = viewConfigs[i].title;
							viewConfig.path = viewConfigs[i].path;
							break;
						}
					}
					if (viewIndex == -1) {
						logger.error(`View with path '${viewConfig.path}' / tile '${viewConfig.title}' not found`);
						viewIndex = 0;
					}

					const viewElement = document.createElement("hui-view");
					viewElement.route = { prefix: "/" + activePanel, path: "/" + view.path };
					viewElement.lovelace = this.lovelace;
					viewElement.panel = this.hass.panels[activePanel];
					viewElement.hass = this.hass;
					viewElement.index = viewIndex;
					if (typeof viewConfig.narrow == "boolean") {
						viewElement.narrow = viewConfig.narrow;
					}
					this.__views.push(viewElement);

					const viewContainer = document.createElement("div");
					if (config.card_interaction) {
						viewElement.style.pointerEvents = "initial";
					}
					if (viewConfig.wp_style) {
						for (const attr in viewConfig.wp_style) {
							viewContainer.style.setProperty(attr, viewConfig.wp_style[attr]);
						}
					}

					viewContainer.append(viewElement);
					div.append(viewContainer);
				});
				this.infoBoxContent.appendChild(div);
			}

			if (config.cards && config.cards.length > 0) {
				config.cards.forEach((card) => {
					// Copy object
					const cardConfig = JSON.parse(JSON.stringify(card));
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
					const cardContainer = document.createElement("div");
					cardContainer.classList.add("wp-card");
					cardContainer.style.width = "var(--wp-card-width)";
					cardContainer.style.padding = "var(--wp-card-padding)";
					cardContainer.style.margin = "var(--wp-card-margin)";
					cardContainer.style.backdropFilter = "var(--wp-card-backdrop-filter)";

					if (config.card_interaction) {
						cardContainer.style.pointerEvents = "initial";
					}
					for (const attr in style) {
						if (attr == "parent") {
							const pel = this.shadowRoot.getElementById(style[attr]);
							if (pel) {
								parent = pel;
							}
						} else {
							cardContainer.style.setProperty(attr, style[attr]);
						}
					}

					cardContainer.append(cardElement);
					parent.appendChild(cardContainer);
				});
			}

			setTimeout(this.updateShadowStyle.bind(this), 500);
		}

		restartProgressBarAnimation() {
			if (!this.progressBarContainer) {
				return;
			}
			this.progressBar.style.animation = "none";
			if (!config.show_progress_bar) {
				return;
			}
			const wp = this;
			setTimeout(function () {
				// Restart CSS animation.
				wp.progressBar.style.animation = `horizontalProgress ${config.display_time}s linear`;
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
			setTimeout(function () {
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

		handleMediaError(medialElem, error) {
			medialElem.setAttribute("data-loading", false);
			logger.error("Error while loding image:", error);

			if (medialElem.imageUrl) {
				const idx = this.imageList.indexOf(medialElem.imageUrl);
				if (idx > -1) {
					logger.debug(`Removing media from list: ${medialElem.imageUrl}`);
					this.imageList.splice(idx, 1);
				}
				this.updateImage(medialElem);
			} else {
				this.displayMessage(`Failed to load media: ${medialElem.src}`, 5000);
			}
		}

		loadBackgroundImage(medialElem) {
			const isVideo = medialElem.tagName.toLowerCase() === "video";
			let srcImageUrl = medialElem.src;
			if (isVideo) {
				// Capture the current frame of the video as a background image
				const canvas = document.createElement("canvas");
				canvas.width = medialElem.videoWidth;
				canvas.height = medialElem.videoHeight;

				const ctx = canvas.getContext("2d");
				ctx.drawImage(medialElem, 0, 0, canvas.width, canvas.height);
				try {
					srcImageUrl = canvas.toDataURL("image/png");
				} catch (err) {
					srcImageUrl = null;
					logger.error("Error extracting canvas image:", err);
				}
			}
			let cont = this.imageOneBackground;
			if (medialElem == this.imageTwo) {
				cont = this.imageTwoBackground;
			}
			cont.style.backgroundImage = srcImageUrl ? `url(${srcImageUrl})` : "";
		}

		handleMediaLoaded(medialElem) {
			medialElem.setAttribute("data-loading", false);
			const isVideo = medialElem.tagName.toLowerCase() === "video";
			const wp = this;
			if (config.image_background === "image") {
				if (isVideo) {
					if (medialElem.readyState >= medialElem.HAVE_CURRENT_DATA) {
						wp.loadBackgroundImage(medialElem);
					} else {
						medialElem.addEventListener("canplay", function () {
							wp.loadBackgroundImage(medialElem);
						});
					}
				} else {
					wp.loadBackgroundImage(medialElem);
				}
			}
			if (!isVideo && config.show_image_info && /.*\.jpe?g$/i.test(medialElem.imageUrl)) {
				wp.fetchEXIFInfo(medialElem);
			}
		}

		connectedCallback() {
			this.style.zIndex = config.z_index;
			this.style.visibility = "hidden";
			this.style.opacity = 0;
			this.style.position = "fixed";

			this.messageBox = document.createElement("div");
			this.messageBox.id = "wallpanel-message-box";

			this.debugBox = document.createElement("div");
			this.debugBox.id = "wallpanel-debug-box";

			this.screensaverContainer = document.createElement("div");
			this.screensaverContainer.id = "wallpanel-screensaver-container";

			this.imageOneContainer = document.createElement("div");
			this.imageOneContainer.id = "wallpanel-screensaver-image-one-container";

			this.imageOneBackground = document.createElement("div");
			this.imageOneBackground.className = "wallpanel-screensaver-image-background";
			this.imageOneBackground.id = "wallpanel-screensaver-image-one-background";

			this.imageOne = document.createElement("img");
			this.imageOne.id = "wallpanel-screensaver-image-one";
			this.imageOne.setAttribute("data-loading", false);

			this.imageOneInfoContainer = document.createElement("div");
			this.imageOneInfoContainer.id = "wallpanel-screensaver-image-one-info-container";

			this.imageOneInfo = document.createElement("div");
			this.imageOneInfo.className = "wallpanel-screensaver-image-info";
			this.imageOneInfo.id = "wallpanel-screensaver-image-one-info";

			this.imageOneInfoContainer.appendChild(this.imageOneInfo);
			this.imageOneContainer.appendChild(this.imageOneBackground);
			this.imageOneContainer.appendChild(this.imageOne);
			this.imageOneContainer.appendChild(this.imageOneInfoContainer);
			this.screensaverContainer.appendChild(this.imageOneContainer);

			this.imageTwoContainer = document.createElement("div");
			this.imageTwoContainer.id = "wallpanel-screensaver-image-two-container";

			this.imageTwoBackground = document.createElement("div");
			this.imageTwoBackground.className = "wallpanel-screensaver-image-background";
			this.imageTwoBackground.id = "wallpanel-screensaver-image-two-background";

			this.imageTwo = document.createElement("img");
			this.imageTwo.id = "wallpanel-screensaver-image-two";
			this.imageTwo.setAttribute("data-loading", false);

			this.imageTwoInfoContainer = document.createElement("div");
			this.imageTwoInfoContainer.id = "wallpanel-screensaver-image-two-info-container";

			this.imageTwoInfo = document.createElement("div");
			this.imageTwoInfo.className = "wallpanel-screensaver-image-info";
			this.imageTwoInfo.id = "wallpanel-screensaver-image-two-info";

			this.imageTwoInfoContainer.appendChild(this.imageTwoInfo);
			this.imageTwoContainer.appendChild(this.imageTwoBackground);
			this.imageTwoContainer.appendChild(this.imageTwo);
			this.imageTwoContainer.appendChild(this.imageTwoInfoContainer);
			this.screensaverContainer.appendChild(this.imageTwoContainer);

			this.screensaverImageOverlay = document.createElement("div");
			this.screensaverImageOverlay.id = "wallpanel-screensaver-image-overlay";
			this.screensaverContainer.appendChild(this.screensaverImageOverlay);

			this.progressBarContainer = document.createElement("div");
			this.progressBarContainer.className = "wallpanel-progress";
			this.progressBar = document.createElement("div");
			this.progressBar.className = "wallpanel-progress-inner";
			this.progressBar.id = "wallpanel-progress-inner";
			this.progressBarContainer.appendChild(this.progressBar);

			if (config.show_progress_bar) {
				this.screensaverContainer.appendChild(this.progressBarContainer);
			}

			this.infoContainer = document.createElement("div");
			this.infoContainer.id = "wallpanel-screensaver-info-container";

			this.fixedInfoContainer = document.createElement("div");
			this.fixedInfoContainer.id = "wallpanel-screensaver-fixed-info-container";

			this.fixedInfoBox = document.createElement("div");
			this.fixedInfoBox.id = "wallpanel-screensaver-fixed-info-box";

			this.fixedInfoBoxContent = document.createElement("div");
			this.fixedInfoBoxContent.id = "wallpanel-screensaver-fixed-info-box-content";

			this.screensaverContainer.appendChild(this.infoContainer);

			this.infoBoxPosX = document.createElement("div");
			this.infoBoxPosX.id = "wallpanel-screensaver-info-box-pos-x";
			this.infoBoxPosX.x = "0";

			this.infoBoxPosY = document.createElement("div");
			this.infoBoxPosY.id = "wallpanel-screensaver-info-box-pos-y";
			this.infoBoxPosX.y = "0";

			this.infoBox = document.createElement("div");
			this.infoBox.id = "wallpanel-screensaver-info-box";

			this.infoBoxContent = document.createElement("div");
			this.infoBoxContent.id = "wallpanel-screensaver-info-box-content";
			this.infoBoxContent.style.display = "grid";

			this.infoBox.appendChild(this.infoBoxContent);
			this.infoBoxPosX.appendChild(this.infoBox);
			this.infoBoxPosY.appendChild(this.infoBoxPosX);
			this.infoContainer.appendChild(this.infoBoxPosY);

			this.fixedInfoBox.appendChild(this.fixedInfoBoxContent);
			this.fixedInfoContainer.appendChild(this.fixedInfoBox);
			this.infoContainer.appendChild(this.fixedInfoContainer);

			this.screensaverOverlay = document.createElement("div");
			this.screensaverOverlay.id = "wallpanel-screensaver-overlay";
			this.screensaverContainer.appendChild(this.screensaverOverlay);

			this.shadowStyle = document.createElement("style");

			const shadow = this.attachShadow({ mode: "open" });
			shadow.appendChild(this.shadowStyle);
			shadow.appendChild(this.screensaverContainer);
			shadow.appendChild(this.messageBox);
			shadow.appendChild(this.debugBox);

			const wp = this;
			const eventNames = ["click", "touchstart", "touchend", "wheel"];
			if (config.stop_screensaver_on_key_down) {
				eventNames.push("keydown");
			}
			if (config.stop_screensaver_on_mouse_move) {
				eventNames.push("mousemove");
			}
			eventNames.forEach(function (eventName) {
				window.addEventListener(
					eventName,
					(event) => {
						wp.handleInteractionEvent(event);
					},
					{ capture: true }
				);
			});
			window.addEventListener("resize", () => {
				if (wp.screensaverRunning()) {
					wp.updateShadowStyle();
				}
			});
			window.addEventListener("hass-more-info", () => {
				if (wp.screensaverRunning()) {
					wp.moreInfoDialogToForeground();
				}
			});
			const infoBoxResizeObserver = new ResizeObserver(() => {
				if (config.info_move_pattern === "corners") {
					// Correct position
					this.moveAroundCorners(true);
				}
			});
			infoBoxResizeObserver.observe(this.infoBoxContent);

			this.reconfigure();
			// Correct possibly incorrect entity state
			this.setScreensaverEntityState();
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
				if (oldConfig && Object.keys(oldConfig).length) {
					switchImages = true;
				}

				function preloadCallback(wp) {
					if (switchImages) {
						wp.switchActiveImage("init");
					} else {
						wp.startPlayingActiveMedia();
					}
				}
				if (["immich-api", "unsplash-api", "media-source"].includes(imageSourceType())) {
					this.updateImageList(true, preloadCallback);
				} else {
					this.imageList = [];
					this.preloadImages(preloadCallback);
				}
			}

			if (config.disable_screensaver_on_browser_mod_popup_func) {
				this.disable_screensaver_on_browser_mod_popup_function = new Function(
					"bmp",
					config.disable_screensaver_on_browser_mod_popup_func
				);
			}
			if (isActive() && config.camera_motion_detection_enabled) {
				this.cameraMotionDetection.start();
			} else {
				this.cameraMotionDetection.stop();
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
			const wp = this;
			if (imageInfoCache[img.imageUrl]) {
				return;
			}
			if (imageInfoCacheKeys.length >= imageInfoCacheMaxSize) {
				const oldest = imageInfoCacheKeys.shift();
				if (imageInfoCache[oldest]) {
					delete imageInfoCache[oldest];
				}
			}

			const tmpImg = document.createElement("img");
			tmpImg.src = img.src;
			tmpImg.imageUrl = img.imageUrl;
			getImageData(tmpImg, function () {
				logger.debug("EXIF data:", tmpImg.exifdata);
				imageInfoCacheKeys.push(tmpImg.imageUrl);
				imageInfoCache[tmpImg.imageUrl] = tmpImg.exifdata;
				wp.setImageDataInfo(tmpImg);

				const exifLong = tmpImg.exifdata["GPSLongitude"];
				const exifLat = tmpImg.exifdata["GPSLatitude"];
				if (config.fetch_address_data && exifLong && !isNaN(exifLong[0]) && exifLat && !isNaN(exifLat[0])) {
					let m = tmpImg.exifdata["GPSLatitudeRef"] == "S" ? -1 : 1;
					const latitude = exifLat[0] * m + (exifLat[1] * m * 60 + exifLat[2] * m) / 3600;
					m = tmpImg.exifdata["GPSLongitudeRef"] == "W" ? -1 : 1;
					const longitude = exifLong[0] * m + (exifLong[1] * m * 60 + exifLong[2] * m) / 3600;

					const xhr = new XMLHttpRequest();
					xhr.onload = function () {
						if (this.status == 200 || this.status === 0) {
							const info = JSON.parse(xhr.responseText);
							logger.debug("nominatim data:", info);
							if (info && info.address) {
								imageInfoCache[tmpImg.imageUrl].address = info.address;
								wp.setImageDataInfo(tmpImg);
							}
						} else {
							logger.error("nominatim error:", this.status, xhr.status, xhr.responseText);
							delete imageInfoCache[tmpImg.imageUrl];
						}
					};
					xhr.onerror = function (event) {
						logger.error("nominatim error:", event);
						delete imageInfoCache[tmpImg.imageUrl];
					};
					xhr.ontimeout = function (event) {
						logger.error("nominatim timeout:", event);
						delete imageInfoCache[tmpImg.imageUrl];
					};
					xhr.open("GET", `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
					xhr.timeout = 15000;
					xhr.send();
				}
			});
		}

		setImageDataInfo(img) {
			if (!img || !img.imageUrl) {
				return;
			}
			const infoElements = [];
			if (this.imageOne.imageUrl == img.imageUrl) {
				infoElements.push(this.imageOneInfo);
			} else if (this.imageTwo.imageUrl == img.imageUrl) {
				infoElements.push(this.imageTwoInfo);
			}
			if (infoElements.length == 0) {
				return;
			}

			if (!config.show_image_info || !config.image_info_template) {
				infoElements.forEach((infoElement) => {
					infoElement.innerHTML = "";
					infoElement.style.display = "none";
				});
				return;
			}

			let imageInfo = imageInfoCache[img.imageUrl];
			if (!imageInfo) {
				imageInfo = {};
			}
			if (!imageInfo.image) {
				imageInfo.image = {};
			}
			if (!imageInfo.image.url) {
				imageInfo.image.url = img.imageUrl;
			}
			if (!imageInfo.image.path) {
				imageInfo.image.path = img.imageUrl.replace(/^[^:]+:\/\/[^/]+/, "");
			}
			if (!imageInfo.image.relativePath) {
				imageInfo.image.relativePath = img.imageUrl.replace(config.image_url, "").replace(/^\/+/, "");
			}
			if (!imageInfo.image.filename) {
				imageInfo.image.filename = img.imageUrl.replace(/^.*[\\/]/, "");
			}
			if (!imageInfo.image.folderName) {
				imageInfo.image.folderName = "";
				const parts = img.imageUrl.split("/");
				if (parts.length >= 2) {
					imageInfo.image.folderName = parts[parts.length - 2];
				}
			}
			logger.debug("Image info:", imageInfo);

			let html = config.image_info_template;
			html = html.replace(/\${([^}]+)}/g, (match, tags) => {
				let prefix = "";
				let suffix = "";
				let options = null;
				if (tags.includes("!")) {
					const tmp = tags.split("!");
					tags = tmp[0];
					for (let i = 1; i < tmp.length; i++) {
						const argType = tmp[i].substring(0, tmp[i].indexOf("="));
						const argValue = tmp[i].substring(tmp[i].indexOf("=") + 1);
						if (argType == "prefix") {
							prefix = argValue;
						} else if (argType == "suffix") {
							suffix = argValue;
						} else if (argType == "options") {
							options = {};
							argValue.split(",").forEach((optVal) => {
								const tmp2 = optVal.split(":", 2);
								if (tmp2[0] && tmp2[1]) {
									options[tmp2[0].replace(/\s/g, "")] = tmp2[1].replace(/\s/g, "");
								}
							});
						}
					}
				}

				let val = "";
				const tagList = tags.split("|");
				let tag = "";
				for (let i = 0; i < tagList.length; i++) {
					tag = tagList[i];
					const keys = tag.replace(/\s/g, "").split(".");
					val = imageInfo;
					keys.forEach((key) => {
						if (val) {
							val = val[key];
						}
					});
					if (val) {
						break;
					}
				}
				if (!val) {
					return "";
				}
				if (/DateTime/i.test(tag)) {
					const date = new Date(val.replace(/(\d\d\d\d):(\d\d):(\d\d) (\d\d):(\d\d):(\d\d)/, "$1-$2-$3T$4:$5:$6"));
					if (isNaN(date)) {
						// Invalid date
						return "";
					}
					if (!options) {
						options = { year: "numeric", month: "2-digit", day: "2-digit" };
					}
					val = date.toLocaleDateString(elHass.__hass.locale.language, options);
				}
				if (typeof val === "object") {
					val = JSON.stringify(val);
				}
				return prefix + val + suffix;
			});

			infoElements.forEach((infoElement) => {
				infoElement.innerHTML = html;
				infoElement.style.display = "block";
			});
		}

		updateImageList(preload = false, preloadCallback = null) {
			if (!config.image_url) return;

			const wp = this;
			let updateFunction = null;
			if (imageSourceType() == "unsplash-api") {
				updateFunction = wp.updateImageListFromUnsplashAPI;
			} else if (imageSourceType() == "immich-api") {
				updateFunction = wp.updateImageListFromImmichAPI;
			} else if (imageSourceType() == "media-source") {
				updateFunction = wp.updateImageListFromMediaSource;
			} else {
				return;
			}

			function doUpdateImageList() {
				wp.cancelUpdatingImageList = false;
				try {
					updateFunction.bind(wp)(preload, preloadCallback);
				} catch (e) {
					logger.warn("Failed to update image list, will retry in 3 seconds", e);
					setTimeout(doUpdateImageList, 3000);
				}
			}

			if (wp.updatingImageList) {
				wp.cancelUpdatingImageList = true;
				const start = Date.now();
				function _checkUpdating() {
					if (!wp.updatingImageList || Date.now() - start >= 5000) {
						doUpdateImageList();
					} else {
						setTimeout(_checkUpdating, 50);
					}
				}
				setTimeout(_checkUpdating, 1);
			} else {
				doUpdateImageList();
			}
		}

		findMedias(mediaContentId) {
			const wp = this;
			logger.debug(`findMedias: ${mediaContentId}`);
			const excludeRegExp = [];
			if (config.exclude_filenames) {
				for (const imageExclude of config.exclude_filenames) {
					excludeRegExp.push(new RegExp(imageExclude));
				}
			}

			return new Promise(function (resolve, reject) {
				wp.hass
					.callWS({
						type: "media_source/browse_media",
						media_content_id: mediaContentId
					})
					.then(
						(mediaEntry) => {
							logger.debug("Found media entry", mediaEntry);
							var promises = mediaEntry.children.map((child) => {
								const filename = child.media_content_id.replace(/^media-source:\/\/[^/]+/, "");
								for (const exclude of excludeRegExp) {
									if (exclude.test(filename)) {
										return;
									}
								}
								if (["image", "video"].includes(child.media_class)) {
									if (config.exclude_media_types && config.exclude_media_types.includes(child.media_class)) {
										// Media type excluded
										return;
									}

									//logger.debug(child);
									return child.media_content_id;
								}
								if (child.media_class == "directory") {
									if (wp.cancelUpdatingImageList) {
										return;
									}
									return wp.findMedias(child.media_content_id);
								}
							});
							Promise.all(promises).then((results) => {
								let result = [];
								for (const res of results) {
									if (res) {
										result = result.concat(res);
									}
								}
								resolve(result);
							});
						},
						(error) => {
							//logger.warn(error);
							reject(error);
						}
					);
			});
		}

		updateImageListFromMediaSource(preload, preloadCallback = null) {
			this.updatingImageList = true;
			this.lastImageListUpdate = Date.now();
			const mediaContentId = config.image_url;
			const wp = this;
			wp.findMedias(mediaContentId).then(
				(result) => {
					wp.updatingImageList = false;
					if (!wp.cancelUpdatingImageList) {
						if (config.image_order == "random") {
							wp.imageList = result.sort(() => 0.5 - Math.random());
						} else {
							wp.imageList = result.sort();
						}
						logger.debug("Image list from media-source is now:", wp.imageList);
						if (preload) {
							wp.preloadImages(preloadCallback);
						}
					}
				},
				(error) => {
					wp.updatingImageList = false;
					error = `Failed to update image list from ${config.image_url}: ${JSON.stringify(error)}`;
					logger.error(error);
					wp.displayMessage(error, 10000);
				}
			);
		}

		updateImageListFromUnsplashAPI(preload, preloadCallback = null) {
			this.updatingImageList = true;
			this.lastImageListUpdate = Date.now();
			const wp = this;
			const urls = [];
			const data = {};
			const http = new XMLHttpRequest();
			http.responseType = "json";
			// count: The number of photos to return. (Default: 1; max: 30)
			http.open("GET", `${config.image_url}&count=30`, true);
			http.onload = function () {
				if (http.status == 200 || http.status === 0) {
					logger.debug(`Got unsplash API response`);
					http.response.forEach((entry) => {
						logger.debug(entry);
						const url = entry.urls.raw + "&w=${width}&h=${height}&auto=format";
						urls.push(url);
						data[url] = entry;
					});
				} else {
					logger.warn("Unsplash API error, get random images", http);
					urls.push("https://source.unsplash.com/random/${width}x${height}?sig=${timestamp}");
				}
				if (!wp.cancelUpdatingImageList) {
					wp.imageList = urls;
					imageInfoCache = data;
					logger.debug("Image list from unsplash is now:", wp.imageList);
					if (preload) {
						wp.updatingImageList = false;
						wp.preloadImages(preloadCallback);
					}
				}
				wp.updatingImageList = false;
			};
			logger.debug(`Unsplash API request: ${config.image_url}`);
			http.send();
		}

		updateImageListFromImmichAPI(preload, preloadCallback = null) {
			if (!config.immich_api_key) {
				logger.error("immich_api_key not configured");
				return;
			}
			const wp = this;
			wp.updatingImageList = true;
			wp.imageList = [];
			wp.lastImageListUpdate = Date.now();
			const urls = [];
			const data = {};
			const apiUrl = config.image_url.replace(/^immich\+/, "");
			const excludeRegExp = [];
			if (config.exclude_filenames) {
				for (const imageExclude of config.exclude_filenames) {
					excludeRegExp.push(new RegExp(imageExclude));
				}
			}

			function processAssets(assets, folderName = null) {
				assets.forEach((asset) => {
					logger.debug(asset);
					const assetType = asset.type.toLowerCase();
					if (!["image", "video"].includes(assetType)) {
						return;
					}
					if (config.exclude_media_types && config.exclude_media_types.includes(assetType)) {
						return;
					}
					for (const exclude of excludeRegExp) {
						if (exclude.test(asset.originalFileName)) {
							return;
						}
					}

					let resolution = "original";
					if (config.immich_resolution == "preview") {
						if (assetType == "video") {
							resolution = "video/playback";
						} else {
							resolution = "thumbnail?size=preview";
						}
					}
					const url = `${apiUrl}/assets/${asset.id}/${resolution}`;
					data[url] = asset.exifInfo || {};

					data[url]["mediaType"] = assetType;
					data[url]["image"] = {
						filename: asset.originalFileName,
						folderName: folderName
					};
					urls.push(url);
				});
			}

			function processUrls() {
				if (!wp.cancelUpdatingImageList) {
					if (config.image_order == "random") {
						wp.imageList = urls.sort(() => 0.5 - Math.random());
					} else {
						wp.imageList = urls;
					}
					imageInfoCache = data;
					logger.debug("Image list from immich is now:", wp.imageList);
					if (preload) {
						wp.updatingImageList = false;
						wp.preloadImages(preloadCallback);
					}
				}
				wp.updatingImageList = false;
			}

			if (config.immich_persons && config.immich_persons.length) {
				const orPersonNames = [];
				config.immich_persons.forEach((entry) => {
					let andPersonNames = Array.isArray(entry) ? entry : [entry];
					andPersonNames = andPersonNames.map((v) => v.toLowerCase());
					orPersonNames.push(andPersonNames);
				});
				logger.debug(orPersonNames);
				let immichPeople = [];
				const personNameToId = {};

				function fetchAssets(index = 0) {
					const personNames = orPersonNames[index];
					const personIds = [];
					personNames.forEach((personName) => {
						const personId = personNameToId[personName];
						if (personId) {
							personIds.push(personId);
						} else {
							logger.error(`Person not found in immich: ${personName}`);
						}
					});

					function afterFetchAssets() {
						if (index + 1 < orPersonNames.length) {
							fetchAssets(index + 1);
						} else {
							processUrls();
						}
					}

					if (personIds.length > 0) {
						const http = new XMLHttpRequest();
						http.responseType = "json";
						http.open("POST", `${apiUrl}/search/metadata`, true);
						http.setRequestHeader("x-api-key", config.immich_api_key);
						http.setRequestHeader("Content-Type", "application/json");
						logger.debug("Searching asset metdata for persons: ", personIds);
						http.onload = function () {
							if (http.status == 200 || http.status === 0) {
								const searchResults = http.response;
								logger.debug(`Got immich API response`, searchResults);
								if (!searchResults.assets.count) {
									logger.error(`No media items found in immich that contain all these people: ${personNames}`);
								} else {
									processAssets(searchResults.assets.items);
								}
							} else {
								logger.error("Immich API error", http);
							}
							afterFetchAssets();
						};
						http.send(JSON.stringify({ personIds: personIds, withExif: true, size: 1000 }));
					} else {
						afterFetchAssets();
					}
				}

				function fetchPeople(page = 1) {
					const http = new XMLHttpRequest();
					http.responseType = "json";
					http.open("GET", `${apiUrl}/people?size=1000&page=${page}`, true);
					http.setRequestHeader("x-api-key", config.immich_api_key);
					http.onload = function () {
						if (http.status == 200 || http.status === 0) {
							logger.debug(`Got immich API response`, http.response);
							immichPeople = immichPeople.concat(http.response.people);
							if (http.response.hasNextPage) {
								return fetchPeople(page + 1);
							}
							immichPeople.forEach((person) => {
								personNameToId[person.name.toLowerCase()] = person.id;
							});
							fetchAssets();
						} else {
							logger.error("Immich API error", http);
							wp.updatingImageList = false;
						}
					};
					http.send();
				}
				fetchPeople();
			} else if (config.immich_memories) {
				const http = new XMLHttpRequest();
				http.responseType = "json";
				http.open("GET", `${apiUrl}/memories?type=on_this_day`, true);
				http.setRequestHeader("x-api-key", config.immich_api_key);
				http.setRequestHeader("Content-Type", "application/json");
				http.onload = function () {
					if (http.status == 200 || http.status === 0) {
						const allMemories = http.response;
						logger.debug(`Got immich API response`, allMemories);

						const now = new Date();

						allMemories
							.filter(function (memory) {
								const showAt = new Date(memory.showAt);
								const hideAt = new Date(memory.hideAt);
								return now >= showAt && now <= hideAt;
							})
							.forEach((memory) => {
								logger.debug(memory);
								processAssets(memory.assets);
								processUrls();
							});
					} else {
						logger.error("Immich API error", http);
						wp.updatingImageList = false;
					}
				};
				http.send();
			} else if (config.immich_tag_names && config.immich_tag_names.length) {
				const tagNames = config.immich_tag_names.map((v) => v.toLowerCase());
				const http = new XMLHttpRequest();
				http.responseType = "json";
				http.open("GET", `${apiUrl}/tags`, true);
				http.setRequestHeader("x-api-key", config.immich_api_key);
				http.onload = function () {
					const tagIds = [];
					if (http.status == 200 || http.status === 0) {
						const allTags = http.response;
						logger.debug(`Got immich API response`, allTags);
						allTags.forEach((tag) => {
							logger.debug(tag);
							if (!tagNames.includes(tag.name.toLowerCase())) {
								logger.debug("Skipping tag: ", tag.name);
							} else {
								logger.debug("Adding tag: ", tag.name);
								tagIds.push(tag.id);
							}
						});
						if (tagIds.length > 0) {
							const http2 = new XMLHttpRequest();
							http2.responseType = "json";
							http2.open("POST", `${apiUrl}/search/metadata`, true);
							http2.setRequestHeader("x-api-key", config.immich_api_key);
							http2.setRequestHeader("Content-Type", "application/json");
							logger.debug("Searching asset metdata for tags: ", tagIds);
							http2.onload = function () {
								if (http2.status == 200 || http2.status === 0) {
									const searchResults = http2.response;
									logger.debug(`Got immich API response`, searchResults);
									processAssets(searchResults.assets.items);
									processUrls();
								} else {
									logger.error("Immich API error", http2);
								}
							};
							http2.send(JSON.stringify({ tagIds: tagIds, withExif: true, size: 1000 }));
						} else {
							logger.error("No immich tags selected");
							wp.updatingImageList = false;
						}
					} else {
						logger.error("Immich API error", http);
						wp.updatingImageList = false;
					}
				};
				http.send();
			} else {
				const http = new XMLHttpRequest();
				http.responseType = "json";
				http.open("GET", `${apiUrl}/albums?shared=${config.immich_shared_albums}`, true);
				http.setRequestHeader("x-api-key", config.immich_api_key);
				http.onload = function () {
					const albumIds = [];
					const albumNames = (config.immich_album_names || []).map((v) => v.toLowerCase());
					if (http.status == 200 || http.status === 0) {
						const allAlbums = http.response;
						logger.debug(`Got immich API response`, allAlbums);
						allAlbums.forEach((album) => {
							logger.debug(album);
							if (albumNames.length && !albumNames.includes(album.albumName.toLowerCase())) {
								logger.debug("Skipping album: ", album.albumName);
							} else {
								logger.debug("Adding album: ", album.albumName);
								albumIds.push(album.id);
							}
						});
						if (albumIds) {
							albumIds.forEach((albumId) => {
								logger.debug("Fetching album metdata: ", albumId);
								const http2 = new XMLHttpRequest();
								http2.responseType = "json";
								http2.open("GET", `${apiUrl}/albums/${albumId}`, true);
								http2.setRequestHeader("x-api-key", config.immich_api_key);
								http2.onload = function () {
									if (http2.status == 200 || http2.status === 0) {
										const albumDetails = http2.response;
										logger.debug(`Got immich API response`, albumDetails);
										processAssets(albumDetails.assets, albumDetails.albumName);
									} else {
										logger.error("Immich API error", http2);
									}
									albumIds.pop(albumId);
									if (albumIds.length == 0) {
										// All processed
										processUrls();
									}
								};
								http2.send();
							});
						} else {
							logger.error("No immich albums selected");
							wp.updatingImageList = false;
						}
					} else {
						logger.error("Immich API error", http);
						wp.updatingImageList = false;
					}
				};
				http.send();
			}
		}

		fillPlaceholders(url) {
			const width = this.screensaverContainer.clientWidth;
			const height = this.screensaverContainer.clientHeight;
			const timestamp_ms = Date.now();
			const timestamp = Math.floor(timestamp_ms / 1000);
			url = url.replace(/\${width}/g, width);
			url = url.replace(/\${height}/g, height);
			url = url.replace(/\${timestamp_ms}/g, timestamp_ms);
			url = url.replace(/\${timestamp}/g, timestamp);
			return url;
		}

		async loadMediaFromUrl(curElem, sourceUrl, mediaType = null, headers = null, useFetch = false) {
			const loadMediaWithElement = async (elem, url) => {
				if (useFetch) {
					const response = await fetch(url, { headers: headers || {} });
					if (!response.ok) {
						logger.error(`Failed to load ${elem.tagName} "${url}"`, response);
						return;
					}
					const blob = await response.blob();
					elem.src = window.URL.createObjectURL(blob);
				} else {
					// Setting the src attribute on an img works better because cross-origin requests aren't blocked
					const loadEventName = { img: "load", video: "loadeddata", iframe: "load" }[elem.tagName.toLowerCase()];
					if (!loadEventName) {
						logger.error(`Unsupported element tag "${elem.tagName}"`);
						return;
					}
					return new Promise((resolve, reject) => {
						const cleanup = () => {
							elem.onerror = null;
							elem.removeEventListener(loadEventName, onLoad);
						};

						const onLoad = () => {
							cleanup();
							resolve();
						};

						const onError = () => {
							cleanup();
							reject(new Error(`Failed to load ${elem.tagName} "${url}", ${elem.error?.message | "unknown"}`));
						};

						elem.addEventListener(loadEventName, onLoad);
						elem.onerror = onError;
						elem.src = url;
					});
				}
			};

			const createFallbackElement = (currentElem, tagName = null) => {
				if (!tagName) {
					tagName = currentElem.tagName.toLowerCase() === "img" ? "video" : "img";
				}
				const fallbackElem = document.createElement(tagName);

				// Clone all custom and HTML attributes except 'src', it will be set later.
				Object.entries(currentElem)
					.filter(([key]) => !(key in HTMLElement.prototype))
					.forEach(([key, value]) => (fallbackElem[key] = value));

				[...currentElem.attributes]
					.filter((attr) => attr.name !== "src")
					.forEach((attr) => fallbackElem.setAttribute(attr.name, attr.value));

				if (tagName.toLowerCase() === "video") {
					Object.assign(fallbackElem, { preload: "auto", muted: true });
				}
				return fallbackElem;
			};

			const replaceElementWith = (currentElem, newElem) => {
				if (currentElem === this.imageOne) {
					this.imageOne = newElem;
				} else {
					this.imageTwo = newElem;
				}
				currentElem.replaceWith(newElem);
			};

			const handleFallback = async (currentElem, url, mediaType = null, originalError = null) => {
				let fallbackSuccessful = false;
				const fallbackElem = createFallbackElement(currentElem, mediaType);
				replaceElementWith(currentElem, fallbackElem);
				try {
					await loadMediaWithElement(fallbackElem, url);
					fallbackSuccessful = true;
				} catch (e) {
					this.handleMediaError(currentElem, originalError || e);
				}
				if (fallbackSuccessful) {
					this.handleMediaLoaded(fallbackElem);
				}
			};

			const loadOrFallback = async (currentElem, url, withFallback) => {
				let loadSuccessful = false;
				try {
					await loadMediaWithElement(currentElem, url);
					loadSuccessful = true;
				} catch (e) {
					if (withFallback) {
						await handleFallback(currentElem, url, null, e);
					} else {
						this.handleMediaError(currentElem, e);
					}
				}
				if (loadSuccessful) {
					this.handleMediaLoaded(currentElem);
				}
			};

			if (!mediaType) {
				await loadOrFallback(curElem, sourceUrl, true);
			} else if (mediaType === curElem.tagName.toLowerCase()) {
				await loadOrFallback(curElem, sourceUrl, false);
			} else {
				await handleFallback(curElem, sourceUrl, mediaType);
			}
		}

		updateImageFromUrl(img, url, mediaType = null, headers = null, useFetch = false) {
			const realUrl = this.fillPlaceholders(url);
			if (realUrl != url && imageInfoCache[url]) {
				imageInfoCache[realUrl] = imageInfoCache[url];
			}
			img.imageUrl = realUrl;
			logger.debug(`Updating image '${img.id}' from '${realUrl}'`);

			this.loadMediaFromUrl(img, realUrl, mediaType, headers, useFetch);
		}

		updateImageIndex() {
			if (this.imageListDirection == "forwards") {
				this.imageIndex++;
			} else {
				this.imageIndex--;
			}
			if (this.imageIndex >= this.imageList.length) {
				this.imageIndex = 0;
			} else if (this.imageIndex < 0) {
				this.imageIndex = this.imageList.length - 1;
			}
		}

		updateImageFromMediaSource(img) {
			if (this.imageList.length == 0) {
				return;
			}
			this.updateImageIndex();
			img.imageUrl = this.imageList[this.imageIndex];
			this.hass
				.callWS({
					type: "media_source/resolve_media",
					media_content_id: img.imageUrl
				})
				.then(
					(result) => {
						let src = result.url;
						if (!src.startsWith("http://") && !src.startsWith("https://")) {
							src = `${document.location.origin}${src}`;
						}
						logger.debug(`Setting image src: ${src}`);

						const matchedType = result.mime_type?.match(/^(image|video)\//);
						const mediaType = { image: "img", video: "video" }[matchedType?.[1]] || null;
						this.loadMediaFromUrl(img, src, mediaType);
					},
					(error) => {
						logger.error(`media_source/resolve_media error for ${img.imageUrl}:`, error);
					}
				);
		}

		updateImageFromUnsplashAPI(img) {
			if (this.imageList.length == 0) {
				return;
			}
			this.updateImageIndex();
			this.updateImageFromUrl(img, this.imageList[this.imageIndex], "img");
		}

		updateImageFromImmichAPI(img) {
			if (this.imageList.length == 0) {
				return;
			}
			this.updateImageIndex();
			const url = this.imageList[this.imageIndex];
			const imageInfo = imageInfoCache[url] || {};
			const mediaType = imageInfo["mediaType"] == "video" ? "video" : "img";
			this.updateImageFromUrl(img, url, mediaType, { "x-api-key": config.immich_api_key }, true);
		}

		updateImageFromMediaEntity(img) {
			const mediaEntity = config.image_url.replace(/^media-entity:\/\//, "");
			const entity = this.hass.states[mediaEntity];
			if (!entity || !entity.attributes || !entity.attributes.entity_picture) {
				return;
			}
			const entityPicture = entity.attributes.entity_picture;
			let querySuffix = entityPicture.indexOf("?") > 0 ? "&" : "?";
			querySuffix += "width=${width}&height=${height}";
			const url = entityPicture + querySuffix;
			if ("media_exif" in entity.attributes) {
				// immich-home-assistant provides media_exif
				imageInfoCache[url] = entity.attributes["media_exif"];
			} else {
				imageInfoCache[url] = entity.attributes;
			}
			mediaEntityState = entity.state;
			this.updateImageFromUrl(img, url, "img", null, true);
		}

		updateImage(img, callback = null) {
			if (!config.show_images) {
				return;
			}
			img.setAttribute("data-loading", true);

			if (imageSourceType() == "media-source") {
				this.updateImageFromMediaSource(img);
			} else if (imageSourceType() == "unsplash-api") {
				this.updateImageFromUnsplashAPI(img);
			} else if (imageSourceType() == "immich-api") {
				this.updateImageFromImmichAPI(img);
			} else if (imageSourceType() == "media-entity") {
				this.updateImageFromMediaEntity(img);
			} else if (imageSourceType() == "iframe") {
				this.updateImageFromUrl(img, config.image_url.replace(/^iframe\+/, ""), "iframe");
			} else {
				this.updateImageFromUrl(img, config.image_url);
			}

			if (callback) {
				const wp = this;
				const start = Date.now();

				function _checkLoading() {
					if (img.getAttribute("data-loading") == "false" || Date.now() - start >= 2000) {
						callback(wp, img);
					} else {
						setTimeout(_checkLoading, 50);
					}
				}
				setTimeout(_checkLoading, 1);
			}
		}

		preloadImage(img, callback = null) {
			const wp = this;
			if (
				this.updatingImageList ||
				img.getAttribute("data-loading") == "true" ||
				(this.screensaverRunning() && img.parentNode.style.opacity == 1)
			) {
				if (callback) {
					callback(wp, img);
				}
				return;
			}
			this.updateImage(img, function (wp, updatedImg) {
				wp.setImageDataInfo(updatedImg);
				if (callback) {
					callback(wp, updatedImg);
				}
			});
		}

		preloadImages(callback = null) {
			logger.debug("Preloading images");
			if (["media-entity", "iframe"].includes(imageSourceType())) {
				this.preloadImage(this.imageOne, function (wp) {
					if (callback) {
						callback(wp);
					}
				});
			} else {
				this.preloadImage(this.imageOne, function (wp) {
					wp.preloadImage(wp.imageTwo, function (wp) {
						if (callback) {
							callback(wp);
						}
					});
				});
			}
		}

		startPlayingActiveMedia() {
			const activeElem = this.getActiveImageElement();
			if (typeof activeElem.play !== "function") {
				return; // Not playable element.
			}

			let playbackListeners;
			const cleanupListeners = () => {
				if (playbackListeners) {
					Object.entries(playbackListeners).forEach(([event, handler]) => {
						activeElem.removeEventListener(event, handler);
					});
					playbackListeners == null;
				}
			};

			activeElem.loop = config.video_loop;
			if (!config.video_loop) {
				// Immediately switch to next image at the end of the playback.
				const onTimeUpdate = () => {
					if (this.getActiveImageElement() !== activeElem) {
						cleanupListeners();
						return;
					}
					// If the media has played enough and is near the end.
					if (activeElem.currentTime > config.crossfade_time) {
						const remainingTime = activeElem.duration - activeElem.currentTime;
						if (remainingTime <= config.crossfade_time) {
							this.switchActiveImage("display_time_elapsed");
							cleanupListeners();
						}
					}
				};
				const onMediaEnded = () => {
					if (this.getActiveImageElement() === activeElem) {
						this.switchActiveImage("media_end");
					}
					cleanupListeners();
				};
				const onMediaPause = () => {
					cleanupListeners();
				};

				playbackListeners = {
					timeupdate: onTimeUpdate,
					ended: onMediaEnded,
					pause: onMediaPause
				};
				Object.entries(playbackListeners).forEach(([event, handler]) => {
					activeElem.addEventListener(event, handler);
				});
			}

			// Start playing the media.
			activeElem.play().catch((e) => {
				cleanupListeners();
				if (activeElem === this.getActiveImageElement()) {
					logger.error(`Failed to play media "${activeElem.src}":`, e);
				}
			});
		}

		switchActiveImage(eventType) {
			const sourceType = imageSourceType();

			if (sourceType === "media-entity") {
				const mediaEntity = config.image_url.replace(/^media-entity:\/\//, "");
				const entity = this.hass.states[mediaEntity];
				if (!entity) {
					return;
				}

				if (mediaEntityState != entity.state) {
					logger.debug(`Media entity ${mediaEntity} state has changed`);
				} else if (eventType == "entity_update") {
					return;
				} else if (config.media_entity_load_unchanged) {
					logger.debug(`Media entity ${mediaEntity} state unchanged, but media_entity_load_unchanged = true`);
				} else {
					this.lastImageUpdate = Date.now();
					this.restartProgressBarAnimation();
					return;
				}
				mediaEntityState = entity.state;
			}

			this.lastImageUpdate = Date.now();

			const crossfadeMillis = eventType == "user_action" ? 250 : null;
			if (["media-entity", "iframe"].includes(sourceType)) {
				const nextImg = this.imageTwoContainer.style.opacity == 1 ? this.imageOne : this.imageTwo;
				const wp = this;
				wp.updateImage(nextImg, () => {
					wp._switchActiveImage(crossfadeMillis);
				});
			} else {
				this._switchActiveImage(crossfadeMillis);
			}
		}

		_switchActiveImage(crossfadeMillis = null) {
			if (this.afterFadeoutTimer) {
				clearTimeout(this.afterFadeoutTimer);
			}
			this.lastImageUpdate = Date.now();

			if (crossfadeMillis === null) {
				crossfadeMillis = Math.round(config.crossfade_time * 1000);
			}

			this.imageOneContainer.style.transition = `opacity ${crossfadeMillis}ms ease-in-out`;
			this.imageTwoContainer.style.transition = `opacity ${crossfadeMillis}ms ease-in-out`;

			let curActive = this.imageOneContainer;
			let newActive = this.imageTwoContainer;
			let curImg = this.imageOne;
			let newImg = this.imageTwo;
			if (this.imageTwoContainer.style.opacity == 1) {
				curActive = this.imageTwoContainer;
				newActive = this.imageOneContainer;
				curImg = this.imageTwo;
				newImg = this.imageOne;
			}
			logger.debug(`Switching active image to '${newActive.id}'`);

			this.setImageURLEntityState();
			this.setImageDataInfo(newImg);

			if (newActive.style.opacity != 1) {
				newActive.style.opacity = 1;
			}
			if (curActive.style.opacity != 0) {
				curActive.style.opacity = 0;
			}

			this.startPlayingActiveMedia();
			this.restartProgressBarAnimation();
			this.restartKenBurnsEffect();

			// Load next image after fade out
			// only if not media-entity, which will not yet have changed already
			// iframe will be loaded when switching images
			// TODO: Refactor, always load new media right before switch
			if (!["media-entity", "iframe"].includes(imageSourceType())) {
				const wp = this;
				this.afterFadeoutTimer = setTimeout(function () {
					if (
						curImg.tagName.toLowerCase() === "video" &&
						curImg.currentTime > 0 &&
						!curImg.paused &&
						!curImg.ended &&
						curImg.readyState > curImg.HAVE_CURRENT_DATA
					) {
						curImg.pause();
					}
					wp.updateImage(curImg);
					let cont = wp.imageOneBackground;
					if (curImg == wp.imageTwo) {
						cont = wp.imageTwoBackground;
					}
					cont.style.backgroundImage = "";
				}, crossfadeMillis);
			}
		}

		displayMessage(message, timeout = 15000) {
			this.hideMessage();
			this.messageBox.innerHTML = message;
			this.messageBox.style.visibility = "visible";
			const wp = this;
			this.messageBoxTimeout = setTimeout(function () {
				wp.hideMessage();
			}, timeout);
		}

		hideMessage() {
			if (!this.messageBoxTimeout) {
				return;
			}
			clearTimeout(this.messageBoxTimeout);
			this.messageBoxTimeout = null;
			this.messageBox.style.visibility = "hidden";
			this.messageBox.innerHTML = "";
		}

		setupScreensaver() {
			logger.debug("Setup screensaver");
			if (config.keep_screen_on_time > 0 && !this.screenWakeLock.enabled) {
				this.screenWakeLock.enable();
			}
			if (config.fullscreen && !fullscreen) {
				enterFullscreen();
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
			this.setImageURLEntityState();
			this.startPlayingActiveMedia();
			this.restartProgressBarAnimation();
			this.restartKenBurnsEffect();

			if (config.keep_screen_on_time > 0) {
				const wp = this;
				setTimeout(function () {
					if (wp.screensaverRunning() && !wp.screenWakeLock.enabled) {
						logger.error(
							"Keep screen on will not work because the user didn't interact with the document first. https://goo.gl/xX8pDD"
						);
						wp.displayMessage("Please interact with the screen for a moment to request wake lock.", 15000);
					}
				}, 2000);
			}

			this.lastMove = Date.now();
			this.lastImageUpdate = Date.now();
			this.screensaverStartedAt = Date.now();
			this.screensaverStoppedAt = null;
			document.documentElement.style.overflow = "hidden";

			this.createInfoBoxContent();

			this.style.visibility = "visible";
			this.style.opacity = 1;
			if (config.debug) {
				this.debugBox.style.pointerEvents = "auto";
			}

			this.setScreensaverEntityState();

			if (config.screensaver_stop_navigation_path || config.screensaver_stop_close_browser_mod_popup) {
				this.screensaverStopNavigationPathTimeout = setTimeout(
					() => {
						if (config.screensaver_stop_navigation_path) {
							skipDisableScreensaverOnLocationChanged = true;
							navigate(config.screensaver_stop_navigation_path);
							setTimeout(() => {
								skipDisableScreensaverOnLocationChanged = false;
							}, 5000);
						}
						if (config.screensaver_stop_close_browser_mod_popup) {
							const bmp = getActiveBrowserModPopup();
							if (bmp) {
								bmp.closeDialog();
							}
						}
					},
					(config.fade_in_time + 1) * 1000
				);
			}
		}

		screensaverRunning() {
			return Boolean(this.screensaverStartedAt) && this.screensaverStartedAt > 0;
		}

		stopScreensaver(fadeOutTime = 0.0) {
			logger.debug("Stop screensaver");

			this.screensaverStartedAt = null;
			this.screensaverStoppedAt = Date.now();

			document.documentElement.style.removeProperty("overflow");

			if (this.screensaverStopNavigationPathTimeout) {
				clearTimeout(this.screensaverStopNavigationPathTimeout);
			}
			this.hideMessage();

			this.debugBox.style.pointerEvents = "none";
			if (fadeOutTime > 0) {
				this.style.transition = `opacity ${Math.round(fadeOutTime * 1000)}ms ease-in-out`;
			} else {
				this.style.transition = "";
			}
			this.style.opacity = 0;
			this.style.visibility = "hidden";
			this.infoBoxPosX.style.animation = "";
			this.infoBoxPosY.style.animation = "";

			this.idleSince = Date.now();
			if (this.screenWakeLock.enabled) {
				this.screenWakeLock.disable();
			}

			setTimeout(this.setScreensaverEntityState.bind(this), 25);
		}

		updateScreensaver() {
			const currentDate = new Date();
			const now = currentDate.getTime();

			if (
				this.energyCollectionUpdateEnabled &&
				now - this.lastEnergyCollectionUpdate >= this.energyCollectionUpdateInterval * 1000
			) {
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

			if (config.info_move_interval > 0 && now - this.lastMove >= config.info_move_interval * 1000) {
				if (config.info_move_pattern === "random") {
					this.randomMove();
				} else if (config.info_move_pattern === "corners") {
					this.moveAroundCorners();
				} else {
					logger.error(`Unknown info move type ${config.info_move_pattern}`);
				}
			}

			if (
				config.black_screen_after_time > 0 &&
				now - this.screensaverStartedAt >= config.black_screen_after_time * 1000
			) {
				logger.debug("Setting screen to black");
				this.screensaverOverlay.style.background = "#000000";
			} else if (config.show_images) {
				if (now - this.lastImageUpdate >= config.display_time * 1000) {
					this.switchActiveImage("display_time_elapsed");
				}
				if (now - this.lastImageListUpdate >= config.image_list_update_interval * 1000) {
					this.updateImageList();
				}
				if (this.imageOneContainer.style.visibility != "visible") {
					this.imageOneContainer.style.visibility = "visible";
				}
				if (this.imageTwoContainer.style.visibility != "visible") {
					this.imageTwoContainer.style.visibility = "visible";
				}
			} else {
				if (this.imageOneContainer.style.visibility != "hidden") {
					this.imageOneContainer.style.visibility = "hidden";
				}
				if (this.imageTwoContainer.style.visibility != "hidden") {
					this.imageTwoContainer.style.visibility = "hidden";
				}
			}

			if (config.debug) {
				let html = "";
				const conf = {};
				for (const key in config) {
					if (["profiles"].includes(key)) {
						conf[key] = "...";
					} else {
						conf[key] = config[key];
					}
				}

				html += '<a id="download_log" href="">Download log</a><br />';
				html += `<b>Version:</b> ${version}<br/>`;
				html += `<b>Config:</b> ${JSON.stringify(conf)}<br/>`;
				html += `<b>Fullscreen:</b> ${fullscreen}<br/>`;
				html += `<b>Screensaver started at:</b> ${wallpanel.screensaverStartedAt}<br/>`;
				html += `<b>Screen wake lock:</b> enabled=${this.screenWakeLock.enabled} native=${this.screenWakeLock.nativeWakeLockSupported} lock=${this.screenWakeLock._lock} player=${this.screenWakeLock._player} error=${this.screenWakeLock.error}<br/>`;
				if (this.screenWakeLock._player) {
					const p = this.screenWakeLock._player;
					html += `<b>Screen wake lock video</b>: readyState=${p.readyState} currentTime=${p.currentTime} paused=${p.paused} ended=${p.ended}<br/>`;
				}
				const activeImage = this.getActiveImageElement();
				if (activeImage) {
					html += `<b>Current image:</b> ${activeImage.imageUrl}<br/>`;
					const imgInfo = imageInfoCache[activeImage.imageUrl];
					if (imgInfo) {
						html += `<b>Image info:</b> ${JSON.stringify(imgInfo)}<br/>`;
					}
				}
				this.debugBox.innerHTML = html;
				this.debugBox.querySelector("#download_log").addEventListener("click", function (event) {
					logger.downloadMessages();
					event.preventDefault();
				});
				this.debugBox.scrollTop = this.debugBox.scrollHeight;
			}
			if (this.screenWakeLock.enabled && now - this.screensaverStartedAt >= config.keep_screen_on_time * 1000) {
				logger.info(`Disable wake lock after ${config.keep_screen_on_time} seconds`);
				this.screenWakeLock.disable();
			}
		}

		switchImageDirection(direction) {
			this.imageListDirection = direction;
			if (this.afterFadeoutTimer) {
				clearTimeout(this.afterFadeoutTimer);
			}
			this.updateImageIndex();
			const inactiveImage = this.getInactiveImageElement();
			this.updateImage(inactiveImage, function (wp) {
				wp.switchActiveImage("user_action");
			});
		}

		motionDetected() {
			this.stopScreensaver(config.fade_out_time_motion_detected);
		}

		handleInteractionEvent(evt) {
			const isClick = ["click", "touchend"].includes(evt.type);
			const now = Date.now();
			this.idleSince = now;

			let swipe = "";
			if (evt.type == "touchstart") {
				if (evt.touches && evt.touches[0]) {
					this.touchStartX = evt.touches[0].clientX;
				}
				return;
			} else if (evt.type == "touchend" && this.touchStartX >= 0 && evt.changedTouches && evt.changedTouches[0]) {
				const diffX = evt.changedTouches[0].clientX - this.touchStartX;
				if (diffX >= 5) {
					swipe = "right";
				} else if (diffX <= -5) {
					swipe = "left";
				}
				this.touchStartX = -1;
			}

			if (!this.screensaverRunning()) {
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
			if (!x && evt.changedTouches && evt.changedTouches[0]) {
				x = evt.changedTouches[0].clientX;
			}
			if (!y && evt.changedTouches && evt.changedTouches[0]) {
				y = evt.changedTouches[0].clientY;
			}

			if (config.debug && x && x < 100 && y && y < 100) {
				// Download link
				return;
			}

			const bmp = getActiveBrowserModPopup();
			if (bmp) {
				const bm_elements = [
					bmp.shadowRoot.querySelector(".content"),
					bmp.shadowRoot.querySelector("ha-dialog-header")
				];
				for (let i = 0; i < bm_elements.length; i++) {
					if (bm_elements[i]) {
						const pos = bm_elements[i].getBoundingClientRect();
						logger.debug("Event position:", bm_elements[i], x, y, pos.left, pos.right, pos.top, pos.bottom);
						if (x >= pos.left && x <= pos.right && y >= pos.top && y <= pos.bottom) {
							logger.debug("Event on browser mod popup:", bm_elements[i]);
							return;
						}
					}
				}
			}

			if (config.card_interaction) {
				if (this.getMoreInfoDialog()) {
					return;
				}
				let elements = [];
				elements = elements.concat(this.__cards);
				elements = elements.concat(this.__badges);
				elements = elements.concat(this.__views);
				elements.push(this.shadowRoot.getElementById("wallpanel-screensaver-info-box-content"));
				elements.push(this.shadowRoot.getElementById("wallpanel-screensaver-fixed-info-box-content"));
				for (let i = 0; i < elements.length; i++) {
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

			let switchImage = "";
			if (swipe) {
				switchImage = swipe == "left" ? "backwards" : "forwards";
			} else if (evt instanceof MouseEvent || evt instanceof TouchEvent) {
				let right = 0.0;
				let bottom = 0.0;
				if (x) {
					right = (this.screensaverContainer.clientWidth - x) / this.screensaverContainer.clientWidth;
				}
				if (y) {
					bottom = (this.screensaverContainer.clientHeight - y) / this.screensaverContainer.clientHeight;
				}
				if (config.touch_zone_size_next_image > 0 && right <= config.touch_zone_size_next_image / 100) {
					if (isClick) {
						switchImage = "forwards";
					} else {
						return;
					}
				} else if (
					config.touch_zone_size_previous_image > 0 &&
					right >= (100 - config.touch_zone_size_previous_image) / 100
				) {
					if (isClick) {
						switchImage = "backwards";
					} else {
						return;
					}
				} else if (right >= 0.4 && right <= 0.6 && bottom <= 0.1) {
					const now = new Date();
					if (isClick && now - this.lastClickTime < 500) {
						this.clickCount += 1;
						if (this.clickCount == 3) {
							logger.purgeMessages();
							config.debug = !config.debug;
							this.debugBox.style.visibility = config.debug ? "visible" : "hidden";
							this.debugBox.style.pointerEvents = config.debug ? "auto" : "none";
						}
					} else {
						this.clickCount = 1;
					}
					this.lastClickTime = now;
					return;
				}
			}

			if (switchImage) {
				if (
					this.imageOne.getAttribute("data-loading") == "true" ||
					this.imageTwo.getAttribute("data-loading") == "true"
				) {
					logger.debug("Already switching image");
				} else {
					logger.debug(`Switching image, direction ${switchImage}`);
					if (this.imageListDirection != switchImage) {
						this.switchImageDirection(switchImage);
					} else {
						this.switchActiveImage("user_action");
					}
				}
				return;
			}

			if (!isClick || config.stop_screensaver_on_mouse_click) {
				// Prevent interaction with the dashboards after screensaver was stopped
				this.blockEventsUntil = now + config.control_reactivation_time * 1000;
				this.stopScreensaver(config.fade_out_time_interaction);
			}
		}
	}

	if (!customElements.get("wallpanel-view")) {
		customElements.define("wallpanel-view", WallpanelView);
	}
	wallpanel = document.createElement("wallpanel-view");
	elHaMain.shadowRoot.appendChild(wallpanel);
}

function activateWallpanel() {
	logger.debug("activateWallpanel");
	let hideToolbar = config.hide_toolbar;
	let hideActionItems = config.hide_toolbar_action_icons;
	if (hideToolbar && !config.hide_toolbar_on_subviews && activeTab) {
		const pl = getHaPanelLovelace();
		if (pl && pl.lovelace && pl.lovelace.rawConfig && pl.lovelace.rawConfig.views) {
			for (let i = 0; i < pl.lovelace.rawConfig.views.length; i++) {
				if (pl.lovelace.rawConfig.views[i].path == activeTab) {
					if (pl.lovelace.rawConfig.views[i].subview) {
						logger.debug(`Current tab '${activeTab}' is a subview, not hiding toolbar`);
						hideToolbar = false;
						hideActionItems = false;
					}
					break;
				}
			}
		}
	}
	setToolbarVisibility(hideToolbar, hideActionItems);
	setSidebarVisibility(config.hide_sidebar);
}

function deactivateWallpanel() {
	logger.debug("deactivateWallpanel");
	if (wallpanel.screensaverRunning()) {
		wallpanel.stopScreensaver();
	}
	setToolbarVisibility(false, false);
	setSidebarVisibility(false);
}

function reconfigure() {
	if (!activePanel || !activeTab) {
		deactivateWallpanel();
		return;
	}

	updateConfig();

	if (isActive()) {
		activateWallpanel();
	} else {
		deactivateWallpanel();
	}
}

function locationChanged() {
	logger.debug(`Location changed from '${currentLocation}' to '${window.location.href}'`);

	if (window.location.href == currentLocation) {
		return;
	}

	currentLocation = window.location.href;

	if (
		wallpanel &&
		wallpanel.screensaverRunning &&
		wallpanel.screensaverRunning() &&
		config.stop_screensaver_on_location_change
	) {
		if (skipDisableScreensaverOnLocationChanged) {
			skipDisableScreensaverOnLocationChanged = false;
			if (wallpanel.screensaverStopNavigationPathTimeout) {
				clearTimeout(wallpanel.screensaverStopNavigationPathTimeout);
			}
		} else {
			wallpanel.stopScreensaver();
		}
	}

	let panel = null;
	let tab = null;
	const path = window.location.pathname.split("/");
	if (path.length > 1) {
		panel = path[1];
		if (path.length > 2) {
			tab = path[2];
		}
	}
	const panelChanged = activePanel && panel != activePanel;
	activePanel = panel;
	activeTab = tab;

	if (panelChanged) {
		logger.debug("Reset dashboard config");
		dashboardConfig = {};
		waitForEnv(reconfigure);
	} else {
		reconfigure();
	}
}

function waitForEnv(callback, startTime = null) {
	const now = Date.now();
	if (startTime === null) {
		startTime = now;
	}
	const startupSeconds = (now - startTime) / 1000;

	elHass = document.querySelector("body > home-assistant");
	if (elHass) {
		elHaMain = elHass.shadowRoot.querySelector("home-assistant-main");
	}
	if (!elHass || !elHaMain) {
		if (startupSeconds >= 5.0) {
			logger.error(
				`Wallpanel startup failed after ${startupSeconds} seconds, element home-assistant / home-assistant-main not found.`
			);
			return;
		}
		setTimeout(waitForEnv, 100, callback, startTime);
		return;
	}

	const pl = getHaPanelLovelace();
	if (!pl || !pl.lovelace || !pl.lovelace.config || !pl.lovelace.config) {
		if (startupSeconds >= 5.0) {
			logger.error(`Wallpanel startup failed after ${startupSeconds} seconds, lovelace config not found.`);
			return;
		}
		setTimeout(waitForEnv, 100, callback, startTime);
		return;
	}

	if (!customElements.get("hui-view")) {
		if (startupSeconds >= 5.0) {
			logger.error(`Wallpanel startup failed after ${startupSeconds} seconds, hui-view not found.`);
			return;
		}
		setTimeout(waitForEnv, 100, callback, startTime);
		return;
	}

	if (!window.browser_mod) {
		let waitTime = getDashboardWallpanelConfig(["wait_for_browser_mod_time"])["wait_for_browser_mod_time"];
		if (waitTime === undefined) {
			waitTime = defaultConfig["wait_for_browser_mod_time"];
		}
		if (startupSeconds < waitTime) {
			setTimeout(waitForEnv, 100, callback, startTime);
			return;
		}
	}

	if (window.browser_mod) {
		if (window.browser_mod.entity_id) {
			// V1
			browserId = window.browser_mod.entity_id;
		} else if (window.browser_mod.browserID) {
			// V2
			browserId = window.browser_mod.browserID.replace("-", "_");
		}
	}
	callback();
}

function startup() {
	userId = elHass.__hass.user.id;
	userDisplayname = elHass.__hass.user.name;
	logger.debug(`userId: ${userId}, userName: ${userName}, userDisplayname: ${userDisplayname}`);

	updateConfig();
	initWallpanel();

	window.addEventListener("location-changed", (event) => {
		let url = null;
		try {
			url = event.target.location.href;
		} catch (e) {
			logger.debug(e);
		}
		logger.debug("location-changed", url, event);
		setTimeout(locationChanged, 20);
	});
	if (window.navigation) {
		// Using navigate event because a back button on a sub-view will not produce a location-changed event
		window.navigation.addEventListener("navigate", (event) => {
			let url = null;
			try {
				url = event.destination.url;
			} catch (e) {
				logger.debug(e);
			}
			logger.debug("navigate", url, event);
			setTimeout(locationChanged, 30);
		});
	}
	elHass.__hass.connection.subscribeEvents(function (event) {
		logger.debug("lovelace_updated", event);
		const dashboard = event.data.url_path ? event.data.url_path : "lovelace";
		if (dashboard == activePanel) {
			elHass.__hass.connection
				.sendMessagePromise({
					type: "lovelace/config",
					url_path: event.data.url_path
				})
				.then((data) => {
					dashboardConfig = {};
					if (data.wallpanel) {
						for (const key in data.wallpanel) {
							if (key in defaultConfig) {
								dashboardConfig[key] = data.wallpanel[key];
							}
						}
					}
					reconfigure();
				});
		}
	}, "lovelace_updated");

	setTimeout(locationChanged, 0);
}

console.info(`%c🖼️ Wallpanel version ${version}`, "color: #34b6f9; font-weight: bold;");
waitForEnv(startup);

/**
 * https://github.com/exif-js/exif-js
 *
 * Copyright (c) 2008 Jacob Seidelin
 * Released under the MIT License
 */

var debug = false;

var EXIF = function (obj) {
	if (obj instanceof EXIF) return obj;
	if (!(this instanceof EXIF)) return new EXIF(obj);
	this.EXIFwrapped = obj;
};

var ExifTags = (EXIF.Tags = {
	// version tags
	0x9000: "ExifVersion", // EXIF version
	0xa000: "FlashpixVersion", // Flashpix format version

	// colorspace tags
	0xa001: "ColorSpace", // Color space information tag

	// image configuration
	0xa002: "PixelXDimension", // Valid width of meaningful image
	0xa003: "PixelYDimension", // Valid height of meaningful image
	0x9101: "ComponentsConfiguration", // Information about channels
	0x9102: "CompressedBitsPerPixel", // Compressed bits per pixel

	// user information
	0x927c: "MakerNote", // Any desired information written by the manufacturer
	0x9286: "UserComment", // Comments by user

	// related file
	0xa004: "RelatedSoundFile", // Name of related sound file

	// date and time
	0x9003: "DateTimeOriginal", // Date and time when the original image was generated
	0x9004: "DateTimeDigitized", // Date and time when the image was stored digitally
	0x9290: "SubsecTime", // Fractions of seconds for DateTime
	0x9291: "SubsecTimeOriginal", // Fractions of seconds for DateTimeOriginal
	0x9292: "SubsecTimeDigitized", // Fractions of seconds for DateTimeDigitized

	// picture-taking conditions
	0x829a: "ExposureTime", // Exposure time (in seconds)
	0x829d: "FNumber", // F number
	0x8822: "ExposureProgram", // Exposure program
	0x8824: "SpectralSensitivity", // Spectral sensitivity
	0x8827: "ISOSpeedRatings", // ISO speed rating
	0x8828: "OECF", // Optoelectric conversion factor
	0x9201: "ShutterSpeedValue", // Shutter speed
	0x9202: "ApertureValue", // Lens aperture
	0x9203: "BrightnessValue", // Value of brightness
	0x9204: "ExposureBias", // Exposure bias
	0x9205: "MaxApertureValue", // Smallest F number of lens
	0x9206: "SubjectDistance", // Distance to subject in meters
	0x9207: "MeteringMode", // Metering mode
	0x9208: "LightSource", // Kind of light source
	0x9209: "Flash", // Flash status
	0x9214: "SubjectArea", // Location and area of main subject
	0x920a: "FocalLength", // Focal length of the lens in mm
	0xa20b: "FlashEnergy", // Strobe energy in BCPS
	0xa20c: "SpatialFrequencyResponse", //
	0xa20e: "FocalPlaneXResolution", // Number of pixels in width direction per FocalPlaneResolutionUnit
	0xa20f: "FocalPlaneYResolution", // Number of pixels in height direction per FocalPlaneResolutionUnit
	0xa210: "FocalPlaneResolutionUnit", // Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
	0xa214: "SubjectLocation", // Location of subject in image
	0xa215: "ExposureIndex", // Exposure index selected on camera
	0xa217: "SensingMethod", // Image sensor type
	0xa300: "FileSource", // Image source (3 == DSC)
	0xa301: "SceneType", // Scene type (1 == directly photographed)
	0xa302: "CFAPattern", // Color filter array geometric pattern
	0xa401: "CustomRendered", // Special processing
	0xa402: "ExposureMode", // Exposure mode
	0xa403: "WhiteBalance", // 1 = auto white balance, 2 = manual
	0xa404: "DigitalZoomRation", // Digital zoom ratio
	0xa405: "FocalLengthIn35mmFilm", // Equivalent foacl length assuming 35mm film camera (in mm)
	0xa406: "SceneCaptureType", // Type of scene
	0xa407: "GainControl", // Degree of overall image gain adjustment
	0xa408: "Contrast", // Direction of contrast processing applied by camera
	0xa409: "Saturation", // Direction of saturation processing applied by camera
	0xa40a: "Sharpness", // Direction of sharpness processing applied by camera
	0xa40b: "DeviceSettingDescription", //
	0xa40c: "SubjectDistanceRange", // Distance to subject

	// other tags
	0xa005: "InteroperabilityIFDPointer",
	0xa420: "ImageUniqueID" // Identifier assigned uniquely to each image
});

var TiffTags = (EXIF.TiffTags = {
	0x0100: "ImageWidth",
	0x0101: "ImageHeight",
	0x8769: "ExifIFDPointer",
	0x8825: "GPSInfoIFDPointer",
	0xa005: "InteroperabilityIFDPointer",
	0x0102: "BitsPerSample",
	0x0103: "Compression",
	0x0106: "PhotometricInterpretation",
	0x0112: "Orientation",
	0x0115: "SamplesPerPixel",
	0x011c: "PlanarConfiguration",
	0x0212: "YCbCrSubSampling",
	0x0213: "YCbCrPositioning",
	0x011a: "XResolution",
	0x011b: "YResolution",
	0x0128: "ResolutionUnit",
	0x0111: "StripOffsets",
	0x0116: "RowsPerStrip",
	0x0117: "StripByteCounts",
	0x0201: "JPEGInterchangeFormat",
	0x0202: "JPEGInterchangeFormatLength",
	0x012d: "TransferFunction",
	0x013e: "WhitePoint",
	0x013f: "PrimaryChromaticities",
	0x0211: "YCbCrCoefficients",
	0x0214: "ReferenceBlackWhite",
	0x0132: "DateTime",
	0x010e: "ImageDescription",
	0x010f: "Make",
	0x0110: "Model",
	0x0131: "Software",
	0x013b: "Artist",
	0x8298: "Copyright"
});

var GPSTags = (EXIF.GPSTags = {
	0x0000: "GPSVersionID",
	0x0001: "GPSLatitudeRef",
	0x0002: "GPSLatitude",
	0x0003: "GPSLongitudeRef",
	0x0004: "GPSLongitude",
	0x0005: "GPSAltitudeRef",
	0x0006: "GPSAltitude",
	0x0007: "GPSTimeStamp",
	0x0008: "GPSSatellites",
	0x0009: "GPSStatus",
	0x000a: "GPSMeasureMode",
	0x000b: "GPSDOP",
	0x000c: "GPSSpeedRef",
	0x000d: "GPSSpeed",
	0x000e: "GPSTrackRef",
	0x000f: "GPSTrack",
	0x0010: "GPSImgDirectionRef",
	0x0011: "GPSImgDirection",
	0x0012: "GPSMapDatum",
	0x0013: "GPSDestLatitudeRef",
	0x0014: "GPSDestLatitude",
	0x0015: "GPSDestLongitudeRef",
	0x0016: "GPSDestLongitude",
	0x0017: "GPSDestBearingRef",
	0x0018: "GPSDestBearing",
	0x0019: "GPSDestDistanceRef",
	0x001a: "GPSDestDistance",
	0x001b: "GPSProcessingMethod",
	0x001c: "GPSAreaInformation",
	0x001d: "GPSDateStamp",
	0x001e: "GPSDifferential"
});

// EXIF 2.3 Spec
var IFD1Tags = (EXIF.IFD1Tags = {
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
	0x011a: "XResolution",
	0x011b: "YResolution",
	0x011c: "PlanarConfiguration",
	0x0128: "ResolutionUnit",
	0x0201: "JpegIFOffset", // When image format is JPEG, this value show offset to JPEG data stored.(aka "ThumbnailOffset" or "JPEGInterchangeFormat")
	0x0202: "JpegIFByteCount", // When image format is JPEG, this value shows data size of JPEG image (aka "ThumbnailLength" or "JPEGInterchangeFormatLength")
	0x0211: "YCbCrCoefficients",
	0x0212: "YCbCrSubSampling",
	0x0213: "YCbCrPositioning",
	0x0214: "ReferenceBlackWhite"
});

var StringValues = (EXIF.StringValues = {
	ExposureProgram: {
		0: "Not defined",
		1: "Manual",
		2: "Normal program",
		3: "Aperture priority",
		4: "Shutter priority",
		5: "Creative program",
		6: "Action program",
		7: "Portrait mode",
		8: "Landscape mode"
	},
	MeteringMode: {
		0: "Unknown",
		1: "Average",
		2: "CenterWeightedAverage",
		3: "Spot",
		4: "MultiSpot",
		5: "Pattern",
		6: "Partial",
		255: "Other"
	},
	LightSource: {
		0: "Unknown",
		1: "Daylight",
		2: "Fluorescent",
		3: "Tungsten (incandescent light)",
		4: "Flash",
		9: "Fine weather",
		10: "Cloudy weather",
		11: "Shade",
		12: "Daylight fluorescent (D 5700 - 7100K)",
		13: "Day white fluorescent (N 4600 - 5400K)",
		14: "Cool white fluorescent (W 3900 - 4500K)",
		15: "White fluorescent (WW 3200 - 3700K)",
		17: "Standard light A",
		18: "Standard light B",
		19: "Standard light C",
		20: "D55",
		21: "D65",
		22: "D75",
		23: "D50",
		24: "ISO studio tungsten",
		255: "Other"
	},
	Flash: {
		0x0000: "Flash did not fire",
		0x0001: "Flash fired",
		0x0005: "Strobe return light not detected",
		0x0007: "Strobe return light detected",
		0x0009: "Flash fired, compulsory flash mode",
		0x000d: "Flash fired, compulsory flash mode, return light not detected",
		0x000f: "Flash fired, compulsory flash mode, return light detected",
		0x0010: "Flash did not fire, compulsory flash mode",
		0x0018: "Flash did not fire, auto mode",
		0x0019: "Flash fired, auto mode",
		0x001d: "Flash fired, auto mode, return light not detected",
		0x001f: "Flash fired, auto mode, return light detected",
		0x0020: "No flash function",
		0x0041: "Flash fired, red-eye reduction mode",
		0x0045: "Flash fired, red-eye reduction mode, return light not detected",
		0x0047: "Flash fired, red-eye reduction mode, return light detected",
		0x0049: "Flash fired, compulsory flash mode, red-eye reduction mode",
		0x004d: "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
		0x004f: "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
		0x0059: "Flash fired, auto mode, red-eye reduction mode",
		0x005d: "Flash fired, auto mode, return light not detected, red-eye reduction mode",
		0x005f: "Flash fired, auto mode, return light detected, red-eye reduction mode"
	},
	SensingMethod: {
		1: "Not defined",
		2: "One-chip color area sensor",
		3: "Two-chip color area sensor",
		4: "Three-chip color area sensor",
		5: "Color sequential area sensor",
		7: "Trilinear sensor",
		8: "Color sequential linear sensor"
	},
	SceneCaptureType: {
		0: "Standard",
		1: "Landscape",
		2: "Portrait",
		3: "Night scene"
	},
	SceneType: {
		1: "Directly photographed"
	},
	CustomRendered: {
		0: "Normal process",
		1: "Custom process"
	},
	WhiteBalance: {
		0: "Auto white balance",
		1: "Manual white balance"
	},
	GainControl: {
		0: "None",
		1: "Low gain up",
		2: "High gain up",
		3: "Low gain down",
		4: "High gain down"
	},
	Contrast: {
		0: "Normal",
		1: "Soft",
		2: "Hard"
	},
	Saturation: {
		0: "Normal",
		1: "Low saturation",
		2: "High saturation"
	},
	Sharpness: {
		0: "Normal",
		1: "Soft",
		2: "Hard"
	},
	SubjectDistanceRange: {
		0: "Unknown",
		1: "Macro",
		2: "Close view",
		3: "Distant view"
	},
	FileSource: {
		3: "DSC"
	},

	Components: {
		0: "",
		1: "Y",
		2: "Cb",
		3: "Cr",
		4: "R",
		5: "G",
		6: "B"
	}
});

function imageHasData(img) {
	return !!img.exifdata;
}

function base64ToArrayBuffer(base64) {
	base64 = base64.replace(/^data:([^;]+);base64,/gim, "");
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
	http.onload = function () {
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
			var xmpdata = findXMPinJPEG(binFile);
			img.xmpdata = xmpdata || {};
		}
		if (callback) {
			callback.call(img);
		}
	}

	if (img.src) {
		if (/^data:/i.test(img.src)) {
			// Data URI
			var arrayBuffer = base64ToArrayBuffer(img.src);
			handleBinaryFile(arrayBuffer);
		} else if (/^blob:/i.test(img.src)) {
			// Object URL
			var blobFileReader = new FileReader();
			blobFileReader.onload = function (e) {
				handleBinaryFile(e.target.result);
			};
			objectURLToBlob(img.src, function (blob) {
				blobFileReader.readAsArrayBuffer(blob);
			});
		} else {
			var http = new XMLHttpRequest();
			http.onload = function () {
				if (this.status == 200 || this.status === 0) {
					handleBinaryFile(http.response);
				} else {
					logger.error("Could not load image");
					return;
				}
				http = null;
			};
			http.open("GET", img.src, true);
			http.responseType = "arraybuffer";
			http.send(null);
		}
	} else if (self.FileReader && (img instanceof self.Blob || img instanceof self.File)) {
		var fileReader = new FileReader();
		fileReader.onload = function (e) {
			if (debug) logger.log("Got file of length " + e.target.result.byteLength);
			handleBinaryFile(e.target.result);
		};

		fileReader.readAsArrayBuffer(img);
	}
}

function findEXIFinJPEG(file) {
	var dataView = new DataView(file);

	if (debug) logger.log("Got file of length " + file.byteLength);
	if (dataView.getUint8(0) != 0xff || dataView.getUint8(1) != 0xd8) {
		if (debug) logger.log("Not a valid JPEG");
		return false; // not a valid jpeg
	}

	var offset = 2,
		length = file.byteLength,
		marker;

	while (offset < length) {
		if (dataView.getUint8(offset) != 0xff) {
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
			offset += 2 + dataView.getUint16(offset + 2);
		}
	}
}

function findIPTCinJPEG(file) {
	var dataView = new DataView(file);

	if (debug) logger.log("Got file of length " + file.byteLength);
	if (dataView.getUint8(0) != 0xff || dataView.getUint8(1) != 0xd8) {
		if (debug) logger.log("Not a valid JPEG");
		return false; // not a valid jpeg
	}

	var offset = 2,
		length = file.byteLength;

	var isFieldSegmentStart = function (dataView, offset) {
		return (
			dataView.getUint8(offset) === 0x38 &&
			dataView.getUint8(offset + 1) === 0x42 &&
			dataView.getUint8(offset + 2) === 0x49 &&
			dataView.getUint8(offset + 3) === 0x4d &&
			dataView.getUint8(offset + 4) === 0x04 &&
			dataView.getUint8(offset + 5) === 0x04
		);
	};

	while (offset < length) {
		if (isFieldSegmentStart(dataView, offset)) {
			// Get the length of the name header (which is padded to an even number of bytes)
			var nameHeaderLength = dataView.getUint8(offset + 7);
			if (nameHeaderLength % 2 !== 0) nameHeaderLength += 1;
			// Check for pre photoshop 6 format
			if (nameHeaderLength === 0) {
				// Always 4
				nameHeaderLength = 4;
			}

			var startOffset = offset + 8 + nameHeaderLength;
			var sectionLength = dataView.getUint16(offset + 6 + nameHeaderLength);

			return readIPTCData(file, startOffset, sectionLength);
		}

		// Not the marker, continue searching
		offset++;
	}
}
var IptcFieldMap = {
	0x19: "keywords",
	0x37: "dateCreated",
	0x50: "byline",
	0x55: "bylineTitle",
	0x5a: "city",
	0x5c: "sublocation",
	0x5e: "state",
	0x64: "countryCode",
	0x65: "countryName",
	0x67: "OriginalTransmissionReference",
	0x69: "headline",
	0x6d: "credit",
	0x6e: "credit",
	0x74: "copyright",
	0x76: "contact",
	0x78: "caption",
	0x7a: "captionWriter",
	0x7d: "rasterizedCaption",
	0x82: "imageType",
	0x83: "imageOrientation",
	0x87: "languageID",
	0x96: "audioType",
	0x97: "audioSamplingRate",
	0x98: "audioSamplingRes",
	0x99: "audioDuration",
	0x9a: "audioOutcue",
	0xc8: "previewFileFormat",
	0xc9: "previewFileFormatVer",
	0xca: "previewData",
	0x0f: "category"
};

function readIPTCData(file, startOffset, sectionLength) {
	var dataView = new DataView(file);
	var data = {};
	var fieldValue, fieldName, dataSize, segmentType;
	var segmentStartPos = startOffset;
	while (segmentStartPos < startOffset + sectionLength) {
		if (dataView.getUint8(segmentStartPos) === 0x1c && dataView.getUint8(segmentStartPos + 1) === 0x02) {
			segmentType = dataView.getUint8(segmentStartPos + 2);
			if (segmentType in IptcFieldMap) {
				dataSize = dataView.getInt16(segmentStartPos + 3);
				fieldName = IptcFieldMap[segmentType];
				fieldValue = getStringFromDB(dataView, segmentStartPos + 5, dataSize);
				// Check if we already stored a value with this name
				if (Object.prototype.hasOwnProperty.call(data, fieldName)) {
					// Value already stored with this name, create multivalue field
					if (data[fieldName] instanceof Array) {
						data[fieldName].push(fieldValue);
					} else {
						data[fieldName] = [data[fieldName], fieldValue];
					}
				} else {
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
		entryOffset,
		tag,
		i;

	for (i = 0; i < entries; i++) {
		entryOffset = dirStart + i * 12 + 2;
		tag = strings[file.getUint16(entryOffset, !bigEnd)];
		if (!tag && debug) logger.log("Unknown tag: " + file.getUint16(entryOffset, !bigEnd));
		tags[tag] = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
	}
	return tags;
}

function readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd) {
	var type = file.getUint16(entryOffset + 2, !bigEnd),
		numValues = file.getUint32(entryOffset + 4, !bigEnd),
		valueOffset = file.getUint32(entryOffset + 8, !bigEnd) + tiffStart,
		offset,
		vals,
		val,
		n,
		numerator,
		denominator;

	switch (type) {
		case 1: // byte, 8-bit unsigned int
		case 7: // undefined, 8-bit byte, value depending on field
			if (numValues == 1) {
				return file.getUint8(entryOffset + 8, !bigEnd);
			} else {
				offset = numValues > 4 ? valueOffset : entryOffset + 8;
				vals = [];
				for (n = 0; n < numValues; n++) {
					vals[n] = file.getUint8(offset + n);
				}
				return vals;
			}

		case 2: // ascii, 8-bit byte
			offset = numValues > 4 ? valueOffset : entryOffset + 8;
			return getStringFromDB(file, offset, numValues - 1);

		case 3: // short, 16 bit int
			if (numValues == 1) {
				return file.getUint16(entryOffset + 8, !bigEnd);
			} else {
				offset = numValues > 2 ? valueOffset : entryOffset + 8;
				vals = [];
				for (n = 0; n < numValues; n++) {
					vals[n] = file.getUint16(offset + 2 * n, !bigEnd);
				}
				return vals;
			}

		case 4: // long, 32 bit int
			if (numValues == 1) {
				return file.getUint32(entryOffset + 8, !bigEnd);
			} else {
				vals = [];
				for (n = 0; n < numValues; n++) {
					vals[n] = file.getUint32(valueOffset + 4 * n, !bigEnd);
				}
				return vals;
			}

		case 5: // rational = two long values, first is numerator, second is denominator
			if (numValues == 1) {
				numerator = file.getUint32(valueOffset, !bigEnd);
				denominator = file.getUint32(valueOffset + 4, !bigEnd);
				val = new Number(numerator / denominator);
				val.numerator = numerator;
				val.denominator = denominator;
				return val;
			} else {
				vals = [];
				for (n = 0; n < numValues; n++) {
					numerator = file.getUint32(valueOffset + 8 * n, !bigEnd);
					denominator = file.getUint32(valueOffset + 4 + 8 * n, !bigEnd);
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
				for (n = 0; n < numValues; n++) {
					vals[n] = file.getInt32(valueOffset + 4 * n, !bigEnd);
				}
				return vals;
			}

		case 10: // signed rational, two slongs, first is numerator, second is denominator
			if (numValues == 1) {
				return file.getInt32(valueOffset, !bigEnd) / file.getInt32(valueOffset + 4, !bigEnd);
			} else {
				vals = [];
				for (n = 0; n < numValues; n++) {
					vals[n] = file.getInt32(valueOffset + 8 * n, !bigEnd) / file.getInt32(valueOffset + 4 + 8 * n, !bigEnd);
				}
				return vals;
			}
	}
}

/**
 * Given an IFD (Image File Directory) start offset
 * returns an offset to next IFD or 0 if it's the last IFD.
 */
function getNextIFDOffset(dataView, dirStart, bigEnd) {
	//the first 2bytes means the number of directory entries contains in this IFD
	var entries = dataView.getUint16(dirStart, !bigEnd);

	// After last directory entry, there is a 4bytes of data,
	// it means an offset to next IFD.
	// If its value is '0x00000000', it means this is the last IFD and there is no linked IFD.

	return dataView.getUint32(dirStart + 2 + entries * 12, !bigEnd); // each entry is 12 bytes long
}

function readThumbnailImage(dataView, tiffStart, firstIFDOffset, bigEnd) {
	// get the IFD1 offset
	var IFD1OffsetPointer = getNextIFDOffset(dataView, tiffStart + firstIFDOffset, bigEnd);

	if (!IFD1OffsetPointer) {
		// logger.log('******** IFD1Offset is empty, image thumb not found ********');
		return {};
	} else if (IFD1OffsetPointer > dataView.byteLength) {
		// this should not happen
		// logger.log('******** IFD1Offset is outside the bounds of the DataView ********');
		return {};
	}
	// logger.log('*******  thumbnail IFD offset (IFD1) is: %s', IFD1OffsetPointer);

	var thumbTags = readTags(dataView, tiffStart, tiffStart + IFD1OffsetPointer, IFD1Tags, bigEnd);

	// EXIF 2.3 specification for JPEG format thumbnail

	// If the value of Compression(0x0103) Tag in IFD1 is '6', thumbnail image format is JPEG.
	// Most of Exif image uses JPEG format for thumbnail. In that case, you can get offset of thumbnail
	// by JpegIFOffset(0x0201) Tag in IFD1, size of thumbnail by JpegIFByteCount(0x0202) Tag.
	// Data format is ordinary JPEG format, starts from 0xFFD8 and ends by 0xFFD9. It seems that
	// JPEG format and 160x120pixels of size are recommended thumbnail format for Exif2.1 or later.

	if (thumbTags["Compression"]) {
		// logger.log('Thumbnail image found!');

		switch (thumbTags["Compression"]) {
			case 6:
				// logger.log('Thumbnail image format is JPEG');
				if (thumbTags.JpegIFOffset && thumbTags.JpegIFByteCount) {
					// extract the thumbnail
					var tOffset = tiffStart + thumbTags.JpegIFOffset;
					var tLength = thumbTags.JpegIFByteCount;
					thumbTags["blob"] = new Blob([new Uint8Array(dataView.buffer, tOffset, tLength)], {
						type: "image/jpeg"
					});
				}
				break;

			case 1:
				logger.log("Thumbnail image format is TIFF, which is not implemented.");
				break;
			default:
				logger.log("Unknown thumbnail image format '%s'", thumbTags["Compression"]);
		}
	} else if (thumbTags["PhotometricInterpretation"] == 2) {
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
	for (var n = start; n < start + length; n++) {
		//outstr += String.fromCharCode(buffer.getUint8(n));
		arOut[j] = "0x" + buffer.getUint8(n).toString(16);
		j++;
	}
	//transform array to UTF-8 String with Utf8ArrayToStr function
	outstr = Utf8ArrayToStr(arOut);
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
	while (i < len) {
		c = array[i++];
		switch (c >> 4) {
			case 0:
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
			case 7:
				// 0xxxxxxx
				out += String.fromCharCode(c);
				break;
			case 12:
			case 13:
				// 110x xxxx   10xx xxxx
				char2 = array[i++];
				out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
				break;
			case 14:
				// 1110 xxxx  10xx xxxx  10xx xxxx
				char2 = array[i++];
				char3 = array[i++];
				out += String.fromCharCode(((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0));
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
		tags,
		tag,
		exifData,
		gpsData,
		tiffOffset = start + 6;

	// test for TIFF validity and endianness
	if (file.getUint16(tiffOffset) == 0x4949) {
		bigEnd = false;
	} else if (file.getUint16(tiffOffset) == 0x4d4d) {
		bigEnd = true;
	} else {
		if (debug) logger.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
		return false;
	}

	if (file.getUint16(tiffOffset + 2, !bigEnd) != 0x002a) {
		if (debug) logger.log("Not valid TIFF data! (no 0x002A)");
		return false;
	}

	var firstIFDOffset = file.getUint32(tiffOffset + 4, !bigEnd);

	if (firstIFDOffset < 0x00000008) {
		if (debug) logger.log("Not valid TIFF data! (First offset less than 8)", file.getUint32(tiffOffset + 4, !bigEnd));
		return false;
	}

	tags = readTags(file, tiffOffset, tiffOffset + firstIFDOffset, TiffTags, bigEnd);

	if (tags.ExifIFDPointer) {
		exifData = readTags(file, tiffOffset, tiffOffset + tags.ExifIFDPointer, ExifTags, bigEnd);
		for (tag in exifData) {
			switch (tag) {
				case "LightSource":
				case "Flash":
				case "MeteringMode":
				case "ExposureProgram":
				case "SensingMethod":
				case "SceneCaptureType":
				case "SceneType":
				case "CustomRendered":
				case "WhiteBalance":
				case "GainControl":
				case "Contrast":
				case "Saturation":
				case "Sharpness":
				case "SubjectDistanceRange":
				case "FileSource":
					exifData[tag] = StringValues[tag][exifData[tag]];
					break;

				case "ExifVersion":
				case "FlashpixVersion":
					exifData[tag] = String.fromCharCode(exifData[tag][0], exifData[tag][1], exifData[tag][2], exifData[tag][3]);
					break;

				case "ComponentsConfiguration":
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
				case "GPSVersionID":
					gpsData[tag] = gpsData[tag][0] + "." + gpsData[tag][1] + "." + gpsData[tag][2] + "." + gpsData[tag][3];
					break;
			}
			tags[tag] = gpsData[tag];
		}
	}

	// extract thumbnail
	tags["thumbnail"] = readThumbnailImage(file, tiffOffset, firstIFDOffset, bigEnd);

	return tags;
}

function findXMPinJPEG(file) {
	if (!("DOMParser" in self)) {
		// logger.warn('XML parsing not supported without DOMParser');
		return;
	}
	var dataView = new DataView(file);

	if (debug) logger.log("Got file of length " + file.byteLength);
	if (dataView.getUint8(0) != 0xff || dataView.getUint8(1) != 0xd8) {
		if (debug) logger.log("Not a valid JPEG");
		return false; // not a valid jpeg
	}

	var offset = 2,
		length = file.byteLength,
		dom = new DOMParser();

	while (offset < length - 4) {
		if (getStringFromDB(dataView, offset, 4) == "http") {
			var startOffset = offset - 1;
			var sectionLength = dataView.getUint16(offset - 2) - 1;
			var xmpString = getStringFromDB(dataView, startOffset, sectionLength);
			var xmpEndIndex = xmpString.indexOf("xmpmeta>") + 8;
			xmpString = xmpString.substring(xmpString.indexOf("<x:xmpmeta"), xmpEndIndex);

			var indexOfXmp = xmpString.indexOf("x:xmpmeta") + 10;
			//Many custom written programs embed xmp/xml without any namespace. Following are some of them.
			//Without these namespaces, XML is thought to be invalid by parsers
			xmpString =
				xmpString.slice(0, indexOfXmp) +
				'xmlns:Iptc4xmpCore="http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/" ' +
				'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
				'xmlns:tiff="http://ns.adobe.com/tiff/1.0/" ' +
				'xmlns:plus="http://schemas.android.com/apk/lib/com.google.android.gms.plus" ' +
				'xmlns:ext="http://www.gettyimages.com/xsltExtension/1.0" ' +
				'xmlns:exif="http://ns.adobe.com/exif/1.0/" ' +
				'xmlns:stEvt="http://ns.adobe.com/xap/1.0/sType/ResourceEvent#" ' +
				'xmlns:stRef="http://ns.adobe.com/xap/1.0/sType/ResourceRef#" ' +
				'xmlns:crs="http://ns.adobe.com/camera-raw-settings/1.0/" ' +
				'xmlns:xapGImg="http://ns.adobe.com/xap/1.0/g/img/" ' +
				'xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/" ' +
				xmpString.slice(indexOfXmp);

			var domDocument = dom.parseFromString(xmpString, "text/xml");
			return xml2Object(domDocument);
		} else {
			offset++;
		}
	}
}

function xml2json(xml) {
	var json = {};

	if (xml.nodeType == 1) {
		// element node
		if (xml.attributes.length > 0) {
			json["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				json["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) {
		// text node
		return xml.nodeValue;
	}

	// deal with children
	if (xml.hasChildNodes()) {
		for (var i = 0; i < xml.childNodes.length; i++) {
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
				for (var idx in attributes) {
					var itemAtt = attributes[idx];
					var dataKey = itemAtt.nodeName;
					var dataValue = itemAtt.nodeValue;

					if (dataKey !== undefined) {
						obj[dataKey] = dataValue;
					}
				}
				var nodeName = item.nodeName;

				if (typeof obj[nodeName] == "undefined") {
					obj[nodeName] = xml2json(item);
				} else {
					if (typeof obj[nodeName].push == "undefined") {
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

EXIF.enableXmp = function () {
	EXIF.isXmpEnabled = true;
};

EXIF.disableXmp = function () {
	EXIF.isXmpEnabled = false;
};

EXIF.getData = function (img, callback) {
	if (
		((self.Image && img instanceof self.Image) || (self.HTMLImageElement && img instanceof self.HTMLImageElement)) &&
		!img.complete
	)
		return false;

	if (!imageHasData(img)) {
		getImageData(img, callback);
	} else {
		if (callback) {
			callback.call(img);
		}
	}
	return true;
};

EXIF.getTag = function (img, tag) {
	if (!imageHasData(img)) return;
	return img.exifdata[tag];
};

EXIF.getIptcTag = function (img, tag) {
	if (!imageHasData(img)) return;
	return img.iptcdata[tag];
};

EXIF.getAllTags = function (img) {
	if (!imageHasData(img)) return {};
	var a,
		data = img.exifdata,
		tags = {};
	for (a in data) {
		if (Object.prototype.hasOwnProperty.call(data, a)) {
			tags[a] = data[a];
		}
	}
	return tags;
};

EXIF.getAllIptcTags = function (img) {
	if (!imageHasData(img)) return {};
	var a,
		data = img.iptcdata,
		tags = {};
	for (a in data) {
		if (Object.prototype.hasOwnProperty.call(data, a)) {
			tags[a] = data[a];
		}
	}
	return tags;
};

//***************************************************************************
// Written by Stanko Milosev
// Published: 30 January 2015
// http://www.milosev.com/425-reading-exif-meta-data-from-jpeg-image-files.html
// gps conversion for google map use
EXIF.ConvertDMSToDD = function (degrees, minutes, seconds, direction) {
	var dd = degrees + minutes / 60 + seconds / (60 * 60);
	if (direction == "S" || direction == "W") {
		dd = dd * -1;
	} // Don't do anything for N or E
	return dd;
};
//*******************************************************************************

EXIF.pretty = function (img) {
	if (!imageHasData(img)) return "";
	var a,
		data = img.exifdata,
		strPretty = "";
	for (a in data) {
		if (Object.prototype.hasOwnProperty.call(data, a)) {
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
};

EXIF.readFromBinaryFile = function (file) {
	return findEXIFinJPEG(file);
};
