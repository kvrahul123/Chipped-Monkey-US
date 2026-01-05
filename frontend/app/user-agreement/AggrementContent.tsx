"use client";

import { useEffect, useState } from "react";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export const AggrementContent = () => {
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const res = await fetch(`${appUrl}frontend/pages/list/?id=21`);
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

  <p>
    Welcome to <strong>ChippedMonkey.com</strong>. We are dedicated to reuniting lost pets
    with their families through advanced microchip registration and recovery services.
    By accessing our website or using our services, you agree to the following terms.
  </p>

  <h2>1. Ownership and Agreement</h2>
  <p>
    ChippedMonkey.com is owned and operated by <strong>Hummr Media Corporation</strong>
    ("the Company," "we," "us," or "our"). This User Agreement is a legally binding
    contract between you and Hummr Media Corporation. If you do not agree to these terms,
    please do not use our platform or services.
  </p>

  <h2>2. Our Mission and Limitations</h2>
  <p>
    ChippedMonkey.com provides a centralized database to help finders and professionals
    identify lost pets.
  </p>
  <p>
    <strong>The Registry:</strong> We maintain your contact information so it can be
    linked to your pet’s microchip ID.
  </p>
  <p>
    <strong>The Recovery:</strong> While we provide the tools for a reunion, Hummr Media
    Corporation does not guarantee that a lost pet will be found or returned. Our service
    is a tool, not a recovery insurance policy.
  </p>

  <h2>3. Your Responsibility: Data Accuracy</h2>
  <p>
    For the system to work, your information must be correct. You agree to:
  </p>
  <ul>
    <li><strong>Be Accurate:</strong> Provide true and current contact details (phone, email, address).</li>
    <li><strong>Stay Current:</strong> Update your profile immediately if you move or change your phone number.</li>
    <li><strong>Verify Ownership:</strong> You certify that you are the legal owner of the pet being registered or have explicit legal authority to act on the owner's behalf.</li>
  </ul>

  <h2>4. Privacy and Emergency Data Sharing</h2>
  <p>
    Your privacy is a priority, but the purpose of this service is to facilitate contact
    during an emergency.
  </p>
  <p>
    <strong>Authorized Disclosure:</strong> By using this service, you grant Hummr Media
    Corporation permission to share your contact details with verified third parties
    (such as animal shelters, veterinarians, and law enforcement) specifically for the
    purpose of reuniting you with your pet.
  </p>
  <p>
    <strong>Security:</strong> We use industry-standard encryption to protect your data,
    but no system is 100% secure. You use the service at your own risk regarding data
    transmission.
  </p>

  <h2>5. Intellectual Property</h2>
  <p>
    All content on ChippedMonkey.com—including the brand name, logo, website design, text,
    and database structure—is the exclusive intellectual property of Hummr Media
    Corporation. You may not copy, scrape, or redistribute our data for commercial
    purposes without our express written consent.
  </p>

  <h2>6. Fees and Payments</h2>
  <p>
    <strong>Service Fees:</strong> Any fees for registration or premium recovery services
    will be clearly stated at the time of purchase.
  </p>
  <p>
    <strong>No Refunds:</strong> Due to the digital nature of microchip registration and
    the immediate activation of our recovery network, all sales are final and
    non-refundable unless otherwise required by law.
  </p>

  <h2>7. Limitation of Liability</h2>
  <p>
    To the fullest extent permitted by law, Hummr Media Corporation and its officers shall
    not be held liable for:
  </p>
  <ul>
    <li>The mechanical failure of a microchip (the hardware).</li>
    <li>Inaccurate data entered by the user.</li>
    <li>The actions or negligence of third-party animal shelters or veterinary clinics.</li>
    <li>Any emotional or financial loss resulting from a pet remaining lost.</li>
  </ul>

  <h2>8. Prohibited Conduct</h2>
  <p>
    You agree not to use ChippedMonkey.com for any fraudulent activity, including
    registering pets you do not own, uploading malicious code, or harassing other members
    of the community.
  </p>

  <h2>9. Governing Law</h2>
  <p>
    This agreement and any disputes relating to ChippedMonkey.com are governed by the
    laws of the jurisdiction where Hummr Media Corporation is incorporated, without
    regard to conflict of law principles.
  </p>

  <h2>10. Updates to This Agreement</h2>
  <p>
    As our technology evolves, we may update these terms. We will notify you of major
    changes via the email on your account. Continued use of the site after updates
    constitutes acceptance of the new terms.
  </p>


    </>
  );
};
