/**
 * (C) 2020-2022 by Jan Schneider (oss@janschneider.net)
 * Released under the GNU General Public License v3.0
 */


 class ScreenWakeLock {
	constructor() {
		this.enabled = false;
		this.error = null;
		this.debug = false;
		// The Screen Wake Lock API is only available when served over HTTPS
		this.nativeWakeLockSupported = "wakeLock" in navigator;
		this._lock = null;
		this._player = null;
		this._isPlaying = false;

		const handleVisibilityChange = () => {
			if (this.debug) console.debug("handleVisibilityChange");
			if (this.enabled && !document.hidden) {
				this.enable();
			}
		};
		document.addEventListener("visibilitychange", handleVisibilityChange);
		document.addEventListener("fullscreenchange", handleVisibilityChange);

		if (!this.nativeWakeLockSupported) {
			let videoData = 'data:video/mp4;base64,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';
			this._player = document.createElement("video");
			this._player.setAttribute("id", "ScreenWakeLockVideo");
			this._player.setAttribute("src", videoData);
			this._player.setAttribute("playsinline", "");
			this._player.setAttribute("muted", "");
			this._player.addEventListener('ended', (event) => {
				if (this.debug) console.debug("Video ended");
				if (this.enabled) {
					this.enable();
				}
			});
			this._player.addEventListener('playing', (event) => {
				if (this.debug) console.debug("Video playing");
				this._isPlaying = true;
			});
			this._player.addEventListener('pause', (event) => {
				if (this.debug) console.debug("Video pause");
				this._isPlaying = false;
			});
		}
	}

	enable() {
		if (this.nativeWakeLockSupported) {
			if (this.debug) console.debug("Requesting native screen wakelock");
			//if (this._lock) {
			//	this._lock.release();
			//}
			navigator.wakeLock
				.request("screen")
				.then((wakeLock) => {
					if (this.debug) console.debug("Request screen wakelock successful");
					this._lock = wakeLock;
					this.enabled = true;
					this.error = null;
				})
				.catch((e) => {
					this.enabled = false;
					this.error = e;
					console.error(`Failed to request screen wakeLock: ${e}`);
				});
		}
		else {
			if (this.debug) console.debug("Starting video player");
			if (!this._player.paused && this._player._isPlaying) {
				this._player.pause();
			}
			let playPromise = this._player.play();
			if (playPromise) {
				playPromise
					.then((r) => {
						this.enabled = true;
						this.error = null;
						if (this.debug) console.debug("Video play successful");
					})
					.catch((e) => {
						this.enabled = false;
						this.error = e;
						console.error(`Failed to play video: ${e}`);
					});
			}
		}
	}

	disable() {
		if (this.nativeWakeLockSupported) {
			if (this.debug) console.debug("Releasing native screen wakelock");
			if (this._lock) {
				this._lock.release();
			}
			this._lock = null;
		}
		else {
			if (this.debug) console.debug("Stopping video player");
			if (!this._player.paused && this._player._isPlaying) {
				this._player.pause();
			}
		}
		this.enabled = false;
	}
}

const version = "4.3";
const defaultConfig = {
	enabled: false,
	enabled_on_tabs: [],
	debug: false,
	hide_toolbar: false,
	hide_sidebar: false,
	fullscreen: false,
	idle_time: 15,
	fade_in_time: 3.0,
	crossfade_time: 3.0,
	display_time: 15.0,
	keep_screen_on_time: 0,
	black_screen_after_time: 0,
	control_reactivation_time: 1.0,
	screensaver_stop_navigation_path: '',
	screensaver_entity: '',
	image_url: "https://picsum.photos/${width}/${height}?random=${timestamp}",
	image_fit: 'cover', // cover / contain / fill
	image_list_update_interval: 3600,
	image_order: 'sorted', // sorted / random
	image_excludes: [],
	show_exif_info: false,
	fetch_address_data: false,
	exif_info_template: '${DateTimeOriginal}',
	info_animation_duration_x: 0,
	info_animation_duration_y: 0,
	info_animation_timing_function_x: 'ease',
	info_animation_timing_function_y: 'ease',
	info_move_pattern: 'random',
	info_move_interval: 0,
	info_move_fade_duration: 2.0,
	style: {},
	badges: [],
	cards: [
		{type: 'weather-forecast', entity: 'weather.home', show_forecast: true}
	],
	profile: '',
	profile_entity: '',
	profiles: {}
};

let config = {};
let activePanelUrl = null;
let activePanelTab = null;
let fullscreen = false;
let screenWakeLock = new ScreenWakeLock();
let wallpanel = null;
let classStyles = {
	"wallpanel-screensaver-image-info-exif": {
		"position": "absolute",
		"bottom": "0.5em",
		"right": "0.5em",
		"padding": "0.1em 0.5em 0.1em 0.5em",
		"font-size": "2em",
		"background": "#00000055",
		"backdrop-filter": "blur(2px)",
		"border-radius": "0.1em"
	}
}
let exifDataCache = {};
let exifDataCacheKeys = [];
const exifDataCacheMaxSize = 1000;

const elHass = document.querySelector("body > home-assistant");
const elHaMain = elHass.shadowRoot.querySelector("home-assistant-main");
const LitElement = Object.getPrototypeOf(customElements.get("hui-masonry-view"));
const HuiView = customElements.get("hui-view");

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
				Object.assign(target, { [key]: source[key] });
			}
		}
	}
	return mergeConfig(target, ...sources);
}

