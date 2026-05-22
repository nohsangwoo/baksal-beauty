"use client";

import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Copy,
  FileText,
  GripVertical,
  ImagePlus,
  Inbox,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Plus,
  Save,
  Scissors,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import { useMemo, useState, type DragEvent, type FormEvent } from "react";

type DemoTab = "dashboard" | "users" | "services" | "blog" | "inquire";
type DemoRecordKind = "service" | "blog" | "inquire";
type DemoStatus = "published" | "draft" | "new" | "replied";
type DemoRole = "Owner" | "Admin" | "Manager" | "Staff" | "Patient";

type DemoSection = {
  id: string;
  title: string;
  body: string;
};

type DemoRecord = {
  id: string;
  title: string;
  subtitle: string;
  status: DemoStatus;
  image: string;
  sections: DemoSection[];
};

type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: DemoRole;
  status: "active" | "pending" | "suspended";
  image: string;
};

const demoAccount = {
  email: "testadmin@ludgi.ai",
  password: "ludgi-demo",
};

const tabs: { id: DemoTab; label: string; Icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { id: "users", label: "Users / RBAC", Icon: Users },
  { id: "services", label: "Service", Icon: Scissors },
  { id: "blog", label: "Blog", Icon: FileText },
  { id: "inquire", label: "Inquire", Icon: Inbox },
];

const roles: DemoRole[] = ["Owner", "Admin", "Manager", "Staff", "Patient"];
const statuses: DemoStatus[] = ["published", "draft", "new", "replied"];

const initialServices: DemoRecord[] = [
  {
    id: "eye",
    title: "Natural Eye Design",
    subtitle: "눈성형 · 상세 이미지 3장 · before/after 포함",
    status: "published",
    image: "/images/service-eye-design.jpg",
    sections: [
      { id: "hero", title: "Hero", body: "자연유착 눈매 디자인의 핵심 문구와 대표 이미지를 관리합니다." },
      { id: "detail", title: "Detail Image Flow", body: "쿠팡 상세페이지처럼 긴 이미지 섹션을 순서대로 배치합니다." },
      { id: "video", title: "YouTube Preview", body: "관리자가 노출 개수와 순서를 조정하는 영상 프리뷰입니다." },
    ],
  },
  {
    id: "nose",
    title: "Balanced Rhinoplasty",
    subtitle: "코성형 · 추천 서비스 연결 · 상담 CTA",
    status: "draft",
    image: "/images/treatment-rhinoplasty.jpg",
    sections: [
      { id: "summary", title: "Surgery Summary", body: "수술시간, 마취, 회복기간 요약 정보를 관리합니다." },
      { id: "target", title: "Recommended For", body: "추천 대상과 비추천 조건을 간단히 정리합니다." },
      { id: "compare", title: "Before & After", body: "전후 비교 이미지를 관리합니다." },
    ],
  },
  {
    id: "lift",
    title: "Deep Structure Lifting",
    subtitle: "리프팅 · 섹션 순서 편집 · 공개 토글",
    status: "published",
    image: "/images/service-lifting.jpg",
    sections: [
      { id: "hook", title: "Hook Copy", body: "첫 화면에서 보여줄 후킹 문구를 조정합니다." },
      { id: "care", title: "After Care", body: "회복 관리와 내원 일정을 설명합니다." },
      { id: "cta", title: "CTA", body: "문의 전환 버튼과 안내 문구를 관리합니다." },
    ],
  },
];

const initialPosts: DemoRecord[] = [
  {
    id: "seo",
    title: "병원 홈페이지 SEO 구조",
    subtitle: "콘텐츠 노출과 문의 전환 설계",
    status: "published",
    image: "/images/blog-consultation.jpg",
    sections: [
      { id: "intro", title: "Opening Hook", body: "환자가 검색하는 순간의 고민을 첫 문단에서 바로 받아주고, 병원 홈페이지 제작 문의로 자연스럽게 이어지도록 구성합니다." },
      { id: "intent", title: "Search Intent Map", body: "병원 홈페이지, 성형외과 홈페이지 제작, 홈페이지 제작 의뢰처럼 전환 의도가 높은 키워드를 문단 구조와 소제목에 분산합니다." },
      { id: "visual", title: "Visual Story", body: "실제 데모 화면, 상담 폼, 관리자 CMS 이미지를 배치해 단순 제작사가 아니라 운영까지 설계하는 파트너임을 보여줍니다." },
      { id: "proof", title: "Trust Proof", body: "Neon DB, Blob Storage, Firebase Auth, 다국어 SEO, 문의 자동화 등 구현 가능한 기능을 근거 중심으로 설명합니다." },
      { id: "cta", title: "Conversion CTA", body: "글 중간과 마지막에 홈페이지 제작 문의 버튼을 반복 배치하고, 빠른 상담으로 이어지는 문구를 짧게 정리합니다." },
      { id: "publish", title: "Publish Checklist", body: "SEO 제목, OG 이미지, RSS 노출, sitemap 반영 여부를 공개 전 체크하는 관리 흐름을 제공합니다." },
    ],
  },
  {
    id: "cms",
    title: "관리자 CMS 운영 가이드",
    subtitle: "블로그, 서비스, 문의 관리",
    status: "draft",
    image: "/images/blog-recovery.jpg",
    sections: [
      { id: "editor", title: "Visual Editor", body: "콘텐츠를 선택하면 실제 블로그 상세 페이지와 비슷한 중앙 화면에서 문구를 직접 클릭해 수정할 수 있습니다." },
      { id: "blocks", title: "Block Library", body: "히어로, 본문 이미지, 인용, CTA, 체크리스트 블록을 기본 템플릿으로 제공하고 순서를 자유롭게 바꾸는 구조입니다." },
      { id: "language", title: "Language Tabs", body: "한국어를 기준으로 영어, 중국어, 일본어 번역 초안을 생성하고 언어별 문구를 별도로 검수하는 흐름을 보여줍니다." },
      { id: "draft", title: "Draft Flow", body: "임시저장과 공개 상태를 분리해 원고 검수 중에도 실제 사용자 화면에는 노출되지 않도록 관리합니다." },
      { id: "image", title: "Image Handling", body: "대표 이미지와 본문 이미지를 드래그 앤 드랍으로 넣고, 공개 전 미리보기에서 비율과 톤을 확인합니다." },
      { id: "seo", title: "SEO Assist", body: "검색 제목, 설명, 키워드, 내부 링크를 편집 화면에서 함께 관리해 콘텐츠 발행 품질을 일정하게 유지합니다." },
    ],
  },
];

