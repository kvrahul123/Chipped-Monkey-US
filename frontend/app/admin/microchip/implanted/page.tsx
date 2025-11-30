"use client";
import CommonLayout from "../../layouts/CommonLayouts";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PaginationComponent from "@/app/common/PaginationComponent";
import Swal from "sweetalert2";
import axios from "axios";
import { getLocalStorageItem } from "@/app/common/LocalStorage";
import Image from "next/image";
import { verifyToken } from "../../common/api";
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

interface MicrochipOrder {
  id: number;
  order_id: string;
  user_id: number | null;
  microchip_count: number;
  date: string;
  status: "pending" | "cancelled" | "completed";
  created_at: string;
  updated_at: string;
}

export default function MicrochipOrdersPage() {
    const [userType, setUserType] = useState<string | null>(null);
  const [microchipsList, setmicrochipLists] = useState<MicrochipOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const token = getLocalStorageItem("token");


    useEffect(() => {
      const fetchUserType = async () => {
        const type = await verifyToken();
        if (type) {
          setUserType(type);
        }
      };
  
      fetchUserType();
    }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${appUrl}microchip_orders/microchip/implanted/lists`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data && data.statusCode == 200) {
            setmicrochipLists(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);


const deleteData = async (id: number) => {
  try {
    // Show confirmation modal
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return; // Exit if user cancels

    // Proceed with deletion
    const response = await axios.delete(
      `${appUrl}microchip/delete/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.statusCode === 200) {
      // Remove the deleted order from state
      setmicrochipLists((prevmicrochips) =>
        prevmicrochips.filter((microchips) => microchips.id !== id)
      );
      Swal.fire("Deleted!", "The Microchip has been deleted.", "success");
    } else {
      Swal.fire("Failed!", "Failed to delete the microchip.", "error");
    }
  } catch (error) {
    console.error("Error deleting data", error);
    Swal.fire("Error!", "An error occurred while deleting the microchip.", "error");
  }
};

  const filteredmicrochips = microchipsList.filter((microchip) =>
    microchip.microchip_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastmicrochips = currentPage * itemsPerPage;
  const indexOfFirstmicrochips = indexOfLastmicrochips - itemsPerPage;
  const currentmicrochips = filteredmicrochips.slice(
    indexOfFirstmicrochips,
    indexOfLastmicrochips
  );



  return (
    <CommonLayout>
      <div className="app-content">
        <div className="container-fluid h-100">
          <div className="row mb-3">
            <div className="col-md-12">
              <h1 className="fs-4">Implanted Microchips</h1>
            </div>
          </div>

          <div className="row h-100">
            <div className="col-md-12">
              <div className="card mb-4 h-100">
                <div className="card-header border-bottom border-light p-3 bg-white">
                  <div className="d-flex flex-wrap justify-content-between gap-3">
                    <div>
                      <input
                        type="text"
                        className="form-control ps-4"
                        placeholder="Search Microchip..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                      />
                    </div>
               
                  </div>
                </div>

                <div className="page-table-container w-100 ">
                  <table className="table text-nowrap">
                    <thead className="table-primary">
                      <tr>
                        <th scope="col">Microchip Number</th>
                        <th scope="col">Breeder Name</th>
                        <th scope="col">Breeder Email	</th>
                        <th scope="col">Breeder Phone	</th>
                        <th scope="col">Date	</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentmicrochips.map((microchips, index) => (
                        <tr key={index}>
                              <td>{ microchips.microchip_number}</td>
                          <td>{microchips.breeder_name}</td>
                          <td>{microchips.breeder_email}</td>
                          <td>{microchips.breeder_phone}</td>
                  

                          <td>{microchips.date}
                          </td>

                    
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Component */}
                <div className="mb-3 footer-paginator">
                  <PaginationComponent
                    currentPage={currentPage}
                    totalItems={filteredmicrochips.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            </div>
          </div>

          <ToastContainer
            position="top-right"
            autoClose={1000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
          />
        </div>
      </div>
    </CommonLayout>
  );
}
