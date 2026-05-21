"use client";

import { CalendarDays, CheckCircle2, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { HomeDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

type ConsultationCopy = HomeDictionary["consultation"];

type SubmitState = {
  tone: "success" | "error" | "idle";
  message: string;
};

const initialState = {
  name: "",
  phone: "",
  email: "",
  interest: "",
  preferredChannel: "",
  subject: "",
  message: "",
  privacyAccepted: false,
};

export function InquireForm({
  locale,
  copy,
}: {
  locale: Locale;
  copy: ConsultationCopy;
}) {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({ tone: "idle", message: "" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setSubmitState({ tone: "idle", message: "" });

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          locale,
          sourcePath: typeof window === "undefined" ? `/${locale}/inquire` : window.location.pathname,
        }),
      });
      const json = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(json.error ?? "문의 접수에 실패했습니다.");
      }

      setForm(initialState);
      setSubmitState({
        tone: "success",
        message: "문의가 접수되었습니다. 담당자가 확인 후 이메일 또는 선택하신 채널로 안내드리겠습니다.",
      });
    } catch (error) {
      setSubmitState({
        tone: "error",
        message: error instanceof Error ? error.message : "문의 접수에 실패했습니다.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="glass-panel grid gap-4 p-6 md:p-8" onSubmit={handleSubmit}>
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
          value={form.email}
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
            <option>Email</option>
          </select>
        </label>
      </div>

      <label className="grid gap-2 text-xs font-black uppercase">
        Subject
        <input
          className="form-field"
          name="subject"
          value={form.subject}
          placeholder="상담 제목을 간단히 적어주세요."
          onChange={(event) => setForm({ ...form, subject: event.target.value })}
        />
      </label>

      <label className="grid gap-2 text-xs font-black uppercase">
        {copy.fields.message}
        <textarea
          className="form-field min-h-40 resize-none"
          name="message"
          value={form.message}
          placeholder={copy.placeholders.message}
          onChange={(event) => setForm({ ...form, message: event.target.value })}
          required
        />
      </label>

      <label className="flex items-start gap-3 rounded-md border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-[#d9d0c9]">
        <input
          className="mt-1"
          type="checkbox"
          checked={form.privacyAccepted}
          onChange={(event) => setForm({ ...form, privacyAccepted: event.target.checked })}
          required
        />
        <span>상담 회신을 위해 입력한 개인정보를 수집하고 이메일 답변을 받을 수 있음에 동의합니다.</span>
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

      <button className="button-primary mt-2 w-full" disabled={submitting} type="submit">
        {submitting ? <Loader2 className="animate-spin" size={16} /> : <CalendarDays size={16} />}
        {submitting ? "Sending..." : copy.submit}
      </button>
    </form>
  );
}
