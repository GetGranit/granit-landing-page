/**
 * Granit — réception des demandes de démo, par mail.
 *
 * Le site poste le lead ici ; ce script le met en forme et l'envoie à
 * NOTIFY_TO. Il n'écrit nulle part ailleurs : le mail reçu EST l'unique trace
 * du lead. C'est pour cela que ce script ne rattrape pas ses erreurs
 * silencieusement — si l'envoi échoue, il répond une erreur au site, qui
 * affiche au visiteur de quoi réessayer plutôt que de lui dire faussement que
 * sa demande est passée.
 *
 * Installation :
 *  1. script.google.com → Nouveau projet (pas besoin de Sheet).
 *  2. Collez tout ce fichier, enregistrez.
 *  3. Déployer → Nouveau déploiement → Type : "Application web".
 *       - Exécuter en tant que : Moi
 *       - Qui a accès : Tout le monde
 *     → Déployer, autorisez l'envoi de mail, copiez l'URL qui finit par /exec
 *  4. Mettez cette URL dans la variable d'environnement DEMO_WEBHOOK_URL du
 *     projet Vercel qui déploie le site, jamais côté client. Une variable
 *     ajoutée n'atteint pas les déploiements existants : il faut redéployer.
 *
 * Pour tester : bouton "Exécuter" sur testNotify(), puis relevez la boîte.
 *
 * Ce fichier n'utilise aucun commentaire de fin de ligne : il reste donc
 * valide même si le copier-coller écrase les retours à la ligne. En cas de
 * doute, préférez l'import du fichier à un collage depuis un aperçu.
 *
 * Quota d'envoi : 100 mails par jour sur un compte Google gratuit, 1500 sur
 * Workspace. Au-delà, plus rien ne part et les leads sont perdus : si le salon
 * doit dépasser cette volumétrie, prévenez avant.
 *
 * Le sujet porte un préfixe par origine, pour filtrer dans Gmail :
 *   [SILMO] — landing du salon        subject:"[SILMO]"
 *   [Site]  — formulaire de getgranit.ai
 */

/** Destinataire des notifications. */
var NOTIFY_TO = "paul@getgranit.ai";

/** Préfixe du sujet selon l'origine du lead. */
var SUBJECT_TAGS = [{ prefix: "silmo-", tag: "[SILMO]" }];
var DEFAULT_TAG = "[Site]";

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    sendLead(data);
    return json({ ok: true });
  } catch (err) {
    /* Remonté au site, qui le remonte au visiteur : sans Sheet derrière, un
       lead qu'on n'a pas su envoyer est un lead perdu. */
    Logger.log("Lead non transmis : " + err);
    return json({ ok: false, error: String(err) });
  }
}

function sendLead(d) {
  if (!NOTIFY_TO) {
    throw new Error("NOTIFY_TO n'est pas renseigné : le lead n'irait nulle part.");
  }
  MailApp.sendEmail({
    to: NOTIFY_TO,
    subject: buildSubject(d),
    body: buildBody(d),
    replyTo: d.email || undefined,
    name: "Granit — leads",
  });
}

function buildSubject(d) {
  var source = String(d.source || "");
  var tag = DEFAULT_TAG;
  for (var i = 0; i < SUBJECT_TAGS.length; i++) {
    if (source.indexOf(SUBJECT_TAGS[i].prefix) === 0) {
      tag = SUBJECT_TAGS[i].tag;
      break;
    }
  }
  var qui = d.name || "Sans nom";
  var ou = d.company ? " — " + d.company : "";
  return tag + " " + qui + ou;
}

function buildBody(d) {
  return [
    champ("Nom", d.name),
    champ("Email", d.email),
    champ("Téléphone", d.phone),
    champ("Enseigne", d.company),
    champ("Profil", d.orgType),
    champ("Défi", d.challenge),
    "",
    decodeSource(d.source),
    champ("Reçu le", formatDate(d.submittedAt)),
  ]
    .filter(function (ligne) {
      return ligne !== null;
    })
    .join("\n");
}

function champ(label, valeur) {
  if (!valeur) return null;
  return label + " : " + valeur;
}

/**
 * `silmo-2026:pp` porte la campagne et les initiales de qui a donné la carte.
 * On les rend lisibles plutôt que de recopier le code brut.
 */
function decodeSource(source) {
  var brut = String(source || "");
  if (!brut) return "Origine : inconnue";
  var morceaux = brut.split(":");
  var texte = "Origine : " + morceaux[0];
  if (morceaux.length > 1) {
    texte += " (carte donnée par " + morceaux.slice(1).join(", ") + ")";
  }
  return texte;
}

function formatDate(iso) {
  if (!iso) return "";
  var d = new Date(iso);
  if (isNaN(d.getTime())) return String(iso);
  return Utilities.formatDate(d, Session.getScriptTimeZone(), "dd/MM/yyyy à HH:mm");
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/* Test manuel : envoie une notification d'exemple. */
function testNotify() {
  sendLead({
    submittedAt: new Date().toISOString(),
    name: "Test Manuel",
    email: "test@granit.ai",
    phone: "06 00 00 00 00",
    company: "Centre Test",
    orgType: "Opticien gérant",
    challenge: "",
    source: "silmo-2026:pp",
  });
}
