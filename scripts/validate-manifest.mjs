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
    if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(card.repository)) throw new Error(`Invalid repository: ${card.repository}`);
    if (!/^wiser-[a-z0-9-]+$/.test(card.component)) throw new Error(`Invalid component: ${card.component}`);
    if (card.panel !== null && (typeof card.panel !== "string" || !/^wiser-[a-z0-9-]+-panel$/.test(card.panel))) {
      throw new Error(`Invalid panel component for ${card.id}`);
    }
    if (ids.has(card.id)) throw new Error(`Duplicate card id: ${card.id}`);
    if (filenames.has(card.filename)) throw new Error(`Duplicate card filename: ${card.filename}`);
    ids.add(card.id);
    filenames.add(card.filename);
  }
  return cards;
}

export {validateManifest};
