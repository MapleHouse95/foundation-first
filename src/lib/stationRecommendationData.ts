export type Orientation =
  | "koreanCommunity"
  | "commuteMobility"
  | "downtownActivity"
  | "budgetValue";

export type QuestionId = "work" | "budget" | "priority" | "koreanLife" | "downtown";

export type AnswerValue =
  | "koreanJob"
  | "localService"
  | "officeAdmin"
  | "unknownMobility"
  | "budget1"
  | "budget2"
  | "budget3"
  | "budget4"
  | "budget5"
  | "priorityCost"
  | "priorityMobility"
  | "priorityCommunity"
  | "priorityStability"
  | "koreanHigh"
  | "koreanMedium"
  | "koreanLow"
  | "downtownDaily"
  | "downtownWeekly"
  | "downtownRare";

export type AnswerMap = Partial<Record<QuestionId, AnswerValue>>;

export interface AnswerOption {
  value: AnswerValue;
  label: string;
  description: string;
}

export interface WizardQuestion {
  id: QuestionId;
  title: string;
  intro?: string;
  notice?: string;
  footerNote?: string;
  options: AnswerOption[];
}

export interface RecommendationResult {
  id: string;
  title: string;
  stations: string[];
  reason: string;
  goodFor: string[];
  nearby: string;
  caution: string;
  reasonItems?: StationReasonItem[];
  nearbyItems?: StationReasonItem[];
  userFitSummary?: string;
}

export interface BudgetComment {
  label: string;
  comment: string;
}

export type GeneralChecklistQuestionId =
  | "location"
  | "budgetLife"
  | "beginnerFit"
  | "trustSignals"
  | "finalDecision";

export interface GeneralChecklistQuestion {
  id: GeneralChecklistQuestionId;
  title: string;
  resultTitle: string;
  options: string[];
}

type ScoreMap = Record<Orientation, number>;

export type StationLocale = "ko" | "en" | "fr";

export type ChecklistPurpose = "workingHoliday" | "languageStudy" | "university";

export type StationPoolKey =
  | "workingHoliday"
  | "languageStudyArrival"
  | "languageStudyHousing"
  | "university";

export type StationId =
  | "finch"
  | "northYorkCentre"
  | "christie"
  | "eglinton"
  | "bloorYonge"
  | "stGeorge"
  | "dundas"
  | "college"
  | "dufferin"
  | "broadview"
  | "victoriaPark"
  | "finchWest"
  | "stPatrick"
  | "union"
  | "sherbourne"
  | "yorkUniversity"
  | "pioneerVillage"
  | "queensPark"
  | "osgoode"
  | "king"
  | "dupont"
  | "donMills"
  | "kennedy";

export interface StationMetadata {
  id: StationId;
  canonicalName: string;
  displayName: Record<StationLocale, string>;
  aliasNames?: string[];
}

export const STATION_METADATA: Record<StationId, StationMetadata> = {
  finch: {
    id: "finch",
    canonicalName: "Finch",
    displayName: {
      ko: "Finch Station (핀치 역)",
      en: "Finch Station",
      fr: "Finch Station",
    },
  },
  northYorkCentre: {
    id: "northYorkCentre",
    canonicalName: "North York Centre",
    displayName: {
      ko: "North York Centre Station (노스 요크 센터 역)",
      en: "North York Centre Station",
      fr: "North York Centre Station",
    },
  },
  christie: {
    id: "christie",
    canonicalName: "Christie",
    displayName: {
      ko: "Christie Station (크리스티 역)",
      en: "Christie Station",
      fr: "Christie Station",
    },
  },
  eglinton: {
    id: "eglinton",
    canonicalName: "Eglinton",
    displayName: {
      ko: "Eglinton Station (에글린턴 역)",
      en: "Eglinton Station",
      fr: "Eglinton Station",
    },
  },
  bloorYonge: {
    id: "bloorYonge",
    canonicalName: "Bloor-Yonge",
    displayName: {
      ko: "Bloor-Yonge Station (블루어-영 역)",
      en: "Bloor-Yonge Station",
      fr: "Bloor-Yonge Station",
    },
  },
  stGeorge: {
    id: "stGeorge",
    canonicalName: "St George",
    displayName: {
      ko: "St George Station (세인트 조지 역)",
      en: "St George Station",
      fr: "St George Station",
    },
  },
  dundas: {
    id: "dundas",
    // TODO: migrate the internal `dundas` station id after the MVP station pool is validated.
    canonicalName: "TMU",
    displayName: {
      ko: "TMU Station (구 Dundas Station / 던다스 역)",
      en: "TMU Station (formerly Dundas Station)",
      fr: "TMU Station (anciennement Dundas Station)",
    },
    aliasNames: ["Dundas", "Dundas Station", "TMU Station"],
  },
  college: {
    id: "college",
    canonicalName: "College",
    displayName: {
      ko: "College Station (칼리지 역)",
      en: "College Station",
      fr: "College Station",
    },
  },
  dufferin: {
    id: "dufferin",
    canonicalName: "Dufferin",
    displayName: {
      ko: "Dufferin Station (더퍼린 역)",
      en: "Dufferin Station",
      fr: "Dufferin Station",
    },
  },
  broadview: {
    id: "broadview",
    canonicalName: "Broadview",
    displayName: {
      ko: "Broadview Station (브로드뷰 역)",
      en: "Broadview Station",
      fr: "Broadview Station",
    },
  },
  victoriaPark: {
    id: "victoriaPark",
    canonicalName: "Victoria Park",
    displayName: {
      ko: "Victoria Park Station (빅토리아 파크 역)",
      en: "Victoria Park Station",
      fr: "Victoria Park Station",
    },
  },
  finchWest: {
    id: "finchWest",
    canonicalName: "Finch West",
    displayName: {
      ko: "Finch West Station (핀치 웨스트 역)",
      en: "Finch West Station",
      fr: "Finch West Station",
    },
  },
  stPatrick: {
    id: "stPatrick",
    canonicalName: "St Patrick",
    displayName: {
      ko: "St Patrick Station (세인트 패트릭 역)",
      en: "St Patrick Station",
      fr: "St Patrick Station",
    },
  },
  union: {
    id: "union",
    canonicalName: "Union",
    displayName: {
      ko: "Union Station (유니언 역)",
      en: "Union Station",
      fr: "Union Station",
    },
  },
  sherbourne: {
    id: "sherbourne",
    canonicalName: "Sherbourne",
    displayName: {
      ko: "Sherbourne Station (셜번 역)",
      en: "Sherbourne Station",
      fr: "Sherbourne Station",
    },
  },
  yorkUniversity: {
    id: "yorkUniversity",
    canonicalName: "York University",
    displayName: {
      ko: "York University Station (요크 유니버시티 역)",
      en: "York University Station",
      fr: "York University Station",
    },
  },
  pioneerVillage: {
    id: "pioneerVillage",
    canonicalName: "Pioneer Village",
    displayName: {
      ko: "Pioneer Village Station (파이오니어 빌리지 역)",
      en: "Pioneer Village Station",
      fr: "Pioneer Village Station",
    },
  },
  queensPark: {
    id: "queensPark",
    canonicalName: "Queen's Park",
    displayName: {
      ko: "Queen's Park Station (퀸즈 파크 역)",
      en: "Queen's Park Station",
      fr: "Queen's Park Station",
    },
  },
  osgoode: {
    id: "osgoode",
    canonicalName: "Osgoode",
    displayName: {
      ko: "Osgoode Station (오스굿 역)",
      en: "Osgoode Station",
      fr: "Osgoode Station",
    },
  },
  king: {
    id: "king",
    canonicalName: "King",
    displayName: {
      ko: "King Station (킹 역)",
      en: "King Station",
      fr: "King Station",
    },
  },
  dupont: {
    id: "dupont",
    canonicalName: "Dupont",
    displayName: {
      ko: "Dupont Station (듀폰 역)",
      en: "Dupont Station",
      fr: "Dupont Station",
    },
  },
  donMills: {
    id: "donMills",
    canonicalName: "Don Mills",
    displayName: {
      ko: "Don Mills Station (돈 밀스 역)",
      en: "Don Mills Station",
      fr: "Don Mills Station",
    },
  },
  kennedy: {
    id: "kennedy",
    canonicalName: "Kennedy",
    displayName: {
      ko: "Kennedy Station (케네디 역)",
      en: "Kennedy Station",
      fr: "Kennedy Station",
    },
  },
};

const STATION_NAME_TO_ID = Object.fromEntries(
  Object.values(STATION_METADATA).flatMap((station) => [
    [station.canonicalName, station.id],
    ...(station.aliasNames ?? []).map((aliasName) => [aliasName, station.id]),
  ]),
) as Record<string, StationId>;

export type StationProfileTag =
  | "central"
  | "koreanHub"
  | "budgetCompare"
  | "studentArea"
  | "campusAdjacent"
  | "academyArrival"
  | "northYork"
  | "eastRoute"
  | "westCompare"
  | "subwayTransfer"
  | "beginnerReference";

export interface StationProfile {
  rentAffordability: 1 | 2 | 3 | 4 | 5;
  livingConvenience: 1 | 2 | 3 | 4 | 5;
  koreanAccess: 1 | 2 | 3 | 4 | 5;
  transitConvenience: 1 | 2 | 3 | 4 | 5;
  beginnerPracticality: 1 | 2 | 3 | 4 | 5;
  tags: StationProfileTag[];
}

export interface StationReasonItem {
  stationId: string;
  roleLabel: string;
  reasonTitle: string;
  reasonBody: string;
  answerEvidence?: string;
}

// TODO: expand station profile metadata to the full TTC network after the MVP station pool is validated.
export const STATION_PROFILE_METADATA: Record<StationId, StationProfile> = {
  finch: {
    rentAffordability: 4,
    livingConvenience: 4,
    koreanAccess: 5,
    transitConvenience: 3,
    beginnerPracticality: 4,
    tags: ["koreanHub", "northYork", "beginnerReference"],
  },
  northYorkCentre: {
    rentAffordability: 3,
    livingConvenience: 5,
    koreanAccess: 5,
    transitConvenience: 4,
    beginnerPracticality: 5,
    tags: ["koreanHub", "northYork", "beginnerReference"],
  },
  christie: {
    rentAffordability: 3,
    livingConvenience: 4,
    koreanAccess: 5,
    transitConvenience: 4,
    beginnerPracticality: 4,
    tags: ["koreanHub", "studentArea", "westCompare", "beginnerReference"],
  },
  eglinton: {
    rentAffordability: 3,
    livingConvenience: 4,
    koreanAccess: 2,
    transitConvenience: 4,
    beginnerPracticality: 4,
    tags: ["studentArea", "beginnerReference"],
  },
  bloorYonge: {
    rentAffordability: 1,
    livingConvenience: 5,
    koreanAccess: 2,
    transitConvenience: 5,
    beginnerPracticality: 4,
    tags: ["central", "subwayTransfer", "academyArrival", "beginnerReference"],
  },
  stGeorge: {
    rentAffordability: 2,
    livingConvenience: 4,
    koreanAccess: 2,
    transitConvenience: 5,
    beginnerPracticality: 4,
    tags: ["central", "studentArea", "campusAdjacent", "subwayTransfer"],
  },
  dundas: {
    rentAffordability: 1,
    livingConvenience: 5,
    koreanAccess: 1,
    transitConvenience: 4,
    beginnerPracticality: 3,
    tags: ["central", "campusAdjacent", "academyArrival"],
  },
  college: {
    rentAffordability: 2,
    livingConvenience: 5,
    koreanAccess: 2,
    transitConvenience: 4,
    beginnerPracticality: 4,
    tags: ["central", "studentArea", "campusAdjacent", "academyArrival"],
  },
  dufferin: {
    rentAffordability: 4,
    livingConvenience: 3,
    koreanAccess: 2,
    transitConvenience: 3,
    beginnerPracticality: 3,
    tags: ["budgetCompare", "westCompare"],
  },
  broadview: {
    rentAffordability: 4,
    livingConvenience: 3,
    koreanAccess: 1,
    transitConvenience: 3,
    beginnerPracticality: 3,
    tags: ["budgetCompare", "eastRoute"],
  },
  victoriaPark: {
    rentAffordability: 5,
    livingConvenience: 3,
    koreanAccess: 1,
    transitConvenience: 3,
    beginnerPracticality: 2,
    tags: ["budgetCompare", "eastRoute"],
  },
  finchWest: {
    rentAffordability: 4,
    livingConvenience: 3,
    koreanAccess: 2,
    transitConvenience: 3,
    beginnerPracticality: 3,
    tags: ["budgetCompare", "campusAdjacent", "westCompare"],
  },
  stPatrick: {
    rentAffordability: 2,
    livingConvenience: 4,
    koreanAccess: 1,
    transitConvenience: 4,
    beginnerPracticality: 3,
    tags: ["central", "campusAdjacent", "academyArrival"],
  },
  union: {
    rentAffordability: 1,
    livingConvenience: 4,
    koreanAccess: 1,
    transitConvenience: 5,
    beginnerPracticality: 3,
    tags: ["central", "subwayTransfer", "academyArrival"],
  },
  sherbourne: {
    rentAffordability: 2,
    livingConvenience: 3,
    koreanAccess: 1,
    transitConvenience: 3,
    beginnerPracticality: 2,
    tags: ["central", "academyArrival"],
  },
  yorkUniversity: {
    rentAffordability: 3,
    livingConvenience: 3,
    koreanAccess: 1,
    transitConvenience: 4,
    beginnerPracticality: 3,
    tags: ["campusAdjacent", "studentArea"],
  },
  pioneerVillage: {
    rentAffordability: 4,
    livingConvenience: 2,
    koreanAccess: 1,
    transitConvenience: 3,
    beginnerPracticality: 2,
    tags: ["campusAdjacent", "budgetCompare"],
  },
  queensPark: {
    rentAffordability: 1,
    livingConvenience: 4,
    koreanAccess: 1,
    transitConvenience: 4,
    beginnerPracticality: 3,
    tags: ["central", "campusAdjacent", "studentArea"],
  },
  osgoode: {
    rentAffordability: 1,
    livingConvenience: 4,
    koreanAccess: 1,
    transitConvenience: 4,
    beginnerPracticality: 3,
    tags: ["central", "campusAdjacent"],
  },
  king: {
    rentAffordability: 1,
    livingConvenience: 4,
    koreanAccess: 1,
    transitConvenience: 4,
    beginnerPracticality: 3,
    tags: ["central", "campusAdjacent"],
  },
  dupont: {
    rentAffordability: 3,
    livingConvenience: 3,
    koreanAccess: 2,
    transitConvenience: 3,
    beginnerPracticality: 3,
    tags: ["studentArea", "campusAdjacent", "westCompare"],
  },
  donMills: {
    rentAffordability: 3,
    livingConvenience: 4,
    koreanAccess: 2,
    transitConvenience: 3,
    beginnerPracticality: 3,
    tags: ["eastRoute", "campusAdjacent"],
  },
  kennedy: {
    rentAffordability: 4,
    livingConvenience: 3,
    koreanAccess: 1,
    transitConvenience: 4,
    beginnerPracticality: 3,
    tags: ["eastRoute", "campusAdjacent", "budgetCompare"],
  },
};

interface ProvisionalStationDistanceNote {
  distanceText: string;
  travelText: string;
  distanceKm?: number;
  distanceKmRange?: readonly [number, number];
  explanationText?: string;
}

// TODO: Replace these provisional campus-to-station distance notes with validated static data or real map/API data before production.
const PROVISIONAL_STATION_DISTANCE_NOTES: Record<string, Partial<Record<StationId, ProvisionalStationDistanceNote>>> = {
  studyAbroad_ocad: {
    stPatrick: {
      distanceText: "약 0.5km 안팎",
      travelText: "걸어서 통학을 먼저 생각해볼 수 있는 거리",
      distanceKm: 0.5,
      explanationText:
        "세인트 패트릭 역은 OCAD와 가까운 역이에요.",
    },
    osgoode: {
      distanceText: "약 0.7km 안팎",
      travelText: "OCAD 근처 수업과 작업 일정을 같이 확인하기 좋은 거리",
      distanceKm: 0.7,
      explanationText:
        "오스굿 역은 OCAD 근처 수업과 작업실, 전시, 프로젝트 일정을 같이 생각할 때 참고하기 좋은 역이에요. 학교 바로 앞만 보지 않고 주변 선택지도 확인하고 싶을 때 보여드려요.",
    },
  },
  studyAbroad_uoftStGeorge: {
    stGeorge: {
      distanceText: "약 0.3~0.8km 범위",
      travelText: "캠퍼스 안팎 이동 기준으로 먼저 보기 좋은 거리",
      distanceKmRange: [0.3, 0.8],
    },
    queensPark: {
      distanceText: "약 0.5~1.0km 범위",
      travelText: "대학가 주변 생활권을 함께 보기 좋은 거리",
      distanceKmRange: [0.5, 1.0],
    },
  },
  studyAbroad_tmu: {
    dundas: {
      distanceText: "약 0.3~0.8km 범위",
      travelText: "TMU 중심 캠퍼스 기준으로 먼저 보기 좋은 거리",
      distanceKmRange: [0.3, 0.8],
    },
    college: {
      distanceText: "약 0.8~1.2km 범위",
      travelText: "TMU와 주변 생활권을 함께 비교하기 좋은 거리",
      distanceKmRange: [0.8, 1.2],
    },
  },
  studyAbroad_georgeBrownStJames: {
    king: {
      distanceText: "약 0.5km 안팎",
      travelText: "St. James 캠퍼스 기준으로 먼저 보기 좋은 거리",
      distanceKm: 0.5,
    },
    dundas: {
      distanceText: "약 0.8~1.2km 범위",
      travelText: "중심 생활권을 함께 비교하기 좋은 거리",
      distanceKmRange: [0.8, 1.2],
    },
  },
  studyAbroad_georgeBrownWaterfront: {
    union: {
      distanceText: "약 1.0km 안팎",
      travelText: "워터프론트 방향을 보는 기준으로 잡기 좋은 거리",
      distanceKm: 1.0,
    },
    king: {
      distanceText: "약 1.0~1.5km 범위",
      travelText: "중심 생활권을 함께 보기 좋은 거리",
      distanceKmRange: [1.0, 1.5],
    },
  },
  studyAbroad_georgeBrownCasaLoma: {
    dupont: {
      distanceText: "약 0.5km 안팎",
      travelText: "Casa Loma 캠퍼스 기준으로 먼저 보기 좋은 거리",
      distanceKm: 0.5,
    },
    stGeorge: {
      distanceText: "약 1.0km 안팎",
      travelText: "대학가 생활권과 함께 비교하기 좋은 거리",
      distanceKm: 1.0,
    },
  },
  studyAbroad_yorkKeele: {
    yorkUniversity: {
      distanceText: "캠퍼스 바로 앞 기준",
      travelText: "학교 기준으로 가장 먼저 확인할 수 있는 위치",
    },
    pioneerVillage: {
      distanceText: "캠퍼스 북서쪽 생활권",
      travelText: "캠퍼스 주변 생활권까지 함께 볼 때 참고하기 좋은 위치",
    },
  },
  studyAbroad_utsc: {
    kennedy: {
      distanceText: "스카버러 방향 통학 시작점",
      travelText: "버스 연결까지 함께 확인해야 하는 기준역",
    },
    victoriaPark: {
      distanceText: "동쪽 생활권 비교 후보",
      travelText: "예산과 생활권을 함께 비교하기 좋은 위치",
    },
  },
  studyAbroad_centennial: {
    kennedy: {
      distanceText: "스카버러 방향 통학 시작점",
      travelText: "버스 연결까지 함께 확인해야 하는 기준역",
    },
    victoriaPark: {
      distanceText: "동쪽 생활권 비교 후보",
      travelText: "예산과 생활권을 함께 비교하기 좋은 위치",
    },
  },
  languageStudy_ilacDream: {
    sherbourne: {
      distanceText: "어학원까지 약 0.5km 안팎",
      travelText: "ILAC Dream Campus 도착 기준역으로 보기 좋은 거리",
      distanceKm: 0.5,
    },
    bloorYonge: {
      distanceText: "약 0.8~1.2km 범위",
      travelText: "환승과 주변 생활권을 함께 비교하기 좋은 거리",
      distanceKmRange: [0.8, 1.2],
    },
  },
  languageStudy_ilsc: {
    stPatrick: {
      distanceText: "약 0.2~0.5km 범위",
      travelText: "ILSC 도착 기준역으로 보기 좋은 거리",
      distanceKmRange: [0.2, 0.5],
    },
  },
  languageStudy_ecHansa: {
    eglinton: {
      distanceText: "미드타운 생활권 기준",
      travelText: "어학원과 같은 미드타운 생활권에서 먼저 보기 좋은 위치",
      distanceKm: 0.5,
    },
  },
  languageStudy_kaplan: {
    union: {
      distanceText: "Kaplan 주변 중심 남쪽 기준",
      travelText: "중심 남쪽 접근 기준으로 보기 좋은 위치",
      distanceKm: 0.5,
    },
  },
};

export const WORKING_HOLIDAY_STATION_POOL: StationId[] = [
  "finch",
  "northYorkCentre",
  "christie",
  "eglinton",
  "bloorYonge",
  "stGeorge",
  "dundas",
  "college",
  "dufferin",
  "broadview",
  "victoriaPark",
  "finchWest",
];

export const LANGUAGE_STUDY_ARRIVAL_STATIONS: StationId[] = [
  "bloorYonge",
  "stPatrick",
  "eglinton",
  "union",
  "sherbourne",
  "college",
  "stGeorge",
  "dundas",
];

export const LANGUAGE_STUDY_HOUSING_STATION_POOL: StationId[] = [
  "bloorYonge",
  "college",
  "dundas",
  "stGeorge",
  "eglinton",
  "christie",
  "finch",
  "northYorkCentre",
  "dufferin",
  "broadview",
  "victoriaPark",
  "stPatrick",
  "union",
  "sherbourne",
];

export const UNIVERSITY_STATION_POOL: StationId[] = [
  "stGeorge",
  "queensPark",
  "college",
  "bloorYonge",
  "christie",
  "dundas",
  "stPatrick",
  "osgoode",
  "king",
  "union",
  "dupont",
  "yorkUniversity",
  "finchWest",
  "pioneerVillage",
  "finch",
  "northYorkCentre",
  "donMills",
  "eglinton",
  "kennedy",
  "victoriaPark",
  "broadview",
  "dufferin",
  "sherbourne",
];

export const STATION_POOL_BY_PURPOSE: Record<ChecklistPurpose, StationId[]> = {
  workingHoliday: WORKING_HOLIDAY_STATION_POOL,
  languageStudy: LANGUAGE_STUDY_HOUSING_STATION_POOL,
  university: UNIVERSITY_STATION_POOL,
};

export const STATION_POOL_BY_KEY: Record<StationPoolKey, StationId[]> = {
  workingHoliday: WORKING_HOLIDAY_STATION_POOL,
  languageStudyArrival: LANGUAGE_STUDY_ARRIVAL_STATIONS,
  languageStudyHousing: LANGUAGE_STUDY_HOUSING_STATION_POOL,
  university: UNIVERSITY_STATION_POOL,
};

export const STATION_CANDIDATES = WORKING_HOLIDAY_STATION_POOL.map(
  (stationId) => STATION_METADATA[stationId].canonicalName,
);

export const STATION_DISPLAY_NAMES: Record<string, string> = Object.fromEntries(
  Object.values(STATION_METADATA).map((station) => [
    station.canonicalName,
    station.displayName.ko,
  ]),
);

