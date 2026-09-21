const parseAuthorizationHeader = (header) => {
  const match = header && header.match(/^(Bearer|JWT)\s+(.+)$/i);
  return match ? match[2] : null;
};

module.exports = { parseAuthorizationHeader };
