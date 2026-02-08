# Camera motion detection
This function detects movement by analyzing changes in the images captured by a camera installed in the device and pauses the screen saver when movement is detected.
An HTTPS connection to the Home Assistant is required to enable access to the camera.

For Fully Kiosk Browser, enable "Enable Webcam Access (PLUS)" in `Web Content Settings`.

## Configuration
* Set `camera_motion_detection_enabled` to `true` to enable motion detection.
* Set `camera_motion_detection_stop_screensaver` to `true` to stop the screensaver when motion is detected.
* With `camera_motion_detection_set_entity`, you can reference an `input_boolean` entity that is updated to mirror the motion detection state (on = motion detected, off = no motion detected).
* Once the duration defined by `camera_motion_detection_motion_stop_delay` has elapsed, the motion detection state is reset to *no motion detected*.
* Use `camera_motion_detection_facing_mode` (`user`, `environment`, `left` or `right`) to configure which camera should be used (default: `user`).
* With `camera_motion_detection_threshold` the percentage of changed pixels required for detection can be defined (default: `5`).
* The resolution of the video recording can be configured via `camera_motion_detection_capture_width` (default: `64`) and `camera_motion_detection_capture_height` (default: `48`). Higher values improve accuracy but increase CPU utilization.
* The time interval between two captured images can be set via `camera_motion_detection_capture_interval` (in seconds, default: `0.3`). Lower values detect movements faster, but consume more CPU.
* For troubleshooting, set `camera_motion_detection_capture_visible` to `true` to display the captured images in the user interface.