export const REQUIRED_QUESTION_IDS: QuestionId[] = [
  "work",
  "budget",
  "priority",
  "koreanLife",
  "downtown",
];

export const WORKING_HOLIDAY_QUESTIONS: WizardQuestion[] = [
  {
    id: "work",
    title: "Q1. 어떤 방향으로 일을 구할 가능성이 높으신가요?",
    options: [
      {
        value: "koreanJob",
        label: "한국인 가게도 적극 고려합니다",
        description: "한인 식당, 카페, 마트, 한인 커뮤니티 기반 일자리도 고려하고 있습니다.",
      },
      {
        value: "localService",
        label: "현지 매장/서비스직을 우선 고려합니다",
        description: "리테일, 카페, 레스토랑 등 현지 서비스직을 먼저 보고 싶습니다.",
      },
      {
        value: "officeAdmin",
        label: "오피스/행정/사무직도 가능하면 도전하고 싶습니다",
        description: "가능하면 사무직이나 오피스 쪽도 도전하고 싶습니다.",
      },
      {
        value: "unknownMobility",
        label: "아직 잘 모르겠습니다",
        description: "일단 이동이 편하고 무난한 곳부터 보고 싶습니다.",
      },
    ],
  },
  {
    id: "budget",
    title: "Q2. 월세 예산은 어느 정도까지 생각하고 계신가요?",
    intro:
      "처음에는 CAD 가격이 잘 체감되지 않을 수 있습니다. 그래서 1 CAD = 약 1,000원으로 단순 계산해서 함께 보여드립니다.",
    notice:
      "이 금액은 월세 기준이며, 보증금, 첫 달 비용, 생활비, 교통비는 별도로 생각해야 합니다.",
    footerNote:
      "한화 금액은 1 CAD = 약 1,000원으로 단순 계산한 MVP 참고값입니다. 실제 환율과 결제 금액은 달라질 수 있습니다.",
    options: [
      {
        value: "budget1",
        label: "C$400~600 / 약 40~60만 원",
        description: "초저예산 구간입니다. 선택지가 매우 적고 타협이 많이 필요할 수 있습니다.",
      },
      {
        value: "budget2",
        label: "C$600~900 / 약 60~90만 원",
        description: "절약형 룸렌트 중심으로 보는 구간입니다.",
      },
      {
        value: "budget3",
        label: "C$900~1,200 / 약 90~120만 원",
        description: "현실적인 룸렌트 후보를 비교하기 좋은 구간입니다.",
      },
      {
        value: "budget4",
        label: "C$1,200~1,800 / 약 120~180만 원",
        description: "조건 좋은 룸렌트, 베이스먼트, 일부 개인공간까지 볼 수 있습니다.",
      },
      {
        value: "budget5",
        label: "C$1,800+ / 약 180만 원 이상",
        description: "스튜디오, 콘도, 개인공간 후보까지 고려할 수 있습니다.",
      },
    ],
  },
  {
    id: "priority",
    title: "Q3. 아래 중 하나만 고른다면 무엇이 가장 중요하신가요?",
    options: [
      {
        value: "priorityCost",
        label: "비용",
        description: "월세와 생활비를 최대한 아끼는 것이 중요합니다.",
      },
      {
        value: "priorityMobility",
        label: "통근/이동",
        description: "동선 스트레스를 줄이는 것이 중요합니다.",
      },
      {
        value: "priorityCommunity",
        label: "커뮤니티",
        description: "한국 음식, 정보, 정서적 안정감이 중요합니다.",
      },
      {
        value: "priorityStability",
        label: "분위기/안정감",
        description: "너무 낯설거나 불안한 느낌이 적은 곳을 선호합니다.",
      },
    ],
  },
  {
    id: "koreanLife",
    title: "Q4. 한국 생활권이 얼마나 중요하신가요?",
    intro: "한국 생활권은 한국 음식, 한인 가게, 한인 커뮤니티, 정보 접근성을 뜻합니다.",
    options: [
      {
        value: "koreanHigh",
        label: "매우 중요합니다",
        description: "처음에는 한국 정보와 한인 생활권 접근이 꼭 필요할 것 같습니다.",
      },
      {
        value: "koreanMedium",
        label: "있으면 좋지만 필수는 아닙니다",
        description: "도움은 되지만, 꼭 그 근처여야 하는 것은 아닙니다.",
      },
      {
        value: "koreanLow",
        label: "별로 중요하지 않습니다",
        description: "현지 생활권을 더 많이 경험하고 싶습니다.",
      },
    ],
  },
  {
    id: "downtown",
    title: "Q5. 다운타운을 얼마나 자주 가실 것 같나요?",
    options: [
      {
        value: "downtownDaily",
        label: "거의 매일",
        description: "일, 학원, 약속 등으로 중심지 이동이 많을 것 같습니다.",
      },
      {
        value: "downtownWeekly",
        label: "주 2~3회 정도",
        description: "자주 가기는 하지만 매일은 아닐 것 같습니다.",
      },
      {
        value: "downtownRare",
        label: "가끔",
        description: "필요할 때만 가면 됩니다.",
      },
    ],
  },
];

export const GENERAL_CHECKLIST_QUESTIONS: GeneralChecklistQuestion[] = [
  {
    id: "location",
    title: "Q1. 이 위치가 내 목적과 맞나요?",
    resultTitle: "위치와 생활 동선",
    options: [
      "이 위치가 내 주 목적과 연결되어 있습니다.",
      "자주 가야 할 곳까지 실제 이동 시간을 지도에서 확인했습니다.",
      "아침/저녁 이동 피로를 감당할 수 있는 위치인지 확인했습니다.",
      "이 지역을 선택했을 때 얻는 장점이 분명합니다.",
      "이 지역을 선택했을 때 포기해야 하는 점도 알고 있습니다.",
      "아직 위치와 생활 동선을 충분히 확인하지 못했습니다.",
    ],
  },
  {
    id: "budgetLife",
    title: "Q2. 예산이 실제 생활까지 감당 가능한가요?",
    resultTitle: "예산과 생활비",
    options: [
      "월세만 보고 결정하지 않았습니다.",
      "교통비, 식비, 초기 정착비까지 함께 고려했습니다.",
      "이 매물이 이동비나 스트레스를 늘리는 선택은 아닌지 확인했습니다.",
      "예산을 아끼려고 무리한 조건을 선택하지는 않았는지 확인했습니다.",
      "이 가격이 체류 기간 동안 지속 가능한지 확인했습니다.",
      "아직 월세 외 비용을 충분히 계산하지 못했습니다.",
    ],
  },
  {
    id: "beginnerFit",
    title: "Q3. 처음 도착한 사람에게 무난한 선택인가요?",
    resultTitle: "초심자 적합성",
    options: [
      "처음 도착했을 때 생활 루틴을 만들기 쉬운 위치라고 판단했습니다.",
      "문제가 생겼을 때 정보를 얻거나 도움을 요청할 경로가 있습니다.",
      "집주인 또는 제공자와 소통 방식이 명확합니다.",
      "이해하지 못한 조건을 그냥 넘기지 않았습니다.",
      "이 매물이 내 상황에 맞는 선택인지 확인했습니다.",
      "아직 초심자 관점에서 충분히 판단하지 못했습니다.",
    ],
  },
  {
    id: "trustSignals",
    title: "Q4. 메이플스코어(매물 신용점수)는 확인하셨나요?",
    resultTitle: "메이플스코어",
    options: [
      "등록일과 마지막 확인일을 확인했습니다.",
      "매물 상태가 현재도 유효한지 확인할 수 있습니다.",
      "사진, 설명, 가격이 서로 어색하게 충돌하지 않습니다.",
      "너무 급하게 송금이나 결정을 요구하지 않습니다.",
      "플랫폼 밖에서만 대화하거나 거래하자고 강하게 유도하지 않습니다.",
      "실제 방문 또는 화상 확인 없이 큰돈을 먼저 보내라고 하지 않습니다.",
      "아직 메이플스코어를 충분히 확인하지 못했습니다.",
    ],
  },
  {
    id: "finalDecision",
    title: "Q5. 마지막으로 스스로 판단할 준비가 되었나요?",
    resultTitle: "마지막 판단",
    options: [
      "이 매물을 선택하면 얻는 가장 큰 장점을 설명할 수 있습니다.",
      "이 매물을 선택하면 감수해야 할 가장 큰 단점을 알고 있습니다.",
      "다른 후보와 비교했을 때 이 매물이 더 나은 이유가 분명합니다.",
      "불안한 부분을 집주인에게 질문할 준비가 되어 있습니다.",
      "혼자 판단하기 어렵다면 메이플하우스의 도움이 필요하다고 생각합니다.",
      "아직 혼자 판단하기 어렵습니다.",
    ],
  },
];

export type LanguageStudyQuestionId =
  | "school"
  | "commuteRange"
  | "transport"
  | "languageBudget"
  | "housingType"
  | "afterSchool"
  | "koreanCommunity"
  | "cityActivity"
  | "partTime"
  | "finalPriority";

export type IlacCampusAnswer =
  | "ilac_growth"
  | "ilac_pathway"
  | "ilac_dream"
  | "ilac_heart"
  | "ilac_unknown_campus";

export type LanguageStudyAnswerValue =
  | "school_ilac"
  | "school_ilsc"
  | "school_ec"
  | "school_hansa"
  | "school_kaplan"
  | "school_other"
  | "school_unknown"
  | IlacCampusAnswer
  | "commute_very_close"
  | "commute_short"
  | "commute_medium"
  | "commute_budget_first"
  | "commute_not_sure"
  | "prefer_subway"
  | "bus_ok"
  | "avoid_long_walk"
  | "transport_budget_first"
  | "transport_not_sure"
  | "budget_400_600"
  | "budget_600_900"
  | "budget_900_1200"
  | "budget_1200_1800"
  | "budget_1800_plus"
  | "housing_room_share"
  | "housing_private_space"
  | "housing_start_simple"
  | "housing_not_sure"
  | "after_school_near_school"
  | "after_school_korean_food"
  | "after_school_city_activity"
  | "after_school_home_area"
  | "after_school_not_sure"
  | "korean_very_important"
  | "korean_somewhat"
  | "korean_beginner_need"
  | "korean_not_important"
  | "city_activity_very_often"
  | "city_activity_often"
  | "city_activity_weekend"
  | "city_activity_low"
  | "parttime_yes"
  | "parttime_maybe"
  | "parttime_low"
  | "parttime_no"
  | "final_school_commute"
  | "final_budget"
  | "final_social_activity"
  | "final_korean_community"
  | "final_beginner_stability"
  | "final_subway_convenience";

export type LanguageStudyAnswerMap = Partial<
  Record<LanguageStudyQuestionId, LanguageStudyAnswerValue>
> & {
  ilacCampus?: IlacCampusAnswer;
};

export interface LanguageStudyAnswerOption {
  value: LanguageStudyAnswerValue;
  label: string;
  description: string;
}

export interface LanguageStudyQuestion {
  id: LanguageStudyQuestionId;
  title: string;
  intro?: string;
  notice?: string;
  footerNote?: string;
  helpTitle?: string;
  helpItems?: { term: string; description: string }[];
  options: LanguageStudyAnswerOption[];
}

export interface LanguageStudyResultTemplate {
  id: string;
  title: string;
  recommendedStations: StationId[];
  comparisonStations: StationId[];
  goodFor: string;
  reason: string;
  caution: string;
  reasonItems?: StationReasonItem[];
  nearbyItems?: StationReasonItem[];
  userFitSummary?: string;
}

export interface LanguageStudyBudgetComment {
  label: string;
  comment: string;
}

export interface LanguageStudyCalculationResult {
  resultId: string;
  budgetKey: Extract<
    LanguageStudyAnswerValue,
    | "budget_400_600"
    | "budget_600_900"
    | "budget_900_1200"
    | "budget_1200_1800"
    | "budget_1800_plus"
  >;
  stationScores: Partial<Record<StationId, number>>;
  destinationStations: StationId[];
  recommendedStations: StationId[];
  comparisonStations: StationId[];
  result: LanguageStudyResultTemplate;
  budgetComment: LanguageStudyBudgetComment;
}

export type StudyAbroadQuestionId =
  | "school"
  | "campusCommute"
  | "lifeBalance"
  | "studyBudget"
  | "housingType"
  | "studyEnvironment"
  | "koreanCommunity"
  | "cityActivity"
  | "outsideMobility"
  | "finalPriority";

export type GeorgeBrownCampusAnswer =
  | "gb_stjames"
  | "gb_waterfront"
  | "gb_casaloma"
  | "gb_unknown";

export type IlacHigherAnswer =
  | "ilac_georgian"
  | "ilac_fanshawe"
  | "ilac_ic"
  | "ilac_higher_unknown";

export type CentennialCampusAnswer =
  | "centennial_progress"
  | "centennial_morningside"
  | "centennial_unknown";

export type StudyAbroadAnswerValue =
  | "school_uoft_stgeorge"
  | "school_utsc"
  | "school_tmu"
  | "school_ocad"
  | "school_york_keele"
  | "school_georgebrown"
  | "school_seneca_newnham"
  | "school_centennial"
  | "school_ilac_higher"
  | "school_other_toronto"
  | "school_unknown"
  | GeorgeBrownCampusAnswer
  | IlacHigherAnswer
  | CentennialCampusAnswer
  | "campus_very_close"
  | "campus_short"
  | "campus_medium"
  | "campus_budget_first"
  | "campus_not_sure"
  | "life_near_campus"
  | "life_balanced"
  | "life_korean_access"
  | "life_city_access"
  | "life_study_quiet"
  | "budget_400_600"
  | "budget_600_900"
  | "budget_900_1200"
  | "budget_1200_1800"
  | "budget_1800_plus"
  | "housing_room_share"
  | "housing_private_space"
  | "housing_start_simple"
  | "housing_not_sure"
  | "study_quiet"
  | "study_campus_facility"
  | "study_local_convenience"
  | "study_shared_ok"
  | "study_not_sure"
  | "korean_very_important"
  | "korean_somewhat"
  | "korean_beginner_need"
  | "korean_not_important"
  | "city_very_often"
  | "city_often"
  | "city_weekend"
  | "city_low"
  | "mobility_yes"
  | "mobility_maybe"
  | "mobility_low"
  | "mobility_no"
  | "final_campus_commute"
  | "final_budget"
  | "final_study_stability"
  | "final_korean_access"
  | "final_city_activity"
  | "final_beginner_stability";

export type StudyAbroadAnswerMap = Partial<
  Record<StudyAbroadQuestionId, StudyAbroadAnswerValue>
> & {
  georgeBrownCampus?: GeorgeBrownCampusAnswer;
  ilacHigherProgram?: IlacHigherAnswer;
  centennialCampus?: CentennialCampusAnswer;
};

export interface StudyAbroadAnswerOption {
  value: StudyAbroadAnswerValue;
  label: string;
  description: string;
}

export interface StudyAbroadQuestion {
  id: StudyAbroadQuestionId;
  title: string;
  intro?: string;
  notice?: string;
  footerNote?: string;
  helpTitle?: string;
  helpItems?: { term: string; description: string }[];
  options: StudyAbroadAnswerOption[];
}

export interface StudyAbroadSubQuestion {
  title: string;
  notice?: string;
  options: StudyAbroadAnswerOption[];
}

export interface StudyAbroadResultTemplate {
  id: string;
  title: string;
  recommendedStations: StationId[];
  comparisonStations: StationId[];
  goodFor: string;
  reason: string;
  caution: string;
  reasonItems?: StationReasonItem[];
  nearbyItems?: StationReasonItem[];
  userFitSummary?: string;
}

export interface StudyAbroadCalculationResult {
  resultId: string;
  budgetKey: Extract<
    StudyAbroadAnswerValue,
    | "budget_400_600"
    | "budget_600_900"
    | "budget_900_1200"
    | "budget_1200_1800"
    | "budget_1800_plus"
  >;
  stationScores: Partial<Record<StationId, number>>;
  campusStations: StationId[];
  recommendedStations: StationId[];
  comparisonStations: StationId[];
  result: StudyAbroadResultTemplate;
  budgetComment: LanguageStudyBudgetComment;
  cautionLines: string[];
}

export const LANGUAGE_STUDY_INTRO = {
  label: "LANGUAGE STUDY",
  title: "어학연수생을 위한 토론토 기준역 찾기",
  paragraphs: [
    "토론토에서 어학연수를 할 때는 어학원 위치뿐 아니라 아침 등교, 수업 후 친구들과의 활동, 월세 예산, 한국 생활권까지 함께 봐야 합니다.",
    "아래 질문에 답하면 집을 찾기 시작할 기준역 후보를 추천해드립니다.",
    "추천은 정답이 아니라 시작점입니다. 실제 통학 시간은 반드시 지도 길찾기로 직접 확인해야 합니다.",
  ],
};

export const STUDY_ABROAD_INTRO = {
  label: "STUDY ABROAD",
  title: "유학생을 위한 토론토 기준역 찾기",
  paragraphs: [
    "토론토에서 학교를 다니며 자취를 한다면, 학교 위치뿐 아니라 매일 통학, 월세 예산, 공부 환경, 생활권을 함께 봐야 합니다.",
    "아래 질문에 답하면 집을 찾기 시작할 기준역 후보를 추천해드립니다.",
    "이 체크리스트는 기숙사가 아닌 룸렌트, 쉐어하우스, 스튜디오, 콘도 등 자취를 알아보는 유학생을 위한 기준역 추천입니다.",
    "추천은 정답이 아니라 시작점입니다. 실제 통학 시간과 경로는 반드시 지도 길찾기로 직접 확인해야 합니다.",
  ],
};

export const STUDY_ABROAD_GEORGE_BROWN_CAMPUS_QUESTION: StudyAbroadSubQuestion = {
  title: "Q1-1. George Brown의 어느 캠퍼스인가요?",
  notice:
    "George Brown은 캠퍼스별 주소와 동선이 다릅니다. 실제 수업 캠퍼스는 학교 공식 안내에서 다시 확인해 주세요.",
  options: [
    {
      value: "gb_stjames",
      label: "St. James Campus",
      description: "King, Dundas, College, Union을 기준으로 함께 봅니다.",
    },
    {
      value: "gb_waterfront",
      label: "Waterfront Campus",
      description: "Union, King, Broadview를 기준으로 함께 봅니다.",
    },
    {
      value: "gb_casaloma",
      label: "Casa Loma Campus",
      description: "Dupont, St George, Christie를 기준으로 함께 봅니다.",
    },
    {
      value: "gb_unknown",
      label: "아직 캠퍼스를 모릅니다",
      description: "캠퍼스 확인 전이라면 중심부 균형 후보부터 비교합니다.",
    },
  ],
};

export const STUDY_ABROAD_ILAC_HIGHER_QUESTION: StudyAbroadSubQuestion = {
  title: "Q1-2. ILAC 계열 중 어떤 과정인가요?",
  notice:
    "ILAC 계열 과정은 실제 과정명과 캠퍼스 위치가 다를 수 있습니다. 등록 후 받은 공식 안내에서 캠퍼스 주소를 다시 확인해 주세요.",
  options: [
    {
      value: "ilac_georgian",
      label: "Georgian@ILAC 쪽입니다",
      description: "Bloor-Yonge, Sherbourne, College를 기준으로 함께 봅니다.",
    },
    {
      value: "ilac_fanshawe",
      label: "Fanshawe Toronto @ ILAC 쪽입니다",
      description: "College, Dundas, Bloor-Yonge를 기준으로 함께 봅니다.",
    },
    {
      value: "ilac_ic",
      label: "ILAC International College 관련 과정입니다",
      description: "실제 캠퍼스 확인 전까지 중심부 후보를 넓게 비교합니다.",
    },
    {
      value: "ilac_higher_unknown",
      label: "정확한 과정명은 아직 모릅니다",
      description: "ILAC 계열 기본 후보를 기준으로 시작합니다.",
    },
  ],
};

export const STUDY_ABROAD_CENTENNIAL_CAMPUS_QUESTION: StudyAbroadSubQuestion = {
  title: "Q1-3. Centennial의 어느 캠퍼스인가요?",
  notice:
    "Centennial은 Scarborough 동부권 캠퍼스 성격이 강하므로 버스 연계가 필요할 수 있습니다. 실제 경로는 지도 길찾기로 확인해 주세요.",
  options: [
    {
      value: "centennial_progress",
      label: "Progress Campus",
      description: "Kennedy, Victoria Park, Broadview를 기준으로 함께 봅니다.",
    },
    {
      value: "centennial_morningside",
      label: "Morningside Campus",
      description: "Kennedy, Victoria Park, UTSC 인근 동선을 함께 봅니다.",
    },
    {
      value: "centennial_unknown",
      label: "아직 캠퍼스를 모릅니다",
      description: "Kennedy 중심의 Scarborough 방향 후보부터 비교합니다.",
    },
  ],
};

