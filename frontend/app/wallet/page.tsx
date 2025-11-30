"use client";
import { useEffect, useState } from "react";
import CommonLayout from "../frontend/layouts/CommonLayouts";
import TransferRequestForm from "./TransferRequestForm";
import { getLocalStorageItem } from "../common/LocalStorage";
import { useRouter } from "next/navigation";
import { createRoot } from "react-dom/client"; // ✅ React 18 way
import TransactionList from "./TransactionList";
import RegisteredMicrochipList from "./RegisteredMicrochipList";
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export default function Wallet() {
  const router = useRouter();
  const [amount, setAmount] = useState(0);
  const [activeType, setActiveType] = useState<string | null>(
    "transfer_request"
  );
  let Authtoken = getLocalStorageItem("token");

  const [token, setToken] = useState<string | null>(null);
  const toggleWallet = (type: string) => {
    setActiveType(type);
  };
  useEffect(() => {
    if (!Authtoken) {
      router.push("/user-login/pet_owner");
      return;
    }
    setToken(Authtoken);
  }, [Authtoken]);
  
  useEffect(() => {
        fetchAmount();
  },[token])

  const fetchAmount = async() => {
    try {
      const response = await fetch(`${appUrl}frontend/wallet/amount`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setAmount(data.data?.totalAmount);
 
      
    } catch (error) {
      console.error("Error fetching fetch maount:", error);
    }
  }


  async function handleClick() {
    try {
      const response = await fetch(`${appUrl}frontend/transaction/list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      // directly call TransactionList with fetched data
   const container = document.getElementById("transactions-container");
      if (container) {
        // clear old render if exists
        container.innerHTML = "";

        const root = createRoot(container);
        root.render(<TransactionList transactions={data.data} />);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }




  async function handleRegisteredClick() {
    try {
      const response = await fetch(`${appUrl}frontend/registered_microchip/list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      // directly call TransactionList with fetched data
   const container = document.getElementById("registered_microchip-container");
      if (container) {
        // clear old render if exists
        container.innerHTML = "";

        const root = createRoot(container);
        root.render(<RegisteredMicrochipList registered_microchip={data.data} />);
      }
    } catch (error) {
      console.error("Error fetching registered microchip:", error);
    }
  }



  return (
    <CommonLayout>
      {token !== null && (token !== "") & (token != undefined) && (
        <div className="main-page-container">
          <div className="payment_main_container">
            <div className="row">
              <div className="col-12 col-md-2">
                <div className="payment_inner_container">
                  <ul>
                    <li>
                      <h3 className="wallet_amount">£{amount}</h3>
                      <p className="wallet_amount_title">Wallet Balance</p>
                    </li>
                    <li>
                      <button
                        className={`wallet_btn toggle_service ${
                          activeType === "transfer_request" ? "active" : ""
                        }`}
                        data-type="transfer_request"
                        onClick={() => toggleWallet("transfer_request")}>
                        Transfer Request
                      </button>
                    </li>
                    <li>
                      <button
                        className={`wallet_btn toggle_service ${
                          activeType === "transaction_history" ? "active" : ""
                        }`}
                        data-type="transaction_history"
                        onClick={() => {
                          toggleWallet("transaction_history"); 
                          handleClick(); 
                        }}>
                        Transaction History
                      </button>
                    </li>
                    <li>
                      <button
                        className={`wallet_btn toggle_service ${
                          activeType === "transaction_microchip" ? "active" : ""
                        }`}
                        data-type="transaction_microchip"
                        onClick={() => {
                          toggleWallet("transaction_microchip");
                          handleRegisteredClick();
                        }}>
                        Registered Microchip
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-12 col-md-10">
                <div
                  className={`wallet-table-container ${
                    activeType === "transfer_request" ? "active" : ""
                  }`}
                  data-type="transfer_request">
                  <div className="wallet-table-title">
                    <h3>Transfer Request</h3>
                  </div>
                  <TransferRequestForm token={token} />
                </div>

                <div
                  className={`wallet-table-container ${
                    activeType === "transaction_history" ? "active" : ""
                  }`}
                  data-type="transaction_history">
                  <div className="wallet-table-title">
                    <h3>Transaction History</h3>
                  </div>
                  <div id="transactions-container"></div>
                </div>

                <div
                  className={`wallet-table-container ${
                    activeType === "transaction_microchip" ? "active" : ""
                  }`}
                  data-type="transaction_microchip">
                  <div className="wallet-table-title">
                    <h3>Registered Microchip</h3>
                  </div>
                  <div id="registered_microchip-container"></div>
             
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </CommonLayout>
  );
}
