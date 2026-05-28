import type {
  BudgetComment,
  GeneralChecklistQuestion,
  RecommendationResult,
  WizardQuestion,
} from "@/lib/stationRecommendationData";

export type TranslatedChecklistLocale = "en" | "fr";

export interface ChecklistLocaleContent {
  overview: {
    heroLabel: string;
    heroTitle: string;
    subtitle: string;
    notice: string;
    cardLabel: string;
    cardTitle: string;
    cardDescription: string[];
    cardButton: string;
    departureHeading: string;
  };
  departureTypes: Array<{
    title: string;
    description: string;
    button: string;
    action: "working" | "language" | "study";
    notice?: string;
  }>;
  workingIntro: {
    label: string;
    title: string;
    paragraphs: string[];
  };
  wizardLabels: {
    workingTitle: string;
    generalTitle: string;
    previous: string;
    start: string;
    next: string;
    showResult: string;
  };
  workingResult: {
    eyebrow: string;
    title: string;
    explanation: string[];
    stationTitle: string;
    reasonTitle: string;
    nearbyTitle: string;
    goodForTitle: string;
    cautionLabel: string;
    viewListings: string;
    startChecklist: string;
    retake: string;
    support: string;
    supportNotice: string;
  };
  generalChecklist: {
    eyebrow: string;
    title: string;
    intro: string[];
    emptyHint: string;
  };
  generalResult: {
    eyebrow: string;
    title: string;
    subtitle: string;
    checkedTitle: string;
    emptyChecked: string;
    noItems: string;
    listingTitle: string;
    noListing: string[];
    retake: string;
    viewListings: string;
    support: string;
    supportNotice: string;
  };
  housingGuide: {
    title: string;
    items: Array<{ title: string; body: string }>;
  };
  legalScopeNoticeLines: string[];
  workingQuestions: WizardQuestion[];
  generalQuestions: GeneralChecklistQuestion[];
  budgetComments: Record<string, BudgetComment>;
  recommendationResults: Record<string, RecommendationResult>;
}

const englishWorkingQuestions: WizardQuestion[] = [
  {
    id: "work",
    title: "Q1. What kind of work are you most likely to look for?",
    options: [
      {
        value: "koreanJob",
        label: "Korean-owned or Korean community businesses",
        description:
          "You are open to Korean restaurants, cafes, markets, or community-based jobs.",
      },
      {
        value: "localService",
        label: "Local retail or service jobs",
        description: "You want to look first at local retail, cafes, restaurants, or service jobs.",
      },
      {
        value: "officeAdmin",
        label: "Office, admin, or desk-based work if possible",
        description: "You would like to try office, admin, or desk-based work if possible.",
      },
      {
        value: "unknownMobility",
        label: "Not sure yet",
        description: "You want to start with a flexible and easy-to-compare area.",
      },
    ],
  },
  {
    id: "budget",
    title: "Q2. What monthly rent range are you considering?",
    intro:
      "Canadian dollar prices may be hard to estimate at first. For this MVP preview, MapleHouse uses a simple estimate of 1 CAD ≈ 1,000 KRW.",
    notice:
      "This is monthly rent only. Deposit, first month cost, living expenses, and transit costs should be considered separately.",
    footerNote:
      "KRW amounts are simple MVP estimates based on 1 CAD ≈ 1,000 KRW. Actual exchange rates and payment amounts may differ.",
    options: [
      {
        value: "budget1",
        label: "C$400-600 / approx. ₩400,000-600,000",
        description:
          "Ultra-low budget range. Options may be very limited and require significant compromises.",
      },
      {
        value: "budget2",
        label: "C$600-900 / approx. ₩600,000-900,000",
        description: "A practical range for budget room rentals.",
      },
      {
        value: "budget3",
        label: "C$900-1,200 / approx. ₩900,000-1,200,000",
        description: "A realistic range for comparing room rental options.",
      },
      {
        value: "budget4",
        label: "C$1,200-1,800 / approx. ₩1,200,000-1,800,000",
        description:
          "You may be able to compare better room rentals, basements, or some private-space options.",
      },
      {
        value: "budget5",
        label: "C$1,800+ / approx. ₩1,800,000+",
        description:
          "You may be able to consider studios, condos, or more private housing options.",
      },
    ],
  },
  {
    id: "priority",
    title: "Q3. If you had to choose one, what matters most?",
    options: [
      {
        value: "priorityCost",
        label: "Cost",
        description: "Keeping rent and living costs low is most important.",
      },
      {
        value: "priorityMobility",
        label: "Commute / mobility",
        description: "Reducing daily route stress is most important.",
      },
      {
        value: "priorityCommunity",
        label: "Community",
        description: "Korean food, information, community, or emotional familiarity matters.",
      },
      {
        value: "priorityStability",
        label: "Comfort / stability",
        description: "You prefer an area that feels less unfamiliar or overwhelming.",
      },
    ],
  },
  {
    id: "koreanLife",
    title: "Q4. How important is access to Korean community areas?",
    intro:
      "Korean community access means Korean food, Korean stores, community information, and familiar support channels.",
    options: [
      {
        value: "koreanHigh",
        label: "Very important",
        description:
          "At first, access to Korean information and community areas feels necessary.",
      },
      {
        value: "koreanMedium",
        label: "Helpful, but not essential",
        description: "It would help, but you do not need to live directly near it.",
      },
      {
        value: "koreanLow",
        label: "Not very important",
        description: "You prefer to experience more local living areas.",
      },
    ],
  },
  {
    id: "downtown",
    title: "Q5. How often do you expect to go downtown?",
    options: [
      {
        value: "downtownDaily",
        label: "Almost every day",
        description: "You expect to go downtown often for work, school, errands, or social plans.",
      },
      {
        value: "downtownWeekly",
        label: "Two or three times a week",
        description: "You may go downtown regularly, but not every day.",
      },
      {
        value: "downtownRare",
        label: "Occasionally",
        description: "You only need to go downtown when necessary.",
      },
    ],
  },
];

