/**
 * Catalogue des formations de la collection AYENA.
 * Source unique : la boutique (web) et l'API lisent ce fichier.
 * Aucun chiffre ni promesse de revenu n'est inventé ici — tout vient du contenu des PDF.
 */

export type EbookModule = {
  n: number;
  title: string;
  detail: string;
};

export type EbookSection = {
  title: string;
  items: string[];
};

export type Ebook = {
  ref: string;
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  subtitle: string;
  price: number;
  pages: number;
  audience: string[];
  modules: EbookModule[];
  exercises: string[];
  includes: string[];
  excerpt: {
    moduleTitle: string;
    intro: string;
    sections: EbookSection[];
    note: string;
  };
};

export const EBOOKS: Ebook[] = [
  {
    ref: "E-01",
    slug: "e-commerce",
    title: "Lancer son e-commerce depuis l'Afrique",
    shortTitle: "E-commerce",
    tagline: "Formation pratique · Bénin et Afrique francophone",
    subtitle:
      "Produit, fournisseurs, budget, paiement, livraison et premières ventes — la méthode complète, chiffres en francs CFA à l'appui.",
    price: 5000,
    pages: 24,
    audience: [
      "Tu veux vendre en ligne sans stock de départ important",
      "Tu as déjà un petit commerce et veux vendre hors de ton quartier",
      "Tu veux savoir ce que tu gagnes vraiment, ligne par ligne",
    ],
    modules: [
      { n: 1, title: "Choisir un produit qui se vend vraiment", detail: "Les cinq critères mesurables, quatre familles qui tournent au Bénin, tester la demande en 48 heures." },
      { n: 2, title: "Trouver et contrôler ses fournisseurs", detail: "Sourcer sans se faire arnaquer, vérifier avant de payer, négocier les premiers lots." },
      { n: 3, title: "Calculer ton budget de départ réel", detail: "Ce qu'il faut vraiment pour commencer, poste par poste, sans se raconter d'histoires." },
      { n: 4, title: "Construire une boutique qui convertit", detail: "Photos, fiches produit, prix affiché, page qui répond aux questions avant qu'on les pose." },
      { n: 5, title: "Encaisser l'argent sans te faire piéger", detail: "Mobile Money, carte, acompte, paiement à la livraison : les règles qui protègent ta marge." },
      { n: 6, title: "Livrer sans perdre d'argent", detail: "Frais réels, colis refusés, zones rentables, ce qu'il faut facturer et ce qu'il faut refuser." },
      { n: 7, title: "Trouver tes premiers clients sans budget", detail: "Groupes WhatsApp, bouche-à-oreille organisé, contenu qui vend, relances qui ne harcèlent pas." },
      { n: 8, title: "Servir, fidéliser et tenir tes comptes", detail: "Réclamations, clients qui reviennent, tableau de suivi et six signaux d'alerte." },
    ],
    exercises: [
      "Grille des cinq critères appliquée à trois produits candidats",
      "Tableau de budget de départ chiffré",
      "Fiche produit complète, prête à publier",
      "Tableau de bord mensuel des ventes et des marges",
    ],
    includes: [
      "8 modules et 24 pages au format PDF",
      "Un plan d'action de 30 jours, semaine par semaine",
      "Fiches pratiques : messages types, grille fournisseur, checklist de lancement",
      "Sources et limites, consultées en octobre 2026",
    ],
    excerpt: {
      moduleTitle: "Module 1 — Choisir un produit qui se vend vraiment",
      intro:
        "Un bon produit de départ n'est pas le produit le plus tendance. C'est celui qui remplit cinq conditions mesurables : une marge suffisante, un poids faible, une demande vérifiable, une garantie simple et un prix que ton client peut payer sans réfléchir des semaines.",
      sections: [
        {
          title: "Les cinq critères à vérifier avant d'acheter",
          items: [
            "Marge brute d'au moins 40 % — acheter 5 000 F CFA pour revendre 6 000 F CFA n'est pas un business.",
            "Poids et volume faibles — un carton léger se livre à moto pour quelques centaines de francs.",
            "Demande vérifiable — tu dois pouvoir citer dix personnes qui ont acheté ce type de produit récemment.",
            "Aucune contrainte lourde — pas de péremption, pas de garantie constructeur, pas de pièce fragile.",
            "Prix de vente entre 3 000 et 25 000 F CFA — en dessous, les frais tuent la marge ; au-dessus, la décision traîne.",
          ],
        },
        {
          title: "Quatre familles qui tournent au Bénin",
          items: [
            "Accessoires téléphone : coques, chargeurs, écouteurs, supports — rotation rapide, guerre des prix.",
            "Beauté et soins : perruques, mèches, soins capillaires, parfums — achat répété, sourcing à contrôler.",
            "Mode et textile : pagne, prêt-à-porter femme, sacs — forte demande, saisonnalité à gérer.",
            "Maison et bébé : ustensiles, rangement, puériculture — achat utile, volume et poids à surveiller.",
          ],
        },
      ],
      note:
        "Vérifier la demande en 48 heures, sans capital : publie photo, prix et délai dans trois groupes de ta ville. Compte les réponses qui demandent le prix ou les modalités — pas les « j'aime ». Vingt messages privés en 48 heures, c'est un signal correct. Zéro, c'est un refus du marché : change de produit, pas de prix.",
    },
  },
  {
    ref: "E-02",
    slug: "tiktok",
    title: "Gagner de l'argent avec TikTok depuis l'Afrique",
    shortTitle: "TikTok",
    tagline: "Formation pratique · Bénin et Afrique francophone",
    subtitle:
      "Ce qui est réellement payé, ce qui ne l'est pas, et les six revenus que tu peux construire depuis le Bénin — conditions officielles à l'appui.",
    price: 3000,
    pages: 24,
    audience: [
      "Tu publies déjà et tu veux savoir ce qui peut vraiment payer",
      "Tu vends un service et veux des clients, pas seulement des vues",
      "Tu veux éviter les arnaques qui visent les créateurs africains",
    ],
    modules: [
      { n: 1, title: "La vérité sur les paiements de TikTok", detail: "Les conditions officielles du Creator Rewards Program, pays par pays, et pourquoi mentir sur sa localisation coûte tout." },
      { n: 2, title: "Cadeaux LIVE, abonnements, TikTok Shop", detail: "Ce qui est ouvert au Bénin aujourd'hui, ce qui ne l'est pas, et comment le vérifier toi-même dans l'application." },
      { n: 3, title: "Les six revenus réellement accessibles", detail: "Services vidéo, gestion de comptes, partenariats locaux, formation, produits, revente de contenu." },
      { n: 4, title: "Comprendre l'algorithme sans mythe", detail: "Rétention, répétition, signaux réels — et les croyances qui font perdre du temps." },
      { n: 5, title: "Fabriquer des vidéos qui retiennent", detail: "Structure en cinq blocs, accroche, rythme, texte à l'écran, montage au téléphone." },
      { n: 6, title: "Vendre un service grâce à TikTok", detail: "Offre en une ligne, profil qui convertit, messages privés qui deviennent des devis." },
      { n: 7, title: "Partenariats de marque et tarifs", detail: "Trois façons de facturer, ce qu'on demande à une marque, droits d'usage et acompte." },
      { n: 8, title: "Sécurité, droits, fiscalité, arnaques", detail: "Six arnaques courantes, validation en deux étapes, TPS à 5 % et création d'entreprise à 10 000 F CFA." },
    ],
    exercises: [
      "Vérification de tes éligibilités dans l'application, écran par écran",
      "Choix de ta source de revenu principale parmi les six",
      "Écriture de ton offre en une phrase, avec un prix",
      "Script de trois vidéos et plan de relance client",
    ],
    includes: [
      "8 modules et 24 pages au format PDF",
      "Un plan d'action de 30 jours, semaine par semaine",
      "Fiches pratiques : scripts, offre en une ligne, modèles de messages",
      "Sources et limites, consultées en octobre 2026",
    ],
    excerpt: {
      moduleTitle: "Module 1 — La vérité sur les paiements de TikTok",
      intro:
        "Commencer par la fin : la rémunération directe des vues n'est pas disponible depuis le Bénin. Voici les conditions officielles, pour que tu puisses vérifier toi-même plutôt que d'y croire sur parole.",
      sections: [
        {
          title: "Les conditions du Creator Rewards Program",
          items: [
            "Pays éligibles : États-Unis, Royaume-Uni, Allemagne, Japon, Corée du Sud, France, Mexique, Brésil.",
            "Audience exigée : 10 000 abonnés et 100 000 vues sur 30 jours, compte personnel de 18 ans minimum.",
            "Contenu : original, de plus d'une minute, 1080p minimum — duos, montages d'autres vidéos et contenus sponsorisés exclus.",
            "Être résident d'un pays éligible est une condition d'entrée, pas un détail administratif.",
          ],
        },
        {
          title: "Pourquoi il ne faut jamais mentir sur sa localisation",
          items: [
            "Carte SIM étrangère, VPN ou compte d'un proche : la vérification d'identité peut être refusée.",
            "Conséquences réelles : paiement bloqué, compte suspendu, revenus accumulés perdus.",
            "Tu construirais ton activité sur un compte que tu peux perdre en une nuit.",
          ],
        },
      ],
      note:
        "La règle de cette formation : aucune méthode qui dépend d'un mensonge sur ton identité ou ton pays. Ce qui se construit sur une fausse déclaration ne t'appartient pas.",
    },
  },
  {
    ref: "E-03",
    slug: "video-ia",
    title: "Créer des vidéos avec l'IA sans payer pour commencer",
    shortTitle: "Vidéo IA",
    tagline: "Formation pratique · Bénin et Afrique francophone",
    subtitle:
      "Outils gratuits, quotas réels, limites à connaître et méthode de montage au téléphone — avec les droits et les mentions à respecter.",
    price: 2000,
    pages: 24,
    audience: [
      "Tu veux produire des vidéos propres sans abonnement au départ",
      "Tu veux comprendre ce que l'IA rate encore, pour ne pas perdre de temps",
      "Tu produis pour des clients et tu veux rester dans les règles",
    ],
    modules: [
      { n: 1, title: "Ce que l'IA fait bien, et ce qu'elle rate", detail: "Les tâches où elle fait gagner du temps, et les cinq échecs encore fréquents." },
      { n: 2, title: "Écrire le script et le plan de montage", detail: "Prompts à copier, structure en cinq blocs, découpage en plans tournables." },
      { n: 3, title: "La voix : gratuite, mais sous conditions", detail: "Voix off au téléphone, voix de synthèse, quotas gratuits et licences commerciales." },
      { n: 4, title: "Les images générées sans payer", detail: "Décors, illustrations, arrière-plans retirés, et comment éviter les détails qui trahissent." },
      { n: 5, title: "Les vidéos générées : quotas réels", detail: "Ce que les offres gratuites permettent réellement, et quand le plan gratuit bloque une commande." },
      { n: 6, title: "Monter gratuitement, proprement", detail: "Montage au téléphone, rythme, coupes, textes à l'écran, export 1080p vertical." },
      { n: 7, title: "Son, sous-titres, habillage", detail: "Niveaux sonores, sous-titres automatiques corrigés, habillage léger qui fait pro." },
      { n: 8, title: "Droits, mentions, et quand payer", detail: "Licences, contenus signalés comme générés, personne réelle jamais imitée, passage au payant calculé." },
    ],
    exercises: [
      "Test de trois outils gratuits sur une même idée",
      "Script complet de 30 secondes, prêt à tourner",
      "Montage d'une vidéo de bout en bout au téléphone",
      "Checklist de publication : mentions, droits, fichiers sources",
    ],
    includes: [
      "8 modules et 24 pages au format PDF",
      "Un plan d'action de 7 jours pour ta première vidéo",
      "Fiches pratiques : prompts à copier, réglages d'export, checklist avant publication",
      "Sources et limites, consultées en octobre 2026",
    ],
    excerpt: {
      moduleTitle: "Module 1 — Ce que l'IA fait bien, et ce qu'elle rate",
      intro:
        "Commencer par les limites évite de perdre trois semaines. Voici ce qui fonctionne aujourd'hui et ce qui échoue encore, sur un téléphone, avec des outils gratuits.",
      sections: [
        {
          title: "Ce qui marche très bien",
          items: [
            "Écrire un script court à partir d'une idée — 30 à 60 minutes gagnées, avec quelques corrections.",
            "Générer une voix off en français — correcte, parfois mécanique, immédiate.",
            "Créer un décor ou une image d'illustration — bonne qualité en plusieurs essais.",
            "Sous-titrer automatiquement une vidéo — très bonne en français standard.",
            "Retirer l'arrière-plan d'une image — quelques secondes.",
          ],
        },
        {
          title: "Ce qui échoue encore régulièrement",
          items: [
            "Les mains et les détails : doigts supplémentaires, objets qui fondent — évite les gros plans de mains en mouvement.",
            "Les textes écrits dans l'image : les lettres déformées trahissent immédiatement une image générée.",
            "La cohérence d'un personnage d'un plan à l'autre, sans travail supplémentaire.",
            "Les mouvements longs : au-delà de quelques secondes, la vidéo dérive.",
            "La réalité locale : pour ton marché, tes propres images restent supérieures.",
          ],
        },
      ],
      note:
        "Un abonnement de 20 dollars par mois ne se justifie que s'il débloque une commande de 30 000 F CFA. Sinon, tu paies un outil que tu n'exploites pas.",
    },
  },
  {
    ref: "E-04",
    slug: "independance",
    title: "Construire son indépendance financière avant 25 ans",
    shortTitle: "Indépendance",
    tagline: "Formation pratique · Bénin et Afrique francophone",
    subtitle:
      "Compétences, premiers revenus, prix, épargne, gestion des risques — la méthode pour tenir douze mois sans dépendre d'une seule source.",
    price: 4000,
    pages: 24,
    audience: [
      "Tu débutes et tu veux un premier revenu régulier, pas un rêve",
      "Tu gagnes déjà un peu et ton argent disparaît sans trace",
      "Tu veux sortir de la dépendance à une seule source de revenu",
    ],
    modules: [
      { n: 1, title: "Connaître tes chiffres réels", detail: "Le tableau revenus et dépenses, les trois chiffres à connaître par cœur." },
      { n: 2, title: "Choisir une compétence qui se vend", detail: "Critères de choix, les 100 heures, comment prouver ton travail sans diplôme." },
      { n: 3, title: "Gagner ton premier revenu", detail: "Premier client, offre simple, livraison soignée, témoignage écrit." },
      { n: 4, title: "Fixer tes prix et te faire payer", detail: "Grille de prix, acompte, devis, relances, clients qui paient en retard." },
      { n: 5, title: "Épargner et sécuriser ton argent", detail: "Fonds d'urgence, séparation quotidien/activité, coffres et Mobile Money." },
      { n: 6, title: "Investir sans te faire arnaquer", detail: "Reconnaître les promesses impossibles, réinvestir dans l'activité d'abord." },
      { n: 7, title: "Protéger ta santé et ton avenir", detail: "Réserve de santé, cotisation, ce qu'un mois d'arrêt coûte vraiment." },
      { n: 8, title: "Tenir le cap pendant 12 mois", detail: "Rendez-vous mensuel de 30 minutes, quatre indicateurs, les pièges qui font reculer." },
    ],
    exercises: [
      "Tableau revenus et dépenses rempli, reste réel calculé",
      "Choix de la compétence et créneau de 100 heures",
      "Offre écrite en une phrase avec un prix de départ",
      "Plan personnel à 12 mois, chiffré et daté",
    ],
    includes: [
      "8 modules et 24 pages au format PDF",
      "Un plan d'action de 12 mois, objectif par objectif",
      "Fiches pratiques : tableau de suivi, grille de prix, modèles à remplir",
      "Sources et limites, consultées en octobre 2026",
    ],
    excerpt: {
      moduleTitle: "Module 1 — Connaître tes chiffres réels",
      intro:
        "Tu ne peux pas piloter ce que tu ne mesures pas. Ce module installe le tableau que tu tiendras tous les mois, et il commence par une vérité désagréable : la plupart des gens sous-estiment leurs dépenses de 30 %.",
      sections: [
        {
          title: "Le tableau des revenus et dépenses",
          items: [
            "Entrées : revenus réguliers, revenus irréguliers — total à écrire noir sur blanc.",
            "Sorties : logement, nourriture, transport, téléphone, dépenses de statut, aide familiale.",
            "Reste réel = entrées − sorties : c'est ce chiffre qui décide de tout.",
            "L'exemple complet du PDF montre un reste de 10 000 F CFA sur 105 000 F CFA d'entrées.",
          ],
        },
        {
          title: "Les trois chiffres à connaître par cœur",
          items: [
            "Ton revenu mensuel moyen des trois derniers mois, irrégularités comprises.",
            "Tes dépenses mensuelles incompressibles : ce que tu dois payer même si tu ne gagnes rien.",
            "Ton fonds d'urgence actuel, en nombre de mois de dépenses couvertes.",
          ],
        },
      ],
      note:
        "Écris tes chiffres réels, pas tes chiffres espérés. Un budget qui ne correspond pas à ta vie ne sert à rien : il sera abandonné en deux semaines.",
    },
  },
];

