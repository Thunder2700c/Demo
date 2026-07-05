import { Fragment, type ReactNode } from "react";
import { DialogueBox } from "./DialogueBox";
import { ImpactText } from "./ImpactText";
import type { Block } from "@/lib/markdown";

interface ProseRendererProps {
  blocks: Block[];
  vnMode?: boolean;
  paragraphIndexPrefix?: string;
}

/** Minimal inline formatter: **bold**, *italic*. */
function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  // Tokenize on **...** and *...*
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const token = m[0];
    if (token.startsWith("**")) {
      nodes.push(
        <strong key={key++} className="font-semibold text-white">
          {token.slice(2, -2)}
        </strong>,
      );
    } else {
      nodes.push(
        <em key={key++} className="italic text-ether">
          {token.slice(1, -1)}
        </em>,
      );
    }
    last = m.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function ProseRenderer({
  blocks,
  vnMode = false,
  paragraphIndexPrefix = "p",
}: ProseRendererProps) {
  let paraCount = 0;

  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "scene":
            return (
              <div key={i} className="my-12 flex items-center gap-4">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-circuit/50" />
                <span className="font-ui text-[0.7rem] uppercase tracking-[0.35em] text-circuit/80">
                  {block.label}
                </span>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-circuit/50" />
              </div>
            );

          case "heading": {
            const sizes = ["text-2xl", "text-xl", "text-lg"];
            const cls = sizes[Math.min(block.level - 1, 2)] ?? "text-lg";
            return (
              <h2
                key={i}
                className={`mt-10 mb-3 font-display ${cls} font-semibold uppercase tracking-wide text-white`}
              >
                {block.text}
              </h2>
            );
          }

          case "paragraph": {
            const id = `${paragraphIndexPrefix}-${paraCount}`;
            paraCount++;
            return (
              <p
                key={i}
                id={id}
                className="mb-5 scroll-mt-28 leading-[1.95] text-ether"
                style={{ textIndent: "1.4em" }}
              >
                {renderInline(block.text)}
              </p>
            );
          }

          case "dialogue":
            return (
              <DialogueBox
                key={i}
                speaker={block.speaker}
                text={block.text}
                variant={block.variant}
                typewriter={vnMode}
              />
            );

          case "impact":
            return (
              <ImpactText
                key={i}
                text={block.text}
                effect={block.effect}
                intensity={block.intensity}
              />
            );

          case "divider":
            return (
              <div key={i} className="my-12 flex items-center justify-center gap-3">
                <span className="h-1.5 w-1.5 rotate-45 bg-circuit/70" />
                <span className="h-1.5 w-1.5 rotate-45 bg-crimson/70" />
                <span className="h-1.5 w-1.5 rotate-45 bg-circuit/70" />
              </div>
            );

          default:
            return <Fragment key={i} />;
        }
      })}
    </>
  );
}
