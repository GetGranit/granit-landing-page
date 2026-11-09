import assert from "node:assert/strict";
import { test } from "node:test";
import { message, messageEnLigne } from "../lib/slack.mjs";

test("messageEnLigne : un article = titre et lien sur deux lignes", () => {
  assert.equal(
    messageEnLigne([{ titre: "Ticket modérateur 2027", url: "https://www.getgranit.ai/ressources/ticket-moderateur-2027" }]),
    "✅ Article en ligne : *Ticket modérateur 2027*\nhttps://www.getgranit.ai/ressources/ticket-moderateur-2027",
  );
});

test("messageEnLigne : plusieurs articles = un seul message avec la liste", () => {
  const m = messageEnLigne([
    { titre: "A", url: "https://x/a" },
    { titre: "B", url: "https://x/b" },
  ]);
  assert.equal(m, "✅ 2 articles en ligne :\n• <https://x/a|A>\n• <https://x/b|B>");
});

test("message : une PR à relire garde son lien", () => {
  const m = message({ etat: "ok", titre: "T", url: "u", pr: "https://github.com/o/r/pull/1" });
  assert.match(m, /Article à relire/);
  assert.match(m, /pull\/1/);
});
