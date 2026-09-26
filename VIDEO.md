# Local actor videos

Actor.videoURL accepts either a legacy embed URL or a local /uploads/.../video-UUID.mp4 URL.
No database migration is needed. Existing actors and links remain intact.

Install dependencies with npm ci in server and client. Build both with npm run build.
The client prebuild/prestart scripts copy Plyr's bundled icons into public/plyr.svg.

Create an actor, then use the video upload button on their profile while signed in as an administrator.
Uploads accept MP4 with H.264 video and optional AAC audio. No transcoding is performed.
The default maximum size is 2147483648 bytes (2 GiB); override VIDEO_MAX_BYTES in server/.env.
Duration and resolution are not capped. For faster startup, export MP4 with faststart enabled.

Videos live in server/uploads/<actor-directory>. Include this directory in backups and keep it
persistent across deployments. Uploads use the OS temporary directory, so both locations need
free space for the incoming file. Old video is removed only after the database update succeeds.
An interrupted process can leave temporary/orphan files; automatic background cleanup is not included.

If deployed behind nginx, configure the upload location, preserving your existing proxy headers:

```nginx
location /api/actor-video/ {
    client_max_body_size 2050m;
    client_body_timeout 120s;
    proxy_request_buffering off;
    proxy_read_timeout 180s;
    proxy_send_timeout 180s;
    proxy_pass http://127.0.0.1:3001;
}
```

Allow Range requests on /uploads for seeking. Express static handles them automatically.
Other proxies/CDNs may impose their own request size/time limits.

Verification (test database only): cd server; npm run build; node tests/actor-video.cjs.
The integration test requires an existing actor, creates a temporary copy, tests the real DB and filesystem,
and removes its own fixture. It never enables schema synchronization.

Browser checks: start the client on port 3000; cd client; npx playwright test.
Browser tests use mocked API data and a generated MP4, without changing real actors.