const frenchWorkingQuestions: WizardQuestion[] = [
  {
    id: "work",
    title: "Q1. Quel type de travail pensez-vous rechercher en priorité ?",
    options: [
      {
        value: "koreanJob",
        label: "Commerces coréens ou liés à la communauté coréenne",
        description:
          "Vous êtes ouvert aux restaurants, cafés, marchés ou emplois liés à la communauté coréenne.",
      },
      {
        value: "localService",
        label: "Commerce local ou services",
        description:
          "Vous souhaitez d’abord regarder les emplois dans le commerce, les cafés, les restaurants ou les services locaux.",
      },
      {
        value: "officeAdmin",
        label: "Bureau, administration ou travail de bureau si possible",
        description: "Vous aimeriez essayer un poste de bureau ou administratif si possible.",
      },
      {
        value: "unknownMobility",
        label: "Je ne sais pas encore",
        description: "Vous souhaitez commencer par une zone flexible et facile à comparer.",
      },
    ],
  },
  {
    id: "budget",
    title: "Q2. Quelle fourchette de loyer mensuel envisagez-vous ?",
    intro:
      "Les prix en dollars canadiens peuvent être difficiles à estimer au début. Pour cet aperçu MVP, MapleHouse utilise une estimation simple : 1 CAD ≈ 1 000 KRW.",
    notice:
      "Ce montant concerne uniquement le loyer mensuel. Le dépôt, le premier mois, les frais de vie et les transports doivent être considérés séparément.",
    footerNote:
      "Les montants en KRW sont des estimations simples pour le MVP, basées sur 1 CAD ≈ 1 000 KRW. Les taux de change et montants réels peuvent varier.",
    options: [
      {
        value: "budget1",
        label: "C$400-600 / environ ₩400 000-600 000",
        description:
          "Budget très bas. Les options peuvent être très limitées et demander beaucoup de compromis.",
      },
      {
        value: "budget2",
        label: "C$600-900 / environ ₩600 000-900 000",
        description: "Une fourchette pratique pour chercher une chambre en location économique.",
      },
      {
        value: "budget3",
        label: "C$900-1 200 / environ ₩900 000-1 200 000",
        description: "Une fourchette réaliste pour comparer des chambres en location.",
      },
      {
        value: "budget4",
        label: "C$1 200-1 800 / environ ₩1 200 000-1 800 000",
        description:
          "Vous pouvez comparer de meilleures chambres, des sous-sols ou certaines options avec espace privé.",
      },
      {
        value: "budget5",
        label: "C$1 800+ / environ ₩1 800 000+",
        description:
          "Vous pouvez envisager des studios, condos ou logements avec davantage d’espace privé.",
      },
    ],
  },
  {
    id: "priority",
    title: "Q3. Si vous deviez choisir un seul critère, lequel serait le plus important ?",
    options: [
      {
        value: "priorityCost",
        label: "Coût",
        description: "Réduire le loyer et les frais de vie est le plus important.",
      },
      {
        value: "priorityMobility",
        label: "Trajet / mobilité",
        description: "Réduire le stress lié aux déplacements quotidiens est le plus important.",
      },
      {
        value: "priorityCommunity",
        label: "Communauté",
        description:
          "La nourriture coréenne, les informations, la communauté ou un environnement familier sont importants.",
      },
      {
        value: "priorityStability",
        label: "Confort / stabilité",
        description: "Vous préférez une zone qui semble moins inconnue ou moins déstabilisante.",
      },
    ],
  },
  {
    id: "koreanLife",
    title: "Q4. L’accès à la communauté coréenne est-il important pour vous ?",
    intro:
      "L’accès à la communauté coréenne signifie nourriture coréenne, commerces coréens, informations communautaires et canaux d’aide familiers.",
    options: [
      {
        value: "koreanHigh",
        label: "Très important",
        description:
          "Au début, l’accès aux informations et à la communauté coréenne semble nécessaire.",
      },
      {
        value: "koreanMedium",
        label: "Utile, mais pas indispensable",
        description:
          "Cela peut aider, mais vous n’avez pas besoin de vivre directement à proximité.",
      },
      {
        value: "koreanLow",
        label: "Pas très important",
        description: "Vous préférez découvrir davantage les zones de vie locales.",
      },
    ],
  },
  {
    id: "downtown",
    title: "Q5. À quelle fréquence pensez-vous aller au centre-ville ?",
    options: [
      {
        value: "downtownDaily",
        label: "Presque tous les jours",
        description:
          "Vous pensez aller souvent au centre-ville pour le travail, les études, les courses ou les sorties.",
      },
      {
        value: "downtownWeekly",
        label: "Deux ou trois fois par semaine",
        description: "Vous pourriez y aller régulièrement, mais pas tous les jours.",
      },
      {
        value: "downtownRare",
        label: "Occasionnellement",
        description: "Vous avez seulement besoin d’y aller quand c’est nécessaire.",
      },
    ],
  },
];

