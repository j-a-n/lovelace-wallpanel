/**
 * (C) 2020 by Jan Schneider (oss@janschneider.net)
 * Released under the GNU General Public License v3.0
 */

class ScreenWakeLock {
	constructor() {
		this.enabled = false;
		this.error = null;
		this.debug = false;
		this._useNativeWakeLock = "wakeLock" in navigator;
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

		if (!this._useNativeWakeLock) {
			let videoData = 'data:video/mp4;base64,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';
			this._player = document.createElement("video");
			this._player.setAttribute("id", "ScreenWakeLockVideo");
			this._player.setAttribute("src", videoData);
			this._player.setAttribute("playsinline", "");
			this._player.setAttribute("muted", "");
			this._player.addEventListener('ended', (event) => {
				if (this.debug) console.debug("Video ended");
				this.enable();
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
		if (this._useNativeWakeLock) {
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
		if (this._useNativeWakeLock) {
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

const version = "0.9";
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
	image_url: "http://unsplash.it/${width}/${height}?random=${timestamp}",
	image_fit: 'cover', // cover / contain / fill
	info_update_interval: 30,
	style: {}
};
let config = {};
let activePanel = null;
let messageBoxTimeout = null;
let fullscreen = false;
let idleSince = Date.now();
let screensaverRunningSince;
let lastImageUpdate;
let lastInfoUpdate;
let bodyOverflowOrig;
let screenWakeLock = new ScreenWakeLock();

const elHass = document.querySelector("body > home-assistant");
const elHaMain = elHass.shadowRoot.querySelector("home-assistant-main");

const messageBox = document.createElement('div');
messageBox.id = 'wallpanel-message-box';
messageBox.style.position = 'fixed';
messageBox.style.pointerEvents = "none";
messageBox.style.top = 0;
messageBox.style.left = 0;
messageBox.style.width = '100%';
messageBox.style.height = '10%';
messageBox.style.zIndex = 1000;
messageBox.style.visibility = 'hidden';
//messageBox.style.margin = '5vh auto auto auto';
messageBox.style.padding = '5vh 0 0 0';
messageBox.style.fontSize = '5vh';
messageBox.style.textAlign = 'center';
messageBox.style.color = '#eeeeee';
messageBox.style.textShadow = '-1px -1px 0 #111111, 1px -1px 0 #111111, -1px 1px 0 #111111, 1px 1px 0 #111111';
messageBox.style.transition = 'visibility 200ms ease-in-out';
document.body.appendChild(messageBox);

const debugBox = document.createElement('div');
debugBox.id = 'wallpanel-debug-box';
debugBox.style.position = 'fixed';
debugBox.style.pointerEvents = "none";
debugBox.style.top = '60%';
debugBox.style.left = 0;
debugBox.style.width = '100%';
debugBox.style.height = '40%';
debugBox.style.background = '#00000099';
debugBox.style.zIndex = 1000;
debugBox.style.visibility = 'hidden';
debugBox.style.fontFamily = 'monospace';
debugBox.style.fontSize = '12px';
debugBox.style.wordWrap = 'break-word';
debugBox.style.overflowY = 'auto';
document.body.appendChild(debugBox);

const screensaverContainer = document.createElement('div');
screensaverContainer.id = 'wallpanel-screensaver-container';
screensaverContainer.style.position = 'fixed';
screensaverContainer.style.top = 0;
screensaverContainer.style.left = 0;
screensaverContainer.style.width = '100vw';
screensaverContainer.style.height = '100vh';
screensaverContainer.style.background = '#000000';
screensaverContainer.style.opacity = 0;
screensaverContainer.style.zIndex = 1000;
screensaverContainer.style.visibility = 'hidden';

const imageOne = document.createElement('img');
imageOne.id = 'wallpanel-screensaver-image-one';
imageOne.style.position = 'absolute';
imageOne.style.top = 0;
imageOne.style.left = 0;
imageOne.style.width = '100%';
imageOne.style.height = '100%';
imageOne.style.objectFit = 'contain';
imageOne.style.opacity = 1;
screensaverContainer.appendChild(imageOne);

const imageTwo = imageOne.cloneNode(true);
imageTwo.id = 'wallpanel-screensaver-image-two';
screensaverContainer.appendChild(imageTwo);

const infoContainer = document.createElement('div');
infoContainer.id = 'wallpanel-screensaver-info-container';
infoContainer.style.position = 'absolute';
infoContainer.style.top = 0;
infoContainer.style.left = 0;
infoContainer.style.width = '100%';
infoContainer.style.height = '100%';
infoContainer.style.transition = 'opacity 2000ms ease-in-out';
screensaverContainer.appendChild(infoContainer);

const infoBox = document.createElement('div');
infoBox.id = 'wallpanel-screensaver-info-box';
infoBox.style.margin = '5vh auto auto 15vh';
infoBox.style.padding = '0 0 0 0';
infoBox.style.width = '85%';
infoBox.style.fontSize = '4vh';
infoBox.style.color = '#eeeeee';
infoBox.style.textShadow = '-1px -1px 0 #111111, 1px -1px 0 #111111, -1px 1px 0 #111111, 1px 1px 0 #111111';
infoContainer.appendChild(infoBox);

const weatherStateInfo = document.createElement('div');
weatherStateInfo.id = 'wallpanel-screensaver-info-state';
infoBox.appendChild(weatherStateInfo);

const weatherTemperatureInfo = document.createElement('div');
weatherTemperatureInfo.id = 'wallpanel-screensaver-info-temperature';
weatherTemperatureInfo.style.fontSize = '1.2em';
infoBox.appendChild(weatherTemperatureInfo);

const timeInfo = document.createElement('div');
timeInfo.id = 'wallpanel-screensaver-info-time';
timeInfo.style.marginTop = '0.5em';
timeInfo.style.fontSize = '1.2em';
infoBox.appendChild(timeInfo);

const dateInfo = document.createElement('div');
timeInfo.id = 'wallpanel-screensaver-info-date';
infoBox.appendChild(dateInfo);


function setSidebarHidden(hidden) {
	try {
		elHaMain.shadowRoot.querySelector("app-drawer-layout > app-drawer > ha-sidebar")
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
		.querySelector("app-drawer-layout > partial-panel-resolver > ha-panel-lovelace").shadowRoot
		.querySelector("hui-root").shadowRoot
		.querySelector("ha-app-layout > app-header > app-toolbar");
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

function getHaPanelLovelace() {
	try {
		return elHaMain.shadowRoot
		.querySelector('app-drawer-layout partial-panel-resolver')
		.querySelector('ha-panel-lovelace')
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
	if (!config.enabled) {
		config.debug = false;
		config.hide_toolbar = false;
		config.hide_sidebar = false;
		config.fullscreen = false;
		config.idle_time = 0;
	}
}

function displayMessage(message, timeout=15000) {
	hideMessage();
	messageBox.innerHTML = message;
	messageBox.style.visibility = 'visible';
	messageBoxTimeout = setTimeout(function() {
		hideMessage();
	}, timeout);
}

function hideMessage() {
	if (!messageBoxTimeout) {
		return;
	}
	clearTimeout(messageBoxTimeout);
	messageBoxTimeout = null;
	messageBox.style.visibility = 'hidden';
	messageBox.innerHTML = '';
}

function updateImage(img) {
	let width = screensaverContainer.clientWidth;
	let height = screensaverContainer.clientHeight;
	let timestamp = Math.floor(Date.now() / 1000);
	let imageUrl = config.image_url;
	imageUrl = imageUrl.replace(/\${width}/g, width);
	imageUrl = imageUrl.replace(/\${height}/g, height);
	imageUrl = imageUrl.replace(/\${timestamp}/g, timestamp);
	if (config.debug) console.debug(`Updating image '${img.id}' from '${imageUrl}'`);
	img.src = imageUrl;
}

function switchActiveImage() {
	lastImageUpdate = Date.now();

	let curActive = imageOne;
	let newActive = imageTwo;
	if (imageTwo.style.opacity == 1) {
		curActive = imageTwo;
		newActive = imageOne;
	}
	if (config.debug) console.debug(`Switching active image to '${newActive.id}'`);
	
	if (newActive.style.opacity != 1) {
		newActive.style.opacity = 1;
	}
	if (curActive.style.opacity != 0) {
		curActive.style.opacity = 0;
	}

	// Load next image after fade out
	setTimeout(function() {
		updateImage(curActive);
	}, Math.round(config.crossfade_time*1000) + 500);
}

function updateInfo() {
	if (config.debug) console.debug("Updating info");
	lastInfoUpdate = Date.now();

	let weather = elHass.__hass.states["weather.home"];
	if (weather) {
		weatherStateInfo.innerHTML = weather.state;
		weatherTemperatureInfo.innerHTML = `${weather.attributes.temperature}° C`;
		
	}
	let now = new Date();
	let timeOptions = {hour: '2-digit', minute:'2-digit'}
	timeInfo.innerHTML = now.toLocaleTimeString(undefined, timeOptions);
	let dateOptions = {weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric'};		
	dateInfo.innerHTML = now.toLocaleDateString(undefined, dateOptions);
}

function startScreensaver() {
	if (config.debug) console.debug("Start screensaver");

	updateConfig();
	applyStyleConfig();

	setupScreensaver();
	if (config.keep_screen_on_time > 0) {
		setTimeout(function() { 
			if (screensaverRunningSince && !screenWakeLock.enabled) {
				console.error("Keep screen on will not work because the user didn't interact with the document first. https://goo.gl/xX8pDD");
				displayMessage("Please interact with the screen for a moment to request wake lock.", 15000)
			}
		}, 3000);
	}

	lastImageUpdate = Date.now();
	screensaverRunningSince = Date.now();
	if (document.body.style.overflow != 'hidden') {
		bodyOverflowOrig = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
	}

	infoContainer.style.visibility = 'visible';
	imageOne.style.visibility = 'visible';
	imageTwo.style.visibility = 'visible';
	screensaverContainer.style.visibility = 'visible';
	screensaverContainer.style.opacity = 1;
	
	updateInfo();
}

function stopScreensaver() {
	if (config.debug) console.debug("Stop screensaver");
	
	screensaverRunningSince = null;
	document.body.style.overflow = bodyOverflowOrig;
	
	screensaverContainer.style.visibility = 'hidden';
	infoContainer.style.visibility = 'hidden';
	imageOne.style.visibility = 'hidden';
	imageTwo.style.visibility = 'hidden';
	screensaverContainer.style.opacity = 0;

	idleSince = Date.now();
	if (screenWakeLock.enabled) {
		screenWakeLock.disable();
	}
}

function setupScreensaver() {
	if (config.debug) console.debug("Setup screensaver");
	if (config.fullscreen && !fullscreen) {
		enterFullscreen();
	}
	if (config.keep_screen_on_time > 0 && !screenWakeLock.enabled) {
		screenWakeLock.enable();
		/*
		setTimeout(function() { 
			if (screenWakeLock.enabled) {
				displayMessage("Screen will stay on.", 1000)
			}
		}, 3000);
		*/
	}
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
		el.requestFullscreen();
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

function handleInteractionEvent(e, isClick) {
	hideMessage();
	idleSince = Date.now();
	if (isClick) {
		setupScreensaver();
	}
	if (screensaverRunningSince) {
		let x = e.clientX;
		let right = 0.0
		if (!x && e.touches && e.touches[0]) {
			x = e.touches[0].clientX;
		}
		if (x) {
			right = (screensaverContainer.clientWidth - x) / screensaverContainer.clientWidth;
		}
		if (right <= 0.05) {
			if (isClick && new Date() - lastImageUpdate > config.crossfade_time*1000 + 1000) {
				switchActiveImage();
			}
		}
		else {
			stopScreensaver();
		}
		e.preventDefault();
	}
}

function applyStyleConfig() {
	screensaverContainer.style.transition = `opacity ${Math.round(config.fade_in_time*1000)}ms ease-in-out`;
	imageOne.style.transition = `opacity ${Math.round(config.crossfade_time*1000)}ms ease-in-out`;
	imageTwo.style.transition = `opacity ${Math.round(config.crossfade_time*1000)}ms ease-in-out`;
	imageOne.style.objectFit = config.image_fit;
	imageTwo.style.objectFit = config.image_fit;
	if (config.style) {
		for (const elId in config.style) {
			if (elId.startsWith('wallpanel-')) {
				let el = document.getElementById(elId);
				if (el) {
					for (const attr in config.style[elId]) {
						el.style.setProperty(attr, config.style[elId][attr]);
					}
				}
			}
		}
	}
}

document.body.appendChild(screensaverContainer);

window.setInterval(() => {

	if (screensaverRunningSince) {
		let now = Date.now();

		if (config.black_screen_after_time > 0 && now - screensaverRunningSince >= config.black_screen_after_time*1000) {
			if (config.debug) console.debug("Setting screen to black");
			if (imageOne.style.visibility != 'hidden') {
				imageOne.style.visibility = 'hidden';
			}
			if (imageTwo.style.visibility != 'hidden') {
				imageTwo.style.visibility = 'hidden';
			}
			if (infoContainer.style.visibility != 'hidden') {
				infoContainer.style.visibility = 'hidden';
			}
		}
		else {
			if (now - lastImageUpdate >= config.display_time*1000) {
				switchActiveImage();
			}
			if (now - lastInfoUpdate >= config.info_update_interval*1000) {
				updateInfo();
			}
		}
		if (screenWakeLock.enabled && now - screensaverRunningSince >= config.keep_screen_on_time*1000) {
			screenWakeLock.disable();
		}
	}
	else {
		let pl = getHaPanelLovelace();
		if (pl && pl.panel && pl.panel.url_path) {
			if (activePanel != pl.panel.url_path) {
				if (config.debug) console.debug(`Active panel switched from '${activePanel}' to '${pl.panel.url_path}'`);
				activePanel = pl.panel.url_path;
				updateConfig();
				debugBox.style.visibility = config.debug ? 'visible' : 'hidden';
				setToolbarHidden(config.hide_toolbar);
				setSidebarHidden(config.hide_sidebar);
				applyStyleConfig();
				console.info(`Wallpanel config: ${JSON.stringify(config)}`);
				if (config.idle_time > 0) {
					if (config.debug) console.debug("Preloading images");
					updateImage(imageOne);
					setTimeout(function() {
						updateImage(imageTwo);
					}, 3000);
				}
			}
			if (config.idle_time > 0 && Date.now() - idleSince >= config.idle_time*1000) {
				startScreensaver();
			}
		}
		else if (activePanel) {
			debugBox.style.visibility = 'hidden';
			setSidebarHidden(false);
			setToolbarHidden(false);
			activePanel = null;
		}
	}
	if (config.debug) {
		debugBox.innerHTML = '';
		debugBox.innerHTML += `Version: ${version}<br/>`
		debugBox.innerHTML += `Config: ${JSON.stringify(config)}<br/>`;
		debugBox.innerHTML += `Fullscreen: ${fullscreen}<br/>`;
		debugBox.innerHTML += `Screensaver running since: ${screensaverRunningSince}<br/>`;
		debugBox.innerHTML += `Screen wake lock: enabled=${screenWakeLock.enabled} lock=${screenWakeLock._lock} player=${screenWakeLock._player} error=${screenWakeLock.error}<br/>`;
		if (screenWakeLock._player) {
			let p = screenWakeLock._player;
			debugBox.innerHTML += `Screen wake lock video: readyState=${p.readyState} currentTime=${p.currentTime} paused=${p.paused} ended=${p.ended}<br/>`;
		}
		debugBox.scrollTop = debugBox.scrollHeight;
	}
}, 1000);

window.addEventListener('click', e => {
	handleInteractionEvent(e, true);
});

window.addEventListener('touchstart', e => {
	handleInteractionEvent(e, true);
});

window.addEventListener('mousemove', e => {
	handleInteractionEvent(e, false);
});

window.addEventListener('wheel', e => {
	handleInteractionEvent(e, false);
});

window.addEventListener('keydown', e => {
	handleInteractionEvent(e, false);
});
