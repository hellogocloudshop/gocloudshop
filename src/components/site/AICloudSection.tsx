import Link from "next/link";
import { ArrowRight, Bot, BrainCircuit, Cpu, Database, LineChart, MessageSquareText, ScanEye, Sparkles } from "lucide-react";
import type { Product } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "./ProductCard";

const AI_USE_CASES = [
  { icon: Sparkles, title: "Generative AI", description: "Infrastructure for generative AI development, experimentation, and production deployment." },
  { icon: BrainCircuit, title: "Machine Learning", description: "Compute resources for training and evaluating ML models at scale." },
  { icon: ScanEye, title: "Computer Vision", description: "Accounts optimized for vision-model workloads, including image and video analysis." },
  { icon: MessageSquareText, title: "Natural Language Processing", description: "Infrastructure for language-model projects, including NLP and LLM development." },
  { icon: Bot, title: "AI Agents", description: "Compute for building and running autonomous AI agents." },
  { icon: Cpu, title: "Model Development", description: "Development-tier AI accounts for building, testing, and iterating on models." },
  { icon: LineChart, title: "GPU Computing", description: "GPU-accelerated infrastructure for compute-intensive AI workloads." },
  { icon: Database, title: "Data Science", description: "Compute and credits for data-heavy AI workflows and analytics." },
];

export function AICloudSection({ products }: { products: Product[] }) {
  return (
    <section className="surface-dark relative py-20">
      <div className="bg-grid-pattern absolute inset-0 opacity-20" aria-hidden="true" />
      <div
        className="animate-glow pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-violet/25 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-page relative">
        <div className="flex flex-col items-center text-center">
          <SectionHeading
            eyebrow="AI Cloud"
            title="Power Your AI Projects"
            subtitle="Artificial intelligence and machine learning are transforming every industry. At Go Cloud Shop, we make it easy to access the infrastructure you need to build, train, and deploy AI models."
            tone="dark"
            align="center"
            className="mx-auto"
          />
          <Link href="/ai-cloud" className="btn-primary mt-6">
            Explore AI Cloud <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-14">
          <h3 className="text-center text-lg font-semibold text-white">Built for Modern AI Workloads</h3>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {AI_USE_CASES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="glass rounded-2xl p-5">
                <span className="icon-tile icon-tile-d">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h4 className="mt-4 text-sm font-semibold text-white">{title}</h4>
                <p className="mt-1.5 text-xs leading-relaxed text-white/60">{description}</p>
              </div>
            ))}
          </div>
        </div>

        {products.length > 0 && (
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} tone="dark" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