const englishGeneralQuestions: GeneralChecklistQuestion[] = [
  {
    id: "location",
    title: "Q1. Does this location fit your purpose?",
    resultTitle: "Location and daily route",
    options: [
      "This location is connected to my main purpose.",
      "I checked real travel time to places I need to visit often.",
      "I considered whether morning/evening travel fatigue is manageable.",
      "I understand what I gain by choosing this area.",
      "I understand what I give up by choosing this area.",
      "I have not checked location and daily routes enough yet.",
    ],
  },
  {
    id: "budgetLife",
    title: "Q2. Can this budget support real living costs?",
    resultTitle: "Budget and living costs",
    options: [
      "I did not decide based on rent alone.",
      "I considered transit, food, and initial settlement costs.",
      "I checked whether a cheap-looking listing may increase travel cost or stress.",
      "I checked whether I am accepting too many compromises to save rent.",
      "I considered whether this price is sustainable for my stay period.",
      "I have not calculated costs beyond rent enough yet.",
    ],
  },
  {
    id: "beginnerFit",
    title: "Q3. Is this a manageable choice for someone arriving for the first time?",
    resultTitle: "First-arrival fit",
    options: [
      "This location seems manageable for building a daily routine after arrival.",
      "There are ways to get information or ask for help if something goes wrong.",
      "The landlord or provider’s communication method is clear.",
      "I did not ignore conditions I did not understand.",
      "I am choosing this listing because it fits my situation, not just because it looks good.",
      "I have not judged this from a first-time arrival perspective enough yet.",
    ],
  },
  {
    id: "trustSignals",
    title: "Q4. Have you checked MapleScore (listing trust score)?",
    resultTitle: "MapleScore",
    options: [
      "I checked the registration date and last checked date.",
      "I can confirm whether the listing is still available.",
      "Photos, description, and price do not conflict in a strange way.",
      "The landlord or provider is not rushing me to send money or decide quickly.",
      "They are not strongly pushing me to communicate or transact only outside the platform.",
      "They are not asking for a large payment before any visit or video check.",
      "I have not checked MapleScore enough yet.",
    ],
  },
  {
    id: "finalDecision",
    title: "Q5. Am I ready to make a judgment?",
    resultTitle: "Final judgment",
    options: [
      "I can explain the biggest benefit of choosing this listing.",
      "I understand the biggest downside I may need to accept.",
      "I know why this listing may be better than other candidates.",
      "I am ready to ask the landlord about uncertain points.",
      "If I cannot judge this alone, I may need MapleHouse-assisted inquiry.",
      "I still find it difficult to judge this alone.",
    ],
  },
];

const frenchGeneralQuestions: GeneralChecklistQuestion[] = [
  {
    id: "location",
    title: "Q1. Cet emplacement correspond-il à votre objectif ?",
    resultTitle: "Emplacement et trajets quotidiens",
    options: [
      "Cet emplacement est lié à mon objectif principal.",
      "J’ai vérifié le temps de trajet réel vers les lieux où je dois aller souvent.",
      "J’ai réfléchi à la fatigue possible des trajets du matin et du soir.",
      "Je comprends ce que je gagne en choisissant cette zone.",
      "Je comprends ce que je dois accepter ou abandonner en choisissant cette zone.",
      "Je n’ai pas encore assez vérifié l’emplacement et les trajets quotidiens.",
    ],
  },
  {
    id: "budgetLife",
    title: "Q2. Ce budget permet-il de couvrir la vie réelle ?",
    resultTitle: "Budget et frais de vie",
    options: [
      "Je n’ai pas décidé uniquement en regardant le loyer.",
      "J’ai pris en compte les transports, la nourriture et les frais d’installation.",
      "J’ai vérifié si une annonce peu chère risque d’augmenter les frais de transport ou le stress.",
      "J’ai vérifié si je fais trop de compromis seulement pour réduire le loyer.",
      "J’ai réfléchi à la durabilité de ce prix pendant toute la durée de mon séjour.",
      "Je n’ai pas encore assez calculé les coûts au-delà du loyer.",
    ],
  },
  {
    id: "beginnerFit",
    title: "Q3. Est-ce un choix gérable pour une première arrivée ?",
    resultTitle: "Adaptation à une première arrivée",
    options: [
      "Cet emplacement semble gérable pour construire une routine après l’arrivée.",
      "Il existe des moyens d’obtenir des informations ou de demander de l’aide en cas de problème.",
      "Le mode de communication avec le propriétaire ou le fournisseur est clair.",
      "Je n’ai pas ignoré des conditions que je ne comprenais pas.",
      "Je choisis cette annonce parce qu’elle correspond à ma situation, pas seulement parce qu’elle semble intéressante.",
      "Je n’ai pas encore assez évalué cette annonce du point de vue d’une première arrivée.",
    ],
  },
  {
    id: "trustSignals",
    title: "Q4. Avez-vous vérifié le MapleScore (score de fiabilité du logement) ?",
    resultTitle: "MapleScore",
    options: [
      "J’ai vérifié la date d’enregistrement et la dernière date de vérification.",
      "Je peux confirmer si l’annonce est encore disponible.",
      "Les photos, la description et le prix ne se contredisent pas de manière étrange.",
      "Le propriétaire ou le fournisseur ne me pousse pas à envoyer de l’argent ou à décider trop vite.",
      "Il ne me pousse pas fortement à communiquer ou à payer uniquement en dehors de la plateforme.",
      "Il ne demande pas un paiement important avant une visite ou une vérification vidéo.",
      "Je n’ai pas encore assez vérifié le MapleScore.",
    ],
  },
  {
    id: "finalDecision",
    title: "Q5. Suis-je prêt à prendre une décision ?",
    resultTitle: "Décision finale",
    options: [
      "Je peux expliquer le plus grand avantage de choisir cette annonce.",
      "Je comprends le principal inconvénient que je devrai peut-être accepter.",
      "Je sais pourquoi cette annonce peut être meilleure que d’autres options.",
      "Je suis prêt à poser des questions au propriétaire sur les points incertains.",
      "Si je ne peux pas juger seul, j’aurai peut-être besoin de l’aide de MapleHouse.",
      "J’ai encore du mal à juger cette annonce seul.",
    ],
  },
];

