import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const envPath = path.join(root, ".env");

async function loadEnv() {
  if (!existsSync(envPath)) {
    return;
  }

  const raw = await readFile(envPath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...rest] = trimmed.split("=");
    const value = rest.join("=").trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[key.trim()]) {
      process.env[key.trim()] = value;
    }
  }
}

const brandDirection = [
  "Premium Korean plastic surgery and aesthetic medicine website photography.",
  "Photorealistic editorial image, warm champagne highlights, deep burgundy shadow mood, ivory clinical accents.",
  "Elegant, calm, medically trustworthy, luxury clinic atmosphere.",
  "No text, no logo, no watermark, no UI, no frame.",
].join(" ");

const assets = [
  {
    file: "philosophy-portrait.jpg",
    size: "1024x1536",
    prompt:
      "Adult Korean woman in an aesthetic consultation studio, refined natural makeup, hands softly framing face, serene expression, neutral beige background, clinical beauty editorial portrait.",
  },
  {
    file: "clinic-interior.jpg",
    size: "1536x1024",
    prompt:
      "Luxury plastic surgery clinic consultation lounge in Seoul, warm indirect lighting, stone, walnut, ivory fabric, minimal medical elegance, empty room, architectural editorial photo.",
  },
  {
    file: "pillar-facial.jpg",
    size: "1536x1024",
    prompt:
      "Close portrait of an adult Korean woman with balanced facial proportions, clean skin, subtle contouring guide light, studio gray backdrop, high-end aesthetics campaign.",
  },
  {
    file: "pillar-body.jpg",
    size: "1536x1024",
    prompt:
      "Tasteful adult body contouring visual, woman in elegant modest ivory bodysuit seen from side and back, sculptural silhouette, soft studio light, non-explicit medical aesthetic campaign.",
  },
  {
    file: "pillar-regenerative.jpg",
    size: "1536x1024",
    prompt:
      "Aesthetic doctor wearing gloves performing gentle non-surgical skin rejuvenation with a modern device on an adult patient's face, clean clinic treatment room, calm medical realism.",
  },
  {
    file: "treatment-facial-balancing.jpg",
    size: "1024x1536",
    prompt:
      "Vertical treatment card photo, adult Korean woman receiving facial balancing consultation, doctor hands with gloves near cheek, soft clinical light, luxury aesthetic medicine.",
  },
  {
    file: "treatment-rhinoplasty.jpg",
    size: "1024x1536",
    prompt:
      "Vertical treatment card photo, adult Korean woman face three-quarter view with subtle white profile contour guide lines around nose, clean blue-gray studio, rhinoplasty consultation mood.",
  },
  {
    file: "treatment-body-contouring.jpg",
    size: "1024x1536",
    prompt:
      "Vertical treatment card photo, tasteful adult abdomen body contouring consultation with white surgical planning lines on skin, modest styling, warm studio lighting, non-explicit.",
  },
  {
    file: "treatment-skin-recovery.jpg",
    size: "1024x1536",
    prompt:
      "Vertical treatment card photo, close-up skin recovery facial treatment with hydrating serum and gloved clinician hand, clean spa clinic, premium skincare medical aesthetic.",
  },
  {
    file: "before-face.jpg",
    size: "1024x1024",
    prompt:
      "Clinical before image for an interactive comparison, adult Korean woman front-facing portrait, natural age lines and under-eye shadows, gentle surgical planning marker lines, neutral light, dignified and realistic.",
  },
  {
    file: "after-face.jpg",
    size: "1024x1024",
    prompt:
      "Clinical after image for an interactive comparison, adult Korean woman front-facing portrait, refreshed natural-looking skin and lifted facial balance, same neutral light and composition, dignified and realistic.",
  },
  {
    file: "doctor-director.jpg",
    size: "1024x1024",
    prompt:
      "Professional portrait of a Korean female plastic surgeon in a white coat, late 40s, calm confident gaze, premium clinic background, approachable medical authority.",
  },
  {
    file: "doctor-contour.jpg",
    size: "1024x1024",
    prompt:
      "Professional portrait of a Korean male plastic surgeon in a white coat, early 40s, body contouring specialist, warm clinic background, calm medical authority.",
  },
  {
    file: "doctor-skin.jpg",
    size: "1024x1024",
    prompt:
      "Professional portrait of a Korean female dermatologist aesthetic specialist in a white coat, late 30s, holding a small skincare vial, clean premium clinic background.",
  },
  {
    file: "doctor-balance.jpg",
    size: "1024x1024",
    prompt:
      "Professional portrait of a Korean female plastic surgeon in a white coat, early 40s, eye and nose facial balance specialist, calm confident expression, premium clinic consultation room background, medically trustworthy editorial portrait.",
  },
  {
    file: "consultation-face.jpg",
    size: "1536x1024",
    prompt:
      "Large horizontal close-up portrait of an adult Korean woman resting chin on hands, luminous skin, black background fading into warm burgundy, consultation campaign image.",
  },
  {
    file: "shop-products.jpg",
    size: "1536x1024",
    prompt:
      "Premium physician-curated skincare product lineup, serum bottles, recovery cream, retinol tube, cleanser, ivory and blush packaging on stone surface, no readable brand text.",
  },
  {
    file: "blog-consultation.jpg",
    size: "1536x1024",
    prompt:
      "Doctor consulting an adult Korean patient about facial aesthetics, warm professional clinic setting, friendly conversation, editorial blog header image.",
  },
  {
    file: "blog-laser.jpg",
    size: "1536x1024",
    prompt:
      "Modern laser skin treatment room, aesthetic device near adult patient face, clean light, medically calm, editorial blog header image.",
  },
  {
    file: "blog-recovery.jpg",
    size: "1536x1024",
    prompt:
      "Post-treatment skincare recovery still life with soft towels, serum drops, mirror, orchids, champagne and blush tones, editorial blog header image.",
  },
  {
    file: "newsletter.jpg",
    size: "2048x1152",
    prompt:
      "Cinematic close crop of lower face and collarbone of an adult Korean woman, elegant skincare glow, deep teal and burgundy background, newsletter banner, no text.",
  },
];

async function generateAsset(asset, apiKey) {
  const outDir = path.join(root, "public", "images");
  const outPath = path.join(outDir, asset.file);

  if (existsSync(outPath)) {
    console.log(`skip ${asset.file}`);
    return;
  }

  console.log(`generate ${asset.file}`);
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-2",
      prompt: `${brandDirection} ${asset.prompt}`,
      size: asset.size,
      quality: "medium",
      output_format: "jpeg",
      output_compression: 86,
      moderation: "auto",
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI image request failed for ${asset.file}: ${response.status} ${detail}`);
  }

  const result = await response.json();
  const b64 = result?.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error(`No image data returned for ${asset.file}`);
  }

  await writeFile(outPath, Buffer.from(b64, "base64"));
}

await loadEnv();

const apiKey =
  process.env.OPENAI_API_KEY ||
  process.env.OPEN_API_SCRET_KEY ||
  process.env.OPENAI_API_SECRET_KEY;

if (!apiKey) {
  throw new Error("Missing OPENAI_API_KEY or OPEN_API_SCRET_KEY in .env");
}

await mkdir(path.join(root, "public", "images"), { recursive: true });

for (const asset of assets) {
  await generateAsset(asset, apiKey);
}
