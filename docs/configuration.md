# Configuration
You can set the following configuration parameters for every individual Home Assistant Dashboard:

| Config                           | Description                                                                                            | Default   |
| ---------------------------------| ------------------------------------------------------------------------------------------------------ | --------- |
| enabled                          | Enable WallPanel? <br>*You will need to set this to **true** to activate the wall panel for the dashboard.* | false   |
| enabled_on_views                 | Enable WallPanel on the named views (path) only. See [Enable WallPanel on specific Views](configuration.md#enable-wallpanel-on-specific-views) for details. | []   |
| debug                            | Enable debug mode?                                                                                     | false     |
| wait_for_browser_mod_time        | How long to wait for browser_mod to be available (in seconds)? This config attribute can only be set in the main configuration and not in profiles, user-specific or device-specific. | 0.25      |
| log_level_console                | Log level to use for logging to the browser console (error / warn / info / debug).                     | info      |
| alert_errors                     | Display error messages in an alert box.                                                                | false     |
| hide_toolbar                     | Hide the upper panel toolbar? Please see [FAQ](faq.md#dashboard-cannot-be-edited) how to edit your dashboard when toolbar is hidden. | false     |
| hide_toolbar_on_subviews         | Hide the toolbar in subviews too?                                                                      | false     |
| keep_toolbar_space               | If the toolbar is hidden, should the space where the toolbar is normally located remain empty?         | false     |
| hide_toolbar_action_icons        | Hide action items in the toolbar?                                                                      | false     |
| hide_sidebar                     | Hide the navigation sidebar?                                                                           | false     |
| fullscreen                       | Set browser window to fullscreen? <br>*Due to browser restrictions you will need to interact with the screen once to activate fullscreen mode after loading the dashboard page.* | false   |
| z_index                          | Wallpanels base CSS z-index.                          | 1000        |
| idle_time                        | Time in seconds after which the screensaver will start (0 = screensaver disabled).                     | 15        |
| fade_in_time                     | Screensaver fade-in time in seconds.                                                                   | 3.0       |
| fade_out_time_motion_detected    | Screensaver fade-out time in seconds when the screensaver is stopped because motion is detected.       | 1.0       |
| fade_out_time_screensaver_entity | Screensaver fade-out time in seconds when the screensaver is turned off by the screensaver entity.      | 3.0       |
| fade_out_time_browser_mod_popup  | Screensaver fade-out time in seconds when the screensaver is stopped because of an browser mod popup.  | 1.0       |
| fade_out_time_interaction        | Screensaver fade-out time in seconds when the screensaver is stopped because of user input.            | 0.3       |
| crossfade_time                   | Crossfade duration in seconds for screensaver images.                                                  | 3.0       |
| display_time                     | Duration in seconds after which the next screensaver image will be shown.                              | 15.0      |
| keep_screen_on_time              | Time in seconds for how long to prevent screen to dimm or lock (0 = disabled).                         | 0         |
| black_screen_after_time          | Time in seconds after which the screensaver will show just a black screen (0 = disabled).              | 0         |
| control_reactivation_time        | Time in seconds for which interaction with the dashboard is disabled after the screensaver is stopped. | 1.0       |
| stop_screensaver_on_mouse_move   | Stop screensaver on mouse movement?                                                                    | true      |
| stop_screensaver_on_mouse_click  | Stop screensaver on mouse click / display touch?                                                       | true      |
| stop_screensaver_on_location_change | Stop screensaver on navigation (location-changed events)?                                           | true      |
| stop_screensaver_on_key_down     | Stop screensaver on key press?                                                                         | true      |
| disable_screensaver_on_browser_mod_popup     | Disable screensaver if a browser mod popup is active?                                      | false     |
| disable_screensaver_on_browser_mod_popup_func| Javascript function to determine whether to disable screensaver based on active browser mod popup (see [Browser Mod Popups](browser-mod.md#browser-mod-popups)) |    |
| disable_screensaver_when_assist_active | Disable screensaver if assist dialog is active?                                                  | true      |
| screensaver_start_navigation_path | Path to navigate to (e.g., /lovelace/default_view) when screensaver is started. Use a complete path to avoid redirects which will stop the screensaver. |           |
| screensaver_stop_close_browser_mod_popup | Close the active browser mod popup when screensaver is stopped?                                | false     |
| screensaver_entity               | An entity of type 'input_boolean' to reflect and change the screensaver state (on = started, off = stopped). If browser_mod is installed, `${browser_id}` will be replaced with Browser ID (see [Browser Mod](browser-mod.md#placeholder-browser_id)). |        |
| show_images                      | Show images if screensaver is active?                                                                  | true      |
| image_url                        | Fetch screensaver images from this URL. See [Media Sources](media-sources.md) for details.                                         | See [Media Sources](media-sources.md) |
| image_url_entity                 | An entity of type 'input_text' in which the URL of the current screen saver image is stored. If browser_mod is installed, `${browser_id}` will be replaced with Browser ID (see [Browser Mod](browser-mod.md#placeholder-browser_id)). |        |
| media_entity_load_unchanged      | Should a new image be loaded from the entity after the display time has expired, even if the entity state has not changed? | true      |
| immich_api_key                   | API key that is used for authentication at the [immich API](media-sources.md#immich-api)               |           |
| immich_shared_albums             | Show images of shared immich albums?                                                                   | true      |
| immich_album_names               | Only show images from these immich albums.                                                             | []        |
| immich_tag_names                 | Only show images with this tags.                                                                       | []        |
| immich_persons                   | Only show images with this persons.                                                                    | []        |
| immich_memories                  | Only show today memories.                                                                              | false     |
| immich_resolution                | The resolution to use for loading images from immich (possible values are: preview / original).        | preview   |
| exclude_filenames                | List of regular expressions for excluding files and directories from media sources. See [Media Sources](media-sources.md#exclude-files) for details. | []        |
| exclude_media_types              | List of media types to exlcude media sources. See [Media Sources](media-sources.md#exclude-files) for details. | []        |
| exclude_media_orientation        | Media orientation to exlcude. See [Media Sources](media-sources.md#exclude-files) for details.         |            |
| image_fit_landscape              | How to adjust a media item in landscape mode to fit the available space (cover or contain).            | cover      |
| image_fit_portrait               | How to adjust a media item in portrait mode to fit the available space (cover or contain).             | contain    |
| image_background                 | When set to image, a snapshot from the current media item is used as the background, covering the entire screen. To customize its appearance, apply styles using the `wallpanel-screensaver-image-background` class. | color |
| image_list_update_interval       | When using a local media source, the image list is updated at this interval.                           | 3600       |
| image_order                      | The order in which the images are displayed (possible values are: sorted / random).                    | sorted     |
| image_animation_ken_burns        | Apply a Ken Burns effect (panning and zooming) to the images?                                          | false      |
| image_animation_ken_burns_zoom   | Zoom level for the Ken Burns effect.                                                                   | 1.3        |
| image_animation_ken_burns_delay  | Start Ken Burns effect with a delay (in seconds).                                                      | 0          |
| image_animation_ken_burns_duration | Specifies the duration of the Ken Burns effect in seconds. If set to 0, the `display_time` value is used instead. | 0          |
| video_loop                       | Loop video until `display_time` is reached? Otherwise, immediately switch to the next media at the end of the video playback.  | false     |
| video_volume                     | Volume of videos being played (0=0%, 1=100%).                                                          | 0.001      |
| show_image_info                  | Show image info (EXIF / API) on top of image? Only available for local jpeg images containing EXIF data and images from the new Unsplash API. The config name was `show_exif_info` before version 4.7. | false      |
| show_progress_bar                | Show animated progress bar towards next image being displayed?                                         | false      |
| fetch_address_data               | Fetch address data for EXIF GPS coordinates from nominatim.openstreetmap.org?                          | false      |
| image_info_template              | Format of image info display (HTML). ${EXIF-tag-name} will be replaced with the corresponding EXIF tag value. The config name was `exif_info_template` before version 4.7. | ${DateTimeOriginal} |
| touch_zone_size_next_image       | Size of the area on the right side of the screen at which a click will show the next image (as a percentage of the total screen width, 0 = disabled).   | 15         |
| touch_zone_size_previous_image   | Size of the area on the left side of the screen at which a click will show the previous image (as a percentage of the total screen width, 0 = disabled).   | 15         |
| info_animation_duration_x        | Animation duration in seconds for the movement of the info box in x-direction (0 = no animation).      | 0          |
| info_animation_duration_y        | Animation duration in seconds for the movement of the info box in y-direction (0 = no animation).      | 0          |
| info_animation_timing_function_x | The CSS timing-function to use for the animation of the info box movement in x-direction.              | ease       |
| info_animation_timing_function_y | The CSS timing-function to use for the animation of the info box movement in y-direction.              | ease       |
| info_move_pattern                | Movement pattern of the info box at a specified interval (possible values are: random / corners).      | random     |
| info_move_interval               | Interval of movement of the info box in seconds (0 = no movement).                                     | 0          |
| info_move_fade_duration          | Duration of the fade-in and fade-out animation of the info box in case of movement (0 = no animation). | 2.0        |
| style                            | Additional CSS styles for WallPanel elements.                                                          | {}         |
| badges                           | Badges to display in info box. Set to [] to show no badges at all. See [Badges](info-box.md#badges) for details.  | []         |
| cards                            | Cards to display in info box. Set to [] to show no cards at all. See [Cards](info-box.md#cards) for details.      | See [Cards](info-box.md#cards)  |
| views                            | Dashboard views to display in info box. Set to [] to show no views at all. See [Views](info-box.md#views) for details. | []         |
| card_interaction                 | Allow interaction with the elements displayed in the info box?                                         | false      |
| profiles                         | See [Configuration profiles](#profiles) for details.                                                   | {}         |
| profile                          | Configuration profile to activate. If browser_mod is installed, `${browser_id}` will be replaced with Browser ID (see [Browser Mod](browser-mod.md#placeholder-browser_id)). |            |
| profile_entity                   | An entity of type 'input_text' used for dynamic activation of profiles. If browser_mod is installed, `${browser_id}` will be replaced with Browser ID (see [Browser Mod](browser-mod.md#placeholder-browser_id)). |            |
| camera_motion_detection_enabled          | Activate camera based motion detection? Screensaver is stopped when movement is detected See [Camera motion detection](camera-motion-detection.md) for details. | false      |
| camera_motion_detection_facing_mode      | Which camera to use (user / environment / left / right).                                       | user       |
| camera_motion_detection_threshold        | If this many percent of the pixels change between two images, this is counted as movement.     | 5          |
| camera_motion_detection_capture_width    | Width of the images captured by the camera in pixels.                                          | 64         |
| camera_motion_detection_capture_height   | Height of the images captured by the camera in pixels.                                         | 48         |
| camera_motion_detection_capture_interval | Interval in seconds at which images are captured by the camera.                                | 0.3        |
| camera_motion_detection_capture_visible  | Should the captured images be displayed on the user interface for debugging?                   | false      |

## Home Assistant Dashboard configuration
You can add the configuration to your Home Assistant Dashboard configuration yaml (raw config).

* Click Overview in your sidebar.
* Click the three dots menu (top-right) and click on Edit Dashboard.
* Click the three dots menu again and click on Raw configuration editor.
* Add the `wallpanel` configuration above anything else.

**Short example**:
```yaml
wallpanel:
  enabled: true
  hide_toolbar: true
  hide_sidebar: true
  fullscreen: true
```

**Extended example**:
```yaml
wallpanel:
  enabled: true
  enabled_on_views:
    - default_view
  debug: false
  hide_toolbar: true
  hide_sidebar: true
  fullscreen: true
  idle_time: 10
  keep_screen_on_time: 86400
  black_screen_after_time: 7200
  control_reactivation_time: 1.0
  screensaver_start_navigation_path: /lovelace/default_view
  image_url: 'http://picsum.photos/${width}/${height}?random=${timestamp}'
  image_fit_landscape: cover
  image_list_update_interval: 3600
  image_order: 'sorted'
  image_excludes: []
  show_image_info: false
  fetch_address_data: true
  image_info_template: '${address.town|address.city!prefix=!suffix= // }${DateTimeOriginal!options=year:numeric,month:long}'
  screensaver_entity: input_boolean.wallpanel_screensaver
  info_animation_duration_x: 30
  info_animation_duration_y: 11
  info_animation_timing_function_x: 'ease-in-out'
  info_animation_timing_function_y: 'ease-in-out'
  info_move_pattern: random
  info_move_interval: 0
  info_move_fade_duration: 2.0
  card_interaction: true
  style:
    wallpanel-screensaver-info-box:
      font-size: 8vh
      font-weight: 600
      color: '#eeeeee'
      text-shadow: '-2px -2px 0 #03a9f4, 2px -2px 0 #03a9f4, -2px 2px 0 #03a9f4, 2px 2px 0 #03a9f4'
```

## URL query parameters
It is also possible to pass configuration parameters in the query string.
These parameters (**wp_<parameter\>**) will override the corresponding properties in the yaml configuration.
Use JSON syntax for the values.

**Example**:
`http://hass:8123/lovelace/default_view?wp_hide_sidebar=false`

!!! info
    Please note that the URL parameters may be lost when navigating in the Home Assistant interface.
    Therefore, this option should not normally be used.

## Dynamic configuration using placeholders
The WallPanel configuration can be changed dynamically by using input_text or input_select helpers.
Placeholders can be used in the yaml configuration, which are replaced by the state value of the corresponding entity.
These placeholders have the form `${entity:<entity-id>}`, where `<entity-id>` must be replaced by the ID of an existing HA entity.
Whenever the state of such an entity changes, the configuration is updated immediately.

For the example, an input_select helper named `wallpanel_image_url` must be created in HA.
The enity ID of the helper will be `input_select.wallpanel_image_url` by default.
A placeholder can now be inserted in the yaml configuration:
```yaml
wallpanel:
  image_url: '${entity:input_select.wallpanel_image_url}'
```
Whenever the state of the entity is changed manually or by automation, the configuration is updated accordingly.

It is also possible to dynamically change only a part of the configuration value:
```yaml
wallpanel:
  image_url: 'https://api.unsplash.com/photos/random?client_id=YOUR_ACCESS_KEY&query=${entity:input_text.wallpanel_unsplash_query}'
```

If Browser Mod is available, you can also use the `${browser_id}` placeholder:
```yaml
wallpanel:
  screensaver_entity: input_boolean.${browser_id}_wallpanel_screensaver
```
See [Browser Mod - Placeholder ${browser_id}](browser-mod.md#placeholder-browser_id) for details.


## Profiles
With profiles you can easily switch between different configurations.
Each profile is defined under the `profiles` attribute, while settings outside of a profile serve as the default configuration.

**Example**

```yaml
wallpanel:
  enabled: true
  idle_time: 60
  style:
    wallpanel-screensaver-overlay:
      background: '#00000000'
  profiles:
    night:
      idle_time: 5
      style:
        wallpanel-screensaver-overlay:
          background: '#000000bb'
    black:
      black_screen_after_time: 1
    user.jane:
      enabled: false
    device.e9a2c86e_5526f1ee:
      idle_time: 25
      screensaver_entity: input_boolean.kitchen_wallpanel_screensaver
```

In this example, there are four additional profiles: `night`, `black`, `user.jane` and `device.e9a2c86e_5526f1ee`.
When a profile is activated, its settings override the default configuration.

### Activating a Profile
There are several ways to activate a profile:

**1. Automatic Activation for User Profiles**

A user profile is automatically applied if it matches the logged-in user.

* The name of a user profile must begin with `user.`, followed by a user ID or display name (usernames are not supported).
* The display name of the logged-in user is converted to lowercase, and spaces are replaced with underscores (`_`). For example, `Jane Doe` would be converted to `jane_doe`.

!!! tip
    The ID of a user can be found when you click on a user entry in Settings => Persons => [Users](https://my.home-assistant.io/redirect/users/)

**2. Automatic Activation for Device Profiles**

A device profile is activated if it matches the Browser Mod Browser ID.

* The profile name must begin with `device.`, followed by the Browser ID configured in Browser Mod.
* Any hyphens (`-`) in the Browser ID are replaced with underscores (`_`).

For more details, refer to [Integration with Browser Mod](browser-mod.md).

**3. Dynamic Activation via an Input Helper**

Profiles can be dynamically switched using an `input_text` or `input_select` helper.

* In the example, an `input_text` helper named `wallpanel_profile` must be created in Home Assistant.
* The profile can then be changed by updating `input_text.wallpanel_profile` manually or through automation (e.g., based on time).
* Setting it to a valid profile name applies that profile immediately. Any value that does not match a defined profile will revert to the default settings.


```yaml
wallpanel:
  profile_entity: input_text.wallpanel_profile
```

**4. Manual Activation via Configuration**

You can specify a profile directly in the wallpanel configuration, although this method is rarely needed.

```yaml
wallpanel:
  profile: night
```

**5. Activation via Query String Parameter**

A profile can be selected using a URL parameter:
`http://hass:8123/lovelace/default_view?wp_profile=night`

## Enable WallPanel on specific Views
To enable WallPanel only on specific views, use the `enabled_on_views` configuration option.

This option accepts a list of view paths where WallPanel should be active. You can find the path in your dashboard’s YAML configuration or directly from the browser URL.

For example, in the URL below, the path of the view is `1`:

```
https://hass:8123/dashboard-test/1
```

If you leave the list empty, WallPanel will be enabled on all views by default.

