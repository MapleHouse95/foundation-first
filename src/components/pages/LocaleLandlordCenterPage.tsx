import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  ClipboardList,
  Home,
  Inbox,
  Plus,
  UserRound,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const LANDLORD_CENTER_DRAFT_KEY = "maplehouse.landlordDraft.v1";

type LandlordCenterPage = "dashboard" | "listings" | "newListing" | "inquiries" | "profile";

type LandlordCenterDraft = Partial<{
  role: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  emailLocal: string;
  emailDomain: string;
  contact: string;
  phoneCountryCode: string;
  phoneCountryCodeCustom: string;
  phoneNumber: string;
  preferredLanguage: string;
  preferredLanguages: string[];
  preferredContactMethods: string[];
  shortMessage: string;
  city: string;
  area: string;
  nearestStation: string;
  housingType: string;
  listingTitle: string;
  monthlyRent: string;
  availableFrom: string;
  minimumStay: string;
}>;

type CenterCopy = {
  breadcrumb: { home: string; center: string };
  nav: {
    dashboard: string;
    listings: string;
    inquiries: string;
    profile: string;
  };
  common: {
    emptyValue: string;
    comingSoon: string;
    addListing: string;
    goRegister: string;
    viewDetails: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    cards: {
      listings: string;
      pendingInquiries: string;
      needsReview: string;
      recentUpdates: string;
    };
    notice: string;
    emptyTitle: string;
    emptyBody: string;
    onboardingButton: string;
  };
  listings: {
    title: string;
    subtitle: string;
    draftTitle: string;
    emptyTitle: string;
    emptyBody: string;
    startFirstListing: string;
    statusLabel: string;
    fields: {
      listingTitle: string;
      city: string;
      area: string;
      nearestStation: string;
      monthlyRent: string;
      availableFrom: string;
      minimumStay: string;
      housingType: string;
      status: string;
    };
  };
  newListing: {
    title: string;
    subtitle: string;
    cardTitle: string;
    cardBody: string;
  };
  inquiries: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyBody: string;
    statuses: string[];
  };
  profile: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyBody: string;
    fields: {
      role: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      preferredContactMethods: string;
      preferredLanguages: string;
      memo: string;
    };
  };
};

