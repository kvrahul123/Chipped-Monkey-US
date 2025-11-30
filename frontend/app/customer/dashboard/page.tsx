// app/dashboard/page.tsx
"use client";
import { getLocalStorageItem } from '@/app/common/LocalStorage';
import CommonLayout from '../layouts/CommonLayouts';
import { useEffect, useState } from 'react';

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export default function DashboardPage() {
    const token = getLocalStorageItem("token");

    const [counts, setCounts] = useState({
        userCount: 0,
        orderCount: 0,
        productsCount: 0,
        blogsCount: 0,
      microchipCount:0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${appUrl}dashboard/counts`,          {
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
                console.error('Failed to fetch data', error);
            }
        };

        fetchData();
    }, []);

    return (
        <CommonLayout>
            <div className='app-content'>
            <div className='container-fluid'>
                <div className='page-header-container'>
                    <div className='page-header-title'>
                        <h1>Dashboard</h1>
                    </div>
                </div>

                <div className='page-dashboard-cards w-100'>
                    <div className='row w-100'>
                        {/* <div className='col-md-6 col-sm-4 col-lg-3'>
                            <div className='page-dashboard-inner-cards'>
                                <div className='card-body'>
                                    <div className='page-dashboard-cards-title'>
                                        <span>Total Customer</span>
                                        <h4>{counts.userCount}</h4>
                                    </div>
                                    <div className='page-dashboard-cards-icons bg-blue'>
                                        <span className=''><i className="fa-solid fa-user"></i></span>
                                    </div>
                                </div>
                            </div>
                        </div> */}

                   
                   

                        <div className='col-md-6 col-sm-4 col-lg-3'>
                            <div className='page-dashboard-inner-cards'>
                                <div className='card-body'>
                                    <div className='page-dashboard-cards-title '>
                                        <span>Total Microchip</span>
                                        <h4>{counts.microchipCount}</h4>
                                    </div>
                                    <div className='page-dashboard-cards-icons bg-pink'>
                                        <span className=''><i className="fa-solid fa-shopping-bag"></i></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <div className='col-md-6 col-sm-4 col-lg-3'>
                            <div className='page-dashboard-inner-cards'>
                                <div className='card-body'>
                                    <div className='page-dashboard-cards-title'>
                                        <span>Total Blogs</span>
                                        <h4>{counts.blogsCount}</h4>
                                    </div>
                                    <div className='page-dashboard-cards-icons bg-orange'>
                                        <span className=''><i className="fa-solid fa-pencil-alt"></i></span>
                                    </div>
                                </div>
                            </div>
                        </div> */}

                    </div>
                </div>
                </div>
                </div>
        </CommonLayout>
    );
}
