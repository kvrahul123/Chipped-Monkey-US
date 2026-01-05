"use client";

import { useEffect, useState } from "react";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export const TermsContent = () => {
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const res = await fetch(`${appUrl}frontend/pages/list/?id=2`);
        const json = await res.json();

        if (json?.statusCode === 200 && json.data.length > 0) {
          const page = json.data[0];
          setPageData(page);
        }
      } catch (error) {
        console.error("Error fetching FAQ page:", error);
      }
    };

    fetchPageData();
  }, []);
  return (
    <>


      
                        <h1 className="index_hightlight banner-heading-title pageHeadingTitle"><h4> ChippedMonkey.com  User Agreement and<b> Terms of Service</b></h4></h1>

  <div className="meta">
    <strong>Effective Date:</strong> January 1, 2026<br />
    <strong>Provider:</strong> Hummr Media Corporation (Registered in New York)
  </div>

  <p>
    Welcome to <strong>ChippedMonkey.com</strong>. This platform and all related services
    are owned and operated by <strong>Hummr Media Corporation</strong> (“the Company,”
    “we,” “us,” or “our”). By accessing our website, creating an account, or registering
    a microchip, you (“the User”) agree to be bound by the following terms.
  </p>

  <h2>1. Nature of Service</h2>
  <p>
    ChippedMonkey.com provides a centralized digital database for pet identification and
    owner contact management. Our mission is to facilitate the reunion of lost pets with
    their families.
  </p>
  <p>
    <strong>No Recovery Guarantee:</strong> While our database is a vital tool for recovery,
    Hummr Media Corporation does not guarantee the successful return of any lost pet.
  </p>
  <p>
    <strong>Professional Use:</strong> We provide access to our registry for verified animal
    professionals (veterinarians, shelters, and law enforcement) to assist in identification.
  </p>

  <h2>2. User Data & Accuracy</h2>
  <p>
    For the safety of your pet, you agree to:
  </p>
  <ul>
    <li><strong>Truthful Registration:</strong> Provide 100% accurate and verifiable contact information.</li>
    <li>
      <strong>Duty to Update:</strong> You are solely responsible for updating your profile
      if you move or change your phone number. Hummr Media Corporation is not liable for
      recovery failures caused by outdated user data.
    </li>
    <li>
      <strong>Legal Ownership:</strong> You represent that you are the legal owner of the pet
      being registered or have explicit legal power of attorney to manage the registration.
    </li>
  </ul>

  <h2>3. Non-Plagiarism & Intellectual Property</h2>
  <p>
    Every element of ChippedMonkey.com—including this Agreement, our website copy, our
    monkey logo, and our database architecture—is the original intellectual property of
    Hummr Media Corporation.
  </p>
  <ul>
    <li><strong>Protection of Content:</strong> You may not copy, scrape, or reproduce any part of this site for commercial purposes.</li>
    <li>
      <strong>Originality:</strong> This agreement is custom-authored for ChippedMonkey.com.
      Unauthorized use of this legal text by third parties is a violation of copyright law
      and will be prosecuted under New York jurisdiction.
    </li>
  </ul>

  <h2>4. Emergency Information Sharing</h2>
  <p>
    By using our registry, you grant Hummr Media Corporation an irrevocable license to share
    your contact information with third-party finders (including shelters, veterinary
    clinics, and individuals) solely and exclusively for the purpose of returning your
    lost pet.
  </p>

  <h2>5. Fees, Billing, and No-Refund Policy</h2>
  <ul>
    <li>
      <strong>Service Fees:</strong> Fees for registration or premium alerts are clearly
      listed at checkout.
    </li>
    <li>
      <strong>Final Sale:</strong> Because microchip registration is a digital service that
      is activated and indexed immediately upon payment, all sales are final. No refunds
      are issued once a registration has been processed.
    </li>
  </ul>

  <h2>6. New York Legal Jurisdiction</h2>
  <p>
    Hummr Media Corporation is a New York entity. These Terms are governed by the laws of
    the State of New York. Any disputes or legal proceedings arising from your use of
    ChippedMonkey.com shall be resolved exclusively in the state or federal courts located
    within New York.
  </p>

  <h2>7. Limitation of Liability</h2>
  <p>
    To the maximum extent permitted by law, Hummr Media Corporation shall not be liable for:
  </p>
  <ul>
    <li>The mechanical failure or migration of the physical microchip.</li>
    <li>The actions, omissions, or negligence of third-party shelters or veterinary clinics.</li>
    <li>Direct or indirect damages, including emotional distress, related to the loss of a pet.</li>
  </ul>

  <h2>8. Account Termination</h2>
  <p>
    We reserve the right to suspend or permanently delete any account that:
  </p>
  <ul>
    <li>Provides fraudulent or misleading information.</li>
    <li>Uses the registry for any purpose other than pet recovery.</li>
    <li>Attempts to breach server security or scrape the user directory.</li>
  </ul>

  <div className="signature">
    <h2>Corporate Signature</h2>
    <p>
      For all inquiries regarding these terms, please contact:
    </p>
    <div className="contact">
      <strong>Hummr Media Corporation</strong><br />
      Email: <a href="mailto:help@chippedmonkey.com">help@chippedmonkey.com</a><br />
      Website: <a href="https://www.chippedmonkey.com">ChippedMonkey.com</a>
    </div>
  </div>


    </>
  );
};