const CENTER_COPY: Record<Locale, CenterCopy> = {
  ko: {
    breadcrumb: { home: "홈", center: "임대인 센터" },
    nav: {
      dashboard: "센터 홈",
      listings: "매물 관리",
      inquiries: "문의 관리",
      profile: "임대인 정보",
    },
    common: {
      emptyValue: "미입력",
      comingSoon: "준비 중",
      addListing: "새 매물 등록하기",
      goRegister: "임대인 등록으로 이동",
      viewDetails: "자세히 보기",
    },
    dashboard: {
      title: "임대인 센터",
      subtitle: "등록한 매물, 입주 문의, 임대인 정보를 한곳에서 관리하는 공간입니다.",
      cards: {
        listings: "등록 매물",
        pendingInquiries: "문의 대기",
        needsReview: "검토 필요",
        recentUpdates: "최근 업데이트",
      },
      notice:
        "이 화면은 임대인 센터 MVP 미리보기입니다. 실제 로그인, 매물 저장, 문의 수신 기능은 아직 연결되어 있지 않습니다.",
      emptyTitle: "아직 임대인 등록이 완료되지 않았습니다.",
      emptyBody: "임대인 기본 정보와 첫 매물을 먼저 등록해 주세요.",
      onboardingButton: "임대인 등록 및 첫 매물 등록 시작하기",
    },
    listings: {
      title: "매물 관리",
      subtitle: "등록한 매물 초안과 이후 추가될 매물 관리 흐름을 확인하는 공간입니다.",
      draftTitle: "최근 작성한 최초 매물 초안",
      emptyTitle: "아직 등록한 매물 초안이 없습니다.",
      emptyBody: "첫 임대인 등록 흐름에서 기본 정보와 첫 매물을 먼저 정리해 주세요.",
      startFirstListing: "첫 매물 등록하러 가기",
      statusLabel: "검토 전",
      fields: {
        listingTitle: "매물 제목",
        city: "도시",
        area: "지역",
        nearestStation: "가까운 역",
        monthlyRent: "월세",
        availableFrom: "입주 가능일",
        minimumStay: "최소 거주",
        housingType: "주거 형태",
        status: "상태",
      },
    },
    newListing: {
      title: "추가 매물 등록",
      subtitle:
        "임대인 기본 정보는 다시 입력하지 않고, 새 매물 정보만 정리하는 흐름으로 확장할 예정입니다.",
      cardTitle: "추가 매물 등록 흐름 준비 중",
      cardBody:
        "추가 매물 등록은 임대인 기본 정보 등록 후 사용할 수 있는 흐름으로 확장할 예정입니다.",
    },
    inquiries: {
      title: "문의 관리",
      subtitle: "입주 문의가 들어오면 상태와 확인 질문을 한곳에서 정리할 예정입니다.",
      emptyTitle: "아직 접수된 입주 문의가 없습니다.",
      emptyBody:
        "입주 문의가 들어오면 입주 날짜, 예산, 체류 기간, 인원, 확인 질문을 정리해 보여줄 예정입니다.",
      statuses: ["새 문의", "확인 필요", "답변 대기", "종료"],
    },
    profile: {
      title: "임대인 정보",
      subtitle: "추가 매물 등록 때 다시 입력하지 않을 기본 정보를 확인하는 공간입니다.",
      emptyTitle: "아직 임대인 기본 정보가 없습니다.",
      emptyBody: "임대인 등록을 먼저 진행하면 이름, 연락처, 선호 연락 방법이 이곳에 표시됩니다.",
      fields: {
        role: "역할",
        firstName: "이름",
        lastName: "성",
        email: "이메일",
        phone: "전화번호",
        preferredContactMethods: "선호 연락",
        preferredLanguages: "선호 언어",
        memo: "메모",
      },
    },
  },
  en: {
    breadcrumb: { home: "Home", center: "Landlord center" },
    nav: {
      dashboard: "Center home",
      listings: "Listings",
      inquiries: "Inquiries",
      profile: "Landlord profile",
    },
    common: {
      emptyValue: "Not entered",
      comingSoon: "Coming soon",
      addListing: "Add new listing",
      goRegister: "Go to landlord registration",
      viewDetails: "View details",
    },
    dashboard: {
      title: "Landlord center",
      subtitle: "Manage your listings, tenant inquiries, and landlord profile in one place.",
      cards: {
        listings: "Listings",
        pendingInquiries: "Pending inquiries",
        needsReview: "Needs review",
        recentUpdates: "Recent updates",
      },
      notice:
        "This is a landlord center MVP preview. Real login, listing storage, and inquiry receiving are not connected yet.",
      emptyTitle: "Landlord registration is not complete yet.",
      emptyBody: "Start by adding your landlord profile and first listing.",
      onboardingButton: "Start landlord registration and first listing",
    },
    listings: {
      title: "Listings",
      subtitle: "Review listing drafts and the future multiple-listing management flow.",
      draftTitle: "Recent first listing draft",
      emptyTitle: "No listing drafts yet.",
      emptyBody: "Start with landlord registration to organize your profile and first listing.",
      startFirstListing: "Start first listing",
      statusLabel: "Not reviewed",
      fields: {
        listingTitle: "Listing title",
        city: "City",
        area: "Area",
        nearestStation: "Nearest station",
        monthlyRent: "Monthly rent",
        availableFrom: "Available from",
        minimumStay: "Minimum stay",
        housingType: "Housing type",
        status: "Status",
      },
    },
    newListing: {
      title: "Add a new listing",
      subtitle: "Your landlord profile will be reused. Only the new listing information will be organized.",
      cardTitle: "Additional listing flow coming soon",
      cardBody:
        "Additional listing registration will be available after landlord profile setup.",
    },
    inquiries: {
      title: "Inquiry management",
      subtitle: "Tenant inquiries will be organized here when the real flow is connected.",
      emptyTitle: "No tenant inquiries yet.",
      emptyBody:
        "When tenant inquiries arrive, this page can organize move-in date, budget, length of stay, occupants, and confirmation questions.",
      statuses: ["New inquiry", "Needs review", "Waiting for reply", "Closed"],
    },
    profile: {
      title: "Landlord profile",
      subtitle: "Review the profile information that can be reused for future listings.",
      emptyTitle: "No landlord profile information yet.",
      emptyBody: "Start landlord registration first to show your name, contact details, and preferences here.",
      fields: {
        role: "Role",
        firstName: "First name",
        lastName: "Last name",
        email: "Email",
        phone: "Phone",
        preferredContactMethods: "Preferred contact",
        preferredLanguages: "Preferred languages",
        memo: "Memo",
      },
    },
  },
  fr: {
    breadcrumb: { home: "Accueil", center: "Espace propriétaire" },
    nav: {
      dashboard: "Accueil du centre",
      listings: "Annonces",
      inquiries: "Demandes",
      profile: "Profil propriétaire",
    },
    common: {
      emptyValue: "Non renseigné",
      comingSoon: "Bientôt disponible",
      addListing: "Ajouter une annonce",
      goRegister: "Aller à l’inscription propriétaire",
      viewDetails: "Voir le détail",
    },
    dashboard: {
      title: "Espace propriétaire",
      subtitle: "Gérez vos annonces, les demandes des locataires et votre profil propriétaire au même endroit.",
      cards: {
        listings: "Annonces",
        pendingInquiries: "Demandes en attente",
        needsReview: "À vérifier",
        recentUpdates: "Mises à jour récentes",
      },
      notice:
        "Il s’agit d’un aperçu MVP de l’espace propriétaire. La connexion réelle, l’enregistrement des annonces et la réception des demandes ne sont pas encore connectés.",
      emptyTitle: "L’inscription propriétaire n’est pas encore terminée.",
      emptyBody: "Commencez par ajouter votre profil propriétaire et votre première annonce.",
      onboardingButton: "Commencer l’inscription propriétaire et la première annonce",
    },
    listings: {
      title: "Annonces",
      subtitle: "Consultez les brouillons d’annonces et le futur flux de gestion de plusieurs annonces.",
      draftTitle: "Brouillon récent de première annonce",
      emptyTitle: "Aucun brouillon d’annonce pour le moment.",
      emptyBody: "Commencez par l’inscription propriétaire pour organiser votre profil et votre première annonce.",
      startFirstListing: "Commencer la première annonce",
      statusLabel: "Non examiné",
      fields: {
        listingTitle: "Titre de l’annonce",
        city: "Ville",
        area: "Secteur",
        nearestStation: "Station proche",
        monthlyRent: "Loyer mensuel",
        availableFrom: "Disponible à partir de",
        minimumStay: "Séjour minimum",
        housingType: "Type de logement",
        status: "Statut",
      },
    },
    newListing: {
      title: "Ajouter une nouvelle annonce",
      subtitle:
        "Votre profil propriétaire sera réutilisé. Seules les informations de la nouvelle annonce seront organisées.",
      cardTitle: "Flux d’ajout d’annonce bientôt disponible",
      cardBody:
        "L’ajout d’annonces supplémentaires sera disponible après la configuration du profil propriétaire.",
    },
    inquiries: {
      title: "Gestion des demandes",
      subtitle: "Les demandes des locataires seront organisées ici lorsque le flux réel sera connecté.",
      emptyTitle: "Aucune demande de locataire pour le moment.",
      emptyBody:
        "Lorsque des demandes de locataires arriveront, cette page pourra organiser la date d’arrivée, le budget, la durée du séjour, le nombre d’occupants et les questions de confirmation.",
      statuses: ["Nouvelle demande", "À vérifier", "En attente de réponse", "Fermée"],
    },
    profile: {
      title: "Profil propriétaire",
      subtitle: "Consultez les informations de profil qui pourront être réutilisées pour de futures annonces.",
      emptyTitle: "Aucune information de profil propriétaire pour le moment.",
      emptyBody:
        "Commencez l’inscription propriétaire pour afficher ici votre nom, vos coordonnées et vos préférences.",
      fields: {
        role: "Rôle",
        firstName: "Prénom",
        lastName: "Nom",
        email: "E-mail",
        phone: "Téléphone",
        preferredContactMethods: "Contact préféré",
        preferredLanguages: "Langues préférées",
        memo: "Note",
      },
    },
  },
};

