import type { Metadata } from "next";
import { CircuitBackground } from "@/components/CircuitBackground";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SearchHub } from "@/components/SearchHub";
import { Reveal } from "@/components/Reveal";
import { ChapterArchive } from "@/components/ChapterArchive";
import { getChapterSummaries, getStats } from "@/lib/chapters";

export const metadata: Metadata = {
  title: "Chapter Archive",
  description: "Every transmission of the Seventh Holy Grail War, indexed.",
};

export default function ChaptersPage() {
  const summaries = getChapterSummaries();
  const stats = getStats();

  return (
    <>
      <CircuitBackground rain={false} />
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5 pb-24 pt-28 sm:px-6 sm:pt-32">
        <Reveal>
          <div className="text-center">
            <p className="font-ui text-[0.62rem] uppercase tracking-[0.4em] text-circuit/70">
              The Full Record
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold uppercase tracking-wide text-white text-glow sm:text-4xl">
              Chapter Archive
            </h1>
            <p className="mx-auto mt-3 max-w-lg font-prose text-sm leading-relaxed text-ether-dim">
              {stats.totalChapters} chapters · {stats.totalWords.toLocaleString()}{" "}
              words across {stats.volumes} volume
              {stats.volumes > 1 ? "s" : ""}. Begin anywhere — the loop will find
              you.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mx-auto mt-10 max-w-xl">
            <SearchHub />
          </div>
        </Reveal>

        <div className="mt-14">
          <ChapterArchive summaries={summaries} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
