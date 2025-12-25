"use client";
import { useState, useEffect } from "react";
const appUrl = process.env.NEXT_PUBLIC_APP_URL; // Your API URL
import Script from "next/script";

export const FaqContent = () => {
  const faqSchema = {
  "@context": " https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does registration cost at Chipped Monkey?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Chipped Monkey offers a Lifetime Premium Registration for a one-time payment of $49, or an Annual Premium Registration for $24 per year. These plans ensure your pet's ID is visible on the AAHA network."
      }
    },
    {
      "@type": "Question",
      "name": "Is a pet microchip a GPS tracker?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No, a pet microchip is an RFID identification device, not a GPS. It does not provide real-time location tracking but stores a unique ID linked to your contact info."
      }
    },
    {
      "@type": "Question",
      "name": "Does my pet need anesthesia for a microchip?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No anesthesia is required. The microchip is implanted using a needle in a procedure that feels very similar to a routine vaccination."
      }
    },
    {
      "@type": "Question",
      "name": "Is Chipped Monkey part of the AAHA network?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Chipped Monkey is a participating registry in the AAHA Universal Pet Microchip Lookup, making it easier for shelters and vets to find your contact details."
      }
    }
  ]
};
  
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const [pageData, setPageData] = useState<any>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const res = await fetch(`${appUrl}frontend/pages/list/?id=17`);
        const json = await res.json();

        if (json?.statusCode === 200 && json.data.length > 0) {
          const page = json.data[0];
          setPageData(page);

          // parse faq_content JSON string safely
          if (page.faq_content) {
            try {
              setFaqs(JSON.parse(page.faq_content));
            } catch (err) {
              console.error("Invalid faq_content JSON:", err);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching FAQ page:", error);
      }
    };

    fetchPageData();
  }, []);

  const toggleFAQ = (question: string) => {
    setOpenQuestion(openQuestion === question ? null : question);
  };

  // filter FAQs based on search term
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="row">
      <div className="col-12">
        <h1 className="faq-title">
          {pageData?.title || "Frequently Asked Questions"}
        </h1>

        {/* Inject rich text content (from DB "content") */}
        {pageData?.content && (
          <div
            className="faq-intro"
            dangerouslySetInnerHTML={{ __html: pageData.content }}
          />
        )}

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search FAQs..."
          className="faq-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* FAQ List */}
   <>
  {filteredFaqs.length > 0 ? (
    filteredFaqs.map((faq, index) => (
      <div className="cmp-faq-card" key={index}>
        <details className="cmp-faq-details">
          <summary className="cmp-faq-question">
            {faq.question}
          </summary>
          <p className="cmp-faq-answer">
            {faq.answer}
          </p>
        </details>
      </div>
    ))
  ) : (
    <p>No FAQs match your search.</p>
  )}
        </>
        </div>

    
      <style jsx>{`
        .faq-title {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 15px;
        }
        .faq-intro {
          font-size: 16px;
          margin-bottom: 10px;
        }
        .faq-search {
          width: 100%;
          padding: 10px;
          margin: 15px 0;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .faq-list {
          margin-top: 20px;
        }
        .faq-item {
          margin-bottom: 10px;
        }
        .faq-question {
          width: 100%;
          padding: 12px;
          background: #5bbbe3;
          color: #fff;
          border: none;
          text-align: left;
          cursor: pointer;
          border-radius: 4px;
        }
        .faq-item.active .faq-question {
          background: #3da8c8;
        }
        .faq-answer {
          background: #f7f7f7;
          padding: 10px;
          border-radius: 0 0 4px 4px;
        }
      `}</style>
    </div>
    </>
  );
};
