"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Mail,
  Reply,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  inquiryStatuses,
  type InquiryListResult,
  type InquiryRecord,
  type InquiryStatus,
} from "@/data/inquiry-content";
import {
  AdminToast,
  CrudShell,
  Field,
  Select,
  Textarea,
} from "../_components/admin-shared";
import { fetchJson } from "../_components/admin-types";

const statusLabels: Record<InquiryStatus | "all", string> = {
  all: "전체",
  new: "신규",
  in_progress: "처리중",
  replied: "답변완료",
  closed: "종료",
  spam: "스팸",
};

const statusTone: Record<InquiryStatus, string> = {
  new: "bg-[#d62f55]/18 text-[#ffd8df] border-[#d62f55]/35",
  in_progress: "bg-[#dec47b]/12 text-[#dec47b] border-[#dec47b]/30",
  replied: "bg-emerald-400/12 text-emerald-100 border-emerald-300/30",
  closed: "bg-white/8 text-white/58 border-white/10",
  spam: "bg-black/35 text-white/40 border-white/10",
};

export function InquireAdminPanel() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<InquiryStatus | "all">("all");
  const [unansweredOnly, setUnansweredOnly] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [drafts, setDrafts] = useState<Record<string, { assignedTo?: string; replySubject?: string; replyBody?: string }>>({});
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" | "info" } | null>(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      search,
      status,
      unansweredOnly: String(unansweredOnly),
    });

    return params.toString();
  }, [page, pageSize, search, status, unansweredOnly]);

  const inquiryQuery = useQuery({
    queryKey: ["admin-inquiries", queryString],
    queryFn: () => fetchJson<InquiryListResult>(`/api/admin/inquiries?${queryString}`),
  });

  const items = useMemo(() => inquiryQuery.data?.items ?? [], [inquiryQuery.data?.items]);
  const current = items.find((item) => item.id === selectedId) ?? items[0] ?? null;
  const total = inquiryQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentDraft = current ? drafts[current.id] : null;
  const assignedToValue = current ? (currentDraft?.assignedTo ?? current.assignedTo) : "";
  const replySubjectValue = current ? (currentDraft?.replySubject ?? "BAKSAL BEAUTY 상담 문의 답변드립니다.") : "";
  const replyBodyValue = current ? (currentDraft?.replyBody ?? "") : "";

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function refresh() {
    return queryClient.invalidateQueries({ queryKey: ["admin-inquiries"] });
  }

  function updateDraft(id: string, patch: { assignedTo?: string; replySubject?: string; replyBody?: string }) {
    setDrafts((previous) => ({
      ...previous,
      [id]: {
        ...previous[id],
        ...patch,
      },
    }));
  }

  const updateMutation = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<InquiryRecord> }) =>
      fetchJson(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      }),
    onSuccess: async () => {
      setToast({ message: "문의 상태가 저장되었습니다.", tone: "success" });
      await refresh();
    },
    onError: (error) =>
      setToast({
        message: error instanceof Error ? error.message : "문의 상태 저장에 실패했습니다.",
        tone: "error",
      }),
  });

  const replyMutation = useMutation({
    mutationFn: async ({ id, subject, body }: { id: string; subject: string; body: string }) =>
      fetchJson(`/api/admin/inquiries/${id}/reply`, {
        method: "POST",
        body: JSON.stringify({ subject, body }),
    }),
    onSuccess: async () => {
      if (current) {
        updateDraft(current.id, { replyBody: "" });
      }
      setToast({ message: "답변 이메일을 발송하고 답변완료로 표시했습니다.", tone: "success" });
      await refresh();
    },
    onError: (error) =>
      setToast({
        message: error instanceof Error ? error.message : "답변 메일 발송에 실패했습니다.",
        tone: "error",
      }),
  });

  return (
    <CrudShell
      title="INQUIRE"
      source={inquiryQuery.data?.source}
      loading={inquiryQuery.isLoading}
      notice={inquiryQuery.data?.source === "fallback" ? "Neon DB 연결 전 fallback 문의 데이터입니다." : ""}
      action={
        <button className="button-outline" onClick={() => void refresh()} type="button">
          {inquiryQuery.isFetching ? <Loader2 className="animate-spin" size={15} /> : <Mail size={15} />}
          Refresh
        </button>
      }
    >
      <div className="grid gap-5">
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          {(["all", ...inquiryStatuses] as const).map((item) => (
            <button
              key={item}
              className={`glass-panel p-4 text-left transition hover:border-[#dec47b]/35 ${
                status === item ? "border-[#d62f55]/80" : ""
              }`}
              onClick={() => {
                setStatus(item);
                setPage(1);
              }}
              type="button"
            >
              <p className="text-xs font-black uppercase text-white/48">{statusLabels[item]}</p>
              <p className="font-display mt-2 text-4xl text-[#fff8ef]">
                {inquiryQuery.data?.counts[item] ?? 0}
              </p>
            </button>
          ))}
        </div>

        <div className="glass-panel grid gap-3 p-4 lg:grid-cols-[1fr_180px_170px_140px]">
          <label className="relative block min-w-0">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/38" size={16} />
            <input
              className="form-field pl-11"
              value={search}
              placeholder="이름, 이메일, 연락처, 문의 내용 검색"
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </label>
          <select
            className="form-field"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as InquiryStatus | "all");
              setPage(1);
            }}
          >
            <option value="all">전체 상태</option>
            {inquiryStatuses.map((item) => (
              <option key={item} value={item}>
                {statusLabels[item]}
              </option>
            ))}
          </select>
          <label className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/[0.04] px-4 text-sm font-black text-white/72">
            미답변만
            <input
              type="checkbox"
              checked={unansweredOnly}
              onChange={(event) => {
                setUnansweredOnly(event.target.checked);
                setPage(1);
              }}
            />
          </label>
          <select
            className="form-field"
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
          >
            {[10, 20, 30, 50].map((size) => (
              <option key={size} value={size}>
                {size}개씩
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(360px,0.72fr)_minmax(0,1fr)]">
          <section className="grid gap-3">
            {items.map((item) => (
              <InquiryCard
                key={item.id}
                item={item}
                active={current?.id === item.id}
                onSelect={() => setSelectedId(item.id)}
              />
            ))}
            {!items.length ? (
              <div className="glass-panel grid min-h-48 place-items-center p-8 text-center text-[#d9d0c9]">
                조건에 맞는 문의가 없습니다.
              </div>
            ) : null}

            <div className="glass-panel flex flex-wrap items-center justify-between gap-3 p-4">
              <p className="text-sm font-bold text-white/58">
                {total}건 중 {items.length}건 표시 · {page}/{totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  className="social-action-button"
                  disabled={page <= 1}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  type="button"
                  title="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  className="social-action-button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                  type="button"
                  title="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </section>

          {current ? (
            <section className="glass-panel min-w-0 p-5 md:p-6">
              <div className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black uppercase ${statusTone[current.status]}`}>
                    {statusLabels[current.status]}
                  </span>
                  <h3 className="font-display mt-4 text-4xl leading-tight">{current.subject || current.interest || "상담 문의"}</h3>
                  <p className="mt-2 text-sm font-bold text-[#d9d0c9]">
                    {current.name} · {current.email} · {current.phone}
                  </p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:w-[320px] lg:grid-cols-1">
                  <Select
                    label="Status"
                    value={current.status}
                    options={inquiryStatuses.map((item) => item)}
                    onChange={(value) => updateMutation.mutate({ id: current.id, patch: { status: value as InquiryStatus, assignedTo: assignedToValue } })}
                  />
                  <Field label="Assigned To" value={assignedToValue} onChange={(value) => updateDraft(current.id, { assignedTo: value })} />
                  <button
                    className="button-outline h-10 px-3 text-[0.68rem]"
                    disabled={updateMutation.isPending}
                    onClick={() => updateMutation.mutate({ id: current.id, patch: { status: current.status, assignedTo: assignedToValue } })}
                    type="button"
                  >
                    Save Status
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-[0.82fr_1fr]">
                <article className="rounded-lg border border-white/10 bg-white/[0.025] p-5">
                  <p className="eyebrow text-[#dec47b]">Original Inquiry</p>
                  <dl className="mt-5 grid gap-3 text-sm leading-6 text-[#d9d0c9]">
                    <InfoRow label="관심 시술" value={current.interest || "-"} />
                    <InfoRow label="선호 채널" value={current.preferredChannel || "-"} />
                    <InfoRow label="접수 언어" value={current.locale} />
                    <InfoRow label="접수 경로" value={current.sourcePath || "-"} />
                    <InfoRow label="접수일" value={formatDate(current.createdAt)} />
                    <InfoRow label="최근 답변" value={current.latestReplyAt ? formatDate(current.latestReplyAt) : "-"} />
                  </dl>
                  <p className="mt-6 whitespace-pre-wrap rounded-md bg-black/24 p-4 text-sm leading-7 text-[#fff8ef]">
                    {current.message}
                  </p>
                  <div className="mt-6 border-t border-white/10 pt-5">
                    <p className="eyebrow text-[#dec47b]">Customer History</p>
                    <div className="mt-4 grid gap-2">
                      {current.customerHistory.map((history) => (
                        <button
                          key={history.id}
                          className={`rounded-md border p-3 text-left transition hover:border-[#dec47b]/45 ${
                            history.id === current.id ? "border-[#d62f55]/55 bg-[#d62f55]/10" : "border-white/10 bg-black/18"
                          }`}
                          onClick={() => {
                            if (!items.some((item) => item.id === history.id)) {
                              setSearch(current.email);
                              setPage(1);
                            }
                            setSelectedId(history.id);
                          }}
                          type="button"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs font-black uppercase text-white/42">{formatDate(history.createdAt)}</span>
                            <span className={`rounded-full border px-2 py-0.5 text-[0.62rem] font-black ${statusTone[history.status]}`}>
                              {statusLabels[history.status]}
                            </span>
                          </div>
                          <p className="mt-2 line-clamp-1 text-sm font-black text-white/82">
                            {history.subject || history.interest || "상담 문의"}
                          </p>
                        </button>
                      ))}
                      {!current.customerHistory.length ? (
                        <p className="rounded-md border border-white/10 bg-black/18 p-3 text-sm text-white/48">
                          같은 이메일로 접수된 이전 문의가 없습니다.
                        </p>
                      ) : null}
                    </div>
                  </div>
                </article>

                <article className="rounded-lg border border-white/10 bg-white/[0.025] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="eyebrow text-[#dec47b]">Email Reply</p>
                      <p className="mt-2 text-sm text-white/52">{current.replyCount} replies</p>
                    </div>
                    {current.status === "replied" ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/12 px-3 py-1 text-xs font-black text-emerald-100">
                        <CheckCircle2 size={14} /> 답변완료
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-5 grid gap-3">
                    <Field label="Reply Subject" value={replySubjectValue} onChange={(value) => updateDraft(current.id, { replySubject: value })} />
                    <Textarea label="Reply Body" value={replyBodyValue} onChange={(value) => updateDraft(current.id, { replyBody: value })} />
                    <button
                      className="button-primary w-full"
                      disabled={replyMutation.isPending || !replyBodyValue.trim()}
                      onClick={() => replyMutation.mutate({ id: current.id, subject: replySubjectValue, body: replyBodyValue })}
                      type="button"
                    >
                      {replyMutation.isPending ? <Loader2 className="animate-spin" size={15} /> : <Reply size={15} />}
                      Send Email Reply
                    </button>
                    <button
                      className="button-outline w-full"
                      disabled={updateMutation.isPending}
                      onClick={() => updateMutation.mutate({ id: current.id, patch: { status: "replied", assignedTo: assignedToValue } })}
                      type="button"
                    >
                      답변완료로 표시
                    </button>
                  </div>

                  <div className="mt-6 grid gap-3">
                    {current.replies.map((reply) => (
                      <div key={reply.id} className="rounded-md border border-white/10 bg-black/24 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-xs font-black uppercase text-[#dec47b]">{reply.status}</p>
                          <p className="text-xs text-white/42">{formatDate(reply.createdAt)}</p>
                        </div>
                        <p className="mt-2 font-black text-white">{reply.subject}</p>
                        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#d9d0c9]">{reply.body}</p>
                        {reply.errorMessage ? <p className="mt-3 text-xs font-bold text-[#ffd8df]">{reply.errorMessage}</p> : null}
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            </section>
          ) : null}
        </div>
      </div>
      <AdminToast toast={toast} onClose={() => setToast(null)} />
    </CrudShell>
  );
}

function InquiryCard({
  item,
  active,
  onSelect,
}: {
  item: InquiryRecord;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      className={`rounded-lg border p-4 text-left transition ${
        active ? "border-[#d62f55] bg-[#d62f55]/12" : "border-white/10 bg-black/32 hover:border-[#dec47b]/45"
      }`}
      onClick={onSelect}
      type="button"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={`rounded-full border px-2.5 py-1 text-[0.66rem] font-black uppercase ${statusTone[item.status]}`}>
          {statusLabels[item.status]}
        </span>
        <span className="text-xs font-bold text-white/42">{formatDate(item.createdAt)}</span>
      </div>
      <h3 className="mt-3 line-clamp-1 text-lg font-black text-white">{item.name}</h3>
      <p className="mt-1 line-clamp-1 text-sm font-bold text-[#dec47b]">{item.interest || item.subject}</p>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#d9d0c9]">{item.message}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-[0.72rem] font-bold text-white/48">
        <span>{item.email}</span>
        <span>{item.replyCount} replies</span>
      </div>
    </button>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1">
      <dt className="text-xs font-black uppercase text-white/42">{label}</dt>
      <dd className="break-all font-bold text-white/78">{value}</dd>
    </div>
  );
}

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