export const STUDY_ABROAD_QUESTIONS: StudyAbroadQuestion[] = [
  {
    id: "school",
    title: "Q1. 입학 예정이거나 다니고 있는 학교/캠퍼스는 어디인가요?",
    options: [
      {
        value: "school_uoft_stgeorge",
        label: "University of Toronto - St. George Campus",
        description: "U of T 세인트 조지 캠퍼스입니다.",
      },
      {
        value: "school_utsc",
        label: "University of Toronto Scarborough, UTSC",
        description: "U of T 스카버러 캠퍼스입니다.",
      },
      {
        value: "school_tmu",
        label: "Toronto Metropolitan University, TMU",
        description: "TMU, 구 Ryerson University입니다.",
      },
      {
        value: "school_ocad",
        label: "OCAD University",
        description: "OCAD 미술·디자인 대학입니다.",
      },
      {
        value: "school_york_keele",
        label: "York University - Keele Campus",
        description: "York Keele 캠퍼스입니다.",
      },
      {
        value: "school_georgebrown",
        label: "George Brown Polytechnic",
        description: "George Brown입니다. 캠퍼스는 다음 단계에서 선택합니다.",
      },
      {
        value: "school_seneca_newnham",
        label: "Seneca Polytechnic - Newnham Campus",
        description: "Seneca Newnham 캠퍼스입니다.",
      },
      {
        value: "school_centennial",
        label: "Centennial College",
        description: "Centennial입니다. 캠퍼스는 다음 단계에서 선택합니다.",
      },
      {
        value: "school_ilac_higher",
        label: "ILAC 계열 컬리지 / 패스웨이 과정",
        description: "Georgian@ILAC, Fanshawe Toronto @ ILAC, ILAC International College 관련 과정입니다.",
      },
      {
        value: "school_other_toronto",
        label: "리스트에 없는 토론토 내 학교입니다",
        description: "위 목록에 없는 토론토 내 학교입니다.",
      },
      {
        value: "school_unknown",
        label: "아직 학교/캠퍼스를 확인 중입니다",
        description: "입학 예정이지만 캠퍼스가 아직 확실하지 않습니다.",
      },
    ],
  },
  {
    id: "campusCommute",
    title: "Q2. 학교까지 매일 이동한다면 어느 정도 통학을 감당할 수 있나요?",
    intro:
      "대학/컬리지는 수업, 시험, 실습, 조별과제 때문에 학교를 자주 가야 할 수 있습니다.",
    notice:
      "아래 선택지는 정확한 통학 시간이 아니라 기준역 추천을 위한 대략적인 판단 기준입니다. 실제 시간은 지도 길찾기로 확인해야 합니다.",
    options: [
      {
        value: "campus_very_close",
        label: "같은 역권 또는 0~1개 역 정도가 좋습니다",
        description: "학교 근처에 가깝게 살고 싶습니다.",
      },
      {
        value: "campus_short",
        label: "2~3개 역 정도는 괜찮습니다",
        description: "학교 접근성과 월세를 함께 보고 싶습니다.",
      },
      {
        value: "campus_medium",
        label: "4~6개 역 정도도 괜찮습니다",
        description: "조건이 좋다면 어느 정도 이동은 감당할 수 있습니다.",
      },
      {
        value: "campus_budget_first",
        label: "월세를 아낄 수 있다면 더 멀어도 괜찮습니다",
        description: "통학보다 예산 절약이 더 중요합니다.",
      },
      {
        value: "campus_not_sure",
        label: "아직 감이 없어서 무난한 기준역부터 보고 싶습니다",
        description: "처음이라 어느 정도가 적당한지 모르겠습니다.",
      },
    ],
  },
  {
    id: "lifeBalance",
    title: "Q3. 유학 생활에서 학교와 생활권의 균형은 어떻게 잡고 싶나요?",
    options: [
      {
        value: "life_near_campus",
        label: "학교 가까운 것이 가장 중요합니다",
        description: "수업, 시험, 과제, 캠퍼스 생활을 우선합니다.",
      },
      {
        value: "life_balanced",
        label: "학교도 중요하지만 생활 편의도 중요합니다",
        description: "학교와 집 주변 생활을 균형 있게 보고 싶습니다.",
      },
      {
        value: "life_korean_access",
        label: "한국 음식/정보 접근도 중요합니다",
        description: "한인타운, 한국 음식, 한국 정보 접근을 고려합니다.",
      },
      {
        value: "life_city_access",
        label: "도시 중심지 활동도 중요합니다",
        description: "친구, 행사, 쇼핑, 문화생활 접근도 보고 싶습니다.",
      },
      {
        value: "life_study_quiet",
        label: "조용히 공부하고 쉬는 생활이 중요합니다",
        description: "학교보다 공부 환경과 휴식이 중요합니다.",
      },
    ],
  },
  {
    id: "studyBudget",
    title: "Q4. 월세로 어느 정도까지 감당 가능하신가요?",
    intro:
      "처음에는 CAD 가격이 잘 체감되지 않을 수 있습니다. 그래서 1 CAD = 약 1,000원으로 단순 계산한 금액을 함께 보여드립니다.",
    notice:
      "이 금액은 월세 기준이며, 보증금, 첫 달/마지막 달 월세, 생활비, 교통비, 공과금은 별도로 생각해야 합니다.",
    footerNote:
      "한화 금액은 1 CAD = 약 1,000원으로 단순 계산한 MVP 참고값입니다. 실제 환율과 결제 금액은 달라질 수 있습니다.",
    options: [
      {
        value: "budget_400_600",
        label: "C$400~600 / 약 40~60만 원",
        description: "초저예산 구간입니다. 선택지가 매우 적고 타협이 많이 필요할 수 있습니다.",
      },
      {
        value: "budget_600_900",
        label: "C$600~900 / 약 60~90만 원",
        description: "절약형 룸렌트 중심으로 먼저 보는 구간입니다.",
      },
      {
        value: "budget_900_1200",
        label: "C$900~1,200 / 약 90~120만 원",
        description: "현실적인 룸렌트 후보를 비교하기 좋은 구간입니다.",
      },
      {
        value: "budget_1200_1800",
        label: "C$1,200~1,800 / 약 120~180만 원",
        description: "조건 좋은 룸렌트, 베이스먼트, 일부 개인공간까지 비교할 수 있습니다.",
      },
      {
        value: "budget_1800_plus",
        label: "C$1,800+ / 약 180만 원 이상",
        description: "스튜디오, 콘도, 개인공간 후보까지 고려할 수 있습니다.",
      },
    ],
  },
  {
    id: "housingType",
    title: "Q5. 생각 중인 주거 형태가 있나요?",
    helpTitle: "캐나다 집 형태 용어 보기",
    options: [
      {
        value: "housing_room_share",
        label: "룸렌트 / 쉐어하우스도 괜찮습니다",
        description: "예산을 줄이기 위해 공용공간을 쓰는 것도 괜찮습니다.",
      },
      {
        value: "housing_private_space",
        label: "가능하면 개인 공간이 있는 집이 좋습니다",
        description: "스튜디오, 콘도, 베이스먼트 같은 독립공간도 보고 싶습니다.",
      },
      {
        value: "housing_start_simple",
        label: "처음에는 룸렌트로 시작하고 나중에 옮겨도 됩니다",
        description: "먼저 정착한 뒤 상황에 맞춰 옮기는 것도 괜찮습니다.",
      },
      {
        value: "housing_not_sure",
        label: "아직 잘 모르겠습니다",
        description: "집 형태 용어를 먼저 이해하고 비교하고 싶습니다.",
      },
    ],
  },
  {
    id: "studyEnvironment",
    title: "Q6. 공부 환경에서 가장 중요한 것은 무엇인가요?",
    options: [
      {
        value: "study_quiet",
        label: "조용한 집과 개인 시간이 중요합니다",
        description: "과제, 시험, 작업 시간을 안정적으로 확보하고 싶습니다.",
      },
      {
        value: "study_campus_facility",
        label: "학교 도서관/캠퍼스를 자주 이용하고 싶습니다",
        description: "집보다 학교 시설을 자주 쓸 것 같습니다.",
      },
      {
        value: "study_local_convenience",
        label: "집 주변 카페나 생활 편의가 중요합니다",
        description: "집 근처에서 공부하고 생활하고 싶습니다.",
      },
      {
        value: "study_shared_ok",
        label: "룸메이트와 살아도 괜찮습니다",
        description: "예산과 사람 사는 분위기도 중요합니다.",
      },
      {
        value: "study_not_sure",
        label: "아직 잘 모르겠습니다",
        description: "처음이라 공부 패턴을 예상하기 어렵습니다.",
      },
    ],
  },
  {
    id: "koreanCommunity",
    title: "Q7. 한국 생활권이 얼마나 중요하신가요?",
    intro: "한국 생활권은 한국 음식, 한인 가게, 한인 커뮤니티, 초기 정착 정보 접근성을 뜻합니다.",
    options: [
      {
        value: "korean_very_important",
        label: "매우 중요합니다",
        description: "한국 음식, 정보, 한인 커뮤니티 접근이 꼭 필요합니다.",
      },
      {
        value: "korean_somewhat",
        label: "있으면 좋지만 필수는 아닙니다",
        description: "가까우면 좋지만 꼭 근처에 살아야 하는 것은 아닙니다.",
      },
      {
        value: "korean_beginner_need",
        label: "처음에는 필요할 것 같습니다",
        description: "초반 정착 때는 한국 생활권이 도움이 될 것 같습니다.",
      },
      {
        value: "korean_not_important",
        label: "별로 중요하지 않습니다",
        description: "학교와 현지 생활권을 더 우선하고 싶습니다.",
      },
    ],
  },
  {
    id: "cityActivity",
    title: "Q8. 도시 중심지, 관광지, 행사에는 얼마나 자주 갈 것 같나요?",
    options: [
      {
        value: "city_very_often",
        label: "거의 매일 또는 매우 자주",
        description: "친구 약속, 행사, 쇼핑, 문화생활로 중심지 이동이 많을 것 같습니다.",
      },
      {
        value: "city_often",
        label: "주 2~3회 정도",
        description: "자주 가지만 매일은 아닐 것 같습니다.",
      },
      {
        value: "city_weekend",
        label: "주말이나 특별한 날 위주",
        description: "평일에는 수업과 집 주변 생활이 더 중요합니다.",
      },
      {
        value: "city_low",
        label: "별로 자주 가지 않을 것 같습니다",
        description: "집 주변 생활과 공부가 더 중요합니다.",
      },
    ],
  },
  {
    id: "outsideMobility",
    title: "Q9. 실습, 인턴, 파트타임, 캠퍼스 외 활동 가능성도 열어두고 있나요?",
    notice:
      "근로 가능 여부는 비자, 학생 신분, 프로그램 조건에 따라 달라질 수 있습니다. 메이플하우스는 비자 또는 취업 자문을 제공하지 않으므로, 공식 안내를 직접 확인해 주세요.",
    options: [
      {
        value: "mobility_yes",
        label: "네, 가능하면 열어두고 싶습니다",
        description: "학교 외 이동도 어느 정도 고려하고 싶습니다.",
      },
      {
        value: "mobility_maybe",
        label: "아직 모르지만 가능성은 있습니다",
        description: "상황이 되면 알아볼 수 있습니다.",
      },
      {
        value: "mobility_low",
        label: "학교와 공부가 우선입니다",
        description: "일단 캠퍼스 접근과 공부 안정성이 중요합니다.",
      },
      {
        value: "mobility_no",
        label: "전혀 고려하지 않습니다",
        description: "학교와 집 중심으로 생활하고 싶습니다.",
      },
    ],
  },
  {
    id: "finalPriority",
    title: "Q10. 마지막으로 하나만 고른다면 무엇이 가장 중요하신가요?",
    options: [
      {
        value: "final_campus_commute",
        label: "학교까지 이동이 편한 것",
        description: "수업, 시험, 과제 때문에 학교 접근이 가장 중요합니다.",
      },
      {
        value: "final_budget",
        label: "월세를 아끼는 것",
        description: "이동이 조금 길어져도 예산 절약이 중요합니다.",
      },
      {
        value: "final_study_stability",
        label: "공부하기 좋은 환경",
        description: "조용함, 개인 시간, 장기 생활 안정성이 중요합니다.",
      },
      {
        value: "final_korean_access",
        label: "한국 음식과 정보 접근성",
        description: "한국 생활권이 가까운 것이 중요합니다.",
      },
      {
        value: "final_city_activity",
        label: "도시 중심지 활동 접근성",
        description: "친구, 행사, 문화생활 접근이 중요합니다.",
      },
      {
        value: "final_beginner_stability",
        label: "처음 도착했을 때 무난한 생활",
        description: "너무 복잡하지 않고 정착하기 쉬운 곳이 좋습니다.",
      },
    ],
  },
];

export const LANGUAGE_STUDY_ILAC_CAMPUS_QUESTION = {
  title: "Q1-1. ILAC 캠퍼스를 알고 계신가요?",
  notice:
    "ILAC은 캠퍼스가 여러 곳일 수 있습니다. 실제 수업 캠퍼스는 배정에 따라 달라질 수 있으므로, 등록 후 받은 공식 안내에서 주소를 다시 확인해 주세요.",
  options: [
    {
      value: "ilac_growth",
      label: "ILAC Growth Campus / 메인 캠퍼스",
      description: "120 Bloor St E 기준입니다. Bloor-Yonge Station 근처로 봅니다.",
    },
    {
      value: "ilac_pathway",
      label: "ILAC University Pathway Campus",
      description: "255 College St 기준입니다. College와 St George를 함께 봅니다.",
    },
    {
      value: "ilac_dream",
      label: "ILAC Dream Campus",
      description: "425 Bloor St E 기준입니다. Sherbourne과 Bloor-Yonge를 함께 봅니다.",
    },
    {
      value: "ilac_heart",
      label: "ILAC Heart Campus",
      description: "655 Bay St 기준입니다. College와 Dundas를 함께 봅니다.",
    },
    {
      value: "ilac_unknown_campus",
      label: "ILAC이지만 캠퍼스는 아직 모릅니다",
      description: "배정 확인 전이라면 Bloor-Yonge와 College 중심으로 기본 추천합니다.",
    },
  ] satisfies LanguageStudyAnswerOption[],
};

export const LANGUAGE_STUDY_QUESTIONS: LanguageStudyQuestion[] = [
  {
    id: "school",
    title: "Q1. 등록하신(혹은 생각해두신) 어학원의 이름은 무엇인가요?",
    options: [
      {
        value: "school_ilac",
        label: "ILAC 어학원 (ILAC – International Language Academy of Canada)",
        description: "ILAC으로 등록했거나 생각 중입니다.",
      },
      {
        value: "school_ilsc",
        label: "ILSC 어학원 (ILSC Language Schools Toronto)",
        description: "ILSC Toronto를 생각 중입니다.",
      },
      {
        value: "school_ec",
        label: "EC English 어학원 (EC English Toronto)",
        description: "EC English Toronto를 생각 중입니다.",
      },
      {
        value: "school_hansa",
        label: "Hansa 어학원 (Hansa Language Centre)",
        description: "Hansa Language Centre를 생각 중입니다.",
      },
      {
        value: "school_kaplan",
        label: "Kaplan 어학원 (Kaplan International Languages Toronto)",
        description: "Kaplan Toronto를 생각 중입니다.",
      },
      {
        value: "school_other",
        label: "리스트에 없는 다른 어학원입니다",
        description: "위 목록에 없는 어학원입니다.",
      },
      {
        value: "school_unknown",
        label: "아직 정하지 않았거나 비교 중입니다",
        description: "여러 어학원을 비교 중입니다.",
      },
    ],
  },
  {
    id: "commuteRange",
    title: "Q2. 08:30 전후 수업을 가정하면, 집에서 어학원까지 어느 정도 이동을 감당할 수 있나요?",
    intro:
      "어학원 수업은 오전 일찍 시작될 수 있습니다. 예를 들어 08:30 전후 수업에 맞춰 도착해야 한다면, 집에서 어학원까지 어느 정도 이동을 감당할 수 있을지 생각해보세요.",
    notice:
      "아래 시간은 정확한 통학 시간이 아니라 기준역 추천을 위한 대략적인 선택 기준입니다. 실제 시간은 지도 길찾기로 반드시 확인해야 합니다.",
    options: [
      {
        value: "commute_very_close",
        label: "같은 역권 또는 0~1개 역 정도가 좋습니다",
        description: "집에서 나와 어학원까지 비교적 짧은 이동을 원합니다. 대략 20~30분 안팎을 목표로 봅니다.",
      },
      {
        value: "commute_short",
        label: "2~3개 역 정도는 괜찮습니다",
        description: "아침 등교가 너무 부담스럽지만 않다면 조금 떨어져도 괜찮습니다. 대략 30~40분 안팎을 기준으로 봅니다.",
      },
      {
        value: "commute_medium",
        label: "4~6개 역 정도도 괜찮습니다",
        description: "월세나 집 조건이 좋다면 어느 정도 이동은 감당할 수 있습니다. 대략 45~60분 안팎까지 봅니다.",
      },
      {
        value: "commute_budget_first",
        label: "월세를 아낄 수 있다면 더 멀어도 괜찮습니다",
        description: "이동 시간이 길어져도 예산 절약을 우선합니다. 60분 안팎 또는 그 이상도 비교할 수 있습니다.",
      },
      {
        value: "commute_not_sure",
        label: "아직 감이 없어서 무난한 기준역부터 보고 싶습니다",
        description: "처음이라 어느 정도 거리가 적당한지 모르겠습니다.",
      },
    ],
  },
  {
    id: "transport",
    title: "Q3. 아침 등교 때 어떤 이동 방식이 더 편하신가요?",
    helpTitle: "이동 방식 참고",
    helpItems: [
      {
        term: "지하철 중심 이동",
        description:
          "지하철은 경로를 이해하기 쉽고 도착 시간을 예상하기 편한 편이에요. 다만 터널 구간에서는 통신사나 구간에 따라 데이터·통화 연결이 약하거나 끊길 수 있어요.",
      },
      {
        term: "버스 포함 이동",
        description:
          "버스는 지상으로 이동해서 바깥을 보며 위치 감을 잡기 좋아요. 데이터나 통화도 비교적 자유롭게 쓰기 쉬운 편이에요. 대신 교통 상황의 영향을 받을 수 있어요.",
      },
      {
        term: "실제 편의성",
        description: "노선, 시간대, 날씨, 통신사, 교통 상황에 따라 실제 편의성은 달라질 수 있어요.",
      },
    ],
    options: [
      {
        value: "prefer_subway",
        label: "지하철 중심으로 이동하고 싶습니다",
        description: "경로가 단순하고 비교적 빠른 이동을 선호합니다.",
      },
      {
        value: "bus_ok",
        label: "버스가 포함되어도 괜찮습니다",
        description: "조금 느릴 수 있어도 버스 이동이 불편하지 않습니다.",
      },
      {
        value: "avoid_long_walk",
        label: "집에서 역이나 정류장까지 오래 걷는 것은 피하고 싶습니다",
        description: "집 근처 교통 접근성을 중요하게 봅니다.",
      },
      {
        value: "transport_budget_first",
        label: "이동이 조금 불편해도 월세가 더 중요합니다",
        description: "통학보다 예산 절약을 우선합니다.",
      },
      {
        value: "transport_not_sure",
        label: "잘 모르겠으니 무난한 지하철 기준으로 보고 싶습니다",
        description: "처음이라 교통 감이 없습니다.",
      },
    ],
  },
  {
    id: "languageBudget",
    title: "Q4. 월세로 어느 정도까지 감당 가능하신가요?",
    intro:
      "처음에는 CAD 가격이 잘 체감되지 않을 수 있습니다. 그래서 1 CAD = 약 1,000원으로 단순 계산한 금액을 함께 보여드립니다.",
    notice:
      "이 금액은 월세 기준이며, 보증금, 첫 달/마지막 달 월세, 생활비, 교통비, 공과금은 별도로 생각해야 합니다.",
    footerNote:
      "한화 금액은 1 CAD = 약 1,000원으로 단순 계산한 MVP 참고값입니다. 실제 환율과 결제 금액은 달라질 수 있습니다.",
    options: [
      {
        value: "budget_400_600",
        label: "C$400~600 / 약 40~60만 원",
        description: "초저예산 구간입니다. 선택지가 매우 적고 타협이 많이 필요할 수 있습니다.",
      },
      {
        value: "budget_600_900",
        label: "C$600~900 / 약 60~90만 원",
        description: "절약형 룸렌트 중심으로 먼저 보는 구간입니다.",
      },
      {
        value: "budget_900_1200",
        label: "C$900~1,200 / 약 90~120만 원",
        description: "현실적인 룸렌트 후보를 비교하기 좋은 구간입니다.",
      },
      {
        value: "budget_1200_1800",
        label: "C$1,200~1,800 / 약 120~180만 원",
        description: "조건 좋은 룸렌트, 베이스먼트, 일부 개인공간까지 비교할 수 있습니다.",
      },
      {
        value: "budget_1800_plus",
        label: "C$1,800+ / 약 180만 원 이상",
        description: "스튜디오, 콘도, 개인공간 후보까지 고려할 수 있습니다.",
      },
    ],
  },
  {
    id: "housingType",
    title: "Q5. 생각 중인 주거 형태가 있나요?",
    helpTitle: "캐나다 집 형태 용어 보기",
    helpItems: [
      {
        term: "룸렌트 / Room Rent",
        description: "집이나 콘도 안의 방 하나를 빌리는 형태입니다. 주방, 화장실, 거실은 공유할 수 있습니다.",
      },
      {
        term: "쉐어하우스 / Shared House",
        description: "여러 사람이 한 집을 함께 쓰는 형태입니다. 방은 개인, 공용공간은 공유하는 경우가 많습니다.",
      },
      {
        term: "스튜디오 / Studio, Bachelor",
        description: "침실과 거실이 분리되지 않은 원룸형 독립공간입니다.",
      },
      {
        term: "콘도 / Condo",
        description: "아파트처럼 보이는 개인 소유 유닛입니다. 건물 편의시설이 있을 수 있지만 월세가 높을 수 있습니다.",
      },
      {
        term: "베이스먼트 / Basement",
        description: "지하 또는 반지하 공간입니다. 채광, 습기, 천장 높이, 출입구를 꼭 확인해야 합니다.",
      },
      {
        term: "덴 / Den",
        description: "보조 공간입니다. 창문, 문, 크기가 제각각이므로 실제 침실로 적합한지 확인해야 합니다.",
      },
    ],
    options: [
      {
        value: "housing_room_share",
        label: "룸렌트 / 쉐어하우스도 괜찮습니다",
        description: "예산을 줄이기 위해 공용공간을 쓰는 것도 괜찮습니다.",
      },
      {
        value: "housing_private_space",
        label: "가능하면 개인 공간이 있는 집이 좋습니다",
        description: "스튜디오, 콘도, 베이스먼트 같은 독립공간도 보고 싶습니다.",
      },
      {
        value: "housing_start_simple",
        label: "처음에는 룸렌트로 시작하고 나중에 옮겨도 됩니다",
        description: "먼저 정착한 뒤 상황에 맞춰 옮기는 것도 괜찮습니다.",
      },
      {
        value: "housing_not_sure",
        label: "아직 잘 모르겠습니다",
        description: "용어를 먼저 이해하고 비교하고 싶습니다.",
      },
    ],
  },
  {
    id: "afterSchool",
    title: "Q6. 수업이 끝난 뒤 주로 어떤 생활을 하고 싶나요?",
    options: [
      {
        value: "after_school_near_school",
        label: "어학원 친구들과 학원 주변에서 자주 만날 것 같습니다",
        description: "수업 후 같은 반 친구들과 식사나 모임을 자주 할 것 같습니다.",
      },
      {
        value: "after_school_korean_food",
        label: "한인타운이나 한국 음식점도 자주 갈 것 같습니다",
        description: "한국 음식, 한인 친구, 한국 정보 접근이 중요합니다.",
      },
      {
        value: "after_school_city_activity",
        label: "외국인 친구들과 맛집, 관광지, 행사를 많이 다니고 싶습니다",
        description: "다양한 사람들과 도시를 많이 경험하고 싶습니다.",
      },
      {
        value: "after_school_home_area",
        label: "수업 후에는 집 근처에서 쉬고 싶습니다",
        description: "너무 바쁘게 움직이기보다 집 주변 생활이 편한 곳이 좋습니다.",
      },
      {
        value: "after_school_not_sure",
        label: "아직 잘 모르겠습니다",
        description: "생활 패턴을 아직 예상하기 어렵습니다.",
      },
    ],
  },
  {
    id: "koreanCommunity",
    title: "Q7. 한국 생활권이 얼마나 중요하신가요?",
    intro: "한국 생활권은 한국 음식, 한인 가게, 한인 커뮤니티, 초기 정착 정보 접근성을 뜻합니다.",
    options: [
      {
        value: "korean_very_important",
        label: "매우 중요합니다",
        description: "처음에는 한국 음식과 정보 접근이 꼭 필요할 것 같습니다.",
      },
      {
        value: "korean_somewhat",
        label: "있으면 좋지만 필수는 아닙니다",
        description: "도움이 되지만 꼭 근처에 살아야 하는 것은 아닙니다.",
      },
      {
        value: "korean_beginner_need",
        label: "처음에는 필요할 것 같습니다",
        description: "초반 정착 때는 도움이 될 것 같습니다.",
      },
      {
        value: "korean_not_important",
        label: "별로 중요하지 않습니다",
        description: "현지 생활권을 더 많이 경험하고 싶습니다.",
      },
    ],
  },
  {
    id: "cityActivity",
    title: "Q8. 도심 번화가, 관광지, 행사에는 얼마나 자주 갈 것 같나요?",
    options: [
      {
        value: "city_activity_very_often",
        label: "거의 매일 또는 매우 자주",
        description: "친구 약속, 관광, 행사, 쇼핑 등으로 중심지 이동이 많을 것 같습니다.",
      },
      {
        value: "city_activity_often",
        label: "주 2~3회 정도",
        description: "자주 가지만 매일은 아닐 것 같습니다.",
      },
      {
        value: "city_activity_weekend",
        label: "주말이나 특별한 날 위주",
        description: "평일에는 수업과 집 주변 생활이 더 중요합니다.",
      },
      {
        value: "city_activity_low",
        label: "별로 자주 가지 않을 것 같습니다",
        description: "집 주변 생활과 휴식이 더 중요합니다.",
      },
    ],
  },
  {
    id: "partTime",
    title: "Q9. 소소한 아르바이트나 파트타임 가능성도 열어두고 있나요?",
    notice:
      "근로 가능 여부는 비자, 학생 신분, 프로그램 조건에 따라 달라질 수 있습니다. 메이플하우스는 비자 또는 취업 자문을 제공하지 않으므로, 공식 안내를 직접 확인해 주세요.",
    options: [
      {
        value: "parttime_yes",
        label: "네, 가능하면 알아보고 싶습니다",
        description: "수업 외 시간에 일자리 가능성도 열어두고 싶습니다.",
      },
      {
        value: "parttime_maybe",
        label: "아직 모르지만 열어두고 싶습니다",
        description: "상황이 되면 알아볼 수 있습니다.",
      },
      {
        value: "parttime_low",
        label: "공부와 친구/생활이 더 중요합니다",
        description: "어학연수 경험과 생활 적응이 우선입니다.",
      },
      {
        value: "parttime_no",
        label: "전혀 고려하지 않습니다",
        description: "파트타임은 생각하지 않습니다.",
      },
    ],
  },
  {
    id: "finalPriority",
    title: "Q10. 마지막으로 하나만 고른다면 무엇이 가장 중요하신가요?",
    options: [
      {
        value: "final_school_commute",
        label: "아침에 어학원 가기 편한 것",
        description: "08:30 전후 수업이 있어도 등교 부담을 줄이고 싶습니다.",
      },
      {
        value: "final_budget",
        label: "월세를 아끼는 것",
        description: "이동이 조금 길어져도 예산 절약이 중요합니다.",
      },
      {
        value: "final_social_activity",
        label: "친구들과 활동하기 좋은 것",
        description: "수업 후 식사, 관광, 행사, 모임이 중요합니다.",
      },
      {
        value: "final_korean_community",
        label: "한국 음식과 정보 접근성",
        description: "한국 생활권이 가까운 것이 중요합니다.",
      },
      {
        value: "final_beginner_stability",
        label: "처음 도착했을 때 무난한 생활",
        description: "너무 복잡하지 않고 정착하기 쉬운 곳이 좋습니다.",
      },
      {
        value: "final_subway_convenience",
        label: "지하철 기준 이동이 편한 것",
        description: "길을 이해하기 쉽고 이동이 단순한 곳이 좋습니다.",
      },
    ],
  },
];

