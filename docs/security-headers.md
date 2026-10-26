# En-têtes du site public

Les règles Nitro ajoutent les en-têtes au serveur et à la sortie Vercel :
`nosniff`, politique de référent explicite, restrictions des permissions,
HSTS et CSP limitant les objets, la base URL, les formulaires et les iframes.
Le hook final de réponse réapplique ces en-têtes aux erreurs et 404 produites
par le rendu SSR. Les règles CDN couvrent également les ressources statiques.

Un middleware intercepte les chemins de scan inutilisés (`/.env`, `/.git`,
WordPress, `/admin`, outils de DB). Il renvoie une 404 fixe, sans lire le corps
ni journaliser les cookies, headers, valeurs de paramètres ou segments de chemin
arbitraires. Les événements JSON `security.honeypot` portent `service_name=landing`
et sont limités à 60 par minute et par instance. Les réponses normales du site
et les formulaires existants conservent leur traitement.

Les pages ne peuvent pas être intégrées sur un autre site : `SAMEORIGIN` et
`frame-ancestors 'self'` s’appliquent uniformément. Les iframes locales de la
page d’accueil et de `/demo` continuent à fonctionner, sans règles de priorité
concurrentes dans la sortie Vercel. Le proxy PostHog `/rel` est conservé.

La CSP ne restreint pas encore `script-src` : le rendu TanStack émet des scripts
inline d’hydratation. Une future politique de scripts stricte doit intégrer des
nonces côté SSR et être vérifiée avec les formulaires, l’analytics et la démo.
Il ne faut pas annoncer ce confinement comme une protection complète contre XSS.

Après déploiement :

```sh
node scripts/check-security-headers.mjs https://www.getgranit.ai
```

Vérifier dans un navigateur l’affichage de la démo sur `/` et `/demo`, la
navigation et le formulaire de demande de démo sans envoyer de demande de test.
Les ressources statiques et les 404 sont également contrôlées. Le contrôle ne
modifie aucune donnée et ne soumet aucun formulaire.