const CENTER_NAV_ITEMS = [
  { key: "dashboard", icon: Home, route: "dashboard" },
  { key: "listings", icon: Building2, route: "listings" },
  { key: "inquiries", icon: Inbox, route: "inquiries" },
  { key: "profile", icon: UserRound, route: "profile" },
] as const;

export function LocaleLandlordCenterPage({
  locale,
  page,
}: {
  locale: Locale;
  page: LandlordCenterPage;
}) {
  const copy = CENTER_COPY[locale];
  const [draft, setDraft] = useState<LandlordCenterDraft | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const rawDraft = window.sessionStorage.getItem(LANDLORD_CENTER_DRAFT_KEY);
      setDraft(rawDraft ? (JSON.parse(rawDraft) as LandlordCenterDraft) : null);
    } catch {
      setDraft(null);
    } finally {
      setLoaded(true);
    }
  }, []);

  const hasDraft = useMemo(() => draftHasData(draft), [draft]);
  const activeNavKey = page === "newListing" ? "listings" : page;
  const isDashboard = page === "dashboard";
  const dashboardHasDraft = isDashboard && loaded && hasDraft;
  const heroSubtitle =
    isDashboard && !dashboardHasDraft
      ? `${copy.dashboard.emptyTitle} ${copy.dashboard.emptyBody}`
      : pageSubtitle(copy, page);
  const heroActionHref =
    isDashboard && !dashboardHasDraft
      ? centerRoute(locale, "register")
      : centerRoute(locale, "newListing");
  const heroActionLabel =
    isDashboard && !dashboardHasDraft ? copy.dashboard.onboardingButton : copy.common.addListing;
  const HeroActionIcon = isDashboard && !dashboardHasDraft ? ArrowRight : Plus;

  return (
    <main className="min-h-screen bg-[#F6F7F9] py-10 sm:py-14">
      <Container className="space-y-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Link to={`/${locale}`} className="transition hover:text-primary">
              {copy.breadcrumb.home}
            </Link>
            <span aria-hidden>·</span>
            <span className="text-foreground">{copy.breadcrumb.center}</span>
          </div>
          <div className="flex flex-col gap-4 rounded-[28px] border border-border bg-white p-6 shadow-sm sm:p-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
                MapleHouse Landlord Center
              </p>
              <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                {pageTitle(copy, page)}
              </h1>
              <p className="text-base leading-7 text-muted-foreground">
                {heroSubtitle}
              </p>
            </div>
            <Link
              to={heroActionHref}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90"
            >
              <HeroActionIcon className="h-4 w-4" aria-hidden />
              {heroActionLabel}
            </Link>
          </div>
        </div>

        <nav
          aria-label={copy.breadcrumb.center}
          className="flex gap-2 overflow-x-auto rounded-2xl border border-border bg-white p-2 shadow-sm"
        >
          {CENTER_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = item.key === activeNavKey;

            return (
              <Link
                key={item.key}
                to={centerRoute(locale, item.route)}
                className={cn(
                  "inline-flex min-w-fit items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition",
                  active
                    ? "bg-[#FFF3E8] text-primary"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {copy.nav[item.key]}
              </Link>
            );
          })}
        </nav>

        {page === "dashboard" ? (
          <DashboardPanel copy={copy} locale={locale} hasDraft={hasDraft} loaded={loaded} />
        ) : null}
        {page === "listings" ? (
          <ListingsPanel copy={copy} locale={locale} draft={draft} hasDraft={hasDraft} loaded={loaded} />
        ) : null}
        {page === "newListing" ? <NewListingPanel copy={copy} /> : null}
        {page === "inquiries" ? <InquiriesPanel copy={copy} /> : null}
        {page === "profile" ? (
          <ProfilePanel copy={copy} locale={locale} draft={draft} hasDraft={hasDraft} loaded={loaded} />
        ) : null}
      </Container>
    </main>
  );
}

