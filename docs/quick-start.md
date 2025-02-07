# Quick Start
After [Installation](installation.md#installation) you can enable wallpanel for a dashboard.
To do this, add a wallpanel configuration to your Home Assistant dashboard configuration yaml (raw config).

* Navigate to the dashboard.
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
  idle_time: 10
```

After saving and closing the dashboard configuration, WallPanel should now be active for this dashboard.
The sidebar should be hidden and the screensaver should start after an idle time of 10 seconds.

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

In the section [Additional Resources](additional-resources.md) you can find some articles and videos about WallPanel.
