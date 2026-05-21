"use client";

import Image from "next/image";
import Link from "next/link";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Eye, Globe2, GripVertical, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  emptyBlogPost,
  getEmptyBlogBlock,
  type BlogContentBlock,
  type BlogContentBlockType,
  type BlogPost,
  type BlogStatus,
} from "@/data/blog-content";
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
import { fetchJson, splitComma, type ListResponse } from "../_components/admin-types";

const previewEyebrowClass = "eyebrow w-full bg-transparent text-[#dec47b] outline-none";

export function BlogAdminPanel({ initialLocale }: { initialLocale: Locale }) {
  const [blogLocale, setBlogLocale] = useState<Locale>(initialLocale);
  const queryClient = useQueryClient();
  const blogQuery = useQuery({
    queryKey: ["admin-blog", blogLocale],
    queryFn: () => fetchJson<ListResponse<BlogPost>>("/api/admin/blog-posts?locale=" + blogLocale),
  });

  return (
    <BlogStudioPanel
      locale={blogLocale}
      onLocaleChange={setBlogLocale}
      items={blogQuery.data?.items ?? []}
      source={blogQuery.data?.source}
      loading={blogQuery.isLoading}
      onChanged={() => queryClient.invalidateQueries({ queryKey: ["admin-blog"] })}
    />
  );
}

function createBlankBlogDraft(): BlogStudioDraft {
  return {
    base: { ...emptyBlogPost, id: "", status: "draft" },
    localized: locales.reduce(
      (acc, item) => {
        acc[item] = { ...emptyBlogPost, id: "", locale: item, contentBlocks: [] };
        return acc;
      },
      {} as Record<Locale, Partial<BlogPost>>,
    ),
  };
}

function createBlogStudioDraft(
  id: string,
  postsByLocale: Record<Locale, BlogPost[]>,
  canonicalItems: BlogPost[],
): BlogStudioDraft {
  const canonical =
    canonicalItems.find((item) => item.id === id || item.slug === id) ??
    Object.values(postsByLocale)
      .flat()
      .find((item) => item.id === id || item.slug === id) ??
    emptyBlogPost;
  const localized = locales.reduce(
    (acc, item) => {
      const localizedItem = postsByLocale[item].find((post) => post.id === canonical.id || post.slug === canonical.slug);
      acc[item] = cloneBlogPost(localizedItem ?? canonical);
      return acc;
    },
    {} as Record<Locale, Partial<BlogPost>>,
  );

  return {
    base: {
      id: canonical.id,
      slug: canonical.slug,
      category: canonical.category,
      status: canonical.status,
      imageUrl: canonical.imageUrl,
      imageAlt: canonical.imageAlt,
      tags: [...canonical.tags],
      featured: canonical.featured,
      sortOrder: canonical.sortOrder,
      authorName: canonical.authorName,
      publishedAt: canonical.publishedAt,
    },
    localized,
  };
}

function cloneBlogPost(post: Partial<BlogPost>): Partial<BlogPost> {
  return {
    ...post,
    tags: [...(post.tags ?? [])],
    contentBlocks: (post.contentBlocks ?? []).map((block) => ({ ...block })),
  };
}

function mergeBlogDraft(draft: BlogStudioDraft, locale: Locale): BlogPost {
  const base = draft.base;
  const fallback = draft.localized.ko ?? {};
  const localized = draft.localized[locale] ?? {};

  return {
    ...emptyBlogPost,
    ...fallback,
    ...localized,
    id: String(base.id ?? ""),
    slug: String(base.slug ?? localized.slug ?? fallback.slug ?? ""),
    category: String(base.category ?? localized.category ?? fallback.category ?? "Aesthetic Medicine"),
    status: (base.status ?? "draft") as BlogStatus,
    imageUrl: String(base.imageUrl ?? localized.imageUrl ?? fallback.imageUrl ?? ""),
    imageAlt: String(localized.imageAlt ?? fallback.imageAlt ?? base.imageAlt ?? localized.title ?? fallback.title ?? ""),
    tags: [...(base.tags ?? localized.tags ?? fallback.tags ?? [])],
    featured: Boolean(base.featured),
    sortOrder: Number(base.sortOrder ?? 100),
    authorName: String(base.authorName ?? "BAKSAL BEAUTY"),
    publishedAt: base.publishedAt ?? localized.publishedAt ?? fallback.publishedAt ?? null,
    locale,
    title: String(localized.title ?? fallback.title ?? ""),
    excerpt: String(localized.excerpt ?? fallback.excerpt ?? ""),
    contentBlocks: (localized.contentBlocks?.length ? localized.contentBlocks : fallback.contentBlocks ?? []).map((block) => ({ ...block })),
    seoTitle: String(localized.seoTitle ?? fallback.seoTitle ?? localized.title ?? fallback.title ?? ""),
    seoDescription: String(localized.seoDescription ?? fallback.seoDescription ?? localized.excerpt ?? fallback.excerpt ?? ""),
  };
}

