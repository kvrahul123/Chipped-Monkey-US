// app/dashboard/page.tsx
"use client";
import { getLocalStorageItem } from "@/app/common/LocalStorage";
import CommonLayout from "../layouts/CommonLayouts";
import { useEffect, useState } from "react";
import Link from "next/link";
import Select from "react-select";
const appUrl = process.env.NEXT_PUBLIC_APP_URL;
const searchOptions = [
  { value: "all", label: "All" },
  { value: "pet_name", label: "Pet Name" },
  { value: "microchip_number", label: "Microchip Number" },
];

interface MicrochipOrder {
  id: number;
  microchip_number: string;
  pet_name: string;
  pet_keeper: string;
}

export default function DashboardPage() {
  const token = getLocalStorageItem("token");
  const [microchipsList, setMicrochipLists] = useState<MicrochipOrder[]>([]);
  const [filteredList, setFilteredList] = useState<MicrochipOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<{
    value: string;
    label: string;
  } | null>({
    value: "all",
    label: "All",
  });

  const [counts, setCounts] = useState({
    userCount: 0,
    orderCount: 0,
    productsCount: 0,
    blogsCount: 0,
    microchipCount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${appUrl}microchip/lists`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data && data.statusCode === 200) {
          setMicrochipLists(data.data);
          setFilteredList(data.data); // initially show all
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  // Filtering logic
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredList(microchipsList);
    } else {
      const lower = searchQuery.toLowerCase();
      let filtered = microchipsList;

      if (searchType?.value === "pet_name") {
        filtered = microchipsList.filter((chip) =>
          chip.pet_name.toLowerCase().includes(lower)
        );
      } else if (searchType?.value === "microchip_number") {
        filtered = microchipsList.filter((chip) =>
          chip.microchip_number.toString().includes(lower)
        );
      } else {
        // "all"
        filtered = microchipsList.filter(
          (chip) =>
            chip.pet_name.toLowerCase().includes(lower) ||
            chip.microchip_number.toString().includes(lower)
        );
      }

      setFilteredList(filtered);
    }
  }, [searchQuery, microchipsList, searchType]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${appUrl}dashboard/counts`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data && data.statusCode === 200) {
          setCounts(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <CommonLayout>
      <div className="app-content">
        <div className="container-fluid">
          <div className="page-header-container d-flex justify-content-between mb-3 flex-wrap">
            <div className="page-header-title">
              <h1>Dashboard</h1>
            </div>
            <div className="page-header-search d-flex">
              <Select
                className="page-header-search-dd"
                options={searchOptions}
                value={searchType}
                onChange={(selected) => setSearchType(selected)}
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control"
                placeholder="Search Microchip ..."
              />
              {/* Dropdown list */}
              {searchQuery && filteredList.length > 0 && (
                <ul className="list-group search-dropdown dashboard_search_lists">
                  {filteredList.slice(0, 10).map((chip) => (
                    <li key={chip.id} className="list-group-item p-2">
                      <Link
                        href={`/admin/microchip/view/${chip.microchip_number}`}
                        className=" d-flex align-items-center text-decoration-none">
                        {/* Pet Photo */}
                        <div className="search-pet-photo me-3">
                          <img
                            src={`${appUrl}uploads/${chip.photo}`}
                            alt={chip.pet_name}
                            className="rounded-circle"
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                          />
                        </div>

                        {/* Pet Info */}
                        <div className="search-pet-info">
                          <h6 className="mb-1">{chip.pet_name}</h6>
                          <p className="m-0" style={{ color: "#000" }}>
                            {chip.microchip_number}
                          </p>
                          <small className="text-muted">
                            Owner: {chip.pet_keeper}
                          </small>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="page-dashboard-cards w-100">
            <div className="row w-100">
              <div className="col-md-6 col-sm-4 col-lg-3">
                <div className="page-dashboard-inner-cards">
                  <Link href="/admin/users/pet_owners">
                    <div className="card-body">
                      <div className="page-dashboard-cards-title">
                        <span>Total Customer</span>
                        <h4>{counts.userCount}</h4>
                      </div>
                      <div className="page-dashboard-cards-icons bg-blue">
                        <span className="">
                          <i className="fa-solid fa-user"></i>
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="col-md-6 col-sm-4 col-lg-3">
                <div className="page-dashboard-inner-cards">
                  <Link href="/admin/microchip/orders">
                    <div className="card-body">
                      <div className="page-dashboard-cards-title">
                        <span>Total Order</span>
                        <h4>{counts.orderCount}</h4>
                      </div>
                      <div className="page-dashboard-cards-icons">
                        <span className="">
                          <i className="fa-solid fa-box"></i>
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="col-md-6 col-sm-4 col-lg-3">
                <div className="page-dashboard-inner-cards">
                  <Link href="/admin/microchip/list">
                    <div className="card-body">
                      <div className="page-dashboard-cards-title ">
                        <span>Total Microchip</span>
                        <h4>{counts.microchipCount}</h4>
                      </div>
                      <div className="page-dashboard-cards-icons bg-pink">
                        <span className="">
                          <i className="fa-solid fa-shopping-bag"></i>
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="col-md-6 col-sm-4 col-lg-3">
                <div className="page-dashboard-inner-cards">
                  <Link href="/admin/products/list">
                    <div className="card-body">
                      <div className="page-dashboard-cards-title ">
                        <span>Total Products</span>
                        <h4>{counts.productsCount}</h4>
                      </div>
                      <div className="page-dashboard-cards-icons bg-pink">
                        <span className="">
                          <i className="fa-solid fa-shopping-bag"></i>
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="col-md-6 col-sm-4 col-lg-3">
                <div className="page-dashboard-inner-cards">
                  <Link href="/admin/blogs/list">
                    <div className="card-body">
                      <div className="page-dashboard-cards-title">
                        <span>Total Blogs</span>
                        <h4>{counts.blogsCount}</h4>
                      </div>
                      <div className="page-dashboard-cards-icons bg-orange">
                        <span className="">
                          <i className="fa-solid fa-pencil-alt"></i>
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <div className="row w-100 mt-4">
              {/* Transfer Request */}
              <div className="col-md-6 col-sm-6 col-lg-3 mt-3">
                <Link href="/admin/transaction/request">
                  <div className="page-dashboard-action-cards bg-darkBlue">
                    <div className="page-dashboard-cards-icons">
                      <i className="fa-solid fa-right-left"></i>
                    </div>
                    <h5>Transfer Request</h5>
                  </div>
                </Link>
              </div>

              {/* Assign Microchip */}
              <div className="col-md-6 col-sm-6 col-lg-3 mt-3">
                <Link href="/admin/microchip/orders">
                  <div className="page-dashboard-action-cards bg-lightBlue">
                    <div className="page-dashboard-cards-icons">
                      <i className="fa-solid fa-microchip"></i>
                    </div>
                    <h5>Assign Microchip</h5>
                  </div>
                </Link>
              </div>

              {/* Free Registration */}
              <div className="col-md-6 col-sm-6 col-lg-3 mt-3">
                <Link href="/admin/microchip/create">
                  <div className="page-dashboard-action-cards bg-lightYellow">
                    <div
                      className="page-dashboard-cards-icons "
                      style={{ color: "#e7845b" }}>
                      <i className="fa-solid fa-tag"></i>
                    </div>
                    <h5 style={{ color: "#000" }}>Free Registration</h5>
                  </div>
                </Link>
              </div>

              {/* Implanted Microchip */}
              <div className="col-md-6 col-sm-6 col-lg-3 mt-3">
                <Link href="/admin/microchip/implanted">
                  <div className="page-dashboard-action-cards bg-softPurple">
                    <div
                      className="page-dashboard-cards-icons "
                      style={{ color: "#e7845b" }}>
                      <i className="fa-solid fa-microchip"></i>
                    </div>
                    <h5 style={{ color: "#000" }}>Implanted Microchip</h5>
                  </div>
                </Link>
              </div>

              {/* Create Account */}
              <div className="col-md-6 col-sm-6 col-lg-3 mt-3">
                <Link href="/admin/users/microchip_implanters">
                  <div className="page-dashboard-action-cards bg-lightGreen">
                    <div className="page-dashboard-cards-icons">
                      <i className="fa-solid fa-plus"></i>
                    </div>
                    <h5>Create Account</h5>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CommonLayout>
  );
}
