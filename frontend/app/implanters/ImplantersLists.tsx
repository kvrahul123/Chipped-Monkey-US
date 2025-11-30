"use client";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;
import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import Image from "next/image";
import Link from "next/link";
import parse from "html-react-parser";

interface Implanter {
  id: number;
  name: string;
  postcode: string;
  county?: string;
  // add other fields as needed
}

export const ImplantersLists = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const countyRef = useRef<HTMLInputElement>(null);
  const postcodeRef = useRef<HTMLInputElement>(null);
  const latitudeRef = useRef<HTMLInputElement>(null);
  const longitudeRef = useRef<HTMLInputElement>(null);
  const [postcode, setPostcode] = useState<string>("");
  const [implanters, setImplanters] = useState<Implanter[]>([]);
  const [loading, setLoading] = useState(false);
  const [isShowMsg, setisShowMsg] = useState(false);
  const [error, setError] = useState<string>("");
  const [seoData, setSeoData] = useState([]);

  const fetchSeoData = async () => {
    try {
      const res = await fetch(`${appUrl}frontend/pages/list/?id=19`);
      const result = await res.json();
      const seoData = result.data ? result.data[0] : null;
      setSeoData(seoData);
    } catch (err) {
      console.error("Error fetching SEO data:", err);
    }
  };
    const addressRef = useRef(null);

useEffect(() => {
  const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"]
  });


  loader.load().then(() => {
    if (!addressRef.current) return;
    console.log("Address Ref:", addressRef.current);

    const autocomplete = new google.maps.places.Autocomplete(
      addressRef.current,
      {
        types: ["(regions)"],
        fields: [
          "address_components",
          "formatted_address",
          "geometry"
        ],
        componentRestrictions: { country: "gb" },
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.address_components) return;

      const comp = {};
      place.address_components.forEach((c) => {
        comp[c.types[0]] = c.long_name;
      });
      setPostcode(comp["postal_code"] || "")

    });
  });
  fetchSeoData();
}, [addressRef]);

  const handleSearch = async () => {

    if (!postcode) {
      setError("Please select a valid postcode.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${appUrl}frontend/implanters/list?postcode=${encodeURIComponent(
          postcode
        )}`
      );
      if (!res.ok) throw new Error("Failed to fetch implanters");

      const data = await res.json();
      if (data.data.length == 0) {
        setisShowMsg(true);
      }
      setImplanters(data.data || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {seoData ? (
        <div className="row">
          {parse(String(seoData.content)) || ""}

          <div className="col-12 text-center mb-5 mt-4 pb-4">
            <div className="input-implaters">
              <input
                type="text"
                ref={addressRef}
                placeholder="Search using postcode ..."
                className="form-control btn-sm pac-target-input"
                autoComplete="off"
              />
              {/* Hidden fields */}
              <input type="hidden" ref={countyRef} id="countyName" />
              <input type="hidden" ref={postcodeRef} id="postcodeField" />
              <input type="hidden" ref={latitudeRef} id="latitude" />
              <input type="hidden" ref={longitudeRef} id="longitude" />

              <button
                className="save_btn btn btn-primary"
                type="button"
                onClick={handleSearch}>
                Search
              </button>
            </div>
            {error && <div className="text-danger mt-2">{error}</div>}
          </div>

          <div className="col-12 text-center">
            <ul className="implanters-list">
              {implanters.length > 0
                ? implanters.map((implanter) => (
                    <li key={implanter.id}>
                      <Link
                        href={`/implanters/${implanter.slug}`}
                        className="d-flex align-items-center">
                        <div className="left-implanters">
                          <Image
                            width={219}
                            height={185}
                            src={
                              `${appUrl}uploads/${implanter.imageUrl}` ||
                              "/assets/images/no-image.png"
                            } // fallback if no image
                            alt={implanter.name}
                          />
                        </div>
                        <div className="right-implanters">
                          <h4>{implanter.company_name || "No Company Name"}</h4>
                          <p className="information">
                            {parse(implanter.small_description) ||
                              "No description available."}
                          </p>
                          <span className="address">
                            {implanter.address}, {implanter.city},{" "}
                            {implanter.postcode}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))
                : !loading &&
                  isShowMsg &&
                  implanters.length === 0 && <p>No implanters found.</p>}
            </ul>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};
