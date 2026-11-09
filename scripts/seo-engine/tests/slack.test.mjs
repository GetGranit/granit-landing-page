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

test("messageEnLigne : verdict « humain » signalé sans bloquer", () => {
  assert.equal(
    messageEnLigne([{ titre: "A", url: "https://x/a", verdict: "humain" }]),
    "✅ Article en ligne : *A* (les agents ont laissé des points ouverts)\nhttps://x/a",
  );
});

test("message : un article non publié garde le lien de sa PR", () => {
  const m = message({ etat: "ok", titre: "T", url: "u", pr: "https://github.com/o/r/pull/1" });
  assert.match(m, /Article non publié/);
  assert.match(m, /pull\/1/);
});
