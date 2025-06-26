"use strict";

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/**
 * (C) 2020-2025 by Jan Schneider (oss@janschneider.net)
 * Released under the GNU General Public License v3.0
 */

var version = "4.54.1";
var defaultConfig = {
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
  image_fit_landscape: "cover",
  // cover / contain
  image_fit_portrait: "contain",
  // cover / contain
  media_list_update_interval: 3600,
  media_list_max_size: 500,
  media_order: "random",
  // sorted / random
  exclude_filenames: [],
  // Excluded filenames (regex)
  exclude_media_types: [],
  // Exclude media types (image / video)
  exclude_media_orientation: "",
  // Exclude media items with this orientation (landscape / portrait / auto)
  image_background: "color",
  // color / image
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
  image_animation_ken_burns_animations: ["simple"],
  // simple / experimental
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
var dashboardConfig = {};
var config = {};
var currentLocation = null;
var activePanel = null;
var activeTab = null;
var fullscreen = false;
var wallpanel = null;
var skipDisableScreensaverOnLocationChanged = false;
var classStyles = {
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
var mediaInfoCache = new Map();
function addToMediaInfoCache(mediaUrl, value) {
  while (mediaInfoCache.size >= config.media_list_max_size) {
    // Remove the oldest key (first inserted)
    var oldestKey = mediaInfoCache.keys().next().value;
    mediaInfoCache.delete(oldestKey);
  }
  mediaInfoCache.set(mediaUrl, value);
}
var configEntityStates = {};
var mediaEntityState = null;
var elHass = null;
var elHaMain = null;
var browserId = null;
var userId = null;
var userName = null;
var userDisplayname = null;
function isObject(item) {
  return item && _typeof(item) === "object" && !Array.isArray(item);
}
function stringify(obj) {
  var processedObjects = [];
  var json = JSON.stringify(obj, function (key, value) {
    if (_typeof(value) === "object" && value !== null) {
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
var logger = {
  messages: [],
  logLevel: "warn",
  addMessage: function addMessage(level, args) {
    if (!config.debug) {
      return;
    }
    var msg = {
      level: level,
      date: new Date().toISOString(),
      text: "",
      objs: [],
      stack: ""
    };
    var err = new Error();
    if (err.stack) {
      msg.stack = err.stack.toString().replace(/^Error\r?\n/, "");
    }
    for (var i = 0; i < args.length; i++) {
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
  downloadMessages: function downloadMessages() {
    var data = new Blob([stringify(logger.messages)], {
      type: "text/plain"
    });
    var url = window.URL.createObjectURL(data);
    var el = document.createElement("a");
    el.href = url;
    el.target = "_blank";
    el.download = "wallpanel_log.txt";
    el.click();
  },
  purgeMessages: function purgeMessages() {
    logger.messages = [];
  },
  log: function log() {
    console.log.apply(this, arguments);
    logger.addMessage("info", arguments);
  },
  debug: function debug() {
    if (["debug"].includes(logger.logLevel)) {
      console.debug.apply(this, arguments);
    }
    logger.addMessage("debug", arguments);
  },
  info: function info() {
    if (["debug", "info"].includes(logger.logLevel)) {
      console.info.apply(this, arguments);
    }
    logger.addMessage("info", arguments);
  },
  warn: function warn() {
    if (["debug", "info", "warn"].includes(logger.logLevel)) {
      console.warn.apply(this, arguments);
    }
    logger.addMessage("warn", arguments);
  },
  error: function error() {
    if (["debug", "info", "warn", "error"].includes(logger.logLevel)) {
      console.error.apply(this, arguments);
    }
    logger.addMessage("error", arguments);
    if (config.alert_errors) {
      var msg = "Wallpanel error: ".concat(stringify(arguments));
      if (wallpanel) {
        wallpanel.showMessage("error", "Error", msg, 10000);
      } else {
        alert(msg);
      }
    }
  }
};
var ScreenWakeLock = /*#__PURE__*/function () {
  function ScreenWakeLock() {
    var _this = this;
    _classCallCheck(this, ScreenWakeLock);
    this.enabled = false;
    this.error = null;
    // The Screen Wake Lock API is only available when served over HTTPS
    this.nativeWakeLockSupported = "wakeLock" in navigator;
    this._lock = null;
    this._player = null;
    this._isPlaying = false;
    var handleVisibilityChange = function handleVisibilityChange() {
      logger.debug("handleVisibilityChange");
      if (_this.enabled && !document.hidden) {
        _this.enable();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleVisibilityChange);
    if (!this.nativeWakeLockSupported) {
      var videoData = "data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAA1NtZGF0AAACrwYF//+r3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE2NCByMzA5NSBiYWVlNDAwIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAyMiAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTMgZGVibG9jaz0xOi0zOi0zIGFuYWx5c2U9MHgzOjB4MTEzIG1lPWhleCBzdWJtZT03IHBzeT0xIHBzeV9yZD0yLjAwOjAuNzAgbWl4ZWRfcmVmPTEgbWVfcmFuZ2U9MTYgY2hyb21hX21lPTEgdHJlbGxpcz0xIDh4OGRjdD0xIGNxbT0wIGRlYWR6b25lPTIxLDExIGZhc3RfcHNraXA9MSBjaHJvbWFfcXBfb2Zmc2V0PS00IHRocmVhZHM9MSBsb29rYWhlYWRfdGhyZWFkcz0xIHNsaWNlZF90aHJlYWRzPTAgbnI9MCBkZWNpbWF0ZT0xIGludGVybGFjZWQ9MCBibHVyYXlfY29tcGF0PTAgY29uc3RyYWluZWRfaW50cmE9MCBiZnJhbWVzPTMgYl9weXJhbWlkPTIgYl9hZGFwdD0xIGJfYmlhcz0wIGRpcmVjdD0xIHdlaWdodGI9MSBvcGVuX2dvcD0wIHdlaWdodHA9MiBrZXlpbnQ9MjUwIGtleWludF9taW49MSBzY2VuZWN1dD00MCBpbnRyYV9yZWZyZXNoPTAgcmNfbG9va2FoZWFkPTQwIHJjPWNyZiBtYnRyZWU9MSBjcmY9MjMuMCBxY29tcD0wLjYwIHFwbWluPTAgcXBtYXg9NjkgcXBzdGVwPTQgaXBfcmF0aW89MS40MCBhcT0xOjEuMjAAgAAAABFliIQAF85//vfUt8yy7VNwgQAAAAlBmiRsQXzn/vAAAAAJQZ5CeIL5z4aBAAAACQGeYXRBfOeGgAAAAAkBnmNqQXznhoEAAAAPQZpoSahBaJlMCC+c//7xAAAAC0GehkURLBfOf4aBAAAACQGepXRBfOeGgQAAAAkBnqdqQXznhoAAAAAPQZqpSahBbJlMCC+c//7wAAADs21vb3YAAABsbXZoZAAAAAAAAAAAAAAAAAAAA+gAACcQAAEAAAEAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAALddHJhawAAAFx0a2hkAAAAAwAAAAAAAAAAAAAAAQAAAAAAACcQAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAIAAAACAAAAAAAJGVkdHMAAAAcZWxzdAAAAAAAAAABAAAnEAAAgAAAAQAAAAACVW1kaWEAAAAgbWRoZAAAAAAAAAAAAAAAAAAAQAAAAoAAVcQAAAAAAC1oZGxyAAAAAAAAAAB2aWRlAAAAAAAAAAAAAAAAVmlkZW9IYW5kbGVyAAAAAgBtaW5mAAAAFHZtaGQAAAABAAAAAAAAAAAAAAAkZGluZgAAABxkcmVmAAAAAAAAAAEAAAAMdXJsIAAAAAEAAAHAc3RibAAAAMBzdHNkAAAAAAAAAAEAAACwYXZjMQAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAIAAgASAAAAEgAAAAAAAAAARVMYXZjNTkuMzcuMTAwIGxpYngyNjQAAAAAAAAAAAAAABj//wAAADZhdmNDAWQACv/hABlnZAAKrNlfllwEQAAAAwBAAAADAIPEiWWAAQAGaOvjxMhM/fj4AAAAABBwYXNwAAAAAQAAAAEAAAAUYnRydAAAAAAAAAKiAAACogAAABhzdHRzAAAAAAAAAAEAAAAKAABAAAAAABRzdHNzAAAAAAAAAAEAAAABAAAAYGN0dHMAAAAAAAAACgAAAAEAAIAAAAAAAQABQAAAAAABAACAAAAAAAEAAAAAAAAAAQAAQAAAAAABAAFAAAAAAAEAAIAAAAAAAQAAAAAAAAABAABAAAAAAAEAAIAAAAAAHHN0c2MAAAAAAAAAAQAAAAEAAAAKAAAAAQAAADxzdHN6AAAAAAAAAAAAAAAKAAACyAAAAA0AAAANAAAADQAAAA0AAAATAAAADwAAAA0AAAANAAAAEwAAABRzdGNvAAAAAAAAAAEAAAAwAAAAYnVkdGEAAABabWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAbWRpcmFwcGwAAAAAAAAAAAAAAAAtaWxzdAAAACWpdG9vAAAAHWRhdGEAAAABAAAAAExhdmY1OS4yNy4xMDA=";
      this._player = document.createElement("video");
      this._player.setAttribute("id", "ScreenWakeLockVideo");
      this._player.setAttribute("src", videoData);
      this._player.setAttribute("playsinline", "");
      // Do not set muted to true or the following error can occur:
      // Uncaught (in promise) DOMException: The play() request was interrupted because video-only background media was paused to save power. https://goo.gl/LdLk22
      this._player.setAttribute("muted", "");
      this._player.addEventListener("ended", function () {
        logger.debug("Video ended");
        if (_this.enabled) {
          _this.enable();
        }
      });
      this._player.addEventListener("playing", function () {
        logger.debug("Video playing");
        _this._isPlaying = true;
      });
      this._player.addEventListener("pause", function () {
        logger.debug("Video pause");
        _this._isPlaying = false;
      });
    }
  }
  return _createClass(ScreenWakeLock, [{
    key: "enable",
    value: function enable() {
      var _this2 = this;
      if (this.nativeWakeLockSupported) {
        logger.debug("Requesting native screen wakelock");
        navigator.wakeLock.request("screen").then(function (wakeLock) {
          logger.debug("Request screen wakelock successful");
          _this2._lock = wakeLock;
          _this2.enabled = true;
          _this2.error = null;
        }).catch(function (e) {
          _this2.enabled = false;
          _this2.error = e;
          logger.error("Failed to request screen wakeLock: ".concat(e));
        });
      } else {
        logger.debug("Starting video player");
        if (!this._player.paused && this._player._isPlaying) {
          this._player.pause();
        }
        var playPromise = this._player.play();
        if (playPromise) {
          playPromise.then(function () {
            _this2.enabled = true;
            _this2.error = null;
            logger.debug("Video play successful");
          }).catch(function (error) {
            _this2.enabled = false;
            _this2.error = error;
            logger.error("Failed to play video: ".concat(error));
          });
        }
      }
    }
  }, {
    key: "disable",
    value: function disable() {
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
  }]);
}();
var CameraMotionDetection = /*#__PURE__*/function () {
  function CameraMotionDetection() {
    _classCallCheck(this, CameraMotionDetection);
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
    this.context = this.canvasElement.getContext("2d", {
      willReadFrequently: true
    });
  }
  return _createClass(CameraMotionDetection, [{
    key: "capture",
    value: function capture() {
      var diffPixels = 0;
      this.context.globalCompositeOperation = "difference";
      this.context.drawImage(this.videoElement, 0, 0, this.width, this.height);
      var diffImageData = this.context.getImageData(0, 0, this.width, this.height);
      var rgba = diffImageData.data;
      for (var i = 0; i < rgba.length; i += 4) {
        var pixelDiff = rgba[i] + rgba[i + 1] + rgba[i + 2];
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
  }, {
    key: "start",
    value: function start() {
      var _this3 = this;
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
      navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: {
            ideal: config.camera_motion_detection_facing_mode
          },
          width: this.width,
          height: this.height
        }
      }).then(function (stream) {
        _this3.videoElement.srcObject = stream;
        _this3.videoElement.play();
        if (_this3.enabled) {
          setInterval(_this3.capture.bind(_this3), _this3.captureInterval);
        }
      }).catch(function (err) {
        logger.error("Camera motion detection error:", err);
      });
    }
  }, {
    key: "stop",
    value: function stop() {
      if (!this.enabled) {
        return;
      }
      this.enabled = false;
      this.videoElement.pause();
      this.videoElement.srcObject.getTracks().forEach(function (track) {
        track.stop();
      });
    }
  }]);
}();
function shuffleArray(array) {
  var result = array.slice(); // Make a copy to avoid mutating the original
  for (var i = result.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var _ref = [result[j], result[i]];
    result[i] = _ref[0];
    result[j] = _ref[1];
  }
  return result;
}
function getHaCameraStreamPlayerAndVideo(haCameraStreamElement) {
  if (!haCameraStreamElement.shadowRoot) {
    return [null, null];
  }
  var player = haCameraStreamElement.shadowRoot.querySelector("ha-web-rtc-player") || haCameraStreamElement.shadowRoot.querySelector("ha-hls-player");
  if (!player || !player.shadowRoot) {
    return [player, null];
  }
  var video = player.shadowRoot.querySelector("video");
  return [player, video];
}
function mergeConfig(target) {
  for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    sources[_key - 1] = arguments[_key];
  }
  // https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
  if (!sources.length) return target;
  var source = sources.shift();
  var renamedOptions = {
    image_excludes: "exclude_filenames",
    image_fit: "image_fit_landscape",
    image_order: "media_order",
    enabled_on_tabs: "enabled_on_views",
    image_list_update_interval: "media_list_update_interval",
    screensaver_stop_navigation_path: "screensaver_start_navigation_path",
    card_interaction: "content_interaction"
  };
  if (isObject(target) && isObject(source)) {
    var _loop = function _loop() {
      var val = source[key];
      if (renamedOptions[key]) {
        logger.warn("The configuration option '".concat(key, "' has been renamed to '").concat(renamedOptions[key], "'. Please update your wallpanel configuration accordingly."));
        key = renamedOptions[key];
      }
      if (isObject(val)) {
        if (!target[key]) Object.assign(target, _defineProperty({}, key, {}));
        mergeConfig(target[key], val);
      } else {
        function replacer(match, entityId) {
          if (!(entityId in configEntityStates)) {
            configEntityStates[entityId] = "";
            var entity = (elHass.hass || elHass.__hass).states[entityId];
            if (entity) {
              configEntityStates[entityId] = entity.state;
            } else {
              logger.error("Entity used in placeholder not found: ".concat(entityId, " (").concat(match, ")"));
            }
          }
          var state = configEntityStates[entityId];
          logger.debug("Replace ".concat(match, " with ").concat(state));
          return state;
        }
        if (typeof val === "string" || val instanceof String) {
          val = val.replace("${browser_id}", browserId ? browserId : "browser-id-unset");
          val = val.replace(/\$\{entity:\s*([^}]+\.[^}]+)\}/g, replacer);
        }
        if (typeof target[key] === "boolean") {
          val = ["true", "on", "yes", "1"].includes(val.toString());
        }
        Object.assign(target, _defineProperty({}, key, val));
      }
    };
    for (var key in source) {
      _loop();
    }
  }
  return mergeConfig.apply(void 0, [target].concat(sources));
}
function updateConfig() {
  var params = new URLSearchParams(window.location.search);
  var oldConfig = config;
  config = {};
  mergeConfig(config, defaultConfig);
  if (Object.keys(dashboardConfig).length === 0) {
    dashboardConfig = getDashboardWallpanelConfig();
    if (Object.keys(dashboardConfig).length === 0) {
      logger.debug("No wallpanel config found in dashboard config");
    }
  }
  mergeConfig(config, dashboardConfig);
  var paramConfig = {};
  var _iterator = _createForOfIteratorHelper(params),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = _slicedToArray(_step.value, 2),
        key = _step$value[0],
        value = _step$value[1];
      if (key.startsWith("wp_")) {
        key = key.substring(3);
        if (key in defaultConfig && value) {
          // Convert to the right type
          try {
            value = JSON.parse(value);
          } catch (_unused) {
            // Invalid JSON, just take the string
          }
          paramConfig[key] = defaultConfig[key].constructor(value);
        }
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  config = mergeConfig(config, paramConfig);
  var profile = config.profile;
  if (config.profiles && profile && config.profiles[profile]) {
    config = mergeConfig(config, config.profiles[profile]);
    logger.debug("Profile set from config: ".concat(profile));
  }
  if (config.profiles && browserId && config.profiles["device.".concat(browserId)]) {
    var _profile = "device.".concat(browserId);
    config = mergeConfig(config, config.profiles[_profile]);
    logger.debug("Profile set from device: ".concat(_profile));
  }
  if (config.profiles) {
    var userIds = [userId, userName, userDisplayname];
    for (var i = 0; i < userIds.length; i++) {
      var user = userIds[i];
      if (user) {
        user = user.toLowerCase().replace(/\s/g, "_");
        if (config.profiles["user.".concat(user)]) {
          var _profile2 = "user.".concat(user);
          config = mergeConfig(config, config.profiles[_profile2]);
          logger.debug("Profile set from user: ".concat(_profile2));
          break;
        }
      }
    }
  }
  config = mergeConfig(config, paramConfig);
  var profile_entity = config.profile_entity;
  if (config.profiles && profile_entity && (elHass.hass || elHass.__hass).states[profile_entity] && config.profiles[(elHass.hass || elHass.__hass).states[profile_entity].state]) {
    var _profile3 = (elHass.hass || elHass.__hass).states[profile_entity].state;
    config = mergeConfig(config, config.profiles[_profile3]);
    logger.debug("Profile set from entity state: ".concat(_profile3));
  }
  if (config.content_interaction) {
    config.stop_screensaver_on_mouse_move = false;
  }
  if (config.image_url) {
    config.image_url = config.image_url.replace(/^media-entity:\/\//, "media-entity-image://");
    if (config.image_url.startsWith("/")) {
      config.image_url = "media-source://media_source".concat(config.image_url);
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
  var bmp = document.getElementsByTagName("browser-mod-popup");
  if (!bmp || !bmp[0] || !bmp[0].shadowRoot || bmp[0].shadowRoot.children.length == 0) {
    return null;
  }
  return bmp[0];
}
function isActive() {
  var params = new URLSearchParams(window.location.search);
  if (params.get("edit") == "1") {
    logger.debug("Edit mode active");
    return false;
  }
  if (!config.enabled) {
    logger.debug("Wallpanel not enabled in config");
    return false;
  }
  if (config.enabled_on_views && config.enabled_on_views.length > 0 && activeTab && !config.enabled_on_views.includes(activeTab)) {
    logger.debug("Wallpanel not enabled on current tab ".concat(activeTab));
    return false;
  }
  if (config.disable_screensaver_when_assist_active) {
    var voiceCommandDialog = elHass.shadowRoot.querySelector("ha-voice-command-dialog");
    if (voiceCommandDialog && voiceCommandDialog.shadowRoot && voiceCommandDialog.shadowRoot.querySelector("ha-dialog")) {
      logger.debug("Assist is active, wallpanel disabled");
      return false;
    }
  }
  if (wallpanel && wallpanel.disable_screensaver_on_browser_mod_popup_function && getActiveBrowserModPopup() && wallpanel.disable_screensaver_on_browser_mod_popup_function(getActiveBrowserModPopup())) {
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
function getDashboardWallpanelConfig() {
  var keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var pl = getHaPanelLovelace();
  var conf = {};
  if (pl && pl.lovelace) {
    var wallpanelConfig;
    if (pl.lovelace.config && pl.lovelace.config.wallpanel) {
      wallpanelConfig = pl.lovelace.config.wallpanel;
    } else if (pl.lovelace.rawConfig && pl.lovelace.rawConfig.wallpanel) {
      wallpanelConfig = pl.lovelace.rawConfig.wallpanel;
    }
    if (wallpanelConfig) {
      if (keys.length === 0) {
        keys = Object.keys(wallpanelConfig);
      }
      keys.forEach(function (key) {
        if (key in defaultConfig) {
          conf[key] = wallpanelConfig[key];
        }
      });
    }
  }
  return conf;
}
function setSidebarVisibility(hidden) {
  logger.debug("setSidebarVisibility: hidden=".concat(hidden));
  try {
    var panelLovelace = elHaMain.shadowRoot.querySelector("ha-panel-lovelace");
    if (panelLovelace) {
      var huiRoot = panelLovelace.shadowRoot.querySelector("hui-root");
      if (huiRoot) {
        var menuButton = huiRoot.shadowRoot.querySelector("ha-menu-button");
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
    var drawer = elHaMain.shadowRoot.querySelector("ha-drawer");
    if (drawer) {
      var sidebar = drawer.shadowRoot.querySelector("aside");
      if (sidebar) {
        if (hidden) {
          sidebar.style.maxWidth = "0px";
          elHaMain.style.setProperty("--mdc-drawer-width", "env(safe-area-inset-left)");
        } else {
          sidebar.style.maxWidth = "";
          elHaMain.style.removeProperty("--mdc-drawer-width");
        }
        window.dispatchEvent(new Event("resize"));
      }
    }
  } catch (e) {
    logger.warn(e);
  }
}
function setToolbarVisibility(hideToolbar, hideActionItems) {
  logger.debug("setToolbarVisibility: hideToolbar=".concat(hideToolbar, ", hideActionItems=").concat(hideActionItems));
  try {
    var panelLovelace = elHaMain.shadowRoot.querySelector("ha-panel-lovelace");
    if (!panelLovelace) {
      return;
    }
    var huiRoot = panelLovelace.shadowRoot.querySelector("hui-root");
    if (!huiRoot) {
      return;
    }
    huiRoot = huiRoot.shadowRoot;
    var view = huiRoot.querySelector("#view");
    var appToolbar = huiRoot.querySelector("app-toolbar");
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
      var actionItems = appToolbar.querySelector("div.action-items");
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
function navigate(path) {
  var keepSearch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  if (keepSearch && !path.includes("?")) {
    path += window.location.search;
  }
  history.pushState(null, "", path);
  elHass.dispatchEvent(new Event("location-changed", {
    bubbles: true,
    cancelable: false,
    composed: true
  }));
}
document.addEventListener("fullscreenerror", function () {
  logger.error("Failed to enter fullscreen");
});
document.addEventListener("fullscreenchange", function () {
  if (typeof document.webkitCurrentFullScreenElement !== "undefined") {
    fullscreen = Boolean(document.webkitCurrentFullScreenElement);
  } else if (typeof document.fullscreenElement !== "undefined") {
    fullscreen = Boolean(document.fullscreenElement);
  }
});
function enterFullscreen() {
  logger.debug("Enter fullscreen");
  // Will need user input event to work
  var el = document.documentElement;
  if (el.requestFullscreen) {
    el.requestFullscreen().then(function () {
      logger.debug("Successfully requested fullscreen");
    }, function (error) {
      logger.error("Failed to enter fullscreen:", error);
    });
  } else if (el.mozRequestFullScreen) {
    el.mozRequestFullScreen();
  } else if (el.msRequestFullscreen) {
    el.msRequestFullscreen();
  } else if (el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen();
  }
}
function initWallpanel() {
  var HuiView = customElements.get("hui-view");
  if (!HuiView) {
    var error = "Failed to get hui-view from customElements";
    throw new Error(error);
  }
  var WallpanelView = /*#__PURE__*/function (_HuiView) {
    function WallpanelView() {
      var _this4;
      _classCallCheck(this, WallpanelView);
      _this4 = _callSuper(this, WallpanelView);
      _this4.mediaList = [];
      _this4.mediaIndex = -1;
      _this4.mediaListDirection = "forwards"; // forwards, backwards
      _this4.lastMediaListUpdate;
      _this4.updatingMediaList = false;
      _this4.updatingMedia = false;
      _this4.lastMediaUpdate = 0;
      _this4.blockEventsUntil = 0;
      _this4.screensaverStartedAt;
      _this4.screensaverStoppedAt = new Date();
      _this4.infoBoxContentCreatedDate;
      _this4.idleSince = Date.now();
      _this4.lastProfileSet = config.profile;
      _this4.lastMove = null;
      _this4.lastCorner = 0; // 0 - top left, 1 - bottom left, 2 - bottom right, 3 - top right
      _this4.translateInterval = null;
      _this4.lastClickTime = 0;
      _this4.clickCount = 0;
      _this4.touchStartX = -1;
      _this4.currentWidth = 0;
      _this4.currentHeight = 0;
      _this4.energyCollectionUpdateEnabled = false;
      _this4.energyCollectionUpdateInterval = 60;
      _this4.lastEnergyCollectionUpdate = 0;
      _this4.screensaverStopNavigationPathTimeout = null;
      _this4.disable_screensaver_on_browser_mod_popup_function = null;
      _this4.screenWakeLock = new ScreenWakeLock();
      _this4.cameraMotionDetection = new CameraMotionDetection();
      _this4.lovelace = null;
      _this4.__hass = elHass.hass || elHass.__hass;
      _this4.__cards = [];
      _this4.__badges = [];
      _this4.__views = [];
      elHass.provideHass(_this4);
      setInterval(_this4.timer.bind(_this4), 1000);
      return _this4;
    }

    // Whenever the state changes, a new `hass` object is set.
    _inherits(WallpanelView, _HuiView);
    return _createClass(WallpanelView, [{
      key: "hass",
      get: function get() {
        return this.__hass;
      },
      set: function set(hass) {
        var _this5 = this;
        logger.debug("Update hass");
        this.__hass = hass;
        var changed = false;
        for (var entityId in configEntityStates) {
          var entity = this.__hass.states[entityId];
          if (entity && entity.state != configEntityStates[entityId]) {
            configEntityStates[entityId] = entity.state;
            changed = true;
          }
        }
        var profileUpdated = this.updateProfile();
        if (!profileUpdated && changed) {
          updateConfig();
        }
        if (!isActive()) {
          return;
        }
        var screensaver_entity = config.screensaver_entity;
        if (screensaver_entity && this.__hass.states[screensaver_entity]) {
          var lastChanged = new Date(this.__hass.states[screensaver_entity].last_changed);
          var state = this.__hass.states[screensaver_entity].state;
          if (state == "off" && this.screensaverStartedAt && lastChanged.getTime() - this.screensaverStartedAt > 0) {
            this.stopScreensaver(config.fade_out_time_screensaver_entity);
          } else if (state == "on" && this.screensaverStoppedAt && lastChanged.getTime() - this.screensaverStoppedAt > 0) {
            this.startScreensaver();
          }
        }
        if (this.screensaverRunning()) {
          this.__cards.forEach(function (card) {
            card.hass = _this5.hass;
          });
          this.__badges.forEach(function (badge) {
            badge.hass = _this5.hass;
          });
          this.__views.forEach(function (view) {
            view.hass = _this5.hass;
          });
          if (mediaSourceType() == "media-entity-image") {
            this.switchActiveMedia("entity_update");
          }
        }
      }
    }, {
      key: "setScreensaverEntityState",
      value: function setScreensaverEntityState() {
        var screensaver_entity = config.screensaver_entity;
        if (!screensaver_entity || !this.__hass.states[screensaver_entity]) return;
        if (this.screensaverRunning() && this.__hass.states[screensaver_entity].state == "on") return;
        if (!this.screensaverRunning() && this.__hass.states[screensaver_entity].state == "off") return;
        var service = this.screensaverRunning() ? "turn_on" : "turn_off";
        logger.debug("Updating screensaver_entity", screensaver_entity, service);
        this.__hass.callService("input_boolean", service, {
          entity_id: screensaver_entity
        }).then(function (result) {
          logger.debug(result);
        }, function (error) {
          logger.error("Failed to set screensaver entity state:", error);
        });
      }
    }, {
      key: "setImageURLEntityState",
      value: function setImageURLEntityState() {
        var image_url_entity = config.image_url_entity;
        if (!image_url_entity || !this.__hass.states[image_url_entity]) return;
        var activeElement = this.getActiveMediaElement();
        if (!activeElement || !activeElement.mediaUrl) return;
        // Maximum length for input_text entity is 255
        var mediaUrl = activeElement.mediaUrl.substring(0, 255);
        logger.debug("Updating image_url_entity", image_url_entity, mediaUrl);
        this.__hass.callService("input_text", "set_value", {
          entity_id: image_url_entity,
          value: mediaUrl
        }).then(function (result) {
          logger.debug(result);
        }, function (error) {
          logger.error("Failed to set image url entity state:", error);
        });
      }
    }, {
      key: "updateProfile",
      value: function updateProfile() {
        var profile_entity = config.profile_entity;
        if (profile_entity && this.__hass.states[profile_entity]) {
          var profile = this.__hass.states[profile_entity].state;
          if (profile && profile != this.lastProfileSet || !profile && this.lastProfileSet) {
            logger.debug("Set profile to ".concat(profile));
            this.lastProfileSet = profile;
            updateConfig();
            return true;
          }
        }
        return false;
      }
    }, {
      key: "timer",
      value: function timer() {
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
    }, {
      key: "setDefaultStyle",
      value: function setDefaultStyle() {
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
    }, {
      key: "updateStyle",
      value: function updateStyle() {
        this.screensaverOverlay.style.background = "#00000000";
        this.debugBox.style.visibility = config.debug ? "visible" : "hidden";
        this.debugBox.style.pointerEvents = config.debug ? "auto" : "none";
        //this.screensaverContainer.style.transition = `opacity ${Math.round(config.fade_in_time*1000)}ms ease-in-out`;
        this.style.transition = "opacity ".concat(Math.round(config.fade_in_time * 1000), "ms ease-in-out");
        this.imageOneContainer.style.transition = "opacity ".concat(Math.round(config.crossfade_time * 1000), "ms ease-in-out");
        this.imageTwoContainer.style.transition = "opacity ".concat(Math.round(config.crossfade_time * 1000), "ms ease-in-out");
        this.messageContainer.style.visibility = this.screensaverRunning() ? "visible" : "hidden";
        if (config.content_interaction) {
          this.screensaverImageOverlay.style.pointerEvents = "none";
        }
        if (config.info_animation_duration_x) {
          this.infoBoxPosX.style.animation = "moveX ".concat(config.info_animation_duration_x, "s ").concat(config.info_animation_timing_function_x, " infinite alternate");
        } else {
          this.infoBoxPosX.style.animation = "";
        }
        if (config.info_animation_duration_y) {
          this.infoBoxPosY.style.animation = "moveY ".concat(config.info_animation_duration_y, "s ").concat(config.info_animation_timing_function_y, " infinite alternate");
        } else {
          this.infoBoxPosY.style.animation = "";
        }
        if (config.style) {
          for (var elId in config.style) {
            if (elId.startsWith("wallpanel-") && elId != "wallpanel-shadow-host" && elId != "wallpanel-screensaver-info-box-badges" && elId != "wallpanel-screensaver-info-box-views" && !classStyles[elId]) {
              var el = this.shadowRoot.getElementById(elId);
              if (el) {
                logger.debug("Setting style attributes for element #".concat(elId));
                for (var attr in config.style[elId]) {
                  logger.debug("Setting style attribute ".concat(attr, " to ").concat(config.style[elId][attr]));
                  el.style.setProperty(attr, config.style[elId][attr]);
                }
                if (el == this.infoBox) {
                  this.fixedInfoBox.style.cssText = this.infoBox.style.cssText;
                } else if (el == this.infoBoxContent) {
                  this.fixedInfoBoxContent.style.cssText = this.infoBoxContent.style.cssText;
                }
              } else {
                logger.error("Element #".concat(elId, " not found"));
              }
            }
          }
        }
      }
    }, {
      key: "updateShadowStyle",
      value: function updateShadowStyle() {
        var computed = getComputedStyle(this.infoContainer);
        var maxX = this.infoContainer.offsetWidth - parseInt(computed.paddingLeft) - parseInt(computed.paddingRight) - this.infoBox.offsetWidth;
        var maxY = this.infoContainer.offsetHeight - parseInt(computed.paddingTop) - parseInt(computed.paddingBottom) - this.infoBox.offsetHeight;
        var host = "";
        if (config.style) {
          if (config.style["wallpanel-shadow-host"]) {
            for (var attr in config.style["wallpanel-shadow-host"]) {
              host += "".concat(attr, ": ").concat(config.style["wallpanel-shadow-host"][attr], ";\n");
            }
          }
          for (var className in classStyles) {
            if (config.style[className]) {
              mergeConfig(classStyles[className], config.style[className]);
            }
          }
        }
        var classCss = "";
        for (var _className in classStyles) {
          classCss += ".".concat(_className, " {\n");
          for (var _attr in classStyles[_className]) {
            classCss += "".concat(_attr, ": ").concat(classStyles[_className][_attr], ";\n");
          }
          classCss += "}\n";
        }
        this.shadowStyle.innerHTML = "\n\t\t\t\t:host {\n\t\t\t\t\t".concat(host, "\n\t\t\t\t}\n\t\t\t\t@keyframes moveX {\n\t\t\t\t\t100% {\n\t\t\t\t\t\ttransform: translate3d(").concat(maxX, "px, 0, 0);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\t@keyframes moveY {\n\t\t\t\t\t100% {\n\t\t\t\t\t\ttransform: translate3d(0, ").concat(maxY, "px, 0);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\t@keyframes horizontalProgress {\n\t\t\t\t\t0% {\n\t\t\t\t\t\twidth: 0%;\n\t\t\t\t\t}\n\t\t\t\t\t100% {\n\t\t\t\t\t\twidth: 100%;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\t@keyframes kenBurnsEffect-experimental {\n\t\t\t\t\t0% {\n\t\t\t\t\t\ttransform: scale(1.0) translateX(calc(var(--hidden-width) / -2 * 1px)) translateY(calc(var(--hidden-height) / -2 * 1px));\n\t\t\t\t\t}\n\t\t\t\t\t50% {\n\t\t\t\t\t\ttransform: scale(var(--ken-burns-zoom));\n\t\t\t\t\t}\n\t\t\t\t\t90% {\n\t\t\t\t\t\ttransform: scale(calc(1.0 + ((var(--ken-burns-zoom) - 1.0)/2))) translateX(calc(var(--hidden-width) / 2 * 1px)) translateY(calc(var(--hidden-height) / 2 * 1px));\n\t\t\t\t\t}\n\t\t\t\t\t100% {\n\t\t\t\t\t\ttransform: scale(1.0);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\t@keyframes kenBurnsEffect-experimental2 {\n\t\t\t\t\t0% {\n\t\t\t\t\t\ttransform: scale(1.0);\n\t\t\t\t\t}\n\t\t\t\t\t25% {\n\t\t\t\t\t\ttransform: scale(calc(1.0 + ((var(--ken-burns-zoom) - 1.0)/2))) translateX(calc(var(--hidden-width) / 2 * 1px)) translateY(calc(var(--hidden-height) / 2 * 1px));\n\t\t\t\t\t}\n\t\t\t\t\t50% {\n\t\t\t\t\t\ttransform: scale(var(--ken-burns-zoom));\n\t\t\t\t\t}\n\t\t\t\t\t75% {\n\t\t\t\t\t\ttransform: scale(calc(1.0 + ((var(--ken-burns-zoom) - 1.0)/2))) translateX(calc(var(--hidden-width) / -2 * 1px)) translateY(calc(var(--hidden-height) / -2 * 1px));\n\t\t\t\t\t}\n\t\t\t\t\t100% {\n\t\t\t\t\t\ttransform: scale(1.0);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\t@keyframes kenBurnsEffect-simple {\n\t\t\t\t\t0% {\n\t\t\t\t\t\ttransform-origin: bottom left;\n\t\t\t\t\t\ttransform: scale(1.0);\n\t\t\t\t\t}\n\t\t\t\t\t100% {\n\t\t\t\t\t\ttransform: scale(var(--ken-burns-zoom));\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\t").concat(classCss, "\n\t\t\t\t").concat(config.custom_css, "\n\t\t\t");
      }
    }, {
      key: "randomMove",
      value: function randomMove() {
        var computed = getComputedStyle(this.infoContainer);
        var maxX = this.infoContainer.offsetWidth - parseInt(computed.paddingLeft) - parseInt(computed.paddingRight) - this.infoBox.offsetWidth;
        var maxY = this.infoContainer.offsetHeight - parseInt(computed.paddingTop) - parseInt(computed.paddingBottom) - this.infoBox.offsetHeight;
        var x = Math.floor(Math.random() * maxX);
        var y = Math.floor(Math.random() * maxY);
        this.moveInfoBox(x, y);
      }
    }, {
      key: "moveAroundCorners",
      value: function moveAroundCorners() {
        var correctPostion = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var fadeDuration = null;
        if (correctPostion) {
          fadeDuration = 0;
        } else {
          this.lastCorner = (this.lastCorner + 1) % 4;
        }
        var computed = getComputedStyle(this.infoContainer);
        var x = [2, 3].includes(this.lastCorner) ? this.infoContainer.offsetWidth - parseInt(computed.paddingLeft) - parseInt(computed.paddingRight) - this.infoBox.offsetWidth : 0;
        var y = [1, 2].includes(this.lastCorner) ? this.infoContainer.offsetHeight - parseInt(computed.paddingTop) - parseInt(computed.paddingBottom) - this.infoBox.offsetHeight : 0;
        this.moveInfoBox(x, y, fadeDuration);
      }
    }, {
      key: "moveInfoBox",
      value: function moveInfoBox(x, y) {
        var fadeDuration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        this.lastMove = Date.now();
        if (fadeDuration === null) {
          fadeDuration = config.info_move_fade_duration;
        }
        if (fadeDuration > 0) {
          if (this.infoBox.animate) {
            var keyframes = [{
              opacity: 1
            }, {
              opacity: 0,
              offset: 0.5
            }, {
              opacity: 1
            }];
            this.infoBox.animate(keyframes, {
              duration: Math.round(fadeDuration * 1000),
              iterations: 1
            });
          } else {
            logger.warn("This browser does not support the animate() method, please set info_move_fade_duration to 0");
          }
        }
        var wp = this;
        var ms = Math.round(fadeDuration * 500);
        if (ms < 0) {
          ms = 0;
        }
        if (wp.translateInterval) {
          clearInterval(wp.translateInterval);
        }
        wp.translateInterval = setInterval(function () {
          wp.infoBoxPosX.style.transform = "translate3d(".concat(x, "px, 0, 0)");
          wp.infoBoxPosY.style.transform = "translate3d(0, ".concat(y, "px, 0)");
        }, ms);
      }
    }, {
      key: "createInfoBoxContent",
      value: function createInfoBoxContent() {
        var _this6 = this;
        logger.debug("Creating info box content");
        var haPanelLovelace = getHaPanelLovelace();
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
        this.shadowRoot.querySelectorAll(".wp-card").forEach(function (card) {
          card.parentElement.removeChild(card);
        });
        if (config.badges && config.badges.length > 0) {
          var div = document.createElement("div");
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
            for (var attr in config.style[div.id]) {
              logger.debug("Setting style attribute ".concat(attr, " to ").concat(config.style[div.id][attr]));
              div.style.setProperty(attr, config.style[div.id][attr]);
            }
          }
          config.badges.forEach(function (badge) {
            var badgeConfig = JSON.parse(JSON.stringify(badge));
            logger.debug("Creating badge:", badgeConfig);
            var style = {};
            if (badgeConfig.wp_style) {
              style = badgeConfig.wp_style;
              delete badgeConfig.wp_style;
            }
            var createBadgeElement = _this6._createBadgeElement ? _this6._createBadgeElement : _this6.createBadgeElement;
            var badgeElement = createBadgeElement.bind(_this6)(badgeConfig);
            badgeElement.hass = _this6.hass;
            for (var _attr2 in style) {
              badgeElement.style.setProperty(_attr2, style[_attr2]);
            }
            _this6.__badges.push(badgeElement);
            div.append(badgeElement);
          });
          this.infoBoxContent.appendChild(div);
        }
        if (config.views && config.views.length > 0) {
          var _div = document.createElement("div");
          _div.id = "wallpanel-screensaver-info-box-views";
          _div.classList.add("wp-views");
          if (config.style[_div.id]) {
            for (var _attr3 in config.style[_div.id]) {
              logger.debug("Setting style attribute ".concat(_attr3, " to ").concat(config.style[_div.id][_attr3]));
              _div.style.setProperty(_attr3, config.style[_div.id][_attr3]);
            }
          }
          var viewConfigs = this.lovelace.config.views;
          config.views.forEach(function (view) {
            var viewIndex = -1;
            var viewConfig = JSON.parse(JSON.stringify(view));
            for (var i = 0; i < viewConfigs.length; i++) {
              if (viewConfigs[i].path && view.path && viewConfigs[i].path.toLowerCase() == view.path.toLowerCase() || viewConfigs[i].title && view.title && viewConfigs[i].title.toLowerCase() == view.title.toLowerCase()) {
                viewIndex = i;
                viewConfig.title = viewConfigs[i].title;
                viewConfig.path = viewConfigs[i].path;
                break;
              }
            }
            if (viewIndex == -1) {
              logger.error("View with path '".concat(viewConfig.path, "' / tile '").concat(viewConfig.title, "' not found"));
              viewIndex = 0;
            }
            var viewElement = document.createElement("hui-view");
            viewElement.route = {
              prefix: "/" + activePanel,
              path: "/" + view.path
            };
            viewElement.lovelace = _this6.lovelace;
            viewElement.panel = _this6.hass.panels[activePanel];
            viewElement.hass = _this6.hass;
            viewElement.index = viewIndex;
            if (typeof viewConfig.narrow == "boolean") {
              viewElement.narrow = viewConfig.narrow;
            }
            _this6.__views.push(viewElement);
            var viewContainer = document.createElement("div");
            if (config.content_interaction) {
              viewElement.style.pointerEvents = "auto";
            } else {
              viewElement.style.pointerEvents = "none";
            }
            if (viewConfig.wp_style) {
              for (var _attr4 in viewConfig.wp_style) {
                viewContainer.style.setProperty(_attr4, viewConfig.wp_style[_attr4]);
              }
            }
            viewContainer.append(viewElement);
            _div.append(viewContainer);
          });
          this.infoBoxContent.appendChild(_div);
        }
        if (config.cards && config.cards.length > 0) {
          config.cards.forEach(function (card) {
            // Copy object
            var cardConfig = JSON.parse(JSON.stringify(card));
            logger.debug("Creating card:", cardConfig);
            var style = {};
            if (cardConfig.wp_style) {
              style = cardConfig.wp_style;
              delete cardConfig.wp_style;
            }
            if (cardConfig.type && cardConfig.type.includes("energy")) {
              cardConfig.collection_key = "energy_wallpanel";
              _this6.energyCollectionUpdateEnabled = true;
            }
            var createCardElement = _this6._createCardElement ? _this6._createCardElement : _this6.createCardElement;
            var cardElement = createCardElement.bind(_this6)(cardConfig);
            cardElement.hass = _this6.hass;
            _this6.__cards.push(cardElement);
            var parent = _this6.infoBoxContent;
            var cardContainer = document.createElement("div");
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
            for (var _attr5 in style) {
              if (_attr5 == "parent") {
                var pel = _this6.shadowRoot.getElementById(style[_attr5]);
                if (pel) {
                  parent = pel;
                }
              } else {
                cardContainer.style.setProperty(_attr5, style[_attr5]);
              }
            }
            cardContainer.append(cardElement);
            parent.appendChild(cardContainer);
          });
        }
        setTimeout(this.updateShadowStyle.bind(this), 500);
      }
    }, {
      key: "restartProgressBarAnimation",
      value: function restartProgressBarAnimation() {
        if (!this.progressBarContainer) {
          return;
        }
        this.progressBar.style.animation = "none";
        if (!config.show_progress_bar) {
          return;
        }
        var wp = this;
        setTimeout(function () {
          // Restart CSS animation.
          wp.progressBar.style.animation = "horizontalProgress ".concat(config.display_time, "s linear");
        }, 25);
      }
    }, {
      key: "restartKenBurnsEffect",
      value: function restartKenBurnsEffect() {
        if (!config.image_animation_ken_burns || !config.image_animation_ken_burns_animations.length) {
          return;
        }
        var activeElement = this.getActiveMediaElement();
        activeElement.style.animation = "none";
        activeElement.style.setProperty("--ken-burns-zoom", config.image_animation_ken_burns_zoom);
        var delay = Math.floor(config.image_animation_ken_burns_delay * 1000);
        if (delay < 50) {
          delay = 50;
        }
        var duration = Math.ceil(config.image_animation_ken_burns_duration || (config.display_time + config.crossfade_time * 2) * 1.2);
        var animation = config.image_animation_ken_burns_animations[Math.floor(Math.random() * config.image_animation_ken_burns_animations.length)];
        if (this.kenburnsDelayStartTimer) {
          clearTimeout(this.kenburnsDelayStartTimer);
        }
        activeElement.animationIterationCount = 1;
        this.kenburnsDelayStartTimer = setTimeout(function () {
          activeElement.style.animation = "kenBurnsEffect-".concat(animation, " ").concat(duration, "s linear forwards");
        }, delay);
      }
    }, {
      key: "getMediaElement",
      value: function getMediaElement() {
        var active = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        var mediaElement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var elem = this.imageOneContainer.style.opacity == (active ? 1 : 0) ? this.imageOne : this.imageTwo;
        if (mediaElement && elem.tagName.toLowerCase() == "ha-camera-stream") {
          var video = getHaCameraStreamPlayerAndVideo(elem)[1];
          if (video) {
            elem = video;
          }
        }
        return elem;
      }
    }, {
      key: "getActiveMediaElement",
      value: function getActiveMediaElement() {
        var mediaElement = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        return this.getMediaElement(true, mediaElement);
      }
    }, {
      key: "getInactiveMediaElement",
      value: function getInactiveMediaElement() {
        var mediaElement = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        return this.getMediaElement(false, mediaElement);
      }
    }, {
      key: "replaceMediaElement",
      value: function replaceMediaElement(mediaElement, mediaType) {
        if (typeof mediaElement.src === "string" && mediaElement.src.startsWith("blob:")) {
          URL.revokeObjectURL(mediaElement.src);
        }
        if (typeof mediaElement.pause == "function") {
          mediaElement.pause();
        }
        if (mediaElement.tagName.toLowerCase() == "ha-camera-stream") {
          var video = getHaCameraStreamPlayerAndVideo(mediaElement)[1];
          if (video) {
            video.pause();
          }
        }
        mediaType = mediaType.toLowerCase();
        var newMediaElement = document.createElement(mediaType);
        _toConsumableArray(mediaElement.attributes).filter(function (attr) {
          return attr.name != "src";
        }).forEach(function (attr) {
          return newMediaElement.setAttribute(attr.name, attr.value);
        });
        newMediaElement.mediaUrl = mediaElement.mediaUrl;
        newMediaElement.infoCacheUrl = mediaElement.infoCacheUrl;
        if (mediaType === "video") {
          // Do not set muted to true or the following error can occur:
          // Uncaught (in promise) DOMException: The play() request was interrupted because video-only background media was paused to save power. https://goo.gl/LdLk22
          Object.assign(newMediaElement, {
            preload: "auto",
            muted: false,
            volume: config.video_volume
          });
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
    }, {
      key: "loadBackgroundImage",
      value: function loadBackgroundImage(element) {
        var srcMediaUrl = element.src;
        var tagName = element.tagName.toLowerCase();
        if (tagName === "ha-camera-stream") {
          var mediaElement = getHaCameraStreamPlayerAndVideo(element)[1];
          if (!mediaElement || !mediaElement.poster) {
            return;
          }
          srcMediaUrl = mediaElement.poster;
        } else if (tagName === "video") {
          // Capture the current frame of the video as a background image
          var canvas = document.createElement("canvas");
          canvas.width = element.videoWidth;
          canvas.height = element.videoHeight;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(element, 0, 0, canvas.width, canvas.height);
          try {
            srcMediaUrl = canvas.toDataURL("image/png");
          } catch (err) {
            srcMediaUrl = null;
            logger.error("Error extracting canvas image:", err);
          }
        }
        var cont = this.imageOneBackground;
        if (element == this.imageTwo) {
          cont = this.imageTwoBackground;
        }
        cont.style.backgroundImage = srcMediaUrl ? "url(".concat(srcMediaUrl, ")") : "";
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        var _this7 = this;
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
        var shadow = this.attachShadow({
          mode: "open"
        });
        shadow.appendChild(this.shadowStyle);
        shadow.appendChild(this.screensaverContainer);
        shadow.appendChild(this.messageContainer);
        shadow.appendChild(this.debugBox);
        var wp = this;
        var eventNames = ["click", "touchstart", "touchend", "wheel"];
        if (config.stop_screensaver_on_key_down) {
          eventNames.push("keydown");
        }
        if (config.stop_screensaver_on_mouse_move) {
          eventNames.push("mousemove");
        }
        eventNames.forEach(function (eventName) {
          window.addEventListener(eventName, function (event) {
            wp.handleInteractionEvent(event);
          }, {
            capture: true
          });
        });
        window.addEventListener("resize", function () {
          var width = _this7.screensaverContainer.clientWidth;
          var height = _this7.screensaverContainer.clientHeight;
          if (wp.screensaverRunning() && (wp.currentWidth != width || wp.currentHeight != height)) {
            logger.debug("Size changed from ".concat(wp.currentWidth, "x").concat(wp.currentHeight, " to ").concat(width, "x").concat(height));
            wp.currentWidth = width;
            wp.currentHeight = height;
            wp.updateShadowStyle();
            wp.setMediaDimensions();
          }
        });
        window.addEventListener("hass-more-info", function () {
          if (wp.screensaverRunning()) {
            wp.moreInfoDialogToForeground();
          }
        });
        var infoBoxResizeObserver = new ResizeObserver(function () {
          if (config.info_move_pattern === "corners") {
            // Correct position
            _this7.moveAroundCorners(true);
          }
        });
        infoBoxResizeObserver.observe(this.infoBoxContent);

        // Correct possibly incorrect entity state
        this.setScreensaverEntityState();
      }
    }, {
      key: "reconfigure",
      value: function reconfigure(oldConfig) {
        var oldConfigAvailable = oldConfig && Object.keys(oldConfig).length > 0;
        this.updateStyle();
        if (this.screensaverRunning()) {
          this.createInfoBoxContent();
        }
        if (!config.info_move_interval && oldConfigAvailable && oldConfig.info_move_interval) {
          wallpanel.moveInfoBox(0, 0);
        }
        if (config.show_images && (!this.mediaList || !this.mediaList.length || !oldConfigAvailable || !oldConfig.show_images || oldConfig.image_url != config.image_url)) {
          var wp = this;
          var switchMedia = this.screensaverRunning() && oldConfigAvailable;
          var imgUrlChanged = oldConfig.image_url != config.image_url;
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
          this.disable_screensaver_on_browser_mod_popup_function = new Function("bmp", config.disable_screensaver_on_browser_mod_popup_func);
        }
        if (isActive() && config.camera_motion_detection_enabled) {
          this.cameraMotionDetection.start();
        } else {
          this.cameraMotionDetection.stop();
        }
      }
    }, {
      key: "getMoreInfoDialog",
      value: function getMoreInfoDialog() {
        var moreInfoDialog = elHass.shadowRoot.querySelector("ha-more-info-dialog");
        if (!moreInfoDialog) {
          return;
        }
        var dialog = moreInfoDialog.shadowRoot.querySelector("ha-dialog");
        if (dialog) {
          return dialog;
        }
      }
    }, {
      key: "moreInfoDialogToForeground",
      value: function moreInfoDialogToForeground() {
        var wp = this;
        function showDialog() {
          var attempt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
          var dialog = wp.getMoreInfoDialog();
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
    }, {
      key: "fetchEXIFInfo",
      value: function fetchEXIFInfo(img) {
        var wp = this;
        if (mediaInfoCache.get(img.infoCacheUrl)) {
          return;
        }
        var tmpImg = document.createElement("img");
        tmpImg.src = img.src;
        tmpImg.mediaUrl = img.mediaUrl;
        tmpImg.infoCacheUrl = img.infoCacheUrl;
        getImageData(tmpImg, function () {
          logger.debug("EXIF data:", tmpImg.exifdata);
          addToMediaInfoCache(tmpImg.infoCacheUrl, tmpImg.exifdata);
          wp.setMediaDataInfo(tmpImg);
          var exifLong = tmpImg.exifdata["GPSLongitude"];
          var exifLat = tmpImg.exifdata["GPSLatitude"];
          if (config.fetch_address_data && exifLong && !isNaN(exifLong[0]) && exifLat && !isNaN(exifLat[0])) {
            var m = tmpImg.exifdata["GPSLatitudeRef"] == "S" ? -1 : 1;
            var latitude = exifLat[0] * m + (exifLat[1] * m * 60 + exifLat[2] * m) / 3600;
            m = tmpImg.exifdata["GPSLongitudeRef"] == "W" ? -1 : 1;
            var longitude = exifLong[0] * m + (exifLong[1] * m * 60 + exifLong[2] * m) / 3600;
            logger.debug("Fetching nominatim data for lat=".concat(latitude, " lon=").concat(longitude));
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
              if (this.status == 200 || this.status === 0) {
                var info = JSON.parse(xhr.responseText);
                logger.debug("nominatim data:", info);
                if (info && info.address) {
                  var mediaInfo = mediaInfoCache.get(tmpImg.infoCacheUrl);
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
            xhr.open("GET", "https://nominatim.openstreetmap.org/reverse?lat=".concat(latitude, "&lon=").concat(longitude, "&format=json"));
            xhr.timeout = 15000;
            xhr.send();
          }
        });
      }
    }, {
      key: "setMediaDataInfo",
      value: function setMediaDataInfo() {
        var mediaElement = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        if (!mediaElement) {
          mediaElement = this.getActiveMediaElement();
        }
        var infoCacheUrl = mediaElement.infoCacheUrl;
        var mediaUrl = mediaElement.mediaUrl;
        if (!infoCacheUrl) {
          logger.debug("infoCacheUrl missing:", mediaElement);
          return;
        }
        if (!mediaUrl) {
          logger.debug("mediaUrl missing:", mediaElement);
          return;
        }
        mediaUrl = decodeURI(mediaUrl);
        var infoElements = [];
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
          infoElements.forEach(function (infoElement) {
            infoElement.innerHTML = "";
            infoElement.style.display = "none";
          });
          return;
        }

        // Check if attributes are undefined to avoid overwriting existing ones (e.g., from the Immich API),
        // even if the new value is an empty string
        var mediaInfo = mediaInfoCache.get(infoCacheUrl);
        if (!mediaInfo) {
          mediaInfo = {};
        }
        if (!mediaInfo.image) {
          mediaInfo.image = {};
        }
        if (mediaInfo.image.url === undefined) {
          mediaInfo.image.url = mediaUrl;
        }
        var mediaUrlWithoutQuery = mediaUrl.replace(/\?[^?]*$/, "").replace(/\/+$/, "");
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
          var parts = mediaUrlWithoutQuery.split("/");
          if (parts.length >= 2) {
            mediaInfo.image.folderName = parts[parts.length - 2];
          }
        }
        logger.debug("Media info:", mediaInfo);
        var html = config.image_info_template;
        if (html == "analyze") {
          html = "";
          function iterateOverKeys(obj) {
            var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
            var keys = Object.keys(obj);
            keys.sort();
            keys.forEach(function (key) {
              var value = obj[key];
              if (_typeof(value) === "object" && value !== null) {
                iterateOverKeys(value, key + ".");
              } else {
                html += "".concat(prefix).concat(key, ": ").concat(stringify(value), "<br>");
              }
            });
          }
          iterateOverKeys(mediaInfo);
          this.imageOneInfo.style.pointerEvents = "none";
          this.imageTwoInfo.style.pointerEvents = "none";
          infoElements.forEach(function (infoElement) {
            infoElement.style.pointerEvents = "auto";
          });
        } else {
          html = html.replace(/\${([^}]+)}/g, function (match, tags) {
            var prefix = "";
            var suffix = "";
            var options = null;
            if (tags.includes("!")) {
              var tmp = tags.split("!");
              tags = tmp[0];
              for (var i = 1; i < tmp.length; i++) {
                var argType = tmp[i].substring(0, tmp[i].indexOf("="));
                var argValue = tmp[i].substring(tmp[i].indexOf("=") + 1);
                if (argType == "prefix") {
                  prefix = argValue;
                } else if (argType == "suffix") {
                  suffix = argValue;
                } else if (argType == "options") {
                  options = {};
                  argValue.split(",").forEach(function (optVal) {
                    var tmp2 = optVal.split(":", 2);
                    if (tmp2[0] && tmp2[1]) {
                      options[tmp2[0].replace(/\s/g, "")] = tmp2[1].replace(/\s/g, "");
                    }
                  });
                }
              }
            }
            var val = "";
            var tagList = tags.split("|");
            var tag = "";
            for (var _i = 0; _i < tagList.length; _i++) {
              tag = tagList[_i];
              var keys = tag.replace(/\s/g, "").split(".");
              val = mediaInfo;
              keys.forEach(function (key) {
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
              var date = new Date(val.replace(/(\d\d\d\d):(\d\d):(\d\d) (\d\d):(\d\d):(\d\d)/, "$1-$2-$3T$4:$5:$6"));
              if (isNaN(date)) {
                // Invalid date
                return "";
              }
              if (!options) {
                options = {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit"
                };
              }
              val = date.toLocaleDateString((elHass.hass || elHass.__hass).locale.language, options);
            }
            if (_typeof(val) === "object") {
              val = JSON.stringify(val);
            }
            return prefix + val + suffix;
          });
        }
        infoElements.forEach(function (infoElement) {
          infoElement.innerHTML = html;
          infoElement.style.display = "block";
        });
      }
    }, {
      key: "updateMediaList",
      value: function () {
        var _updateMediaList = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
          var callback,
            force,
            retryCount,
            wp,
            updateFunction,
            sourceType,
            url,
            maxRetries,
            retryDelay,
            errorMsg,
            _args = arguments,
            _t;
          return _regenerator().w(function (_context) {
            while (1) switch (_context.n) {
              case 0:
                callback = _args.length > 0 && _args[0] !== undefined ? _args[0] : null;
                force = _args.length > 1 && _args[1] !== undefined ? _args[1] : false;
                retryCount = _args.length > 2 && _args[2] !== undefined ? _args[2] : 0;
                if (config.image_url) {
                  _context.n = 1;
                  break;
                }
                return _context.a(2);
              case 1:
                if (force) {
                  _context.n = 2;
                  break;
                }
                if (!(new Date().getTime() - this.lastMediaListUpdate < config.media_list_update_interval * 1000)) {
                  _context.n = 2;
                  break;
                }
                return _context.a(2);
              case 2:
                wp = this;
                updateFunction = null;
                sourceType = mediaSourceType();
                if (!(sourceType == "unsplash-api")) {
                  _context.n = 3;
                  break;
                }
                updateFunction = wp.updateMediaListFromUnsplashAPI;
                _context.n = 6;
                break;
              case 3:
                if (!(sourceType == "immich-api")) {
                  _context.n = 4;
                  break;
                }
                updateFunction = wp.updateMediaListFromImmichAPI;
                _context.n = 6;
                break;
              case 4:
                if (!(sourceType == "media-source")) {
                  _context.n = 5;
                  break;
                }
                updateFunction = wp.updateMediaListFromMediaSource;
                _context.n = 6;
                break;
              case 5:
                url = config.image_url;
                if (sourceType == "iframe") {
                  url = url.replace(/^iframe\+/, "");
                }
                this.mediaList = [url];
                if (callback) {
                  callback();
                }
                return _context.a(2);
              case 6:
                this.updatingMediaList = true;
                this.lastMediaListUpdate = Date.now();
                _context.p = 7;
                _context.n = 8;
                return updateFunction.bind(wp)();
              case 8:
                logger.debug("Media list from ".concat(sourceType, " is now:"), wp.mediaList);
                if (callback) {
                  callback();
                }
                _context.n = 10;
                break;
              case 9:
                _context.p = 9;
                _t = _context.v;
                maxRetries = 3;
                retryDelay = 3000; // 3 seconds
                logger.warn("Failed to update media list from ".concat(sourceType, ":"), _t);
                if (retryCount < maxRetries) {
                  logger.warn("Retrying media list update in ".concat(retryDelay / 1000, " seconds (attempt ").concat(retryCount + 1, "/").concat(maxRetries, ")..."));
                  setTimeout(function () {
                    return wp.updateMediaList(callback, true, retryCount + 1);
                  }, retryDelay);
                } else {
                  errorMsg = "Failed to update media list from ".concat(config.image_url, " after ").concat(maxRetries, " retries: ").concat(_t.message || stringify(_t));
                  logger.error(errorMsg);
                  wp.showMessage("error", "Error", errorMsg, 10000);
                }
              case 10:
                this.updatingMediaList = false;
              case 11:
                return _context.a(2);
            }
          }, _callee, this, [[7, 9]]);
        }));
        function updateMediaList() {
          return _updateMediaList.apply(this, arguments);
        }
        return updateMediaList;
      }()
    }, {
      key: "findMedias",
      value: function () {
        var _findMedias = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(mediaContentId) {
          var wp, excludeRegExp, _iterator2, _step2, imageExclude, mediaEntry, promises, results, _t2;
          return _regenerator().w(function (_context3) {
            while (1) switch (_context3.n) {
              case 0:
                wp = this;
                logger.debug("findMedias: ".concat(mediaContentId));
                excludeRegExp = [];
                if (config.exclude_filenames) {
                  _iterator2 = _createForOfIteratorHelper(config.exclude_filenames);
                  try {
                    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                      imageExclude = _step2.value;
                      excludeRegExp.push(new RegExp(imageExclude));
                    }
                  } catch (err) {
                    _iterator2.e(err);
                  } finally {
                    _iterator2.f();
                  }
                }
                _context3.p = 1;
                _context3.n = 2;
                return wp.hass.callWS({
                  type: "media_source/browse_media",
                  media_content_id: mediaContentId
                });
              case 2:
                mediaEntry = _context3.v;
                logger.debug("Found media entry", mediaEntry);
                promises = mediaEntry.children.map(/*#__PURE__*/function () {
                  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(child) {
                    var filename, _i2, _excludeRegExp, exclude;
                    return _regenerator().w(function (_context2) {
                      while (1) switch (_context2.n) {
                        case 0:
                          filename = child.media_content_id.replace(/^media-source:\/\/[^/]+/, "");
                          _i2 = 0, _excludeRegExp = excludeRegExp;
                        case 1:
                          if (!(_i2 < _excludeRegExp.length)) {
                            _context2.n = 3;
                            break;
                          }
                          exclude = _excludeRegExp[_i2];
                          if (!exclude.test(filename)) {
                            _context2.n = 2;
                            break;
                          }
                          return _context2.a(2, null);
                        case 2:
                          _i2++;
                          _context2.n = 1;
                          break;
                        case 3:
                          if (!["image", "video"].includes(child.media_class)) {
                            _context2.n = 5;
                            break;
                          }
                          if (!(config.exclude_media_types && config.exclude_media_types.includes(child.media_class))) {
                            _context2.n = 4;
                            break;
                          }
                          return _context2.a(2, null);
                        case 4:
                          return _context2.a(2, child.media_content_id);
                        case 5:
                          if (!(child.media_class == "directory")) {
                            _context2.n = 7;
                            break;
                          }
                          _context2.n = 6;
                          return wp.findMedias(child.media_content_id);
                        case 6:
                          return _context2.a(2, _context2.v);
                        case 7:
                          return _context2.a(2, null);
                      }
                    }, _callee2);
                  }));
                  return function (_x2) {
                    return _ref2.apply(this, arguments);
                  };
                }());
                _context3.n = 3;
                return Promise.all(promises);
              case 3:
                results = _context3.v;
                return _context3.a(2, results.flat().filter(function (res) {
                  return res !== null;
                }));
              case 4:
                _context3.p = 4;
                _t2 = _context3.v;
                logger.warn("Error browsing media ".concat(mediaContentId, ":"), _t2);
                throw _t2;
              case 5:
                return _context3.a(2);
            }
          }, _callee3, this, [[1, 4]]);
        }));
        function findMedias(_x) {
          return _findMedias.apply(this, arguments);
        }
        return findMedias;
      }()
    }, {
      key: "updateMediaListFromMediaSource",
      value: function () {
        var _updateMediaListFromMediaSource = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
          var mediaContentId, wp, urls, _t3;
          return _regenerator().w(function (_context4) {
            while (1) switch (_context4.n) {
              case 0:
                mediaContentId = config.image_url;
                wp = this;
                _context4.p = 1;
                _context4.n = 2;
                return wp.findMedias(mediaContentId);
              case 2:
                urls = _context4.v;
                if (config.media_order == "random") {
                  urls = shuffleArray(urls);
                } else {
                  urls = urls.sort(); // Sort consistently if not random
                }
                if (urls.length > config.media_list_max_size) {
                  logger.info("Using only ".concat(config.media_list_max_size, " of ").concat(urls.length, " media items"));
                  urls = urls.slice(0, config.media_list_max_size);
                }
                wp.mediaList = urls;
                _context4.n = 4;
                break;
              case 3:
                _context4.p = 3;
                _t3 = _context4.v;
                throw new Error("Failed to update image list from ".concat(config.image_url, ": ").concat(_t3.message || stringify(_t3)));
              case 4:
                return _context4.a(2);
            }
          }, _callee4, this, [[1, 3]]);
        }));
        function updateMediaListFromMediaSource() {
          return _updateMediaListFromMediaSource.apply(this, arguments);
        }
        return updateMediaListFromMediaSource;
      }()
    }, {
      key: "updateMediaListFromUnsplashAPI",
      value: function () {
        var _updateMediaListFromUnsplashAPI = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
          var urls, requestUrl, options, response, errorText, json, _t4;
          return _regenerator().w(function (_context5) {
            while (1) switch (_context5.n) {
              case 0:
                urls = [];
                requestUrl = "".concat(config.image_url, "&count=30");
                logger.debug("Unsplash API request: ".concat(requestUrl));
                _context5.p = 1;
                options = {
                  method: "GET",
                  headers: {
                    Accept: "application/json"
                  }
                };
                if (typeof AbortSignal !== "undefined") {
                  logger.debug("Using AbortSignal");
                  options.signal = AbortSignal.timeout(10000); // 10 seconds timeout
                }
                _context5.n = 2;
                return fetch(requestUrl, options);
              case 2:
                response = _context5.v;
                if (response.ok) {
                  _context5.n = 4;
                  break;
                }
                _context5.n = 3;
                return response.text();
              case 3:
                errorText = _context5.v;
                throw new Error("Unsplash API request failed: ".concat(response.status, " ").concat(response.statusText, " - ").concat(errorText));
              case 4:
                _context5.n = 5;
                return response.json();
              case 5:
                json = _context5.v;
                logger.debug("Got Unsplash API response");
                json.forEach(function (entry) {
                  logger.debug(entry);
                  var url = "".concat(entry.urls.raw, "&w=${width}&h=${height}&auto=format");
                  urls.push(url);
                  addToMediaInfoCache(url, entry);
                });
                this.mediaList = urls;
                _context5.n = 8;
                break;
              case 6:
                _context5.p = 6;
                _t4 = _context5.v;
                if (!(_t4.name === "AbortError")) {
                  _context5.n = 7;
                  break;
                }
                throw new Error("Unsplash API request timed out: ".concat(requestUrl));
              case 7:
                throw _t4;
              case 8:
                return _context5.a(2);
            }
          }, _callee5, this, [[1, 6]]);
        }));
        function updateMediaListFromUnsplashAPI() {
          return _updateMediaListFromUnsplashAPI.apply(this, arguments);
        }
        return updateMediaListFromUnsplashAPI;
      }()
    }, {
      key: "_immichFetch",
      value: function () {
        var _immichFetch2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(url) {
          var options,
            defaultOptions,
            mergedOptions,
            response,
            errorText,
            _args6 = arguments,
            _t5;
          return _regenerator().w(function (_context6) {
            while (1) switch (_context6.n) {
              case 0:
                options = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : {};
                defaultOptions = {
                  headers: {
                    "x-api-key": config.immich_api_key,
                    "Content-Type": "application/json",
                    Accept: "application/json"
                  }
                };
                mergedOptions = _objectSpread(_objectSpread({}, defaultOptions), options);
                mergedOptions.headers = _objectSpread(_objectSpread({}, defaultOptions.headers), options.headers);
                if (typeof AbortSignal !== "undefined") {
                  logger.debug("Using AbortSignal");
                  mergedOptions.signal = AbortSignal.timeout(10000); // 10 seconds timeout
                }
                logger.debug("Immich API request: ".concat(url));
                _context6.p = 1;
                _context6.n = 2;
                return fetch(url, mergedOptions);
              case 2:
                response = _context6.v;
                if (response.ok) {
                  _context6.n = 4;
                  break;
                }
                _context6.n = 3;
                return response.text();
              case 3:
                errorText = _context6.v;
                throw new Error("Immich API request failed: ".concat(response.status, " ").concat(response.statusText, " - ").concat(errorText));
              case 4:
                _context6.n = 5;
                return response.json();
              case 5:
                return _context6.a(2, _context6.v);
              case 6:
                _context6.p = 6;
                _t5 = _context6.v;
                if (!(_t5.name === "AbortError")) {
                  _context6.n = 7;
                  break;
                }
                throw new Error("Immich API request timed out: ".concat(url));
              case 7:
                throw _t5;
              case 8:
                return _context6.a(2);
            }
          }, _callee6, null, [[1, 6]]);
        }));
        function _immichFetch(_x3) {
          return _immichFetch2.apply(this, arguments);
        }
        return _immichFetch;
      }()
    }, {
      key: "updateMediaListFromImmichAPI",
      value: function () {
        var _updateMediaListFromImmichAPI = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
          var wp, screenOrientation, exclude_media_orientation, urls, mediaInfo, apiUrl, excludeRegExp, _iterator3, _step3, imageExclude, processAssets, finalizeImageList, orPersonNames, personNameToId, allPeople, page, hasNextPage, peopleData, _iterator5, _step5, personNames, personIds, _page, searchResults, msg, allMemories, now, tagNamesLower, allTags, tagIds, _page2, _searchResults, _msg, _msg2, albumNamesLower, allAlbums, albumIdsToFetch, albumDetailPromises, albumDetailsList, _msg3, _t6, _t7;
          return _regenerator().w(function (_context7) {
            while (1) switch (_context7.n) {
              case 0:
                finalizeImageList = function _finalizeImageList() {
                  if (urls.length == 0) {
                    var msg = "No matching media assets found";
                    console.warn(msg);
                    wp.showMessage("warning", "Warning", msg);
                  }
                  if (config.media_order == "random") {
                    urls = shuffleArray(urls);
                  } else {
                    urls = urls.sort(); // Sort consistently if not random
                  }
                  if (urls.length > config.media_list_max_size) {
                    logger.info("Using only ".concat(config.media_list_max_size, " of ").concat(urls.length, " media items"));
                    urls = urls.slice(0, config.media_list_max_size);
                  }
                  urls.forEach(function (url) {
                    addToMediaInfoCache(url, mediaInfo[url]);
                  });
                  wp.mediaList = urls;
                };
                processAssets = function _processAssets(assets) {
                  var folderName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
                  assets.forEach(function (asset) {
                    logger.debug("Processing immich asset", asset);
                    var assetType = asset.type.toLowerCase();
                    if (!["image", "video"].includes(assetType)) {
                      logger.debug("Neither image nor video, skipping");
                      return;
                    }
                    if (config.exclude_media_types && config.exclude_media_types.includes(assetType)) {
                      logger.debug("Media type \"".concat(assetType, "\" excluded"));
                      return;
                    }
                    var _iterator4 = _createForOfIteratorHelper(excludeRegExp),
                      _step4;
                    try {
                      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                        var exclude = _step4.value;
                        if (exclude.test(asset.originalFileName)) {
                          logger.debug("Media item excluded by regex \"".concat(exclude, "\""));
                          return;
                        }
                      }
                    } catch (err) {
                      _iterator4.e(err);
                    } finally {
                      _iterator4.f();
                    }
                    if (exclude_media_orientation && asset.exifInfo && asset.exifInfo.exifImageWidth && asset.exifInfo.exifImageHeight) {
                      var orientation = asset.exifInfo.exifImageWidth >= asset.exifInfo.exifImageHeight ? "landscape" : "portrait";
                      if (asset.exifInfo.orientation && [5, 6, 7, 8].includes(parseInt(asset.exifInfo.orientation))) {
                        // 90 or 270 degrees rotated
                        orientation = orientation == "landscape" ? "portrait" : "landscape";
                      }
                      if (orientation === exclude_media_orientation) {
                        logger.debug("Media item with orientation \"".concat(orientation, "\" excluded"));
                        return;
                      }
                    }
                    var resolution = "original";
                    if (config.immich_resolution == "preview") {
                      if (assetType == "video") {
                        resolution = "video/playback";
                      } else {
                        resolution = "thumbnail?size=preview";
                      }
                    }
                    var url = "".concat(apiUrl, "/assets/").concat(asset.id, "/").concat(resolution);
                    var info = asset.exifInfo || {};
                    info["mediaType"] = assetType;
                    info["image"] = {
                      filename: asset.originalFileName,
                      folderName: folderName
                    };
                    mediaInfo[url] = info;
                    urls.push(url);
                  });
                };
                if (config.immich_api_key) {
                  _context7.n = 1;
                  break;
                }
                throw new Error("immich_api_key not configured");
              case 1:
                wp = this;
                screenOrientation = this.screensaverContainer.clientWidth >= this.screensaverContainer.clientHeight ? "landscape" : "portrait";
                exclude_media_orientation = config.exclude_media_orientation;
                if (exclude_media_orientation == "auto") {
                  exclude_media_orientation = screenOrientation == "landscape" ? "portrait" : "landscape";
                }
                logger.debug("config.exclude_media_orientation=".concat(config.exclude_media_orientation, ", screenOrientation=").concat(screenOrientation, ", exclude_media_orientation=").concat(exclude_media_orientation));
                urls = [];
                mediaInfo = {};
                apiUrl = config.image_url.replace(/^immich\+/, "");
                excludeRegExp = [];
                if (config.exclude_filenames) {
                  _iterator3 = _createForOfIteratorHelper(config.exclude_filenames);
                  try {
                    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                      imageExclude = _step3.value;
                      excludeRegExp.push(new RegExp(imageExclude));
                    }
                  } catch (err) {
                    _iterator3.e(err);
                  } finally {
                    _iterator3.f();
                  }
                }
                _context7.p = 2;
                if (!(config.immich_persons && config.immich_persons.length)) {
                  _context7.n = 17;
                  break;
                }
                orPersonNames = config.immich_persons.map(function (entry) {
                  return (Array.isArray(entry) ? entry : [entry]).map(function (v) {
                    return v.toLowerCase();
                  });
                });
                personNameToId = {};
                allPeople = [];
                page = 1;
                hasNextPage = true; // Fetch all people first
              case 3:
                if (!hasNextPage) {
                  _context7.n = 5;
                  break;
                }
                _context7.n = 4;
                return wp._immichFetch("".concat(apiUrl, "/people?size=1000&page=").concat(page));
              case 4:
                peopleData = _context7.v;
                allPeople = allPeople.concat(peopleData.people);
                hasNextPage = peopleData.hasNextPage;
                page++;
                _context7.n = 3;
                break;
              case 5:
                allPeople.forEach(function (person) {
                  personNameToId[person.name.toLowerCase()] = person.id;
                });

                // Fetch assets for each person/group criteria
                _iterator5 = _createForOfIteratorHelper(orPersonNames);
                _context7.p = 6;
                _iterator5.s();
              case 7:
                if ((_step5 = _iterator5.n()).done) {
                  _context7.n = 13;
                  break;
                }
                personNames = _step5.value;
                personIds = personNames.map(function (name) {
                  return personNameToId[name];
                }).filter(function (id) {
                  if (!id) logger.error("Person not found in immich: ".concat(name));
                  return !!id;
                });
                if (!(personIds.length > 0)) {
                  _context7.n = 12;
                  break;
                }
                logger.debug("Searching asset metadata for persons: ", personIds);
                _page = 1;
              case 8:
                if (!true) {
                  _context7.n = 12;
                  break;
                }
                logger.debug("Fetching asset metadata page ".concat(_page));
                _context7.n = 9;
                return wp._immichFetch("".concat(apiUrl, "/search/metadata"), {
                  method: "POST",
                  body: JSON.stringify({
                    personIds: personIds,
                    withExif: true,
                    page: _page,
                    size: 1000
                  })
                });
              case 9:
                searchResults = _context7.v;
                logger.debug("Got immich API response", searchResults);
                if (searchResults.assets.count) {
                  _context7.n = 10;
                  break;
                }
                if (_page == 1) {
                  msg = "No media items found in immich that contain all these people: ".concat(personNames);
                  logger.warn(msg);
                  wp.showMessage("warning", "Warning", msg);
                }
                return _context7.a(3, 12);
              case 10:
                processAssets(searchResults.assets.items);
                if (searchResults.assets.nextPage) {
                  _context7.n = 11;
                  break;
                }
                return _context7.a(3, 12);
              case 11:
                _page = searchResults.assets.nextPage;
                _context7.n = 8;
                break;
              case 12:
                _context7.n = 7;
                break;
              case 13:
                _context7.n = 15;
                break;
              case 14:
                _context7.p = 14;
                _t6 = _context7.v;
                _iterator5.e(_t6);
              case 15:
                _context7.p = 15;
                _iterator5.f();
                return _context7.f(15);
              case 16:
                _context7.n = 32;
                break;
              case 17:
                if (!config.immich_memories) {
                  _context7.n = 19;
                  break;
                }
                logger.debug("Fetching immich memories (on_this_day)");
                _context7.n = 18;
                return wp._immichFetch("".concat(apiUrl, "/memories?type=on_this_day"));
              case 18:
                allMemories = _context7.v;
                logger.debug("Got immich API response", allMemories);
                now = new Date();
                allMemories.filter(function (memory) {
                  var showAt = new Date(memory.showAt);
                  var hideAt = new Date(memory.hideAt);
                  return now >= showAt && now <= hideAt;
                }).forEach(function (memory) {
                  logger.debug("Processing memory:", memory);
                  processAssets(memory.assets);
                });
                _context7.n = 32;
                break;
              case 19:
                if (!(config.immich_tag_names && config.immich_tag_names.length)) {
                  _context7.n = 28;
                  break;
                }
                tagNamesLower = config.immich_tag_names.map(function (v) {
                  return v.toLowerCase();
                });
                logger.debug("Fetching immich tags");
                _context7.n = 20;
                return wp._immichFetch("".concat(apiUrl, "/tags"));
              case 20:
                allTags = _context7.v;
                logger.debug("Got immich API response", allTags);
                tagIds = allTags.filter(function (tag) {
                  var include = tagNamesLower.includes(tag.name.toLowerCase());
                  logger.debug("".concat(include ? "Adding" : "Skipping", " tag: ").concat(tag.name));
                  return include;
                }).map(function (tag) {
                  return tag.id;
                });
                if (!(tagIds.length > 0)) {
                  _context7.n = 26;
                  break;
                }
                logger.debug("Searching asset metadata for tags: ", tagIds);
                _page2 = 1;
              case 21:
                if (!true) {
                  _context7.n = 25;
                  break;
                }
                logger.debug("Fetching asset metadata page ".concat(_page2));
                _context7.n = 22;
                return wp._immichFetch("".concat(apiUrl, "/search/metadata"), {
                  method: "POST",
                  body: JSON.stringify({
                    tagIds: tagIds,
                    withExif: true,
                    page: _page2,
                    size: 1000
                  })
                });
              case 22:
                _searchResults = _context7.v;
                logger.debug("Got immich API response", _searchResults);
                if (_searchResults.assets.count) {
                  _context7.n = 23;
                  break;
                }
                if (_page2 == 1) {
                  _msg = "No media items found in immich that contain these tags: ".concat(tagNamesLower);
                  logger.warn(_msg);
                  wp.showMessage("warning", "Warning", _msg);
                }
                return _context7.a(3, 25);
              case 23:
                processAssets(_searchResults.assets.items);
                if (_searchResults.assets.nextPage) {
                  _context7.n = 24;
                  break;
                }
                return _context7.a(3, 25);
              case 24:
                _page2 = _searchResults.assets.nextPage;
                _context7.n = 21;
                break;
              case 25:
                _context7.n = 27;
                break;
              case 26:
                _msg2 = "No matching immich tags found or selected.";
                logger.warn(_msg2);
                wp.showMessage("warning", "Warning", _msg2);
              case 27:
                _context7.n = 32;
                break;
              case 28:
                // Default: Fetch albums
                albumNamesLower = (config.immich_album_names || []).map(function (v) {
                  return v.toLowerCase();
                });
                logger.debug("Fetching immich albums (shared=".concat(config.immich_shared_albums, ")"));
                _context7.n = 29;
                return wp._immichFetch("".concat(apiUrl, "/albums?shared=").concat(config.immich_shared_albums));
              case 29:
                allAlbums = _context7.v;
                logger.debug("Got immich API response", allAlbums);
                albumIdsToFetch = allAlbums.filter(function (album) {
                  var include = !albumNamesLower.length || albumNamesLower.includes(album.albumName.toLowerCase());
                  logger.debug("".concat(include ? "Adding" : "Skipping", " album: ").concat(album.albumName));
                  return include;
                }).map(function (album) {
                  return album.id;
                });
                if (!(albumIdsToFetch.length > 0)) {
                  _context7.n = 31;
                  break;
                }
                albumDetailPromises = albumIdsToFetch.map(function (albumId) {
                  logger.debug("Fetching album metadata: ", albumId);
                  return wp._immichFetch("".concat(apiUrl, "/albums/").concat(albumId));
                });
                _context7.n = 30;
                return Promise.all(albumDetailPromises);
              case 30:
                albumDetailsList = _context7.v;
                albumDetailsList.forEach(function (albumDetails) {
                  logger.debug("Got immich album details", albumDetails);
                  processAssets(albumDetails.assets, albumDetails.albumName);
                });
                _context7.n = 32;
                break;
              case 31:
                _msg3 = "No matching immich albums found or selected.";
                logger.warn(_msg3);
                wp.showMessage("warning", "Warning", _msg3);
              case 32:
                finalizeImageList();
                _context7.n = 34;
                break;
              case 33:
                _context7.p = 33;
                _t7 = _context7.v;
                logger.error("Immich API processing failed:", _t7);
                throw _t7;
              case 34:
                return _context7.a(2);
            }
          }, _callee7, this, [[6, 14, 15, 16], [2, 33]]);
        }));
        function updateMediaListFromImmichAPI() {
          return _updateMediaListFromImmichAPI.apply(this, arguments);
        }
        return updateMediaListFromImmichAPI;
      }()
    }, {
      key: "fillPlaceholders",
      value: function fillPlaceholders(url) {
        var width = this.screensaverContainer.clientWidth;
        var height = this.screensaverContainer.clientHeight;
        var timestamp_ms = Date.now();
        var timestamp = Math.floor(timestamp_ms / 1000);
        url = url.replace(/\${width}/g, width);
        url = url.replace(/\${height}/g, height);
        url = url.replace(/\${timestamp_ms}/g, timestamp_ms);
        url = url.replace(/\${timestamp}/g, timestamp);
        return url;
      }
    }, {
      key: "updateMediaFromUrl",
      value: function () {
        var _updateMediaFromUrl = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(element, url) {
          var _this8 = this;
          var mediaType,
            headers,
            useFetch,
            loadMediaWithElement,
            handleFallback,
            loadOrFallback,
            _args1 = arguments;
          return _regenerator().w(function (_context1) {
            while (1) switch (_context1.n) {
              case 0:
                mediaType = _args1.length > 2 && _args1[2] !== undefined ? _args1[2] : null;
                headers = _args1.length > 3 && _args1[3] !== undefined ? _args1[3] : null;
                useFetch = _args1.length > 4 && _args1[4] !== undefined ? _args1[4] : false;
                // Setting the src attribute works better than fetch because cross-origin requests aren't blocked
                loadMediaWithElement = /*#__PURE__*/function () {
                  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(elem) {
                    var tagName, loadEventName, promise, response, blob;
                    return _regenerator().w(function (_context8) {
                      while (1) switch (_context8.n) {
                        case 0:
                          tagName = elem.tagName.toLowerCase();
                          loadEventName = {
                            img: "load",
                            video: "loadeddata",
                            iframe: "load"
                          }[tagName];
                          if (loadEventName) {
                            _context8.n = 1;
                            break;
                          }
                          throw new Error("Unsupported element tag \"".concat(elem.tagName, "\""));
                        case 1:
                          promise = new Promise(function (resolve, reject) {
                            var cleanup = function cleanup() {
                              elem.onerror = null;
                              elem.removeEventListener(loadEventName, onLoad);
                            };
                            var onLoad = function onLoad() {
                              cleanup();
                              resolve();
                            };
                            var onError = function onError() {
                              cleanup();
                              reject(new Error("Failed to load ".concat(elem.tagName, " \"").concat(url, "\"")));
                            };
                            elem.addEventListener(loadEventName, onLoad);
                            elem.onerror = onError;
                          });
                          if (!useFetch) {
                            _context8.n = 5;
                            break;
                          }
                          headers = headers || {};
                          _context8.n = 2;
                          return fetch(url, {
                            headers: headers
                          });
                        case 2:
                          response = _context8.v;
                          logger.debug("Got respone", response);
                          if (response.ok) {
                            _context8.n = 3;
                            break;
                          }
                          throw new Error("Failed to load ".concat(elem.tagName, " \"").concat(url, "\": ").concat(response));
                        case 3:
                          // The object URL created by URL.createObjectURL() must be released
                          // using URL.revokeObjectURL() to free the associated memory again.
                          if (typeof elem.src === "string" && elem.src.startsWith("blob:")) {
                            URL.revokeObjectURL(elem.src);
                          }
                          _context8.n = 4;
                          return response.blob();
                        case 4:
                          blob = _context8.v;
                          elem.src = window.URL.createObjectURL(blob);
                          _context8.n = 6;
                          break;
                        case 5:
                          elem.src = url;
                        case 6:
                          return _context8.a(2, promise);
                      }
                    }, _callee8);
                  }));
                  return function loadMediaWithElement(_x6) {
                    return _ref3.apply(this, arguments);
                  };
                }();
                handleFallback = /*#__PURE__*/function () {
                  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(currentElem) {
                    var mediaType,
                      originalError,
                      fallbackElem,
                      _args9 = arguments,
                      _t8;
                    return _regenerator().w(function (_context9) {
                      while (1) switch (_context9.n) {
                        case 0:
                          mediaType = _args9.length > 1 && _args9[1] !== undefined ? _args9[1] : null;
                          originalError = _args9.length > 2 && _args9[2] !== undefined ? _args9[2] : null;
                          if (!mediaType) {
                            mediaType = currentElem.tagName.toLowerCase() === "img" ? "video" : "img";
                          }
                          fallbackElem = _this8.replaceMediaElement(currentElem, mediaType);
                          _context9.p = 1;
                          _context9.n = 2;
                          return loadMediaWithElement(fallbackElem);
                        case 2:
                          return _context9.a(2, fallbackElem);
                        case 3:
                          _context9.p = 3;
                          _t8 = _context9.v;
                          throw originalError || _t8;
                        case 4:
                          return _context9.a(2);
                      }
                    }, _callee9, null, [[1, 3]]);
                  }));
                  return function handleFallback(_x7) {
                    return _ref4.apply(this, arguments);
                  };
                }();
                loadOrFallback = /*#__PURE__*/function () {
                  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(currentElem, withFallback) {
                    var _t9;
                    return _regenerator().w(function (_context0) {
                      while (1) switch (_context0.n) {
                        case 0:
                          _context0.p = 0;
                          _context0.n = 1;
                          return loadMediaWithElement(currentElem);
                        case 1:
                          return _context0.a(2, currentElem);
                        case 2:
                          _context0.p = 2;
                          _t9 = _context0.v;
                          if (!withFallback) {
                            _context0.n = 4;
                            break;
                          }
                          _context0.n = 3;
                          return handleFallback(currentElem, null, _t9);
                        case 3:
                          return _context0.a(2, _context0.v);
                        case 4:
                          throw _t9;
                        case 5:
                          return _context0.a(2);
                      }
                    }, _callee0, null, [[0, 2]]);
                  }));
                  return function loadOrFallback(_x8, _x9) {
                    return _ref5.apply(this, arguments);
                  };
                }();
                if (mediaType) {
                  _context1.n = 2;
                  break;
                }
                _context1.n = 1;
                return loadOrFallback(element, true);
              case 1:
                return _context1.a(2, _context1.v);
              case 2:
                if (!(mediaType === element.tagName.toLowerCase())) {
                  _context1.n = 4;
                  break;
                }
                _context1.n = 3;
                return loadOrFallback(element, false);
              case 3:
                return _context1.a(2, _context1.v);
              case 4:
                _context1.n = 5;
                return handleFallback(element, mediaType);
              case 5:
                return _context1.a(2, _context1.v);
              case 6:
                return _context1.a(2);
            }
          }, _callee1);
        }));
        function updateMediaFromUrl(_x4, _x5) {
          return _updateMediaFromUrl.apply(this, arguments);
        }
        return updateMediaFromUrl;
      }()
    }, {
      key: "getNextMediaURL",
      value: function getNextMediaURL() {
        var updateIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        if (!this.mediaList.length) {
          return null;
        }
        var mediaIndex = this.mediaIndex;
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
    }, {
      key: "updateMediaFromMediaSource",
      value: function () {
        var _updateMediaFromMediaSource = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(element) {
          var _result$mime_type;
          var result, matchedType, mediaType, src;
          return _regenerator().w(function (_context10) {
            while (1) switch (_context10.n) {
              case 0:
                _context10.n = 1;
                return this.hass.callWS({
                  type: "media_source/resolve_media",
                  media_content_id: element.mediaUrl
                });
              case 1:
                result = _context10.v;
                matchedType = (_result$mime_type = result.mime_type) === null || _result$mime_type === void 0 ? void 0 : _result$mime_type.match(/^(image|video)\//);
                mediaType = {
                  image: "img",
                  video: "video"
                }[matchedType === null || matchedType === void 0 ? void 0 : matchedType[1]] || null;
                src = result.url;
                if (!src.startsWith("http://") && !src.startsWith("https://")) {
                  src = "".concat(document.location.origin).concat(src);
                }
                logger.debug("Setting image src: ".concat(src));
                element.mediaUrl = src;
                _context10.n = 2;
                return this.updateMediaFromUrl(element, element.mediaUrl, mediaType);
              case 2:
                return _context10.a(2, _context10.v);
            }
          }, _callee10, this);
        }));
        function updateMediaFromMediaSource(_x0) {
          return _updateMediaFromMediaSource.apply(this, arguments);
        }
        return updateMediaFromMediaSource;
      }()
    }, {
      key: "updateMediaFromImmichAPI",
      value: function () {
        var _updateMediaFromImmichAPI = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11(element) {
          var mediaInfo, mediaType;
          return _regenerator().w(function (_context11) {
            while (1) switch (_context11.n) {
              case 0:
                mediaInfo = mediaInfoCache.get(element.mediaUrl) || {};
                mediaType = mediaInfo["mediaType"] == "video" ? "video" : "img";
                _context11.n = 1;
                return this.updateMediaFromUrl(element, element.mediaUrl, mediaType, {
                  "x-api-key": config.immich_api_key
                }, true);
              case 1:
                return _context11.a(2, _context11.v);
            }
          }, _callee11, this);
        }));
        function updateMediaFromImmichAPI(_x1) {
          return _updateMediaFromImmichAPI.apply(this, arguments);
        }
        return updateMediaFromImmichAPI;
      }()
    }, {
      key: "updateMediaFromMediaEntity",
      value: function () {
        var _updateMediaFromMediaEntity = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13(element) {
          var match, mediaType, mediaEntity, entity, attributesToMediaInfoCache, entityPicture, querySuffix;
          return _regenerator().w(function (_context13) {
            while (1) switch (_context13.n) {
              case 0:
                attributesToMediaInfoCache = function _attributesToMediaInf() {
                  if ("media_exif" in entity.attributes) {
                    // immich-home-assistant provides media_exif
                    addToMediaInfoCache(element.infoCacheUrl, entity.attributes["media_exif"]);
                  } else {
                    addToMediaInfoCache(element.infoCacheUrl, entity.attributes);
                  }
                };
                match = element.mediaUrl.match(/^media-entity-(image|video):\/\/(.*)/);
                if (match) {
                  _context13.n = 1;
                  break;
                }
                throw new Error("Invalid URL \"".concat(element.mediaUrl, "\""));
              case 1:
                mediaType = match[1];
                mediaEntity = match[2];
                entity = this.hass.states[mediaEntity];
                if (entity) {
                  _context13.n = 2;
                  break;
                }
                throw new Error("Entity \"".concat(mediaEntity, "\" not available"));
              case 2:
                mediaEntityState = entity.state;
                if (!(mediaType == "video")) {
                  _context13.n = 3;
                  break;
                }
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
                return _context13.a(2, new Promise(function (resolve) {
                  function onLoad(_x11) {
                    return _onLoad.apply(this, arguments);
                  }
                  function _onLoad() {
                    _onLoad = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12(evt) {
                      var el, _getHaCameraStreamPla, _getHaCameraStreamPla2, player, video, _onCanPlay;
                      return _regenerator().w(function (_context12) {
                        while (1) switch (_context12.n) {
                          case 0:
                            el = evt.currentTarget;
                            el.removeEventListener("load", onLoad);
                            _context12.n = 1;
                            return el.updateComplete;
                          case 1:
                            _getHaCameraStreamPla = getHaCameraStreamPlayerAndVideo(el), _getHaCameraStreamPla2 = _slicedToArray(_getHaCameraStreamPla, 2), player = _getHaCameraStreamPla2[0], video = _getHaCameraStreamPla2[1];
                            player.style.height = "100%";
                            video.autoplay = false;
                            video.muted = false;
                            video.volume = config.video_volume;
                            video.style.maxHeight = "100%";
                            video.style.height = "100%";
                            if (video.readyState >= element.HAVE_ENOUGH_DATA) {
                              resolve(el);
                            } else {
                              _onCanPlay = function onCanPlay() {
                                video.removeEventListener("canplay", _onCanPlay);
                                resolve(el);
                              };
                              video.addEventListener("canplay", _onCanPlay);
                            }
                          case 2:
                            return _context12.a(2);
                        }
                      }, _callee12);
                    }));
                    return _onLoad.apply(this, arguments);
                  }
                  element.addEventListener("load", onLoad);
                }));
              case 3:
                if (!(!entity.attributes || !entity.attributes.entity_picture)) {
                  _context13.n = 4;
                  break;
                }
                throw new Error("Entity \"".concat(mediaEntity, "\" has no entity_picture attribute"));
              case 4:
                entityPicture = entity.attributes.entity_picture;
                querySuffix = entityPicture.indexOf("?") > 0 ? "&" : "?"; // Adding a timestamp ensures that the cache is bypassed
                // and each image gets a unique infoCacheUrl for handling media information correctly
                querySuffix += this.fillPlaceholders("width=${width}&height=${height}&ts=${timestamp_ms}");
                element.mediaUrl = entityPicture + querySuffix;
                element.infoCacheUrl = element.mediaUrl;
                attributesToMediaInfoCache();
                _context13.n = 5;
                return this.updateMediaFromUrl(element, element.mediaUrl, "img", null, true);
              case 5:
                return _context13.a(2, _context13.v);
              case 6:
                return _context13.a(2);
            }
          }, _callee13, this);
        }));
        function updateMediaFromMediaEntity(_x10) {
          return _updateMediaFromMediaEntity.apply(this, arguments);
        }
        return updateMediaFromMediaEntity;
      }()
    }, {
      key: "updateMediaFromUnsplashAPI",
      value: function () {
        var _updateMediaFromUnsplashAPI = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14(element) {
          var mediaInfo;
          return _regenerator().w(function (_context14) {
            while (1) switch (_context14.n) {
              case 0:
                mediaInfo = mediaInfoCache.get(element.mediaUrl);
                element.mediaUrl = this.fillPlaceholders(element.mediaUrl);
                if (mediaInfo) {
                  addToMediaInfoCache(element.mediaUrl, mediaInfo);
                }
                _context14.n = 1;
                return this.updateMediaFromUrl(element, element.mediaUrl, "img");
              case 1:
                return _context14.a(2, _context14.v);
            }
          }, _callee14, this);
        }));
        function updateMediaFromUnsplashAPI(_x12) {
          return _updateMediaFromUnsplashAPI.apply(this, arguments);
        }
        return updateMediaFromUnsplashAPI;
      }()
    }, {
      key: "updateMediaFromMediaIframe",
      value: function () {
        var _updateMediaFromMediaIframe = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15(element) {
          return _regenerator().w(function (_context15) {
            while (1) switch (_context15.n) {
              case 0:
                _context15.n = 1;
                return this.updateMediaFromUrl(element, element.mediaUrl, "iframe");
              case 1:
                return _context15.a(2, _context15.v);
            }
          }, _callee15, this);
        }));
        function updateMediaFromMediaIframe(_x13) {
          return _updateMediaFromMediaIframe.apply(this, arguments);
        }
        return updateMediaFromMediaIframe;
      }()
    }, {
      key: "updateMediaFromOtherSrc",
      value: function () {
        var _updateMediaFromOtherSrc = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16(element) {
          return _regenerator().w(function (_context16) {
            while (1) switch (_context16.n) {
              case 0:
                element.mediaUrl = this.fillPlaceholders(element.mediaUrl);
                _context16.n = 1;
                return this.updateMediaFromUrl(element, element.mediaUrl);
              case 1:
                return _context16.a(2, _context16.v);
            }
          }, _callee16, this);
        }));
        function updateMediaFromOtherSrc(_x14) {
          return _updateMediaFromOtherSrc.apply(this, arguments);
        }
        return updateMediaFromOtherSrc;
      }()
    }, {
      key: "updateMedia",
      value: function () {
        var _updateMedia = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee17(element) {
          var inactiveElement, isVideo, _t0;
          return _regenerator().w(function (_context17) {
            while (1) switch (_context17.n) {
              case 0:
                if (config.show_images) {
                  _context17.n = 1;
                  break;
                }
                return _context17.a(2);
              case 1:
                this.updatingMedia = true;
                _context17.p = 2;
                if (element == this.getActiveMediaElement()) {
                  inactiveElement = this.getInactiveMediaElement();
                  if (inactiveElement.tagName.toLowerCase() === "video") {
                    try {
                      inactiveElement.pause();
                    } catch (e) {
                      logger.debug(e);
                    }
                  }
                }
                element.mediaUrl = this.getNextMediaURL();
                if (element.mediaUrl) {
                  _context17.n = 3;
                  break;
                }
                return _context17.a(2);
              case 3:
                element.infoCacheUrl = element.mediaUrl;
                if (!(mediaSourceType() == "media-source")) {
                  _context17.n = 5;
                  break;
                }
                _context17.n = 4;
                return this.updateMediaFromMediaSource(element);
              case 4:
                element = _context17.v;
                _context17.n = 15;
                break;
              case 5:
                if (!(mediaSourceType() == "unsplash-api")) {
                  _context17.n = 7;
                  break;
                }
                _context17.n = 6;
                return this.updateMediaFromUnsplashAPI(element);
              case 6:
                element = _context17.v;
                _context17.n = 15;
                break;
              case 7:
                if (!(mediaSourceType() == "immich-api")) {
                  _context17.n = 9;
                  break;
                }
                _context17.n = 8;
                return this.updateMediaFromImmichAPI(element);
              case 8:
                element = _context17.v;
                _context17.n = 15;
                break;
              case 9:
                if (!mediaSourceType().startsWith("media-entity")) {
                  _context17.n = 11;
                  break;
                }
                _context17.n = 10;
                return this.updateMediaFromMediaEntity(element);
              case 10:
                element = _context17.v;
                _context17.n = 15;
                break;
              case 11:
                if (!(mediaSourceType() == "iframe")) {
                  _context17.n = 13;
                  break;
                }
                _context17.n = 12;
                return this.updateMediaFromMediaIframe(element);
              case 12:
                element = _context17.v;
                _context17.n = 15;
                break;
              case 13:
                _context17.n = 14;
                return this.updateMediaFromOtherSrc(element);
              case 14:
                element = _context17.v;
              case 15:
                if (!element) {
                  _context17.n = 17;
                  break;
                }
                element.style.visibility = "visible";
                isVideo = element.tagName.toLowerCase() === "video";
                if (!isVideo) {
                  _context17.n = 16;
                  break;
                }
                _context17.n = 16;
                return new Promise(function (resolve, reject) {
                  if (element.readyState >= element.HAVE_ENOUGH_DATA) {
                    resolve();
                  } else {
                    var _onCanPlay2 = function onCanPlay() {
                      element.removeEventListener("canplay", _onCanPlay2);
                      element.removeEventListener("error", _onError);
                      resolve();
                    };
                    var _onError = function onError() {
                      element.removeEventListener("canplay", _onCanPlay2);
                      element.removeEventListener("error", _onError);
                      reject(new Error("Video failed to load"));
                    };
                    element.addEventListener("canplay", _onCanPlay2);
                    element.addEventListener("error", _onError);
                  }
                });
              case 16:
                if (config.image_background === "image") {
                  this.loadBackgroundImage(element);
                }
                if (!isVideo && config.show_image_info && /.*\.jpe?g$/i.test(element.mediaUrl.split("?")[0].replace(/\/*$/, ""))) {
                  this.fetchEXIFInfo(element);
                }
              case 17:
                _context17.n = 19;
                break;
              case 18:
                _context17.p = 18;
                _t0 = _context17.v;
                // Example: "TypeError: Failed to fetch"
                // This is most likely due to a network error.
                // The network error can be caused by power-saving settings on mobile devices.
                // Make sure the "Keep WiFi on during sleep" option is enabled.
                // Set your WiFi connection to "not metered".
                logger.error("Failed to update media from ".concat(element.mediaUrl, ":"), _t0);
                this.showMessage("error", "Error", "Failed to update media from ".concat(element.mediaUrl, ": ").concat(_t0), 5000);
              case 19:
                this.updatingMedia = false;
                return _context17.a(2, element);
            }
          }, _callee17, this, [[2, 18]]);
        }));
        function updateMedia(_x15) {
          return _updateMedia.apply(this, arguments);
        }
        return updateMedia;
      }()
    }, {
      key: "setMediaDimensions",
      value: function setMediaDimensions() {
        var activeElem = this.getActiveMediaElement();
        var mediaElem = this.getActiveMediaElement(true);
        logger.debug("Setting dimensions for media element", activeElem);
        if (!activeElem.mediaUrl) {
          return;
        }
        // Determine if the new media is landscape or portrait, and set the appropriate sizes
        var tagName = mediaElem.tagName.toLowerCase();
        var width = 0;
        var height = 0;
        if (tagName === "video") {
          width = mediaElem.videoWidth;
          height = mediaElem.videoHeight;
        } else if (tagName === "img") {
          width = mediaElem.naturalWidth;
          height = mediaElem.naturalHeight;
        }
        var mediaFit = !width || !height || width >= height ? config.image_fit_landscape : config.image_fit_portrait; // cover / contain

        activeElem.style.position = "absolute";
        activeElem.style.left = "0px";
        activeElem.style.top = "0px";
        activeElem.style.objectFit = mediaFit;
        var availWidth = this.screensaverContainer.clientWidth;
        var availHeight = this.screensaverContainer.clientHeight;
        var setHeight = availHeight;
        var setWidth = availWidth;
        var hiddenHeight = 0;
        var hiddenWidth = 0;
        var setTop = 0;
        var setLeft = 0;
        logger.debug("Available size is ".concat(availWidth, "x").concat(availHeight, ", media size is ").concat(width, "x").concat(height));
        if (width && height) {
          var ratioWidth = availWidth / width;
          var ratioHeight = availHeight / height;
          var diffWidth = availWidth - width * ratioHeight;
          var diffHeight = availHeight - height * ratioWidth;
          logger.debug("Diff is ".concat(diffWidth, "x").concat(diffHeight));
          if (mediaFit == "contain" && diffWidth < diffHeight || mediaFit == "cover" && diffWidth >= diffHeight) {
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
        logger.debug("Setting dimensions: size=".concat(setWidth, "x").concat(setHeight, " - position=").concat(setLeft, "x").concat(setTop, " - hidden=").concat(hiddenWidth, "x").concat(hiddenHeight));
        activeElem.style.width = "".concat(setWidth, "px");
        activeElem.style.height = "".concat(setHeight, "px");
        activeElem.style.top = "".concat(setTop, "px");
        activeElem.style.left = "".concat(setLeft, "px");
        activeElem.style.setProperty("--hidden-width", hiddenWidth);
        activeElem.style.setProperty("--hidden-height", hiddenHeight);
      }
    }, {
      key: "startPlayingActiveMedia",
      value: function startPlayingActiveMedia() {
        var _this9 = this;
        var activeElem = this.getActiveMediaElement();
        var videoElement = this.getActiveMediaElement(true);
        if (typeof videoElement.play !== "function") {
          return; // Not playable element.
        }
        var cleanupListeners = function cleanupListeners() {
          if (videoElement._wp_video_playback_listeners) {
            Object.entries(videoElement._wp_video_playback_listeners).forEach(function (_ref6) {
              var _ref7 = _slicedToArray(_ref6, 2),
                event = _ref7[0],
                handler = _ref7[1];
              videoElement.removeEventListener(event, handler);
            });
            videoElement._wp_video_playback_listeners = null;
          }
        };
        videoElement.loop = config.video_loop;
        if (!config.video_loop && !videoElement._wp_video_playback_listeners) {
          // Immediately switch to next image at the end of the playback.
          var onTimeUpdate = function onTimeUpdate() {
            if (_this9.getActiveMediaElement() !== videoElement) {
              cleanupListeners();
              return;
            }
            // If the media has played enough and is near the end.
            if (videoElement.currentTime > config.crossfade_time) {
              var remainingTime = videoElement.duration - videoElement.currentTime;
              if (remainingTime <= config.crossfade_time) {
                _this9.switchActiveMedia("display_time_elapsed");
                cleanupListeners();
              }
            }
          };
          var onMediaEnded = function onMediaEnded() {
            if (_this9.getActiveMediaElement() === videoElement) {
              _this9.switchActiveMedia("media_end");
            }
            cleanupListeners();
          };
          var onMediaPause = function onMediaPause() {
            cleanupListeners();
          };
          videoElement._wp_video_playback_listeners = {
            timeupdate: onTimeUpdate,
            ended: onMediaEnded,
            pause: onMediaPause
          };
          Object.entries(videoElement._wp_video_playback_listeners).forEach(function (_ref8) {
            var _ref9 = _slicedToArray(_ref8, 2),
              event = _ref9[0],
              handler = _ref9[1];
            videoElement.addEventListener(event, handler);
          });
        }

        // Start playing the media.
        var wp = this;
        videoElement.play().catch(function (e) {
          cleanupListeners();
          if (activeElem === _this9.getActiveMediaElement()) {
            logger.error("Failed to play media \"".concat(activeElem.mediaUrl, "\" (src=").concat(videoElement.src, "):"), e);
            wp.showMessage("error", "Error", "Failed to play media \"".concat(activeElem.mediaUrl, "\": ").concat(e));
          }
        });
      }
    }, {
      key: "switchActiveMedia",
      value: function () {
        var _switchActiveMedia2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee18(eventType) {
          var sourceType, mediaEntity, _entity, activeElement, crossfadeMillis, updateElement, element;
          return _regenerator().w(function (_context18) {
            while (1) switch (_context18.n) {
              case 0:
                if (this.afterFadeoutTimer) {
                  clearTimeout(this.afterFadeoutTimer);
                }
                sourceType = mediaSourceType();
                if (!sourceType.startsWith("media-entity")) {
                  _context18.n = 7;
                  break;
                }
                mediaEntity = config.image_url.replace(/^media-entity-(image|video):\/\//, "");
                _entity = this.hass.states[mediaEntity];
                if (_entity) {
                  _context18.n = 1;
                  break;
                }
                logger.error("Media entity \"".concat(mediaEntity, "\" not available"));
                return _context18.a(2);
              case 1:
                if (!(mediaEntityState != _entity.state)) {
                  _context18.n = 2;
                  break;
                }
                logger.debug("Media entity ".concat(mediaEntity, " state has changed"));
                _context18.n = 6;
                break;
              case 2:
                if (!(eventType == "entity_update")) {
                  _context18.n = 3;
                  break;
                }
                return _context18.a(2);
              case 3:
                if (!(eventType == "start" || eventType == "user_action")) {
                  _context18.n = 4;
                  break;
                }
                logger.debug("Media entity ".concat(mediaEntity, " state unchanged, but eventType = ").concat(eventType));
                _context18.n = 6;
                break;
              case 4:
                if (!config.media_entity_load_unchanged) {
                  _context18.n = 5;
                  break;
                }
                logger.debug("Media entity ".concat(mediaEntity, " state unchanged, but media_entity_load_unchanged = true"));
                _context18.n = 6;
                break;
              case 5:
                this.lastMediaUpdate = Date.now();
                this.restartProgressBarAnimation();
                return _context18.a(2);
              case 6:
                mediaEntityState = _entity.state;
              case 7:
                this.lastMediaUpdate = Date.now();
                activeElement = this.getActiveMediaElement();
                if (!(sourceType === "iframe" && !config.iframe_load_unchanged && this.getNextMediaURL(false) == activeElement.mediaUrl)) {
                  _context18.n = 8;
                  break;
                }
                return _context18.a(2);
              case 8:
                crossfadeMillis = eventType == "user_action" ? 250 : Math.round(config.crossfade_time * 1000);
                if (eventType == "start") {
                  crossfadeMillis = 0;
                }
                updateElement = this.getInactiveMediaElement();
                _context18.n = 9;
                return this.updateMedia(updateElement);
              case 9:
                element = _context18.v;
                if (element) {
                  _context18.n = 10;
                  break;
                }
                return _context18.a(2);
              case 10:
                this._switchActiveMedia(element, crossfadeMillis);
              case 11:
                return _context18.a(2);
            }
          }, _callee18, this);
        }));
        function switchActiveMedia(_x16) {
          return _switchActiveMedia2.apply(this, arguments);
        }
        return switchActiveMedia;
      }()
    }, {
      key: "_switchActiveMedia",
      value: function _switchActiveMedia(newElement) {
        var crossfadeMillis = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        this.lastMediaUpdate = Date.now();
        this.imageOneContainer.style.transition = "opacity ".concat(crossfadeMillis, "ms ease-in-out");
        this.imageTwoContainer.style.transition = "opacity ".concat(crossfadeMillis, "ms ease-in-out");
        var curActiveContainer = this.imageOneContainer;
        var newActiveContainer = this.imageTwoContainer;
        var curMedia = this.imageOne;
        var newMedia = this.imageTwo;
        if (newElement == this.imageOne) {
          curActiveContainer = this.imageTwoContainer;
          newActiveContainer = this.imageOneContainer;
          curMedia = this.imageTwo;
          newMedia = this.imageOne;
        }
        logger.debug("Switching active media to '".concat(newActiveContainer.id, "'"));
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
    }, {
      key: "showMessage",
      value: function showMessage(type, title, text) {
        var timeout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 5000;
        // type: info / success / warning / error
        if (!this.messageContainer) {
          return;
        }
        var message = document.createElement("div");
        message.className = "wallpanel-message ".concat(type);
        var titleDiv = document.createElement("div");
        titleDiv.className = "wallpanel-message-title";
        titleDiv.innerHTML = title;
        message.appendChild(titleDiv);
        var textDiv = document.createElement("div");
        textDiv.className = "wallpanel-message-text";
        textDiv.innerHTML = text;
        message.appendChild(textDiv);
        this.messageContainer.appendChild(message);
        requestAnimationFrame(function () {
          return message.classList.add("show");
        });
        var wp = this;
        setTimeout(function () {
          return wp.hideMessage(message);
        }, timeout);
      }
    }, {
      key: "hideMessage",
      value: function hideMessage(message) {
        message.classList.remove("show");
        message.addEventListener("transitionend", function () {
          return message.remove();
        });
      }
    }, {
      key: "hideAllMessages",
      value: function hideAllMessages() {
        var messages = this.messageContainer.querySelectorAll(".wallpanel-message");
        if (!messages.length) {
          return false;
        }
        var wp = this;
        messages.forEach(function (message) {
          return wp.hideMessage(message);
        });
        return true;
      }
    }, {
      key: "setupScreensaver",
      value: function setupScreensaver() {
        logger.debug("Setup screensaver");
        if (config.keep_screen_on_time > 0 && !this.screenWakeLock.enabled) {
          this.screenWakeLock.enable();
        }
        if (config.fullscreen && !fullscreen) {
          enterFullscreen();
        }
      }
    }, {
      key: "startScreensaver",
      value: function () {
        var _startScreensaver = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee19() {
          var activeElement, _wp;
          return _regenerator().w(function (_context19) {
            while (1) switch (_context19.n) {
              case 0:
                logger.debug("Start screensaver");
                this.screensaverStartedAt = Date.now();
                this.screensaverStoppedAt = null;
                this.currentWidth = this.screensaverContainer.clientWidth;
                this.currentHeight = this.screensaverContainer.clientHeight;
                this.setDefaultStyle();
                updateConfig();
                if (isActive()) {
                  _context19.n = 1;
                  break;
                }
                logger.debug("Wallpanel not active, not starting screensaver");
                this.screensaverStartedAt = null;
                this.screensaverStoppedAt = Date.now();
                return _context19.a(2);
              case 1:
                activeElement = this.getActiveMediaElement();
                if (activeElement == this.imageOne) {
                  this.imageOneContainer.style.opacity = 1;
                  this.imageTwoContainer.style.opacity = 0;
                } else {
                  this.imageOneContainer.style.opacity = 0;
                  this.imageTwoContainer.style.opacity = 1;
                }
                _context19.n = 2;
                return this.switchActiveMedia("start");
              case 2:
                this.setupScreensaver();
                if (config.keep_screen_on_time > 0) {
                  _wp = this;
                  setTimeout(function () {
                    if (_wp.screensaverRunning() && !_wp.screenWakeLock.enabled) {
                      logger.error("Keep screen on will not work because the user didn't interact with the document first. https://goo.gl/xX8pDD");
                      _wp.showMessage("info", "Keep screen on", "Please tap the screen for a moment to keep it awake and prevent it from turning off.", 15000);
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
                  this.screensaverStopNavigationPathTimeout = setTimeout(function () {
                    if (config.screensaver_start_navigation_path) {
                      skipDisableScreensaverOnLocationChanged = true;
                      navigate(config.screensaver_start_navigation_path);
                      setTimeout(function () {
                        skipDisableScreensaverOnLocationChanged = false;
                      }, 5000);
                    }
                    if (config.screensaver_stop_close_browser_mod_popup) {
                      var bmp = getActiveBrowserModPopup();
                      if (bmp) {
                        bmp.closeDialog();
                      }
                    }
                  }, (config.fade_in_time + 1) * 1000);
                }
              case 3:
                return _context19.a(2);
            }
          }, _callee19, this);
        }));
        function startScreensaver() {
          return _startScreensaver.apply(this, arguments);
        }
        return startScreensaver;
      }()
    }, {
      key: "screensaverRunning",
      value: function screensaverRunning() {
        return Boolean(this.screensaverStartedAt) && this.screensaverStartedAt > 0;
      }
    }, {
      key: "stopScreensaver",
      value: function stopScreensaver() {
        var fadeOutTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.0;
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
          this.style.transition = "opacity ".concat(Math.round(fadeOutTime * 1000), "ms ease-in-out");
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
    }, {
      key: "updateScreensaver",
      value: function updateScreensaver() {
        var currentDate = new Date();
        var now = currentDate.getTime();
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
        if (config.info_move_interval > 0 && now - this.lastMove >= config.info_move_interval * 1000) {
          if (config.info_move_pattern === "random") {
            this.randomMove();
          } else if (config.info_move_pattern === "corners") {
            this.moveAroundCorners();
          } else {
            logger.error("Unknown info move type ".concat(config.info_move_pattern));
          }
        }
        if (config.black_screen_after_time > 0 && now - this.screensaverStartedAt >= config.black_screen_after_time * 1000) {
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
          var html = "";
          var conf = {};
          for (var key in config) {
            if (["profiles"].includes(key)) {
              conf[key] = "...";
            } else {
              conf[key] = config[key];
            }
          }
          html += '<a id="download_log" href="">Download log</a><br />';
          html += "<b>Version:</b> ".concat(version, "<br/>");
          html += "<b>User-Agent:</b> ".concat(navigator.userAgent, "<br/>");
          html += "<b>Config:</b> ".concat(JSON.stringify(conf), "<br/>");
          html += "<b>Fullscreen:</b> ".concat(fullscreen, "<br/>");
          html += "<b>Screensaver started at:</b> ".concat(wallpanel.screensaverStartedAt, "<br/>");
          html += "<b>Screen wake lock:</b> enabled=".concat(this.screenWakeLock.enabled, " native=").concat(this.screenWakeLock.nativeWakeLockSupported, " lock=").concat(this.screenWakeLock._lock, " player=").concat(this.screenWakeLock._player, " error=").concat(this.screenWakeLock.error, "<br/>");
          if (this.screenWakeLock._player) {
            var p = this.screenWakeLock._player;
            html += "<b>Screen wake lock video</b>: readyState=".concat(p.readyState, " currentTime=").concat(p.currentTime, " paused=").concat(p.paused, " ended=").concat(p.ended, "<br/>");
          }
          html += "<b>Media list size:</b> ".concat(this.mediaList.length, "<br/>");
          var activeElement = this.getActiveMediaElement();
          if (activeElement) {
            html += "<b>Current media:</b> ".concat(activeElement.mediaUrl, "<br/>");
            var _mediaInfo = mediaInfoCache.get(activeElement.infoCacheUrl);
            if (_mediaInfo) {
              html += "<b>Media info:</b> ".concat(JSON.stringify(_mediaInfo), "<br/>");
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
          logger.info("Disable wake lock after ".concat(config.keep_screen_on_time, " seconds"));
          this.screenWakeLock.disable();
        }
      }
    }, {
      key: "switchMediaDirection",
      value: function switchMediaDirection(direction) {
        this.mediaListDirection = direction;
        this.switchActiveMedia("user_action");
      }
    }, {
      key: "motionDetected",
      value: function motionDetected() {
        this.stopScreensaver(config.fade_out_time_motion_detected);
      }
    }, {
      key: "handleInteractionEvent",
      value: function handleInteractionEvent(evt) {
        var isClick = ["click", "touchend"].includes(evt.type);
        var now = Date.now();
        this.idleSince = now;
        var swipe = "";
        if (evt.type == "touchstart") {
          if (evt.touches && evt.touches[0]) {
            this.touchStartX = evt.touches[0].clientX;
          }
          return;
        } else if (evt.type == "touchend" && this.touchStartX >= 0 && evt.changedTouches && evt.changedTouches[0]) {
          var diffX = evt.changedTouches[0].clientX - this.touchStartX;
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
        var x = evt.clientX;
        var y = evt.clientY;
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
        var bmp = getActiveBrowserModPopup();
        if (bmp) {
          var bm_elements = [bmp.shadowRoot.querySelector(".content"), bmp.shadowRoot.querySelector("ha-dialog-header")];
          for (var i = 0; i < bm_elements.length; i++) {
            if (bm_elements[i]) {
              var pos = bm_elements[i].getBoundingClientRect();
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
          var elements = [];
          elements = elements.concat(this.__cards);
          elements = elements.concat(this.__badges);
          elements = elements.concat(this.__views);
          elements.push(this.shadowRoot.getElementById("wallpanel-screensaver-info-box-content"));
          elements.push(this.shadowRoot.getElementById("wallpanel-screensaver-fixed-info-box-content"));
          if (config.image_info_template == "analyze") {
            elements.push(this.imageOneInfo);
            elements.push(this.imageTwoInfo);
          }
          for (var _i3 = 0; _i3 < elements.length; _i3++) {
            var _pos = elements[_i3].getBoundingClientRect();
            logger.debug("Event position:", elements[_i3], x, y, _pos.left, _pos.right, _pos.top, _pos.bottom);
            if (x >= _pos.left && x <= _pos.right && y >= _pos.top && y <= _pos.bottom) {
              logger.debug("Event on:", elements[_i3]);
              return;
            }
          }
        }
        if (isClick) {
          evt.preventDefault();
        }
        evt.stopImmediatePropagation();
        var switchMedia = "";
        if (swipe) {
          switchMedia = swipe == "left" ? "backwards" : "forwards";
        } else if (evt instanceof MouseEvent || evt instanceof TouchEvent) {
          var right = 0.0;
          var bottom = 0.0;
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
          } else if (config.touch_zone_size_previous_image > 0 && right >= (100 - config.touch_zone_size_previous_image) / 100) {
            if (isClick) {
              switchMedia = "backwards";
            } else {
              return;
            }
          } else if (right >= 0.4 && right <= 0.6 && bottom <= 0.1) {
            var _now = new Date();
            if (isClick && _now - this.lastClickTime < 500) {
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
            this.lastClickTime = _now;
            return;
          }
        }
        if (switchMedia) {
          if (this.updatingMedia) {
            logger.debug("Already switching media");
          } else {
            logger.debug("Switching media, direction ".concat(switchMedia));
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
    }]);
  }(HuiView);
  if (!customElements.get("wallpanel-view")) {
    customElements.define("wallpanel-view", WallpanelView);
  }
  wallpanel = document.createElement("wallpanel-view");
  elHaMain.shadowRoot.appendChild(wallpanel);
}
function activateWallpanel() {
  logger.debug("activateWallpanel");
  var hideToolbar = config.hide_toolbar;
  var hideActionItems = config.hide_toolbar_action_icons;
  if (hideToolbar && !config.hide_toolbar_on_subviews && activeTab) {
    var pl = getHaPanelLovelace();
    if (pl && pl.lovelace && pl.lovelace.rawConfig && pl.lovelace.rawConfig.views) {
      for (var i = 0; i < pl.lovelace.rawConfig.views.length; i++) {
        if (pl.lovelace.rawConfig.views[i].path == activeTab) {
          if (pl.lovelace.rawConfig.views[i].subview) {
            logger.debug("Current tab '".concat(activeTab, "' is a subview, not hiding toolbar"));
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
  logger.debug("Location changed from '".concat(currentLocation, "' to '").concat(window.location.href, "'"));
  if (window.location.href == currentLocation) {
    return;
  }
  currentLocation = window.location.href;
  if (wallpanel && wallpanel.screensaverRunning && wallpanel.screensaverRunning() && config.stop_screensaver_on_location_change) {
    if (skipDisableScreensaverOnLocationChanged) {
      skipDisableScreensaverOnLocationChanged = false;
      if (wallpanel.screensaverStopNavigationPathTimeout) {
        clearTimeout(wallpanel.screensaverStopNavigationPathTimeout);
      }
    } else {
      wallpanel.stopScreensaver();
    }
  }
  var panel = null;
  var tab = null;
  var path = window.location.pathname.split("/");
  if (path.length > 1) {
    panel = path[1];
    if (path.length > 2) {
      tab = path[2];
    }
  }
  var panelChanged = activePanel && panel != activePanel;
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
function waitForEnv(callback) {
  var startTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var now = Date.now();
  if (startTime === null) {
    startTime = now;
  }
  var startupSeconds = (now - startTime) / 1000;
  elHass = document.querySelector("body > home-assistant");
  if (elHass && elHass.shadowRoot) {
    elHaMain = elHass.shadowRoot.querySelector("home-assistant-main");
  }
  if (!elHass || !elHass.shadowRoot || !elHaMain) {
    if (startupSeconds >= 5.0) {
      logger.error("Wallpanel startup failed after ".concat(startupSeconds, " seconds, element home-assistant / home-assistant-main not found."));
      return;
    }
    setTimeout(waitForEnv, 100, callback, startTime);
    return;
  }
  var pl = getHaPanelLovelace();
  if (!pl || !pl.lovelace || !pl.lovelace.config || !pl.lovelace.config) {
    if (startupSeconds >= 5.0) {
      logger.error("Wallpanel startup failed after ".concat(startupSeconds, " seconds, lovelace config not found."));
      return;
    }
    setTimeout(waitForEnv, 100, callback, startTime);
    return;
  }
  if (!customElements.get("hui-view")) {
    if (startupSeconds >= 5.0) {
      logger.error("Wallpanel startup failed after ".concat(startupSeconds, " seconds, hui-view not found."));
      return;
    }
    setTimeout(waitForEnv, 100, callback, startTime);
    return;
  }
  if (!window.browser_mod) {
    var waitTime = getDashboardWallpanelConfig(["wait_for_browser_mod_time"])["wait_for_browser_mod_time"];
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
  logger.debug("userId: ".concat(userId, ", userName: ").concat(userName, ", userDisplayname: ").concat(userDisplayname));
  updateConfig();
  initWallpanel();
  window.addEventListener("location-changed", function (event) {
    var url = null;
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
    window.navigation.addEventListener("navigate", function (event) {
      var url = null;
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
    var dashboard = event.data.url_path ? event.data.url_path : "lovelace";
    if (dashboard == activePanel) {
      (elHass.hass || elHass.__hass).connection.sendMessagePromise({
        type: "lovelace/config",
        url_path: event.data.url_path
      }).then(function (data) {
        dashboardConfig = {};
        if (data.wallpanel) {
          for (var key in data.wallpanel) {
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
console.info("%c\uD83D\uDDBC\uFE0F Wallpanel version ".concat(version), "color: #34b6f9; font-weight: bold;");
waitForEnv(startup);

/**
 * https://github.com/exif-js/exif-js
 *
 * Copyright (c) 2008 Jacob Seidelin
 * Released under the MIT License
 */

var debug = false;
var _EXIF = function EXIF(obj) {
  if (obj instanceof _EXIF) return obj;
  if (!(this instanceof _EXIF)) return new _EXIF(obj);
  this.EXIFwrapped = obj;
};
var ExifTags = _EXIF.Tags = {
  // version tags
  0x9000: "ExifVersion",
  // EXIF version
  0xa000: "FlashpixVersion",
  // Flashpix format version

  // colorspace tags
  0xa001: "ColorSpace",
  // Color space information tag

  // image configuration
  0xa002: "PixelXDimension",
  // Valid width of meaningful image
  0xa003: "PixelYDimension",
  // Valid height of meaningful image
  0x9101: "ComponentsConfiguration",
  // Information about channels
  0x9102: "CompressedBitsPerPixel",
  // Compressed bits per pixel

  // user information
  0x927c: "MakerNote",
  // Any desired information written by the manufacturer
  0x9286: "UserComment",
  // Comments by user

  // related file
  0xa004: "RelatedSoundFile",
  // Name of related sound file

  // date and time
  0x9003: "DateTimeOriginal",
  // Date and time when the original image was generated
  0x9004: "DateTimeDigitized",
  // Date and time when the image was stored digitally
  0x9290: "SubsecTime",
  // Fractions of seconds for DateTime
  0x9291: "SubsecTimeOriginal",
  // Fractions of seconds for DateTimeOriginal
  0x9292: "SubsecTimeDigitized",
  // Fractions of seconds for DateTimeDigitized

  // picture-taking conditions
  0x829a: "ExposureTime",
  // Exposure time (in seconds)
  0x829d: "FNumber",
  // F number
  0x8822: "ExposureProgram",
  // Exposure program
  0x8824: "SpectralSensitivity",
  // Spectral sensitivity
  0x8827: "ISOSpeedRatings",
  // ISO speed rating
  0x8828: "OECF",
  // Optoelectric conversion factor
  0x9201: "ShutterSpeedValue",
  // Shutter speed
  0x9202: "ApertureValue",
  // Lens aperture
  0x9203: "BrightnessValue",
  // Value of brightness
  0x9204: "ExposureBias",
  // Exposure bias
  0x9205: "MaxApertureValue",
  // Smallest F number of lens
  0x9206: "SubjectDistance",
  // Distance to subject in meters
  0x9207: "MeteringMode",
  // Metering mode
  0x9208: "LightSource",
  // Kind of light source
  0x9209: "Flash",
  // Flash status
  0x9214: "SubjectArea",
  // Location and area of main subject
  0x920a: "FocalLength",
  // Focal length of the lens in mm
  0xa20b: "FlashEnergy",
  // Strobe energy in BCPS
  0xa20c: "SpatialFrequencyResponse",
  //
  0xa20e: "FocalPlaneXResolution",
  // Number of pixels in width direction per FocalPlaneResolutionUnit
  0xa20f: "FocalPlaneYResolution",
  // Number of pixels in height direction per FocalPlaneResolutionUnit
  0xa210: "FocalPlaneResolutionUnit",
  // Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
  0xa214: "SubjectLocation",
  // Location of subject in image
  0xa215: "ExposureIndex",
  // Exposure index selected on camera
  0xa217: "SensingMethod",
  // Image sensor type
  0xa300: "FileSource",
  // Image source (3 == DSC)
  0xa301: "SceneType",
  // Scene type (1 == directly photographed)
  0xa302: "CFAPattern",
  // Color filter array geometric pattern
  0xa401: "CustomRendered",
  // Special processing
  0xa402: "ExposureMode",
  // Exposure mode
  0xa403: "WhiteBalance",
  // 1 = auto white balance, 2 = manual
  0xa404: "DigitalZoomRation",
  // Digital zoom ratio
  0xa405: "FocalLengthIn35mmFilm",
  // Equivalent foacl length assuming 35mm film camera (in mm)
  0xa406: "SceneCaptureType",
  // Type of scene
  0xa407: "GainControl",
  // Degree of overall image gain adjustment
  0xa408: "Contrast",
  // Direction of contrast processing applied by camera
  0xa409: "Saturation",
  // Direction of saturation processing applied by camera
  0xa40a: "Sharpness",
  // Direction of sharpness processing applied by camera
  0xa40b: "DeviceSettingDescription",
  //
  0xa40c: "SubjectDistanceRange",
  // Distance to subject

  // other tags
  0xa005: "InteroperabilityIFDPointer",
  0xa420: "ImageUniqueID" // Identifier assigned uniquely to each image
};
var TiffTags = _EXIF.TiffTags = {
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
};
var GPSTags = _EXIF.GPSTags = {
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
};

// EXIF 2.3 Spec
var IFD1Tags = _EXIF.IFD1Tags = {
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
  0x0201: "JpegIFOffset",
  // When image format is JPEG, this value show offset to JPEG data stored.(aka "ThumbnailOffset" or "JPEGInterchangeFormat")
  0x0202: "JpegIFByteCount",
  // When image format is JPEG, this value shows data size of JPEG image (aka "ThumbnailLength" or "JPEGInterchangeFormatLength")
  0x0211: "YCbCrCoefficients",
  0x0212: "YCbCrSubSampling",
  0x0213: "YCbCrPositioning",
  0x0214: "ReferenceBlackWhite"
};
var StringValues = _EXIF.StringValues = {
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
};
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
    if (_EXIF.isXmpEnabled) {
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
  var isFieldSegmentStart = function isFieldSegmentStart(dataView, offset) {
    return dataView.getUint8(offset) === 0x38 && dataView.getUint8(offset + 1) === 0x42 && dataView.getUint8(offset + 2) === 0x49 && dataView.getUint8(offset + 3) === 0x4d && dataView.getUint8(offset + 4) === 0x04 && dataView.getUint8(offset + 5) === 0x04;
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
    case 7:
      // undefined, 8-bit byte, value depending on field
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
    case 2:
      // ascii, 8-bit byte
      offset = numValues > 4 ? valueOffset : entryOffset + 8;
      return getStringFromDB(file, offset, numValues - 1);
    case 3:
      // short, 16 bit int
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
    case 4:
      // long, 32 bit int
      if (numValues == 1) {
        return file.getUint32(entryOffset + 8, !bigEnd);
      } else {
        vals = [];
        for (n = 0; n < numValues; n++) {
          vals[n] = file.getUint32(valueOffset + 4 * n, !bigEnd);
        }
        return vals;
      }
    case 5:
      // rational = two long values, first is numerator, second is denominator
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
    case 9:
      // slong, 32 bit signed int
      if (numValues == 1) {
        return file.getInt32(entryOffset + 8, !bigEnd);
      } else {
        vals = [];
        for (n = 0; n < numValues; n++) {
          vals[n] = file.getInt32(valueOffset + 4 * n, !bigEnd);
        }
        return vals;
      }
    case 10:
      // signed rational, two slongs, first is numerator, second is denominator
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
        out += String.fromCharCode((c & 0x1f) << 6 | char2 & 0x3f);
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode((c & 0x0f) << 12 | (char2 & 0x3f) << 6 | (char3 & 0x3f) << 0);
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
          exifData[tag] = StringValues.Components[exifData[tag][0]] + StringValues.Components[exifData[tag][1]] + StringValues.Components[exifData[tag][2]] + StringValues.Components[exifData[tag][3]];
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
      xmpString = xmpString.slice(0, indexOfXmp) + 'xmlns:Iptc4xmpCore="http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/" ' + 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' + 'xmlns:tiff="http://ns.adobe.com/tiff/1.0/" ' + 'xmlns:plus="http://schemas.android.com/apk/lib/com.google.android.gms.plus" ' + 'xmlns:ext="http://www.gettyimages.com/xsltExtension/1.0" ' + 'xmlns:exif="http://ns.adobe.com/exif/1.0/" ' + 'xmlns:stEvt="http://ns.adobe.com/xap/1.0/sType/ResourceEvent#" ' + 'xmlns:stRef="http://ns.adobe.com/xap/1.0/sType/ResourceRef#" ' + 'xmlns:crs="http://ns.adobe.com/camera-raw-settings/1.0/" ' + 'xmlns:xapGImg="http://ns.adobe.com/xap/1.0/g/img/" ' + 'xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/" ' + xmpString.slice(indexOfXmp);
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
_EXIF.enableXmp = function () {
  _EXIF.isXmpEnabled = true;
};
_EXIF.disableXmp = function () {
  _EXIF.isXmpEnabled = false;
};
_EXIF.getData = function (img, callback) {
  if ((self.Image && img instanceof self.Image || self.HTMLImageElement && img instanceof self.HTMLImageElement) && !img.complete) return false;
  if (!imageHasData(img)) {
    getImageData(img, callback);
  } else {
    if (callback) {
      callback.call(img);
    }
  }
  return true;
};
_EXIF.getTag = function (img, tag) {
  if (!imageHasData(img)) return;
  return img.exifdata[tag];
};
_EXIF.getIptcTag = function (img, tag) {
  if (!imageHasData(img)) return;
  return img.iptcdata[tag];
};
_EXIF.getAllTags = function (img) {
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
_EXIF.getAllIptcTags = function (img) {
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
_EXIF.ConvertDMSToDD = function (degrees, minutes, seconds, direction) {
  var dd = degrees + minutes / 60 + seconds / (60 * 60);
  if (direction == "S" || direction == "W") {
    dd = dd * -1;
  } // Don't do anything for N or E
  return dd;
};
//*******************************************************************************

_EXIF.pretty = function (img) {
  if (!imageHasData(img)) return "";
  var a,
    data = img.exifdata,
    strPretty = "";
  for (a in data) {
    if (Object.prototype.hasOwnProperty.call(data, a)) {
      if (_typeof(data[a]) == "object") {
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
_EXIF.readFromBinaryFile = function (file) {
  return findEXIFinJPEG(file);
};
