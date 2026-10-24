# Gestion du contenu de la boutique

## Utilisation

- **Contenu** : accueil, textes des signatures, noms des fragrances, FAQ, Maison, navigation, pied de page, filtres, qualité, coordonnées, journal et ingrédients.
- **Collections** : accès aux textes FR/EN/AR de chaque collection. La recherche préremplie peut être effacée pour afficher le reste de l’éditorial.
- **Produits existants** : prix EUR, stock, photo, rubrique et publication dans le formulaire principal, sans validation linguistique. « Textes et traductions » dispose d’un formulaire indépendant, d’onglets FR/EN/AR et d’un bouton dédié restant visible au défilement. Ce formulaire inclut aussi le nom et la description français ; sa sauvegarde ne modifie jamais le prix ni le stock. Le formulaire commercial ne réécrit jamais les textes.
- **Paramètres** : liens vers les coordonnées et les contenus réellement modifiables, sans faux bouton d’enregistrement.

Choisir Français, English ou العربية. Modifier chaque version, puis cocher la confirmation de vérification des trois langues et publier. Il n’y a **pas de traduction automatique**, conformément au choix du propriétaire. Une modification française doit être répercutée manuellement dans les deux autres langues avant publication. Les noms EN/AR et les descriptions traduites, lorsqu’une description française existe, sont obligatoires pour enregistrer les textes ou créer un produit, mais pas pour modifier uniquement son prix ou son stock.

Les champs arabes utilisent `lang="ar"` et `dir="rtl"`. La boutique conserve son layout et ses polices arabes. Les métadonnées des pages produit/article/collection sont lues depuis les mêmes données que le contenu affiché.

## Stockage et sécurité

Aucune nouvelle migration SQL n’est nécessaire : le gestionnaire utilise la table existante `public.content_entries` avec une ligne par section et langue, clé `store:<section>`, `body` JSON et statut `published`. Les trois langues d’une section sont enregistrées par un même upsert. Les produits utilisent `products.metadata.localized` (`name`, `tagline`, `description`, `ritualNote`, `howToUse`, `vessel`) ; le nom et la description FR restent également dans les colonnes principales.

Les Server Actions vérifient la session et l’autorisation administrateur avant toute écriture. La lecture publique ne demande que les contenus publiés ; les règles RLS existantes restent actives. Le code de ce chantier n’a exécuté aucune écriture dans la base réelle.

Les textes sont rendus comme du texte React, pas du HTML arbitraire. Le JSON-LD échappe `<` pour éviter la fermeture injectée d’une balise script. Les e-mails et liens Instagram sont validés côté serveur. Les clés techniques, slugs, chemins des visuels et classes CSS ne sont pas éditables dans le formulaire de texte.

## Publication et cache

Après sauvegarde : expiration immédiate du tag `storefront-content` ou `storefront-catalog`, puis invalidation du layout localisé. La prochaine requête reçoit les données actualisées. Une page déjà ouverte chez un visiteur ne se rafraîchit pas spontanément : il faut naviguer ou recharger. Les écritures effectuées directement dans Supabase ne déclenchent pas la Server Action et utilisent le délai de cache de 120 secondes.

Les textes initiaux servent de repli lorsqu’aucun contenu publié ne remplace un champ. Une chaîne vide enregistrée reste volontairement vide. Le gestionnaire modifie les sections existantes : ce n’est pas un constructeur de mise en page, il ne crée pas de nouvelles routes, collections arbitraires, articles ou paragraphes supplémentaires. Les photos de produits restent modifiables dans Produits ; les visuels de campagnes et le design restent gérés dans le code. Éviter d’éditer la même section simultanément dans deux sessions : le dernier enregistrement remplace les trois versions de cette section.

## Vérification

`node scripts/test-storefront-content.cjs` : test isolé sans réseau ni écriture réelle, aller-retour des sections FR/EN/AR, autorisation, validation manuelle, invalidation des caches, contenu produit géré, fusion sûre et collection arabe.

TypeScript, ESLint sur les fichiers modifiés et build Webpack de production sont à exécuter avant livraison. Le build Turbopack peut être bloqué par les restrictions de ports locaux de l’environnement de développement.
