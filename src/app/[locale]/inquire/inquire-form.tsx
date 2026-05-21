"use client";

import {
  CalendarDays,
  CheckCircle2,
  FileText,
  ImageIcon,
  Loader2,
  Paperclip,
  Trash2,
  UploadCloud,
} from "lucide-react";
import Script from "next/script";
import { useEffect, useRef, useState, type DragEvent, type FormEvent } from "react";
import { useAuth } from "@/components/auth-provider";
import type { Locale } from "@/i18n/config";
import type { HomeDictionary } from "@/i18n/dictionaries";

type ConsultationCopy = HomeDictionary["consultation"];

type SubmitState = {
  tone: "success" | "error" | "idle";
  message: string;
};

type AttachmentPreview = {
  id: string;
  file: File;
  previewUrl: string;
};

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          action?: string;
          theme?: "dark" | "light" | "auto";
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove?: (widgetId: string) => void;
    };
  }
}

const maxAttachmentCount = 5;
const maxAttachmentSize = 12 * 1024 * 1024;
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

const formMessages: Record<
  Locale,
  {
    privacy: string;
    success: string;
    fallbackError: string;
    sending: string;
    attachmentLabel: string;
    attachmentHint: string;
    attachmentLimit: string;
    removeFile: string;
    turnstileLabel: string;
    turnstileRequired: string;
    turnstileMissing: string;
  }
> = {
  ko: {
    privacy: "문의 회신을 위해 입력한 개인정보를 수집하고 이메일 답변을 받을 수 있음에 동의합니다.",
    success: "문의가 접수되었습니다. 주식회사 럿지 담당자가 확인 후 선택하신 채널로 안내드리겠습니다.",
    fallbackError: "문의 접수에 실패했습니다.",
    sending: "전송 중...",
    attachmentLabel: "첨부파일",
    attachmentHint: "이미지, PDF, 문서 파일을 끌어오거나 클릭해서 추가하세요.",
    attachmentLimit: "최대 5개, 파일당 12MB까지 업로드할 수 있습니다.",
    removeFile: "첨부파일 삭제",
    turnstileLabel: "보안 확인",
    turnstileRequired: "보안 확인을 완료해주세요.",
    turnstileMissing: "보안 확인 설정이 누락되었습니다. 관리자에게 문의해주세요.",
  },
  en: {
    privacy: "I agree that my information may be collected for reply and project consultation.",
    success: "Your inquiry has been received. The LUDGI team will review it and contact you through your preferred channel.",
    fallbackError: "Failed to submit the inquiry.",
    sending: "Sending...",
    attachmentLabel: "Attachments",
    attachmentHint: "Drag images, PDFs, or documents here, or click to add files.",
    attachmentLimit: "Up to 5 files, 12MB per file.",
    removeFile: "Remove attachment",
    turnstileLabel: "Security verification",
    turnstileRequired: "Please complete the security verification.",
    turnstileMissing: "Security verification is not configured. Please contact the administrator.",
  },
  zh: {
    privacy: "我同意为回复咨询而收集所填写的个人信息，并通过邮件或所选渠道联系我。",
    success: "咨询已提交。LUDGI 团队确认后会通过您选择的渠道联系您。",
    fallbackError: "提交咨询失败。",
    sending: "发送中...",
    attachmentLabel: "附件",
    attachmentHint: "可拖放图片、PDF 或文档，也可以点击添加文件。",
    attachmentLimit: "最多 5 个文件，每个文件不超过 12MB。",
    removeFile: "删除附件",
    turnstileLabel: "安全验证",
    turnstileRequired: "请先完成安全验证。",
    turnstileMissing: "安全验证尚未配置，请联系管理员。",
  },
  ja: {
    privacy: "返信と制作相談のため、入力した個人情報の収集および連絡を受けることに同意します。",
    success: "お問い合わせを受け付けました。LUDGI担当者が確認後、ご希望の方法でご案内します。",
    fallbackError: "お問い合わせの送信に失敗しました。",
    sending: "送信中...",
    attachmentLabel: "添付ファイル",
    attachmentHint: "画像、PDF、文書をドラッグするかクリックして追加してください。",
    attachmentLimit: "最大5ファイル、1ファイル12MBまでアップロードできます。",
    removeFile: "添付ファイルを削除",
    turnstileLabel: "セキュリティ確認",
    turnstileRequired: "セキュリティ確認を完了してください。",
    turnstileMissing: "セキュリティ確認が設定されていません。管理者にお問い合わせください。",
  },
};

const initialState = {
  name: "",
  phone: "",
  email: "",
  interest: "",
  preferredChannel: "",
  message: "",
  privacyAccepted: false,
};

