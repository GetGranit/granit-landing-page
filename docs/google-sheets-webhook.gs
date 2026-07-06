/**
 * Granit — réception des demandes de démo dans Google Sheets.
 *
 * Installation :
 *  1. Créez un Google Sheet (ex. "Granit — Leads démo").
 *  2. Menu  Extensions → Apps Script.
 *  3. Collez tout ce fichier, enregistrez.
 *  4. Déployer → Nouveau déploiement → Type : "Application web".
 *       - Exécuter en tant que : Moi
 *       - Qui a accès : Tout le monde
 *     → Déployer, autorisez, et copiez l'URL qui finit par /exec
 *  5. Donnez cette URL à Claude (elle sera mise dans DEMO_WEBHOOK_URL,
 *     côté serveur uniquement — jamais exposée aux visiteurs).
 *
 * Pour tester : bouton "Exécuter" sur testAppend() ajoute une ligne d'exemple.
 */

var SHEET_NAME = "Leads";
var HEADERS = ["Date", "Nom", "Email", "Téléphone", "Établissement", "Type", "Défi", "Source"];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    appendLead(data);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function appendLead(d) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  }
  sheet.appendRow([
    d.submittedAt || new Date().toISOString(),
    d.name || "",
    d.email || "",
    d.phone || "",
    d.company || "",
    d.orgType || "",
    d.challenge || "",
    d.source || "",
  ]);
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Test manuel (facultatif) : ajoute une ligne d'exemple.
function testAppend() {
  appendLead({
    submittedAt: new Date().toISOString(),
    name: "Test Manuel",
    email: "test@granit.ai",
    phone: "06 00 00 00 00",
    company: "Centre Test",
    orgType: "Centre optique",
    challenge: "Tiers-payant",
    source: "test",
  });
}
