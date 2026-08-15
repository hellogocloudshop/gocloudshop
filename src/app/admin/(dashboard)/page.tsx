import Link from "next/link";
import { Package, Cloud, FolderTree, Inbox } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getOrderCounts } from "@/lib/data/orders";

async function getCount(table: string) {
  const supabase = await createClient();
  if (!supabase) return 0;
  const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
  return count ?? 0;
}

export default async function AdminDashboardPage() {
  const [productCount, providerCount, categoryCount, orderCounts] = await Promise.all([
    getCount("products"),
    getCount("providers"),
    getCount("categories"),
    getOrderCounts(),
  ]);

  const newOrders = orderCounts.new;

  const stats = [
    { label: "Products", value: productCount, href: "/admin/products", icon: Package },
    { label: "Providers", value: providerCount, href: "/admin/providers", icon: Cloud },
    { label: "Categories", value: categoryCount, href: "/admin/categories", icon: FolderTree },
    { label: "New Orders", value: newOrders, href: "/admin/orders", icon: Inbox },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-muted">An overview of your catalog and recent order activity.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, href, icon: Icon }) => (
          <Link key={label} href={href} className="card-surface card-surface-hover flex items-center gap-4 p-5">
            <span className="icon-tile icon-tile-a">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-2xl font-bold text-ink">{value}</p>
              <p className="text-sm text-ink-muted">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 card-surface p-6">
        <h2 className="font-semibold text-ink">Getting Started</h2>
        <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm text-ink-muted">
          <li>
            Manage your catalog under <Link href="/admin/products" className="text-accent-blue">Products</Link> —
            each product can have multiple price/spec variations.
          </li>
          <li>
            Configure your Telegram order handle and policies under{" "}
            <Link href="/admin/settings" className="text-accent-blue">Settings</Link>.
          </li>
          <li>
            Review incoming orders under <Link href="/admin/orders" className="text-accent-blue">Orders</Link>.
          </li>
        </ul>
      </div>
    </div>
  );
}
