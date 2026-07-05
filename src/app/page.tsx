import { CircuitBackground } from "@/components/CircuitBackground";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { HeroSequence } from "@/components/HeroSequence";
import { SearchHub } from "@/components/SearchHub";
import { StatsPanel } from "@/components/StatsPanel";
import { MatrixNavigator } from "@/components/MatrixNavigator";
import { Reveal } from "@/components/Reveal";
import { ProseRenderer } from "@/components/ProseRenderer";
import { getChapterSummaries, getStats } from "@/lib/chapters";
import type { Block } from "@/lib/markdown";

const teaser: Block[] = [
  {
    type: "paragraph",
    text: "The boundary of the War bent. Steel answered steel somewhere above the rooftops of Fuyuki, and the whole city tasted of ozone and burnt iron.",
  },
  {
    type: "dialogue",
    speaker: "Saber",
    variant: "cyan",
    text: "\u201CI ask of you \u2014 are you my Master?\u201D",
  },
  {
    type: "impact",
    effect: "shatter",
    intensity: "high",
    text: "THE LOOP MUST CLOSE",
  },
];

function SectionHeading({
  kicker,
  title,
  desc,
}: {
  kicker: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="mb-9 text-center">
      <p className="font-ui text-[0.62rem] uppercase tracking-[0.4em] text-circuit/70">
        {kicker}
      </p>
      <h2 className="mt-3 font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
        {title}
      </h2>
      {desc && (
        <p className="mx-auto mt-3 max-w-xl font-prose text-sm leading-relaxed text-ether-dim">
          {desc}
        </p>
      )}
    </div>
  );
}

export default function HomePage() {
  const summaries = getChapterSummaries();
  const stats = getStats();
  const latest = summaries.slice(-3).reverse();

  return (
    <>
      <CircuitBackground />
      <SiteHeader />
      <main>
        <HeroSequence />

        {/* Lightning Search */}
        <section className="mx-auto max-w-5xl px-5 py-20 sm:px-6">
          <Reveal>
            <SectionHeading
              kicker="04.2 · Search Hub"
              title="Lightning Search"
              desc="A compile-time index runs entirely in your browser. Type a fragment of a name, a Noble Phantasm, a line half-remembered — matches snap into view, deep-linked to the exact paragraph."
            />
            <SearchHub />
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {["Saber", "Command Spell", "Grail", "ozone", "loop", "Lancer"].map(
                (t) => (
                  <span
                    key={t}
                    className="rounded-full border border-ether/10 px-3 py-1 font-ui text-[0.62rem] uppercase tracking-widest text-ether-dim"
                  >
                    {t}
                  </span>
                ),
              )}
            </div>
          </Reveal>
        </section>

        {/* Stats */}
        <section className="mx-auto max-w-5xl px-5 py-12 sm:px-6">
          <Reveal>
            <SectionHeading
              kicker="04.1 · System Telemetry"
              title="The Archive, In Numbers"
            />
            <StatsPanel
              totalChapters={stats.totalChapters}
              totalWords={stats.totalWords}
              totalReadMinutes={stats.totalReadMinutes}
              latestTimeline={stats.latestTimeline}
              volumes={stats.volumes}
            />
          </Reveal>
        </section>

        {/* Matrix Navigator */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6">
          <Reveal>
            <SectionHeading
              kicker="The Matrix Navigator"
              title="Latest Transmissions"
              desc="Your progress through the loop is remembered here, in this browser, and nowhere else."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <MatrixNavigator chapters={latest} />
          </Reveal>
          <div className="mt-8 text-center">
            <a
              href="/chapters"
              className="inline-flex items-center gap-2 font-ui text-xs font-semibold uppercase tracking-widest text-circuit transition-colors hover:text-white"
            >
              View Full Archive
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        </section>

        {/* The Experience — live VN component showcase */}
        <section className="mx-auto max-w-2xl px-5 py-20 sm:px-6">
          <Reveal>
            <SectionHeading
              kicker="06 · Component Blueprint"
              title="A Page That Breathes"
              desc="Chapters are pure Markdown enriched with interactive Visual Novel components. This is not a screenshot — it is the live engine."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <article className="font-prose text-[17px]">
              <ProseRenderer blocks={teaser} />
            </article>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
