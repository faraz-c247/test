"use client";

import React from "react";
import { Modal as BootstrapModal, Button, Spinner } from "react-bootstrap";

export interface ModalProps {
  show: boolean;
  onHide: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "lg" | "xl";
  centered?: boolean;
  backdrop?: boolean | "static";
  keyboard?: boolean;
  scrollable?: boolean;
  fullscreen?:
    | boolean
    | "sm-down"
    | "md-down"
    | "lg-down"
    | "xl-down"
    | "xxl-down";
  className?: string;

  // Footer props
  showFooter?: boolean;
  footerContent?: React.ReactNode;

  // Action buttons
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmVariant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark";
  cancelVariant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark";
  confirmDisabled?: boolean;
  cancelDisabled?: boolean;
  loading?: boolean;

  // Header props
  showHeader?: boolean;
  showCloseButton?: boolean;
  headerContent?: React.ReactNode;

  // Design props
  variant?: "default" | "glass" | "modern" | "minimal";
  headerIcon?: React.ReactNode;
  footerAlign?: "left" | "center" | "right" | "between";
}

export default function Modal({
  show,
  onHide,
  title,
  children,
  size,
  centered = true,
  backdrop = true,
  keyboard = true,
  scrollable = false,
  fullscreen = false,
  className = "",

  // Footer props
  showFooter = true,
  footerContent,

  // Action buttons
  confirmText = "Save",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  confirmVariant = "primary",
  cancelVariant = "outline-secondary",
  confirmDisabled = false,
  cancelDisabled = false,
  loading = false,

  // Header props
  showHeader = true,
  showCloseButton = true,
  headerContent,

  // Design props
  variant = "modern",
  headerIcon,
  footerAlign = "right",
}: ModalProps) {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onHide();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  const getModalClass = () => {
    const baseClass = "enhanced-modal";
    const variantClasses = {
      default: "",
      glass: "modal-glass",
      modern: "modal-modern",
      minimal: "modal-minimal",
    };
    return `${baseClass} ${variantClasses[variant]} ${className}`;
  };

  const renderHeader = () => {
    if (!showHeader) return null;

    return (
      <BootstrapModal.Header
        closeButton={showCloseButton}
        className={`border-0 ${variant === "minimal" ? "pb-2" : "pb-3"}`}
      >
        {headerContent || (
          <div className="d-flex align-items-center">
            {headerIcon && <div className="me-3 fs-4">{headerIcon}</div>}
            <BootstrapModal.Title className="fw-bold fs-5 mb-0">
              {title}
            </BootstrapModal.Title>
          </div>
        )}
      </BootstrapModal.Header>
    );
  };

  const renderFooter = () => {
    if (!showFooter) return null;

    const alignmentClasses = {
      left: "justify-content-start",
      center: "justify-content-center",
      right: "justify-content-end",
      between: "justify-content-between",
    };

    if (footerContent) {
      return (
        <BootstrapModal.Footer
          className={`border-0 pt-3 d-flex ${alignmentClasses[footerAlign]}`}
        >
          {footerContent}
        </BootstrapModal.Footer>
      );
    }

    // Default footer with action buttons
    if (onConfirm || onCancel) {
      return (
        <BootstrapModal.Footer
          className={`border-0 pt-3 d-flex ${alignmentClasses[footerAlign]}`}
        >
          <div className="d-flex gap-2">
            {onCancel && (
              <Button
                variant={cancelVariant}
                onClick={handleCancel}
                disabled={cancelDisabled || loading}
                className="px-4"
              >
                {cancelText}
              </Button>
            )}

            {onConfirm && (
              <Button
                variant={confirmVariant}
                onClick={handleConfirm}
                disabled={confirmDisabled || loading}
                className="px-4 d-flex align-items-center"
              >
                {loading && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    className="me-2"
                  />
                )}
                {confirmText}
              </Button>
            )}
          </div>
        </BootstrapModal.Footer>
      );
    }

    return null;
  };

  return (
    <>
      <BootstrapModal
        show={show}
        onHide={onHide}
        size={size}
        centered={centered}
        backdrop={backdrop}
        keyboard={keyboard}
        scrollable={scrollable}
        fullscreen={fullscreen}
        className={getModalClass()}
        contentClassName="border-0 shadow-lg"
      >
        {renderHeader()}

        <BootstrapModal.Body
          className={variant === "minimal" ? "py-3" : "py-4"}
        >
          {children}
        </BootstrapModal.Body>

        {renderFooter()}
      </BootstrapModal>

      {/* Custom Styles */}
      <style jsx global>{`
        .enhanced-modal .modal-content {
          border-radius: 16px;
          overflow: hidden;
          animation: modalSlideIn 0.3s ease-out;
        }

        .enhanced-modal.modal-glass .modal-content {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .enhanced-modal.modal-modern .modal-content {
          background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1),
            0 10px 20px rgba(0, 0, 0, 0.05);
        }

        .enhanced-modal.modal-minimal .modal-content {
          background: #ffffff;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .enhanced-modal .modal-header {
          background: transparent;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          padding: 1.5rem 1.5rem 1rem 1.5rem;
        }

        .enhanced-modal .modal-body {
          padding: 1rem 1.5rem;
          color: #495057;
          line-height: 1.6;
        }

        .enhanced-modal .modal-footer {
          background: transparent;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          padding: 1rem 1.5rem 1.5rem 1.5rem;
        }

        .enhanced-modal .btn-close {
          background-size: 1.2em;
          opacity: 0.7;
          transition: opacity 0.2s ease;
        }

        .enhanced-modal .btn-close:hover {
          opacity: 1;
        }

        .enhanced-modal .btn {
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .enhanced-modal .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .enhanced-modal .btn:active {
          transform: translateY(0);
        }

        .enhanced-modal .btn-primary {
          background: linear-gradient(135deg, #0d6efd 0%, #0056b3 100%);
          border: none;
        }

        .enhanced-modal .btn-outline-secondary {
          border-color: #dee2e6;
          color: #6c757d;
        }

        .enhanced-modal .btn-outline-secondary:hover {
          background-color: #f8f9fa;
          border-color: #adb5bd;
          color: #495057;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .modal.fade .modal-dialog {
          transition: transform 0.3s ease-out;
        }

        .modal-backdrop {
          background-color: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(2px);
        }
      `}</style>
    </>
  );
}

