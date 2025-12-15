import CommonLayout from "@/app/frontend/layouts/CommonLayouts";
import Link from "next/link";
import Image from "next/image";
import MicrochipFormShow from "./MicrochipFormShow";
import { generateCommonMetadata } from "../../utils/metadata";
import { Metadata } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;
const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;

export async function generateMetadata(): Promise<Metadata> {
  const res = await fetch(`${appUrl}frontend/pages/list/?id=5`);
  const result = await res.json();
  const seoData = result.data ? result.data[0] : null;
  console.log("seoData", JSON.stringify(seoData));

  const dynamicTitle = seoData
    ? seoData.meta_title
    : process.env.NEXT_META_TITLE;
  const dynamicDescription = seoData
    ? seoData.meta_description
    : process.env.NEXT_META_DESCRIPTION;
  const dynamicKeywords = seoData
    ? seoData.meta_keywords
    : process.env.NEXT_META_KEYWORDS;
  const dynamicImages =
    seoData.image_file_name != null && seoData.image_file_name != ""
      ? appUrl + "uploads/" + seoData.image_file_name
      : process.env.NEXT_META_OG_IMAGE;

  return generateCommonMetadata(
    dynamicTitle,
    dynamicDescription,
    dynamicKeywords,
    dynamicImages,
    `${frontendUrl}pet-owners/update-pet-microchip`
  );
}