export function InquireForm({
  locale,
  copy,
  className = "",
  sourcePath,
}: {
  locale: Locale;
  copy: ConsultationCopy;
  className?: string;
  sourcePath?: string;
}) {
  const { user } = useAuth();
  const [form, setForm] = useState(initialState);
  const [attachments, setAttachments] = useState<AttachmentPreview[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetNonce, setTurnstileResetNonce] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({ tone: "idle", message: "" });
  const attachmentsRef = useRef<AttachmentPreview[]>([]);
  const messages = formMessages[locale];
  const emailValue = form.email || user?.email || "";

  useEffect(() => {
    attachmentsRef.current = attachments;
  }, [attachments]);

  useEffect(
    () => () => {
      attachmentsRef.current.forEach((attachment) => {
        if (attachment.previewUrl) {
          URL.revokeObjectURL(attachment.previewUrl);
        }
      });
    },
    [],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setSubmitState({ tone: "idle", message: "" });

    try {
      if (!turnstileToken) {
        throw new Error(messages.turnstileRequired);
      }

      const body = new FormData();
      body.append("name", form.name);
      body.append("phone", form.phone);
      body.append("email", emailValue);
      body.append("interest", form.interest);
      body.append("preferredChannel", form.preferredChannel);
      body.append("message", form.message);
      body.append("locale", locale);
      body.append("privacyAccepted", String(form.privacyAccepted));
      body.append("sourcePath", sourcePath ?? (typeof window === "undefined" ? `/${locale}/inquire` : window.location.pathname));
      body.append("cf-turnstile-response", turnstileToken);
      attachments.forEach((attachment) => body.append("attachments", attachment.file));

      const response = await fetch("/api/inquiries", {
        method: "POST",
        body,
      });
      const json = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(json.error ?? messages.fallbackError);
      }

      clearAttachments();
      resetTurnstile();
      setForm(initialState);
      setSubmitState({
        tone: "success",
        message: messages.success,
      });
    } catch (error) {
      setSubmitState({
        tone: "error",
        message: error instanceof Error ? error.message : messages.fallbackError,
      });
      resetTurnstile();
    } finally {
      setSubmitting(false);
    }
  }

  function addFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList);

    if (!files.length) {
      return;
    }

    const availableSlots = maxAttachmentCount - attachments.length;
    const nextFiles = files.slice(0, Math.max(0, availableSlots));

    if (!nextFiles.length) {
      setSubmitState({ tone: "error", message: messages.attachmentLimit });
      return;
    }

    const tooLarge = nextFiles.find((file) => file.size > maxAttachmentSize);

    if (tooLarge) {
      setSubmitState({ tone: "error", message: `${tooLarge.name}: ${messages.attachmentLimit}` });
      return;
    }

    setSubmitState({ tone: "idle", message: "" });
    setAttachments((previous) => [
      ...previous,
      ...nextFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
      })),
    ]);
  }

  function removeAttachment(id: string) {
    setAttachments((previous) => {
      const target = previous.find((attachment) => attachment.id === id);

      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }

      return previous.filter((attachment) => attachment.id !== id);
    });
  }

  function clearAttachments() {
    attachments.forEach((attachment) => {
      if (attachment.previewUrl) {
        URL.revokeObjectURL(attachment.previewUrl);
      }
    });
    setAttachments([]);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragActive(false);
    addFiles(event.dataTransfer.files);
  }

  function resetTurnstile() {
    setTurnstileToken("");
    setTurnstileResetNonce((value) => value + 1);
  }

  return (
    <form className={`glass-panel grid gap-4 p-6 md:p-8 ${className}`} onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-xs font-black uppercase">
          {copy.fields.name}
          <input
            className="form-field"
            name="name"
            value={form.name}
            placeholder={copy.placeholders.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />
        </label>
        <label className="grid gap-2 text-xs font-black uppercase">
          {copy.fields.phone}
          <input
            className="form-field"
            name="phone"
            value={form.phone}
            placeholder={copy.placeholders.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
            required
          />
        </label>
      </div>

      <label className="grid gap-2 text-xs font-black uppercase">
        {copy.fields.email}
        <input
          className="form-field"
          name="email"
          type="email"
          value={emailValue}
          placeholder={copy.placeholders.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          required
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-xs font-black uppercase">
          {copy.fields.interest}
          <select
            className="form-field"
            name="service"
            value={form.interest}
            onChange={(event) => setForm({ ...form, interest: event.target.value })}
          >
            <option value="" disabled>
              {copy.placeholders.service}
            </option>
            {copy.services.map((service) => (
              <option key={service}>{service}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-xs font-black uppercase">
          {copy.fields.channel}
          <select
            className="form-field"
            name="channel"
            value={form.preferredChannel}
            onChange={(event) => setForm({ ...form, preferredChannel: event.target.value })}
          >
            <option value="" disabled>
              {copy.placeholders.channel}
            </option>
            {copy.channels.map((channel) => (
              <option key={channel}>{channel}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="grid gap-2 text-xs font-black uppercase">
        {copy.fields.message}
        <textarea
          className="form-field min-h-56 resize-none md:min-h-64"
          name="message"
          value={form.message}
          placeholder={copy.placeholders.message}
          onChange={(event) => setForm({ ...form, message: event.target.value })}
          required
        />
      </label>

      <div className="grid gap-3">
        <label
          className={`grid cursor-pointer gap-3 rounded-md border border-dashed p-5 transition ${
            dragActive ? "border-[#dec47b] bg-[#dec47b]/12" : "border-white/16 bg-black/28 hover:border-[#dec47b]/45"
          }`}
          onDragEnter={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={(event) => {
            event.preventDefault();
            setDragActive(false);
          }}
          onDrop={handleDrop}
        >
          <input
            className="sr-only"
            type="file"
            multiple
            accept="image/*,.pdf,.txt,.doc,.docx,.xls,.xlsx"
            onChange={(event) => {
              if (event.target.files) {
                addFiles(event.target.files);
                event.target.value = "";
              }
            }}
          />
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase text-[#dec47b]">
            <UploadCloud size={15} />
            {messages.attachmentLabel}
          </span>
          <span className="text-sm leading-6 text-[#d9d0c9]">{messages.attachmentHint}</span>
          <span className="text-xs font-bold text-white/42">{messages.attachmentLimit}</span>
        </label>

        {attachments.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="overflow-hidden rounded-md border border-white/10 bg-white/[0.035]">
                {attachment.previewUrl ? (
                  <div className="relative aspect-[4/3] bg-black/30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={attachment.previewUrl} alt={attachment.file.name} className="h-full w-full object-cover" />
                  </div>
                ) : null}
                <div className="flex items-center gap-3 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/28 text-[#dec47b]">
                    {attachment.previewUrl ? <ImageIcon size={16} /> : <FileText size={16} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-white">{attachment.file.name}</p>
                    <p className="text-xs font-bold text-white/42">{formatFileSize(attachment.file.size)}</p>
                  </div>
                  <button
                    aria-label={messages.removeFile}
                    className="social-action-button !h-9 !w-9"
                    onClick={() => removeAttachment(attachment.id)}
                    type="button"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="inline-flex items-center gap-2 text-xs font-bold text-white/38">
            <Paperclip size={13} />
            {messages.attachmentLimit}
          </p>
        )}
      </div>

      <TurnstileVerification
        label={messages.turnstileLabel}
        missingMessage={messages.turnstileMissing}
        resetNonce={turnstileResetNonce}
        siteKey={turnstileSiteKey}
        onToken={setTurnstileToken}
      />

      <label className="flex items-start gap-3 rounded-md border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-[#d9d0c9]">
        <input
          className="mt-1"
          type="checkbox"
          checked={form.privacyAccepted}
          onChange={(event) => setForm({ ...form, privacyAccepted: event.target.checked })}
          required
        />
        <span>{messages.privacy}</span>
      </label>

      {submitState.message ? (
        <div
          className={`rounded-md border p-4 text-sm font-bold leading-6 ${
            submitState.tone === "success"
              ? "border-emerald-300/40 bg-emerald-400/10 text-emerald-100"
              : "border-[#d62f55]/50 bg-[#d62f55]/10 text-[#ffd8df]"
          }`}
        >
          <div className="flex items-start gap-2">
            {submitState.tone === "success" ? <CheckCircle2 className="mt-0.5 shrink-0" size={16} /> : null}
            <span>{submitState.message}</span>
          </div>
        </div>
      ) : null}

      <button className="button-primary mt-2 w-full" disabled={submitting || !turnstileToken} type="submit">
        {submitting ? <Loader2 className="animate-spin" size={16} /> : <CalendarDays size={16} />}
        {submitting ? messages.sending : copy.submit}
      </button>
    </form>
  );
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))}KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)}MB`;
}

function TurnstileVerification({
  label,
  missingMessage,
  resetNonce,
  siteKey,
  onToken,
}: {
  label: string;
  missingMessage: string;
  resetNonce: number;
  siteKey: string;
  onToken: (token: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string>("");
  const onTokenRef = useRef(onToken);

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    if (!siteKey) {
      return;
    }

    let retryTimer = 0;

    function renderWhenReady() {
      if (widgetIdRef.current) {
        return;
      }

      if (containerRef.current && window.turnstile) {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          action: "inquiry",
          theme: "dark",
          callback: (token) => onTokenRef.current(token),
          "expired-callback": () => onTokenRef.current(""),
          "error-callback": () => onTokenRef.current(""),
        });
        return;
      }

      retryTimer = window.setTimeout(renderWhenReady, 250);
    }

    renderWhenReady();

    return () => {
      if (retryTimer) {
        window.clearTimeout(retryTimer);
      }
    };
  }, [siteKey]);

  useEffect(() => {
    if (!resetNonce || !widgetIdRef.current) {
      return;
    }

    window.turnstile?.reset(widgetIdRef.current);
  }, [resetNonce]);

  useEffect(
    () => () => {
      if (widgetIdRef.current) {
        window.turnstile?.remove?.(widgetIdRef.current);
      }
    },
    [],
  );

  if (!siteKey) {
    return (
      <div className="rounded-md border border-[#d62f55]/35 bg-[#d62f55]/10 p-4 text-sm font-bold text-[#ffd8df]">
        {missingMessage}
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      <Script
        id="cloudflare-turnstile"
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
      />
      <p className="text-xs font-black uppercase text-white/82">{label}</p>
      <div className="min-h-[65px] rounded-md border border-white/10 bg-black/24 p-3">
        <div ref={containerRef} />
      </div>
    </div>
  );
}
