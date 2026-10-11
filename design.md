# Collection AYENA — Boutique de formations

Boutique en ligne (web) qui vend 4 ebooks-formations PDF d'AYENA Jacques, photographe et
réalisateur à Cotonou. Paiement Mobile Money via Kkiapay, livraison des PDF par lien privé
à usage unique. Direction visuelle : noir profond, blanc, orange brûlé — la même identité que
les PDF vendus, dans un écrin sombre avec halo orange (inspiration : landing page « roast »).

## Brand & Colors

- **Web**: CSS variables in `packages/web/src/web/styles.css`, dark-only (pas de thème clair).

| Token | Value | Use |
|-------|-------|-----|
| `--bg` | `#08080A` | Fond de page |
| `--bg-2` | `#0E0E11` | Sections alternées |
| `--card` | `#141418` | Cartes, panneaux |
| `--fg` | `#FFFFFF` | Texte principal |
| `--muted` | `#9C9CA6` | Texte secondaire |
| `--muted-2` | `#6E6E78` | Légendes, métadonnées |
| `--line` | `rgba(255,255,255,0.10)` | Hairlines, bordures de cartes |
| `--orange` | `#FF6A00` | Accent unique : CTA, eyebrows, chiffres |
| `--orange-soft` | `rgba(255,106,0,0.14)` | Halos, fonds d'accent |
| `--success` | `#2FBF71` | Paiement confirmé |

Le halo orange (radial gradient très diffus, `--orange-soft` → transparent) remplace toute
image de fond : il donne la chaleur du référencement sans charger la page.

## Typography

- **Display**: `Archivo Black` — titres, prix, chiffres, logotype. Toujours en capitales, `letter-spacing: -0.01em`.
- **Texte**: `Barlow` (400/500/600/700) — corps, listes, formulaires, `line-height: 1.6`.
- **Eyebrow**: Barlow 600, 11 px, capitales, `letter-spacing: 0.22em`, orange.
- Auto-hébergées dans `packages/web/public/fonts/`.

Échelle : hero `clamp(2.6rem, 7vw, 5.2rem)`, titre de section `clamp(2rem, 4vw, 3.2rem)`,
titre de carte `1.35rem`, corps `1rem`, méta `0.8rem`.

## Components

- **Bouton pilule** : bordure 1 px orange, fond transparent, texte capitales 700, `letter-spacing: .14em`,
  padding `1rem 1.9rem`, rayon 999 px. Survol : fond orange, texte noir. Variante pleine : fond orange.
- **Mot encadré** : dans un titre, un mot en orange avec un cadre 1 px orange (signature du référencement).
- **Marquee** : bandeau plein largeur, texte capitales italique orange entre deux hairlines,
  icônes d'alerte — répète les garanties.
- **Carte formation** : fond `--card`, rayon 18 px, bordure `--line`, filet orange à gauche au survol,
  eyebrow (réf + pages), titre, sous-titre, prix en Archivo Black, CTA.
- **Étape numérotée** : cercle 1 px orange, numéro en Archivo Black, titre + paragraphe.
- **Accordéon FAQ** : rangée sombre arrondie, chevron orange, ouverture en hauteur.
- **Section orange** : fond `#FF6A00`, texte noir, contient une carte noire pour le détail.

## Layout

- Largeur de contenu `max-width: 1160px`, gouttières `clamp(1.25rem, 5vw, 4rem)`.
- Rythme vertical : sections `clamp(5rem, 10vw, 9rem)`.
- Grille collection : 4 colonnes → 2 → 1.
- Nav collante en haut (logotype à gauche, liens, CTA orange à droite), fond translucide flouté.

## Pages & routes

- **/** — Accueil (`pages/index.tsx`) : hero, marquee, comment ça marche, les 4 formations, section orange « ce qui est inclus », extraits, FAQ, contact.
- **/formation/:ref** — Fiche produit (`pages/formation.tsx`) : programme des 8 modules, public visé, exercices, extrait, achat.
- **/extrait/:ref** — Extrait gratuit (`pages/extrait.tsx`) : module 1 en aperçu.
- **/conditions** — Conditions de vente (`pages/conditions.tsx`).
- **/contact** — Contact (`pages/contact.tsx`).
- **/merci** — Confirmation + téléchargement (`pages/merci.tsx`).

## Flux principal

1. Le visiteur ouvre une fiche formation et clique « Acheter ».
2. Un panneau demande un e-mail ou un numéro WhatsApp, puis ouvre le widget Kkiapay.
3. Kkiapay renvoie un `transactionId` ; le serveur vérifie le statut et le montant auprès de l'API Kkiapay.
4. Si `SUCCESS` et montant exact : commande enregistrée, jeton de téléchargement créé, redirection vers `/merci?ref=…&token=…`.
5. Le clic de téléchargement passe par `GET /api/download/:token` : le jeton est consommé (usage unique, 48 h) et le PDF est servi depuis `packages/web/private/ebooks/`.

### Mode dégradé : commande par WhatsApp

Tant que `KKIAPAY_PUBLIC_KEY` / `KKIAPAY_PRIVATE_KEY` / `KKIAPAY_SECRET_KEY` sont vides
(`kkiapayConfigured === false`), la boutique ne propose pas le widget : le panneau d'achat
affiche à la place un bouton WhatsApp pré-rempli (référence, titre, prix) et la copie du site
s'adapte (étapes « Comment ça marche », FAQ, conditions de vente, pied de page). Dès que les
clés sont renseignées dans `.env`, tout bascule automatiquement sur le paiement en ligne —
aucune autre modification n'est nécessaire.

Le catalogue reste la seule source de vérité pour les prix : le serveur compare le montant
renvoyé par Kkiapay au prix de `src/api/catalog.ts`, jamais à une valeur envoyée par le client.

## Architecture

- **API**: oRPC (`catalog`, `orders`) + une route HTTP brute pour le téléchargement. Drizzle + Turso pour `orders` et `download_tokens`.
- **Front**: React + Wouter + TanStack Query, hooks dans `src/web/queries/`.
- **Paiement**: widget Kkiapay côté client (`https://cdn.kkiapay.me/k.js`), vérification serveur obligatoire.
