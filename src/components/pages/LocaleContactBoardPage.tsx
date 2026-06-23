import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  LockKeyhole,
  Search,
  Send,
  X,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type BoardStatus = "pending" | "answered";
type BoardCategory = "customer" | "landlord" | "maplePass" | "general";

export type ContactBoardPost = {
  id: string;
  number: number;
  status: BoardStatus;
  category: BoardCategory;
  subType: string;
  title: string;
  author: string;
  date: string;
  views: number;
  isPrivate: boolean;
  content: string;
  reply?: string;
  relatedListing?: string;
};

type ContactBoardNotice = {
  id: string;
  title: string;
  date: string;
  views: number;
};

const BOARD_PASSWORD = "1234";
const BOARD_STORAGE_KEY = "maplehouse-contact-board-posts";
const WRITE_DRAFT_STORAGE_KEY = "maplehouse.contactBoard.writeDraft.ko";
let pendingPrivatePostAccessId: string | null = null;

type ContactBoardWriteForm = {
  category: BoardCategory;
  subType: string;
  title: string;
  author: string;
  email: string;
  password: string;
  isPrivate: boolean;
  relatedListing: string;
  content: string;
  scopeAccepted: boolean;
};

type ContactBoardWriteDraft = ContactBoardWriteForm & {
  updatedAt: string;
};

const INITIAL_WRITE_FORM: ContactBoardWriteForm = {
  category: "customer",
  subType: "매물 문의",
  title: "",
  author: "",
  email: "",
  password: "",
  isPrivate: false,
  relatedListing: "",
  content: "",
  scopeAccepted: false,
};

const CATEGORY_LABELS: Record<BoardCategory, string> = {
  customer: "고객 문의",
  landlord: "임대인 문의",
  maplePass: "메이플패스",
  general: "기타 문의",
};

const STATUS_LABELS: Record<BoardStatus, string> = {
  pending: "답변 대기",
  answered: "답변 완료",
};

const CATEGORY_FILTERS: Array<{ key: "all" | BoardCategory; label: string }> = [
  { key: "all", label: "전체" },
  { key: "customer", label: "고객 문의" },
  { key: "landlord", label: "임대인 문의" },
  { key: "maplePass", label: "메이플패스" },
  { key: "general", label: "기타 문의" },
];

const BOARD_NOTICES: ContactBoardNotice[] = [
  {
    id: "notice-2",
    title: "문의 게시판은 접수 전 확인용으로 안내됩니다.",
    date: "2026-06-05",
    views: 42,
  },
  {
    id: "notice-1",
    title: "비밀글 비밀번호는 1234로 확인할 수 있습니다.",
    date: "2026-06-05",
    views: 38,
  },
];

export const CONTACT_BOARD_POSTS: ContactBoardPost[] = [
  {
    id: "104",
    number: 104,
    status: "answered",
    category: "customer",
    subType: "매물 문의",
    title: "체크리스트 추천 매물 문의 전 무엇을 확인해야 하나요?",
    author: "김**",
    date: "2026-06-05",
    views: 18,
    isPrivate: true,
    relatedListing: "Downtown room rent",
    content:
      "체크리스트에서 추천받은 기준역 근처 매물을 보고 있습니다. 실제 입주 가능 여부와 먼저 확인해야 할 조건이 궁금합니다.",
    reply:
      "안녕하세요. 선택하신 매물은 입주 가능일, 포함 비용, 집주인과의 커뮤니케이션 방식을 먼저 확인하는 것이 좋습니다.",
  },
  {
    id: "103",
    number: 103,
    status: "pending",
    category: "landlord",
    subType: "임대인 등록",
    title: "룸렌트 매물을 소개하려면 어떤 정보가 필요한가요?",
    author: "박**",
    date: "2026-06-04",
    views: 27,
    isPrivate: false,
    content:
      "룸렌트 매물을 메이플하우스에 소개하려면 필요한 정보와 등록 절차가 궁금합니다.",
  },
  {
    id: "102",
    number: 102,
    status: "answered",
    category: "maplePass",
    subType: "서비스 범위",
    title: "메이플패스에는 문의서 정리도 포함되나요?",
    author: "이**",
    date: "2026-06-03",
    views: 31,
    isPrivate: false,
    content: "매물 확인 지원과 문의서 정리가 메이플패스에 포함되는지 알고 싶습니다.",
    reply:
      "메이플패스는 향후 유료 지원 서비스의 가칭입니다. 정식 범위와 정책은 오픈 전 별도 안내가 필요합니다.",
  },
  {
    id: "101",
    number: 101,
    status: "pending",
    category: "general",
    subType: "기타 문의",
    title: "문의 카테고리 이동이 헷갈려 보여 확인 요청드립니다.",
    author: "최**",
    date: "2026-06-02",
    views: 14,
    isPrivate: true,
    content: "일부 화면에서 문의 카테고리 이동이 헷갈려 보여 오류인지 확인하고 싶습니다.",
  },
];

