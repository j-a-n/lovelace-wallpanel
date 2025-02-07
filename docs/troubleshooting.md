# Troubleshooting

If WallPanel does not work as expected, please check the following.

## Known problems and further help
Please check both open and closed [issues](https://github.com/j-a-n/lovelace-wallpanel/issues) for your problem.
If you don’t find a relevant issue, feel free to create a new one.

If you're opening a new issue, please:

- Provide detailed steps to reproduce the issue.
- Specify the versions of Home Assistant and WallPanel you are using.
- Mention the device and browser or app you use to access the Home Assistant UI.
- Include your dashboard WallPanel configuration.

!!! tip
    When sharing YAML code, enclose it within three backticks to maintain proper formatting and readability. For instance:
    ````
    ```
    wallpanel:
        enabled: true
        hide_sidebar: true
    ```
    ````

## Browser Console
If you are using a browser to access the Home Assistant user interface, you can take a look at the browser console.

Open the developer tools by pressing `<F12>` or `<Ctrl>+<Shift>+<I>` (`<Command>+<Option>+<I>` on macOS) and go to the `Console` tab.

You should see a message like `🖼️ Wallpanel version x.y.z` if WallPanel has started successfully.

If not, please check if there are any error messages that give an indication of the problem.

To confgure how much information WallPanel logs to the browser console, you can set the configuration option `log_level_console` to `error`, `warn`, `info` or `debug`.

!!! example
    ```yaml
    wallpanel:
      log_level_console: debug
    ```

## Home Assistant Log
Please check the [Home Assistant Log](https://www.home-assistant.io/integrations/system_log/) for errors regarding WallPanel.


## Debug mode
If debug mode is enabled, an overlay is displayed in which status information is shown.
There is a button to download a log file that contains information to help analyze problems.
The debug mode can be activated and deactivated via the configuration option `debug`.
You can also turn debug mode on and off by triple-clicking in the lower middle part of the screen while the screen saver is active.

!!! example
    ```yaml
    wallpanel:
      debug: true
    ```

## Error dialogs
You can activate error dialogs by setting the configuration option `alert_errors` to `true`.
If this option is activated, WallPanel displays every error message in an alert dialog.


## Android System WebView
If you're using an app like "Home Assistant Companion" or "Fully Kiosk Browser" on Android, make sure that Android System WebView is up to date.

How to Update Android System WebView:

- Open the Google Play Store on your Android device.
- Search for "Android System WebView".
- Tap "Update" if an update is available.
