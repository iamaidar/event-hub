import React from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
            <div
                className="absolute inset-0 bg-neutral-900/10 backdrop-blur-[2px]"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-lg max-w-md w-full mx-4 overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-600 transition-colors"
                    aria-label="Закрыть"
                >
                    ✕
                </button>

                <div className="p-6 text-center ">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;