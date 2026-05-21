import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Home,
  Mail,
  MapPinned,
  MessageSquareText,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

type FormState = {
  name: string;
  email: string;
  contact: string;
  currentLocation: string;
  city: string;
  purpose: string;
  housingType: string;
  budget: string;
  moveInDate: string;
  people: string;
  area: string;
  conditions: string;
  requests: string;
};

type FieldKey = keyof FormState;

type FieldText = {
  label: string;
  placeholder: string;
  required?: boolean;
};

type ApplyPageContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  mvpNotice: string;
  sections: {
    basic: string;
    housing: string;
    consultation: string;
    confirmation: string;
  };
  fields: Record<FieldKey, FieldText>;
  checkboxes: string[];
  options: {
    city: string[];
    purpose: string[];
    housingType: string[];
    budget: string[];
    people: string[];
  };
  selectPlaceholder: string;
  button: string;
  previewTitle: string;
  previewBody: string;
  summaryTitle: string;
  emptyValue: string;
  helperTitle: string;
  helperItems: string[];
};

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  contact: "",
  currentLocation: "",
  city: "",
  purpose: "",
  housingType: "",
  budget: "",
  moveInDate: "",
  people: "",
  area: "",
  conditions: "",
  requests: "",
};

const CONTENT: Record<Locale, ApplyPageContent> = {
  ko: {
    eyebrow: "신청하기",
    title: "상담/예약 신청",
    subtitle:
      "원하는 주거 조건과 상담 정보를 남겨주시면 메이플하우스가 확인 후 안내드리는 흐름입니다.",
    mvpNotice: "현재는 MVP 미리보기 단계입니다. 입력 내용은 실제로 저장되지 않습니다.",
    sections: {
      basic: "기본 정보",
      housing: "희망 주거 조건",
      consultation: "상담 내용",
      confirmation: "확인 항목",
    },
    fields: {
      name: { label: "이름", placeholder: "예: 김메이플", required: true },
      email: { label: "이메일", placeholder: "name@example.com", required: true },
      contact: {
        label: "연락 가능한 메신저 또는 연락처",
        placeholder: "카카오톡, WhatsApp, 전화번호 등",
        required: true,
      },
      currentLocation: {
        label: "현재 거주 국가 또는 도시",
        placeholder: "예: 한국 서울 / 캐나다 토론토",
      },
      city: { label: "희망 도시", placeholder: "" },
      purpose: { label: "체류 목적", placeholder: "" },
      housingType: { label: "주거 형태", placeholder: "" },
      budget: { label: "월세 예산", placeholder: "" },
      moveInDate: { label: "입주 희망일", placeholder: "" },
      people: { label: "거주 인원", placeholder: "" },
      area: { label: "관심 있는 매물 또는 지역", placeholder: "예: 노스욕, 다운타운, 학교 근처" },
      conditions: {
        label: "꼭 확인하고 싶은 조건",
        placeholder: "교통, 안전, 계약 기간, 가구 포함 여부 등",
      },
      requests: {
        label: "추가 요청사항",
        placeholder: "상담 전에 알려주고 싶은 내용을 적어주세요.",
      },
    },
    checkboxes: [
      "실제 결제와 계약은 아직 진행되지 않는 MVP 단계임을 이해했습니다.",
      "상담 내용은 확인 후 안내되는 흐름임을 이해했습니다.",
      "입력 정보가 실제 저장되지 않는 미리보기 단계임을 이해했습니다.",
    ],
    options: {
      city: ["Toronto", "Vancouver", "Montreal", "Quebec City", "Other"],
      purpose: [
        "Study",
        "Working holiday",
        "Work / business trip",
        "Immigration / settlement",
        "Short-term stay",
        "Other",
      ],
      housingType: ["Room", "Condo", "House", "Share house", "Not sure yet"],
      budget: [
        "Under CA$1,000",
        "CA$1,000 - CA$1,500",
        "CA$1,500 - CA$2,000",
        "CA$2,000 - CA$3,000",
        "Over CA$3,000",
        "Not sure yet",
      ],
      people: ["1", "2", "3", "4+", "Family"],
    },
    selectPlaceholder: "선택하세요",
    button: "상담/예약 신청 미리보기",
    previewTitle: "신청 미리보기가 준비되었습니다",
    previewBody: "이 내용은 화면에서만 확인할 수 있으며 아직 저장되거나 전송되지 않습니다.",
    summaryTitle: "입력 요약",
    emptyValue: "미입력",
    helperTitle: "이 페이지에서 할 수 있는 것",
    helperItems: [
      "상담에 필요한 기본 정보를 한 번에 정리합니다.",
      "도시, 예산, 입주일 등 주거 조건을 미리 맞춰봅니다.",
      "실제 저장과 제출은 다음 단계에서 연결됩니다.",
    ],
  },
  en: {
    eyebrow: "Apply",
    title: "Apply for Consultation / Reservation",
    subtitle:
      "Share your housing conditions and consultation details so MapleHouse can guide the next step.",
    mvpNotice: "This is an MVP preview. Your input is not actually saved yet.",
    sections: {
      basic: "Basic information",
      housing: "Housing preferences",
      consultation: "Consultation details",
      confirmation: "Confirmation",
    },
    fields: {
      name: { label: "Name", placeholder: "Your name", required: true },
      email: { label: "Email", placeholder: "name@example.com", required: true },
      contact: {
        label: "Messenger or contact",
        placeholder: "WhatsApp, KakaoTalk, phone number, etc.",
        required: true,
      },
      currentLocation: {
        label: "Current country or city",
        placeholder: "e.g. Seoul, Korea / Toronto, Canada",
      },
      city: { label: "Preferred city", placeholder: "" },
      purpose: { label: "Stay purpose", placeholder: "" },
      housingType: { label: "Housing type", placeholder: "" },
      budget: { label: "Monthly budget", placeholder: "" },
      moveInDate: { label: "Preferred move-in date", placeholder: "" },
      people: { label: "People", placeholder: "" },
      area: {
        label: "Listing or area of interest",
        placeholder: "e.g. North York, downtown, near campus",
      },
      conditions: {
        label: "Conditions to check",
        placeholder: "Transit, safety, contract length, furnished room, etc.",
      },
      requests: {
        label: "Additional requests",
        placeholder: "Anything MapleHouse should know before the consultation.",
      },
    },
    checkboxes: [
      "I understand that real payments and contracts are not active in this MVP stage.",
      "I understand that consultation details will be reviewed before guidance is provided.",
      "I understand that the input is not actually saved in this preview stage.",
    ],
    options: {
      city: ["Toronto", "Vancouver", "Montreal", "Quebec City", "Other"],
      purpose: [
        "Study",
        "Working holiday",
        "Work / business trip",
        "Immigration / settlement",
        "Short-term stay",
        "Other",
      ],
      housingType: ["Room", "Condo", "House", "Share house", "Not sure yet"],
      budget: [
        "Under CA$1,000",
        "CA$1,000 - CA$1,500",
        "CA$1,500 - CA$2,000",
        "CA$2,000 - CA$3,000",
        "Over CA$3,000",
        "Not sure yet",
      ],
      people: ["1", "2", "3", "4+", "Family"],
    },
    selectPlaceholder: "Select",
    button: "Preview consultation request",
    previewTitle: "Request preview prepared",
    previewBody: "This preview is visible on this page only. It has not been saved or submitted.",
    summaryTitle: "Request summary",
    emptyValue: "Not entered",
    helperTitle: "What this preview helps with",
    helperItems: [
      "Collect the basic details needed for a consultation.",
      "Organize city, budget, move-in date, and household size.",
      "Real saving and submission will be connected in a later stage.",
    ],
  },
  fr: {
    eyebrow: "Faire une demande",
    title: "Demande de consultation / réservation",
    subtitle:
      "Indiquez vos conditions de logement et vos informations de consultation afin que MapleHouse puisse préparer l’étape suivante.",
    mvpNotice: "Ceci est un aperçu MVP. Les informations saisies ne sont pas encore enregistrées.",
    sections: {
      basic: "Informations de base",
      housing: "Conditions de logement souhaitées",
      consultation: "Détails de consultation",
      confirmation: "Confirmation",
    },
    fields: {
      name: { label: "Nom", placeholder: "Votre nom", required: true },
      email: { label: "Email", placeholder: "nom@example.com", required: true },
      contact: {
        label: "Messagerie ou contact",
        placeholder: "WhatsApp, KakaoTalk, téléphone, etc.",
        required: true,
      },
      currentLocation: {
        label: "Pays ou ville actuelle",
        placeholder: "ex. Séoul, Corée / Toronto, Canada",
      },
      city: { label: "Ville souhaitée", placeholder: "" },
      purpose: { label: "Objectif du séjour", placeholder: "" },
      housingType: { label: "Type de logement", placeholder: "" },
      budget: { label: "Budget mensuel", placeholder: "" },
      moveInDate: { label: "Date d’arrivée souhaitée", placeholder: "" },
      people: { label: "Personnes", placeholder: "" },
      area: {
        label: "Annonce ou quartier d’intérêt",
        placeholder: "ex. North York, centre-ville, près du campus",
      },
      conditions: {
        label: "Conditions à vérifier",
        placeholder: "Transport, sécurité, durée du bail, logement meublé, etc.",
      },
      requests: {
        label: "Demandes supplémentaires",
        placeholder: "Ce que MapleHouse doit savoir avant la consultation.",
      },
    },
    checkboxes: [
      "Je comprends que les paiements et contrats réels ne sont pas actifs dans cette étape MVP.",
      "Je comprends que les informations de consultation seront vérifiées avant l’accompagnement.",
      "Je comprends que les informations saisies ne sont pas réellement enregistrées dans cet aperçu.",
    ],
    options: {
      city: ["Toronto", "Vancouver", "Montréal", "Ville de Québec", "Autre"],
      purpose: [
        "Études",
        "PVT",
        "Travail / déplacement professionnel",
        "Immigration / installation",
        "Court séjour",
        "Autre",
      ],
      housingType: ["Chambre", "Condo", "Maison", "Colocation", "Pas encore sûr"],
      budget: [
        "Moins de 1 000 CA$",
        "1 000 - 1 500 CA$",
        "1 500 - 2 000 CA$",
        "2 000 - 3 000 CA$",
        "Plus de 3 000 CA$",
        "Pas encore sûr",
      ],
      people: ["1", "2", "3", "4+", "Famille"],
    },
    selectPlaceholder: "Choisir",
    button: "Aperçu de la demande",
    previewTitle: "Aperçu de la demande préparé",
    previewBody:
      "Cet aperçu est visible uniquement sur cette page. Il n’a pas été enregistré ni envoyé.",
    summaryTitle: "Résumé de la demande",
    emptyValue: "Non renseigné",
    helperTitle: "Ce que cet aperçu permet",
    helperItems: [
      "Regrouper les informations utiles pour une consultation.",
      "Organiser la ville, le budget, la date d’arrivée et le nombre de personnes.",
      "L’enregistrement réel et l’envoi seront connectés plus tard.",
    ],
  },
};

