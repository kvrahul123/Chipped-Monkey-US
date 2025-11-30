"use client";
import { useState, useEffect } from "react";
const appUrl = process.env.NEXT_PUBLIC_APP_URL;
interface Transaction {
  transaction_id: string;
  requested_amount?: string;
  details?: string;
  method?: string;
  status: string;
}

export default function TransactionList({ transactions = [] }: { transactions: Transaction[] }) {

  return (
    <div className="wallet-table-inner-container">
    <ul>
  {transactions.length === 0 ? (
    <p className="text-center">No transactions found.</p>
  ) : (
    transactions?.map((tx, index) => (
      <li key={index}>
        {/* Transaction ID */}
        <div className="wallet-table-inner-content">
          <h3>Transaction ID</h3>
          <span className="wallet-table-transaction_id">
            #{tx.transaction_id}
          </span>
        </div>

        {/* Requested Amount */}
        <div className="wallet-table-inner-content">
          <h3>Requested Amount</h3>
          <span className="wallet-table-transaction_amount">
            £{tx.requested_amount || "0.00"}
          </span>
        </div>

        {/* Sent Amount */}
        <div className="wallet-table-inner-content">
          <h3>Sent Amount</h3>
          <span className="wallet-table-transaction_amount">
            £{tx?.paid_amount || "0.00"}
          </span>
        </div>

        {/* Details */}
        <div className="wallet-table-inner-content">
          <h3>Details</h3>

          {tx.details ? (
            <span>
              Amount: £{tx.details.amount} | Message: {tx.details.message} |
              Status: {tx.details.status} | Date: {tx.details.date}
            </span>
          ) : (
            <span>Wallet added through bank</span>
          )}
        </div>

        {/* Method */}
        <div className="wallet-table-inner-content">
          <h3>Method</h3>
          <span className="wallet-table-transaction_status">
            {tx.method || "Wallet"}
          </span>
        </div>

        {/* Status */}
        <div className="wallet-table-inner-content">
          <h3>Status</h3>
          <span
            className={`wallet-table-transaction_status transaction_status ${tx.status}`}
          >
            {tx.status}
          </span>
        </div>

        {/* View Button */}
        <div className="wallet-table-inner-content">
          <button className="wallet_btn wallet_table">
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
