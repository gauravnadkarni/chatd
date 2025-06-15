import { toast } from "sonner";

export const useToast = () => {
  const showSuccess = (
    message: string,
    options?: {
      description?: string;
      duration?: number;
      position?:
        | "top-left"
        | "top-center"
        | "top-right"
        | "bottom-left"
        | "bottom-center"
        | "bottom-right";
      style?: "default" | "custom" | "dark";
      customStyle?: React.CSSProperties;
      action?: {
        label: string;
        onClick: () => void;
      };
    }
  ) => {
    const getClassName = () => {
      if (options?.style === "custom") return "toast-custom-success";
      if (options?.style === "dark") return "toast-dark-success";
      return "";
    };

    const getStyle = () => {
      if (options?.customStyle) return options.customStyle;
      if (options?.style === "default")
        return {
          background: "#10b981",
          border: "1px solid #059669",
          color: "white",
        };
      return undefined;
    };
    return toast.success(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      position: options?.position || "top-right",
      className: getClassName(),
      style: getStyle(),
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
    });
  };

  const showError = (
    message: string,
    options?: {
      description?: string;
      duration?: number;
      position?:
        | "top-left"
        | "top-center"
        | "top-right"
        | "bottom-left"
        | "bottom-center"
        | "bottom-right";
      style?: "default" | "custom" | "dark";
      customStyle?: React.CSSProperties;
      action?: {
        label: string;
        onClick: () => void;
      };
    }
  ) => {
    const getClassName = () => {
      if (options?.style === "custom") return "toast-custom-error";
      if (options?.style === "dark") return "toast-dark-error";
      return "";
    };

    const getStyle = () => {
      if (options?.customStyle) return options.customStyle;
      if (options?.style === "default")
        return {
          background: "#ef4444",
          border: "1px solid #dc2626",
          color: "white",
        };
      return undefined;
    };
    return toast.error(message, {
      description: options?.description,
      duration: options?.duration || 6000, // Longer duration for errors
      position: options?.position || "top-right",
      className: getClassName(),
      style: getStyle(),
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
    });
  };

  const showInfo = (
    message: string,
    options?: {
      description?: string;
      duration?: number;
      position?:
        | "top-left"
        | "top-center"
        | "top-right"
        | "bottom-left"
        | "bottom-center"
        | "bottom-right";
      style?: "default" | "custom" | "dark";
      customStyle?: React.CSSProperties;
      action?: {
        label: string;
        onClick: () => void;
      };
    }
  ) => {
    const getClassName = () => {
      if (options?.style === "custom") return "toast-custom-info";
      return "";
    };

    const getStyle = () => {
      if (options?.customStyle) return options.customStyle;
      if (options?.style === "default")
        return {
          background: "#3b82f6",
          border: "1px solid #2563eb",
          color: "white",
        };
      return undefined;
    };
    return toast.info(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      position: options?.position || "top-right",
      className: getClassName(),
      style: getStyle(),
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
    });
  };

  const showWarning = (
    message: string,
    options?: {
      description?: string;
      duration?: number;
      position?:
        | "top-left"
        | "top-center"
        | "top-right"
        | "bottom-left"
        | "bottom-center"
        | "bottom-right";
      style?: "default" | "custom" | "dark";
      customStyle?: React.CSSProperties;
      action?: {
        label: string;
        onClick: () => void;
      };
    }
  ) => {
    const getClassName = () => {
      if (options?.style === "custom") return "toast-custom-warning";
      return "";
    };

    const getStyle = () => {
      if (options?.customStyle) return options.customStyle;
      if (options?.style === "default")
        return {
          background: "#f59e0b",
          border: "1px solid #d97706",
          color: "white",
        };
      return undefined;
    };
    return toast.warning(message, {
      description: options?.description,
      duration: options?.duration || 5000,
      position: options?.position || "top-right",
      className: getClassName(),
      style: getStyle(),
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
    });
  };

  const showLoading = (message: string) => {
    return toast.loading(message);
  };

  const dismiss = (toastId?: string | number) => {
    toast.dismiss(toastId);
  };

  const dismissAll = () => {
    toast.dismiss();
  };

  return {
    success: showSuccess,
    error: showError,
    info: showInfo,
    warning: showWarning,
    loading: showLoading,
    dismiss,
    dismissAll,
  };
};
