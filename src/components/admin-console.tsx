"use client";

import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  FileText,
  ImagePlus,
  Inbox,
  LayoutDashboard,
  Loader2,
  Pencil,
  Save,
  Scissors,
  ShieldCheck,
  Trash2,
  UploadCloud,
  Users,
} from "lucide-react";
import { useState } from "react";
import {
  servicePageCopy,
  type ServiceBeforeAfter,
  type ServiceContentCategory,
  type ServiceDetailCta,
  type ServiceDetailPanel,
  type ServiceItem,
  type ServiceRichDetailImage,
  type ServiceSurgeryInfo,
  type ServiceVideoPreview,
} from "@/data/service-content";
import { localeLabels, locales, type Locale } from "@/i18n/config";

type AdminTab = "dashboard" | "users" | "services" | "blog" | "inquire";

type AdminRecord = {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  meta: string;
  imageUrl?: string;
  tags?: string[];
  createdAt?: string;
};

type ListResponse<T> = {
  source: "database" | "fallback";
  items: T[];
};

const tabs: { id: AdminTab; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "User Management", icon: Users },
  { id: "services", label: "SERVICE", icon: Scissors },
  { id: "blog", label: "BLOG", icon: FileText },
  { id: "inquire", label: "INQUIRE", icon: Inbox },
];

const emptyService: Partial<ServiceItem> = {
  slug: "",
  category: "eye",
  tags: ["eye"],
  imageUrl: "",
  imageAlt: "",
  featured: false,
  sortOrder: 100,
  status: "published",
  title: "",
  subtitle: "",
  summary: "",
  description: "",
  highlights: [],
  recommendedFor: [],
  process: [],
  recovery: "",
  duration: "",
  priceNote: "",
  surgeryInfo: {
    surgeryTime: "",
    anesthesia: "",
    visits: "",
    aftercareStart: "",
    recoveryPeriod: "",
  },
  detailPanels: [],
  beforeAfter: {
    title: "",
    body: "",
    beforeImageUrl: "",
    beforeAlt: "",
    afterImageUrl: "",
    afterAlt: "",
  },
  richDetailImages: [],
  youtubeVideos: [],
  detailCta: {
    title: "",
    body: "",
  },
  relatedSlugs: [],
  embedding: [],
};

const emptyRecord: AdminRecord = {
  id: "",
  title: "",
  subtitle: "",
  status: "draft",
  meta: "",
  imageUrl: "",
  tags: [],
};

function getEmptyRecord(tab: Exclude<AdminTab, "dashboard" | "services">): AdminRecord {
  if (tab === "users") {
    return {
      ...emptyRecord,
      status: "active",
      meta: "patient",
      tags: ["manual"],
    };
  }

  return emptyRecord;
}

