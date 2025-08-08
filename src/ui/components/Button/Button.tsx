import { ButtonType, ButtonVariant } from "@/types";
import React, { FunctionComponent } from "react";

import $ from "./Button.module.css";

interface ButtonProps {
  onClick?: () => void;
  type?: ButtonType;
  variant?: ButtonVariant;
  loading?: boolean;
  children: React.ReactNode;
}

const Button: FunctionComponent<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  loading = false,
}) => {
  const variantClass = variant === "secondary" ? $.secondary : $.primary;
  return (
    <button
      className={`${$.button} ${variantClass}`}
      type={type}
      onClick={onClick}
      disabled={loading}
    >
      
      {loading ? (
        <span data-testid="loading-spinner" style={{ display: "inline-block", verticalAlign: "middle" }}>
          <svg width="20" height="20" viewBox="0 0 50 50">
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              strokeDasharray="31.4 31.4"
              strokeLinecap="round"
              style={{
                animation: "spin 1s linear infinite"
              }}
            />
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </svg>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
