# Integration with Browser Mod
Normally, it is not possible to set different configuration for different devices.
That gap can be closed by integrating WallPanel with [Browser Mod](https://github.com/thomasloven/hass-browser_mod).

Install [Browser Mod](https://github.com/thomasloven/hass-browser_mod) to get started.

Once Browser Mod is correctly installed and configured, thr Browser ID can be used to define per-device settings.
The placeholders `${browser_id}` can be used everywhere in the configuration and will be replaced by the Browser ID.
Minus signs in the browser ID are replaced by underscores.

## Activate WallPanel on individual devices only

Set `enabled` to **false** and add a device-specific profile to enable the wallpanel only on the device in your dashboard configuration:

```yaml
wallpanel:
  enabled: false
  profiles:
    device.<browser-id>:
      enabled: true
```

**Example for Browser-ID e9a2c86e-5526f1ee**:
```yaml
wallpanel:
  enabled: false
  profiles:
    device.e9a2c86e_5526f1ee:
      enabled: true
```

## Device specific profile
A separate profile can be defined for each device:

```yaml
wallpanel:
  enabled: true
  image_order: random
  profiles:
    device.e9a2c86e_5526f1ee:
      image_url: media-source://media_source/local/kitchen
      screensaver_entity: input_boolean.screensaver_kitchen
    device.89ae788b_cd883eb1:
      image_url: media-source://media_source/local/livingroom
      screensaver_entity: input_boolean.screensaver_livingroom
```

!!! info
    It is not required to define profiles for all devices.

## Placeholder ${browser_id}
If only individual configuration attributes are to be device-specific,
this can be achieved by using the placeholder without having to create an entire profile for the device.

For example, a separate screensaver entity for each device:

```yaml
wallpanel:
  enabled: true
  screensaver_entity: input_boolean.screensaver_${browser_id}
```

`${browser_id}` will be replaced with the value of Browser ID (eg. `input_boolean.screensaver_e9a2c86e_5526f1ee`).


Example for a device-specific profile entity using the `${browser_id}` placeholder:

```yaml
wallpanel:
  enabled: true
  profiles:
    dogs:
      image_url: https://source.unsplash.com/random/${width}x${height}?dogs&sig=${timestamp}
    cats:
      image_url: https://source.unsplash.com/random/${width}x${height}?cats&sig=${timestamp}
  profile_entity: input_text.screensaver_profile_${browser_id}
```

## Browser Mod popups

You can use the configuration option `disable_screensaver_on_browser_mod_popup_func` to conditionally disable the screensaver based on the active browser mod popup. Use the variable `bmp` to select the popup element.

As an example, this javascript will only disable the screensaver if the active browser mod popup contains a `webrtc-camera` card:

```yaml
wallpanel:
  disable_screensaver_on_browser_mod_popup_func: |
    let elements = bmp.shadowRoot.querySelector(".container").children;
    return Array.from(elements).some(n => n.nodeName.toLowerCase() === "webrtc-camera");
```

## Browser Mod service
You can stop the screensaver with the javascript code below from a browser mod service.

```javascript
document.querySelector("home-assistant").shadowRoot.querySelector("home-assistant-main").shadowRoot.querySelector("wallpanel-view").stopScreensaver();
```
