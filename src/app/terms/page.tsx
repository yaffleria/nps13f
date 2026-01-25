import { Metadata } from "next";
import Link from "next/link";
import { GlobalHeader } from "@/widgets/GlobalHeader/GlobalHeader";
import { GlobalFooter } from "@/widgets/GlobalFooter/GlobalFooter";
import { FadeIn } from "@/shared/ui/FadeIn";

export const metadata: Metadata = {
  title: "Terms of Service - NPS 13F",
  description:
    "Terms of Service for NPS 13F. Guidelines on service usage, disclaimers, copyrights, and more.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
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
                Terms of Service
              </h1>
              <p className="text-secondary">
                Effective Date: {effectiveDate} | Last Updated: {currentDate}
              </p>
            </header>

            <div className="space-y-10 text-secondary leading-relaxed">
              {/* Article 1 Purpose */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">Article 1 (Purpose)</h2>
                <p>
                  These Terms of Service (hereinafter referred to as &quot;Terms&quot;) aim to
                  regulate the conditions and procedures of use for the website service provided by
                  NPS 13F (hereinafter referred to as &quot;Service&quot;), as well as the rights,
                  obligations, and responsibilities of the users and the Service.
                </p>
              </section>

              {/* Article 2 Definitions */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">Article 2 (Definitions)</h2>
                <p>The terms used in these Terms are defined as follows:</p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>
                    <strong>&quot;Service&quot;</strong>: Refers to the NPS 13F website providing
                    information on the National Pension Service&#39;s US stock portfolio and related
                    additional services.
                  </li>
                  <li>
                    <strong>&quot;User&quot;</strong>: Refers to any person who accesses and uses
                    the Service in accordance with these Terms.
                  </li>
                  <li>
                    <strong>&quot;Content&quot;</strong>: Refers to all forms of information posted
                    on the Service, including text, images, graphs, and data.
                  </li>
                </ul>
              </section>

              {/* Article 3 Effect and Amendment */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Article 3 (Effect and Amendment of Terms)
                </h2>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>These Terms shall be effective for all Users who wish to use the Service.</li>
                  <li>
                    The Service may amend these Terms to the extent that they do not violate
                    relevant laws. In such cases, the effective date and reasons for the amendment
                    will be announced within the Service.
                  </li>
                  <li>Amended Terms will take effect 7 days after the announcement.</li>
                  <li>
                    If a User does not agree to the amended Terms, they may discontinue using the
                    Service. Continued use of the Service after the effective date of the amended
                    Terms will be considered as consent to the changes.
                  </li>
                </ol>
              </section>

              {/* Article 4 Service Content */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Article 4 (Service Content)
                </h2>
                <p>The Service provides the following information:</p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>
                    US stock holdings of the National Pension Service (NPS) based on US Securities
                    and Exchange Commission (SEC) 13F filings
                  </li>
                  <li>Quarterly portfolio changes and trading trends</li>
                  <li>Sector-specific investment analysis</li>
                  <li>Individual stock investment status</li>
                  <li>Other related information and analysis data</li>
                </ul>
              </section>

              {/* Article 5 Service Usage */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Article 5 (Service Usage)
                </h2>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    The Service is available for free to anyone without requiring separate
                    membership registration.
                  </li>
                  <li>
                    The Service is available 24 hours a day, 365 days a year, in principle. However,
                    the Service may be temporarily suspended for system maintenance or other
                    reasons.
                  </li>
                  <li>
                    The Service may change all or part of the Service according to operational or
                    technical needs.
                  </li>
                </ol>
              </section>

              {/* Article 6 Disclaimer - Investment Related */}
              <section className="bg-surface/50 p-6 rounded-xl border border-border">
                <h2 className="text-xl font-bold text-negative mb-4">
                  Article 6 (Investment Disclaimer) ⚠️ IMPORTANT
                </h2>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    <strong>
                      This Service does not intend to provide investment solicitation, investment
                      advice, or investment recommendations.
                    </strong>
                  </li>
                  <li>
                    All information provided by the Service is for{" "}
                    <strong>informational purposes only</strong> based on SEC 13F filings and does
                    not encourage or recommend the purchase, sale, or holding of specific stocks.
                  </li>
                  <li>
                    The User is solely responsible for any investment decisions made based on the
                    information provided by the Service.
                  </li>
                  <li>
                    The Service does not guarantee the accuracy, completeness, or timeliness of the
                    provided information and is not liable for any damages caused by errors,
                    omissions, or delays in the information.
                  </li>
                  <li>
                    Users are recommended to consult with qualified financial professionals before
                    making investment decisions.
                  </li>
                  <li>Past investment performance does not guarantee future results.</li>
                </ol>
              </section>

              {/* Article 7 Data Source */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Article 7 (Data Source and Limitations)
                </h2>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    The data provided by the Service is based on Form 13F reports filed with the US
                    Securities and Exchange Commission (SEC).
                  </li>
                  <li>
                    As 13F reports are filed within 45 days after the end of each quarter, the
                    information displayed is past data and not real-time holdings.
                  </li>
                  <li>
                    13F reports only include US-listed equity holdings of institutional investors
                    managing over $100 million in assets, and not all investment assets are
                    disclosed.
                  </li>
                  <li>
                    Errors may occur during data collection and processing, and the Service is not
                    responsible for such errors.
                  </li>
                </ol>
              </section>

              {/* Article 8 Copyright */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Article 8 (Copyright and Intellectual Property Rights)
                </h2>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    Copyright and intellectual property rights for the Service&#39;s design, logo,
                    software, graphics, and analysis methodologies belong to the Service operator.
                  </li>
                  <li>
                    The SEC 13F filing data itself is public information and can be accessed freely
                    by anyone.
                  </li>
                  <li>
                    Users may use the information provided by the Service for personal purposes only
                    and are prohibited from reproducing, distributing, transmitting, or publishing
                    it for commercial purposes.
                  </li>
                </ol>
              </section>

              {/* Article 9 User Obligations */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Article 9 (User Obligations)
                </h2>
                <p>Users must not engage in the following acts:</p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>Acts that interfere with the operation of the Service</li>
                  <li>
                    Acts of using information obtained through the Service for commercial purposes
                    without permission
                  </li>
                  <li>Acts that infringe on the rights of others or damage their reputation</li>
                  <li>
                    Acts that threaten the security of the Service, such as hacking or distributing
                    malicious code
                  </li>
                  <li>Acts of collecting large amounts of data using automated means</li>
                  <li>Other acts that violate relevant laws and regulations or these Terms</li>
                </ul>
              </section>

              {/* Article 10 Service Restriction */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Article 10 (Service Restriction and Suspension)
                </h2>
                <p>The Service may restrict or suspend service provision in the following cases:</p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>
                    Technical reasons such as regular system maintenance, server expansion and
                    replacement, or network instability
                  </li>
                  <li>Force majeure events such as natural disasters, war, or riots</li>
                  <li>Service suspension or changes by the data source (SEC)</li>
                  <li>Other reasonable reasons for service operation</li>
                </ul>
              </section>

              {/* Article 11 Limitation of Liability */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Article 11 (Limitation of Liability)
                </h2>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    The Service is not liable for any damages incurred by the User in connection
                    with the free service provided.
                  </li>
                  <li>
                    The Service is not liable for any investment losses, opportunity costs, or data
                    losses resulting from the use of information provided by the Service.
                  </li>
                </ol>
              </section>

              {/* Article 12 Governing Law */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Article 12 (Governing Law and Jurisdiction)
                </h2>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    These Terms shall be interpreted and applied in accordance with the laws of the
                    Republic of Korea.
                  </li>
                  <li>
                    Any disputes arising in connection with the use of the Service shall be subject
                    to the jurisdiction of the competent court under the Civil Procedure Act.
                  </li>
                </ol>
              </section>

              {/* Supplementary Provisions */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">Supplementary Provisions</h2>
                <p>These Terms are effective from {effectiveDate}.</p>
              </section>
            </div>

            {/* Footer Navigation */}
            <footer className="mt-16 pt-8 border-t border-border text-center">
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link href="/" className="text-primary hover:underline">
                  Home
                </Link>
                <span className="text-muted">|</span>
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
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
