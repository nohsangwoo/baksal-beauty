import { NextResponse } from "next/server";
import { isLocale, type Locale } from "@/i18n/config";
import { getAdminServiceById } from "@/lib/service-repository";
import { requireAdminUserFromRequest } from "@/lib/auth-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const localeNames: Record<Locale, string> = {
  ko: "Korean",
  en: "English",
  zh: "Simplified Chinese",
  ja: "Japanese",
};

export async function POST(request: Request) {
  const auth = await requireAdminUserFromRequest(request);

  if (auth.response) {
    return auth.response;
  }

  try {
    const body = (await request.json()) as {
      serviceId?: string;
      targetLocale?: string;
      sourceLocale?: string;
    };
    const sourceLocale = isLocale(body.sourceLocale ?? "") ? (body.sourceLocale as Locale) : "ko";
    const targetLocale = isLocale(body.targetLocale ?? "") ? (body.targetLocale as Locale) : null;

    if (!body.serviceId || !targetLocale) {
      return NextResponse.json(
        { error: "serviceId and targetLocale are required." },
        { status: 400 },
      );
    }

    if (targetLocale === sourceLocale) {
      return NextResponse.json(
        { error: "Target locale must be different from source locale." },
        { status: 400 },
      );
    }

    const source = await getAdminServiceById(sourceLocale, body.serviceId);

    if (!source) {
      return NextResponse.json({ error: "Source service was not found." }, { status: 404 });
    }

    const translated = await translateServiceContent(source, targetLocale);

    return NextResponse.json(translated);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to translate service." },
      { status: 400 },
    );
  }
}

async function translateServiceContent(source: Awaited<ReturnType<typeof getAdminServiceById>>, targetLocale: Locale) {
  if (!source) {
    throw new Error("Source service was not found.");
  }

  const apiKey =
    process.env.OPENAI_API_KEY ||
    process.env.OPEN_API_SCRET_KEY ||
    process.env.OPENAI_API_SECRET_KEY;

  if (!apiKey) {
    throw new Error("Missing OpenAI API key for translation.");
  }

  const payload = {
    title: source.title,
    subtitle: source.subtitle,
    summary: source.summary,
    description: source.description,
    imageAlt: source.imageAlt,
    highlights: source.highlights,
    recommendedFor: source.recommendedFor,
    process: source.process,
    recovery: source.recovery,
    duration: source.duration,
    priceNote: source.priceNote,
    surgeryInfo: source.surgeryInfo,
    detailPanels: source.detailPanels,
    beforeAfter: source.beforeAfter,
    richDetailImages: source.richDetailImages,
    youtubeVideos: source.youtubeVideos,
    detailCta: source.detailCta,
  };

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_TRANSLATION_MODEL || "gpt-5",
      reasoning: { effort: "low" },
      instructions: [
        "You translate premium Korean plastic surgery clinic website content.",
        "Return only valid JSON with exactly the same object shape and keys as the input.",
        "Translate human-facing text into the target language.",
        "Preserve URLs, slugs, numeric strings, medical caution, conservative tone, and array lengths.",
        "Do not invent guarantees, discounts, rankings, or aggressive claims.",
      ].join(" "),
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Target language: ${localeNames[targetLocale]}\n\nSource JSON:\n${JSON.stringify(payload)}`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI translation failed: ${response.status} ${await response.text()}`);
  }

  const json = await response.json();
  const outputText = extractOutputText(json);
  const translated = parseJsonObject(outputText);

  return {
    title: asString(translated.title),
    subtitle: asString(translated.subtitle),
    summary: asString(translated.summary),
    description: asString(translated.description),
    imageAlt: asString(translated.imageAlt),
    highlights: asStringArray(translated.highlights),
    recommendedFor: asStringArray(translated.recommendedFor),
    process: asStringArray(translated.process),
    recovery: asString(translated.recovery),
    duration: asString(translated.duration),
    priceNote: asString(translated.priceNote),
    surgeryInfo: translated.surgeryInfo ?? source.surgeryInfo,
    detailPanels: preserveImageUrls(translated.detailPanels, source.detailPanels),
    beforeAfter: preserveBeforeAfterUrls(translated.beforeAfter, source.beforeAfter),
    richDetailImages: preserveRichImageUrls(translated.richDetailImages, source.richDetailImages),
    youtubeVideos: preserveVideoUrls(translated.youtubeVideos, source.youtubeVideos),
    detailCta: translated.detailCta ?? source.detailCta,
  };
}

function extractOutputText(response: unknown) {
  const value = response as { output_text?: string; output?: { content?: { text?: string }[] }[] };

  if (value.output_text) {
    return value.output_text;
  }

  return (value.output ?? [])
    .flatMap((item) => item.content ?? [])
    .map((content) => content.text ?? "")
    .join("\n")
    .trim();
}

function parseJsonObject(text: string) {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(cleaned) as Record<string, unknown>;
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function preserveImageUrls(translated: unknown, source: unknown) {
  if (!Array.isArray(translated) || !Array.isArray(source)) {
    return source;
  }

  return translated.map((item, index) => ({
    ...(typeof item === "object" && item ? item : {}),
    imageUrl:
      asRecord(source[index])?.imageUrl ??
      asRecord(item)?.imageUrl ??
      "",
  }));
}

function preserveRichImageUrls(translated: unknown, source: unknown) {
  if (!Array.isArray(translated) || !Array.isArray(source)) {
    return source;
  }

  return translated.map((item, index) => ({
    ...(typeof item === "object" && item ? item : {}),
    imageUrl:
      asRecord(source[index])?.imageUrl ??
      asRecord(item)?.imageUrl ??
      "",
  }));
}

function preserveVideoUrls(translated: unknown, source: unknown) {
  if (!Array.isArray(translated) || !Array.isArray(source)) {
    return source;
  }

  return translated.map((item, index) => ({
    ...(typeof item === "object" && item ? item : {}),
    videoId:
      asRecord(source[index])?.videoId ??
      asRecord(item)?.videoId ??
      "",
    thumbnailUrl:
      asRecord(source[index])?.thumbnailUrl ??
      asRecord(item)?.thumbnailUrl ??
      "",
  }));
}

function preserveBeforeAfterUrls(translated: unknown, source: unknown) {
  if (!translated || typeof translated !== "object" || !source || typeof source !== "object") {
    return source;
  }

  return {
    ...translated,
    beforeImageUrl: asRecord(source)?.beforeImageUrl,
    afterImageUrl: asRecord(source)?.afterImageUrl,
  };
}

function asRecord(value: unknown) {
  return value && typeof value === "object" ? (value as Record<string, string>) : null;
}
