// Verbatim Homepage marketing copy supplied by the business (the "master
// content" brief). Kept in one place, word-for-word, so every section
// component just renders it — nothing here should be edited/shortened
// without also updating the source brief. Presentation-only: none of this
// touches product/provider/database data.

export const HERO_CONTENT = {
  eyebrow: "Cloud Access, Simplified.",
  heading: "Go Cloud Shop – Cloud Access. Simplified.",
  subheading: "Explore Verified Cloud Accounts from Leading Providers",
  paragraphs: [
    "Welcome to Go Cloud Shop – a straightforward cloud account marketplace where you can explore, compare, and purchase verified cloud infrastructure from multiple providers. Whether you need a Buy AWS Account for AI workloads, Buy Google Cloud Accounts for data analytics, or Buy DigitalOcean Accounts for development projects, we simplify access to the cloud platforms that power modern businesses.",
    "We understand the frustration of setting up cloud accounts through official channels. Credit card rejections, identity verification delays, regional restrictions, and service limit approvals can take days or even weeks. That's why we built this marketplace – to help you get started faster with verified accounts that are ready to use.",
  ],
};

export const WHY_CHOOSE_CARDS: { title: string; description: string }[] = [
  {
    title: "Wide Provider Selection",
    description:
      "Access nine leading cloud platforms in one marketplace. Compare AWS, Google Cloud, Azure, DigitalOcean, Oracle Cloud, Linode, IBM Cloud, Kamatera, and Alibaba Cloud without visiting multiple websites.",
  },
  {
    title: "Different Account Configurations",
    description:
      "Find standard accounts, aged accounts with established history, credit-loaded accounts, AI-enabled accounts, compute accounts, and free trial options across multiple providers.",
  },
  {
    title: "Clear Product Information",
    description:
      "Every listing includes detailed specifications, region availability, account type, and delivery information. No vague descriptions or hidden details.",
  },
  {
    title: "Availability Updates",
    description:
      "Product listings show current availability status, so you can identify which accounts and configurations are ready for immediate delivery.",
  },
  {
    title: "Fast Communication",
    description:
      "Our support team is available through Telegram and live chat. Real people who understand cloud infrastructure respond quickly to questions and order inquiries.",
  },
  {
    title: "Professional Customer Support",
    description:
      "We provide assistance with first login, MFA configuration, account setup, and initial resource deployment. Support continues after the sale, not just before it.",
  },
  {
    title: "Easy Account Selection",
    description:
      "Browse by provider, account type, or use case. Compare options side by side to find the configuration that matches your specific requirements.",
  },
];

export const CHOOSE_PLATFORM_PARAGRAPHS: string[] = [
  "Different cloud platforms serve different purposes. AWS provides the broadest service catalog and is suitable for almost any workload. Google Cloud excels in data analytics and machine learning, with strong capabilities in BigQuery and Vertex AI. Azure integrates seamlessly with Microsoft ecosystems and offers hybrid cloud solutions. DigitalOcean and Linode provide simpler, more affordable infrastructure for developers and small businesses.",
  "Oracle Cloud offers competitive pricing for enterprise workloads with a generous free tier. IBM Cloud combines infrastructure with watsonx AI capabilities and enterprise-grade security. Kamatera provides flexible pay-per-second billing and unrestricted port 25 access. Alibaba Cloud offers strong coverage across Asia-Pacific markets.",
  "Consider your compute requirements, storage needs, development environment, AI/ML workloads, regional availability, and business requirements when choosing a platform. Our catalog covers all these providers, allowing you to compare and select the right infrastructure for your project.",
];

// Provider names to visually highlight wherever they appear inside
// CHOOSE_PLATFORM_PARAGRAPHS — longer names first so e.g. "Google Cloud"
// matches before a bare "Cloud" ever could.
export const HIGHLIGHTED_PLATFORM_NAMES = [
  "Oracle Cloud",
  "Google Cloud",
  "IBM Cloud",
  "Alibaba Cloud",
  "DigitalOcean",
  "Kamatera",
  "Linode",
  "Azure",
  "AWS",
];

