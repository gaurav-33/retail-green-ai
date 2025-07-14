import React, { useEffect, useState, useRef} from "react";
import ProductModal from "../components/ProductModal"
import { useToast } from "../utility/ToastProvider";
import axios from "axios"

const Products = () => {
    // Pagination state
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    // Fetch products from backend
    const [loading, setLoading] = useState(false);

    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [packagingOptions, setPackagingOptions] = useState([]);
    const [unitOptions, setUnitOptions] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [regionOptions, setRegionOptions] = useState([]);
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [storeOptions, setStoreOptions] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        shelfLife: "",
        carbonFootprint: "",
        packaging: "Box",
        unit: "kg",
        country: "India",
        region: "Delhi",
        inventoryLevel: "",
        unitsSold: "",
        demandForecast: "",
        store: ""
    });
    const { showToast } = useToast();

    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowCategoryDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/products`, {
                params: {
                    page,
                    limit,
                    category,
                    search
                }
            });
            const data = res.data.data;
            setProducts(data.products || []);
            setTotalPages(data.totalPages || 1);
            showToast(res.data.message || "Products fetched successfully", "success");
        } catch (err) {
            showToast("Failed to fetch products", "error");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategory = async () => {
        setLoading(true);
        try {
            const [catRes, packRes, unitRes, countryRes, regionRes, storeRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/products/categories`),
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/products/packings`),
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/products/units`),
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/products/countries`),
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/products/regions`),
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/inventory/stores`)
            ]);
            setCategoryOptions(catRes.data.data.categories || []);
            setPackagingOptions(packRes.data.data.packagings || []);
            setUnitOptions(unitRes.data.data.units || []);
            setCountryOptions(countryRes.data.data.countries || []);
            setRegionOptions(regionRes.data.data.regions || []);
            setStoreOptions(storeRes.data.data.stores || []);
        } catch (err) {
            showToast("Failed to fetch options", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategory();
    }, [showToast]);

    // Refetch products when search, category, page, or limit changes
    useEffect(() => {
        fetchProducts();
    }, [search, category, page, limit]);

    const [editProductId, setEditProductId] = useState(null);
    const handleOpenModal = (product = null) => {
        if (product) {
            setFormData({
                name: product.name,
                category: product.category,
                price: product.price,
                shelfLife: product.shelfLife,
                carbonFootprint: product.carbonFootprint,
                packaging: product.packaging,
                unit: product.unit,
                country: product.country,
                region: product.region,
                inventoryLevel: product.inventoryLevel,
                unitsSold: product.unitsSold,
                demandForecast: product.demandForecast,
                store: product.store || storeOptions[0] || ""
            });
            setEditProductId(product._id);
        } else {
            setFormData({
                name: "",
                category: "",
                price: "",
                shelfLife: "",
                carbonFootprint: "",
                packaging: packagingOptions[0] || "Box",
                unit: unitOptions[0] || "kg",
                country: countryOptions[0] || "India",
                region: regionOptions[0] || "Delhi",
                inventoryLevel: "",
                unitsSold: "",
                demandForecast: "",
                store: storeOptions[0] || ""
            });
            setEditProductId(null);
        }
        setIsModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        const saveProduct = async () => {
            try {
                let productId = editProductId;
                if (editProductId) {
                    // Edit mode
                    await axios.put(`${import.meta.env.VITE_BACKEND_URL}/products/${editProductId}`, formData);
                    showToast("Product updated successfully!", "success");
                } else {
                    // Add mode
                    const prodRes = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/products`, formData);
                    showToast("Product added successfully!", "success");
                    productId = prodRes.data.data._id;
                }
                // Add inventory if store is selected and inventoryLevel is provided
                if (formData.store && formData.inventoryLevel) {
                    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/inventory`, {
                        product: productId,
                        store: formData.store,
                        quantity: formData.inventoryLevel,
                        expiryDate: new Date(Date.now() + (formData.shelfLife * 24 * 60 * 60 * 1000)),
                        status: "fresh"
                    });
                    showToast("Inventory added!", "success");
                }
                setIsModalOpen(false);
                fetchProducts();
            } catch (err) {
                showToast("Failed to save product or inventory", "error");
            }
        };
        saveProduct();
    };

    const handleDelete = async (product) => {
        if (!product) {
            showToast("No product selected for deletion", "error");
            return;
        }
        const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/products/${product._id}`);
        const resp = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/inventory/${product._id}`);
        if (res.status === 200 && resp.status === 200) {
            showToast(res.data.message || "Deleted successfully!", "success");
            setProducts((prev) => prev.filter((p) => p._id !== product._id));
        } else {
            showToast("Fail to delete product!", "error")

        }
    };

    return (
        <div>
            {loading && (
                <div className="text-center py-4 text-text-secondary">Loading products...</div>
            )}
            <div className="container max-w-screen-xl mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 my-6">
                    <h1 className="text-2xl md:text-4xl font-bold mb-4">Products Management</h1>
                    <div className="flex flex-wrap items-center gap-3">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search products..."
                            className="px-3 py-2 border border-border rounded-md text-sm bg-background placeholder:text-sm focus:outline-none focus:ring focus:ring-focus-ring focus:border-primary"
                        />

                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                className="px-3 py-2 border border-border rounded-md text-sm bg-background focus:outline-none focus:ring focus:ring-focus-ring focus:border-primary w-40 text-left"
                                onClick={() => setShowCategoryDropdown((prev) => !prev)}
                            >
                                {category ? category.toUpperCase() : "All Categories"}
                            </button>
                            {showCategoryDropdown && (
                                <div className="absolute z-10 mt-1 w-40 bg-surface border border-border rounded-md shadow-lg">
                                    <div
                                        className={`px-3 py-2 cursor-pointer  ${category === "" ? "bg-primary/60" : ""}`}
                                        onClick={() => { setCategory(""); setShowCategoryDropdown(false); }}
                                    >
                                        All Categories
                                    </div>
                                    {categoryOptions.map((cat) => (
                                        <div
                                            key={cat}
                                            className={`px-3 py-1 cursor-pointer text-text hover:bg-primary/70 hover:rounded-sm ${category === cat ? "bg-primary/10" : ""}`}
                                            onClick={() => { setCategory(cat); setShowCategoryDropdown(false); }}
                                        >
                                            {cat.toUpperCase()}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            className="px-4 py-2 bg-primary text-btn-primary-text rounded-md text-sm font-medium"
                            onClick={() => handleOpenModal()}
                        >
                            Add Product
                        </button>
                    </div>
                </div>

                <div className="bg-surface rounded-lg shadow-sm border border-card-border">
                    <div className="p-4 overflow-auto">
                        <div className="w-full">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead>
                                    <tr className="text-text-secondary border-b border-card-border-inner bg-secondary">
                                        <th className="py-2 px-3">Product ID</th>
                                        <th className="py-2 px-3">Name</th>
                                        <th className="py-2 px-3">Category</th>
                                        <th className="py-2 px-3">Price</th>
                                        <th className="py-2 px-3">Shelf Life</th>
                                        <th className="py-2 px-3">Carbon Footprint</th>
                                        <th className="py-2 px-3">Waste Risk</th>
                                        <th className="py-2 px-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.length > 0 ? (
                                        products.map((product) => (
                                            <tr key={product._id} className="border-b border-card-border hover:bg-secondary">
                                                <td className="px-3 py-2 overflow-ellipsis">{product._id}</td>
                                                <td className="px-3 py-2">{product.name}</td>
                                                <td className="px-3 py-2">{product.category}</td>
                                                <td className="px-3 py-2">${product.price}</td>
                                                <td className="px-3 py-2">{product.shelfLife} days</td>
                                                <td className="px-3 py-2">{product.carbonFootprint} kg CO₂</td>
                                                <td className="px-3 py-2">
                                                    <span
                                                        className={`
      px-2 py-1 rounded-md text-xs font-medium inline-flex items-center gap-2
      ${product.wasteProbability <= 50 ? "bg-primary/20 text-primary" : ""}
      ${product.wasteProbability > 50 && product.wasteProbability < 85 ? "bg-warning/20 text-warning" : ""}
      ${product.wasteProbability >= 85 ? "bg-error/20 text-error" : ""}
    `}>
                                                        <span
                                                            className={`
        w-2 h-2 rounded-full inline-block
        ${product.wasteProbability <= 50 ? "bg-primary" : ""}
        ${product.wasteProbability > 50 && product.wasteProbability < 85 ? "bg-warning" : ""}
        ${product.wasteProbability >= 85 ? "bg-error" : ""}
      `}
                                                        ></span>
                                                        {product.wasteProbability >= 85 ? "High" : product.wasteProbability > 50 ? "Medium" : "Low"}
                                                    </span>
                                                </td>

                                                <td className="px-3 py-2">
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                                        <button
                                                            onClick={() => handleOpenModal(product)}
                                                            className="text-primary hover:underline text-sm font-medium"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(product)}
                                                            className="text-error hover:underline text-sm font-medium"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="text-center py-4 text-text-secondary">
                                                No products found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination Controls */}
                        <div className="flex justify-center items-center gap-2 mt-4">
                            <button
                                className="px-3 py-1 border rounded-md bg-background text-primary disabled:opacity-50"
                                disabled={page === 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                            >
                                Previous
                            </button>
                            <span className="px-2">Page {page} of {totalPages}</span>
                            <button
                                className="px-3 py-1 border rounded-md bg-background text-primary disabled:opacity-50"
                                disabled={page === totalPages}
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                formData={formData}
                setFormData={setFormData}
                categoryOptions={categoryOptions}
                packagingOptions={packagingOptions}
                unitOptions={unitOptions}
                countryOptions={countryOptions}
                regionOptions={regionOptions}
                storeOptions={storeOptions}
                isEdit={!!editProductId}
            />
        </div>
    );
};

export default Products;
