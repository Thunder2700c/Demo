/* ============================================================
   Lightweight Markdown block parser (no external deps).
   Supports: headings, paragraphs, dividers, inline emphasis,
   and container "directives" that map to VN components.

   Directive grammar:
     ::: type key="value" key2="value2"
     body line one
     body line two
     :::

   Supported directive types: dialogue, impact, divider, scene
   ============================================================ */

export type DialogueVariant = "cyan" | "crimson";
export type ImpactEffect = "shake" | "shatter" | "glow";
export type Intensity = "low" | "high";

export interface DialogueBlock {
  type: "dialogue";
  speaker: string;
  variant: DialogueVariant;
  text: string;
}
export interface ImpactBlock {
  type: "impact";
  effect: ImpactEffect;
  intensity: Intensity;
  text: string;
}
export interface ParagraphBlock {
  type: "paragraph";
  text: string;
}
export interface HeadingBlock {
  type: "heading";
  level: number;
  text: string;
}
export interface DividerBlock {
  type: "divider";
}
export interface SceneBlock {
  type: "scene";
  label: string;
}

export type Block =
  | DialogueBlock
  | ImpactBlock
  | ParagraphBlock
  | HeadingBlock
  | DividerBlock
  | SceneBlock;

function parseAttrs(segment: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const re = /(\w+)\s*=\s*"([^"]*)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(segment)) !== null) {
    attrs[m[1]] = m[2];
  }
  return attrs;
}

export function parseBlocks(body: string): Block[] {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trim();

    // blank line
    if (line === "") {
      i++;
      continue;
    }

    // directive block
    if (line.startsWith(":::")) {
      const head = line.slice(3).trim();
      const [type, ...rest] = head.split(/\s+/);
      const attrs = parseAttrs(rest.join(" "));
      const content: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== ":::") {
        content.push(lines[i]);
        i++;
      }
      i++; // consume closing :::
      const text = content.join("\n").trim();

      if (type === "dialogue") {
        blocks.push({
          type: "dialogue",
          speaker: attrs.speaker || "???",
          variant: attrs.variant === "crimson" ? "crimson" : "cyan",
          text,
        });
      } else if (type === "impact") {
        const eff = attrs.effect as ImpactEffect;
        blocks.push({
          type: "impact",
          effect: eff === "shatter" || eff === "glow" ? eff : "shake",
          intensity: attrs.intensity === "high" ? "high" : "low",
          text,
        });
      } else if (type === "scene") {
        blocks.push({ type: "scene", label: attrs.label || text || "Scene" });
      } else {
        blocks.push({ type: "divider" });
      }
      continue;
    }

    // heading
    if (/^#{1,3}\s/.test(line)) {
      const level = (line.match(/^#+/) ?? [""])[0].length;
      const text = line.replace(/^#+\s/, "").trim();
      blocks.push({ type: "heading", level, text });
      i++;
      continue;
    }

    // paragraph (gather until blank line or directive)
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].trim().startsWith(":::") &&
      !/^#{1,3}\s/.test(lines[i].trim())
    ) {
      para.push(lines[i].trim());
      i++;
    }
    blocks.push({ type: "paragraph", text: para.join(" ") });
  }

  return blocks;
}

/** Plain-text extraction for search indexing & word counting. */
export function blocksToPlainText(blocks: Block[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case "dialogue":
          return `${b.speaker}: ${b.text}`;
        case "impact":
          return b.text;
        case "paragraph":
          return b.text;
        case "heading":
          return b.text;
        case "scene":
          return b.label;
        default:
          return "";
      }
    })
    .join("\n\n");
}