function DashboardPanel({
  copy,
  locale,
  hasDraft,
  loaded,
}: {
  copy: CenterCopy;
  locale: Locale;
  hasDraft: boolean;
  loaded: boolean;
}) {
  const count = loaded && hasDraft ? 1 : 0;
  const cards = [
    { label: copy.dashboard.cards.listings, value: count, icon: Building2 },
    { label: copy.dashboard.cards.pendingInquiries, value: 0, icon: Inbox },
    { label: copy.dashboard.cards.needsReview, value: count, icon: ClipboardList },
    { label: copy.dashboard.cards.recentUpdates, value: 0, icon: Home },
  ];

  return (
    <section className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <article key={card.label} className="rounded-3xl border border-border bg-white p-5 shadow-sm">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FFF3E8] text-primary">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <p className="text-sm font-bold text-muted-foreground">{card.label}</p>
              <p className="mt-2 text-3xl font-black text-foreground">{card.value}</p>
            </article>
          );
        })}
      </div>

      {loaded && hasDraft ? (
        <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <article className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-black text-foreground">{copy.listings.draftTitle}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {copy.listings.subtitle}
                </p>
              </div>
              <Link
                to={centerRoute(locale, "listings")}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-primary/25 bg-white px-4 py-2.5 text-sm font-bold text-primary transition hover:bg-[#FFF8F1]"
              >
                {copy.common.viewDetails}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </article>

          <aside className="rounded-3xl border border-primary/20 bg-[#FFFDF9] p-6 text-sm leading-6 text-muted-foreground shadow-sm">
            <p className="font-bold text-primary">{copy.breadcrumb.center} MVP</p>
            <p className="mt-2">{copy.dashboard.notice}</p>
          </aside>
        </div>
      ) : (
        <aside className="rounded-3xl border border-primary/20 bg-[#FFFDF9] p-6 text-sm leading-6 text-muted-foreground shadow-sm">
          <p className="font-bold text-primary">{copy.breadcrumb.center} MVP</p>
          <p className="mt-2">{copy.dashboard.notice}</p>
        </aside>
      )}
    </section>
  );
}

