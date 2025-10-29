"use client";

import React from "react";
import { Form, Button, Modal, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaTimes } from "react-icons/fa";
import type { ForgotPasswordFormData } from "@/lib/validationSchemas";
import { forgotPasswordSchema } from "@/lib/validationSchemas";

interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordFormData) => void;
  error?: string;
  loading?: boolean;
  show: boolean;
  onClose: () => void;
  onBackToSignin?: () => void;
  isLoading?: boolean;
}

export default function ForgotPasswordForm({
  onSubmit,
  error,
  loading = false,
  show,
  onClose,
  onBackToSignin,
  isLoading = false,
}: ForgotPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const handleFormSubmit = (data: ForgotPasswordFormData) => {
    onSubmit(data);
  };

  const handleBackToSignin = () => {
    onClose();
    if (onBackToSignin) {
      onBackToSignin();
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      show={show}
      onClose={handleClose}
      centered
      backdrop="static"
      dialogClassName="forgot-password-modal"
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
            <Form
              onSubmit={handleSubmit(handleFormSubmit)}
              style={{ width: "100%" }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "40px",
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
                  Forgot Your Password?
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
                  No Worries - Enter your email and we'll send you a reset link
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              {/* Email Input */}
              <div style={{ marginBottom: "40px" }}>
                <div
                  style={{
                    border: "1px solid #CECECE",
                    borderRadius: "6px",
                    padding: "18px 24px",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "-14px",
                      left: "18px",
                      backgroundColor: "#FFFFFF",
                      padding: "2px 6px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: 500,
                        color: "#222222",
                        fontFamily: "Poppins",
                      }}
                    >
                      Email Address *
                    </span>
                  </div>
                  <Form.Control
                    type="email"
                    placeholder="Enter Your Email"
                    {...register("email")}
                    isInvalid={!!errors.email}
                    style={{
                      border: "none",
                      padding: 0,
                      fontSize: "16px",
                      fontFamily: "Poppins",
                      color: "#848484",
                      backgroundColor: "transparent",
                      boxShadow: "none",
                    }}
                  />
                  {errors.email && (
                    <Form.Control.Feedback type="invalid">
                      {errors.email.message}
                    </Form.Control.Feedback>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div style={{ marginBottom: "40px" }}>
                <Button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    background:
                      "linear-gradient(90deg, rgba(19, 63, 113, 1) 0%, rgba(32, 205, 44, 1) 100%)",
                    border: "none",
                    borderRadius: "10px",
                    padding: "14px 30px",
                    fontSize: "18px",
                    fontFamily: "Poppins",
                    fontWeight: 600,
                    color: "#FFFFFF",
                  }}
                >
                  {loading ? "Sending..." : "Send Reset password Link"}
                </Button>
              </div>

              {/* Footer */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span
                  style={{
                    fontSize: "16px",
                    fontFamily: "Poppins",
                    fontWeight: 400,
                    color: "#161616",
                  }}
                >
                  Remember Your Password?
                </span>
                <button
                  type="button"
                  className="btn btn-link p-0 text-decoration-none"
                  style={{
                    fontSize: "16px",
                    fontFamily: "Poppins",
                    fontWeight: 600,
                    color: "#2CA248",
                    lineHeight: "1.4",
                    border: "none",
                    background: "transparent",
                  }}
                  onClick={handleBackToSignin}
                >
                  Back to Sign In
                </button>
              </div>
            </Form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