export const LANGUAGE_STUDY_BUDGET_COMMENTS: Record<
  Extract<
    LanguageStudyAnswerValue,
    | "budget_400_600"
    | "budget_600_900"
    | "budget_900_1200"
    | "budget_1200_1800"
    | "budget_1800_plus"
  >,
  LanguageStudyBudgetComment
> = {
  budget_400_600: {
    label: "C$400~600 / 약 40~60만 원",
    comment:
      "이 예산은 선택지가 많이 적을 수 있어요. 룸렌트나 쉐어 위주로 보면서 매물 상태와 계약 조건을 더 꼼꼼히 확인하는 게 좋아요.",
  },
  budget_600_900: {
    label: "C$600~900 / 약 60~90만 원",
    comment:
      "절약형 룸렌트를 중심으로 비교하기 좋은 구간이에요. 학교나 어학원 바로 앞만 고집하면 선택지가 줄어들 수 있어요.",
  },
  budget_900_1200: {
    label: "C$900~1,200 / 약 90~120만 원",
    comment:
      "현실적인 룸렌트 후보를 비교하기 좋은 구간이에요. 위치, 룸메이트 조건, 아침 이동 부담을 같이 보면 좋아요.",
  },
  budget_1200_1800: {
    label: "C$1,200~1,800 / 약 120~180만 원",
    comment:
      "조건 좋은 룸렌트나 베이스먼트, 일부 개인공간까지 비교해볼 수 있어요. 위치가 좋아질수록 공간 조건은 달라질 수 있어요.",
  },
  budget_1800_plus: {
    label: "C$1,800+ / 약 180만 원 이상",
    comment:
      "스튜디오, 콘도, 개인공간 후보까지 볼 수 있는 예산이에요. 그래도 공과금, 인터넷, 가구 포함 여부는 꼭 같이 확인하는 게 좋아요.",
  },
};

export const STUDY_ABROAD_BUDGET_COMMENTS: Record<
  Extract<
    StudyAbroadAnswerValue,
    | "budget_400_600"
    | "budget_600_900"
    | "budget_900_1200"
    | "budget_1200_1800"
    | "budget_1800_plus"
  >,
  LanguageStudyBudgetComment
> = {
  budget_400_600: {
    label: "C$400~600 / 약 40~60만 원",
    comment:
      "이 예산은 선택지가 많이 적을 수 있어요. 룸렌트나 쉐어 위주로 보면서 매물 상태와 계약 조건을 더 꼼꼼히 확인하는 게 좋아요.",
  },
  budget_600_900: {
    label: "C$600~900 / 약 60~90만 원",
    comment:
      "절약형 룸렌트를 중심으로 비교하기 좋은 구간이에요. 학교나 어학원 바로 앞만 고집하면 선택지가 줄어들 수 있어요.",
  },
  budget_900_1200: {
    label: "C$900~1,200 / 약 90~120만 원",
    comment:
      "현실적인 룸렌트 후보를 비교하기 좋은 구간이에요. 위치, 룸메이트 조건, 아침 이동 부담을 같이 보면 좋아요.",
  },
  budget_1200_1800: {
    label: "C$1,200~1,800 / 약 120~180만 원",
    comment:
      "조건 좋은 룸렌트나 베이스먼트, 일부 개인공간까지 비교해볼 수 있어요. 위치가 좋아질수록 공간 조건은 달라질 수 있어요.",
  },
  budget_1800_plus: {
    label: "C$1,800+ / 약 180만 원 이상",
    comment:
      "스튜디오, 콘도, 개인공간 후보까지 볼 수 있는 예산이에요. 그래도 공과금, 인터넷, 가구 포함 여부는 꼭 같이 확인하는 게 좋아요.",
  },
};

export const LANGUAGE_STUDY_RESULT_TEMPLATES: Record<string, LanguageStudyResultTemplate> = {
  languageResult01: {
    id: "languageResult01",
    title: "ILAC Growth / 중심 환승형",
    recommendedStations: ["bloorYonge"],
    comparisonStations: ["college", "stGeorge", "sherbourne"],
    goodFor: "ILAC Growth Campus 또는 캠퍼스 미정, 아침 등교 부담을 줄이고 싶은 사용자에게 맞습니다.",
    reason: "ILAC 대표 캠퍼스와 중심 교통 접근성을 함께 보기 좋습니다.",
    caution: "ILAC은 캠퍼스가 여러 곳이므로 실제 배정 캠퍼스 확인이 필요합니다.",
  },
  languageResult02: {
    id: "languageResult02",
    title: "ILAC College / University Pathway 접근형",
    recommendedStations: ["college"],
    comparisonStations: ["stGeorge", "dundas", "christie"],
    goodFor: "ILAC University Pathway Campus 또는 College St 권역 어학원 사용자에게 맞습니다.",
    reason: "수업 후 도시 중심지와 서쪽 생활권을 함께 비교하기 좋습니다.",
    caution: "실제 수업 캠퍼스 주소 확인이 필요합니다.",
  },
  languageResult03: {
    id: "languageResult03",
    title: "ILAC Dream / Sherbourne 도착형",
    recommendedStations: ["sherbourne"],
    comparisonStations: ["bloorYonge", "broadview", "christie"],
    goodFor: "ILAC Dream Campus를 다니는 사용자에게 맞습니다.",
    reason: "어학원 도착 기준역으로 보기 좋고, 주거는 주변 역까지 넓혀 비교할 수 있습니다.",
    caution: "Sherbourne은 도착 기준역 성격이 강하므로 매물은 주변 역까지 비교해야 합니다.",
  },
  languageResult04: {
    id: "languageResult04",
    title: "ILSC / University Ave 접근형",
    recommendedStations: ["stPatrick"],
    comparisonStations: ["dundas", "college", "stGeorge"],
    goodFor: "ILSC Toronto 사용자에게 맞습니다.",
    reason: "ILSC 위치를 기준으로 등교 동선을 잡기 쉽습니다.",
    caution: "St Patrick 주변만 고집하지 말고 주변 중심역까지 비교해야 합니다.",
  },
  languageResult05: {
    id: "languageResult05",
    title: "EC / Hansa 미드타운 균형형",
    recommendedStations: ["eglinton"],
    comparisonStations: ["bloorYonge", "northYorkCentre", "christie"],
    goodFor: "EC English 또는 Hansa 사용자에게 맞습니다.",
    reason: "어학원 접근과 생활 안정의 균형을 보기 좋습니다.",
    caution: "실제 수업 위치와 시간표는 공식 안내에서 다시 확인해야 합니다.",
  },
  languageResult06: {
    id: "languageResult06",
    title: "Kaplan / Union 도착형",
    recommendedStations: ["union"],
    comparisonStations: ["bloorYonge", "college", "dundas"],
    goodFor: "Kaplan Toronto 사용자에게 맞습니다.",
    reason: "Kaplan 위치를 기준으로 도시 중심지 남쪽 접근성을 보기 좋습니다.",
    caution: "Union 주변만 보면 월세 부담이 커질 수 있어 비교 범위를 넓혀야 합니다.",
  },
  languageResult07: {
    id: "languageResult07",
    title: "도시 중심지 활동형",
    recommendedStations: ["college", "dundas"],
    comparisonStations: ["bloorYonge", "stGeorge", "union"],
    goodFor: "수업 후 친구들과 식사, 관광, 행사, 쇼핑을 자주 할 사용자에게 맞습니다.",
    reason: "어학연수 생활의 활동 반경을 넓게 잡기 좋습니다.",
    caution: "활동 접근성이 좋을수록 월세 부담이 커질 수 있습니다.",
  },
  languageResult08: {
    id: "languageResult08",
    title: "중심부 균형형",
    recommendedStations: ["stGeorge"],
    comparisonStations: ["bloorYonge", "college", "christie"],
    goodFor: "너무 복잡한 중심지는 부담스럽지만 어학원과 활동 접근성은 원하는 사용자에게 맞습니다.",
    reason: "어학원, 도시 중심지, 주거 균형을 함께 보기 좋습니다.",
    caution: "어학원 위치에 따라 실제 통학 방향이 달라질 수 있습니다.",
  },
  languageResult09: {
    id: "languageResult09",
    title: "한인타운 + 친구 모임형",
    recommendedStations: ["christie"],
    comparisonStations: ["bloorYonge", "dufferin", "college"],
    goodFor: "한국 음식, 한인타운, 친구 모임, 도시 중심지 접근을 같이 원하는 사용자에게 맞습니다.",
    reason: "한국 생활권과 중심지 접근을 함께 볼 수 있어요.",
    caution: "한국 생활권이 필요 없는 사용자에게는 우선순위가 낮을 수 있습니다.",
  },
  languageResult10: {
    id: "languageResult10",
    title: "노스욕 정착 안정형",
    recommendedStations: ["northYorkCentre"],
    comparisonStations: ["finch", "eglinton", "bloorYonge"],
    goodFor: "처음 도착했을 때 생활 안정, 한국 음식/정보, 편의시설 접근을 원하는 사용자에게 맞습니다.",
    reason: "초기 정착과 생활 편의성을 비교하기 좋습니다.",
    caution: "어학원이 중심부라면 아침 통학 부담을 반드시 확인해야 합니다.",
  },
  languageResult11: {
    id: "languageResult11",
    title: "예산 우선 서쪽 비교형",
    recommendedStations: ["dufferin"],
    comparisonStations: ["christie", "college", "stGeorge"],
    goodFor: "예산을 아끼고 싶지만 중심부와 완전히 멀어지고 싶지는 않은 사용자에게 맞습니다.",
    reason: "월세와 중심지 접근을 함께 비교하기 좋습니다.",
    caution: "실제 매물 상태와 이동 경로는 직접 확인해야 합니다.",
  },
  languageResult12: {
    id: "languageResult12",
    title: "예산 우선 동쪽 비교형",
    recommendedStations: ["broadview", "victoriaPark"],
    comparisonStations: ["bloorYonge", "eglinton", "christie"],
    goodFor: "월세를 줄이고 싶고, 아침 통학 거리를 감당할 수 있는 사용자에게 맞습니다.",
    reason: "중심부 월세 부담을 피하면서 동쪽 생활권을 비교할 수 있습니다.",
    caution: "08:30 전후 수업이면 실제 통학 경로와 시간을 꼭 확인해야 합니다.",
  },
};

export const STUDY_ABROAD_RESULT_TEMPLATES: Record<string, StudyAbroadResultTemplate> = {
  studyResult01: {
    id: "studyResult01",
    title: "U of T St. George / 대학 중심부형",
    recommendedStations: ["stGeorge"],
    comparisonStations: ["queensPark", "college", "christie"],
    goodFor: "U of T St. George 학생, 학교와 도서관 접근을 중요하게 보는 사용자에게 맞습니다.",
    reason: "학교 접근성과 대학 중심부 생활권을 함께 보기 좋습니다.",
    caution: "학교 주변만 고집하면 월세 부담이 커질 수 있습니다.",
  },
  studyResult02: {
    id: "studyResult02",
    title: "TMU / 도시 중심지 통학형",
    recommendedStations: ["dundas"],
    comparisonStations: ["college", "bloorYonge", "christie"],
    goodFor: "TMU 학생, 학교와 도시 중심지 접근을 중요하게 보는 사용자에게 맞습니다.",
    reason: "TMU 접근성과 중심지 활동성을 함께 보기 좋습니다.",
    caution: "중심부 매물은 가격과 공간 조건을 함께 비교해야 합니다.",
  },
  studyResult03: {
    id: "studyResult03",
    title: "OCAD / 예술·작업 생활형",
    recommendedStations: ["stPatrick", "osgoode"],
    comparisonStations: ["dundas", "stGeorge", "dufferin", "christie"],
    goodFor: "OCAD 학생, 작업실/학교 접근과 예산을 함께 보는 사용자에게 맞습니다.",
    reason: "학교 접근, 작업 생활, 중심지 접근을 함께 비교하기 좋습니다.",
    caution: "작업물 보관, 개인 공간, 소음, 책상 크기 등을 함께 확인해야 합니다.",
  },
  studyResult04: {
    id: "studyResult04",
    title: "George Brown St. James / Waterfront형",
    recommendedStations: ["king", "union"],
    comparisonStations: ["dundas", "college", "broadview"],
    goodFor: "George Brown St. James 또는 Waterfront 캠퍼스 학생에게 맞습니다.",
    reason: "George Brown 도심/워터프론트 캠퍼스 접근성을 보기 좋습니다.",
    caution: "캠퍼스가 St. James인지 Waterfront인지 먼저 확인해야 합니다.",
  },
  studyResult05: {
    id: "studyResult05",
    title: "George Brown Casa Loma형",
    recommendedStations: ["dupont"],
    comparisonStations: ["stGeorge", "christie", "dufferin"],
    goodFor: "George Brown Casa Loma 캠퍼스 학생에게 맞습니다.",
    reason: "Casa Loma 캠퍼스와 서쪽/중심부 생활권을 함께 비교하기 좋습니다.",
    caution: "George Brown의 다른 캠퍼스와 동선이 다르므로 캠퍼스 확인이 필수입니다.",
  },
  studyResult06: {
    id: "studyResult06",
    title: "York Keele / 북서부 캠퍼스형",
    recommendedStations: ["yorkUniversity"],
    comparisonStations: ["finchWest", "pioneerVillage", "finch"],
    goodFor: "York Keele 학생, 학교 접근과 캠퍼스 생활을 중요하게 보는 사용자에게 맞습니다.",
    reason: "York Keele 캠퍼스를 기준으로 통학 동선을 잡기 좋습니다.",
    caution: "도시 중심지 활동이 많다면 실제 이동 시간을 반드시 확인해야 합니다.",
  },
  studyResult07: {
    id: "studyResult07",
    title: "Seneca Newnham / 북동부 컬리지형",
    recommendedStations: ["donMills"],
    comparisonStations: ["finch", "northYorkCentre", "eglinton"],
    goodFor: "Seneca Newnham 학생, 북동부 통학권을 보는 사용자에게 맞습니다.",
    reason: "Seneca Newnham으로 가는 북동부 생활권을 비교하기 좋습니다.",
    caution: "지하철만으로 끝나는 동선이 아닐 수 있으므로 버스 연계를 확인해야 합니다.",
  },
  studyResult08: {
    id: "studyResult08",
    title: "UTSC / Centennial Scarborough형",
    recommendedStations: ["kennedy"],
    comparisonStations: ["victoriaPark", "broadview", "bloorYonge"],
    goodFor: "UTSC 또는 Centennial Progress/Morningside 학생에게 맞습니다.",
    reason: "Scarborough 방향 캠퍼스 접근을 기준으로 집을 보기 좋습니다.",
    caution: "Scarborough 캠퍼스는 버스 연계가 중요할 수 있으므로 실제 경로 확인이 필수입니다.",
  },
  studyResult09: {
    id: "studyResult09",
    title: "ILAC 계열 컬리지 / 패스웨이형",
    recommendedStations: ["bloorYonge", "college"],
    comparisonStations: ["sherbourne", "dundas", "christie"],
    goodFor: "Georgian@ILAC, Fanshawe Toronto @ ILAC, ILAC International College 관련 과정 사용자에게 맞습니다.",
    reason: "ILAC 계열 과정이 있을 수 있는 중심부 캠퍼스 접근을 기준으로 보기 좋습니다.",
    caution: "정확한 과정명, 캠퍼스, 비자/PGWP 조건은 학교 및 공식 기관 안내에서 확인해야 합니다.",
  },
  studyResult10: {
    id: "studyResult10",
    title: "한국 생활권 + 장기 정착형",
    recommendedStations: ["christie"],
    comparisonStations: ["northYorkCentre", "finch", "bloorYonge"],
    goodFor: "한국 음식, 정보, 커뮤니티, 초기 정착 안정성을 중시하는 유학생에게 맞습니다.",
    reason: "한국 생활권과 학교 접근성을 함께 비교하기 좋습니다.",
    caution: "학교가 멀다면 매일 통학 피로를 반드시 확인해야 합니다.",
  },
  studyResult11: {
    id: "studyResult11",
    title: "예산 우선 비교형",
    recommendedStations: ["dufferin", "broadview"],
    comparisonStations: ["victoriaPark", "christie", "eglinton"],
    goodFor: "월세를 줄이고 싶고, 학교까지 이동을 어느 정도 감당할 수 있는 사용자에게 맞습니다.",
    reason: "중심부 월세 부담을 피하면서 학교 접근을 비교하기 좋습니다.",
    caution: "예산형 후보일수록 매물 상태, 룸메이트, 계약 조건 확인이 중요합니다.",
  },
  studyResult12: {
    id: "studyResult12",
    title: "무난한 첫 정착 균형형",
    recommendedStations: ["eglinton", "northYorkCentre"],
    comparisonStations: ["christie", "bloorYonge", "finch"],
    goodFor: "학교가 아직 확정되지 않았거나, 처음 도착해서 무난한 생활권부터 보고 싶은 사용자에게 맞습니다.",
    reason: "생활 편의, 교통 이해도, 초기 정착 안정성을 함께 보기 좋습니다.",
    caution: "학교/캠퍼스가 확정되면 실제 통학 경로를 다시 확인해야 합니다.",
  },
};

export const BUDGET_COMMENTS: Record<string, BudgetComment> = {
  budget1: {
    label: "C$400~600 / 약 40~60만 원",
    comment:
      "이 예산은 선택지가 많이 적을 수 있어요. 룸렌트나 쉐어 위주로 보면서 매물 상태와 계약 조건을 더 꼼꼼히 확인하는 게 좋아요.",
  },
  budget2: {
    label: "C$600~900 / 약 60~90만 원",
    comment:
      "절약형 룸렌트를 중심으로 비교하기 좋은 구간이에요. 중심 상권만 고집하면 선택지가 줄어들 수 있어요.",
  },
  budget3: {
    label: "C$900~1,200 / 약 90~120만 원",
    comment:
      "현실적인 룸렌트 후보를 비교하기 좋은 구간이에요. 위치, 룸메이트 조건, 아침 이동 부담을 같이 보면 좋아요.",
  },
  budget4: {
    label: "C$1,200~1,800 / 약 120~180만 원",
    comment:
      "조건 좋은 룸렌트나 베이스먼트, 일부 개인공간까지 비교해볼 수 있어요. 위치가 좋아질수록 공간 조건은 달라질 수 있어요.",
  },
  budget5: {
    label: "C$1,800+ / 약 180만 원 이상",
    comment:
      "스튜디오, 콘도, 개인공간 후보까지 볼 수 있는 예산이에요. 그래도 공과금, 인터넷, 가구 포함 여부는 꼭 같이 확인하는 게 좋아요.",
  },
};

