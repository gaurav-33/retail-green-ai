import React from "react";

const ProductModal = ({ isEdit, isOpen, onClose, onSave, formData, setFormData, categoryOptions, packagingOptions, unitOptions, countryOptions, regionOptions, storeOptions }) => {
    // All options are now passed as props from parent
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[1000] bg-black/50 flex items-center justify-center">
            <div className="bg-surface rounded-lg w-[90%] max-w-[500px] max-h-[90vh] overflow-y-auto shadow-lg">
                {/* Header */}
                <div className="flex justify-between items-center px-5 py-4 border-b border-border">
                    <h3 className="text-lg font-semibold text-text">{isEdit ? "Edit Product" : "Add Product"}</h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 text-xl text-text-secondary hover:bg-secondary rounded-sm transition"
                    >
                        ×
                    </button>
                </div>
                {/* Body */}
                <div className="px-5 py-4 space-y-4">
                    <form id="product-form" onSubmit={onSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-text">Product Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background text-text focus:outline-none focus:ring focus:ring-focus-ring focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-text">Category</label>
                            <select
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background text-text focus:outline-none focus:ring focus:ring-focus-ring focus:border-primary"
                            >
                                <option value="">Select category</option>
                                {categoryOptions.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-text">Packaging</label>
                            <select
                                required
                                value={formData.packaging}
                                onChange={(e) => setFormData({ ...formData, packaging: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background text-text focus:outline-none focus:ring focus:ring-focus-ring focus:border-primary"
                            >
                                {packagingOptions.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-text">Unit</label>
                            <select
                                required
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background text-text focus:outline-none focus:ring focus:ring-focus-ring focus:border-primary"
                            >
                                {unitOptions.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-text">Country</label>
                            <select
                                required
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background text-text focus:outline-none focus:ring focus:ring-focus-ring focus:border-primary"
                            >
                                {countryOptions.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-text">Region</label>
                            <select
                                required
                                value={formData.region}
                                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background text-text focus:outline-none focus:ring focus:ring-focus-ring focus:border-primary"
                            >
                                {regionOptions.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                        {/* Store Dropdown for Inventory */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-text">Store (for Inventory)</label>
                            <select
                                value={formData.store}
                                onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background text-text focus:outline-none focus:ring focus:ring-focus-ring focus:border-primary"
                            >
                                <option value="">Select store</option>
                                {storeOptions && storeOptions.map((store) => (
                                    <option key={store} value={store}>{store}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-text">Price ($)</label>
                            <input
                                type="number"
                                step="1.0"
                                required
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background text-text focus:outline-none focus:ring focus:ring-focus-ring focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-text">Shelf Life (days)</label>
                            <input
                                type="number"
                                required
                                step="1"
                                value={formData.shelfLife}
                                onChange={(e) => setFormData({ ...formData, shelfLife: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background text-text focus:outline-none focus:ring focus:ring-focus-ring focus:border-primary"
                            />
                        </div>
                        {/* <div>
                            <label className="block text-sm font-medium mb-1 text-text">
                                Carbon Footprint (kg CO₂)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={formData.carbonFootprint}
                                onChange={(e) => setFormData({ ...formData, carbonFootprint: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background text-text focus:outline-none focus:ring focus:ring-focus-ring focus:border-primary"
                            />
                        </div> */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-text">Inventory Level</label>
                            <input
                                type="number"
                                value={formData.inventoryLevel}
                                onChange={(e) => setFormData({ ...formData, inventoryLevel: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background text-text focus:outline-none focus:ring focus:ring-focus-ring focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-text">Units Sold</label>
                            <input
                                type="number"
                                value={formData.unitsSold}
                                onChange={(e) => setFormData({ ...formData, unitsSold: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background text-text focus:outline-none focus:ring focus:ring-focus-ring focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-text">Demand Forecast</label>
                            <input
                                type="number"
                                value={formData.demandForecast}
                                onChange={(e) => setFormData({ ...formData, demandForecast: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background text-text focus:outline-none focus:ring focus:ring-focus-ring focus:border-primary"
                            />
                        </div>
                    </form>
                </div>
                {/* Footer */}
                <div className="flex justify-end gap-3 px-5 py-4 border-t border-border">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-md bg-secondary text-text font-medium text-sm hover:bg-secondary/70"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="product-form"
                        className="px-4 py-2 rounded-md bg-primary text-btn-primary-text font-medium text-sm hover:bg-primary/90"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductModal;