const TEXT_FIELDS: FieldKey[] = ["name", "email", "contact", "currentLocation"];
const SELECT_FIELDS: Array<{
  key: FieldKey;
  optionsKey: keyof ApplyPageContent["options"];
}> = [
  { key: "city", optionsKey: "city" },
  { key: "purpose", optionsKey: "purpose" },
  { key: "housingType", optionsKey: "housingType" },
  { key: "budget", optionsKey: "budget" },
  { key: "people", optionsKey: "people" },
];
const TEXTAREA_FIELDS: FieldKey[] = ["area", "conditions", "requests"];

export function LocaleApplyPage({ locale }: { locale: Locale }) {
  const t = CONTENT[locale];
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [checked, setChecked] = useState<boolean[]>(() => t.checkboxes.map(() => false));
  const [previewVisible, setPreviewVisible] = useState(false);

  const summaryRows = useMemo(
    () => [
      { label: t.fields.name.label, value: form.name },
      { label: t.fields.email.label, value: form.email },
      { label: t.fields.contact.label, value: form.contact },
      { label: t.fields.city.label, value: form.city },
      { label: t.fields.purpose.label, value: form.purpose },
      { label: t.fields.housingType.label, value: form.housingType },
      { label: t.fields.budget.label, value: form.budget },
      { label: t.fields.moveInDate.label, value: form.moveInDate },
      { label: t.fields.people.label, value: form.people },
      { label: t.fields.area.label, value: form.area },
    ],
    [form, t],
  );

  const updateField = (key: FieldKey, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPreviewVisible(true);
  };

  return (
    <main className="bg-background">
      <Container className="py-12 sm:py-16 lg:py-18">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            {t.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            {t.title}
          </h1>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t.subtitle}
          </p>
          <div className="mx-auto mt-5 inline-flex max-w-full rounded-full border border-primary/25 bg-primary/5 px-4 py-2 text-xs font-medium text-primary">
            {t.mvpNotice}
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6 lg:p-7"
          >
            <FormSection title={t.sections.basic} icon={<UserRound />}>
              <div className="grid gap-4 sm:grid-cols-2">
                {TEXT_FIELDS.map((key) => (
                  <TextField
                    key={key}
                    id={`${locale}-${key}`}
                    field={t.fields[key]}
                    value={form[key]}
                    onChange={(value) => updateField(key, value)}
                    type={key === "email" ? "email" : "text"}
                  />
                ))}
              </div>
            </FormSection>

            <FormSection title={t.sections.housing} icon={<Home />}>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {SELECT_FIELDS.slice(0, 4).map(({ key, optionsKey }) => (
                  <SelectField
                    key={key}
                    id={`${locale}-${key}`}
                    field={t.fields[key]}
                    value={form[key]}
                    options={t.options[optionsKey]}
                    placeholder={t.selectPlaceholder}
                    onChange={(value) => updateField(key, value)}
                  />
                ))}
                <TextField
                  id={`${locale}-moveInDate`}
                  field={t.fields.moveInDate}
                  value={form.moveInDate}
                  onChange={(value) => updateField("moveInDate", value)}
                  type="date"
                />
                <SelectField
                  id={`${locale}-people`}
                  field={t.fields.people}
                  value={form.people}
                  options={t.options.people}
                  placeholder={t.selectPlaceholder}
                  onChange={(value) => updateField("people", value)}
                />
              </div>
            </FormSection>

            <FormSection title={t.sections.consultation} icon={<MessageSquareText />}>
              <div className="grid gap-4">
                {TEXTAREA_FIELDS.map((key) => (
                  <TextareaField
                    key={key}
                    id={`${locale}-${key}`}
                    field={t.fields[key]}
                    value={form[key]}
                    onChange={(value) => updateField(key, value)}
                  />
                ))}
              </div>
            </FormSection>

            <FormSection title={t.sections.confirmation} icon={<ClipboardList />}>
              <div className="grid gap-3 rounded-2xl border border-border bg-secondary/60 p-4">
                {t.checkboxes.map((item, index) => (
                  <CheckboxItem
                    key={item}
                    id={`${locale}-confirm-${index}`}
                    label={item}
                    checked={checked[index] ?? false}
                    onChange={(value) =>
                      setChecked((current) =>
                        current.map((currentValue, currentIndex) =>
                          currentIndex === index ? value : currentValue,
                        ),
                      )
                    }
                  />
                ))}
              </div>
            </FormSection>

            <div className="mt-7 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-relaxed text-muted-foreground">{t.mvpNotice}</p>
              <Button type="submit" size="lg" className="min-h-11 px-5">
                {t.button}
              </Button>
            </div>

            {previewVisible && (
              <PreviewPanel
                title={t.previewTitle}
                body={t.previewBody}
                summaryTitle={t.summaryTitle}
                emptyValue={t.emptyValue}
                rows={summaryRows}
              />
            )}
          </form>

          <aside className="space-y-4">
            <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-lg font-semibold text-foreground">{t.helperTitle}</h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                {t.helperItems.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span
                      aria-hidden
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </Container>
    </main>
  );
}

