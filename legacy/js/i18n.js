// ═══ LANGUAGE DETECTION ═══
const LANG = location.pathname.startsWith('/en') ? 'en' : 'fr';

// ═══ TRANSLATION DICTIONARY ═══
const T = {
  // ── Nav ──
  'nav.agents':       {fr:'Nos agents', en:'Our agents'},
  'nav.blog':         {fr:'Blog', en:'Blog'},
  'nav.cta':          {fr:'Réserver une démo', en:'Book a demo'},

  // ── Hero ──
  'hero.badge':       {fr:'Granit déploie des agents IA sur mesure dans tous les établissements de santé', en:'Granit deploys custom AI agents across all healthcare facilities'},
  'hero.h1':          {fr:'Vos équipes soignent.<br>Granit gère le reste.', en:'Your teams care.<br>Granit handles the rest.'},
  'hero.sub':         {fr:'Granit déploie des agents IA qui automatisent les tâches administratives de vos équipes de santé. Branché sur vos outils existants. Opérationnel en 48h.', en:'Granit deploys AI agents that automate administrative tasks for your healthcare teams. Connected to your existing tools. Live in 48h.'},
  'hero.cta':         {fr:'Demander une démo gratuite', en:'Request a free demo'},
  'hero.cta2':        {fr:'Voir nos agents', en:'See our agents'},

  // ── Mockup ──
  'mock.title':       {fr:'Granit - Tableau de bord', en:'Granit - Dashboard'},
  'mock.agents':      {fr:'Agents actifs', en:'Active agents'},
  'mock.tp':          {fr:'Tiers-payant', en:'Third-party billing'},
  'mock.active':      {fr:'actif', en:'active'},
  'mock.rejets':      {fr:'Rejets CPAM', en:'CPAM rejections'},
  'mock.recouv':      {fr:'Recouvrement', en:'Collection'},
  'mock.conn':        {fr:'Connexions', en:'Connections'},
  'mock.journal':     {fr:'Journal - aujourd\'hui', en:'Log - today'},
  'mock.log1.title':  {fr:'Vérification droits - 14 patients', en:'Eligibility check - 14 patients'},
  'mock.log1.desc':   {fr:'Viamedis · Contrôle en cours', en:'Viamedis · Check in progress'},
  'mock.log1.badge':  {fr:'En cours', en:'In progress'},
  'mock.log2.title':  {fr:'Rejet CPAM corrigé - Dossier #4821', en:'CPAM rejection fixed - File #4821'},
  'mock.log2.desc':   {fr:'Code acte corrigé automatiquement', en:'Procedure code auto-corrected'},
  'mock.log3.title':  {fr:'Relances envoyées - 6 impayés', en:'Follow-ups sent - 6 unpaid'},
  'mock.log3.desc':   {fr:'Email + SMS · > 30 jours', en:'Email + SMS · > 30 days'},
  'mock.log4.title':  {fr:'Rapprochement bancaire terminé', en:'Bank reconciliation complete'},
  'mock.log4.desc':   {fr:'47 transactions réconciliées', en:'47 transactions reconciled'},
  'mock.stats':       {fr:'Stats - cette semaine', en:'Stats - this week'},
  'mock.stat.main':   {fr:'récupérées aujourd\'hui<br>par l\'équipe admin', en:'recovered today<br>by the admin team'},
  'mock.stat.prec':   {fr:'précision', en:'accuracy'},
  'mock.stat.rej':    {fr:'rejets cette semaine', en:'rejections this week'},
  'mock.stat.prod':   {fr:'mise en production', en:'time to deploy'},
  'mock.stat.conn':   {fr:'connecteurs natifs', en:'native connectors'},

  // ── Metrics ──
  'metrics.1':        {fr:'récupérées par équipe<br>et par jour', en:'recovered per team<br>per day'},
  'metrics.2':        {fr:'de précision sur les<br>traitements automatisés', en:'accuracy on<br>automated processing'},
  'metrics.3':        {fr:'intégrations avec les<br>logiciels métier', en:'integrations with<br>business software'},
  'metrics.4':        {fr:'par action<br>administrative', en:'per administrative<br>action'},

  // ── Sectors (Pour qui) ──
  'pq.eyebrow':       {fr:'Secteurs', en:'Sectors'},
  'pq.title':         {fr:'Quel que soit votre établissement, Granit s\'adapte.', en:'Whatever your facility, Granit adapts.'},
  'pq.sub':           {fr:'Des agents IA opérationnels pour chaque secteur de santé, connectés nativement à vos systèmes.', en:'Operational AI agents for every healthcare sector, natively connected to your systems.'},

  'pq.optical.title': {fr:'Centres optiques', en:'Optical centers'},
  'pq.optical.desc':  {fr:'Agents : vérification droits, reste à charge, facturation, rapprochement bancaire.', en:'Agents: eligibility check, out-of-pocket, billing, bank reconciliation.'},
  'pq.optical.t1':    {fr:'Viamedis', en:'Viamedis'},
  'pq.optical.t2':    {fr:'OptoAMC', en:'OptoAMC'},
  'pq.optical.t3':    {fr:'Facturation', en:'Billing'},

  'pq.audio.title':   {fr:'Audioprothésistes', en:'Hearing aid specialists'},
  'pq.audio.desc':    {fr:'Agents : dossiers 100% Santé, suivi remboursements, relances patients.', en:'Agents: 100% Santé files, reimbursement tracking, patient follow-ups.'},
  'pq.audio.t1':      {fr:'100% Santé', en:'100% Santé'},
  'pq.audio.t2':      {fr:'Remboursements', en:'Reimbursements'},
  'pq.audio.t3':      {fr:'Relances', en:'Follow-ups'},

  'pq.pharma.title':  {fr:'Pharmacies', en:'Pharmacies'},
  'pq.pharma.desc':   {fr:'Agents : tiers-payant, gestion des ordonnances, rejet CPAM, inventaire automatisé.', en:'Agents: third-party billing, prescription management, CPAM rejections, automated inventory.'},
  'pq.pharma.t1':     {fr:'Tiers-payant', en:'Third-party'},
  'pq.pharma.t2':     {fr:'Ordonnances', en:'Prescriptions'},
  'pq.pharma.t3':     {fr:'Rejets', en:'Rejections'},

  'pq.ehpad.title':   {fr:'EHPAD et résidences', en:'Nursing homes & residences'},
  'pq.ehpad.desc':    {fr:'Agents : facturation résidents, prises en charge, relances impayés, coordination CPAM/mutuelle.', en:'Agents: resident billing, prior auth, unpaid follow-ups, CPAM/insurer coordination.'},
  'pq.ehpad.t1':      {fr:'Facturation', en:'Billing'},
  'pq.ehpad.t2':      {fr:'Prise en charge', en:'Prior auth'},
  'pq.ehpad.t3':      {fr:'Relances', en:'Follow-ups'},

  'pq.clinic.title':  {fr:'Cliniques', en:'Clinics'},
  'pq.clinic.desc':   {fr:'Agents : recouvrement, gestion des séjours, coordination administrative.', en:'Agents: collection, stay management, administrative coordination.'},
  'pq.clinic.t1':     {fr:'Recouvrement', en:'Collection'},
  'pq.clinic.t2':     {fr:'Facturation', en:'Billing'},

  'pq.lab.title':     {fr:'Laboratoires de biologie', en:'Medical laboratories'},
  'pq.lab.desc':      {fr:'Agents : facturation CPAM, gestion des prescriptions, rejets, rapprochement caisse.', en:'Agents: CPAM billing, prescription management, rejections, cash reconciliation.'},
  'pq.lab.t1':        {fr:'Facturation', en:'Billing'},
  'pq.lab.t2':        {fr:'Prescriptions', en:'Prescriptions'},
  'pq.lab.t3':        {fr:'Rejets', en:'Rejections'},

  'pq.cabinet.title': {fr:'Cabinets médicaux', en:'Medical practices'},
  'pq.cabinet.desc':  {fr:'Agents : télétransmission FSE, suivi remboursements, relances, gestion des dépassements.', en:'Agents: FSE e-transmission, reimbursement tracking, follow-ups, excess fee management.'},
  'pq.cabinet.t1':    {fr:'FSE', en:'FSE'},
  'pq.cabinet.t2':    {fr:'Remboursements', en:'Reimbursements'},
  'pq.cabinet.t3':    {fr:'Relances', en:'Follow-ups'},

  'pq.dental.title':  {fr:'Centres dentaires', en:'Dental centers'},
  'pq.dental.desc':   {fr:'Agents : tiers-payant AMC, rejets CPAM, devis, recouvrement.', en:'Agents: AMC third-party, CPAM rejections, quotes, collection.'},
  'pq.dental.t1':     {fr:'Tiers-payant', en:'Third-party'},
  'pq.dental.t2':     {fr:'Rejets', en:'Rejections'},
  'pq.dental.t3':     {fr:'Recouvrement', en:'Collection'},

  // ── How it works ──
  'how.eyebrow':      {fr:'Comment ça marche', en:'How it works'},
  'how.title':        {fr:'Décrivez votre quotidien. Granit déploie les bons agents.', en:'Describe your daily workflow. Granit deploys the right agents.'},
  'how.s1.title':     {fr:'Décrivez votre quotidien', en:'Describe your daily workflow'},
  'how.s1.desc':      {fr:'Pas de cahier des charges. Pas de formation. Dites-nous ce qui ralentit vos équipes et Granit configure les agents adaptés à votre activité en quelques minutes. Chaque agent se connecte automatiquement à vos outils existants.', en:'No specs needed. No training required. Tell us what slows your teams down and Granit configures the right agents for your operations in minutes. Each agent auto-connects to your existing tools.'},
  'how.s2.title':     {fr:'Branché sur tout votre écosystème', en:'Plugged into your entire ecosystem'},
  'how.s2.desc':      {fr:'Granit s\'intègre à chaque brique de votre système d\'information : logiciels métier, portails AMC, SESAM-Vitale, SIH, LGO. Votre infrastructure ne change pas - Granit l\'augmente.', en:'Granit integrates with every part of your information system: business software, insurer portals, SESAM-Vitale, HIS, PMS. Your infrastructure stays the same — Granit enhances it.'},
  'how.s3.title':     {fr:'Vous dormez. Granit travaille.', en:'You sleep. Granit works.'},
  'how.s3.desc':      {fr:'Les relances partent à 8h. Les factures sont générées à 6h. Les droits sont vérifiés avant chaque rendez-vous. Configurez une fois, Granit tourne en continu - weekends et jours fériés inclus.', en:'Follow-ups go out at 8am. Invoices are generated at 6am. Eligibility is verified before every appointment. Set it up once, Granit runs continuously — weekends and holidays included.'},

  // ── Integrations ──
  'integ.eyebrow':    {fr:'Intégrations', en:'Integrations'},
  'integ.title':      {fr:'Branché sur tout votre écosystème. Sans migration.', en:'Plugged into your entire ecosystem. No migration.'},
  'integ.sub':        {fr:'Granit s\'intègre à chaque brique de votre système d\'information : logiciels métier, portails AMC, SESAM-Vitale, SIH, LGO. Plus de 50 connecteurs natifs, activables sans développement sur mesure. Votre infrastructure ne change pas - Granit l\'augmente.', en:'Granit integrates with every part of your information system: business software, insurer portals, SESAM-Vitale, HIS, PMS. Over 50 native connectors, activated without custom development. Your infrastructure stays the same — Granit enhances it.'},
  'integ.sync':       {fr:'Logiciels métier (LGO, GAP, Osiris...) - sync...', en:'Business software (PMS, GAP, Osiris...) - sync...'},

  // ── Demo ──
  'demo.eyebrow':     {fr:'Démo gratuite', en:'Free demo'},
  'demo.title':       {fr:'Voyons ce que Granit peut faire pour vous', en:'Let\'s see what Granit can do for you'},
  'demo.sub':         {fr:'15 minutes. On échange sur vos process, on identifie ce qui ralentit vos équipes - et on vous fait une proposition concrète sur comment avancer avec Granit.', en:'15 minutes. We discuss your processes, identify what slows your teams down — and give you a concrete proposal on how to move forward with Granit.'},
  'demo.name':        {fr:'Prénom et nom', en:'Full name'},
  'demo.email':       {fr:'Email professionnel', en:'Professional email'},
  'demo.phone':       {fr:'Téléphone', en:'Phone'},
  'demo.org':         {fr:'Nom de l\'établissement', en:'Facility name'},
  'demo.type':        {fr:'Type d\'établissement', en:'Facility type'},
  'demo.challenge':   {fr:'Quel est votre principal défi administratif ?', en:'What is your main administrative challenge?'},
  'demo.submit':      {fr:'Demander une démo gratuite →', en:'Request a free demo →'},
  'demo.note':        {fr:'Gratuit. Sans engagement. Réponse sous 24h.', en:'Free. No commitment. Response within 24h.'},
  'demo.success.h':   {fr:'C\'est noté !', en:'We got it!'},
  'demo.success.p':   {fr:'Notre équipe prépare votre démo personnalisée. Vous recevez un email sous 24h avec votre créneau.', en:'Our team is preparing your personalized demo. You\'ll receive an email within 24h with your time slot.'},

  // Demo form placeholders
  'demo.ph.name':     {fr:'Jean Dupont', en:'John Smith'},
  'demo.ph.email':    {fr:'jean@clinique.fr', en:'john@clinic.com'},
  'demo.ph.phone':    {fr:'+33 6 12 34 56 78', en:'+1 555 123 4567'},
  'demo.ph.org':      {fr:'Clinique du Parc', en:'Park Medical Center'},
  'demo.ph.challenge':{fr:'Ex : Le tiers-payant nous prend 3h par jour...', en:'E.g.: Third-party billing takes us 3h per day...'},

  // Demo select options
  'demo.sel.default': {fr:'Sélectionnez...', en:'Select...'},
  'demo.sel.dental':  {fr:'Centre dentaire', en:'Dental center'},
  'demo.sel.optical': {fr:'Centre optique', en:'Optical center'},
  'demo.sel.audio':   {fr:'Audioprothésiste', en:'Hearing aid specialist'},
  'demo.sel.pharma':  {fr:'Pharmacie', en:'Pharmacy'},
  'demo.sel.ehpad':   {fr:'EHPAD', en:'Nursing home'},
  'demo.sel.hospital':{fr:'Hôpital - Clinique', en:'Hospital - Clinic'},
  'demo.sel.lab':     {fr:'Laboratoire', en:'Laboratory'},
  'demo.sel.ortho':   {fr:'Orthodontie', en:'Orthodontics'},
  'demo.sel.other':   {fr:'Autre', en:'Other'},

  // ── Discover ──
  'disc.h1':          {fr:'Ce que Granit automatise aujourd\'hui', en:'What Granit automates today'},
  'disc.sub':         {fr:'Des dizaines d\'agents IA opérationnels dans les centres dentaires, optiques, EHPAD, pharmacies et hôpitaux. Chacun connecté en natif à vos systèmes. Trouvez le vôtre.', en:'Dozens of operational AI agents across dental centers, optical centers, nursing homes, pharmacies and hospitals. Each natively connected to your systems. Find yours.'},
  'disc.loadmore':    {fr:'Charger plus', en:'Load more'},

  // ── Footer ──
  'foot.privacy':     {fr:'Confidentialité', en:'Privacy'},
  'foot.cgu':         {fr:'CGU', en:'Terms'},
  'foot.cgv':         {fr:'CGV', en:'T&Cs'},
  'foot.blog':        {fr:'Blog', en:'Blog'},
  'foot.about':       {fr:'À propos', en:'About'},
  'foot.copy':        {fr:'© 2025 Granit AI - Agents IA pour les professionnels de santé', en:'© 2025 Granit AI - AI agents for healthcare professionals'},
  'foot.tagline':     {fr:'Vos équipes soignent. Granit gère le reste.', en:'Your teams care. Granit handles the rest.'},

  // ── Misc ──
  'alert.error':      {fr:'Une erreur est survenue. Veuillez réessayer.', en:'An error occurred. Please try again.'},
};

// ═══ APPLY TRANSLATIONS ═══
function applyLang(lang) {
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (T[key] && T[key][lang]) el.innerHTML = T[key][lang];
  });

  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.dataset.i18nPh;
    if (T[key] && T[key][lang]) el.placeholder = T[key][lang];
  });
}

// Apply on load
applyLang(LANG);