export const ACCOUNT_OPTIONS: { title: string; description: string }[] = [
  {
    title: "Cloud Credit Accounts",
    description:
      "Pre-loaded with promotional credits from $300 to $100K. Reduce infrastructure costs with accounts that include credits ready to use immediately.",
  },
  {
    title: "AI-Ready Accounts",
    description:
      "Configured with AI services already enabled. Includes access to Amazon Bedrock, SageMaker, Azure OpenAI, Google Vertex AI, and watsonx depending on the provider.",
  },
  {
    title: "Compute Accounts",
    description: "Optimized for compute-intensive workloads. Available configurations range from 8 vCPU to 512 vCPU across supported providers.",
  },
  {
    title: "Free Trial Accounts",
    description: "Access limited-time free trials with promotional credits. Available for selected providers including Oracle Cloud, IBM Cloud, and others.",
  },
  {
    title: "Aged Accounts",
    description: "Accounts with established activity history. These generally have higher service limits and reduced verification flags.",
  },
  {
    title: "Port-25-Open Accounts",
    description: "Configured for email server operations. Available for DigitalOcean, Linode, Kamatera, and other selected providers.",
  },
];

export const ACCOUNT_OPTIONS_DISCLAIMER =
  "Availability varies by provider and configuration. Check individual product listings for current availability status.";

export const HOMEPAGE_FAQS: { question: string; answer: string }[] = [
  {
    question: "What cloud providers are available on your marketplace?",
    answer:
      "We offer verified accounts from nine leading providers: Amazon Web Services, Google Cloud, Microsoft Azure, DigitalOcean, Oracle Cloud, Linode, IBM Cloud, Kamatera, and Alibaba Cloud. Each provider offers different account types and configurations.",
  },
  {
    question: "Are the accounts verified before delivery?",
    answer:
      "Yes. Every account undergoes full verification including identity verification, billing verification, and security confirmation before delivery. We do not ship partial setups or unverified credentials.",
  },
  {
    question: "What types of accounts do you offer?",
    answer:
      "Our catalog includes standard accounts, aged accounts, credit-loaded accounts, AI-enabled accounts, compute accounts, free trial accounts, and port-25-open accounts. Availability depends on the specific provider.",
  },
  {
    question: "How do I choose the right cloud provider?",
    answer:
      "Consider your workload requirements: compute needs, storage capacity, AI/ML workloads, regional availability, and budget. AWS offers the broadest service catalog. Google Cloud excels in data analytics. Azure integrates with Microsoft ecosystems. DigitalOcean and Linode are simpler and more affordable. Our marketplace allows you to compare options across providers.",
  },
  {
    question: "What is included with cloud credit accounts?",
    answer:
      "Cloud credit accounts come with promotional credits already applied. The credits can be used for most services on the platform. Credit amounts vary by provider, ranging from $300 to $100K depending on the product.",
  },
  {
    question: "What are aged cloud accounts?",
    answer:
      "Aged accounts have been active for an extended period, typically several months to years. They generally have established activity history, higher service limits, and are less likely to encounter verification flags.",
  },
  {
    question: "Do you offer replacement guarantees?",
    answer:
      "Yes. Every account we sell includes a lifetime free replacement guarantee. If anything goes wrong with the account after delivery, we replace it without additional charges or delays.",
  },
  {
    question: "How quickly will I receive my account?",
    answer:
      "Most accounts are delivered within 5–10 minutes of order confirmation. Some specialized configurations may take longer, but we provide updates throughout the process.",
  },
  {
    question: "How can I contact support?",
    answer:
      "Our support team is available through Telegram and live chat. We provide assistance with account setup, MFA configuration, and initial resource deployment. Our team responds promptly to all inquiries.",
  },
];

export const FINAL_CTA_CONTENT = {
  heading: "Ready to Explore Cloud Accounts?",
  paragraph:
    "Browse our marketplace to find the right cloud account for your project. Compare providers, configurations, and pricing across our catalog. If you need help selecting the right option, our support team is available through Telegram and live chat to assist you.",
  tagline: "Go Cloud Shop – Cloud Access. Simplified.",
};