export function findEbook(ref: string): Ebook | undefined {
  const key = ref.trim().toLowerCase();
  return EBOOKS.find(
    (e) => e.ref.toLowerCase() === key || e.slug.toLowerCase() === key,
  );
}

/** Prix au format F CFA : 5000 -> « 5 000 F CFA » (espace insécable entre les milliers). */
export function formatPrice(price: number): string {
  const grouped = String(Math.round(price)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${grouped} F CFA`;
}

/**
 * Fichier PDF livré pour chaque formation. Les PDF vivent dans
 * `packages/web/private/ebooks/` — hors du dossier public, donc sans URL directe.
 */
const EBOOK_FILES: Record<string, string> = {
  "E-01": "01-ecommerce.pdf",
  "E-02": "02-tiktok.pdf",
  "E-03": "03-ia-video.pdf",
  "E-04": "04-independance.pdf",
};

/** Nom du fichier PDF d'une formation, à partir de sa référence ou de son slug. */
export function ebookFileName(ref: string): string | undefined {
  const ebook = findEbook(ref);
  return ebook ? EBOOK_FILES[ebook.ref] : undefined;
}

export const CONTACT = {
  author: "AYENA Jacques",
  role: "Photographe, vidéaste et réalisateur de clips — Cotonou, Bénin",
  whatsapp: "+229 01 53 61 66 60",
  whatsappLink: "https://wa.me/2290153616660",
};
