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

const version = "2.1";
const defaultConfig = {
	enabled: false,
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
	image_url: "http://picsum.photos/${width}/${height}?random=${timestamp}",
	image_fit: 'cover', // cover / contain / fill
	image_list_update_interval: 3600,
	image_order: 'sorted', // sorted / random
	info_animation_duration_x: 0,
	info_animation_duration_y: 0,
	info_animation_timing_function_x: 'ease',
	info_animation_timing_function_y: 'ease',
	style: {},
	badges: [],
	cards: [
		{type: 'weather-forecast', entity: 'weather.home', show_forecast: true}
	]
};

let config = {};
let activePanelUrl = null;
let fullscreen = false;
let screenWakeLock = new ScreenWakeLock();


const elHass = document.querySelector("body > home-assistant");
const elHaMain = elHass.shadowRoot.querySelector("home-assistant-main");
const LitElement = Object.getPrototypeOf(customElements.get("hui-masonry-view"));
const HuiView = customElements.get("hui-view");


function updateConfig() {
	config = {};
	Object.assign(config, defaultConfig);
	Object.assign(config, getHaPanelLovelaceConfig());
	const params = new URLSearchParams(window.location.search);
	for (let [key, value] of params) {
		if (key.startsWith("wp_")) {
			key = key.substring(3);
			if (key in defaultConfig && value) {
				// Convert to the right type
				config[key] = defaultConfig[key].constructor(JSON.parse(value));
			}
		}
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
}

updateConfig();

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
		elHaMain.shadowRoot.querySelector("ha-sidebar")
		.style.visibility = (hidden ? "hidden" : "visible");
		if (hidden) {
			elHaMain.style.setProperty("--app-drawer-width", 0);
		}
		else {
			elHaMain.style.removeProperty("--app-drawer-width");
		}
		window.dispatchEvent(new Event('resize'));
	}
	catch (e) {
		console.error(e);
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
		console.error(e);
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
	return new Promise(
		function(resolve, reject) {
			hass.callWS({
				type: "media_source/browse_media",
				media_content_id: mediaContentId
			}).then(
				mediaEntry => {
					//console.debug(mediaEntry);
					var promises = mediaEntry.children.map(child => {
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
							result = result.concat(res);
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

		if (this.screensaverStartedAt) {
			this.__cards.forEach(card => {
				card.hass = this.hass;
			});
			this.__badges.forEach(badge => {
				badge.hass = this.hass;
			});
		}

		if (config.screensaver_entity && this.__hass.states[config.screensaver_entity]) {
			let lastChanged = new Date(this.__hass.states[config.screensaver_entity].last_changed);
			let state = this.__hass.states[config.screensaver_entity].state;
			
			if (state == "off" && this.screensaverStartedAt && lastChanged.getTime() - this.screensaverStartedAt > 0) {
				this.stopScreensaver();
			}
			else if (state == "on" && this.screensaverStoppedAt && lastChanged.getTime() - this.screensaverStoppedAt > 0) {
				this.startScreensaver();
			}
		}
	}

	get hass() {
		return this.__hass;
	}

	setScreensaverEntityState() {
		if (!config.screensaver_entity || !this.__hass.states[config.screensaver_entity]) return;
		if (this.screensaverStartedAt && this.__hass.states[config.screensaver_entity].state == 'on') return;
		if (!this.screensaverStartedAt && this.__hass.states[config.screensaver_entity].state == 'off') return;

		this.__hass.callService('input_boolean', this.screensaverStartedAt ? "turn_on" : "turn_off", {
			entity_id: config.screensaver_entity
		}).then(
			result => {
				if (config.debug) console.debug(result);
			},
			error => {
				console.error(error);
			}
		);
	}

	timer() {
		if (this.screensaverStartedAt) {
			this.updateScreensaver();
		}
		else {
			if (config.idle_time > 0 && Date.now() - this.idleSince >= config.idle_time*1000) {
				this.startScreensaver();
			}
		}
	}

	updateStyle() {
		this.debugBox.style.visibility = config.debug ? 'visible' : 'hidden';
		//this.screensaverContainer.style.transition = `opacity ${Math.round(config.fade_in_time*1000)}ms ease-in-out`;
		this.style.transition = `opacity ${Math.round(config.fade_in_time*1000)}ms ease-in-out`;
		this.imageOne.style.transition = `opacity ${Math.round(config.crossfade_time*1000)}ms ease-in-out`;
		this.imageTwo.style.transition = `opacity ${Math.round(config.crossfade_time*1000)}ms ease-in-out`;
		this.imageOne.style.objectFit = config.image_fit;
		this.imageTwo.style.objectFit = config.image_fit;
		if (config.info_animation_duration_x) {
			this.infoBoxPosX.style.animation = `moveX ${config.info_animation_duration_x}s ${config.info_animation_timing_function_x} infinite alternate`;
		}
		if (config.info_animation_duration_y) {
			this.infoBoxPosY.style.animation = `moveY ${config.info_animation_duration_y}s ${config.info_animation_timing_function_y} infinite alternate`;
		}
		
		if (config.style) {
			for (const elId in config.style) {
				if (elId.startsWith('wallpanel-') && elId != 'wallpanel-shadow-host') {
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
		if (config.style && config.style['wallpanel-shadow-host']) {
			for (const attr in config.style['wallpanel-shadow-host']) {
				host += `${attr}: ${config.style['wallpanel-shadow-host'][attr]};\n`;
			}
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
		`
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
		
		this.debugBox = document.createElement('div');
		this.debugBox.id = 'wallpanel-debug-box';
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
		
		this.screensaverContainer = document.createElement('div');
		this.screensaverContainer.id = 'wallpanel-screensaver-container';
		this.screensaverContainer.style.position = 'fixed';
		this.screensaverContainer.style.top = 0;
		this.screensaverContainer.style.left = 0;
		this.screensaverContainer.style.width = '100vw';
		this.screensaverContainer.style.height = '100vh';
		this.screensaverContainer.style.background = '#000000';
		
		this.imageOne = document.createElement('img');
		this.imageOne.id = 'wallpanel-screensaver-image-one';
		this.imageOne.style.position = 'absolute';
		this.imageOne.style.top = 0;
		this.imageOne.style.left = 0;
		this.imageOne.style.width = '100%';
		this.imageOne.style.height = '100%';
		this.imageOne.style.objectFit = 'contain';
		this.imageOne.style.opacity = 1;
		this.imageOne.setAttribute('data-loading', false);

		this.screensaverContainer.appendChild(this.imageOne);

		this.imageTwo = this.imageOne.cloneNode(true);
		this.imageTwo.id = 'wallpanel-screensaver-image-two';
		this.imageTwo.setAttribute('data-loading', false);

		this.screensaverContainer.appendChild(this.imageTwo);

		this.infoContainer = document.createElement('div');
		this.infoContainer.id = 'wallpanel-screensaver-info-container';
		this.infoContainer.style.position = 'absolute';
		this.infoContainer.style.top = 0;
		this.infoContainer.style.left = 0;
		this.infoContainer.style.width = '100%';
		this.infoContainer.style.height = '100%';
		this.infoContainer.style.transition = 'opacity 2000ms ease-in-out';
		this.infoContainer.style.padding = '25px';

		this.screensaverContainer.appendChild(this.infoContainer);

		this.infoBoxPosX = document.createElement('div');
		this.infoBoxPosX.id = 'wallpanel-screensaver-info-box-pos-x';

		this.infoBoxPosY = document.createElement('div');
		this.infoBoxPosY.id = 'wallpanel-screensaver-info-box-pos-y';

		this.infoBox = document.createElement('div');
		this.infoBox.id = 'wallpanel-screensaver-info-box';
		this.infoBox.style.width = 'fit-content';
		this.infoBox.style.height = 'fit-content';
		this.infoBox.style.borderRadius = '10px';
		this.infoBox.style.setProperty('--wp-card-width', '500px');
		this.infoBox.style.setProperty('--wp-card-padding', '0px');
		this.infoBox.style.setProperty('--wp-card-margin', '5px');
		this.infoBox.style.setProperty('--wp-card-backdrop-filter', 'none');
		
		this.infoBoxContent = document.createElement('div');
		this.infoBoxContent.id = 'wallpanel-screensaver-info-box-content';
		this.infoBoxContent.style.display = 'grid';

		this.infoBox.appendChild(this.infoBoxContent);
		this.infoBoxPosX.appendChild(this.infoBox);
		this.infoBoxPosY.appendChild(this.infoBoxPosX);
		this.infoContainer.appendChild(this.infoBoxPosY);

		this.screensaverOverlay = document.createElement('div');
		this.screensaverOverlay.id = 'wallpanel-screensaver-overlay';
		this.screensaverOverlay.style.position = 'absolute';
		this.screensaverOverlay.style.top = 0;
		this.screensaverOverlay.style.left = 0;
		this.screensaverOverlay.style.width = '100%';
		this.screensaverOverlay.style.height = '100%';
		this.screensaverOverlay.style.background = '#00000000';
		
		this.screensaverContainer.appendChild(this.screensaverOverlay);

		this.shadowStyle = document.createElement('style');
		let shadow = this.attachShadow({mode: 'open'});
		shadow.appendChild(this.shadowStyle);
		shadow.appendChild(this.screensaverContainer);
		shadow.appendChild(this.messageBox);
		shadow.appendChild(this.debugBox);
		
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
	}


	updateImageList(callback) {
		this.lastImageListUpdate = Date.now();
		if (!config.image_url.startsWith("media-source://media_source")) return;
		if (this.updatingImageList) return;
		this.updatingImageList = true;
		let mediaContentId = config.image_url;
		let wp = this;
		findImages(this.hass, mediaContentId).then(
			result => {
				this.imageList = result.sort();
				if (config.debug) {
					console.debug("Image list is now:");
					console.debug(this.imageList);
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
		imagePath = imagePath.replace(/^media-source:\/\/media_source/, '/media');
		this.hass.callWS({
			type: "auth/sign_path",
			path: imagePath,
			expires: 5
		}).then(
			result => {
				img.src = `${document.location.origin}${result.path}`;
			}
		);
	}
	
	
	updateImage(img) {
		img.setAttribute('data-loading', true);
		img.addEventListener('load', function() {
			img.setAttribute('data-loading', false);
		})
		img.addEventListener('error', function() {
			img.setAttribute('data-loading', false);
			console.error(`Failed to load image: ${img.src}`);
			if (config.image_url.startsWith("media-source://media_source") && (!this.updatingImageList)) {
				this.updateImageList(this.switchActiveImage.bind(this));
			}
		})
		if (config.image_url.startsWith("media-source://media_source")) {
			return this.updateImageFromMediaSource(img);
		}
		else {
			return this.updateImageFromUrl(img);
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
		
		this.imageOne.style.transition = `opacity ${crossfadeMillis}ms ease-in-out`;
		this.imageTwo.style.transition = `opacity ${crossfadeMillis}ms ease-in-out`;

		let curActive = this.imageOne;
		let newActive = this.imageTwo;
		if (this.imageTwo.style.opacity == 1) {
			curActive = this.imageTwo;
			newActive = this.imageOne;
		}
		if (config.debug) console.debug(`Switching active image to '${newActive.id}'`);
		
		if (newActive.style.opacity != 1) {
			newActive.style.opacity = 1;
		}
		if (curActive.style.opacity != 0) {
			curActive.style.opacity = 0;
		}

		// Load next image after fade out
		let wp = this;
		setTimeout(function() {
			wp.updateImage(curActive);
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
		updateConfig();
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
	}
	
	
	stopScreensaver() {
		if (config.debug) console.debug("Stop screensaver");
		
		this.screensaverStartedAt = null;
		this.screensaverStoppedAt = Date.now();
		document.body.style.overflow = this.bodyOverflowOrig;
		
		if (config.screensaver_stop_navigation_path) {
			navigate(config.screensaver_stop_navigation_path);
		}
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

		if (config.black_screen_after_time > 0 && now - this.screensaverStartedAt >= config.black_screen_after_time*1000) {
			if (config.debug) console.debug("Setting screen to black");
			if (this.imageOne.style.visibility != 'hidden') {
				this.imageOne.style.visibility = 'hidden';
			}
			if (this.imageTwo.style.visibility != 'hidden') {
				this.imageTwo.style.visibility = 'hidden';
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
customElements.define("wallpanel-view", WallpanelView);

const wallpanel = document.createElement("wallpanel-view");
document.body.appendChild(wallpanel);


window.setInterval(() => {
	let pl = getHaPanelLovelace();
	if (pl && pl.panel && pl.panel.url_path && activePanelUrl != pl.panel.url_path) {
		if (config.debug) console.debug(`Active panel switched from '${activePanelUrl}' to '${pl.panel.url_path}'`);
		activePanelUrl = pl.panel.url_path;
		updateConfig();
		setToolbarHidden(config.hide_toolbar);
		setSidebarHidden(config.hide_sidebar);
		console.info(`Wallpanel config: ${JSON.stringify(config)}`);
	}
}, 1000);
