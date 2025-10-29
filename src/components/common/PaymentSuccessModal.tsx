"use client";

import React from "react";
import { Modal, Button } from "react-bootstrap";
import { FaCheckCircle, FaEnvelope, FaKey, FaArrowRight } from "react-icons/fa";

interface PaymentSuccessModalProps {
  show: boolean;
  onHide: () => void;
  email: string;
  isExistingUser: boolean;
  defaultPassword?: string;
  onGoToLogin: () => void;
}

export default function PaymentSuccessModal({
  show,
  onHide,
  email,
  isExistingUser,
  defaultPassword,
  onGoToLogin,
}: PaymentSuccessModalProps) {
  return (
    <Modal show={show} onHide={onHide} centered size="md">
      <Modal.Body
        style={{
          padding: "40px",
          textAlign: "center",
          fontFamily: "Poppins",
        }}
      >
        {/* Success Icon */}
        <div style={{ marginBottom: "20px" }}>
          <FaCheckCircle size={60} style={{ color: "#2CA248" }} />
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: "24px",
            fontWeight: 600,
            color: "#222222",
            marginBottom: "16px",
          }}
        >
          🎉 Payment Successful!
        </h3>

        {/* Message */}
        <p
          style={{
            fontSize: "16px",
            color: "#666666",
            marginBottom: "30px",
            lineHeight: "1.5",
          }}
        >
          {isExistingUser
            ? "Your payment has been processed and credits have been added to your existing account."
            : "Your account has been created successfully and your report is being generated."}
        </p>

        {/* Login Instructions */}
        <div
          style={{
            backgroundColor: "#F8F9FA",
            border: "2px solid #E9ECEF",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "30px",
            textAlign: "left",
          }}
        >
          <h5
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "#222222",
              marginBottom: "15px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FaKey size={16} />
            Login Instructions
          </h5>

          <div style={{ marginBottom: "12px" }}>
            <strong style={{ color: "#2CA248" }}>
              <FaEnvelope size={14} /> Email:
            </strong>
            <br />
            <span style={{ fontSize: "16px", color: "#333" }}>{email}</span>
          </div>

          {!isExistingUser && defaultPassword && (
            <div style={{ marginBottom: "12px" }}>
              <strong style={{ color: "#2CA248" }}>
                <FaKey size={14} /> Temporary Password:
              </strong>
              <br />
              <code
                style={{
                  backgroundColor: "#E9ECEF",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "16px",
                  color: "#333",
                }}
              >
                {defaultPassword}
              </code>
            </div>
          )}

          <div
            style={{
              backgroundColor: "#FFF3CD",
              border: "1px solid #FFDF95",
              borderRadius: "6px",
              padding: "12px",
              fontSize: "14px",
              color: "#856404",
            }}
          >
            📧{" "}
            <strong>Login details have been sent to your email: {email}</strong>
            <br />
            {!isExistingUser ? (
              <>
                Click "Go to Dashboard" to automatically log you in, or use your email to login manually later. Please change your password after login for security.
              </>
            ) : (
              <>
                Click "Go to Dashboard" to access your account using your existing credentials.
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Button
            variant="outline-secondary"
            onClick={onHide}
            style={{
              borderRadius: "8px",
              padding: "12px 24px",
              fontFamily: "Poppins",
              fontWeight: 500,
            }}
          >
            Close
          </Button>

          <Button
            onClick={onGoToLogin}
            style={{
              background:
                "linear-gradient(90deg, rgba(19, 63, 113, 1) 0%, rgba(32, 205, 44, 1) 100%)",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              fontFamily: "Poppins",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            Go to Dashboard <FaArrowRight size={14} />
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
