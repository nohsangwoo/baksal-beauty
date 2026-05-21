import type { MetadataRoute } from "next";
import { absoluteUrl, siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/ko/admin",
          "/ko/admin/",
          "/en/admin",
          "/en/admin/",
          "/zh/admin",
          "/zh/admin/",
          "/ja/admin",
          "/ja/admin/",
          "/ko/testadmin",
          "/ko/testadmin/",
          "/en/testadmin",
          "/en/testadmin/",
          "/zh/testadmin",
          "/zh/testadmin/",
          "/ja/testadmin",
          "/ja/testadmin/",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteUrl,
  };
}
