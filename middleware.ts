import { auth } from "./auth"

export default auth((req) => {
  // ログインが必要なページを定義
  const isProtectedPage = req.nextUrl.pathname.startsWith(`/user`)

  // ログインしていない場合、トップ以外のページにアクセスした時はトップページにリダイレクト
  if (!req.auth && isProtectedPage) {
    const newUrl = new URL("/", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
})

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}