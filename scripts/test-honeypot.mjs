import assert from "node:assert/strict";
import { test } from "node:test";
import { createHoneypot } from "../server/honeypot.ts";

test("probe responses are inert and do not consume bodies or record credentials", async (t) => {
  const logs = [];
  t.mock.method(console, "warn", (line) => logs.push(line));
  const trap = createHoneypot();
  for (const path of [
    "/.env",
    "/.git/config",
    "/wp-admin/",
    "/api/admin/users",
    "/.aws/credentials",
  ]) {
    const request = new Request(`https://www.example.com${path}?token=query-secret`, {
      method: "POST",
      body: "password=body-secret",
      headers: { authorization: "Bearer header-secret" },
    });
    const response = trap(request);
    assert.equal(response.status, 404);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(request.bodyUsed, false);
    assert.ok(!(await response.text()).includes("secret"));
  }
  assert.ok(!JSON.stringify(logs).includes("secret"));
  assert.equal(logs.length, 5);
  assert.equal(trap(new Request("https://www.example.com/demo")), undefined);
  assert.equal(trap(new Request("https://www.example.com/robots.txt")), undefined);
  assert.equal(trap(new Request("https://www.example.com/.well-known/security.txt")), undefined);
});

test("logging has a fixed budget and HEAD returns no body", async (t) => {
  const logs = [];
  t.mock.method(console, "warn", (line) => logs.push(line));
  const trap = createHoneypot();
  for (let i = 0; i < 80; i++)
    assert.equal(trap(new Request("https://www.example.com/.env")).status, 404);
  assert.equal(logs.length, 60);
  assert.equal(
    await trap(new Request("https://www.example.com/.env", { method: "HEAD" })).text(),
    "",
  );
});
