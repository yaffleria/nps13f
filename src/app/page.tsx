import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-background text-foreground">
      <main className="flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
          NPS 13F
        </h1>
        <p className="text-text-secondary text-lg">유용한 웹 도구 모음</p>
        <div className="flex gap-4">
          <Link
            href="/tools"
            className="px-6 py-3 rounded-2xl bg-primary text-white font-semibold hover:bg-blue-600 transition-colors"
          >
            시작하기
          </Link>
        </div>
      </main>
    </div>
  );
}
