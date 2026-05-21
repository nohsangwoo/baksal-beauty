import { ImageResponse } from "next/og";
import { siteName } from "@/lib/seo";

export const runtime = "edge";
export const alt = "BAKSAL BEAUTY Plastic Surgery";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
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
            "radial-gradient(circle at 30% 20%, rgba(214,47,85,0.26), transparent 34%), linear-gradient(135deg, #0d0b0c 0%, #1f1715 45%, #3b0719 100%)",
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
            right: -120,
            top: -110,
            width: 420,
            height: 420,
            borderRadius: 999,
            border: "2px solid rgba(222,196,123,0.2)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 96,
            bottom: 82,
            width: 230,
            height: 230,
            borderRadius: 999,
            border: "1px solid rgba(255,248,239,0.12)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "76px 92px",
            width: "76%",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              color: "#dec47b",
              fontSize: 30,
              letterSpacing: 2,
            }}
          >
            <FlowerMark />
            <span>{siteName}</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 54,
              fontSize: 86,
              lineHeight: 0.95,
              letterSpacing: -1,
              maxWidth: 760,
            }}
          >
            <span>Refined Beauty.</span>
            <span>Surgical Precision.</span>
          </div>
          <div
            style={{
              marginTop: 34,
              fontSize: 26,
              lineHeight: 1.5,
              color: "#d9d0c9",
              maxWidth: 760,
              fontFamily: "Arial, sans-serif",
            }}
          >
            Structure-led aesthetic consultation, thoughtful surgical planning,
            and recovery-aware care.
          </div>
          <div
            style={{
              display: "flex",
              gap: 14,
              marginTop: 44,
              fontFamily: "Arial, sans-serif",
              fontSize: 18,
              fontWeight: 800,
              color: "#fff8ef",
            }}
          >
            {["눈성형", "Rhinoplasty", "美容医療", "面部提升"].map((item) => (
              <span
                key={item}
                style={{
                  border: "1px solid rgba(255,248,239,0.18)",
                  borderRadius: 999,
                  padding: "11px 18px",
                  background: "rgba(255,248,239,0.06)",
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}

function FlowerMark() {
  return (
    <div
      style={{
        width: 54,
        height: 54,
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
            width: 23,
            height: 48,
            border: "2px solid #dec47b",
            borderRadius: 999,
            transform: `rotate(${degree}deg)`,
          }}
        />
      ))}
      <div
        style={{
          width: 13,
          height: 13,
          borderRadius: 999,
          background: "#d62f55",
          border: "2px solid rgba(255,248,239,0.72)",
        }}
      />
    </div>
  );
}
