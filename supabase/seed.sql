-- GoCloudShop — reference seed data
-- Run after 0001_init.sql, 0002_rls.sql, 0003_storage.sql, 0004_newsletter.sql
-- (via `supabase db push` or pasted into the Supabase SQL editor).
--
-- This mirrors src/lib/mock-data.ts row-for-row (same providers, products,
-- variations, prices, badges, features, comparisons, use cases, guides and
-- FAQs) so the storefront looks identical whether or not Supabase is
-- connected yet. None of this is permanent — every value is editable from
-- /admin once you've created your first admin user (see README).

-- ---------------------------------------------------------------------------
-- site_settings (singleton)
-- whatsapp_number and telegram_channel_url are the real values provided by
-- the site owner (+1 (404) 203-0453, https://t.me/cloudaccountstock),
-- whatsapp_number stored digits-only per the ContactChannels convention.
-- ---------------------------------------------------------------------------

insert into site_settings (id, site_name, tagline, telegram_username, whatsapp_number, telegram_channel_url, support_email, default_seo, privacy_policy, terms_of_service, refund_policy, disclaimer)
values (
  1,
  'GoCloudShop',
  'Cloud Access. Simplified.',
  'GoCloudShopSupport',
  '14042030453',
  'https://t.me/cloudaccountstock',
  'hellogocloudshop@gmail.com',
  '{"title": "GoCloudShop — Cloud Accounts & AI Cloud, Made Simple", "description": "Explore cloud accounts, AI-ready infrastructure, cloud credits and compute solutions from multiple providers — with clear pricing, detailed specifications and responsive support."}'::jsonb,
  'GoCloudShop collects only the information you provide when contacting support or subscribing to updates. We do not sell customer data to third parties.',
  'By ordering through GoCloudShop, you agree to the pricing, specifications and policies listed on the relevant product page at the time of order.',
  'Refund eligibility is evaluated case-by-case and, where applicable, is stated on the specific product''s page. Contact support via Telegram to request a refund review.',
  'GoCloudShop is an independent marketplace. Product listings are not officially endorsed by the referenced cloud providers unless explicitly stated on the listing.'
)
on conflict (id) do update set
  site_name = excluded.site_name,
  tagline = excluded.tagline,
  telegram_username = excluded.telegram_username,
  whatsapp_number = excluded.whatsapp_number,
  telegram_channel_url = excluded.telegram_channel_url,
  support_email = excluded.support_email,
  default_seo = excluded.default_seo,
  privacy_policy = excluded.privacy_policy,
  terms_of_service = excluded.terms_of_service,
  refund_policy = excluded.refund_policy,
  disclaimer = excluded.disclaimer;

-- ---------------------------------------------------------------------------
-- providers
-- ---------------------------------------------------------------------------

insert into providers (name, slug, description, website_url, sort_order, seo_title, seo_description) values
('Amazon Web Services', 'aws', 'Compute, storage, credits and AI/ML infrastructure on the world''s most widely adopted cloud platform.', 'https://aws.amazon.com', 1, 'AWS Cloud Accounts, Credits & AI Cloud | GoCloudShop', 'Browse AWS compute accounts, cloud credits and AI-ready accounts with transparent pricing.'),
('Google Cloud', 'google-cloud', 'Cloud credits and AI/ML-ready infrastructure on Google Cloud Platform.', 'https://cloud.google.com', 2, 'Google Cloud Accounts & Credits | GoCloudShop', 'Explore Google Cloud credit packages and AI-ready infrastructure with clear pricing.'),
('Microsoft Azure', 'azure', 'Free trial, pay-as-you-go and cloud credit accounts on Microsoft Azure.', 'https://azure.microsoft.com', 3, 'Microsoft Azure Cloud Accounts & Credits | GoCloudShop', 'Browse Azure free trial, PAYG and cloud credit accounts with transparent pricing.'),
('DigitalOcean', 'digitalocean', 'Developer-friendly compute accounts, from starter droplets to high-capacity infrastructure.', 'https://www.digitalocean.com', 4, 'DigitalOcean Cloud Accounts | GoCloudShop', 'Browse DigitalOcean droplet-capacity accounts with transparent pricing and specifications.'),
('Oracle Cloud', 'oracle-cloud', 'Oracle Cloud Infrastructure credits and established/upgraded account tiers.', 'https://www.oracle.com/cloud/', 5, 'Oracle Cloud Accounts & Credits | GoCloudShop', 'Explore Oracle Cloud Infrastructure credit and account options with clear pricing.'),
('Linode', 'linode', 'Akamai''s Linode cloud credits and specialized infrastructure accounts.', 'https://www.linode.com', 6, 'Linode Cloud Accounts & Credits | GoCloudShop', 'Browse Linode cloud credit packages and specialized account configurations.'),
('IBM Cloud', 'ibm-cloud', 'IBM Cloud free trial and standard accounts, including Watson AI and Kubernetes access.', 'https://www.ibm.com/cloud', 7, 'IBM Cloud Accounts | GoCloudShop', 'Explore IBM Cloud free trial and standard account options with transparent pricing.'),
('Kamatera', 'kamatera', 'Pay-per-second cloud infrastructure across multiple global datacenters.', 'https://www.kamatera.com', 8, 'Kamatera Cloud Accounts | GoCloudShop', 'Browse Kamatera free trial and standard cloud account options.'),
('Alibaba Cloud', 'alibaba-cloud', 'Personal and business cloud accounts with strong Asia-Pacific infrastructure coverage.', 'https://www.alibabacloud.com', 9, 'Alibaba Cloud Accounts | GoCloudShop', 'Explore Alibaba Cloud personal and business account tiers with transparent pricing.'),
('Atlantic.Net', 'atlantic-net', 'HIPAA-compliant cloud hosting with a free trial entry point.', 'https://www.atlantic.net', 10, 'Atlantic.Net Cloud Accounts | GoCloudShop', 'Browse Atlantic.Net free trial cloud account access.')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------

insert into categories (name, slug, description, icon, sort_order, seo_title, seo_description) values
('Cloud Accounts', 'cloud-accounts', 'Ready-to-use cloud accounts across every major provider.', 'Cloud', 1, 'Cloud Accounts | GoCloudShop', 'Browse cloud accounts from AWS, Google Cloud, Azure, DigitalOcean and more.'),
('Cloud Credits', 'cloud-credits', 'Prepaid cloud credit packages for AWS, Google Cloud, Azure, Oracle Cloud and Linode.', 'Coins', 2, 'Cloud Credits | GoCloudShop', 'Browse cloud credit packages across leading providers with transparent pricing.'),
('AI Cloud', 'ai-cloud', 'AI-ready cloud accounts built for development, experimentation and production AI workloads.', 'Sparkles', 3, 'AI Cloud Accounts | GoCloudShop', 'Explore AI-ready cloud accounts and AI/ML infrastructure with transparent pricing.'),
('AI/ML', 'ai-ml', 'Infrastructure for machine learning development, training and inference.', 'BrainCircuit', 4, 'AI/ML Infrastructure | GoCloudShop', 'Browse AI and machine learning infrastructure products.'),
('GPU Cloud', 'gpu-cloud', 'GPU-accelerated cloud infrastructure for AI, ML and high-performance workloads.', 'Cpu', 5, 'GPU Cloud | GoCloudShop', 'Explore GPU cloud infrastructure for AI training and inference.'),
('Compute', 'compute', 'Scalable compute accounts sized from lightweight to high-performance workloads.', 'Server', 6, 'Cloud Compute | GoCloudShop', 'Browse cloud compute accounts across vCPU tiers and providers.'),
('Free Trials', 'free-trials', 'Free trial cloud accounts to explore a provider''s platform before committing.', 'Gift', 7, 'Free Trial Cloud Accounts | GoCloudShop', 'Explore free trial cloud accounts across supported providers.'),
('Pay-As-You-Go', 'pay-as-you-go', 'Flexible, no-commitment billing accounts.', 'Wallet', 8, 'Pay-As-You-Go Cloud Accounts | GoCloudShop', 'Browse pay-as-you-go cloud accounts with no upfront commitment.'),
('Enterprise', 'enterprise', 'Large-scale cloud and AI infrastructure for enterprise workloads.', 'Building2', 9, 'Enterprise Cloud & AI Infrastructure | GoCloudShop', 'Explore enterprise-scale cloud accounts, credits and AI infrastructure.')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- provider_category_pages (combo SEO landing pages)
-- ---------------------------------------------------------------------------

insert into provider_category_pages (slug, provider_id, category_id, title, intro_content, sort_order, seo_title, seo_description) values
('aws-accounts', (select id from providers where slug = 'aws'), (select id from categories where slug = 'cloud-accounts'), 'AWS Cloud Accounts', 'Compute-ready AWS accounts sized by vCPU, plus free trial access.', 1, 'Buy AWS Cloud Accounts | GoCloudShop', 'Browse AWS compute accounts and free trial access with transparent pricing.'),
('aws-credits', (select id from providers where slug = 'aws'), (select id from categories where slug = 'cloud-credits'), 'AWS Cloud Credits', 'Prepaid AWS credit packages from $1K up to $100K.', 2, 'Buy AWS Cloud Credits | GoCloudShop', 'Browse AWS credit packages from $1K to $100K with transparent pricing.'),
('aws-ai', (select id from providers where slug = 'aws'), (select id from categories where slug = 'ai-cloud'), 'AWS AI Cloud', 'AI-enabled AWS accounts across compute tiers, from starter to enterprise-scale.', 3, 'AWS AI Cloud Accounts | GoCloudShop', 'Explore AI-enabled AWS cloud accounts with transparent pricing and specifications.'),
('google-cloud-accounts', (select id from providers where slug = 'google-cloud'), (select id from categories where slug = 'cloud-accounts'), 'Google Cloud Accounts', 'Google Cloud account access backed by credit packages.', 4, 'Buy Google Cloud Accounts | GoCloudShop', 'Browse Google Cloud account and credit options with transparent pricing.'),
('google-cloud-credits', (select id from providers where slug = 'google-cloud'), (select id from categories where slug = 'cloud-credits'), 'Google Cloud Credits', 'Google Cloud credit packages from $300 up to $25K.', 5, 'Buy Google Cloud Credits | GoCloudShop', 'Browse Google Cloud credit packages with transparent pricing.'),
('google-cloud-ai', (select id from providers where slug = 'google-cloud'), (select id from categories where slug = 'ai-cloud'), 'Google Cloud AI', 'Vertex AI-ready Google Cloud credit and infrastructure options.', 6, 'Google Cloud AI | GoCloudShop', 'Explore Vertex AI-ready Google Cloud infrastructure with transparent pricing.'),
('azure-accounts', (select id from providers where slug = 'azure'), (select id from categories where slug = 'cloud-accounts'), 'Azure Cloud Accounts', 'Azure free trial and pay-as-you-go account access.', 7, 'Buy Azure Cloud Accounts | GoCloudShop', 'Browse Azure free trial and PAYG accounts with transparent pricing.'),
('azure-credits', (select id from providers where slug = 'azure'), (select id from categories where slug = 'cloud-credits'), 'Azure Cloud Credits', 'Azure credit packages from $1K up to $25K.', 8, 'Buy Azure Cloud Credits | GoCloudShop', 'Browse Azure credit packages with transparent pricing.'),
('azure-ai', (select id from providers where slug = 'azure'), (select id from categories where slug = 'ai-cloud'), 'Azure AI', 'AI-ready Azure infrastructure and credit options.', 9, 'Azure AI Cloud | GoCloudShop', 'Explore AI-ready Azure infrastructure with transparent pricing.'),
('digitalocean-accounts', (select id from providers where slug = 'digitalocean'), (select id from categories where slug = 'cloud-accounts'), 'DigitalOcean Accounts', 'DigitalOcean droplet-capacity accounts from starter to high-scale.', 10, 'Buy DigitalOcean Accounts | GoCloudShop', 'Browse DigitalOcean accounts with transparent pricing and droplet capacity.'),
('oracle-cloud-accounts', (select id from providers where slug = 'oracle-cloud'), (select id from categories where slug = 'cloud-accounts'), 'Oracle Cloud Accounts', 'Oracle Cloud Infrastructure accounts and credit packages.', 11, 'Buy Oracle Cloud Accounts | GoCloudShop', 'Browse Oracle Cloud accounts and credits with transparent pricing.'),
('linode-accounts', (select id from providers where slug = 'linode'), (select id from categories where slug = 'cloud-accounts'), 'Linode Accounts', 'Linode credit packages and specialized account configurations.', 12, 'Buy Linode Accounts | GoCloudShop', 'Browse Linode accounts and credits with transparent pricing.')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------

insert into products (provider_id, category_id, name, slug, product_type, description, short_description, base_price, delivery_time_text, badge, is_featured, is_popular, is_ai, seo_title) values
((select id from providers where slug='aws'), (select id from categories where slug='free-trials'), 'AWS Starter / Free Trial', 'aws-starter-free-trial', 'Free Trial', 'An entry-level AWS account for developers who want to explore core AWS services before scaling up.', 'Entry-level AWS account access to explore the platform.', 18, 'Within 24 hours', null, false, false, false, null),
((select id from providers where slug='aws'), (select id from categories where slug='compute'), 'AWS Compute Accounts', 'aws-compute-accounts', 'Compute', 'AWS accounts configured for compute workloads, available across six vCPU tiers to match your project''s scale.', 'AWS compute accounts sized from 8 to 512 vCPU.', null, 'Within 24 hours', null, true, true, false, null),
((select id from providers where slug='aws'), (select id from categories where slug='cloud-credits'), 'AWS Cloud Credits', 'aws-cloud-credits', 'Cloud Credit', 'Prepaid AWS cloud credit packages for global-scale usage across the AWS platform, from small projects to enterprise billing environments.', 'Prepaid AWS credit packages from $1K to $100K.', null, 'Within 24 hours', null, true, false, false, null),
((select id from providers where slug='aws'), (select id from categories where slug='ai-cloud'), 'AWS AI Account — 10 RPM | 32 vCPU | AI Enabled', 'aws-ai-account-10rpm-32vcpu', 'AI Cloud Account', 'An AI-enabled AWS account suitable for AI workloads, with 32 vCPU of compute and 10 requests-per-minute capacity.', 'AI-enabled AWS account with 32 vCPU and 10 RPM capacity.', 75, 'Within 24 hours', 'AI Ready', true, false, true, null),
((select id from providers where slug='aws'), (select id from categories where slug='ai-cloud'), 'AWS AI Account — 50 RPM | Kiro Working | 32 vCPU | AI Enabled', 'aws-ai-account-50rpm-kiro-32vcpu', 'AI Cloud Account', 'An AI-enabled AWS account suitable for AI development workloads, with working Kiro access, 32 vCPU of compute and 50 requests-per-minute capacity.', 'AI development account with working Kiro access and 32 vCPU.', 199, 'Within 24 hours', 'AI + Kiro', false, false, true, null),
((select id from providers where slug='aws'), (select id from categories where slug='ai-cloud'), 'AWS AI Account — 10K RPM | 4.6 Support | 5 vCPU | Multi-Year Aged | AI Enabled', 'aws-ai-account-10krpm-5vcpu-aged', 'Aged AI Cloud Account', 'A multi-year aged AWS account, AI-enabled with 10,000 requests-per-minute capacity, 4.6 support rating and 5 vCPU of compute.', 'Multi-year aged AI-enabled AWS account with 10K RPM capacity.', 250, 'Within 24 hours', 'Aged AI', false, false, true, null),
((select id from providers where slug='aws'), (select id from categories where slug='ai-cloud'), 'AWS AI Account — 10K RPM | 4.6 Support | 96 vCPU | Multi-Year Aged | AI Enabled', 'aws-ai-account-10krpm-96vcpu-aged', 'Aged AI Cloud Account', 'A multi-year aged, high-performance-compute AWS account, AI-enabled with 10,000 requests-per-minute capacity, 4.6 support rating and 96 vCPU of compute.', 'High-compute multi-year aged AI-enabled AWS account, 96 vCPU.', 399, 'Within 24 hours', 'High Compute', false, false, true, null),
((select id from providers where slug='aws'), (select id from categories where slug='ai-cloud'), 'AWS AI Account — 10K RPM | 4.6 Support | 128 vCPU | Multi-Year Aged | AI Enabled', 'aws-ai-account-10krpm-128vcpu-aged', 'Aged AI Cloud Account', 'A multi-year aged, high-performance-compute AWS account, AI-enabled with 10,000 requests-per-minute capacity, 4.6 support rating and 128 vCPU of compute.', 'Premium multi-year aged AI-enabled AWS account, 128 vCPU.', 899, 'Within 24 hours', 'Premium AI', false, false, true, null),
((select id from providers where slug='aws'), (select id from categories where slug='ai-cloud'), 'AWS AI Account — 10K RPM | 4.6 Support | 256 vCPU | Multi-Year Aged | AI Enabled', 'aws-ai-account-10krpm-256vcpu-aged', 'Aged AI Cloud Account', 'A multi-year aged AWS account built for large-scale AI workloads: AI-enabled, 10,000 requests-per-minute capacity, 4.6 support rating and 256 vCPU of compute.', 'Large-scale multi-year aged AI-enabled AWS account, 256 vCPU.', 999, 'Within 24 hours', 'Ultimate AI', true, false, true, null),
((select id from providers where slug='aws'), (select id from categories where slug='enterprise'), 'AWS AI Account — Cloud Platform Working | 384 vCPU | Bedrock Not Included | AI Enabled', 'aws-ai-account-enterprise-384vcpu', 'Enterprise AI Cloud Account', 'An enterprise-scale AWS account for large-scale AI workloads: working cloud platform access, AI-enabled, 384 vCPU of compute. Amazon Bedrock is not included.', 'Enterprise-scale AI-enabled AWS account with 384 vCPU.', 3999, 'Within 24 hours', 'Enterprise AI', false, false, true, null),
((select id from providers where slug='google-cloud'), (select id from categories where slug='cloud-credits'), 'Google Cloud Credits', 'google-cloud-credits', 'Cloud Credit', 'Prepaid Google Cloud Platform credit packages covering Compute Engine, Cloud Run, BigQuery, Vertex AI-ready infrastructure and more, depending on tier.', 'Google Cloud credit packages from $300 to $25K.', null, 'Within 24 hours', null, true, false, false, null),
((select id from providers where slug='azure'), (select id from categories where slug='free-trials'), 'Azure Starter / Free Trial', 'azure-starter-free-trial', 'Free Trial Cloud Account', 'Azure portal access with applicable free Azure products and cloud services across supported regions.', 'Entry-level Azure account access to explore the platform.', 25, 'Within 24 hours', null, false, false, false, null),
((select id from providers where slug='azure'), (select id from categories where slug='pay-as-you-go'), 'Azure Pay As You Go', 'azure-pay-as-you-go', 'PAYG Cloud Account', 'An Azure account configured for pay-as-you-go billing across Azure services, with no upfront commitment required.', 'Azure account with pay-as-you-go billing and no upfront commitment.', 30, 'Within 24 hours', null, false, false, false, null),
((select id from providers where slug='azure'), (select id from categories where slug='cloud-credits'), 'Azure Cloud Credits', 'azure-cloud-credits', 'Cloud Credit', 'Prepaid Microsoft Azure credit packages covering Virtual Machines, Storage, AI services and enterprise-grade Azure infrastructure, depending on tier.', 'Azure credit packages from $1K to $25K.', null, 'Within 24 hours', null, true, false, false, null),
((select id from providers where slug='digitalocean'), (select id from categories where slug='compute'), 'DigitalOcean Compute Accounts', 'digitalocean-compute-accounts', 'Cloud Compute Account', 'DigitalOcean accounts configured with standard networking and cloud infrastructure, available in 3- or 10-droplet capacity.', 'DigitalOcean accounts with 3 or 10 droplet capacity.', null, 'Within 24 hours', null, false, false, false, null),
((select id from providers where slug='digitalocean'), (select id from categories where slug='cloud-accounts'), 'DigitalOcean Open 25 Port Accounts', 'digitalocean-open-25-port-accounts', 'Advanced Cloud Account', 'Advanced DigitalOcean accounts with expanded networking configuration (port 25 open), available across four droplet-capacity tiers.', 'DigitalOcean accounts with port 25 open, from 10 to 500 droplet capacity.', null, 'Within 24 hours', null, true, false, false, null),
((select id from providers where slug='oracle-cloud'), (select id from categories where slug='cloud-credits'), 'Oracle Cloud $300 Credit', 'oracle-cloud-300-credit', 'Cloud Credit', 'A $300 OCI credit package covering Oracle Cloud Infrastructure services and applicable Always Free resources.', '$300 Oracle Cloud Infrastructure credit package.', 49, 'Within 24 hours', null, false, false, false, null),
((select id from providers where slug='oracle-cloud'), (select id from categories where slug='cloud-accounts'), 'Oracle Aged Account', 'oracle-aged-account', 'Cloud Account', 'An Oracle Cloud account with established account history and applicable account capabilities within the Oracle Cloud environment.', 'Oracle Cloud account with established account history.', 75, 'Within 24 hours', null, false, false, false, null),
((select id from providers where slug='oracle-cloud'), (select id from categories where slug='cloud-accounts'), 'Oracle Upgraded Account', 'oracle-upgraded-account', 'Upgraded Cloud Account', 'An upgraded-tier Oracle Cloud account with higher applicable limits and pay-as-you-go capability where applicable.', 'Oracle Cloud account with an upgraded tier and higher limits.', 90, 'Within 24 hours', null, false, false, false, null),
((select id from providers where slug='linode'), (select id from categories where slug='cloud-credits'), 'Linode $100 Credit', 'linode-100-credit', 'Cloud Credit', 'A $100 Linode credit covering global regions and applicable cloud compute infrastructure and services.', '$100 Linode credit for global cloud infrastructure.', 25, 'Within 24 hours', null, false, false, false, null),
((select id from providers where slug='linode'), (select id from categories where slug='cloud-accounts'), 'Linode Account — Port 25 Open', 'linode-account-port-25-open', 'Cloud Account', 'A Linode account with port 25 configuration for email server infrastructure, plus full applicable cloud access.', 'Linode account configured for email/SMTP infrastructure.', 90, 'Within 24 hours', 'Port 25 Open', false, false, false, null),
((select id from providers where slug='ibm-cloud'), (select id from categories where slug='free-trials'), 'IBM Cloud Free Trial', 'ibm-cloud-free-trial', 'Free Trial Cloud Account', 'An IBM Cloud environment account with access to Watson AI, IoT, Kubernetes and OpenShift services.', 'IBM Cloud account with Watson AI, IoT and Kubernetes access.', 30, 'Within 24 hours', null, false, false, false, null),
((select id from providers where slug='ibm-cloud'), (select id from categories where slug='cloud-accounts'), 'IBM Cloud Port 25 Open', 'ibm-cloud-port-25-open', 'Cloud Account', 'An IBM Cloud account with port 25 configuration for email infrastructure, plus applicable IBM Cloud platform access.', 'IBM Cloud account configured for email infrastructure.', 70, 'Within 24 hours', 'Port 25 Open', false, false, false, null),
((select id from providers where slug='kamatera'), (select id from categories where slug='free-trials'), 'Kamatera Free Trial', 'kamatera-free-trial', 'Free Trial Cloud Account', 'A free trial Kamatera package with access to cloud infrastructure, multiple datacenter options and pay-per-second billing.', 'Free trial Kamatera package across multiple datacenters.', 25, 'Within 24 hours', null, false, false, false, null),
((select id from providers where slug='kamatera'), (select id from categories where slug='cloud-accounts'), 'Kamatera Port 25 Open', 'kamatera-port-25-open', 'Cloud Account', 'A Kamatera account with port 25 configuration for email infrastructure, cloud access and applicable datacenter options.', 'Kamatera account configured for email infrastructure.', 35, 'Within 24 hours', 'Port 25 Open', false, false, false, null),
((select id from providers where slug='alibaba-cloud'), (select id from categories where slug='cloud-accounts'), 'Alibaba Cloud Personal', 'alibaba-cloud-personal', 'Cloud Account', 'A personal Alibaba Cloud environment with ECS, OSS, RDS and Asia-Pacific infrastructure access.', 'Personal Alibaba Cloud account with ECS, OSS and RDS access.', 60, 'Within 24 hours', null, false, false, false, null),
((select id from providers where slug='alibaba-cloud'), (select id from categories where slug='cloud-accounts'), 'Alibaba Cloud Business', 'alibaba-cloud-business', 'Business Cloud Account', 'A business-oriented Alibaba Cloud account with ECS, OSS, RDS and broader Alibaba Cloud service access.', 'Business-oriented Alibaba Cloud account with ECS, OSS and RDS.', 100, 'Within 24 hours', null, false, false, false, null),
((select id from providers where slug='atlantic-net'), (select id from categories where slug='free-trials'), 'Atlantic.Net Free Trial', 'atlantic-net-free-trial', 'Free Trial Cloud Account', 'A free trial Atlantic.Net environment with cloud infrastructure access and regional availability.', 'Free trial Atlantic.Net cloud account access.', 30, 'Within 24 hours', null, false, false, false, null)
on conflict (slug) do nothing;

-- Standalone-product feature lists (products with no variations) — spec-provided verbatim
update products set features = '["AWS account access", "Applicable free-tier AWS services", "Cloud services", "AWS regions"]'::jsonb where slug = 'aws-starter-free-trial';
update products set features = '["10 RPM", "32 vCPU", "AI Enabled", "AWS Cloud Platform", "Suitable for AI workloads"]'::jsonb where slug = 'aws-ai-account-10rpm-32vcpu';
update products set features = '["50 RPM", "Kiro Working", "32 vCPU", "AI Enabled", "AWS Cloud Platform", "Suitable for AI development workloads"]'::jsonb where slug = 'aws-ai-account-50rpm-kiro-32vcpu';
update products set features = '["10K RPM", "4.6 Support", "5 vCPU", "Multi-Year Aged", "AI Enabled", "AWS Cloud Platform"]'::jsonb where slug = 'aws-ai-account-10krpm-5vcpu-aged';
update products set features = '["10K RPM", "4.6 Support", "96 vCPU", "Multi-Year Aged", "AI Enabled", "AWS Cloud Platform", "High-performance compute"]'::jsonb where slug = 'aws-ai-account-10krpm-96vcpu-aged';
update products set features = '["10K RPM", "4.6 Support", "128 vCPU", "Multi-Year Aged", "AI Enabled", "AWS Cloud Platform", "High-performance compute"]'::jsonb where slug = 'aws-ai-account-10krpm-128vcpu-aged';
update products set features = '["10K RPM", "4.6 Support", "256 vCPU", "Multi-Year Aged", "AI Enabled", "AWS Cloud Platform", "High-performance compute", "Large-scale AI workloads"]'::jsonb where slug = 'aws-ai-account-10krpm-256vcpu-aged';
update products set features = '["Cloud Platform Working", "384 vCPU", "AI Enabled", "High-performance compute", "Enterprise-scale infrastructure", "Suitable for large-scale AI workloads", "Bedrock Not Included"]'::jsonb where slug = 'aws-ai-account-enterprise-384vcpu';
update products set features = '["Azure portal access", "Applicable free Azure products", "Cloud services", "Azure regions"]'::jsonb where slug = 'azure-starter-free-trial';
update products set features = '["Pay-as-you-go billing", "No upfront commitment", "Azure services", "Applicable regions"]'::jsonb where slug = 'azure-pay-as-you-go';
update products set features = '["$300 OCI credits", "OCI services", "Applicable Always Free resources"]'::jsonb where slug = 'oracle-cloud-300-credit';
update products set features = '["Established account history", "Oracle Cloud environment", "Applicable account capabilities"]'::jsonb where slug = 'oracle-aged-account';
update products set features = '["Higher applicable limits", "Upgraded account tier", "PAYG capability where applicable"]'::jsonb where slug = 'oracle-upgraded-account';
update products set features = '["$100 Linode credit", "Global regions", "Applicable cloud services", "Compute infrastructure"]'::jsonb where slug = 'linode-100-credit';
update products set features = '["Port 25 configuration", "Email server infrastructure", "Full applicable cloud access"]'::jsonb where slug = 'linode-account-port-25-open';
update products set features = '["IBM Cloud environment", "Watson AI", "IoT", "Kubernetes", "OpenShift"]'::jsonb where slug = 'ibm-cloud-free-trial';
update products set features = '["Port 25 configuration", "Email infrastructure", "IBM Cloud services", "Applicable cloud platform access"]'::jsonb where slug = 'ibm-cloud-port-25-open';
update products set features = '["Free trial package", "Cloud infrastructure", "Multiple datacenter options", "Pay-per-second infrastructure"]'::jsonb where slug = 'kamatera-free-trial';
update products set features = '["Port 25 configuration", "Email infrastructure", "Cloud access", "Applicable datacenter options"]'::jsonb where slug = 'kamatera-port-25-open';
update products set features = '["ECS", "OSS", "RDS", "Asia-Pacific infrastructure", "Personal cloud environment"]'::jsonb where slug = 'alibaba-cloud-personal';
update products set features = '["Alibaba Cloud services", "ECS", "OSS", "RDS", "Business-oriented infrastructure"]'::jsonb where slug = 'alibaba-cloud-business';
update products set features = '["Free trial environment", "Cloud infrastructure", "Applicable server access", "Regional availability"]'::jsonb where slug = 'atlantic-net-free-trial';

-- ---------------------------------------------------------------------------
-- product_variations
-- ---------------------------------------------------------------------------

-- AWS Compute Accounts
insert into product_variations (product_id, name, slug, price, specifications, sort_order, badge) values
((select id from products where slug='aws-compute-accounts'), '8 vCPU', '8-vcpu', 20, '{"vCPU": "8"}'::jsonb, 1, null),
((select id from products where slug='aws-compute-accounts'), '32 vCPU', '32-vcpu', 30, '{"vCPU": "32"}'::jsonb, 2, 'Popular'),
((select id from products where slug='aws-compute-accounts'), '64 vCPU', '64-vcpu', 50, '{"vCPU": "64"}'::jsonb, 3, null),
((select id from products where slug='aws-compute-accounts'), '128 vCPU', '128-vcpu', 120, '{"vCPU": "128"}'::jsonb, 4, null),
((select id from products where slug='aws-compute-accounts'), '256 vCPU', '256-vcpu', 220, '{"vCPU": "256"}'::jsonb, 5, 'High Compute'),
((select id from products where slug='aws-compute-accounts'), '512 vCPU', '512-vcpu', 350, '{"vCPU": "512"}'::jsonb, 6, 'High Compute')
on conflict (product_id, slug) do nothing;

-- AWS Cloud Credits
insert into product_variations (product_id, name, slug, price, specifications, sort_order, badge, description, features) values
((select id from products where slug='aws-cloud-credits'), '$1K Credit', '1k-credit', 220, '{"Credit Amount": "$1,000"}'::jsonb, 1, null, null, '[]'::jsonb),
((select id from products where slug='aws-cloud-credits'), '$5K Credit', '5k-credit', 850, '{"Credit Amount": "$5,000"}'::jsonb, 2, null, null, '[]'::jsonb),
((select id from products where slug='aws-cloud-credits'), '$10K Credit', '10k-credit', 1699, '{"Credit Amount": "$10,000"}'::jsonb, 3, null, null, '[]'::jsonb),
((select id from products where slug='aws-cloud-credits'), '$25K Credit', '25k-credit', 3299, '{"Credit Amount": "$25,000"}'::jsonb, 4, null, null, '[]'::jsonb),
((select id from products where slug='aws-cloud-credits'), '$50K Credit', '50k-credit', 6999, '{"Credit Amount": "$50,000"}'::jsonb, 5, null, null, '[]'::jsonb),
((select id from products where slug='aws-cloud-credits'), '$100K Credit', '100k-credit', 12500, '{"Credit Amount": "$100,000", "Type": "Enterprise Cloud Credit"}'::jsonb, 6, 'Ultimate', 'Enterprise Cloud Credit — large-scale cloud usage with an enterprise billing environment and global region support.', '["$100,000 credit package", "Large-scale cloud usage", "Enterprise billing environment", "Global region support"]'::jsonb)
on conflict (product_id, slug) do nothing;

-- Google Cloud Credits
insert into product_variations (product_id, name, slug, price, specifications, sort_order, badge, features) values
((select id from products where slug='google-cloud-credits'), '$300 Credit', '300-credit', 55, '{"Credit Amount": "$300"}'::jsonb, 1, null, '["$300 GCP credits", "Compute Engine", "Cloud Run", "Google Cloud services", "Global regions"]'::jsonb),
((select id from products where slug='google-cloud-credits'), '$400 Credit', '400-credit', 70, '{"Credit Amount": "$400"}'::jsonb, 2, null, '["$400 GCP credits", "Cloud Storage", "BigQuery", "Applicable Google Cloud services"]'::jsonb),
((select id from products where slug='google-cloud-credits'), '$1K Credit', '1k-credit', 220, '{"Credit Amount": "$1,000", "Type": "AI / Cloud Credit"}'::jsonb, 3, 'Popular', '["$1,000 GCP credits", "Compute", "Storage", "AI/ML", "Vertex AI-ready infrastructure"]'::jsonb),
((select id from products where slug='google-cloud-credits'), '$5K Credit', '5k-credit', 599, '{"Credit Amount": "$5,000", "Type": "Enterprise Cloud Credit"}'::jsonb, 4, 'Best Value', '["$5,000 GCP credits", "Full GCP platform access", "Enterprise-grade infrastructure", "Priority support where applicable"]'::jsonb),
((select id from products where slug='google-cloud-credits'), '$10K Credit', '10k-credit', 1099, '{"Credit Amount": "$10,000", "Type": "Enterprise Cloud Credit"}'::jsonb, 5, 'Enterprise', '["$10,000 GCP credits", "Broad Google Cloud services", "Large-scale workloads", "Applicable replacement/support policy"]'::jsonb),
((select id from products where slug='google-cloud-credits'), '$25K Credit', '25k-credit', 1699, '{"Credit Amount": "$25,000", "Type": "Premium Cloud Credit"}'::jsonb, 6, 'Pro', '["$25,000 GCP credit package", "Enterprise workloads", "AI/ML", "Dedicated support where applicable"]'::jsonb)
on conflict (product_id, slug) do nothing;

-- Azure Cloud Credits
insert into product_variations (product_id, name, slug, price, specifications, sort_order, badge, features) values
((select id from products where slug='azure-cloud-credits'), '$1K Credit', '1k-credit', 180, '{"Credit Amount": "$1,000"}'::jsonb, 1, 'Popular', '["$1,000 Azure credits", "Virtual Machines", "Storage", "AI services", "Azure regions"]'::jsonb),
((select id from products where slug='azure-cloud-credits'), '$5K Credit', '5k-credit', 650, '{"Credit Amount": "$5,000", "Type": "Enterprise Cloud Credit"}'::jsonb, 2, 'Hot', '["$5,000 Azure credits", "Enterprise-grade workloads", "Global Azure infrastructure"]'::jsonb),
((select id from products where slug='azure-cloud-credits'), '$25K Credit', '25k-credit', 1750, '{"Credit Amount": "$25,000", "Type": "Enterprise Cloud Credit"}'::jsonb, 3, 'Enterprise', '["$25,000 Azure credits", "Large-scale cloud usage", "Azure AI/services", "Enterprise infrastructure"]'::jsonb)
on conflict (product_id, slug) do nothing;

-- DigitalOcean Compute Accounts
insert into product_variations (product_id, name, slug, price, specifications, sort_order, features) values
((select id from products where slug='digitalocean-compute-accounts'), '3 Droplet', '3-droplet', 25, '{"Droplet Capacity": "3"}'::jsonb, 1, '["3-unit compute capacity", "Standard networking", "Cloud infrastructure", "Applicable regions"]'::jsonb),
((select id from products where slug='digitalocean-compute-accounts'), '10 Droplet', '10-droplet', 30, '{"Droplet Capacity": "10"}'::jsonb, 2, '["10-unit capacity", "Expanded compute", "Standard networking"]'::jsonb)
on conflict (product_id, slug) do nothing;

-- DigitalOcean Open 25 Port Accounts
insert into product_variations (product_id, name, slug, price, specifications, sort_order, badge, features) values
((select id from products where slug='digitalocean-open-25-port-accounts'), '10 Droplet', '10-droplet', 299, '{"Droplet Capacity": "10"}'::jsonb, 1, null, '["3 compute capacity", "Expanded networking", "Applicable networking configuration"]'::jsonb),
((select id from products where slug='digitalocean-open-25-port-accounts'), '25 Droplet', '25-droplet', 699, '{"Droplet Capacity": "25"}'::jsonb, 2, null, '["25 compute capacity", "Expanded networking", "High-scale deployment"]'::jsonb),
((select id from products where slug='digitalocean-open-25-port-accounts'), '100 Droplet', '100-droplet', 2599, '{"Droplet Capacity": "100"}'::jsonb, 3, 'Enterprise', '["100 compute capacity", "Expanded networking", "Enterprise-oriented configuration"]'::jsonb),
((select id from products where slug='digitalocean-open-25-port-accounts'), '500 Droplet', '500-droplet', 7999, '{"Droplet Capacity": "500"}'::jsonb, 4, 'Enterprise', '["500 compute capacity", "Expanded networking", "Enterprise-oriented configuration"]'::jsonb)
on conflict (product_id, slug) do nothing;

-- ---------------------------------------------------------------------------
-- comparisons
-- ---------------------------------------------------------------------------

insert into comparisons (slug, title, comparison_type, provider_ids, description, rows, sort_order, seo_title, seo_description) values
('aws-vs-google-cloud', 'AWS vs Google Cloud', 'provider_vs_provider',
  (select array_agg(id) from providers where slug in ('aws','google-cloud')),
  'Compare AWS and Google Cloud across compute, AI capabilities, credits and support.',
  '[
    {"feature":"Compute options","values":{"aws":"EC2 instance families across general, compute and memory-optimized types","google-cloud":"Compute Engine machine families across general, compute and memory-optimized types"}},
    {"feature":"AI / ML platform","values":{"aws":"SageMaker, Bedrock (availability varies by account)","google-cloud":"Vertex AI"}},
    {"feature":"Credits available via GoCloudShop","values":{"aws":"$1K – $100K","google-cloud":"$300 – $25K"}},
    {"feature":"Global regions","values":{"aws":"Yes","google-cloud":"Yes"}},
    {"feature":"Free trial account available","values":{"aws":"Yes","google-cloud":"No (credit-based access)"}}
  ]'::jsonb, 1, 'AWS vs Google Cloud — Cloud Provider Comparison | GoCloudShop', 'Compare AWS and Google Cloud accounts, credits and AI capabilities available through GoCloudShop.'),
('aws-vs-azure', 'AWS vs Azure', 'provider_vs_provider',
  (select array_agg(id) from providers where slug in ('aws','azure')),
  'Compare AWS and Microsoft Azure across compute, AI capabilities, credits and support.',
  '[
    {"feature":"Compute options","values":{"aws":"EC2 instance families","azure":"Azure Virtual Machines"}},
    {"feature":"AI / ML platform","values":{"aws":"SageMaker, Bedrock (availability varies by account)","azure":"Azure AI Foundry / Cognitive Services"}},
    {"feature":"Credits available via GoCloudShop","values":{"aws":"$1K – $100K","azure":"$1K – $25K"}},
    {"feature":"Free trial account available","values":{"aws":"Yes","azure":"Yes"}},
    {"feature":"Pay-as-you-go account available","values":{"aws":"Via credits/compute accounts","azure":"Yes, dedicated PAYG account"}}
  ]'::jsonb, 2, 'AWS vs Azure — Cloud Provider Comparison | GoCloudShop', 'Compare AWS and Microsoft Azure accounts, credits and AI capabilities available through GoCloudShop.'),
('aws-vs-digitalocean', 'AWS vs DigitalOcean', 'provider_vs_provider',
  (select array_agg(id) from providers where slug in ('aws','digitalocean')),
  'Compare AWS and DigitalOcean for compute-focused cloud accounts.',
  '[
    {"feature":"Compute options","values":{"aws":"EC2 instance families across many sizes","digitalocean":"Droplet-capacity tiers"}},
    {"feature":"Best suited for","values":{"aws":"Broad enterprise and AI/ML workloads","digitalocean":"Developer-focused, straightforward compute deployment"}},
    {"feature":"Credits available via GoCloudShop","values":{"aws":"$1K – $100K","digitalocean":"Not offered as credits — compute-capacity accounts"}}
  ]'::jsonb, 3, 'AWS vs DigitalOcean — Cloud Provider Comparison | GoCloudShop', 'Compare AWS and DigitalOcean accounts available through GoCloudShop.'),
('google-cloud-vs-azure', 'Google Cloud vs Azure', 'provider_vs_provider',
  (select array_agg(id) from providers where slug in ('google-cloud','azure')),
  'Compare Google Cloud and Microsoft Azure across credits, AI platforms and support.',
  '[
    {"feature":"AI / ML platform","values":{"google-cloud":"Vertex AI","azure":"Azure AI Foundry / Cognitive Services"}},
    {"feature":"Credits available via GoCloudShop","values":{"google-cloud":"$300 – $25K","azure":"$1K – $25K"}},
    {"feature":"Free trial account available","values":{"google-cloud":"No (credit-based access)","azure":"Yes"}}
  ]'::jsonb, 4, 'Google Cloud vs Azure — Cloud Provider Comparison | GoCloudShop', 'Compare Google Cloud and Microsoft Azure accounts and credits available through GoCloudShop.'),
('digitalocean-vs-linode', 'DigitalOcean vs Linode', 'provider_vs_provider',
  (select array_agg(id) from providers where slug in ('digitalocean','linode')),
  'Compare DigitalOcean and Linode for developer-focused cloud accounts.',
  '[
    {"feature":"Pricing model via GoCloudShop","values":{"digitalocean":"Droplet-capacity tiers","linode":"Credit packages and specialized accounts"}},
    {"feature":"Best suited for","values":{"digitalocean":"Straightforward compute deployment","linode":"Credit-based flexible usage"}}
  ]'::jsonb, 5, 'DigitalOcean vs Linode — Cloud Provider Comparison | GoCloudShop', 'Compare DigitalOcean and Linode accounts available through GoCloudShop.'),
('oracle-cloud-vs-aws', 'Oracle Cloud vs AWS', 'provider_vs_provider',
  (select array_agg(id) from providers where slug in ('oracle-cloud','aws')),
  'Compare Oracle Cloud Infrastructure and AWS accounts and credits.',
  '[
    {"feature":"Credits available via GoCloudShop","values":{"oracle-cloud":"$300","aws":"$1K – $100K"}},
    {"feature":"Account tiers available","values":{"oracle-cloud":"Aged, Upgraded","aws":"Free Trial, Compute (6 tiers), AI (7 products)"}}
  ]'::jsonb, 6, 'Oracle Cloud vs AWS — Cloud Provider Comparison | GoCloudShop', 'Compare Oracle Cloud and AWS accounts and credits available through GoCloudShop.'),
('ibm-cloud-vs-aws', 'IBM Cloud vs AWS', 'provider_vs_provider',
  (select array_agg(id) from providers where slug in ('ibm-cloud','aws')),
  'Compare IBM Cloud and AWS accounts, including AI and Kubernetes access.',
  '[
    {"feature":"AI platform","values":{"ibm-cloud":"Watson AI","aws":"SageMaker, Bedrock (availability varies)"}},
    {"feature":"Kubernetes access","values":{"ibm-cloud":"Yes (via free trial)","aws":"Via applicable account configuration"}}
  ]'::jsonb, 7, 'IBM Cloud vs AWS — Cloud Provider Comparison | GoCloudShop', 'Compare IBM Cloud and AWS accounts available through GoCloudShop.'),
('ai-cloud-providers', 'AI Cloud Provider Comparison', 'topic',
  (select array_agg(id) from providers where slug in ('aws','google-cloud','azure')),
  'Compare AI-ready cloud account options across AWS, Google Cloud and Azure.',
  '[
    {"feature":"AI-ready accounts available","values":{"aws":"7 dedicated AI account products","google-cloud":"AI-tagged credit tiers (from $1K)","azure":"AI-ready credit and infrastructure options"}},
    {"feature":"Aged/established AI accounts","values":{"aws":"Yes (multi-year aged tiers)","google-cloud":"Not currently offered","azure":"Not currently offered"}}
  ]'::jsonb, 8, 'AI Cloud Provider Comparison | GoCloudShop', 'Compare AI-ready cloud accounts across AWS, Google Cloud and Azure.'),
('gpu-cloud-providers', 'GPU Cloud Comparison', 'topic',
  (select array_agg(id) from providers where slug in ('aws','google-cloud','azure')),
  'GPU cloud availability across supported providers.',
  '[
    {"feature":"Dedicated GPU account products","values":{"aws":"Not currently listed — contact support for availability","google-cloud":"Not currently listed — contact support for availability","azure":"Not currently listed — contact support for availability"}}
  ]'::jsonb, 9, 'GPU Cloud Comparison | GoCloudShop', 'Compare GPU cloud availability across GoCloudShop''s supported providers.'),
('cloud-credit-comparison', 'Cloud Credit Comparison', 'topic',
  (select array_agg(id) from providers where slug in ('aws','google-cloud','azure','oracle-cloud','linode')),
  'Compare cloud credit package sizes and starting prices across every supported provider.',
  '[
    {"feature":"Smallest credit package","values":{"aws":"$1K","google-cloud":"$300","azure":"$1K","oracle-cloud":"$300","linode":"$100"}},
    {"feature":"Largest credit package","values":{"aws":"$100K","google-cloud":"$25K","azure":"$25K","oracle-cloud":"$300","linode":"$100"}}
  ]'::jsonb, 10, 'Cloud Credit Comparison | GoCloudShop', 'Compare cloud credit package sizes and prices across every supported provider.')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- use_cases
-- ---------------------------------------------------------------------------

insert into use_cases (slug, title, description, icon, content, related_category_ids, sort_order, seo_title, seo_description) values
('ai-machine-learning', 'AI & Machine Learning', 'AI-ready cloud accounts for model development, training and inference.', 'BrainCircuit', 'GoCloudShop''s AI Cloud category lists AI-enabled accounts across compute tiers, suited to development, experimentation and production AI/ML workloads.', (select array_agg(id) from categories where slug in ('ai-cloud','ai-ml')), 1, 'AI & Machine Learning Cloud Infrastructure | GoCloudShop', 'Explore AI-ready cloud accounts for machine learning development and inference.'),
('generative-ai', 'Generative AI', 'Infrastructure for generative AI development and experimentation.', 'Sparkles', 'AI-enabled accounts and credit packages provide the underlying compute for generative AI projects, from prototyping to scaled workloads.', (select array_agg(id) from categories where slug in ('ai-cloud')), 2, 'Generative AI Cloud Infrastructure | GoCloudShop', 'Explore cloud infrastructure suited to generative AI development.'),
('saas', 'SaaS Development', 'Reliable compute and credits for building and scaling SaaS products.', 'LayoutGrid', 'Compute accounts and cloud credits give SaaS teams flexible infrastructure to build, test and scale, without long-term provider commitments.', (select array_agg(id) from categories where slug in ('compute','cloud-credits')), 3, 'Cloud Infrastructure for SaaS Development | GoCloudShop', 'Explore compute and credit options suited to SaaS development.'),
('web-hosting', 'Web Hosting', 'Cloud accounts suited to hosting websites and web applications.', 'Globe', 'Cloud compute accounts across providers give hosting businesses and agencies a foundation for client sites and applications.', (select array_agg(id) from categories where slug in ('cloud-accounts','compute')), 4, 'Cloud Accounts for Web Hosting | GoCloudShop', 'Explore cloud accounts suited to web hosting workloads.'),
('cloud-computing', 'Cloud Computing', 'General-purpose cloud compute for any project.', 'Cloud', 'Browse compute accounts across every supported provider, sized from lightweight development environments to large production workloads.', (select array_agg(id) from categories where slug in ('compute','cloud-accounts')), 5, 'General Cloud Computing Infrastructure | GoCloudShop', 'Explore general-purpose cloud compute accounts across providers.'),
('gpu-computing', 'GPU Computing', 'GPU-accelerated infrastructure for compute-intensive workloads.', 'Cpu', 'GoCloudShop lists GPU-tagged products as they become available; check back or contact support for current GPU cloud availability.', (select array_agg(id) from categories where slug in ('gpu-cloud')), 6, 'GPU Computing Infrastructure | GoCloudShop', 'Explore GPU cloud computing options at GoCloudShop.'),
('development-testing', 'Development & Testing', 'Affordable accounts for development and QA environments.', 'FlaskConical', 'Free trial and lower compute-tier accounts are well suited to development and testing environments before production scale-up.', (select array_agg(id) from categories where slug in ('free-trials','compute')), 7, 'Cloud Accounts for Development & Testing | GoCloudShop', 'Explore free trial and compute accounts suited to dev/test environments.'),
('devops', 'DevOps', 'Infrastructure for CI/CD pipelines and DevOps workflows.', 'GitBranch', 'Compute and PAYG accounts provide flexible infrastructure for DevOps pipelines, staging environments and automation workloads.', (select array_agg(id) from categories where slug in ('compute','pay-as-you-go')), 8, 'Cloud Infrastructure for DevOps | GoCloudShop', 'Explore compute and PAYG accounts suited to DevOps workflows.'),
('kubernetes', 'Kubernetes', 'Cloud accounts with Kubernetes access for container orchestration.', 'Boxes', 'IBM Cloud''s free trial includes Kubernetes and OpenShift access; other providers'' Kubernetes services are reachable through their standard compute accounts.', (select array_agg(id) from categories where slug in ('cloud-accounts')), 9, 'Kubernetes-Ready Cloud Accounts | GoCloudShop', 'Explore cloud accounts with Kubernetes access.'),
('data-engineering', 'Data Engineering', 'Compute and storage infrastructure for data pipelines.', 'Database', 'Higher compute-tier accounts and cloud credits support data engineering workloads such as pipeline processing and warehousing.', (select array_agg(id) from categories where slug in ('compute','cloud-credits')), 10, 'Cloud Infrastructure for Data Engineering | GoCloudShop', 'Explore compute and credit options suited to data engineering.'),
('data-analytics', 'Data Analytics', 'Infrastructure for analytics and BigQuery/analytics-style workloads.', 'BarChart3', 'Cloud credit packages provide budget for analytics services such as BigQuery, alongside general compute for processing pipelines.', (select array_agg(id) from categories where slug in ('cloud-credits')), 11, 'Cloud Infrastructure for Data Analytics | GoCloudShop', 'Explore credit and compute options suited to data analytics.'),
('research', 'Research', 'Flexible, low-commitment infrastructure for research projects.', 'Microscope', 'Free trial accounts and smaller credit packages give researchers a low-commitment way to access cloud and AI infrastructure.', (select array_agg(id) from categories where slug in ('free-trials','cloud-credits')), 12, 'Cloud Infrastructure for Research | GoCloudShop', 'Explore free trial and credit options suited to research projects.'),
('startup-infrastructure', 'Startup Infrastructure', 'Cost-conscious cloud infrastructure for early-stage startups.', 'Rocket', 'Free trials, entry-level compute and smaller credit packages help startups get infrastructure running without large upfront spend.', (select array_agg(id) from categories where slug in ('free-trials','compute')), 13, 'Cloud Infrastructure for Startups | GoCloudShop', 'Explore startup-friendly cloud accounts and credits.'),
('enterprise-infrastructure', 'Enterprise Infrastructure', 'Large-scale cloud and AI infrastructure for enterprise teams.', 'Building2', 'Enterprise-tier credits and AI accounts provide large-scale cloud usage with enterprise billing environments.', (select array_agg(id) from categories where slug in ('enterprise')), 14, 'Enterprise Cloud Infrastructure | GoCloudShop', 'Explore enterprise-scale cloud accounts, credits and AI infrastructure.')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- guides
-- ---------------------------------------------------------------------------

insert into guides (slug, title, excerpt, content, guide_type, related_category_id, tags, status, published_at, seo_title, seo_description) values
('cloud-account-buying-guide', 'Cloud Account Buying Guide', 'What to check before buying a cloud account: provider, specs, region, delivery and support.', E'## What to check before buying\n\nBefore choosing a cloud account, review the provider, compute specifications, region availability, delivery time and support type listed on the product page. Every GoCloudShop listing shows these details before you order.\n\n## Matching an account to your project\n\nStart from your workload''s needs (compute, storage, AI capability) and use the category and filter pages to narrow down providers and tiers rather than starting from price alone.\n\n## Ordering\n\nOnce you''ve selected a product and variation, click **Buy Now** to review your order and complete secure crypto payment at checkout.', 'guide', (select id from categories where slug='cloud-accounts'), array['buying-guide','cloud-accounts'], 'published', now(), 'Cloud Account Buying Guide | GoCloudShop', 'Learn what to check before buying a cloud account, from specifications to delivery and support.'),
('cloud-credit-buying-guide', 'Cloud Credit Buying Guide', 'How cloud credit packages work and how to choose the right size.', E'## How cloud credits work\n\nCloud credit packages provide prepaid usage value on a provider''s platform. GoCloudShop lists credit packages across AWS, Google Cloud, Azure, Oracle Cloud and Linode in a range of sizes.\n\n## Choosing a package size\n\nCompare package sizes on the [Cloud Credit Comparison](/compare/cloud-credit-comparison) page, and check each listing''s specifications for the exact credit amount and any provider-specific limitations before ordering.', 'guide', (select id from categories where slug='cloud-credits'), array['buying-guide','credits'], 'published', now(), 'Cloud Credit Buying Guide | GoCloudShop', 'Learn how cloud credit packages work and how to choose the right size for your project.'),
('ai-cloud-guide', 'AI Cloud Guide', 'An overview of AI-ready cloud accounts and what to look for.', E'## What makes an account AI-ready\n\nAI-ready accounts on GoCloudShop are flagged `AI Enabled` and list AI-specific details such as request-per-minute capacity, compute tier and support level directly on the product page.\n\n## Choosing between AI account tiers\n\nCompare request capacity, vCPU and support rating across the AI Cloud category page before ordering, and check the **AI Specifications** section on each product page for the exact details configured for that listing.', 'guide', (select id from categories where slug='ai-cloud'), array['ai-cloud','guide'], 'published', now(), 'AI Cloud Guide | GoCloudShop', 'An overview of AI-ready cloud accounts and how to choose between tiers.'),
('gpu-cloud-guide', 'GPU Cloud Guide', 'What to know about GPU cloud infrastructure availability.', E'## GPU cloud at GoCloudShop\n\nGPU-tagged products are flagged with `is_gpu` and appear in the GPU Cloud category automatically as they''re added to the catalog. Check the GPU Cloud page or contact support for current availability.', 'guide', (select id from categories where slug='gpu-cloud'), array['gpu','guide'], 'published', now(), 'GPU Cloud Guide | GoCloudShop', 'What to know about GPU cloud infrastructure availability at GoCloudShop.'),
('cloud-provider-guide', 'Cloud Provider Guide', 'An overview of every provider supported on GoCloudShop.', E'## Supported providers\n\nGoCloudShop lists accounts and credits from AWS, Google Cloud, Azure, DigitalOcean, Oracle Cloud, Linode, IBM Cloud, Kamatera, Alibaba Cloud and Atlantic.Net. Visit each [provider page](/providers) for its full product catalog, description and starting price.', 'provider_guide', null, array['providers'], 'published', now(), 'Cloud Provider Guide | GoCloudShop', 'An overview of every cloud provider supported on GoCloudShop.'),
('cloud-pricing-guide', 'Cloud Pricing Guide', 'How pricing works across GoCloudShop''s catalog.', E'## How pricing works\n\nEvery price shown on GoCloudShop comes directly from our product database and is kept current by our team. Products with multiple tiers (variations) show a starting "from" price on listing pages; select a variation on the product page to see its exact price.\n\nPrices do not include any third-party provider billing that may apply after account setup — check each listing''s **Before You Order** section for details.', 'guide', null, array['pricing'], 'published', now(), 'Cloud Pricing Guide | GoCloudShop', 'Understand how pricing works across GoCloudShop''s cloud and AI product catalog.'),
('ai-infrastructure-guide', 'AI Infrastructure Guide', 'Planning cloud infrastructure for AI workloads.', E'## Planning AI infrastructure\n\nAI workloads vary widely in compute and support needs. Review each AI product''s compute tier, request-per-minute capacity and support rating, and use the [AI Cloud Provider Comparison](/compare/ai-cloud-providers) to compare options across providers before ordering.', 'guide', (select id from categories where slug='ai-cloud'), array['ai','infrastructure'], 'published', now(), 'AI Infrastructure Guide | GoCloudShop', 'Guidance on planning cloud infrastructure for AI workloads.'),
('cloud-account-setup-guide', 'Cloud Account Setup Guide', 'What happens after you order a cloud account.', E'## After you order\n\nOnce you contact support via Telegram with your selected product and variation, our team confirms availability and order details, processes payment, then delivers access information. See [How It Works](/how-it-works) for the full step-by-step flow.', 'guide', null, array['setup'], 'published', now(), 'Cloud Account Setup Guide | GoCloudShop', 'What to expect after ordering a cloud account from GoCloudShop.'),
('cloud-security-guide', 'Cloud Security Guide', 'Security practices to follow after receiving a cloud account.', E'## After delivery\n\nOnce you receive access to a cloud account, we recommend immediately rotating any shared credentials, enabling multi-factor authentication where the provider supports it, and reviewing the provider''s own security documentation for the services you plan to use.', 'guide', null, array['security'], 'published', now(), 'Cloud Security Guide | GoCloudShop', 'Security practices to follow after receiving a cloud account from GoCloudShop.'),
('cloud-cost-optimization-guide', 'Cloud Cost Optimization Guide', 'Tips for getting more value from cloud credits and compute accounts.', E'## Getting the most from your credits\n\nMonitor usage against your credit balance regularly through the provider''s own billing dashboard, right-size compute tiers to actual workload demand, and shut down unused resources between work sessions.', 'guide', (select id from categories where slug='cloud-credits'), array['cost-optimization'], 'published', now(), 'Cloud Cost Optimization Guide | GoCloudShop', 'Tips for getting more value from cloud credits and compute accounts.'),
('ai-infrastructure-planning-guide', 'AI Infrastructure Planning Guide', 'How to plan compute capacity for an AI project.', E'## Planning compute capacity\n\nEstimate your AI workload''s request volume and compute needs before selecting a tier — GoCloudShop''s AI accounts range from 10 RPM/32 vCPU starter tiers up to enterprise-scale 384 vCPU accounts. Start smaller and scale up as usage grows.', 'guide', (select id from categories where slug='ai-cloud'), array['ai','planning'], 'published', now(), 'AI Infrastructure Planning Guide | GoCloudShop', 'How to plan cloud compute capacity for an AI project.')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- stock updates — dated stock-availability announcements. Same `guides`
-- table (guide_type = 'stock_update'), with the additive price/currency/
-- availability columns populated. Mirrors src/lib/mock-data.ts mockGuides.
-- ---------------------------------------------------------------------------

insert into guides (slug, title, excerpt, content, guide_type, related_provider_id, related_category_id, tags, status, published_at, seo_title, seo_description, price, currency, availability) values
('azure-1000-credit-gpt5-mini-working', 'Azure Account with $1000 Credit — OpenAI GPT-5 Mini Working', 'A Microsoft Azure account with $1,000 in credit and confirmed working access to OpenAI GPT-5 Mini through Azure OpenAI Service.', E'## What''s included\n\n- $1,000 Azure credit balance\n- Confirmed working access to OpenAI GPT-5 Mini via Azure OpenAI Service\n- Active billing, identity and phone verification already complete\n- Clean account history\n\nThis is a limited batch — once sold out, the next confirmed batch will be posted here.', 'stock_update', (select id from providers where slug='azure'), (select id from categories where slug='ai-cloud'), array['Premium Stock','AI Enabled','Credit-Loaded'], 'published', '2026-08-13T09:00:00Z', 'Azure Account with $1000 Credit — GPT-5 Mini Working | GoCloudShop Stock Updates', 'Limited-availability Azure account with $1,000 credit and confirmed OpenAI GPT-5 Mini access via Azure OpenAI Service.', 249, 'USD', 'limited'),
('aws-512vcpu-bedrock-claude-opus', 'AWS AI Account — 512 vCPU, Bedrock Claude Opus Ready', 'A high-compute, multi-year aged AWS account with Amazon Bedrock pre-enabled for Claude Opus and 512 vCPU of capacity.', E'## What''s included\n\n- 512 vCPU compute capacity\n- Amazon Bedrock enabled with Claude Opus access\n- Multi-year aged account history\n- Pre-raised service limits\n\nIdeal for production-scale generative AI workloads that need both compute headroom and model access already approved.', 'stock_update', (select id from providers where slug='aws'), (select id from categories where slug='ai-cloud'), array['Premium Stock','AI Enabled','Aged Account'], 'published', '2026-08-12T09:00:00Z', 'AWS AI Account — 512 vCPU, Bedrock Claude Opus Ready | GoCloudShop Stock Updates', 'High-compute AWS account with Amazon Bedrock Claude Opus access pre-enabled and 512 vCPU of capacity.', 1499, 'USD', 'limited'),
('google-cloud-5k-credit-vertex-gemini-ultra', 'Google Cloud Account — $5K Credit, Vertex AI Gemini Ultra Enabled', 'A Google Cloud account with $5,000 in credit and Vertex AI configured for Gemini Ultra access.', E'## What''s included\n\n- $5,000 Google Cloud credit balance\n- Vertex AI enabled with Gemini Ultra access\n- Fully verified billing and identity\n- Clean account history\n\nA strong option for teams building on Gemini Ultra without waiting on Vertex AI quota approvals.', 'stock_update', (select id from providers where slug='google-cloud'), (select id from categories where slug='ai-cloud'), array['Premium Stock','AI Enabled','Credit-Loaded'], 'published', '2026-08-11T09:00:00Z', 'Google Cloud Account — $5K Credit, Vertex AI Gemini Ultra | GoCloudShop Stock Updates', 'Google Cloud account with $5,000 credit and Vertex AI Gemini Ultra access already enabled.', 899, 'USD', 'in_stock'),
('oracle-cloud-multi-year-aged-tenancy', 'Oracle Cloud — Multi-Year Aged Tenancy, Always Free Unlocked', 'An Oracle Cloud Infrastructure tenancy with multi-year account history and Always Free resources unlocked.', E'## What''s included\n\n- 2+ years of clean tenancy history\n- Always Free resources (Ampere A1 ARM, block storage) unlocked\n- Higher initial service limits\n- Verified billing\n\nSuited to long-running workloads where account stability and established history matter.', 'stock_update', (select id from providers where slug='oracle-cloud'), (select id from categories where slug='cloud-accounts'), array['Premium Stock','Aged Account'], 'published', '2026-08-10T09:00:00Z', 'Oracle Cloud — Multi-Year Aged Tenancy | GoCloudShop Stock Updates', 'Multi-year aged Oracle Cloud tenancy with Always Free resources unlocked and higher service limits.', 349, 'USD', 'in_stock'),
('linode-port-25-open-high-traffic', 'Linode Account — Port 25 Open, High-Traffic Ready', 'A Linode account configured with Port 25 open for email infrastructure and sized for high-traffic workloads.', E'## What''s included\n\n- Port 25 open — no restrictions on outbound SMTP\n- Sized for high-traffic email/web workloads\n- Verified billing and clean history\n\nThis batch has now sold out — check back for the next confirmed restock.', 'stock_update', (select id from providers where slug='linode'), (select id from categories where slug='cloud-accounts'), array['Premium Stock','Port 25 Open'], 'published', '2026-08-08T09:00:00Z', 'Linode Account — Port 25 Open, High-Traffic Ready | GoCloudShop Stock Updates', 'Linode account with Port 25 open for email infrastructure, sized for high-traffic workloads.', 129, 'USD', 'out_of_stock')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- faqs (global — spec §38, business-policy-driven answers)
-- ---------------------------------------------------------------------------

insert into faqs (question, answer, category, sort_order) values
('What does GoCloudShop offer?', 'GoCloudShop is a cloud and AI infrastructure marketplace offering cloud accounts, cloud credits, AI-ready accounts and compute solutions from multiple providers, each listed with transparent pricing and specifications.', 'General', 1),
('What is an AI Cloud product?', 'An AI Cloud product is a cloud account configured and flagged as AI-enabled — suited to AI development, experimentation or production workloads. Each AI product page lists its specific AI specifications, such as request capacity and compute tier.', 'General', 2),
('Which providers are available?', 'GoCloudShop currently lists AWS, Google Cloud, Microsoft Azure, DigitalOcean, Oracle Cloud, Linode, IBM Cloud, Kamatera, Alibaba Cloud and Atlantic.Net. Browse all providers on the Providers page.', 'General', 3),
('How do I order?', 'Select a product and variation, click "Buy Now", then review your order and complete payment securely with cryptocurrency at checkout. Your order status updates automatically once payment is confirmed.', 'Ordering', 4),
('How quickly is an order processed?', 'Processing time depends on the specific product''s configured delivery time, shown on its product page. Our support team confirms availability and order details with you via Telegram before delivery.', 'Ordering', 5),
('What payment methods are supported?', 'Payment methods are confirmed directly with our support team via Telegram during order confirmation, since accepted methods can vary by product and region.', 'Ordering', 6),
('Do products have replacement policies?', 'Where configured, a product''s replacement policy is shown in its Before You Order section. Not every product has the same policy, so check the specific listing before ordering.', 'Policies', 7),
('Do products have refund policies?', 'Where configured, a product''s refund policy is shown in its Before You Order section. See our Refund Policy page for our general terms.', 'Policies', 8),
('Can I compare products?', 'Yes. Use the Compare section to view side-by-side provider and product comparisons across compute, pricing, AI capabilities and more.', 'General', 9),
('Do you offer AI/GPU products?', 'Yes, AI-ready accounts are available now under AI Cloud. GPU-tagged products appear automatically in the GPU Cloud category as they''re added to the catalog — check that page or contact support for current availability.', 'General', 10),
('How can I contact support?', 'The fastest way to reach us is via Telegram — use the "Contact Support" or "Contact Us" links found throughout the site.', 'General', 11)
on conflict do nothing;
