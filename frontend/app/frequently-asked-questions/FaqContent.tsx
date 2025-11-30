"use client";
import { useState, useEffect } from "react";
const appUrl = process.env.NEXT_PUBLIC_APP_URL; // Your API URL

export const FaqContent = () => {
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
        <div className="faq-list">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div
                key={faq.question + index}
                className={`faq-item ${
                  openQuestion === faq.question ? "active" : ""
                }`}>
                <button
                  className="faq-question"
                  onClick={() => toggleFAQ(faq.question)}>
                  {faq.question}
                </button>
                {openQuestion === faq.question && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No FAQs match your search.</p>
          )}
        </div>
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
  );
};
