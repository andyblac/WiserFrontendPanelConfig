# Wiser Frontend Panel Config

This repository is the source of truth for cards and panels discovered by the Wiser Home Assistant integration, both at build time and at runtime.

Edit `src/cards.json`, then run:

```sh
npm test
npm run build:dev
```

Development builds produce `dist/cards.json`. Published GitHub releases attach the validated `cards.json` artifact for integration release builds.

## Adding a card or panel

Publish the card repository's JavaScript release, add its definition to
`src/cards.json`, then publish this registry with its `cards.json` release asset.
With the generic frontend bridge installed, Home Assistant discovers additions
without any integration PR or integration release. Each new card gets an
independent update entity for installation. The last valid registry and installed
bundles are cached for offline use.

All metadata lives here: the card ID, name, filename, repository, custom element,
and optional panel custom element. Set `panel` to `null` for a card-only bundle.
The ID is a stable settings/update identity, independent of the filename.

Panels receive `hass` and `panel.config`, including `panel_id`, `hubs`, `hub_ids`,
`card_configs` and `card_url`. Save settings with the shared administrator-only
WebSocket API:

```js
await this._hass.callWS({
  type: "wiser/panel/configure",
  panel_id: this._config.panel_id,
  configs: { [hubName]: settings }
});
```

Do not add panel-specific commands to the integration. Card bundles must include
`/*! WISER-CARD-VERSION <filename-without-.js> <version> */` matching their release.
Publish the generic-API bundles before the integration bridge is released: the
previous per-panel settings commands are no longer supported by that bridge.

The shared shell and backend APIs remain in the integration. New cards/panels
using those APIs need no integration changes; new backend capabilities still do.
