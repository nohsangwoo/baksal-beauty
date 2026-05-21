"use client";

import Image from "next/image";
import Link from "next/link";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Eye, Globe2, GripVertical, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  servicePageCopy,
  serviceDetailSectionIds,
  type ServiceBeforeAfter,
  type ServiceContentCategory,
  type ServiceDetailCta,
  type ServiceDetailPanel,
  type ServiceDetailSectionId,
  type ServiceItem,
  type ServiceRichDetailImage,
  type ServiceSectionCopy,
  type ServiceSurgeryInfo,
  type ServiceVideoPreview,
} from "@/data/service-content";
import { serviceDetailLabels } from "@/data/service-detail-defaults";
import { localeLabels, locales, type Locale } from "@/i18n/config";
import {
  AdminToast,
  AssetDropzone,
  CrudShell,
  EditableBlock,
  EditableLine,
  EditorDivider,
  Field,
  Select,
  Textarea,
  UploadField,
} from "../_components/admin-shared";
import { fetchJson, splitLines, type ListResponse } from "../_components/admin-types";

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

export function ServiceAdminPanel({ initialLocale }: { initialLocale: Locale }) {
  const [serviceLocale, setServiceLocale] = useState<Locale>(initialLocale);
  const queryClient = useQueryClient();
  const serviceQuery = useQuery({
    queryKey: ["admin-services", serviceLocale],
    queryFn: () => fetchJson<ListResponse<ServiceItem>>("/api/admin/services?locale=" + serviceLocale),
  });

  return (
    <ServiceCrudPanel
      locale={serviceLocale}
      onLocaleChange={setServiceLocale}
      items={serviceQuery.data?.items ?? []}
      source={serviceQuery.data?.source}
      loading={serviceQuery.isLoading}
      onChanged={() => queryClient.invalidateQueries({ queryKey: ["admin-services", serviceLocale] })}
    />
  );
}

