import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useToast } from "../utility/ToastProvider";

ChartJS.register(ArcElement, Tooltip, Legend);

const Calculator = () => {
  const [form, setForm] = useState({
    weight: "",
    materialType: "",
    transportDistance: "",
    transportMethod: "",
    packagingWeight: "",
  });

  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [carbonChartData, setCarbonChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/carbon-calculator`, {
        weight: parseFloat(form.weight),
        materialType: form.materialType,
        transportDistance: parseFloat(form.transportDistance),
        transportMethod: form.transportMethod,
        packagingWeight: parseFloat(form.packagingWeight)
      });
      if (res.status === 200) {
        const data = res.data.data;
        showToast(res.data.message, "success");
        setResults({
          manufacturing: data.breakdown.manufacturing,
          transport: data.breakdown.transport,
          packaging: data.breakdown.packaging,
          total: data.totalCarbon
        });
        setCarbonChartData({
          labels: ["Manufacturing", "Transport", "Packaging"],
          datasets: [
            {
              data: [data.breakdown.manufacturing, data.breakdown.transport, data.breakdown.packaging],
              backgroundColor: ["#3B82F6", "#10B981", "#F59E0B"],
              borderWidth: 1,
            },
          ],
        });
        fetchHistory();
      }

    } catch (err) {
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch calculation history from backend
  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/carbon-calculator/history`);
      setHistory(res.data.data || []);
    } catch (err) {
      setHistory([]);
    }
  };

  // Clear calculation history
  const handleClearHistory = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/carbon-calculator/history-clear`);
      showToast("History cleared", "success");
      fetchHistory();
    } catch (err) {
      showToast("Failed to clear history", "error");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);



  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-4xl font-bold mb-4">Carbon Calculator</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-surface rounded-lg shadow-sm border border-card-border p-4">
          <h3 className="text-xl font-semibold mb-4 pb-4 border-b border-card-border">Calculate Carbon Footprint</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                step="0.1"
                required
                value={form.weight}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-md text-sm bg-surface placeholder:text-sm focus:outline-none focus:ring focus:ring-focus-ring focus:border-primary"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Material Type</label>
              <select
                name="materialType"
                required
                value={form.materialType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-md text-sm bg-surface placeholder:text-sm focus:outline-none focus:ring focus:ring-focus-ring focus:border-primary"
              >
                <option value="">Select material</option>
                <option value="glass">Glass</option>
                <option value="plastic">Plastic</option>
                <option value="metal">Metal</option>
                <option value="paper">Paper</option>
                <option value="organic">Organic</option>
                <option value="textile">Textile</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Transport Distance (km)</label>
              <input
                type="number"
                name="transportDistance"
                required
                value={form.transportDistance}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-md text-sm bg-surface placeholder:text-sm focus:outline-none focus:ring focus:ring-focus-ring focus:border-primary"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Transport Method</label>
              <select
                name="transportMethod"
                required
                value={form.transportMethod}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-md text-sm bg-surface placeholder:text-sm focus:outline-none focus:ring focus:ring-focus-ring focus:border-primary"
              >
                <option value="">Select method</option>
                <option value="air">Air</option>
                <option value="sea">Sea</option>
                <option value="road">Road</option>
                <option value="rail">Rail</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Packaging Weight (kg)</label>
              <input
                type="number"
                name="packagingWeight"
                step="0.1"
                required
                value={form.packagingWeight}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-md text-sm bg-surface placeholder:text-sm focus:outline-none focus:ring focus:ring-focus-ring focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="w-full mt-3 px-4 py-2 bg-primary text-btn-primary-text rounded-md text-sm font-medium"
              disabled={loading}
            >
              {loading ? "Calculating..." : "Calculate"}
            </button>
          </form>
        </div>
        {/* Results */}
        <div className="bg-surface rounded-lg shadow-sm border border-card-border p-4">
          <h3 className="text-xl font-semibold mb-4 pb-4 border-b border-card-border">Results</h3>
          {results ? (
            <div className="space-y-3 text-md">
              <div className="flex justify-between border-b border-card-border pb-2">
                <span className="text-text-secondary">Manufacturing:</span>
                <span className="font-medium">{results.manufacturing} kg CO₂</span>
              </div>
              <div className="flex justify-between border-b border-card-border pb-2">
                <span className="text-text-secondary">Transport:</span>
                <span className="font-medium">{results.transport} kg CO₂</span>
              </div>
              <div className="flex justify-between border-b border-card-border pb-2">
                <span className="text-text-secondary">Packaging:</span>
                <span className="font-medium">{results.packaging} kg CO₂</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Carbon Footprint:</span>
                <span>{results.total} kg CO₂</span>
              </div>
              {carbonChartData && (
                <div className="mt-6 bg-surface rounded-lg shadow-sm border border-card-border p-6">
                  <h3 className="font-semibold text-xl mb-4 pb-4 border-b border-card-border">
                    Carbon Footprint Breakdown
                  </h3>
                  <div className="w-full max-w-xs mx-auto">
                    <Pie data={carbonChartData} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-text-secondary">Enter values to calculate carbon footprint.</p>
          )}
        </div>
      </div>
      {/* History */}
      <div className="mt-8 bg-surface rounded-lg shadow-sm border border-card-border p-4">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-card-border">
          <h3 className="text-xl font-semibold">Calculation History</h3>
          <button
            className="px-3 py-1 bg-error text-white rounded text-sm font-medium hover:bg-error/80"
            onClick={handleClearHistory}
            disabled={history.length === 0}
          >
            Clear History
          </button>
        </div>
        {history.length > 0 ? (
          history.map((item, index) => (
            <div
              key={index}
              className="p-3 bg-secondary rounded text-md space-y-1 mb-2"
            >
              <div className="flex justify-between">
                <span className="text-text-secondary">{item.date ? new Date(item.date).toLocaleString() : ""}</span>
                <span className="text-primary font-semibold">{item.totalCarbon || item.total} kg CO₂</span>
              </div>
              <div className="text-text-secondary">Manufacturing {item.breakdown?.manufacturing} | Transport {item.breakdown?.transport} | Packaging {item.breakdown?.packaging}</div>
            </div>
          ))
        ) : (
          <p className="text-text-secondary">No history yet.</p>
        )}
      </div>
    </div>
  );
};

export default Calculator;
