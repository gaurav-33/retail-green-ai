import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { XMarkIcon } from "@heroicons/react/24/solid";

const Toast = ({ type = "success", message = "", visible, onClose }) => {
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => onClose(), 3000);
            return () => clearTimeout(timer);
        }
    }, [visible, onClose]);

    return (
        <div
            className={`fixed bottom-5 right-5 z-[1100] transition-transform duration-normal ease-standard ${visible ? "translate-x-0" : "translate-x-[400px]"
                }`}
        >
            <div
                className={`
                         relative min-w-[250px] p-4 pr-5
                         rounded-base shadow-lg
                         border border-border
                         ${type === "success"
                        ? "border-l-6 border-l-success"
                        : type === "error"
                            ? "border-l-6 border-l-error"
                            : "border-l-6 border-l-border"}
    bg-surface text-text
  `}
            >
                <span className="text-sm">{message}</span>
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-text hover:text-black"
                >
                    <XMarkIcon className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

Toast.propTypes = {
    type: PropTypes.oneOf(["success", "error"]),
    message: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default Toast;