export function ServiceCrudPanel({
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
  const queryClient = useQueryClient();
  const [activeLocale, setActiveLocale] = useState<Locale>(locale);
  const [draft, setDraft] = useState<ServiceStudioDraft | null>(null);
  const [notice, setNotice] = useState("");
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" | "info" } | null>(null);
  const localeQueries = useQueries({
    queries: locales.map((item) => ({
      queryKey: ["admin-services", item],
      queryFn: () => fetchJson<ListResponse<ServiceItem>>(`/api/admin/services?locale=${item}`),
    })),
  });
  const servicesByLocale = useMemo(() => {
    return locales.reduce(
      (acc, item, index) => {
        acc[item] = localeQueries[index]?.data?.items ?? (item === locale ? items : []);
        return acc;
      },
      {} as Record<Locale, ServiceItem[]>,
    );
  }, [items, locale, localeQueries]);
  const canonicalItems = servicesByLocale.ko.length ? servicesByLocale.ko : items;
  const current = draft ? mergeServiceDraft(draft, activeLocale) : null;
  const isFetchingLocales = localeQueries.some((query) => query.isFetching);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => setToast(null), 3200);

    return () => window.clearTimeout(timer);
  }, [toast]);

  function showToast(message: string, tone: "success" | "error" | "info" = "success") {
    setNotice(message);
    setToast({ message, tone });
  }

  const saveMutation = useMutation({
    mutationFn: async ({ mode, locale: saveLocale }: { mode: "published" | "draft"; locale: Locale }) => {
      if (!draft) {
        throw new Error("Select a service first.");
      }

      const payload = createServicePayload(draft, saveLocale, mode);
      const method = payload.id ? "PATCH" : "POST";
      const url = payload.id ? `/api/admin/services/${payload.id}` : "/api/admin/services";

      return fetchJson<{ id: string }>(url, { method, body: JSON.stringify(payload) });
    },
    onSuccess: async (result, variables) => {
      if (result.id) {
        setDraft((currentDraft) =>
          currentDraft ? { ...currentDraft, base: { ...currentDraft.base, id: result.id } } : currentDraft,
        );
      }
      showToast(`${localeLabels[variables.locale]} 서비스 콘텐츠가 저장되었습니다.`);
      await queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      onChanged();
    },
    onError: (error) => showToast(error instanceof Error ? error.message : "저장에 실패했습니다.", "error"),
  });
  const saveAllMutation = useMutation({
    mutationFn: async (mode: "published" | "draft") => {
      if (!draft) {
        throw new Error("Select a service first.");
      }

      let serviceId = String(draft.base.id ?? "");

      if (!serviceId) {
        const createPayload = createServicePayload(draft, activeLocale, mode);
        const created = await fetchJson<{ id: string }>("/api/admin/services", {
          method: "POST",
          body: JSON.stringify(createPayload),
        });
        serviceId = created.id;
      }

      const draftWithId: ServiceStudioDraft = {
        ...draft,
        base: {
          ...draft.base,
          id: serviceId,
        },
      };

      await Promise.all(
        locales.map((item) => {
          const payload = createServicePayload(draftWithId, item, mode);

          return fetchJson(`/api/admin/services/${serviceId}`, { method: "PATCH", body: JSON.stringify(payload) });
        }),
      );

      return { id: serviceId };
    },
    onSuccess: async (result) => {
      if (result.id) {
        setDraft((currentDraft) =>
          currentDraft ? { ...currentDraft, base: { ...currentDraft.base, id: result.id } } : currentDraft,
        );
      }
      showToast("전체 언어 콘텐츠가 저장되었습니다.");
      await queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      onChanged();
    },
    onError: (error) => showToast(error instanceof Error ? error.message : "전체 저장에 실패했습니다.", "error"),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetchJson(`/api/admin/services/${id}`, { method: "DELETE" }),
    onSuccess: async () => {
      showToast("서비스가 삭제되었습니다.", "info");
      setDraft(null);
      await queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      onChanged();
    },
    onError: (error) => showToast(error instanceof Error ? error.message : "삭제에 실패했습니다.", "error"),
  });
  const translateMutation = useMutation({
    mutationFn: async (targetLocale: Locale) => {
      if (!draft?.base.id) {
        throw new Error("Select a saved service first.");
      }

      return fetchJson<Partial<ServiceItem>>("/api/admin/services/translate", {
        method: "POST",
        body: JSON.stringify({
          serviceId: draft.base.id,
          targetLocale,
          sourceLocale: "ko",
        }),
      });
    },
    onSuccess: (translated, targetLocale) => {
      setDraft((currentDraft) => {
        if (!currentDraft) {
          return currentDraft;
        }

        return {
          ...currentDraft,
          localized: {
            ...currentDraft.localized,
            [targetLocale]: {
              ...currentDraft.localized[targetLocale],
              ...translated,
            },
          },
        };
      });
      showToast(`${localeLabels[targetLocale]} 초안 번역이 생성되었습니다.`, "info");
    },
    onError: (error) => showToast(error instanceof Error ? error.message : "번역에 실패했습니다.", "error"),
  });

  function selectService(id: string) {
    setDraft(createServiceStudioDraft(id, servicesByLocale, canonicalItems));
  }

  function startNewService() {
    setDraft(createBlankServiceDraft());
  }

  function updateBase(patch: Partial<ServiceItem>) {
    setDraft((currentDraft) => {
      if (!currentDraft) {
        return currentDraft;
      }

      const nextBase = { ...currentDraft.base, ...patch };
      const category = patch.category ?? nextBase.category;

      return {
        ...currentDraft,
        base: {
          ...nextBase,
          tags: category ? [category] as ServiceContentCategory[] : nextBase.tags,
        },
      };
    });
  }

  function updateActive(patch: Partial<ServiceItem>) {
    setDraft((currentDraft) => {
      if (!currentDraft) {
        return currentDraft;
      }

      return {
        ...currentDraft,
        localized: {
          ...currentDraft.localized,
          [activeLocale]: {
            ...currentDraft.localized[activeLocale],
            ...patch,
          },
        },
      };
    });
  }

  function updateArray(field: "highlights" | "recommendedFor" | "process", index: number, value: string) {
    const list = [...((current?.[field] as string[] | undefined) ?? [])];
    list[index] = value;
    updateActive({ [field]: list } as Partial<ServiceItem>);
  }

  function addArrayItem(field: "highlights" | "recommendedFor" | "process") {
    const list = [...((current?.[field] as string[] | undefined) ?? []), "New point"];
    updateActive({ [field]: list } as Partial<ServiceItem>);
  }

  function updateSurgeryInfo(field: keyof ServiceSurgeryInfo, value: string) {
    updateActive({
      surgeryInfo: {
        ...getCompleteSurgeryInfo(current),
        [field]: value,
      },
    });
  }

  function updateBeforeAfter(field: keyof ServiceBeforeAfter, value: string) {
    updateActive({
      beforeAfter: {
        ...getCompleteBeforeAfter(current),
        [field]: value,
      },
    });
  }

  function updateDetailCta(field: "title" | "body", value: string) {
    updateActive({
      detailCta: {
        ...getCompleteDetailCta(current, draft?.sectionOrder),
        [field]: value,
      },
    });
  }

  function updateSectionCopy(section: ServiceDetailSectionId, patch: Partial<ServiceSectionCopy>) {
    const detailCta = getCompleteDetailCta(current, draft?.sectionOrder);
    const currentCopy = getSectionCopy(current, section, activeLocale, detailCta);

    updateActive({
      detailCta: {
        ...detailCta,
        sectionCopy: {
          ...(detailCta.sectionCopy ?? {}),
          [section]: {
            ...currentCopy,
            ...patch,
          },
        },
      },
    });
  }

  function updatePanel(index: number, patch: Partial<ServiceDetailPanel>) {
    const panels = getCompleteDetailPanels(current);
    panels[index] = { ...panels[index], ...patch };
    updateActive({ detailPanels: panels });
  }

  function movePanel(fromIndex: number, toIndex: number) {
    const panels = getCompleteDetailPanels(current);

    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= panels.length || toIndex >= panels.length) {
      return;
    }

    const [moved] = panels.splice(fromIndex, 1);
    panels.splice(toIndex, 0, moved);
    updateActive({ detailPanels: renumberNumericDetailPanels(panels) });
  }

  function updateRichImage(index: number, patch: Partial<ServiceRichDetailImage>) {
    const richDetailImages = [...(current?.richDetailImages ?? [])];
    const existing = richDetailImages[index] ?? {
      title: "",
      imageAlt: "",
      imageUrl: "",
    };

    richDetailImages[index] = {
      ...existing,
      ...patch,
    };
    updateActive({ richDetailImages });
  }

  function addRichImage(imageUrl = "") {
    updateActive({
      richDetailImages: [
        ...(current?.richDetailImages ?? []),
        { title: "New detail image", imageAlt: current?.title ?? "", imageUrl },
      ],
    });
  }

  function removeRichImage(index: number) {
    updateActive({
      richDetailImages: (current?.richDetailImages ?? []).filter((_, itemIndex) => itemIndex !== index),
    });
  }

  function moveRichImage(fromIndex: number, toIndex: number) {
    const richDetailImages = [...(current?.richDetailImages ?? [])];

    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= richDetailImages.length || toIndex >= richDetailImages.length) {
      return;
    }

    const [moved] = richDetailImages.splice(fromIndex, 1);
    richDetailImages.splice(toIndex, 0, moved);
    updateActive({ richDetailImages });
  }

  function updateVideo(index: number, patch: Partial<ServiceVideoPreview>) {
    const youtubeVideos = [...(current?.youtubeVideos ?? [])];
    const existing = youtubeVideos[index] ?? {
      title: "",
      description: "",
      videoId: "",
      thumbnailUrl: "",
    };

    youtubeVideos[index] = {
      ...existing,
      ...patch,
    };
    updateActive({ youtubeVideos });
  }

  function addVideo() {
    updateActive({
      youtubeVideos: [
        ...(current?.youtubeVideos ?? []),
        {
          title: `${current?.title || "Service"} preview`,
          description: current?.summary ?? "",
          videoId: "",
          thumbnailUrl: current?.imageUrl ?? "",
        },
      ],
    });
  }

  function removeVideo(index: number) {
    updateActive({
      youtubeVideos: (current?.youtubeVideos ?? []).filter((_, itemIndex) => itemIndex !== index),
    });
  }

  function moveSection(section: ServiceDetailSectionId, direction: -1 | 1) {
    setDraft((currentDraft) => {
      if (!currentDraft) {
        return currentDraft;
      }

      const order = [...currentDraft.sectionOrder];
      const index = order.indexOf(section);
      const nextIndex = index + direction;

      if (index === -1 || nextIndex < 0 || nextIndex >= order.length) {
        return currentDraft;
      }

      [order[index], order[nextIndex]] = [order[nextIndex], order[index]];
      return { ...currentDraft, sectionOrder: order };
    });
  }

  function applyTemplate() {
    if (!current) {
      return;
    }

    updateActive({
      surgeryInfo: getCompleteSurgeryInfo(current),
      detailPanels: getCompleteDetailPanels(current),
      beforeAfter: getCompleteBeforeAfter(current),
      richDetailImages: current.richDetailImages?.length ? current.richDetailImages : createEmptyRichImages(current),
      youtubeVideos: current.youtubeVideos?.length ? current.youtubeVideos : createEmptyVideos(current),
      detailCta: getCompleteDetailCta(current, draft?.sectionOrder),
    });
    showToast("기본 상세 템플릿이 현재 언어 탭에 적용되었습니다.", "info");
  }

  if (!current || !draft) {
    return (
      <CrudShell
        title="SERVICE"
        source={source}
        loading={loading || isFetchingLocales}
        notice={notice}
        action={<button className="button-outline" onClick={startNewService} type="button">New Service</button>}
      >
        <div className="glass-panel grid min-h-[24rem] gap-6 p-6 text-[#d9d0c9] lg:grid-cols-[0.55fr_1fr]">
          <div className="grid place-items-center rounded-md border border-white/10 bg-white/[0.025] p-8 text-center">
            <div>
              <p className="eyebrow text-[#dec47b]">Service Studio</p>
              <p className="mt-4 text-lg font-bold">등록된 서비스를 선택하거나 새 서비스를 만들어주세요.</p>
            </div>
          </div>
          <div className="grid max-h-[34rem] gap-2 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {canonicalItems.map((item) => (
              <button
                key={item.id}
                className="grid grid-cols-[72px_minmax(0,1fr)] items-center gap-3 rounded-md border border-white/10 bg-white/[0.025] p-2 text-left transition hover:border-[#dec47b]/45"
                onClick={() => selectService(item.id)}
                type="button"
              >
                <div className="relative aspect-square overflow-hidden rounded bg-black/35">
                  {item.imageUrl ? <Image src={item.imageUrl} alt={item.imageAlt} fill sizes="220px" className="object-cover" /> : null}
                </div>
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-black leading-5 text-white">{item.title}</p>
                  <p className="mt-1 text-[0.66rem] font-bold uppercase text-[#dec47b]">{item.status}</p>
                </div>
              </button>
            ))}
          </div>
          {!canonicalItems.length ? (
            <div className="grid place-items-center rounded-md border border-dashed border-white/10 p-8 text-center">
              <div>
                <p className="eyebrow text-[#dec47b]">Empty</p>
                <p className="mt-4 text-lg font-bold">아직 등록된 서비스가 없습니다.</p>
              </div>
            </div>
          ) : null}
        </div>
      </CrudShell>
    );
  }

  return (
    <CrudShell
      title="SERVICE"
      source={source}
      loading={loading || isFetchingLocales}
      notice={notice}
      action={
        <div className="flex flex-wrap gap-2">
          <button className="button-outline" onClick={startNewService} type="button">
            New Service
          </button>
          {current.id ? (
            <Link className="button-outline" href={`/${activeLocale}/service/${current.slug}`} target="_blank">
              <Eye size={15} /> Live
            </Link>
          ) : null}
          {current.id ? (
            <button
              className="button-outline"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(current.id)}
              type="button"
            >
              {deleteMutation.isPending ? <Loader2 className="animate-spin" size={15} /> : <Trash2 size={15} />}
              Delete
            </button>
          ) : null}
        </div>
      }
    >
      <div className="grid gap-4 2xl:grid-cols-[280px_minmax(0,1fr)_360px]">
        <aside className="glass-panel h-fit p-3 2xl:sticky 2xl:top-28">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 p-3">
            <div>
              <p className="eyebrow text-[#dec47b]">Catalog</p>
              <p className="mt-2 text-sm font-black text-white/72">{canonicalItems.length} services</p>
            </div>
            {isFetchingLocales ? <Loader2 className="animate-spin text-[#dec47b]" size={18} /> : null}
          </div>
          <div className="mt-3 grid max-h-[calc(100svh-13rem)] gap-2 overflow-y-auto pr-1">
            {canonicalItems.map((item) => (
              <button
                key={item.id}
                className={`grid grid-cols-[72px_minmax(0,1fr)] items-center gap-3 rounded-md border p-2 text-left transition ${
                  current.id === item.id
                    ? "border-[#d62f55] bg-[#d62f55]/16"
                    : "border-white/10 bg-white/[0.025] hover:border-[#dec47b]/45"
                }`}
                onClick={() => selectService(item.id)}
                type="button"
              >
                <div className="relative aspect-square overflow-hidden rounded bg-black/35">
                  {item.imageUrl ? <Image src={item.imageUrl} alt={item.imageAlt} fill sizes="260px" className="object-cover" /> : null}
                </div>
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-black leading-5 text-white">{item.title}</p>
                  <p className="mt-1 text-[0.66rem] font-bold uppercase text-[#dec47b]">{item.status}</p>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <div className="min-w-0">
          <div className="glass-panel mb-4 flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="eyebrow text-[#dec47b]">Visual Service Editor</p>
              <p className="mt-2 text-sm leading-6 text-[#d9d0c9]">
                실제 상세페이지 흐름을 보면서 텍스트와 섹션 순서를 즉시 조정합니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {locales.map((item) => (
                <button
                  key={item}
                  className={`rounded-full border px-4 py-2 text-xs font-black transition ${
                    activeLocale === item
                      ? "border-[#d62f55] bg-[#d62f55] text-white"
                      : "border-white/10 bg-white/[0.04] text-white/62 hover:border-[#dec47b]/60 hover:text-[#dec47b]"
                  }`}
                  onClick={() => {
                    setActiveLocale(item);
                    onLocaleChange(item);
                  }}
                  type="button"
                >
                  {localeLabels[item]}
                </button>
              ))}
            </div>
          </div>

          <ServiceLivePreview
            service={current}
            order={draft.sectionOrder}
            locale={activeLocale}
            onText={updateActive}
            onHeroImage={(imageUrl) => updateBase({ imageUrl })}
            onArrayItem={updateArray}
            onAddArrayItem={addArrayItem}
            onSurgeryInfo={updateSurgeryInfo}
            onBeforeAfter={updateBeforeAfter}
            onDetailCta={updateDetailCta}
            onSectionCopy={updateSectionCopy}
            onPanel={updatePanel}
            onMovePanel={movePanel}
            onRichImage={updateRichImage}
            onAddRichImage={addRichImage}
            onRemoveRichImage={removeRichImage}
            onMoveRichImage={moveRichImage}
            onVideo={updateVideo}
            onAddVideo={addVideo}
            onRemoveVideo={removeVideo}
            onMoveSection={moveSection}
          />
        </div>

        <aside className="glass-panel h-fit p-4 2xl:sticky 2xl:top-28">
          <div className="flex items-center gap-2 border-b border-white/10 pb-4">
            <Globe2 size={17} className="text-[#dec47b]" />
            <div>
              <p className="text-sm font-black text-white">{localeLabels[activeLocale]} Content</p>
              <p className="text-xs text-white/52">공통 설정과 상세 자산</p>
            </div>
          </div>

          <div className="mt-4 grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-1">
              <Field label="Slug" value={draft.base.slug ?? ""} onChange={(value) => updateBase({ slug: value })} />
              <Select
                label="Category"
                value={draft.base.category ?? "eye"}
                options={["eye", "nose", "lifting", "petit"]}
                onChange={(value) => updateBase({ category: value as ServiceContentCategory, tags: [value as ServiceContentCategory] })}
              />
              <Field label="Sort Order" value={draft.base.sortOrder ?? 100} onChange={(value) => updateBase({ sortOrder: Number(value) || 100 })} />
              <Select
                label="Status"
                value={draft.base.status ?? "published"}
                options={["published", "draft", "archived"]}
                onChange={(value) => updateBase({ status: value as ServiceItem["status"] })}
              />
            </div>
            <UploadField label="Hero / Card Image" value={draft.base.imageUrl ?? ""} scope="service" onChange={(imageUrl) => updateBase({ imageUrl })} />
            <Textarea label="Related Slugs" value={(draft.base.relatedSlugs ?? []).join("\n")} onChange={(value) => updateBase({ relatedSlugs: splitLines(value) })} />

            <EditorDivider title="Language Actions" />
            <button className="button-outline w-full min-w-0 px-3 text-[0.68rem] tracking-[0.08em]" onClick={applyTemplate} type="button">
              <Plus size={15} /> Apply Default Template
            </button>
            {activeLocale !== "ko" && current.id ? (
              <button
                className="button-outline w-full min-w-0 px-3 text-[0.68rem] tracking-[0.08em]"
                disabled={translateMutation.isPending}
                onClick={() => translateMutation.mutate(activeLocale)}
                type="button"
              >
                {translateMutation.isPending ? <Loader2 className="animate-spin" size={15} /> : null}
                Translate from KR
              </button>
            ) : null}

            <EditorDivider title="Section Order" />
            <div className="grid gap-2">
              {draft.sectionOrder.map((section) => (
                <div
                  key={section}
                  className="flex items-center justify-between gap-2 rounded-md border border-white/10 bg-white/[0.025] px-3 py-2"
                >
                  <span className="text-xs font-black uppercase text-white/70">{sectionLabels[section]}</span>
                  <div className="flex gap-1">
                    <button className="social-action-button !h-8 !w-8" onClick={() => moveSection(section, -1)} type="button">
                      <ArrowUp size={13} />
                    </button>
                    <button className="social-action-button !h-8 !w-8" onClick={() => moveSection(section, 1)} type="button">
                      <ArrowDown size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <div className="fixed bottom-5 right-5 z-[80] flex flex-col gap-2 rounded-lg border border-white/10 bg-[#0d0b0c]/92 p-3 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:flex-row">
        <button
          className="button-outline !h-11 min-w-0 px-3 text-[0.68rem] tracking-[0.08em]"
          disabled={saveMutation.isPending || saveAllMutation.isPending}
          onClick={() => saveMutation.mutate({ mode: "draft", locale: activeLocale })}
          type="button"
        >
          Draft
        </button>
        <button
          className="button-primary !h-11 min-w-0 px-3 text-[0.68rem] tracking-[0.08em]"
          disabled={saveMutation.isPending || saveAllMutation.isPending}
          onClick={() => saveMutation.mutate({ mode: "published", locale: activeLocale })}
          type="button"
        >
          {saveMutation.isPending ? <Loader2 className="animate-spin" size={15} /> : <Save size={15} />}
          Save {localeLabels[activeLocale]}
        </button>
        <button
          className="button-outline !h-11 min-w-0 px-3 text-[0.68rem] tracking-[0.08em]"
          disabled={saveMutation.isPending || saveAllMutation.isPending}
          onClick={() => saveAllMutation.mutate("published")}
          type="button"
        >
          Save All
        </button>
      </div>

      <AdminToast toast={toast} onClose={() => setToast(null)} />
    </CrudShell>
  );
}

type ServiceStudioDraft = {
  base: Partial<ServiceItem>;
  localized: Record<Locale, Partial<ServiceItem>>;
  sectionOrder: ServiceDetailSectionId[];
};

const sectionLabels: Record<ServiceDetailSectionId, string> = {
  summary: "Treatment Summary",
  recommended: "Recommended Target",
  detailPanels: "Detail Image Flow",
  beforeAfter: "Before & After",
  richImages: "Long Detail Images",
  videos: "YouTube Preview",
  detailCta: "CTA & Highlights",
};

const previewEyebrowClass = "eyebrow w-full bg-transparent text-[#dec47b] outline-none";
const previewCenteredEyebrowClass =
  "eyebrow mx-auto w-full max-w-md bg-transparent text-center text-[#dec47b] outline-none";
const previewTitleClass =
  "font-display mt-4 w-full bg-transparent text-5xl leading-tight text-[#fff8ef] outline-none md:text-6xl";
const previewCenteredTitleClass =
  "font-display mx-auto mt-4 w-full bg-transparent text-center text-5xl leading-tight text-[#fff8ef] outline-none md:text-6xl";
const previewBodyClass =
  "mt-6 min-h-32 w-full resize-none bg-transparent leading-8 text-[#d9d0c9] outline-none";
const previewCenteredBodyClass =
  "mx-auto mt-6 min-h-24 w-full max-w-3xl resize-none bg-transparent text-center leading-8 text-[#d9d0c9] outline-none";

function createBlankServiceDraft(): ServiceStudioDraft {
  return {
    base: { ...emptyService, id: "", tags: ["eye"] },
    localized: locales.reduce(
      (acc, item) => {
        acc[item] = { ...emptyService, id: "" };
        return acc;
      },
      {} as Record<Locale, Partial<ServiceItem>>,
    ),
    sectionOrder: [...serviceDetailSectionIds],
  };
}

function createServiceStudioDraft(
  id: string,
  servicesByLocale: Record<Locale, ServiceItem[]>,
  canonicalItems: ServiceItem[],
): ServiceStudioDraft {
  const canonical =
    canonicalItems.find((item) => item.id === id || item.slug === id) ??
    Object.values(servicesByLocale)
      .flat()
      .find((item) => item.id === id || item.slug === id) ??
    (emptyService as ServiceItem);
  const localized = locales.reduce(
    (acc, item) => {
      const localizedItem = servicesByLocale[item].find(
        (service) => service.id === canonical.id || service.slug === canonical.slug,
      );
      acc[item] = cloneService(localizedItem ?? canonical);
      return acc;
    },
    {} as Record<Locale, Partial<ServiceItem>>,
  );

  return {
    base: {
      id: canonical.id,
      slug: canonical.slug,
      category: canonical.category,
      tags: canonical.tags?.length ? canonical.tags : [canonical.category],
      imageUrl: canonical.imageUrl,
      featured: canonical.featured,
      sortOrder: canonical.sortOrder,
      status: canonical.status,
      relatedSlugs: canonical.relatedSlugs ?? [],
      embedding: canonical.embedding ?? [],
    },
    localized,
    sectionOrder: normalizeSectionOrder(
      (localized.ko.detailCta as ServiceDetailCta | undefined)?.sectionOrder ??
        (canonical.detailCta as ServiceDetailCta | undefined)?.sectionOrder,
    ),
  };
}

function cloneService(service: Partial<ServiceItem>): Partial<ServiceItem> {
  return {
    ...service,
    tags: [...(service.tags ?? [])],
    highlights: [...(service.highlights ?? [])],
    recommendedFor: [...(service.recommendedFor ?? [])],
    process: [...(service.process ?? [])],
    relatedSlugs: [...(service.relatedSlugs ?? [])],
    embedding: [...(service.embedding ?? [])],
    surgeryInfo: service.surgeryInfo ? { ...service.surgeryInfo } : undefined,
    beforeAfter: service.beforeAfter ? { ...service.beforeAfter } : undefined,
    detailCta: service.detailCta ? { ...service.detailCta } : undefined,
    detailPanels: (service.detailPanels ?? []).map((panel) => ({
      ...panel,
      points: [...(panel.points ?? [])],
    })),
    richDetailImages: (service.richDetailImages ?? []).map((image) => ({ ...image })),
    youtubeVideos: (service.youtubeVideos ?? []).map((video) => ({ ...video })),
  };
}

function mergeServiceDraft(draft: ServiceStudioDraft, locale: Locale): ServiceItem {
  const base = draft.base;
  const localized = draft.localized[locale] ?? {};
  const category = (base.category ?? "eye") as ServiceContentCategory;

  return {
    id: String(base.id ?? ""),
    slug: String(base.slug ?? ""),
    category,
    tags: (base.tags?.length ? base.tags : [category]) as ServiceContentCategory[],
    imageUrl: String(base.imageUrl ?? localized.imageUrl ?? ""),
    imageAlt: String(localized.imageAlt ?? localized.title ?? ""),
    featured: Boolean(base.featured),
    sortOrder: Number(base.sortOrder ?? 100),
    status: (base.status ?? "published") as ServiceItem["status"],
    title: String(localized.title ?? ""),
    subtitle: String(localized.subtitle ?? ""),
    summary: String(localized.summary ?? ""),
    description: String(localized.description ?? ""),
    highlights: [...(localized.highlights ?? [])],
    recommendedFor: [...(localized.recommendedFor ?? [])],
    process: [...(localized.process ?? [])],
    recovery: String(localized.recovery ?? ""),
    duration: String(localized.duration ?? ""),
    priceNote: String(localized.priceNote ?? ""),
    surgeryInfo: localized.surgeryInfo,
    detailPanels: localized.detailPanels ?? [],
    beforeAfter: localized.beforeAfter,
    richDetailImages: localized.richDetailImages ?? [],
    youtubeVideos: localized.youtubeVideos ?? [],
    detailCta: getCompleteDetailCta(localized as ServiceItem, draft.sectionOrder),
    relatedSlugs: [...(base.relatedSlugs ?? [])],
    embedding: [...(base.embedding ?? [])],
    updatedAt: localized.updatedAt,
  };
}

function createServicePayload(
  draft: ServiceStudioDraft,
  locale: Locale,
  status: "published" | "draft",
): Partial<ServiceItem> & { locale: Locale } {
  const service = mergeServiceDraft({ ...draft, base: { ...draft.base, status } }, locale);

  return {
    ...service,
    locale,
    tags: service.tags?.length ? service.tags : [service.category],
    imageAlt: service.imageAlt || service.title,
    detailCta: getCompleteDetailCta(service, draft.sectionOrder),
  };
}

function normalizeSectionOrder(value: unknown): ServiceDetailSectionId[] {
  const input = Array.isArray(value) ? value : [];
  const known = input.filter((item): item is ServiceDetailSectionId =>
    serviceDetailSectionIds.includes(item as ServiceDetailSectionId),
  );

  return [...known, ...serviceDetailSectionIds.filter((item) => !known.includes(item))];
}

function getCompleteSurgeryInfo(service?: Partial<ServiceItem> | null): ServiceSurgeryInfo {
  return {
    surgeryTime: service?.surgeryInfo?.surgeryTime ?? "",
    anesthesia: service?.surgeryInfo?.anesthesia ?? "",
    visits: service?.surgeryInfo?.visits ?? "",
    aftercareStart: service?.surgeryInfo?.aftercareStart ?? "",
    recoveryPeriod: service?.surgeryInfo?.recoveryPeriod ?? "",
  };
}

function getCompleteBeforeAfter(service?: Partial<ServiceItem> | null): ServiceBeforeAfter {
  return {
    title: service?.beforeAfter?.title ?? `${service?.title ?? ""} Before & After`,
    body: service?.beforeAfter?.body ?? service?.summary ?? "",
    beforeImageUrl: service?.beforeAfter?.beforeImageUrl ?? "/images/before-face.jpg",
    beforeAlt: service?.beforeAfter?.beforeAlt ?? "Before image",
    afterImageUrl: service?.beforeAfter?.afterImageUrl ?? "/images/after-face.jpg",
    afterAlt: service?.beforeAfter?.afterAlt ?? "After image",
  };
}

function getCompleteDetailCta(
  service?: Partial<ServiceItem> | null,
  sectionOrder: ServiceDetailSectionId[] = [...serviceDetailSectionIds],
): ServiceDetailCta {
  const title = service?.detailCta?.title ?? `Before choosing ${service?.title ?? "this service"}`;
  const body = service?.detailCta?.body ?? service?.description ?? "";

  return {
    title,
    body,
    sectionOrder,
    sectionCopy: service?.detailCta?.sectionCopy ?? {},
  };
}

function getSectionCopy(
  service: Partial<ServiceItem> | null | undefined,
  section: ServiceDetailSectionId,
  locale: Locale,
  detailCta = getCompleteDetailCta(service),
): ServiceSectionCopy {
  return {
    ...getDefaultSectionCopy(service, section, locale, detailCta),
    ...(detailCta.sectionCopy?.[section] ?? {}),
  };
}

function getDefaultSectionCopy(
  service: Partial<ServiceItem> | null | undefined,
  section: ServiceDetailSectionId,
  locale: Locale,
  detailCta: Pick<ServiceDetailCta, "title" | "body">,
): ServiceSectionCopy {
  const labels = serviceDetailLabels[locale] ?? serviceDetailLabels.ko;
  const beforeAfter = getCompleteBeforeAfter(service);
  const title = service?.title || "Service";

  switch (section) {
    case "summary":
      return {
        eyebrow: labels.surgeryInfo,
        title: labels.surgeryInfo,
        body: labels.surgeryInfoBody,
      };
    case "recommended":
      return {
        eyebrow: labels.recommended,
        title: service?.subtitle || title,
        body: labels.recommendedBody,
      };
    case "detailPanels":
      return {
        eyebrow: labels.detailPanels,
        title,
        body: labels.detailPanelsBody,
      };
    case "beforeAfter":
      return {
        eyebrow: labels.beforeAfter,
        title: beforeAfter.title,
        body: beforeAfter.body,
      };
    case "richImages":
      return {
        eyebrow: labels.richImages,
        title: labels.richImagesTitle(title),
        body: labels.richImagesBody,
      };
    case "videos":
      return {
        eyebrow: labels.videos,
        title: `${title} Preview`,
        body: labels.videosBody,
      };
    case "detailCta":
      return {
        eyebrow: labels.detailCta,
        title: detailCta.title,
        body: detailCta.body,
      };
  }
}

function getCompleteDetailPanels(service?: Partial<ServiceItem> | null): ServiceDetailPanel[] {
  const panels = [...(service?.detailPanels ?? [])];

  while (panels.length < 3) {
    const index = panels.length;
    panels.push({
      eyebrow: String(index + 1).padStart(2, "0"),
      title: ["Diagnosis", "Design", "Recovery"][index] ?? "Detail",
      body: service?.summary ?? "",
      imageUrl: service?.imageUrl ?? "",
      imageAlt: service?.imageAlt ?? service?.title ?? "",
      points: [service?.highlights?.[index] ?? "Edit this point"],
    });
  }

  return panels.map((panel, index) => ({
    eyebrow: panel.eyebrow || String(index + 1).padStart(2, "0"),
    title: panel.title,
    body: panel.body,
    imageUrl: panel.imageUrl || service?.imageUrl || "",
    imageAlt: panel.imageAlt || service?.title || "",
    points: panel.points?.length ? panel.points : ["Edit this point"],
  }));
}

function renumberNumericDetailPanels(panels: ServiceDetailPanel[]) {
  const canRenumber = panels.every((panel) => !panel.eyebrow || /^\d{1,2}$/.test(panel.eyebrow.trim()));

  if (!canRenumber) {
    return panels;
  }

  return panels.map((panel, index) => ({
    ...panel,
    eyebrow: String(index + 1).padStart(2, "0"),
  }));
}

function createEmptyRichImages(service: ServiceItem): ServiceRichDetailImage[] {
  return [1, 2, 3].map((number) => ({
    title: `${service.title || "Service"} long detail ${number}`,
    imageAlt: `${service.title || "Service"} detail image ${number}`,
    imageUrl: service.imageUrl,
  }));
}

function createEmptyVideos(service: ServiceItem): ServiceVideoPreview[] {
  return [
    {
      title: `${service.title || "Service"} consultation preview`,
      description: service.summary,
      videoId: "",
      thumbnailUrl: service.imageUrl,
    },
  ];
}

function ServiceLivePreview({
  service,
  order,
  locale,
  onText,
  onHeroImage,
  onArrayItem,
  onAddArrayItem,
  onSurgeryInfo,
  onBeforeAfter,
  onDetailCta,
  onSectionCopy,
  onPanel,
  onMovePanel,
  onRichImage,
  onAddRichImage,
  onRemoveRichImage,
  onMoveRichImage,
  onVideo,
  onAddVideo,
  onRemoveVideo,
  onMoveSection,
}: {
  service: ServiceItem;
  order: ServiceDetailSectionId[];
  locale: Locale;
  onText: (patch: Partial<ServiceItem>) => void;
  onHeroImage: (imageUrl: string) => void;
  onArrayItem: (field: "highlights" | "recommendedFor" | "process", index: number, value: string) => void;
  onAddArrayItem: (field: "highlights" | "recommendedFor" | "process") => void;
  onSurgeryInfo: (field: keyof ServiceSurgeryInfo, value: string) => void;
  onBeforeAfter: (field: keyof ServiceBeforeAfter, value: string) => void;
  onDetailCta: (field: "title" | "body", value: string) => void;
  onSectionCopy: (section: ServiceDetailSectionId, patch: Partial<ServiceSectionCopy>) => void;
  onPanel: (index: number, patch: Partial<ServiceDetailPanel>) => void;
  onMovePanel: (fromIndex: number, toIndex: number) => void;
  onRichImage: (index: number, patch: Partial<ServiceRichDetailImage>) => void;
  onAddRichImage: (imageUrl?: string) => void;
  onRemoveRichImage: (index: number) => void;
  onMoveRichImage: (fromIndex: number, toIndex: number) => void;
  onVideo: (index: number, patch: Partial<ServiceVideoPreview>) => void;
  onAddVideo: () => void;
  onRemoveVideo: (index: number) => void;
  onMoveSection: (section: ServiceDetailSectionId, direction: -1 | 1) => void;
}) {
  const [draggingPanelIndex, setDraggingPanelIndex] = useState<number | null>(null);
  const [draggingRichIndex, setDraggingRichIndex] = useState<number | null>(null);
  const [richDropIndex, setRichDropIndex] = useState<number | null>(null);
  const surgeryInfo = getCompleteSurgeryInfo(service);
  const beforeAfter = getCompleteBeforeAfter(service);
  const detailPanels = getCompleteDetailPanels(service);
  const detailCta = getCompleteDetailCta(service, order);
  const richImages = service.richDetailImages ?? [];
  const labels = servicePageCopy[locale];
  const sectionCopy = serviceDetailSectionIds.reduce(
    (acc, section) => {
      acc[section] = getSectionCopy(service, section, locale, detailCta);
      return acc;
    },
    {} as Record<ServiceDetailSectionId, ServiceSectionCopy>,
  );

  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-[#1f1715]">
      <section className="relative min-h-[34rem] overflow-hidden border-b border-white/10">
        {service.imageUrl ? (
          <Image src={service.imageUrl} alt={service.imageAlt || service.title} fill sizes="100vw" className="object-cover opacity-54" />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(214,47,85,0.24),transparent_35%),#120d0e]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-[#3b0719]/45 to-black/60" />
        <div className="relative z-10 flex min-h-[34rem] max-w-5xl flex-col justify-end p-6 md:p-10">
          <p className="eyebrow text-[#dec47b]">{labels.tabs[service.category]}</p>
          <EditableLine
            className="font-display mt-5 w-full max-w-4xl bg-transparent text-6xl leading-none text-[#fff8ef] outline-none md:text-8xl"
            value={service.title}
            placeholder="Service title"
            onChange={(value) => onText({ title: value })}
          />
          <EditableBlock
            className="mt-8 min-h-24 w-full max-w-2xl resize-none bg-transparent text-lg leading-9 text-[#d9d0c9] outline-none"
            value={service.summary}
            placeholder="Short hook summary"
            onChange={(value) => onText({ summary: value })}
          />
          <div className="mt-6 max-w-md">
            <AssetDropzone
              label="Hero image"
              scope="service"
              value={service.imageUrl}
              onChange={onHeroImage}
              onClear={() => onHeroImage("")}
            />
          </div>
        </div>
      </section>

      <div className="grid">
        {order.map((section) => (
          <PreviewSectionFrame
            key={section}
            section={section}
            copy={sectionCopy[section]}
            onCopy={(patch) => onSectionCopy(section, patch)}
            onMoveUp={() => onMoveSection(section, -1)}
            onMoveDown={() => onMoveSection(section, 1)}
          >
            {section === "summary" ? (
              <section className="p-5 md:p-8">
                <div className="mx-auto mb-8 max-w-3xl text-center">
                  <EditableLine
                    className={previewCenteredEyebrowClass}
                    value={sectionCopy.summary.eyebrow}
                    placeholder="Section label"
                    onChange={(value) => onSectionCopy("summary", { eyebrow: value })}
                  />
                  <EditableLine
                    className={previewCenteredTitleClass}
                    value={sectionCopy.summary.title}
                    placeholder="Section title"
                    onChange={(value) => onSectionCopy("summary", { title: value })}
                  />
                  <EditableBlock
                    className={previewCenteredBodyClass}
                    value={sectionCopy.summary.body ?? ""}
                    placeholder="Section description"
                    onChange={(value) => onSectionCopy("summary", { body: value })}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-5">
                  <InfoEditor label="Time" value={surgeryInfo.surgeryTime} onChange={(value) => onSurgeryInfo("surgeryTime", value)} />
                  <InfoEditor label="Anesthesia" value={surgeryInfo.anesthesia} onChange={(value) => onSurgeryInfo("anesthesia", value)} />
                  <InfoEditor label="Visits" value={surgeryInfo.visits} onChange={(value) => onSurgeryInfo("visits", value)} />
                  <InfoEditor label="Aftercare" value={surgeryInfo.aftercareStart} onChange={(value) => onSurgeryInfo("aftercareStart", value)} />
                  <InfoEditor label="Recovery" value={surgeryInfo.recoveryPeriod} onChange={(value) => onSurgeryInfo("recoveryPeriod", value)} />
                </div>
              </section>
            ) : null}

            {section === "recommended" ? (
              <section className="grid gap-8 bg-[#241b18] p-5 md:p-8 xl:grid-cols-[0.8fr_1.2fr]">
                <div>
                  <EditableLine
                    className={previewEyebrowClass}
                    value={sectionCopy.recommended.eyebrow}
                    placeholder="Section label"
                    onChange={(value) => onSectionCopy("recommended", { eyebrow: value })}
                  />
                  <EditableLine
                    className={previewTitleClass}
                    value={sectionCopy.recommended.title}
                    placeholder="Section headline"
                    onChange={(value) => onSectionCopy("recommended", { title: value })}
                  />
                  <EditableBlock
                    className={previewBodyClass}
                    value={sectionCopy.recommended.body ?? ""}
                    placeholder="Explain who this service fits"
                    onChange={(value) => onSectionCopy("recommended", { body: value })}
                  />
                </div>
                <ArrayCards
                  items={service.recommendedFor}
                  onChange={(index, value) => onArrayItem("recommendedFor", index, value)}
                  onAdd={() => onAddArrayItem("recommendedFor")}
                />
                <div className="xl:col-span-2">
                  <InlineEditorPanel title="List card copy">
                    <div className="grid gap-4 lg:grid-cols-3">
                      <InfoEditor label="Recovery" value={service.recovery} onChange={(value) => onText({ recovery: value })} />
                      <InfoEditor label="Duration" value={service.duration} onChange={(value) => onText({ duration: value })} />
                      <div className="glass-panel p-4 lg:col-span-1">
                        <p className="text-xs font-black uppercase text-white/48">Fee note</p>
                        <EditableBlock
                          className="mt-3 min-h-24 w-full resize-none bg-transparent text-sm font-black leading-6 text-white outline-none"
                          value={service.priceNote}
                          onChange={(value) => onText({ priceNote: value })}
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <ArrayCards
                        items={service.process}
                        onChange={(index, value) => onArrayItem("process", index, value)}
                        onAdd={() => onAddArrayItem("process")}
                      />
                    </div>
                  </InlineEditorPanel>
                </div>
              </section>
            ) : null}

            {section === "detailPanels" ? (
              <section className="p-5 md:p-8">
                <div className="mx-auto max-w-3xl text-center">
                  <EditableLine
                    className={previewCenteredEyebrowClass}
                    value={sectionCopy.detailPanels.eyebrow}
                    placeholder="Section label"
                    onChange={(value) => onSectionCopy("detailPanels", { eyebrow: value })}
                  />
                  <EditableLine
                    className={previewCenteredTitleClass}
                    value={sectionCopy.detailPanels.title}
                    placeholder="Section title"
                    onChange={(value) => onSectionCopy("detailPanels", { title: value })}
                  />
                  <EditableBlock
                    className={previewCenteredBodyClass}
                    value={sectionCopy.detailPanels.body ?? ""}
                    placeholder="Section description"
                    onChange={(value) => onSectionCopy("detailPanels", { body: value })}
                  />
                </div>
                <div className="mt-8 grid gap-5 xl:grid-cols-3">
                  {detailPanels.slice(0, 3).map((panel, index) => (
                    <article
                      key={`${panel.title}-${panel.imageUrl}-${index}`}
                      className={`relative overflow-hidden rounded-lg border bg-[#f5f1ea] text-[#151113] shadow-2xl shadow-black/25 transition ${
                        draggingPanelIndex === index
                          ? "scale-[0.98] border-[#d62f55] opacity-70"
                          : "border-[#1f1715]/10"
                      }`}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => {
                        event.preventDefault();
                        if (draggingPanelIndex !== null) {
                          onMovePanel(draggingPanelIndex, index);
                          setDraggingPanelIndex(null);
                        }
                      }}
                      onDragEnd={() => setDraggingPanelIndex(null)}
                    >
                      <div
                        className="absolute right-3 top-3 z-10 flex cursor-grab items-center gap-1 rounded-full border border-[#151113]/10 bg-white/80 px-3 py-2 text-[0.65rem] font-black uppercase tracking-[0.12em] text-[#3b0719]/70 shadow-sm backdrop-blur active:cursor-grabbing"
                        draggable
                        onDragStart={(event) => {
                          event.dataTransfer.effectAllowed = "move";
                          setDraggingPanelIndex(index);
                        }}
                        title="Drag to reorder"
                      >
                        <GripVertical size={13} />
                        Drag
                      </div>
                      <div className="px-6 pt-8 text-center md:px-8">
                        <p className="text-sm font-black tracking-[0.22em] text-[#3b0719]/72">BAKSAL BEAUTY DETAIL</p>
                        <EditableLine
                          className="font-display mt-2 w-full bg-transparent text-center text-6xl font-black text-[#0d0b0c] outline-none"
                          value={panel.eyebrow}
                          onChange={(value) => onPanel(index, { eyebrow: value })}
                        />
                        <EditableLine
                          className="mt-5 w-full bg-transparent text-center text-3xl font-black leading-tight text-[#151113] outline-none md:text-4xl"
                          value={panel.title}
                          onChange={(value) => onPanel(index, { title: value })}
                        />
                        <div className="mx-auto mt-4 h-2 w-40 rounded-full bg-[#dec47b]" />
                        <EditableBlock
                          className="mx-auto mt-5 min-h-28 w-full max-w-sm resize-none bg-transparent text-center text-sm font-bold leading-7 text-[#413936] outline-none"
                          value={panel.body}
                          onChange={(value) => onPanel(index, { body: value })}
                        />
                      </div>
                      <div className="relative mx-5 aspect-[3/4] overflow-hidden rounded border-4 border-[#dec47b] bg-white">
                        {panel.imageUrl ? <Image src={panel.imageUrl} alt={panel.imageAlt} fill sizes="360px" className="object-cover" /> : null}
                        <div className="absolute inset-x-3 bottom-3">
                          <AssetDropzone
                            label={`Panel ${index + 1} image`}
                            scope="service-detail"
                            value={panel.imageUrl}
                            onChange={(imageUrl) => onPanel(index, { imageUrl })}
                            onClear={() => onPanel(index, { imageUrl: "" })}
                            compact
                          />
                        </div>
                      </div>
                      <div className="p-5 pt-3">
                        <EditableLine
                          className="w-full bg-transparent text-xs font-bold text-[#413936]/72 outline-none"
                          value={panel.imageAlt}
                          placeholder="Image alt text"
                          onChange={(value) => onPanel(index, { imageAlt: value })}
                        />
                        <div className="mt-3 grid gap-2">
                          {panel.points.map((point, pointIndex) => (
                            <EditableLine
                              key={`${point}-${pointIndex}`}
                              className="w-full bg-[#0d0b0c]/6 text-xs font-black text-[#151113] outline-none"
                              value={point}
                              placeholder={`Point ${pointIndex + 1}`}
                              onChange={(value) => {
                                const points = [...panel.points];
                                points[pointIndex] = value;
                                onPanel(index, { points });
                              }}
                            />
                          ))}
                          <button
                            className="rounded border border-[#151113]/12 px-3 py-2 text-xs font-black uppercase text-[#151113]/70 transition hover:border-[#d62f55] hover:text-[#d62f55]"
                            onClick={() => onPanel(index, { points: [...panel.points, "New point"] })}
                            type="button"
                          >
                            Add point
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {section === "beforeAfter" ? (
              <section className="grid gap-8 bg-[#120d0e] p-5 md:p-8 xl:grid-cols-[0.8fr_1.2fr] xl:items-center">
                <div>
                  <EditableLine
                    className={previewEyebrowClass}
                    value={sectionCopy.beforeAfter.eyebrow}
                    placeholder="Section label"
                    onChange={(value) => onSectionCopy("beforeAfter", { eyebrow: value })}
                  />
                  <EditableLine
                    className={previewTitleClass}
                    value={sectionCopy.beforeAfter.title}
                    onChange={(value) => {
                      onSectionCopy("beforeAfter", { title: value });
                      onBeforeAfter("title", value);
                    }}
                  />
                  <EditableBlock
                    className={previewBodyClass}
                    value={sectionCopy.beforeAfter.body ?? ""}
                    onChange={(value) => {
                      onSectionCopy("beforeAfter", { body: value });
                      onBeforeAfter("body", value);
                    }}
                  />
                </div>
                <div className="grid aspect-[4/3] grid-cols-2 overflow-hidden rounded-md border border-white/10 bg-black">
                  <EditablePreviewImage
                    src={beforeAfter.beforeImageUrl}
                    alt={beforeAfter.beforeAlt}
                    label="Before"
                    scope="service-before-after"
                    onImage={(imageUrl) => onBeforeAfter("beforeImageUrl", imageUrl)}
                    onAlt={(value) => onBeforeAfter("beforeAlt", value)}
                  />
                  <EditablePreviewImage
                    src={beforeAfter.afterImageUrl}
                    alt={beforeAfter.afterAlt}
                    label="After"
                    scope="service-before-after"
                    onImage={(imageUrl) => onBeforeAfter("afterImageUrl", imageUrl)}
                    onAlt={(value) => onBeforeAfter("afterAlt", value)}
                  />
                </div>
              </section>
            ) : null}

            {section === "richImages" ? (
              <section className="p-5 md:p-8">
                <div className="mx-auto max-w-3xl text-center">
                  <EditableLine
                    className={previewCenteredEyebrowClass}
                    value={sectionCopy.richImages.eyebrow}
                    placeholder="Section label"
                    onChange={(value) => onSectionCopy("richImages", { eyebrow: value })}
                  />
                  <EditableLine
                    className={previewCenteredTitleClass}
                    value={sectionCopy.richImages.title}
                    placeholder="Section title"
                    onChange={(value) => onSectionCopy("richImages", { title: value })}
                  />
                  <EditableBlock
                    className={previewCenteredBodyClass}
                    value={sectionCopy.richImages.body ?? ""}
                    placeholder="Section description"
                    onChange={(value) => onSectionCopy("richImages", { body: value })}
                  />
                </div>
                <div className="mx-auto mt-8 max-w-3xl">
                  <AssetDropzone
                    label="Add long detail image"
                    scope="service-rich-details"
                    value=""
                    onChange={(imageUrl) => onAddRichImage(imageUrl)}
                  />
                </div>
                <div className="mx-auto mt-8 grid max-w-5xl gap-5">
                  {richImages.map((image, index) => (
                    <figure
                      key={`${image.imageUrl}-${index}`}
                      onDragEnter={() => {
                        if (draggingRichIndex !== null && draggingRichIndex !== index) {
                          setRichDropIndex(index);
                        }
                      }}
                      onDragOver={(event) => {
                        event.preventDefault();
                        event.dataTransfer.dropEffect = "move";

                        if (event.clientY < 96) {
                          window.scrollBy(0, -24);
                        } else if (window.innerHeight - event.clientY < 96) {
                          window.scrollBy(0, 24);
                        }

                        if (draggingRichIndex !== null && draggingRichIndex !== index) {
                          setRichDropIndex(index);
                        }
                      }}
                      onDrop={(event) => {
                        event.preventDefault();
                        if (draggingRichIndex !== null && draggingRichIndex !== index) {
                          onMoveRichImage(draggingRichIndex, index);
                        }
                        setDraggingRichIndex(null);
                        setRichDropIndex(null);
                      }}
                      onDragLeave={(event) => {
                        const nextTarget = event.relatedTarget;

                        if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) {
                          return;
                        }

                        if (richDropIndex === index) {
                          setRichDropIndex(null);
                        }
                      }}
                      className={`relative overflow-hidden rounded-md border bg-[#0d0b0c] transition ${
                        draggingRichIndex === index
                          ? "scale-[0.99] border-[#d62f55] opacity-70"
                          : richDropIndex === index
                            ? "border-[#dec47b] ring-2 ring-[#dec47b]/35"
                            : "border-white/10"
                      }`}
                    >
                      <div className="sticky top-36 z-10 flex flex-col gap-3 border-b border-white/10 bg-[#0d0b0c]/96 p-3 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-3">
                          <button
                            className="grid h-9 w-9 shrink-0 cursor-grab place-items-center rounded-full border border-white/10 bg-white/[0.04] text-[#dec47b] transition hover:border-[#dec47b]/60 active:cursor-grabbing"
                            draggable
                            onDragStart={(event) => {
                              event.dataTransfer.effectAllowed = "move";
                              event.dataTransfer.setData("text/plain", String(index));
                              setDraggingRichIndex(index);
                              setRichDropIndex(null);
                            }}
                            onDragEnd={() => {
                              setDraggingRichIndex(null);
                              setRichDropIndex(null);
                            }}
                            type="button"
                            title="Drag image"
                            aria-label="Drag image to reorder"
                          >
                            <GripVertical size={17} />
                          </button>
                          <EditableLine
                            className="w-full bg-transparent text-sm font-black text-white outline-none"
                            value={image.title}
                            placeholder={`Detail image ${index + 1}`}
                            onChange={(value) => onRichImage(index, { title: value })}
                          />
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            className="social-action-button !h-9 !w-9 disabled:cursor-not-allowed disabled:opacity-35"
                            disabled={index === 0}
                            onClick={() => onMoveRichImage(index, index - 1)}
                            type="button"
                            title="Move image up"
                          >
                            <ArrowUp size={15} />
                          </button>
                          <button
                            className="social-action-button !h-9 !w-9 disabled:cursor-not-allowed disabled:opacity-35"
                            disabled={index === richImages.length - 1}
                            onClick={() => onMoveRichImage(index, index + 1)}
                            type="button"
                            title="Move image down"
                          >
                            <ArrowDown size={15} />
                          </button>
                          <button className="social-action-button !h-9 !w-9" onClick={() => onRemoveRichImage(index)} type="button" title="Delete image">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                      {image.imageUrl ? (
                        <Image src={image.imageUrl} alt={image.imageAlt} width={1080} height={1640} className="h-auto w-full object-contain" />
                      ) : null}
                      <div className="grid gap-3 p-3 md:grid-cols-[1fr_2fr]">
                        <AssetDropzone
                          label="Replace image"
                          scope="service-rich-details"
                          value={image.imageUrl}
                          onChange={(imageUrl) => onRichImage(index, { imageUrl })}
                          onClear={() => onRemoveRichImage(index)}
                          compact
                        />
                        <EditableLine
                          className="w-full bg-white/[0.04] text-xs font-bold text-white/72 outline-none"
                          value={image.imageAlt}
                          placeholder="Image alt text"
                          onChange={(value) => onRichImage(index, { imageAlt: value })}
                        />
                      </div>
                    </figure>
                  ))}
                </div>
              </section>
            ) : null}

            {section === "videos" ? (
              <section className="bg-[#241b18] p-5 md:p-8">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <EditableLine
                      className={previewEyebrowClass}
                      value={sectionCopy.videos.eyebrow}
                      placeholder="Section label"
                      onChange={(value) => onSectionCopy("videos", { eyebrow: value })}
                    />
                    <EditableLine
                      className={previewTitleClass}
                      value={sectionCopy.videos.title}
                      placeholder="Section title"
                      onChange={(value) => onSectionCopy("videos", { title: value })}
                    />
                    <EditableBlock
                      className={`${previewBodyClass} max-w-2xl`}
                      value={sectionCopy.videos.body ?? ""}
                      placeholder="Section description"
                      onChange={(value) => onSectionCopy("videos", { body: value })}
                    />
                  </div>
                  <button className="button-outline !h-10 px-4 text-xs" onClick={onAddVideo} type="button">
                    <Plus size={14} />
                    Add Video
                  </button>
                </div>
                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  {(service.youtubeVideos ?? []).map((video, index) => (
                    <article key={`${video.title}-${index}`} className="glass-panel overflow-hidden">
                      <EditablePreviewImage
                        src={video.thumbnailUrl || service.imageUrl}
                        alt={video.title}
                        label="Thumbnail"
                        scope="service-video"
                        aspect="aspect-video"
                        onImage={(thumbnailUrl) => onVideo(index, { thumbnailUrl })}
                        onAlt={(title) => onVideo(index, { title })}
                      />
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <EditableLine
                            className="w-full bg-transparent text-xl font-black text-white outline-none"
                            value={video.title}
                            placeholder="Video title"
                            onChange={(value) => onVideo(index, { title: value })}
                          />
                          <button className="social-action-button !h-9 !w-9" onClick={() => onRemoveVideo(index)} type="button" title="Delete video">
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <EditableBlock
                          className="mt-2 min-h-20 w-full resize-none bg-transparent text-sm leading-7 text-[#d9d0c9] outline-none"
                          value={video.description}
                          placeholder="Video description"
                          onChange={(value) => onVideo(index, { description: value })}
                        />
                        <EditableLine
                          className="mt-3 w-full bg-white/[0.04] text-xs font-bold text-white/62 outline-none"
                          value={video.videoId}
                          placeholder="YouTube video ID"
                          onChange={(value) => onVideo(index, { videoId: value })}
                        />
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {section === "detailCta" ? (
              <section className="grid gap-8 p-5 md:p-8 xl:grid-cols-[0.85fr_1.15fr]">
                <article className="glass-panel p-7">
                  <EditableLine
                    className={previewEyebrowClass}
                    value={sectionCopy.detailCta.eyebrow}
                    placeholder="Section label"
                    onChange={(value) => onSectionCopy("detailCta", { eyebrow: value })}
                  />
                  <EditableLine
                    className="font-display mt-4 w-full bg-transparent text-5xl leading-tight text-[#fff8ef] outline-none"
                    value={sectionCopy.detailCta.title}
                    onChange={(value) => {
                      onSectionCopy("detailCta", { title: value });
                      onDetailCta("title", value);
                    }}
                  />
                  <EditableBlock
                    className={previewBodyClass}
                    value={sectionCopy.detailCta.body ?? ""}
                    onChange={(value) => {
                      onSectionCopy("detailCta", { body: value });
                      onDetailCta("body", value);
                    }}
                  />
                </article>
                <ArrayCards
                  items={service.highlights}
                  onChange={(index, value) => onArrayItem("highlights", index, value)}
                  onAdd={() => onAddArrayItem("highlights")}
                />
              </section>
            ) : null}
          </PreviewSectionFrame>
        ))}
      </div>
    </div>
  );
}

function PreviewSectionFrame({
  section,
  copy,
  onCopy,
  onMoveUp,
  onMoveDown,
  children,
}: {
  section: ServiceDetailSectionId;
  copy: ServiceSectionCopy;
  onCopy: (patch: Partial<ServiceSectionCopy>) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative border-b border-white/10">
      <div className="sticky top-24 z-20 flex items-center justify-between gap-3 border-b border-white/10 bg-[#0d0b0c]/88 px-4 py-2 backdrop-blur">
        <EditableLine
          className="w-full bg-transparent text-xs font-black uppercase tracking-[0.14em] text-[#dec47b] outline-none"
          value={copy.eyebrow || sectionLabels[section]}
          placeholder={sectionLabels[section]}
          onChange={(value) => onCopy({ eyebrow: value })}
        />
        <div className="flex gap-1">
          <button className="social-action-button !h-8" onClick={onMoveUp} type="button" title="Move up">
            <ArrowUp size={14} />
          </button>
          <button className="social-action-button !h-8" onClick={onMoveDown} type="button" title="Move down">
            <ArrowDown size={14} />
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}

function InfoEditor({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="glass-panel min-h-32 p-4">
      <p className="text-xs font-black uppercase text-white/48">{label}</p>
      <EditableLine className="mt-3 w-full bg-transparent text-sm font-black leading-6 text-white outline-none" value={value} onChange={onChange} />
    </div>
  );
}

function ArrayCards({
  items,
  onChange,
  onAdd,
}: {
  items: string[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item, index) => (
        <div key={`${item}-${index}`} className="glass-panel p-5">
          <p className="font-display text-3xl text-[#dec47b]">{String(index + 1).padStart(2, "0")}</p>
          <EditableBlock
            className="mt-3 min-h-24 w-full resize-none bg-transparent text-sm font-bold leading-7 text-white/78 outline-none"
            value={item}
            onChange={(value) => onChange(index, value)}
          />
        </div>
      ))}
      <button className="glass-panel grid min-h-32 place-items-center border-dashed text-sm font-black text-white/58 hover:text-[#dec47b]" onClick={onAdd} type="button">
        <Plus size={18} />
        Add Point
      </button>
    </div>
  );
}

function InlineEditorPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#0d0b0c]/52 p-4">
      <p className="mb-4 text-xs font-black uppercase tracking-[0.14em] text-[#dec47b]">{title}</p>
      {children}
    </div>
  );
}

function EditablePreviewImage({
  src,
  alt,
  label,
  scope,
  onImage,
  onAlt,
  aspect = "aspect-auto",
}: {
  src: string;
  alt: string;
  label: string;
  scope: string;
  onImage: (imageUrl: string) => void;
  onAlt: (value: string) => void;
  aspect?: string;
}) {
  return (
    <div className={`relative min-h-64 overflow-hidden bg-black ${aspect}`}>
      {src ? <Image src={src} alt={alt || label} fill sizes="50vw" className="object-cover opacity-82" /> : null}
      <span className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1 text-xs font-black text-white backdrop-blur">
        {label}
      </span>
      <div className="absolute inset-x-3 bottom-3 grid gap-2">
        <AssetDropzone
          label={`${label} image`}
          scope={scope}
          value={src}
          onChange={onImage}
          onClear={() => onImage("")}
          compact
        />
        <EditableLine
          className="w-full bg-black/45 text-xs font-bold text-white/78 outline-none backdrop-blur"
          value={alt}
          placeholder={`${label} alt text`}
          onChange={onAlt}
        />
      </div>
    </div>
  );
}
