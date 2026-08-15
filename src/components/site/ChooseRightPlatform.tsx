import { Fragment } from "react";
import { Layers } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CHOOSE_PLATFORM_PARAGRAPHS, HIGHLIGHTED_PLATFORM_NAMES } from "@/config/homepageContent";

/** Wraps every occurrence of a known platform name in an accent span —
 *  visual-only highlighting, the sentence text itself is untouched. */
function highlightPlatformNames(text: string) {
  const pattern = new RegExp(`(${HIGHLIGHTED_PLATFORM_NAMES.join("|")})`, "g");
  const parts = text.split(pattern);
  return parts.map((part, index) =>
    HIGHLIGHTED_PLATFORM_NAMES.includes(part) ? (
      <strong key={index} className="font-semibold text-sky-accent">
        {part}
      </strong>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    )
  );
}

export function ChooseRightPlatform() {
  const [firstParagraph, ...restParagraphs] = CHOOSE_PLATFORM_PARAGRAPHS;

  return (
    <section className="container-page py-16 sm:py-20">
      <SectionHeading
        eyebrow="Educational Guide"
        title="Choose the Right Cloud Platform"
        subtitle="Every provider in our catalog is built for different workloads — here's how to match one to your project."
        align="center"
        className="mx-auto"
      />
      <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="card-surface p-6 sm:p-8">
          <span className="icon-tile icon-tile-a">
            <Layers className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="mt-4 leading-relaxed text-ink-muted">{highlightPlatformNames(firstParagraph)}</p>
        </div>
        <div className="flex flex-col gap-6">
          {restParagraphs.map((paragraph, index) => (
            <div key={index} className="card-surface p-6 sm:p-8">
              <p className="leading-relaxed text-ink-muted">{highlightPlatformNames(paragraph)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
