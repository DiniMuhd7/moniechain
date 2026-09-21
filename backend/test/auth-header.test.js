const test = require("node:test");
const assert = require("node:assert/strict");
const {
  parseAuthorizationHeader,
} = require("../src/utils/parseAuthorizationHeader");

test("accepts the Bearer and JWT authorization schemes used by clients", () => {
  assert.equal(parseAuthorizationHeader("Bearer signed-token"), "signed-token");
  assert.equal(parseAuthorizationHeader("JWT signed-token"), "signed-token");
  assert.equal(parseAuthorizationHeader("bearer signed-token"), "signed-token");
});

test("rejects missing and malformed authorization headers", () => {
  assert.equal(parseAuthorizationHeader(), null);
  assert.equal(parseAuthorizationHeader("signed-token"), null);
  assert.equal(parseAuthorizationHeader("Basic credentials"), null);
  assert.equal(parseAuthorizationHeader("Bearer "), null);
});