function ListingsPanel({
  copy,
  locale,
  draft,
  hasDraft,
  loaded,
}: {
  copy: CenterCopy;
  locale: Locale;
  draft: LandlordCenterDraft | null;
  hasDraft: boolean;
  loaded: boolean;
}) {
  if (!loaded || !hasDraft || !draft) {
    return (
      <EmptyCard
        title={copy.listings.emptyTitle}
        body={copy.listings.emptyBody}
        actionLabel={copy.listings.startFirstListing}
        actionHref={centerRoute(locale, "register")}
      />
    );
  }

  const rows = [
    [copy.listings.fields.listingTitle, draft.listingTitle],
    [copy.listings.fields.city, draft.city],
    [copy.listings.fields.area, draft.area],
    [copy.listings.fields.nearestStation, draft.nearestStation],
    [copy.listings.fields.housingType, draft.housingType],
    [copy.listings.fields.monthlyRent, formatCurrency(draft.monthlyRent)],
    [copy.listings.fields.availableFrom, draft.availableFrom],
    [copy.listings.fields.minimumStay, draft.minimumStay],
  ];

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-muted-foreground">{copy.listings.subtitle}</p>
        <Link
          to={centerRoute(locale, "newListing")}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" aria-hidden />
          {copy.common.addListing}
        </Link>
      </div>

      <article className="rounded-3xl border border-border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
              {copy.listings.fields.status}: {copy.listings.statusLabel}
            </p>
            <h2 className="mt-2 text-xl font-black text-foreground">{copy.listings.draftTitle}</h2>
          </div>
          <button
            type="button"
            disabled
            className="inline-flex items-center justify-center whitespace-nowrap rounded-xl border border-border bg-muted px-3 py-2 text-xs font-bold text-muted-foreground"
          >
            {copy.common.comingSoon}
          </button>
        </div>

        <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-border bg-[#FAFAFA] p-4">
              <dt className="text-xs font-bold text-muted-foreground">{label}</dt>
              <dd className="mt-1 min-h-5 break-words text-sm font-bold text-foreground">
                {displayValue(value, copy.common.emptyValue)}
              </dd>
            </div>
          ))}
        </dl>
      </article>
    </section>
  );
}

