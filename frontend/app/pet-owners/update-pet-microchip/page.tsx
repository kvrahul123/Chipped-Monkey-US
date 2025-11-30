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
                className="registe-monkey-new"
                style={{
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}>
                <div className="row">
                  <div className="col-lg-6 col-md-12 mb-4 mb-lg-0 register-left-dv">
                    <h2 className="mb-0 page-title-h2 text-white">
                      Register your Chipped Monkey here
                    </h2>
                    <p className="mt-2 text-white">
                      To start a transfer or registration, enter the MicroChip
                      number in the box below and follow the options on
                      screen.&nbsp;
                    </p>
                    <div className="top-images">
                      <Image
                        src="/assets/images/dog-icons.png"
                        alt="popular image"
                        width={75}
                        height={75}
                      />

                      <Image
                        src="/assets/images/cat-icons.png"
                        alt="popular image"
                        width={75}
                        height={75}
                      />

                      <Image
                        src="/assets/images/ferret-icons.png"
                        alt="popular image"
                        width={75}
                        height={75}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12 mb-0 register-right-dv">
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
                      <h4 className="fs-5 mt-3">
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
                      <h4 className="fs-5 mt-3">
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
                      <h4 className="fs-5 mt-3">
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
                      <h4 className="fs-5 mt-3">
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

              <div className="row bg-light-a p-4">
                <div className="col-lg-12 mb-3 pe-2 pe-lg-5">
                  <h2 className="fs-3">
                    UK Microchip Law — What You Need to Know
                  </h2>

                  <p>
                    In the UK, it’s a legal requirement for all dogs to be
                    microchipped and for keeper details to be kept up to date.
                    If your dog’s microchip doesn’t match your current address
                    or phone, you could face a fine of up to £500. For cats
                    England mandates cat microchipping by law. If your cats
                    microchip doesn’t match your current address or phone, you
                    could face a fine of up to £500.
                  </p>

                  <h5>Staying compliant:</h5>

                  <div className="ps-0 mt-4 d-flex flexcol">
                    <ul className="mb-3 list-icons-new2 pe-3 pe-lg-5">
                      <li>
                        Ensures you’re covered if your pet is lost or stolen.
                      </li>
                      <li>
                        Increases the chance of a safe return through shelters
                        or vets scanning the chip.
                      </li>

                      <li>Avoids penalties under UK microchip law.</li>
                    </ul>
                    {/* <ul className="mb-0 list-icons-new2">
                      <li>
                        We support these microchip types to match most UK
                        practices:
                        <div className="d-flex mt-2">
                          <p className="mb-0 pe-5 fw-600">
                            — FECAVA / FDXA <br></br>— Avid Encrypted
                          </p>
                          <p className="mb-0 pe-5 fw-600">
                            — Trovan Unique
                            <br></br>— ISO / FDXB
                          </p>
                        </div>
                      </li>
                    </ul> */}
                  </div>

                  <p className="mb-0">
                    So no matter which microchip standard your vet used, we're
                    ready.
                  </p>
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