export const RECOMMENDATION_RESULTS: Record<string, RecommendationResult> = {
  result01: {
    id: "result01",
    title: "한국 생활권과 예산을 함께 보는 시작점",
    stations: ["Finch", "North York Centre"],
    reason:
      "처음 토론토에 가는 워홀러가 한국 정보 접근성과 예산 방어를 함께 고려할 때 비교해볼 만한 시작점입니다.",
    goodFor: [
      "한인 정보나 한인 가게 접근이 중요합니다.",
      "비용을 아껴야 합니다.",
      "처음에는 너무 낯선 생활권이 부담스럽습니다.",
      "룸렌트 중심으로 보고 싶습니다.",
    ],
    nearby: "Finch와 North York Centre 근처를 함께 비교해보세요.",
    caution:
      "이 추천은 정답이 아닙니다. 실제 일자리 위치와 이동 시간은 지도 길찾기로 직접 확인해야 합니다.",
  },
  result02: {
    id: "result02",
    title: "한국 생활권과 생활 편의성을 함께 보는 시작점",
    stations: ["North York Centre", "Finch"],
    reason:
      "한국 생활권 접근성과 생활 편의성을 같이 고려할 때 무난하게 비교해볼 수 있는 기준역입니다.",
    goodFor: [
      "한국 정보 접근이 있으면 좋습니다.",
      "너무 외진 느낌은 피하고 싶습니다.",
      "비용도 보지만 생활 편의성도 중요합니다.",
      "처음 적응이 쉬운 쪽을 선호합니다.",
    ],
    nearby: "North York Centre와 Finch 근처를 함께 비교해보세요.",
    caution: "편의성이 좋아질수록 월세가 올라갈 수 있으니 예산 구간을 같이 확인해야 합니다.",
  },
  result03: {
    id: "result03",
    title: "이동 편의를 우선하는 중심 접근형",
    stations: ["Bloor-Yonge", "St George"],
    reason: "이동성과 중심지 접근을 중요하게 보는 사용자에게 기준점이 될 수 있는 역입니다.",
    goodFor: [
      "통근/이동 스트레스를 줄이고 싶습니다.",
      "다운타운 또는 중심지 방문이 많을 예정입니다.",
      "예산이 어느 정도 있습니다.",
      "위치 편의성을 비용보다 더 중요하게 봅니다.",
    ],
    nearby: "Bloor-Yonge, St George, College, Dundas 쪽을 함께 비교해보세요.",
    caution:
      "중심 접근성이 좋을수록 월세 부담이 커질 수 있습니다. 가격 대비 공간이 작을 수 있으니 주거 형태를 함께 비교해야 합니다.",
  },
  result04: {
    id: "result04",
    title: "이동은 중요하지만 예산 타협이 필요한 선택지",
    stations: ["Dufferin", "Finch West"],
    reason:
      "예산을 낮추면서도 이동 연결성을 완전히 포기하고 싶지 않을 때 함께 볼 수 있어요.",
    goodFor: [
      "예산이 낮습니다.",
      "그래도 중심지 이동을 완전히 포기하고 싶지는 않습니다.",
      "룸렌트나 룸쉐어 중심으로 볼 수 있습니다.",
      "이동 시간은 지도에서 꼼꼼히 확인할 수 있습니다.",
    ],
    nearby: "Dufferin, Finch West 근처를 먼저 비교해보세요.",
    caution: "예산을 낮출수록 이동 시간이나 매물 상태에서 타협이 생길 수 있습니다.",
  },
  result05: {
    id: "result05",
    title: "시내 활동과 현지 서비스직 접근을 우선하는 선택지",
    stations: ["College", "Dundas"],
    reason:
      "현지 서비스직, 리테일, 카페, 레스토랑 등 시내 활동이 많을 가능성이 있는 사용자에게 기준점이 될 수 있습니다.",
    goodFor: [
      "현지 매장/서비스직을 우선 고려합니다.",
      "다운타운을 자주 갈 예정입니다.",
      "중심지 생활을 경험하고 싶습니다.",
      "예산이 어느 정도 있습니다.",
    ],
    nearby: "College, Dundas, Bloor-Yonge 주변을 함께 비교해보세요.",
    caution: "중심지에 가까울수록 월세가 높고 공간이 작을 수 있습니다.",
  },
  result06: {
    id: "result06",
    title: "시내 접근은 필요하지만 예산도 고려하는 선택지",
    stations: ["Dufferin", "Broadview"],
    reason: "도시 중심지 활동은 필요하지만 중심부 월세가 부담될 때 함께 볼 수 있어요.",
    goodFor: [
      "현지 서비스직을 고려합니다.",
      "다운타운을 자주 갈 수 있습니다.",
      "하지만 중심지 월세는 부담됩니다.",
      "예산과 이동성 사이에서 균형이 필요합니다.",
    ],
    nearby: "Dufferin, Broadview 근처를 비교해보세요.",
    caution: "실제 근무지가 정해지면 이동 시간이 크게 달라질 수 있으니 지도 확인이 필수입니다.",
  },
  result07: {
    id: "result07",
    title: "이동성과 생활 안정감을 함께 보는 균형형",
    stations: ["Eglinton", "St George"],
    reason:
      "시내 한복판은 부담스럽지만 이동성과 생활 편의성을 함께 보고 싶은 사용자에게 비교 기준이 될 수 있습니다.",
    goodFor: [
      "이동성은 중요합니다.",
      "하지만 너무 중심지는 부담스럽습니다.",
      "생활 편의성도 필요합니다.",
      "무난한 균형형 선택지를 원합니다.",
    ],
    nearby: "Eglinton, St George 주변을 비교해보세요.",
    caution: "각 매물의 실제 위치에 따라 체감 이동 시간이 크게 달라질 수 있습니다.",
  },
  result08: {
    id: "result08",
    title: "비용과 한국 생활권을 함께 고려하는 선택지",
    stations: ["Finch", "Christie"],
    reason:
      "예산을 아끼면서도 한국 정보 접근이나 커뮤니티 접근을 포기하고 싶지 않은 사용자에게 비교 후보가 될 수 있습니다.",
    goodFor: [
      "비용을 중요하게 봅니다.",
      "한국 생활권도 필요합니다.",
      "처음 적응이 걱정됩니다.",
      "룸렌트 중심으로 볼 수 있습니다.",
    ],
    nearby: "Finch, Christie 근처를 함께 비교해보세요.",
    caution: "역 이름만 보고 결정하지 말고 실제 매물 위치와 이동 시간을 확인해야 합니다.",
  },
  result09: {
    id: "result09",
    title: "초저예산 기준의 가성비 탐색 시작점",
    stations: ["Victoria Park", "Finch West"],
    reason: "월세를 최대한 낮춰야 하는 경우 중심지 접근성보다 예산 방어를 우선해야 할 수 있습니다.",
    goodFor: [
      "C$400~600 예산 구간입니다.",
      "선택지가 매우 제한적임을 알고 있습니다.",
      "룸렌트나 룸쉐어 중심으로 볼 수 있습니다.",
      "이동 시간 타협이 가능합니다.",
    ],
    nearby: "Victoria Park, Finch West 근처를 비교해보세요.",
    caution:
      "너무 싸고 조건이 좋아 보이는 매물은 반드시 추가 확인이 필요합니다. 실제 상태, 입주 가능 여부, 집주인 응답을 확인해야 합니다.",
  },
  result10: {
    id: "result10",
    title: "비용과 중심 접근 사이의 타협형",
    stations: ["Dufferin", "Broadview"],
    reason:
      "월세는 줄이고 싶지만 중심 접근성을 완전히 포기하고 싶지 않은 사용자에게 비교 후보가 될 수 있습니다.",
    goodFor: [
      "비용을 중요하게 봅니다.",
      "너무 멀리 가는 것은 부담스럽습니다.",
      "중심지 접근도 어느 정도 필요합니다.",
      "룸렌트 중심으로 볼 수 있습니다.",
    ],
    nearby: "Dufferin, Broadview 근처를 비교해보세요.",
    caution: "가격만 보고 결정하지 말고 출퇴근 동선과 실제 이동 시간을 같이 확인해야 합니다.",
  },
  result11: {
    id: "result11",
    title: "한국 생활권과 시내 접근을 함께 보는 선택지",
    stations: ["Christie", "St George"],
    reason:
      "한국 생활권 접근성과 다운타운/중심지 접근을 함께 고려하고 싶은 사용자에게 비교 후보가 될 수 있습니다.",
    goodFor: [
      "한국 정보 접근이 필요합니다.",
      "다운타운도 자주 갈 예정입니다.",
      "너무 외진 곳은 피하고 싶습니다.",
      "예산과 이동성을 함께 보고 싶습니다.",
    ],
    nearby: "Christie, St George, Bloor-Yonge 쪽을 함께 비교해보세요.",
    caution: "접근성이 좋아질수록 예산 부담이 커질 수 있습니다.",
  },
  result12: {
    id: "result12",
    title: "예산과 이동 스트레스 사이의 균형형",
    stations: ["Finch West", "Dufferin"],
    reason:
      "비용을 줄이면서도 이동 스트레스를 완전히 키우고 싶지 않은 사용자에게 비교 후보가 될 수 있습니다.",
    goodFor: [
      "예산을 아껴야 합니다.",
      "그래도 이동성이 너무 나쁘면 안 됩니다.",
      "룸렌트 중심으로 볼 수 있습니다.",
      "실제 이동 시간을 꼼꼼히 볼 수 있습니다.",
    ],
    nearby: "Finch West, Dufferin 근처를 비교해보세요.",
    caution: "가격, 이동 시간, 매물 상태 중 무엇을 가장 우선할지 다시 확인해야 합니다.",
  },
};

export const LEGAL_SCOPE_NOTICE =
  "이 추천은 정답이 아니라 탐색 시작점을 잡기 위한 참고용입니다. 실제 이동 시간, 매물 상태, 계약 조건, 송금 여부는 사용자가 직접 확인해야 합니다. 메이플하우스는 계약 당사자가 아니며, 법률 자문이나 부동산 중개를 제공하지 않습니다.";

const SCORE_RULES: Partial<Record<AnswerValue, Partial<ScoreMap>>> = {
  koreanJob: { koreanCommunity: 3, budgetValue: 1 },
  localService: { downtownActivity: 3, commuteMobility: 1 },
  officeAdmin: { commuteMobility: 3, downtownActivity: 1 },
  unknownMobility: { commuteMobility: 2, budgetValue: 1, koreanCommunity: 1 },
  budget1: { budgetValue: 4 },
  budget2: { budgetValue: 3, koreanCommunity: 1 },
  budget3: { budgetValue: 1, commuteMobility: 1, koreanCommunity: 1 },
  budget4: { commuteMobility: 2, downtownActivity: 2 },
  budget5: { downtownActivity: 3, commuteMobility: 2 },
  priorityCost: { budgetValue: 4 },
  priorityMobility: { commuteMobility: 4 },
  priorityCommunity: { koreanCommunity: 4 },
  priorityStability: { commuteMobility: 1, koreanCommunity: 1, budgetValue: 1 },
  koreanHigh: { koreanCommunity: 4 },
  koreanMedium: { koreanCommunity: 2, commuteMobility: 1 },
  koreanLow: { downtownActivity: 2, commuteMobility: 1 },
  downtownDaily: { downtownActivity: 4, commuteMobility: 2 },
  downtownWeekly: { downtownActivity: 2, commuteMobility: 2 },
  downtownRare: { budgetValue: 2, koreanCommunity: 1 },
};

const PRIORITY_TIE_BREAK: Partial<Record<AnswerValue, Orientation>> = {
  priorityCost: "budgetValue",
  priorityMobility: "commuteMobility",
  priorityCommunity: "koreanCommunity",
  priorityStability: "commuteMobility",
};

const BUDGET_TIE_BREAK: Partial<Record<AnswerValue, Orientation>> = {
  budget1: "budgetValue",
  budget2: "budgetValue",
  budget3: "commuteMobility",
  budget4: "downtownActivity",
  budget5: "downtownActivity",
};

function isStationId(station: string): station is StationId {
  return station in STATION_METADATA;
}

function resolveStationId(station: StationId | string): StationId | undefined {
  return isStationId(station) ? station : STATION_NAME_TO_ID[station];
}

export function getStationDisplayName(station: StationId | string, locale: StationLocale = "ko") {
  const stationId = resolveStationId(station);

  if (stationId) {
    return STATION_METADATA[stationId].displayName[locale];
  }

  if (locale !== "ko") return `${station} Station`;
  return STATION_DISPLAY_NAMES[station] ?? `${station} Station`;
}

export function formatStationDisplayName(station: string, locale: StationLocale = "ko") {
  return getStationDisplayName(station, locale);
}

function formatStationList(stations: Array<StationId | string>) {
  return stations.map((station) => getStationDisplayName(station, "ko")).join(", ");
}

function getProfileStationIds(stations: Array<StationId | string>) {
  return stations
    .map((station) => resolveStationId(station))
    .filter((station): station is StationId => Boolean(station));
}

function stationsWithTag(stations: Array<StationId | string>, tag: StationProfileTag) {
  return getProfileStationIds(stations).filter((station) =>
    STATION_PROFILE_METADATA[station].tags.includes(tag),
  );
}

function buildStationProfileExplanation(
  stations: Array<StationId | string>,
  options: {
    anchorStations?: Array<StationId | string>;
    anchorLabel?: string;
    comparisonLabel?: string;
  } = {},
) {
  const lines: string[] = [];
  const anchorStations = options.anchorStations ?? [];
  const comparisonLabel = options.comparisonLabel ?? "집 찾기 비교 후보";

  if (anchorStations.length > 0) {
    lines.push(
      `${formatStationList(anchorStations)}은 ${options.anchorLabel ?? "학교/도착지 접근 기준역"}으로 먼저 보면 좋아요.`,
    );
  }

  const budgetStations = stationsWithTag(stations, "budgetCompare");
  const koreanStations = stationsWithTag(stations, "koreanHub");
  const centralStations = stationsWithTag(stations, "central");
  const beginnerStations = stationsWithTag(stations, "beginnerReference");
  const westStations = stationsWithTag(stations, "westCompare");
  const eastStations = stationsWithTag(stations, "eastRoute");
  const campusStations = stationsWithTag(stations, "campusAdjacent");

  if (budgetStations.length > 0) {
    lines.push(`${formatStationList(budgetStations)}은 월세와 매물 선택지를 넓혀 보기 좋은 ${comparisonLabel}이에요.`);
  }
  if (koreanStations.length > 0) {
    lines.push(`${formatStationList(koreanStations)}은 한국 음식, 정보, 커뮤니티 접근성을 함께 보기 좋아요.`);
  }
  if (centralStations.length > 0) {
    lines.push(`${formatStationList(centralStations)}은 중심부 이동이나 수업 후 활동을 비교하기 좋아요.`);
  }
  if (campusStations.length > 0 && anchorStations.length === 0) {
    lines.push(`${formatStationList(campusStations)}은 학교나 도착지와 가까운 생활권을 비교하기 좋아요.`);
  }
  if (westStations.length > 0 && eastStations.length > 0) {
    lines.push("서쪽/동쪽 비교 후보는 중심부만 보지 않고 예산과 이동 부담을 함께 보기 위해 보여드려요.");
  } else if (westStations.length > 0) {
    lines.push("서쪽 비교 후보는 중심부만 보지 않고 예산과 이동 부담을 함께 보기 위해 보여드려요.");
  } else if (eastStations.length > 0) {
    lines.push("동쪽 비교 후보는 중심부만 보지 않고 예산과 이동 부담을 함께 보기 위해 보여드려요.");
  }
  if (beginnerStations.length > 0) {
    lines.push(`${formatStationList(beginnerStations)}은 처음 도착했을 때 생활 정보를 비교하기 쉬운 기준역이에요.`);
  }

  return lines;
}

function countAnswerValues(answers: Record<string, string>, values: string[]) {
  return Object.values(answers).filter((answer) => values.includes(answer)).length;
}

function buildWorkingHolidayReason(
  answers: Record<QuestionId, AnswerValue>,
  result: RecommendationResult,
) {
  const lines: string[] = [];
  const stationLines = buildStationProfileExplanation(result.stations, {
    comparisonLabel: "워킹홀리데이 집 찾기 후보",
  });

  if (answers.work === "koreanJob") {
    lines.push("한국 커뮤니티 기반 업장 가능성을 열어두었기 때문에 한인 생활권 접근성을 반영했어요.");
  } else if (answers.work === "localService") {
    lines.push("식당, 카페, 매장 같은 현지 서비스직 가능성을 고려해 상권 접근과 생활권을 같이 봤어요.");
  } else if (answers.work === "officeAdmin") {
    lines.push("사무직이나 행정 업무 가능성을 고려해 출퇴근 동선을 이해하기 쉬운 역을 우선 비교했어요.");
  } else {
    lines.push("일자리 위치가 아직 정해지지 않았기 때문에 처음 정착하며 비교하기 쉬운 생활권을 중심으로 추천드렸어요.");
  }

  if (answers.budget === "budget1" || answers.budget === "budget2" || answers.priority === "priorityCost") {
    lines.push("예산을 중요하게 보는 선택이 있어 중심부만 보지 않고 월세 부담을 낮출 후보도 추천드렸어요.");
  }
  if (answers.koreanLife === "koreanHigh" || answers.priority === "priorityCommunity") {
    lines.push("한국 음식, 정보, 커뮤니티 접근성도 주요 기준으로 봤어요.");
  }
  if (answers.downtown === "downtownDaily" || answers.priority === "priorityMobility") {
    lines.push("도심 방문 빈도와 이동 부담을 고려해 TTC 기준 출퇴근 동선이 잡히는 후보를 같이 봤어요.");
  }
  if (countAnswerValues(answers, ["unknownMobility"]) > 0) {
    lines.push("아직 정해지지 않은 항목이 있어 처음 비교하기 쉬운 기준역을 넓게 추천드렸어요.");
  }

  return [...lines, ...stationLines].slice(0, 4).join(" ");
}

function buildLanguageStudyReason(
  answers: Record<LanguageStudyQuestionId, LanguageStudyAnswerValue> & {
    ilacCampus?: IlacCampusAnswer;
  },
  destinationStations: StationId[],
  recommendedStations: StationId[],
  fallbackReason: string,
) {
  const lines = buildStationProfileExplanation(recommendedStations, {
    anchorStations: destinationStations,
    anchorLabel: "어학원 도착 기준역",
    comparisonLabel: "집 찾기 비교 후보",
  });

  if (answers.commuteRange === "commute_very_close" || answers.finalPriority === "final_school_commute") {
    lines.push("아침 등교 부담을 줄이려는 선택이 있어 어학원 도착 기준역과 가까운 후보를 우선했어요.");
  }
  if (answers.languageBudget === "budget_400_600" || answers.languageBudget === "budget_600_900" || answers.finalPriority === "final_budget") {
    lines.push("월세 예산을 중요하게 본 선택이 있어 예산 비교가 가능한 후보를 보여드려요.");
  }
  if (answers.koreanCommunity === "korean_very_important" || answers.finalPriority === "final_korean_community") {
    lines.push("한국 생활권 접근성도 반영했지만, 어학원까지의 실제 통학 경로를 함께 확인해야 합니다.");
  }
  if (answers.cityActivity === "city_activity_low" && answers.finalPriority === "final_social_activity") {
    lines.push("도심 활동 선호가 일부 엇갈려, 활동 접근성과 집 주변 생활 균형을 함께 비교해보면 좋아요.");
  }
  if (answers.koreanCommunity === "korean_not_important" && answers.finalPriority === "final_korean_community") {
    lines.push("한국 생활권 선호가 일부 엇갈려, 한 가지 기준에 고정하기보다 통학과 생활권을 같이 확인할 수 있게 보여드려요.");
  }
  if (countAnswerValues(answers, ["school_unknown", "commute_not_sure", "transport_not_sure", "housing_not_sure", "after_school_not_sure"]) >= 2) {
    lines.push("아직 선호가 확정되지 않은 항목이 있어 처음 비교하기 쉬운 기준역을 중심으로 보여드려요.");
  }

  return (lines.length > 0 ? lines : [fallbackReason]).slice(0, 4).join(" ");
}

function buildStudyAbroadReason(
  answers: Record<StudyAbroadQuestionId, StudyAbroadAnswerValue> & {
    georgeBrownCampus?: GeorgeBrownCampusAnswer;
    ilacHigherProgram?: IlacHigherAnswer;
    centennialCampus?: CentennialCampusAnswer;
  },
  campusStations: StationId[],
  recommendedStations: StationId[],
  fallbackReason: string,
) {
  const lines = buildStationProfileExplanation(recommendedStations, {
    anchorStations: campusStations,
    anchorLabel: "학교/캠퍼스 접근 기준역",
    comparisonLabel: "집 찾기 비교 후보",
  });

  if (answers.campusCommute === "campus_very_close" || answers.finalPriority === "final_campus_commute") {
    lines.push("캠퍼스 접근을 강하게 본 선택이 있어 학교 기준역과 가까운 비교 후보를 우선했어요.");
  }
  if (answers.studyBudget === "budget_400_600" || answers.studyBudget === "budget_600_900" || answers.finalPriority === "final_budget") {
    lines.push("월세 예산을 중요하게 보는 선택이 있어 예산 비교 후보를 보여드려요.");
  }
  if (answers.koreanCommunity === "korean_very_important" || answers.finalPriority === "final_korean_access") {
    lines.push("한국 생활권 접근성도 참고했지만, 중심부 캠퍼스에서는 캠퍼스 지리와 통학 부담을 먼저 제한했습니다.");
  }
  if (answers.koreanCommunity === "korean_not_important" && answers.finalPriority === "final_korean_access") {
    lines.push("생활권 선호가 일부 엇갈려, 한국 생활권만 고정하지 않고 캠퍼스 접근성과 예산 비교 후보를 보여드려요.");
  }
  if (
    (answers.campusCommute === "campus_very_close" || answers.campusCommute === "campus_short") &&
    answers.finalPriority === "final_budget" &&
    (answers.studyBudget === "budget_400_600" || answers.studyBudget === "budget_600_900")
  ) {
    lines.push("가까운 통학과 낮은 예산은 동시에 맞추기 어려울 수 있어, 실제 경로와 매물 조건을 꼭 함께 확인해야 합니다.");
  }
  if (answers.cityActivity === "city_low" && answers.finalPriority === "final_city_activity") {
    lines.push("도심 활동 선호가 일부 엇갈려, 활동 접근성과 조용한 생활권을 함께 비교해보면 좋아요.");
  }
  if (countAnswerValues(answers, ["school_unknown", "campus_not_sure", "housing_not_sure", "study_not_sure"]) >= 2) {
    lines.push("아직 선호가 확정되지 않은 항목이 있어 처음 비교하기 쉬운 기준역을 중심으로 보여드려요.");
  }

  return (lines.length > 0 ? lines : [fallbackReason]).slice(0, 4).join(" ");
}

function getStationReasonTheme(station: StationId | string) {
  const stationId = resolveStationId(station);
  if (!stationId) {
    return {
      title: "비교 기준역",
      body: "처음 집을 찾을 때 주변 매물과 생활권을 같이 볼 수 있어요.",
    };
  }

  const profile = STATION_PROFILE_METADATA[stationId];
  if (profile.tags.includes("koreanHub")) {
    return {
      title: "한국 생활권",
      body: "한국 음식점이나 한인마트가 있는 생활권을 같이 볼 수 있어요.",
    };
  }
  if (profile.tags.includes("budgetCompare") || profile.rentAffordability >= 4) {
    return {
      title: "월세 비교",
      body: "학교나 어학원 바로 앞 월세가 부담스러울 때 선택지를 넓혀볼 수 있어요.",
    };
  }
  if (profile.tags.includes("campusAdjacent")) {
    return {
      title: "학교 기준",
      body: "학교와 가까운 생활권을 먼저 생각할 때 도움이 되는 역이에요.",
    };
  }
  if (profile.tags.includes("academyArrival")) {
    return {
      title: "어학원 도착",
      body: "어학원까지 가는 방향을 잡을 때 도움이 되는 역이에요.",
    };
  }
  if (profile.tags.includes("central") || profile.tags.includes("subwayTransfer")) {
    return {
      title: "도시 중심지 활동",
      body: "수업 후 약속, 식사, 행사처럼 도시 중심지 활동을 같이 생각할 때 보여드려요.",
    };
  }
  if (profile.tags.includes("beginnerReference") || profile.beginnerPracticality >= 4) {
    return {
      title: "초기 정착",
      body: "처음 도착해서 너무 복잡하지 않은 생활권부터 보고 싶을 때 참고하기 좋아요.",
    };
  }

  return {
    title: "생활권 비교",
    body: "집 주변 생활과 실제 이동 부담을 같이 생각할 때 보여드려요.",
  };
}

