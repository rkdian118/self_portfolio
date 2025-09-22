import React from "react";
import "./ErrorMessage.css";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  type?: "error" | "warning" | "info";
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  type = "error",
}) => {
  return (
    <div className={`error-message error-message--${type}`}>
      <div className="error-message__content">
        <div className="error-message__icon">
          {type === "error" && "❌"}
          {type === "warning" && "⚠️"}
          {type === "info" && "ℹ️"}
        </div>
        <div className="error-message__text">
          <p>{message}</p>
        </div>
        {onRetry && (
          <button className="error-message__retry" onClick={onRetry}>
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
