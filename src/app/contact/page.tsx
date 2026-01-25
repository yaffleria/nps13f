import { Metadata } from "next";
import Link from "next/link";
import { GlobalHeader } from "@/widgets/GlobalHeader/GlobalHeader";
import { GlobalFooter } from "@/widgets/GlobalFooter/GlobalFooter";
import { FadeIn } from "@/shared/ui/FadeIn";
import { Mail, MessageCircle, Clock, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us - NPS 13F",
  description:
    "Contact us for inquiries, feedback, or bug reports regarding NPS 13F. We will get back to you as soon as possible.",
  openGraph: {
    title: "Contact Us - NPS 13F",
    description: "Inquiries and feedback for NPS 13F",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactPage() {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      description: "Business inquiries, suggestions, bug reports, etc.",
      link: "mailto:yaffleria@gmail.com",
      linkText: "yaffleria@gmail.com",
      responseTime: "Usually reply within 1-2 days",
      isExternal: false,
    },
    {
      icon: MessageCircle,
      title: "X (Twitter)",
      description: "Quick inquiries, check for live updates",
      link: "https://x.com/charlotteprism",
      linkText: "@charlotteprism",
      responseTime: "Usually reply within a few hours",
      isExternal: true,
    },
  ];

  const faqItems = [
    {
      question: "How often is the data updated?",
      answer:
        "SEC 13F reports are filed quarterly. We data update as soon as new filings are released. Usually, it reflects within 1-2 days after filing.",
    },
    {
      question: "Can you add information for a specific stock?",
      answer:
        "All stocks disclosed in the National Pension Service's 13F reports are automatically reflected in the service. Stocks not held by the National Pension Service are not displayed.",
    },
    {
      question: "I found a data error.",
      answer:
        "Data accuracy is very important to us. If you find an error, please let us know via email or X DM. We will verify and fix it as soon as possible.",
    },
    {
      question: "How can I contact you for advertising or collaboration?",
      answer: "For business inquiries, please contact us via email (yaffleria@gmail.com).",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <GlobalHeader />

      <main className="container mx-auto px-4 py-8" role="main">
        <FadeIn>
          <article className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <header className="mb-16 text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Contact Us
              </h1>
              <p className="text-xl text-secondary max-w-2xl mx-auto leading-relaxed">
                Please send us your inquiries, feedback, or suggestions for NPS 13F.
                <br />
                We will respond as soon as possible.
              </p>
            </header>

            {/* Contact Methods */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                Contact Methods
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {contactMethods.map((method, index) => (
                  <a
                    key={index}
                    href={method.link}
                    target={method.isExternal ? "_blank" : undefined}
                    rel={method.isExternal ? "noopener noreferrer" : undefined}
                    className="group bg-surface/30 rounded-2xl border border-border p-6 sm:p-8 hover:bg-surface/50 hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                        <method.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
                          {method.title}
                          {method.isExternal && <ExternalLink className="w-4 h-4 text-muted" />}
                        </h3>
                        <p className="text-secondary text-sm mb-3">{method.description}</p>
                        <p className="text-primary font-medium group-hover:underline">
                          {method.linkText}
                        </p>
                        <p className="text-muted text-xs mt-2 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {method.responseTime}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>

            {/* What to Include */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                What to Include in Your Message
              </h2>
              <div className="bg-surface/50 rounded-2xl border border-border p-6 sm:p-8">
                <ul className="space-y-4 text-secondary">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">•</span>
                    <div>
                      <strong className="text-foreground">For Bug Reports:</strong> Problematic Page
                      URL, Browser Type, Screenshot (if possible)
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">•</span>
                    <div>
                      <strong className="text-foreground">For Data Errors:</strong> The stock symbol
                      or page, expected value, link to the original SEC source (if possible)
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">•</span>
                    <div>
                      <strong className="text-foreground">For Feature Suggestions:</strong> Detailed
                      description of the desired feature and use case
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            {/* FAQ */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <details
                    key={index}
                    className="group bg-surface/30 rounded-xl border border-border overflow-hidden"
                  >
                    <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-surface/50 transition-colors">
                      <span className="font-medium text-foreground pr-4">{item.question}</span>
                      <span className="text-muted group-open:rotate-180 transition-transform">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </span>
                    </summary>
                    <div className="px-5 pb-5 text-secondary leading-relaxed">{item.answer}</div>
                  </details>
                ))}
              </div>
            </section>

            {/* Response Notice */}
            <section className="mb-16">
              <div className="bg-primary/5 rounded-2xl border border-primary/20 p-6 sm:p-8 text-center">
                <Clock className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Response Time</h3>
                <p className="text-secondary text-sm leading-relaxed max-w-xl mx-auto">
                  We check inquiries and respond as quickly as possible. Generally, we reply via
                  email within 1-2 days and via X within a few hours. Please note that responses may
                  be delayed outside of business hours or on weekends.
                </p>
              </div>
            </section>

            {/* Footer Navigation */}
            <footer className="pt-8 border-t border-border text-center">
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link href="/" className="text-primary hover:underline">
                  Home
                </Link>
                <span className="text-muted">|</span>
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                <span className="text-muted">|</span>
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>
                <span className="text-muted">|</span>
                <Link href="/disclaimer" className="text-primary hover:underline">
                  Disclaimer
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
