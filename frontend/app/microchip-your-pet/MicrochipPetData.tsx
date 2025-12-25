"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export default function MicrochipPetData() {
  const [pageData, setData] = useState<any>(null);
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is Chipped Monkey part of the AAHA network?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "Yes, ChippedMonkey.com is fully integrated with the AAHA (American Animal Hospital Association) National Microchip Lookup network, ensuring your pet can be identified by any vet or shelter nationwide."
      }
    },
    {
      "@type": "Question",
      "name": "How much does it cost to register a microchip with Chipped Monkey?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "We offer two options: a Lifetime Premium Registration for a one-time fee of $49, or an Annual Protection plan for $24 per year."
      }
    },
    {
      "@type": "Question",
      "name": "Can I register a microchip from another brand with Chipped Monkey?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "Yes! Chipped Monkey is a universal registry. We accept all microchip brands and formats, including 9, 10, and 15-digit chips, ensuring they are searchable through the national AAHA network."
      }
    }
  ]
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${appUrl}frontend/pages/list/?id=16`);
        const result = await res.json();
        setData(result.data?.[0]);
      } catch (error) {
        console.error("Error fetching page data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      
        <Script
    id="faq-schema"
    type="application/ld+json"
    strategy="afterInteractive"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(faqSchema),
    }}
  />
    <div className="container">
    <div className="why-microchip-page">
      {/* HERO */}
      <header className="why-microchip-hero">
        <h1 className="why-microchip-title">
          Why Microchipping Your Pet Is the Most Important Protection You Can
          Provide
        </h1>

        <p className="why-microchip-intro">
          Choosing to microchip your pet is the most significant act of
          protection you can provide. At <strong>ChippedMonkey.com</strong>, we
          provide more than just a registry; we provide a lifelong link between
          you and your best friend.
        </p>

        <p className="why-microchip-subintro">
          As a proud participant in the{" "}
          <strong>
            AAHA (American Animal Hospital Association) National Microchip
            Lookup Network
          </strong>
          , we ensure your pet's recovery data is instantly accessible to every
          veterinarian and animal shelter across North America.
        </p>
      </header>

      {/* SECTION 1 */}
      <section className="why-microchip-section">
        <h2 className="why-microchip-section-title">
          Permanent Identification That Never Fails
        </h2>

        <p className="why-microchip-text">
          Every year, over <strong>10 million pets</strong> are lost or stolen
          in the United States. While collars and traditional ID tags are
          essential, they are not foolproof—they can break, slip off, or become
          unreadable.
        </p>

        <p className="why-microchip-text">
          A pet microchip is a tiny, grain-of-rice-sized RFID device safely
          implanted under the skin. It acts as a permanent, tamper-proof{" "}
          <strong>digital fingerprint</strong>. Unlike GPS trackers, a microchip
          requires no batteries and is designed to last your pet’s entire
          lifetime.
        </p>
      </section>

      {/* SECTION 2 */}
      <section className="why-microchip-section why-microchip-highlight">
        <h2 className="why-microchip-section-title">
          The AAHA Advantage: Nationwide Visibility
        </h2>

        <p className="why-microchip-text">
          When a lost pet is brought into a clinic or shelter, the first step is
          a scan for a microchip. The professional then enters that unique ID
          into the <strong>AAHA Universal Pet Microchip Lookup</strong>.
        </p>

        <ul className="why-microchip-list">
          <li>
            <strong>Instant Connection:</strong> Because Chipped Monkey is a
            recognized AAHA partner, your contact information is flagged
            immediately.
          </li>
          <li>
            <strong>Proven Reunions:</strong> Microchipped dogs are{" "}
            <strong>2.5x more likely</strong>
            to be returned home, while microchipped cats are{" "}
            <strong>2,000% more likely</strong> to be reunited with their
            families.
          </li>
        </ul>
      </section>

      {/* SECTION 3 */}
      <section className="why-microchip-section">
        <h2 className="why-microchip-section-title">
          Transparent Pricing for Every Pet Parent
        </h2>

        <p className="why-microchip-text">
          At Chipped Monkey, we believe in affordable safety with{" "}
          <strong>no hidden fees</strong>.
        </p>

        <ul className="why-microchip-pricing">
          <li>
            <strong>Lifetime Premium Registration ($49):</strong> One payment
            protects your pet for life with unlimited contact updates.
          </li>
          <li>
            <strong>Annual Protection Plan ($24/year):</strong> A flexible,
            low-cost yearly option.
          </li>
        </ul>
      </section>

      {/* FAQ */}
      <div className="row mt-5 cmp-faq-full-width">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h2 className="fs-3 section-title-h2 cmp-faq-header">
                Frequently Asked Questions
              </h2>

              {/* FAQ Item 1 */}
              <div className="cmp-faq-card">
                <details className="cmp-faq-details">
                  <summary className="cmp-faq-question">
                    Is Chipped Monkey part of the AAHA lookup tool?
                  </summary>
                  <p className="cmp-faq-answer">
                    Yes. ChippedMonkey.com is fully integrated with the AAHA
                    Universal Pet Microchip Lookup. This is the primary tool
                    used by shelters and vets to locate owner information across
                    different registry brands.
                  </p>
                </details>
              </div>
              {/* FAQ Item 2 */}
              <div className="cmp-faq-card">
                <details className="cmp-faq-details">
                  <summary className="cmp-faq-question">
                    Does the $49 Lifetime Premium really have no renewal fees?
                  </summary>
                  <p className="cmp-faq-answer">
                    Correct. Our $49 Lifetime Premium plan is a one-time
                    investment. Your pet is protected for life, and you can
                    update your phone number or address at any time for free.
                  </p>
                </details>
              </div>
              {/* FAQ Item 3 */}
              <div className="cmp-faq-card">
                <details className="cmp-faq-details">
                  <summary className="cmp-faq-question">
                    Can I register any brand of microchip?
                  </summary>
                  <p className="cmp-faq-answer">
                    Absolutely. We are a universal registry. Whether your pet
                    has a 9, 10, or 15-digit chip from any manufacturer
                    (HomeAgain, Avid, etc.), you can register it with Chipped
                    Monkey to ensure it is searchable via the AAHA network.
                  </p>
                </details>
              </div>
              {/* FAQ Item 4 */}
              <div className="cmp-faq-card">
                <details className="cmp-faq-details">
                  <summary className="cmp-faq-question">
                    Is microchipping painful for my dog or cat?
                  </summary>
                  <p className="cmp-faq-answer">
                    The procedure is virtually painless and as quick as a
                    routine vaccination. It is performed with a needle and
                    requires no anesthesia. Most pets don't even notice the
                    injection.
                  </p>
                </details>
              </div>
              {/* FAQ Item 5 (New Question) */}
              <div className="cmp-faq-card">
                <details className="cmp-faq-details">
                  <summary className="cmp-faq-question">
                    Why should I pay to register if my pet is already chipped?
                  </summary>
                  <p className="cmp-faq-answer">
                    A microchip is just a serial number. Without registration at
                    ChippedMonkey.com, that number is not linked to your name or
                    phone number. Registration is the critical step that
                    actually brings your pet home.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>
      </>
  );
}