function createBlogPayload(draft: BlogStudioDraft, locale: Locale, status: BlogStatus): BlogPost {
  const post = mergeBlogDraft({ ...draft, base: { ...draft.base, status } }, locale);

  return {
    ...post,
    locale,
    slug: post.slug || slugifyLocal(post.title || "blog-post"),
    imageAlt: post.imageAlt || post.title,
    seoTitle: post.seoTitle || post.title,
    seoDescription: post.seoDescription || post.excerpt,
  };
}

function slugifyLocal(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90) || "blog-post";
}

type BlogStudioDraft = {
  base: Partial<BlogPost>;
  localized: Record<Locale, Partial<BlogPost>>;
};

export function BlogStudioPanel({
  locale,
  onLocaleChange,
  items,
  source,
  loading,
  onChanged,
}: {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  items: BlogPost[];
  source?: "database" | "fallback";
  loading: boolean;
  onChanged: () => void;
}) {
  const queryClient = useQueryClient();
  const [activeLocale, setActiveLocale] = useState<Locale>(locale);
  const [draft, setDraft] = useState<BlogStudioDraft | null>(null);
  const [notice, setNotice] = useState("");
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" | "info" } | null>(null);
  const localeQueries = useQueries({
    queries: locales.map((item) => ({
      queryKey: ["admin-blog", item],
      queryFn: () => fetchJson<ListResponse<BlogPost>>(`/api/admin/blog-posts?locale=${item}`),
    })),
  });
  const postsByLocale = useMemo(() => {
    return locales.reduce(
      (acc, item, index) => {
        acc[item] = localeQueries[index]?.data?.items ?? (item === locale ? items : []);
        return acc;
      },
      {} as Record<Locale, BlogPost[]>,
    );
  }, [items, locale, localeQueries]);
  const canonicalItems = postsByLocale.ko.length ? postsByLocale.ko : items;
  const current = draft ? mergeBlogDraft(draft, activeLocale) : null;
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
    mutationFn: async ({ mode, locale: saveLocale }: { mode: BlogStatus; locale: Locale }) => {
      if (!draft) {
        throw new Error("Select a blog post first.");
      }

      const payload = createBlogPayload(draft, saveLocale, mode);
      const method = payload.id ? "PATCH" : "POST";
      const url = payload.id ? `/api/admin/blog-posts/${payload.id}` : "/api/admin/blog-posts";

      return fetchJson<{ id: string }>(url, { method, body: JSON.stringify(payload) });
    },
    onSuccess: async (result) => {
      if (result.id) {
        setDraft((currentDraft) =>
          currentDraft ? { ...currentDraft, base: { ...currentDraft.base, id: result.id } } : currentDraft,
        );
      }
      showToast(`${localeLabels[activeLocale]} 블로그 글이 저장되었습니다.`);
      await queryClient.invalidateQueries({ queryKey: ["admin-blog"] });
      onChanged();
    },
    onError: (error) => showToast(error instanceof Error ? error.message : "블로그 저장에 실패했습니다.", "error"),
  });
  const saveAllMutation = useMutation({
    mutationFn: async (mode: BlogStatus) => {
      if (!draft) {
        throw new Error("Select a blog post first.");
      }

      let postId = String(draft.base.id ?? "");

      if (!postId) {
        const created = await fetchJson<{ id: string }>("/api/admin/blog-posts", {
          method: "POST",
          body: JSON.stringify(createBlogPayload(draft, activeLocale, mode)),
        });
        postId = created.id;
      }

      const draftWithId: BlogStudioDraft = {
        ...draft,
        base: { ...draft.base, id: postId },
      };

      await Promise.all(
        locales.map((item) =>
          fetchJson(`/api/admin/blog-posts/${postId}`, {
            method: "PATCH",
            body: JSON.stringify(createBlogPayload(draftWithId, item, mode)),
          }),
        ),
      );

      return { id: postId };
    },
    onSuccess: async (result) => {
      if (result.id) {
        setDraft((currentDraft) =>
          currentDraft ? { ...currentDraft, base: { ...currentDraft.base, id: result.id } } : currentDraft,
        );
      }
      showToast("전체 언어 블로그 글이 저장되었습니다.");
      await queryClient.invalidateQueries({ queryKey: ["admin-blog"] });
      onChanged();
    },
    onError: (error) => showToast(error instanceof Error ? error.message : "전체 저장에 실패했습니다.", "error"),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetchJson(`/api/admin/blog-posts/${id}`, { method: "DELETE" }),
    onSuccess: async () => {
      setDraft(null);
      showToast("블로그 글이 삭제되었습니다.", "info");
      await queryClient.invalidateQueries({ queryKey: ["admin-blog"] });
      onChanged();
    },
    onError: (error) => showToast(error instanceof Error ? error.message : "삭제에 실패했습니다.", "error"),
  });

  function startNewPost() {
    setDraft(createBlankBlogDraft());
  }

  function selectPost(id: string) {
    setDraft(createBlogStudioDraft(id, postsByLocale, canonicalItems));
  }

  function updateBase(patch: Partial<BlogPost>) {
    setDraft((currentDraft) => (currentDraft ? { ...currentDraft, base: { ...currentDraft.base, ...patch } } : currentDraft));
  }

  function updateActive(patch: Partial<BlogPost>) {
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

  function updateBlock(index: number, patch: Partial<BlogContentBlock>) {
    if (!current) {
      return;
    }

    const contentBlocks = [...current.contentBlocks];
    contentBlocks[index] = { ...contentBlocks[index], ...patch };
    updateActive({ contentBlocks });
  }

  function addBlock(type: BlogContentBlockType) {
    updateActive({ contentBlocks: [...(current?.contentBlocks ?? []), getEmptyBlogBlock(type)] });
  }

  function removeBlock(index: number) {
    updateActive({ contentBlocks: (current?.contentBlocks ?? []).filter((_, itemIndex) => itemIndex !== index) });
  }

  function moveBlock(fromIndex: number, toIndex: number) {
    const contentBlocks = [...(current?.contentBlocks ?? [])];

    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= contentBlocks.length || toIndex >= contentBlocks.length) {
      return;
    }

    const [moved] = contentBlocks.splice(fromIndex, 1);
    contentBlocks.splice(toIndex, 0, moved);
    updateActive({ contentBlocks });
  }

  if (!current || !draft) {
    return (
      <CrudShell
        title="BLOG"
        source={source}
        loading={loading || isFetchingLocales}
        notice={notice}
        action={<button className="button-outline" onClick={startNewPost} type="button">New Blog Post</button>}
      >
        <div className="glass-panel grid min-h-[24rem] gap-6 p-6 text-[#d9d0c9] lg:grid-cols-[0.55fr_1fr]">
          <div className="grid place-items-center rounded-md border border-white/10 bg-white/[0.025] p-8 text-center">
            <div>
              <p className="eyebrow text-[#dec47b]">Blog Studio</p>
              <p className="mt-4 text-lg font-bold">게시글을 선택하거나 새 블로그 글을 작성해주세요.</p>
            </div>
          </div>
          <BlogPostList items={canonicalItems} currentId="" onSelect={selectPost} />
        </div>
        <AdminToast toast={toast} onClose={() => setToast(null)} />
      </CrudShell>
    );
  }

  return (
    <CrudShell
      title="BLOG"
      source={source}
      loading={loading || isFetchingLocales}
      notice={notice}
      action={
        <div className="flex flex-wrap gap-2">
          <button className="button-outline" onClick={startNewPost} type="button">New Blog Post</button>
          {current.id ? (
            <Link className="button-outline" href={`/${activeLocale}/blog/${current.slug}`} target="_blank">
              <Eye size={15} /> Live
            </Link>
          ) : null}
          {current.id ? (
            <button className="button-outline" disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate(current.id)} type="button">
              {deleteMutation.isPending ? <Loader2 className="animate-spin" size={15} /> : <Trash2 size={15} />}
              Delete
            </button>
          ) : null}
        </div>
      }
    >
      <div className="grid gap-4 2xl:grid-cols-[280px_minmax(0,1fr)_360px]">
        <aside className="glass-panel h-fit p-3 2xl:sticky 2xl:top-28">
          <div className="border-b border-white/10 p-3">
            <p className="eyebrow text-[#dec47b]">Posts</p>
            <p className="mt-2 text-sm font-black text-white/72">{canonicalItems.length} posts</p>
          </div>
          <BlogPostList items={canonicalItems} currentId={current.id} onSelect={selectPost} />
        </aside>

        <div className="min-w-0">
          <div className="glass-panel mb-4 flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="eyebrow text-[#dec47b]">Visual Blog Editor</p>
              <p className="mt-2 text-sm leading-6 text-[#d9d0c9]">
                텍스트와 이미지를 블록 단위로 조합해 실제 글 화면에 가까운 형태로 편집합니다.
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

          <BlogVisualEditor
            post={current}
            onText={updateActive}
            onBase={updateBase}
            onBlock={updateBlock}
            onAddBlock={addBlock}
            onRemoveBlock={removeBlock}
            onMoveBlock={moveBlock}
          />
        </div>

        <aside className="glass-panel h-fit p-4 2xl:sticky 2xl:top-28">
          <div className="flex items-center gap-2 border-b border-white/10 pb-4">
            <Globe2 size={17} className="text-[#dec47b]" />
            <div>
              <p className="text-sm font-black text-white">{localeLabels[activeLocale]} Blog Content</p>
              <p className="text-xs text-white/52">공통 설정과 SEO, 저장 상태</p>
            </div>
          </div>
          <div className="mt-4 grid gap-4">
            <Field label="Slug" value={draft.base.slug ?? ""} onChange={(value) => updateBase({ slug: value })} />
            <Field label="Category" value={draft.base.category ?? ""} onChange={(value) => updateBase({ category: value })} />
            <Field label="Author" value={draft.base.authorName ?? "BAKSAL BEAUTY"} onChange={(value) => updateBase({ authorName: value })} />
            <Field label="Sort Order" value={draft.base.sortOrder ?? 100} onChange={(value) => updateBase({ sortOrder: Number(value) || 100 })} />
            <Select
              label="Status"
              value={draft.base.status ?? "draft"}
              options={["published", "draft", "archived"]}
              onChange={(value) => updateBase({ status: value as BlogStatus })}
            />
            <label className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-black uppercase text-white/62">
              Featured
              <input
                type="checkbox"
                checked={Boolean(draft.base.featured)}
                onChange={(event) => updateBase({ featured: event.target.checked })}
              />
            </label>
            <Field label="Tags" value={(draft.base.tags ?? []).join(", ")} onChange={(value) => updateBase({ tags: splitComma(value) })} />
            <UploadField label="Hero / Thumbnail Image" value={draft.base.imageUrl ?? ""} scope="blog" onChange={(imageUrl) => updateBase({ imageUrl })} />
            <EditorDivider title="SEO" />
            <Field label="SEO Title" value={current.seoTitle} onChange={(value) => updateActive({ seoTitle: value })} />
            <Textarea label="SEO Description" value={current.seoDescription} onChange={(value) => updateActive({ seoDescription: value })} />
            <EditorDivider title="Save" />
            <button className="button-primary w-full min-w-0 px-3 text-[0.68rem] tracking-[0.08em]" disabled={saveMutation.isPending} onClick={() => saveMutation.mutate({ mode: (draft.base.status as BlogStatus) || "draft", locale: activeLocale })} type="button">
              {saveMutation.isPending ? <Loader2 className="animate-spin" size={15} /> : <Save size={15} />}
              Save Current
            </button>
            <button className="button-outline w-full min-w-0 px-3 text-[0.68rem] tracking-[0.08em]" disabled={saveAllMutation.isPending} onClick={() => saveAllMutation.mutate((draft.base.status as BlogStatus) || "draft")} type="button">
              {saveAllMutation.isPending ? <Loader2 className="animate-spin" size={15} /> : <Save size={15} />}
              Save All
            </button>
          </div>
        </aside>
      </div>
      <AdminToast toast={toast} onClose={() => setToast(null)} />
    </CrudShell>
  );
}

