import { Metadata } from "next";
import Link from "next/link";
import { GlobalHeader } from "@/widgets/GlobalHeader/GlobalHeader";
import { GlobalFooter } from "@/widgets/GlobalFooter/GlobalFooter";
import { FadeIn } from "@/shared/ui/FadeIn";
import { AlertTriangle, TrendingUp, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Disclaimer - NPS 13F",
  description:
    "Disclaimer for NPS 13F. Important information regarding investment risks and data accuracy.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function DisclaimerPage() {
  const currentDate = "January 22, 2026";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <GlobalHeader />

      <main className="container mx-auto px-4 py-8" role="main">
        <FadeIn>
          <article className="max-w-4xl mx-auto prose prose-invert prose-lg">
            <header className="mb-12 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Disclaimer
              </h1>
              <p className="text-secondary">Last Updated: {currentDate}</p>
            </header>

            <div className="space-y-8">
              {/* Not Financial Advice */}
              <section className="bg-surface/50 p-8 rounded-2xl border border-border shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-negative/10 rounded-xl shrink-0">
                    <AlertTriangle className="w-8 h-8 text-negative" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mt-0 mb-4">
                      No Financial Advice
                    </h2>
                    <div className="text-secondary space-y-4">
                      <p>
                        The content provided on <strong>NPS 13F</strong> is for{" "}
                        <strong>informational and educational purposes only</strong>. It should not
                        be construed as professional financial advice, investment recommendation, or
                        solicitation to buy or sell any securities.
                      </p>
                      <p>
                        We do not provide personalized financial, legal, or tax advice. The
                        information on this website is general in nature and may not be suitable for
                        your specific personal or financial situation.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Investment Risks */}
              <section className="p-8 rounded-2xl border border-border">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl shrink-0">
                    <TrendingUp className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mt-0 mb-4">
                      Investment Risks
                    </h2>
                    <div className="text-secondary space-y-4">
                      <p>
                        Investing in the stock market involves a high degree of risk, including the
                        loss of principal. Past performance of any security, portfolio, or strategy
                        is no guarantee of future results.
                      </p>
                      <p>
                        The National Pension Service (NPS) is a large institutional investor with a
                        long-term investment horizon and risk tolerance that may differ
                        significantly from that of individual investors. Identifying stocks held by
                        NPS does not guarantee their future performance or suitability for your
                        portfolio.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Data Accuracy */}
              <section className="p-8 rounded-2xl border border-border">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-accent/10 rounded-xl shrink-0">
                    <BookOpen className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mt-0 mb-4">
                      Data Accuracy and Limitations
                    </h2>
                    <div className="text-secondary space-y-4">
                      <p>
                        The data presented on this website is based on <strong>Form 13F</strong>{" "}
                        filings submitted to the U.S. Securities and Exchange Commission (SEC).
                      </p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>
                          <strong>Time Lag:</strong> 13F filings are submitted up to 45 days after
                          the end of each calendar quarter. Therefore, the data shown represents
                          holdings as of the quarter-end and may not reflect current positions.
                        </li>
                        <li>
                          <strong>Scope:</strong> The data only covers U.S. exchange-traded stocks
                          and options. It does not include international stocks, cash, short
                          positions, or other assets that are not required to be reported on Form
                          13F.
                        </li>
                        <li>
                          <strong>Errors:</strong> While we strive to ensure data accuracy, errors
                          may occur in the original fillings or during data processing. We do not
                          warrant the completeness or accuracy of the information provided.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* External Links */}
              <section>
                <h2 className="text-xl font-bold text-foreground">External Links</h2>
                <p className="text-secondary">
                  Our website may contain links to third-party websites. We are not responsible for
                  the content, privacy policies, or practices of any third-party sites or services.
                </p>
              </section>

              {/* Limitation of Liability */}
              <section>
                <h2 className="text-xl font-bold text-foreground">Limitation of Liability</h2>
                <p className="text-secondary">
                  Under no circumstances shall NPS 13F or its operators be liable for any direct,
                  indirect, incidental, consequential, or special damages arising out of or in
                  connection with your access to or use of this website.
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
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
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