function readStoredPosts() {
  if (typeof window === "undefined") return [];

  try {
    const rawValue = window.sessionStorage.getItem(BOARD_STORAGE_KEY);
    if (!rawValue) return [];
    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? (parsedValue as ContactBoardPost[]) : [];
  } catch {
    return [];
  }
}

function writeStoredPost(post: ContactBoardPost) {
  if (typeof window === "undefined") return;

  const posts = readStoredPosts();
  window.sessionStorage.setItem(BOARD_STORAGE_KEY, JSON.stringify([post, ...posts]));
}

function hasMeaningfulWriteDraftContent(form: ContactBoardWriteForm) {
  return (
    form.category !== INITIAL_WRITE_FORM.category ||
    form.subType !== INITIAL_WRITE_FORM.subType ||
    form.title.trim().length > 0 ||
    form.author.trim().length > 0 ||
    form.email.trim().length > 0 ||
    form.relatedListing.trim().length > 0 ||
    form.content.trim().length > 0
  );
}

function readWriteDraft() {
  if (typeof window === "undefined") return null;

  try {
    const rawValue = window.sessionStorage.getItem(WRITE_DRAFT_STORAGE_KEY);
    if (!rawValue) return null;
    const parsedValue = JSON.parse(rawValue) as Partial<ContactBoardWriteDraft>;
    if (!parsedValue || typeof parsedValue !== "object") return null;

    const draft = {
      ...INITIAL_WRITE_FORM,
      ...parsedValue,
      category: parsedValue.category ?? INITIAL_WRITE_FORM.category,
      subType: parsedValue.subType ?? INITIAL_WRITE_FORM.subType,
      updatedAt: parsedValue.updatedAt ?? new Date().toISOString(),
    } satisfies ContactBoardWriteDraft;

    if (!hasMeaningfulWriteDraftContent(draft)) {
      window.sessionStorage.removeItem(WRITE_DRAFT_STORAGE_KEY);
      return null;
    }

    return draft;
  } catch {
    return null;
  }
}

function writeDraft(form: ContactBoardWriteForm) {
  if (typeof window === "undefined") return;

  // TODO: Replace sessionStorage draft with real authenticated draft storage later.
  const draft: ContactBoardWriteDraft = {
    ...form,
    updatedAt: new Date().toISOString(),
  };
  window.sessionStorage.setItem(WRITE_DRAFT_STORAGE_KEY, JSON.stringify(draft));
}

function clearWriteDraft() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(WRITE_DRAFT_STORAGE_KEY);
}

function hasWriteFormContent(form: ContactBoardWriteForm) {
  return (
    form.category !== INITIAL_WRITE_FORM.category ||
    form.subType !== INITIAL_WRITE_FORM.subType ||
    form.title.trim().length > 0 ||
    form.author.trim().length > 0 ||
    form.email.trim().length > 0 ||
    form.password.trim().length > 0 ||
    form.relatedListing.trim().length > 0 ||
    form.content.trim().length > 0 ||
    form.isPrivate !== INITIAL_WRITE_FORM.isPrivate ||
    form.scopeAccepted !== INITIAL_WRITE_FORM.scopeAccepted
  );
}

function getAllPosts(storedPosts: ContactBoardPost[] = []) {
  return [...storedPosts, ...CONTACT_BOARD_POSTS].sort((a, b) => b.number - a.number);
}

function getStatusClass(status: BoardStatus) {
  return status === "answered"
    ? "border border-primary/15 bg-primary/10 text-primary"
    : "border border-[#E5E7EB] bg-[#F2F3F5] text-[#2F3337]";
}

const STATUS_BADGE_CLASS =
  "inline-flex h-[1.375rem] min-w-[3rem] items-center justify-center justify-self-center whitespace-nowrap rounded-full px-1.5 text-center text-[10.5px] font-bold leading-none";

