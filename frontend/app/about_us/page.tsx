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
              <h2>
                Trusted UK Pet Microchip Registry for Lost &amp; Found Pets
              </h2>

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
                    At <a className="link-we">ChippedMonkey.com</a>, we are
                    dedicated to solving one of the most heartbreaking
                    challenges pet keepers face—losing a beloved animal. With
                    over 25 years of experience in the pet industry, we’ve seen
                    the heartache that comes with a lost pet and the relief when
                    that pet is safely returned home. Our mission is simple yet
                    powerful: to help reunite lost, microchipped pets with their
                    rightful keepers through a reliable, UK-based microchip
                    registration service.
                  </p>
                  <p>
                    In a world where millions of pets are microchipped, too many
                    are never reunited with their families due to improper or
                    missing registration. Our goal is to close this
                    gap—providing keepers, shelters, vets, and animal control
                    professionals across the UK with a central, trusted database
                    that makes finding lost pets faster, easier, and more
                    effective.
                  </p>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12 mb-5">
                  <h3>Our Mission</h3>
                  <p className="mb-0">
                    Our mission at <a className="link-we">ChippedMonkey.com</a>{" "}
                    is to ensure that every microchipped pet in the UK is
                    registered in an up-to-date, accessible system that can be
                    searched quickly in the event a pet goes missing. We aim to
                    become the most trusted pet microchip registration provider
                    in the UK by focusing on accuracy, reliability, and ease of
                    use.
                  </p>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="bg-about-a bg-about-a1">
                    <h3>We believe in</h3>
                    <p>
                      Making it easy for pet keepers to register their pets.
                    </p>
                    <p>
                      Offering a platform that is accessible to professionals
                      handling lost animals.
                    </p>
                    <p>Encouraging responsible pet keepership across the UK.</p>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="bg-about-a">
                    <h3>Why Microchipping Matters</h3>
                    <p>
                      Microchipping is one of the most effective ways to ensure
                      a lost pet can be returned home safely. Each pet’s
                      microchip contains a unique ID number that links to the
                      keeper&apos;s contact information in a secure database.
                      But the microchip alone is not enough—proper registration
                      is critical.
                    </p>

                    <p>
                      Every year, thousands of pets in the UK are microchipped
                      but never returned home simply because their chip was not
                      registered or the contact details were outdated. That’s
                      where
                      <a className="link-we">ChippedMonkey.com</a> makes a
                      difference.
                    </p>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="bg-about-a">
                    <h3>We ensure</h3>
                    <p>Your microchip data is securely stored.</p>
                    Your contact details are kept current.<p></p>
                    <p>
                      The recovery process is straightforward for animal
                      professionals.
                    </p>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="bg-about-a bg-about-a1">
                    <h3>A UK-Based Service You Can Trust</h3>
                    <p>
                      We’re proudly based in the United Kingdom, serving pet
                      keepers and professionals from all across England,
                      Scotland, Wales, and Northern Ireland.
                    </p>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="bg-about-a bg-about-a1">
                    <h3>Our services are tailored to</h3>
                    <p>Meet UK microchipping compliance.</p>
                    <p>Support UK-based shelters, vets, and local councils.</p>

                    <p>
                      Serve all types of pets—from cats and dogs to rabbits and
                      exotic animals.
                    </p>
                  </div>
                </div>

                <div className="col-md-6 mb-4">
                  <div className="bg-about-a">
                    <h3>Lost &amp; Found: Our Core Focus</h3>
                    <p>
                      At <a className="link-we">ChippedMonkey.com</a>, we
                      specialize in helping to reunite lost pets with their
                      families. Our team works closely with lost and found
                      networks, rescue organisations, vets, and local
                      authorities to facilitate the recovery process. When a pet
                      with a registered microchip is found, time is of the
                      essence. Our platform ensures a swift lookup process and
                      immediate access to the contact information needed to get
                      pets back home safely.
                    </p>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="bg-about-a">
                    <h3>Key benefits of our system include</h3>

                    <p>24/7 microchip lookup capability.</p>

                    <p>Real-time keeper notification options.</p>

                    <p>
                      Integration with lost pet networks. <br /> <br />
                      We also provide guidance for pet keeper on what to do if
                      their pet goes missing, and we support the professionals
                      who are on the frontlines of pet recovery.
                    </p>
                  </div>
                </div>
              </div>

              <div className="row mt-5">
                <div className="col-md-12 mb-4">
                  <h1 className="mb-0">How It Works ?</h1>
                </div>
              </div>

              <div className="row">
                <div className="col-md-3">
                  <div className="stepsall steps1">
                    <div>
                      <Image
                        src="/assets/images/step-icons1.png"
                        width={85}
                        height={85}
                        alt="Step 01"
                      />
                    </div>
                    <span>Step 01</span>
                    <h4>Register Your Pet</h4>
                    <p>
                      Enter your pet’s microchip number, your contact details,
                      and a few important facts about your pet.
                    </p>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="stepsall steps1">
                    <div>
                      <Image
                        src="/assets/images/step-icons2.png"
                        width={85}
                        height={85}
                        alt="Step 02"
                      />
                    </div>
                    <span>Step 02</span>
                    <h4>Secure Your Information</h4>
                    <p>
                      We store your data securely and allow you to update it any
                      time, ensuring it&apos;s always current.
                    </p>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="stepsall steps1">
                    <div>
                      <Image
                        src="/assets/images/step-icons3.png"
                        width={85}
                        height={85}
                        alt="Step 03"
                      />
                    </div>
                    <span>Step 03</span>
                    <h4>Pet Gets Lost?</h4>
                    <p>
                      If your pet is found, a vet, shelter, or animal warden can
                      search the microchip number in our system.
                    </p>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="stepsall steps1">
                    <div>
                      <Image
                        src="/assets/images/step-icons4.png"
                        width={85}
                        height={85}
                        alt="Step 04"
                      />
                    </div>
                    <span>Step 04</span>
                    <h4>Reunification</h4>
                    <p>
                      Once the pet is matched, the keeper is notified and
                      reunited with their pet as quickly as possible.
                    </p>
                  </div>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-md-12">
                  <p>It’s that simple—and that important.</p>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-12 mb-4">
                  <div className="bg-abo-all">
                    <h3 className="mb-0">Education &amp; Awareness</h3>
                    <p className="mb-0">
                      Part of our mission includes educating pet keepers across
                      the UK about the importance of microchip registration and
                      regular data updates. Many keepers don’t realise that
                      registering a microchip is separate from having it
                      implanted—and that failure to register makes the chip
                      useless in helping return a lost animal.
                    </p>
                  </div>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-12 mb-4">
                  <div className="bg-abo-all">
                    <h3 className="mb-0">We actively:</h3>
                    <p>Share educational content and guides.</p>

                    <p>
                      Work with vet clinics and rescue groups to promote
                      awareness.
                    </p>

                    <p className="mb-0">
                      Encourage pet keepers to check and update their chip
                      details regularly.
                    </p>
                  </div>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-12 mb-4">
                  <div className="bg-abo-all">
                    <h3 className="mb-0">Our Experience</h3>
                    <p className="mb-0">
                      With more than 25 years of experience in the pet industry,
                      our team understands the challenges involved in lost pet
                      recovery. We’ve worked in pet care, veterinary services,
                      shelter management, and animal control. This gives us a
                      unique, 360-degree view of the issues—one we’ve used to
                      build a system that actually works for both pet keepers
                      and professionals.
                    </p>
                  </div>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-12 mb-4">
                  <div className="bg-abo-all">
                    <h3 className="mb-0">Our Commitment to Data Security</h3>
                    <p className="mb-0">
                      Your privacy and data protection are critically important
                      to us. We follow best practices in data security and
                      comply with all UK GDPR regulations. All microchip and
                      keeper information stored in our system is encrypted and
                      handled with strict confidentiality.
                    </p>
                  </div>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-12 mb-4">
                  <div className="bg-abo-all">
                    <h3 className="mb-0">
                      Why Choose <a className="link-we">ChippedMonkey.com</a>?
                    </h3>
                    <p>
                      UK-Based: We’re built specifically for UK pet keepers and
                      professionals.
                    </p>

                    <p>✔ Experienced: Over 25 years in the pet industry.</p>

                    <p>
                      ✔ Reliable &amp; Secure: Safe storage of your pet’s
                      microchip data.
                    </p>

                    <p>
                      ✔ Recognised: Widely used and trusted across animal
                      recovery networks.
                    </p>

                    <p>
                      ✔ User-Friendly: Simple registration and update process.
                    </p>

                    <p className="mb-0">
                      Whether you’re registering a new puppy, updating your
                      contact info, or searching for a lost pet, we make the
                      process quick and painless.
                    </p>
                  </div>
                </div>
              </div>

              {/* <div className="row mt-2">
                <div className="col-md-12 mb-4">
                  <div className="bg-abo-all">
                    <h3 className="mb-0">Success Stories</h3>
                    <h4>Milo the Spaniel – Birmingham</h4>
                    <p>
                      Milo went missing during a fireworks display and was found
                      10 miles away two days later. Thanks to a local vet
                      scanning his microchip and accessing our registry, he was
                      home within hours.
                    </p>

                    <h4>Luna the Cat – Glasgow</h4>
                    <p className="mb-0">
                      After slipping out an open window, Luna was taken in by a
                      kind neighbour who took her to a shelter. The shelter
                      checked her chip, pulled her record from our database, and
                      Luna was back with her family the same day. <br />
                      These are just a few of the thousands of successful
                      reunions we’ve helped make possible. <br /> Community
                      &amp; Partnerships
                    </p>
                  </div>
                </div>
              </div> */}

              <div className="row mt-5">
                <div className="col-md-12 mb-4">
                  <div className="bg-abo-all">
                    <h3 className="mb-0">
                      We believe in collaboration. That’s why we partner with:
                    </h3>
                    <p>Veterinary practices</p>
                    <p>Local authorities and dog wardens</p>
                    <p>Rescue centres and rehoming charities</p>
                    <p>Pet stores and breeders</p>
                    <p>
                      Together, we’re building a stronger network for pet
                      identification and recovery throughout the UK.
                    </p>
                    <p>Compliance &amp; Accreditation</p>

                    <p>
                      <b>
                        How You Can Help You can be part of the solution.
                        Here&apos;s how:
                      </b>
                    </p>
                    <p>Register your pets in our database.</p>
                    <p>Check and update your microchip details regularly.</p>
                    <p>Encourage friends and family to do the same.</p>
                    <p>
                      Support lost &amp; found initiatives in your local
                      community.
                    </p>
                    <p className="mb-0">
                      Every registration helps close the gap in the pet
                      microchip system and brings us closer to 100%
                      recoverability for lost pets.
                    </p>
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
