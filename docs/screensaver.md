# Screensaver
WallPanel offers a screensaver that presents a media slideshow.
Images, videos and websites are supported as media content.

!!! tip
    If you click on the far right side of the screen while the screen saver is active, the next image will be displayed.
    A click on the left side shows the previous picture and reverses the playback order.

## Screensaver entity
You can create an input_boolean helper in HA and set `screensaver_entity` to this entity id.
When the screensaver starts this input_boolean will be set to `on` and to `off` when the screensaver stops.
It is also possible to start and stop the screensaver by changing this input_boolean.

You can use the screensaver entity in an automation to switch the screensaver on and off.
For example, if you want to turn off the screensaver when a motion sensor detects movement, you can do this:

1. Create an Switch Helper (input_boolean) in HA, name it `kitchen_wallpanel_screensaver` for example.
2. Set the `screensaver_entity` in the wallpanel configuration:
```yaml
wallpanel:
  screensaver_entity: input_boolean.kitchen_wallpanel_screensaver
```
3. Create an automation in HA that turns off the entity `input_boolean.kitchen_wallpanel_screensaver` to disable the screensaver:
```yaml
...
- action: input_boolean.turn_off
  target:
    entity_id: input_boolean.kitchen_wallpanel_screensaver
```

!!! Tip
    If you have several wallpanels, you should use a separate Switch Helper (input_boolean) for each wallpanel.
    You can use [Configuration placeholders](configuration.md#dynamic-configuration-using-placeholders) or [Profiles](configuration.md#profiles) for this.

## Tracking the current displayed media in an entity
You can create an input_text helper in HA and set the configuration option `image_url_entity` to this entity id.
Make sure that the maximum length is not too short so that the image URL fits in.
When the screensaver changes the active image, the URL of the new image is stored in this entity.
