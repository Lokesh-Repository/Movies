import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success" | "warning" | "info";
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToasterProps {
  toasts?: Toast[];
}

// Enhanced toast store with better error handling
let toasts: Toast[] = [];
let listeners: Array<(toasts: Toast[]) => void> = [];

export const toast = {
  success: (
    message: string,
    options?: { title?: string; duration?: number; action?: Toast["action"] }
  ) => {
    const id = Math.random().toString(36).substring(2, 11);
    const newToast: Toast = {
      id,
      title: options?.title,
      description: message,
      variant: "success",
      duration: options?.duration || 5000,
      action: options?.action,
    };
    addToast(newToast);
  },

  error: (
    message: string,
    options?: { title?: string; duration?: number; action?: Toast["action"] }
  ) => {
    const id = Math.random().toString(36).substring(2, 11);
    const newToast: Toast = {
      id,
      title: options?.title || "Error",
      description: message,
      variant: "destructive",
      duration: options?.duration || 7000, // Longer duration for errors
      action: options?.action,
    };
    addToast(newToast);
  },

  warning: (
    message: string,
    options?: { title?: string; duration?: number; action?: Toast["action"] }
  ) => {
    const id = Math.random().toString(36).substring(2, 11);
    const newToast: Toast = {
      id,
      title: options?.title || "Warning",
      description: message,
      variant: "warning",
      duration: options?.duration || 6000,
      action: options?.action,
    };
    addToast(newToast);
  },

  info: (
    message: string,
    options?: { title?: string; duration?: number; action?: Toast["action"] }
  ) => {
    const id = Math.random().toString(36).substring(2, 11);
    const newToast: Toast = {
      id,
      title: options?.title,
      description: message,
      variant: "info",
      duration: options?.duration || 4000,
      action: options?.action,
    };
    addToast(newToast);
  },

  // Network error helper
  networkError: (error?: Error) => {
    const message =
      error?.message ||
      "Network connection failed. Please check your internet connection and try again.";
    toast.error(message, {
      title: "Connection Error",
      duration: 8000,
      action: {
        label: "Retry",
        onClick: () => window.location.reload(),
      },
    });
  },

  // API error helper
  apiError: (error: Error | string, context?: string) => {
    const message = typeof error === "string" ? error : error.message;
    const title = context ? `${context} Failed` : "Request Failed";
    toast.error(message, {
      title,
      duration: 7000,
    });
  },

  dismiss: (id: string) => {
    toasts = toasts.filter((t) => t.id !== id);
    listeners.forEach((listener) => listener(toasts));
  },

  dismissAll: () => {
    toasts = [];
    listeners.forEach((listener) => listener(toasts));
  },
};

function addToast(newToast: Toast) {
  // Limit to 5 toasts maximum
  if (toasts.length >= 5) {
    toasts = toasts.slice(1);
  }

  toasts = [...toasts, newToast];
  listeners.forEach((listener) => listener(toasts));

  // Auto remove after duration
  if (newToast.duration && newToast.duration > 0) {
    setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== newToast.id);
      listeners.forEach((listener) => listener(toasts));
    }, newToast.duration);
  }
}

function getToastIcon(variant: Toast["variant"]) {
  switch (variant) {
    case "success":
      return <CheckCircle size={20} style={{ color: "#059669" }} />;
    case "destructive":
      return <AlertCircle size={20} style={{ color: "#dc2626" }} />;
    case "warning":
      return <AlertCircle size={20} style={{ color: "#d97706" }} />;
    case "info":
      return <Info size={20} style={{ color: "#2563eb" }} />;
    default:
      return <Info size={20} style={{ color: "#6b7280" }} />;
  }
}

function getToastBg(variant: Toast["variant"]) {
  switch (variant) {
    case "success":
      return "#f0fdf4";
    case "destructive":
      return "#fef2f2";
    case "warning":
      return "#fffbeb";
    case "info":
      return "#eff6ff";
    default:
      return "#ffffff";
  }
}

function getToastColor(variant: Toast["variant"]) {
  switch (variant) {
    case "success":
      return "#166534";
    case "destructive":
      return "#991b1b";
    case "warning":
      return "#92400e";
    case "info":
      return "#1e40af";
    default:
      return "#111827";
  }
}

export function Toaster({ toasts: propToasts }: ToasterProps) {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>(
    propToasts || toasts
  );

  useEffect(() => {
    const listener = (newToasts: Toast[]) => {
      setCurrentToasts(newToasts);
    };
    listeners.push(listener);

    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  if (currentToasts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 1000,
        maxWidth: "400px",
      }}
    >
      {currentToasts.map((currentToast) => (
        <div
          key={currentToast.id}
          style={{
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e5e7eb",
            marginBottom: "8px",
            background: getToastBg(currentToast.variant),
            color: getToastColor(currentToast.variant),
            animation: "slideInRight 0.3s ease-out",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}
          >
            <div style={{ flexShrink: 0, marginTop: "2px" }}>
              {getToastIcon(currentToast.variant)}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              {currentToast.title && (
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "14px",
                    marginBottom: "4px",
                    lineHeight: "1.4",
                  }}
                >
                  {currentToast.title}
                </div>
              )}
              {currentToast.description && (
                <div
                  style={{
                    fontSize: "14px",
                    lineHeight: "1.4",
                    wordBreak: "break-words",
                  }}
                >
                  {currentToast.description}
                </div>
              )}

              {currentToast.action && (
                <button
                  onClick={currentToast.action.onClick}
                  style={{
                    marginTop: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "inherit",
                  }}
                >
                  {currentToast.action.label}
                </button>
              )}
            </div>

            <button
              onClick={() => toast.dismiss(currentToast.id)}
              style={{
                flexShrink: 0,
                marginLeft: "8px",
                padding: "4px",
                borderRadius: "50%",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
