"use client";

import React from "react";
import { Button, Modal } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";

interface EmailSentConfirmationProps {
  show: boolean;
  onClose: () => void;
  email: string;
  onResendEmail?: () => void;
  resending?: boolean;
  resetToken?: string; // For development mode
  onOpenResetPassword?: (token: string) => void;
  onBackToSignin?: () => void;
}

export default function EmailSentConfirmation({
  show,
  onClose,
  email,
  onResendEmail,
  resending = false,
  resetToken,
  onOpenResetPassword,
  onBackToSignin,
}: EmailSentConfirmationProps) {
  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      dialogClassName="email-sent-modal"
      style={{
        fontFamily: "Poppins",
      }}
    >
      <Modal.Body className="p-0">
        <div
          style={{
            width: "800px",
            maxWidth: "90vw",
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            boxShadow: "0px 4px 32px 17px rgba(0, 0, 0, 0.05)",
            position: "relative",
          }}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={handleClose}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "transparent",
              border: "none",
              fontSize: "20px",
              color: "#6C757D",
              cursor: "pointer",
              zIndex: 10,
            }}
          >
            <FaTimes />
          </button>

          <div
            style={{
              padding: "24px 44px 44px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "40px",
            }}
          >
            {/* Mail Icon */}
            <div
              style={{
                width: "93px",
                height: "93px",
                backgroundColor: "rgba(44, 162, 72, 0.1)",
                borderRadius: "100px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <HiOutlineMail
                size={48}
                style={{
                  color: "#2CA248",
                }}
              />
            </div>

            {/* Header */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <h2
                style={{
                  fontSize: "38px",
                  fontWeight: 700,
                  lineHeight: "1.3",
                  textAlign: "center",
                  color: "#222222",
                  margin: 0,
                  fontFamily: "Poppins",
                }}
              >
                Check Your Email
              </h2>
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: 400,
                  lineHeight: "1.5",
                  textAlign: "center",
                  color: "#424242",
                  margin: 0,
                  fontFamily: "Poppins",
                }}
              >
                We've sent a password reset link to {email}
              </p>
            </div>

            {/* Message Content */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                width: "100%",
              }}
            >
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: 400,
                  lineHeight: "1.5",
                  textAlign: "center",
                  color: "#424242",
                  margin: 0,
                  fontFamily: "Poppins",
                }}
              >
                Didn't receive the email? Check your spam folder or try again.
              </p>

              {/* Development Mode: Show Reset Token */}
              {resetToken && (
                <div
                  style={{
                    marginTop: "20px",
                    padding: "16px",
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #dee2e6",
                    borderRadius: "8px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#495057",
                      margin: "0 0 8px 0",
                      fontFamily: "Poppins",
                    }}
                  >
                    🔧 Development Mode - Reset Token:
                  </p>
                  <div
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #ced4da",
                      borderRadius: "4px",
                      padding: "8px 12px",
                      fontFamily: "monospace",
                      fontSize: "12px",
                      wordBreak: "break-all",
                      color: "#495057",
                    }}
                  >
                    {resetToken}
                  </div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      if (onOpenResetPassword) {
                        onOpenResetPassword(resetToken);
                      }
                    }}
                    style={{
                      fontSize: "12px",
                      fontFamily: "Poppins",
                    }}
                  >
                    🔗 Open Reset Password
                  </Button>
                </div>
              )}

              {/* Resend Email Button */}
              {onResendEmail && (
                <Button
                  type="button"
                  variant="outline-secondary"
                  disabled={resending}
                  onClick={onResendEmail}
                  style={{
                    border: "1px solid #CECECE",
                    borderRadius: "12px",
                    padding: "14px 30px",
                    fontSize: "18px",
                    fontFamily: "Poppins",
                    fontWeight: 600,
                    color: "#161616",
                    backgroundColor: "#FFFFFF",
                    width: "100%",
                  }}
                >
                  {resending ? "Sending..." : "Resend Email"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
