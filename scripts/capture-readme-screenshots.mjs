import { spawn } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = join(root, "public", "readme");
const profileDir = join(root, ".next", "readme-chrome-profile");
const port = 9224;
const baseUrl = process.env.README_CAPTURE_BASE_URL ?? "http://localhost:3000";
const chromePath =
  process.env.CHROME_PATH ??
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const targets = [
  {
    name: "home",
    url: "/ko",
    waitAfterLoad: 2200,
    maxHeight: 1900,
  },
  {
    name: "services",
    url: "/ko/service",
    waitAfterLoad: 1200,
    maxHeight: 2200,
  },
  {
    name: "service-detail",
    url: "/ko/service/natural-eye-design",
    waitAfterLoad: 1200,
    maxHeight: 3000,
  },
  {
    name: "inquire",
    url: "/ko/inquire",
    waitAfterLoad: 1000,
    maxHeight: 2200,
  },
  {
    name: "company",
    url: "/ko/company",
    waitAfterLoad: 1000,
    maxHeight: 2800,
  },
  {
    name: "testadmin-blog",
    url: "/ko/testadmin",
    waitAfterLoad: 900,
    maxHeight: 3000,
    afterLoad: async (page) => {
      await page.evaluate("document.querySelector('form button[type=submit]')?.click()");
      await sleep(500);
      await page.evaluate("[...document.querySelectorAll('button')].find((button) => button.textContent?.includes('Blog'))?.click()");
      await sleep(700);
      await page.evaluate(`
        const input = document.querySelector('[aria-label=\"Blog article title\"]');
        if (input) {
          input.value = '병원 홈페이지 SEO 구조 - 비주얼 편집 데모';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      `);
      await sleep(300);
    },
  },
  {
    name: "testadmin-inquire",
    url: "/ko/testadmin",
    waitAfterLoad: 900,
    maxHeight: 3000,
    afterLoad: async (page) => {
      await page.evaluate("document.querySelector('form button[type=submit]')?.click()");
      await sleep(500);
      await page.evaluate("[...document.querySelectorAll('button')].find((button) => button.textContent?.includes('Inquire'))?.click()");
      await sleep(700);
      await page.evaluate(`
        const input = document.querySelector('[aria-label=\"Inquiry title\"]');
        if (input) {
          input.value = '성형외과 홈페이지 제작 문의 - 답변 관리 데모';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      `);
      await sleep(300);
    },
  },
];

function sleep(ms) {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  await rm(profileDir, { recursive: true, force: true });

  const chrome = spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profileDir}`,
    "about:blank",
  ], {
    stdio: "ignore",
    windowsHide: true,
  });

  try {
    await waitForChrome();

    for (const target of targets) {
      const page = await createPage(`${baseUrl}${target.url}`);
      await page.send("Emulation.setDeviceMetricsOverride", {
        width: 1440,
        height: 1100,
        deviceScaleFactor: 1,
        mobile: false,
      });
      await page.send("Page.enable");
      await page.send("Runtime.enable");
      await page.send("Page.navigate", { url: `${baseUrl}${target.url}` });
      await page.waitForEvent("Page.loadEventFired", 15000);
      await sleep(target.waitAfterLoad ?? 1000);

      if (target.afterLoad) {
        await target.afterLoad(page);
      }

      const metrics = await page.send("Page.getLayoutMetrics");
      const height = Math.min(Math.ceil(metrics.cssContentSize.height), target.maxHeight ?? 7200);
      await page.send("Emulation.setDeviceMetricsOverride", {
        width: 1440,
        height,
        deviceScaleFactor: 1,
        mobile: false,
      });
      await sleep(350);

      const screenshot = await page.send("Page.captureScreenshot", {
        format: "jpeg",
        quality: 82,
        captureBeyondViewport: true,
        fromSurface: true,
        clip: {
          x: 0,
          y: 0,
          width: 1440,
          height,
          scale: 1,
        },
      });

      const filePath = join(outputDir, `${target.name}.jpg`);
      await writeFile(filePath, Buffer.from(screenshot.data, "base64"));
      await page.close();
      console.log(`captured ${filePath}`);
    }
  } finally {
    chrome.kill();
  }
}

async function waitForChrome() {
  const deadline = Date.now() + 15000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) {
        return;
      }
    } catch {
      // Chrome is still starting.
    }
    await sleep(250);
  }

  throw new Error("Chrome remote debugging endpoint did not start.");
}

async function createPage(url) {
  const response = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`, {
    method: "PUT",
  });
  const target = await response.json();
  return new CdpPage(target.webSocketDebuggerUrl);
}

class CdpPage {
  constructor(webSocketUrl) {
    this.webSocket = new WebSocket(webSocketUrl);
    this.nextId = 1;
    this.pending = new Map();
    this.events = new Map();

    this.ready = new Promise((resolveReady, rejectReady) => {
      this.webSocket.addEventListener("open", resolveReady, { once: true });
      this.webSocket.addEventListener("error", rejectReady, { once: true });
    });

    this.webSocket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data.toString());

      if (message.id && this.pending.has(message.id)) {
        const { resolveSend, rejectSend } = this.pending.get(message.id);
        this.pending.delete(message.id);

        if (message.error) {
          rejectSend(new Error(message.error.message));
        } else {
          resolveSend(message.result ?? {});
        }
        return;
      }

      if (message.method && this.events.has(message.method)) {
        for (const listener of this.events.get(message.method)) {
          listener(message.params ?? {});
        }
      }
    });
  }

  async send(method, params = {}) {
    await this.ready;
    const id = this.nextId++;
    this.webSocket.send(JSON.stringify({ id, method, params }));

    return new Promise((resolveSend, rejectSend) => {
      this.pending.set(id, { resolveSend, rejectSend });
    });
  }

  async evaluate(expression) {
    return this.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      userGesture: true,
    });
  }

  async waitForEvent(method, timeoutMs) {
    await this.ready;

    return new Promise((resolveEvent, rejectEvent) => {
      const timeout = setTimeout(() => {
        rejectEvent(new Error(`Timed out waiting for ${method}`));
      }, timeoutMs);

      const listener = (params) => {
        clearTimeout(timeout);
        this.events.set(
          method,
          (this.events.get(method) ?? []).filter((item) => item !== listener),
        );
        resolveEvent(params);
      };

      this.events.set(method, [...(this.events.get(method) ?? []), listener]);
    });
  }

  close() {
    this.webSocket.close();
  }
}

await main();
