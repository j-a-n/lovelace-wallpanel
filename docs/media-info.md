# Media Info
You can show infos regarding the displayed media in the screesaver.
The media info is available for Local Media Sources, Immich Integration and some image entities.
Set the configuration opttion `show_image_info` to `true` to activate this feature.

The image info can be formatted by specifying HTML code in `image_info_template`.
Placeholders like `${EXIF-tag-name}` will be replaced with the corresponding EXIF tag value.
See [exif.js](https://github.com/exif-js/exif-js/blob/master/exif.js) for available EXIF tag names.

If the EXIF data contains GPS location information and the `fetch_address_data` configuration is set to `true`,
address data for the GPS coordinates will be fetched from `nominatim.openstreetmap.org`.
The received address data can be used via placeholders in the form `address.<attribute>`.
Available attributes are: `country`, `country_code`, `county`, `municipality`, `postcode`, `region`, `road`, `state`, `city`, `town` and `village`.
See [Nominatim Reverse Geocoding](https://nominatim.org/release-docs/latest/api/Reverse/) for details.
Please respect the [Nominatim Usage Policy](https://operations.osmfoundation.org/policies/nominatim/).

If you specify multiple alternative values separated by a pipe symbol (`|`), the first available attribute is used.

A prefix and suffix string can be added for each placeholder.
Prefix and suffix are not displayed if the placeholder value is empty.

For date values you can specify date format options.
Each option must consist of an `<option name>:<option value>` pair.
Multiple options must be separated by commas.
Available option names are: `year`, `month`, `day`, `weekday`, `hour`, `minute` and `second`.
Possible option values are: `long`, `short`, `narrow`, `numeric` and `2-digit`.
See [toLocaleDateString options](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString) for details.


The following placeholders can also be used:

* `image.url`: The full URL of the media item.
* `image.path`: The complete path to the media item.
* `image.relativePath`: The path to the current media item, relative to the `image_url` configuration parameter.
* `image.folderName`: The name of the folder containing the media file.
* `image.filename`: The name of the media file.
* `mediaCount`: Total number of media files available.
* `mediaPosition`: Position of the current file in the list of media files.

!!! tip
    Set `image_info_template: analyze` to show all available attributes.

**Examples**

Display location and date
```yaml
show_image_info: true
image_info_template: '<span style="color:#990000">//</span> ${address.town|address.city|address.municipality!prefix=!suffix= // }${DateTimeOriginal!options=year:numeric,month:long,day:2-digit}'
```

Display image path
```yaml
show_image_info: true
image_info_template: >-
    <span style="font-family: 'Roboto Condensed', sans-serif; font-size: 1em; font-weight: 400; color: #999;">
      ${image.relativePath}
    </span>
```

The CSS class `wallpanel-screensaver-image-info` can be used to style the image info.
See section "Styles".
