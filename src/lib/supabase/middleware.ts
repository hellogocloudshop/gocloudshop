import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./env";

const ADMIN_ROLES = new Set(["admin", "editor"]);

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = request.nextUrl.pathname === "/admin/login";

  if (!isSupabaseConfigured()) {
    // No project connected yet — allow /admin/login through so setup docs are
    // reachable, but there is no real session to protect other admin routes with.
    if (isAdminRoute && !isLoginRoute) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return response;
  }

  const supabase = createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdminRoute) return response;
  if (isLoginRoute) return response;

  if (!user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();

  if (!profile || !ADMIN_ROLES.has(profile.role)) {
    return NextResponse.redirect(new URL("/admin/login?error=unauthorized", request.url));
  }

  return response;
}
