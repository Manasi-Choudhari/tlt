import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { trips } from "@/data/trips";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/trips", "/services", "/about", "/testimonials", "/contact"].map((p) => ({
    url: `${site.url}${p}`,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  const tripPages = trips.map((t) => ({
    url: `${site.url}/trips/${t.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));
  return [...pages, ...tripPages];
}
