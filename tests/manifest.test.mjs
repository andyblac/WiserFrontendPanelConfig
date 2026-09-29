import {readFileSync} from "node:fs";
import {test} from "node:test";
import assert from "node:assert/strict";
import {validateManifest} from "../scripts/validate-manifest.mjs";

const manifest = JSON.parse(readFileSync(new URL("../src/cards.json", import.meta.url), "utf8"));

test("the card registry is valid and identifiers are unique", () => {
  assert.equal(validateManifest(manifest), manifest);
  assert.equal(new Set(manifest.map(card => card.id)).size, manifest.length);
  assert.equal(new Set(manifest.map(card => card.filename)).size, manifest.length);
});

test("invalid and duplicate cards are rejected", () => {
  assert.throws(() => validateManifest([]), /at least one card/);
  assert.throws(() => validateManifest([manifest[0], {...manifest[0]}]), /Duplicate card id/);
  assert.throws(() => validateManifest([{...manifest[0], repository:"invalid"}]), /Invalid repository/);
});