function updateConfig() {
	const params = new URLSearchParams(window.location.search);
	const user = elHass.__hass.user.name ? elHass.__hass.user.name.toLowerCase().replace(/\s/g, '_') : null;
	
	config = {};
	mergeConfig(config, defaultConfig);
	mergeConfig(config, getHaPanelLovelaceConfig());
	
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
		if (config.debug) console.debug(`Profile set from config: ${profile}`);
	}
	if (config.profiles && user && config.profiles[`user.${user}`]) {
		let profile = `user.${user}`;
		config = mergeConfig(config, config.profiles[profile]);
		if (config.debug) console.debug(`Profile set from user: ${profile}`);
	}
	config = mergeConfig(config, paramConfig);
	const profile_entity = insertBrowserID(config.profile_entity);
	if (config.profiles && profile_entity && elHass.__hass.states[profile_entity] && config.profiles[elHass.__hass.states[profile_entity].state]) {
		let profile = elHass.__hass.states[profile_entity].state;
		config = mergeConfig(config, config.profiles[profile]);
		if (config.debug) console.debug(`Profile set from entity state: ${profile}`);
	}

	if (config.image_url) {
		if (config.image_url.startsWith("/")) {
			config.image_url = `media-source://media_source${config.image_url}`;
		}
		if (config.image_url.startsWith("media-source://media_source")) {
			config.image_url = config.image_url.replace(/\/+$/, '');
		}
	}
	if (!config.enabled) {
		config.debug = false;
		config.hide_toolbar = false;
		config.hide_sidebar = false;
		config.fullscreen = false;
		config.idle_time = 0;
	}
	if (config.debug) console.debug(`Wallpanel config is now: ${JSON.stringify(config)}`);
	
	if (wallpanel) {
		if (isActive()) {
			wallpanel.reconfigure();
		}
		else if (wallpanel.screensaverStartedAt > 0) {
			wallpanel.stopScreensaver();
		}
	}
}


function isActive() {
	if (!config.enabled) {
		return false;
	}
	if (config.enabled_on_tabs && config.enabled_on_tabs.length > 0 && activePanelTab && !config.enabled_on_tabs.includes(activePanelTab)) {
		return false;
	}
	const params = new URLSearchParams(window.location.search);
	if (params.get("edit") == "1") {
		return false;
	}
	return true;
}


function getHaPanelLovelace() {
	try {
		return elHaMain.shadowRoot.querySelector('ha-panel-lovelace')
	}
	catch (e) {
		console.error(e);
	}
}


function getHaPanelLovelaceConfig() {
	let pl = getHaPanelLovelace();
	if (pl && pl.lovelace && pl.lovelace.config && pl.lovelace.config.wallpanel) {
		return pl.lovelace.config.wallpanel;
	}
	return {}
}


function getCurrentView() {
	try {
		return elHaMain.shadowRoot
		.querySelector('ha-panel-lovelace').shadowRoot
		.querySelector('hui-root').shadowRoot
		.querySelector('hui-view')
	}
	catch (e) {
		console.error(e);
	}
}


function setSidebarHidden(hidden) {
	try {
		elHaMain.shadowRoot.querySelector("ha-sidebar").style.visibility = (hidden ? "hidden" : "visible");
		if (hidden) {
			elHaMain.style.setProperty("--app-drawer-width", 0);
		}
		else {
			elHaMain.style.removeProperty("--app-drawer-width");
		}
		window.dispatchEvent(new Event('resize'));
	}
	catch (e) {
		if (config.debug) console.debug(e);
	}
}


