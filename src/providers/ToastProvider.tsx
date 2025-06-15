"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <>
      <style jsx global>{`
        /* Custom toast colors */
        [data-sonner-toast][data-type="success"] {
          background: #10b981 !important;
          border: 1px solid #059669 !important;
          color: white !important;
        }

        [data-sonner-toast][data-type="error"] {
          background: #ef4444 !important;
          border: 1px solid #dc2626 !important;
          color: white !important;
        }

        [data-sonner-toast][data-type="warning"] {
          background: #f59e0b !important;
          border: 1px solid #d97706 !important;
          color: white !important;
        }

        [data-sonner-toast][data-type="info"] {
          background: #3b82f6 !important;
          border: 1px solid #2563eb !important;
          color: white !important;
        }

        [data-sonner-toast][data-type="loading"] {
          background: #6b7280 !important;
          border: 1px solid #4b5563 !important;
          color: white !important;
        }

        /* Custom class-based styling */
        .toast-custom-success {
          background: linear-gradient(135deg, #10b981, #059669) !important;
          border: 1px solid #047857 !important;
          color: white !important;
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3) !important;
        }

        .toast-custom-error {
          background: linear-gradient(135deg, #ef4444, #dc2626) !important;
          border: 1px solid #b91c1c !important;
          color: white !important;
          box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3) !important;
        }

        .toast-custom-warning {
          background: linear-gradient(135deg, #f59e0b, #d97706) !important;
          border: 1px solid #b45309 !important;
          color: white !important;
          box-shadow: 0 10px 25px rgba(245, 158, 11, 0.3) !important;
        }

        .toast-custom-info {
          background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
          border: 1px solid #1d4ed8 !important;
          color: white !important;
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3) !important;
        }

        /* Dark theme custom colors */
        .toast-dark-success {
          background: #064e3b !important;
          border: 1px solid #10b981 !important;
          color: #a7f3d0 !important;
        }

        .toast-dark-error {
          background: #7f1d1d !important;
          border: 1px solid #ef4444 !important;
          color: #fecaca !important;
        }
      `}</style>
      <Toaster
        position="top-right"
        expand={false}
        richColors={false}
        closeButton
        duration={4000}
        toastOptions={{
          style: {
            background: "white",
            border: "1px solid #e5e7eb",
            color: "#374151",
          },
          className: "font-medium",
        }}
      />
    </>
  );
}
