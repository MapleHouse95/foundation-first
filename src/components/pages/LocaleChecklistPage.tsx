import { type ReactNode, type RefObject, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Compass,
  HelpCircle,
  Home,
  RotateCcw,
  WalletCards,
  X,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import {
  TRANSLATED_CHECKLIST_CONTENT,
  type ChecklistLocaleContent,
  type TranslatedChecklistLocale,
} from "@/lib/checklistLocaleContent";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  calculateLanguageStudyRecommendation,
  calculateStationRecommendation,
  calculateStudyAbroadRecommendation,
  formatStationDisplayName,
  GENERAL_CHECKLIST_QUESTIONS,
  type GeneralChecklistQuestionId,
  isCompleteStudyAbroadAnswerMap,
  isCompleteAnswerMap,
  isCompleteLanguageStudyAnswerMap,
  LANGUAGE_STUDY_ILAC_CAMPUS_QUESTION,
  LANGUAGE_STUDY_INTRO,
  LANGUAGE_STUDY_QUESTIONS,
  STUDY_ABROAD_CENTENNIAL_CAMPUS_QUESTION,
  STUDY_ABROAD_GEORGE_BROWN_CAMPUS_QUESTION,
  STUDY_ABROAD_ILAC_HIGHER_QUESTION,
  STUDY_ABROAD_INTRO,
  STUDY_ABROAD_QUESTIONS,
  type CentennialCampusAnswer,
  type GeorgeBrownCampusAnswer,
  type IlacCampusAnswer,
  type IlacHigherAnswer,
  type LanguageStudyAnswerMap,
  type LanguageStudyAnswerValue,
  type StudyAbroadAnswerMap,
  type StudyAbroadAnswerValue,
  type StudyAbroadSubQuestion,
  type StationReasonItem,
  type AnswerMap,
  type AnswerValue,
  WORKING_HOLIDAY_QUESTIONS,
} from "@/lib/stationRecommendationData";

type KoreanMode =
  | "restoringResult"
  | "overview"
  | "workingIntro"
  | "workingWizard"
  | "workingResult"
  | "languageIntro"
  | "languageWizard"
  | "languageResult"
  | "studyIntro"
  | "studyWizard"
  | "studyResult"
  | "generalWizard"
  | "generalResult";
type CalculationResult = ReturnType<typeof calculateStationRecommendation>;
type LanguageStudyCalculationResult = ReturnType<typeof calculateLanguageStudyRecommendation>;
type StudyAbroadCalculationResult = ReturnType<typeof calculateStudyAbroadRecommendation>;
type GeneralAnswers = Partial<Record<GeneralChecklistQuestionId, string[]>>;
type ResultChecklistType = "workingHoliday" | "languageStudy" | "studyAbroad";

function hasAnswersForRenderedQuestions(
  questions: ReadonlyArray<{ id: string }>,
  answers: Record<string, string | undefined>,
) {
  return questions.every((question) => Boolean(answers[question.id]));
}

const CHECKLIST_MAIN_EVENT = "maplehouse:checklist-main";
const CHECKLIST_RESULT_STORAGE_KEY = "maplehouse:checklist-result:v1";

interface SavedChecklistResultState {
  version: 1;
  locale: "ko";
  checklistType: ResultChecklistType;
  answers: AnswerMap | LanguageStudyAnswerMap | StudyAbroadAnswerMap;
  result: unknown;
  createdAt: string;
}

const LEGAL_SCOPE_NOTICE_LINES = [
  "이 추천은 정답이 아니라 탐색 시작점을 잡기 위한 참고용입니다. 실제 통학/출근 시간, 매물 상태, 계약 조건, 송금 여부는 사용자가 직접 확인해야 합니다.",
  "메이플하우스는 계약 당사자가 아니며, 법률 자문이나 부동산 중개를 제공하지 않습니다.",
];

const WORKING_HOLIDAY_LEGAL_NOTICE_LINES = [
  "이 추천은 정답이 아니라 탐색 시작점을 잡기 위한 참고용입니다. 실제 출퇴근 시간, 매물 상태, 계약 조건, 송금 여부는 사용자가 직접 확인해야 합니다.",
  "메이플하우스는 계약 당사자가 아니며, 법률 자문이나 부동산 중개를 제공하지 않습니다.",
];

const LANGUAGE_STUDY_LEGAL_NOTICE_LINES = [
  "이 추천은 정답이 아니라 집을 찾기 위한 탐색 시작점입니다.",
  "실제 통학 시간과 경로는 수업 시간, 날씨, 교통 상황에 따라 달라질 수 있습니다.",
  "계약 전에는 반드시 지도 길찾기로 직접 확인해 주세요.",
  "어학원 등록 정보, 캠퍼스 주소, 수업 시간표는 반드시 어학원 공식 안내에서 다시 확인해야 합니다.",
  "메이플하우스는 학교 등록 대행, 비자 자문, 법률 자문, 부동산 중개, 송금 대행을 제공하지 않습니다.",
];

function getChecklistResultSearchParams() {
  if (typeof window === "undefined") return new URLSearchParams();
  return new URLSearchParams(window.location.search);
}

function replaceChecklistSearchParams(params: URLSearchParams) {
  if (typeof window === "undefined") return;

  const query = params.toString();
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
  window.history.replaceState(window.history.state, "", nextUrl);
}

function markChecklistResultUrl(checklistType: ResultChecklistType) {
  const params = getChecklistResultSearchParams();
  params.set("checklist", checklistType);
  params.set("view", "result");
  replaceChecklistSearchParams(params);
}

function clearChecklistResultUrl() {
  const params = getChecklistResultSearchParams();
  if (!params.has("checklist") && !params.has("view")) return;
  params.delete("checklist");
  params.delete("view");
  replaceChecklistSearchParams(params);
}

function saveChecklistResultState(
  checklistType: ResultChecklistType,
  answers: SavedChecklistResultState["answers"],
  result: unknown,
) {
  if (typeof window === "undefined") return;

  const payload: SavedChecklistResultState = {
    version: 1,
    locale: "ko",
    checklistType,
    answers,
    result,
    createdAt: new Date().toISOString(),
  };

  window.sessionStorage.setItem(CHECKLIST_RESULT_STORAGE_KEY, JSON.stringify(payload));
  markChecklistResultUrl(checklistType);
}

function readChecklistResultState() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(CHECKLIST_RESULT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SavedChecklistResultState>;
    if (parsed.version !== 1 || parsed.locale !== "ko" || !parsed.checklistType || !parsed.answers) {
      return null;
    }
    return parsed as SavedChecklistResultState;
  } catch {
    return null;
  }
}

function isResultChecklistType(value: string | null): value is ResultChecklistType {
  return value === "workingHoliday" || value === "languageStudy" || value === "studyAbroad";
}

function getChecklistParamsFromSearch(searchText?: string) {
  if (!searchText) return new URLSearchParams();
  return new URLSearchParams(searchText.startsWith("?") ? searchText : `?${searchText}`);
}

function getChecklistSearchText(location: { href?: string; searchStr?: string }) {
  if (typeof location.searchStr === "string") return location.searchStr;
  if (typeof location.href === "string" && location.href.includes("?")) {
    return location.href.slice(location.href.indexOf("?"));
  }
  if (typeof window !== "undefined") return window.location.search;
  return "";
}

function hasResultViewSearch(searchText?: string) {
  const params = getChecklistParamsFromSearch(searchText);
  return params.get("view") === "result" && isResultChecklistType(params.get("checklist"));
}

function clearChecklistResultState(checklistType?: ResultChecklistType) {
  if (typeof window === "undefined") return;

  const saved = readChecklistResultState();
  if (!checklistType || saved?.checklistType === checklistType) {
    window.sessionStorage.removeItem(CHECKLIST_RESULT_STORAGE_KEY);
  }
  clearChecklistResultUrl();
}

interface InitialKoreanChecklistState {
  mode: KoreanMode;
  workingAnswers: AnswerMap;
  workingResult: CalculationResult | null;
  languageAnswers: LanguageStudyAnswerMap;
  languageResult: LanguageStudyCalculationResult | null;
  studyAnswers: StudyAbroadAnswerMap;
  studyResult: StudyAbroadCalculationResult | null;
}

function getInitialKoreanChecklistState(searchText: string): InitialKoreanChecklistState {
  const fallback: InitialKoreanChecklistState = {
    mode: hasResultViewSearch(searchText) ? "restoringResult" : "overview",
    workingAnswers: {},
    workingResult: null,
    languageAnswers: {},
    languageResult: null,
    studyAnswers: {},
    studyResult: null,
  };

  const params = getChecklistParamsFromSearch(searchText);
  if (params.get("view") !== "result") {
    return { ...fallback, mode: "overview" };
  }

  const checklistType = params.get("checklist");
  const saved = readChecklistResultState();
  if (!isResultChecklistType(checklistType) || !saved || saved.checklistType !== checklistType) {
    return { ...fallback, mode: typeof window === "undefined" ? fallback.mode : "overview" };
  }

  if (checklistType === "workingHoliday") {
    const answers = saved.answers as AnswerMap;
    if (!isCompleteAnswerMap(answers)) return { ...fallback, mode: "overview" };
    return {
      ...fallback,
      mode: "workingResult",
      workingAnswers: answers,
      workingResult: calculateStationRecommendation(answers),
    };
  }

  if (checklistType === "languageStudy") {
    const answers = saved.answers as LanguageStudyAnswerMap;
    if (!isCompleteLanguageStudyAnswerMap(answers)) return { ...fallback, mode: "overview" };
    return {
      ...fallback,
      mode: "languageResult",
      languageAnswers: answers,
      languageResult: calculateLanguageStudyRecommendation(answers),
    };
  }

  const answers = saved.answers as StudyAbroadAnswerMap;
  if (!isCompleteStudyAbroadAnswerMap(answers)) return { ...fallback, mode: "overview" };
  return {
    ...fallback,
    mode: "studyResult",
    studyAnswers: answers,
    studyResult: calculateStudyAbroadRecommendation(answers),
  };
}

const DEPARTURE_TYPES = [
  {
    title: "워킹홀리데이",
    description: "일자리 방향, 예산, 한국 생활권 필요도에 따라 기준역을 추천합니다.",
    button: "워홀 역 추천 시작하기",
    action: "working",
  },
  {
    title: "어학연수",
    description: "어학원 위치와 아침 통학 기준으로 생활권을 정리하는 기능입니다.",
    button: "어학연수 기준역 찾기",
    action: "language",
    notice: "어학연수 체크리스트는 주요 어학원 위치와 아침 통학 부담, 예산, 초반 정착 안정성을 기준으로 준비 중입니다.",
  },
  {
    title: "유학",
    description: "학교 위치와 장기 통학, 생활 지속성을 기준으로 생활권을 정리하는 기능입니다.",
    button: "유학 기준역 찾기",
    action: "study",
  },
] as const;

const HOUSING_GUIDE = [
  {
    title: "혼자 살고 싶다면",
    body: "스튜디오/원룸을 고려할 수 있습니다. 다만 예산 부담이 커질 수 있습니다.",
    icon: Home,
  },
  {
    title: "비용 절감이 우선이라면",
    body: "룸렌트/룸쉐어를 먼저 보는 것이 현실적입니다. 대신 룸메이트, 공용공간, 하우스룰을 확인해야 합니다.",
    icon: WalletCards,
  },
  {
    title: "편의시설이 중요하다면",
    body: "콘도 쉐어 또는 콘도 렌트를 고려할 수 있습니다. 다만 월세가 높아질 수 있습니다.",
    icon: Compass,
  },
];

const HOUSING_GLOSSARY = [
  {
    term: "룸렌트",
    description: [
      "집이나 콘도 안의 방 하나를 빌리는 형태입니다.",
      "주방, 화장실, 거실은 공유할 수 있습니다.",
    ],
    pictogram: "room",
  },
  {
    term: "쉐어하우스",
    description: [
      "여러 사람이 한 집을 함께 쓰는 형태입니다.",
      "방은 개인, 공용공간은 공유하는 경우가 많습니다.",
    ],
    pictogram: "share",
  },
  {
    term: "스튜디오",
    description: ["침실과 거실이 분리되지 않은 원룸형 독립공간입니다."],
    pictogram: "studio",
  },
  {
    term: "1BR",
    description: [
      "침실 1개와 거실/주방이 분리된 집입니다.",
      "스튜디오보다 공간이 나뉘는 경우가 많습니다.",
    ],
    pictogram: "oneBedroom",
  },
  {
    term: "덴",
    description: [
      "보조 공간입니다.",
      "창문, 문, 크기가 제각각이라 실제 침실로 쓸 수 있는지 확인해야 합니다.",
    ],
    pictogram: "den",
  },
  {
    term: "베이스먼트",
    description: [
      "지하 또는 반지하 공간입니다.",
      "월세가 비교적 낮게 나오는 경우가 있지만 채광, 습기, 천장 높이, 환기, 출입구를 꼭 확인해야 합니다.",
    ],
    pictogram: "basement",
  },
  {
    term: "콘도",
    description: [
      "한국의 오피스텔이나 아파트처럼 보이는 개인 소유 유닛입니다.",
      "헬스장, 수영장, 라운지 같은 편의시설이 있을 수 있지만 월세가 높을 수 있습니다.",
    ],
    pictogram: "condo",
  },
] as const;

type HousingGlossaryPictogram = (typeof HOUSING_GLOSSARY)[number]["pictogram"];
type HousingGlossaryContent = {
  trigger: string;
  title: string;
  closeLabel: string;
  items: ReadonlyArray<{
    term: string;
    description: ReadonlyArray<string>;
    pictogram: HousingGlossaryPictogram;
  }>;
};

