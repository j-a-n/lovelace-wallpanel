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

### Exclude files
To exclude files and directories from a local media source, use the `exclude_filenames` configuration option.
This option accepts a list of regular expressions.
It was previously named `image_excludes`.

**Example**
```yaml
exclude_filenames:
  - '\\.tif$'
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
    This option is currently only supported for the Immich media source.

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
You need to set the `image_url` to `immich+<your api url>` and enter the API key in `immich_api_key`.
With the config option `immich_shared_albums` (`true` / `false`) you can include or exclude shared albums.
To restrict the media items to be retrieved to specific albums, you can configure a list of album names in `immich_album_names`.
Alternatively you can configure a list of tag names in `immich_tag_names`.
You can select media elements that contain certain people with the configuration option `immich_persons`.
Or show immich memories by setting `immich_memories` to `true`.
With the config option `immich_resolution` (`preview` / `original`) you can select the resolution of the images. 

Example using album names:
```yaml
image_url: immich+https://immich.your.domain/api
immich_api_key: 0vOb7EZ7YSajUQckMt6Cbnri8Ifzo5dlD9Q5hnnXlc
immich_shared_albums: false
immich_album_names:
  - Tokio
  - New York
immich_resolution: preview
```

Example using tag names:
```yaml
image_url: immich+https://immich.your.domain/api
immich_api_key: 0vOb7EZ7YSajUQckMt6Cbnri8Ifzo5dlD9Q5hnnXlc
immich_tag_names:
  - Family
  - Friends
immich_resolution: original
```

Example of media elements that contain certain persons:
```yaml
image_url: immich+https://immich.your.domain/api
immich_api_key: 0vOb7EZ7YSajUQckMt6Cbnri8Ifzo5dlD9Q5hnnXlc
immich_persons:
  - Alice
  - Bob
  - [John, Jane]
```
This will show media items containing either Alice, Bob or John and Jane.

Example showing immich memories:
```yaml
image_url: immich+https://immich.your.domain/api
immich_api_key: 0vOb7EZ7YSajUQckMt6Cbnri8Ifzo5dlD9Q5hnnXlc
immich_memories: true
```

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
