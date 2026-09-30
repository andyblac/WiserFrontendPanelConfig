import {mkdirSync, readFileSync, writeFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import buildVersion from "./build-version.mjs";
import {createRegistry} from "./validate-manifest.mjs";

const root = new URL("../", import.meta.url);
const sourceUrl = new URL("src/cards.json", root);
const manifest = JSON.parse(readFileSync(sourceUrl, "utf8"));

const registry = createRegistry(manifest);
const dev = process.argv.includes("--dev");
const final = process.argv.includes("--release");
if (dev && final) throw new Error("A build cannot be both development and final release");
const build = buildVersion({dev, final, root:fileURLToPath(root), releaseTag:process.env.RELEASE_TAG});
const output = new URL("dist/", root);
mkdirSync(output, {recursive:true});
writeFileSync(new URL("cards.json", output), `${JSON.stringify(registry, null, 2)}\n`);
build.complete(fileURLToPath(output));
console.log(`Built Wiser frontend panel config ${build.version}`);
console.log(`Artifact: ${fileURLToPath(new URL("cards.json", output))}`);