const englishBudgetComments: Record<string, BudgetComment> = {
  budget1: {
    label: "C$400-600 / approx. ₩400,000-600,000",
    comment:
      "This is an ultra-low budget range. Options may be very limited, and shared rooms, short-term rooms, or other compromises may be necessary. Very cheap listings should be checked carefully.",
  },
  budget2: {
    label: "C$600-900 / approx. ₩600,000-900,000",
    comment:
      "This is a budget room-rental range. It is usually more realistic to compare room rentals near connected transit than private spaces in the center.",
  },
  budget3: {
    label: "C$900-1,200 / approx. ₩900,000-1,200,000",
    comment:
      "This is a realistic range for comparing room rentals. Compare location, room condition, roommate rules, and travel time together.",
  },
  budget4: {
    label: "C$1,200-1,800 / approx. ₩1,200,000-1,800,000",
    comment:
      "You may compare better room rentals, basements, and some private-space options. Closer central access can still mean a higher price for less space.",
  },
  budget5: {
    label: "C$1,800+ / approx. ₩1,800,000+",
    comment:
      "You may consider studios, condos, or more private housing options. Decide whether mobility, space, or rent pressure matters most.",
  },
};

const frenchBudgetComments: Record<string, BudgetComment> = {
  budget1: {
    label: "C$400-600 / environ ₩400 000-600 000",
    comment:
      "Cette fourchette correspond à un budget très bas. Les options peuvent être très limitées, et il peut falloir accepter une chambre partagée, une courte durée ou d’autres compromis.",
  },
  budget2: {
    label: "C$600-900 / environ ₩600 000-900 000",
    comment:
      "Cette fourchette convient surtout aux chambres économiques. Il est souvent plus réaliste de comparer des chambres près d’un transport connecté que des espaces privés au centre.",
  },
  budget3: {
    label: "C$900-1 200 / environ ₩900 000-1 200 000",
    comment:
      "Cette fourchette est réaliste pour comparer des chambres. Comparez l’emplacement, l’état du logement, les règles de colocation et le temps de trajet.",
  },
  budget4: {
    label: "C$1 200-1 800 / environ ₩1 200 000-1 800 000",
    comment:
      "Vous pouvez comparer de meilleures chambres, des sous-sols et certaines options avec espace privé. Plus l’accès au centre est facile, plus le prix peut augmenter.",
  },
  budget5: {
    label: "C$1 800+ / environ ₩1 800 000+",
    comment:
      "Vous pouvez envisager des studios, condos ou logements plus privés. Il est important de choisir entre mobilité, espace et pression du loyer.",
  },
};

const englishResults: Record<string, RecommendationResult> = {
  result01: {
    id: "result01",
    title: "A starting point for Korean community access and budget control",
    stations: ["Finch", "North York Centre"],
    reason:
      "These stations can be useful starting points when you want Korean information access and budget control together.",
    goodFor: [
      "Korean community information or stores matter to you.",
      "You need to keep rent lower.",
      "A very unfamiliar living area may feel difficult at first.",
      "You want to compare room-rental options first.",
    ],
    nearby: "Compare Finch and North York Centre first.",
    caution:
      "This is not a final answer. Check your actual job location and routes yourself on a map.",
  },
  result02: {
    id: "result02",
    title: "A starting point for Korean community access and daily convenience",
    stations: ["North York Centre", "Finch"],
    reason:
      "These stations are practical comparison points when Korean community access and daily convenience both matter.",
    goodFor: [
      "Korean information access would help.",
      "You do not want an area that feels too isolated.",
      "You care about cost but also daily convenience.",
      "You prefer an easier first adjustment period.",
    ],
    nearby: "Compare North York Centre and Finch together.",
    caution: "More convenience can raise rent, so check the budget range at the same time.",
  },
  result03: {
    id: "result03",
    title: "Central-access option focused on mobility",
    stations: ["Bloor-Yonge", "St George"],
    reason:
      "These stations can be useful reference points if mobility and central access matter most.",
    goodFor: [
      "You want to reduce commute or route stress.",
      "You expect frequent downtown or central visits.",
      "You have some budget flexibility.",
      "You value location convenience more than low cost.",
    ],
    nearby: "Compare Bloor-Yonge, St George, College, and Dundas together.",
    caution:
      "Better central access can raise rent and reduce space, so compare housing type and price together.",
  },
  result04: {
    id: "result04",
    title: "Mobility matters, but budget needs compromise",
    stations: ["Dufferin", "Finch West"],
    reason:
      "These areas may be worth comparing when you need lower rent but do not want to give up transit connection completely.",
    goodFor: [
      "Your budget is low.",
      "You still want some connection to central areas.",
      "You can compare room rentals or shared housing.",
      "You are ready to check travel time carefully.",
    ],
    nearby: "Start by comparing Dufferin and Finch West.",
    caution: "Lower rent may involve compromises in travel time or listing condition.",
  },
  result05: {
    id: "result05",
    title: "Downtown activity and local service-job access",
    stations: ["College", "Dundas"],
    reason:
      "These stations can be starting points if you expect local service, retail, cafe, or restaurant activity downtown.",
    goodFor: [
      "You are prioritizing local retail or service jobs.",
      "You expect to go downtown often.",
      "You want to experience central living.",
      "You have some budget flexibility.",
    ],
    nearby: "Compare College, Dundas, and Bloor-Yonge together.",
    caution: "Closer central areas can mean higher rent and smaller spaces.",
  },
  result06: {
    id: "result06",
    title: "Downtown access with more budget awareness",
    stations: ["Dufferin", "Broadview"],
    reason:
      "These stations can be comparison points when downtown activity matters but central rent feels too high.",
    goodFor: [
      "You are considering local service jobs.",
      "You may go downtown often.",
      "Central rent feels burdensome.",
      "You need a balance between cost and mobility.",
    ],
    nearby: "Compare Dufferin and Broadview.",
    caution: "Once your real workplace is known, travel time can change a lot. Check it on a map.",
  },
  result07: {
    id: "result07",
    title: "Balanced option for mobility and daily stability",
    stations: ["Eglinton", "St George"],
    reason:
      "These stations can be references if you want mobility and daily convenience without starting only in the busiest central areas.",
    goodFor: [
      "Mobility matters to you.",
      "The most central areas may feel overwhelming.",
      "Daily convenience is still important.",
      "You want a balanced comparison point.",
    ],
    nearby: "Compare areas around Eglinton and St George.",
    caution: "Actual travel time can vary a lot depending on the exact listing location.",
  },
  result08: {
    id: "result08",
    title: "Budget plus Korean community access",
    stations: ["Finch", "Christie"],
    reason:
      "These stations may fit when you want to keep costs lower while still keeping access to Korean information or community areas.",
    goodFor: [
      "Cost matters a lot.",
      "Korean community access is also helpful.",
      "You are concerned about first adjustment.",
      "You can focus on room-rental options.",
    ],
    nearby: "Compare Finch and Christie together.",
    caution: "Do not decide by station name alone. Check the exact listing location and travel time.",
  },
  result09: {
    id: "result09",
    title: "Ultra-low-budget value-search starting point",
    stations: ["Victoria Park", "Finch West"],
    reason:
      "If rent must stay very low, budget control may need to come before central access.",
    goodFor: [
      "Your budget is around C$400-600.",
      "You know options may be very limited.",
      "You can compare room rentals or shared housing.",
      "You can accept some travel-time compromise.",
    ],
    nearby: "Compare Victoria Park and Finch West.",
    caution:
      "Listings that look unusually cheap and good need extra checking. Confirm condition, availability, and provider response.",
  },
  result10: {
    id: "result10",
    title: "Compromise between cost and central access",
    stations: ["Dufferin", "Broadview"],
    reason:
      "These stations can be comparison points when you want lower rent without giving up central access completely.",
    goodFor: [
      "Cost matters to you.",
      "You do not want to go too far out.",
      "Some central access is still needed.",
      "You can focus on room-rental options.",
    ],
    nearby: "Compare areas around Dufferin and Broadview.",
    caution: "Do not decide on price alone. Check commute or school routes together.",
  },
  result11: {
    id: "result11",
    title: "Korean community plus downtown access",
    stations: ["Christie", "St George"],
    reason:
      "These stations may be useful when you want Korean community access and downtown or central access together.",
    goodFor: [
      "Korean information access matters.",
      "You expect to go downtown often.",
      "You do not want an area that feels too isolated.",
      "You want to compare budget and mobility together.",
    ],
    nearby: "Compare Christie, St George, and Bloor-Yonge together.",
    caution: "Better access can increase rent pressure.",
  },
  result12: {
    id: "result12",
    title: "Balance between budget and commute stress",
    stations: ["Finch West", "Dufferin"],
    reason:
      "These stations may fit when you need to save rent but do not want travel stress to become too high.",
    goodFor: [
      "You need to save rent.",
      "Mobility still cannot be too difficult.",
      "You can focus on room-rental options.",
      "You are ready to check real travel time carefully.",
    ],
    nearby: "Compare Finch West and Dufferin.",
    caution: "Recheck what matters most among price, travel time, and listing condition.",
  },
};

