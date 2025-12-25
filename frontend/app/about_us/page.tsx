import CommonLayout from "../frontend/layouts/CommonLayouts";
import Image from "next/image";
import { generateCommonMetadata } from "../utils/metadata";
import { Metadata } from "next";

const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
const appUrl = process.env.NEXT_PUBLIC_APP_URL; // Your API URL

export async function generateMetadata(): Promise<Metadata> {
  const res = await fetch(`${appUrl}frontend/pages/list/?id=7`);
  const result = await res.json();
  const seoData = result.data ? result.data[0] : null;

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
    `${frontendUrl}about_us`
  );
}

export default function Shop() {
  return (
    <CommonLayout>
      <div className="main-page-container">
        <div className="container pt-7 pt-md-7 pb-8">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <h1>
                About Chipped Monkey: Your Trusted National Pet Microchip
                Registry
              </h1>

              <div className="row mt-3 mb-5 d-flex align-items-center">
                <div className="col-md-3">
                  <Image
                    src="/assets/images/about-logo.png"
                    width={300}
                    height={289}
                    alt="About us logo"
                    className="img-fluid"
                  />
                </div>
                <div className="col-md-9">
                  <p>
                    ​At Chipped Monkey, we believe that no pet should ever be
                    truly lost. Our mission is to provide a secure, reliable,
                    and universal pet microchip registration service that gives
                    pet parents the ultimate peace of mind. As a vital link in
                    the national pet recovery chain, we specialize in bringing
                    families back together through advanced technology and
                    seamless database integration. ​By choosing Chipped Monkey,
                    you are ensuring that your dog or cat is protected by a
                    registry that is visible to every animal shelter and
                    veterinary clinic in the United States.
                  </p>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12 mb-5">
                  <h2>
                    A Proud AAHA Universal Pet Microchip Lookup Participant
                  </h2>
                  <p className="mb-0">
                    ​The strength of a pet recovery database lies in its
                    accessibility. We are a recognized participant in the AAHA
                    (American Animal Hospital Association) Universal Pet
                    Microchip Lookup tool.
                  </p>
                  <p>
                    ​This is the industry-standard search engine used by animal
                    professionals nationwide. When a lost pet is found and
                    scanned, the AAHA tool instantly identifies Chipped Monkey
                    as the primary registry. This integration allows rescuers to
                    find your contact information faster, significantly
                    increasing the chances of a rapid pet reunion.
                  </p>
                </div>

                <div className="col-md-12 mb-5">
                  <h2>Why Register with the Chipped Monkey Network?</h2>
                  <p className="mb-0">
                    ​In the world of lost pet prevention, seconds matter. We
                    have designed our platform to be the most efficient online
                    pet microchip registry available.
                  </p>
                  <p>
                    ​This is the industry-standard search engine used by animal
                    professionals nationwide. When a lost pet is found and
                    scanned, the AAHA tool instantly identifies Chipped Monkey
                    as the primary registry. This integration allows rescuers to
                    find your contact information faster, significantly
                    increasing the chances of a rapid pet reunion.
                  </p>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12 mb-4">
                  <h1 className="mb-0">How It Works ?</h1>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4">
                  <div className="stepsall steps1 h-100 h-100">
                    <div>
                      <Image
                        src="/assets/images/step-icons1.png"
                        width={85}
                        height={85}
                        alt="Step 01"
                      />
                    </div>
                    <span>Step 01</span>
                    <h3>Universal Compatibility for All Chips</h3>
                    <p>
                      ​We are a universal pet registry. We support every
                      microchip brand and frequency, including:
                      <ul>
                        <li>​15-digit ISO Standard (134.2 kHz)</li>​
                        <li>10-digit Non-ISO (125 kHz)</li>​
                        <li>9-digit Avid (128 kHz)</li>
                      </ul>
                    </p>
                    <p>Whether your pet has a chip from HomeAgain, Avid, 24PetWatch, or AKC Reunite, Chipped Monkey can securely store and protect their ID.</p>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="stepsall steps1 h-100">
                    <div>
                      <Image
                        src="/assets/images/step-icons2.png"
                        width={85}
                        height={85}
                        alt="Step 02"
                      />
                    </div>
                    <span>Step 02</span>
                    <h3>User-Friendly Profile Management</h3>
                    <p>
                     ​Your life changes—you move homes, change phone numbers, or get a new email. Our secure portal allows you to update your recovery information 24/7. An updated profile is the #1 factor in successfully returning a lost pet, and we make that process effortless for pet owners.
                    </p>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="stepsall steps1 h-100">
                    <div>
                      <Image
                        src="/assets/images/step-icons3.png"
                        width={85}
                        height={85}
                        alt="Step 03"
                      />
                    </div>
                    <span>Step 03</span>
                    <h3> Built for Professionals and Pet Parents</h3>
                    <p>
                     ​While our interface is simple for owners, our backend meets the rigorous technical standards required by the AAHA network and national animal welfare organizations. We bridge the gap between complex technology and the simple love you have for your pet.

                    </p>
                  </div>
                </div>

            
              </div>
              {/* --- New Content Section: FAQ (Wrapped in Distinct Container) --- */}
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
                            How do I register my pet's microchip with Chipped Monkey?
                          </summary>
                          <p className="cmp-faq-answer">
                           ​Registration is easy! Visit our portal, enter your pet’s unique 9, 10, or 15-digit microchip ID, and provide your contact details. Your pet will be instantly added to our searchable national database.

                          </p>
                        </details>
                      </div>
                      {/* FAQ Item 2 */}
                      <div className="cmp-faq-card">
                        <details className="cmp-faq-details">
                          <summary className="cmp-faq-question">
                           Is there a fee for Chipped Monkey registration?
                          </summary>
                          <p className="cmp-faq-answer">
                           ​We offer transparent and accessible registration options to ensure every pet can be protected. Unlike other registries that hide your data behind expensive annual subscriptions, Chipped Monkey focuses on lifetime recovery visibility.
                          </p>
                        </details>
                      </div>
                      {/* FAQ Item 3 */}
                      <div className="cmp-faq-card">
                        <details className="cmp-faq-details">
                          <summary className="cmp-faq-question">
                             Can any vet find me through Chipped Monkey?

                          </summary>
                          <p className="cmp-faq-answer">
                        ​Yes. Because we are integrated with the AAHA Universal Lookup, any veterinarian or shelter with an internet connection can identify Chipped Monkey as your pet’s registry and facilitate your contact.

                          </p>
                        </details>
                      </div>
                      {/* FAQ Item 4 */}
                      <div className="cmp-faq-card">
                        <details className="cmp-faq-details">
                          <summary className="cmp-faq-question">
                       What makes Chipped Monkey different from other registries?
                          </summary>
                          <p className="cmp-faq-answer">
                            ​Our commitment to humanized pet recovery. We don't just store numbers; we provide a community-focused safety net that is optimized for both Google search and professional animal recovery tools.

                          </p>
                        </details>
                      </div>
                      {/* FAQ Item 5 (New Question) */}
                      <div className="cmp-faq-card">
                        <details className="cmp-faq-details">
                          <summary className="cmp-faq-question">
                            Join the Chipped Monkey Mission
                          </summary>
                          <p className="cmp-faq-answer">
                           ​Don't wait for an emergency to happen. Ensure your pet has a voice when they are lost. Register with Chipped Monkey today and join thousands of pet parents who trust us to be their partner in pet safety and recovery.
                          </p>
                        </details>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </CommonLayout>
  );
}
