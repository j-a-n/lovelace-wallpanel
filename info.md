# WallPanel

[![hacs_badge](https://img.shields.io/badge/HACS-Default-41BDF5.svg?style=for-the-badge)](https://github.com/hacs/integration)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/j-a-n/lovelace-wallpanel?style=for-the-badge)](https://github.com/j-a-n/lovelace-wallpanel/releases)
[![GitHub stars](https://img.shields.io/github/stars/j-a-n/lovelace-wallpanel?color=yellow&style=for-the-badge)](https://github.com/j-a-n/lovelace-wallpanel/stargazers)
![GitHub All Releases](https://img.shields.io/github/downloads/j-a-n/lovelace-wallpanel/total.svg?color=green&style=for-the-badge)

{% if prerelease %}
## **CAUTION: This is a pre-release version!**
{% endif %}

🖼️ **Wall panel mode for your Home Assistant Dashboards.**  
A configurable extension that features:
- Photo and video slideshow screensaver
- Show dashboard views, cards and badges of your choice on top of the images.
- Full-screen mode
- Hide the side and or top bar 
- Screen wake lock
- Motion detection

You can use images and videos from the following sources:
- Home Assistant Media-source
- Immich
- Home Assitant entities with entity_picture attribute
- Full websites as iframe
- Unsplash

![Screenshot of screensaver](./doc/screensaver-screenshot.png)

{% if not installed %}
# Installation

* Search for `WallPanel` in the Home Assistant Community Store
* Click on the repository
* Click the `Download` button
* You can now select a special version if required
* Click on `Download`

{% endif %}

# Quick Start
Add a wallpanel configuration to your Home Assistant Dashboard configuration yaml (raw config).

* Click Overview in your sidebar.
* Click the three dots menu (top-right) and click on Edit Dashboard.
* Click the three dots menu again and click on Raw configuration editor.
* Add the `wallpanel` configuration above anything else.

```yaml
wallpanel:
  enabled: true
  hide_toolbar: false
  hide_sidebar: true
  fullscreen: false
```

You can add a view that is displayed above the screensaver images.
Simply refer to an existing view of the dashboard by its title or path.
```yaml
wallpanel:
  enabled: true
  cards: []
  views:
    - title: Wallpanel
```

Or add individual cards.
You can copy the cards yaml from the raw configuration of any dashboard.

```yaml
wallpanel:
  enabled: true
  views: []
  cards:
    - type: weather-forecast
      entity: weather.open_meteo_home
      forecast_type: daily
```

You can use [Browser Mod](https://github.com/thomasloven/hass-browser_mod) to activate WallPanel on individual devices only. Replace `<browser-id>` with the Browser ID from Browser Mod.

```yaml
wallpanel:
  enabled: false
  profiles:
    device.<browser-id>:
      enabled: true
```

# Links
👉 [**Full documentation**](https://github.com/j-a-n/lovelace-wallpanel/blob/master/README.md)

👉 [**Known problems**](https://github.com/j-a-n/lovelace-wallpanel/issues)