const frenchResults: Record<string, RecommendationResult> = {
  result01: {
    id: "result01",
    title: "Point de départ entre communauté coréenne et maîtrise du budget",
    stations: ["Finch", "North York Centre"],
    reason:
      "Ces stations peuvent servir de points de comparaison si vous voulez combiner accès aux informations coréennes et maîtrise du budget.",
    goodFor: [
      "L’accès aux informations ou commerces coréens est important.",
      "Vous devez réduire le coût du loyer.",
      "Un environnement trop inconnu peut être difficile au début.",
      "Vous voulez d’abord comparer des chambres en location.",
    ],
    nearby: "Comparez d’abord Finch et North York Centre.",
    caution:
      "Ce n’est pas une réponse définitive. Vérifiez vous-même le lieu de travail réel et les trajets sur une carte.",
  },
  result02: {
    id: "result02",
    title: "Point de départ entre communauté coréenne et commodité quotidienne",
    stations: ["North York Centre", "Finch"],
    reason:
      "Ces stations sont des repères pratiques lorsque l’accès à la communauté coréenne et la commodité quotidienne comptent tous les deux.",
    goodFor: [
      "L’accès aux informations coréennes serait utile.",
      "Vous voulez éviter une zone qui semble trop isolée.",
      "Vous regardez le coût mais aussi la commodité.",
      "Vous préférez une adaptation plus facile au début.",
    ],
    nearby: "Comparez North York Centre et Finch ensemble.",
    caution: "Plus de commodité peut augmenter le loyer, donc vérifiez aussi votre budget.",
  },
  result03: {
    id: "result03",
    title: "Option d’accès central axée sur la mobilité",
    stations: ["Bloor-Yonge", "St George"],
    reason:
      "Ces stations peuvent servir de repères si la mobilité et l’accès au centre sont prioritaires.",
    goodFor: [
      "Vous voulez réduire le stress des trajets.",
      "Vous prévoyez d’aller souvent au centre-ville.",
      "Vous avez une certaine marge de budget.",
      "La commodité de l’emplacement compte plus que le coût bas.",
    ],
    nearby: "Comparez Bloor-Yonge, St George, College et Dundas.",
    caution:
      "Un meilleur accès central peut augmenter le loyer et réduire l’espace. Comparez aussi le type de logement.",
  },
  result04: {
    id: "result04",
    title: "Mobilité importante, avec compromis budgétaire",
    stations: ["Dufferin", "Finch West"],
    reason:
      "Ces zones peuvent être utiles si vous devez réduire le loyer sans abandonner complètement la connexion aux transports.",
    goodFor: [
      "Votre budget est bas.",
      "Vous voulez garder une connexion avec les zones centrales.",
      "Vous pouvez comparer des chambres ou colocations.",
      "Vous êtes prêt à vérifier les temps de trajet.",
    ],
    nearby: "Commencez par comparer Dufferin et Finch West.",
    caution: "Un loyer plus bas peut impliquer des compromis sur le trajet ou l’état du logement.",
  },
  result05: {
    id: "result05",
    title: "Activité au centre-ville et accès aux emplois de service",
    stations: ["College", "Dundas"],
    reason:
      "Ces stations peuvent servir de points de départ si vous prévoyez des activités ou emplois de service au centre-ville.",
    goodFor: [
      "Vous priorisez les emplois locaux de commerce ou service.",
      "Vous pensez aller souvent au centre-ville.",
      "Vous voulez expérimenter la vie centrale.",
      "Vous avez une certaine marge de budget.",
    ],
    nearby: "Comparez College, Dundas et Bloor-Yonge.",
    caution: "Plus vous êtes proche du centre, plus le loyer peut être élevé et l’espace réduit.",
  },
  result06: {
    id: "result06",
    title: "Accès au centre avec attention au budget",
    stations: ["Dufferin", "Broadview"],
    reason:
      "Ces stations peuvent être comparées si l’activité au centre compte mais que le loyer central semble trop lourd.",
    goodFor: [
      "Vous envisagez des emplois de service locaux.",
      "Vous pourriez aller souvent au centre-ville.",
      "Le loyer au centre semble trop élevé.",
      "Vous avez besoin d’un équilibre entre coût et mobilité.",
    ],
    nearby: "Comparez Dufferin et Broadview.",
    caution:
      "Lorsque le vrai lieu de travail sera connu, le temps de trajet peut beaucoup changer. Vérifiez-le sur une carte.",
  },
  result07: {
    id: "result07",
    title: "Équilibre entre mobilité et stabilité quotidienne",
    stations: ["Eglinton", "St George"],
    reason:
      "Ces stations peuvent servir de références si vous voulez mobilité et commodité sans commencer uniquement dans les zones les plus centrales.",
    goodFor: [
      "La mobilité est importante.",
      "Les zones les plus centrales peuvent sembler trop intenses.",
      "La commodité quotidienne reste nécessaire.",
      "Vous voulez un point de comparaison équilibré.",
    ],
    nearby: "Comparez les zones autour d’Eglinton et de St George.",
    caution: "Le temps de trajet réel peut varier selon l’emplacement exact de l’annonce.",
  },
  result08: {
    id: "result08",
    title: "Budget et accès à la communauté coréenne",
    stations: ["Finch", "Christie"],
    reason:
      "Ces stations peuvent convenir si vous voulez réduire les coûts tout en gardant un accès aux informations ou à la communauté coréenne.",
    goodFor: [
      "Le coût compte beaucoup.",
      "L’accès à la communauté coréenne est aussi utile.",
      "La première adaptation vous inquiète.",
      "Vous pouvez vous concentrer sur les chambres en location.",
    ],
    nearby: "Comparez Finch et Christie ensemble.",
    caution: "Ne décidez pas seulement par nom de station. Vérifiez l’adresse exacte et le trajet.",
  },
  result09: {
    id: "result09",
    title: "Point de départ pour budget très bas",
    stations: ["Victoria Park", "Finch West"],
    reason:
      "Si le loyer doit rester très bas, la maîtrise du budget peut passer avant l’accès central.",
    goodFor: [
      "Votre budget est autour de C$400-600.",
      "Vous savez que les options peuvent être très limitées.",
      "Vous pouvez comparer des chambres ou colocations.",
      "Vous pouvez accepter un compromis sur le trajet.",
    ],
    nearby: "Comparez Victoria Park et Finch West.",
    caution:
      "Les annonces qui semblent trop bon marché et trop intéressantes doivent être vérifiées davantage.",
  },
  result10: {
    id: "result10",
    title: "Compromis entre coût et accès central",
    stations: ["Dufferin", "Broadview"],
    reason:
      "Ces stations peuvent être comparées si vous voulez réduire le loyer sans abandonner complètement l’accès au centre.",
    goodFor: [
      "Le coût est important.",
      "Vous ne voulez pas aller trop loin.",
      "Un certain accès central reste nécessaire.",
      "Vous pouvez vous concentrer sur les chambres en location.",
    ],
    nearby: "Comparez les zones autour de Dufferin et Broadview.",
    caution: "Ne décidez pas seulement sur le prix. Vérifiez aussi les trajets vers le travail ou l’école.",
  },
  result11: {
    id: "result11",
    title: "Communauté coréenne et accès au centre",
    stations: ["Christie", "St George"],
    reason:
      "Ces stations peuvent être utiles si vous voulez combiner accès à la communauté coréenne et accès au centre-ville.",
    goodFor: [
      "L’accès aux informations coréennes est nécessaire.",
      "Vous prévoyez d’aller souvent au centre-ville.",
      "Vous voulez éviter une zone trop isolée.",
      "Vous voulez comparer budget et mobilité ensemble.",
    ],
    nearby: "Comparez Christie, St George et Bloor-Yonge.",
    caution: "Un meilleur accès peut augmenter la pression sur le budget.",
  },
  result12: {
    id: "result12",
    title: "Équilibre entre budget et stress des trajets",
    stations: ["Finch West", "Dufferin"],
    reason:
      "Ces stations peuvent convenir si vous devez économiser sur le loyer sans laisser le stress des trajets devenir trop élevé.",
    goodFor: [
      "Vous devez économiser sur le loyer.",
      "La mobilité ne peut pas être trop difficile.",
      "Vous pouvez vous concentrer sur les chambres en location.",
      "Vous êtes prêt à vérifier les vrais temps de trajet.",
    ],
    nearby: "Comparez Finch West et Dufferin.",
    caution: "Revérifiez ce qui compte le plus entre prix, trajet et état du logement.",
  },
};

