import { ImageResponse } from "next/og";
import { isLocale, localeLabels, type Locale } from "@/i18n/config";
import { siteName } from "@/lib/seo";

export const runtime = "edge";
export const alt = "주식회사 럿지 병원 홈페이지 제작";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function CompanyOpenGraphImage({ params }: { params: { locale: string } }) {
  const locale = isLocale(params.locale) ? params.locale : "ko";
  const copy = ogCopy[locale];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(circle at 24% 18%, rgba(214,47,85,0.28), transparent 32%), radial-gradient(circle at 88% 76%, rgba(222,196,123,0.2), transparent 30%), linear-gradient(135deg, #0d0b0c 0%, #1f1715 48%, #3b0719 100%)",
          color: "#fff8ef",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 42,
            border: "1px solid rgba(222,196,123,0.34)",
            borderRadius: 26,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 68,
            top: 66,
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "#dec47b",
            fontFamily: "Arial, sans-serif",
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: 3,
          }}
        >
          <FlowerMark />
          <span>{localeLabels[locale]}</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "76px 92px",
            width: "78%",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              color: "#dec47b",
              fontFamily: "Arial, sans-serif",
              fontSize: 24,
              fontWeight: 900,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            <span>LUDGI Inc.</span>
            <span>Software Development Partner</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 46,
              fontSize: 78,
              lineHeight: 0.98,
              maxWidth: 820,
            }}
          >
            <span>{copy.titleA}</span>
            <span style={{ color: "#dec47b" }}>{copy.titleB}</span>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 34,
              fontSize: 25,
              lineHeight: 1.48,
              color: "#d9d0c9",
              maxWidth: 810,
              fontFamily: "Arial, sans-serif",
            }}
          >
            {copy.description}
          </div>
          <div
            style={{
              display: "flex",
              gap: 14,
              marginTop: 42,
              fontFamily: "Arial, sans-serif",
              fontSize: 18,
              fontWeight: 800,
            }}
          >
            {copy.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  border: "1px solid rgba(255,248,239,0.18)",
                  borderRadius: 999,
                  padding: "11px 18px",
                  background: "rgba(255,248,239,0.06)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 34,
              color: "#fff8ef",
              fontFamily: "Arial, sans-serif",
              fontSize: 21,
              fontWeight: 800,
            }}
          >
            {siteName} × 주식회사 럿지
          </div>
        </div>
      </div>
    ),
    size,
  );
}

const ogCopy: Record<Locale, { titleA: string; titleB: string; description: string; tags: string[] }> = {
  ko: {
    titleA: "병원 홈페이지 제작",
    titleB: "성형외과 홈페이지 제작",
    description: "주식회사 럿지의 Next.js 기반 의료 홈페이지, SEO, 관리자 CMS, 상담 전환 UX 제작 안내",
    tags: ["럿지", "주식회사 럿지", "홈페이지 제작", "아웃소싱"],
  },
  en: {
    titleA: "Hospital Website",
    titleB: "Production Partner",
    description: "LUDGI Inc. builds clinic websites, multilingual SEO, admin CMS, and consultation conversion flows.",
    tags: ["LUDGI", "Medical Web", "Next.js", "Outsourcing"],
  },
  zh: {
    titleA: "医院网站制作",
    titleB: "整形外科网站制作",
    description: "LUDGI Inc. 提供医疗网站、多语言 SEO、后台 CMS 与咨询转化流程制作。",
    tags: ["LUDGI", "医院网站", "SEO", "外包"],
  },
  ja: {
    titleA: "病院ホームページ制作",
    titleB: "美容外科サイト制作",
    description: "LUDGI Inc. は医療サイト、多言語 SEO、管理 CMS、問い合わせ導線を制作します。",
    tags: ["LUDGI", "医療サイト", "SEO", "外注"],
  },
};

function FlowerMark() {
  return (
    <div
      style={{
        width: 38,
        height: 38,
        display: "flex",
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {[0, 45, 90, 135].map((degree) => (
        <div
          key={degree}
          style={{
            position: "absolute",
            width: 16,
            height: 34,
            border: "2px solid #dec47b",
            borderRadius: 999,
            transform: `rotate(${degree}deg)`,
          }}
        />
      ))}
      <div
        style={{
          width: 9,
          height: 9,
          borderRadius: 999,
          background: "#d62f55",
          border: "2px solid rgba(255,248,239,0.72)",
        }}
      />
    </div>
  );
}