function BlogPostList({
  items,
  currentId,
  onSelect,
}: {
  items: BlogPost[];
  currentId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="mt-3 grid max-h-[calc(100svh-13rem)] gap-2 overflow-y-auto pr-1">
      {items.map((item) => (
        <button
          key={item.id}
          className={`grid grid-cols-[72px_minmax(0,1fr)] items-center gap-3 rounded-md border p-2 text-left transition ${
            currentId === item.id
              ? "border-[#d62f55] bg-[#d62f55]/16"
              : "border-white/10 bg-white/[0.025] hover:border-[#dec47b]/45"
          }`}
          onClick={() => onSelect(item.id)}
          type="button"
        >
          <div className="relative aspect-square overflow-hidden rounded bg-black/35">
            {item.imageUrl ? <Image src={item.imageUrl} alt={item.imageAlt || item.title} fill sizes="260px" className="object-cover" /> : null}
          </div>
          <div className="min-w-0">
            <p className="line-clamp-2 text-sm font-black leading-5 text-white">{item.title}</p>
            <div className="mt-2 flex min-w-0 items-center justify-between gap-2">
              <p className="shrink-0 text-[0.66rem] font-bold uppercase text-[#dec47b]">{item.status}</p>
              <p className="truncate text-[0.66rem] font-bold text-white/42">{item.category}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function BlogVisualEditor({
  post,
  onText,
  onBase,
  onBlock,
  onAddBlock,
  onRemoveBlock,
  onMoveBlock,
}: {
  post: BlogPost;
  onText: (patch: Partial<BlogPost>) => void;
  onBase: (patch: Partial<BlogPost>) => void;
  onBlock: (index: number, patch: Partial<BlogContentBlock>) => void;
  onAddBlock: (type: BlogContentBlockType) => void;
  onRemoveBlock: (index: number) => void;
  onMoveBlock: (fromIndex: number, toIndex: number) => void;
}) {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-[#1f1715]">
      <section className="relative min-h-[30rem] overflow-hidden border-b border-white/10">
        {post.imageUrl ? <Image src={post.imageUrl} alt={post.imageAlt || post.title} fill sizes="100vw" className="object-cover opacity-60" /> : null}
        <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-[#3b0719]/52 to-black/50" />
        <div className="relative z-10 flex min-h-[30rem] max-w-5xl flex-col justify-end p-6 md:p-10">
          <EditableLine className={previewEyebrowClass} value={post.category} onChange={(value) => onBase({ category: value })} />
          <EditableLine
            className="font-display mt-5 w-full max-w-4xl bg-transparent text-6xl leading-none text-[#fff8ef] outline-none md:text-8xl"
            value={post.title}
            placeholder="Blog title"
            onChange={(value) => onText({ title: value, seoTitle: value })}
          />
          <EditableBlock
            className="mt-8 min-h-24 w-full max-w-2xl resize-none bg-transparent text-lg leading-9 text-[#d9d0c9] outline-none"
            value={post.excerpt}
            placeholder="Lead excerpt"
            onChange={(value) => onText({ excerpt: value, seoDescription: value })}
          />
          <div className="mt-6 max-w-md">
            <AssetDropzone label="Hero image" scope="blog" value={post.imageUrl} onChange={(imageUrl) => onBase({ imageUrl })} onClear={() => onBase({ imageUrl: "" })} />
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#0d0b0c] p-4">
        <div className="flex flex-wrap gap-2">
          {(["heading", "paragraph", "image", "quote", "callout", "divider"] as BlogContentBlockType[]).map((type) => (
            <button key={type} className="button-outline !h-10 px-4 text-xs" onClick={() => onAddBlock(type)} type="button">
              <Plus size={14} />
              {type}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-5 p-5 md:p-8">
        {post.contentBlocks.map((block, index) => (
          <BlogBlockEditor
            key={block.id}
            block={block}
            index={index}
            total={post.contentBlocks.length}
            draggingIndex={draggingIndex}
            onDragStart={() => setDraggingIndex(index)}
            onDrop={() => {
              if (draggingIndex !== null) {
                onMoveBlock(draggingIndex, index);
              }
              setDraggingIndex(null);
            }}
            onDragEnd={() => setDraggingIndex(null)}
            onChange={(patch) => onBlock(index, patch)}
            onRemove={() => onRemoveBlock(index)}
            onMoveUp={() => onMoveBlock(index, index - 1)}
            onMoveDown={() => onMoveBlock(index, index + 1)}
          />
        ))}
        {!post.contentBlocks.length ? (
          <div className="rounded-lg border border-dashed border-white/10 p-10 text-center text-[#d9d0c9]">
            <p className="eyebrow text-[#dec47b]">Empty Article</p>
            <p className="mt-4 text-sm font-bold">위 버튼으로 제목, 본문, 이미지 블록을 추가하세요.</p>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function BlogBlockEditor({
  block,
  index,
  total,
  draggingIndex,
  onDragStart,
  onDrop,
  onDragEnd,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  block: BlogContentBlock;
  index: number;
  total: number;
  draggingIndex: number | null;
  onDragStart: () => void;
  onDrop: () => void;
  onDragEnd: () => void;
  onChange: (patch: Partial<BlogContentBlock>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <article
      className={`rounded-lg border bg-[#0d0b0c] transition ${
        draggingIndex === index ? "scale-[0.99] border-[#d62f55] opacity-70" : "border-white/10"
      }`}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        onDrop();
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-3">
        <div className="flex items-center gap-3">
          <button
            className="grid h-9 w-9 cursor-grab place-items-center rounded-full border border-white/10 bg-white/[0.04] text-[#dec47b] active:cursor-grabbing"
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            type="button"
            title="Drag block"
          >
            <GripVertical size={17} />
          </button>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#dec47b]">
            {String(index + 1).padStart(2, "0")} / {block.type}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button className="social-action-button !h-9 !w-9 disabled:opacity-35" disabled={index === 0} onClick={onMoveUp} type="button" title="Move up">
            <ArrowUp size={15} />
          </button>
          <button className="social-action-button !h-9 !w-9 disabled:opacity-35" disabled={index === total - 1} onClick={onMoveDown} type="button" title="Move down">
            <ArrowDown size={15} />
          </button>
          <button className="social-action-button !h-9 !w-9" onClick={onRemove} type="button" title="Delete block">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
      <div className="p-5">
        {block.type === "heading" ? (
          <div>
            <div className="mb-4 flex gap-2">
              {[2, 3].map((level) => (
                <button
                  key={level}
                  className={`rounded-full border px-3 py-1 text-xs font-black ${
                    block.level === level ? "border-[#dec47b] text-[#dec47b]" : "border-white/10 text-white/52"
                  }`}
                  onClick={() => onChange({ level: level as 2 | 3 })}
                  type="button"
                >
                  H{level}
                </button>
              ))}
            </div>
            <EditableLine
              className={`${block.level === 3 ? "text-4xl" : "text-5xl md:text-6xl"} font-display w-full bg-transparent leading-tight text-[#fff8ef] outline-none`}
              value={block.content ?? ""}
              placeholder="Heading"
              onChange={(value) => onChange({ content: value })}
            />
          </div>
        ) : null}

        {block.type === "paragraph" ? (
          <EditableBlock
            className="min-h-32 w-full resize-y bg-transparent text-lg leading-9 text-[#d9d0c9] outline-none"
            value={block.content ?? ""}
            placeholder="Paragraph"
            onChange={(value) => onChange({ content: value })}
          />
        ) : null}

        {block.type === "quote" ? (
          <EditableBlock
            className="min-h-28 w-full resize-y border-l-4 border-[#dec47b] bg-white/[0.035] px-6 py-5 font-display text-3xl leading-snug text-[#fff8ef] outline-none"
            value={block.content ?? ""}
            placeholder="Quote"
            onChange={(value) => onChange({ content: value })}
          />
        ) : null}

        {block.type === "callout" ? (
          <div className="rounded-lg border border-[#dec47b]/25 bg-[#dec47b]/8 p-5">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#dec47b]">BAKSAL Note</p>
            <EditableBlock
              className="mt-4 min-h-28 w-full resize-y bg-transparent leading-8 text-[#f4e7d6] outline-none"
              value={block.content ?? ""}
              placeholder="Callout"
              onChange={(value) => onChange({ content: value })}
            />
          </div>
        ) : null}

        {block.type === "image" ? (
          <div className="grid gap-4">
            {block.imageUrl ? (
              <Image src={block.imageUrl} alt={block.imageAlt || block.caption || "Blog image"} width={1280} height={760} className="h-auto w-full rounded-md object-cover" />
            ) : null}
            <AssetDropzone label="Image block" scope="blog" value={block.imageUrl ?? ""} onChange={(imageUrl) => onChange({ imageUrl })} onClear={() => onChange({ imageUrl: "" })} />
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Image Alt" value={block.imageAlt ?? ""} onChange={(value) => onChange({ imageAlt: value })} />
              <Field label="Caption" value={block.caption ?? ""} onChange={(value) => onChange({ caption: value })} />
            </div>
          </div>
        ) : null}

        {block.type === "divider" ? <div className="h-px bg-white/10" aria-hidden="true" /> : null}
      </div>
    </article>
  );
}
