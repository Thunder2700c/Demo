import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CircuitBackground } from "@/components/CircuitBackground";
import { ReaderInterface } from "@/components/ReaderInterface";
import { getAllChapters, getChapterBySlug, getChapterNeighbors } from "@/lib/chapters";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllChapters().map((c) => ({ slug: c.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return (async () => {
    const { slug } = await params;
    const chapter = getChapterBySlug(slug);
    if (!chapter) return { title: "Chapter Not Found" };
    return {
      title: chapter.title,
      description: chapter.synopsis,
    };
  })();
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chapter = getChapterBySlug(slug);
  if (!chapter) notFound();

  const neighbors = getChapterNeighbors(slug);

  return (
    <>
      <CircuitBackground rain={false} />
      <ReaderInterface
        chapter={{
          slug: chapter.slug,
          title: chapter.title,
          volume: chapter.volume,
          chapterNumber: chapter.chapterNumber,
          timeline: chapter.timeline,
          wordCount: chapter.wordCount,
          estReadMinutes: chapter.estReadMinutes,
          tags: chapter.tags,
        }}
        blocks={chapter.blocks}
        prev={neighbors.prev}
        next={neighbors.next}
      />
    </>
  );
}
