import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function isSupabaseAuthCookie(name: string) {
  return name.startsWith("sb-");
}

function clearSupabaseAuthCookies(request: NextRequest, response: NextResponse) {
  request.cookies.getAll().forEach(({ name }) => {
    if (!isSupabaseAuthCookie(name)) {
      return;
    }

    request.cookies.delete(name);
    response.cookies.delete(name);
  });
}

export const createClient = (request: NextRequest) => {
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next({
      request: {
        headers: request.headers
      }
    });
  }

  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers
    }
  });

  type CookieToSet = {
    name: string;
    value: string;
    options?: Parameters<(typeof supabaseResponse.cookies)["set"]>[2];
  };

  createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      }
    }
  });

  return supabaseResponse;
};

export const updateSession = async (request: NextRequest) => {
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next({
      request: {
        headers: request.headers
      }
    });
  }

  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers
    }
  });

  type CookieToSet = {
    name: string;
    value: string;
    options?: Parameters<(typeof supabaseResponse.cookies)["set"]>[2];
  };

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      }
    }
  });

  const { error } = await supabase.auth.getUser();

  if (error && error.message.includes("Invalid Refresh Token")) {
    clearSupabaseAuthCookies(request, supabaseResponse);
  }

  return supabaseResponse;
};
