import {readFileSync} from "node:fs";
import {test} from "node:test";
import assert from "node:assert/strict";
import {createRegistry, validateManifest, validateRegistry} from "../scripts/validate-manifest.mjs";

const manifest = JSON.parse(readFileSync(new URL("../src/cards.json", import.meta.url), "utf8"));

test("the card registry is valid and identifiers are unique", () => {
  assert.equal(validateManifest(manifest), manifest);
  assert.equal(new Set(manifest.map(card => card.id)).size, manifest.length);
  assert.equal(new Set(manifest.map(card => card.filename)).size, manifest.length);
  assert.deepEqual(
    manifest.find(card => card.id === "rooms").legacy_filenames,
    ["wiser-rooms-card.js"],
  );
  assert.deepEqual(manifest.find(card => card.id === "hub"), {
    id:"hub",
    name:"Wiser Hub Panel",
    filename:"wiser-hub-panel.js",
    repository:"andyblac/wiser-hub-panel",
    component:"wiser-hub-panel",
    panel:"wiser-hub-panel",
    card:false,
  });
});

test("the versioned registry remains backward compatible with card arrays", () => {
  const registry = createRegistry(manifest);
  assert.equal(registry.schema_version, 1);
  assert.equal(validateRegistry(registry), manifest);
  assert.equal(validateRegistry(manifest), manifest);
  assert.throws(
    () => validateRegistry({...registry, schema_version: 2}),
    /Unsupported registry schema version/,
  );
});

test("invalid and duplicate cards are rejected", () => {
  assert.throws(() => validateManifest([]), /at least one card/);
  assert.throws(() => validateManifest([manifest[0], {...manifest[0]}]), /Duplicate card id/);
  assert.throws(() => validateManifest([{...manifest[0], repository:"invalid"}]), /Invalid repository/);
  assert.throws(
    () => validateManifest([{...manifest[0], legacy_filenames:["../unsafe.js"]}]),
    /Invalid legacy card filename/,
  );
  assert.throws(
    () => validateManifest([{...manifest[0], filename:"wiser-unsafe-widget.js"}]),
    /Invalid card filename/,
  );
  assert.throws(
    () => validateManifest([{...manifest[0], card:"no"}]),
    /Invalid card flag/,
  );
});
