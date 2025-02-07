# Screensaver
WallPanel offers a screensaver that presents a media slideshow.
Images, videos and websites are supported as media content.

Tip: If you click on the far right side of the screen while the screen saver is active, the next image will be displayed.
A click on the left side shows the previous picture and reverses the playback order.

## Screensaver entity
You can create an input_boolean helper in HA and set `screensaver_entity` to this entity id.
When the screensaver starts this input_boolean will be set to `on` and to `off` when the screensaver stops.
It is also possible to start and stop the screensaver by changing this input_boolean.

## Tracking the current displayed media in an entity
You can create an input_text helper in HA and set the configuration option `image_url_entity` to this entity id.
Make sure that the maximum length is not too short so that the image URL fits in.
When the screensaver changes the active image, the URL of the new image is stored in this entity.