export function AdminConsole({ locale }: { locale: Locale }) {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [serviceLocale, setServiceLocale] = useState<Locale>(locale);
  const queryClient = useQueryClient();
  const serviceQuery = useQuery({
    queryKey: ["admin-services", serviceLocale],
    queryFn: () => fetchJson<ListResponse<ServiceItem>>(`/api/admin/services?locale=${serviceLocale}`),
  });
  const userQuery = useQuery({
    queryKey: ["admin-resource", "users"],
    queryFn: () => fetchJson<ListResponse<AdminRecord>>("/api/admin/users"),
  });
  const blogQuery = useQuery({
    queryKey: ["admin-resource", "blog"],
    queryFn: () => fetchJson<ListResponse<AdminRecord>>("/api/admin/blog"),
  });
  const inquireQuery = useQuery({
    queryKey: ["admin-resource", "inquire"],
    queryFn: () => fetchJson<ListResponse<AdminRecord>>("/api/admin/inquire"),
  });
  const counts = {
    services: serviceQuery.data?.items.length ?? 0,
    users: userQuery.data?.items.length ?? 0,
    blog: blogQuery.data?.items.length ?? 0,
    inquire: inquireQuery.data?.items.length ?? 0,
  };

  return (
    <section data-reveal-section="" className="bg-[#1f1715] py-16 md:py-24">
      <div className="section-shell">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="glass-panel h-fit p-4">
            <div className="border-b border-white/10 p-3">
              <p className="eyebrow text-[#dec47b]">Admin Console</p>
              <h2 className="font-display mt-3 text-3xl">BAKSAL Ops</h2>
              <p className="mt-3 text-sm leading-6 text-[#b6aaa6]">
                인증 연결 전 단계의 운영 콘솔입니다. DB 연결 후 CRUD가 바로 저장됩니다.
              </p>
            </div>
            <nav className="mt-4 grid gap-2">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className={`flex items-center gap-3 rounded-md px-4 py-3 text-left text-sm font-black transition ${
                    activeTab === id
                      ? "bg-[#d62f55] text-white"
                      : "text-white/68 hover:bg-white/[0.06] hover:text-[#dec47b]"
                  }`}
                  onClick={() => setActiveTab(id)}
                  type="button"
                >
                  <Icon size={17} />
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          <div className="min-w-0">
            {activeTab === "dashboard" ? (
              <DashboardPanel counts={counts} />
            ) : activeTab === "services" ? (
              <ServiceCrudPanel
                locale={serviceLocale}
                onLocaleChange={setServiceLocale}
                items={serviceQuery.data?.items ?? []}
                source={serviceQuery.data?.source}
                loading={serviceQuery.isLoading}
                onChanged={() => queryClient.invalidateQueries({ queryKey: ["admin-services", serviceLocale] })}
              />
            ) : (
              <GenericCrudPanel
                key={activeTab}
                tab={activeTab}
                items={getQuery(activeTab, userQuery, blogQuery, inquireQuery).data?.items ?? []}
                source={getQuery(activeTab, userQuery, blogQuery, inquireQuery).data?.source}
                loading={getQuery(activeTab, userQuery, blogQuery, inquireQuery).isLoading}
                onChanged={() => queryClient.invalidateQueries({ queryKey: ["admin-resource", activeTab] })}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardPanel({ counts }: { counts: Record<string, number> }) {
  return (
    <div className="grid gap-6">
      <div className="glass-panel p-7 md:p-9">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-[#dec47b]">Overview</p>
            <h3 className="font-display mt-3 text-5xl">Operations Dashboard</h3>
            <p className="mt-4 max-w-2xl leading-8 text-[#d9d0c9]">
              서비스, 블로그, 문의, 유저/RBAC 관리를 한 화면에서 진행하는 기본 구조입니다.
            </p>
          </div>
          <ShieldCheck className="text-[#dec47b]" size={42} />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Services", counts.services],
          ["Users", counts.users],
          ["Blog", counts.blog],
          ["Inquire", counts.inquire],
        ].map(([label, value]) => (
          <div key={label} className="glass-panel p-6">
            <BarChart3 className="text-[#dec47b]" size={20} />
            <p className="mt-5 text-sm font-black uppercase text-white/54">{label}</p>
            <p className="font-display mt-2 text-5xl">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServiceCrudPanel({
  locale,
  onLocaleChange,
  items,
  source,
  loading,
  onChanged,
}: {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  items: ServiceItem[];
  source?: "database" | "fallback";
  loading: boolean;
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState<Partial<ServiceItem>>(emptyService);
  const [notice, setNotice] = useState("");
  const isEditing = Boolean(editing.id);
  const saveMutation = useMutation({
    mutationFn: async (payload: Partial<ServiceItem>) => {
      const method = payload.id ? "PATCH" : "POST";
      const url = payload.id ? `/api/admin/services/${payload.id}` : "/api/admin/services";
      return fetchJson(url, {
        method,
        body: JSON.stringify({
          ...payload,
          locale,
          tags: payload.tags?.length ? payload.tags : [payload.category ?? "eye"],
        }),
      });
    },
    onSuccess: () => {
      setNotice("저장되었습니다.");
      setEditing(emptyService);
      onChanged();
    },
    onError: (error) => setNotice(error instanceof Error ? error.message : "저장에 실패했습니다."),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetchJson(`/api/admin/services/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      setNotice("삭제되었습니다.");
      onChanged();
    },
    onError: (error) => setNotice(error instanceof Error ? error.message : "삭제에 실패했습니다."),
  });
  const translateMutation = useMutation({
    mutationFn: async () => {
      if (!editing.id) {
        throw new Error("Select a saved service first.");
      }

      return fetchJson<Partial<ServiceItem>>("/api/admin/services/translate", {
        method: "POST",
        body: JSON.stringify({
          serviceId: editing.id,
          targetLocale: locale,
          sourceLocale: "ko",
        }),
      });
    },
    onSuccess: (translated) => {
      setEditing((current) => ({
        ...current,
        ...translated,
        id: current.id,
        slug: current.slug,
        category: current.category,
        tags: current.tags,
        imageUrl: current.imageUrl,
        status: current.status,
      }));
      setNotice(`${localeLabels[locale]} draft text generated from Korean.`);
    },
    onError: (error) => setNotice(error instanceof Error ? error.message : "Translation failed."),
  });
  const surgeryInfo = editing.surgeryInfo ?? emptyService.surgeryInfo;
  const beforeAfter = editing.beforeAfter ?? emptyService.beforeAfter;
  const detailCta = editing.detailCta ?? emptyService.detailCta;

  function updateSurgeryInfo(field: keyof ServiceSurgeryInfo, value: string) {
    setEditing({
      ...editing,
      surgeryInfo: {
        ...(surgeryInfo as ServiceSurgeryInfo),
        [field]: value,
      },
    });
  }

  function updateBeforeAfter(field: keyof ServiceBeforeAfter, value: string) {
    setEditing({
      ...editing,
      beforeAfter: {
        ...(beforeAfter as ServiceBeforeAfter),
        [field]: value,
      },
    });
  }

  function updateDetailCta(field: keyof ServiceDetailCta, value: string) {
    setEditing({
      ...editing,
      detailCta: {
        ...(detailCta as ServiceDetailCta),
        [field]: value,
      },
    });
  }

  function updatePanel(index: number, patch: Partial<ServiceDetailPanel>) {
    const panels = [...(editing.detailPanels ?? [])];
    const current = panels[index] ?? {
      eyebrow: String(index + 1).padStart(2, "0"),
      title: "",
      body: "",
      imageUrl: "",
      imageAlt: "",
      points: [],
    };
    panels[index] = {
      ...current,
      ...patch,
    };
    setEditing({ ...editing, detailPanels: panels });
  }

  return (
    <CrudShell
      title="SERVICE"
      source={source}
      loading={loading}
      notice={notice}
      action={
        <button className="button-outline" onClick={() => setEditing(emptyService)} type="button">
          New Service
        </button>
      }
    >
      <div className="mb-5 flex flex-wrap gap-2">
        {locales.map((item) => (
          <button
            key={item}
            className={`rounded-full border px-4 py-2 text-xs font-black transition ${
              locale === item
                ? "border-[#d62f55] bg-[#d62f55] text-white"
                : "border-white/10 bg-white/[0.04] text-white/62 hover:border-[#dec47b]/60 hover:text-[#dec47b]"
            }`}
            onClick={() => {
              onLocaleChange(item);
              setEditing(emptyService);
            }}
            type="button"
          >
            {localeLabels[item]}
          </button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_430px]">
        <div className="grid gap-4">
          {items.map((item) => (
            <article key={item.id} className="glass-panel grid gap-4 p-4 md:grid-cols-[132px_1fr_auto]">
              <div className="relative h-32 overflow-hidden rounded-md bg-white/5">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.imageAlt} fill sizes="132px" className="object-cover" />
                ) : (
                  <ImagePlus className="m-auto mt-12 text-white/35" />
                )}
              </div>
              <div>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-white/8 px-3 py-1 text-[0.68rem] font-black uppercase text-[#dec47b]">
                      {servicePageCopy[locale].tabs[tag]}
                    </span>
                  ))}
                </div>
                <h4 className="font-display mt-3 text-3xl">{item.title}</h4>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#d9d0c9]">{item.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`rounded-full px-3 py-1 text-[0.68rem] font-black uppercase ${
                    item.status === "published"
                      ? "bg-[#dec47b]/14 text-[#dec47b]"
                      : "bg-white/8 text-white/52"
                  }`}>
                    {item.status === "published" ? "Public" : "Draft"}
                  </span>
                  {(item.youtubeVideos?.length ?? 0) > 0 ? (
                    <span className="rounded-full bg-white/8 px-3 py-1 text-[0.68rem] font-black uppercase text-white/52">
                      {item.youtubeVideos?.length} videos
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="flex items-start gap-2">
                <button className="social-action-button" onClick={() => setEditing(item)} title="Edit" type="button">
                  <Pencil size={16} />
                </button>
                <button
                  className="social-action-button"
                  onClick={() => deleteMutation.mutate(item.id)}
                  title="Delete"
                  type="button"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>

        <form
          className="glass-panel h-fit p-5"
          onSubmit={(event) => {
            event.preventDefault();
            saveMutation.mutate(editing);
          }}
        >
          <p className="eyebrow text-[#dec47b]">{isEditing ? "Edit Service" : "Create Service"}</p>
          {locale !== "ko" && editing.id ? (
            <button
              className="button-outline mt-4 w-full"
              disabled={translateMutation.isPending}
              onClick={() => translateMutation.mutate()}
              type="button"
            >
              {translateMutation.isPending ? <Loader2 className="animate-spin" size={15} /> : null}
              Translate from KR
            </button>
          ) : null}
          <div className="mt-4 flex items-center justify-between rounded-md border border-white/10 bg-white/[0.035] p-3">
            <div>
              <p className="text-sm font-black text-white">Public</p>
              <p className="mt-1 text-xs leading-5 text-white/52">Published services are visible on the website.</p>
            </div>
            <button
              className={`h-7 w-14 rounded-full p-1 transition ${
                editing.status === "published" ? "bg-[#d62f55]" : "bg-white/12"
              }`}
              onClick={() =>
                setEditing({
                  ...editing,
                  status: editing.status === "published" ? "draft" : "published",
                })
              }
              type="button"
              aria-pressed={editing.status === "published"}
            >
              <span
                className={`block h-5 w-5 rounded-full bg-white transition ${
                  editing.status === "published" ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <div className="mt-5 grid gap-3">
            <Field label="Slug" value={editing.slug ?? ""} onChange={(value) => setEditing({ ...editing, slug: value })} />
            <Field label="Title" value={editing.title ?? ""} onChange={(value) => setEditing({ ...editing, title: value })} />
            <Field label="Subtitle" value={editing.subtitle ?? ""} onChange={(value) => setEditing({ ...editing, subtitle: value })} />
            <Textarea label="Summary" value={editing.summary ?? ""} onChange={(value) => setEditing({ ...editing, summary: value })} />
            <Textarea label="Description" value={editing.description ?? ""} onChange={(value) => setEditing({ ...editing, description: value })} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Select
                label="Category"
                value={editing.category ?? "eye"}
                options={["eye", "nose", "lifting", "petit"]}
                onChange={(value) =>
                  setEditing({
                    ...editing,
                    category: value as ServiceContentCategory,
                    tags: [value as ServiceContentCategory],
                  })
                }
              />
              <Field
                label="Sort Order"
                value={editing.sortOrder ?? 100}
                onChange={(value) => setEditing({ ...editing, sortOrder: Number(value) || 100 })}
              />
            </div>
            <Field
              label="Tags"
              value={(editing.tags ?? []).join(", ")}
              onChange={(value) =>
                setEditing({
                  ...editing,
                  tags: value
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean) as ServiceContentCategory[],
                })
              }
            />
            <Field
              label="Related Slugs"
              value={(editing.relatedSlugs ?? []).join(", ")}
              onChange={(value) => setEditing({ ...editing, relatedSlugs: splitComma(value) })}
            />
            <UploadField
              label="Image / Video / File"
              value={editing.imageUrl ?? ""}
              scope="service"
              onChange={(imageUrl) => setEditing({ ...editing, imageUrl })}
            />
            <Textarea
              label="Highlights"
              value={(editing.highlights ?? []).join("\n")}
              onChange={(value) => setEditing({ ...editing, highlights: splitLines(value) })}
            />
            <Textarea
              label="Recommended For"
              value={(editing.recommendedFor ?? []).join("\n")}
              onChange={(value) => setEditing({ ...editing, recommendedFor: splitLines(value) })}
            />
            <Textarea
              label="Process"
              value={(editing.process ?? []).join("\n")}
              onChange={(value) => setEditing({ ...editing, process: splitLines(value) })}
            />
            <Textarea label="Recovery" value={editing.recovery ?? ""} onChange={(value) => setEditing({ ...editing, recovery: value })} />
            <Field label="Duration" value={editing.duration ?? ""} onChange={(value) => setEditing({ ...editing, duration: value })} />
            <Textarea label="Price Note" value={editing.priceNote ?? ""} onChange={(value) => setEditing({ ...editing, priceNote: value })} />

            <EditorDivider title="Surgery Info" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Surgery Time" value={(surgeryInfo as ServiceSurgeryInfo).surgeryTime} onChange={(value) => updateSurgeryInfo("surgeryTime", value)} />
              <Field label="Anesthesia" value={(surgeryInfo as ServiceSurgeryInfo).anesthesia} onChange={(value) => updateSurgeryInfo("anesthesia", value)} />
              <Field label="Visits" value={(surgeryInfo as ServiceSurgeryInfo).visits} onChange={(value) => updateSurgeryInfo("visits", value)} />
              <Field label="Aftercare Start" value={(surgeryInfo as ServiceSurgeryInfo).aftercareStart} onChange={(value) => updateSurgeryInfo("aftercareStart", value)} />
            </div>
            <Field label="Recovery Period" value={(surgeryInfo as ServiceSurgeryInfo).recoveryPeriod} onChange={(value) => updateSurgeryInfo("recoveryPeriod", value)} />

            <EditorDivider title="Long Detail Panels" />
            {[0, 1, 2].map((index) => (
              <DetailPanelEditor
                key={index}
                index={index}
                panel={(editing.detailPanels ?? [])[index]}
                onChange={(patch) => updatePanel(index, patch)}
              />
            ))}

            <EditorDivider title="Before & After" />
            <Field label="Comparison Title" value={(beforeAfter as ServiceBeforeAfter).title} onChange={(value) => updateBeforeAfter("title", value)} />
            <Textarea label="Comparison Body" value={(beforeAfter as ServiceBeforeAfter).body} onChange={(value) => updateBeforeAfter("body", value)} />
            <UploadField
              label="Before Image"
              value={(beforeAfter as ServiceBeforeAfter).beforeImageUrl}
              scope="service-detail"
              onChange={(value) => updateBeforeAfter("beforeImageUrl", value)}
            />
            <Field label="Before Alt" value={(beforeAfter as ServiceBeforeAfter).beforeAlt} onChange={(value) => updateBeforeAfter("beforeAlt", value)} />
            <UploadField
              label="After Image"
              value={(beforeAfter as ServiceBeforeAfter).afterImageUrl}
              scope="service-detail"
              onChange={(value) => updateBeforeAfter("afterImageUrl", value)}
            />
            <Field label="After Alt" value={(beforeAfter as ServiceBeforeAfter).afterAlt} onChange={(value) => updateBeforeAfter("afterAlt", value)} />

            <EditorDivider title="Rich Detail Images" />
            <UploadField
              label="Upload Long Detail Image"
              value=""
              scope="service-rich-details"
              onChange={(imageUrl) =>
                setEditing({
                  ...editing,
                  richDetailImages: [
                    ...(editing.richDetailImages ?? []),
                    {
                      title: "",
                      imageAlt: "",
                      imageUrl,
                    },
                  ],
                })
              }
            />
            <Textarea
              label="Images: title | alt | imageUrl"
              value={formatRichDetailImages(editing.richDetailImages)}
              onChange={(value) => setEditing({ ...editing, richDetailImages: parseRichDetailImages(value) })}
            />

            <EditorDivider title="YouTube Preview" />
            <Textarea
              label="Videos: title | description | videoId | thumbnailUrl"
              value={formatVideos(editing.youtubeVideos)}
              onChange={(value) => setEditing({ ...editing, youtubeVideos: parseVideos(value) })}
            />

            <EditorDivider title="Detail CTA" />
            <Field label="CTA Title" value={(detailCta as ServiceDetailCta).title} onChange={(value) => updateDetailCta("title", value)} />
            <Textarea label="CTA Body" value={(detailCta as ServiceDetailCta).body} onChange={(value) => updateDetailCta("body", value)} />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button className="button-primary w-full" disabled={saveMutation.isPending} type="submit">
              {saveMutation.isPending ? <Loader2 className="animate-spin" size={15} /> : <Save size={15} />}
              Save
            </button>
            <button
              className="button-outline w-full"
              disabled={saveMutation.isPending}
              onClick={() => saveMutation.mutate({ ...editing, status: "draft" })}
              type="button"
            >
              Save Draft
            </button>
          </div>
        </form>
      </div>
    </CrudShell>
  );
}

function EditorDivider({ title }: { title: string }) {
  return (
    <div className="pt-3">
      <p className="border-t border-white/10 pt-4 text-xs font-black uppercase tracking-[0.16em] text-[#dec47b]">
        {title}
      </p>
    </div>
  );
}

function DetailPanelEditor({
  index,
  panel,
  onChange,
}: {
  index: number;
  panel?: ServiceDetailPanel;
  onChange: (patch: Partial<ServiceDetailPanel>) => void;
}) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.025] p-3">
      <p className="mb-3 text-xs font-black uppercase text-white/52">Panel {index + 1}</p>
      <div className="grid gap-3">
        <Field
          label="Eyebrow"
          value={panel?.eyebrow ?? String(index + 1).padStart(2, "0")}
          onChange={(value) => onChange({ eyebrow: value })}
        />
        <Field label="Title" value={panel?.title ?? ""} onChange={(value) => onChange({ title: value })} />
        <Textarea label="Body" value={panel?.body ?? ""} onChange={(value) => onChange({ body: value })} />
        <UploadField
          label="Panel Image"
          value={panel?.imageUrl ?? ""}
          scope="service-detail"
          onChange={(value) => onChange({ imageUrl: value })}
        />
        <Field label="Image Alt" value={panel?.imageAlt ?? ""} onChange={(value) => onChange({ imageAlt: value })} />
        <Textarea
          label="Points"
          value={(panel?.points ?? []).join("\n")}
          onChange={(value) => onChange({ points: splitLines(value) })}
        />
      </div>
    </div>
  );
}

function GenericCrudPanel({
  tab,
  items,
  source,
  loading,
  onChanged,
}: {
  tab: Exclude<AdminTab, "dashboard" | "services">;
  items: AdminRecord[];
  source?: "database" | "fallback";
  loading: boolean;
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState<AdminRecord>(() => getEmptyRecord(tab));
  const [notice, setNotice] = useState("");
  const isMediaResource = tab === "blog";
  const saveMutation = useMutation({
    mutationFn: async (payload: AdminRecord) => {
      const method = payload.id ? "PATCH" : "POST";
      const url = payload.id ? `/api/admin/${tab}/${payload.id}` : `/api/admin/${tab}`;
      return fetchJson(url, { method, body: JSON.stringify(payload) });
    },
    onSuccess: () => {
      setNotice("저장되었습니다.");
      setEditing(getEmptyRecord(tab));
      onChanged();
    },
    onError: (error) => setNotice(error instanceof Error ? error.message : "저장에 실패했습니다."),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetchJson(`/api/admin/${tab}/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      setNotice("삭제되었습니다.");
      onChanged();
    },
    onError: (error) => setNotice(error instanceof Error ? error.message : "삭제에 실패했습니다."),
  });

  return (
    <CrudShell
      title={tab.toUpperCase()}
      source={source}
      loading={loading}
      notice={notice}
      action={
        <button className="button-outline" onClick={() => setEditing(getEmptyRecord(tab))} type="button">
          New Record
        </button>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="grid gap-3">
          {items.map((item) => (
            <article key={item.id} className="glass-panel flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase text-[#dec47b]">{item.meta || item.status}</p>
                <h4 className="mt-2 truncate text-xl font-black">{item.title}</h4>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#d9d0c9]">{item.subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-white/8 px-3 py-1 text-xs font-black text-white/64">{item.status}</span>
                <button className="social-action-button" onClick={() => setEditing(item)} title="Edit" type="button">
                  <Pencil size={16} />
                </button>
                <button className="social-action-button" onClick={() => deleteMutation.mutate(item.id)} title="Delete" type="button">
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
        <form
          className="glass-panel h-fit p-5"
          onSubmit={(event) => {
            event.preventDefault();
            saveMutation.mutate(editing);
          }}
        >
          <p className="eyebrow text-[#dec47b]">Record Editor</p>
          <div className="mt-5 grid gap-3">
            <Field label={tab === "users" ? "Name" : "Title / Name"} value={editing.title} onChange={(value) => setEditing({ ...editing, title: value })} />
            <Textarea label={tab === "users" ? "Email" : "Summary / Message"} value={editing.subtitle} onChange={(value) => setEditing({ ...editing, subtitle: value })} />
            <Field label={tab === "users" ? "Role" : "Category / Interest"} value={editing.meta} onChange={(value) => setEditing({ ...editing, meta: value })} />
            <Field label="Status" value={editing.status} onChange={(value) => setEditing({ ...editing, status: value })} />
            <Field
              label={tab === "users" ? "Auth Provider" : "Tags / Channel"}
              value={(editing.tags ?? []).join(", ")}
              onChange={(value) => setEditing({ ...editing, tags: value.split(",").map((item) => item.trim()).filter(Boolean) })}
            />
            {isMediaResource ? (
              <UploadField
                label="Blog Thumbnail"
                value={editing.imageUrl ?? ""}
                scope="blog"
                onChange={(imageUrl) => setEditing({ ...editing, imageUrl })}
              />
            ) : null}
          </div>
          <button className="button-primary mt-5 w-full" disabled={saveMutation.isPending} type="submit">
            {saveMutation.isPending ? <Loader2 className="animate-spin" size={15} /> : <Save size={15} />}
            Save
          </button>
        </form>
      </div>
    </CrudShell>
  );
}

function CrudShell({
  title,
  source,
  loading,
  notice,
  action,
  children,
}: {
  title: string;
  source?: "database" | "fallback";
  loading: boolean;
  notice: string;
  action: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-5">
      <div className="glass-panel flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="eyebrow text-[#dec47b]">{title}</p>
          <h3 className="font-display mt-2 text-4xl">Content Management</h3>
          <p className="mt-2 text-sm text-[#b6aaa6]">
            {source === "fallback" ? "DATABASE_URL 연결 전이라 fallback 데이터로 표시 중입니다." : "Neon DB live data"}
          </p>
          {notice ? <p className="mt-3 text-sm font-bold text-[#dec47b]">{notice}</p> : null}
        </div>
        <div className="flex items-center gap-3">
          {loading ? <Loader2 className="animate-spin text-[#dec47b]" /> : null}
          {action}
        </div>
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | number | boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase text-white/58">{label}</span>
      <input className="form-field" value={String(value)} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase text-white/58">{label}</span>
      <textarea className="form-field min-h-24 resize-y" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase text-white/58">{label}</span>
      <select className="form-field" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} className="bg-[#120d0e]" value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function UploadField({
  label,
  value,
  scope,
  onChange,
}: {
  label: string;
  value: string;
  scope: string;
  onChange: (value: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase text-white/58">{label}</span>
      <div className="rounded-md border border-white/10 bg-white/[0.03] p-3">
        <input
          className="block w-full text-xs text-white/64 file:mr-3 file:rounded-full file:border-0 file:bg-[#d62f55] file:px-4 file:py-2 file:text-xs file:font-black file:text-white"
          type="file"
          accept="image/*,video/mp4,video/webm,application/pdf"
          onChange={async (event) => {
            const file = event.target.files?.[0];

            if (!file) {
              return;
            }

            setUploading(true);
            setProgress(0);

            try {
              const blob = await upload(`${scope}/${file.name}`, file, {
                access: "public",
                handleUploadUrl: "/api/admin/upload",
                clientPayload: JSON.stringify({ scope }),
                multipart: file.size > 8 * 1024 * 1024,
                onUploadProgress: (event) => setProgress(event.percentage),
              });
              onChange(blob.url);
            } finally {
              setUploading(false);
            }
          }}
        />
        <div className="mt-3 flex items-center gap-2 text-xs text-[#b6aaa6]">
          {uploading ? <Loader2 size={14} className="animate-spin text-[#dec47b]" /> : <UploadCloud size={14} />}
          {uploading ? `${progress}%` : value || "Blob URL will appear after upload"}
        </div>
      </div>
    </label>
  );
}

function getQuery(
  tab: AdminTab,
  users: ReturnType<typeof useQuery<ListResponse<AdminRecord>>>,
  blog: ReturnType<typeof useQuery<ListResponse<AdminRecord>>>,
  inquire: ReturnType<typeof useQuery<ListResponse<AdminRecord>>>,
) {
  if (tab === "blog") {
    return blog;
  }

  if (tab === "inquire") {
    return inquire;
  }

  return users;
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(json.error ?? "Request failed.");
  }

  return json as T;
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function splitComma(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatVideos(videos: ServiceVideoPreview[] | undefined) {
  return (videos ?? [])
    .map((video) =>
      [video.title, video.description, video.videoId, video.thumbnailUrl]
        .map((item) => item ?? "")
        .join(" | "),
    )
    .join("\n");
}

function parseVideos(value: string): ServiceVideoPreview[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title = "", description = "", videoId = "", thumbnailUrl = ""] = line
        .split("|")
        .map((item) => item.trim());

      return {
        title,
        description,
        videoId,
        thumbnailUrl,
      };
    })
    .filter((video) => video.title);
}

function formatRichDetailImages(images: ServiceRichDetailImage[] | undefined) {
  return (images ?? [])
    .map((image) =>
      [image.title, image.imageAlt, image.imageUrl]
        .map((item) => item ?? "")
        .join(" | "),
    )
    .join("\n");
}

function parseRichDetailImages(value: string): ServiceRichDetailImage[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title = "", imageAlt = "", imageUrl = ""] = line
        .split("|")
        .map((item) => item.trim());

      return {
        title,
        imageAlt,
        imageUrl,
      };
    })
    .filter((image) => image.imageUrl);
}
