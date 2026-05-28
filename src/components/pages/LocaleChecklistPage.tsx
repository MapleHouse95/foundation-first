import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Compass,
  Home,
  RotateCcw,
  WalletCards,
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
  formatStationDisplayName,
  GENERAL_CHECKLIST_QUESTIONS,
  type GeneralChecklistQuestionId,
  isCompleteAnswerMap,
  isCompleteLanguageStudyAnswerMap,
  LANGUAGE_STUDY_ILAC_CAMPUS_QUESTION,
  LANGUAGE_STUDY_INTRO,
  LANGUAGE_STUDY_QUESTIONS,
  type IlacCampusAnswer,
  type LanguageStudyAnswerMap,
  type LanguageStudyAnswerValue,
  type AnswerMap,
  type AnswerValue,
  WORKING_HOLIDAY_QUESTIONS,
} from "@/lib/stationRecommendationData";

type KoreanMode =
  | "overview"
  | "workingIntro"
  | "workingWizard"
  | "workingResult"
  | "languageIntro"
  | "languageWizard"
  | "languageResult"
  | "generalWizard"
  | "generalResult";
type CalculationResult = ReturnType<typeof calculateStationRecommendation>;
type LanguageStudyCalculationResult = ReturnType<typeof calculateLanguageStudyRecommendation>;
type GeneralAnswers = Partial<Record<GeneralChecklistQuestionId, string[]>>;

const CHECKLIST_MAIN_EVENT = "maplehouse:checklist-main";

const LEGAL_SCOPE_NOTICE_LINES = [
  "이 추천은 정답이 아니라 탐색 시작점을 잡기 위한 참고용입니다. 실제 통학/출근 시간, 매물 상태, 계약 조건, 송금 여부는 사용자가 직접 확인해야 합니다.",
  "메이플하우스는 계약 당사자가 아니며, 법률 자문이나 부동산 중개를 제공하지 않습니다.",
];

const LANGUAGE_STUDY_LEGAL_NOTICE_LINES = [
  "이 추천은 정답이 아니라 집을 찾기 위한 탐색 시작점입니다.",
  "실제 통학 시간과 경로는 수업 시간, 날씨, 교통 상황에 따라 달라질 수 있습니다.",
  "계약 전에는 반드시 지도 길찾기로 직접 확인해 주세요.",
  "어학원 등록 정보, 캠퍼스 주소, 수업 시간표는 반드시 어학원 공식 안내에서 다시 확인해야 합니다.",
  "메이플하우스는 학교 등록 대행, 비자 자문, 법률 자문, 부동산 중개, 송금 대행을 제공하지 않습니다.",
];

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
    button: "준비 중",
    action: "study",
    notice: "유학용 체크리스트는 준비 중입니다. 이번 MVP에서는 워킹홀리데이 기준 역 추천 기능을 먼저 제공합니다.",
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
  const [generalStep, setGeneralStep] = useState(0);
  const [generalAnswers, setGeneralAnswers] = useState<GeneralAnswers>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [supportNotice, setSupportNotice] = useState(false);

  const workingQuestions = content.workingQuestions;
  const generalQuestions = content.generalQuestions;
  const workingQuestion = workingQuestions[workingStep];
  const selectedWorkingAnswer = workingQuestion ? workingAnswers[workingQuestion.id] : undefined;
  const workingProgress = mode === "workingWizard" ? ((workingStep + 1) / workingQuestions.length) * 100 : 0;
  const generalQuestion = generalQuestions[generalStep];
  const selectedGeneralOptions = generalQuestion ? generalAnswers[generalQuestion.id] ?? [] : [];
  const generalProgress = mode === "generalWizard" ? ((generalStep + 1) / generalQuestions.length) * 100 : 0;

  function resetToOverview() {
    setMode("overview");
    setWorkingStep(0);
    setWorkingAnswers({});
    setWorkingResult(null);
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

    window.addEventListener(CHECKLIST_MAIN_EVENT, resetToOverview);
    return () => window.removeEventListener(CHECKLIST_MAIN_EVENT, resetToOverview);
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

  function selectWorkingAnswer(value: AnswerValue) {
    if (!workingQuestion) return;
    setWorkingAnswers((prev) => ({ ...prev, [workingQuestion.id]: value }));
  }

  function goNextWorking() {
    if (!workingQuestion || !selectedWorkingAnswer) return;

    if (workingStep < workingQuestions.length - 1) {
      setWorkingStep((prev) => prev + 1);
      return;
    }

    const nextAnswers = { ...workingAnswers, [workingQuestion.id]: selectedWorkingAnswer };
    if (!isCompleteAnswerMap(nextAnswers)) return;
    setWorkingResult(calculateStationRecommendation(nextAnswers));
    setMode("workingResult");
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
                    variant={type.action === "working" ? "default" : "soft"}
                    onClick={() => {
                      if (type.action === "working") {
                        setMode("workingIntro");
                        setNotice(null);
                      } else {
                        setNotice(type.notice ?? null);
                      }
                    }}
                  >
                    {type.button}
                    {type.action === "working" && <ArrowRight className="h-4 w-4" />}
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

        <TranslatedHousingGuideSection content={content} />
      </Container>
    </main>
  );
}

