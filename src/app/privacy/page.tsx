import { Metadata } from "next";
import Link from "next/link";
import { GlobalHeader } from "@/widgets/GlobalHeader/GlobalHeader";
import { GlobalFooter } from "@/widgets/GlobalFooter/GlobalFooter";
import { FadeIn } from "@/shared/ui/FadeIn";

export const metadata: Metadata = {
  title: "Privacy Policy - NPS 13F",
  description:
    "Privacy Policy for NPS 13F. Learn about our personal information collection, usage, and protection policies.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  const currentDate = "January 22, 2026";
  const effectiveDate = "January 22, 2026";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <GlobalHeader />

      <main className="container mx-auto px-4 py-8" role="main">
        <FadeIn>
          <article className="max-w-4xl mx-auto prose prose-invert prose-lg">
            <header className="mb-12 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Privacy Policy
              </h1>
              <p className="text-secondary">
                Effective Date: {effectiveDate} | Last Updated: {currentDate}
              </p>
            </header>

            <div className="space-y-10 text-secondary leading-relaxed">
              {/* Overview */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">1. Overview</h2>
                <p>
                  NPS 13F (hereinafter referred to as &quot;Service&quot;) values your privacy and
                  complies with relevant laws such as the Personal Information Protection Act.
                </p>
                <p className="mt-3">
                  This Privacy Policy explains what personal information we collect, how we use it,
                  how long we retain it, third-party provision, and your rights.
                </p>
              </section>

              {/* Information Collected */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">
                  2. Information We Collect
                </h2>
                <p>
                  The Service can be used without registration. However, the following information
                  may be automatically collected:
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>
                    <strong>Automatically Collected Information:</strong> IP address, browser type,
                    operating system, visit time, page view history, cookies, access logs
                  </li>
                  <li>
                    <strong>Device Information:</strong> Device identifier, screen resolution,
                    language settings
                  </li>
                </ul>
              </section>

              {/* Purpose of Collection */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">
                  3. Purpose of Collection and Use
                </h2>
                <p>The collected information is used for the following purposes:</p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>Service provision and operation</li>
                  <li>Service usage analysis and improvement</li>
                  <li>Prevention of fraudulent use and ensuring service stability</li>
                  <li>
                    Provision of personalized advertisements (when using third-party ad services)
                  </li>
                </ul>
              </section>

              {/* Cookies */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">
                  4. Cookies and Tracking Technologies
                </h2>
                <p>
                  The Service uses cookies to improve user experience and for statistical analysis.
                  A cookie is a small text file stored on your browser by the website.
                </p>

                <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  4.1 Third-Party Services Used
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Vercel Analytics:</strong> Website performance monitoring
                  </li>
                </ul>
                <p className="text-sm text-secondary mt-2">
                  * Note: We have removed Google Analytics and Google AdSense from our service.
                </p>

                <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  4.2 Cookie Management
                </h3>
                <p>
                  You can refuse or delete cookies through your browser settings. However, disabling
                  cookies may limit some service functions.
                </p>
              </section>

              {/* Retention Period */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">
                  5. Retention and Use Period
                </h2>
                <p>
                  Automatically collected logs and usage records are retained for{" "}
                  <strong>1 year</strong> for service operation and analysis purposes, and then
                  destroyed.
                </p>
                <p className="mt-3">
                  However, if preservation is required by relevant laws, we will retain the
                  information for the period prescribed by such laws.
                </p>
              </section>

              {/* Third Party Provision */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">
                  6. Provision to Third Parties
                </h2>
                <p>
                  The Service does not provide your personal information to external parties in
                  principle. However, exceptions are made in the following cases:
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>With your prior consent</li>
                  <li>
                    In accordance with the provisions of the law, or upon request of an
                    investigative agency in accordance with the procedures and methods prescribed by
                    law for investigation purposes
                  </li>
                </ul>
              </section>

              {/* User Rights */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">7. User Rights</h2>
                <p>You may exercise the following rights at any time:</p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>Request for access to personal information</li>
                  <li>Request for correction of personal information</li>
                  <li>Request for deletion of personal information</li>
                  <li>Request for suspension of personal information processing</li>
                </ul>
                <p className="mt-4">
                  You can request these rights through the contact information below.
                </p>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">8. Privacy Contact</h2>
                <p>
                  If you have any questions regarding personal information processing, please
                  contact us at:
                </p>
                <div className="mt-4 p-4 bg-surface rounded-lg border border-border">
                  <p>
                    <strong>Email:</strong> yaffleria@gmail.com
                  </p>
                  <p className="mt-2">
                    <strong>Contact Channel:</strong>{" "}
                    <a
                      href="https://x.com/charlotteprism"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      X (Twitter) @charlotteprism
                    </a>
                  </p>
                </div>
              </section>

              {/* Children */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">
                  9. Protection of Children
                </h2>
                <p>
                  This Service is not intended for children under the age of 14, and we do not
                  knowingly collect personal information from children under 14. If we become aware
                  that we have collected personal information from a child under 14, we will delete
                  it immediately.
                </p>
              </section>

              {/* Changes */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">
                  10. Changes to Privacy Policy
                </h2>
                <p>
                  This Privacy Policy may be updated to reflect changes in laws, policies, or the
                  Service. We will notify you of any changes through the website notice, and the
                  amended policy will take effect 7 days after the notice.
                </p>
              </section>

              {/* International Users */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">11. International Users</h2>
                <p>
                  This Service is operated in the Republic of Korea and is subject to the laws of
                  the Republic of Korea. If you use the Service from outside Korea, please be aware
                  that your information may be transferred to, stored, and processed in Korea.
                </p>
              </section>
            </div>

            {/* Footer Navigation */}
            <footer className="mt-16 pt-8 border-t border-border text-center">
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link href="/" className="text-primary hover:underline">
                  Home
                </Link>
                <span className="text-muted">|</span>
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>
                <span className="text-muted">|</span>
                <Link href="/disclaimer" className="text-primary hover:underline">
                  Disclaimer
                </Link>
                <span className="text-muted">|</span>
                <Link href="/contact" className="text-primary hover:underline">
                  Contact
                </Link>
              </div>
            </footer>
          </article>
        </FadeIn>
      </main>

      <GlobalFooter />
    </div>
  );
}
