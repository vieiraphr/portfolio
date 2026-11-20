import { NextResponse, type NextRequest } from "next/server";

/**
 * - "/" vai para /pt ou /en de acordo com o idioma do navegador (português é o padrão).
 * - "/favicon.ico" (pedido automático dos navegadores) aponta para o ícone do site,
 *   em vez de cair na rota [lang] como se fosse um idioma.
 */
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/favicon.ico") {
    return NextResponse.rewrite(new URL("/icon.svg", request.url));
  }

  const accept = request.headers.get("accept-language") ?? "";
  const first = accept.split(",")[0]?.trim().toLowerCase() ?? "";
  const lang = first.startsWith("en") ? "en" : "pt";

  return NextResponse.redirect(new URL(`/${lang}`, request.url));
}

export const config = {
  matcher: ["/", "/favicon.ico"],
};