function getStationComparisonReasonBody(station: StationId | string) {
  const stationId = resolveStationId(station);
  if (!stationId) {
    return "처음 집을 찾을 때 주변 매물과 생활권을 함께 비교해보기 좋은 후보예요.";
  }

  switch (stationId) {
    case "christie":
      return "크리스티 역은 구 한인타운으로 알려져 있고, 한국 음식점과 한인마트를 함께 볼 수 있는 역이에요. 한인 생활권이 중요하다고 답변하셨기 때문에 보여드려요.";
    case "eglinton":
      return "에글린턴 역은 도심 핵심 상권보다 덜 복잡한 미드타운 생활권을 볼 때 좋은 역이에요. 마트, 카페, 음식점 같은 일상 시설도 함께 비교할 수 있어요.";
    case "northYorkCentre":
      return "노스 요크 센터 역은 한국 음식과 생활 정보가 있는 노스욕 생활권을 볼 때 참고하기 좋은 역이에요. 한인 생활권과 장기 생활 편의를 중요하게 봤을 때 먼저 보여드려요.";
    case "finch":
      return "핀치 역은 노스욕 북쪽 생활권과 한국 생활권을 함께 볼 수 있는 역이에요. 예산과 한인 생활권을 같이 고려할 때 비교해볼 수 있어요.";
    case "bloorYonge":
      return "블루어-영 역은 여러 방향으로 이동하기 쉬운 중심 기준역이라 어학원, 약속, 생활 동선을 함께 비교하기 좋아요.";
    case "college":
      return "칼리지 역은 학교와 도시 중심지 생활을 함께 보면서 집 찾기 범위를 잡아보기 좋은 기준역이에요.";
    case "stGeorge":
      return "세인트 조지 역은 대학가 주변 생활권과 중심지 이동을 함께 비교하기 좋은 기준역이에요.";
    case "dundas":
      return "TMU Station은 중심지 활동과 학교 주변 생활권을 함께 확인하기 좋은 기준역이에요.";
    case "dufferin":
      return "더퍼린 역은 중심부 월세가 부담스러울 때 서쪽 생활권과 매물 선택지를 함께 비교하기 좋은 역이에요. 월세와 주거 형태를 함께 비교하려는 답변 때문에 보여드려요.";
    case "broadview":
      return "브로드뷰 역은 동쪽 생활권을 보면서 중심부와 너무 멀어지지 않는 선택지를 비교해볼 만한 역이에요.";
    case "victoriaPark":
      return "빅토리아 파크 역은 동쪽 예산형 생활권을 함께 볼 때 비교해볼 만한 역이에요.";
    default:
      break;
  }

  const profile = STATION_PROFILE_METADATA[stationId];
  if (profile.tags.includes("koreanHub")) {
    return "한국 음식점이나 한인마트가 있는 생활권을 같이 볼 수 있는 역이에요. 한인 생활권이 중요할 때 먼저 보여드려요.";
  }
  if (profile.tags.includes("budgetCompare") || profile.rentAffordability >= 4) {
    return "학교나 어학원 바로 앞 월세가 부담스러울 때 선택지를 넓혀볼 수 있는 역이에요.";
  }
  if (profile.tags.includes("central") || profile.tags.includes("subwayTransfer")) {
    return "수업 후 약속, 식사, 행사처럼 도시 중심지 활동을 같이 생각할 때 보여드려요.";
  }
  if (profile.tags.includes("beginnerReference") || profile.beginnerPracticality >= 4) {
    return "처음 도착해서 너무 복잡하지 않은 생활권부터 보고 싶을 때 참고하기 좋아요.";
  }
  if (profile.tags.includes("campusAdjacent") || profile.tags.includes("academyArrival")) {
    return "학교나 어학원 바로 앞만 보지 않고 집을 볼 범위를 넓힐 때 보여드려요.";
  }

  return "집 주변 생활과 실제 이동 부담을 같이 생각할 때 보여드려요.";
}

function getKoreanStationShortName(station: StationId) {
  const label = STATION_METADATA[station].displayName.ko;
  return label.match(/\((.+)\)/)?.[1] ?? label;
}

function getLanguageStudyDistanceContext(
  answers: Record<LanguageStudyQuestionId, LanguageStudyAnswerValue> & {
    ilacCampus?: IlacCampusAnswer;
  },
) {
  if (answers.school === "school_ilac" && answers.ilacCampus === "ilac_dream") return "languageStudy_ilacDream";
  if (answers.school === "school_ilsc") return "languageStudy_ilsc";
  if (answers.school === "school_ec" || answers.school === "school_hansa") return "languageStudy_ecHansa";
  if (answers.school === "school_kaplan") return "languageStudy_kaplan";
  return null;
}

function getStudyAbroadDistanceContext(
  answers: Record<StudyAbroadQuestionId, StudyAbroadAnswerValue> & {
    georgeBrownCampus?: GeorgeBrownCampusAnswer;
    ilacHigherProgram?: IlacHigherAnswer;
    centennialCampus?: CentennialCampusAnswer;
  },
) {
  if (answers.school === "school_ocad") return "studyAbroad_ocad";
  if (answers.school === "school_uoft_stgeorge") return "studyAbroad_uoftStGeorge";
  if (answers.school === "school_tmu") return "studyAbroad_tmu";
  if (answers.school === "school_york_keele") return "studyAbroad_yorkKeele";
  if (answers.school === "school_utsc") return "studyAbroad_utsc";
  if (answers.school === "school_centennial") return "studyAbroad_centennial";
  if (answers.school === "school_georgebrown") {
    if (answers.georgeBrownCampus === "gb_waterfront") return "studyAbroad_georgeBrownWaterfront";
    if (answers.georgeBrownCampus === "gb_casaloma") return "studyAbroad_georgeBrownCasaLoma";
    return "studyAbroad_georgeBrownStJames";
  }
  return null;
}

function getProvisionalDistanceNote(context: string | null, station: StationId) {
  if (!context) return undefined;
  return PROVISIONAL_STATION_DISTANCE_NOTES[context]?.[station];
}

const WALKING_SPEED_METERS_PER_MINUTE = 80;
const WALKING_THIRTY_MINUTES_KM = (WALKING_SPEED_METERS_PER_MINUTE * 30) / 1000;

function getDistanceKmForAccess(note: ProvisionalStationDistanceNote) {
  if (typeof note.distanceKm === "number") return note.distanceKm;
  if (note.distanceKmRange) return note.distanceKmRange[1];
  return undefined;
}

function getWalkingTransitGuidance(note: ProvisionalStationDistanceNote) {
  const distanceKm = getDistanceKmForAccess(note);

  if (typeof distanceKm !== "number") {
    return "학교나 어학원 생활 동선과 함께 생각하면 좋아요.";
  }

  if (distanceKm < 1.2) {
    return `${note.distanceText} 정도라 걸어서 이동하는 걸 먼저 생각해볼 수 있어요.`;
  }

  if (distanceKm <= WALKING_THIRTY_MINUTES_KM) {
    return `${note.distanceText} 정도라 걸어서도 볼 수 있지만, 날씨나 짐이 많을 때는 대중교통도 같이 확인하면 좋아요.`;
  }

  return `${note.distanceText} 정도라 도보만으로는 부담될 수 있어요. 버스/스트리트카/지하철 연계를 같이 보는 게 좋아요.`;
}

function buildDestinationDistanceReason(
  station: StationId,
  destinationName: string,
  note: ProvisionalStationDistanceNote,
) {
  const stationName = getKoreanStationShortName(station);
  const baseText =
    note.explanationText ??
    `${stationName}은 ${destinationName}와 가까운 역이에요.`;

  return `${baseText} ${getWalkingTransitGuidance(note)}`;
}

function getWorkingHolidayEvidence(answers: Record<QuestionId, AnswerValue>, station: string) {
  const stationId = resolveStationId(station);
  if (
    stationId &&
    STATION_PROFILE_METADATA[stationId].tags.includes("koreanHub") &&
    (answers.koreanLife === "koreanHigh" || answers.priority === "priorityCommunity")
  ) {
    return "한인 생활권을 중요하게 보신 방향에 따라 추천드렸어요.";
  }
  if (answers.budget === "budget1" || answers.budget === "budget2" || answers.priority === "priorityCost") {
    return "월세 부담을 낮추고 싶다는 방향에 따라 추천드렸어요.";
  }
  if (answers.downtown === "downtownDaily" || answers.priority === "priorityMobility") {
    return "중심지 이동과 출퇴근 동선을 중요하게 보신 방향에 맞춰 추천드렸어요.";
  }
  if (answers.work === "unknownMobility") {
    return "일자리 위치가 아직 정해지지 않아 처음 확인하기 쉬운 생활권을 원하신 방향에 따라 추천드렸어요.";
  }
  return "일자리 방향, 예산, 생활권을 함께 보려는 방향에 맞춰 추천드렸어요.";
}

function getWorkingHolidayStationReasonBody(station: StationId | string) {
  const stationId = resolveStationId(station);
  if (!stationId) {
    return "처음 정착할 때 일자리 방향, 월세 예산, 생활권을 함께 확인하기 좋은 기준역이에요.";
  }

  switch (stationId) {
    case "christie":
      return "크리스티 역은 한인 식당과 마트 접근을 같이 볼 수 있는 생활권이에요. 처음 정착하면서 한국 생활권을 가까이 두고 싶은 경우에 참고하기 좋아요.";
    case "northYorkCentre":
      return "노스 요크 센터 역은 한인 생활권과 생활 편의시설을 함께 확인하기 좋은 기준역이에요. 처음 정착할 때 정보 접근성을 중요하게 볼 때 참고할 수 있어요.";
    case "finch":
      return "핀치 역은 노스욕 북쪽 생활권과 한인 생활권을 함께 볼 수 있는 기준역이에요. 월세 예산과 생활 편의 사이를 비교하기 좋아요.";
    case "finchWest":
      return "핀치 웨스트 역은 월세 부담을 낮추면서 북서쪽 생활권을 확인하기 좋은 기준역이에요. 일자리 위치가 아직 정해지지 않았을 때 예산형 후보로 참고할 수 있어요.";
    case "dufferin":
      return "더퍼린 역은 서쪽 생활권과 중심지 이동 부담을 함께 비교하기 좋은 기준역이에요. 카페, 식당, 매장 등 서비스직 가능성이 있는 상권 접근도 함께 확인해볼 수 있어요.";
    case "broadview":
      return "브로드뷰 역은 동쪽 생활권을 보면서 중심부와 너무 멀어지지 않는 출퇴근 동선을 비교하기 좋은 기준역이에요.";
    case "victoriaPark":
      return "빅토리아 파크 역은 동쪽 예산형 생활권을 먼저 확인할 때 참고하기 좋은 기준역이에요. 월세 부담과 이동 시간을 함께 비교해볼 수 있어요.";
    case "bloorYonge":
      return "블루어-영 역은 여러 방향으로 이동하기 쉬운 환승 기준역이에요. 서비스직, 사무직, 중심지 상권 방향을 아직 넓게 보고 있을 때 출퇴근 동선을 잡기 좋아요.";
    case "college":
      return "칼리지 역은 중심 상권과 생활 편의시설을 함께 볼 수 있는 기준역이에요. 식당, 카페, 매장, 사무직 가능성이 있는 방향을 넓게 확인할 때 참고할 수 있어요.";
    case "dundas":
      return "던다스 역은 중심 상권 접근성이 강한 기준역이에요. 식당, 카페, 매장 등 서비스직 가능성이 있는 생활권을 먼저 확인할 때 참고하기 좋아요.";
    case "eglinton":
      return "에글린턴 역은 중심부보다 덜 복잡한 미드타운 생활권이에요. 월세 예산과 출퇴근 이동 부담을 균형 있게 비교하기 좋아요.";
    case "stGeorge":
      return "세인트 조지 역은 중심부 이동이 편한 기준역이에요. 아직 일자리 방향이 넓을 때 여러 생활권으로 이동하기 좋은 출발점으로 볼 수 있어요.";
    default:
      break;
  }

  const profile = STATION_PROFILE_METADATA[stationId];
  if (profile.tags.includes("koreanHub")) {
    return "한인 생활권과 생활 정보를 가까이 두고 싶은 경우에 참고하기 좋은 기준역이에요.";
  }
  if (profile.tags.includes("budgetCompare") || profile.rentAffordability >= 4) {
    return "월세 부담을 낮추면서 처음 정착할 생활권을 비교하기 좋은 기준역이에요.";
  }
  if (profile.tags.includes("central") || profile.tags.includes("subwayTransfer")) {
    return "일자리 방향이 아직 넓을 때 중심지 이동과 출퇴근 동선을 잡기 좋은 기준역이에요.";
  }
  if (profile.tags.includes("beginnerReference") || profile.beginnerPracticality >= 4) {
    return "처음 정착할 때 너무 복잡하지 않은 생활권부터 확인하기 좋은 기준역이에요.";
  }

  return "일자리 방향, 월세 예산, 생활권을 함께 확인할 때 참고하기 좋은 기준역이에요.";
}

function getLanguageStudySchoolName(
  answers: Record<LanguageStudyQuestionId, LanguageStudyAnswerValue> & {
    ilacCampus?: IlacCampusAnswer;
  },
) {
  if (answers.school === "school_ilac") {
    switch (answers.ilacCampus) {
      case "ilac_growth":
        return "ILAC Growth Campus";
      case "ilac_pathway":
        return "ILAC University Pathway Campus";
      case "ilac_dream":
        return "ILAC Dream Campus";
      case "ilac_heart":
        return "ILAC Heart Campus";
      default:
        return "ILAC";
    }
  }
  if (answers.school === "school_ilsc") return "ILSC Toronto";
  if (answers.school === "school_ec") return "EC English Toronto";
  if (answers.school === "school_hansa") return "Hansa Language Centre";
  if (answers.school === "school_kaplan") return "Kaplan Toronto";
  return "선택한 어학원";
}

function getLanguageStudyDestinationReasonBody(
  answers: Record<LanguageStudyQuestionId, LanguageStudyAnswerValue> & {
    ilacCampus?: IlacCampusAnswer;
  },
  station: StationId,
) {
  const schoolName = getLanguageStudySchoolName(answers);
  const note = getProvisionalDistanceNote(getLanguageStudyDistanceContext(answers), station);
  if (note) {
    return buildDestinationDistanceReason(station, schoolName, note);
  }
  if (answers.school === "school_ilac" && answers.ilacCampus === "ilac_dream" && station === "sherbourne") {
    return "ILAC Dream Campus를 다닐 때 어학원 도착 방향을 먼저 잡기 좋은 역이에요. 정확한 이동 시간은 지도 길찾기로 확인해 주세요.";
  }
  return `${schoolName}까지 가는 방향을 먼저 잡아볼 때 기준이 되는 역이에요. 정확한 이동 시간은 지도 길찾기로 확인해 주세요.`;
}

function getLanguageStudyEvidence(
  answers: Record<LanguageStudyQuestionId, LanguageStudyAnswerValue> & {
    ilacCampus?: IlacCampusAnswer;
  },
  station: StationId,
  roleLabel: string,
) {
  const profile = STATION_PROFILE_METADATA[station];
  if (roleLabel.includes("어학원")) {
    if (answers.school === "school_ilac" && answers.ilacCampus === "ilac_dream") {
      return "ILAC Dream Campus를 선택해서 먼저 보여드려요.";
    }
    return "선택한 어학원 위치를 기준으로 먼저 보여드려요.";
  }
  if (
    profile.tags.includes("koreanHub") &&
    (answers.koreanCommunity === "korean_very_important" ||
      answers.afterSchool === "after_school_korean_food" ||
      answers.finalPriority === "final_korean_community")
  ) {
    return "한국 음식과 정보 접근을 중요하게 본 답변 때문에 먼저 보여드려요.";
  }
  if (
    profile.tags.includes("budgetCompare") ||
    answers.languageBudget === "budget_400_600" ||
    answers.languageBudget === "budget_600_900" ||
    answers.finalPriority === "final_budget"
  ) {
    return "월세 예산과 룸렌트 선택지를 함께 본 답변 때문에 보여드려요.";
  }
  if (answers.commuteRange === "commute_very_close" || answers.finalPriority === "final_school_commute") {
    return "아침 등교 부담을 줄이고 싶다는 답변 때문에 보여드려요.";
  }
  if (answers.cityActivity === "city_activity_very_often" || answers.finalPriority === "final_social_activity") {
    return "수업 후 활동과 도시 중심지 이동을 보고 싶다는 답변 때문에 보여드려요.";
  }
  return "어학원 위치, 아침 이동, 예산, 생활권을 함께 본 답변 때문에 보여드려요.";
}

function getStudyAbroadSchoolName(
  answers: Record<StudyAbroadQuestionId, StudyAbroadAnswerValue> & {
    georgeBrownCampus?: GeorgeBrownCampusAnswer;
    ilacHigherProgram?: IlacHigherAnswer;
    centennialCampus?: CentennialCampusAnswer;
  },
) {
  switch (answers.school) {
    case "school_uoft_stgeorge":
      return "University of Toronto St. George";
    case "school_utsc":
      return "University of Toronto Scarborough";
    case "school_tmu":
      return "TMU";
    case "school_ocad":
      return "OCAD";
    case "school_york_keele":
      return "York University Keele Campus";
    case "school_georgebrown":
      return "George Brown College";
    case "school_seneca_newnham":
      return "Seneca Newnham Campus";
    case "school_centennial":
      return "Centennial College";
    case "school_ilac_higher":
      return "ILAC Higher Education";
    default:
      return "선택한 학교";
  }
}

function getStudyAbroadCampusReasonBody(
  answers: Record<StudyAbroadQuestionId, StudyAbroadAnswerValue> & {
    georgeBrownCampus?: GeorgeBrownCampusAnswer;
    ilacHigherProgram?: IlacHigherAnswer;
    centennialCampus?: CentennialCampusAnswer;
  },
  station: StationId,
) {
  const note = getProvisionalDistanceNote(getStudyAbroadDistanceContext(answers), station);
  if (note) {
    const schoolName = getStudyAbroadSchoolName(answers);
    return buildDestinationDistanceReason(station, schoolName, note);
  }
  if (answers.school === "school_ocad" && station === "stPatrick") {
    return "OCAD를 다닐 때 학교 근처를 먼저 확인하기 좋은 기준역이에요. 정확한 이동 시간은 지도 길찾기로 확인해 주세요.";
  }
  if (answers.school === "school_ocad" && station === "osgoode") {
    return "OCAD 근처 수업과 작업실, 전시, 프로젝트 일정을 같이 생각할 때 참고하기 좋은 기준역이에요. 학교 바로 앞만 보지 않고 주변 선택지도 확인하고 싶을 때 보여드려요.";
  }
  const schoolName = getStudyAbroadSchoolName(answers);
  return `${schoolName} 주변을 먼저 확인할 때 기준으로 삼기 좋은 역이에요. 정확한 이동 시간은 지도 길찾기로 확인해 주세요.`;
}

function getStudyAbroadEvidence(
  answers: Record<StudyAbroadQuestionId, StudyAbroadAnswerValue> & {
    georgeBrownCampus?: GeorgeBrownCampusAnswer;
    ilacHigherProgram?: IlacHigherAnswer;
    centennialCampus?: CentennialCampusAnswer;
  },
  station: StationId,
  roleLabel: string,
) {
  const profile = STATION_PROFILE_METADATA[station];
  if (roleLabel.includes("학교")) {
    if (answers.school === "school_ocad") return "학교 선택에서 OCAD를 선택해서 먼저 보여드려요.";
    return "선택한 학교와 캠퍼스 위치를 기준으로 먼저 보여드려요.";
  }
  if (
    profile.tags.includes("koreanHub") &&
    (answers.koreanCommunity === "korean_very_important" || answers.finalPriority === "final_korean_access")
  ) {
    return "한국 음식과 정보 접근을 중요하게 본 답변 때문에 먼저 보여드려요.";
  }
  if (
    profile.tags.includes("budgetCompare") ||
    answers.studyBudget === "budget_400_600" ||
    answers.studyBudget === "budget_600_900" ||
    answers.finalPriority === "final_budget"
  ) {
    return "월세 예산과 주거 형태를 함께 비교하려는 답변 때문에 보여드려요.";
  }
  if (answers.campusCommute === "campus_very_close" || answers.finalPriority === "final_campus_commute") {
    return "학교에 가는 부담을 줄이고 싶다는 답변 때문에 보여드려요.";
  }
  if (answers.cityActivity === "city_very_often" || answers.finalPriority === "final_city_activity") {
    return "도시 중심지 활동과 이동성을 보고 싶다는 답변 때문에 보여드려요.";
  }
  return "학교 접근, 예산, 공부 환경, 생활권을 함께 본 답변 때문에 보여드려요.";
}

function buildStationReasonItem(
  station: StationId | string,
  roleLabel: string,
  evidence: string,
  reasonBody?: string,
) {
  const theme = getStationReasonTheme(station);
  return {
    stationId: String(station),
    roleLabel,
    reasonTitle: theme.title,
    reasonBody: reasonBody ?? theme.body,
    answerEvidence: evidence,
  };
}

function buildWorkingHolidayReasonItems(
  answers: Record<QuestionId, AnswerValue>,
  stations: string[],
) {
  return stations.map((station) =>
    buildStationReasonItem(
      station,
      "추천 기준역",
      getWorkingHolidayEvidence(answers, station),
      getWorkingHolidayStationReasonBody(station),
    ),
  );
}

function buildLanguageStudyReasonItems(
  answers: Record<LanguageStudyQuestionId, LanguageStudyAnswerValue> & {
    ilacCampus?: IlacCampusAnswer;
  },
  destinationStations: StationId[],
  recommendedStations: StationId[],
) {
  return [
    ...destinationStations.map((station) =>
      buildStationReasonItem(
        station,
        "어학원 도착 기준역",
        getLanguageStudyEvidence(answers, station, "어학원 도착 기준역"),
        getLanguageStudyDestinationReasonBody(answers, station),
      ),
    ),
    ...recommendedStations.map((station) =>
      buildStationReasonItem(
        station,
        "집 찾기 비교 기준역",
        getLanguageStudyEvidence(answers, station, "집 찾기 비교 기준역"),
        getStationComparisonReasonBody(station),
      ),
    ),
  ];
}

function buildStudyAbroadReasonItems(
  answers: Record<StudyAbroadQuestionId, StudyAbroadAnswerValue> & {
    georgeBrownCampus?: GeorgeBrownCampusAnswer;
    ilacHigherProgram?: IlacHigherAnswer;
    centennialCampus?: CentennialCampusAnswer;
  },
  campusStations: StationId[],
  recommendedStations: StationId[],
) {
  return [
    ...campusStations.map((station) =>
      buildStationReasonItem(
        station,
        "학교/캠퍼스 기준역",
        getStudyAbroadEvidence(answers, station, "학교/캠퍼스 기준역"),
        getStudyAbroadCampusReasonBody(answers, station),
      ),
    ),
    ...recommendedStations.map((station) =>
      buildStationReasonItem(
        station,
        "집 찾기 비교 기준역",
        getStudyAbroadEvidence(answers, station, "집 찾기 비교 기준역"),
        getStationComparisonReasonBody(station),
      ),
    ),
  ];
}

function buildNearbyReasonItems(stations: Array<StationId | string>) {
  return stations.map((station) => {
    const theme = getStationReasonTheme(station);
    return {
      stationId: String(station),
      roleLabel: "근처 비교 범위",
      reasonTitle: theme.title,
      reasonBody: `${theme.body} 실제 매물 수와 가격은 시점에 따라 달라질 수 있습니다.`,
    };
  });
}

function buildWorkingHolidayUserFitSummary(answers: Record<QuestionId, AnswerValue>) {
  const themes: string[] = [];
  if (answers.budget === "budget1" || answers.budget === "budget2" || answers.priority === "priorityCost") {
    themes.push("월세 부담을 낮추는 것");
  }
  if (answers.koreanLife === "koreanHigh" || answers.priority === "priorityCommunity") {
    themes.push("한국 생활권 접근");
  }
  if (answers.priority === "priorityMobility" || answers.downtown === "downtownDaily") {
    themes.push("이동 부담");
  }
  if (answers.work === "unknownMobility") {
    themes.push("아직 정해지지 않은 일자리 방향");
  }

  if (themes.length === 0) {
    return "일자리 방향, 월세 예산, 생활권을 기준으로 처음 정착지를 비교하려는 사용자에게 잘 맞아요.";
  }
  return `${themes.slice(0, 3).join(", ")}을 기준으로 처음 정착지를 비교하려는 사용자에게 잘 맞아요. 한 역에 고정하지 않고 먼저 볼 후보를 추천드렸어요.`;
}

