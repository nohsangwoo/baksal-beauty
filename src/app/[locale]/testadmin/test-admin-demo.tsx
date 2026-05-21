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
      { id: "intro", title: "Intro", body: "검색 의도에 맞는 병원 홈페이지 구조를 설명합니다." },
      { id: "body", title: "Content Blocks", body: "텍스트, 이미지, CTA 블록을 조합합니다." },
    ],
  },
  {
    id: "cms",
    title: "관리자 CMS 운영 가이드",
    subtitle: "블로그, 서비스, 문의 관리",
    status: "draft",
    image: "/images/blog-recovery.jpg",
    sections: [
      { id: "editor", title: "Visual Editor", body: "관리자가 보이는 그대로 편집하는 흐름을 설명합니다." },
      { id: "publish", title: "Publish Flow", body: "임시저장과 공개 상태를 분리합니다." },
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
      { id: "request", title: "Request", body: "성형외과 홈페이지 신규 제작과 블로그 SEO를 문의했습니다." },
      { id: "reply", title: "Reply Draft", body: "예상 범위와 미팅 일정을 안내하는 답변 초안입니다." },
    ],
  },
  {
    id: "inq-2",
    title: "블로그 SEO 리뉴얼 상담",
    subtitle: "marketing@example.com · 다국어 콘텐츠",
    status: "replied",
    image: "/images/blog-laser.jpg",
    sections: [
      { id: "request", title: "Request", body: "기존 병원 블로그 구조 개선과 다국어 전환을 문의했습니다." },
      { id: "reply", title: "Reply Sent", body: "답변 완료 상태로 변경된 mock 문의입니다." },
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
  records,
  setRecords,
  selectedId,
  setSelectedId,
  title,
  showToast,
}: {
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

      <main className="glass-panel overflow-hidden">
        <div className="border-b border-white/10 p-5">
          <p className="eyebrow text-[#dec47b]">Live Preview</p>
          <h2 className="font-display mt-2 text-4xl">{selected.title}</h2>
        </div>
        <div className="relative min-h-[360px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={selected.image} alt="" className="h-[360px] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#130f10] via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-7">
            <p className="eyebrow text-[#dec47b]">{selected.status}</p>
            <h3 className="font-display mt-2 text-5xl">{selected.title}</h3>
            <p className="mt-4 max-w-2xl leading-8 text-[#d9d0c9]">{selected.subtitle}</p>
          </div>
        </div>
        <div className="grid gap-4 p-6 md:grid-cols-2">
          {selected.sections.map((section, index) => (
            <article key={section.id} className="rounded-md border border-white/10 bg-white/[0.035] p-5">
              <p className="text-xs font-black uppercase text-[#dec47b]">{String(index + 1).padStart(2, "0")}</p>
              <h4 className="font-display mt-3 text-3xl">{section.title}</h4>
              <p className="mt-3 leading-7 text-[#d9d0c9]">{section.body}</p>
            </article>
          ))}
        </div>
      </main>

      <EditorPanel record={selected} updateRecord={updateRecord} showToast={showToast} />
    </div>
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