function KoreanChecklistPage() {
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

  const generalQuestion = GENERAL_CHECKLIST_QUESTIONS[generalStep];
  const selectedGeneralOptions = generalQuestion ? generalAnswers[generalQuestion.id] ?? [] : [];
  const generalProgress =
    mode === "generalWizard" ? ((generalStep + 1) / GENERAL_CHECKLIST_QUESTIONS.length) * 100 : 0;

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

    window.addEventListener(CHECKLIST_MAIN_EVENT, resetToOverview);
    return () => window.removeEventListener(CHECKLIST_MAIN_EVENT, resetToOverview);
  }, []);

  function startWorkingWizard() {
    setMode("workingWizard");
    setWorkingStep(0);
    setWorkingAnswers({});
    setWorkingResult(null);
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

  function startGeneralChecklist() {
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

  function goNextWorking() {
    if (!workingQuestion || !selectedWorkingAnswer) return;

    if (workingStep < WORKING_HOLIDAY_QUESTIONS.length - 1) {
      setWorkingStep((prev) => prev + 1);
      return;
    }

    const nextAnswers = { ...workingAnswers, [workingQuestion.id]: selectedWorkingAnswer };
    if (!isCompleteAnswerMap(nextAnswers)) return;
    setWorkingResult(calculateStationRecommendation(nextAnswers));
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
    setLanguageResult(calculateLanguageStudyRecommendation(nextAnswers));
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
                        setNotice(type.notice);
                      }
                    }}
                  >
                    {type.button}
                    {type.action !== "study" && <ArrowRight className="h-4 w-4" />}
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
          <section className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
            <WizardHeader
              countLabel={`${languageStep + 1} / ${LANGUAGE_STUDY_QUESTIONS.length}`}
              title="어학연수 기준역 추천"
              progress={languageProgress}
            />

            <div className="mt-8">
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
              {languageQuestion.helpItems && (
                <details className="mt-3 rounded-2xl border border-[#FFE8CC] bg-[#FFF7ED] p-4 text-sm leading-relaxed text-muted-foreground [word-break:keep-all]">
                  <summary className="cursor-pointer font-semibold text-foreground">
                    ? {languageQuestion.helpTitle}
                  </summary>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {languageQuestion.helpItems.map((item) => (
                      <div key={item.term} className="rounded-xl border border-[#FFE8CC] bg-card p-3">
                        <p className="font-semibold text-foreground">{item.term}</p>
                        <p className="mt-1">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </details>
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

        <HousingGuideSection />
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
  const listingsPath = locale === "en" ? "/en/listings" : "/fr/listings";

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
                <span className="text-lg font-bold leading-tight text-foreground sm:text-xl">
                  {formatStationDisplayName(station, locale)}
                </span>
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
          <Link to={listingsPath}>
            {content.workingResult.viewListings}
            <ArrowRight className="h-4 w-4" />
          </Link>
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

  return (
    <section className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <p className="text-sm font-semibold text-primary">Recommendation Result</p>
      <h2 className="mt-2 text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
        당신에게 맞는 기준역 후보
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground [word-break:keep-all]">
        아래 추천은 정답이 아니라 집을 찾기 시작할 기준점입니다. 실제 통학/출근 시간, 매물 상태,
        계약 조건은 반드시 직접 확인해야 합니다.
      </p>

      <div className="mt-6 rounded-3xl border border-border bg-card p-5 sm:p-6">
          <h3 className="text-xl font-semibold text-foreground [word-break:keep-all]">{result.title}</h3>

        <div className="mt-6 rounded-3xl border border-[#FFE8CC] bg-[#FFF7ED] p-5 shadow-sm">
          <p className="text-sm font-semibold text-primary">추천 기준역</p>
          <div className="mt-4 grid gap-3">
            {result.stations.map((station, index) => (
              <div
                key={station}
                className="flex items-center gap-4 rounded-2xl border border-[#FFE8CC] bg-card p-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {index + 1}
                </span>
                <span className="text-lg font-bold leading-tight text-foreground sm:text-xl">
                  {formatStationDisplayName(station)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <InfoBlock title="추천 이유" body={result.reason} />
          <InfoBlock title="근처 비교 범위" body={result.nearby} />
          <div className="rounded-2xl border border-border bg-card p-4">
            <h4 className="text-sm font-semibold text-foreground">이런 사용자에게 맞습니다</h4>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
              {result.goodFor.map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="[word-break:keep-all]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <InfoBlock title={budgetComment.label} body={budgetComment.comment} />
        </div>

        <div className="mt-4 rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground [word-break:keep-all]">
          <span className="font-semibold text-foreground">주의:</span> {result.caution}
        </div>
      </div>

      <LegalScopeNotice />

      {supportNotice && (
        <p className="mt-4 rounded-2xl border border-[#FFE8CC] bg-[#FFF7ED] p-4 text-sm font-medium text-foreground [word-break:keep-all]">
          메이플하우스와 함께 문의하기는 유료 플랜 흐름으로 연결될 예정입니다. 현재는 MVP 미리보기 단계입니다.
        </p>
      )}

      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Button asChild>
          <Link to="/ko/listings">
            이 역 근처 매물 보기
            <ArrowRight className="h-4 w-4" />
          </Link>
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
  const { result, budgetComment, recommendedStations, comparisonStations } = calculation;
  const comparisonText = comparisonStations.map((station) => formatStationDisplayName(station)).join(", ");

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

        <div className="mt-6 rounded-3xl border border-[#FFE8CC] bg-[#FFF7ED] p-5 shadow-sm">
          <p className="text-sm font-semibold text-primary">추천 기준역</p>
          <div className="mt-4 grid gap-3">
            {recommendedStations.map((station, index) => (
              <div
                key={station}
                className="flex items-center gap-4 rounded-2xl border border-[#FFE8CC] bg-card p-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {index + 1}
                </span>
                <span className="text-lg font-bold leading-tight text-foreground [word-break:keep-all] sm:text-xl">
                  {formatStationDisplayName(station)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <InfoBlock
            title="추천 이유"
            body={`선택하신 어학원, 아침 등교 허용 범위, 월세 예산, 수업 후 생활 패턴을 기준으로 추천했습니다. ${result.reason}`}
          />
          <InfoBlock
            title="근처 비교 범위"
            body={`추천 기준역만 보지 말고, ${comparisonText} 주변 역과 함께 비교해보세요. 실제 매물 수와 가격은 시점에 따라 달라질 수 있습니다.`}
          />
          <InfoBlock title="이런 사용자에게 맞습니다" body={result.goodFor} />
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
          <Link to="/ko/listings">
            매물 리스트 보기
            <ArrowRight className="h-4 w-4" />
          </Link>
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

function HousingGuideSection() {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold text-foreground [word-break:keep-all]">
        처음 집을 볼 때 주거 형태는 이렇게 생각해보세요.
      </h2>
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
      <h2 className="text-2xl font-semibold text-foreground">{content.housingGuide.title}</h2>
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