export default function UpdatePetMicrochip() {
  return (
    <CommonLayout>
      <div className="main-page-container">
        <div className="container">
          <div className="row ">
            <div className="col-lg-12 col-md-12 mt-4">
              <div
                className="registe-monkey-new text-center"
                style={{
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}>
                <div className="row">
                  <div className="col-lg-12 col-md-12 mb-lg-0 register-left-dv">
                    <h2 className="mb-0 page-title-h2 text-white mb-2">
                      Your Pet's Lifeline: Register their microchip and secure
                      their journey home.
                    </h2>
                  </div>
                  <div className="col-lg-12 col-md-12 mb-0 register-right-dv">
                    <MicrochipFormShow />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 d-lg-block mt-5 pe-3 pe-lg-5 ">
              <div className="row">
                <div className="col-lg-12">
                  <h4 className="mb-3 fs-3">
                    Chipped Monkey makes microchip registration simple and easy.
                    Updating details or registering a new dog or cat is a two
                    minute process. Within seconds you can:
                  </h4>
                  <div className="row mb-4 mt-4 pt-2 pb-2">
                    <div className="col-lg-3 text-center">
                      <Image
                        src="/assets/images/step-icons5.png"
                        alt="popular image"
                        width={115}
                        height={115}
                      />
                      <h4 className="fs-5 mt-3 fw-bold">
                        Enter your pet’s microchip number
                      </h4>
                    </div>

                    <div className="col-lg-3 text-center">
                      <Image
                        src="/assets/images/step-icons6.png"
                        alt="popular image"
                        width={115}
                        height={115}
                      />
                      <h4 className="fs-5 mt-3 fw-bold">
                        Select your dog breed or cat breed
                      </h4>
                    </div>

                    <div className="col-lg-3 text-center">
                      <Image
                        src="/assets/images/step-icons7.png"
                        alt="popular image"
                        width={115}
                        height={115}
                      />
                      <h4 className="fs-5 mt-3 fw-bold">
                        {" "}
                        Provide pet keeper details (name, contact number,
                        current address)
                      </h4>
                    </div>

                    <div className="col-lg-3 text-center">
                      <Image
                        src="/assets/images/step-icons8.png"
                        alt="popular image"
                        width={115}
                        height={115}
                      />
                      <h4 className="fs-5 mt-3 fw-bold">
                        Submit via a streamlined online form
                      </h4>
                    </div>
                  </div>

                  {/* <div>
                    <p>
                      You will not even realize that you are done. FECAVA/FDXA,
                      Avid Encrypted, Trovan Unique, or ISO/FDXB microchips are
                      all supported by us.
                    </p>
                    <p>
                      The UK pet microchip law requires that you keep your
                      information registered checked and updated. The process of
                      doing so has been made simple and streamlined.
                    </p>
                  </div> */}
                </div>
              </div>

              {/* <div className="row mt-5">
                <div className="col-lg-8 mb-3">
                  <h2 className="fs-3">
                    Why Register or Update Your Pet&apos;s Microchip?
                  </h2>
                  <h4 className="mb-3 fs-5 mt-3">It Takes Just Two Minutes</h4>
                  <p>
                    Gone are the days of fiddly paperwork. Our online form asks
                    for exactly what’s needed—and nothing more:
                  </p>

                  <div className="ps-0">
                    <ul className="mb-3 list-icons-new">
                      <li>Microchip Number: 15‑digit code from your vet</li>
                      <li>
                        Breed: Choose from our dropdown—simply select your dog
                        or cat’s breed
                      </li>
                      <li>
                        Keeper Details:
                        <div className="d-flex">
                          <ul className="ps-3 mt-2 noinfo-ul">
                            <li>— Full name</li>
                            <li>— Telephone number</li>
                          </ul>
                          <ul className="ps-3 mt-2 noinfo-ul">
                            <li>— Email address</li>
                            <li>— Current address with postcode</li>
                          </ul>
                        </div>
                      </li>
                      <li>
                        Optional Extras: Pet’s color, sex, date of birth,
                        distinguishing marks (helpful if your pet gets lost)
                      </li>
                    </ul>
                    <p>
                      Once entered, hit Register, and you're done—just two
                      minutes max!
                    </p>
                  </div>
                </div>

                <div className="col-lg-4 mb-3">
                  <Image
                    src="/assets/images/pet-register.jpg"
                    alt="popular image"
                    width={1000}
                    height={955}
                    className="img-fluid"
                  />
                </div>
              </div> */}

              <div className="cm-content-wrapper">
                <h1 className="cm-heading-primary">
                  Welcome to ChippedMonkey:
                  <br />
                  Complete Your Pet's Protection!
                </h1>
                <p className="cm-intro-text">
                  You've taken the first crucial step by microchipping your pet.
                  Now, it's time to activate that protection. A microchip is
                  only effective if it's registered with your current contact
                  information!
                </p>

                <blockquote className="cm-quote-box cm-quote-emphasis">
                  <p className="cm-quote-text">
                    Registering your pet's microchip with ChippedMonkey is the
                    <span className="cm-highlight-secondary">
                      essential link
                    </span>
                    between a lost pet and a happy reunion.
                  </p>
                </blockquote>

                <h2 className="cm-heading-primary">
                  Why Registration is
                  <span className="cm-highlight-secondary">
                    {" "}
                    Non-Negotiable
                  </span>
                </h2>

                <p className="cm-standard-text">
                  Think of the microchip as a key, and ChippedMonkey
                  registration as the lock box holding your contact information.
                  If the lock box is empty, the key is useless.
                </p>

                <h3 className="cm-heading-tertiary">
                  The Power of Up-to-Date Microchip Registration
                </h3>

                <div className="cm-table-container">
                  <table className="cm-info-table">
                    <thead>
                      <tr>
                        <th className="cm-table-header">Benefit</th>
                        <th className="cm-table-header">Description</th>
                        <th className="cm-table-header">Key Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="cm-table-cell cm-emphasized">
                          ⚡️ Instant Reunions
                        </td>
                        <td className="cm-table-cell">
                          When your lost dog or cat is found and scanned,
                          shelters and vets instantly see your up-to-date
                          contact details.
                        </td>
                        <td className="cm-table-cell">
                          Fast return home for your lost pet.
                        </td>
                      </tr>
                      <tr>
                        <td className="cm-table-cell cm-emphasized">
                          🛡️ Permanent Peace of Mind
                        </td>
                        <td className="cm-table-cell">
                          Unlike collars and tags that can break or fall off, a
                          registered microchip provides permanent pet
                          identification that lasts a lifetime.
                        </td>
                        <td className="cm-table-cell">
                          Continuous protection that can't be lost.
                        </td>
                      </tr>
                      <tr>
                        <td className="cm-table-cell cm-emphasized">
                          🤝 Trust and Reliability
                        </td>
                        <td className="cm-table-cell">
                          We ensure your pet's unique ID number is securely
                          linked to you, giving rescuers confidence they can
                          reach the right owner—you.
                        </td>
                        <td className="cm-table-cell">
                          Accurate contact for all animal welfare professionals.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h2 className="cm-faq-heading">
                  How ChippedMonkey Makes Registration Easy
                </h2>
                <p className="cm-standard-text">
                  It takes less than five minutes to secure your pet's
                  identification for life.
                </p>

                <h3 className="cm-heading-tertiary">
                  Three Simple Steps to Pet Protection:
                </h3>
                <ul className="cm-step-list">
                  <li className="cm-step-item">
                    <span className="cm-step-number">1.</span>{" "}
                    <strong>Find Your Chip Number:</strong> Locate the 10, 12,
                    or 15-digit microchip ID from your vet records or adoption
                    papers.
                  </li>
                  <li className="cm-step-item">
                    <span className="cm-step-number">2.</span>{" "}
                    <strong>Tell Us About Your Pet:</strong> Enter your pet's
                    name, breed, and a quick description.
                  </li>
                  <li className="cm-step-item">
                    <span className="cm-step-number">3.</span>{" "}
                    <strong>Secure Your Contact Info:</strong> Submit your
                    current phone numbers, email, and address. This is the vital
                    information rescuers need!
                  </li>
                </ul>

                <div className="cm-alert-box cm-crucial-reminder">
                  <h4 className="cm-alert-heading">
                    🚨 Crucial Reminder: Keep It Updated!
                  </h4>
                  <p className="cm-alert-text">
                    Moving or changing phones? Your pet microchip registration
                    needs to be updated! Log into your ChippedMonkey account
                    anytime—24/7—to ensure your protection is always current. We
                    offer seamless updates for life.
                  </p>
                </div>

                <h2>Ready to Complete Your Pet's ID?</h2>
                <p className="cm-standard-text">
                  Don't wait until it's too late. Microchip registration is the
                  most important step after implantation.
                </p>
                <p className="cm-call-to-action-text">
                  <span className="cm-icon">👉</span>{" "}
                  <strong className="cm-highlight-strong">
                    Start by entering your pet’s microchip number above{" "}
                  </strong>
                  <strong>to secure their journey home.</strong>
                </p>

                <h2>
                  Your Questions About Pet Microchip Registration, Answered
                </h2>
                <p className="cm-standard-text">
                  We understand you want the best protection for your companion.
                  Here are the answers to the most common questions about
                  microchips and registration.
                </p>

                <div className="cm-faq-container">
                  <div className="cm-faq-item">
                    <h4 className="cm-faq-question">
                      What is a pet microchip, exactly?
                    </h4>
                    <p className="cm-faq-answer">
                      A pet microchip is a tiny, rice-sized transponder
                      implanted just under your pet's skin by a veterinarian. It
                      stores a unique, unchangeable ID number. It is{" "}
                      <strong>NOT a GPS device</strong>. It does not track your
                      pet's location; it serves as permanent pet identification
                      only when scanned by a shelter or vet.
                    </p>
                  </div>
                  <div className="cm-faq-item">
                    <h4 className="cm-faq-question">
                      Why is registration necessary if my pet is already
                      microchipped?
                    </h4>
                    <p className="cm-faq-answer">
                      Implantation only gives your pet a unique ID number.{" "}
                      <strong>
                        Registration is the critical step that links that unique
                        ID number to your contact information.
                      </strong>{" "}
                      Without registration, a scanner will only show a number,
                      and the shelter won't know who to call. Registration is
                      what makes the microchip work.
                    </p>
                  </div>
                  <div className="cm-faq-item">
                    <h4 className="cm-faq-question">
                      I don't know my pet's microchip number. What should I do?
                    </h4>
                    <p className="cm-faq-answer">
                      Don't worry! You can usually find the number on your
                      veterinary records, adoption papers, or a vaccination
                      certificate. If you can't find the paperwork, any
                      veterinarian or animal shelter can quickly scan your pet
                      for free to retrieve the number for you.
                    </p>
                  </div>
                  <div className="cm-faq-item">
                    <h4 className="cm-faq-question">
                      How often do I need to update my microchip registration?
                    </h4>
                    <p className="cm-faq-answer">
                      You only need to update your registration anytime your
                      contact information changes. This includes: moving to a
                      new address, getting a new phone number, or changing your
                      primary email address. ChippedMonkey allows you to log in
                      and make these essential updates instantly, ensuring
                      continuous protection.
                    </p>
                  </div>
                  <div className="cm-faq-item">
                    <h4 className="cm-faq-question">
                      My pet's microchip is from a different company. Can I
                      still register with ChippedMonkey?
                    </h4>
                    <p className="cm-faq-answer">
                      Yes! We are a universal pet recovery service. You can
                      register any brand or manufacturer's microchip here on
                      ChippedMonkey. Our goal is simple: to make sure your
                      contact information is centralized, secure, and easily
                      accessible to anyone who finds your lost pet.
                    </p>
                  </div>
                </div>
              </div>

              {/* --- New Content Section: FAQ (Wrapped in Distinct Container) --- */}
              <div className="row mt-5 cmp-faq-full-width">
                <div className="container">
                  <div className="row">
                    <div className="col-lg-12">
                      {/* H1 Title for SEO and Structure */}
                      <h1 className="cmp-faq-main-h1">
                        Pet Microchip Registration FAQs
                      </h1>
                      <h2 className="fs-3 section-title-h2 cmp-faq-header">
                        Your Questions About Pet Microchip Protection, Answered
                      </h2>
                      <p className="cmp-faq-intro-text">
                        We understand you want the best protection for your
                        companion. Here are the answers to the most common
                        questions about microchips and registration.
                      </p>
                      {/* FAQ Item 1 */}
                      <div className="cmp-faq-card">
                        <details className="cmp-faq-details">
                          <summary className="cmp-faq-question">
                            What is a pet microchip, exactly?
                          </summary>
                          <p className="cmp-faq-answer">
                            A pet microchip is a tiny, rice-sized transponder
                            implanted just under your pet's skin. It is read by
                            a scanner, which reveals a unique ID number. It is
                            NOT a GPS device . It cannot track your pet's
                            location; it only serves as a permanent, scannable
                            ID.
                          </p>
                        </details>
                      </div>
                      {/* FAQ Item 2 */}
                      <div className="cmp-faq-card">
                        <details className="cmp-faq-details">
                          <summary className="cmp-faq-question">
                            Why is registration necessary if my pet is already
                            microchipped?
                          </summary>
                          <p className="cmp-faq-answer">
                            Implantation only gives your pet a unique ID number.
                            Registration is the critical step that links that
                            unique ID number to your contact information in a
                            database. Without registration, a scanner will only
                            show a number, and the shelter won't know who to
                            call. Registration is what makes the microchip work.
                          </p>
                        </details>
                      </div>
                      {/* FAQ Item 3 */}
                      <div className="cmp-faq-card">
                        <details className="cmp-faq-details">
                          <summary className="cmp-faq-question">
                            I don't know my pet's microchip number. What should
                            I do?
                          </summary>
                          <p className="cmp-faq-answer">
                            Don't worry! If you can't find it on your veterinary
                            records or adoption papers, simply take your pet to
                            any veterinarian or animal shelter. They will scan
                            your pet for free to retrieve the microchip ID
                            number for you.
                          </p>
                        </details>
                      </div>
                      {/* FAQ Item 4 */}
                      <div className="cmp-faq-card">
                        <details className="cmp-faq-details">
                          <summary className="cmp-faq-question">
                            My pet's microchip is from a different company. Can
                            I still register with ChippedMonkey?
                          </summary>
                          <p className="cmp-faq-answer">
                            Yes! ChippedMonkey is a universal pet recovery
                            service. You can register any brand or
                            manufacturer's microchip here. Our goal is to make
                            sure your contact information is centralized,
                            secure, and easily accessible to anyone who finds
                            your lost pet.
                          </p>
                        </details>
                      </div>
                      {/* FAQ Item 5 (New Question) */}
                      <div className="cmp-faq-card">
                        <details className="cmp-faq-details">
                          <summary className="cmp-faq-question">
                            Do microchips replace collars and ID tags?
                          </summary>
                          <p className="cmp-faq-answer">
                            No. Microchips are a permanent backup. An ID tag on
                            a collar provides immediate visual contact
                            information for the rescuer. A microchip is the
                            permanent identification that remains if the collar
                            falls off. We recommend using both!
                          </p>
                        </details>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="row mt-5">
                <div className="col-lg-12">
                  <h2 className="fs-3">UK Microchip Law in Detail</h2>
                </div>
              </div>
              <div className="row listall">
                <div className="col-lg-6 mb-3 pe-5">
                  <h4 className="fs-5 mt-4 pb-0">
                    England, Wales, and Scotland
                  </h4>
                  <ul className="ms-3">
                    <li>
                     <b> Dogs:</b> Microchipping is mandatory, and keeper details must
                      be kept current.
                    </li>
                    <li> <b>Penalty:</b> Up to £500 fine for non-compliance.</li>
                    <li>
                      <b> Cats:</b> Not universally mandatory — but many councils
                      require it for licensing, housing, or rehoming.
                    </li>
                  </ul>

                  <div className="mt-4">

  <h4 className="fs-5 mt-4 pb-0">Northern Ireland</h4>
                <ul className="ms-3">
                    <li>
                      Similar rules apply for dogs; cats may have regional
                      requirements.
                    </li>
                  </ul>



                  
                  </div>
                </div>

                <div className="col-lg-6 mb-3 pe-5">
                  <h4 className="fs-5">Why it matters</h4>
                   <ul className="ms-3">
                      <li>
                      Scanning shelters can quickly identify you if your pet goes missing.
                      </li>
                      <li>Ensures compliance with local licensing laws and kennel or pet hotel requirements.
</li>
                    
                    </ul>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      {/* <div className="bg-all-lig pt-5 pb-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <ul className="list-style-side">
                <li>dog microchip registration Bedfordshire</li>
                <li>cat microchip registration Bedfordshire</li>
                <li>dog microchip registration Berkshire</li>
                <li>cat microchip registration Berkshire</li>
                <li>dog microchip registration Bristol</li>
                <li>cat microchip registration Bristol</li>
                <li>dog microchip registration Buckinghamshire</li>
                <li>cat microchip registration Buckinghamshire</li>
                <li>dog microchip registration Cambridgeshire</li>
                <li>cat microchip registration Cambridgeshire</li>
                <li>dog microchip registration Cheshire</li>
                <li>cat microchip registration Cheshire</li>
                <li>dog microchip registration City of London</li>
                <li>cat microchip registration City of London</li>
                <li>dog microchip registration Cornwall</li>
                <li>cat microchip registration Cornwall</li>
                <li>dog microchip registration Cumbria</li>
                <li>cat microchip registration Cumbria</li>
                <li>dog microchip registration Derbyshire</li>
                <li>cat microchip registration Derbyshire</li>
                <li>dog microchip registration Devon</li>
                <li>cat microchip registration Devon</li>
                <li>dog microchip registration Dorset</li>
                <li>cat microchip registration Dorset</li>
                <li>dog microchip registration Durham</li>
                <li>cat microchip registration Durham</li>
                <li>dog microchip registration East Riding of Yorkshire</li>
                <li>cat microchip registration East Riding of Yorkshire</li>
                <li>dog microchip registration East Sussex</li>
                <li>cat microchip registration East Sussex</li>
                <li>dog microchip registration Essex</li>
                <li>cat microchip registration Essex</li>
                <li>dog microchip registration Gloucestershire</li>
                <li>cat microchip registration Gloucestershire</li>
                <li>dog microchip registration Greater London</li>
                <li>cat microchip registration Greater London</li>
                <li>dog microchip registration Greater Manchester</li>
                <li>cat microchip registration Greater Manchester</li>
                <li>dog microchip registration Hampshire</li>
                <li>cat microchip registration Hampshire</li>
                <li>dog microchip registration Herefordshire</li>
                <li>cat microchip registration Herefordshire</li>
                <li>dog microchip registration Hertfordshire</li>
                <li>cat microchip registration Hertfordshire</li>
                <li>dog microchip registration Isle of Wight</li>
                <li>cat microchip registration Isle of Wight</li>
                <li>dog microchip registration Kent</li>
                <li>cat microchip registration Kent</li>
              </ul>
            </div>
            <div className="col-md-6">
              <ul className="list-style-side">
                <li>dog microchip registration Lancashire</li>
                <li>cat microchip registration Lancashire</li>
                <li>dog microchip registration Leicestershire</li>
                <li>cat microchip registration Leicestershire</li>
                <li>dog microchip registration Lincolnshire</li>
                <li>cat microchip registration Lincolnshire</li>

                <li>dog microchip registration Merseyside</li>
                <li>cat microchip registration Merseyside</li>
                <li>dog microchip registration Norfolk</li>
                <li>cat microchip registration Norfolk</li>
                <li>dog microchip registration North Yorkshire</li>
                <li>cat microchip registration North Yorkshire</li>
                <li>dog microchip registration Northamptonshire</li>
                <li>cat microchip registration Northamptonshire</li>
                <li>dog microchip registration Northumberland</li>
                <li>cat microchip registration Northumberland</li>
                <li>dog microchip registration Nottinghamshire</li>
                <li>cat microchip registration Nottinghamshire</li>
                <li>dog microchip registration Oxfordshire</li>
                <li>cat microchip registration Oxfordshire</li>
                <li>dog microchip registration Rutland</li>
                <li>cat microchip registration Rutland</li>
                <li>dog microchip registration Shropshire</li>
                <li>cat microchip registration Shropshire</li>
                <li>dog microchip registration Somerset</li>
                <li>cat microchip registration Somerset</li>
                <li>dog microchip registration South Yorkshire</li>
                <li>cat microchip registration South Yorkshire</li>
                <li>dog microchip registration Staffordshire</li>
                <li>cat microchip registration Staffordshire</li>
                <li>dog microchip registration Suffolk</li>
                <li>cat microchip registration Suffolk</li>
                <li>dog microchip registration Surrey</li>
                <li>cat microchip registration Surrey</li>
                <li>dog microchip registration Tyne and Wear</li>
                <li>cat microchip registration Tyne and Wear</li>
                <li>dog microchip registration Warwickshire</li>
                <li>cat microchip registration Warwickshire</li>
                <li>dog microchip registration West Midlands</li>
                <li>cat microchip registration West Midlands</li>
                <li>dog microchip registration West Sussex</li>
                <li>cat microchip registration West Sussex</li>
                <li>dog microchip registration West Yorkshire</li>
                <li>cat microchip registration West Yorkshire</li>
                <li>dog microchip registration Wiltshire</li>
                <li>cat microchip registration Wiltshire</li>
                <li>dog microchip registration Worcestershire</li>
                <li>cat microchip registration Worcestershire</li>
              </ul>
            </div>
          </div>
        </div>
      </div> */}
    </CommonLayout>
  );
}
