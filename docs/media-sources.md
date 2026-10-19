# Media sources
The media source for the screensaver slideshow is configured by `image_url`.
This can be any HTTP URL, a Home Assistant media-source URL or a Home Assistant entity that has the `entity_picture` attribute.

The default value of `image_url` is `http://picsum.photos/${width}/${height}?random=${timestamp}`.

## HTTP URL
Media can be retrieved from an HTTP URL.

The following variables can be used in HTTP URLs:
- `${timestamp}` = current unix timestamp
- `${width}` = viewport width
- `${height}` = viewport height

Example of using images from unsplash.com (old api):

`https://source.unsplash.com/random/${width}x${height}?sig=${timestamp}`

You can narrow down the images from unsplash.com using certain search terms, for example "fruit" and "beer".

`https://source.unsplash.com/random/${width}x${height}?fruit,beer&sig=${timestamp}`

Example of using images from api.unsplash.com (new api):

```yaml
media_order: random
media_list_update_interval: 3600
image_url: https://api.unsplash.com/photos/random?client_id=YOUR_ACCESS_KEY&query=dogs
show_image_info: true
image_info_template: '<span style="color:#990000">//</span> ${description|alt_description}'
```

See [Unsplash API documentation (Get a random photo)](https://unsplash.com/documentation#get-a-random-photo) for details.

## Local Media Source

It is also possible to use images from the Home Assistant Local Media Source.
See [Home Assistant Media Source integration documentation](https://www.home-assistant.io/integrations/media_source) for details.

If you are not sure which is the correct media source URL, you can proceed as follows:

1. navigate to the folder you want to use in the HA Media Browser
2. copy the displayed browser URL and decode it with a URL decoder tool. For example, you can use [www.urldecoder.org](https://www.urldecoder.org/).
3. copy the part of the decoded URL after the last comma (`,`) that begins with `media-source://`.

Instead of using `media-source://media_source/` as `image_url` you can just use `/` as a shortcut.

- `/` = Images in all Local Media sources
- `/media1` = Images in the Local Media directory named `media1`
- `/media1/folder1` = Images in `folder1` of the Local Media directory named `media1`

If you are using the [Synology DSM](https://www.home-assistant.io/integrations/synology_dsm/) integration, and want to use an Photo album from there you can use:

`media-source://synology_dsm/<unique_id>/<album_id>`

`<unique_id>` is the Home Assistant ID for the NAS (usually the serial number of the NAS).

For example:

`media-source://synology_dsm/18C0PEN253705/19`

### Random path order

For media sources containing multiple folders, `random_path` randomly selects a folder beneath `image_url` and displays the media directly inside that folder in sorted order. After the last media item in the folder has been displayed, another folder is randomly selected. Every folder is selected once before the folder order is shuffled again.

The folder configured by `image_url` is also eligible when it directly contains media. Empty folders and folders whose media are all excluded are skipped. Nested folders are treated as separate paths rather than being combined with their parent folder.

```yaml
image_url: /media1/photos
media_order: random_path
```

This option is only supported for Home Assistant media sources. `exclude_filenames`, `exclude_media_types`, and `media_list_max_size` continue to apply; `media_list_max_size` limits the number of media items used from the selected folder.

### Exclude files
To exclude files and directories from a local media source, use the `exclude_filenames` configuration option.
This option accepts a list of regular expressions.
It was previously named `image_excludes`.

**Example**
```yaml
exclude_filenames:
  - '\.heic$'
  - '\.[tT][iI][fF][fF]?$'
  - '/@eaDir'
```

You can also exclude specific media types (currently image and video) using the `exclude_media_types` option.
**Example**
```yaml
exclude_media_types:
  - video
```

To exclude specific media orientations from being displayed, use the `exclude_media_orientation` configuration option.
Valid values are:
* `landscape`: excludes media in landscape format
* `portrait`: excludes media in portrait format
* `auto`: excludes media whose orientation does not match the screen orientation

!!! note
    This option is currently only supported for the Immich and PhotoPrism media sources.

**Example**
```yaml
exclude_media_orientation: auto
```

## Media Entity

### Images

You can use an entity's `entity_picture` attribute as the media source for the screensaver.
To do this, set the `image_url` to `media-entity-image://<entity_id>`, replacing `<entity_id>` with the actual entity ID.

When the entity's state changes, a new image will automatically be displayed. A new image also loads after the specified `display_time` has passed.
If you'd like to prevent image updates when the entity state remains the same, set `media_entity_load_unchanged` to `false`.

**Example:**

```yaml
display_time: 15
image_url: media-entity-image://camera.my_camera_entity_id
media_entity_load_unchanged: true
```

### Video Stream

If an entity provides a video stream, you can use it as the screensaver media source.
To enable this, set `image_url` to `media-entity-video://<entity_id>`, replacing `<entity_id>` with the appropriate entity ID.

**Example:**

```yaml
image_url: media-entity-video://camera.my_camera_entity_id
media_entity_load_unchanged: false
```

## Immich API
Images and videos can be loaded from an Immich server,
for which WallPanel accesses the [Immich API](https://immich.app/docs/api/).


### Immich server CORS
Wallpanel sends direct requests to the Immich server via the browser, which enforces CORS (Cross-Origin Resource Sharing) as a security measure. Unfortunately, the Immich server does not support CORS configuration, and [there are currently no plans to implement this](https://github.com/immich-app/immich/discussions/19175).

To work around this limitation, you'll need to set up a reverse proxy. The specific configuration will vary depending on the reverse proxy you choose to use.

Here is a configuration example for nginx:
```
if ($request_method = 'OPTIONS') {
  add_header 'Access-Control-Allow-Origin' '*' always;
  add_header 'Access-Control-Allow-Methods' 'GET, PUT, POST, DELETE, OPTIONS' always;
  add_header 'Access-Control-Allow-Headers' 'X-Api-Key, User-Agent, Content-Type' always;
  add_header 'Access-Control-Max-Age' 1728000;
  add_header 'Content-Type' 'text/plain charset=UTF-8';
  add_header 'Content-Length' 0;
  return 204;
}
if ($request_method ~* '(GET|POST)') {
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'X-Api-Key, User-Agent, Content-Type' always;
    add_header 'Access-Control-Max-Age' 1728000;
}
```

!!! note
    If you are using Nginx Proxy Manager add a custom location at root "/" and insert the configuration there.


For Traefik, you can use:

```
traefik.http.middlewares.immich-cors.headers.accessControlAllowOriginList=*
traefik.http.middlewares.immich-cors.headers.accessControlAllowMethods=GET, PUT, POST, DELETE, OPTIONS
traefik.http.middlewares.immich-cors.headers.accessControlAllowHeaders=X-Api-Key, User-Agent, Content-Type
traefik.http.middlewares.immich-cors.headers.accessControlMaxAge=1728000
traefik.http.routers.immich.middlewares=immich-cors
```

!!! warning
    For security reasons, it's best to specify a list of URLs in `Access-Control-Allow-Origin` rather than using `*`.

!!! note
    If you're coming from an internal IP, make sure your traffic is properly routed
    through the proxy rather than directly reaching the internal IP.  
    To prevent SSL errors, you'll likely need a router that supports NAT reflection.

### Wallpanel configuration
To access the Immich API, first generate an [API key](https://immich.app/docs/features/command-line-interface/#obtain-the-api-key).

Then you can configure WallPanel to use the Immich API.
You need to set the `image_url` to `immich+<your api url>` and add the API key to `immich_api_keys`.
Multiple API keys can be added to use multiple accounts on the same server.
The timeout for immich API requests can be set using the `immich_api_request_timeout` configuration option and defaults to 15 seconds.
With the config option `immich_shared_albums` (`true` / `false`) you can include or exclude shared albums.
To restrict the media items to be retrieved to specific albums, you can configure a list of album names in `immich_album_names`.
Alternatively you can configure a list of tag names in `immich_tag_names`.
You can select media elements that contain certain people with the configuration option `immich_persons`.
Or show immich memories by setting `immich_memories` to `true`.
With the config option `immich_resolution` (`preview` / `original`) you can select the resolution of the images. 

Example using album names:
```yaml
image_url: immich+https://immich.your.domain/api
immich_api_keys:
  - 0vOb7EZ7YSajUQckMt6Cbnri8Ifzo5dlD9Q5hnnXlc
immich_shared_albums: false
immich_album_names:
  - Tokio
  - New York
immich_resolution: preview
```

Example using tag names:
```yaml
image_url: immich+https://immich.your.domain/api
immich_api_keys:
  - 0vOb7EZ7YSajUQckMt6Cbnri8Ifzo5dlD9Q5hnnXlc
immich_tag_names:
  - Family
  - Friends
immich_resolution: original
```

Example of media elements that contain certain persons:
```yaml
image_url: immich+https://immich.your.domain/api
immich_api_keys:
  - 0vOb7EZ7YSajUQckMt6Cbnri8Ifzo5dlD9Q5hnnXlc
immich_persons:
  - Alice
  - Bob
  - [John, Jane]
```
This will show media items containing either Alice, Bob or John and Jane.

Example showing immich memories:
```yaml
image_url: immich+https://immich.your.domain/api
immich_api_keys:
  - 0vOb7EZ7YSajUQckMt6Cbnri8Ifzo5dlD9Q5hnnXlc
immich_memories: true
```

Example showing immich favorites:
```yaml
image_url: immich+https://immich.your.domain/api
immich_api_keys:
  - 0vOb7EZ7YSajUQckMt6Cbnri8Ifzo5dlD9Q5hnnXlc
immich_favorites: true
```

## PhotoPrism API
Images and videos can be loaded from a [PhotoPrism](https://www.photoprism.app/) server,
for which WallPanel accesses the [PhotoPrism API](https://docs.photoprism.app/developer-guide/api/).
Images are loaded through the [Thumbnail Image API](https://docs.photoprism.app/developer-guide/api/thumbnails/),
videos are streamed as MPEG-4 AVC (H.264).

### PhotoPrism access token
WallPanel authenticates with an app password or a client access token (`Authorization: Bearer <token>`).
App passwords can be created in the PhotoPrism web interface under *Settings > Account > Apps and Devices*
or with the `photoprism auth add` command, for example:

```bash
photoprism auth add -n WallPanel -s "photos albums labels config" -e -1 admin
```

App passwords expire after one year by default, `-e -1` creates an app password that does not expire.

The authorization scope must include `photos` as well as `config`, which is needed to get the preview token
that is part of the thumbnail and video URLs. Add `albums` and/or `labels` if you select pictures by album or label name.
On current PhotoPrism versions you can also use the read-only scope `read`, or `*` to allow all.
See [Client Authentication](https://docs.photoprism.app/developer-guide/api/auth/) for details.

!!! note
    Thumbnail and video URLs contain the preview token of the account, they are valid as long as the token is.
    The preview token changes when the account password is changed, WallPanel will then fetch the new token
    the next time the media list is updated.

### PhotoPrism server CORS
WallPanel sends direct requests to the PhotoPrism server via the browser, which enforces CORS (Cross-Origin Resource Sharing).
PhotoPrism supports CORS through its [config options](https://docs.photoprism.app/getting-started/config-options/).
Set the origin to the URL of your Home Assistant instance and add `Authorization` to the allowed headers:

```yaml
PHOTOPRISM_CORS_ORIGIN: "https://homeassistant.your.domain:8123"
PHOTOPRISM_CORS_HEADERS: "Accept, Accept-Ranges, Authorization, Content-Disposition, Content-Encoding, Content-Range, Location"
PHOTOPRISM_CORS_METHODS: "GET, HEAD, OPTIONS"
```

`PHOTOPRISM_CORS_METHODS` can be left at its default value, as WallPanel only sends `GET` requests.
Preflight requests are handled correctly since PhotoPrism build 251130, for older versions
configure CORS in a reverse proxy instead (see [Immich server CORS](#immich-server-cors)).

!!! warning
    For security reasons, it's best to specify the URL of your Home Assistant instance in `PHOTOPRISM_CORS_ORIGIN` rather than using `*`.

### Wallpanel configuration
You need to set the `image_url` to `photoprism+<your PhotoPrism URL>` and add the access token to `photoprism_access_tokens`.
Multiple access tokens can be added to use multiple accounts on the same server.
The timeout for PhotoPrism API requests can be set using the `photoprism_api_request_timeout` configuration option and defaults to 15 seconds.

The following options select the media items:

* `photoprism_album_names`: list of album titles
* `photoprism_label_names`: list of label names
* `photoprism_favorites`: `true` to show favorites only
* `photoprism_query`: a [PhotoPrism search query](https://docs.photoprism.app/user-guide/search/filters/), e.g. `year:2024 country:at`,
  or a list of queries (see [On this day](#on-this-day))
* `photoprism_query_min_results`: minimum number of pictures a query of the `photoprism_query` list must return (default: `1`)
* `photoprism_album_mode`: `all` (default) to show pictures from all albums and labels,
  or `random_single` to show pictures from a single random album or label (see [Random album](#random-album))

Media items from all configured albums and labels are combined.
Album titles are matched exactly (case-insensitive), if several albums have the same title, all of them are used.
If neither albums nor labels are configured, the whole library is used.
`photoprism_favorites` and `photoprism_query` restrict the results further, also in combination with albums and labels.
Archived and private pictures are not included.
If `exclude_media_types` contains `video`, videos are already excluded by PhotoPrism, live photos are shown as images.

With the default `media_order` `random`, PhotoPrism selects random pictures,
so only `media_list_max_size` media items are loaded on every media list update instead of the whole library.
If albums or labels are configured, the media items are distributed over them according to their number of pictures.
With `photoprism_favorites` or `photoprism_query`, up to `media_list_max_size` media items are loaded from every album and label,
WallPanel then selects `media_list_max_size` random items from them.
With `media_order` `sorted` or `random_but_synced`, all matching media items are loaded.

The media list is updated every `media_list_update_interval` seconds and when the profile set by `profile_entity` changes.
Small values for `media_list_max_size` and `media_list_update_interval` (for example `60` and `3600`) result in
a new selection of pictures every hour.

With the config option `photoprism_resolution` you can select the resolution of the images:

* `preview` (default): `fit_1920` thumbnails
* `original`: the largest thumbnail size (`fit_7680`), PhotoPrism reduces the size to the largest size available on the server,
  see [Size Limits](https://docs.photoprism.app/developer-guide/api/thumbnails/#size-limits)
* a [thumbnail size](https://docs.photoprism.app/developer-guide/api/thumbnails/#thumbnail-sizes) name like `fit_2560`

The picture metadata returned by PhotoPrism (for example `Title`, `TakenAtLocal`, `PlaceLabel`, `CameraModel`)
can be used in the `image_info_template`.

Example showing PhotoPrism favorites:
```yaml
image_url: photoprism+https://photos.your.domain
photoprism_access_tokens:
  - Y2b7Q-wXZpo-7rKcS-fNa3u
photoprism_favorites: true
exclude_media_orientation: auto
```

Example using album names:
```yaml
image_url: photoprism+https://photos.your.domain
photoprism_access_tokens:
  - Y2b7Q-wXZpo-7rKcS-fNa3u
photoprism_album_names:
  - Tokio
  - New York
photoprism_resolution: fit_2560
```

Example using labels, restricted to pictures taken in 2024:
```yaml
image_url: photoprism+https://photos.your.domain
photoprism_access_tokens:
  - Y2b7Q-wXZpo-7rKcS-fNa3u
photoprism_label_names:
  - Cat
  - Dog
photoprism_query: "year:2024"
image_info_template: "${Title} - ${TakenAtLocal}"
```

### On this day
`photoprism_query` can contain the following placeholders, which are replaced with the current local date:

* `{day}`: day of the month
* `{month}`: month (1-12)
* `{year}`: year
* `{days:N}`: the days from N days before to N days after the current day,
  e.g. `{days:3}` is replaced with `month:10 day:12|13|14|15|16|17|18` on October 15th.
  If the days span several months, one query per month is sent and the results are combined.
* `{week}`: same as `{days:3}`

Set `photoprism_reference_date` to use another date than today, either as `YYYY-MM-DD` or as `MM-DD` (current year).
If a reference date is set, the media list is not updated when the day changes.

If `photoprism_query` is a list, the queries are tried in order and the first one that returns
at least `photoprism_query_min_results` pictures (default: `1`) is used.
If no query reaches this number, the query with the most pictures is used.
Queries with placeholders are also updated when the day changes.

Example showing pictures taken on this day in previous years from two albums,
widening the time span until at least 30 pictures are found:
```yaml
image_url: photoprism+https://photos.your.domain
photoprism_access_tokens:
  - Y2b7Q-wXZpo-7rKcS-fNa3u
photoprism_album_names:
  - Family
  - Holidays
photoprism_query:
  - "month:{month} day:{day}"
  - "{days:3}"
  - "{days:7}"
  - "{days:14}"
  - "month:{month}"
  - "{days:45}"
photoprism_query_min_results: 30
exclude_media_types:
  - video
media_list_max_size: 60
media_list_update_interval: 3600
image_info_template: "${Title} - ${TakenAtLocal}"
```

### Random album
With `photoprism_album_mode: random_single`, a single album or label is selected randomly on every media list update
and `media_list_max_size` random pictures of it are shown.
The same album is not selected twice in a row, albums and labels with less than `photoprism_query_min_results` pictures are skipped.
Albums with the same title are treated as separate albums.
The title of the selected album is available as `image.folderName` in the `image_info_template`.
This option is only used if `photoprism_query` is empty, otherwise all albums and labels are searched.

Example showing a different album every hour:
```yaml
image_url: photoprism+https://photos.your.domain
photoprism_access_tokens:
  - Y2b7Q-wXZpo-7rKcS-fNa3u
photoprism_album_names:
  - Family
  - Holidays
  - Tokio
photoprism_album_mode: random_single
photoprism_query_min_results: 30
media_list_max_size: 60
media_list_update_interval: 3600
image_info_template: "${image.folderName} - ${TakenAtLocal}"
```

### PhotoPrism status
If `photoprism_status_entity` is set to an `input_text` entity, a short status text is written to it after every media list update,
for example:

* `Album: Sweden 2025 (797) · 60 pictures · 15:00` (`photoprism_album_mode: random_single`)
* `Albums: 62 · 60 pictures · 15:00` (all configured albums)
* `10/15 ±3 days · 43 pictures (level 2/6) · 15:00` (reference date, selected query of the `photoprism_query` list
  and number of matching pictures before limiting to `media_list_max_size`)
* `No pictures found (10/15 day) · 15:00`

The texts are available in English and German and are selected by the Home Assistant language,
the date is formatted according to the language.
The text is limited to 255 characters, the maximum length of an `input_text` entity.

## Website as iframe
You can also display a website in an iframe.
Just add the prefix `iframe+` to the URL of the website you want to show:

For example:
```yaml
image_url: iframe+https://projects.sntosh.in/clock/
```

!!! info
    Not all websites can be used in an iframe.
    A website can set an X-Frame-Options HTTP header to prevent it from being used in an iframe.


## Embed external content
You can also embed external content in a HTML embed element.
Simply prefix `embed+` to the URL of the source you want to embed:

For example:
```yaml
image_url: embed+https://external.source.test/embed.pdf
```
