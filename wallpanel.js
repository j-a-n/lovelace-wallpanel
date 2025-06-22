/**
 * (C) 2020-2025 by Jan Schneider (oss@janschneider.net)
 * Released under the GNU General Public License v3.0
 */

const version = "4.52.1";
const defaultConfig = {
	enabled: false,
	enabled_on_views: [],
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
	screensaver_start_navigation_path: "",
	screensaver_stop_close_browser_mod_popup: false,
	screensaver_entity: "",
	stop_screensaver_on_mouse_move: true,
	stop_screensaver_on_mouse_click: true,
	stop_screensaver_on_key_down: true,
	stop_screensaver_on_location_change: true,
	disable_screensaver_on_browser_mod_popup: false,
	disable_screensaver_on_browser_mod_popup_func: "",
	disable_screensaver_when_assist_active: true,
	show_images: true,
	image_url: "https://picsum.photos/${width}/${height}?random=${timestamp}",
	image_url_entity: "",
	media_entity_load_unchanged: true,
	iframe_load_unchanged: false,
	iframe_interaction: false,
	immich_api_key: "",
	immich_album_names: [],
	immich_shared_albums: true,
	immich_tag_names: [],
	immich_persons: [],
	immich_memories: false,
	immich_resolution: "preview",
	image_fit_landscape: "cover", // cover / contain
	image_fit_portrait: "contain", // cover / contain
	media_list_update_interval: 3600,
	media_list_max_size: 500,
	media_order: "random", // sorted / random
	exclude_filenames: [], // Excluded filenames (regex)
	exclude_media_types: [], // Exclude media types (image / video)
	exclude_media_orientation: "", // Exclude media items with this orientation (landscape / portrait / auto)
	image_background: "color", // color / image
	video_loop: false,
	video_volume: 0.0,
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
	image_animation_ken_burns_duration: 0,
	image_animation_ken_burns_animations: ["simple"], // simple / experimental
	camera_motion_detection_enabled: false,
	camera_motion_detection_facing_mode: "user",
	camera_motion_detection_threshold: 5,
	camera_motion_detection_capture_width: 64,
	camera_motion_detection_capture_height: 48,
	camera_motion_detection_capture_interval: 0.3,
	camera_motion_detection_capture_visible: false,
	custom_css: "",
	style: {},
	badges: [],
	cards: [],
	views: [],
	content_interaction: false,
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
	"wallpanel-screensaver-image-info-container": {},
	"wallpanel-screensaver-image-info": {
		position: "absolute",
		bottom: "0.5em",
		right: "0.5em",
		"max-width": "calc(100% - 2em)",
		"max-height": "calc(100% - 5em)",
		padding: "0.1em 0.5em 0.1em 0.5em",
		"font-size": "2em",
		background: "#00000055",
		"backdrop-filter": "blur(2px)",
		"border-radius": "0.5rem"
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
	},
	"wallpanel-message": {
		width: "30em",
		"max-width": "100%",
		"box-sizing": "border-box",
		padding: "1em",
		"border-radius": "0.5rem",
		border: "1px solid black",
		"box-shadow": "0 4px 12px rgba(0, 0, 0, 0.3)",
		"font-size": "1.5em",
		color: "white",
		cursor: "pointer",
		opacity: "0",
		transform: "translateX(100%)",
		transition: "all 0.4s ease"
	},
	"wallpanel-message.show": {
		opacity: 1,
		transform: "translateX(0)"
	},
	"wallpanel-message.error": {
		"background-color": "#f8d7da",
		color: "#721c24",
		"border-color": "#721c24"
	},
	"wallpanel-message.warning": {
		"background-color": "#fff3cd",
		color: "#856404",
		"border-color": "#856404"
	},
	"wallpanel-message.info": {
		"background-color": "#d1ecf1",
		color: "#0c5460",
		"border-color": "#0c5460"
	},
	"wallpanel-message.success": {
		"background-color": "#d4edda",
		color: "#155724",
		"border-color": "#155724"
	},
	"wallpanel-message-title": {
		"font-weight": "bold",
		"margin-bottom": "0.25rem"
	}
};

const mediaInfoCache = new Map();

function addToMediaInfoCache(mediaUrl, value) {
	while (mediaInfoCache.size >= config.media_list_max_size) {
		// Remove the oldest key (first inserted)
		const oldestKey = mediaInfoCache.keys().next().value;
		mediaInfoCache.delete(oldestKey);
	}
	mediaInfoCache.set(mediaUrl, value);
}

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
			const msg = `Wallpanel error: ${stringify(arguments)}`;
			if (wallpanel) {
				wallpanel.showMessage("error", "Error", msg, 10000);
			} else {
				alert(msg);
			}
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
			// Do not set muted to true or the following error can occur:
			// Uncaught (in promise) DOMException: The play() request was interrupted because video-only background media was paused to save power. https://goo.gl/LdLk22
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

function shuffleArray(array) {
	const result = array.slice(); // Make a copy to avoid mutating the original
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
}

function getHaCameraStreamPlayerAndVideo(haCameraStreamElement) {
	if (!haCameraStreamElement.shadowRoot) {
		return [null, null];
	}
	const player =
		haCameraStreamElement.shadowRoot.querySelector("ha-web-rtc-player") ||
		haCameraStreamElement.shadowRoot.querySelector("ha-hls-player");
	if (!player || !player.shadowRoot) {
		return [player, null];
	}
	const video = player.shadowRoot.querySelector("video");
	return [player, video];
}