function buildLanguageStudyUserFitSummary(
  answers: Record<LanguageStudyQuestionId, LanguageStudyAnswerValue>,
) {
  const themes: string[] = [];
  if (answers.commuteRange === "commute_very_close" || answers.finalPriority === "final_school_commute") {
    themes.push("아침 등교 부담");
  }
  if (answers.languageBudget === "budget_400_600" || answers.languageBudget === "budget_600_900" || answers.finalPriority === "final_budget") {
    themes.push("월세 예산");
  }
  if (answers.koreanCommunity === "korean_very_important" || answers.finalPriority === "final_korean_community") {
    themes.push("한국 생활권");
  }
  if (answers.cityActivity === "city_activity_very_often" || answers.finalPriority === "final_social_activity") {
    themes.push("수업 후 활동");
  }
  if (countAnswerValues(answers, ["school_unknown", "commute_not_sure", "transport_not_sure", "housing_not_sure", "after_school_not_sure"]) >= 2) {
    return "아직 정해지지 않은 항목이 있어, 처음 확인하기 쉬운 기준역을 먼저 보여드려요.";
  }
  return `${(themes.length > 0 ? themes : ["어학원 위치", "예산", "생활권"]).slice(0, 3).join(", ")}을 함께 보고 싶은 사용자에게 잘 맞아요.`;
}

function buildStudyAbroadUserFitSummary(
  answers: Record<StudyAbroadQuestionId, StudyAbroadAnswerValue>,
) {
  const themes: string[] = [];
  if (answers.campusCommute === "campus_very_close" || answers.finalPriority === "final_campus_commute") {
    themes.push("학교 접근");
  }
  if (answers.studyBudget === "budget_400_600" || answers.studyBudget === "budget_600_900" || answers.finalPriority === "final_budget") {
    themes.push("월세 예산");
  }
  if (answers.koreanCommunity === "korean_very_important" || answers.finalPriority === "final_korean_access") {
    themes.push("한국 생활권");
  }
  if (answers.studyEnvironment === "study_quiet" || answers.finalPriority === "final_study_stability") {
    themes.push("공부 환경");
  }
  if (countAnswerValues(answers, ["school_unknown", "campus_not_sure", "housing_not_sure", "study_not_sure"]) >= 2) {
    return "아직 정해지지 않은 항목이 있어, 처음 확인하기 쉬운 기준역을 먼저 보여드려요.";
  }
  if (
    (answers.campusCommute === "campus_very_close" || answers.campusCommute === "campus_short") &&
    answers.finalPriority === "final_budget"
  ) {
    return "학교 접근과 월세 예산을 크게 보는 선택이 있어, 한 지점에 고정하지 않고 먼저 볼 후보를 보여드려요.";
  }
  return `${(themes.length > 0 ? themes : ["학교 접근", "예산", "생활권"]).slice(0, 3).join(", ")}을 함께 보고 싶은 사용자에게 잘 맞아요.`;
}

export const LANGUAGE_STUDY_REQUIRED_QUESTION_IDS: LanguageStudyQuestionId[] = [
  "school",
  "commuteRange",
  "transport",
  "languageBudget",
  "housingType",
  "afterSchool",
  "koreanCommunity",
  "cityActivity",
  "partTime",
  "finalPriority",
];

export function isCompleteLanguageStudyAnswerMap(
  answers: LanguageStudyAnswerMap,
): answers is Record<LanguageStudyQuestionId, LanguageStudyAnswerValue> & {
  ilacCampus?: IlacCampusAnswer;
} {
  const hasAllMainAnswers = LANGUAGE_STUDY_REQUIRED_QUESTION_IDS.every((id) =>
    Boolean(answers[id]),
  );
  if (!hasAllMainAnswers) return false;
  if (answers.school === "school_ilac") return Boolean(answers.ilacCampus);
  return true;
}

function createLanguageStudyStationScores() {
  return Object.fromEntries(
    Object.keys(STATION_METADATA).map((stationId) => [stationId, 0]),
  ) as Record<StationId, number>;
}

function addStationScore(
  scores: Record<StationId, number>,
  station: StationId,
  points: number,
) {
  scores[station] += points;
}

function addStationScores(
  scores: Record<StationId, number>,
  stations: StationId[],
  points: number,
) {
  stations.forEach((station) => addStationScore(scores, station, points));
}

export const STUDY_ABROAD_REQUIRED_QUESTION_IDS: StudyAbroadQuestionId[] = [
  "school",
  "campusCommute",
  "lifeBalance",
  "studyBudget",
  "housingType",
  "studyEnvironment",
  "koreanCommunity",
  "cityActivity",
  "outsideMobility",
  "finalPriority",
];

export function isCompleteStudyAbroadAnswerMap(
  answers: StudyAbroadAnswerMap,
): answers is Record<StudyAbroadQuestionId, StudyAbroadAnswerValue> & {
  georgeBrownCampus?: GeorgeBrownCampusAnswer;
  ilacHigherProgram?: IlacHigherAnswer;
  centennialCampus?: CentennialCampusAnswer;
} {
  const hasAllMainAnswers = STUDY_ABROAD_REQUIRED_QUESTION_IDS.every((id) =>
    Boolean(answers[id]),
  );
  if (!hasAllMainAnswers) return false;
  if (answers.school === "school_georgebrown") return Boolean(answers.georgeBrownCampus);
  if (answers.school === "school_ilac_higher") return Boolean(answers.ilacHigherProgram);
  if (answers.school === "school_centennial") return Boolean(answers.centennialCampus);
  return true;
}

function createStudyAbroadStationScores() {
  return Object.fromEntries(
    UNIVERSITY_STATION_POOL.map((stationId) => [stationId, 0]),
  ) as Record<StationId, number>;
}

function getStudyAbroadCampusStations(answers: StudyAbroadAnswerMap): StationId[] {
  switch (answers.school) {
    case "school_uoft_stgeorge":
      return ["stGeorge", "queensPark"];
    case "school_utsc":
      return ["kennedy"];
    case "school_tmu":
      return ["dundas", "college"];
    case "school_ocad":
      return ["stPatrick", "osgoode"];
    case "school_york_keele":
      return ["yorkUniversity", "finchWest"];
    case "school_georgebrown":
      if (answers.georgeBrownCampus === "gb_waterfront") return ["union", "king"];
      if (answers.georgeBrownCampus === "gb_casaloma") return ["dupont", "stGeorge"];
      if (answers.georgeBrownCampus === "gb_stjames") return ["king", "dundas"];
      return ["king", "union", "dupont"];
    case "school_seneca_newnham":
      return ["donMills"];
    case "school_centennial":
      return ["kennedy"];
    case "school_ilac_higher":
      if (answers.ilacHigherProgram === "ilac_fanshawe") return ["college", "dundas"];
      if (answers.ilacHigherProgram === "ilac_georgian") return ["bloorYonge", "sherbourne"];
      return ["bloorYonge", "college"];
    case "school_other_toronto":
      return ["bloorYonge", "eglinton"];
    case "school_unknown":
    default:
      return ["bloorYonge", "eglinton"];
  }
}

function getStudyAbroadNearbyStations(answers: StudyAbroadAnswerMap): StationId[] {
  const primary = getStudyAbroadCampusStations(answers)[0];
  if (primary === "stGeorge") return ["queensPark", "college", "christie"];
  if (primary === "dundas") return ["college", "bloorYonge", "christie"];
  if (primary === "stPatrick" || primary === "osgoode") return ["dundas", "stGeorge", "christie"];
  if (primary === "king") return ["dundas", "college", "broadview"];
  if (primary === "union") return ["king", "dundas", "broadview"];
  if (primary === "dupont") return ["stGeorge", "christie", "dufferin"];
  if (primary === "yorkUniversity") return ["finchWest", "pioneerVillage", "finch"];
  if (primary === "donMills") return ["finch", "northYorkCentre", "eglinton"];
  if (primary === "kennedy") return ["victoriaPark", "broadview", "bloorYonge"];
  if (primary === "bloorYonge") return ["college", "sherbourne", "dundas", "christie"];
  return ["christie", "bloorYonge", "northYorkCentre"];
}

const STUDY_ABROAD_CENTRAL_COMPARISON_STATIONS: StationId[] = [
  "christie",
  "dufferin",
  "bloorYonge",
  "college",
  "dundas",
  "stGeorge",
  "queensPark",
  "stPatrick",
  "osgoode",
  "king",
  "union",
  "broadview",
  "eglinton",
  "dupont",
];

const STUDY_ABROAD_NORTHWEST_COMPARISON_STATIONS: StationId[] = [
  "yorkUniversity",
  "pioneerVillage",
  "finchWest",
  "finch",
  "northYorkCentre",
  "eglinton",
];

const STUDY_ABROAD_NORTHEAST_COMPARISON_STATIONS: StationId[] = [
  "kennedy",
  "victoriaPark",
  "broadview",
  "donMills",
  "eglinton",
  "bloorYonge",
];

function uniqueStudyAbroadStationIds(stations: StationId[]) {
  return [...new Set(stations)];
}

function getStudyAbroadAllowedComparisonStations(answers: StudyAbroadAnswerMap): StationId[] | null {
  switch (answers.school) {
    case "school_uoft_stgeorge":
    case "school_tmu":
    case "school_ocad":
    case "school_georgebrown":
    case "school_ilac_higher":
      return STUDY_ABROAD_CENTRAL_COMPARISON_STATIONS;
    case "school_york_keele":
      return STUDY_ABROAD_NORTHWEST_COMPARISON_STATIONS;
    case "school_seneca_newnham":
      return [...STUDY_ABROAD_NORTHEAST_COMPARISON_STATIONS, "northYorkCentre"];
    case "school_utsc":
    case "school_centennial":
      return STUDY_ABROAD_NORTHEAST_COMPARISON_STATIONS;
    default:
      return null;
  }
}

function filterStudyAbroadComparisonStations(
  answers: StudyAbroadAnswerMap,
  stations: StationId[],
  campusStations: StationId[],
) {
  const allowedStations = getStudyAbroadAllowedComparisonStations(answers);
  return uniqueStudyAbroadStationIds(stations).filter((station) => {
    if (campusStations.includes(station)) return false;
    return allowedStations ? allowedStations.includes(station) : true;
  });
}

function applyStudyAbroadSchoolScore(
  scores: Record<StationId, number>,
  answers: StudyAbroadAnswerMap,
) {
  switch (answers.school) {
    case "school_uoft_stgeorge":
      addStationScore(scores, "stGeorge", 5);
      addStationScore(scores, "queensPark", 4);
      addStationScores(scores, ["college", "bloorYonge"], 2);
      addStationScore(scores, "christie", 1);
      return;
    case "school_utsc":
      addStationScore(scores, "kennedy", 4);
      addStationScore(scores, "victoriaPark", 3);
      addStationScore(scores, "broadview", 2);
      addStationScore(scores, "bloorYonge", 1);
      return;
    case "school_tmu":
      addStationScore(scores, "dundas", 5);
      addStationScore(scores, "college", 3);
      addStationScore(scores, "bloorYonge", 2);
      addStationScore(scores, "stPatrick", 1);
      return;
    case "school_ocad":
      addStationScore(scores, "stPatrick", 4);
      addStationScore(scores, "osgoode", 4);
      addStationScores(scores, ["dundas", "stGeorge"], 2);
      addStationScore(scores, "dufferin", 1);
      return;
    case "school_york_keele":
      addStationScore(scores, "yorkUniversity", 5);
      addStationScore(scores, "finchWest", 4);
      addStationScore(scores, "pioneerVillage", 3);
      addStationScores(scores, ["finch", "northYorkCentre"], 1);
      return;
    case "school_georgebrown":
      if (answers.georgeBrownCampus === "gb_casaloma") {
        addStationScore(scores, "dupont", 5);
        addStationScore(scores, "stGeorge", 3);
        addStationScore(scores, "christie", 2);
        addStationScore(scores, "college", 1);
        return;
      }
      if (answers.georgeBrownCampus === "gb_waterfront") {
        addStationScore(scores, "union", 5);
        addStationScore(scores, "king", 3);
        addStationScore(scores, "broadview", 2);
        addStationScore(scores, "dundas", 1);
        return;
      }
      if (answers.georgeBrownCampus === "gb_stjames") {
        addStationScore(scores, "king", 5);
        addStationScore(scores, "dundas", 3);
        addStationScore(scores, "union", 2);
        addStationScores(scores, ["college", "broadview"], 1);
        return;
      }
      addStationScores(scores, ["king", "union", "dundas", "college"], 2);
      addStationScore(scores, "broadview", 1);
      return;
    case "school_seneca_newnham":
      addStationScore(scores, "donMills", 4);
      addStationScore(scores, "finch", 3);
      addStationScore(scores, "northYorkCentre", 2);
      addStationScore(scores, "eglinton", 1);
      return;
    case "school_centennial":
      addStationScore(scores, "kennedy", 5);
      addStationScore(scores, "victoriaPark", 3);
      addStationScore(scores, "broadview", 2);
      return;
    case "school_ilac_higher":
      if (answers.ilacHigherProgram === "ilac_georgian") {
        addStationScore(scores, "bloorYonge", 4);
        addStationScore(scores, "sherbourne", 3);
        addStationScore(scores, "college", 2);
        return;
      }
      if (answers.ilacHigherProgram === "ilac_fanshawe") {
        addStationScore(scores, "college", 4);
        addStationScore(scores, "dundas", 3);
        addStationScore(scores, "bloorYonge", 2);
        return;
      }
      addStationScore(scores, "bloorYonge", 4);
      addStationScore(scores, "college", 3);
      addStationScore(scores, "sherbourne", 2);
      addStationScore(scores, "dundas", 1);
      return;
    case "school_other_toronto":
      addStationScores(scores, ["bloorYonge", "eglinton"], 2);
      addStationScores(scores, ["christie", "northYorkCentre"], 1);
      return;
    case "school_unknown":
    default:
      addStationScores(scores, ["bloorYonge", "eglinton"], 2);
      addStationScores(scores, ["christie", "northYorkCentre"], 1);
      return;
  }
}

function applyStudyAbroadAnswerScore(
  scores: Record<StationId, number>,
  answers: Record<StudyAbroadQuestionId, StudyAbroadAnswerValue> & {
    georgeBrownCampus?: GeorgeBrownCampusAnswer;
    ilacHigherProgram?: IlacHigherAnswer;
    centennialCampus?: CentennialCampusAnswer;
  },
) {
  const campusStations = getStudyAbroadCampusStations(answers);
  const nearbyStations = getStudyAbroadNearbyStations(answers);

  applyStudyAbroadSchoolScore(scores, answers);

  switch (answers.campusCommute) {
    case "campus_very_close":
      addStationScores(scores, campusStations, 5);
      break;
    case "campus_short":
      addStationScores(scores, campusStations, 3);
      addStationScores(scores, nearbyStations, 2);
      break;
    case "campus_medium":
      addStationScores(scores, ["christie", "eglinton", "northYorkCentre", "dufferin", "broadview"], 2);
      break;
    case "campus_budget_first":
      addStationScores(scores, ["dufferin", "broadview", "victoriaPark", "finch", "northYorkCentre"], 3);
      break;
    case "campus_not_sure":
      addStationScores(scores, ["bloorYonge", "eglinton", "christie", "northYorkCentre"], 2);
      break;
  }

  switch (answers.lifeBalance) {
    case "life_near_campus":
      addStationScores(scores, campusStations, 4);
      break;
    case "life_balanced":
      addStationScores(scores, ["bloorYonge", "eglinton", "christie", "northYorkCentre"], 2);
      break;
    case "life_korean_access":
      addStationScores(scores, ["christie", "northYorkCentre", "finch"], 4);
      break;
    case "life_city_access":
      addStationScores(scores, ["bloorYonge", "dundas", "college", "union", "stGeorge"], 3);
      break;
    case "life_study_quiet":
      addStationScores(scores, ["eglinton", "northYorkCentre", "finch", "christie"], 2);
      break;
  }

  switch (answers.studyBudget) {
    case "budget_400_600":
      addStationScore(scores, "victoriaPark", 4);
      addStationScores(scores, ["dufferin", "broadview", "finch"], 3);
      break;
    case "budget_600_900":
      addStationScores(scores, ["dufferin", "broadview", "victoriaPark", "finch"], 3);
      addStationScores(scores, ["christie", "northYorkCentre"], 2);
      break;
    case "budget_900_1200":
      addStationScores(scores, ["christie", "eglinton", "northYorkCentre", "broadview", "dufferin"], 2);
      break;
    case "budget_1200_1800":
      addStationScores(scores, campusStations, 2);
      addStationScores(scores, ["bloorYonge", "college", "stGeorge", "eglinton"], 2);
      break;
    case "budget_1800_plus":
      addStationScores(scores, campusStations, 3);
      addStationScores(scores, ["bloorYonge", "college", "dundas", "stGeorge", "union"], 2);
      break;
  }

  switch (answers.housingType) {
    case "housing_room_share":
      addStationScores(scores, ["christie", "finch", "northYorkCentre", "dufferin", "broadview", "victoriaPark"], 2);
      break;
    case "housing_private_space":
      addStationScores(scores, ["eglinton", "northYorkCentre", "bloorYonge"], 2);
      if (answers.studyBudget === "budget_1200_1800" || answers.studyBudget === "budget_1800_plus") {
        addStationScores(scores, ["bloorYonge", "college", "eglinton", "northYorkCentre"], 1);
      }
      break;
    case "housing_start_simple":
      addStationScores(scores, ["christie", "northYorkCentre", "finch", "eglinton"], 2);
      break;
    case "housing_not_sure":
      addStationScores(scores, ["eglinton", "christie", "northYorkCentre"], 1);
      break;
  }

  switch (answers.studyEnvironment) {
    case "study_quiet":
      addStationScores(scores, ["eglinton", "northYorkCentre", "finch", "christie"], 3);
      break;
    case "study_campus_facility":
      addStationScores(scores, campusStations, 4);
      break;
    case "study_local_convenience":
      addStationScores(scores, ["eglinton", "bloorYonge", "northYorkCentre", "christie"], 2);
      break;
    case "study_shared_ok":
      addStationScores(scores, ["dufferin", "broadview", "christie", "finch"], 2);
      break;
    case "study_not_sure":
      addStationScores(scores, ["eglinton", "christie", "northYorkCentre"], 1);
      break;
  }

  switch (answers.koreanCommunity) {
    case "korean_very_important":
      addStationScores(scores, ["christie", "northYorkCentre", "finch"], 4);
      break;
    case "korean_somewhat":
      addStationScore(scores, "christie", 2);
      addStationScores(scores, ["bloorYonge", "eglinton", "northYorkCentre"], 1);
      break;
    case "korean_beginner_need":
      addStationScores(scores, ["christie", "northYorkCentre", "eglinton"], 2);
      break;
    case "korean_not_important":
      addStationScores(scores, campusStations, 2);
      addStationScores(scores, ["bloorYonge", "dundas", "college", "union", "stGeorge"], 1);
      break;
  }

  switch (answers.cityActivity) {
    case "city_very_often":
      addStationScores(scores, ["bloorYonge", "college", "dundas", "stGeorge", "union"], 4);
      break;
    case "city_often":
      addStationScores(scores, ["bloorYonge", "college", "eglinton", "christie"], 2);
      break;
    case "city_weekend":
      addStationScores(scores, ["eglinton", "northYorkCentre", "christie", "broadview"], 2);
      break;
    case "city_low":
      addStationScores(scores, ["eglinton", "northYorkCentre", "finch"], 2);
      break;
  }

  switch (answers.outsideMobility) {
    case "mobility_yes":
      addStationScores(scores, ["bloorYonge", "college", "dundas", "christie", "northYorkCentre", "eglinton"], 2);
      break;
    case "mobility_maybe":
      addStationScores(scores, ["bloorYonge", "christie", "eglinton", "northYorkCentre"], 1);
      break;
    case "mobility_low":
      addStationScores(scores, campusStations, 2);
      addStationScores(scores, ["eglinton", "northYorkCentre", "christie"], 1);
      break;
    case "mobility_no":
      break;
  }

  switch (answers.finalPriority) {
    case "final_campus_commute":
      addStationScores(scores, campusStations, 5);
      break;
    case "final_budget":
      addStationScores(scores, ["dufferin", "broadview", "victoriaPark", "finch"], 4);
      addStationScore(scores, "northYorkCentre", 2);
      break;
    case "final_study_stability":
      addStationScores(scores, ["eglinton", "northYorkCentre", "christie", "finch"], 4);
      break;
    case "final_korean_access":
      addStationScores(scores, ["christie", "northYorkCentre", "finch"], 4);
      break;
    case "final_city_activity":
      addStationScores(scores, ["bloorYonge", "college", "dundas", "union", "stGeorge"], 4);
      break;
    case "final_beginner_stability":
      addStationScores(scores, ["eglinton", "northYorkCentre", "christie", "bloorYonge"], 3);
      break;
  }
}

function selectStudyAbroadResultId(
  answers: Record<StudyAbroadQuestionId, StudyAbroadAnswerValue> & {
    georgeBrownCampus?: GeorgeBrownCampusAnswer;
    ilacHigherProgram?: IlacHigherAnswer;
    centennialCampus?: CentennialCampusAnswer;
  },
  rankedStations: StationId[],
) {
  if (answers.school === "school_uoft_stgeorge") return "studyResult01";
  if (answers.school === "school_tmu") return "studyResult02";
  if (answers.school === "school_ocad") return "studyResult03";
  if (answers.school === "school_georgebrown") {
    return answers.georgeBrownCampus === "gb_casaloma" ? "studyResult05" : "studyResult04";
  }
  if (answers.school === "school_york_keele") return "studyResult06";
  if (answers.school === "school_seneca_newnham") return "studyResult07";
  if (answers.school === "school_utsc" || answers.school === "school_centennial") return "studyResult08";
  if (answers.school === "school_ilac_higher") return "studyResult09";
  if (
    answers.finalPriority === "final_korean_access" ||
    answers.lifeBalance === "life_korean_access" ||
    answers.koreanCommunity === "korean_very_important"
  ) {
    return "studyResult10";
  }
  if (
    answers.finalPriority === "final_budget" ||
    answers.studyBudget === "budget_400_600" ||
    answers.campusCommute === "campus_budget_first"
  ) {
    return "studyResult11";
  }

  const topStation = rankedStations[0];
  if (topStation === "christie" || topStation === "northYorkCentre" || topStation === "finch") {
    return "studyResult10";
  }
  if (topStation === "dufferin" || topStation === "broadview" || topStation === "victoriaPark") {
    return "studyResult11";
  }
  return "studyResult12";
}

function getStudyAbroadCautionLines(answers: StudyAbroadAnswerMap) {
  const lines: string[] = [];
  if (answers.school === "school_ilac_higher") {
    lines.push(
      "ILAC 계열 과정은 프로그램, 캠퍼스, 비자/PGWP 조건이 다를 수 있습니다. 정확한 과정명과 캠퍼스 주소는 학교 공식 안내에서 다시 확인해 주세요.",
    );
  }
  if (
    answers.school === "school_utsc" ||
    answers.school === "school_seneca_newnham" ||
    answers.school === "school_centennial"
  ) {
    lines.push(
      "이 캠퍼스는 지하철만으로 끝나는 동선이 아닐 수 있습니다. 실제 통학 경로에서 버스 연계가 필요한지 반드시 확인해 주세요.",
    );
  }
  if (answers.school === "school_georgebrown") {
    lines.push(
      "George Brown은 캠퍼스별 주소와 동선이 다르므로 실제 캠퍼스 배정을 먼저 확인해 주세요.",
    );
  }
  return lines;
}