const initialInquiries: DemoRecord[] = [
  {
    id: "inq-1",
    title: "성형외과 홈페이지 제작 문의",
    subtitle: "clinic@example.com · 관리자 CMS 포함",
    status: "new",
    image: "/images/clinic-interior.jpg",
    sections: [
      { id: "request", title: "Original Inquiry", body: "성형외과 홈페이지 신규 제작, 블로그 SEO, 문의 관리, 다국어 페이지 구축이 가능한지 문의했습니다." },
      { id: "priority", title: "Priority Notes", body: "브랜드 무드가 이미 정해져 있고 빠른 런칭이 필요해 초기 견적과 작업 범위를 먼저 안내해야 합니다." },
      { id: "attachments", title: "Attachment Review", body: "레퍼런스 이미지 3장과 기존 홈페이지 캡처가 첨부된 것으로 가정하고 관리자 화면에서 바로 확인합니다." },
      { id: "reply", title: "Reply Draft", body: "안녕하세요. 주식회사 럿지입니다. 전달주신 병원 홈페이지 제작 범위를 기준으로 1차 미팅 가능 일정과 예상 구축 항목을 안내드립니다." },
      { id: "status", title: "Follow-up Timeline", body: "신규 접수, 담당자 배정, 답변 작성, 답변 완료 순서로 처리 상태를 관리합니다." },
      { id: "memo", title: "Internal Memo", body: "테스트 관리자에서는 실제 메일 발송 없이 답변 작성과 상태 변경 흐름만 체험할 수 있습니다." },
    ],
  },
  {
    id: "inq-2",
    title: "블로그 SEO 리뉴얼 상담",
    subtitle: "marketing@example.com · 다국어 콘텐츠",
    status: "replied",
    image: "/images/blog-laser.jpg",
    sections: [
      { id: "request", title: "Original Inquiry", body: "기존 병원 블로그 구조 개선, 진료 과목별 SEO 랜딩 페이지, 일본어와 중국어 콘텐츠 전환을 문의했습니다." },
      { id: "scope", title: "Scope Summary", body: "기존 게시글을 유지하면서 카테고리 구조와 URL 설계를 정리하고, 블로그 상세 화면 템플릿을 재정비하는 방향입니다." },
      { id: "reply", title: "Reply Sent", body: "답변 완료 상태로 변경된 mock 문의입니다. 운영 데이터와 완전히 분리된 데모용 응답 내역입니다." },
      { id: "history", title: "Reply History", body: "2026.05.22 오후 3:10 답변 발송, 2026.05.22 오후 4:00 추가 자료 요청으로 기록된 시나리오입니다." },
      { id: "next", title: "Next Action", body: "콘텐츠 이전 범위와 관리자가 직접 수정할 필드 목록을 정리해 후속 미팅에서 확인합니다." },
    ],
  },
];

const initialUsers: DemoUser[] = [
  { id: "owner", name: "Demo Owner", email: "owner@test.local", role: "Owner", status: "active", image: "/images/doctor-director.jpg" },
  { id: "manager", name: "Demo Manager", email: "manager@test.local", role: "Manager", status: "active", image: "/images/doctor-contour.jpg" },
  { id: "staff", name: "Demo Staff", email: "staff@test.local", role: "Staff", status: "pending", image: "/images/doctor-skin.jpg" },
];

