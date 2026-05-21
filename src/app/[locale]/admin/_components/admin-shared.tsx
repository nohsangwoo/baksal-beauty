"use client";

import { upload } from "@vercel/blob/client";
import { CheckCircle2, Loader2, Trash2, UploadCloud, X } from "lucide-react";
import { useId, useState } from "react";
import type React from "react";

export function AssetDropzone({
  label,
  value,
  scope,
  onChange,
  onClear,
  compact = false,
}: {
  label: string;
  value: string;
  scope: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  compact?: boolean;
}) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  async function uploadAsset(file: File) {
    setUploading(true);
    setProgress(0);

    try {
      const safeName = file.name.replace(/[^\w.-]+/g, "-");
      const blob = await upload(`${scope}/${Date.now()}-${safeName}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
        clientPayload: JSON.stringify({ scope }),
        multipart: file.size > 8 * 1024 * 1024,
        onUploadProgress: (event) => setProgress(event.percentage),
      });
      onChange(blob.url);
    } finally {
      setUploading(false);
      setDragActive(false);
    }
  }

  return (
    <div
      className={`min-w-0 max-w-full overflow-hidden rounded-md border border-dashed transition ${
        dragActive ? "border-[#dec47b] bg-[#dec47b]/12" : "border-white/20 bg-black/45"
      } ${compact ? "p-2" : "p-4"}`}
      onDragEnter={(event) => {
        event.preventDefault();
        setDragActive(true);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={(event) => {
        event.preventDefault();
        setDragActive(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];

        if (file) {
          void uploadAsset(file);
        } else {
          setDragActive(false);
        }
      }}
    >
      <input
        id={inputId}
        className="sr-only"
        type="file"
        accept="image/*,video/mp4,video/webm,application/pdf"
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            void uploadAsset(file);
          }
        }}
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label
          htmlFor={inputId}
          className="inline-flex min-w-0 max-w-full cursor-pointer items-center gap-2 rounded-full bg-[#d62f55] px-3 py-2 text-[0.68rem] font-black uppercase text-white"
        >
          {uploading ? <Loader2 className="animate-spin" size={13} /> : <UploadCloud size={13} />}
          {uploading ? `${progress}%` : label}
        </label>
        {value && onClear ? (
          <button className="social-action-button !h-8 !w-8" onClick={onClear} type="button" title="Delete image">
            <Trash2 size={14} />
          </button>
        ) : null}
      </div>
      {!compact ? (
        <p className="mt-3 max-w-full break-all text-xs font-bold leading-5 text-white/54">
          {value || "Drop an image here or click upload."}
        </p>
      ) : null}
    </div>
  );
}

export function AdminToast({
  toast,
  onClose,
}: {
  toast: { message: string; tone: "success" | "error" | "info" } | null;
  onClose: () => void;
}) {
  if (!toast) {
    return null;
  }

  const toneClass =
    toast.tone === "error"
      ? "border-[#d62f55]/70 text-[#ffd8df]"
      : toast.tone === "info"
        ? "border-[#dec47b]/50 text-[#fff8ef]"
        : "border-emerald-300/40 text-[#fff8ef]";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed right-5 top-5 z-[120] w-[min(24rem,calc(100vw-2rem))] rounded-lg border bg-[#0d0b0c]/96 p-4 shadow-[0_22px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl ${toneClass}`}
    >
      <div className="flex items-start gap-3">
        {toast.tone === "error" ? <X size={18} className="mt-0.5 shrink-0 text-[#d62f55]" /> : <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#dec47b]" />}
        <p className="text-sm font-black leading-6">{toast.message}</p>
        <button className="ml-auto text-white/54 transition hover:text-white" onClick={onClose} type="button" aria-label="Close toast">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export function EditableLine({
  value,
  onChange,
  className,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  className: string;
  placeholder?: string;
}) {
  return (
    <input
      className={`${className} appearance-none rounded-sm border-0 p-0 transition placeholder:text-white/30 focus:bg-black/18 focus:outline focus:outline-1 focus:outline-[#dec47b]/45`}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export function EditableBlock({
  value,
  onChange,
  className,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  className: string;
  placeholder?: string;
}) {
  return (
    <textarea
      className={`${className} appearance-none rounded-sm border-0 p-0 transition placeholder:text-white/30 focus:bg-black/18 focus:outline focus:outline-1 focus:outline-[#dec47b]/45`}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export function EditorDivider({ title }: { title: string }) {
  return (
    <div className="pt-3">
      <p className="border-t border-white/10 pt-4 text-xs font-black uppercase tracking-[0.16em] text-[#dec47b]">
        {title}
      </p>
    </div>
  );
}

export function ForbiddenPanel({ title }: { title: string }) {
  return (
    <div className="glass-panel p-7 md:p-9">
      <p className="eyebrow text-[#dec47b]">{title}</p>
      <h3 className="font-display mt-3 text-5xl">Owner only</h3>
      <p className="mt-5 max-w-2xl leading-8 text-[#d9d0c9]">
        사용자 권한 부여와 철회는 최고관리자 권한을 가진 계정만 수행할 수 있습니다.
      </p>
    </div>
  );
}

export function CrudShell({
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
            {source === "fallback" ? "DATABASE_URL 연결 전 fallback 데이터로 표시 중입니다." : "Neon DB live data"}
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

export function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | number | boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid min-w-0 gap-2">
      <span className="text-xs font-black uppercase text-white/58">{label}</span>
      <input className="form-field min-w-0 max-w-full" value={String(value)} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid min-w-0 gap-2">
      <span className="text-xs font-black uppercase text-white/58">{label}</span>
      <textarea className="form-field min-h-24 min-w-0 max-w-full resize-y" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export function Select({
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
    <label className="grid min-w-0 gap-2">
      <span className="text-xs font-black uppercase text-white/58">{label}</span>
      <select className="form-field min-w-0 max-w-full" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} className="bg-[#120d0e]" value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function UploadField({
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
  return (
    <div className="grid min-w-0 gap-2">
      <span className="text-xs font-black uppercase text-white/58">{label}</span>
      <AssetDropzone label={label} value={value} scope={scope} onChange={onChange} onClear={() => onChange("")} />
    </div>
  );
}
