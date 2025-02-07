# Installation

The recommended way is to install this plugin using HACS.

## HACS Installation 
* Search for `WallPanel` in the Home Assistant Community Store
* Click on the repository
* Click the `Download` button
* You can now select a special version if required
* Click on `Download`


## Manual installation and upgrade
* Download wallpanel.js from the [WallPanel releases page](https://github.com/j-a-n/lovelace-wallpanel/releases/) and place it into the folder **config/www**.
* Be sure to delete the **wallpanel.js.gz** file if it is in the same directory.
* Open Configuration => Lovelace Dashboards => [Resources](https://my.home-assistant.io/redirect/lovelace_resources/) and add **/local/wallpanel.js** (Resource type: **JavaScript module**).

After a manual upgrade to a newer version, you should change the URL of the resource so that browsers are forced to reload the resource.
You can add a query string such as **?v2** to the URL or change it: **/local/wallpanel.js?v2**.
