import React, { createContext, useContext, useState, useCallback } from "react";
import Toast from "../components/Toast";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

    const showToast = useCallback((message, type = "success") => {
        setToast({ visible: true, message, type });
        setTimeout(() => setToast({ ...toast, visible: false }), 3000);
    }, []);

    const hideToast = () => setToast(prev => ({ ...prev, visible: false }));

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Toast {...toast} onClose={hideToast} />
        </ToastContext.Provider>
    );
};
