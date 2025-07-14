import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const metricIcons = ["📦", "📊", "⚠️", "🌱"];

const Dashboard = () => {
    const [metrics, setMetrics] = useState(null);
    const [wasteAlerts, setWasteAlerts] = useState([]);
    const [carbonChartData, setCarbonChartData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            setLoading(true);
            try {
                const [metricsRes, alertsRes, carbonRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_BACKEND_URL}/dashboard/metrics`),
                    axios.get(`${import.meta.env.VITE_BACKEND_URL}/dashboard/alerts`),
                    axios.get(`${import.meta.env.VITE_BACKEND_URL}/dashboard/carbon-breakdown`)
                ]);
                setMetrics(metricsRes.data.data);
                setWasteAlerts(alertsRes.data.data);
                setCarbonChartData({
                    labels: carbonRes.data.data.labels,
                    datasets: [
                        {
                            data: carbonRes.data.data.values,
                            backgroundColor: ["#34D399", "#FBBF24", "#EF4444", "#3B82F6", "#10B981", "#6366F1", "#F472B6"],
                            borderWidth: 1,
                        },
                    ],
                });
            } catch (err) {
                setMetrics(null);
                setWasteAlerts([]);
                setCarbonChartData(null);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    return (
        <main className="min-h-screen bg-background py-6">
            <div className="container mx-auto px-4">
                <h1 className="text-2xl md:text-4xl font-bold mb-4">Dashboard</h1>

                {/* Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {metrics ? [
                        { icon: metricIcons[0], label: "Total Products", value: metrics.totalProducts },
                        { icon: metricIcons[1], label: "Active Inventory", value: metrics.activeInventory },
                        { icon: metricIcons[2], label: "High Waste Risk Items", value: metrics.highWasteRisk },
                        { icon: metricIcons[3], label: "Total Carbon Footprint (kg CO₂)", value: metrics.totalCarbon },
                    ].map((metric, idx) => (
                        <div
                            key={idx}
                            className="flex items-center bg-surface p-4 gap-4 rounded-lg shadow-sm border border-card-border transition-transform duration-fast ease-standard hover:shadow-md hover:-translate-y-1"
                        >
                            <div className="text-2xl sm:text-3xl w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-secondary rounded-lg">
                                {metric.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl sm:text-2xl font-bold text-primary mb-1">{metric.value}</h3>
                                <p className="text-sm text-text-secondary font-medium leading-tight">{metric.label}</p>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-4 text-center py-8 text-text-secondary">Loading metrics...</div>
                    )}
                </div>

                {/* Grid: Waste Alerts and Carbon Chart */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Waste Risk Alerts */}
                    <div className="bg-surface rounded-lg shadow-sm border border-card-border">
                        <div className="border-b px-6 py-4 border-card-border">
                            <h3 className="font-semibold text-xl">Waste Risk Alerts</h3>
                        </div>
                        <div className="p-6">
                            {wasteAlerts.length > 0 ? wasteAlerts.map((alert, idx) => (
                                <div
                                    key={idx}
                                    className={`flex justify-between items-start p-4 rounded-base border-l-4 mb-3
                                        ${alert.wastePrediction <= 50 ? "border-success bg-success/10"
                                        : alert.wastePrediction > 50 && alert.wastePrediction < 85 ? "border-warning bg-warning/10"
                                        : "border-error bg-error/10"}
                                    `}
                                >
                                    <div>
                                        <h4 className="font-semibold text-sm mb-1">{alert.productName} - {alert.store}</h4>
                                        <p className="text-xs text-text-secondary">Waste probability: {alert.wastePrediction}% | Expires: {new Date(alert.expiryDate).toLocaleDateString()} | Quantity: {alert.quantity}</p>
                                    </div>

                                    {/* Recommendation Badge */}
                                    {alert.recommendation && (
                                        <span
                                            className={`ml-4 px-3 py-2 rounded-full text-xs font-semibold capitalize whitespace-nowrap ${alert.recommendation === "urgent action"
                                                ? "bg-error/30 text-error"
                                                : "bg-warning/30 text-warning"
                                                }`}
                                        >
                                            {alert.recommendation}
                                        </span>
                                    )}
                                </div>
                            )) : (
                                <div className="text-center text-text-secondary">No waste risk alerts.</div>
                            )}
                        </div>
                    </div>

                    {/* Carbon Footprint Chart */}
                    <div className="bg-surface rounded-lg shadow-sm border border-card-border p-6">
                        <h3 className="font-semibold text-xl mb-4 pb-4 border-b border-card-border">Carbon Footprint Breakdown</h3>
                        <div className="w-full max-w-xs mx-auto">
                            {carbonChartData ? <Pie data={carbonChartData} /> : <div className="text-center text-text-secondary">Loading chart...</div>}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );

}
export default Dashboard;
