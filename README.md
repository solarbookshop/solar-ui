# SolarUI

This application is part of the Solar Bookshop system and provides the frontend functionality.

## Commands

### Build Angular assets

Build the production Angular assets used by the container or CI.

```shell
./gradlew buildAngular
```

### Build image with Paketo / pack

Build an NGINX container using the Pack CLI and Paketo buildpacks.

```shell
pack build solar-ui \
  --buildpack paketo-buildpacks/nginx \
  --builder paketobuildpacks/ubuntu-noble-builder \
  --path dist \
  --pull-policy if-not-present
```

### Run image produced by pack

Run the image produced by the `pack build` step.

```shell
docker run -d --rm --name solar-ui --publish 9004:9004 --env PORT=9004 solar-ui
```