function setToolbarHidden(hidden) {
	try {
		let appToolbar = elHaMain.shadowRoot
		.querySelector("ha-panel-lovelace").shadowRoot
		.querySelector("hui-root").shadowRoot
		.querySelector("app-toolbar");
		if (hidden) {
			appToolbar.style.setProperty("display", "none");
		}
		else {
			appToolbar.style.removeProperty("display");
		}
		window.dispatchEvent(new Event('resize'));
	}
	catch (e) {
		if (config.debug) console.debug(e);
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


function findImages(hass, mediaContentId) {
	if (config.debug) console.debug(`findImages: ${mediaContentId}`);
	let excludeRegExp = [];
	if (config.image_excludes) {
		for (let imageExclude of config.image_excludes) {
			excludeRegExp.push(new RegExp(imageExclude));
		}
	}
	
	return new Promise(
		function(resolve, reject) {
			hass.callWS({
				type: "media_source/browse_media",
				media_content_id: mediaContentId
			}).then(
				mediaEntry => {
					//console.debug(mediaEntry);
					var promises = mediaEntry.children.map(child => {
						let filename = child.media_content_id.replace(/^media-source:\/\/media_source/, '');
						for (let exclude of excludeRegExp) {
							if (exclude.test(filename)) {
								return;
							}
						}
						if (child.media_class == "image") {
							//console.debug(child);
							return child.media_content_id;
						}
						if (child.media_class == "directory") {
							return findImages(hass, child.media_content_id);
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
					//console.warn(error);
					reject(error);
				}
			);
		}
	);
}


function insertBrowserID(string) {
	if (!string) {
		if (config.debug) console.debug(`insertBrowserID(${string}): no string`);
		return string
	}
	if (!browserId) {
		if (config.debug) console.debug(`insertBrowserID(${string}): no browser_mod`);
		return string
	}
	let res = string.replace("${browser_id}", browserId);
	if (config.debug) console.debug(`insertBrowserID(${string}): return ${res}`);
	return res;
}


document.addEventListener('fullscreenerror', (event) => {
	console.error('Failed to enter fullscreen');
});


document.addEventListener('fullscreenchange', (event) => {
	fullscreen = Boolean(document.fullscreenElement);
});


function enterFullscreen() {
	if (config.debug) console.debug("Enter fullscreen");
	// Will need user input event to work
	let el = document.documentElement;
	if (el.requestFullscreen) {
		el.requestFullscreen().then(
			result => {
				if (config.debug) console.debug("Successfully requested fullscreen");
			},
			error => {
				console.error(error);
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
		this.lastImageListUpdate;
		this.updatingImageList = false;
		this.lastImageUpdate = 0;
		this.messageBoxTimeout = null;
		this.blockEventsUntil = 0;
		this.screensaverStartedAt;
		this.screensaverStoppedAt = new Date();
		this.idleSince = Date.now();
		this.bodyOverflowOrig = null;
		this.lastProfileSet = insertBrowserID(config.profile);
		this.lastMove = null;
		this.lastCorner = 0; // 0 - top left, 1 - bottom left, 2 - bottom right, 3 - top right
		this.translateInterval = null;
		
		this.__hass = elHass.__hass;
		this.__cards = [];
		this.__badges = [];
		
		elHass.provideHass(this);
		setInterval(this.timer.bind(this), 1000);
	}

	// Whenever the state changes, a new `hass` object is set.
	set hass(hass) {
		if (config.debug) console.debug("Update hass");
		this.__hass = hass;

		this.updateProfile();

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

		if (this.screensaverStartedAt) {
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
		if (this.screensaverStartedAt && this.__hass.states[screensaver_entity].state == 'on') return;
		if (!this.screensaverStartedAt && this.__hass.states[screensaver_entity].state == 'off') return;

		this.__hass.callService('input_boolean', this.screensaverStartedAt ? "turn_on" : "turn_off", {
			entity_id: screensaver_entity
		}).then(
			result => {
				if (config.debug) console.debug(result);
			},
			error => {
				console.error("Failed to set screensaver entity state:", error);
			}
		);
	}

	updateProfile() {
		const profile_entity = insertBrowserID(config.profile_entity);
		if (profile_entity && this.__hass.states[profile_entity]) {
			const profile = this.__hass.states[profile_entity].state;
			if ((profile && profile != this.lastProfileSet) || (!profile && this.lastProfileSet)) {
				if (config.debug) console.debug(`Set profile to ${profile}`);
				this.lastProfileSet = profile;
				updateConfig();
			}
		}
	}

	timer() {
		if (!config.enabled || !activePanelUrl) {
			return;
		}
		if (this.screensaverStartedAt) {
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
		this.messageBox.style.zIndex = 1001;
		this.messageBox.style.visibility = 'hidden';
		//this.messageBox.style.margin = '5vh auto auto auto';
		this.messageBox.style.padding = '5vh 0 0 0';
		this.messageBox.style.fontSize = '5vh';
		this.messageBox.style.textAlign = 'center';
		this.messageBox.style.transition = 'visibility 200ms ease-in-out';
		
		this.debugBox.removeAttribute('style');
		this.debugBox.style.position = 'fixed';
		this.debugBox.style.pointerEvents = "none";
		this.debugBox.style.top = '40%';
		this.debugBox.style.left = 0;
		this.debugBox.style.width = '100%';
		this.debugBox.style.height = '60%';
		this.debugBox.style.background = '#00000099';
		this.debugBox.style.zIndex = 1001;
		this.debugBox.style.visibility = 'hidden';
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
		
		this.imageOneContainer.removeAttribute('style');
		this.imageOneContainer.style.position = 'absolute';
		this.imageOneContainer.style.top = 0;
		this.imageOneContainer.style.left = 0;
		this.imageOneContainer.style.width = '100%';
		this.imageOneContainer.style.height = '100%';
		this.imageOneContainer.style.opacity = 1;
		
		this.imageOne.removeAttribute('style');
		this.imageOne.style.position = 'relative';
		this.imageOne.style.width = '100%';
		this.imageOne.style.height = '100%';
		this.imageOne.style.objectFit = 'contain';

		this.imageOneInfoContainer.removeAttribute('style');
		this.imageOneInfoContainer.style.position = 'absolute';
		this.imageOneInfoContainer.style.top = 0;
		this.imageOneInfoContainer.style.left = 0;
		this.imageOneInfoContainer.style.width = '100%';
		this.imageOneInfoContainer.style.height = '100%';

		this.imageTwoContainer.removeAttribute('style');
		this.imageTwoContainer.style.position = 'absolute';
		this.imageTwoContainer.style.top = 0;
		this.imageTwoContainer.style.left = 0;
		this.imageTwoContainer.style.width = '100%';
		this.imageTwoContainer.style.height = '100%';
		this.imageTwoContainer.style.opacity = 1;
		
		this.imageTwo.removeAttribute('style');
		this.imageTwo.style.position = 'relative';
		this.imageTwo.style.width = '100%';
		this.imageTwo.style.height = '100%';
		this.imageTwo.style.objectFit = 'contain';

		this.imageTwoInfoContainer.removeAttribute('style');
		this.imageTwoInfoContainer.style.position = 'absolute';
		this.imageTwoInfoContainer.style.top = 0;
		this.imageTwoInfoContainer.style.left = 0;
		this.imageTwoInfoContainer.style.width = '100%';
		this.imageTwoInfoContainer.style.height = '100%';
		
		this.infoContainer.removeAttribute('style');
		this.infoContainer.style.position = 'absolute';
		this.infoContainer.style.top = 0;
		this.infoContainer.style.left = 0;
		this.infoContainer.style.width = '100%';
		this.infoContainer.style.height = '100%';
		this.infoContainer.style.transition = 'opacity 2000ms ease-in-out';
		this.infoContainer.style.padding = '25px';

		this.infoBox.removeAttribute('style');
		this.infoBox.style.width = 'fit-content';
		this.infoBox.style.height = 'fit-content';
		this.infoBox.style.borderRadius = '10px';
		this.infoBox.style.setProperty('--wp-card-width', '500px');
		this.infoBox.style.setProperty('--wp-card-padding', '0px');
		this.infoBox.style.setProperty('--wp-card-margin', '5px');
		this.infoBox.style.setProperty('--wp-card-backdrop-filter', 'none');
		
		this.screensaverOverlay.removeAttribute('style');
		this.screensaverOverlay.style.position = 'absolute';
		this.screensaverOverlay.style.top = 0;
		this.screensaverOverlay.style.left = 0;
		this.screensaverOverlay.style.width = '100%';
		this.screensaverOverlay.style.height = '100%';
		this.screensaverOverlay.style.background = '#00000000';
	}

	updateStyle() {
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
						if (config.debug) console.debug(`Setting style attributes for element #${elId}`);
						for (const attr in config.style[elId]) {
							if (config.debug) console.debug(`Setting style attribute ${attr} to ${config.style[elId][attr]}`);
							el.style.setProperty(attr, config.style[elId][attr]);
						}
					}
					else {
						console.error(`Element #${elId} not found`);
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
		let wp = this;
		let ms = Math.round(config.info_move_fade_duration * 500);
		if (ms < 0) {
			ms = 0;
		}
		if (wp.translateInterval) {
			clearInterval(wp.translateInterval);
		}
		wp.translateInterval = setInterval(function() {
			wp.infoBoxPosX.style.transform = `translate3d(${x}px, 0px, 0px)`;
			wp.infoBoxPosY.style.transform = `translate3d(0px, ${y}px, 0px)`;	
		}, ms);
	}

	createInfoBoxContent() {
		if (config.debug) console.debug("Creating info box content");
		this.infoBoxContent.innerHTML = '';
		this.__badges = [];
		this.__cards = [];

		if (config.badges) {
			const div = document.createElement('div');
			div.style.padding = 'var(--wp-card-padding)';
			div.style.margin = 'var(--wp-card-margin)';
			div.style.textAlign = 'center';
			config.badges.forEach(badgeConfig => {
				if (config.debug) console.debug("Creating badge:", badgeConfig);
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
				if (config.debug) console.debug("Creating card:", cardConfig);
				let style = {};
				if (cardConfig.wp_style) {
					style = cardConfig.wp_style;
					delete cardConfig.wp_style;
				}
				const cardElement = this.createCardElement(cardConfig);
				cardElement.hass = this.hass;
				this.__cards.push(cardElement);
				const div = document.createElement('div');
				div.style.width = 'var(--wp-card-width)';
				div.style.padding = 'var(--wp-card-padding)';
				div.style.margin = 'var(--wp-card-margin)';
				div.style.backdropFilter = 'var(--wp-card-backdrop-filter)';
				for (const attr in style) {
					div.style.setProperty(attr, style[attr]);
				}
				div.append(cardElement);
				this.infoBoxContent.appendChild(div);
			});
		}
		
		setTimeout(this.updateShadowStyle.bind(this), 500);
	}

	connectedCallback() {
		this.style.zIndex = 1000;
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

		this.imageOne = document.createElement('img');
		this.imageOne.id = 'wallpanel-screensaver-image-one';
		this.imageOne.setAttribute('data-loading', false);

		this.imageOneInfoContainer = document.createElement('div');
		this.imageOneInfoContainer.id = 'wallpanel-screensaver-image-one-info-container';

		this.imageOneInfoExif = document.createElement('div');
		this.imageOneInfoExif.className = 'wallpanel-screensaver-image-info-exif';
		this.imageOneInfoExif.id = 'wallpanel-screensaver-image-one-info-exif';
		
		this.imageOneInfoContainer.appendChild(this.imageOneInfoExif);
		this.imageOneContainer.appendChild(this.imageOne);
		this.imageOneContainer.appendChild(this.imageOneInfoContainer);
		this.screensaverContainer.appendChild(this.imageOneContainer);

		this.imageTwoContainer = document.createElement('div');
		this.imageTwoContainer.id = 'wallpanel-screensaver-image-two-container';
		
		this.imageTwo = document.createElement('img');
		this.imageTwo.id = 'wallpanel-screensaver-image-two';
		this.imageTwo.setAttribute('data-loading', false);

		this.imageTwoInfoContainer = document.createElement('div');
		this.imageTwoInfoContainer.id = 'wallpanel-screensaver-image-two-info-container';
		
		this.imageTwoInfoExif = document.createElement('div');
		this.imageTwoInfoExif.className = 'wallpanel-screensaver-image-info-exif';
		this.imageTwoInfoExif.id = 'wallpanel-screensaver-image-two-info-exif';

		this.imageTwoInfoContainer.appendChild(this.imageTwoInfoExif);
		this.imageTwoContainer.appendChild(this.imageTwo);
		this.imageTwoContainer.appendChild(this.imageTwoInfoContainer);
		this.screensaverContainer.appendChild(this.imageTwoContainer);
		
		this.infoContainer = document.createElement('div');
		this.infoContainer.id = 'wallpanel-screensaver-info-container';

		this.screensaverContainer.appendChild(this.infoContainer);

		this.infoBoxPosX = document.createElement('div');
		this.infoBoxPosX.id = 'wallpanel-screensaver-info-box-pos-x';

		this.infoBoxPosY = document.createElement('div');
		this.infoBoxPosY.id = 'wallpanel-screensaver-info-box-pos-y';

		this.infoBox = document.createElement('div');
		this.infoBox.id = 'wallpanel-screensaver-info-box';
		
		this.infoBoxContent = document.createElement('div');
		this.infoBoxContent.id = 'wallpanel-screensaver-info-box-content';
		this.infoBoxContent.style.display = 'grid';

		this.infoBox.appendChild(this.infoBoxContent);
		this.infoBoxPosX.appendChild(this.infoBox);
		this.infoBoxPosY.appendChild(this.infoBoxPosX);
		this.infoContainer.appendChild(this.infoBoxPosY);

		this.screensaverOverlay = document.createElement('div');
		this.screensaverOverlay.id = 'wallpanel-screensaver-overlay';
		
		this.screensaverContainer.appendChild(this.screensaverOverlay);

		this.shadowStyle = document.createElement('style');
		
		let shadow = this.attachShadow({mode: 'open'});
		shadow.appendChild(this.shadowStyle);
		shadow.appendChild(this.screensaverContainer);
		shadow.appendChild(this.messageBox);
		shadow.appendChild(this.debugBox);

		this.setDefaultStyle();
		this.updateStyle();

		if (config.idle_time > 0 && config.image_url) {
			if (config.image_url.startsWith("media-source://media_source")) {
				this.updateImageList(this.preloadImages.bind(this));
			}
			else {
				this.preloadImages();
			}
		}

		let wp = this;
		['click', 'touchstart', 'mousemove', 'wheel', 'keydown'].forEach(function(eventName) {
			let click = ['click', 'touchstart'].includes(eventName);
			window.addEventListener(eventName, event => {
				wp.handleInteractionEvent(event, click);
			}, { capture: true, passive: !click });
		});
		window.addEventListener("resize", event => {
			if (wp.screensaverStartedAt) {
				wp.updateShadowStyle();
			}
		});
		
		[this.imageOne, this.imageTwo].forEach(function(img) {
			if (!img) return;
			img.addEventListener('load', function() {
				img.setAttribute('data-loading', false);
				if (config.show_exif_info && img.imagePath && /.*\.jpe?g$/i.test(img.imagePath)) {
					wp.fetchEXIFInfo(img);
				}
			});
			img.addEventListener('error', function() {
				img.setAttribute('data-loading', false);
				console.error(`Failed to load image: ${img.src}`);
				if (img.imagePath) {
					const idx = wp.imageList.indexOf(img.imagePath);
					if (idx > -1) {
						if (config.debug) console.debug(`Removing image from list: ${img.imagePath}`);
						wp.imageList.splice(idx, 1);
					}
				}
				wp.updateImage(img);
			})
		});
	}

	fetchEXIFInfo(img) {
		let wp = this;
		if (exifDataCache[img.imagePath]) {
			return;
		}
		if (exifDataCacheKeys.length >= exifDataCacheMaxSize) {
			let oldest = exifDataCacheKeys.shift();
			if (exifDataCache[oldest]) {
				delete exifDataCache[oldest];
			}
		}

		const tmpImg = document.createElement("img");
		tmpImg.imagePath = img.imagePath;
		tmpImg.src = img.src;
		getImageData(tmpImg, function() {
			if (config.debug) console.debug("EXIF data:", tmpImg.exifdata);
			exifDataCacheKeys.push(tmpImg.imagePath);
			exifDataCache[tmpImg.imagePath] = tmpImg.exifdata;
			wp.setEXIFImageInfo(tmpImg.imagePath);
			
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
						if (config.debug) console.debug("nominatim data:", info);
						if (info && info.address) {
							exifDataCache[tmpImg.imagePath].address = info.address;
							wp.setEXIFImageInfo(tmpImg.imagePath);
						}
					}
					else {
						console.error("nominatim error:", this.status, xhr.status, xhr.responseText);
						delete exifDataCache[tmpImg.imagePath];
					}
				}
				xhr.onerror = function(event) { 
					console.error("nominatim error:", event);
					delete exifDataCache[tmpImg.imagePath];
				}
				xhr.ontimeout = function(event) { 
					console.error("nominatim timeout:", event);
					delete exifDataCache[tmpImg.imagePath];
				}
				xhr.open("GET", `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
				//xhr.setRequestHeader("User-Agent", `lovelace-wallpanel/${version}`);
				xhr.timeout = 15000;
				xhr.send();
			}
		});
	}
	
	setEXIFImageInfo(imagePath) {
		let imgExifData = exifDataCache[imagePath];
		let exifElement = null;
		if (this.imageOne.imagePath == imagePath) {
			exifElement = this.imageOneInfoExif;
		}
		else if (this.imageTwo.imagePath == imagePath) {
			exifElement = this.imageTwoInfoExif;
		}
		if (!exifElement) {
			return;
		}

		if ((!config.show_exif_info) || (!exifDataCache[imagePath])) {
			exifElement.innerHTML = "";
			return;
		}
		
		let html = config.exif_info_template;
		html = html.replace(/\${([^}]+)}/g, function (match, tags, offset, string) {
			if (!imgExifData) {
				return "";
			}
			imgExifData["image"] = {path: imagePath};
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
				val = imgExifData;
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
				val = date.toLocaleDateString(undefined, options);
			}
			return prefix + val + suffix;
		});
		exifElement.innerHTML = html;
	}

	reconfigure() {
		this.updateImageList();
		this.setDefaultStyle();
		this.updateStyle();
		this.createInfoBoxContent();
	}

	updateImageList(callback) {
		if (!config.image_url || !config.image_url.startsWith("media-source://media_source")) return;
		if (this.updatingImageList) return;
		this.lastImageListUpdate = Date.now();
		this.updatingImageList = true;
		let mediaContentId = config.image_url;
		let wp = this;
		findImages(this.hass, mediaContentId).then(
			result => {
				this.imageList = result.sort();
				if (config.debug) {
					console.debug("Image list is now:", this.imageList);
				}
				this.updatingImageList = false;
				if (callback) {
					callback();
				}
			},
			error => {
				this.updatingImageList = false;
				error = `Failed to update image list from ${config.image_url}: ${JSON.stringify(error)}`;
				console.error(error);
				wp.displayMessage(error, 10000)
			}
		)
	}

	updateImageFromUrl(img) {
		let width = this.screensaverContainer.clientWidth;
		let height = this.screensaverContainer.clientHeight;
		let timestamp_ms = Date.now();
		let timestamp = Math.floor(timestamp_ms / 1000);
		let imageUrl = config.image_url;
		imageUrl = imageUrl.replace(/\${width}/g, width);
		imageUrl = imageUrl.replace(/\${height}/g, height);
		imageUrl = imageUrl.replace(/\${timestamp_ms}/g, timestamp_ms);
		imageUrl = imageUrl.replace(/\${timestamp}/g, timestamp);
		if (config.debug) console.debug(`Updating image '${img.id}' from '${imageUrl}'`);
		img.src = imageUrl;
	}
	
	updateImageFromMediaSource(img) {
		if (this.imageList.length == 0) {
			return;
		}
		if (config.image_order == "random") {
			if (this.imageList.length > 1) {
				let imageIndex = this.imageIndex;
				while (imageIndex == this.imageIndex) {
					imageIndex = Math.floor(Math.random() * this.imageList.length);
				}
				this.imageIndex = imageIndex;
			}
		}
		else {
			this.imageIndex++;
		}
		if (this.imageIndex >= this.imageList.length) {
			this.imageIndex = 0;
		}
		let imagePath = this.imageList[this.imageIndex];
		if (!imagePath) {
			return;
		}
		img.imagePath = imagePath;
		imagePath = imagePath.replace(/^media-source:\/\/media_source/, '/media');
		this.hass.callWS({
			type: "auth/sign_path",
			path: imagePath,
			expires: 60
		}).then(
			result => {
				img.src = `${document.location.origin}${result.path}`;
			},
			error => {
				console.error("auth/sign_path error:", error);
			}
		);
	}
	
	updateImage(img) {
		if (!config.image_url) {
			return;
		}
		img.setAttribute('data-loading', true);
		img.imagePath = null;
		
		if (config.image_url.startsWith("media-source://media_source")) {
			this.updateImageFromMediaSource(img);
		}
		else {
			this.updateImageFromUrl(img);
		}
		
	}
	
	preloadImages() {
		if (config.debug) console.debug("Preloading images");
		this.updateImage(this.imageOne);
		let wp = this;
		setTimeout(function() {
			wp.updateImage(wp.imageTwo);
		}, 1000);
	}

	switchActiveImage(crossfadeMillis = null) {
		this.lastImageUpdate = Date.now();
		
		if (crossfadeMillis === null) {
			crossfadeMillis = Math.round(config.crossfade_time*1000);
		}
		
		this.imageOneContainer.style.transition = `opacity ${crossfadeMillis}ms ease-in-out`;
		this.imageTwoContainer.style.transition = `opacity ${crossfadeMillis}ms ease-in-out`;

		let curActive = this.imageOneContainer;
		let newActive = this.imageTwoContainer;
		if (this.imageTwoContainer.style.opacity == 1) {
			curActive = this.imageTwoContainer;
			newActive = this.imageOneContainer;
		}
		if (config.debug) console.debug(`Switching active image to '${newActive.id}'`);

		let newImg = newActive.children[0];
		if (newImg.imagePath) {
			this.setEXIFImageInfo(newImg.imagePath);
		}

		if (newActive.style.opacity != 1) {
			newActive.style.opacity = 1;
		}
		if (curActive.style.opacity != 0) {
			curActive.style.opacity = 0;
		}

		// Load next image after fade out
		let wp = this;
		setTimeout(function() {
			wp.updateImage(curActive.children[0]);
		}, crossfadeMillis);
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
		if (config.debug) console.debug("Setup screensaver");
		if (config.fullscreen && !fullscreen) {
			enterFullscreen();
		}
		if (config.keep_screen_on_time > 0 && !screenWakeLock.enabled) {
			screenWakeLock.enable();
		}
	}

	startScreensaver() {
		if (config.debug) console.debug("Start screensaver");
		if (!isActive()) {
			if (config.debug) console.debug("Wallpanel not active, not starting screensaver");
			return;
		}

		this.updateStyle();
		this.setupScreensaver();
		
		if (config.keep_screen_on_time > 0) {
			let wp = this;
			setTimeout(function() { 
				if (wp.screensaverStartedAt && !screenWakeLock.enabled) {
					console.error("Keep screen on will not work because the user didn't interact with the document first. https://goo.gl/xX8pDD");
					wp.displayMessage("Please interact with the screen for a moment to request wake lock.", 15000)
				}
			}, 2000);
		}
		
		this.lastMove = Date.now();
		this.lastImageUpdate = Date.now();
		this.screensaverStartedAt = Date.now();
		this.screensaverStoppedAt = null;
		if (document.body.style.overflow != 'hidden') {
			this.bodyOverflowOrig = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
		}
	
		this.createInfoBoxContent();
		
		this.style.visibility = 'visible';
		this.style.opacity = 1;

		this.setScreensaverEntityState();

		if (config.screensaver_stop_navigation_path) {
			setTimeout(() => {
				navigate(config.screensaver_stop_navigation_path);
			}, (config.fade_in_time+1)*1000);
		}
	}
	
	stopScreensaver() {
		if (config.debug) console.debug("Stop screensaver");
		
		this.screensaverStartedAt = null;
		this.screensaverStoppedAt = Date.now();
		document.body.style.overflow = this.bodyOverflowOrig;
		
		this.hideMessage();

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
		let now = Date.now();
		
		if (config.info_move_interval > 0 && now - this.lastMove >= config.info_move_interval*1000) {
			if (config.info_move_pattern === 'random') {
				this.randomMove();
			}
			else if (config.info_move_pattern === 'corners') {
				this.moveAroundCorners();
			}
			else {
				console.error(`Unknown info move type ${config.info_move_pattern}`);
			}
		}

		if (config.black_screen_after_time > 0 && now - this.screensaverStartedAt >= config.black_screen_after_time*1000) {
			if (config.debug) console.debug("Setting screen to black");
			if (this.imageOneContainer.style.visibility != 'hidden') {
				this.imageOneContainer.style.visibility = 'hidden';
			}
			if (this.imageTwoContainer.style.visibility != 'hidden') {
				this.imageTwoContainer.style.visibility = 'hidden';
			}
			if (this.infoContainer.style.visibility != 'hidden') {
				this.infoContainer.style.visibility = 'hidden';
			}
		}
		else if (config.image_url) {
			if (now - this.lastImageUpdate >= config.display_time*1000) {
				this.switchActiveImage();
			}
			if (now - this.lastImageListUpdate >= config.image_list_update_interval*1000) {
				this.updateImageList();
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
			html += `Version: ${version}<br/>`;
			html += `Config: ${JSON.stringify(config)}<br/>`;
			html += `Fullscreen: ${fullscreen}<br/>`;
			html += `Screensaver started at: ${wallpanel.screensaverStartedAt}<br/>`;
			html += `Screen wake lock: enabled=${screenWakeLock.enabled} native=${screenWakeLock.nativeWakeLockSupported} lock=${screenWakeLock._lock} player=${screenWakeLock._player} error=${screenWakeLock.error}<br/>`;
			if (screenWakeLock._player) {
				let p = screenWakeLock._player;
				html += `Screen wake lock video: readyState=${p.readyState} currentTime=${p.currentTime} paused=${p.paused} ended=${p.ended}<br/>`;
			}
			this.debugBox.innerHTML = html;
			this.debugBox.scrollTop = this.debugBox.scrollHeight;
		}
		if (screenWakeLock.enabled && now - this.screensaverStartedAt >= config.keep_screen_on_time*1000) {
			console.info(`Disable wake lock after ${config.keep_screen_on_time} seconds`);
			screenWakeLock.disable();
		}
	}

	handleInteractionEvent(e, isClick) {
		let now = Date.now();
		this.idleSince = now;
		if (this.messageBoxTimeout) {
			// Message on screen
			this.blockEventsUntil = now + 1000;
		}
		if (isClick) {
			this.hideMessage();
			this.setupScreensaver();
		}
		if (this.screensaverStartedAt || this.blockEventsUntil > now) {
			if (isClick) {
				e.preventDefault();
			}
			e.stopImmediatePropagation();
		}
		if (! this.screensaverStartedAt || this.blockEventsUntil > now) {
			return;
		}
		if (e instanceof MouseEvent || e instanceof TouchEvent) {
			let x = e.clientX;
			let right = 0.0
			if (!x && e.touches && e.touches[0]) {
				x = e.touches[0].clientX;
			}
			if (x) {
				right = (this.screensaverContainer.clientWidth - x) / this.screensaverContainer.clientWidth;
			}
			if (right <= 0.15) {
				if (
					isClick && (now - this.lastImageUpdate > 500) &&
					(this.imageOne.getAttribute('data-loading') == "false") &&
					(this.imageTwo.getAttribute('data-loading') == "false")
				) {
					this.switchActiveImage(500);
				}
				return;
			}
		}
		// Prevent interaction with the dashboards after screensaver was stopped
		this.blockEventsUntil = now + config.control_reactivation_time * 1000;
		this.stopScreensaver();
	}
}


updateConfig();
customElements.define("wallpanel-view", WallpanelView);
wallpanel = document.createElement("wallpanel-view");
document.body.appendChild(wallpanel);


function activateWallpanel() {
	updateConfig();
	setToolbarHidden(config.hide_toolbar);
	setSidebarHidden(config.hide_sidebar);
}


function deactivateWallpanel() {
	if (wallpanel.screensaverStartedAt > 0) {
		wallpanel.stopScreensaver();
	}
	setToolbarHidden(false);
	setSidebarHidden(false);
}


window.setInterval(() => {
	let pl = getHaPanelLovelace();
	let changed = false;
	if (!pl && activePanelUrl) {
		if (config.debug) console.debug("No dashboard active");
		activePanelUrl = null;
		activePanelTab = null;
		changed = true;
	}
	else if (pl && pl.panel && pl.panel.url_path) {
		let tab = window.location.pathname.split("/").slice(-1)[0];
		if (activePanelUrl != pl.panel.url_path) {
			if (config.debug) console.debug(`Active panel switched from '${activePanelUrl}' to '${pl.panel.url_path}'`);
			activePanelUrl = pl.panel.url_path;
			activePanelTab = tab;
			changed = true;
		}
		else if (activePanelTab != tab) {
			if (config.debug) console.debug(`Active tab switched from '${activePanelTab}' to '${tab}'`);
			activePanelTab = tab;
			changed = true;
		}
	}
	if (changed) {
		if (isActive()) {
			activateWallpanel();
		}
		else {
			deactivateWallpanel();
		}
	}
}, 1000);



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
			if (debug) console.log("Got file of length " + e.target.result.byteLength);
			handleBinaryFile(e.target.result);
		};

		fileReader.readAsArrayBuffer(img);
	}
}

function findEXIFinJPEG(file) {
	var dataView = new DataView(file);

	if (debug) console.log("Got file of length " + file.byteLength);
	if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
		if (debug) console.log("Not a valid JPEG");
		return false; // not a valid jpeg
	}

	var offset = 2,
		length = file.byteLength,
		marker;

	while (offset < length) {
		if (dataView.getUint8(offset) != 0xFF) {
			if (debug) console.log("Not a valid marker at offset " + offset + ", found: " + dataView.getUint8(offset));
			return false; // not a valid marker, something is wrong
		}

		marker = dataView.getUint8(offset + 1);
		if (debug) console.log(marker);

		// we could implement handling for other markers here,
		// but we're only looking for 0xFFE1 for EXIF data

		if (marker == 225) {
			if (debug) console.log("Found 0xFFE1 marker");

			return readEXIFData(dataView, offset + 4, dataView.getUint16(offset + 2) - 2);

			// offset += 2 + file.getShortAt(offset+2, true);

		} else {
			offset += 2 + dataView.getUint16(offset+2);
		}

	}

}

function findIPTCinJPEG(file) {
	var dataView = new DataView(file);

	if (debug) console.log("Got file of length " + file.byteLength);
	if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
		if (debug) console.log("Not a valid JPEG");
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
	0x7A : 'captionWriter',
	0x69 : 'headline',
	0x74 : 'copyright',
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
		if (!tag && debug) console.log("Unknown tag: " + file.getUint16(entryOffset, !bigEnd));
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
		// console.log('******** IFD1Offset is empty, image thumb not found ********');
		return {};
	}
	else if (IFD1OffsetPointer > dataView.byteLength) { // this should not happen
		// console.log('******** IFD1Offset is outside the bounds of the DataView ********');
		return {};
	}
	// console.log('*******  thumbnail IFD offset (IFD1) is: %s', IFD1OffsetPointer);

	var thumbTags = readTags(dataView, tiffStart, tiffStart + IFD1OffsetPointer, IFD1Tags, bigEnd)

	// EXIF 2.3 specification for JPEG format thumbnail

	// If the value of Compression(0x0103) Tag in IFD1 is '6', thumbnail image format is JPEG.
	// Most of Exif image uses JPEG format for thumbnail. In that case, you can get offset of thumbnail
	// by JpegIFOffset(0x0201) Tag in IFD1, size of thumbnail by JpegIFByteCount(0x0202) Tag.
	// Data format is ordinary JPEG format, starts from 0xFFD8 and ends by 0xFFD9. It seems that
	// JPEG format and 160x120pixels of size are recommended thumbnail format for Exif2.1 or later.

	if (thumbTags['Compression']) {
		// console.log('Thumbnail image found!');

		switch (thumbTags['Compression']) {
			case 6:
				// console.log('Thumbnail image format is JPEG');
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
			console.log("Thumbnail image format is TIFF, which is not implemented.");
			break;
		default:
			console.log("Unknown thumbnail image format '%s'", thumbTags['Compression']);
		}
	}
	else if (thumbTags['PhotometricInterpretation'] == 2) {
		console.log("Thumbnail image format is RGB, which is not implemented.");
	}
	return thumbTags;
}

function getStringFromDB(buffer, start, length) {
	var outstr = "";
	for (var n = start; n < start+length; n++) {
		outstr += String.fromCharCode(buffer.getUint8(n));
	}
	return outstr;
}

function readEXIFData(file, start) {
	if (getStringFromDB(file, start, 4) != "Exif") {
		if (debug) console.log("Not valid EXIF data! " + getStringFromDB(file, start, 4));
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
		if (debug) console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
		return false;
	}

	if (file.getUint16(tiffOffset+2, !bigEnd) != 0x002A) {
		if (debug) console.log("Not valid TIFF data! (no 0x002A)");
		return false;
	}

	var firstIFDOffset = file.getUint32(tiffOffset+4, !bigEnd);

	if (firstIFDOffset < 0x00000008) {
		if (debug) console.log("Not valid TIFF data! (First offset less than 8)", file.getUint32(tiffOffset+4, !bigEnd));
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
		// console.warn('XML parsing not supported without DOMParser');
		return;
	}
	var dataView = new DataView(file);

	if (debug) console.log("Got file of length " + file.byteLength);
	if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
		if (debug) console.log("Not a valid JPEG");
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
			console.log(e.message);
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
