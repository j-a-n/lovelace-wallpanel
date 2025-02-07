# Other configuration options

## Keep screen on and prevent device from going to sleep
If you set the configuration option `keep_screen_on_time` to a value greater than zero, the screen is prevented from dimming or locking for the specified time in seconds.

If supported by the browser, this is done via the Screen Wake Lock API.
The Screen Wake Lock API is usually only available when provided over HTTPS.

If the screen lock API is not available, a short invisible video is played in a loop instead to keep the screen on.
Due to browser limitations, you must interact with the screen once to enable the screen lock after the Dashboard page loads.

## Debug mode
If debug mode is enabled, an overlay is displayed in which status information is shown.
There is a button to download a log file that contains information to help analyze problems.
The debug mode can be activated and deactivated via the configuration.
You can also turn debug mode on and off by triple-clicking in the lower middle part of the screen while the screen saver is active.