// Enhanced Specialized Modal Components

export interface ConfirmModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info" | "success";
  loading?: boolean;
  icon?: React.ReactNode;
}

export function ConfirmModal({
  show,
  onHide,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
  icon,
}: ConfirmModalProps) {
  const getIcon = () => {
    if (icon) return icon;

    switch (variant) {
      case "danger":
        return <span className="text-danger">⚠️</span>;
      case "warning":
        return <span className="text-warning">⚠️</span>;
      case "info":
        return <span className="text-info">ℹ️</span>;
      case "success":
        return <span className="text-success">✅</span>;
      default:
        return <span className="text-secondary">❓</span>;
    }
  };

  const getConfirmVariant = () => {
    switch (variant) {
      case "danger":
        return "danger";
      case "warning":
        return "warning";
      case "info":
        return "info";
      case "success":
        return "success";
      default:
        return "primary";
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      title={title}
      size="sm"
      variant="modern"
      headerIcon={getIcon()}
      onConfirm={onConfirm}
      onCancel={onHide}
      confirmText={confirmText}
      cancelText={cancelText}
      confirmVariant={getConfirmVariant()}
      loading={loading}
      footerAlign="center"
    >
      <div className="text-center py-3">
        <div className="mb-4" style={{ fontSize: "4rem" }}>
          {getIcon()}
        </div>
        <p className="mb-0 fs-6 lh-base">{message}</p>
      </div>
    </Modal>
  );
}

export interface AlertModalProps {
  show: boolean;
  onHide: () => void;
  title?: string;
  message: string;
  variant?: "danger" | "warning" | "info" | "success";
  buttonText?: string;
  icon?: React.ReactNode;
}

export function AlertModal({
  show,
  onHide,
  title = "Alert",
  message,
  variant = "info",
  buttonText = "OK",
  icon,
}: AlertModalProps) {
  const getIcon = () => {
    if (icon) return icon;

    switch (variant) {
      case "danger":
        return <span className="text-danger">❌</span>;
      case "warning":
        return <span className="text-warning">⚠️</span>;
      case "info":
        return <span className="text-info">ℹ️</span>;
      case "success":
        return <span className="text-success">✅</span>;
      default:
        return <span className="text-info">ℹ️</span>;
    }
  };

  const getButtonVariant = () => {
    switch (variant) {
      case "danger":
        return "danger";
      case "warning":
        return "warning";
      case "info":
        return "info";
      case "success":
        return "success";
      default:
        return "primary";
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      title={title}
      size="sm"
      variant="modern"
      headerIcon={getIcon()}
      showFooter={true}
      footerAlign="center"
      footerContent={
        <Button variant={getButtonVariant()} onClick={onHide} className="px-4">
          {buttonText}
        </Button>
      }
    >
      <div className="text-center py-3">
        <div className="mb-4" style={{ fontSize: "4rem" }}>
          {getIcon()}
        </div>
        <p className="mb-0 fs-6 lh-base">{message}</p>
      </div>
    </Modal>
  );
}

// New: Success Modal
export interface SuccessModalProps {
  show: boolean;
  onHide: () => void;
  title?: string;
  message: string;
  buttonText?: string;
  onAction?: () => void;
  actionText?: string;
}

export function SuccessModal({
  show,
  onHide,
  title = "Success",
  message,
  buttonText = "Continue",
  onAction,
  actionText = "View Details",
}: SuccessModalProps) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      title={title}
      size="sm"
      variant="modern"
      headerIcon={<span className="text-success">🎉</span>}
      showFooter={true}
      footerAlign="center"
      footerContent={
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={onHide}>
            {buttonText}
          </Button>
          {onAction && (
            <Button variant="success" onClick={onAction}>
              {actionText}
            </Button>
          )}
        </div>
      }
    >
      <div className="text-center py-3">
        <div className="mb-4" style={{ fontSize: "4rem" }}>
          <span className="text-success">✅</span>
        </div>
        <p className="mb-0 fs-6 lh-base text-success fw-medium">{message}</p>
      </div>
    </Modal>
  );
}

// New: Loading Modal
export interface LoadingModalProps {
  show: boolean;
  title?: string;
  message?: string;
  progress?: number;
}

export function LoadingModal({
  show,
  title = "Loading",
  message = "Please wait...",
  progress,
}: LoadingModalProps) {
  return (
    <Modal
      show={show}
      onHide={() => {}} // Can't close loading modal
      title={title}
      size="sm"
      variant="modern"
      backdrop="static"
      keyboard={false}
      showHeader={false}
      showFooter={false}
    >
      <div className="text-center py-4">
        <div className="mb-4">
          <Spinner
            animation="border"
            variant="primary"
            style={{ width: "3rem", height: "3rem" }}
          />
        </div>
        <h6 className="mb-2">{title}</h6>
        <p className="text-muted mb-0">{message}</p>

        {progress !== undefined && (
          <div className="mt-3">
            <div className="progress" style={{ height: "6px" }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${progress}%` }}
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <small className="text-muted mt-1 d-block">
              {progress}% complete
            </small>
          </div>
        )}
      </div>
    </Modal>
  );
}