function mergeConfig(target, ...sources) {
	// https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
	if (!sources.length) return target;
	const source = sources.shift();
	const renamedOptions = {
		image_excludes: "exclude_filenames",
		image_fit: "image_fit_landscape",
		image_order: "media_order",
		enabled_on_tabs: "enabled_on_views",
		image_list_update_interval: "media_list_update_interval",
		screensaver_stop_navigation_path: "screensaver_start_navigation_path",
		card_interaction: "content_interaction"
	};

	if (isObject(target) && isObject(source)) {
		for (let key in source) {
			let val = source[key];

			if (renamedOptions[key]) {
				logger.warn(
					`The configuration option '${key}' has been renamed to '${renamedOptions[key]}'. Please update your wallpanel configuration accordingly.`
				);
				key = renamedOptions[key];
			}

			if (isObject(val)) {
				if (!target[key]) Object.assign(target, { [key]: {} });
				mergeConfig(target[key], val);
			} else {
				function replacer(match, entityId) {
					if (!(entityId in configEntityStates)) {
						configEntityStates[entityId] = "";
						const entity = (elHass.hass || elHass.__hass).states[entityId];
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
		(elHass.hass || elHass.__hass).states[profile_entity] &&
		config.profiles[(elHass.hass || elHass.__hass).states[profile_entity].state]
	) {
		const profile = (elHass.hass || elHass.__hass).states[profile_entity].state;
		config = mergeConfig(config, config.profiles[profile]);
		logger.debug(`Profile set from entity state: ${profile}`);
	}

	if (config.content_interaction) {
		config.stop_screensaver_on_mouse_move = false;
	}

	if (config.image_url) {
		config.image_url = config.image_url.replace(/^media-entity:\/\//, "media-entity-image://");
		if (config.image_url.startsWith("/")) {
			config.image_url = `media-source://media_source${config.image_url}`;
		}
		if (mediaSourceType() == "media-source") {
			config.image_url = config.image_url.replace(/\/+$/, "");
		}
		if (mediaSourceType() == "unsplash-api" && config.media_list_update_interval < 90) {
			// Unsplash API currently places a limit of 50 requests per hour
			config.media_list_update_interval = 90;
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
		config.enabled_on_views &&
		config.enabled_on_views.length > 0 &&
		activeTab &&
		!config.enabled_on_views.includes(activeTab)
	) {
		logger.debug(`Wallpanel not enabled on current tab ${activeTab}`);
		return false;
	}
	if (config.disable_screensaver_when_assist_active) {
		const voiceCommandDialog = elHass.shadowRoot.querySelector("ha-voice-command-dialog");
		if (
			voiceCommandDialog &&
			voiceCommandDialog.shadowRoot &&
			voiceCommandDialog.shadowRoot.querySelector("ha-dialog")
		) {
			logger.debug("Assist is active, wallpanel disabled");
			return false;
		}
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

function mediaSourceType() {
	if (!config.show_images || !config.image_url) {
		return "";
	}
	if (config.image_url.startsWith("media-entity-video://")) return "media-entity-video";
	if (config.image_url.startsWith("media-entity-image://")) return "media-entity-image";
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

			this.mediaList = [];
			this.mediaIndex = -1;
			this.mediaListDirection = "forwards"; // forwards, backwards
			this.lastMediaListUpdate;
			this.updatingMediaList = false;
			this.updatingMedia = false;
			this.lastMediaUpdate = 0;
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
			this.currentWidth = 0;
			this.currentHeight = 0;
			this.energyCollectionUpdateEnabled = false;
			this.energyCollectionUpdateInterval = 60;
			this.lastEnergyCollectionUpdate = 0;
			this.screensaverStopNavigationPathTimeout = null;
			this.disable_screensaver_on_browser_mod_popup_function = null;

			this.screenWakeLock = new ScreenWakeLock();
			this.cameraMotionDetection = new CameraMotionDetection();

			this.lovelace = null;
			this.__hass = elHass.hass || elHass.__hass;
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

				if (mediaSourceType() == "media-entity-image") {
					this.switchActiveMedia("entity_update");
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
			const activeElement = this.getActiveMediaElement();
			if (!activeElement || !activeElement.mediaUrl) return;
			// Maximum length for input_text entity is 255
			const mediaUrl = activeElement.mediaUrl.substring(0, 255);

			logger.debug("Updating image_url_entity", image_url_entity, mediaUrl);
			this.__hass
				.callService("input_text", "set_value", {
					entity_id: image_url_entity,
					value: mediaUrl
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
			this.messageContainer.removeAttribute("style");
			this.messageContainer.style.position = "fixed";
			this.messageContainer.style.top = "1rem";
			this.messageContainer.style.left = "1rem";
			this.messageContainer.style.bottom = "1rem";
			this.messageContainer.style.right = "1rem";
			this.messageContainer.style.alignItems = "flex-end";
			this.messageContainer.style.display = "flex";
			this.messageContainer.style.flexDirection = "column";
			this.messageContainer.style.gap = "0.5rem";
			this.messageContainer.style.zIndex = this.style.zIndex + 1;
			this.messageContainer.style.pointerEvents = "none";
			this.messageContainer.style.visibility = "hidden";

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
			this.debugBox.style.fontFamily = "monospace";
			this.debugBox.style.fontSize = "12px";
			this.debugBox.style.overflowWrap = "break-word";
			this.debugBox.style.overflowY = "auto";
			this.debugBox.style.visibility = "hidden";

			this.screensaverContainer.removeAttribute("style");
			this.screensaverContainer.style.position = "fixed";
			this.screensaverContainer.style.pointerEvents = "auto";
			this.screensaverContainer.style.top = 0;
			this.screensaverContainer.style.left = 0;
			this.screensaverContainer.style.width = "100vw";
			this.screensaverContainer.style.height = "100vh";
			this.screensaverContainer.style.background = "#000000";
			this.screensaverContainer.style.overflow = "hidden";

			this.imageOneContainer.removeAttribute("style");
			this.imageOneContainer.style.opacity = 0;
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

			this.imageOne.removeAttribute("style");
			this.imageOne.style.position = "relative";
			this.imageOne.style.pointerEvents = "none";
			this.imageOne.style.width = "100%";
			this.imageOne.style.height = "100%";
			this.imageOne.style.border = "none";

			this.imageOneInfoContainer.removeAttribute("style");
			this.imageOneInfoContainer.style.position = "absolute";
			this.imageOneInfoContainer.style.pointerEvents = "none";
			this.imageOneInfoContainer.style.top = 0;
			this.imageOneInfoContainer.style.left = 0;
			this.imageOneInfoContainer.style.width = "100%";
			this.imageOneInfoContainer.style.height = "100%";
			this.imageOneInfoContainer.style.border = "none";

			this.imageOneInfo.style.overflowY = "auto";

			this.imageTwoContainer.removeAttribute("style");
			this.imageTwoContainer.style.opacity = 0;
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

			this.imageTwo.removeAttribute("style");
			this.imageTwo.style.position = "relative";
			this.imageTwo.style.pointerEvents = "none";
			this.imageTwo.style.width = "100%";
			this.imageTwo.style.height = "100%";
			this.imageTwo.style.border = "none";

			this.imageTwoInfoContainer.removeAttribute("style");
			this.imageTwoInfoContainer.style.position = "absolute";
			this.imageTwoInfoContainer.style.pointerEvents = "none";
			this.imageTwoInfoContainer.style.top = 0;
			this.imageTwoInfoContainer.style.left = 0;
			this.imageTwoInfoContainer.style.width = "100%";
			this.imageTwoInfoContainer.style.height = "100%";
			this.imageTwoInfoContainer.style.border = "none";

			this.imageTwoInfo.style.overflowY = "auto";

			this.screensaverImageOverlay.removeAttribute("style");
			this.screensaverImageOverlay.style.position = "absolute";
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

			this.infoBoxPosX.style.pointerEvents = "none";
			this.infoBoxPosX.style.height = "100%";
			this.infoBoxPosX.style.width = "100%";

			this.infoBoxPosY.style.pointerEvents = "none";
			this.infoBoxPosY.style.height = "100%";
			this.infoBoxPosY.style.width = "100%";

			this.infoBoxContent.style.pointerEvents = "none";
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

			this.fixedInfoBox.style.pointerEvents = "none";
			this.fixedInfoBox.style.cssText = this.infoBox.style.cssText;

			this.screensaverOverlay.removeAttribute("style");
			this.screensaverOverlay.style.position = "absolute";
			this.screensaverOverlay.style.pointerEvents = "none";
			this.screensaverOverlay.style.top = 0;
			this.screensaverOverlay.style.left = 0;
			this.screensaverOverlay.style.width = "100%";
			this.screensaverOverlay.style.height = "100%";
			this.screensaverOverlay.style.background = "#00000000";
		}

		updateStyle() {
			this.screensaverOverlay.style.background = "#00000000";
			this.debugBox.style.visibility = config.debug ? "visible" : "hidden";
			this.debugBox.style.pointerEvents = config.debug ? "auto" : "none";
			//this.screensaverContainer.style.transition = `opacity ${Math.round(config.fade_in_time*1000)}ms ease-in-out`;
			this.style.transition = `opacity ${Math.round(config.fade_in_time * 1000)}ms ease-in-out`;
			this.imageOneContainer.style.transition = `opacity ${Math.round(config.crossfade_time * 1000)}ms ease-in-out`;
			this.imageTwoContainer.style.transition = `opacity ${Math.round(config.crossfade_time * 1000)}ms ease-in-out`;
			this.messageContainer.style.visibility = this.screensaverRunning() ? "visible" : "hidden";
			if (config.content_interaction) {
				this.screensaverImageOverlay.style.pointerEvents = "none";
			}

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
				@keyframes kenBurnsEffect-experimental {
					0% {
						transform: scale(1.0) translateX(calc(var(--hidden-width) / -2 * 1px)) translateY(calc(var(--hidden-height) / -2 * 1px));
					}
					50% {
						transform: scale(var(--ken-burns-zoom));
					}
					90% {
						transform: scale(calc(1.0 + ((var(--ken-burns-zoom) - 1.0)/2))) translateX(calc(var(--hidden-width) / 2 * 1px)) translateY(calc(var(--hidden-height) / 2 * 1px));
					}
					100% {
						transform: scale(1.0);
					}
				}
				@keyframes kenBurnsEffect-experimental2 {
					0% {
						transform: scale(1.0);
					}
					25% {
						transform: scale(calc(1.0 + ((var(--ken-burns-zoom) - 1.0)/2))) translateX(calc(var(--hidden-width) / 2 * 1px)) translateY(calc(var(--hidden-height) / 2 * 1px));
					}
					50% {
						transform: scale(var(--ken-burns-zoom));
					}
					75% {
						transform: scale(calc(1.0 + ((var(--ken-burns-zoom) - 1.0)/2))) translateX(calc(var(--hidden-width) / -2 * 1px)) translateY(calc(var(--hidden-height) / -2 * 1px));
					}
					100% {
						transform: scale(1.0);
					}
				}
				@keyframes kenBurnsEffect-simple {
					0% {
						transform-origin: bottom left;
						transform: scale(1.0);
					}
					100% {
						transform: scale(var(--ken-burns-zoom));
					}
				}
				${classCss}
				${config.custom_css}
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
			this.lovelace = haPanelLovelace.lovelace || haPanelLovelace.__lovelace;
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
					if (config.content_interaction) {
						viewElement.style.pointerEvents = "auto";
					} else {
						viewElement.style.pointerEvents = "none";
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

					if (config.content_interaction) {
						cardContainer.style.pointerEvents = "auto";
					} else {
						cardContainer.style.pointerEvents = "none";
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
			if (!config.image_animation_ken_burns || !config.image_animation_ken_burns_animations.length) {
				return;
			}
			const activeElement = this.getActiveMediaElement();
			activeElement.style.animation = "none";
			activeElement.style.setProperty("--ken-burns-zoom", config.image_animation_ken_burns_zoom);

			let delay = Math.floor(config.image_animation_ken_burns_delay * 1000);
			if (delay < 50) {
				delay = 50;
			}
			const duration = Math.ceil(
				config.image_animation_ken_burns_duration || (config.display_time + config.crossfade_time * 2) * 1.2
			);
			const animation =
				config.image_animation_ken_burns_animations[
					Math.floor(Math.random() * config.image_animation_ken_burns_animations.length)
				];
			if (this.kenburnsDelayStartTimer) {
				clearTimeout(this.kenburnsDelayStartTimer);
			}
			activeElement.animationIterationCount = 1;
			this.kenburnsDelayStartTimer = setTimeout(function () {
				activeElement.style.animation = `kenBurnsEffect-${animation} ${duration}s linear forwards`;
			}, delay);
		}

		getMediaElement(active = true, mediaElement = false) {
			let elem = this.imageOneContainer.style.opacity == (active ? 1 : 0) ? this.imageOne : this.imageTwo;
			if (mediaElement && elem.tagName.toLowerCase() == "ha-camera-stream") {
				const video = getHaCameraStreamPlayerAndVideo(elem)[1];
				if (video) {
					elem = video;
				}
			}
			return elem;
		}

		getActiveMediaElement(mediaElement = false) {
			return this.getMediaElement(true, mediaElement);
		}

		getInactiveMediaElement(mediaElement = false) {
			return this.getMediaElement(false, mediaElement);
		}

		replaceMediaElement(mediaElement, mediaType) {
			if (typeof mediaElement.src === "string" && mediaElement.src.startsWith("blob:")) {
				URL.revokeObjectURL(mediaElement.src);
			}
			if (typeof mediaElement.pause == "function") {
				mediaElement.pause();
			}
			if (mediaElement.tagName.toLowerCase() == "ha-camera-stream") {
				const video = getHaCameraStreamPlayerAndVideo(mediaElement)[1];
				if (video) {
					video.pause();
				}
			}
			mediaType = mediaType.toLowerCase();
			const newMediaElement = document.createElement(mediaType);
			[...mediaElement.attributes]
				.filter((attr) => attr.name != "src")
				.forEach((attr) => newMediaElement.setAttribute(attr.name, attr.value));

			newMediaElement.mediaUrl = mediaElement.mediaUrl;
			newMediaElement.infoCacheUrl = mediaElement.infoCacheUrl;

			if (mediaType === "video") {
				// Do not set muted to true or the following error can occur:
				// Uncaught (in promise) DOMException: The play() request was interrupted because video-only background media was paused to save power. https://goo.gl/LdLk22
				Object.assign(newMediaElement, { preload: "auto", muted: false, volume: config.video_volume });
			}

			mediaElement.replaceWith(newMediaElement);
			if (mediaElement === this.imageOne) {
				this.imageOne = newMediaElement;
			} else {
				this.imageTwo = newMediaElement;
			}
			mediaElement.remove();
			return newMediaElement;
		}

		loadBackgroundImage(element) {
			let srcMediaUrl = element.src;
			const tagName = element.tagName.toLowerCase();
			if (tagName === "ha-camera-stream") {
				const mediaElement = getHaCameraStreamPlayerAndVideo(element)[1];
				if (!mediaElement || !mediaElement.poster) {
					return;
				}
				srcMediaUrl = mediaElement.poster;
			} else if (tagName === "video") {
				// Capture the current frame of the video as a background image
				const canvas = document.createElement("canvas");
				canvas.width = element.videoWidth;
				canvas.height = element.videoHeight;

				const ctx = canvas.getContext("2d");
				ctx.drawImage(element, 0, 0, canvas.width, canvas.height);
				try {
					srcMediaUrl = canvas.toDataURL("image/png");
				} catch (err) {
					srcMediaUrl = null;
					logger.error("Error extracting canvas image:", err);
				}
			}
			let cont = this.imageOneBackground;
			if (element == this.imageTwo) {
				cont = this.imageTwoBackground;
			}
			cont.style.backgroundImage = srcMediaUrl ? `url(${srcMediaUrl})` : "";
		}

		connectedCallback() {
			this.style.zIndex = config.z_index;
			this.style.visibility = "hidden";
			this.style.opacity = 0;
			this.style.position = "fixed";

			this.messageContainer = document.createElement("div");
			this.messageContainer.id = "wallpanel-message-container";

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

			this.imageOneInfoContainer = document.createElement("div");
			this.imageOneInfoContainer.className = "wallpanel-screensaver-image-info-container";
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

			this.imageTwoInfoContainer = document.createElement("div");
			this.imageTwoInfoContainer.className = "wallpanel-screensaver-image-info-container";
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
			shadow.appendChild(this.messageContainer);
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
				const width = this.screensaverContainer.clientWidth;
				const height = this.screensaverContainer.clientHeight;
				if (wp.screensaverRunning() && (wp.currentWidth != width || wp.currentHeight != height)) {
					logger.debug(`Size changed from ${wp.currentWidth}x${wp.currentHeight} to ${width}x${height}`);
					wp.currentWidth = width;
					wp.currentHeight = height;
					wp.updateShadowStyle();
					wp.setMediaDimensions();
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

			// Correct possibly incorrect entity state
			this.setScreensaverEntityState();
		}

		reconfigure(oldConfig) {
			const oldConfigAvailable = oldConfig && Object.keys(oldConfig).length > 0;

			this.updateStyle();
			if (this.screensaverRunning()) {
				this.createInfoBoxContent();
			}

			if (!config.info_move_interval && oldConfigAvailable && oldConfig.info_move_interval) {
				wallpanel.moveInfoBox(0, 0);
			}

			if (
				config.show_images &&
				(!this.mediaList ||
					!this.mediaList.length ||
					!oldConfigAvailable ||
					!oldConfig.show_images ||
					oldConfig.image_url != config.image_url)
			) {
				const wp = this;
				const switchMedia = this.screensaverRunning() && oldConfigAvailable;

				const imgUrlChanged = oldConfig.image_url != config.image_url;
				if (imgUrlChanged) {
					this.mediaList = [];
					this.mediaIndex = -1;
				}

				this.updateMediaList(function () {
					if (switchMedia) {
						wp.switchActiveMedia("reconfigure");
					}
				}, imgUrlChanged);
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

			if (mediaInfoCache.get(img.infoCacheUrl)) {
				return;
			}
			const tmpImg = document.createElement("img");
			tmpImg.src = img.src;
			tmpImg.mediaUrl = img.mediaUrl;
			tmpImg.infoCacheUrl = img.infoCacheUrl;
			getImageData(tmpImg, function () {
				logger.debug("EXIF data:", tmpImg.exifdata);
				addToMediaInfoCache(tmpImg.infoCacheUrl, tmpImg.exifdata);
				wp.setMediaDataInfo(tmpImg);

				const exifLong = tmpImg.exifdata["GPSLongitude"];
				const exifLat = tmpImg.exifdata["GPSLatitude"];
				if (config.fetch_address_data && exifLong && !isNaN(exifLong[0]) && exifLat && !isNaN(exifLat[0])) {
					let m = tmpImg.exifdata["GPSLatitudeRef"] == "S" ? -1 : 1;
					const latitude = exifLat[0] * m + (exifLat[1] * m * 60 + exifLat[2] * m) / 3600;
					m = tmpImg.exifdata["GPSLongitudeRef"] == "W" ? -1 : 1;
					const longitude = exifLong[0] * m + (exifLong[1] * m * 60 + exifLong[2] * m) / 3600;
					logger.debug(`Fetching nominatim data for lat=${latitude} lon=${longitude}`);

					const xhr = new XMLHttpRequest();
					xhr.onload = function () {
						if (this.status == 200 || this.status === 0) {
							const info = JSON.parse(xhr.responseText);
							logger.debug("nominatim data:", info);
							if (info && info.address) {
								const mediaInfo = mediaInfoCache.get(tmpImg.infoCacheUrl);
								if (mediaInfo) {
									mediaInfo.address = info.address;
									wp.setMediaDataInfo(tmpImg);
								} else {
									logger.warn("URL not in cache:", tmpImg.infoCacheUrl);
								}
							}
						} else {
							logger.error("nominatim error:", this.status, xhr.status, xhr.responseText);
						}
					};
					xhr.onerror = function (event) {
						logger.error("nominatim error:", event);
					};
					xhr.ontimeout = function (event) {
						logger.error("nominatim timeout:", event);
					};
					xhr.open("GET", `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
					xhr.timeout = 15000;
					xhr.send();
				}
			});
		}

		setMediaDataInfo(mediaElement = null) {
			if (!mediaElement) {
				mediaElement = this.getActiveMediaElement();
			}
			const infoCacheUrl = mediaElement.infoCacheUrl;
			let mediaUrl = mediaElement.mediaUrl;
			if (!infoCacheUrl) {
				logger.debug("infoCacheUrl missing:", mediaElement);
				return;
			}
			if (!mediaUrl) {
				logger.debug("mediaUrl missing:", mediaElement);
				return;
			}
			mediaUrl = decodeURI(mediaUrl);

			const infoElements = [];
			if (this.imageOne.infoCacheUrl == infoCacheUrl) {
				infoElements.push(this.imageOneInfo);
			}
			if (this.imageTwo.infoCacheUrl == infoCacheUrl) {
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

			// Check if attributes are undefined to avoid overwriting existing ones (e.g., from the Immich API),
			// even if the new value is an empty string
			let mediaInfo = mediaInfoCache.get(infoCacheUrl);
			if (!mediaInfo) {
				mediaInfo = {};
			}
			if (!mediaInfo.image) {
				mediaInfo.image = {};
			}
			if (mediaInfo.image.url === undefined) {
				mediaInfo.image.url = mediaUrl;
			}
			const mediaUrlWithoutQuery = mediaUrl.replace(/\?[^?]*$/, "").replace(/\/+$/, "");
			if (mediaInfo.image.path === undefined) {
				mediaInfo.image.path = mediaUrlWithoutQuery.replace(/^[^:]+:\/\/[^/]+/, "");
			}
			if (mediaInfo.image.relativePath === undefined) {
				mediaInfo.image.relativePath = mediaUrlWithoutQuery.replace(config.image_url, "").replace(/^\/+/, "");
			}
			if (mediaInfo.image.filename === undefined) {
				mediaInfo.image.filename = mediaUrlWithoutQuery.replace(/^.*[\\/]/, "");
			}
			if (mediaInfo.image.folderName === undefined) {
				mediaInfo.image.folderName = "";
				const parts = mediaUrlWithoutQuery.split("/");
				if (parts.length >= 2) {
					mediaInfo.image.folderName = parts[parts.length - 2];
				}
			}
			logger.debug("Media info:", mediaInfo);

			let html = config.image_info_template;
			if (html == "analyze") {
				html = "";
				function iterateOverKeys(obj, prefix = "") {
					const keys = Object.keys(obj);
					keys.sort();
					keys.forEach((key) => {
						const value = obj[key];
						if (typeof value === "object" && value !== null) {
							iterateOverKeys(value, key + ".");
						} else {
							html += `${prefix}${key}: ${stringify(value)}<br>`;
						}
					});
				}
				iterateOverKeys(mediaInfo);
				this.imageOneInfo.style.pointerEvents = "none";
				this.imageTwoInfo.style.pointerEvents = "none";
				infoElements.forEach((infoElement) => {
					infoElement.style.pointerEvents = "auto";
				});
			} else {
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
						val = mediaInfo;
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
						val = date.toLocaleDateString((elHass.hass || elHass.__hass).locale.language, options);
					}
					if (typeof val === "object") {
						val = JSON.stringify(val);
					}
					return prefix + val + suffix;
				});
			}

			infoElements.forEach((infoElement) => {
				infoElement.innerHTML = html;
				infoElement.style.display = "block";
			});
		}

		async updateMediaList(callback = null, force = false, retryCount = 0) {
			if (!config.image_url) return;
			if (!force) {
				if (new Date().getTime() - this.lastMediaListUpdate < config.media_list_update_interval * 1000) {
					return;
				}
			}

			const wp = this;
			let updateFunction = null;
			const sourceType = mediaSourceType();

			if (sourceType == "unsplash-api") {
				updateFunction = wp.updateMediaListFromUnsplashAPI;
			} else if (sourceType == "immich-api") {
				updateFunction = wp.updateMediaListFromImmichAPI;
			} else if (sourceType == "media-source") {
				updateFunction = wp.updateMediaListFromMediaSource;
			} else {
				let url = config.image_url;
				if (sourceType == "iframe") {
					url = url.replace(/^iframe\+/, "");
				}
				this.mediaList = [url];
				if (callback) {
					callback();
				}
				return;
			}

			this.updatingMediaList = true;
			this.lastMediaListUpdate = Date.now();
			try {
				await updateFunction.bind(wp)();
				logger.debug(`Media list from ${sourceType} is now:`, wp.mediaList);
				if (callback) {
					callback();
				}
			} catch (error) {
				const maxRetries = 3;
				const retryDelay = 3000; // 3 seconds
				logger.warn(`Failed to update media list from ${sourceType}:`, error);
				if (retryCount < maxRetries) {
					logger.warn(
						`Retrying media list update in ${retryDelay / 1000} seconds (attempt ${retryCount + 1}/${maxRetries})...`
					);
					setTimeout(() => wp.updateMediaList(callback, true, retryCount + 1), retryDelay);
				} else {
					const errorMsg = `Failed to update media list from ${config.image_url} after ${maxRetries} retries: ${error.message || stringify(error)}`;
					logger.error(errorMsg);
					wp.showMessage("error", "Error", errorMsg, 10000);
				}
			}
			this.updatingMediaList = false;
		}

		async findMedias(mediaContentId) {
			const wp = this;
			logger.debug(`findMedias: ${mediaContentId}`);
			const excludeRegExp = [];
			if (config.exclude_filenames) {
				for (const imageExclude of config.exclude_filenames) {
					excludeRegExp.push(new RegExp(imageExclude));
				}
			}

			try {
				const mediaEntry = await wp.hass.callWS({
					type: "media_source/browse_media",
					media_content_id: mediaContentId
				});

				logger.debug("Found media entry", mediaEntry);
				const promises = mediaEntry.children.map(async (child) => {
					const filename = child.media_content_id.replace(/^media-source:\/\/[^/]+/, "");
					for (const exclude of excludeRegExp) {
						if (exclude.test(filename)) {
							return null; // Excluded by filename
						}
					}
					if (["image", "video"].includes(child.media_class)) {
						if (config.exclude_media_types && config.exclude_media_types.includes(child.media_class)) {
							return null; // Excluded by media type
						}
						return child.media_content_id;
					}
					if (child.media_class == "directory") {
						// Recursively find medias in subdirectory
						return await wp.findMedias(child.media_content_id);
					}
					return null; // Not an image, video, or directory
				});

				const results = await Promise.all(promises);
				// Flatten the results and filter out null values
				return results.flat().filter((res) => res !== null);
			} catch (error) {
				logger.warn(`Error browsing media ${mediaContentId}:`, error);
				throw error; // Re-throw the error to be caught by the caller
			}
		}

		async updateMediaListFromMediaSource() {
			const mediaContentId = config.image_url;
			const wp = this;

			try {
				let urls = await wp.findMedias(mediaContentId);
				if (config.media_order == "random") {
					urls = shuffleArray(urls);
				} else {
					urls = urls.sort(); // Sort consistently if not random
				}
				if (urls.length > config.media_list_max_size) {
					logger.info(`Using only ${config.media_list_max_size} of ${urls.length} media items`);
					urls = urls.slice(0, config.media_list_max_size);
				}
				wp.mediaList = urls;
			} catch (error) {
				// Error is logged in findMedias, re-throw for updateMediaList handler
				throw new Error(`Failed to update image list from ${config.image_url}: ${error.message || stringify(error)}`);
			}
		}

		async updateMediaListFromUnsplashAPI() {
			const urls = [];
			const requestUrl = `${config.image_url}&count=30`;

			logger.debug(`Unsplash API request: ${requestUrl}`);
			try {
				const options = {
					method: "GET",
					headers: { Accept: "application/json" }
				};
				if (typeof AbortSignal !== "undefined") {
					logger.debug("Using AbortSignal");
					options.signal = AbortSignal.timeout(10000); // 10 seconds timeout
				}

				const response = await fetch(requestUrl, options);

				if (!response.ok) {
					const errorText = await response.text();
					throw new Error(`Unsplash API request failed: ${response.status} ${response.statusText} - ${errorText}`);
				}

				const json = await response.json();
				logger.debug("Got Unsplash API response");

				json.forEach((entry) => {
					logger.debug(entry);
					const url = `${entry.urls.raw}&w=\${width}&h=\${height}&auto=format`;
					urls.push(url);
					addToMediaInfoCache(url, entry);
				});
				this.mediaList = urls;
			} catch (error) {
				if (error.name === "AbortError") {
					throw new Error(`Unsplash API request timed out: ${requestUrl}`);
				}
				throw error; // Re-throw other errors
			}
		}

		async _immichFetch(url, options = {}) {
			const defaultOptions = {
				headers: {
					"x-api-key": config.immich_api_key,
					"Content-Type": "application/json",
					Accept: "application/json"
				}
			};
			const mergedOptions = { ...defaultOptions, ...options };
			mergedOptions.headers = { ...defaultOptions.headers, ...options.headers };
			if (typeof AbortSignal !== "undefined") {
				logger.debug("Using AbortSignal");
				mergedOptions.signal = AbortSignal.timeout(10000); // 10 seconds timeout
			}

			logger.debug(`Immich API request: ${url}`);
			try {
				const response = await fetch(url, mergedOptions);

				if (!response.ok) {
					const errorText = await response.text();
					throw new Error(`Immich API request failed: ${response.status} ${response.statusText} - ${errorText}`);
				}
				return await response.json();
			} catch (error) {
				if (error.name === "AbortError") {
					throw new Error(`Immich API request timed out: ${url}`);
				}
				throw error; // Re-throw other errors
			}
		}

		async updateMediaListFromImmichAPI() {
			if (!config.immich_api_key) {
				throw new Error("immich_api_key not configured");
			}
			const wp = this;
			const screenOrientation =
				this.screensaverContainer.clientWidth >= this.screensaverContainer.clientHeight ? "landscape" : "portrait";
			let exclude_media_orientation = config.exclude_media_orientation;
			if (exclude_media_orientation == "auto") {
				exclude_media_orientation = screenOrientation == "landscape" ? "portrait" : "landscape";
			}
			logger.debug(
				`config.exclude_media_orientation=${config.exclude_media_orientation}, screenOrientation=${screenOrientation}, exclude_media_orientation=${exclude_media_orientation}`
			);
			let urls = [];
			const mediaInfo = {};
			const apiUrl = config.image_url.replace(/^immich\+/, "");
			const excludeRegExp = [];
			if (config.exclude_filenames) {
				for (const imageExclude of config.exclude_filenames) {
					excludeRegExp.push(new RegExp(imageExclude));
				}
			}

			function processAssets(assets, folderName = null) {
				assets.forEach((asset) => {
					logger.debug("Processing immich asset", asset);
					const assetType = asset.type.toLowerCase();
					if (!["image", "video"].includes(assetType)) {
						logger.debug("Neither image nor video, skipping");
						return;
					}
					if (config.exclude_media_types && config.exclude_media_types.includes(assetType)) {
						logger.debug(`Media type "${assetType}" excluded`);
						return;
					}

					for (const exclude of excludeRegExp) {
						if (exclude.test(asset.originalFileName)) {
							logger.debug(`Media item excluded by regex "${exclude}"`);
							return;
						}
					}

					if (
						exclude_media_orientation &&
						asset.exifInfo &&
						asset.exifInfo.exifImageWidth &&
						asset.exifInfo.exifImageHeight
					) {
						let orientation =
							asset.exifInfo.exifImageWidth >= asset.exifInfo.exifImageHeight ? "landscape" : "portrait";
						if (asset.exifInfo.orientation && [5, 6, 7, 8].includes(parseInt(asset.exifInfo.orientation))) {
							// 90 or 270 degrees rotated
							orientation = orientation == "landscape" ? "portrait" : "landscape";
						}
						if (orientation === exclude_media_orientation) {
							logger.debug(`Media item with orientation "${orientation}" excluded`);
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
					const info = asset.exifInfo || {};
					info["mediaType"] = assetType;
					info["image"] = {
						filename: asset.originalFileName,
						folderName: folderName
					};
					mediaInfo[url] = info;
					urls.push(url);
				});
			}

			function finalizeImageList() {
				if (urls.length == 0) {
					const msg = "No matching media assets found";
					console.warn(msg);
					wp.showMessage("warning", "Warning", msg);
				}
				if (config.media_order == "random") {
					urls = shuffleArray(urls);
				} else {
					urls = urls.sort(); // Sort consistently if not random
				}
				if (urls.length > config.media_list_max_size) {
					logger.info(`Using only ${config.media_list_max_size} of ${urls.length} media items`);
					urls = urls.slice(0, config.media_list_max_size);
				}
				urls.forEach((url) => {
					addToMediaInfoCache(url, mediaInfo[url]);
				});
				wp.mediaList = urls;
			}

			try {
				if (config.immich_persons && config.immich_persons.length) {
					const orPersonNames = config.immich_persons.map((entry) =>
						(Array.isArray(entry) ? entry : [entry]).map((v) => v.toLowerCase())
					);
					const personNameToId = {};
					let allPeople = [];
					let page = 1;
					let hasNextPage = true;

					// Fetch all people first
					while (hasNextPage) {
						const peopleData = await wp._immichFetch(`${apiUrl}/people?size=1000&page=${page}`);
						allPeople = allPeople.concat(peopleData.people);
						hasNextPage = peopleData.hasNextPage;
						page++;
					}
					allPeople.forEach((person) => {
						personNameToId[person.name.toLowerCase()] = person.id;
					});

					// Fetch assets for each person/group criteria
					for (const personNames of orPersonNames) {
						const personIds = personNames
							.map((name) => personNameToId[name])
							.filter((id) => {
								if (!id) logger.error(`Person not found in immich: ${name}`);
								return !!id;
							});

						if (personIds.length > 0) {
							logger.debug("Searching asset metadata for persons: ", personIds);
							let page = 1;
							while (true) {
								logger.debug(`Fetching asset metadata page ${page}`);
								const searchResults = await wp._immichFetch(`${apiUrl}/search/metadata`, {
									method: "POST",
									body: JSON.stringify({ personIds: personIds, withExif: true, page: page, size: 1000 })
								});
								logger.debug(`Got immich API response`, searchResults);
								if (!searchResults.assets.count) {
									if (page == 1) {
										const msg = `No media items found in immich that contain all these people: ${personNames}`;
										logger.warn(msg);
										wp.showMessage("warning", "Warning", msg);
									}
									break;
								}
								processAssets(searchResults.assets.items);
								if (!searchResults.assets.nextPage) {
									break;
								}
								page = searchResults.assets.nextPage;
							}
						}
					}
				} else if (config.immich_memories) {
					logger.debug("Fetching immich memories (on_this_day)");
					const allMemories = await wp._immichFetch(`${apiUrl}/memories?type=on_this_day`);
					logger.debug(`Got immich API response`, allMemories);
					const now = new Date();
					allMemories
						.filter((memory) => {
							const showAt = new Date(memory.showAt);
							const hideAt = new Date(memory.hideAt);
							return now >= showAt && now <= hideAt;
						})
						.forEach((memory) => {
							logger.debug("Processing memory:", memory);
							processAssets(memory.assets);
						});
				} else if (config.immich_tag_names && config.immich_tag_names.length) {
					const tagNamesLower = config.immich_tag_names.map((v) => v.toLowerCase());
					logger.debug("Fetching immich tags");
					const allTags = await wp._immichFetch(`${apiUrl}/tags`);
					logger.debug(`Got immich API response`, allTags);
					const tagIds = allTags
						.filter((tag) => {
							const include = tagNamesLower.includes(tag.name.toLowerCase());
							logger.debug(`${include ? "Adding" : "Skipping"} tag: ${tag.name}`);
							return include;
						})
						.map((tag) => tag.id);

					if (tagIds.length > 0) {
						logger.debug("Searching asset metadata for tags: ", tagIds);
						let page = 1;
						while (true) {
							logger.debug(`Fetching asset metadata page ${page}`);
							const searchResults = await wp._immichFetch(`${apiUrl}/search/metadata`, {
								method: "POST",
								body: JSON.stringify({ tagIds: tagIds, withExif: true, page: page, size: 1000 })
							});
							logger.debug("Got immich API response", searchResults);
							if (!searchResults.assets.count) {
								if (page == 1) {
									const msg = `No media items found in immich that contain these tags: ${tagNamesLower}`;
									logger.warn(msg);
									wp.showMessage("warning", "Warning", msg);
								}
								break;
							}
							processAssets(searchResults.assets.items);
							if (!searchResults.assets.nextPage) {
								break;
							}
							page = searchResults.assets.nextPage;
						}
					} else {
						const msg = "No matching immich tags found or selected.";
						logger.warn(msg);
						wp.showMessage("warning", "Warning", msg);
					}
				} else {
					// Default: Fetch albums
					const albumNamesLower = (config.immich_album_names || []).map((v) => v.toLowerCase());
					logger.debug(`Fetching immich albums (shared=${config.immich_shared_albums})`);
					const allAlbums = await wp._immichFetch(`${apiUrl}/albums?shared=${config.immich_shared_albums}`);
					logger.debug("Got immich API response", allAlbums);

					const albumIdsToFetch = allAlbums
						.filter((album) => {
							const include = !albumNamesLower.length || albumNamesLower.includes(album.albumName.toLowerCase());
							logger.debug(`${include ? "Adding" : "Skipping"} album: ${album.albumName}`);
							return include;
						})
						.map((album) => album.id);

					if (albumIdsToFetch.length > 0) {
						const albumDetailPromises = albumIdsToFetch.map((albumId) => {
							logger.debug("Fetching album metadata: ", albumId);
							return wp._immichFetch(`${apiUrl}/albums/${albumId}`);
						});
						const albumDetailsList = await Promise.all(albumDetailPromises);
						albumDetailsList.forEach((albumDetails) => {
							logger.debug(`Got immich album details`, albumDetails);
							processAssets(albumDetails.assets, albumDetails.albumName);
						});
					} else {
						const msg = "No matching immich albums found or selected.";
						logger.warn(msg);
						wp.showMessage("warning", "Warning", msg);
					}
				}

				finalizeImageList();
			} catch (error) {
				logger.error("Immich API processing failed:", error);
				throw error; // Re-throw for the main updateMediaList handler
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

		async updateMediaFromUrl(element, url, mediaType = null, headers = null, useFetch = false) {
			// Setting the src attribute works better than fetch because cross-origin requests aren't blocked
			const loadMediaWithElement = async (elem) => {
				const tagName = elem.tagName.toLowerCase();
				const loadEventName = { img: "load", video: "loadeddata", iframe: "load" }[tagName];
				if (!loadEventName) {
					throw new Error(`Unsupported element tag "${elem.tagName}"`);
				}

				const promise = new Promise((resolve, reject) => {
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
						reject(new Error(`Failed to load ${elem.tagName} "${url}"`));
					};

					elem.addEventListener(loadEventName, onLoad);
					elem.onerror = onError;
				});
				if (useFetch) {
					headers = headers || {};
					const response = await fetch(url, { headers: headers });
					logger.debug("Got respone", response);
					if (!response.ok) {
						throw new Error(`Failed to load ${elem.tagName} "${url}": ${response}`);
					}
					// The object URL created by URL.createObjectURL() must be released
					// using URL.revokeObjectURL() to free the associated memory again.
					if (typeof elem.src === "string" && elem.src.startsWith("blob:")) {
						URL.revokeObjectURL(elem.src);
					}
					const blob = await response.blob();
					elem.src = window.URL.createObjectURL(blob);
				} else {
					elem.src = url;
				}
				return promise;
			};

			const handleFallback = async (currentElem, mediaType = null, originalError = null) => {
				if (!mediaType) {
					mediaType = currentElem.tagName.toLowerCase() === "img" ? "video" : "img";
				}
				const fallbackElem = this.replaceMediaElement(currentElem, mediaType);
				try {
					await loadMediaWithElement(fallbackElem);
					return fallbackElem;
				} catch (e) {
					throw originalError || e;
				}
			};

			const loadOrFallback = async (currentElem, withFallback) => {
				try {
					await loadMediaWithElement(currentElem);
					return currentElem;
				} catch (e) {
					if (withFallback) {
						return await handleFallback(currentElem, null, e);
					} else {
						throw e;
					}
				}
			};

			if (!mediaType) {
				return await loadOrFallback(element, true);
			} else if (mediaType === element.tagName.toLowerCase()) {
				return await loadOrFallback(element, false);
			} else {
				return await handleFallback(element, mediaType);
			}
		}

		getNextMediaURL(updateIndex = true) {
			if (!this.mediaList.length) {
				return null;
			}
			let mediaIndex = this.mediaIndex;
			if (this.mediaListDirection == "forwards") {
				mediaIndex++;
			} else {
				mediaIndex--;
			}
			if (mediaIndex >= this.mediaList.length) {
				mediaIndex = 0;
			} else if (mediaIndex < 0) {
				mediaIndex = this.mediaList.length - 1;
			}
			if (updateIndex) {
				this.mediaIndex = mediaIndex;
			}
			return this.mediaList[mediaIndex];
		}

		async updateMediaFromMediaSource(element) {
			const result = await this.hass.callWS({
				type: "media_source/resolve_media",
				media_content_id: element.mediaUrl
			});
			const matchedType = result.mime_type?.match(/^(image|video)\//);
			const mediaType = { image: "img", video: "video" }[matchedType?.[1]] || null;

			let src = result.url;
			if (!src.startsWith("http://") && !src.startsWith("https://")) {
				src = `${document.location.origin}${src}`;
			}
			logger.debug(`Setting image src: ${src}`);
			element.mediaUrl = src;
			return await this.updateMediaFromUrl(element, element.mediaUrl, mediaType);
		}

		async updateMediaFromImmichAPI(element) {
			const mediaInfo = mediaInfoCache.get(element.mediaUrl) || {};
			const mediaType = mediaInfo["mediaType"] == "video" ? "video" : "img";
			return await this.updateMediaFromUrl(
				element,
				element.mediaUrl,
				mediaType,
				{ "x-api-key": config.immich_api_key },
				true
			);
		}

		async updateMediaFromMediaEntity(element) {
			const match = element.mediaUrl.match(/^media-entity-(image|video):\/\/(.*)/);
			if (!match) {
				throw new Error(`Invalid URL "${element.mediaUrl}"`);
			}
			const mediaType = match[1];
			const mediaEntity = match[2];
			const entity = this.hass.states[mediaEntity];
			if (!entity) {
				throw new Error(`Entity "${mediaEntity}" not available`);
			}
			mediaEntityState = entity.state;

			function attributesToMediaInfoCache() {
				if ("media_exif" in entity.attributes) {
					// immich-home-assistant provides media_exif
					addToMediaInfoCache(element.infoCacheUrl, entity.attributes["media_exif"]);
				} else {
					addToMediaInfoCache(element.infoCacheUrl, entity.attributes);
				}
			}

			if (mediaType == "video") {
				element.infoCacheUrl = element.mediaUrl;
				attributesToMediaInfoCache();
				element = this.replaceMediaElement(element, "ha-camera-stream");
				element.style.visibility = "hidden";
				Object.assign(element, {
					hass: this.__hass,
					stateObj: this.__hass.states[mediaEntity],
					"allow-exoplayer": false,
					controls: false
				});

				return new Promise((resolve) => {
					async function onLoad(evt) {
						const el = evt.currentTarget;
						el.removeEventListener("load", onLoad);
						await el.updateComplete;
						const [player, video] = getHaCameraStreamPlayerAndVideo(el);
						player.style.height = "100%";
						video.autoplay = false;
						video.muted = false;
						video.volume = config.video_volume;
						video.style.maxHeight = "100%";
						video.style.height = "100%";
						if (video.readyState >= element.HAVE_ENOUGH_DATA) {
							resolve(el);
						} else {
							const onCanPlay = () => {
								video.removeEventListener("canplay", onCanPlay);
								resolve(el);
							};
							video.addEventListener("canplay", onCanPlay);
						}
					}
					element.addEventListener("load", onLoad);
				});
			} else {
				if (!entity.attributes || !entity.attributes.entity_picture) {
					throw new Error(`Entity "${mediaEntity}" has no entity_picture attribute`);
				}
				const entityPicture = entity.attributes.entity_picture;
				let querySuffix = entityPicture.indexOf("?") > 0 ? "&" : "?";
				// Adding a timestamp ensures that the cache is bypassed
				// and each image gets a unique infoCacheUrl for handling media information correctly
				querySuffix += this.fillPlaceholders("width=${width}&height=${height}&ts=${timestamp_ms}");
				element.mediaUrl = entityPicture + querySuffix;
				element.infoCacheUrl = element.mediaUrl;
				attributesToMediaInfoCache();
				return await this.updateMediaFromUrl(element, element.mediaUrl, "img", null, true);
			}
		}

		async updateMediaFromUnsplashAPI(element) {
			const mediaInfo = mediaInfoCache.get(element.mediaUrl);
			element.mediaUrl = this.fillPlaceholders(element.mediaUrl);
			if (mediaInfo) {
				addToMediaInfoCache(element.mediaUrl, mediaInfo);
			}
			return await this.updateMediaFromUrl(element, element.mediaUrl, "img");
		}

		async updateMediaFromMediaIframe(element) {
			return await this.updateMediaFromUrl(element, element.mediaUrl, "iframe");
		}

		async updateMediaFromOtherSrc(element) {
			element.mediaUrl = this.fillPlaceholders(element.mediaUrl);
			return await this.updateMediaFromUrl(element, element.mediaUrl);
		}

		async updateMedia(element) {
			if (!config.show_images) {
				return;
			}
			this.updatingMedia = true;
			try {
				if (element == this.getActiveMediaElement()) {
					const inactiveElement = this.getInactiveMediaElement();
					if (inactiveElement.tagName.toLowerCase() === "video") {
						try {
							inactiveElement.pause();
						} catch (e) {
							logger.debug(e);
						}
					}
				}
				element.mediaUrl = this.getNextMediaURL();
				if (!element.mediaUrl) {
					return;
				}
				element.infoCacheUrl = element.mediaUrl;

				if (mediaSourceType() == "media-source") {
					element = await this.updateMediaFromMediaSource(element);
				} else if (mediaSourceType() == "unsplash-api") {
					element = await this.updateMediaFromUnsplashAPI(element);
				} else if (mediaSourceType() == "immich-api") {
					element = await this.updateMediaFromImmichAPI(element);
				} else if (mediaSourceType().startsWith("media-entity")) {
					element = await this.updateMediaFromMediaEntity(element);
				} else if (mediaSourceType() == "iframe") {
					element = await this.updateMediaFromMediaIframe(element);
				} else {
					element = await this.updateMediaFromOtherSrc(element);
				}

				if (element) {
					element.style.visibility = "visible";

					const isVideo = element.tagName.toLowerCase() === "video";

					if (isVideo) {
						await new Promise((resolve, reject) => {
							if (element.readyState >= element.HAVE_ENOUGH_DATA) {
								resolve();
							} else {
								const onCanPlay = () => {
									element.removeEventListener("canplay", onCanPlay);
									element.removeEventListener("error", onError);
									resolve();
								};
								const onError = () => {
									element.removeEventListener("canplay", onCanPlay);
									element.removeEventListener("error", onError);
									reject(new Error("Video failed to load"));
								};
								element.addEventListener("canplay", onCanPlay);
								element.addEventListener("error", onError);
							}
						});
					}
					if (config.image_background === "image") {
						this.loadBackgroundImage(element);
					}

					if (
						!isVideo &&
						config.show_image_info &&
						/.*\.jpe?g$/i.test(element.mediaUrl.split("?")[0].replace(/\/*$/, ""))
					) {
						this.fetchEXIFInfo(element);
					}
				}
			} catch (error) {
				// Example: "TypeError: Failed to fetch"
				// This is most likely due to a network error.
				// The network error can be caused by power-saving settings on mobile devices.
				// Make sure the "Keep WiFi on during sleep" option is enabled.
				// Set your WiFi connection to "not metered".
				logger.error(`Failed to update media from ${element.mediaUrl}:`, error);
				this.showMessage("error", "Error", `Failed to update media from ${element.mediaUrl}: ${error}`, 5000);
			}
			this.updatingMedia = false;
			return element;
		}

		setMediaDimensions() {
			const activeElem = this.getActiveMediaElement();
			const mediaElem = this.getActiveMediaElement(true);
			logger.debug("Setting dimensions for media element", activeElem);
			if (!activeElem.mediaUrl) {
				return;
			}
			// Determine if the new media is landscape or portrait, and set the appropriate sizes
			const tagName = mediaElem.tagName.toLowerCase();
			let width = 0;
			let height = 0;
			if (tagName === "video") {
				width = mediaElem.videoWidth;
				height = mediaElem.videoHeight;
			} else if (tagName === "img") {
				width = mediaElem.naturalWidth;
				height = mediaElem.naturalHeight;
			}
			const mediaFit = !width || !height || width >= height ? config.image_fit_landscape : config.image_fit_portrait; // cover / contain

			activeElem.style.position = "absolute";
			activeElem.style.left = "0px";
			activeElem.style.top = "0px";
			activeElem.style.objectFit = mediaFit;
			const availWidth = this.screensaverContainer.clientWidth;
			const availHeight = this.screensaverContainer.clientHeight;
			let setHeight = availHeight;
			let setWidth = availWidth;
			let hiddenHeight = 0;
			let hiddenWidth = 0;
			let setTop = 0;
			let setLeft = 0;

			logger.debug(`Available size is ${availWidth}x${availHeight}, media size is ${width}x${height}`);
			if (width && height) {
				const ratioWidth = availWidth / width;
				const ratioHeight = availHeight / height;
				const diffWidth = availWidth - width * ratioHeight;
				const diffHeight = availHeight - height * ratioWidth;
				logger.debug(`Diff is ${diffWidth}x${diffHeight}`);
				if ((mediaFit == "contain" && diffWidth < diffHeight) || (mediaFit == "cover" && diffWidth >= diffHeight)) {
					logger.debug("Using available width");
					setWidth = availWidth;
					setHeight = Math.floor(height * ratioWidth);
					setTop = Math.floor((setHeight - availHeight) / -2);
					hiddenHeight = Math.max(setHeight - availHeight, 0);
				} else {
					logger.debug("Using available height");
					setHeight = availHeight;
					setWidth = Math.floor(width * ratioHeight);
					setLeft = Math.floor((setWidth - availWidth) / -2);
					hiddenWidth = Math.max(setWidth - availWidth, 0);
				}
			} else if (tagName !== "iframe") {
				logger.warn("Size not available for media element", mediaElem);
			}
			logger.debug(
				`Setting dimensions: size=${setWidth}x${setHeight} - position=${setLeft}x${setTop} - hidden=${hiddenWidth}x${hiddenHeight}`
			);
			activeElem.style.width = `${setWidth}px`;
			activeElem.style.height = `${setHeight}px`;
			activeElem.style.top = `${setTop}px`;
			activeElem.style.left = `${setLeft}px`;
			activeElem.style.setProperty("--hidden-width", hiddenWidth);
			activeElem.style.setProperty("--hidden-height", hiddenHeight);
		}

		startPlayingActiveMedia() {
			const activeElem = this.getActiveMediaElement();
			const videoElement = this.getActiveMediaElement(true);

			if (typeof videoElement.play !== "function") {
				return; // Not playable element.
			}

			const cleanupListeners = () => {
				if (videoElement._wp_video_playback_listeners) {
					Object.entries(videoElement._wp_video_playback_listeners).forEach(([event, handler]) => {
						videoElement.removeEventListener(event, handler);
					});
					videoElement._wp_video_playback_listeners = null;
				}
			};

			videoElement.loop = config.video_loop;
			if (!config.video_loop && !videoElement._wp_video_playback_listeners) {
				// Immediately switch to next image at the end of the playback.
				const onTimeUpdate = () => {
					if (this.getActiveMediaElement() !== videoElement) {
						cleanupListeners();
						return;
					}
					// If the media has played enough and is near the end.
					if (videoElement.currentTime > config.crossfade_time) {
						const remainingTime = videoElement.duration - videoElement.currentTime;
						if (remainingTime <= config.crossfade_time) {
							this.switchActiveMedia("display_time_elapsed");
							cleanupListeners();
						}
					}
				};
				const onMediaEnded = () => {
					if (this.getActiveMediaElement() === videoElement) {
						this.switchActiveMedia("media_end");
					}
					cleanupListeners();
				};
				const onMediaPause = () => {
					cleanupListeners();
				};

				videoElement._wp_video_playback_listeners = {
					timeupdate: onTimeUpdate,
					ended: onMediaEnded,
					pause: onMediaPause
				};
				Object.entries(videoElement._wp_video_playback_listeners).forEach(([event, handler]) => {
					videoElement.addEventListener(event, handler);
				});
			}

			// Start playing the media.
			const wp = this;
			videoElement.play().catch((e) => {
				cleanupListeners();
				if (activeElem === this.getActiveMediaElement()) {
					logger.error(`Failed to play media "${activeElem.mediaUrl}" (src=${videoElement.src}):`, e);
					wp.showMessage("error", "Error", `Failed to play media "${activeElem.mediaUrl}": ${e}`);
				}
			});
		}

		async switchActiveMedia(eventType) {
			if (this.afterFadeoutTimer) {
				clearTimeout(this.afterFadeoutTimer);
			}

			const sourceType = mediaSourceType();
			if (sourceType.startsWith("media-entity")) {
				const mediaEntity = config.image_url.replace(/^media-entity-(image|video):\/\//, "");
				const entity = this.hass.states[mediaEntity];
				if (!entity) {
					logger.error(`Media entity "${mediaEntity}" not available`);
					return;
				}

				if (mediaEntityState != entity.state) {
					logger.debug(`Media entity ${mediaEntity} state has changed`);
				} else if (eventType == "entity_update") {
					return;
				} else if (eventType == "start" || eventType == "user_action") {
					logger.debug(`Media entity ${mediaEntity} state unchanged, but eventType = ${eventType}`);
				} else if (config.media_entity_load_unchanged) {
					logger.debug(`Media entity ${mediaEntity} state unchanged, but media_entity_load_unchanged = true`);
				} else {
					this.lastMediaUpdate = Date.now();
					this.restartProgressBarAnimation();
					return;
				}
				mediaEntityState = entity.state;
			}

			this.lastMediaUpdate = Date.now();
			const activeElement = this.getActiveMediaElement();
			if (
				sourceType === "iframe" &&
				!config.iframe_load_unchanged &&
				this.getNextMediaURL(false) == activeElement.mediaUrl
			) {
				return;
			}

			let crossfadeMillis = eventType == "user_action" ? 250 : Math.round(config.crossfade_time * 1000);
			if (eventType == "start") {
				crossfadeMillis = 0;
			}
			const updateElement = this.getInactiveMediaElement();
			const element = await this.updateMedia(updateElement);
			if (!element) {
				return;
			}
			this._switchActiveMedia(element, crossfadeMillis);
		}

		_switchActiveMedia(newElement, crossfadeMillis = null) {
			this.lastMediaUpdate = Date.now();
			this.imageOneContainer.style.transition = `opacity ${crossfadeMillis}ms ease-in-out`;
			this.imageTwoContainer.style.transition = `opacity ${crossfadeMillis}ms ease-in-out`;

			let curActiveContainer = this.imageOneContainer;
			let newActiveContainer = this.imageTwoContainer;
			let curMedia = this.imageOne;
			let newMedia = this.imageTwo;
			if (newElement == this.imageOne) {
				curActiveContainer = this.imageTwoContainer;
				newActiveContainer = this.imageOneContainer;
				curMedia = this.imageTwo;
				newMedia = this.imageOne;
			}
			logger.debug(`Switching active media to '${newActiveContainer.id}'`);

			if (newActiveContainer.style.opacity != 1) {
				newActiveContainer.style.opacity = 1;
			}
			if (curActiveContainer.style.opacity != 0) {
				curActiveContainer.style.opacity = 0;
			}

			if (newMedia.tagName.toLowerCase() == "iframe" && config.iframe_interaction) {
				newMedia.style.pointerEvents = "auto";
			} else {
				newMedia.style.pointerEvents = "none";
			}

			this.setMediaDataInfo();
			this.setMediaDimensions();
			this.setImageURLEntityState();
			this.startPlayingActiveMedia();
			this.restartProgressBarAnimation();
			this.restartKenBurnsEffect();

			if (curMedia.tagName.toLowerCase() === "video") {
				this.afterFadeoutTimer = setTimeout(function () {
					if (curMedia.tagName.toLowerCase() === "video") {
						try {
							curMedia.pause();
						} catch (e) {
							logger.debug(e);
						}
					}
				}, crossfadeMillis);
			}
		}

		showMessage(type, title, text, timeout = 5000) {
			// type: info / success / warning / error
			if (!this.messageContainer) {
				return;
			}

			const message = document.createElement("div");
			message.className = `wallpanel-message ${type}`;

			const titleDiv = document.createElement("div");
			titleDiv.className = "wallpanel-message-title";
			titleDiv.innerHTML = title;
			message.appendChild(titleDiv);

			const textDiv = document.createElement("div");
			textDiv.className = "wallpanel-message-text";
			textDiv.innerHTML = text;
			message.appendChild(textDiv);

			this.messageContainer.appendChild(message);
			requestAnimationFrame(() => message.classList.add("show"));

			const wp = this;
			setTimeout(() => wp.hideMessage(message), timeout);
		}

		hideMessage(message) {
			message.classList.remove("show");
			message.addEventListener("transitionend", () => message.remove());
		}

		hideAllMessages() {
			const messages = this.messageContainer.querySelectorAll(".wallpanel-message");
			if (!messages.length) {
				return false;
			}
			const wp = this;
			messages.forEach((message) => wp.hideMessage(message));
			return true;
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

		async startScreensaver() {
			logger.debug("Start screensaver");

			this.screensaverStartedAt = Date.now();
			this.screensaverStoppedAt = null;
			this.currentWidth = this.screensaverContainer.clientWidth;
			this.currentHeight = this.screensaverContainer.clientHeight;

			this.setDefaultStyle();
			updateConfig();

			if (!isActive()) {
				logger.debug("Wallpanel not active, not starting screensaver");
				this.screensaverStartedAt = null;
				this.screensaverStoppedAt = Date.now();
				return;
			}

			const activeElement = this.getActiveMediaElement();
			if (activeElement == this.imageOne) {
				this.imageOneContainer.style.opacity = 1;
				this.imageTwoContainer.style.opacity = 0;
			} else {
				this.imageOneContainer.style.opacity = 0;
				this.imageTwoContainer.style.opacity = 1;
			}

			await this.switchActiveMedia("start");
			this.setupScreensaver();

			if (config.keep_screen_on_time > 0) {
				const wp = this;
				setTimeout(function () {
					if (wp.screensaverRunning() && !wp.screenWakeLock.enabled) {
						logger.error(
							"Keep screen on will not work because the user didn't interact with the document first. https://goo.gl/xX8pDD"
						);
						wp.showMessage(
							"info",
							"Keep screen on",
							"Please tap the screen for a moment to keep it awake and prevent it from turning off.",
							15000
						);
					}
				}, 2000);
			}

			this.lastMove = Date.now();
			this.lastMediaUpdate = Date.now();
			document.documentElement.style.overflow = "hidden";

			this.createInfoBoxContent();

			this.style.visibility = "visible";
			this.style.opacity = 1;
			this.style.pointerEvents = "auto";

			this.setScreensaverEntityState();

			if (config.screensaver_start_navigation_path || config.screensaver_stop_close_browser_mod_popup) {
				this.screensaverStopNavigationPathTimeout = setTimeout(
					() => {
						if (config.screensaver_start_navigation_path) {
							skipDisableScreensaverOnLocationChanged = true;
							navigate(config.screensaver_start_navigation_path);
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
			this.hideAllMessages();

			this.debugBox.style.pointerEvents = "none";
			if (fadeOutTime > 0) {
				this.style.transition = `opacity ${Math.round(fadeOutTime * 1000)}ms ease-in-out`;
			} else {
				this.style.transition = "";
			}
			this.style.opacity = 0;
			this.style.visibility = "hidden";
			this.style.pointerEvents = "none";
			this.imageOneInfo.style.pointerEvents = "none";
			this.imageTwoInfo.style.pointerEvents = "none";
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
				if (now - this.lastMediaUpdate >= config.display_time * 1000) {
					this.switchActiveMedia("display_time_elapsed");
				}
				if (now - this.lastMediaListUpdate >= config.media_list_update_interval * 1000) {
					this.updateMediaList(null, true);
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
				html += `<b>Media list size:</b> ${this.mediaList.length}<br/>`;
				const activeElement = this.getActiveMediaElement();
				if (activeElement) {
					html += `<b>Current media:</b> ${activeElement.mediaUrl}<br/>`;
					const mediaInfo = mediaInfoCache.get(activeElement.infoCacheUrl);
					if (mediaInfo) {
						html += `<b>Media info:</b> ${JSON.stringify(mediaInfo)}<br/>`;
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

		switchMediaDirection(direction) {
			this.mediaListDirection = direction;
			this.switchActiveMedia("user_action");
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
			if (isClick && this.hideAllMessages()) {
				// One or messages where hidden
				this.blockEventsUntil = now + 1000;
				return;
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

			if (config.iframe_interaction && mediaSourceType() == "iframe") {
				return;
			}

			if (config.content_interaction) {
				if (this.getMoreInfoDialog()) {
					return;
				}
				let elements = [];
				elements = elements.concat(this.__cards);
				elements = elements.concat(this.__badges);
				elements = elements.concat(this.__views);
				elements.push(this.shadowRoot.getElementById("wallpanel-screensaver-info-box-content"));
				elements.push(this.shadowRoot.getElementById("wallpanel-screensaver-fixed-info-box-content"));
				if (config.image_info_template == "analyze") {
					elements.push(this.imageOneInfo);
					elements.push(this.imageTwoInfo);
				}
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

			let switchMedia = "";
			if (swipe) {
				switchMedia = swipe == "left" ? "backwards" : "forwards";
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
						switchMedia = "forwards";
					} else {
						return;
					}
				} else if (
					config.touch_zone_size_previous_image > 0 &&
					right >= (100 - config.touch_zone_size_previous_image) / 100
				) {
					if (isClick) {
						switchMedia = "backwards";
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

			if (switchMedia) {
				if (this.updatingMedia) {
					logger.debug("Already switching media");
				} else {
					logger.debug(`Switching media, direction ${switchMedia}`);
					if (this.mediaListDirection != switchMedia) {
						this.switchMediaDirection(switchMedia);
					} else {
						this.switchActiveMedia("user_action");
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
	if (elHass && elHass.shadowRoot) {
		elHaMain = elHass.shadowRoot.querySelector("home-assistant-main");
	}
	if (!elHass || !elHass.shadowRoot || !elHaMain) {
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
	userId = (elHass.hass || elHass.__hass).user.id;
	userDisplayname = (elHass.hass || elHass.__hass).user.name;
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
	(elHass.hass || elHass.__hass).connection.subscribeEvents(function (event) {
		logger.debug("lovelace_updated", event);
		const dashboard = event.data.url_path ? event.data.url_path : "lovelace";
		if (dashboard == activePanel) {
			(elHass.hass || elHass.__hass).connection
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
	// logger.log('*******	thumbnail IFD offset (IFD1) is: %s', IFD1OffsetPointer);

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
//	 http://www.onicos.com/staff/iz/amuse/javascript/expert/utf.txt

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
