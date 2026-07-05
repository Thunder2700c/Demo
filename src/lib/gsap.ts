import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register once; safe to import from any client component.
gsap.registerPlugin(ScrollTrigger, useGSAP);
// Quiet React strict-mode double-invoke noise during dev.
gsap.config({ nullTargetWarn: false });

export { gsap, ScrollTrigger, useGSAP };
