"use client";

import axios from "axios";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import Link from "next/link";
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

interface Pet {
  id: number;
  pet_name: string;
  type: string;
  pet_status: string;
  address: string;
  breed: string;
  photo: string;
  color: string;
  sex: string;
  dob: string;
  microchip_number: string;
  created_at: string;
}

export default function LostPetLists(): React.JSX.Element {
  const statusOptions = [
    { value: "", label: "All" },
    { value: "Lost", label: "Lost" },
    { value: "Found", label: "Found" },
  ];
  // TEMP filter states (only for Apply button)
  const [tempSearch, setTempSearch] = useState("");
  const [tempStatusFilter, setTempStatusFilter] = useState("");
  const [tempTypeFilter, setTempTypeFilter] = useState("");

  const petTypeOptions = [
    { value: "", label: "All" },
    { value: "Dog", label: "Dog" },
    { value: "Cat", label: "Cat" },
    { value: "Pug", label: "Pug" },
    { value: "Other", label: "Other" },
  ];
  const resetFilters = () => {
    // temp (sidebar)
    setTempSearch("");
    setTempStatusFilter("");
    setTempTypeFilter("");

    // applied filters
    setSearch("");
    setStatusFilter("");
    setTypeFilter("");

    setIsFilter(false); // close mobile filter
  };

  const [pets, setPets] = useState<Pet[]>([]);
  const [search, setSearch] = useState("");
  const [isFilter, setIsFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [loading, setLoading] = useState(true); // ✅ Loading state

  const fetchedRef = useRef(false);

  const fetchData = async () => {
    setLoading(true); // Start loading
    try {
      const url = `${appUrl}frontend/lost_found/list`;
      const res = await axios.post(url, {}); // API expects empty payload

      if (res.data.statusCode === 200) {
        setPets(res.data.data || []);
      } else {
      }
    } catch (error: any) {
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchData();
      fetchedRef.current = true;
    }
  }, []);

  const mapStatus = (status: string) => {
    if (status === "lost") return "Lost";
    if (status === "stolen") return "Stolen";
    if (status === "not_lost_or_stolen") return "Found";
    return "Unknown";
  };

  const filteredPets = useMemo(() => {
    return pets.filter(
      (pet) =>
        pet.pet_name.toLowerCase().includes(search.toLowerCase()) &&
        (statusFilter ? mapStatus(pet.pet_status) === statusFilter : true) &&
        (typeFilter
          ? pet.type.toLowerCase() === typeFilter.toLowerCase()
          : true)
    );
  }, [pets, search, statusFilter, typeFilter]);

  // Skeleton Loader
  const renderSkeleton = () => {
    const skeletons = Array.from({ length: 6 }).map((_, idx) => (
      <div className="lostPets-card skeleton-card" key={idx}>
        {/* Image with sash */}
        <div className="lostPets-card-image skeleton-image">
          <div className="skeleton-sash" />
        </div>
        {/* Card content */}
        <div className="lostPets-card-content">
          <div className="lostPets-card-header">
            <div className="skeleton-line skeleton-title" />
            <div className="skeleton-line skeleton-date" />
          </div>
          <div className="skeleton-line skeleton-meta" />
          <div className="skeleton-line skeleton-location" />
          <div className="skeleton-btn" />
        </div>
      </div>
    ));
    return skeletons;
  };

  return (
    <>
      <div className="page-title-container">
        <div className="page-title">
          <h1>Lost & Found Pets</h1>
          <p className="lostPets_header_content">
            Help pets get home safely — search below or report a missing pet.
          </p>
        </div>

        <div className="page-title-filter desktop_none mobile_show">
          <svg
            className="filter-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            onClick={() => setIsFilter((prev) => !prev)}>
            <polygon points="22 3 2 3 10 12 10 19 14 21 14 12 22 3" />
          </svg>
        </div>
      </div>
      <div className="lost_found_pets_wrapper">
        <ToastContainer />
        <div className="lost_found_pets_container">
          <div className="row">
            {/* Sidebar */}
            <div className="col-md-3 col-12">
              <aside className={`lostPets-filter ${isFilter ? "active" : ""}`}>
                <h5 className="lostPets-filter-title">Find a Pet</h5>

                <div className="lostPets-field">
                  <label>Search</label>
                  <input
                    type="text"
                    className="lostPets-input"
                    placeholder="Search by place..."
                    value={tempSearch}
                    onChange={(e) => setTempSearch(e.target.value)}
                  />
                </div>

                <div className="lostPets-field">
                  <label>Pet's Status</label>
                  <Select
                    options={statusOptions}
                    value={statusOptions.find(
                      (opt) => opt.value === tempStatusFilter
                    )}
                    onChange={(selected) =>
                      setTempStatusFilter(selected?.value || "")
                    }
                    placeholder="Select status"
                    className="lostPets-react-select"
                    classNamePrefix="lostPets-select"
                  />
                </div>

                <div className="lostPets-field">
                  <label>Pet Type</label>
                  <Select
                    options={petTypeOptions}
                    value={petTypeOptions.find(
                      (opt) => opt.value === tempTypeFilter
                    )}
                    onChange={(selected) =>
                      setTempTypeFilter(selected?.value || "")
                    }
                    placeholder="Select pet type"
                    className="lostPets-react-select"
                    classNamePrefix="lostPets-select"
                  />
                </div>
                <div className="lostPets-filter-buttons">
                  <button
                    className="lostPets-view-btn filter_btn"
                    style={{ marginTop: "10px", width: "100%" }}
                    onClick={() => {
                      setSearch(tempSearch);
                      setStatusFilter(tempStatusFilter);
                      setTypeFilter(tempTypeFilter);
                      setIsFilter(false); // mobile close
                    }}>
                    Apply Filters
                  </button>
                </div>
              </aside>
            </div>

            {/* Pet Cards */}
            <div className="col-md-9 col-12">
              {loading ? (
                <div className="lostPets-list">{renderSkeleton()}</div>
              ) : filteredPets.length > 0 ? (
                <div className="lostPets-list">
                  {filteredPets.map((pet) => (
                    <div className="lostPets-card" key={pet.id}>
                      <div className="lostPets-card-image">
                        <img
                          src={`${appUrl}uploads/${pet.photo}`}
                          alt={pet.pet_name}
                          onError={(e) => {
                            e.currentTarget.src = `/assets/images/no-images.png`;
                          }}
                        />

                        <div
                          className={`lostPets-sash ${
                            mapStatus(pet.pet_status) === "Lost"
                              ? "lost"
                              : "found"
                          }`}>
                          <span>{mapStatus(pet.pet_status)}</span>
                        </div>
                      </div>

                      <div className="lostPets-card-content">
                        <div className="lostPets-card-header">
                          <h5>{pet.pet_name}</h5>
                          <span className="lostPets-date">
                            {new Date(pet.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <p className="lostPets-meta">
                          {pet.type} • {pet.breed || "Unknown"}
                        </p>

                        <p className="lostPets-location">
                          <img
                            src="/assets/images/location_img.jpeg"
                            alt="Location Icon"
                            style={{
                              width: "15px",
                              height: "15px",
                              marginRight: "4px",
                            }}
                          />
                          {pet.address || "Unknown"}
                        </p>

                        <Link href={`/pet-owners/lost-found-pets/${pet.id}`}>
                          <button className="lostPets-view-btn">
                            View More
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* ✅ OUTSIDE lostPets-list */
                <div className="no-pet-results">
                  <div className="icon-wrapper">🐕</div>
                  <h2>No Pets Found</h2>
                  <p>
                    We couldn't find pets matching your current
                    filters. Try adjusting your search.
                  </p>

                  <button className="clear-filters-btn" onClick={resetFilters}>
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
