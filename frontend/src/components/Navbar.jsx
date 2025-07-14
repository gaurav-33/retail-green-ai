import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
    const [colorScheme, setColorScheme] = useState("light");

    useEffect(() => {
        document.documentElement.setAttribute("data-color-scheme", colorScheme);
    }, [colorScheme]);

    const [active, setActive] = useState("dashboard");
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { id: "dashboard", label: "Dashboard", nav: "/" },
        { id: "products", label: "Products", nav: "/products" },
        { id: "inventory", label: "Inventory", nav: "/inventory" },
        { id: "calculator", label: "Calculator", nav: "/calculator" },
        { id: "health", label: "System Health", nav: "/health" },
    ];

    // Update active tab when location changes
    useEffect(() => {
        const matchedItem = navItems.find((item) => item.nav === location.pathname);
        if (matchedItem) {
            setActive(matchedItem.id);
        }
    }, [location.pathname]);

    const handleNav = (item) => {
        navigate(item.nav);
    };

    return (
        <nav className="bg-surface border-b border-border shadow-sm sticky top-0 z-50">
            <div
                className="
    container mx-auto px-4 py-4
    flex flex-col items-center justify-center gap-4
    sm:flex-col
    md:flex-row md:items-center md:justify-between md:h-16
  "
            >
                <div className="text-primary text-2xl font-bold text-center md:text-left">
                    Retail ReGen
                </div>

                {/* Navigation */}
                <div
                    className="flex flex-wrap justify-center gap-2 sm:gap-3 w-full md:flex-nowrap md:gap-6 md:justify-start md:w-auto"

                >
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleNav(item)}
                            className={`
                px-3 py-2 rounded-md font-medium text-center transition-all duration-fast ease-standard
                text-sm sm:text-base
                flex-1 sm:flex-initial
                ${active === item.id
                                    ? "bg-primary text-btn-primary-text"
                                    : "text-text-secondary hover:bg-secondary hover:text-text"
                                }
              `}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4 text-text-secondary font-medium text-sm text-center md:text-right">
                    <span className="hidden sm:inline">Admin User</span>
                    <button
                        onClick={() =>
                            setColorScheme(colorScheme === "light" ? "dark" : "light")
                        }
                        className="p-2 rounded-md bg-primary text-btn-primary-text hover:opacity-90 transition"
                        aria-label="Toggle dark mode"
                    >
                        {colorScheme === "light" ? (
                            <MoonIcon className="h-5 w-5" />
                        ) : (
                            <SunIcon className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
