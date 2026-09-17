function normalize(value = '') {
  return value.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
}

function resolveAlias(input, aliases) {
  const key = normalize(input);
  return aliases[key] || null;
}

module.exports = {
  normalize,
  resolveAlias
};