export const TRANSLATED_CHECKLIST_CONTENT: Record<
  TranslatedChecklistLocale,
  ChecklistLocaleContent
> = {
  en: {
    overview: {
      heroLabel: "Toronto Station Checklist · MVP",
      heroTitle: "Not sure where to start looking for housing in Toronto?",
      subtitle:
        "Answer a few questions and MapleHouse will suggest starting station areas based on your purpose, budget, and living style.",
      notice:
        "This recommendation is not a final answer. It is a reference point for starting your housing search.",
      cardLabel: "MapleHouse Checklist",
      cardTitle: "Canada Housing Checklist",
      cardDescription: [
        "Check the points that are hard to judge from listing information alone. Review them question by question.",
        "You can review location, budget, daily routes, and MapleScore (listing trust score) step by step on your own.",
      ],
      cardButton: "Start checklist",
      departureHeading: "Get housing area suggestions by departure type",
    },
    departureTypes: [
      {
        title: "Working Holiday",
        description:
          "Get station-area suggestions based on job direction, budget, and Korean community needs.",
        button: "Find my stations",
        action: "working",
      },
      {
        title: "Language Study",
        description: "Organize housing areas based on language school location and morning commute.",
        button: "Coming soon",
        action: "language",
        notice:
          "The language study checklist is being prepared around language school locations, morning commute burden, budget, and first-arrival stability.",
      },
      {
        title: "College / University",
        description:
          "Organize housing areas based on school location, longer commutes, and living stability.",
        button: "Coming soon",
        action: "study",
        notice:
          "The college / university checklist is being prepared. For this MVP preview, the working holiday station recommendation is available first.",
      },
    ],
    workingIntro: {
      label: "Working Holiday",
      title: "Find Toronto station areas for working holiday housing",
      paragraphs: [
        "When looking for housing in Toronto for the first time, it is often easier to start with station names rather than broad neighborhood names.",
        "Answer five questions and MapleHouse will suggest station areas that can help you start comparing listings.",
        "This is not a final answer. Please check real routes and travel times on a map yourself.",
      ],
    },
    wizardLabels: {
      workingTitle: "Working holiday station check",
      generalTitle: "Canada Housing Checklist",
      previous: "Previous",
      start: "Start",
      next: "Next",
      showResult: "View result",
    },
    workingResult: {
      eyebrow: "Recommendation Result",
      title: "Station areas that may fit your situation",
      explanation: [
        "The recommendation below is not a final answer. It is a starting point for your housing search.",
        "Please check real routes, listing conditions, contract terms, and payment decisions yourself.",
      ],
      stationTitle: "Recommended starting stations",
      reasonTitle: "Why these stations?",
      nearbyTitle: "Nearby areas to compare",
      goodForTitle: "This may fit you if:",
      cautionLabel: "Things to check:",
      viewListings: "View listings",
      startChecklist: "Start checklist",
      retake: "Retake questionnaire",
      support: "Ask with MapleHouse support",
      supportNotice:
        "MapleHouse-assisted inquiry will be connected to a paid plan later. This is an MVP preview.",
    },
    generalChecklist: {
      eyebrow: "General Checklist",
      title: "Canada Housing Checklist",
      intro: [
        "This checklist is not just about options like furniture, internet, or utilities.",
        "It helps you think about whether a listing actually fits your situation.",
      ],
      emptyHint:
        "You can continue even if nothing is checked yet. Before deciding on a listing, we recommend coming back to review the items again.",
    },
    generalResult: {
      eyebrow: "General Checklist Result",
      title: "Checklist result",
      subtitle:
        "This is not a final judgment. It summarizes what you should check before deciding on a listing.",
      checkedTitle: "My checked judgment points",
      emptyChecked:
        "Not enough items have been checked yet. Before deciding on a listing, review location, budget, and MapleScore again.",
      noItems: "No items checked yet.",
      listingTitle: "Selected listing information",
      noListing: [
        "No listing is selected yet.",
        "If you choose a listing from the listing page, you can compare the checklist result with the listing information here.",
      ],
      retake: "Retake checklist",
      viewListings: "View listings",
      support: "Ask with MapleHouse support",
      supportNotice:
        "MapleHouse-assisted inquiry will be connected to a paid plan later. This is an MVP preview.",
    },
    housingGuide: {
      title: "How to think about housing types when looking for your first place",
      items: [
        {
          title: "If you want to live alone",
          body: "You may consider a studio or one-room option. However, the budget burden can be higher.",
        },
        {
          title: "If saving cost is the priority",
          body: "Room rental or shared housing is usually more realistic. Check roommates, shared spaces, and house rules.",
        },
        {
          title: "If convenience matters",
          body: "You may consider condo share or condo rental. However, rent can be higher.",
        },
      ],
    },
    legalScopeNoticeLines: [
      "This recommendation is only a reference point for organizing your housing search. Please check real routes, listing conditions, contract terms, and payment decisions yourself.",
      "MapleHouse is not a contract party and does not provide legal advice, brokerage, escrow, or payment guarantees.",
    ],
    workingQuestions: englishWorkingQuestions,
    generalQuestions: englishGeneralQuestions,
    budgetComments: englishBudgetComments,
    recommendationResults: englishResults,
  },
  fr: {
    overview: {
      heroLabel: "Checklist stations Toronto · MVP",
      heroTitle: "Vous ne savez pas par où commencer votre recherche de logement à Toronto ?",
      subtitle:
        "Répondez à quelques questions et MapleHouse vous suggérera des zones de stations selon votre objectif, votre budget et votre mode de vie.",
      notice:
        "Cette recommandation n’est pas une réponse définitive. Elle sert de point de départ pour commencer votre recherche de logement.",
      cardLabel: "MapleHouse Checklist",
      cardTitle: "Liste de vérification logement au Canada",
      cardDescription: [
        "Vérifiez les points difficiles à juger à partir des seules informations d’une annonce. Passez-les en revue question par question.",
        "Vous pouvez vérifier l’emplacement, le budget, les trajets quotidiens et le MapleScore (score de fiabilité du logement) étape par étape.",
      ],
      cardButton: "Commencer la liste",
      departureHeading: "Obtenez des suggestions de zones selon votre type de départ",
    },
    departureTypes: [
      {
        title: "Permis vacances-travail",
        description:
          "Obtenez des suggestions de zones autour de stations selon votre orientation professionnelle, votre budget et votre besoin d’accès à la communauté coréenne.",
        button: "Trouver mes stations",
        action: "working",
      },
      {
        title: "Études linguistiques",
        description:
          "Organisez les zones de logement selon l’emplacement de l’école de langue et le trajet du matin.",
        button: "En préparation",
        action: "language",
        notice:
          "La check-list pour les études linguistiques est en préparation autour de l’emplacement des écoles de langue, du trajet du matin, du budget et de la stabilité à l’arrivée.",
      },
      {
        title: "Collège / université",
        description:
          "Organisez les zones de logement selon l’emplacement de l’établissement, les trajets plus longs et la stabilité de vie.",
        button: "En préparation",
        action: "study",
        notice:
          "La liste collège / université est en préparation. Pour cet aperçu MVP, la recommandation de stations pour le permis vacances-travail est disponible en premier.",
      },
    ],
    workingIntro: {
      label: "Permis vacances-travail",
      title: "Trouver des zones de stations pour un logement en permis vacances-travail",
      paragraphs: [
        "Quand on cherche un logement à Toronto pour la première fois, il est souvent plus simple de commencer par des noms de stations plutôt que par de grands quartiers.",
        "Répondez à cinq questions et MapleHouse vous suggérera des zones autour de stations pour commencer à comparer les annonces.",
        "Ce n’est pas une réponse définitive. Veuillez vérifier vous-même les trajets et les temps de déplacement réels sur une carte.",
      ],
    },
    wizardLabels: {
      workingTitle: "Recommandation de stations",
      generalTitle: "Liste de vérification logement au Canada",
      previous: "Précédent",
      start: "Commencer",
      next: "Suivant",
      showResult: "Voir le résultat",
    },
    workingResult: {
      eyebrow: "Résultat de recommandation",
      title: "Zones de stations qui peuvent correspondre à votre situation",
      explanation: [
        "La recommandation ci-dessous n’est pas une réponse définitive. Elle sert de point de départ pour votre recherche de logement.",
        "Veuillez vérifier vous-même les trajets réels, les conditions de l’annonce, les conditions du contrat et les décisions de paiement.",
      ],
      stationTitle: "Stations de départ recommandées",
      reasonTitle: "Pourquoi ces stations ?",
      nearbyTitle: "Zones voisines à comparer",
      goodForTitle: "Cela peut vous convenir si :",
      cautionLabel: "Points à vérifier :",
      viewListings: "Voir les annonces",
      startChecklist: "Commencer la liste",
      retake: "Refaire le questionnaire",
      support: "Demander l’aide de MapleHouse",
      supportNotice:
        "La demande assistée par MapleHouse sera liée à un forfait payant plus tard. Ceci est un aperçu MVP.",
    },
    generalChecklist: {
      eyebrow: "Liste générale",
      title: "Liste de vérification logement au Canada",
      intro: [
        "Cette liste ne concerne pas seulement les options comme les meubles, Internet ou les charges.",
        "Elle vous aide à réfléchir pour savoir si une annonce correspond réellement à votre situation.",
      ],
      emptyHint:
        "Vous pouvez continuer même si rien n’est coché. Avant de décider, nous recommandons de revenir vérifier les points.",
    },
    generalResult: {
      eyebrow: "Résultat de la liste",
      title: "Résultat de la liste",
      subtitle:
        "Ce n’est pas un jugement définitif. Ce résumé indique les points à vérifier avant de décider.",
      checkedTitle: "Mes critères cochés",
      emptyChecked:
        "Il n’y a pas encore assez d’éléments cochés. Avant de décider, revérifiez l’emplacement, le budget et le MapleScore.",
      noItems: "Aucun élément coché pour le moment.",
      listingTitle: "Informations sur le logement sélectionné",
      noListing: [
        "Aucun logement n’est encore sélectionné.",
        "Si vous choisissez un logement depuis la page des annonces, vous pourrez comparer ici le résultat de la liste avec les informations du logement.",
      ],
      retake: "Refaire la liste",
      viewListings: "Voir les annonces",
      support: "Demander l’aide de MapleHouse",
      supportNotice:
        "La demande assistée par MapleHouse sera liée à un forfait payant plus tard. Ceci est un aperçu MVP.",
    },
    housingGuide: {
      title: "Comment réfléchir aux types de logement pour votre premier logement",
      items: [
        {
          title: "Si vous voulez vivre seul",
          body: "Vous pouvez envisager un studio ou un logement d’une pièce. Cependant, le budget peut être plus élevé.",
        },
        {
          title: "Si réduire les coûts est la priorité",
          body: "La location d’une chambre ou la colocation est souvent plus réaliste. Vérifiez les colocataires, les espaces communs et les règles de la maison.",
        },
        {
          title: "Si les commodités sont importantes",
          body: "Vous pouvez envisager un condo partagé ou une location de condo. Cependant, le loyer peut être plus élevé.",
        },
      ],
    },
    legalScopeNoticeLines: [
      "Cette recommandation sert uniquement de point de référence pour organiser votre recherche de logement. Veuillez vérifier vous-même les trajets réels, les conditions de l’annonce, les conditions du contrat et les décisions de paiement.",
      "MapleHouse n’est pas partie au contrat et ne fournit pas de conseil juridique, de courtage, de service d’escrow ni de garantie de paiement.",
    ],
    workingQuestions: frenchWorkingQuestions,
    generalQuestions: frenchGeneralQuestions,
    budgetComments: frenchBudgetComments,
    recommendationResults: frenchResults,
  },
};
