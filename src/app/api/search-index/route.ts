import { getAllChapters } from "@/lib/chapters";
import type { ChapterIndex } from "@/lib/search";

// Pre-built at build time (static). The client fetches this once and builds a
// FlexSearch index in memory, so searches never touch the network again.
export const dynamic = "force-static";

export async function GET() {
  const chapters: ChapterIndex[] = getAllChapters()
    .sort((a, b) => a.volume - b.volume || a.chapterNumber - b.chapterNumber)
    .map((c) => {
      let idx = 0;
      const paragraphs: { idx: number; text: string }[] = [];
      for (const b of c.blocks) {
        if (b.type === "paragraph") {
          paragraphs.push({ idx, text: b.text });
          idx++;
        }
      }
      return {
        slug: c.slug,
        title: c.title,
        synopsis: c.synopsis,
        tags: c.tags,
        timeline: c.timeline,
        paragraphs,
      };
    });

  return Response.json(chapters);
}
