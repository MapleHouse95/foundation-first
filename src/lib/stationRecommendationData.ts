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

export const STATION_CANDIDATES = [
  "Finch",
  "North York Centre",
  "Christie",
  "Eglinton",
  "Bloor-Yonge",
  "St George",
  "Dundas",
  "College",
  "Dufferin",
  "Broadview",
  "Victoria Park",
  "Finch West",
];

export const STATION_DISPLAY_NAMES: Record<string, string> = {
  Finch: "Finch Station (핀치 역)",
  "North York Centre": "North York Centre Station (노스 요크 센터 역)",
  Christie: "Christie Station (크리스티 역)",
  Eglinton: "Eglinton Station (에글린턴 역)",
  "Bloor-Yonge": "Bloor-Yonge Station (블루어-영 역)",
  "St George": "St George Station (세인트 조지 역)",
  Dundas: "Dundas Station (던다스 역)",
  College: "College Station (칼리지 역)",
  Dufferin: "Dufferin Station (더퍼린 역)",
  Broadview: "Broadview Station (브로드뷰 역)",
  "Victoria Park": "Victoria Park Station (빅토리아 파크 역)",
  "Finch West": "Finch West Station (핀치 웨스트 역)",
};

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

export const BUDGET_COMMENTS: Record<string, BudgetComment> = {
  budget1: {
    label: "C$400~600 / 약 40~60만 원",
    comment:
      "이 구간은 초저예산에 가깝습니다. 선택지가 매우 적고, 룸쉐어·단기방·조건 타협이 필요할 수 있습니다. 너무 저렴한 매물은 실제 상태와 거래 조건을 반드시 확인해야 합니다.",
  },
  budget2: {
    label: "C$600~900 / 약 60~90만 원",
    comment:
      "절약형 룸렌트 중심으로 보는 구간입니다. 중심지 개인공간보다는 교통이 연결되는 역 주변의 룸렌트 후보를 먼저 보는 것이 현실적입니다.",
  },
  budget3: {
    label: "C$900~1,200 / 약 90~120만 원",
    comment:
      "현실적인 룸렌트 후보를 비교하기 좋은 구간입니다. 위치, 집 상태, 룸메이트 조건, 이동 시간을 함께 비교해야 합니다.",
  },
  budget4: {
    label: "C$1,200~1,800 / 약 120~180만 원",
    comment:
      "조건 좋은 룸렌트, 베이스먼트, 일부 개인공간까지 비교할 수 있는 구간입니다. 다만 중심지에 가까울수록 공간 대비 가격이 높아질 수 있습니다.",
  },
  budget5: {
    label: "C$1,800+ / 약 180만 원 이상",
    comment:
      "스튜디오, 콘도, 개인공간 후보까지 고려할 수 있는 구간입니다. 이동성과 공간, 월세 부담 중 무엇을 우선할지 정하는 것이 중요합니다.",
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
      "예산을 낮추면서도 이동 연결성을 완전히 포기하고 싶지 않을 때 비교해볼 수 있는 후보입니다.",
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
    reason: "다운타운 활동이 있지만 중심지 월세가 부담될 때 비교해볼 수 있는 후보입니다.",
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
    caution: "가격만 보고 결정하지 말고 출퇴근/통학 동선을 같이 확인해야 합니다.",
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
  "이 추천은 정답이 아니라 탐색 시작점을 잡기 위한 참고용입니다. 실제 통학/출근 시간, 매물 상태, 계약 조건, 송금 여부는 사용자가 직접 확인해야 합니다. 메이플하우스는 계약 당사자가 아니며, 법률 자문이나 부동산 중개를 제공하지 않습니다.";

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

export function formatStationDisplayName(station: string) {
  return STATION_DISPLAY_NAMES[station] ?? `${station} Station`;
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

  return {
    scores,
    topOrientation,
    result: RECOMMENDATION_RESULTS[resultId],
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