function NewListingPanel({ copy }: { copy: CenterCopy }) {
  return (
    <section className="rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-8">
      <div className="flex max-w-3xl flex-col gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF3E8] text-primary">
          <Plus className="h-6 w-6" aria-hidden />
        </div>
        <div>
          <h2 className="text-xl font-black text-foreground">{copy.newListing.cardTitle}</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{copy.newListing.cardBody}</p>
        </div>
        <span className="inline-flex w-fit items-center justify-center rounded-full border border-primary/20 bg-[#FFF8F1] px-3 py-1 text-xs font-extrabold text-primary">
          {copy.common.comingSoon}
        </span>
      </div>
    </section>
  );
}

function InquiriesPanel({ copy }: { copy: CenterCopy }) {
  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_0.75fr]">
      <article className="rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF3E8] text-primary">
          <Inbox className="h-6 w-6" aria-hidden />
        </div>
        <h2 className="mt-5 text-xl font-black text-foreground">{copy.inquiries.emptyTitle}</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">{copy.inquiries.emptyBody}</p>
      </article>

      <aside className="rounded-3xl border border-border bg-white p-6 shadow-sm">
        <p className="text-sm font-black text-foreground">{copy.inquiries.title}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {copy.inquiries.statuses.map((status) => (
            <span
              key={status}
              className="inline-flex items-center rounded-full border border-border bg-[#FAFAFA] px-3 py-1 text-xs font-bold text-muted-foreground"
            >
              {status}
            </span>
          ))}
        </div>
      </aside>
    </section>
  );
}

