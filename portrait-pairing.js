(() => {
  const PREFIX = "media-source://";
  const orientationCache = new Map();
  const metadataCache = new Map();
  const sequentialConsumed = new Set();
  let lastPrimary = "";
  let lastPartner = "";

  function rawConfig() {
    const ha = document.querySelector("home-assistant");
    const main = ha?.shadowRoot?.querySelector("home-assistant-main");
    const panel = main?.shadowRoot?.querySelector("ha-panel-lovelace");
    const lovelace = panel?.lovelace || panel?.__lovelace;
    return lovelace?.config?.wallpanel || lovelace?.rawConfig?.wallpanel || {};
  }

  function enabled() {
    return rawConfig().portrait_pairing === true;
  }

  function pairingOrder() {
    return rawConfig().media_order === "random" ? "random" : "sequential";
  }

  function pairingFit() {
    return rawConfig().portrait_pairing_fit === "cover" ? "cover" : "contain";
  }

  function orientation(img) {
    if (img?.tagName?.toLowerCase() !== "img" || !img.naturalWidth || !img.naturalHeight) return null;
    return img.naturalWidth < img.naturalHeight ? "portrait" : "landscape";
  }

  function container(wp, img) {
    if (img === wp.imageOne) return wp.imageOneContainer;
    if (img === wp.imageTwo) return wp.imageTwoContainer;
    return null;
  }

  function standardInfoContainer(wp, img) {
    if (img === wp.imageOne) return wp.imageOneInfoContainer;
    if (img === wp.imageTwo) return wp.imageTwoInfoContainer;
    return null;
  }

  function standardInfoElement(wp, img) {
    if (img === wp.imageOne) return wp.imageOneInfo;
    if (img === wp.imageTwo) return wp.imageTwoInfo;
    return null;
  }

  function secondary(wp, img, create = true) {
    const c = container(wp, img);
    if (!c) return null;
    let pair = c.querySelector(".wallpanel-portrait-pair");
    if (!pair && create) {
      pair = document.createElement("img");
      pair.className = "wallpanel-portrait-pair";
      pair.alt = "";
      pair.draggable = false;
      Object.assign(pair.style, {
        position: "absolute",
        display: "none",
        visibility: "hidden",
        pointerEvents: "none",
        border: "none"
      });
      c.insertBefore(pair, standardInfoContainer(wp, img));
    }
    return pair;
  }

  function pairInfo(wp, img, create = true) {
    const c = container(wp, img);
    if (!c) return null;
    let box = c.querySelector(".wallpanel-portrait-pair-info");
    if (!box && create) {
      box = document.createElement("div");
      box.className = "wallpanel-portrait-pair-info";
      Object.assign(box.style, {
        position: "absolute",
        left: "0.5em",
        bottom: "0.5em",
        zIndex: "20",
        display: "none",
        flexWrap: "wrap",
        gap: "0.35em",
        maxWidth: "calc(100% - 1em)",
        pointerEvents: "none",
        color: "white",
        fontSize: "1.55em",
        lineHeight: "1.25"
      });
      c.appendChild(box);
    }
    return box;
  }

  function chip(html, arrow) {
    const chipElement = document.createElement("span");
    Object.assign(chipElement.style, {
      display: "inline-block",
      padding: "0.12em 0.5em",
      background: "#00000077",
      backdropFilter: "blur(2px)",
      borderRadius: "0.5rem",
      whiteSpace: "nowrap"
    });

    const arrowElement = document.createElement("strong");
    arrowElement.textContent = arrow;
    arrowElement.style.marginRight = "0.3em";
    chipElement.appendChild(arrowElement);

    const content = document.createElement("span");
    content.innerHTML = html || "—";
    chipElement.appendChild(content);
    return chipElement;
  }

  function restoreStandardInfo(wp, img) {
    const standard = standardInfoContainer(wp, img);
    const box = pairInfo(wp, img, false);
    if (standard) {
      standard.style.removeProperty("visibility");
      standard.style.zIndex = "20";
    }
    if (box) box.style.display = "none";
  }

  function clearPairLayout(img) {
    if (!img) return;
    for (const prop of [
      "position",
      "top",
      "left",
      "width",
      "height",
      "object-fit",
      "object-position",
      "visibility",
      "pointer-events"
    ]) {
      img.style.removeProperty(prop);
    }
  }

  function clear(wp, img) {
    if (!img) return;
    img.dataset.portraitPaired = "";
    img.dataset.portraitPartner = "";
    img.dataset.portraitPartnerResolved = "";
    clearPairLayout(img);
    restoreStandardInfo(wp, img);

    const pair = secondary(wp, img, false);
    if (pair) {
      pair.onload = null;
      pair.onerror = null;
      pair.style.display = "none";
      pair.style.visibility = "hidden";
      pair.removeAttribute("src");
      pair.mediaUrl = null;
      pair.infoCacheUrl = null;
      pair.dataset.exifRequested = "";
    }
  }

  async function resolve(wp, source) {
    const result = await wp.hass.callWS({
      type: "media_source/resolve_media",
      media_content_id: source
    });
    if (result.mime_type && !String(result.mime_type).startsWith("image/")) return null;
    if (!result.url) return null;
    return /^https?:\/\//i.test(result.url) ? result.url : document.location.origin + result.url;
  }

  function load(url, target = new Image()) {
    return new Promise((resolvePromise, rejectPromise) => {
      let done = false;
      const finish = (callback, value) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        target.onload = null;
        target.onerror = null;
        callback(value);
      };
      const timer = setTimeout(
        () => finish(rejectPromise, new Error("portrait pairing load timeout")),
        3000
      );
      target.onload = () => finish(resolvePromise, target);
      target.onerror = () => finish(rejectPromise, new Error("portrait pairing load error"));
      target.src = url;
    });
  }

  async function detect(wp, source) {
    if (orientationCache.has(source)) return orientationCache.get(source);
    try {
      const url = await resolve(wp, source);
      if (!url) {
        orientationCache.set(source, "other");
        return "other";
      }
      const img = await load(url);
      const result = orientation(img) || "error";
      orientationCache.set(source, result);
      return result;
    } catch (_) {
      orientationCache.set(source, "error");
      return "error";
    }
  }

  function cyclic(wp, primary) {
    const list = wp.mediaList || [];
    const out = [];
    if (!list.length) return out;
    const index = wp.mediaIndex;

    for (let offset = 1; offset < list.length; offset++) {
      const candidateIndex =
        wp.mediaListDirection === "backwards"
          ? (index - offset + list.length) % list.length
          : (index + offset) % list.length;
      const source = list[candidateIndex];
      if (
        source &&
        source !== primary &&
        source.startsWith(PREFIX) &&
        !out.includes(source)
      ) {
        out.push(source);
      }
    }
    return out;
  }

  function immediateNextSource(wp, primary) {
    const list = wp.mediaList || [];
    if (list.length < 2 || wp.mediaIndex < 0) return null;
    const index =
      wp.mediaListDirection === "backwards"
        ? (wp.mediaIndex - 1 + list.length) % list.length
        : (wp.mediaIndex + 1) % list.length;
    const source = list[index];
    if (!source || source === primary || !source.startsWith(PREFIX)) return null;
    return source;
  }

  function shuffle(items) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  async function nextPortrait(wp, primary, token) {
    for (const source of cyclic(wp, primary)) {
      if (token !== wp.__portraitPairToken) return null;
      if ((await detect(wp, source)) === "portrait") return source;
    }
    return null;
  }

  async function loadPartner(wp, img, source, token) {
    if (token !== wp.__portraitPairToken) return false;
    const pair = secondary(wp, img);
    try {
      const url = await resolve(wp, source);
      if (!url) return false;
      await load(url, pair);
      if (token !== wp.__portraitPairToken) return false;
      if (orientation(pair) !== "portrait") {
        orientationCache.set(source, orientation(pair) || "error");
        return false;
      }

      orientationCache.set(source, "portrait");
      pair.mediaUrl = url;
      pair.infoCacheUrl = source;
      pair.style.display = "block";
      pair.style.visibility = "visible";
      img.dataset.portraitPartner = source;
      img.dataset.portraitPartnerResolved = url;
      return true;
    } catch (_) {
      return false;
    }
  }

  async function chooseRandom(wp, img, token) {
    const primary = img.infoCacheUrl || "";
    const all = cyclic(wp, primary);
    const upcomingPortrait = await nextPortrait(wp, primary, token);
    if (token !== wp.__portraitPairToken) return false;

    let preferred = all.filter(
      (source) =>
        source !== upcomingPortrait &&
        source !== lastPrimary &&
        source !== lastPartner
    );
    if (!preferred.length) preferred = all.filter((source) => source !== upcomingPortrait);

    const fallback = all.filter((source) => !preferred.includes(source));
    for (const source of [...shuffle(preferred), ...shuffle(fallback)]) {
      if (token !== wp.__portraitPairToken) return false;
      if ((await detect(wp, source)) !== "portrait") continue;
      if (await loadPartner(wp, img, source, token)) {
        lastPrimary = primary;
        lastPartner = source;
        return true;
      }
    }
    return false;
  }

  async function chooseSequential(wp, img, token) {
    const primary = img.infoCacheUrl || "";
    const source = immediateNextSource(wp, primary);
    if (!source || token !== wp.__portraitPairToken) return false;

    // Sequential mode preserves the real WallPanel order exactly:
    // only the immediately following media item can become the partner.
    // If it is not portrait, the current portrait remains a normal solo slide.
    if ((await detect(wp, source)) !== "portrait") return false;
    if (!(await loadPartner(wp, img, source, token))) return false;

    // The partner has already been displayed in its correct position as the
    // right side of this pair, so consume its next standalone turn once.
    sequentialConsumed.add(source);
    lastPrimary = primary;
    lastPartner = source;
    return true;
  }

  async function choose(wp, img, token) {
    const primary = img.infoCacheUrl || "";
    if (!primary.startsWith(PREFIX) || orientation(img) !== "portrait") return false;

    const paired =
      pairingOrder() === "sequential"
        ? await chooseSequential(wp, img, token)
        : await chooseRandom(wp, img, token);

    if (!paired) return false;

    img.dataset.portraitPaired = "1";
    layout(wp, img);
    schedulePairInfo(wp, img);
    return true;
  }

  function layout(wp, img) {
    if (img?.dataset?.portraitPaired !== "1") return false;
    const pair = secondary(wp, img, false);
    if (!pair?.src) return false;

    const fit = pairingFit();
    Object.assign(img.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: "50%",
      height: "100%",
      objectFit: fit,
      objectPosition: "center center",
      visibility: "visible",
      pointerEvents: "none"
    });
    Object.assign(pair.style, {
      position: "absolute",
      top: "0",
      left: "50%",
      width: "50%",
      height: "100%",
      objectFit: fit,
      objectPosition: "center center",
      display: "block",
      visibility: "visible",
      pointerEvents: "none",
      border: "none"
    });
    return true;
  }

  function valueAtPath(obj, path) {
    let value = obj;
    for (const key of path.replace(/\s/g, "").split(".")) {
      if (value == null) return "";
      value = value[key];
    }
    return value;
  }

  function renderTemplate(mediaInfo) {
    const cfg = rawConfig();
    let html = cfg.image_info_template || "";
    if (!html || html === "analyze") return "";

    return html.replace(/\${([^}]+)}/g, (_match, alternatives) => {
      const altTags = alternatives.split("||");
      for (let t = 0; t < altTags.length; t++) {
        let tags = altTags[t];
        let prefix = "";
        let suffix = "";
        let options = null;

        if (tags.includes("!")) {
          const args = tags.split("!");
          tags = args[0];
          for (let i = 1; i < args.length; i++) {
            const eq = args[i].indexOf("=");
            if (eq < 0) continue;
            const type = args[i].substring(0, eq);
            const argValue = args[i].substring(eq + 1);
            if (type === "prefix") prefix = argValue;
            else if (type === "suffix") suffix = argValue;
            else if (type === "options") {
              options = {};
              argValue.split(",").forEach((part) => {
                const option = part.split(":", 2);
                if (option[0] && option[1]) {
                  options[option[0].replace(/\s/g, "")] = option[1].replace(/\s/g, "");
                }
              });
            }
          }
        }

        const tagList = tags.split("|");
        let value = "";
        let tag = "";
        for (let i = 0; i < tagList.length; i++) {
          tag = tagList[i];
          value = valueAtPath(mediaInfo, tag);
          if (value) break;
        }
        if (!value) continue;

        if (/DateTime/i.test(tag)) {
          const date = new Date(
            String(value).replace(
              /(\d\d\d\d):(\d\d):(\d\d) (\d\d):(\d\d):(\d\d)/,
              "$1-$2-$3T$4:$5:$6"
            )
          );
          if (isNaN(date)) continue;
          if (!options) options = { year: "numeric", month: "2-digit", day: "2-digit" };
          const language =
            document.querySelector("home-assistant")?.hass?.locale?.language || navigator.language;
          value = date.toLocaleDateString(language, options);
        }

        if (typeof value === "object") value = JSON.stringify(value);
        return prefix + value + suffix;
      }
      return "";
    });
  }

  function captureMetadata(mediaElement) {
    const source = mediaElement?.infoCacheUrl;
    if (!source) return;
    if (mediaElement.exifdata && Object.keys(mediaElement.exifdata).length) {
      metadataCache.set(source, mediaElement.exifdata);
    }
  }

  function updatePairInfo(wp, img) {
    if (img?.dataset?.portraitPaired !== "1") return;
    const cfg = rawConfig();
    if (!cfg.show_image_info || !cfg.image_info_template) return;

    const primarySource = img.infoCacheUrl || "";
    const partnerSource = img.dataset.portraitPartner || "";
    let left = renderTemplate(metadataCache.get(primarySource) || {});
    const right = renderTemplate(metadataCache.get(partnerSource) || {});

    // The native WallPanel label is the authoritative fallback for the primary
    // photo and also proves that the original info path remains functional.
    const nativePrimary = standardInfoElement(wp, img)?.innerHTML || "";
    if (!left && nativePrimary) left = nativePrimary;

    const box = pairInfo(wp, img);
    box.innerHTML = "";
    box.appendChild(chip(left, "←"));
    box.appendChild(chip(right, "→"));
    box.style.display = "flex";

    const standard = standardInfoContainer(wp, img);
    if (standard) standard.style.visibility = "hidden";
  }

  function requestPartnerExif(wp, img) {
    const pair = secondary(wp, img, false);
    if (!pair?.src || pair.dataset.exifRequested === "1") return;
    pair.dataset.exifRequested = "1";
    try {
      wp.fetchEXIFInfo(pair);
    } catch (_) {}
  }

  function schedulePairInfo(wp, img) {
    if (img?.dataset?.portraitPaired !== "1") return;
    requestPartnerExif(wp, img);
    requestAnimationFrame(() => updatePairInfo(wp, img));
    setTimeout(() => updatePairInfo(wp, img), 150);
    setTimeout(() => updatePairInfo(wp, img), 900);
  }

  function isConsumedSequential(img) {
    const source = img?.infoCacheUrl || "";
    if (!source || !sequentialConsumed.has(source)) return false;
    sequentialConsumed.delete(source);
    return true;
  }

  customElements.whenDefined("wallpanel-view").then(() => {
    const prototype = customElements.get("wallpanel-view").prototype;
    if (prototype.__portraitPairingFork) return;

    const updateMedia = prototype.updateMedia;
    const setMediaDimensions = prototype.setMediaDimensions;
    const setMediaDataInfo = prototype.setMediaDataInfo;

    prototype.updateMedia = async function (initialTarget) {
      let target = initialTarget;
      let loaded = null;
      const maxAttempts = Math.max((this.mediaList || []).length, 1) + 1;

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        clear(this, target);
        const token = (this.__portraitPairToken = (this.__portraitPairToken || 0) + 1);
        loaded = await updateMedia.call(this, target);
        if (!loaded || !enabled()) return loaded;

        // In sequential mode a portrait used as the right-hand partner has
        // already been shown, so skip exactly its next standalone turn.
        if (pairingOrder() === "sequential" && isConsumedSequential(loaded)) {
          target = loaded;
          continue;
        }

        if (orientation(loaded) !== "portrait") {
          restoreStandardInfo(this, loaded);
          return loaded;
        }

        if (await choose(this, loaded, token)) return loaded;

        // No valid partner: keep the portrait as a normal single WallPanel
        // slide. This is essential for sequential mode to preserve 100% order.
        clear(this, loaded);
        restoreStandardInfo(this, loaded);
        return loaded;
      }

      return loaded;
    };

    prototype.setMediaDimensions = function (...args) {
      const result = setMediaDimensions.apply(this, args);
      const active = this.getActiveMediaElement?.();
      layout(this, active);
      return result;
    };

    prototype.setMediaDataInfo = function (...args) {
      const mediaElement = args[0] || null;
      captureMetadata(mediaElement);
      const result = setMediaDataInfo.apply(this, args);
      const source = mediaElement?.infoCacheUrl || "";

      for (const candidate of [this.imageOne, this.imageTwo]) {
        if (
          candidate?.dataset?.portraitPaired === "1" &&
          (candidate.infoCacheUrl === source || candidate.dataset.portraitPartner === source)
        ) {
          updatePairInfo(this, candidate);
        }
      }

      const active = this.getActiveMediaElement?.();
      if (active?.dataset?.portraitPaired !== "1" && active) restoreStandardInfo(this, active);
      return result;
    };

    Object.defineProperty(prototype, "__portraitPairingFork", { value: true });
  });
})();
