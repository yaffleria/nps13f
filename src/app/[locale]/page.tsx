import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function HomePage() {
  const t = useTranslations("HomePage");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <main className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold">{t("title")}</h1>
        <div className="flex gap-4">
          <Link href="/" locale="en" className="text-blue-500 hover:underline">
            English
          </Link>
          <Link href="/" locale="ko" className="text-blue-500 hover:underline">
            한국어
          </Link>
        </div>
      </main>
    </div>
  );
}
