import type {
  BudgetComment,
  GeneralChecklistQuestion,
  LanguageStudyBudgetComment,
  LanguageStudyQuestion,
  LanguageStudyResultTemplate,
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
  languageStudy: {
    intro: {
      label: string;
      title: string;
      paragraphs: string[];
    };
    ilacCampusQuestion: {
      title: string;
      notice?: string;
      options: LanguageStudyQuestion["options"];
    };
    questions: LanguageStudyQuestion[];
    result: {
      eyebrow: string;
      title: string;
      description: string[];
      destinationTitle: string;
      comparisonTitle: string;
      recommendationTitle: string;
      reasonTitle: string;
      reasonPrefix: string;
      nearbyTitle: string;
      nearbyPrefix: string;
      nearbySuffix: string;
      goodForTitle: string;
      importantNotesTitle: string;
      viewListings: string;
      startChecklist: string;
      retake: string;
      support: string;
      supportNotice: string;
    };
    legalNoticeLines: string[];
    budgetComments: Record<string, LanguageStudyBudgetComment>;
    resultTemplates: Record<string, LanguageStudyResultTemplate>;
    glossary: {
      trigger: string;
      title: string;
      closeLabel: string;
      items: Array<{
        term: string;
        description: string[];
        pictogram:
          | "room"
          | "share"
          | "studio"
          | "oneBedroom"
          | "den"
          | "basement"
          | "condo";
      }>;
    };
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

const englishLanguageStudyIlacCampusQuestion: ChecklistLocaleContent["languageStudy"]["ilacCampusQuestion"] = {
  title: "Q1-1. Do you know your ILAC campus?",
  notice:
    "ILAC may assign classes to different campuses. Please confirm your campus address in the official information from the school.",
  options: [
    {
      value: "ilac_growth",
      label: "ILAC Growth Campus / Main Campus",
      description: "120 Bloor St E. Near Bloor-Yonge Station.",
    },
    {
      value: "ilac_pathway",
      label: "ILAC University Pathway Campus",
      description: "255 College St. Near College and St George.",
    },
    {
      value: "ilac_dream",
      label: "ILAC Dream Campus",
      description: "425 Bloor St E. Near Sherbourne and Bloor-Yonge.",
    },
    {
      value: "ilac_heart",
      label: "ILAC Heart Campus",
      description: "655 Bay St. Near College and Dundas.",
    },
    {
      value: "ilac_unknown_campus",
      label: "I do not know my ILAC campus yet",
      description: "Start with Bloor-Yonge and College as broad reference points.",
    },
  ],
};

const frenchLanguageStudyIlacCampusQuestion: ChecklistLocaleContent["languageStudy"]["ilacCampusQuestion"] = {
  title: "Q1-1. Connaissez-vous votre campus ILAC?",
  notice:
    "ILAC peut avoir plusieurs campus. Confirmez l’adresse dans les informations officielles reçues de l’école.",
  options: [
    {
      value: "ilac_growth",
      label: "ILAC Growth Campus / campus principal",
      description: "120 Bloor St E. Près de Bloor-Yonge.",
    },
    {
      value: "ilac_pathway",
      label: "ILAC University Pathway Campus",
      description: "255 College St. Près de College et St George.",
    },
    {
      value: "ilac_dream",
      label: "ILAC Dream Campus",
      description: "425 Bloor St E. Près de Sherbourne et Bloor-Yonge.",
    },
    {
      value: "ilac_heart",
      label: "ILAC Heart Campus",
      description: "655 Bay St. Près de College et Dundas.",
    },
    {
      value: "ilac_unknown_campus",
      label: "Je ne connais pas encore mon campus ILAC",
      description: "Commencez avec Bloor-Yonge et College comme repères.",
    },
  ],
};

const englishLanguageStudyQuestions: LanguageStudyQuestion[] = [
  {
    id: "school",
    title: "Q1. Which language school are you registered with, or considering?",
    options: [
      {
        value: "school_ilac",
        label: "ILAC (International Language Academy of Canada)",
        description: "I am registered with or considering ILAC.",
      },
      {
        value: "school_ilsc",
        label: "ILSC Language Schools Toronto",
        description: "I am considering ILSC Toronto.",
      },
      {
        value: "school_ec",
        label: "EC English Toronto",
        description: "I am considering EC English Toronto.",
      },
      {
        value: "school_hansa",
        label: "Hansa Language Centre",
        description: "I am considering Hansa Language Centre.",
      },
      {
        value: "school_kaplan",
        label: "Kaplan International Languages Toronto",
        description: "I am considering Kaplan Toronto.",
      },
      {
        value: "school_other",
        label: "Another language school",
        description: "My school is not listed here.",
      },
      {
        value: "school_unknown",
        label: "I have not decided yet",
        description: "I am still comparing schools.",
      },
    ],
  },
  {
    id: "commuteRange",
    title: "Q2. If your class starts around 8:30 AM, how much commute can you handle?",
    intro:
      "Morning classes can start early. Choose a rough commute range you could handle.",
    notice: "These times are only reference points. Always check real routes on a map.",
    options: [
      {
        value: "commute_very_close",
        label: "Same station area or 0-1 stops",
        description: "I want a short route, around 20-30 minutes if possible.",
      },
      {
        value: "commute_short",
        label: "About 2-3 stops is fine",
        description: "A short commute is best, but I can live a little farther away.",
      },
      {
        value: "commute_medium",
        label: "About 4-6 stops is fine",
        description: "I can accept more travel if rent or room condition is better.",
      },
      {
        value: "commute_budget_first",
        label: "Farther is okay if rent is lower",
        description: "Saving rent matters more, even if the commute becomes longer.",
      },
      {
        value: "commute_not_sure",
        label: "I am not sure yet",
        description: "I want to start with balanced station areas.",
      },
    ],
  },
  {
    id: "transport",
    title: "Q3. What kind of morning commute feels easiest?",
    helpTitle: "Commute tips",
    helpItems: [
      { term: "Subway-based routes", description: "They can feel simpler and easier to understand." },
      { term: "Bus routes", description: "Buses may be slower, but they can connect more housing areas." },
      { term: "Real routes vary", description: "Weather, time, route, and service changes can affect travel." },
    ],
    options: [
      {
        value: "prefer_subway",
        label: "I prefer subway-based routes",
        description: "I want a simple route that is easy to understand.",
      },
      {
        value: "bus_ok",
        label: "Bus routes are okay",
        description: "I do not mind using a bus if the housing option is better.",
      },
      {
        value: "avoid_long_walk",
        label: "I want to avoid long walks to transit",
        description: "Transit access near home matters to me.",
      },
      {
        value: "transport_budget_first",
        label: "Rent matters more than commute comfort",
        description: "I can accept a less convenient route to save money.",
      },
      {
        value: "transport_not_sure",
        label: "I am not sure yet",
        description: "I want to start with simple subway reference areas.",
      },
    ],
  },
  {
    id: "languageBudget",
    title: "Q4. What monthly rent range can you handle?",
    intro: "CAD prices can be hard to feel at first. Use these as rough rent ranges.",
    notice: "These amounts are monthly rent only. Deposit, utilities, food, and transit are separate.",
    footerNote: "These rent ranges are rough reference points. Extra costs may apply.",
    options: [
      {
        value: "budget_400_600",
        label: "C$400-600",
        description: "Very low budget. Options may be limited and require compromises.",
      },
      {
        value: "budget_600_900",
        label: "C$600-900",
        description: "A budget range for room rentals or shared housing.",
      },
      {
        value: "budget_900_1200",
        label: "C$900-1,200",
        description: "A practical range for comparing room rentals.",
      },
      {
        value: "budget_1200_1800",
        label: "C$1,200-1,800",
        description: "You may compare better rooms, basements, or some private-space options.",
      },
      {
        value: "budget_1800_plus",
        label: "C$1,800+",
        description: "You may consider studios, condos, or more private housing.",
      },
    ],
  },
  {
    id: "housingType",
    title: "Q5. Do you have a housing type in mind?",
    helpTitle: "Housing terms",
    options: [
      {
        value: "housing_room_share",
        label: "Room rent or shared housing is okay",
        description: "I can share common spaces to reduce cost.",
      },
      {
        value: "housing_private_space",
        label: "I prefer a more private space",
        description: "I want to compare studios, condos, basements, or similar options.",
      },
      {
        value: "housing_start_simple",
        label: "I can start with a room and move later",
        description: "I can settle first, then move when I understand the city better.",
      },
      {
        value: "housing_not_sure",
        label: "I am not sure yet",
        description: "I want to understand housing terms first.",
      },
    ],
  },
  {
    id: "afterSchool",
    title: "Q6. What do you want to do most after class?",
    options: [
      {
        value: "after_school_near_school",
        label: "Meet classmates near school",
        description: "I may eat or hang out with classmates after class.",
      },
      {
        value: "after_school_korean_food",
        label: "Visit Korean food or community areas",
        description: "Korean food, friends, and information access matter to me.",
      },
      {
        value: "after_school_city_activity",
        label: "Explore food, attractions, and events",
        description: "I want to experience the city with new friends.",
      },
      {
        value: "after_school_home_area",
        label: "Rest near home after class",
        description: "I prefer a calmer daily routine around home.",
      },
      {
        value: "after_school_not_sure",
        label: "I am not sure yet",
        description: "I cannot predict my routine yet.",
      },
    ],
  },
  {
    id: "koreanCommunity",
    title: "Q7. How important is Korean community access?",
    intro: "This means Korean food, stores, community information, and early support channels.",
    options: [
      {
        value: "korean_very_important",
        label: "Very important",
        description: "I think I will need Korean food and information at first.",
      },
      {
        value: "korean_somewhat",
        label: "Helpful, but not required",
        description: "It would help, but I do not need to live right next to it.",
      },
      {
        value: "korean_beginner_need",
        label: "Useful during the first stage",
        description: "It may help while I settle in.",
      },
      {
        value: "korean_not_important",
        label: "Not very important",
        description: "I want to experience more local areas.",
      },
    ],
  },
  {
    id: "cityActivity",
    title: "Q8. How often do you expect to visit city-centre areas, attractions, or events?",
    options: [
      {
        value: "city_activity_very_often",
        label: "Almost every day or very often",
        description: "I expect many plans for friends, events, shopping, or sightseeing.",
      },
      {
        value: "city_activity_often",
        label: "Two or three times a week",
        description: "I may go often, but not every day.",
      },
      {
        value: "city_activity_weekend",
        label: "Mostly weekends or special days",
        description: "On weekdays, class and home-area life matter more.",
      },
      {
        value: "city_activity_low",
        label: "Not very often",
        description: "Resting near home matters more.",
      },
    ],
  },
  {
    id: "partTime",
    title: "Q9. Are you open to small part-time work if allowed?",
    notice:
      "Work permission depends on visa, student status, and program conditions. MapleHouse does not provide visa or job advice.",
    options: [
      {
        value: "parttime_yes",
        label: "Yes, if possible",
        description: "I want to keep part-time work possibilities open.",
      },
      {
        value: "parttime_maybe",
        label: "Maybe later",
        description: "I may look into it if my situation allows.",
      },
      {
        value: "parttime_low",
        label: "Study and daily life matter more",
        description: "Adapting to school and life is the priority.",
      },
      {
        value: "parttime_no",
        label: "No",
        description: "I am not considering part-time work.",
      },
    ],
  },
  {
    id: "finalPriority",
    title: "Q10. If you had to choose one priority, what matters most?",
    options: [
      {
        value: "final_school_commute",
        label: "Easy morning commute to school",
        description: "I want to reduce stress for early classes.",
      },
      {
        value: "final_budget",
        label: "Saving rent",
        description: "Lower rent matters even if travel is longer.",
      },
      {
        value: "final_social_activity",
        label: "Easy after-class social life",
        description: "Food, events, sightseeing, and friends matter.",
      },
      {
        value: "final_korean_community",
        label: "Korean food and information access",
        description: "Being near Korean community access matters.",
      },
      {
        value: "final_beginner_stability",
        label: "Stable first-arrival life",
        description: "I want a place that feels manageable at first.",
      },
      {
        value: "final_subway_convenience",
        label: "Simple subway-based mobility",
        description: "I want routes that are easy to understand.",
      },
    ],
  },
];

const frenchLanguageStudyQuestions: LanguageStudyQuestion[] = [
  {
    id: "school",
    title: "Q1. Dans quelle école de langue êtes-vous inscrit, ou laquelle envisagez-vous?",
    options: [
      {
        value: "school_ilac",
        label: "ILAC",
        description: "Je suis inscrit à ILAC ou j’envisage ILAC.",
      },
      {
        value: "school_ilsc",
        label: "ILSC Toronto",
        description: "J’envisage ILSC Toronto.",
      },
      {
        value: "school_ec",
        label: "EC English Toronto",
        description: "J’envisage EC English Toronto.",
      },
      {
        value: "school_hansa",
        label: "Hansa Language Centre",
        description: "J’envisage Hansa Language Centre.",
      },
      {
        value: "school_kaplan",
        label: "Kaplan Toronto",
        description: "J’envisage Kaplan Toronto.",
      },
      {
        value: "school_other",
        label: "Une autre école de langue",
        description: "Mon école n’est pas dans la liste.",
      },
      {
        value: "school_unknown",
        label: "Je n’ai pas encore décidé",
        description: "Je compare encore plusieurs écoles.",
      },
    ],
  },
  {
    id: "commuteRange",
    title: "Q2. Si vos cours commencent vers 8 h 30, quel trajet pouvez-vous accepter?",
    intro: "Les cours peuvent commencer tôt. Choisissez un repère de trajet réaliste.",
    notice: "Ces durées sont seulement des repères. Vérifiez toujours le vrai trajet sur une carte.",
    options: [
      {
        value: "commute_very_close",
        label: "Même secteur ou 0-1 station",
        description: "Je préfère un trajet court, autour de 20-30 minutes si possible.",
      },
      {
        value: "commute_short",
        label: "2-3 stations me conviennent",
        description: "Je peux vivre un peu plus loin si le trajet reste simple.",
      },
      {
        value: "commute_medium",
        label: "4-6 stations me conviennent",
        description: "Je peux accepter plus de trajet si le logement est meilleur.",
      },
      {
        value: "commute_budget_first",
        label: "Plus loin, si le loyer baisse",
        description: "Le budget passe avant le confort du trajet.",
      },
      {
        value: "commute_not_sure",
        label: "Je ne sais pas encore",
        description: "Je veux commencer avec des secteurs équilibrés.",
      },
    ],
  },
  {
    id: "transport",
    title: "Q3. Quel type de trajet du matin vous semble le plus simple?",
    helpTitle: "Conseils de trajet",
    helpItems: [
      { term: "Métro", description: "Le trajet peut sembler plus simple à comprendre." },
      { term: "Bus", description: "Le bus peut être plus lent, mais il dessert plus de secteurs." },
      { term: "Trajet réel", description: "La météo, l’horaire et les travaux peuvent changer le trajet." },
    ],
    options: [
      {
        value: "prefer_subway",
        label: "Je préfère le métro",
        description: "Je veux un trajet simple à comprendre.",
      },
      {
        value: "bus_ok",
        label: "Le bus me convient",
        description: "Je peux prendre le bus si le logement est meilleur.",
      },
      {
        value: "avoid_long_walk",
        label: "Je veux éviter une longue marche",
        description: "L’accès au transport près du logement est important.",
      },
      {
        value: "transport_budget_first",
        label: "Le loyer compte plus que le trajet",
        description: "J’accepte un trajet moins pratique pour économiser.",
      },
      {
        value: "transport_not_sure",
        label: "Je ne sais pas encore",
        description: "Je veux partir de repères simples en métro.",
      },
    ],
  },
  {
    id: "languageBudget",
    title: "Q4. Quel budget mensuel pouvez-vous prévoir pour le loyer?",
    intro: "Les prix en dollars canadiens peuvent être difficiles à évaluer au début.",
    notice: "Ces montants concernent seulement le loyer. Dépôt, charges, nourriture et transport sont séparés.",
    footerNote: "Ces montants sont des repères approximatifs. Des frais supplémentaires peuvent s’ajouter.",
    options: [
      {
        value: "budget_400_600",
        label: "400-600 $ CA",
        description: "Budget très bas. Les options peuvent être limitées.",
      },
      {
        value: "budget_600_900",
        label: "600-900 $ CA",
        description: "Budget plutôt adapté aux chambres ou logements partagés.",
      },
      {
        value: "budget_900_1200",
        label: "900-1 200 $ CA",
        description: "Fourchette pratique pour comparer des chambres.",
      },
      {
        value: "budget_1200_1800",
        label: "1 200-1 800 $ CA",
        description: "Vous pouvez comparer de meilleures chambres ou certains espaces privés.",
      },
      {
        value: "budget_1800_plus",
        label: "1 800 $ CA et plus",
        description: "Vous pouvez envisager studios, condos ou logements plus privés.",
      },
    ],
  },
  {
    id: "housingType",
    title: "Q5. Avez-vous déjà un type de logement en tête?",
    helpTitle: "Types de logement",
    options: [
      {
        value: "housing_room_share",
        label: "Chambre ou colocation me convient",
        description: "Je peux partager les espaces communs pour réduire le coût.",
      },
      {
        value: "housing_private_space",
        label: "Je préfère un espace privé",
        description: "Je veux comparer studios, condos, sous-sols ou options similaires.",
      },
      {
        value: "housing_start_simple",
        label: "Je peux commencer par une chambre",
        description: "Je peux m’installer d’abord, puis déménager plus tard.",
      },
      {
        value: "housing_not_sure",
        label: "Je ne sais pas encore",
        description: "Je veux d’abord comprendre les types de logement.",
      },
    ],
  },
  {
    id: "afterSchool",
    title: "Q6. Que voulez-vous faire le plus souvent après les cours?",
    options: [
      {
        value: "after_school_near_school",
        label: "Voir des camarades près de l’école",
        description: "Je pourrais manger ou sortir avec eux après les cours.",
      },
      {
        value: "after_school_korean_food",
        label: "Aller vers les zones coréennes",
        description: "La nourriture, les amis et les informations coréennes comptent.",
      },
      {
        value: "after_school_city_activity",
        label: "Explorer restaurants, lieux et événements",
        description: "Je veux découvrir la ville avec de nouveaux amis.",
      },
      {
        value: "after_school_home_area",
        label: "Me reposer près du logement",
        description: "Je préfère une routine calme autour de chez moi.",
      },
      {
        value: "after_school_not_sure",
        label: "Je ne sais pas encore",
        description: "Je ne connais pas encore mon rythme.",
      },
    ],
  },
  {
    id: "koreanCommunity",
    title: "Q7. L’accès à la communauté coréenne est-il important pour vous?",
    intro: "Cela signifie nourriture, magasins, informations et repères coréens au début.",
    options: [
      {
        value: "korean_very_important",
        label: "Très important",
        description: "Je pense en avoir besoin au début.",
      },
      {
        value: "korean_somewhat",
        label: "Utile, mais pas obligatoire",
        description: "Cela aide, mais je n’ai pas besoin d’habiter juste à côté.",
      },
      {
        value: "korean_beginner_need",
        label: "Utile au début",
        description: "Cela peut aider pendant l’installation.",
      },
      {
        value: "korean_not_important",
        label: "Pas très important",
        description: "Je veux découvrir davantage les zones locales.",
      },
    ],
  },
  {
    id: "cityActivity",
    title: "Q8. À quelle fréquence pensez-vous aller dans les secteurs centraux, les attractions ou les événements?",
    options: [
      {
        value: "city_activity_very_often",
        label: "Très souvent",
        description: "Je prévois beaucoup de sorties, événements ou visites.",
      },
      {
        value: "city_activity_often",
        label: "Deux ou trois fois par semaine",
        description: "J’irai souvent, mais pas tous les jours.",
      },
      {
        value: "city_activity_weekend",
        label: "Surtout le week-end",
        description: "En semaine, les cours et le quartier du logement comptent plus.",
      },
      {
        value: "city_activity_low",
        label: "Pas très souvent",
        description: "Le repos près du logement compte plus.",
      },
    ],
  },
  {
    id: "partTime",
    title: "Q9. Êtes-vous ouvert à un petit emploi à temps partiel si c’est permis?",
    notice:
      "Le droit de travailler dépend du visa, du statut étudiant et du programme. MapleHouse ne fournit pas de conseil visa ou emploi.",
    options: [
      {
        value: "parttime_yes",
        label: "Oui, si possible",
        description: "Je veux garder cette possibilité ouverte.",
      },
      {
        value: "parttime_maybe",
        label: "Peut-être plus tard",
        description: "Je pourrais regarder si ma situation le permet.",
      },
      {
        value: "parttime_low",
        label: "Les études et la vie quotidienne comptent plus",
        description: "L’adaptation à l’école et à la ville est prioritaire.",
      },
      {
        value: "parttime_no",
        label: "Non",
        description: "Je ne pense pas au travail à temps partiel.",
      },
    ],
  },
  {
    id: "finalPriority",
    title: "Q10. Si vous deviez choisir une seule priorité, laquelle serait la plus importante?",
    options: [
      {
        value: "final_school_commute",
        label: "Trajet simple vers l’école",
        description: "Je veux réduire le stress des cours tôt le matin.",
      },
      {
        value: "final_budget",
        label: "Économiser sur le loyer",
        description: "Un loyer plus bas compte, même avec plus de trajet.",
      },
      {
        value: "final_social_activity",
        label: "Vie sociale après les cours",
        description: "Repas, événements, visites et amis comptent.",
      },
      {
        value: "final_korean_community",
        label: "Nourriture et infos coréennes",
        description: "L’accès à la communauté coréenne compte.",
      },
      {
        value: "final_beginner_stability",
        label: "Installation stable au début",
        description: "Je veux un secteur facile à gérer au départ.",
      },
      {
        value: "final_subway_convenience",
        label: "Mobilité simple en métro",
        description: "Je veux des trajets faciles à comprendre.",
      },
    ],
  },
];

const englishLanguageStudyBudgetComments: Record<string, LanguageStudyBudgetComment> = {
  budget_400_600: {
    label: "C$400-600",
    comment:
      "This is a very low budget range. You may need to compare farther areas, shared housing, and room condition carefully.",
  },
  budget_600_900: {
    label: "C$600-900",
    comment:
      "This is a budget room-rental range. Compare school access and lower-rent areas together.",
  },
  budget_900_1200: {
    label: "C$900-1,200",
    comment:
      "This is a practical range for comparing room rentals. Check location, roommates, and morning commute together.",
  },
  budget_1200_1800: {
    label: "C$1,200-1,800",
    comment:
      "You may compare better rooms, basements, or some private-space options. Check price against space and route.",
  },
  budget_1800_plus: {
    label: "C$1,800+",
    comment:
      "You may consider studios, condos, or private spaces. Still compare daily routes and budget sustainability.",
  },
};

const frenchLanguageStudyBudgetComments: Record<string, LanguageStudyBudgetComment> = {
  budget_400_600: {
    label: "400-600 $ CA",
    comment:
      "Budget très bas. Comparez les secteurs plus éloignés, la colocation et l’état du logement avec attention.",
  },
  budget_600_900: {
    label: "600-900 $ CA",
    comment:
      "Budget adapté aux chambres. Comparez l’accès à l’école et les zones moins chères.",
  },
  budget_900_1200: {
    label: "900-1 200 $ CA",
    comment:
      "Fourchette pratique pour comparer des chambres. Vérifiez le quartier, les colocataires et le trajet du matin.",
  },
  budget_1200_1800: {
    label: "1 200-1 800 $ CA",
    comment:
      "Vous pouvez comparer de meilleures chambres ou certains espaces privés. Vérifiez prix, espace et trajet.",
  },
  budget_1800_plus: {
    label: "1 800 $ CA et plus",
    comment:
      "Vous pouvez envisager studios, condos ou espaces privés. Vérifiez aussi les trajets et la durée du budget.",
  },
};

const englishLanguageStudyResults: Record<string, LanguageStudyResultTemplate> = {
  languageResult01: {
    id: "languageResult01",
    title: "ILAC Growth / central transfer type",
    recommendedStations: ["bloorYonge"],
    comparisonStations: ["college", "stGeorge", "sherbourne"],
    goodFor: "Good for ILAC Growth or unknown ILAC campus students who want to reduce morning commute stress.",
    reason: "It works well as a central reference point for ILAC and subway connections.",
    caution: "ILAC has multiple campuses. Confirm your assigned campus before deciding.",
  },
  languageResult02: {
    id: "languageResult02",
    title: "ILAC College / University Pathway access type",
    recommendedStations: ["college"],
    comparisonStations: ["stGeorge", "dundas", "christie"],
    goodFor: "Good for ILAC University Pathway or College Street area students.",
    reason: "It helps compare school access, city-centre life, and nearby housing areas.",
    caution: "Confirm the real campus address and class schedule.",
  },
  languageResult03: {
    id: "languageResult03",
    title: "ILAC Dream / Sherbourne arrival type",
    recommendedStations: ["sherbourne"],
    comparisonStations: ["bloorYonge", "broadview", "christie"],
    goodFor: "Good for ILAC Dream Campus students.",
    reason: "Sherbourne is useful as the school arrival station, while housing can be compared nearby.",
    caution: "Sherbourne is mainly an arrival reference. Compare housing around nearby stations too.",
  },
  languageResult04: {
    id: "languageResult04",
    title: "ILSC / University Avenue access type",
    recommendedStations: ["stPatrick"],
    comparisonStations: ["dundas", "college", "stGeorge"],
    goodFor: "Good for ILSC Toronto students.",
    reason: "It gives a clear school arrival reference and nearby central comparison stations.",
    caution: "Do not look only around St Patrick. Compare nearby central areas too.",
  },
  languageResult05: {
    id: "languageResult05",
    title: "EC / Hansa midtown balance type",
    recommendedStations: ["eglinton"],
    comparisonStations: ["bloorYonge", "northYorkCentre", "christie"],
    goodFor: "Good for EC English or Hansa students.",
    reason: "It balances school access, daily convenience, and housing comparison.",
    caution: "Check the official class location and schedule again.",
  },
  languageResult06: {
    id: "languageResult06",
    title: "Kaplan / Union arrival type",
    recommendedStations: ["union"],
    comparisonStations: ["bloorYonge", "college", "dundas"],
    goodFor: "Good for Kaplan Toronto students.",
    reason: "Union is useful as the school arrival station for the south city-centre area.",
    caution: "Housing right around Union can be expensive. Compare a wider range.",
  },
  languageResult07: {
    id: "languageResult07",
    title: "City-centre activity type",
    recommendedStations: ["college", "dundas"],
    comparisonStations: ["bloorYonge", "stGeorge", "union"],
    goodFor: "Good for students who expect many meals, events, sightseeing, and plans after class.",
    reason: "These stations help compare a wider after-class activity range.",
    caution: "Better activity access can raise rent pressure.",
  },
  languageResult08: {
    id: "languageResult08",
    title: "Central balance type",
    recommendedStations: ["stGeorge"],
    comparisonStations: ["bloorYonge", "college", "christie"],
    goodFor: "Good if the busiest central areas feel too intense but access still matters.",
    reason: "It balances school access, city-centre access, and housing comparison.",
    caution: "The real commute direction can change by school location.",
  },
  languageResult09: {
    id: "languageResult09",
    title: "Korean community and social balance type",
    recommendedStations: ["christie"],
    comparisonStations: ["bloorYonge", "dufferin", "college"],
    goodFor: "Good if Korean food, community access, friends, and city access all matter.",
    reason: "It is a balanced comparison point between Korean community access and central routes.",
    caution: "If Korean community access is not important, this may be a lower priority.",
  },
  languageResult10: {
    id: "languageResult10",
    title: "North York first-arrival stability type",
    recommendedStations: ["northYorkCentre"],
    comparisonStations: ["finch", "eglinton", "bloorYonge"],
    goodFor: "Good if first-arrival stability, Korean food, and daily convenience matter.",
    reason: "It can help compare early settlement and daily convenience.",
    caution: "If your school is central, check the morning commute carefully.",
  },
  languageResult11: {
    id: "languageResult11",
    title: "West-side budget comparison type",
    recommendedStations: ["dufferin"],
    comparisonStations: ["christie", "college", "stGeorge"],
    goodFor: "Good if you want to save rent without feeling completely far from central areas.",
    reason: "It helps compare rent value and central access together.",
    caution: "Check listing condition and real routes yourself.",
  },
  languageResult12: {
    id: "languageResult12",
    title: "East-side budget comparison type",
    recommendedStations: ["broadview", "victoriaPark"],
    comparisonStations: ["bloorYonge", "eglinton", "christie"],
    goodFor: "Good if you want lower rent and can handle more morning travel.",
    reason: "It helps compare east-side options while avoiding some central rent pressure.",
    caution: "For early classes, always check real route and time on a map.",
  },
};

const frenchLanguageStudyResults: Record<string, LanguageStudyResultTemplate> = {
  languageResult01: {
    id: "languageResult01",
    title: "ILAC Growth / repère central",
    recommendedStations: ["bloorYonge"],
    comparisonStations: ["college", "stGeorge", "sherbourne"],
    goodFor: "Pour ILAC Growth ou un campus ILAC encore inconnu, avec priorité au trajet du matin.",
    reason: "Bloor-Yonge sert de repère central pour ILAC et les correspondances.",
    caution: "ILAC a plusieurs campus. Confirmez votre campus avant de choisir.",
  },
  languageResult02: {
    id: "languageResult02",
    title: "ILAC College / accès University Pathway",
    recommendedStations: ["college"],
    comparisonStations: ["stGeorge", "dundas", "christie"],
    goodFor: "Pour ILAC University Pathway ou les écoles autour de College Street.",
    reason: "Ce secteur aide à comparer accès à l’école, centre-ville et logement.",
    caution: "Confirmez l’adresse réelle du campus et l’horaire.",
  },
  languageResult03: {
    id: "languageResult03",
    title: "ILAC Dream / arrivée Sherbourne",
    recommendedStations: ["sherbourne"],
    comparisonStations: ["bloorYonge", "broadview", "christie"],
    goodFor: "Pour les étudiants du campus ILAC Dream.",
    reason: "Sherbourne est utile comme station d’arrivée; le logement peut se comparer autour.",
    caution: "Sherbourne est surtout un repère d’arrivée. Comparez aussi les stations proches.",
  },
  languageResult04: {
    id: "languageResult04",
    title: "ILSC / accès University Avenue",
    recommendedStations: ["stPatrick"],
    comparisonStations: ["dundas", "college", "stGeorge"],
    goodFor: "Pour les étudiants d’ILSC Toronto.",
    reason: "St Patrick donne un repère clair pour l’arrivée à l’école.",
    caution: "Ne regardez pas seulement St Patrick. Comparez les secteurs proches.",
  },
  languageResult05: {
    id: "languageResult05",
    title: "EC / Hansa équilibre midtown",
    recommendedStations: ["eglinton"],
    comparisonStations: ["bloorYonge", "northYorkCentre", "christie"],
    goodFor: "Pour les étudiants EC English ou Hansa.",
    reason: "Eglinton équilibre accès à l’école, vie quotidienne et comparaison de logements.",
    caution: "Revérifiez l’adresse et l’horaire officiels.",
  },
  languageResult06: {
    id: "languageResult06",
    title: "Kaplan / arrivée Union",
    recommendedStations: ["union"],
    comparisonStations: ["bloorYonge", "college", "dundas"],
    goodFor: "Pour les étudiants Kaplan Toronto.",
    reason: "Union sert de repère d’arrivée pour le sud du centre-ville.",
    caution: "Autour d’Union, les loyers peuvent être élevés. Comparez plus large.",
  },
  languageResult07: {
    id: "languageResult07",
    title: "Vie active au centre",
    recommendedStations: ["college", "dundas"],
    comparisonStations: ["bloorYonge", "stGeorge", "union"],
    goodFor: "Pour les étudiants qui prévoient repas, sorties, visites et événements après les cours.",
    reason: "Ces stations aident à comparer un rayon de vie actif après les cours.",
    caution: "Un meilleur accès aux activités peut augmenter le loyer.",
  },
  languageResult08: {
    id: "languageResult08",
    title: "Équilibre central",
    recommendedStations: ["stGeorge"],
    comparisonStations: ["bloorYonge", "college", "christie"],
    goodFor: "Pour ceux qui veulent l’accès central sans être dans le secteur le plus intense.",
    reason: "St George équilibre accès à l’école, centre-ville et logement.",
    caution: "Le vrai trajet dépend de l’adresse de l’école.",
  },
  languageResult09: {
    id: "languageResult09",
    title: "Communauté coréenne et vie sociale",
    recommendedStations: ["christie"],
    comparisonStations: ["bloorYonge", "dufferin", "college"],
    goodFor: "Pour ceux qui veulent nourriture coréenne, repères communautaires et accès central.",
    reason: "Christie offre un repère entre communauté coréenne et accès au centre.",
    caution: "Si cette communauté n’est pas importante, ce choix peut être moins prioritaire.",
  },
  languageResult10: {
    id: "languageResult10",
    title: "Stabilité d’arrivée à North York",
    recommendedStations: ["northYorkCentre"],
    comparisonStations: ["finch", "eglinton", "bloorYonge"],
    goodFor: "Pour une première arrivée avec besoin de repères, nourriture coréenne et commodités.",
    reason: "Ce secteur aide à comparer installation initiale et confort quotidien.",
    caution: "Si l’école est centrale, vérifiez bien le trajet du matin.",
  },
  languageResult11: {
    id: "languageResult11",
    title: "Budget côté ouest",
    recommendedStations: ["dufferin"],
    comparisonStations: ["christie", "college", "stGeorge"],
    goodFor: "Pour économiser sans être complètement loin des secteurs centraux.",
    reason: "Dufferin aide à comparer budget et accès au centre.",
    caution: "Vérifiez vous-même l’état du logement et le trajet réel.",
  },
  languageResult12: {
    id: "languageResult12",
    title: "Budget côté est",
    recommendedStations: ["broadview", "victoriaPark"],
    comparisonStations: ["bloorYonge", "eglinton", "christie"],
    goodFor: "Pour réduire le loyer et accepter un trajet du matin plus long.",
    reason: "Ces stations aident à comparer l’est tout en évitant une partie des loyers centraux.",
    caution: "Pour les cours tôt, vérifiez toujours le vrai trajet sur une carte.",
  },
};

const englishHousingGlossary: ChecklistLocaleContent["languageStudy"]["glossary"] = {
  trigger: "Terms",
  title: "Quick housing terms",
  closeLabel: "Close housing terms",
  items: [
    {
      term: "Room rent",
      description: [
        "Renting one room inside a house or condo.",
        "Kitchen, bathroom, and living room may be shared.",
      ],
      pictogram: "room",
    },
    {
      term: "Shared house",
      description: [
        "Several people share one home.",
        "Bedrooms are often private, while common areas are shared.",
      ],
      pictogram: "share",
    },
    {
      term: "Studio",
      description: ["A one-room private unit where bedroom and living space are not separated."],
      pictogram: "studio",
    },
    {
      term: "1BR",
      description: ["A home with one separate bedroom and a living/kitchen area."],
      pictogram: "oneBedroom",
    },
    {
      term: "Den",
      description: [
        "A small extra space.",
        "Size, door, and window conditions vary, so check if it can really work as a bedroom.",
      ],
      pictogram: "den",
    },
    {
      term: "Basement",
      description: [
        "A basement or semi-basement space.",
        "Check daylight, moisture, ceiling height, and entrance.",
      ],
      pictogram: "basement",
    },
    {
      term: "Condo",
      description: [
        "A private unit in a managed apartment-style building.",
        "Amenities may exist, but rent can be higher.",
      ],
      pictogram: "condo",
    },
  ],
};

const frenchHousingGlossary: ChecklistLocaleContent["languageStudy"]["glossary"] = {
  trigger: "Termes",
  title: "Repères logement",
  closeLabel: "Fermer les termes",
  items: [
    {
      term: "Chambre à louer",
      description: [
        "Une chambre louée dans une maison ou un condo.",
        "Cuisine, salle de bain ou salon peuvent être partagés.",
      ],
      pictogram: "room",
    },
    {
      term: "Maison partagée",
      description: [
        "Plusieurs personnes partagent le même logement.",
        "Les chambres sont souvent privées, les espaces communs partagés.",
      ],
      pictogram: "share",
    },
    {
      term: "Studio",
      description: ["Logement privé d’une seule pièce, sans chambre séparée."],
      pictogram: "studio",
    },
    {
      term: "1 chambre",
      description: ["Logement avec une chambre séparée et un espace salon/cuisine."],
      pictogram: "oneBedroom",
    },
    {
      term: "Den",
      description: [
        "Petit espace supplémentaire.",
        "Taille, porte et fenêtre varient; vérifiez s’il peut servir de chambre.",
      ],
      pictogram: "den",
    },
    {
      term: "Sous-sol",
      description: [
        "Espace en sous-sol ou demi-sous-sol.",
        "Vérifiez lumière, humidité, hauteur du plafond et entrée.",
      ],
      pictogram: "basement",
    },
    {
      term: "Condo",
      description: [
        "Unité privée dans un immeuble de type appartement géré.",
        "Des commodités peuvent exister, mais le loyer peut être plus élevé.",
      ],
      pictogram: "condo",
    },
  ],
};

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
        button: "Find my school area",
        action: "language",
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
    languageStudy: {
      intro: {
        label: "LANGUAGE STUDY",
        title: "Find a Toronto station area for language study",
        paragraphs: [
          "When studying English in Toronto, your school location is only one part of the decision.",
          "You also need to consider morning commute, rent budget, after-class life, and Korean community access.",
          "This is not a final answer. Use it as a starting point, and always check real commute times on a map.",
        ],
      },
      ilacCampusQuestion: englishLanguageStudyIlacCampusQuestion,
      questions: englishLanguageStudyQuestions,
      result: {
        eyebrow: "Language Study Result",
        title: "Station areas to start your search",
        description: [
          "This recommendation is not a final answer. Use it as a starting point for comparing homes.",
          "Always check real commute time, class schedule, listing condition, and contract terms yourself.",
        ],
        destinationTitle: "School arrival station",
        comparisonTitle: "Home-search comparison stations",
        recommendationTitle: "Recommended stations",
        reasonTitle: "Why this fits",
        reasonPrefix:
          "Recommended based on school, morning commute, rent budget, and after-class life.",
        nearbyTitle: "Nearby comparison range",
        nearbyPrefix: "Do not look only at the recommended station. Compare nearby stations such as",
        nearbySuffix: "as well. Listing supply and prices can change.",
        goodForTitle: "Good for this user",
        importantNotesTitle: "Important notes",
        viewListings: "View listings",
        startChecklist: "Start checklist",
        retake: "Retake survey",
        support: "Contact MapleHouse",
        supportNotice:
          "MapleHouse-assisted inquiry will be connected to a paid plan later. This is an MVP preview.",
      },
      legalNoticeLines: [
        "This recommendation is only a starting point for your housing search.",
        "Real commute time can change by class time, weather, and transit conditions.",
        "Always check the route yourself on a map before signing a contract.",
        "Confirm school registration, campus address, and class schedule through official school information.",
        "MapleHouse does not provide school registration, visa advice, legal advice, brokerage, escrow, or payment transfer services.",
      ],
      budgetComments: englishLanguageStudyBudgetComments,
      resultTemplates: englishLanguageStudyResults,
      glossary: englishHousingGlossary,
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
        button: "Trouver mon secteur",
        action: "language",
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
    languageStudy: {
      intro: {
        label: "SÉJOUR LINGUISTIQUE",
        title: "Trouver un secteur de station pour vos cours de langue",
        paragraphs: [
          "Pour un séjour linguistique à Toronto, l’emplacement de l’école n’est qu’un point de départ.",
          "Il faut aussi tenir compte du trajet du matin, du budget, de la vie après les cours et des repères utiles au début.",
          "Ce résultat n’est pas une réponse définitive. Utilisez-le comme point de départ et vérifiez toujours les trajets réels sur une carte.",
        ],
      },
      ilacCampusQuestion: frenchLanguageStudyIlacCampusQuestion,
      questions: frenchLanguageStudyQuestions,
      result: {
        eyebrow: "Résultat séjour linguistique",
        title: "Secteurs de station pour commencer votre recherche",
        description: [
          "Cette recommandation n’est pas une réponse définitive. Utilisez-la comme point de départ pour comparer les logements.",
          "Vérifiez toujours vous-même le trajet réel, l’horaire des cours, l’état de l’annonce et les conditions.",
        ],
        destinationTitle: "Station d’arrivée à l’école",
        comparisonTitle: "Stations à comparer pour le logement",
        recommendationTitle: "Stations recommandées",
        reasonTitle: "Pourquoi ce choix",
        reasonPrefix:
          "Recommandé selon l’école, le trajet du matin, le budget et la vie après les cours.",
        nearbyTitle: "Secteurs proches à comparer",
        nearbyPrefix: "Ne regardez pas seulement la station recommandée. Comparez aussi",
        nearbySuffix: "autour. L’offre et les prix peuvent changer.",
        goodForTitle: "Profil concerné",
        importantNotesTitle: "Points importants",
        viewListings: "Voir les logements",
        startChecklist: "Commencer la check-list",
        retake: "Refaire le questionnaire",
        support: "Contacter MapleHouse",
        supportNotice:
          "La demande assistée par MapleHouse sera liée à un forfait payant plus tard. Ceci est un aperçu MVP.",
      },
      legalNoticeLines: [
        "Cette recommandation sert seulement de point de départ pour votre recherche de logement.",
        "Le vrai trajet peut changer selon l’horaire, la météo et les conditions de transport.",
        "Vérifiez toujours le trajet sur une carte avant de signer un contrat.",
        "Confirmez l’inscription, l’adresse du campus et l’horaire avec les informations officielles de l’école.",
        "MapleHouse ne fournit pas d’inscription scolaire, conseil visa, conseil juridique, courtage, escrow ou transfert d’argent.",
      ],
      budgetComments: frenchLanguageStudyBudgetComments,
      resultTemplates: frenchLanguageStudyResults,
      glossary: frenchHousingGlossary,
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
