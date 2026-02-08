import { createContext, useContext, useState, useEffect } from "react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 grid gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`animate-fade-up rounded-2xl px-6 py-3 text-sm text-white shadow-lift ${
              toast.type === "success"
                ? "bg-tide"
                : toast.type === "error"
                ? "bg-alert"
                : "bg-ink"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