function PreviewPanel({
  title,
  body,
  summaryTitle,
  emptyValue,
  rows,
}: {
  title: string;
  body: string;
  summaryTitle: string;
  emptyValue: string;
  rows: Array<{ label: string; value: string }>;
}) {
  return (
    <section
      className="mt-5 rounded-3xl border border-primary/35 bg-primary/5 p-5 shadow-sm"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Mail className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
        </div>
      </div>
      <h3 className="mt-5 text-sm font-semibold text-foreground">{summaryTitle}</h3>
      <dl className="mt-3 grid gap-2 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="rounded-xl bg-card px-3 py-2">
            <dt className="text-[11px] font-medium text-muted-foreground">{row.label}</dt>
            <dd className="mt-0.5 text-sm font-medium text-foreground">
              {row.value.trim() || emptyValue}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function FormSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-border py-6 first:pt-0 last:border-b-0 last:pb-0">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-primary [&_svg]:h-4 [&_svg]:w-4">
          {icon}
        </span>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function TextField({
  id,
  field,
  value,
  onChange,
  type = "text",
}: {
  id: string;
  field: FieldText;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "date";
}) {
  return (
    <label htmlFor={id} className="block">
      <FieldLabel field={field} />
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
        placeholder={type === "date" ? undefined : field.placeholder}
      />
    </label>
  );
}

function SelectField({
  id,
  field,
  value,
  options,
  placeholder,
  onChange,
}: {
  id: string;
  field: FieldText;
  value: string;
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label htmlFor={id} className="block">
      <FieldLabel field={field} />
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary",
          value ? "text-foreground" : "text-muted-foreground",
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextareaField({
  id,
  field,
  value,
  onChange,
}: {
  id: string;
  field: FieldText;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label htmlFor={id} className="block">
      <FieldLabel field={field} />
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 min-h-28 w-full resize-y rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
        placeholder={field.placeholder}
      />
    </label>
  );
}

function FieldLabel({ field }: { field: FieldText }) {
  return (
    <span className="block text-xs font-medium text-muted-foreground">
      {field.label}
      {field.required && <span className="ml-1 text-primary">*</span>}
    </span>
  );
}

function CheckboxItem({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm text-foreground">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 rounded border-input accent-primary"
      />
      <span className="leading-relaxed">{label}</span>
    </label>
  );
}
