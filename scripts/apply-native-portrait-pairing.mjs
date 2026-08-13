import fs from "node:fs";

const path = "wallpanel-src.js";
let source = fs.readFileSync(path, "utf8");

if (source.includes("portrait_pairing: false")) {
  console.log("Native portrait pairing already applied.");
  process.exit(0);
}

function replaceOnce(search, replacement, label) {
  const first = source.indexOf(search);
  if (first < 0) throw new Error(`Anchor not found: ${label}`);
  if (source.indexOf(search, first + search.length) >= 0) {
    throw new Error(`Anchor is not unique: ${label}`);
  }
  source = source.slice(0, first) + replacement + source.slice(first + search.length);
}

replaceOnce(
  '\timage_fit_portrait: "contain", // cover / contain\n',
  '\timage_fit_portrait: "contain", // cover / contain\n' +
    '\tportrait_pairing: false,\n' +
    '\tportrait_pairing_fit: "contain", // cover / contain\n',
  "default portrait image fit"
);

replaceOnce(
  '\t\tasync updateMedia(element) {\n',
  '\t\tasync _updateMediaSingle(element) {\n',
  "updateMedia method"
);

const methods = `
		portraitPairingOrientation(img) {
			if (!img || img.tagName.toLowerCase() !== "img" || !img.naturalWidth || !img.naturalHeight) return null;
			return img.naturalWidth < img.naturalHeight ? "portrait" : "landscape";
		}

		portraitPairingContainer(img) {
			if (img === this.imageOne) return this.imageOneContainer;
			if (img === this.imageTwo) return this.imageTwoContainer;
			return null;
		}

		getPortraitPairElement(img, create = true) {
			const container = this.portraitPairingContainer(img);
			if (!container) return null;
			let pair = container.querySelector(".wallpanel-portrait-pair");
			if (!pair && create) {
				pair = document.createElement("img");
				pair.className = "wallpanel-portrait-pair";
				pair.alt = "";
				pair.draggable = false;
				Object.assign(pair.style, { position: "absolute", display: "none", visibility: "hidden", pointerEvents: "none", border: "none" });
				const infoContainer = img === this.imageOne ? this.imageOneInfoContainer : this.imageTwoInfoContainer;
				container.insertBefore(pair, infoContainer);
			}
			return pair;
		}

		clearPortraitPairLayout(img) {
			if (!img) return;
			for (const property of ["position", "top", "left", "width", "height", "object-fit", "object-position", "visibility", "pointer-events"]) img.style.removeProperty(property);
		}

		clearPortraitPair(img) {
			if (!img) return;
			img.dataset.portraitPaired = "";
			img.dataset.portraitPartner = "";
			this.clearPortraitPairLayout(img);
			const pair = this.getPortraitPairElement(img, false);
			if (pair) {
				pair.onload = null;
				pair.onerror = null;
				pair.style.display = "none";
				pair.style.visibility = "hidden";
				pair.removeAttribute("src");
				pair.mediaUrl = null;
				pair.infoCacheUrl = null;
			}
		}

		async resolvePortraitPairSource(source) {
			const result = await this.hass.callWS({ type: "media_source/resolve_media", media_content_id: source });
			if (result.mime_type && !String(result.mime_type).startsWith("image/")) return null;
			if (!result.url) return null;
			return /^https?:\\/\\//i.test(result.url) ? result.url : document.location.origin + result.url;
		}

		loadPortraitPairImage(url, target = new Image()) {
			return new Promise((resolve, reject) => {
				let done = false;
				const finish = (callback, value) => {
					if (done) return;
					done = true;
					clearTimeout(timer);
					target.onload = null;
					target.onerror = null;
					callback(value);
				};
				const timer = setTimeout(() => finish(reject, new Error("Portrait pair load timeout")), 3000);
				target.onload = () => finish(resolve, target);
				target.onerror = () => finish(reject, new Error("Portrait pair load error"));
				target.src = url;
			});
		}

		async detectPortraitPairOrientation(source) {
			this.portraitPairOrientationCache ||= new Map();
			if (this.portraitPairOrientationCache.has(source)) return this.portraitPairOrientationCache.get(source);
			try {
				const url = await this.resolvePortraitPairSource(source);
				if (!url) {
					this.portraitPairOrientationCache.set(source, "other");
					return "other";
				}
				const img = await this.loadPortraitPairImage(url);
				const orientation = this.portraitPairingOrientation(img) || "error";
				this.portraitPairOrientationCache.set(source, orientation);
				return orientation;
			} catch (error) {
				logger.debug("Failed to detect portrait pair orientation", source, error);
				this.portraitPairOrientationCache.set(source, "error");
				return "error";
			}
		}

		portraitPairingCyclicSources(primary) {
			const list = this.mediaList || [];
			const result = [];
			if (!list.length || this.mediaIndex < 0) return result;
			for (let offset = 1; offset < list.length; offset++) {
				const index = this.mediaListDirection === "backwards" ? (this.mediaIndex - offset + list.length) % list.length : (this.mediaIndex + offset) % list.length;
				const candidate = list[index];
				if (candidate && candidate !== primary && candidate.startsWith("media-source://") && !result.includes(candidate)) result.push(candidate);
			}
			return result;
		}

		portraitPairingImmediateNextSource(primary) {
			const list = this.mediaList || [];
			if (list.length < 2 || this.mediaIndex < 0) return null;
			const index = this.mediaListDirection === "backwards" ? (this.mediaIndex - 1 + list.length) % list.length : (this.mediaIndex + 1) % list.length;
			const source = list[index];
			if (!source || source === primary || !source.startsWith("media-source://")) return null;
			return source;
		}

		shufflePortraitPairCandidates(items) {
			const result = [...items];
			for (let i = result.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[result[i], result[j]] = [result[j], result[i]];
			}
			return result;
		}

		async loadPortraitPairPartner(img, source, token) {
			if (token !== this.portraitPairToken) return false;
			const pair = this.getPortraitPairElement(img);
			try {
				const url = await this.resolvePortraitPairSource(source);
				if (!url) return false;
				await this.loadPortraitPairImage(url, pair);
				if (token !== this.portraitPairToken || this.portraitPairingOrientation(pair) !== "portrait") return false;
				this.portraitPairOrientationCache ||= new Map();
				this.portraitPairOrientationCache.set(source, "portrait");
				pair.mediaUrl = url;
				pair.infoCacheUrl = source;
				pair.style.display = "block";
				pair.style.visibility = "visible";
				img.dataset.portraitPartner = source;
				return true;
			} catch (error) {
				logger.debug("Failed to load portrait pair partner", source, error);
				return false;
			}
		}

		async chooseRandomPortraitPair(img, token) {
			const primary = img.infoCacheUrl || "";
			const candidates = this.portraitPairingCyclicSources(primary);
			let upcomingPortrait = null;
			for (const source of candidates) {
				if (token !== this.portraitPairToken) return false;
				if ((await this.detectPortraitPairOrientation(source)) === "portrait") {
					upcomingPortrait = source;
					break;
				}
			}
			let preferred = candidates.filter((source) => source !== upcomingPortrait && source !== this.lastPortraitPairPrimary && source !== this.lastPortraitPairPartner);
			if (!preferred.length) preferred = candidates.filter((source) => source !== upcomingPortrait);
			const fallback = candidates.filter((source) => !preferred.includes(source));
			for (const source of [...this.shufflePortraitPairCandidates(preferred), ...this.shufflePortraitPairCandidates(fallback)]) {
				if (token !== this.portraitPairToken) return false;
				if ((await this.detectPortraitPairOrientation(source)) !== "portrait") continue;
				if (await this.loadPortraitPairPartner(img, source, token)) {
					this.lastPortraitPairPrimary = primary;
					this.lastPortraitPairPartner = source;
					return true;
				}
			}
			return false;
		}

		async chooseSequentialPortraitPair(img, token) {
			const primary = img.infoCacheUrl || "";
			const source = this.portraitPairingImmediateNextSource(primary);
			if (!source || token !== this.portraitPairToken) return false;
			if ((await this.detectPortraitPairOrientation(source)) !== "portrait") return false;
			if (!(await this.loadPortraitPairPartner(img, source, token))) return false;
			this.portraitPairSequentialConsumed ||= new Set();
			this.portraitPairSequentialConsumed.add(source);
			this.lastPortraitPairPrimary = primary;
			this.lastPortraitPairPartner = source;
			return true;
		}

		async chooseSyncedPortraitPair(img, token) {
			const primary = img.infoCacheUrl || "";
			const list = this.mediaList || [];
			if (list.length < 2 || this.mediaIndex < 0) return false;
			const candidates = [];
			for (let offset = 2; offset < list.length; offset++) {
				const source = list[(this.mediaIndex + offset) % list.length];
				if (source && source !== primary && source.startsWith("media-source://")) candidates.push(source);
			}
			const immediate = list[(this.mediaIndex + 1) % list.length];
			if (immediate && immediate !== primary && immediate.startsWith("media-source://")) candidates.push(immediate);
			for (const source of candidates) {
				if (token !== this.portraitPairToken) return false;
				if ((await this.detectPortraitPairOrientation(source)) !== "portrait") continue;
				if (await this.loadPortraitPairPartner(img, source, token)) return true;
			}
			return false;
		}

		async preparePortraitPair(img, token) {
			if (!config.portrait_pairing || mediaSourceType() !== "media-source" || !img?.infoCacheUrl?.startsWith("media-source://") || this.portraitPairingOrientation(img) !== "portrait") return false;
			let paired = false;
			if (config.media_order === "random") paired = await this.chooseRandomPortraitPair(img, token);
			else if (config.media_order === "random_but_synced") paired = await this.chooseSyncedPortraitPair(img, token);
			else paired = await this.chooseSequentialPortraitPair(img, token);
			if (!paired) return false;
			img.dataset.portraitPaired = "1";
			this.layoutPortraitPair(img);
			return true;
		}

		layoutPortraitPair(img) {
			if (!img || img.dataset.portraitPaired !== "1") return false;
			const pair = this.getPortraitPairElement(img, false);
			if (!pair?.src) return false;
			const fit = config.portrait_pairing_fit === "cover" ? "cover" : "contain";
			Object.assign(img.style, { position: "absolute", top: "0", left: "0", width: "50%", height: "100%", objectFit: fit, objectPosition: "center center", visibility: "visible", pointerEvents: "none" });
			Object.assign(pair.style, { position: "absolute", top: "0", left: "50%", width: "50%", height: "100%", objectFit: fit, objectPosition: "center center", display: "block", visibility: "visible", pointerEvents: "none", border: "none" });
			return true;
		}

		isConsumedPortraitPair(img) {
			const source = img?.infoCacheUrl || "";
			if (!source || !this.portraitPairSequentialConsumed?.has(source)) return false;
			this.portraitPairSequentialConsumed.delete(source);
			return true;
		}

		async updateMedia(initialTarget) {
			let target = initialTarget;
			let loaded = null;
			const maxAttempts = Math.max((this.mediaList || []).length, 1) + 1;
			for (let attempt = 0; attempt < maxAttempts; attempt++) {
				this.clearPortraitPair(target);
				const token = (this.portraitPairToken = (this.portraitPairToken || 0) + 1);
				loaded = await this._updateMediaSingle(target);
				if (!loaded || !config.portrait_pairing) return loaded;
				if (config.media_order === "sorted" && this.isConsumedPortraitPair(loaded)) {
					target = loaded;
					continue;
				}
				if (this.portraitPairingOrientation(loaded) !== "portrait") return loaded;
				if (await this.preparePortraitPair(loaded, token)) return loaded;
				this.clearPortraitPair(loaded);
				return loaded;
			}
			return loaded;
		}

`;

replaceOnce('\n\t\tsetMediaDimensions() {\n', `\n${methods}\t\tsetMediaDimensions() {\n`, "setMediaDimensions method");

replaceOnce(
  '\t\t\tconst activeElem = this.getActiveMediaElement();\n\t\t\tconst mediaElem = this.getActiveMediaElement(true);\n',
  '\t\t\tconst activeElem = this.getActiveMediaElement();\n\t\t\tconst mediaElem = this.getActiveMediaElement(true);\n\t\t\tif (this.layoutPortraitPair(activeElem)) return;\n',
  "setMediaDimensions active media"
);

fs.writeFileSync(path, source);
console.log("Applied native portrait pairing to wallpanel-src.js");
