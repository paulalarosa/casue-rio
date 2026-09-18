import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

const previa = SITE.includes("github.io") || SITE.includes("localhost");

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: previa
      ? [{ userAgent: "*", disallow: "/" }]
      : [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