export function LocaleChecklistPage({ locale }: { locale: Locale }) {
  if (locale !== "ko") {
    return <TranslatedChecklistPage locale={locale} />;
  }

  return <KoreanChecklistPage />;
}

function TranslatedChecklistPage({ locale }: { locale: TranslatedChecklistLocale }) {
  const content = TRANSLATED_CHECKLIST_CONTENT[locale];
  const location = useLocation() as { href?: string; searchStr?: string };
  const [mode, setMode] = useState<KoreanMode>("overview");
  const [workingStep, setWorkingStep] = useState(0);
  const [workingAnswers, setWorkingAnswers] = useState<AnswerMap>({});
  const [workingResult, setWorkingResult] = useState<CalculationResult | null>(null);
  const [languageStep, setLanguageStep] = useState(0);
  const [languageAnswers, setLanguageAnswers] = useState<LanguageStudyAnswerMap>({});
  const [languageResult, setLanguageResult] = useState<LanguageStudyCalculationResult | null>(null);
  const [generalStep, setGeneralStep] = useState(0);
  const [generalAnswers, setGeneralAnswers] = useState<GeneralAnswers>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [supportNotice, setSupportNotice] = useState(false);

  const workingQuestions = content.workingQuestions;
  const languageQuestions = content.languageStudy.questions;
  const generalQuestions = content.generalQuestions;
  const workingQuestion = workingQuestions[workingStep];
  const selectedWorkingAnswer = workingQuestion ? workingAnswers[workingQuestion.id] : undefined;
  const workingProgress = mode === "workingWizard" ? ((workingStep + 1) / workingQuestions.length) * 100 : 0;
  const languageQuestion = languageQuestions[languageStep];
  const selectedLanguageAnswer = languageQuestion
    ? languageAnswers[languageQuestion.id]
    : undefined;
  const languageProgress =
    mode === "languageWizard" ? ((languageStep + 1) / languageQuestions.length) * 100 : 0;
  const needsIlacCampus =
    languageQuestion?.id === "school" && selectedLanguageAnswer === "school_ilac";
  const canGoNextLanguage =
    Boolean(selectedLanguageAnswer) && (!needsIlacCampus || Boolean(languageAnswers.ilacCampus));
  const generalQuestion = generalQuestions[generalStep];
  const selectedGeneralOptions = generalQuestion ? generalAnswers[generalQuestion.id] ?? [] : [];
  const generalProgress = mode === "generalWizard" ? ((generalStep + 1) / generalQuestions.length) * 100 : 0;
  const isHousingQuestion = mode === "languageWizard" && languageQuestion?.id === "housingType";

  function resetToOverview() {
    setMode("overview");
    setWorkingStep(0);
    setWorkingAnswers({});
    setWorkingResult(null);
    setLanguageStep(0);
    setLanguageAnswers({});
    setLanguageResult(null);
    setGeneralStep(0);
    setGeneralAnswers({});
    setNotice(null);
    setSupportNotice(false);
  }

  function showOverview() {
    resetToOverview();
  }

  useEffect(() => {
    const searchText =
      location.searchStr ??
      (typeof window !== "undefined" ? window.location.search : "");
    const params = new URLSearchParams(searchText.startsWith("?") ? searchText : `?${searchText}`);

    if (params.get("view") === "main") {
      resetToOverview();
    }
  }, [location.href, location.searchStr]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleChecklistMain = () => resetToOverview();

    window.addEventListener(CHECKLIST_MAIN_EVENT, handleChecklistMain);
    return () => window.removeEventListener(CHECKLIST_MAIN_EVENT, handleChecklistMain);
  }, []);

  function startWorkingWizard() {
    setMode("workingWizard");
    setWorkingStep(0);
    setWorkingAnswers({});
    setWorkingResult(null);
    setSupportNotice(false);
    setNotice(null);
  }

  function startGeneralChecklist() {
    setMode("generalWizard");
    setGeneralStep(0);
    setGeneralAnswers({});
    setSupportNotice(false);
    setNotice(null);
  }

  function startLanguageWizard() {
    setMode("languageWizard");
    setLanguageStep(0);
    setLanguageAnswers({});
    setLanguageResult(null);
    setSupportNotice(false);
    setNotice(null);
  }

  function selectWorkingAnswer(value: AnswerValue) {
    if (!workingQuestion) return;
    setWorkingAnswers((prev) => ({ ...prev, [workingQuestion.id]: value }));
  }

  function selectLanguageAnswer(value: LanguageStudyAnswerValue) {
    if (!languageQuestion) return;
    setLanguageAnswers((prev) => {
      const next: LanguageStudyAnswerMap = { ...prev, [languageQuestion.id]: value };
      if (languageQuestion.id === "school" && value !== "school_ilac") {
        delete next.ilacCampus;
      }
      return next;
    });
  }

  function selectIlacCampus(value: IlacCampusAnswer) {
    setLanguageAnswers((prev) => ({ ...prev, ilacCampus: value }));
  }

  function goNextWorking() {
    if (!workingQuestion || !selectedWorkingAnswer) return;

    if (workingStep < workingQuestions.length - 1) {
      setWorkingStep((prev) => prev + 1);
      return;
    }

    const nextAnswers = { ...workingAnswers, [workingQuestion.id]: selectedWorkingAnswer };
    if (!hasAnswersForRenderedQuestions(workingQuestions, nextAnswers)) return;
    setWorkingResult(
      calculateStationRecommendation(nextAnswers as Parameters<typeof calculateStationRecommendation>[0], {
        includeKoreanCommunity: false,
      }),
    );
    setMode("workingResult");
    setSupportNotice(false);
  }

  function goNextLanguage() {
    if (!languageQuestion || !canGoNextLanguage || !selectedLanguageAnswer) return;

    const nextAnswers: LanguageStudyAnswerMap = {
      ...languageAnswers,
      [languageQuestion.id]: selectedLanguageAnswer,
    };

    if (languageStep < languageQuestions.length - 1) {
      setLanguageAnswers(nextAnswers);
      setLanguageStep((prev) => prev + 1);
      return;
    }

    if (
      !hasAnswersForRenderedQuestions(languageQuestions, nextAnswers) ||
      (nextAnswers.school === "school_ilac" && !nextAnswers.ilacCampus)
    ) {
      return;
    }
    setLanguageResult(
      calculateLanguageStudyRecommendation(nextAnswers as Parameters<typeof calculateLanguageStudyRecommendation>[0], {
        includeKoreanCommunity: false,
      }),
    );
    setMode("languageResult");
    setSupportNotice(false);
  }

  function toggleGeneralOption(option: string) {
    if (!generalQuestion) return;
    setGeneralAnswers((prev) => {
      const current = prev[generalQuestion.id] ?? [];
      const next = current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option];
      return { ...prev, [generalQuestion.id]: next };
    });
  }

  function goNextGeneral() {
    if (generalStep < generalQuestions.length - 1) {
      setGeneralStep((prev) => prev + 1);
      return;
    }
    setMode("generalResult");
    setSupportNotice(false);
  }

  return (
    <main className="bg-background [overflow-wrap:break-word]">
      <Container className="py-10 sm:py-14">
        {mode === "overview" && (
          <TranslatedHeroSection content={content} onStartGeneral={startGeneralChecklist} />
        )}

        {mode === "overview" && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
              {content.overview.departureHeading}
            </h2>
          </div>
        )}

        {notice && (
          <div className="mt-4 rounded-2xl border border-[#FFE8CC] bg-[#FFF7ED] p-4 text-sm font-medium text-foreground">
            {notice}
          </div>
        )}

        {mode === "overview" && (
          <section className="mt-4 grid gap-4 lg:grid-cols-3">
            {content.departureTypes.map((type) => (
              <article
                key={type.title}
                className="flex h-full min-h-[15rem] min-w-0 flex-col rounded-3xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-md sm:p-6"
              >
                <h3 className="text-xl font-semibold text-foreground">{type.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {type.description}
                </p>
                <div className="mt-auto pt-6">
                  <Button
                    type="button"
                    className="w-full whitespace-normal text-center leading-snug"
                    variant={type.action === "study" ? "soft" : "default"}
                    onClick={() => {
                      if (type.action === "working") {
                        setMode("workingIntro");
                        setNotice(null);
                      } else if (type.action === "language") {
                        setMode("languageIntro");
                        setLanguageStep(0);
                        setLanguageAnswers({});
                        setLanguageResult(null);
                        setSupportNotice(false);
                        setNotice(null);
                      } else {
                        setNotice(type.notice ?? null);
                      }
                    }}
                  >
                    {type.button}
                    {type.action !== "study" && <ArrowRight className="h-4 w-4" />}
                  </Button>
                </div>
              </article>
            ))}
          </section>
        )}

        {mode === "workingIntro" && (
          <section className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              {content.workingIntro.label}
            </p>
            <h2 className="mt-3 text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
              {content.workingIntro.title}
            </h2>
            <div className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {content.workingIntro.paragraphs.map((paragraph, index) => (
                <p key={paragraph} className={index === 2 ? "font-medium text-foreground" : undefined}>
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button type="button" variant="outline" size="lg" onClick={showOverview}>
                <ChevronLeft className="h-4 w-4" />
                {content.wizardLabels.previous}
              </Button>
              <Button type="button" size="lg" onClick={startWorkingWizard}>
                {content.wizardLabels.start}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </section>
        )}

        {mode === "workingWizard" && workingQuestion && (
          <section className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
            <WizardHeader
              countLabel={`${workingStep + 1} / ${workingQuestions.length}`}
              title={content.wizardLabels.workingTitle}
              progress={workingProgress}
            />

            <div className="mt-8">
              <h2 className="text-2xl font-semibold leading-tight text-foreground">
                {workingQuestion.title}
              </h2>
              {workingQuestion.intro && (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {workingQuestion.intro}
                </p>
              )}
              {workingQuestion.notice && (
                <p className="mt-3 rounded-2xl border border-border bg-secondary p-4 text-sm leading-relaxed text-muted-foreground">
                  {workingQuestion.notice}
                </p>
              )}
            </div>

            <div className="mt-6 grid gap-3 xl:grid-cols-2">
              {workingQuestion.options.map((option) => {
                const selected = selectedWorkingAnswer === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={cn(
                      "rounded-2xl border p-4 text-left transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                      selected
                        ? "border-primary bg-accent shadow-sm"
                        : "border-border bg-card hover:border-primary hover:shadow-sm",
                    )}
                    onClick={() => selectWorkingAnswer(option.value)}
                  >
                    <AnswerMarker selected={selected} />
                    <span className="ml-8 -mt-5 block">
                      <span className="block text-base font-semibold text-foreground">
                        {option.label}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                        {option.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {workingQuestion.footerNote && (
              <p className="mt-5 rounded-2xl border border-[#FFE8CC] bg-[#FFF7ED] p-4 text-xs leading-relaxed text-muted-foreground">
                {workingQuestion.footerNote}
              </p>
            )}

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (workingStep === 0) {
                    showOverview();
                    return;
                  }
                  setWorkingStep((prev) => prev - 1);
                }}
              >
                <ChevronLeft className="h-4 w-4" />
                {content.wizardLabels.previous}
              </Button>
              <Button type="button" disabled={!selectedWorkingAnswer} onClick={goNextWorking}>
                {workingStep === workingQuestions.length - 1
                  ? content.wizardLabels.showResult
                  : content.wizardLabels.next}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </section>
        )}

        {mode === "workingResult" && workingResult && (
          <TranslatedWorkingResultSection
            locale={locale}
            content={content}
            calculation={workingResult}
            supportNotice={supportNotice}
            onSupportClick={() => setSupportNotice(true)}
            onRestart={startWorkingWizard}
            onStartGeneral={startGeneralChecklist}
          />
        )}

        {mode === "languageIntro" && (
          <section className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              {content.languageStudy.intro.label}
            </p>
            <h2 className="mt-3 text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
              {content.languageStudy.intro.title}
            </h2>
            <div className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {content.languageStudy.intro.paragraphs.map((paragraph, index) => (
                <p key={paragraph} className={index === 2 ? "font-medium text-foreground" : undefined}>
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button type="button" variant="outline" size="lg" onClick={showOverview}>
                <ChevronLeft className="h-4 w-4" />
                {content.wizardLabels.previous}
              </Button>
              <Button type="button" size="lg" onClick={startLanguageWizard}>
                {content.wizardLabels.start}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </section>
        )}

        {mode === "languageWizard" && languageQuestion && (
          <QuestionShellWithHelper
            helper={
              hasQuestionSideHelper(languageQuestion) ? (
                <QuestionSideHelper question={languageQuestion} glossary={content.languageStudy.glossary} />
              ) : null
            }
          >
            <section
              className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8"
              data-testid="checklist-question-card"
            >
            <WizardHeader
              countLabel={`${languageStep + 1} / ${languageQuestions.length}`}
              title={content.languageStudy.intro.label}
              progress={languageProgress}
            />

            <div className="mt-8 min-w-0">
              <div className="min-w-0">
                <div>
                  <h2 className="text-2xl font-semibold leading-tight text-foreground">
                    {languageQuestion.title}
                  </h2>
                  {languageQuestion.intro && (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {languageQuestion.intro}
                    </p>
                  )}
                  {languageQuestion.notice && (
                    <p className="mt-3 rounded-2xl border border-border bg-secondary p-4 text-sm leading-relaxed text-muted-foreground">
                      {languageQuestion.notice}
                    </p>
                  )}
                </div>

                <div className="mt-6 grid gap-3 xl:grid-cols-2">
                  {languageQuestion.options.map((option) => {
                    const selected = selectedLanguageAnswer === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        className={cn(
                          "rounded-2xl border p-4 text-left transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                          selected
                            ? "border-primary bg-accent shadow-sm"
                            : "border-border bg-card hover:border-primary hover:shadow-sm",
                        )}
                        onClick={() => selectLanguageAnswer(option.value)}
                      >
                        <AnswerMarker selected={selected} />
                        <span className="ml-8 -mt-5 block">
                          <span className="block text-base font-semibold text-foreground">
                            {option.label}
                          </span>
                          <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                            {option.description}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                {needsIlacCampus && (
                  <div className="mt-6 rounded-3xl border border-[#FFE8CC] bg-[#FFF7ED] p-4 sm:p-5">
                    <h3 className="text-lg font-semibold text-foreground">
                      {content.languageStudy.ilacCampusQuestion.title}
                    </h3>
                    {content.languageStudy.ilacCampusQuestion.notice && (
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {content.languageStudy.ilacCampusQuestion.notice}
                      </p>
                    )}
                    <div className="mt-4 grid gap-3 xl:grid-cols-2">
                      {content.languageStudy.ilacCampusQuestion.options.map((option) => {
                        const campusValue = option.value as IlacCampusAnswer;
                        const selected = languageAnswers.ilacCampus === campusValue;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            className={cn(
                              "rounded-2xl border bg-card p-4 text-left transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                              selected
                                ? "border-primary bg-accent shadow-sm"
                                : "border-[#FFE8CC] hover:border-primary hover:shadow-sm",
                            )}
                            onClick={() => selectIlacCampus(campusValue)}
                          >
                            <AnswerMarker selected={selected} />
                            <span className="ml-8 -mt-5 block">
                              <span className="block text-base font-semibold text-foreground">
                                {option.label}
                              </span>
                              <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                                {option.description}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {languageQuestion.footerNote && (
                  <p className="mt-5 rounded-2xl border border-[#FFE8CC] bg-[#FFF7ED] p-4 text-xs leading-relaxed text-muted-foreground">
                    {languageQuestion.footerNote}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (languageStep === 0) {
                    showOverview();
                    return;
                  }
                  setLanguageStep((prev) => prev - 1);
                }}
              >
                <ChevronLeft className="h-4 w-4" />
                {content.wizardLabels.previous}
              </Button>
              <Button type="button" disabled={!canGoNextLanguage} onClick={goNextLanguage}>
                {languageStep === languageQuestions.length - 1
                  ? content.wizardLabels.showResult
                  : content.wizardLabels.next}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            </section>
          </QuestionShellWithHelper>
        )}

        {mode === "languageResult" && languageResult && (
          <TranslatedLanguageStudyResultSection
            locale={locale}
            content={content}
            calculation={languageResult}
            supportNotice={supportNotice}
            onSupportClick={() => setSupportNotice(true)}
            onRestart={startLanguageWizard}
            onStartGeneral={startGeneralChecklist}
          />
        )}

        {mode === "generalWizard" && generalQuestion && (
          <section className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
            <WizardHeader
              countLabel={`${generalStep + 1} / ${generalQuestions.length}`}
              title={content.wizardLabels.generalTitle}
              progress={generalProgress}
            />
            <div className="mt-8">
              <p className="text-sm font-semibold text-primary">{content.generalChecklist.eyebrow}</p>
              <h2 className="mt-2 text-2xl font-semibold leading-tight text-foreground">
                {generalQuestion.title}
              </h2>
              {generalStep === 0 && (
                <div className="mt-3 max-w-4xl space-y-1 text-sm leading-7 text-muted-foreground">
                  {content.generalChecklist.intro.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              )}
              {selectedGeneralOptions.length === 0 && (
                <p className="mt-3 rounded-2xl border border-border bg-secondary p-4 text-sm leading-relaxed text-muted-foreground">
                  {content.generalChecklist.emptyHint}
                </p>
              )}
            </div>

            <div className="mt-6 grid gap-3 xl:grid-cols-2">
              {generalQuestion.options.map((option) => {
                const selected = selectedGeneralOptions.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    className={cn(
                      "rounded-2xl border p-4 text-left transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                      selected
                        ? "border-primary bg-accent shadow-sm"
                        : "border-border bg-card hover:border-primary hover:shadow-sm",
                    )}
                    onClick={() => toggleGeneralOption(option)}
                  >
                    <AnswerMarker selected={selected} />
                    <span className="ml-8 -mt-5 block text-sm font-medium leading-relaxed text-foreground">
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (generalStep === 0) {
                    showOverview();
                    return;
                  }
                  setGeneralStep((prev) => prev - 1);
                }}
              >
                <ChevronLeft className="h-4 w-4" />
                {content.wizardLabels.previous}
              </Button>
              <Button type="button" onClick={goNextGeneral}>
                {generalStep === generalQuestions.length - 1
                  ? content.wizardLabels.showResult
                  : content.wizardLabels.next}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </section>
        )}

        {mode === "generalResult" && (
          <TranslatedGeneralChecklistResult
            locale={locale}
            content={content}
            answers={generalAnswers}
            supportNotice={supportNotice}
            onSupportClick={() => setSupportNotice(true)}
            onRestart={startGeneralChecklist}
          />
        )}

        {!isHousingQuestion && <TranslatedHousingGuideSection content={content} />}
      </Container>
    </main>
  );
}

function KoreanChecklistPage() {
  const location = useLocation() as { href?: string; searchStr?: string };
  const searchText = getChecklistSearchText(location);
  const initialStateRef = useRef<InitialKoreanChecklistState | null>(null);
  if (initialStateRef.current === null) {
    initialStateRef.current = getInitialKoreanChecklistState(searchText);
  }
  const initialState = initialStateRef.current;

  const [mode, setMode] = useState<KoreanMode>(initialState.mode);
  const [workingStep, setWorkingStep] = useState(0);
  const [workingAnswers, setWorkingAnswers] = useState<AnswerMap>(initialState.workingAnswers);
  const [workingResult, setWorkingResult] = useState<CalculationResult | null>(
    initialState.workingResult,
  );
  const [languageStep, setLanguageStep] = useState(0);
  const [languageAnswers, setLanguageAnswers] = useState<LanguageStudyAnswerMap>(
    initialState.languageAnswers,
  );
  const [languageResult, setLanguageResult] = useState<LanguageStudyCalculationResult | null>(
    initialState.languageResult,
  );
  const [studyStep, setStudyStep] = useState(0);
  const [studyAnswers, setStudyAnswers] = useState<StudyAbroadAnswerMap>(initialState.studyAnswers);
  const [studyResult, setStudyResult] = useState<StudyAbroadCalculationResult | null>(
    initialState.studyResult,
  );
  const [generalStep, setGeneralStep] = useState(0);
  const [generalAnswers, setGeneralAnswers] = useState<GeneralAnswers>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [supportNotice, setSupportNotice] = useState(false);

  const workingQuestion = WORKING_HOLIDAY_QUESTIONS[workingStep];
  const selectedWorkingAnswer = workingQuestion ? workingAnswers[workingQuestion.id] : undefined;
  const workingProgress =
    mode === "workingWizard" ? ((workingStep + 1) / WORKING_HOLIDAY_QUESTIONS.length) * 100 : 0;

  const languageQuestion = LANGUAGE_STUDY_QUESTIONS[languageStep];
  const selectedLanguageAnswer = languageQuestion
    ? languageAnswers[languageQuestion.id]
    : undefined;
  const languageProgress =
    mode === "languageWizard" ? ((languageStep + 1) / LANGUAGE_STUDY_QUESTIONS.length) * 100 : 0;
  const needsIlacCampus =
    languageQuestion?.id === "school" && selectedLanguageAnswer === "school_ilac";
  const canGoNextLanguage = Boolean(selectedLanguageAnswer) && (!needsIlacCampus || Boolean(languageAnswers.ilacCampus));

  const studyQuestion = STUDY_ABROAD_QUESTIONS[studyStep];
  const selectedStudyAnswer = studyQuestion ? studyAnswers[studyQuestion.id] : undefined;
  const studyProgress =
    mode === "studyWizard" ? ((studyStep + 1) / STUDY_ABROAD_QUESTIONS.length) * 100 : 0;
  const needsGeorgeBrownCampus =
    studyQuestion?.id === "school" && selectedStudyAnswer === "school_georgebrown";
  const needsIlacHigherProgram =
    studyQuestion?.id === "school" && selectedStudyAnswer === "school_ilac_higher";
  const needsCentennialCampus =
    studyQuestion?.id === "school" && selectedStudyAnswer === "school_centennial";
  const canGoNextStudy =
    Boolean(selectedStudyAnswer) &&
    (!needsGeorgeBrownCampus || Boolean(studyAnswers.georgeBrownCampus)) &&
    (!needsIlacHigherProgram || Boolean(studyAnswers.ilacHigherProgram)) &&
    (!needsCentennialCampus || Boolean(studyAnswers.centennialCampus));

  const generalQuestion = GENERAL_CHECKLIST_QUESTIONS[generalStep];
  const selectedGeneralOptions = generalQuestion ? generalAnswers[generalQuestion.id] ?? [] : [];
  const generalProgress =
    mode === "generalWizard" ? ((generalStep + 1) / GENERAL_CHECKLIST_QUESTIONS.length) * 100 : 0;
  const isHousingQuestion =
    (mode === "languageWizard" && languageQuestion?.id === "housingType") ||
    (mode === "studyWizard" && studyQuestion?.id === "housingType");

  function restoreSavedChecklistResult(checklistType: ResultChecklistType, saved: SavedChecklistResultState) {
    if (saved.checklistType !== checklistType) return false;

    setWorkingStep(0);
    setLanguageStep(0);
    setStudyStep(0);
    setGeneralStep(0);
    setGeneralAnswers({});
    setNotice(null);
    setSupportNotice(false);

    if (checklistType === "workingHoliday") {
      const answers = saved.answers as AnswerMap;
      if (!isCompleteAnswerMap(answers)) return false;

      setWorkingAnswers(answers);
      setWorkingResult(calculateStationRecommendation(answers));
      setLanguageAnswers({});
      setLanguageResult(null);
      setStudyAnswers({});
      setStudyResult(null);
      setMode("workingResult");
      return true;
    }

    if (checklistType === "languageStudy") {
      const answers = saved.answers as LanguageStudyAnswerMap;
      if (!isCompleteLanguageStudyAnswerMap(answers)) return false;

      setLanguageAnswers(answers);
      setLanguageResult(calculateLanguageStudyRecommendation(answers));
      setWorkingAnswers({});
      setWorkingResult(null);
      setStudyAnswers({});
      setStudyResult(null);
      setMode("languageResult");
      return true;
    }

    const answers = saved.answers as StudyAbroadAnswerMap;
    if (!isCompleteStudyAbroadAnswerMap(answers)) return false;

    setStudyAnswers(answers);
    setStudyResult(calculateStudyAbroadRecommendation(answers));
    setWorkingAnswers({});
    setWorkingResult(null);
    setLanguageAnswers({});
    setLanguageResult(null);
    setMode("studyResult");
    return true;
  }

  function resetToOverview(options: { clearSaved?: boolean } = {}) {
    if (options.clearSaved ?? true) {
      clearChecklistResultState();
    }

    setMode("overview");
    setWorkingStep(0);
    setWorkingAnswers({});
    setWorkingResult(null);
    setLanguageStep(0);
    setLanguageAnswers({});
    setLanguageResult(null);
    setStudyStep(0);
    setStudyAnswers({});
    setStudyResult(null);
    setGeneralStep(0);
    setGeneralAnswers({});
    setNotice(null);
    setSupportNotice(false);
  }

  function showOverview() {
    resetToOverview();
  }

  useEffect(() => {
    const params = getChecklistParamsFromSearch(searchText);

    if (params.get("view") === "result") {
      const checklistType = params.get("checklist");
      const saved = readChecklistResultState();

      if (isResultChecklistType(checklistType) && saved && restoreSavedChecklistResult(checklistType, saved)) {
        return;
      }

      resetToOverview();
      return;
    }

    if (params.get("view") === "main") {
      resetToOverview();
      return;
    }

    if (!params.has("view") && !params.has("checklist")) {
      resetToOverview();
    }
  }, [location.href, location.searchStr, searchText]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleChecklistMain = () => resetToOverview();

    window.addEventListener(CHECKLIST_MAIN_EVENT, handleChecklistMain);
    return () => window.removeEventListener(CHECKLIST_MAIN_EVENT, handleChecklistMain);
  }, []);

  function startWorkingWizard() {
    clearChecklistResultState("workingHoliday");
    setMode("workingWizard");
    setWorkingStep(0);
    setWorkingAnswers({});
    setWorkingResult(null);
    setSupportNotice(false);
    setNotice(null);
  }

  function startLanguageWizard() {
    clearChecklistResultState("languageStudy");
    setMode("languageWizard");
    setLanguageStep(0);
    setLanguageAnswers({});
    setLanguageResult(null);
    setSupportNotice(false);
    setNotice(null);
  }

  function startStudyWizard() {
    clearChecklistResultState("studyAbroad");
    setMode("studyWizard");
    setStudyStep(0);
    setStudyAnswers({});
    setStudyResult(null);
    setSupportNotice(false);
    setNotice(null);
  }

  function startGeneralChecklist() {
    clearChecklistResultState();
    setMode("generalWizard");
    setGeneralStep(0);
    setGeneralAnswers({});
    setSupportNotice(false);
    setNotice(null);
  }

  function selectWorkingAnswer(value: AnswerValue) {
    if (!workingQuestion) return;
    setWorkingAnswers((prev) => ({ ...prev, [workingQuestion.id]: value }));
  }

  function selectLanguageAnswer(value: LanguageStudyAnswerValue) {
    if (!languageQuestion) return;
    setLanguageAnswers((prev) => {
      const next: LanguageStudyAnswerMap = { ...prev, [languageQuestion.id]: value };
      if (languageQuestion.id === "school" && value !== "school_ilac") {
        delete next.ilacCampus;
      }
      return next;
    });
  }

  function selectIlacCampus(value: IlacCampusAnswer) {
    setLanguageAnswers((prev) => ({ ...prev, ilacCampus: value }));
  }

  function selectStudyAnswer(value: StudyAbroadAnswerValue) {
    if (!studyQuestion) return;
    setStudyAnswers((prev) => {
      const next: StudyAbroadAnswerMap = { ...prev, [studyQuestion.id]: value };
      if (studyQuestion.id === "school") {
        if (value !== "school_georgebrown") delete next.georgeBrownCampus;
        if (value !== "school_ilac_higher") delete next.ilacHigherProgram;
        if (value !== "school_centennial") delete next.centennialCampus;
      }
      return next;
    });
  }

  function selectGeorgeBrownCampus(value: GeorgeBrownCampusAnswer) {
    setStudyAnswers((prev) => ({ ...prev, georgeBrownCampus: value }));
  }

  function selectIlacHigherProgram(value: IlacHigherAnswer) {
    setStudyAnswers((prev) => ({ ...prev, ilacHigherProgram: value }));
  }

  function selectCentennialCampus(value: CentennialCampusAnswer) {
    setStudyAnswers((prev) => ({ ...prev, centennialCampus: value }));
  }

  function goNextWorking() {
    if (!workingQuestion || !selectedWorkingAnswer) return;

    if (workingStep < WORKING_HOLIDAY_QUESTIONS.length - 1) {
      setWorkingStep((prev) => prev + 1);
      return;
    }

    const nextAnswers = { ...workingAnswers, [workingQuestion.id]: selectedWorkingAnswer };
    if (!isCompleteAnswerMap(nextAnswers)) return;
    const nextResult = calculateStationRecommendation(nextAnswers);
    setWorkingAnswers(nextAnswers);
    setWorkingResult(nextResult);
    saveChecklistResultState("workingHoliday", nextAnswers, nextResult);
    setMode("workingResult");
    setSupportNotice(false);
  }

  function goNextLanguage() {
    if (!languageQuestion || !canGoNextLanguage || !selectedLanguageAnswer) return;

    const nextAnswers: LanguageStudyAnswerMap = {
      ...languageAnswers,
      [languageQuestion.id]: selectedLanguageAnswer,
    };

    if (languageStep < LANGUAGE_STUDY_QUESTIONS.length - 1) {
      setLanguageAnswers(nextAnswers);
      setLanguageStep((prev) => prev + 1);
      return;
    }

    if (!isCompleteLanguageStudyAnswerMap(nextAnswers)) return;
    const nextResult = calculateLanguageStudyRecommendation(nextAnswers);
    setLanguageAnswers(nextAnswers);
    setLanguageResult(nextResult);
    saveChecklistResultState("languageStudy", nextAnswers, nextResult);
    setMode("languageResult");
    setSupportNotice(false);
  }

  function goNextStudy() {
    if (!studyQuestion || !canGoNextStudy || !selectedStudyAnswer) return;

    const nextAnswers: StudyAbroadAnswerMap = {
      ...studyAnswers,
      [studyQuestion.id]: selectedStudyAnswer,
    };

    if (studyStep < STUDY_ABROAD_QUESTIONS.length - 1) {
      setStudyAnswers(nextAnswers);
      setStudyStep((prev) => prev + 1);
      return;
    }

    if (!isCompleteStudyAbroadAnswerMap(nextAnswers)) return;
    const nextResult = calculateStudyAbroadRecommendation(nextAnswers);
    setStudyAnswers(nextAnswers);
    setStudyResult(nextResult);
    saveChecklistResultState("studyAbroad", nextAnswers, nextResult);
    setMode("studyResult");
    setSupportNotice(false);
  }

  function toggleGeneralOption(option: string) {
    if (!generalQuestion) return;
    setGeneralAnswers((prev) => {
      const current = prev[generalQuestion.id] ?? [];
      const next = current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option];
      return { ...prev, [generalQuestion.id]: next };
    });
  }

  function goNextGeneral() {
    if (generalStep < GENERAL_CHECKLIST_QUESTIONS.length - 1) {
      setGeneralStep((prev) => prev + 1);
      return;
    }
    setMode("generalResult");
    setSupportNotice(false);
  }

  return (
    <main className="bg-background">
      <Container className="py-10 sm:py-14">
        {mode === "restoringResult" && (
          <section className="min-h-[12rem]" aria-hidden="true" />
        )}

        {mode === "overview" && <HeroSection onStartGeneral={startGeneralChecklist} />}

        {mode === "overview" && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-foreground [word-break:keep-all] sm:text-2xl">
              출국 유형별 거주 지역을 추천받아보세요
            </h2>
          </div>
        )}

        {notice && (
          <div className="mt-4 rounded-2xl border border-[#FFE8CC] bg-[#FFF7ED] p-4 text-sm font-medium text-foreground [word-break:keep-all]">
            {notice}
          </div>
        )}

        {mode === "overview" && (
          <section className="mt-4 grid gap-4 lg:grid-cols-3">
            {DEPARTURE_TYPES.map((type) => {
              return (
                <article
                  key={type.title}
                  className="flex h-full flex-col rounded-3xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-md sm:p-6"
                >
                  <h3 className="text-xl font-semibold text-foreground [word-break:keep-all]">{type.title}</h3>
                  <p className="mt-3 min-h-[3.8rem] text-sm leading-relaxed text-muted-foreground [word-break:keep-all]">
                    {type.description}
                  </p>
                  <Button
                    type="button"
                    className="mt-auto w-full"
                    onClick={() => {
                      if (type.action === "working") {
                        setMode("workingIntro");
                        setNotice(null);
                      } else if (type.action === "language") {
                        setMode("languageIntro");
                        setLanguageStep(0);
                        setLanguageAnswers({});
                        setLanguageResult(null);
                        setSupportNotice(false);
                        setNotice(null);
                      } else {
                        setMode("studyIntro");
                        setStudyStep(0);
                        setStudyAnswers({});
                        setStudyResult(null);
                        setSupportNotice(false);
                        setNotice(null);
                      }
                    }}
                  >
                    {type.button}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </article>
              );
            })}
          </section>
        )}

        {mode === "workingIntro" && (
          <section className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Working Holiday
            </p>
            <h2 className="mt-3 text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
              워홀러를 위한 토론토 기준역 찾기
            </h2>
            <div className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground [word-break:keep-all] sm:text-base">
              <p>처음 토론토에서 집을 구할 때는 지역명보다 역 이름을 기준으로 보는 것이 더 쉽습니다.</p>
              <p>아래 5가지 질문에 답하면, 집을 찾기 시작할 기준역 후보를 추천해드립니다.</p>
              <p className="font-medium text-foreground">
                추천은 정답이 아니라 시작점입니다. 실제 이동 시간은 반드시 지도 길찾기로 직접 확인해야 합니다.
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button type="button" variant="outline" size="lg" onClick={showOverview}>
                <ChevronLeft className="h-4 w-4" />
                이전
              </Button>
              <Button type="button" size="lg" onClick={startWorkingWizard}>
                시작하기
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </section>
        )}

        {mode === "workingWizard" && workingQuestion && (
          <section className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
            <WizardHeader
              countLabel={`${workingStep + 1} / ${WORKING_HOLIDAY_QUESTIONS.length}`}
              title="워킹홀리데이 기준역 추천"
              progress={workingProgress}
            />

            <div className="mt-8">
              <h2 className="text-2xl font-semibold leading-tight text-foreground [word-break:keep-all]">
                {workingQuestion.title}
              </h2>
              {workingQuestion.intro && (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground [word-break:keep-all]">
                  {workingQuestion.intro}
                </p>
              )}
              {workingQuestion.notice && (
                <p className="mt-3 rounded-2xl border border-border bg-secondary p-4 text-sm leading-relaxed text-muted-foreground [word-break:keep-all]">
                  {workingQuestion.notice}
                </p>
              )}
            </div>

            <div className="mt-6 grid gap-3 xl:grid-cols-2">
              {workingQuestion.options.map((option) => {
                const selected = selectedWorkingAnswer === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={cn(
                      "rounded-2xl border p-4 text-left transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                      selected
                        ? "border-primary bg-accent shadow-sm"
                        : "border-border bg-card hover:border-primary hover:shadow-sm",
                    )}
                    onClick={() => selectWorkingAnswer(option.value)}
                  >
                    <AnswerMarker selected={selected} />
                    <span className="ml-8 -mt-5 block [word-break:keep-all]">
                      <span className="block text-base font-semibold text-foreground">
                        {option.label}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                        {option.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {workingQuestion.footerNote && (
              <p className="mt-5 rounded-2xl border border-[#FFE8CC] bg-[#FFF7ED] p-4 text-xs leading-relaxed text-muted-foreground [word-break:keep-all]">
                {workingQuestion.footerNote}
              </p>
            )}

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (workingStep === 0) {
                    showOverview();
                    return;
                  }
                  setWorkingStep((prev) => prev - 1);
                }}
              >
                <ChevronLeft className="h-4 w-4" />
                이전
              </Button>
              <Button type="button" disabled={!selectedWorkingAnswer} onClick={goNextWorking}>
                {workingStep === WORKING_HOLIDAY_QUESTIONS.length - 1 ? "결과 보기" : "다음"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </section>
        )}

        {mode === "workingResult" && workingResult && (
          <WorkingResultSection
            calculation={workingResult}
            supportNotice={supportNotice}
            onSupportClick={() => setSupportNotice(true)}
            onRestart={startWorkingWizard}
            onStartGeneral={startGeneralChecklist}
          />
        )}

        {mode === "languageIntro" && (
          <section className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              {LANGUAGE_STUDY_INTRO.label}
            </p>
            <h2 className="mt-3 text-2xl font-semibold leading-tight text-foreground [word-break:keep-all] sm:text-3xl">
              {LANGUAGE_STUDY_INTRO.title}
            </h2>
            <div className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground [word-break:keep-all] sm:text-base">
              {LANGUAGE_STUDY_INTRO.paragraphs.map((paragraph, index) => (
                <p key={paragraph} className={index === 2 ? "font-medium text-foreground" : undefined}>
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button type="button" variant="outline" size="lg" onClick={showOverview}>
                <ChevronLeft className="h-4 w-4" />
                이전
              </Button>
              <Button type="button" size="lg" onClick={startLanguageWizard}>
                시작하기
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </section>
        )}

        {mode === "languageWizard" && languageQuestion && (
          <QuestionShellWithHelper
            helper={hasQuestionSideHelper(languageQuestion) ? <QuestionSideHelper question={languageQuestion} /> : null}
          >
            <section
              className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8"
              data-testid="checklist-question-card"
            >
            <WizardHeader
              countLabel={`${languageStep + 1} / ${LANGUAGE_STUDY_QUESTIONS.length}`}
              title="어학연수 기준역 추천"
              progress={languageProgress}
            />

            <div className="mt-8 min-w-0">
              <div className="min-w-0">
                <div>
                  <h2 className="text-2xl font-semibold leading-tight text-foreground [word-break:keep-all]">
                    {languageQuestion.title}
                  </h2>
                  {languageQuestion.intro && (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground [word-break:keep-all]">
                      {languageQuestion.intro}
                    </p>
                  )}
                  {languageQuestion.notice && (
                    <p className="mt-3 rounded-2xl border border-border bg-secondary p-4 text-sm leading-relaxed text-muted-foreground [word-break:keep-all]">
                      {languageQuestion.notice}
                    </p>
                  )}
                </div>

                <div className="mt-6 grid gap-3 xl:grid-cols-2">
                  {languageQuestion.options.map((option) => {
                    const selected = selectedLanguageAnswer === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        className={cn(
                          "rounded-2xl border p-4 text-left transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                          selected
                            ? "border-primary bg-accent shadow-sm"
                            : "border-border bg-card hover:border-primary hover:shadow-sm",
                        )}
                        onClick={() => selectLanguageAnswer(option.value)}
                      >
                        <AnswerMarker selected={selected} />
                        <span className="ml-8 -mt-5 block [word-break:keep-all]">
                          <span className="block text-base font-semibold text-foreground">
                            {option.label}
                          </span>
                          <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                            {option.description}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                {needsIlacCampus && (
                  <div className="mt-6 rounded-3xl border border-[#FFE8CC] bg-[#FFF7ED] p-4 sm:p-5">
                    <h3 className="text-lg font-semibold text-foreground [word-break:keep-all]">
                      {LANGUAGE_STUDY_ILAC_CAMPUS_QUESTION.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground [word-break:keep-all]">
                      {LANGUAGE_STUDY_ILAC_CAMPUS_QUESTION.notice}
                    </p>
                    <div className="mt-4 grid gap-3 xl:grid-cols-2">
                      {LANGUAGE_STUDY_ILAC_CAMPUS_QUESTION.options.map((option) => {
                        const campusValue = option.value as IlacCampusAnswer;
                        const selected = languageAnswers.ilacCampus === campusValue;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            className={cn(
                              "rounded-2xl border bg-card p-4 text-left transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                              selected
                                ? "border-primary bg-accent shadow-sm"
                                : "border-[#FFE8CC] hover:border-primary hover:shadow-sm",
                            )}
                            onClick={() => selectIlacCampus(campusValue)}
                          >
                            <AnswerMarker selected={selected} />
                            <span className="ml-8 -mt-5 block [word-break:keep-all]">
                              <span className="block text-base font-semibold text-foreground">
                                {option.label}
                              </span>
                              <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                                {option.description}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {languageQuestion.footerNote && (
                  <p className="mt-5 rounded-2xl border border-[#FFE8CC] bg-[#FFF7ED] p-4 text-xs leading-relaxed text-muted-foreground [word-break:keep-all]">
                    {languageQuestion.footerNote}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (languageStep === 0) {
                    showOverview();
                    return;
                  }
                  setLanguageStep((prev) => prev - 1);
                }}
              >
                <ChevronLeft className="h-4 w-4" />
                이전
              </Button>
              <Button type="button" disabled={!canGoNextLanguage} onClick={goNextLanguage}>
                {languageStep === LANGUAGE_STUDY_QUESTIONS.length - 1 ? "결과 보기" : "다음"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            </section>
          </QuestionShellWithHelper>
        )}

        {mode === "languageResult" && languageResult && (
          <LanguageStudyResultSection
            calculation={languageResult}
            supportNotice={supportNotice}
            onSupportClick={() => setSupportNotice(true)}
            onRestart={startLanguageWizard}
            onStartGeneral={startGeneralChecklist}
          />
        )}

        {mode === "studyIntro" && (
          <section className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              {STUDY_ABROAD_INTRO.label}
            </p>
            <h2 className="mt-3 text-2xl font-semibold leading-tight text-foreground [word-break:keep-all] sm:text-3xl">
              {STUDY_ABROAD_INTRO.title}
            </h2>
            <div className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground [word-break:keep-all] sm:text-base">
              {STUDY_ABROAD_INTRO.paragraphs.map((paragraph, index) => (
                <p key={paragraph} className={index >= 2 ? "font-medium text-foreground" : undefined}>
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button type="button" variant="outline" size="lg" onClick={showOverview}>
                <ChevronLeft className="h-4 w-4" />
                이전
              </Button>
              <Button type="button" size="lg" onClick={startStudyWizard}>
                시작하기
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </section>
        )}

        {mode === "studyWizard" && studyQuestion && (
          <QuestionShellWithHelper
            helper={hasQuestionSideHelper(studyQuestion) ? <QuestionSideHelper question={studyQuestion} /> : null}
          >
            <section
              className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8"
              data-testid="checklist-question-card"
            >
            <WizardHeader
              countLabel={`${studyStep + 1} / ${STUDY_ABROAD_QUESTIONS.length}`}
              title="유학 기준역 추천"
              progress={studyProgress}
            />

            <div className="mt-8 min-w-0">
              <div className="min-w-0">
                <div>
                  <h2 className="text-2xl font-semibold leading-tight text-foreground [word-break:keep-all]">
                    {studyQuestion.title}
                  </h2>
                  {studyQuestion.intro && (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground [word-break:keep-all]">
                      {studyQuestion.intro}
                    </p>
                  )}
                  {studyQuestion.notice && (
                    <p className="mt-3 rounded-2xl border border-border bg-secondary p-4 text-sm leading-relaxed text-muted-foreground [word-break:keep-all]">
                      {studyQuestion.notice}
                    </p>
                  )}
                </div>

                <div className="mt-6 grid gap-3 xl:grid-cols-2">
                  {studyQuestion.options.map((option) => {
                    const selected = selectedStudyAnswer === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        className={cn(
                          "rounded-2xl border p-4 text-left transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                          selected
                            ? "border-primary bg-accent shadow-sm"
                            : "border-border bg-card hover:border-primary hover:shadow-sm",
                        )}
                        onClick={() => selectStudyAnswer(option.value)}
                      >
                        <AnswerMarker selected={selected} />
                        <span className="ml-8 -mt-5 block [word-break:keep-all]">
                          <span className="block text-base font-semibold text-foreground">
                            {option.label}
                          </span>
                          <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                            {option.description}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                {needsGeorgeBrownCampus && (
                  <StudySubQuestionCard
                    question={STUDY_ABROAD_GEORGE_BROWN_CAMPUS_QUESTION}
                    selectedValue={studyAnswers.georgeBrownCampus}
                    onSelect={(value) => selectGeorgeBrownCampus(value as GeorgeBrownCampusAnswer)}
                  />
                )}

                {needsIlacHigherProgram && (
                  <StudySubQuestionCard
                    question={STUDY_ABROAD_ILAC_HIGHER_QUESTION}
                    selectedValue={studyAnswers.ilacHigherProgram}
                    onSelect={(value) => selectIlacHigherProgram(value as IlacHigherAnswer)}
                  />
                )}

                {needsCentennialCampus && (
                  <StudySubQuestionCard
                    question={STUDY_ABROAD_CENTENNIAL_CAMPUS_QUESTION}
                    selectedValue={studyAnswers.centennialCampus}
                    onSelect={(value) => selectCentennialCampus(value as CentennialCampusAnswer)}
                  />
                )}

                {studyQuestion.footerNote && (
                  <p className="mt-5 rounded-2xl border border-[#FFE8CC] bg-[#FFF7ED] p-4 text-xs leading-relaxed text-muted-foreground [word-break:keep-all]">
                    {studyQuestion.footerNote}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (studyStep === 0) {
                    showOverview();
                    return;
                  }
                  setStudyStep((prev) => prev - 1);
                }}
              >
                <ChevronLeft className="h-4 w-4" />
                이전
              </Button>
              <Button type="button" disabled={!canGoNextStudy} onClick={goNextStudy}>
                {studyStep === STUDY_ABROAD_QUESTIONS.length - 1 ? "결과 보기" : "다음"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            </section>
          </QuestionShellWithHelper>
        )}

        {mode === "studyResult" && studyResult && (
          <StudyAbroadResultSection
            calculation={studyResult}
            supportNotice={supportNotice}
            onSupportClick={() => setSupportNotice(true)}
            onRestart={startStudyWizard}
            onStartGeneral={startGeneralChecklist}
          />
        )}

        {mode === "generalWizard" && generalQuestion && (
          <section className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
            <WizardHeader
              countLabel={`${generalStep + 1} / ${GENERAL_CHECKLIST_QUESTIONS.length}`}
              title="캐나다 집 구하기 체크리스트"
              progress={generalProgress}
            />
            <div className="mt-8">
              <p className="text-sm font-semibold text-primary">General Checklist</p>
              <h2 className="mt-2 text-2xl font-semibold leading-tight text-foreground [word-break:keep-all]">
                {generalQuestion.title}
              </h2>
              {generalStep === 0 && (
                <p className="mt-3 max-w-4xl text-sm leading-7 text-muted-foreground [word-break:keep-all]">
                  <span className="block">
                    이 체크리스트는 가구, 인터넷, 공과금 포함 여부 같은 단순 옵션 확인표가 아닙니다.
                  </span>
                  <span className="block">
                    이 매물이 내 상황에 맞는 선택인지 판단하기 위한 질문입니다.
                  </span>
                </p>
              )}
              {selectedGeneralOptions.length === 0 && (
                <p className="mt-3 rounded-2xl border border-border bg-secondary p-4 text-sm leading-relaxed text-muted-foreground [word-break:keep-all]">
                  아직 체크한 항목이 없어도 다음으로 넘어갈 수 있습니다. 다만 매물을 결정하기 전에는 다시
                  확인해보는 것을 권장합니다.
                </p>
              )}
            </div>

            <div className="mt-6 grid gap-3 xl:grid-cols-2">
              {generalQuestion.options.map((option) => {
                const selected = selectedGeneralOptions.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    className={cn(
                      "rounded-2xl border p-4 text-left transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                      selected
                        ? "border-primary bg-accent shadow-sm"
                        : "border-border bg-card hover:border-primary hover:shadow-sm",
                    )}
                    onClick={() => toggleGeneralOption(option)}
                  >
                    <AnswerMarker selected={selected} />
                    <span className="ml-8 -mt-5 block text-sm font-medium leading-relaxed text-foreground [word-break:keep-all]">
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (generalStep === 0) {
                    showOverview();
                    return;
                  }
                  setGeneralStep((prev) => prev - 1);
                }}
              >
                <ChevronLeft className="h-4 w-4" />
                이전
              </Button>
              <Button type="button" onClick={goNextGeneral}>
                {generalStep === GENERAL_CHECKLIST_QUESTIONS.length - 1 ? "결과 보기" : "다음"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </section>
        )}

        {mode === "generalResult" && (
          <GeneralChecklistResult
            answers={generalAnswers}
            supportNotice={supportNotice}
            onSupportClick={() => setSupportNotice(true)}
            onRestart={startGeneralChecklist}
          />
        )}

        {mode !== "restoringResult" && !isHousingQuestion && <HousingGuideSection />}
      </Container>
    </main>
  );
}

function HeroSection({ onStartGeneral }: { onStartGeneral: () => void }) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.15fr_0.85fr] lg:p-10">
        <div className="min-w-0">
          <p className="inline-flex w-fit rounded-full border border-[#FFE8CC] bg-[#FFF7ED] px-3 py-1 text-xs font-semibold text-primary">
            Toronto Station Checklist · MVP
          </p>
          <h1 className="mt-5 max-w-3xl text-[2rem] font-semibold leading-[1.16] text-foreground [word-break:keep-all] sm:text-[2.35rem] lg:text-[2.65rem]">
            <span className="block">처음 토론토에서 집을 <span className="whitespace-nowrap">구할 때,</span></span>
            <span className="block">어디부터 봐야 할까요?</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground [word-break:keep-all] sm:text-lg">
            <span className="block">몇 가지 질문에 답하면 내 목적과 예산, 생활 방식에 맞는 기준 역을</span>
            <span className="block">추천해드립니다.</span>
          </p>
        </div>

        <article className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            MapleHouse Checklist
          </p>
          <h2 className="mt-4 text-2xl font-semibold leading-tight text-foreground [word-break:keep-all]">
            캐나다 집 구하기 체크리스트
          </h2>
          <div className="mt-4 max-w-xl space-y-4 text-sm leading-7 text-muted-foreground [word-break:keep-all]">
            <p>
              <span className="block">매물 정보만 보고 판단하기 어려운 부분을</span>
              <span className="block">질문별로 확인해보세요.</span>
            </p>
            <p>
              <span className="block">위치, 예산, 생활 동선, 메이플스코어(매물 신용 점수)를</span>
              <span className="block">순서대로 스스로 점검해볼 수 있습니다.</span>
            </p>
          </div>
          <div className="mt-auto pt-7">
            <Button type="button" className="w-full" onClick={onStartGeneral}>
              체크리스트 시작하기
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </article>
      </div>
    </section>
  );
}

function TranslatedHeroSection({
  content,
  onStartGeneral,
}: {
  content: ChecklistLocaleContent;
  onStartGeneral: () => void;
}) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.15fr_0.85fr] lg:p-10">
        <div className="min-w-0">
          <p className="inline-flex w-fit rounded-full border border-[#FFE8CC] bg-[#FFF7ED] px-3 py-1 text-xs font-semibold text-primary">
            {content.overview.heroLabel}
          </p>
          <h1 className="mt-5 max-w-3xl text-[2rem] font-semibold leading-[1.16] text-foreground sm:text-[2.35rem] lg:text-[2.65rem]">
            {content.overview.heroTitle}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {content.overview.subtitle}
          </p>
        </div>

        <article className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            {content.overview.cardLabel}
          </p>
          <h2 className="mt-4 text-2xl font-semibold leading-tight text-foreground">
            {content.overview.cardTitle}
          </h2>
          <div className="mt-4 max-w-xl space-y-4 text-sm leading-7 text-muted-foreground">
            {content.overview.cardDescription.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-auto pt-7">
            <Button type="button" className="w-full" onClick={onStartGeneral}>
              {content.overview.cardButton}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </article>
      </div>
    </section>
  );
}

function TranslatedWorkingResultSection({
  locale,
  content,
  calculation,
  supportNotice,
  onSupportClick,
  onRestart,
  onStartGeneral,
}: {
  locale: TranslatedChecklistLocale;
  content: ChecklistLocaleContent;
  calculation: CalculationResult;
  supportNotice: boolean;
  onSupportClick: () => void;
  onRestart: () => void;
  onStartGeneral: () => void;
}) {
  const result = content.recommendationResults[calculation.resultId] ?? calculation.result;
  const budgetComment = content.budgetComments[calculation.budgetKey] ?? calculation.budgetComment;
  return (
    <section className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <p className="text-sm font-semibold text-primary">{content.workingResult.eyebrow}</p>
      <h2 className="mt-2 text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
        {content.workingResult.title}
      </h2>
      <div className="mt-4 space-y-1 text-sm leading-relaxed text-muted-foreground">
        {content.workingResult.explanation.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      <div className="mt-6 rounded-3xl border border-border bg-card p-5 sm:p-6">
        <h3 className="text-xl font-semibold text-foreground">{result.title}</h3>

        <div className="mt-6 rounded-3xl border border-[#FFE8CC] bg-[#FFF7ED] p-5 shadow-sm">
          <p className="text-sm font-semibold text-primary">{content.workingResult.stationTitle}</p>
          <div className="mt-4 grid gap-3">
            {result.stations.map((station, index) => (
              <div
                key={station}
                className="flex items-center gap-4 rounded-2xl border border-[#FFE8CC] bg-card p-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {index + 1}
                </span>
                <StationNameLines station={station} locale={locale} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <InfoBlock title={content.workingResult.reasonTitle} body={result.reason} />
          <InfoBlock title={content.workingResult.nearbyTitle} body={result.nearby} />
          <div className="rounded-2xl border border-border bg-card p-4">
            <h4 className="text-sm font-semibold text-foreground">
              {content.workingResult.goodForTitle}
            </h4>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
              {result.goodFor.map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <InfoBlock title={budgetComment.label} body={budgetComment.comment} />
        </div>

        <div className="mt-4 rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">
            {content.workingResult.cautionLabel}
          </span>{" "}
          {result.caution}
        </div>
      </div>

      <LegalScopeNotice lines={content.legalScopeNoticeLines} />

      {supportNotice && (
        <p className="mt-4 rounded-2xl border border-[#FFE8CC] bg-[#FFF7ED] p-4 text-sm font-medium text-foreground">
          {content.workingResult.supportNotice}
        </p>
      )}

      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Button asChild>
          <a href={buildChecklistListingsHref("workingHoliday", result.stations, result.title, locale)}>
            {content.workingResult.viewListings}
            <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
        <Button type="button" variant="outline" onClick={onStartGeneral}>
          {content.workingResult.startChecklist}
        </Button>
        <Button type="button" variant="outline" onClick={onRestart}>
          <RotateCcw className="h-4 w-4" />
          {content.workingResult.retake}
        </Button>
        <Button type="button" variant="soft" onClick={onSupportClick}>
          {content.workingResult.support}
        </Button>
      </div>
    </section>
  );
}

function TranslatedLanguageStudyResultSection({
  locale,
  content,
  calculation,
  supportNotice,
  onSupportClick,
  onRestart,
  onStartGeneral,
}: {
  locale: TranslatedChecklistLocale;
  content: ChecklistLocaleContent;
  calculation: LanguageStudyCalculationResult;
  supportNotice: boolean;
  onSupportClick: () => void;
  onRestart: () => void;
  onStartGeneral: () => void;
}) {
  const localizedResult =
    content.languageStudy.resultTemplates[calculation.resultId] ?? calculation.result;
  const budgetComment =
    content.languageStudy.budgetComments[calculation.budgetKey] ?? calculation.budgetComment;
  const {
    destinationStations,
    recommendedStations,
    comparisonStations,
  } = calculation;
  const nearbyStations = comparisonStations.length > 0 ? comparisonStations : recommendedStations;
  const comparisonText = nearbyStations
    .map((station) => formatStationDisplayName(station, locale))
    .join(", ");
  const resultLabels = content.languageStudy.result;

  return (
    <section className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <p className="text-sm font-semibold text-primary">{resultLabels.eyebrow}</p>
      <h2 className="mt-2 text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
        {resultLabels.title}
      </h2>
      <div className="mt-4 space-y-1 text-sm leading-relaxed text-muted-foreground">
        {resultLabels.description.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      <div className="mt-6 rounded-3xl border border-border bg-card p-5 sm:p-6">
        <h3 className="text-xl font-semibold text-foreground">{localizedResult.title}</h3>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {destinationStations.length > 0 && (
            <div className="rounded-3xl border border-[#FFE8CC] bg-[#FFF7ED] p-5 shadow-sm">
              <p className="text-sm font-semibold text-primary">{resultLabels.destinationTitle}</p>
              <div className="mt-4 grid gap-3">
                {destinationStations.map((station, index) => (
                  <div
                    key={station}
                    className="flex items-center gap-4 rounded-2xl border border-[#FFE8CC] bg-card p-4"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <StationNameLines station={station} locale={locale} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-3xl border border-[#FFE8CC] bg-[#FFF7ED] p-5 shadow-sm">
            <p className="text-sm font-semibold text-primary">
              {destinationStations.length > 0
                ? resultLabels.comparisonTitle
                : resultLabels.recommendationTitle}
            </p>
            <div className="mt-4 grid gap-3">
              {recommendedStations.map((station, index) => (
                <div
                  key={station}
                  className="flex items-center gap-4 rounded-2xl border border-[#FFE8CC] bg-card p-4"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <StationNameLines station={station} locale={locale} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <InfoBlock
            title={resultLabels.reasonTitle}
            body={`${resultLabels.reasonPrefix} ${localizedResult.reason}`}
          />
          <InfoBlock
            title={resultLabels.nearbyTitle}
            body={`${resultLabels.nearbyPrefix} ${comparisonText} ${resultLabels.nearbySuffix}`}
          />
          <InfoBlock title={resultLabels.goodForTitle} body={localizedResult.goodFor} />
          <InfoBlock title={budgetComment.label} body={budgetComment.comment} />
        </div>

        <div className="mt-4 rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">{resultLabels.importantNotesTitle}:</span>{" "}
          {localizedResult.caution}
        </div>
      </div>

      <LegalScopeNotice lines={content.languageStudy.legalNoticeLines} />

      {supportNotice && (
        <p className="mt-4 rounded-2xl border border-[#FFE8CC] bg-[#FFF7ED] p-4 text-sm font-medium text-foreground">
          {resultLabels.supportNotice}
        </p>
      )}

      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Button asChild>
          <a
            href={buildChecklistListingsHref(
              "languageStudy",
              uniqueStations([...destinationStations, ...recommendedStations]),
              localizedResult.title,
              locale,
            )}
          >
            {resultLabels.viewListings}
            <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
        <Button type="button" variant="outline" onClick={onStartGeneral}>
          {resultLabels.startChecklist}
        </Button>
        <Button type="button" variant="outline" onClick={onRestart}>
          <RotateCcw className="h-4 w-4" />
          {resultLabels.retake}
        </Button>
        <Button type="button" variant="soft" onClick={onSupportClick}>
          {resultLabels.support}
        </Button>
      </div>
    </section>
  );
}

function WorkingResultSection({
  calculation,
  supportNotice,
  onSupportClick,
  onRestart,
  onStartGeneral,
}: {
  calculation: CalculationResult;
  supportNotice: boolean;
  onSupportClick: () => void;
  onRestart: () => void;
  onStartGeneral: () => void;
}) {
  const { result, budgetComment } = calculation;
  const comparisonItems = result.nearbyItems ?? [];
  const hasComparisonItems = comparisonItems.length > 0;

  return (
    <section
      className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8"
      data-testid="working-result-section"
    >
      <p className="text-sm font-semibold text-primary">Recommendation Result</p>
      <h2 className="mt-2 text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
        당신에게 맞는 기준역 후보
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground [word-break:keep-all]">
        아래 추천은 정답이 아니라 집을 찾기 시작할 기준점입니다. 실제 출퇴근 시간, 매물 상태,
        계약 조건은 반드시 직접 확인해야 합니다.
      </p>

      <div className="mt-6 rounded-3xl border border-border bg-card p-5 sm:p-6">
        <h3 className="text-xl font-semibold text-foreground [word-break:keep-all]">{result.title}</h3>

        <StationRankSection
          className="mt-6"
          title="추천 기준역"
          stations={result.stations}
        />

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className={cn(!hasComparisonItems && "lg:col-span-2")}>
            <StationExplanationBlock
              title="추천 기준역"
              stations={result.stations}
              items={result.reasonItems}
              roleLabel="추천 기준역"
            />
          </div>
          {hasComparisonItems && (
            <StationExplanationBlock
              title="근처 비교 범위"
              stations={comparisonItems.map((item) => item.stationId)}
              items={comparisonItems}
              roleLabel="근처 비교 범위"
            />
          )}
          <SummaryBlock
            title="이런 분께 맞아요"
            body={result.userFitSummary}
            fallback={result.goodFor.join(" ")}
          />
          <InfoBlock title={budgetComment.label} body={budgetComment.comment} />
        </div>

        <div className="mt-4 rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground [word-break:keep-all]">
          <span className="font-semibold text-foreground">주의:</span> {result.caution}
        </div>
      </div>

      <LegalScopeNotice lines={WORKING_HOLIDAY_LEGAL_NOTICE_LINES} />

      {supportNotice && (
        <p className="mt-4 rounded-2xl border border-[#FFE8CC] bg-[#FFF7ED] p-4 text-sm font-medium text-foreground [word-break:keep-all]">
          메이플하우스와 함께 문의하기는 유료 플랜 흐름으로 연결될 예정입니다. 현재는 MVP 미리보기 단계입니다.
        </p>
      )}

      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Button asChild>
          <a href={buildChecklistListingsHref("workingHoliday", result.stations, result.title)}>
            매물 리스트 보기
            <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
        <Button type="button" variant="outline" onClick={onStartGeneral}>
          체크리스트 시작하기
        </Button>
        <Button type="button" variant="outline" onClick={onRestart}>
          <RotateCcw className="h-4 w-4" />
          다시 설문하기
        </Button>
        <Button type="button" variant="soft" onClick={onSupportClick}>
          메이플하우스와 함께 문의하기
        </Button>
      </div>
    </section>
  );
}

function LanguageStudyResultSection({
  calculation,
  supportNotice,
  onSupportClick,
  onRestart,
  onStartGeneral,
}: {
  calculation: LanguageStudyCalculationResult;
  supportNotice: boolean;
  onSupportClick: () => void;
  onRestart: () => void;
  onStartGeneral: () => void;
}) {
  const {
    result,
    budgetComment,
    destinationStations,
    recommendedStations,
  } = calculation;

  return (
    <section className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <p className="text-sm font-semibold text-primary">Language Study Result</p>
      <h2 className="mt-2 text-2xl font-semibold leading-tight text-foreground [word-break:keep-all] sm:text-3xl">
        당신에게 맞는 기준역 후보
      </h2>
      <div className="mt-4 space-y-1 text-sm leading-relaxed text-muted-foreground [word-break:keep-all]">
        <p>아래 추천은 정답이 아니라 집을 찾기 시작할 기준점입니다.</p>
        <p>실제 통학 시간, 수업 시간, 매물 상태, 계약 조건은 반드시 직접 확인해야 합니다.</p>
      </div>

      <div className="mt-6 rounded-3xl border border-border bg-card p-5 sm:p-6">
        <h3 className="text-xl font-semibold text-foreground [word-break:keep-all]">
          {result.title}
        </h3>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {destinationStations.length > 0 && (
            <StationRankSection
              title="어학원 도착 기준역"
              stations={destinationStations}
            />
          )}

          <StationRankSection
            title={destinationStations.length > 0 ? "집 찾기 비교 기준역" : "추천 기준역"}
            stations={recommendedStations}
          />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {destinationStations.length > 0 && (
            <StationExplanationBlock
              title="어학원 도착 기준역"
              stations={destinationStations}
              items={result.reasonItems}
              roleLabel="어학원 도착 기준역"
            />
          )}
          <StationExplanationBlock
            title="근처 비교 범위"
            stations={recommendedStations}
            items={result.reasonItems}
            roleLabel="집 찾기 비교 기준역"
          />
          <SummaryBlock
            title="이런 분께 맞아요"
            body={result.userFitSummary}
            fallback={result.goodFor}
          />
          <InfoBlock title={budgetComment.label} body={budgetComment.comment} />
        </div>

        <div className="mt-4 rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground [word-break:keep-all]">
          <span className="font-semibold text-foreground">주의:</span> {result.caution}
        </div>
      </div>

      <LegalScopeNotice lines={LANGUAGE_STUDY_LEGAL_NOTICE_LINES} />

      {supportNotice && (
        <p className="mt-4 rounded-2xl border border-[#FFE8CC] bg-[#FFF7ED] p-4 text-sm font-medium text-foreground [word-break:keep-all]">
          메이플하우스와 함께 문의하기는 유료 플랜 흐름으로 연결될 예정입니다. 현재는 MVP 미리보기 단계입니다.
        </p>
      )}

      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Button asChild>
          <a
            href={buildChecklistListingsHref(
              "languageStudy",
              uniqueStations([...destinationStations, ...recommendedStations]),
              result.title,
            )}
          >
            매물 리스트 보기
            <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
        <Button type="button" variant="outline" onClick={onStartGeneral}>
          체크리스트 시작하기
        </Button>
        <Button type="button" variant="outline" onClick={onRestart}>
          <RotateCcw className="h-4 w-4" />
          다시 설문하기
        </Button>
        <Button type="button" variant="soft" onClick={onSupportClick}>
          메이플하우스와 함께 문의하기
        </Button>
      </div>
    </section>
  );
}

function StudyAbroadResultSection({
  calculation,
  supportNotice,
  onSupportClick,
  onRestart,
  onStartGeneral,
}: {
  calculation: StudyAbroadCalculationResult;
  supportNotice: boolean;
  onSupportClick: () => void;
  onRestart: () => void;
  onStartGeneral: () => void;
}) {
  const {
    result,
    budgetComment,
    campusStations,
    recommendedStations,
    cautionLines,
  } = calculation;
  const legalLines = [
    "이 추천은 정답이 아니라 집을 찾기 위한 탐색 시작점입니다.",
    "실제 통학 시간과 경로는 수업 시간, 날씨, 교통 상황에 따라 달라질 수 있습니다.",
    "계약 전에는 반드시 지도 길찾기로 직접 확인해 주세요.",
    "학교 등록 정보, 캠퍼스 주소, 수업 시간표는 반드시 학교 공식 안내에서 다시 확인해야 합니다.",
    "메이플하우스는 학교 등록 대행, 비자 자문, 법률 자문, 부동산 중개, 송금 대행을 제공하지 않습니다.",
    "최종 주거 결정, 계약 여부, 송금 여부는 사용자가 직접 판단해야 합니다.",
  ];

  return (
    <section className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <p className="text-sm font-semibold text-primary">Study Abroad Result</p>
      <h2 className="mt-2 text-2xl font-semibold leading-tight text-foreground [word-break:keep-all] sm:text-3xl">
        당신에게 맞는 기준역 후보
      </h2>
      <div className="mt-4 space-y-1 text-sm leading-relaxed text-muted-foreground [word-break:keep-all]">
        <p>아래 추천은 정답이 아니라 집을 찾기 시작할 기준점입니다.</p>
        <p>실제 통학 시간, 수업 시간, 매물 상태, 계약 조건은 반드시 직접 확인해야 합니다.</p>
      </div>

      <div className="mt-6 rounded-3xl border border-border bg-card p-5 sm:p-6">
        <h3 className="text-xl font-semibold text-foreground [word-break:keep-all]">
          {result.title}
        </h3>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <StationRankSection
            title="학교/캠퍼스 기준역"
            stations={campusStations}
          />

          <StationRankSection
            title="집 찾기 비교 기준역"
            stations={recommendedStations}
          />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <StationExplanationBlock
            title="학교/캠퍼스 기준역"
            stations={campusStations}
            items={result.reasonItems}
            roleLabel="학교/캠퍼스 기준역"
          />
          <StationExplanationBlock
            title="근처 비교 범위"
            stations={recommendedStations}
            items={result.reasonItems}
            roleLabel="집 찾기 비교 기준역"
          />
          <SummaryBlock
            title="이런 분께 맞아요"
            body={result.userFitSummary}
            fallback={result.goodFor}
          />
          <InfoBlock title={budgetComment.label} body={budgetComment.comment} />
        </div>

        <div className="mt-4 rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground [word-break:keep-all]">
          <p>
            <span className="font-semibold text-foreground">주의:</span> {result.caution}
          </p>
          {cautionLines.map((line) => (
            <p key={line} className="mt-2">
              {line}
            </p>
          ))}
        </div>
      </div>

      <LegalScopeNotice lines={legalLines} />

      {supportNotice && (
        <p className="mt-4 rounded-2xl border border-[#FFE8CC] bg-[#FFF7ED] p-4 text-sm font-medium text-foreground [word-break:keep-all]">
          메이플하우스와 함께 문의하기는 유료 플랜 흐름으로 연결될 예정입니다. 현재는 MVP 미리보기 단계입니다.
        </p>
      )}

      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Button asChild>
          <a
            href={buildChecklistListingsHref(
              "studyAbroad",
              uniqueStations([...campusStations, ...recommendedStations]),
              result.title,
            )}
          >
            매물 리스트 보기
            <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
        <Button type="button" variant="outline" onClick={onStartGeneral}>
          체크리스트 시작하기
        </Button>
        <Button type="button" variant="outline" onClick={onRestart}>
          <RotateCcw className="h-4 w-4" />
          다시 설문하기
        </Button>
        <Button type="button" variant="soft" onClick={onSupportClick}>
          메이플하우스와 함께 문의하기
        </Button>
      </div>
    </section>
  );
}

function GeneralChecklistResult({
  answers,
  supportNotice,
  onSupportClick,
  onRestart,
}: {
  answers: GeneralAnswers;
  supportNotice: boolean;
  onSupportClick: () => void;
  onRestart: () => void;
}) {
  const groupedAnswers = GENERAL_CHECKLIST_QUESTIONS.map((question) => ({
    title: question.resultTitle,
    items: answers[question.id] ?? [],
  }));
  const selectedCount = groupedAnswers.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <section className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <p className="text-sm font-semibold text-primary">General Checklist Result</p>
      <h2 className="mt-2 text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
        체크리스트 결과
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground [word-break:keep-all]">
        아래 내용은 최종 판단이 아니라, 현재 매물을 볼 때 확인해야 할 기준을 정리한 참고용입니다.
      </p>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-border bg-secondary p-5">
          <h3 className="text-xl font-semibold text-foreground">내가 체크한 판단 기준</h3>
          {selectedCount <= 2 && (
            <p className="mt-4 rounded-2xl border border-[#FFE8CC] bg-[#FFF7ED] p-4 text-sm leading-relaxed text-muted-foreground [word-break:keep-all]">
              아직 충분히 체크된 항목이 없습니다. 매물을 결정하기 전에 위치, 예산, 메이플스코어를 다시 확인해보세요.
            </p>
          )}
          <div className="mt-5 space-y-4">
            {groupedAnswers.map((group) => (
              <div key={group.title} className="rounded-2xl border border-border bg-card p-4">
                <h4 className="text-sm font-semibold text-foreground">{group.title}</h4>
                {group.items.length > 0 ? (
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
                    {group.items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="[word-break:keep-all]">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground [word-break:keep-all]">아직 체크한 항목이 없습니다.</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-xl font-semibold text-foreground">현재 선택한 매물 정보</h3>
          <div className="mt-5 rounded-2xl border border-dashed border-border bg-secondary p-5 text-sm leading-relaxed text-muted-foreground [word-break:keep-all]">
            아직 선택한 매물이 없습니다.
            <br />
            매물 리스트에서 관심 있는 매물을 선택하면, 체크리스트 결과와 매물 정보를 함께 비교할 수 있습니다.
          </div>
        </div>
      </div>

      <LegalScopeNotice />

      {supportNotice && (
        <p className="mt-4 rounded-2xl border border-[#FFE8CC] bg-[#FFF7ED] p-4 text-sm font-medium text-foreground [word-break:keep-all]">
          메이플하우스와 함께 문의하기는 유료 플랜 흐름으로 연결될 예정입니다. 현재는 MVP 미리보기 단계입니다.
        </p>
      )}

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        <Button type="button" variant="outline" onClick={onRestart}>
          <RotateCcw className="h-4 w-4" />
          다시 체크하기
        </Button>
        <Button asChild>
          <Link to="/ko/listings">
            매물 리스트 보기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button type="button" variant="soft" onClick={onSupportClick}>
          메이플하우스와 함께 문의하기
        </Button>
      </div>
    </section>
  );
}

function TranslatedGeneralChecklistResult({
  locale,
  content,
  answers,
  supportNotice,
  onSupportClick,
  onRestart,
}: {
  locale: TranslatedChecklistLocale;
  content: ChecklistLocaleContent;
  answers: GeneralAnswers;
  supportNotice: boolean;
  onSupportClick: () => void;
  onRestart: () => void;
}) {
  const groupedAnswers = content.generalQuestions.map((question) => ({
    title: question.resultTitle,
    items: answers[question.id] ?? [],
  }));
  const selectedCount = groupedAnswers.reduce((sum, group) => sum + group.items.length, 0);
  const listingsPath = locale === "en" ? "/en/listings" : "/fr/listings";

  return (
    <section className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <p className="text-sm font-semibold text-primary">{content.generalResult.eyebrow}</p>
      <h2 className="mt-2 text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
        {content.generalResult.title}
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {content.generalResult.subtitle}
      </p>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-border bg-secondary p-5">
          <h3 className="text-xl font-semibold text-foreground">
            {content.generalResult.checkedTitle}
          </h3>
          {selectedCount <= 2 && (
            <p className="mt-4 rounded-2xl border border-[#FFE8CC] bg-[#FFF7ED] p-4 text-sm leading-relaxed text-muted-foreground">
              {content.generalResult.emptyChecked}
            </p>
          )}
          <div className="mt-5 space-y-4">
            {groupedAnswers.map((group) => (
              <div key={group.title} className="rounded-2xl border border-border bg-card p-4">
                <h4 className="text-sm font-semibold text-foreground">{group.title}</h4>
                {group.items.length > 0 ? (
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
                    {group.items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">
                    {content.generalResult.noItems}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-xl font-semibold text-foreground">
            {content.generalResult.listingTitle}
          </h3>
          <div className="mt-5 rounded-2xl border border-dashed border-border bg-secondary p-5 text-sm leading-relaxed text-muted-foreground">
            {content.generalResult.noListing.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      </div>

      <LegalScopeNotice lines={content.legalScopeNoticeLines} />

      {supportNotice && (
        <p className="mt-4 rounded-2xl border border-[#FFE8CC] bg-[#FFF7ED] p-4 text-sm font-medium text-foreground">
          {content.generalResult.supportNotice}
        </p>
      )}

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        <Button type="button" variant="outline" onClick={onRestart}>
          <RotateCcw className="h-4 w-4" />
          {content.generalResult.retake}
        </Button>
        <Button asChild>
          <Link to={listingsPath}>
            {content.generalResult.viewListings}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button type="button" variant="soft" onClick={onSupportClick}>
          {content.generalResult.support}
        </Button>
      </div>
    </section>
  );
}

function StationNameLines({
  station,
  locale = "ko",
}: {
  station: string;
  locale?: Locale;
}) {
  const label = formatStationDisplayName(station, locale);
  const match = label.match(/^(.*?)\s*(\(.+\))$/);
  const englishName = match?.[1] ?? label;
  const koreanName = match?.[2];

  return (
    <span className="min-w-0 flex-1 leading-tight">
      <span className="block text-base font-bold text-foreground [word-break:keep-all] sm:text-lg">
        {englishName}
      </span>
      {koreanName && (
        <span className="mt-1 block text-sm font-semibold leading-snug text-muted-foreground [word-break:keep-all]">
          {koreanName}
        </span>
      )}
    </span>
  );
}

function StationRankSection({
  className,
  title,
  stations,
}: {
  className?: string;
  title: string;
  stations: string[];
}) {
  if (stations.length === 0) return null;

  return (
    <div className={cn("rounded-3xl border border-[#FFE8CC] bg-[#FFF7ED] p-5 shadow-sm", className)}>
      <p className="whitespace-nowrap text-sm font-semibold text-primary [word-break:keep-all]">{title}</p>
      <div className="mt-4 grid gap-3">
        {stations.map((station, index) => (
          <StationRankCard key={station} station={station} index={index} />
        ))}
      </div>
    </div>
  );
}

function StationRankCard({
  station,
  index,
}: {
  station: string;
  index: number;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#FFE8CC] bg-card p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
        {index + 1}
      </span>
      <StationNameLines station={station} />
    </div>
  );
}

function StationExplanationBlock({
  title,
  stations,
  items,
  roleLabel,
}: {
  title: string;
  stations: string[];
  items?: StationReasonItem[];
  roleLabel: string;
}) {
  if (stations.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h4 className="whitespace-nowrap text-sm font-semibold text-foreground [word-break:keep-all]">
        {title}
      </h4>
      <div className="mt-3 space-y-3">
        {stations.map((station) => (
          <StationExplanationItem
            key={`${roleLabel}-${station}`}
            station={station}
            reason={findStationReason(items, station, roleLabel)}
          />
        ))}
      </div>
    </div>
  );
}

function StationExplanationItem({
  station,
  reason,
}: {
  station: string;
  reason?: StationReasonItem;
}) {
  return (
    <div className="rounded-2xl border border-[#FFE8CC] bg-[#FFFDF9] p-3">
      <StationNameLines station={station} />
      {reason && (
        <div className="mt-2 space-y-1.5 text-sm leading-relaxed text-muted-foreground [word-break:keep-all]">
          <p>{reason.reasonBody}</p>
          {reason.answerEvidence && <p>{reason.answerEvidence}</p>}
        </div>
      )}
    </div>
  );
}

function findStationReason(
  items: StationReasonItem[] | undefined,
  station: string,
  roleLabel: string,
) {
  return (
    items?.find((item) => item.stationId === station && item.roleLabel === roleLabel) ??
    items?.find((item) => item.stationId === station)
  );
}

function uniqueStations(stations: string[]) {
  return Array.from(new Set(stations));
}

function buildChecklistListingsHref(
  source: "workingHoliday" | "languageStudy" | "studyAbroad",
  stations: string[],
  resultLabel: string,
  locale: Locale = "ko",
) {
  const params = new URLSearchParams();
  params.set("checklist", source);
  params.set("stations", uniqueStations(stations).join(","));
  params.set("label", resultLabel);

  return `/${locale}/listings?${params.toString()}`;
}

function HousingGlossaryPictogram({ type }: { type: HousingGlossaryPictogram }) {
  const common = {
    className: "h-10 w-10",
    viewBox: "0 0 48 48",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true,
  } as const;

  if (type === "room") {
    return (
      <svg {...common}>
        <rect x="7" y="9" width="34" height="30" rx="3" className="fill-white stroke-muted-foreground/45" strokeWidth="1.8" />
        <path d="M7 22h34M22 9v30M22 30h19" className="stroke-muted-foreground/45" strokeWidth="1.6" />
        <rect x="10" y="12" width="10" height="8" rx="1.5" className="fill-[#FFE8CC] stroke-primary" strokeWidth="2" />
        <path d="M12.5 17.5h5" className="stroke-primary" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "share") {
    return (
      <svg {...common}>
        <rect x="7" y="9" width="34" height="30" rx="3" className="fill-white stroke-primary/70" strokeWidth="1.8" strokeDasharray="3 2" />
        <path d="M7 22h34M20 9v30M31 9v30" className="stroke-muted-foreground/45" strokeWidth="1.5" />
        <rect x="9.5" y="11.5" width="8" height="8" rx="1.5" className="fill-[#FFE8CC] stroke-primary/80" strokeWidth="1.5" />
        <rect x="22.5" y="11.5" width="6.5" height="8" rx="1.5" className="fill-white stroke-muted-foreground/45" strokeWidth="1.3" />
        <rect x="32.5" y="11.5" width="6" height="8" rx="1.5" className="fill-white stroke-muted-foreground/45" strokeWidth="1.3" />
        <path d="M12 31h15M12 35h9" className="stroke-primary" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "studio") {
    return (
      <svg {...common}>
        <rect x="8" y="9" width="32" height="30" rx="4" className="fill-[#FFF7ED] stroke-primary/80" strokeWidth="2" />
        <rect x="12" y="25" width="13" height="8" rx="2" className="fill-white stroke-primary/75" strokeWidth="1.6" />
        <path d="M29 14h7M29 18h7M29 22h7" className="stroke-primary" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M13 15h9" className="stroke-muted-foreground/50" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "oneBedroom") {
    return (
      <svg {...common}>
        <rect x="7" y="9" width="34" height="30" rx="3" className="fill-white stroke-muted-foreground/45" strokeWidth="1.8" />
        <path d="M23 9v30M23 25h18" className="stroke-muted-foreground/50" strokeWidth="1.7" />
        <rect x="10" y="12" width="10" height="11" rx="1.5" className="fill-[#FFE8CC] stroke-primary" strokeWidth="1.8" />
        <path d="M27 15h10M27 20h8" className="stroke-primary" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="28" y="28" width="8" height="7" rx="1.5" className="fill-white stroke-primary/75" strokeWidth="1.5" />
        <circle cx="32" cy="31.5" r="1.1" className="fill-primary/70" />
      </svg>
    );
  }

  if (type === "den") {
    return (
      <svg {...common}>
        <rect x="7" y="10" width="34" height="29" rx="3" className="fill-white stroke-muted-foreground/45" strokeWidth="1.8" />
        <path d="M25 10v17M25 27h16" className="stroke-muted-foreground/45" strokeWidth="1.6" />
        <rect x="28" y="13" width="10" height="10" rx="1.5" className="fill-[#FFE8CC] stroke-primary" strokeWidth="1.8" />
        <path d="M30.5 18h5M33 18v3" className="stroke-primary" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M12 19h9M12 29h18" className="stroke-muted-foreground/50" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "basement") {
    return (
      <svg {...common}>
        <path d="M12 20 24 10l12 10v7H12z" className="fill-white stroke-muted-foreground/45" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M7 28h34" className="stroke-muted-foreground/55" strokeWidth="2" strokeLinecap="round" />
        <rect x="10" y="29" width="28" height="9" rx="2" className="fill-[#FFE8CC] stroke-primary" strokeWidth="1.8" />
        <path d="M15 34h18" className="stroke-primary" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect x="13" y="8" width="22" height="32" rx="3" className="fill-white stroke-muted-foreground/45" strokeWidth="1.8" />
      <rect x="17" y="14" width="5" height="5" rx="1" className="fill-[#FFE8CC] stroke-primary/80" strokeWidth="1.4" />
      <rect x="26" y="14" width="5" height="5" rx="1" className="fill-[#FFE8CC] stroke-primary/80" strokeWidth="1.4" />
      <rect x="17" y="23" width="5" height="5" rx="1" className="fill-white stroke-primary/70" strokeWidth="1.4" />
      <rect x="26" y="23" width="5" height="5" rx="1" className="fill-white stroke-primary/70" strokeWidth="1.4" />
      <path d="M21 39v-6h6v6" className="stroke-primary" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const KOREAN_HOUSING_GLOSSARY_CONTENT: HousingGlossaryContent = {
  trigger: "용어 보기",
  title: "캐나다에서 주로 쓰이는 주거 형태",
  closeLabel: "용어 설명 닫기",
  items: HOUSING_GLOSSARY,
};

function HousingGlossaryHelp({ glossary = KOREAN_HOUSING_GLOSSARY_CONTENT }: { glossary?: HousingGlossaryContent }) {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;

    function closeOnOutsideClick(event: PointerEvent) {
      if (!popoverRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <span ref={popoverRef} className="relative inline-flex w-fit">
      <button
        type="button"
        aria-expanded={open}
        className="inline-flex items-center gap-1 rounded-full border border-[#FFE8CC] bg-[#FFF7ED] px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        onClick={() => setOpen((current) => !current)}
      >
        <HelpCircle className="h-3.5 w-3.5" />
        {glossary.trigger}
      </button>

      <span
        className={cn(
          "absolute left-0 top-[calc(100%+0.75rem)] z-50 w-[min(90vw,24rem)] rounded-3xl border border-[#FFE8CC] bg-card p-4 text-left shadow-xl",
          open ? "block" : "hidden",
        )}
      >
        <span className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-foreground">{glossary.title}</span>
          <button
            type="button"
            className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label={glossary.closeLabel}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setOpen(false);
            }}
          >
            <X className="h-4 w-4" />
          </button>
        </span>
        <span className="mt-3 grid max-h-[24rem] gap-2 overflow-y-auto pr-1">
          {glossary.items.map((item) => (
            <span key={item.term} className="flex gap-3 rounded-2xl border border-border bg-secondary/60 p-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#FFE8CC] bg-[#FFF7ED]">
                {/* TODO: Add a richer housing-type explanation page later when visual examples are ready. */}
                <HousingGlossaryPictogram type={item.pictogram} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-foreground [word-break:keep-all]">
                  {item.term}
                </span>
                <span className="mt-1 block space-y-0.5 text-xs leading-relaxed text-muted-foreground [word-break:keep-all]">
                  {item.description.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </span>
            </span>
          ))}
        </span>
      </span>
    </span>
  );
}

type ChecklistQuestionWithSideHelper = {
  id: string;
  helpTitle?: string;
  helpItems?: { term: string; description: string }[];
};

function hasQuestionSideHelper(question: ChecklistQuestionWithSideHelper) {
  return question.id === "housingType" || Boolean(question.helpItems?.length);
}

function QuestionShellWithHelper({
  children,
  helper,
}: {
  children: ReactNode;
  helper?: ReactNode;
}) {
  const helperRailRef = useRef<HTMLDivElement>(null);
  const [reservedHelperHeight, setReservedHelperHeight] = useState(0);

  useEffect(() => {
    if (!helper || typeof window === "undefined") {
      setReservedHelperHeight(0);
      return;
    }

    const wideRailQuery = window.matchMedia("(min-width: 1860px)");
    const updateReservedHeight = () => {
      if (!wideRailQuery.matches || !helperRailRef.current) {
        setReservedHelperHeight(0);
        return;
      }

      setReservedHelperHeight(Math.ceil(helperRailRef.current.getBoundingClientRect().height));
    };

    updateReservedHeight();

    const helperRail = helperRailRef.current;
    const observer = typeof ResizeObserver !== "undefined" && helperRail ? new ResizeObserver(updateReservedHeight) : null;
    if (helperRail) {
      observer?.observe(helperRail);
    }
    wideRailQuery.addEventListener("change", updateReservedHeight);
    window.addEventListener("resize", updateReservedHeight);

    return () => {
      observer?.disconnect();
      wideRailQuery.removeEventListener("change", updateReservedHeight);
      window.removeEventListener("resize", updateReservedHeight);
    };
  }, [helper]);

  return (
    <div
      className="relative mt-8"
      data-testid={helper ? "checklist-question-with-rail" : undefined}
      style={reservedHelperHeight > 0 ? { minHeight: `${reservedHelperHeight}px` } : undefined}
    >
      {children}
      {helper && <QuestionSideHelperPlacement helper={helper} railRef={helperRailRef} />}
    </div>
  );
}

function QuestionSideHelperPlacement({
  helper,
  railRef,
}: {
  helper: ReactNode;
  railRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <>
      <div className="mt-4 min-[1860px]:hidden" data-testid="checklist-helper-stack">
        {helper}
      </div>
      <div
        ref={railRef}
        className="absolute left-[calc(100%+1.5rem)] top-0 hidden w-[20rem] min-[1860px]:block"
        data-testid="checklist-helper-rail"
      >
        {helper}
      </div>
    </>
  );
}

function QuestionSideHelper({
  question,
  glossary = KOREAN_HOUSING_GLOSSARY_CONTENT,
}: {
  question: ChecklistQuestionWithSideHelper;
  glossary?: HousingGlossaryContent;
}) {
  if (question.id === "housingType") {
    return <HousingGlossarySidePanel glossary={glossary} />;
  }

  if (!question.helpItems?.length) return null;

  return (
    <aside className="rounded-3xl border border-[#FFE8CC] bg-[#FFF7ED] p-4 text-sm leading-relaxed text-muted-foreground shadow-sm [word-break:keep-all] sm:p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground [word-break:keep-all]">
        <HelpCircle className="h-4 w-4 text-primary" />
        <span className="whitespace-nowrap">{question.helpTitle ?? "참고"}</span>
      </div>
      <div className="mt-4 grid gap-3">
        {question.helpItems.map((item) => (
          <div key={item.term} className="rounded-2xl border border-[#FFE8CC] bg-card p-3">
            <p className="font-semibold text-foreground [word-break:keep-all]">{item.term}</p>
            <p className="mt-1">{item.description}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}

function HousingGlossarySidePanel({ glossary }: { glossary: HousingGlossaryContent }) {
  return (
    <aside className="rounded-3xl border border-[#FFE8CC] bg-[#FFF7ED] p-4 shadow-sm [word-break:keep-all] sm:p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground [word-break:keep-all]">
        <Home className="h-4 w-4 text-primary" />
        <span className="whitespace-nowrap">{glossary.title}</span>
      </div>
      <div className="mt-4 grid gap-2">
        {glossary.items.map((item) => (
          <div key={item.term} className="flex gap-3 rounded-2xl border border-[#FFE8CC] bg-card p-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#FFE8CC] bg-[#FFF7ED]">
              <HousingGlossaryPictogram type={item.pictogram} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-foreground">{item.term}</span>
              <span className="mt-1 block space-y-0.5 text-xs leading-relaxed text-muted-foreground">
                {item.description.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}

function HousingGuideSection() {
  return (
    <section className="mt-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-semibold text-foreground [word-break:keep-all]">
          처음 집을 볼 때 주거 형태는 이렇게 생각해보세요.
        </h2>
        <HousingGlossaryHelp />
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {HOUSING_GUIDE.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="rounded-3xl border border-border bg-card p-5 shadow-sm">
              <Icon className="h-5 w-5 text-primary" />
              <h3 className="mt-4 text-lg font-semibold text-foreground [word-break:keep-all]">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground [word-break:keep-all]">{item.body}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function TranslatedHousingGuideSection({ content }: { content: ChecklistLocaleContent }) {
  const icons = [Home, WalletCards, Compass];

  return (
    <section className="mt-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-semibold text-foreground">{content.housingGuide.title}</h2>
        <HousingGlossaryHelp glossary={content.languageStudy.glossary} />
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {content.housingGuide.items.map((item, index) => {
          const Icon = icons[index] ?? Home;
          return (
            <article key={item.title} className="rounded-3xl border border-border bg-card p-5 shadow-sm">
              <Icon className="h-5 w-5 text-primary" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function WizardHeader({
  countLabel,
  title,
  progress,
}: {
  countLabel: string;
  title: string;
  progress: number;
}) {
  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-primary">{countLabel}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </>
  );
}

function StudySubQuestionCard({
  question,
  selectedValue,
  onSelect,
}: {
  question: StudyAbroadSubQuestion;
  selectedValue?: StudyAbroadAnswerValue;
  onSelect: (value: StudyAbroadAnswerValue) => void;
}) {
  return (
    <div className="mt-6 rounded-3xl border border-[#FFE8CC] bg-[#FFF7ED] p-4 sm:p-5">
      <h3 className="text-lg font-semibold text-foreground [word-break:keep-all]">
        {question.title}
      </h3>
      {question.notice && (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground [word-break:keep-all]">
          {question.notice}
        </p>
      )}
      <div className="mt-4 grid gap-3 xl:grid-cols-2">
        {question.options.map((option) => {
          const selected = selectedValue === option.value;
          return (
            <button
              key={option.value}
              type="button"
              className={cn(
                "rounded-2xl border bg-card p-4 text-left transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                selected
                  ? "border-primary bg-accent shadow-sm"
                  : "border-[#FFE8CC] hover:border-primary hover:shadow-sm",
              )}
              onClick={() => onSelect(option.value)}
            >
              <AnswerMarker selected={selected} />
              <span className="ml-8 -mt-5 block [word-break:keep-all]">
                <span className="block text-base font-semibold text-foreground">
                  {option.label}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                  {option.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AnswerMarker({ selected }: { selected: boolean }) {
  return (
    <span
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
        selected ? "border-primary bg-primary text-white" : "border-border",
      )}
    >
      {selected && <CheckCircle2 className="h-3.5 w-3.5" />}
    </span>
  );
}

function SummaryBlock({
  title,
  body,
  fallback,
}: {
  title: string;
  body?: string;
  fallback: string;
}) {
  return <InfoBlock title={title} body={body || fallback} />;
}

function InfoBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h4 className="text-sm font-semibold text-foreground [word-break:keep-all]">{title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground [word-break:keep-all]">{body}</p>
    </div>
  );
}

function LegalScopeNotice({ lines = LEGAL_SCOPE_NOTICE_LINES }: { lines?: string[] }) {
  return (
    <div className="mt-5 space-y-1 rounded-2xl border border-border bg-secondary p-4 text-xs leading-6 text-muted-foreground [word-break:keep-all]">
      {lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  );
}
