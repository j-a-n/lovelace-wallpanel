# FAQ - Frequently Asked Questions
## Dashboard cannot be edited
After hiding the toolbar, I can no longer edit the dashboard. How can I recover?

If you add `?edit=1` or `?wp_enabled=false` to the URL in the browser, WallPanel will not be active, so the toolbar will not be hidden either.
You can also use `?wp_hide_toolbar=false` to only change this setting.

Example: `http://192.168.1.1:8123/lovelace/default_view?wp_enabled=false`

