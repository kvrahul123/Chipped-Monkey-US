"use client";

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

interface LostPetDetailsProps {
  petId: string;
}

export default function LostPetDetails({ petId }: LostPetDetailsProps): React.JSX.Element {
  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!petId || hasFetched.current) return;
    hasFetched.current = true;

    const fetchDetails = async () => {
      try {
        const res = await axios.get(`${appUrl}frontend/lost_found/details/${petId}`);
        if (res.data?.statusCode === 200) {
          setPet(res.data.data);
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchDetails();
  }, [petId]);

if (loading) return <div className="pet_lux-loader">...</div>;
if (!pet) return <div>No pet details found</div>;

return (
  <section className="lostFoundDetails">
    <div className="lostFoundDetails__container">

      {/* Header */}
      <div className="lostFoundDetails__header">
        <span className="lostFoundDetails__status lost">
          {pet.pet_status === "lost" ? "LOST" : "FOUND"}
        </span>

        <h1 className="lostFoundDetails__petName">
          {pet.pet_name}
        </h1>

        <p className="lostFoundDetails__date">
          Posted on{" "}
          {new Date(pet.created_at).toLocaleDateString()}
        </p>
      </div>

      {/* Main Content */}
      <div className="lostFoundDetails__main">

        {/* Image */}
        <div className="lostFoundDetails__imageWrap">
                        <img
                          src={`${appUrl}uploads/${pet.photo}`}
                          alt={pet.pet_name}
                          onError={(e) => {
                            e.currentTarget.src = `/assets/images/no-images.png`;
                          }}
                        />
        </div>

        {/* Info */}
        <div className="lostFoundDetails__info">

          <div className="lostFoundDetails__infoRow">
            <span>Pet Type</span>
            <strong>{pet.type}</strong>
          </div>

          <div className="lostFoundDetails__infoRow">
            <span>Breed</span>
            <strong>{pet.breed}</strong>
          </div>

          <div className="lostFoundDetails__infoRow">
            <span>Gender</span>
            <strong>{pet.sex}</strong>
          </div>

          <div className="lostFoundDetails__infoRow">
            <span>Color</span>
            <strong>{pet.color}</strong>
          </div>
{/* 
          <div className="lostFoundDetails__infoRow">
            <span>Microchip ID</span>
            <strong>{pet.microchip_number}</strong>
          </div> */}

          <div className="lostFoundDetails__infoRow">
            <span>Owner Name</span>
            <strong>{pet.pet_keeper}</strong>
          </div>

          {/* <div className="lostFoundDetails__infoRow">
            <span>Contact</span>
            <strong>{pet.phone_number}</strong>
          </div> */}

          <button className="lostFoundDetails__cta">
            Contact Owner
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="lostFoundDetails__textBlock">
        <h3>Additional Details</h3>
        <p>
          {pet.medical_condition
            ? `Medical Condition: ${pet.medical_condition}`
            : "No medical conditions reported."}
        </p>
      </div>

      {/* Location */}
      <div className="lostFoundDetails__textBlock">
        <h3>Last Known Location</h3>
        <p className="lostFoundDetails__location">
          📍 {pet.address}, {pet.county}, {pet.postcode}, {pet.country}
        </p>
      </div>

    </div>
  </section>
);


}