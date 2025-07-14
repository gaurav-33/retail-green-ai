import React, { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "../utility/ToastProvider";

const Inventory = () => {
  const storeDropdownRef = React.useRef(null);
  const statusDropdownRef = React.useRef(null);
  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (storeDropdownRef.current && !storeDropdownRef.current.contains(event.target)) {
        setShowStoreDropdown(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setShowStatusDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [storeFilter, setStoreFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [storeOptions, setStoreOptions] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const {showToast} = useToast();

  

  // Fetch inventory from backend
  const fetchInventory = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit
      };
      if (storeFilter) params.store = storeFilter;
      if (statusFilter) params.status = statusFilter;
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/inventory`, { params });
      const data = res.data.data;
      setInventoryData(data.items || []);
      setTotalPages(data.totalPages || 1);
      // Collect unique store names for filter dropdown
      const stores = Array.from(new Set((data.items || []).map(item => item.store)));
      // const resp = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/inventory/stores`);
      // const stores = resp.data.data.stores || [];
      setStoreOptions(stores);
      showToast(res.data.message, "success")
    } catch (err) {
      showToast("Failed to fetch inventory", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [storeFilter, statusFilter, page, limit]);

  const getStatusColor = (status) => {
    switch (status) {
      case "expired":
        return "bg-error/20 text-error";
      case "fresh":
        return "bg-success/20 text-success";
      default:
        return "bg-warning/20 text-warning";
    }
  };

  const getDotColor = (status) => {
    switch (status) {
      case "expired":
        return "bg-error";
      case "fresh":
        return "bg-success";
      default:
        return "bg-warning";
    }
  };
  const getRecommendationStyle = (rec) => {
    switch (rec) {
      case "monitor":
        return "bg-primary/20 text-primary";
      case "price reduction":
        return "bg-warning/20 text-warning";
      default:
        return "bg-error/20 text-error";
    }
  };

  return (
    <div className="container max-w-screen-xl mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 my-6">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">Inventory Management</h1>
        <div className="flex flex-wrap items-center gap-3">
          {/* Store Dropdown */}
          <div className="relative" ref={storeDropdownRef}>
            <button
              type="button"
              className="px-3 py-2 border border-border rounded-md text-sm bg-background focus:outline-none focus:ring focus:ring-focus-ring focus:border-primary w-40 text-left"
              onClick={() => setShowStoreDropdown((prev) => !prev)}
            >
              {storeFilter ? storeFilter : "All Stores"}
            </button>
            {showStoreDropdown && (
              <div className="absolute z-10 mt-1 w-40 bg-surface border border-border rounded-md shadow-lg">
                <div
                  className={`px-3 py-2 cursor-pointer ${storeFilter === "" ? "bg-primary/60" : ""}`}
                  onClick={() => { setStoreFilter(""); setShowStoreDropdown(false); }}
                >
                  All Stores
                </div>
                {storeOptions.map((store) => (
                  <div
                    key={store}
                    className={`px-3 py-1 cursor-pointer text-text hover:bg-primary/70 hover:rounded-sm ${storeFilter === store ? "bg-primary/10" : ""}`}
                    onClick={() => { setStoreFilter(store); setShowStoreDropdown(false); }}
                  >
                    {store}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Status Dropdown */}
          <div className="relative" ref={statusDropdownRef}>
            <button
              type="button"
              className="px-3 py-2 border border-border rounded-md text-sm bg-background focus:outline-none focus:ring focus:ring-focus-ring focus:border-primary w-40 text-left"
              onClick={() => setShowStatusDropdown((prev) => !prev)}
            >
              {statusFilter ? statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1) : "All Status"}
            </button>
            {showStatusDropdown && (
              <div className="absolute z-10 mt-1 w-40 bg-surface border border-border rounded-md shadow-lg">
                <div
                  className={`px-3 py-2 cursor-pointer ${statusFilter === "" ? "bg-primary/60" : ""}`}
                  onClick={() => { setStatusFilter(""); setShowStatusDropdown(false); }}
                >
                  All Status
                </div>
                {["fresh", "expired", "near expiry"].map((status) => (
                  <div
                    key={status}
                    className={`px-3 py-1 cursor-pointer text-text hover:bg-primary/70 hover:rounded-sm ${statusFilter === status ? "bg-primary/10" : ""}`}
                    onClick={() => { setStatusFilter(status); setShowStatusDropdown(false); }}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-lg shadow-sm border border-card-border">
        <div className="p-4 overflow-auto">
          {loading ? (
            <div className="text-center py-4 text-text-secondary">Loading inventory...</div>
          ) : (
            <>
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="text-text-secondary border-b border-card-border-inner bg-secondary">
                    <th className="py-2 px-3">Product</th>
                    <th className="py-2 px-3">Store</th>
                    <th className="py-2 px-3">Quantity</th>
                    <th className="py-2 px-3">Expiry Date</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Waste Prediction</th>
                    <th className="py-2 px-3">Recommendation</th>
                    <th className="py-2 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryData.length > 0 ? (
                    inventoryData.map((item, index) => (
                      <tr
                        key={item._id || index}
                        className="border-b border-card-border hover:bg-secondary"
                      >
                        <td className="px-3 py-2">{item.product?.name || item.product}</td>
                        <td className="px-3 py-2">{item.store}</td>
                        <td className="px-3 py-2">{item.quantity}</td>
                        <td className="px-3 py-2">{new Date(item.expiryDate).toLocaleDateString()} ({Math.floor((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))}d)</td>
                        <td className="px-3 py-2">
                          <div
                            className={`px-2 py-1 rounded-md text-xs font-medium inline-flex items-center gap-2 ${getStatusColor(
                              item.status
                            )}`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${getDotColor(
                                item.status
                              )}`}
                            ></span>
                            {item.status}
                          </div>
                        </td>
                        <td className="px-3 py-2">{item.wastePrediction ? `${item.wastePrediction}%` : "-"}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-1 rounded-md text-xs ${getRecommendationStyle(item.recommendation)}`}>
                            {item.recommendation ? item.recommendation.toUpperCase() : "-"}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <button className="text-primary hover:underline text-sm font-medium">
                            Update
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4 text-text-secondary">
                        No inventory found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* Pagination Controls */}
              <div className="flex justify-center items-center gap-2 mt-4">
                <button
                  className="px-3 py-1 border rounded bg-background text-primary disabled:opacity-50"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </button>
                <span className="px-2">Page {page} of {totalPages}</span>
                <button
                  className="px-3 py-1 border rounded bg-background text-primary disabled:opacity-50"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
