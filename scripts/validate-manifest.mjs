function validateManifest(cards) {
  if (!Array.isArray(cards) || cards.length === 0) throw new Error("cards.json must contain at least one card");
  const ids = new Set();
  const filenames = new Set();
  for (const [index, card] of cards.entries()) {
    if (!card || typeof card !== "object" || Array.isArray(card)) throw new Error(`Card ${index} must be an object`);
    for (const field of ["id", "name", "filename", "repository", "component"]) {
      if (typeof card[field] !== "string" || !card[field].trim()) throw new Error(`Card ${index} has invalid ${field}`);
    }
    if (!/^[a-z0-9-]+$/.test(card.id)) throw new Error(`Invalid card id: ${card.id}`);
    if (!/^wiser-[a-z0-9-]+-card\.js$/.test(card.filename)) throw new Error(`Invalid card filename: ${card.filename}`);
    const legacyFilenames = card.legacy_filenames ?? [];
    if (!Array.isArray(legacyFilenames)) throw new Error(`Invalid legacy filenames for ${card.id}`);
    for (const filename of legacyFilenames) {
      if (typeof filename !== "string" || !/^wiser-[a-z0-9-]+-card\.js$/.test(filename)) {
        throw new Error(`Invalid legacy card filename: ${filename}`);
      }
    }
    if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(card.repository)) throw new Error(`Invalid repository: ${card.repository}`);
    if (!/^wiser-[a-z0-9-]+$/.test(card.component)) throw new Error(`Invalid component: ${card.component}`);
    if (card.panel !== null && (typeof card.panel !== "string" || !/^wiser-[a-z0-9-]+-panel$/.test(card.panel))) {
      throw new Error(`Invalid panel component for ${card.id}`);
    }
    if (ids.has(card.id)) throw new Error(`Duplicate card id: ${card.id}`);
    for (const filename of [card.filename, ...legacyFilenames]) {
      if (filenames.has(filename)) throw new Error(`Duplicate card filename: ${filename}`);
      filenames.add(filename);
    }
    ids.add(card.id);
  }
  return cards;
}

function createRegistry(cards) {
  validateManifest(cards);
  return {schema_version: 1, cards};
}

function validateRegistry(value) {
  if (Array.isArray(value)) return validateManifest(value);
  if (!value || typeof value !== "object" || value.schema_version !== 1) {
    throw new Error("Unsupported registry schema version");
  }
  return validateManifest(value.cards);
}

export {createRegistry, validateManifest, validateRegistry};