const BOARD_TABLE_GRID =
  "lg:grid-cols-[4.5rem_5.375rem_6rem_minmax(0,1fr)_6.25rem_7.5rem_4.5rem]";

function PostBadges({ post }: { post: ContactBoardPost }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={cn(STATUS_BADGE_CLASS, getStatusClass(post.status))}>
        {STATUS_LABELS[post.status]}
      </span>
      <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-muted-foreground ring-1 ring-border">
        {CATEGORY_LABELS[post.category]}
      </span>
      {post.isPrivate ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-muted-foreground ring-1 ring-border">
          <LockKeyhole className="h-3 w-3 text-primary" aria-hidden />
          비밀글
        </span>
      ) : null}
    </div>
  );
}

function PasswordDialog({
  title,
  description,
  error,
  value,
  onChange,
  onClose,
  onSubmit,
}: {
  title: string;
  description: string;
  error: string;
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6">
      <form
        className="w-full max-w-md rounded-3xl border border-primary/20 bg-white p-5 shadow-2xl"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <LockKeyhole className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-foreground">{title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-primary/35 hover:text-primary"
            aria-label="닫기"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <input
          type="password"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="비밀번호를 입력해주세요"
          className="mt-5 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-primary"
        />
        {error ? <p className="mt-2 text-sm font-semibold text-primary">{error}</p> : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white">
            확인
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-bold text-muted-foreground"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

function BoardBreadcrumb({
  current,
  onNavigate,
}: {
  current?: string;
  onNavigate?: (to: string) => void;
}) {
  const linkClass =
    "whitespace-nowrap text-sm font-semibold text-muted-foreground transition hover:text-primary";
  const separator = <ChevronRight className="h-3.5 w-3.5 shrink-0 text-primary/70" aria-hidden />;

  const renderLink = (to: string, label: string) =>
    onNavigate ? (
      <button type="button" onClick={() => onNavigate(to)} className={linkClass}>
        {label}
      </button>
    ) : (
      <Link to={to} className={linkClass}>
        {label}
      </Link>
    );

  return (
    <nav className="flex flex-wrap items-center gap-1.5 text-sm" aria-label="breadcrumb">
      {renderLink("/ko/contact", "문의하기")}
      {separator}
      {current ? (
        renderLink("/ko/contact/board", "문의 게시판")
      ) : (
        <span className="whitespace-nowrap font-semibold text-foreground">문의 게시판</span>
      )}
      {current ? (
        <>
          {separator}
          <span className="whitespace-nowrap font-semibold text-foreground">{current}</span>
        </>
      ) : null}
    </nav>
  );
}

function BoardSelectField<TValue extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: TValue;
  options: Array<{ value: TValue; label: string }>;
  onChange: (value: TValue) => void;
}) {
  return (
    <div>
      <span className="text-sm font-bold text-foreground">{label}</span>
      <Select value={value} onValueChange={(nextValue) => onChange(nextValue as TValue)}>
        <SelectTrigger className="mt-2 h-11 rounded-xl border-border bg-white px-4 text-sm font-semibold shadow-none focus:ring-primary/20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-border bg-white text-foreground shadow-xl">
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="rounded-lg px-3 py-2 pr-8 text-sm font-semibold focus:bg-[#FFF3E6] focus:text-primary data-[state=checked]:bg-[#FFF3E6] data-[state=checked]:text-primary"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function UnsavedLeaveDialog({
  onStay,
  onLeave,
}: {
  onStay: () => void;
  onLeave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6">
      <section className="w-full max-w-md rounded-3xl border border-primary/20 bg-white p-5 shadow-2xl">
        <h2 className="text-lg font-extrabold text-foreground">문의글 작성을 취소하시겠습니까?</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          작성 중인 내용은 임시저장되어 있지만, 지금 이동하면 작성 화면을 벗어나게 됩니다.
        </p>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onStay}
            className="rounded-2xl border border-border bg-white px-4 py-2.5 text-sm font-bold text-muted-foreground"
          >
            계속 작성할게요
          </button>
          <button
            type="button"
            onClick={onLeave}
            className="rounded-2xl bg-primary px-4 py-2.5 text-sm font-bold text-white"
          >
            작성 취소할게요
          </button>
        </div>
      </section>
    </div>
  );
}

export function ContactBoardListPage() {
  const navigate = useNavigate();
  const [categoryFilter, setCategoryFilter] = useState<"all" | BoardCategory>("all");
  const [query, setQuery] = useState("");
  const [storedPosts, setStoredPosts] = useState<ContactBoardPost[]>([]);
  const [passwordPost, setPasswordPost] = useState<ContactBoardPost | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    setStoredPosts(readStoredPosts());
  }, []);

  const posts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return getAllPosts(storedPosts).filter((post) => {
      const matchesCategory = categoryFilter === "all" || post.category === categoryFilter;
      const matchesQuery =
        !normalizedQuery ||
        post.title.toLowerCase().includes(normalizedQuery) ||
        post.content.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [categoryFilter, query, storedPosts]);

  const openPost = (post: ContactBoardPost) => {
    if (post.isPrivate) {
      setPasswordPost(post);
      setPasswordInput("");
      setPasswordError("");
      return;
    }

    void navigate({ to: "/ko/contact/board/$postId", params: { postId: post.id } });
  };

  const confirmPassword = () => {
    if (!passwordPost) return;

    if (passwordInput.trim() !== BOARD_PASSWORD) {
      setPasswordError("비밀번호가 맞지 않습니다.");
      return;
    }

    pendingPrivatePostAccessId = passwordPost.id;
    void navigate({ to: "/ko/contact/board/$postId", params: { postId: passwordPost.id } });
  };

  return (
    <main className="bg-[#F8F7F4] [word-break:keep-all]">
      <Container className="max-w-[1180px] py-8 sm:py-10 lg:py-12">
        <BoardBreadcrumb />

        <section className="mt-4 rounded-[1.75rem] bg-gradient-to-br from-[#FF8A3D] via-[#FF7A1A] to-[#FF9F59] p-5 text-white shadow-lg shadow-primary/15 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/75">
                SUPPORT BOARD
              </p>
              <h1 className="mt-2 text-3xl font-extrabold leading-tight text-white">
                문의 게시판
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/85">
                공개 문의와 답변 상태를 확인하거나 새 문의글을 작성할 수 있습니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/ko/contact/board/write"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2.5 text-sm font-bold text-primary shadow-sm"
              >
                문의글 작성
              </Link>
              <Link
                to="/ko/contact"
                className="inline-flex items-center justify-center rounded-2xl border border-white/45 bg-white/15 px-4 py-2.5 text-sm font-bold text-white"
              >
                문의하기 홈
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-3xl border border-border/80 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-5">
            <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap">
              {CATEGORY_FILTERS.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setCategoryFilter(filter.key)}
                  className={cn(
                    "whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold transition",
                    categoryFilter === filter.key
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-white text-muted-foreground hover:border-primary/35 hover:text-primary",
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="flex w-full justify-start lg:ml-auto lg:w-auto lg:shrink-0 lg:justify-end">
              <label className="flex w-full min-w-0 items-center gap-2 rounded-2xl border border-border bg-[#FCFCFB] px-3 py-2 sm:max-w-sm lg:w-80">
                <Search className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="제목이나 내용을 검색해보세요"
                  className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-muted-foreground"
                />
              </label>
            </div>
          </div>
        </section>

        <section className="mt-5 overflow-hidden rounded-3xl border border-border/80 bg-white shadow-sm">
          <div className={cn("hidden gap-2 border-b border-border/70 bg-[#FCFCFB] px-4 py-3 text-xs font-bold text-muted-foreground lg:grid", BOARD_TABLE_GRID)}>
            <span className="text-center">번호</span>
            <span className="text-center">상태</span>
            <span className="text-center">유형</span>
            <span className="text-center">제목</span>
            <span className="text-center">작성자</span>
            <span className="text-center">작성일</span>
            <span className="text-center">조회</span>
          </div>

          <div className="divide-y divide-border/70">
            {BOARD_NOTICES.map((notice) => (
              <article
                key={notice.id}
                className={cn("grid gap-2 bg-[#FFF8F1] px-4 py-4 text-sm lg:items-center", BOARD_TABLE_GRID)}
              >
                <span className="text-center text-xs font-bold text-primary">공지</span>
                <span className={cn(STATUS_BADGE_CLASS, "border border-primary/15 bg-white text-primary")}>
                  안내
                </span>
                <span className="text-center text-xs font-bold text-muted-foreground">공지</span>
                <h2 className="min-w-0 truncate text-center text-sm font-bold leading-snug text-foreground">{notice.title}</h2>
                <span className="min-w-0 text-center text-xs font-semibold text-muted-foreground">
                  <span className="inline-block max-w-full truncate align-middle">Maple</span>
                </span>
                <span className="text-center text-xs font-semibold text-muted-foreground">{notice.date}</span>
                <span className="text-center text-xs font-semibold text-muted-foreground">{notice.views}</span>
              </article>
            ))}

            {posts.map((post) => (
              <button
                key={post.id}
                type="button"
                onClick={() => openPost(post)}
                className={cn("grid w-full cursor-pointer gap-2 px-4 py-4 text-left text-sm transition hover:bg-[#FFF8F0] focus-visible:bg-[#FFF8F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 lg:items-center", BOARD_TABLE_GRID)}
              >
                <span className="text-center text-xs font-bold text-muted-foreground">{post.number}</span>
                <span className={cn(STATUS_BADGE_CLASS, getStatusClass(post.status))}>
                  {STATUS_LABELS[post.status]}
                </span>
                <span className="text-center text-xs font-bold text-muted-foreground">{CATEGORY_LABELS[post.category]}</span>
                <span className="min-w-0 text-center">
                  <span className="inline-flex max-w-full min-w-0 items-center justify-center gap-2 align-middle">
                    {post.isPrivate ? <LockKeyhole className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden /> : null}
                    <span className="min-w-0 truncate text-sm font-bold leading-snug text-foreground">
                      {post.title}
                    </span>
                  </span>
                  <span className="mt-1 block truncate text-center text-xs font-medium text-muted-foreground lg:hidden">
                    {post.author} · {post.date} · 조회 {post.views}
                  </span>
                </span>
                <span className="hidden min-w-0 text-center text-xs font-semibold text-muted-foreground lg:block">
                  <span className="inline-block max-w-full truncate align-middle">{post.author}</span>
                </span>
                <span className="hidden text-center text-xs font-semibold text-muted-foreground lg:block">{post.date}</span>
                <span className="hidden text-center text-xs font-semibold text-muted-foreground lg:block">{post.views}</span>
              </button>
            ))}

            {posts.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm font-semibold text-muted-foreground">
                조건에 맞는 문의글이 없습니다.
              </p>
            ) : null}
          </div>
        </section>
      </Container>

      {passwordPost ? (
        <PasswordDialog
          title="비밀글 확인"
          description="비밀글 내용을 보려면 비밀번호를 입력해 주세요."
          value={passwordInput}
          error={passwordError}
          onChange={setPasswordInput}
          onClose={() => {
            setPasswordPost(null);
            setPasswordInput("");
            setPasswordError("");
          }}
          onSubmit={confirmPassword}
        />
      ) : null}
    </main>
  );
}

export function ContactBoardDetailPage({ postId }: { postId: string }) {
  const [storedPosts, setStoredPosts] = useState<ContactBoardPost[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    setStoredPosts(readStoredPosts());
    const hasPendingAccess = pendingPrivatePostAccessId === postId;
    setIsUnlocked(hasPendingAccess);

    if (!hasPendingAccess) return;

    const resetAccessId = window.setTimeout(() => {
      if (pendingPrivatePostAccessId === postId) {
        pendingPrivatePostAccessId = null;
      }
    }, 0);

    return () => window.clearTimeout(resetAccessId);
  }, [postId]);

  const posts = getAllPosts(storedPosts);
  const post = posts.find((item) => item.id === postId) ?? null;
  const currentIndex = post ? posts.findIndex((item) => item.id === post.id) : -1;
  const previousPost = currentIndex >= 0 ? posts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const shouldProtectContent = Boolean(post?.isPrivate && !isUnlocked);

  const confirmPassword = () => {
    if (!post) return;

    if (passwordInput.trim() !== BOARD_PASSWORD) {
      setPasswordError("비밀번호가 맞지 않습니다.");
      return;
    }

    setIsUnlocked(true);
    setPasswordInput("");
    setPasswordError("");
  };

  if (!post) {
    return (
      <main className="bg-[#F8F7F4] [word-break:keep-all]">
        <Container className="max-w-[980px] py-10">
          <section className="rounded-3xl border border-border/80 bg-white p-8 text-center shadow-sm">
            <h1 className="text-xl font-bold text-foreground">문의글을 찾을 수 없습니다.</h1>
            <Link
              to="/ko/contact/board"
              className="mt-5 inline-flex rounded-2xl bg-primary px-4 py-2.5 text-sm font-bold text-white"
            >
              목록으로
            </Link>
          </section>
        </Container>
      </main>
    );
  }

  return (
    <main className="bg-[#F8F7F4] [word-break:keep-all]">
      <Container className="max-w-[980px] py-8 sm:py-10 lg:py-12">
        <BoardBreadcrumb current="문의 상세" />

        <article className="mt-4 rounded-[1.75rem] border border-border/80 bg-white p-5 shadow-sm sm:p-6">
          {shouldProtectContent ? (
            <form
              className="mx-auto max-w-md rounded-3xl border border-primary/20 bg-[#FFF8F1] p-5"
              onSubmit={(event) => {
                event.preventDefault();
                confirmPassword();
              }}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
                  <LockKeyhole className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h1 className="text-base font-bold text-foreground">비밀글 확인</h1>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    이 문의글은 비밀글입니다. 내용을 보려면 비밀번호를 입력해 주세요.
                  </p>
                </div>
              </div>
              <input
                type="password"
                value={passwordInput}
                onChange={(event) => setPasswordInput(event.target.value)}
                placeholder="비밀번호를 입력해주세요"
                className="mt-5 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-primary"
              />
              {passwordError ? (
                <p className="mt-2 text-sm font-semibold text-primary">{passwordError}</p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white">
                  확인
                </button>
                <Link
                  to="/ko/contact/board"
                  className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-bold text-muted-foreground"
                >
                  목록으로
                </Link>
              </div>
            </form>
          ) : (
            <>
              <div className="flex flex-col gap-4 border-b border-border/70 pb-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <PostBadges post={post} />
                  <h1 className="mt-4 text-2xl font-extrabold leading-tight text-foreground">
                    {post.title}
                  </h1>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-muted-foreground">
                    <span>작성자: {post.author}</span>
                    <span>작성일: {post.date}</span>
                    <span>조회: {post.views}</span>
                    <span>{post.subType}</span>
                  </div>
                </div>
                <Link
                  to="/ko/contact/board/write"
                  className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-primary px-4 py-2.5 text-sm font-bold text-white"
                >
                  문의글 작성
                </Link>
              </div>

              <section className="mt-5 rounded-3xl bg-[#FCFCFB] p-5">
                <h2 className="text-sm font-bold text-foreground">문의 내용</h2>
                {post.relatedListing ? (
                  <p className="mt-2 rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-muted-foreground">
                    관련 매물: {post.relatedListing}
                  </p>
                ) : null}
                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-foreground">
                  {post.content}
                </p>
              </section>

              <section className="mt-4 rounded-3xl border border-primary/15 bg-[#FFF8F1] p-5">
                <h2 className="text-sm font-bold text-primary">MapleHouse 답변</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {post.reply ?? "아직 답변을 기다리는 문의입니다."}
                </p>
              </section>
            </>
          )}
        </article>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            to="/ko/contact/board"
            className="inline-flex items-center gap-1 rounded-2xl border border-border bg-white px-4 py-2.5 text-sm font-bold text-muted-foreground"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            목록으로
          </Link>
          <Link
            to="/ko/contact/board/write"
            className="inline-flex rounded-2xl border border-primary/25 bg-white px-4 py-2.5 text-sm font-bold text-primary"
          >
            문의글 작성
          </Link>
          {previousPost ? (
            <a
              href={`/ko/contact/board/${previousPost.id}`}
              className="inline-flex rounded-2xl border border-border bg-white px-4 py-2.5 text-sm font-bold text-muted-foreground"
            >
              이전글
            </a>
          ) : null}
          {nextPost ? (
            <a
              href={`/ko/contact/board/${nextPost.id}`}
              className="inline-flex items-center gap-1 rounded-2xl border border-border bg-white px-4 py-2.5 text-sm font-bold text-muted-foreground"
            >
              다음글
              <ChevronRight className="h-4 w-4" aria-hidden />
            </a>
          ) : null}
        </div>
      </Container>
    </main>
  );
}

export function ContactBoardWritePage() {
  const [form, setForm] = useState<ContactBoardWriteForm>(INITIAL_WRITE_FORM);
  const [formError, setFormError] = useState("");
  const [savedPost, setSavedPost] = useState<ContactBoardPost | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  const hasUnsavedContent = !savedPost && hasWriteFormContent(form);

  const updateForm = (field: keyof typeof form, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  useEffect(() => {
    const draft = readWriteDraft();
    if (!draft) return;

    setForm({
      category: draft.category,
      subType: draft.subType,
      title: draft.title,
      author: draft.author,
      email: draft.email,
      password: draft.password,
      isPrivate: draft.isPrivate,
      relatedListing: draft.relatedListing,
      content: draft.content,
      scopeAccepted: draft.scopeAccepted,
    });
    setDraftRestored(true);
  }, []);

  useEffect(() => {
    if (savedPost) return undefined;

    const intervalId = window.setInterval(() => {
      if (hasWriteFormContent(form)) {
        writeDraft(form);
      }
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, [form, savedPost]);

  useEffect(() => {
    if (!hasUnsavedContent) return undefined;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedContent]);

  const requestNavigation = (to: string) => {
    if (hasUnsavedContent) {
      setPendingNavigation(to);
      return;
    }

    window.location.href = to;
  };

  const confirmPendingNavigation = () => {
    const to = pendingNavigation;
    if (!to) return;

    clearWriteDraft();
    setForm(INITIAL_WRITE_FORM);
    setPendingNavigation(null);
    window.location.href = to;
  };

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !form.title.trim() ||
      !form.author.trim() ||
      !form.password.trim() ||
      !form.content.trim() ||
      !form.scopeAccepted
    ) {
      setFormError("제목, 작성자명, 비밀번호, 문의 내용, 안내 동의를 확인해 주세요.");
      setSavedPost(null);
      return;
    }

    const createdAt = new Date();
    const existingPosts = getAllPosts(readStoredPosts());
    const post: ContactBoardPost = {
      id: `mock-${createdAt.getTime()}`,
      number: Math.max(...existingPosts.map((item) => item.number), 104) + 1,
      status: "pending",
      category: form.category,
      subType: form.subType,
      title: form.title.trim(),
      author: form.author.trim(),
      date: createdAt.toISOString().slice(0, 10),
      views: 0,
      isPrivate: form.isPrivate,
      relatedListing: form.relatedListing.trim() || undefined,
      content: form.content.trim(),
    };

    writeStoredPost(post);
    clearWriteDraft();
    setSavedPost(post);
    setDraftRestored(false);
    setFormError("");
    setForm(INITIAL_WRITE_FORM);
  };

  return (
    <main className="bg-[#F8F7F4] [word-break:keep-all]">
      <Container className="max-w-[980px] py-8 sm:py-10 lg:py-12">
        <BoardBreadcrumb current="문의글 작성" onNavigate={requestNavigation} />

        <section className="mt-4 rounded-[1.75rem] bg-gradient-to-br from-[#FF8A3D] via-[#FF7A1A] to-[#FF9F59] p-5 text-white shadow-lg shadow-primary/15 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/75">
            SUPPORT BOARD
          </p>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight text-white">
            문의글 작성
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/85">
            현재 작성 내용은 저장 후 같은 브라우저 세션에서 목록에 표시될 수 있습니다.
          </p>
        </section>

        {savedPost ? (
          <section className="mt-5 rounded-3xl border border-primary/20 bg-[#FFF8F1] p-5">
            <h2 className="text-base font-bold text-foreground">문의글이 등록되었습니다.</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              실제 접수나 이메일 발송은 연결되어 있지 않습니다.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to="/ko/contact/board"
                className="rounded-2xl bg-primary px-4 py-2.5 text-sm font-bold text-white"
              >
                문의 목록으로
              </Link>
              <a
                href={`/ko/contact/board/${savedPost.id}`}
                className="rounded-2xl border border-border bg-white px-4 py-2.5 text-sm font-bold text-muted-foreground"
              >
                작성글 보기
              </a>
            </div>
          </section>
        ) : null}

        <form className="mt-5 space-y-4 rounded-3xl border border-border/80 bg-white p-5 shadow-sm sm:p-6" onSubmit={submitForm}>
          <div className="border-b border-border/70 pb-4">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                MOCK INQUIRY
              </p>
              <h2 className="mt-1 text-lg font-bold text-foreground">문의 정보</h2>
            </div>
          </div>

          {draftRestored ? (
            <p className="rounded-2xl border border-primary/20 bg-[#FFF8F1] px-4 py-3 text-sm font-semibold text-primary">
              임시저장된 문의글을 불러왔습니다.
            </p>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-2">
            <BoardSelectField
              label="문의 유형"
              value={form.category}
              options={CATEGORY_FILTERS.filter((filter) => filter.key !== "all").map((filter) => ({
                value: filter.key as BoardCategory,
                label: filter.label,
              }))}
              onChange={(value) => updateForm("category", value)}
            />
            <BoardSelectField
              label="세부 유형"
              value={form.subType}
              options={["매물 문의", "입주/계약 전 확인", "임대인 등록", "메이플패스", "기타 문의"].map((subType) => ({
                value: subType,
                label: subType,
              }))}
              onChange={(value) => updateForm("subType", value)}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-foreground">제목</span>
              <input
                value={form.title}
                onChange={(event) => updateForm("title", event.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-foreground">작성자</span>
              <input
                value={form.author}
                onChange={(event) => updateForm("author", event.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-primary"
              />
            </label>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-foreground">이메일</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateForm("email", event.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-foreground">비밀번호</span>
              <input
                type="password"
                value={form.password}
                onChange={(event) => updateForm("password", event.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-primary"
              />
              <span className="mt-1 block text-xs text-muted-foreground">
                비밀글 확인에 사용할 비밀번호입니다.
              </span>
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-bold text-foreground">관련 매물명 또는 매물번호</span>
            <input
              value={form.relatedListing}
              onChange={(event) => updateForm("relatedListing", event.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-primary"
            />
          </label>

          <div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm font-bold text-foreground">문의 내용</span>
              <label
                className={cn(
                  "inline-flex w-fit shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-bold transition",
                  form.isPrivate
                    ? "border-primary/25 bg-[#FFF8F1] text-foreground"
                    : "border-border bg-white text-foreground",
                )}
              >
                <input
                  type="checkbox"
                  checked={form.isPrivate}
                  onChange={(event) => updateForm("isPrivate", event.target.checked)}
                  className="mh-orange-checkbox"
                />
                <span>비밀글로 작성</span>
              </label>
            </div>
            <textarea
              value={form.content}
              onChange={(event) => updateForm("content", event.target.value)}
              placeholder="문의 내용을 입력해주세요."
              rows={7}
              className="mt-2 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-semibold leading-relaxed outline-none focus:border-primary"
            />
          </div>

          <div className="rounded-2xl border border-dashed border-primary/30 bg-[#FFF8F1] p-4">
            <p className="text-sm font-bold text-foreground">첨부 파일</p>
            <p className="mt-1 text-sm text-muted-foreground">
              파일 첨부 내용은 화면에서 확인용으로 표시됩니다.
            </p>
          </div>

          <div className="space-y-3">
            <label
              className={cn(
                "flex items-start gap-3 rounded-2xl border p-3 text-sm font-semibold text-foreground transition",
                form.scopeAccepted
                  ? "border-primary/25 bg-[#FFF8F1]"
                  : "border-border bg-white",
              )}
            >
              <input
                type="checkbox"
                checked={form.scopeAccepted}
                onChange={(event) => updateForm("scopeAccepted", event.target.checked)}
                className="mh-orange-checkbox mt-1"
              />
              <span>입력한 문의 내용과 안내 사항을 확인했습니다.</span>
            </label>
          </div>

          {formError ? (
            <p className="rounded-2xl border border-primary/20 bg-[#FFF8F1] px-4 py-3 text-sm font-semibold text-primary">
              {formError}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm"
            >
              <Send className="h-4 w-4" aria-hidden />
              문의 등록
            </button>
            <button
              type="button"
              onClick={() => requestNavigation("/ko/contact/board")}
              className="inline-flex items-center justify-center rounded-2xl border border-border bg-white px-5 py-3 text-sm font-bold text-muted-foreground"
            >
              문의 목록으로
            </button>
            <button
              type="button"
              onClick={() => requestNavigation("/ko/contact")}
              className="inline-flex items-center justify-center rounded-2xl border border-border bg-white px-5 py-3 text-sm font-bold text-muted-foreground"
            >
              작성 취소
            </button>
          </div>
        </form>
      </Container>
      {pendingNavigation ? (
        <UnsavedLeaveDialog
          onStay={() => setPendingNavigation(null)}
          onLeave={confirmPendingNavigation}
        />
      ) : null}
    </main>
  );
}