function ProfilePanel({
  copy,
  locale,
  draft,
  hasDraft,
  loaded,
}: {
  copy: CenterCopy;
  locale: Locale;
  draft: LandlordCenterDraft | null;
  hasDraft: boolean;
  loaded: boolean;
}) {
  if (!loaded || !hasDraft || !draft) {
    return (
      <EmptyCard
        title={copy.profile.emptyTitle}
        body={copy.profile.emptyBody}
        actionLabel={copy.common.goRegister}
        actionHref={centerRoute(locale, "register")}
      />
    );
  }

  const rows = [
    [copy.profile.fields.role, draft.role],
    [copy.profile.fields.firstName, draft.firstName],
    [copy.profile.fields.lastName, draft.lastName || draft.name],
    [copy.profile.fields.email, getEmail(draft)],
    [copy.profile.fields.phone, getPhone(draft)],
    [copy.profile.fields.preferredContactMethods, joinValues(draft.preferredContactMethods)],
    [copy.profile.fields.preferredLanguages, joinValues(draft.preferredLanguages || (draft.preferredLanguage ? [draft.preferredLanguage] : []))],
    [copy.profile.fields.memo, draft.shortMessage],
  ];

  return (
    <section className="rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-foreground">{copy.profile.title}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy.profile.subtitle}</p>
        </div>
        <button
          type="button"
          disabled
          className="inline-flex items-center justify-center whitespace-nowrap rounded-xl border border-border bg-muted px-3 py-2 text-xs font-bold text-muted-foreground"
        >
          {copy.common.comingSoon}
        </button>
      </div>
      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-border bg-[#FAFAFA] p-4">
            <dt className="text-xs font-bold text-muted-foreground">{label}</dt>
            <dd className="mt-1 min-h-5 break-words text-sm font-bold text-foreground">
              {displayValue(value, copy.common.emptyValue)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function EmptyCard({
  title,
  body,
  actionLabel,
  actionHref,
}: {
  title: string;
  body: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <section className="rounded-3xl border border-border bg-white p-6 text-center shadow-sm sm:p-10">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF3E8] text-primary">
        <ClipboardList className="h-7 w-7" aria-hidden />
      </div>
      <h2 className="mt-5 text-xl font-black text-foreground">{title}</h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{body}</p>
      <Link
        to={actionHref}
        className="mt-6 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90"
      >
        {actionLabel}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </section>
  );
}

function pageTitle(copy: CenterCopy, page: LandlordCenterPage) {
  if (page === "listings") return copy.listings.title;
  if (page === "newListing") return copy.newListing.title;
  if (page === "inquiries") return copy.inquiries.title;
  if (page === "profile") return copy.profile.title;
  return copy.dashboard.title;
}

function pageSubtitle(copy: CenterCopy, page: LandlordCenterPage) {
  if (page === "listings") return copy.listings.subtitle;
  if (page === "newListing") return copy.newListing.subtitle;
  if (page === "inquiries") return copy.inquiries.subtitle;
  if (page === "profile") return copy.profile.subtitle;
  return copy.dashboard.subtitle;
}

function centerRoute(
  locale: Locale,
  page: (typeof CENTER_NAV_ITEMS)[number]["route"] | "newListing" | "register",
) {
  const base = `/${locale}/landlords/center`;
  if (page === "dashboard") return base;
  if (page === "listings") return `${base}/listings`;
  if (page === "newListing") return `${base}/listings/new`;
  if (page === "register") return `${base}/register`;
  return `${base}/${page}`;
}

function draftHasData(draft: LandlordCenterDraft | null) {
  if (!draft) return false;

  return Boolean(
    draft.role ||
      draft.firstName ||
      draft.lastName ||
      draft.name ||
      draft.email ||
      draft.emailLocal ||
      draft.contact ||
      draft.phoneNumber ||
      draft.city ||
      draft.area ||
      draft.nearestStation ||
      draft.housingType ||
      draft.listingTitle ||
      draft.monthlyRent,
  );
}

function displayValue(value: unknown, emptyValue: string) {
  if (typeof value !== "string") return emptyValue;
  const trimmed = value.trim();
  return trimmed || emptyValue;
}

function joinValues(values?: string[]) {
  return values?.filter(Boolean).join(", ") || "";
}

function formatCurrency(value?: string) {
  const trimmed = value?.trim();
  if (!trimmed) return "";
  const digits = trimmed.replace(/,/g, "");
  if (!/^\d+$/.test(digits)) return trimmed;
  return `$${Number(digits).toLocaleString("en-CA")} CAD`;
}

function getEmail(draft: LandlordCenterDraft) {
  if (draft.email?.trim()) return draft.email.trim();
  if (draft.emailLocal?.trim() && draft.emailDomain?.trim()) {
    return `${draft.emailLocal.trim()}@${draft.emailDomain.trim()}`;
  }
  return "";
}

function getPhone(draft: LandlordCenterDraft) {
  if (draft.contact?.trim()) return draft.contact.trim();

  const countryCode =
    draft.phoneCountryCode === "__custom__"
      ? draft.phoneCountryCodeCustom?.trim()
      : draft.phoneCountryCode?.trim();

  return [countryCode, draft.phoneNumber?.trim()].filter(Boolean).join(" ");
}