export function TestAdminDemo() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState(demoAccount.email);
  const [password, setPassword] = useState(demoAccount.password);
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<DemoTab>("dashboard");
  const [services, setServices] = useState(initialServices);
  const [posts, setPosts] = useState(initialPosts);
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [users, setUsers] = useState(initialUsers);
  const [selectedIds, setSelectedIds] = useState<Record<Exclude<DemoTab, "dashboard" | "users">, string>>({
    services: initialServices[0].id,
    blog: initialPosts[0].id,
    inquire: initialInquiries[0].id,
  });
  const [toast, setToast] = useState("");

  const counts = useMemo(
    () => ({
      services: services.length,
      blog: posts.length,
      inquire: inquiries.length,
      users: users.length,
    }),
    [inquiries.length, posts.length, services.length, users.length],
  );

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (email.trim() === demoAccount.email && password === demoAccount.password) {
      setLoggedIn(true);
      setLoginError("");
      showToast("Demo admin opened. This route uses mock data only.");
      return;
    }

    setLoginError("데모 계정 정보가 일치하지 않습니다.");
  }

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  if (!loggedIn) {
    return (
      <section className="mx-auto grid min-h-[calc(100svh-7rem)] w-full max-w-6xl place-items-center px-4 py-12">
        <form className="glass-panel w-full max-w-xl p-7 md:p-9" onSubmit={handleLogin}>
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#dec47b]/35 bg-[#dec47b]/10 text-[#dec47b]">
            <LockKeyhole size={20} />
          </div>
          <p className="eyebrow mt-6 text-[#dec47b]">Front-End Demo Admin</p>
          <h1 className="font-display mt-4 text-5xl">Test Admin</h1>
          <p className="mt-5 leading-8 text-[#d9d0c9]">
            실제 Firebase, Neon DB, 관리자 API와 연결되지 않는 공개 데모 전용입니다. 보이는 데이터, 저장,
            이미지 변경, RBAC 변경은 모두 브라우저 안에서만 처리됩니다.
          </p>
          <div className="mt-6 rounded-md border border-white/10 bg-white/[0.04] p-4 text-sm leading-7 text-white/78">
            <p>
              Demo ID: <span className="font-black text-[#dec47b]">{demoAccount.email}</span>
            </p>
            <p>
              Password: <span className="font-black text-[#dec47b]">{demoAccount.password}</span>
            </p>
          </div>
          <div className="mt-7 grid gap-4">
            <label className="grid gap-2 text-xs font-black uppercase">
              Email
              <input className="form-field" value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <label className="grid gap-2 text-xs font-black uppercase">
              Password
              <input className="form-field" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </label>
          </div>
          {loginError ? <p className="mt-4 text-sm font-bold text-[#ff9aad]">{loginError}</p> : null}
          <button className="button-primary mt-7 w-full" type="submit">
            <ShieldCheck size={16} />
            Open Demo Console
          </button>
        </form>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100svh-7rem)] px-3 py-4 sm:px-4 lg:px-5">
      {toast ? (
        <div className="fixed right-5 top-28 z-[80] flex items-center gap-2 rounded-md border border-emerald-300/30 bg-emerald-400/15 px-4 py-3 text-sm font-black text-emerald-100 shadow-2xl">
          <CheckCircle2 size={16} />
          {toast}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="glass-panel h-fit p-4 xl:sticky xl:top-28">
          <div className="border-b border-white/10 p-3">
            <p className="eyebrow text-[#dec47b]">Demo Console</p>
            <h2 className="font-display mt-3 text-3xl">BAKSAL Ops</h2>
            <p className="mt-3 truncate text-sm font-black text-white">{demoAccount.email}</p>
            <p className="mt-1 text-xs text-[#dec47b]">Mock Owner</p>
          </div>
          <nav className="mt-4 grid gap-2">
            {tabs.map(({ id, label, Icon }) => (
              <button
                key={id}
                className={`flex items-center gap-3 rounded-md px-4 py-3 text-left text-sm font-black transition ${
                  activeTab === id ? "bg-[#d62f55] text-white" : "text-white/68 hover:bg-white/[0.06] hover:text-[#dec47b]"
                }`}
                onClick={() => setActiveTab(id)}
                type="button"
              >
                <Icon size={17} />
                {label}
              </button>
            ))}
          </nav>
          <button
            className="mt-4 flex w-full items-center gap-3 rounded-md border border-white/10 px-4 py-3 text-sm font-black text-white/68 transition hover:border-[#dec47b]/50 hover:text-[#dec47b]"
            onClick={() => setLoggedIn(false)}
            type="button"
          >
            <LogOut size={17} />
            Exit Demo
          </button>
        </aside>

        <div className="grid min-w-0 gap-4">
          <div className="glass-panel p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow text-[#dec47b]">No Real Data Access</p>
                <h1 className="font-display mt-3 text-5xl">Demo Admin Workspace</h1>
                <p className="mt-4 max-w-3xl leading-8 text-[#d9d0c9]">
                  실제 관리자 페이지와 분리된 공개 테스트 화면입니다. 저장, 삭제, 순서변경, 권한 변경, 이미지 변경은
                  모두 프론트엔드 mock 상태에서만 동작합니다.
                </p>
              </div>
              <button className="button-primary w-fit" onClick={() => showToast("Mock changes saved locally.")} type="button">
                <Save size={16} />
                Save Mock Changes
              </button>
            </div>
          </div>

          {activeTab === "dashboard" ? <Dashboard counts={counts} records={[...services, ...posts, ...inquiries]} /> : null}
          {activeTab === "users" ? <UsersRbacPanel users={users} setUsers={setUsers} showToast={showToast} /> : null}
          {activeTab === "services" ? (
            <VisualStudio
              variant="service"
              records={services}
              setRecords={setServices}
              selectedId={selectedIds.services}
              setSelectedId={(id) => setSelectedIds((previous) => ({ ...previous, services: id }))}
              title="Service Visual Studio"
              showToast={showToast}
            />
          ) : null}
          {activeTab === "blog" ? (
            <VisualStudio
              variant="blog"
              records={posts}
              setRecords={setPosts}
              selectedId={selectedIds.blog}
              setSelectedId={(id) => setSelectedIds((previous) => ({ ...previous, blog: id }))}
              title="Blog Visual Studio"
              showToast={showToast}
            />
          ) : null}
          {activeTab === "inquire" ? (
            <VisualStudio
              variant="inquire"
              records={inquiries}
              setRecords={setInquiries}
              selectedId={selectedIds.inquire}
              setSelectedId={(id) => setSelectedIds((previous) => ({ ...previous, inquire: id }))}
              title="Inquiry Management Demo"
              showToast={showToast}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Dashboard({ counts, records }: { counts: Record<string, number>; records: DemoRecord[] }) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Services", counts.services],
          ["Blog", counts.blog],
          ["Inquiries", counts.inquire],
          ["Users", counts.users],
        ].map(([label, value]) => (
          <div key={label} className="glass-panel p-6">
            <p className="text-sm font-black uppercase text-white/54">{label}</p>
            <p className="font-display mt-3 text-5xl">{value}</p>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-[#dec47b]">mock only</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {records.slice(0, 3).map((record) => (
          <PreviewCard key={record.id} record={record} />
        ))}
      </div>
    </div>
  );
}

function VisualStudio({
  variant,
  records,
  setRecords,
  selectedId,
  setSelectedId,
  title,
  showToast,
}: {
  variant: DemoRecordKind;
  records: DemoRecord[];
  setRecords: (records: DemoRecord[]) => void;
  selectedId: string;
  setSelectedId: (id: string) => void;
  title: string;
  showToast: (message: string) => void;
}) {
  const selected = records.find((record) => record.id === selectedId) ?? records[0];

  function updateRecord(id: string, patch: Partial<DemoRecord>) {
    setRecords(records.map((record) => (record.id === id ? { ...record, ...patch } : record)));
  }

  function createRecord() {
    const id = crypto.randomUUID();
    const next: DemoRecord = {
      id,
      title: "New Demo Content",
      subtitle: "새로운 mock 콘텐츠",
      status: "draft",
      image: "/images/clinic-interior.jpg",
      sections: [
        { id: crypto.randomUUID(), title: "Hero", body: "첫 화면에 보여줄 핵심 메시지입니다." },
        { id: crypto.randomUUID(), title: "CTA", body: "문의 전환을 위한 버튼과 설명입니다." },
      ],
    };

    setRecords([next, ...records]);
    setSelectedId(id);
    showToast("New mock content created.");
  }

  function deleteRecord(id: string) {
    const next = records.filter((record) => record.id !== id);
    setRecords(next);
    setSelectedId(next[0]?.id ?? "");
    showToast("Mock content deleted.");
  }

  function duplicateRecord(record: DemoRecord) {
    const copyRecord = {
      ...record,
      id: crypto.randomUUID(),
      title: `${record.title} Copy`,
      status: "draft" as DemoStatus,
      sections: record.sections.map((section) => ({ ...section, id: crypto.randomUUID() })),
    };
    setRecords([copyRecord, ...records]);
    setSelectedId(copyRecord.id);
    showToast("Mock content duplicated.");
  }

  function moveRecord(index: number, direction: -1 | 1) {
    const target = index + direction;

    if (target < 0 || target >= records.length) {
      return;
    }

    const next = [...records];
    [next[index], next[target]] = [next[target], next[index]];
    setRecords(next);
    showToast("List order updated locally.");
  }

  if (!selected) {
    return (
      <button className="button-primary w-fit" onClick={createRecord} type="button">
        <Plus size={16} />
        Create First Item
      </button>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)_380px]">
      <aside className="glass-panel h-fit p-5 xl:sticky xl:top-28">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="eyebrow text-[#dec47b]">{title}</p>
            <h2 className="font-display mt-2 text-3xl">Content List</h2>
          </div>
          <button className="social-action-button" onClick={createRecord} title="Create content" type="button">
            <Plus size={16} />
          </button>
        </div>
        <div className="mt-5 grid gap-3">
          {records.map((record, index) => (
            <article
              key={record.id}
              className={`rounded-md border p-3 transition ${
                selected.id === record.id ? "border-[#d62f55] bg-[#d62f55]/12" : "border-white/10 bg-black/22"
              }`}
            >
              <button className="flex w-full items-center gap-3 text-left" onClick={() => setSelectedId(record.id)} type="button">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-black/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={record.image} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-white">{record.title}</p>
                  <p className="mt-1 truncate text-xs font-bold text-white/44">{record.subtitle}</p>
                </div>
              </button>
              <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/10 pt-3">
                <span className="inline-flex items-center gap-1 text-[0.68rem] font-black uppercase text-[#dec47b]">
                  <GripVertical size={13} />
                  {index + 1}
                </span>
                <div className="flex gap-1.5">
                  <button className="social-action-button !h-8 !w-8" onClick={() => moveRecord(index, -1)} type="button" title="Move up">
                    <ArrowUp size={13} />
                  </button>
                  <button className="social-action-button !h-8 !w-8" onClick={() => moveRecord(index, 1)} type="button" title="Move down">
                    <ArrowDown size={13} />
                  </button>
                  <button className="social-action-button !h-8 !w-8" onClick={() => duplicateRecord(record)} type="button" title="Duplicate">
                    <Copy size={13} />
                  </button>
                  <button className="social-action-button !h-8 !w-8" onClick={() => deleteRecord(record.id)} type="button" title="Delete">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </aside>

      <VisualPreview variant={variant} record={selected} updateRecord={updateRecord} showToast={showToast} />

      <EditorPanel record={selected} updateRecord={updateRecord} showToast={showToast} />
    </div>
  );
}

function VisualPreview({
  variant,
  record,
  updateRecord,
  showToast,
}: {
  variant: DemoRecordKind;
  record: DemoRecord;
  updateRecord: (id: string, patch: Partial<DemoRecord>) => void;
  showToast: (message: string) => void;
}) {
  function updateSection(sectionId: string, patch: Partial<DemoSection>) {
    updateRecord(record.id, {
      sections: record.sections.map((section) => (section.id === sectionId ? { ...section, ...patch } : section)),
    });
  }

  function moveSection(index: number, direction: -1 | 1) {
    const target = index + direction;

    if (target < 0 || target >= record.sections.length) {
      return;
    }

    const next = [...record.sections];
    [next[index], next[target]] = [next[target], next[index]];
    updateRecord(record.id, { sections: next });
    showToast("Preview section order updated.");
  }

  function addSection() {
    updateRecord(record.id, {
      sections: [
        ...record.sections,
        {
          id: crypto.randomUUID(),
          title: variant === "inquire" ? "New Response Note" : "New Content Block",
          body: "가운데 프리뷰에서 바로 수정할 수 있는 새 mock 섹션입니다.",
        },
      ],
    });
    showToast("Preview section added.");
  }

  function deleteSection(id: string) {
    updateRecord(record.id, { sections: record.sections.filter((section) => section.id !== id) });
    showToast("Preview section removed.");
  }

  if (variant === "blog") {
    return (
      <BlogVisualPreview
        record={record}
        updateRecord={updateRecord}
        updateSection={updateSection}
        moveSection={moveSection}
        deleteSection={deleteSection}
        addSection={addSection}
        showToast={showToast}
      />
    );
  }

  if (variant === "inquire") {
    return (
      <InquiryVisualPreview
        record={record}
        updateRecord={updateRecord}
        updateSection={updateSection}
        moveSection={moveSection}
        deleteSection={deleteSection}
        addSection={addSection}
        showToast={showToast}
      />
    );
  }

  return (
    <ServiceVisualPreview
      record={record}
      updateRecord={updateRecord}
      updateSection={updateSection}
      moveSection={moveSection}
      deleteSection={deleteSection}
      addSection={addSection}
    />
  );
}

function EditableField({
  value,
  onChange,
  className = "",
  placeholder = "",
  as = "input",
  rows = 2,
  tone = "dark",
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  as?: "input" | "textarea";
  rows?: number;
  tone?: "dark" | "light";
  label: string;
}) {
  const focusClass =
    tone === "light"
      ? "focus:bg-[#2a171c]/5 focus:ring-[#8c5365]/30"
      : "focus:bg-white/[0.07] focus:ring-[#dec47b]/45";
  const sharedClass = `w-full rounded-md border border-transparent bg-transparent outline-none transition focus:border-transparent focus:px-2 focus:ring-1 ${focusClass} ${className}`;

  if (as === "textarea") {
    return (
      <textarea
        aria-label={label}
        className={`${sharedClass} resize-none`}
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  return (
    <input
      aria-label={label}
      className={sharedClass}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function PreviewStatusControls({
  status,
  onChange,
  allowed = statuses,
}: {
  status: DemoStatus;
  onChange: (status: DemoStatus) => void;
  allowed?: DemoStatus[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {allowed.map((item) => (
        <button
          key={item}
          className={`rounded-full border px-3 py-1.5 text-[0.68rem] font-black uppercase transition ${
            status === item
              ? "border-[#dec47b] bg-[#dec47b]/15 text-[#dec47b]"
              : "border-white/10 text-white/48 hover:border-[#dec47b]/45 hover:text-[#dec47b]"
          }`}
          onClick={() => onChange(item)}
          type="button"
        >
          {item}
        </button>
      ))}
    </div>
  );
}

function InlineSectionEditor({
  section,
  index,
  tone = "dark",
  updateSection,
  moveSection,
  deleteSection,
}: {
  section: DemoSection;
  index: number;
  tone?: "dark" | "light";
  updateSection: (sectionId: string, patch: Partial<DemoSection>) => void;
  moveSection: (index: number, direction: -1 | 1) => void;
  deleteSection: (id: string) => void;
}) {
  const light = tone === "light";

  return (
    <article
      className={`group rounded-md border p-5 transition ${
        light
          ? "border-[#201716]/10 bg-white text-[#241a19] shadow-sm"
          : "border-white/10 bg-white/[0.035] text-white"
      }`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className={`text-xs font-black uppercase ${light ? "text-[#8a5364]" : "text-[#dec47b]"}`}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex gap-1.5 opacity-70 transition group-hover:opacity-100">
          <button className="social-action-button !h-8 !w-8" onClick={() => moveSection(index, -1)} type="button" title="Move up">
            <ArrowUp size={13} />
          </button>
          <button className="social-action-button !h-8 !w-8" onClick={() => moveSection(index, 1)} type="button" title="Move down">
            <ArrowDown size={13} />
          </button>
          <button className="social-action-button !h-8 !w-8" onClick={() => deleteSection(section.id)} type="button" title="Delete section">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      <EditableField
        label={`Section ${index + 1} title`}
        value={section.title}
        onChange={(value) => updateSection(section.id, { title: value })}
        tone={tone}
        className={`font-display text-2xl ${light ? "text-[#241a19]" : "text-white"}`}
      />
      <EditableField
        as="textarea"
        rows={4}
        label={`Section ${index + 1} body`}
        value={section.body}
        onChange={(value) => updateSection(section.id, { body: value })}
        tone={tone}
        className={`mt-3 leading-7 ${light ? "text-[#5c4a45]" : "text-[#d9d0c9]"}`}
      />
    </article>
  );
}

function ServiceVisualPreview({
  record,
  updateRecord,
  updateSection,
  moveSection,
  deleteSection,
  addSection,
}: {
  record: DemoRecord;
  updateRecord: (id: string, patch: Partial<DemoRecord>) => void;
  updateSection: (sectionId: string, patch: Partial<DemoSection>) => void;
  moveSection: (index: number, direction: -1 | 1) => void;
  deleteSection: (id: string) => void;
  addSection: () => void;
}) {
  return (
    <main className="glass-panel overflow-hidden">
      <div className="border-b border-white/10 p-5">
        <p className="eyebrow text-[#dec47b]">Service Page Preview</p>
        <EditableField
          label="Service preview title"
          value={record.title}
          onChange={(value) => updateRecord(record.id, { title: value })}
          className="font-display mt-2 text-4xl text-white"
        />
      </div>
      <div className="relative min-h-[390px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={record.image} alt="" className="h-[390px] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#130f10] via-[#130f10]/22 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-7">
          <p className="eyebrow text-[#dec47b]">{record.status}</p>
          <EditableField
            label="Service hero title"
            value={record.title}
            onChange={(value) => updateRecord(record.id, { title: value })}
            className="font-display mt-2 text-5xl text-white"
          />
          <EditableField
            as="textarea"
            rows={2}
            label="Service hero subtitle"
            value={record.subtitle}
            onChange={(value) => updateRecord(record.id, { subtitle: value })}
            className="mt-4 max-w-2xl leading-8 text-[#d9d0c9]"
          />
        </div>
      </div>
      <div className="grid gap-4 p-6 md:grid-cols-2">
        {record.sections.map((section, index) => (
          <InlineSectionEditor
            key={section.id}
            section={section}
            index={index}
            updateSection={updateSection}
            moveSection={moveSection}
            deleteSection={deleteSection}
          />
        ))}
      </div>
      <div className="border-t border-white/10 p-6">
        <button className="button-outline w-fit" onClick={addSection} type="button">
          <Plus size={16} />
          Add Preview Section
        </button>
      </div>
    </main>
  );
}

function BlogVisualPreview({
  record,
  updateRecord,
  updateSection,
  moveSection,
  deleteSection,
  addSection,
  showToast,
}: {
  record: DemoRecord;
  updateRecord: (id: string, patch: Partial<DemoRecord>) => void;
  updateSection: (sectionId: string, patch: Partial<DemoSection>) => void;
  moveSection: (index: number, direction: -1 | 1) => void;
  deleteSection: (id: string) => void;
  addSection: () => void;
  showToast: (message: string) => void;
}) {
  return (
    <main className="glass-panel overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-white/10 p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="eyebrow text-[#dec47b]">Blog Visual Editor</p>
          <h2 className="font-display mt-2 text-4xl">Article preview</h2>
        </div>
        <PreviewStatusControls
          allowed={["published", "draft"]}
          status={record.status}
          onChange={(status) => updateRecord(record.id, { status })}
        />
      </div>

      <article className="bg-[#f5efe6] text-[#241a19]">
        <div className="relative min-h-[390px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={record.image} alt="" className="h-[390px] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#241a19]/82 via-[#241a19]/18 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-7 md:p-10">
            <p className="eyebrow text-[#dec47b]">BAKSAL BEAUTY INSIGHT</p>
            <EditableField
              label="Blog article title"
              value={record.title}
              onChange={(value) => updateRecord(record.id, { title: value })}
              className="font-display mt-3 text-5xl text-white md:text-6xl"
            />
            <EditableField
              as="textarea"
              rows={2}
              label="Blog article description"
              value={record.subtitle}
              onChange={(value) => updateRecord(record.id, { subtitle: value })}
              className="mt-4 max-w-3xl leading-8 text-[#f2e8df]"
            />
          </div>
        </div>

        <div className="p-6 md:p-10">
          <div className="grid gap-4 lg:grid-cols-[0.78fr_0.42fr]">
            <div className="rounded-md border border-[#241a19]/10 bg-white p-6 shadow-sm">
              <p className="eyebrow text-[#8a5364]">Clickable Article Lead</p>
              <EditableField
                as="textarea"
                rows={5}
                label="Blog lead text"
                value={record.sections[0]?.body ?? ""}
                onChange={(value) => record.sections[0] && updateSection(record.sections[0].id, { body: value })}
                tone="light"
                className="mt-4 text-xl leading-9 text-[#3a2b27]"
              />
            </div>
            <div className="rounded-md border border-[#241a19]/10 bg-[#241a19] p-6 text-white">
              <p className="eyebrow text-[#dec47b]">SEO Assist</p>
              <div className="mt-5 grid gap-3 text-sm leading-7 text-white/72">
                <p>Primary Keyword: 병원 홈페이지 제작</p>
                <p>Internal CTA: 문의하기 팝업 연결</p>
                <p>OG / RSS / sitemap 반영 예정</p>
              </div>
              <button className="button-primary mt-5 w-full" onClick={() => showToast("Mock SEO checklist confirmed.")} type="button">
                <CheckCircle2 size={16} />
                Confirm SEO
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {record.sections.map((section, index) => (
              <InlineSectionEditor
                key={section.id}
                section={section}
                index={index}
                tone="light"
                updateSection={updateSection}
                moveSection={moveSection}
                deleteSection={deleteSection}
              />
            ))}
          </div>

          <div className="mt-6 rounded-md border border-[#8a5364]/20 bg-[#241a19] p-6 text-white">
            <p className="eyebrow text-[#dec47b]">End CTA Block</p>
            <h3 className="font-display mt-3 text-4xl">병원 홈페이지 제작 문의로 이어지는 마지막 문단</h3>
            <p className="mt-4 max-w-2xl leading-8 text-[#d9d0c9]">
              블로그 글마다 CTA, 문의 폼, 내부 링크를 같은 편집 화면에서 확인하는 mock 흐름입니다.
            </p>
            <button className="button-outline mt-5" onClick={addSection} type="button">
              <Plus size={16} />
              Add Article Block
            </button>
          </div>
        </div>
      </article>
    </main>
  );
}

function InquiryVisualPreview({
  record,
  updateRecord,
  updateSection,
  moveSection,
  deleteSection,
  addSection,
  showToast,
}: {
  record: DemoRecord;
  updateRecord: (id: string, patch: Partial<DemoRecord>) => void;
  updateSection: (sectionId: string, patch: Partial<DemoSection>) => void;
  moveSection: (index: number, direction: -1 | 1) => void;
  deleteSection: (id: string) => void;
  addSection: () => void;
  showToast: (message: string) => void;
}) {
  const replySection = record.sections.find((section) => section.title.toLowerCase().includes("reply")) ?? record.sections[1];

  return (
    <main className="glass-panel overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-white/10 p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="eyebrow text-[#dec47b]">Inquiry Visual Desk</p>
          <h2 className="font-display mt-2 text-4xl">Support workflow preview</h2>
        </div>
        <PreviewStatusControls
          allowed={["new", "replied"]}
          status={record.status}
          onChange={(status) => updateRecord(record.id, { status })}
        />
      </div>

      <div className="grid gap-4 p-5 lg:grid-cols-[0.58fr_1fr]">
        <aside className="rounded-md border border-white/10 bg-black/24 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow text-[#dec47b]">Inbox</p>
              <h3 className="font-display mt-2 text-3xl">Mock queue</h3>
            </div>
            <span className="rounded-full border border-[#d62f55]/35 bg-[#d62f55]/15 px-3 py-1 text-xs font-black uppercase text-[#ff9aad]">
              {record.status}
            </span>
          </div>
          <div className="mt-5 grid gap-3">
            {["신규 홈페이지 제작", "첨부파일 검토", "답변 초안 작성", "답변 완료 처리"].map((item, index) => (
              <div key={item} className="rounded-md border border-white/10 bg-white/[0.035] p-4">
                <p className="text-xs font-black text-[#dec47b]">{String(index + 1).padStart(2, "0")}</p>
                <p className="mt-2 text-sm font-black text-white">{item}</p>
                <p className="mt-2 text-xs leading-5 text-white/48">테스트 관리자는 실제 문의 데이터 없이 처리 흐름만 체험합니다.</p>
              </div>
            ))}
          </div>
        </aside>

        <section className="rounded-md border border-white/10 bg-[#100d0e]">
          <div className="relative h-48 overflow-hidden rounded-t-md bg-black/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={record.image} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#100d0e] to-transparent" />
            <div className="absolute bottom-4 left-5 right-5">
              <EditableField
                label="Inquiry title"
                value={record.title}
                onChange={(value) => updateRecord(record.id, { title: value })}
                className="font-display text-4xl text-white"
              />
              <EditableField
                label="Inquiry customer summary"
                value={record.subtitle}
                onChange={(value) => updateRecord(record.id, { subtitle: value })}
                className="mt-2 text-sm font-bold text-white/68"
              />
            </div>
          </div>

          <div className="grid gap-4 p-5 xl:grid-cols-[0.88fr_0.72fr]">
            <div className="grid gap-4">
              <div className="rounded-md border border-white/10 bg-white/[0.035] p-5">
                <p className="eyebrow text-[#dec47b]">Customer Message</p>
                <EditableField
                  as="textarea"
                  rows={6}
                  label="Original inquiry body"
                  value={record.sections[0]?.body ?? ""}
                  onChange={(value) => record.sections[0] && updateSection(record.sections[0].id, { body: value })}
                  className="mt-4 leading-8 text-[#d9d0c9]"
                />
              </div>

              <div className="rounded-md border border-white/10 bg-white/[0.035] p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="eyebrow text-[#dec47b]">Attachments</p>
                  <button className="button-outline !px-3 !py-2 text-[0.68rem]" onClick={() => showToast("Mock attachment preview opened.")} type="button">
                    Preview
                  </button>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="overflow-hidden rounded-md border border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={record.image} alt="" className="h-32 w-full object-cover" />
                  </div>
                  <div className="rounded-md border border-dashed border-white/16 p-4 text-sm leading-7 text-white/58">
                    reference-pack.pdf
                    <br />
                    existing-site-capture.png
                    <br />
                    moodboard.zip
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-md border border-[#dec47b]/20 bg-[#dec47b]/8 p-5">
                <p className="eyebrow text-[#dec47b]">Email Reply Composer</p>
                <EditableField
                  label="Reply title"
                  value={replySection?.title ?? "Reply Draft"}
                  onChange={(value) => replySection && updateSection(replySection.id, { title: value })}
                  className="font-display mt-3 text-3xl text-white"
                />
                <EditableField
                  as="textarea"
                  rows={7}
                  label="Reply body"
                  value={replySection?.body ?? ""}
                  onChange={(value) => replySection && updateSection(replySection.id, { body: value })}
                  className="mt-4 leading-8 text-[#d9d0c9]"
                />
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button className="button-primary !px-3 !py-3 text-[0.68rem]" onClick={() => updateRecord(record.id, { status: "replied" })} type="button">
                    Mark Replied
                  </button>
                  <button className="button-outline !px-3 !py-3 text-[0.68rem]" onClick={() => showToast("Mock reply saved as draft.")} type="button">
                    Save Draft
                  </button>
                </div>
              </div>

              <div className="rounded-md border border-white/10 bg-white/[0.035] p-5">
                <p className="eyebrow text-[#dec47b]">Processing Notes</p>
                <div className="mt-4 grid gap-3">
                  {record.sections.slice(1).map((section, index) => (
                    <InlineSectionEditor
                      key={section.id}
                      section={section}
                      index={index + 1}
                      updateSection={updateSection}
                      moveSection={moveSection}
                      deleteSection={deleteSection}
                    />
                  ))}
                </div>
                <button className="button-outline mt-4 w-fit" onClick={addSection} type="button">
                  <Plus size={16} />
                  Add Handling Note
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function EditorPanel({
  record,
  updateRecord,
  showToast,
}: {
  record: DemoRecord;
  updateRecord: (id: string, patch: Partial<DemoRecord>) => void;
  showToast: (message: string) => void;
}) {
  function updateSection(sectionId: string, patch: Partial<DemoSection>) {
    updateRecord(record.id, {
      sections: record.sections.map((section) => (section.id === sectionId ? { ...section, ...patch } : section)),
    });
  }

  function moveSection(index: number, direction: -1 | 1) {
    const target = index + direction;

    if (target < 0 || target >= record.sections.length) {
      return;
    }

    const next = [...record.sections];
    [next[index], next[target]] = [next[target], next[index]];
    updateRecord(record.id, { sections: next });
    showToast("Section order updated locally.");
  }

  function addSection() {
    updateRecord(record.id, {
      sections: [
        ...record.sections,
        { id: crypto.randomUUID(), title: "New Section", body: "새 섹션 내용을 입력하세요." },
      ],
    });
    showToast("New section added.");
  }

  function deleteSection(id: string) {
    updateRecord(record.id, { sections: record.sections.filter((section) => section.id !== id) });
    showToast("Section removed.");
  }

  function handleImageDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];

    if (file?.type.startsWith("image/")) {
      updateRecord(record.id, { image: URL.createObjectURL(file) });
      showToast("Preview image changed locally.");
    }
  }

  return (
    <aside className="glass-panel h-fit min-w-0 p-5 xl:sticky xl:top-28">
      <p className="eyebrow text-[#dec47b]">Visual Editing</p>
      <h3 className="font-display mt-2 text-3xl">Click & edit</h3>
      <div className="mt-5 grid gap-4">
        <label className="grid gap-2 text-xs font-black uppercase">
          Title
          <input className="form-field" value={record.title} onChange={(event) => updateRecord(record.id, { title: event.target.value })} />
        </label>
        <label className="grid gap-2 text-xs font-black uppercase">
          Subtitle
          <textarea
            className="form-field min-h-24 resize-none"
            value={record.subtitle}
            onChange={(event) => updateRecord(record.id, { subtitle: event.target.value })}
          />
        </label>
        <label className="grid gap-2 text-xs font-black uppercase">
          Status
          <select className="form-field" value={record.status} onChange={(event) => updateRecord(record.id, { status: event.target.value as DemoStatus })}>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label
          className="grid cursor-pointer gap-3 rounded-md border border-dashed border-white/16 bg-black/28 p-4 transition hover:border-[#dec47b]/45"
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleImageDrop}
        >
          <input
            className="sr-only"
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (file?.type.startsWith("image/")) {
                updateRecord(record.id, { image: URL.createObjectURL(file) });
                showToast("Preview image changed locally.");
              }
            }}
          />
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase text-[#dec47b]">
            <ImagePlus size={15} />
            Image
          </span>
          <span className="text-sm text-[#d9d0c9]">Drag & drop or click to replace the preview image.</span>
        </label>
      </div>

      <div className="mt-6 border-t border-white/10 pt-5">
        <div className="flex items-center justify-between gap-3">
          <p className="eyebrow text-[#dec47b]">Section Order</p>
          <button className="social-action-button !h-8 !w-8" onClick={addSection} type="button" title="Add section">
            <Plus size={13} />
          </button>
        </div>
        <div className="mt-4 grid gap-3">
          {record.sections.map((section, index) => (
            <article key={section.id} className="rounded-md border border-white/10 bg-white/[0.035] p-3">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 text-[0.68rem] font-black uppercase text-[#dec47b]">
                  <GripVertical size={13} />
                  Section {index + 1}
                </span>
                <div className="flex gap-1.5">
                  <button className="social-action-button !h-8 !w-8" onClick={() => moveSection(index, -1)} type="button" title="Move section up">
                    <ArrowUp size={13} />
                  </button>
                  <button className="social-action-button !h-8 !w-8" onClick={() => moveSection(index, 1)} type="button" title="Move section down">
                    <ArrowDown size={13} />
                  </button>
                  <button className="social-action-button !h-8 !w-8" onClick={() => deleteSection(section.id)} type="button" title="Delete section">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <input className="form-field !min-h-10 !py-2" value={section.title} onChange={(event) => updateSection(section.id, { title: event.target.value })} />
              <textarea
                className="form-field mt-2 min-h-24 resize-none"
                value={section.body}
                onChange={(event) => updateSection(section.id, { body: event.target.value })}
              />
            </article>
          ))}
        </div>
      </div>

      <button className="button-primary mt-5 w-full" onClick={() => showToast("Mock visual edits saved locally.")} type="button">
        <Save size={16} />
        Save Visual Edit
      </button>
    </aside>
  );
}

function UsersRbacPanel({
  users,
  setUsers,
  showToast,
}: {
  users: DemoUser[];
  setUsers: (users: DemoUser[]) => void;
  showToast: (message: string) => void;
}) {
  function updateUser(id: string, patch: Partial<DemoUser>) {
    setUsers(users.map((user) => (user.id === id ? { ...user, ...patch } : user)));
  }

  function addUser() {
    setUsers([
      {
        id: crypto.randomUUID(),
        name: "New Demo User",
        email: "new-user@test.local",
        role: "Patient",
        status: "pending",
        image: "/images/doctor-balance.jpg",
      },
      ...users,
    ]);
    showToast("New mock user created.");
  }

  return (
    <div className="grid gap-4">
      <div className="glass-panel flex flex-col gap-4 p-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow text-[#dec47b]">RBAC Preview</p>
          <h2 className="font-display mt-2 text-4xl">User Management</h2>
          <p className="mt-3 max-w-2xl leading-7 text-[#d9d0c9]">
            실제 권한 변경이 아니라 Owner/Admin/Manager/Staff/Patient 권한 부여 흐름을 체험하는 mock 화면입니다.
          </p>
        </div>
        <button className="button-primary w-fit" onClick={addUser} type="button">
          <Plus size={16} />
          Add Mock User
        </button>
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        {users.map((user) => (
          <article key={user.id} className="glass-panel overflow-hidden">
            <div className="relative h-48 bg-black/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={user.image} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b0c] to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h3 className="font-display text-3xl">{user.name}</h3>
                <p className="text-sm font-bold text-white/64">{user.email}</p>
              </div>
            </div>
            <div className="grid gap-3 p-4">
              <label className="grid gap-2 text-xs font-black uppercase">
                Role
                <select className="form-field" value={user.role} onChange={(event) => updateUser(user.id, { role: event.target.value as DemoRole })}>
                  {roles.map((role) => (
                    <option key={role}>{role}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-xs font-black uppercase">
                Status
                <select
                  className="form-field"
                  value={user.status}
                  onChange={(event) => updateUser(user.id, { status: event.target.value as DemoUser["status"] })}
                >
                  {["active", "pending", "suspended"].map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button className="button-outline !px-3 !py-3 text-[0.68rem]" onClick={() => updateUser(user.id, { role: "Admin", status: "active" })} type="button">
                  Grant Admin
                </button>
                <button className="button-outline !px-3 !py-3 text-[0.68rem]" onClick={() => updateUser(user.id, { role: "Patient" })} type="button">
                  Revoke
                </button>
              </div>
              <button className="button-primary w-full" onClick={() => showToast(`${user.email} RBAC mock saved.`)} type="button">
                <Save size={16} />
                Save RBAC
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function PreviewCard({ record }: { record: DemoRecord }) {
  return (
    <article className="glass-panel overflow-hidden">
      <div className="relative h-48 bg-black/30">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={record.image} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="p-5">
        <p className="text-xs font-black uppercase text-[#dec47b]">{record.status}</p>
        <h3 className="font-display mt-2 text-3xl">{record.title}</h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#d9d0c9]">{record.subtitle}</p>
      </div>
    </article>
  );
}
