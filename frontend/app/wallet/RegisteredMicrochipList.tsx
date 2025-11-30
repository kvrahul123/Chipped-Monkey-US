"use client";
import { useState, useEffect } from "react";
const appUrl = process.env.NEXT_PUBLIC_APP_URL;
interface Transaction {
  order_id: string;
  microchip_count?: string;
  date?: string;
  status: string;
}

export default function RegisteredMicrochipList({
  registered_microchip = [],
}: {
  registered_microchip: Transaction[];
}) {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  return (
    <div className="wallet-table-inner-container">
      {showModal && (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Microchip List</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}>
                </button>
              </div>
              <div className="modal-body">
                {selectedOrder?.assigned &&
                selectedOrder.assigned.length > 0 ? (
                  <ul className="assigned-numbers-list">
                    {selectedOrder.assigned.map((chip: any) => (
                      <li key={chip.id}>{chip.microchip_number}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No microchips assigned</p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ul>
        {registered_microchip.length === 0 ? (
          <p className="text-center">No Mircohip Order found.</p>
        ) : (
          registered_microchip.map((tx, index) => (
            <li key={index}>
              <div className="wallet-table-inner-content">
                <h3>Order ID</h3>
                <span className="wallet-table-transaction_id">
                  #{tx.order_id}
                </span>
              </div>

              <div className="wallet-table-inner-content">
                <h3>Microchip Count</h3>
                <span>{tx.microchip_count}</span>
              </div>

              <div className="wallet-table-inner-content">
                <h3>Date</h3>
                <span>{tx.date}</span>
              </div>

              <div className="wallet-table-inner-content">
                <h3>Status</h3>
                <span
                  className={`wallet-table-transaction_status transaction_status ${tx.status}`}>
                  {tx.status}
                </span>
              </div>

              <div className="wallet-table-inner-content">
                <button
                  className="wallet_btn wallet_table"
                  onClick={() => handleViewDetails(tx)}>
                  View Details
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