export function calculateStudyAbroadRecommendation(
  answers: Record<StudyAbroadQuestionId, StudyAbroadAnswerValue> & {
    georgeBrownCampus?: GeorgeBrownCampusAnswer;
    ilacHigherProgram?: IlacHigherAnswer;
    centennialCampus?: CentennialCampusAnswer;
  },
): StudyAbroadCalculationResult {
  const stationScores = createStudyAbroadStationScores();
  applyStudyAbroadAnswerScore(stationScores, answers);

  const rankedStations = [...UNIVERSITY_STATION_POOL].sort((a, b) => {
    const scoreDiff = stationScores[b] - stationScores[a];
    if (scoreDiff !== 0) return scoreDiff;
    return UNIVERSITY_STATION_POOL.indexOf(a) - UNIVERSITY_STATION_POOL.indexOf(b);
  });
  const resultId = selectStudyAbroadResultId(answers, rankedStations);
  const result = STUDY_ABROAD_RESULT_TEMPLATES[resultId];
  const campusStations = getStudyAbroadCampusStations(answers);
  const positiveStations = rankedStations.filter((station) => stationScores[station] > 0);
  const sourceStations = positiveStations.length > 0 ? positiveStations : result.recommendedStations;
  const recommendedCandidates = [
    ...sourceStations,
    ...result.comparisonStations,
    ...getStudyAbroadNearbyStations(answers),
    ...result.recommendedStations,
    ...(getStudyAbroadAllowedComparisonStations(answers) ?? []),
  ];
  const recommendedStations = filterStudyAbroadComparisonStations(
    answers,
    recommendedCandidates,
    campusStations,
  ).slice(0, 2);
  const comparisonStations = filterStudyAbroadComparisonStations(
    answers,
    [
      ...sourceStations.filter((station) => !recommendedStations.includes(station)),
      ...result.comparisonStations,
      ...getStudyAbroadNearbyStations(answers),
      ...(getStudyAbroadAllowedComparisonStations(answers) ?? []),
    ],
    campusStations,
  )
    .filter((station) => !recommendedStations.includes(station))
    .slice(0, 3);
  const fallbackRecommendedStations = filterStudyAbroadComparisonStations(
    answers,
    [
      ...result.comparisonStations,
      ...getStudyAbroadNearbyStations(answers),
      ...(getStudyAbroadAllowedComparisonStations(answers) ?? []),
    ],
    campusStations,
  ).slice(0, 2);
  const finalRecommendedStations =
    recommendedStations.length > 0 ? recommendedStations : fallbackRecommendedStations;
  const fallbackComparisonStations = filterStudyAbroadComparisonStations(
    answers,
    [
      ...result.comparisonStations,
      ...getStudyAbroadNearbyStations(answers),
      ...(getStudyAbroadAllowedComparisonStations(answers) ?? []),
    ],
    campusStations,
  )
    .filter((station) => !finalRecommendedStations.includes(station))
    .slice(0, 3);
  const budgetKey = answers.studyBudget as keyof typeof STUDY_ABROAD_BUDGET_COMMENTS;
  const resultWithReason = {
    ...result,
    reason: buildStudyAbroadReason(
      answers,
      campusStations,
      finalRecommendedStations,
      result.reason,
    ),
    reasonItems: buildStudyAbroadReasonItems(answers, campusStations, finalRecommendedStations),
    nearbyItems: buildNearbyReasonItems(finalRecommendedStations),
    userFitSummary: buildStudyAbroadUserFitSummary(answers),
  };

  return {
    resultId,
    budgetKey,
    stationScores,
    campusStations,
    recommendedStations: finalRecommendedStations,
    comparisonStations: comparisonStations.length > 0 ? comparisonStations : fallbackComparisonStations,
    result: resultWithReason,
    budgetComment: STUDY_ABROAD_BUDGET_COMMENTS[budgetKey],
    cautionLines: getStudyAbroadCautionLines(answers),
  };
}

function getLanguageStudyArrivalStations(answers: LanguageStudyAnswerMap): StationId[] {
  if (answers.school === "school_ilac") {
    switch (answers.ilacCampus) {
      case "ilac_growth":
        return ["bloorYonge"];
      case "ilac_pathway":
        return ["college", "stGeorge"];
      case "ilac_dream":
        return ["sherbourne", "bloorYonge"];
      case "ilac_heart":
        return ["college", "dundas"];
      case "ilac_unknown_campus":
      default:
        return ["bloorYonge", "college", "stGeorge", "sherbourne"];
    }
  }

  switch (answers.school) {
    case "school_ilsc":
      return ["stPatrick"];
    case "school_ec":
    case "school_hansa":
      return ["eglinton"];
    case "school_kaplan":
      return ["union"];
    case "school_other":
      return ["bloorYonge", "college", "dundas"];
    case "school_unknown":
    default:
      return ["bloorYonge", "eglinton"];
  }
}

function getLanguageStudyDestinationStations(answers: LanguageStudyAnswerMap): StationId[] {
  if (answers.school === "school_ilac") {
    switch (answers.ilacCampus) {
      case "ilac_growth":
        return ["bloorYonge"];
      case "ilac_pathway":
      case "ilac_heart":
        return ["college"];
      case "ilac_dream":
        return ["sherbourne"];
      case "ilac_unknown_campus":
      default:
        return ["bloorYonge", "college"];
    }
  }

  switch (answers.school) {
    case "school_ilsc":
      return ["stPatrick"];
    case "school_ec":
    case "school_hansa":
      return ["eglinton"];
    case "school_kaplan":
      return ["union"];
    default:
      return [];
  }
}

function getLanguageStudyNearbyStations(answers: LanguageStudyAnswerMap): StationId[] {
  const arrival = getLanguageStudyArrivalStations(answers);
  const primary = arrival[0];

  if (primary === "bloorYonge") return ["college", "stGeorge", "sherbourne"];
  if (primary === "college") return ["stGeorge", "dundas", "christie"];
  if (primary === "sherbourne") return ["bloorYonge", "broadview", "christie"];
  if (primary === "stPatrick") return ["dundas", "college", "stGeorge"];
  if (primary === "eglinton") return ["bloorYonge", "northYorkCentre", "christie"];
  if (primary === "union") return ["bloorYonge", "college", "dundas"];

  return ["bloorYonge", "college", "stGeorge", "eglinton"];
}

function applyLanguageStudySchoolScore(
  scores: Record<StationId, number>,
  answers: LanguageStudyAnswerMap,
) {
  if (answers.school === "school_ilac") {
    switch (answers.ilacCampus) {
      case "ilac_growth":
        addStationScore(scores, "bloorYonge", 5);
        addStationScores(scores, ["college", "stGeorge"], 1);
        return;
      case "ilac_pathway":
        addStationScore(scores, "college", 5);
        addStationScore(scores, "stGeorge", 3);
        addStationScore(scores, "dundas", 2);
        addStationScore(scores, "christie", 1);
        return;
      case "ilac_dream":
        addStationScore(scores, "sherbourne", 5);
        addStationScore(scores, "bloorYonge", 2);
        addStationScore(scores, "broadview", 1);
        return;
      case "ilac_heart":
        addStationScore(scores, "college", 4);
        addStationScore(scores, "dundas", 2);
        addStationScore(scores, "bloorYonge", 1);
        addStationScore(scores, "stPatrick", 1);
        return;
      case "ilac_unknown_campus":
      default:
        addStationScore(scores, "bloorYonge", 3);
        addStationScore(scores, "college", 2);
        addStationScore(scores, "stGeorge", 1);
        addStationScore(scores, "sherbourne", 1);
        return;
    }
  }

  switch (answers.school) {
    case "school_ilsc":
      addStationScore(scores, "stPatrick", 5);
      addStationScore(scores, "dundas", 2);
      addStationScores(scores, ["college", "stGeorge"], 1);
      return;
    case "school_ec":
      addStationScore(scores, "eglinton", 5);
      addStationScores(scores, ["bloorYonge", "northYorkCentre"], 1);
      return;
    case "school_hansa":
      addStationScore(scores, "eglinton", 5);
      addStationScore(scores, "northYorkCentre", 2);
      addStationScore(scores, "bloorYonge", 1);
      return;
    case "school_kaplan":
      addStationScore(scores, "union", 5);
      addStationScores(scores, ["bloorYonge", "dundas", "college"], 1);
      return;
    case "school_other":
      addStationScores(scores, ["bloorYonge", "college", "dundas"], 2);
      addStationScores(scores, ["stGeorge", "eglinton"], 1);
      return;
    case "school_unknown":
    default:
      addStationScores(scores, ["bloorYonge", "eglinton"], 2);
      addStationScores(scores, ["christie", "northYorkCentre"], 1);
      return;
  }
}

function applyLanguageStudyAnswerScore(
  scores: Record<StationId, number>,
  answers: Record<LanguageStudyQuestionId, LanguageStudyAnswerValue> & {
    ilacCampus?: IlacCampusAnswer;
  },
) {
  const arrivalStations = getLanguageStudyArrivalStations(answers);
  const nearbyStations = getLanguageStudyNearbyStations(answers);

  applyLanguageStudySchoolScore(scores, answers);

  switch (answers.commuteRange) {
    case "commute_very_close":
      addStationScores(scores, arrivalStations, 5);
      addStationScores(scores, nearbyStations, 2);
      break;
    case "commute_short":
      addStationScores(scores, arrivalStations, 3);
      addStationScores(scores, ["bloorYonge", "eglinton", "college", "stGeorge"], 2);
      addStationScore(scores, "christie", 1);
      break;
    case "commute_medium":
      addStationScores(
        scores,
        ["christie", "eglinton", "northYorkCentre", "dufferin", "broadview"],
        2,
      );
      addStationScores(scores, arrivalStations, 1);
      break;
    case "commute_budget_first":
      addStationScores(
        scores,
        ["dufferin", "broadview", "victoriaPark", "finch", "northYorkCentre"],
        3,
      );
      break;
    case "commute_not_sure":
      addStationScores(scores, ["bloorYonge", "eglinton", "christie", "northYorkCentre"], 2);
      break;
  }

  switch (answers.transport) {
    case "prefer_subway":
      addStationScores(
        scores,
        ["bloorYonge", "college", "dundas", "stGeorge", "eglinton", "stPatrick", "union"],
        2,
      );
      break;
    case "bus_ok":
      addStationScores(scores, ["broadview", "victoriaPark", "finch", "northYorkCentre", "dufferin"], 1);
      break;
    case "avoid_long_walk":
      addStationScores(scores, arrivalStations, 2);
      addStationScores(scores, ["bloorYonge", "eglinton", "college", "northYorkCentre"], 1);
      break;
    case "transport_budget_first":
      addStationScores(scores, ["dufferin", "broadview", "victoriaPark", "finch"], 2);
      break;
    case "transport_not_sure":
      addStationScores(scores, ["bloorYonge", "eglinton", "christie"], 1);
      break;
  }

  switch (answers.languageBudget) {
    case "budget_400_600":
      addStationScore(scores, "victoriaPark", 4);
      addStationScores(scores, ["dufferin", "broadview", "finch"], 3);
      addStationScores(scores, ["northYorkCentre", "christie"], 1);
      break;
    case "budget_600_900":
      addStationScores(scores, ["dufferin", "broadview", "victoriaPark", "finch"], 2);
      addStationScores(scores, ["christie", "northYorkCentre"], 2);
      break;
    case "budget_900_1200":
      addStationScores(scores, ["christie", "eglinton", "northYorkCentre", "broadview", "dufferin"], 2);
      addStationScores(scores, ["bloorYonge", "college"], 1);
      break;
    case "budget_1200_1800":
      addStationScores(scores, arrivalStations, 2);
      addStationScores(scores, ["bloorYonge", "college", "stGeorge", "eglinton", "northYorkCentre"], 2);
      break;
    case "budget_1800_plus":
      addStationScores(scores, arrivalStations, 3);
      addStationScores(scores, ["bloorYonge", "college", "dundas", "stGeorge", "eglinton", "union"], 2);
      break;
  }

  switch (answers.housingType) {
    case "housing_room_share":
      addStationScores(
        scores,
        ["christie", "finch", "northYorkCentre", "dufferin", "broadview", "victoriaPark"],
        2,
      );
      break;
    case "housing_private_space":
      addStationScores(scores, ["eglinton", "northYorkCentre", "bloorYonge"], 2);
      if (answers.languageBudget === "budget_1200_1800" || answers.languageBudget === "budget_1800_plus") {
        addStationScores(scores, ["bloorYonge", "college", "eglinton", "northYorkCentre"], 1);
      }
      break;
    case "housing_start_simple":
      addStationScores(scores, ["christie", "northYorkCentre", "finch", "eglinton"], 2);
      break;
    case "housing_not_sure":
      addStationScores(scores, ["eglinton", "christie", "northYorkCentre"], 1);
      break;
  }

  switch (answers.afterSchool) {
    case "after_school_near_school":
      addStationScores(scores, arrivalStations, 3);
      addStationScores(scores, ["bloorYonge", "college", "dundas", "eglinton"], 2);
      break;
    case "after_school_korean_food":
      addStationScores(scores, ["christie", "northYorkCentre", "finch"], 3);
      addStationScores(scores, ["eglinton", "bloorYonge"], 1);
      break;
    case "after_school_city_activity":
      addStationScores(scores, ["bloorYonge", "dundas", "college", "stGeorge", "union"], 3);
      addStationScores(scores, ["eglinton", "christie"], 1);
      break;
    case "after_school_home_area":
      addStationScores(scores, ["eglinton", "northYorkCentre", "finch", "christie"], 2);
      break;
    case "after_school_not_sure":
      addStationScores(scores, ["bloorYonge", "eglinton", "christie", "northYorkCentre"], 1);
      break;
  }

  switch (answers.koreanCommunity) {
    case "korean_very_important":
      addStationScores(scores, ["christie", "northYorkCentre", "finch"], 4);
      break;
    case "korean_somewhat":
      addStationScore(scores, "christie", 2);
      addStationScores(scores, ["bloorYonge", "eglinton", "northYorkCentre"], 1);
      break;
    case "korean_beginner_need":
      addStationScores(scores, ["christie", "northYorkCentre", "eglinton"], 2);
      break;
    case "korean_not_important":
      addStationScores(scores, ["college", "dundas", "stGeorge", "union", "bloorYonge"], 2);
      break;
  }

  switch (answers.cityActivity) {
    case "city_activity_very_often":
      addStationScores(scores, ["bloorYonge", "college", "dundas", "stGeorge", "union"], 4);
      break;
    case "city_activity_often":
      addStationScores(scores, ["bloorYonge", "college", "eglinton", "christie"], 2);
      break;
    case "city_activity_weekend":
      addStationScores(scores, ["eglinton", "northYorkCentre", "christie", "broadview"], 2);
      break;
    case "city_activity_low":
      addStationScores(scores, ["eglinton", "northYorkCentre", "finch"], 2);
      break;
  }

  switch (answers.partTime) {
    case "parttime_yes":
      addStationScores(scores, ["bloorYonge", "college", "dundas", "christie", "northYorkCentre", "eglinton"], 2);
      break;
    case "parttime_maybe":
      addStationScores(scores, ["bloorYonge", "christie", "eglinton", "northYorkCentre"], 1);
      break;
    case "parttime_low":
      addStationScores(scores, arrivalStations, 1);
      addStationScores(scores, ["eglinton", "northYorkCentre", "christie"], 1);
      break;
    case "parttime_no":
      break;
  }

  switch (answers.finalPriority) {
    case "final_school_commute":
      addStationScores(scores, arrivalStations, 5);
      addStationScores(scores, nearbyStations, 2);
      break;
    case "final_budget":
      addStationScores(scores, ["dufferin", "broadview", "victoriaPark", "finch"], 4);
      addStationScore(scores, "northYorkCentre", 2);
      break;
    case "final_social_activity":
      addStationScores(scores, ["bloorYonge", "college", "dundas", "stGeorge", "union"], 4);
      break;
    case "final_korean_community":
      addStationScores(scores, ["christie", "northYorkCentre", "finch"], 4);
      break;
    case "final_beginner_stability":
      addStationScores(scores, ["eglinton", "northYorkCentre", "christie", "finch"], 4);
      break;
    case "final_subway_convenience":
      addStationScores(scores, ["bloorYonge", "eglinton", "college", "dundas", "stGeorge"], 3);
      break;
  }
}

function selectLanguageStudyResultId(
  answers: Record<LanguageStudyQuestionId, LanguageStudyAnswerValue> & {
    ilacCampus?: IlacCampusAnswer;
  },
  rankedStations: StationId[],
) {
  if (answers.school === "school_ilac") {
    if (answers.ilacCampus === "ilac_pathway" || answers.ilacCampus === "ilac_heart") {
      return "languageResult02";
    }
    if (answers.ilacCampus === "ilac_dream") return "languageResult03";
    return "languageResult01";
  }
  if (answers.school === "school_ilsc") return "languageResult04";
  if (answers.school === "school_ec" || answers.school === "school_hansa") return "languageResult05";
  if (answers.school === "school_kaplan") return "languageResult06";

  if (
    answers.finalPriority === "final_social_activity" ||
    answers.cityActivity === "city_activity_very_often"
  ) {
    return "languageResult07";
  }

  if (
    answers.finalPriority === "final_korean_community" ||
    answers.koreanCommunity === "korean_very_important" ||
    answers.afterSchool === "after_school_korean_food"
  ) {
    return rankedStations[0] === "northYorkCentre" || rankedStations[0] === "finch"
      ? "languageResult10"
      : "languageResult09";
  }

  if (
    answers.finalPriority === "final_budget" ||
    answers.languageBudget === "budget_400_600" ||
    answers.commuteRange === "commute_budget_first"
  ) {
    if (rankedStations[0] === "broadview" || rankedStations[0] === "victoriaPark") {
      return "languageResult12";
    }
    return "languageResult11";
  }

  const topStation = rankedStations[0];
  if (topStation === "stGeorge") return "languageResult08";
  if (topStation === "christie") return "languageResult09";
  if (topStation === "northYorkCentre" || topStation === "finch") return "languageResult10";
  if (topStation === "dufferin") return "languageResult11";
  if (topStation === "broadview" || topStation === "victoriaPark") return "languageResult12";
  if (topStation === "college" || topStation === "dundas") return "languageResult07";
  if (topStation === "union") return "languageResult06";
  if (topStation === "stPatrick") return "languageResult04";
  if (topStation === "sherbourne") return "languageResult03";
  if (topStation === "eglinton") return "languageResult05";
  return "languageResult01";
}

export function calculateLanguageStudyRecommendation(
  answers: Record<LanguageStudyQuestionId, LanguageStudyAnswerValue> & {
    ilacCampus?: IlacCampusAnswer;
  },
): LanguageStudyCalculationResult {
  const stationScores = createLanguageStudyStationScores();
  applyLanguageStudyAnswerScore(stationScores, answers);

  const rankedStations = [...LANGUAGE_STUDY_HOUSING_STATION_POOL].sort((a, b) => {
    const scoreDiff = stationScores[b] - stationScores[a];
    if (scoreDiff !== 0) return scoreDiff;
    return LANGUAGE_STUDY_HOUSING_STATION_POOL.indexOf(a) - LANGUAGE_STUDY_HOUSING_STATION_POOL.indexOf(b);
  });
  const resultId = selectLanguageStudyResultId(answers, rankedStations);
  const result = LANGUAGE_STUDY_RESULT_TEMPLATES[resultId];
  const destinationStations = getLanguageStudyDestinationStations(answers);
  const positiveStations = rankedStations.filter((station) => stationScores[station] > 0);
  const recommendedStations = (
    positiveStations.length > 0 ? positiveStations : result.recommendedStations
  )
    .filter((station) => !destinationStations.includes(station))
    .slice(0, 3);
  const comparisonStations = positiveStations
    .filter((station) => !destinationStations.includes(station))
    .filter((station) => !recommendedStations.includes(station))
    .slice(0, 3);
  const budgetKey = answers.languageBudget as keyof typeof LANGUAGE_STUDY_BUDGET_COMMENTS;
  const resultWithReason = {
    ...result,
    reason: buildLanguageStudyReason(
      answers,
      destinationStations,
      recommendedStations,
      result.reason,
    ),
    reasonItems: buildLanguageStudyReasonItems(answers, destinationStations, recommendedStations),
    nearbyItems: buildNearbyReasonItems(recommendedStations),
    userFitSummary: buildLanguageStudyUserFitSummary(answers),
  };

  return {
    resultId,
    budgetKey,
    stationScores,
    destinationStations,
    recommendedStations,
    comparisonStations: comparisonStations.length > 0 ? comparisonStations : result.comparisonStations,
    result: resultWithReason,
    budgetComment: LANGUAGE_STUDY_BUDGET_COMMENTS[budgetKey],
  };
}

export function isCompleteAnswerMap(answers: AnswerMap): answers is Record<QuestionId, AnswerValue> {
  return REQUIRED_QUESTION_IDS.every((id) => Boolean(answers[id]));
}

export function calculateStationRecommendation(answers: Record<QuestionId, AnswerValue>) {
  const scores: ScoreMap = {
    koreanCommunity: 0,
    commuteMobility: 0,
    downtownActivity: 0,
    budgetValue: 0,
  };

  Object.values(answers).forEach((answer) => {
    const rule = SCORE_RULES[answer];
    if (!rule) return;
    Object.entries(rule).forEach(([key, value]) => {
      scores[key as Orientation] += value ?? 0;
    });
  });

  const topScore = Math.max(...Object.values(scores));
  const tied = (Object.keys(scores) as Orientation[]).filter(
    (orientation) => scores[orientation] === topScore,
  );
  const topOrientation = resolveTopOrientation(tied, answers);
  const resultId = selectResultId(topOrientation, answers);
  const result = RECOMMENDATION_RESULTS[resultId];
  const resultWithReason = {
    ...result,
    reason: buildWorkingHolidayReason(answers, result),
    nearby: `${formatStationList(result.stations)}도 함께 비교해보세요. 실제 매물 수와 가격은 시점에 따라 달라질 수 있습니다.`,
    reasonItems: buildWorkingHolidayReasonItems(answers, result.stations),
    nearbyItems: [] as StationReasonItem[],
    userFitSummary: buildWorkingHolidayUserFitSummary(answers),
  };

  return {
    scores,
    topOrientation,
    resultId,
    budgetKey: answers.budget,
    result: resultWithReason,
    budgetComment: BUDGET_COMMENTS[answers.budget],
  };
}

function resolveTopOrientation(
  tied: Orientation[],
  answers: Record<QuestionId, AnswerValue>,
): Orientation {
  if (tied.length === 1) return tied[0];

  const priorityChoice = PRIORITY_TIE_BREAK[answers.priority];
  if (priorityChoice && tied.includes(priorityChoice)) return priorityChoice;

  const budgetChoice = BUDGET_TIE_BREAK[answers.budget];
  if (budgetChoice && tied.includes(budgetChoice)) return budgetChoice;

  if (tied.includes("commuteMobility")) return "commuteMobility";
  return tied[0] ?? "commuteMobility";
}

function selectResultId(topOrientation: Orientation, answers: Record<QuestionId, AnswerValue>) {
  const budget = answers.budget;
  const koreanLife = answers.koreanLife;
  const priority = answers.priority;
  const downtown = answers.downtown;

  if (topOrientation === "koreanCommunity") {
    if ((budget === "budget1" || budget === "budget2") && koreanLife === "koreanHigh") {
      return "result01";
    }
    if (downtown === "downtownDaily" || downtown === "downtownWeekly") return "result11";
    return "result02";
  }

  if (topOrientation === "commuteMobility") {
    if (budget === "budget4" || budget === "budget5") return "result03";
    if (budget === "budget1" || budget === "budget2") return "result04";
    return "result07";
  }

  if (topOrientation === "downtownActivity") {
    if (budget === "budget4" || budget === "budget5") return "result05";
    return "result06";
  }

  if (budget === "budget1") return "result09";
  if (koreanLife === "koreanHigh" || priority === "priorityCommunity") return "result08";
  if (priority === "priorityMobility" || downtown === "downtownWeekly") return "result12";
  return "result10";
}
