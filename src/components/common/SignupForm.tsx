"use client";

import React, { useState } from "react";
import { Form, Button, Modal, Alert } from "react-bootstrap";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaGoogle, FaTimes } from "react-icons/fa";
import { SignupFormData, signupSchema } from "@/lib/validationSchemas";
import * as yup from "yup";

interface SignupFormProps {
  onSubmit: (data: SignupFormData) => void;
  error?: string;
  loading?: boolean;
  show: boolean;
  onClose: () => void;
  onSigninClick?: () => void;
  isLoading?: boolean;
}

export default function SignupForm({
  onSubmit,
  error,
  loading = false,
  show,
  onClose,
  onSigninClick,
  isLoading = false,
}: SignupFormProps) {
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema),
  });

  const password = watch("password");
  const isLoadingState = loading || isSubmitting || isLoading;

  const handleFormSubmit = (data: SignupFormData) => {
    if (!agreeToTerms) {
      return;
    }
    onSubmit(data);
  };

  const handleSigninClick = () => {
    onClose();
    if (onSigninClick) {
      onSigninClick();
    }
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size="lg"
      backdrop="static"
      keyboard={false}
    >
      <Modal.Body className="p-0">
        <div
          className="position-relative"
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            padding: "20px",
            maxWidth: "800px",
            margin: "0 auto",
            boxShadow: "0px 4px 32px 17px rgba(0, 0, 0, 0.05)",
          }}
        >
          {/* Close Button */}
          <Button
            variant="link"
            className="position-absolute top-0 end-0 p-2 text-decoration-none"
            onClick={onClose}
            style={{
              color: "#424242",
              fontSize: "16px",
              zIndex: 10,
            }}
          >
            <FaTimes size={16} />
          </Button>

          {/* Form Container */}
          <div
            style={{
              padding: "24px 44px 44px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "40px",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                width: "100%",
              }}
            >
              <h1
                style={{
                  fontFamily: "Poppins",
                  fontWeight: 700,
                  fontSize: "38px",
                  lineHeight: "1.3",
                  textAlign: "center",
                  color: "#222222",
                  margin: 0,
                }}
              >
                Create Account
              </h1>
              <p
                style={{
                  fontFamily: "Poppins",
                  fontWeight: 400,
                  fontSize: "18px",
                  lineHeight: "1.5",
                  textAlign: "center",
                  color: "#424242",
                  margin: 0,
                  width: "100%",
                }}
              >
                Join us to get your rental property reports
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <Alert variant="danger" className="w-100">
                {error}
              </Alert>
            )}

            {/* Form */}
            <Form
              onSubmit={handleSubmit(handleFormSubmit)}
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "30px",
              }}
            >
              {/* Input Fields */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "30px",
                }}
              >
                {/* Name Fields Row */}
                <div style={{ display: "flex", gap: "20px" }}>
                  {/* First Name */}
                  <div style={{ flex: 1, position: "relative" }}>
                    <div
                      style={{
                        border: "1px solid #CECECE",
                        borderRadius: "6px",
                        padding: "18px 24px",
                        position: "relative",
                      }}
                    >
                      <Form.Control
                        type="text"
                        placeholder="Enter Your First Name"
                        {...register("firstName")}
                        isInvalid={!!errors.firstName}
                        disabled={isLoadingState}
                        style={{
                          border: "none",
                          padding: 0,
                          fontSize: "16px",
                          fontFamily: "Poppins",
                          color: "#848484",
                          backgroundColor: "transparent",
                          outline: "none",
                          boxShadow: "none",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "-14px",
                          left: "18px",
                          backgroundColor: "#FFFFFF",
                          padding: "2px 6px",
                          fontSize: "16px",
                          fontFamily: "Poppins",
                          fontWeight: 500,
                          color: "#222222",
                        }}
                      >
                        First Name
                      </div>
                    </div>
                    {errors.firstName && (
                      <div className="text-danger small mt-1">
                        {errors.firstName.message}
                      </div>
                    )}
                  </div>

                  {/* Last Name */}
                  <div style={{ flex: 1, position: "relative" }}>
                    <div
                      style={{
                        border: "1px solid #CECECE",
                        borderRadius: "6px",
                        padding: "18px 24px",
                        position: "relative",
                      }}
                    >
                      <Form.Control
                        type="text"
                        placeholder="Enter Your Last Name"
                        {...register("lastName")}
                        isInvalid={!!errors.lastName}
                        disabled={isLoadingState}
                        style={{
                          border: "none",
                          padding: 0,
                          fontSize: "16px",
                          fontFamily: "Poppins",
                          color: "#848484",
                          backgroundColor: "transparent",
                          outline: "none",
                          boxShadow: "none",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "-14px",
                          left: "18px",
                          backgroundColor: "#FFFFFF",
                          padding: "2px 6px",
                          fontSize: "16px",
                          fontFamily: "Poppins",
                          fontWeight: 500,
                          color: "#222222",
                        }}
                      >
                        Last Name
                      </div>
                    </div>
                    {errors.lastName && (
                      <div className="text-danger small mt-1">
                        {errors.lastName.message}
                      </div>
                    )}
                  </div>
                </div>

                {/* Email and Phone Row */}
                <div style={{ display: "flex", gap: "20px" }}>
                  {/* Email */}
                  <div style={{ flex: 1, position: "relative" }}>
                    <div
                      style={{
                        border: "1px solid #CECECE",
                        borderRadius: "6px",
                        padding: "18px 24px",
                        position: "relative",
                      }}
                    >
                      <Form.Control
                        type="email"
                        placeholder="Enter Your Email"
                        {...register("email")}
                        isInvalid={!!errors.email}
                        disabled={isLoadingState}
                        style={{
                          border: "none",
                          padding: 0,
                          fontSize: "16px",
                          fontFamily: "Poppins",
                          color: "#848484",
                          backgroundColor: "transparent",
                          outline: "none",
                          boxShadow: "none",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "-14px",
                          left: "18px",
                          backgroundColor: "#FFFFFF",
                          padding: "2px 6px",
                          fontSize: "16px",
                          fontFamily: "Poppins",
                          fontWeight: 500,
                          color: "#222222",
                        }}
                      >
                        Email Address *
                      </div>
                    </div>
                    {errors.email && (
                      <div className="text-danger small mt-1">
                        {errors.email.message}
                      </div>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div style={{ flex: 1, position: "relative" }}>
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
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "16px",
                            fontFamily: "Poppins",
                            fontWeight: 500,
                            color: "#222222",
                          }}
                        >
                          +1
                        </span>
                        <Form.Control
                          type="tel"
                          placeholder="202-555-0198"
                          {...register("phoneNumber")}
                          isInvalid={!!errors.phoneNumber}
                          disabled={isLoadingState}
                          style={{
                            border: "none",
                            padding: 0,
                            fontSize: "16px",
                            fontFamily: "Poppins",
                            color: "#848484",
                            backgroundColor: "transparent",
                            outline: "none",
                            boxShadow: "none",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          top: "-14px",
                          left: "18px",
                          backgroundColor: "#FFFFFF",
                          padding: "2px 6px",
                          fontSize: "16px",
                          fontFamily: "Poppins",
                          fontWeight: 500,
                          color: "#222222",
                        }}
                      >
                        Phone Number
                      </div>
                    </div>
                    {errors.phoneNumber && (
                      <div className="text-danger small mt-1">
                        {errors.phoneNumber.message}
                      </div>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      border: "1px solid #CECECE",
                      borderRadius: "6px",
                      padding: "18px 24px",
                      position: "relative",
                    }}
                  >
                    <Form.Control
                      type="password"
                      placeholder="Create a Strong Password"
                      {...register("password")}
                      isInvalid={!!errors.password}
                      disabled={isLoadingState}
                      style={{
                        border: "none",
                        padding: 0,
                        fontSize: "16px",
                        fontFamily: "Poppins",
                        color: "#848484",
                        backgroundColor: "transparent",
                        outline: "none",
                        boxShadow: "none",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "-14px",
                        left: "18px",
                        backgroundColor: "#FFFFFF",
                        padding: "2px 6px",
                        fontSize: "16px",
                        fontFamily: "Poppins",
                        fontWeight: 500,
                        color: "#222222",
                      }}
                    >
                      Password *
                    </div>
                  </div>
                  {errors.password && (
                    <div className="text-danger small mt-1">
                      {errors.password.message}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      border: "1px solid #CECECE",
                      borderRadius: "6px",
                      padding: "18px 24px",
                      position: "relative",
                    }}
                  >
                    <Form.Control
                      type="password"
                      placeholder="Confirm Your Password"
                      {...register("confirmPassword")}
                      isInvalid={!!errors.confirmPassword}
                      disabled={isLoadingState}
                      style={{
                        border: "none",
                        padding: 0,
                        fontSize: "16px",
                        fontFamily: "Poppins",
                        color: "#848484",
                        backgroundColor: "transparent",
                        outline: "none",
                        boxShadow: "none",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "-14px",
                        left: "18px",
                        backgroundColor: "#FFFFFF",
                        padding: "2px 6px",
                        fontSize: "16px",
                        fontFamily: "Poppins",
                        fontWeight: 500,
                        color: "#222222",
                      }}
                    >
                      Confirm Password *
                    </div>
                  </div>
                  {errors.confirmPassword && (
                    <div className="text-danger small mt-1">
                      {errors.confirmPassword.message}
                    </div>
                  )}
                </div>

                {/* Terms Checkbox */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <Form.Check
                    type="checkbox"
                    id="terms-checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    style={{
                      width: "20px",
                      height: "20px",
                    }}
                  />
                  <label
                    htmlFor="terms-checkbox"
                    style={{
                      fontSize: "16px",
                      fontFamily: "Poppins",
                      fontWeight: 400,
                      color: "#424242",
                      cursor: "pointer",
                      lineHeight: "1.5",
                    }}
                  >
                    I agree with RentIntel's{" "}
                    <Link
                      href="/terms"
                      className="text-decoration-none"
                      style={{ color: "#2CA248" }}
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-decoration-none"
                      style={{ color: "#2CA248" }}
                    >
                      Privacy Policy
                    </Link>
                    .
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                {/* Sign Up Button */}
                <Button
                  type="submit"
                  disabled={isLoading || !agreeToTerms}
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(19, 63, 113, 1) 0%, rgba(32, 205, 44, 1) 100%)",
                    border: "none",
                    borderRadius: "10px",
                    padding: "14px 30px",
                    fontSize: "18px",
                    fontFamily: "Poppins",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    width: "100%",
                  }}
                >
                  {isLoadingState ? "Creating Account..." : "Sign Up"}
                </Button>

                {/* Google Sign Up Button */}
                <Button
                  type="button"
                  variant="outline-secondary"
                  style={{
                    border: "1px solid #CECECE",
                    borderRadius: "12px",
                    padding: "14px 30px",
                    fontSize: "18px",
                    fontFamily: "Poppins",
                    fontWeight: 600,
                    color: "#222222",
                    backgroundColor: "#FFFFFF",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                  onClick={() => {
                    // Handle Google signup
                    console.log("Google signup clicked");
                  }}
                >
                  <FaGoogle size={24} />
                  Sign Up with Google
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
                    color: "#222222",
                  }}
                >
                  Already have an account?
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
                  onClick={handleSigninClick}
                >
                  Sign In
                </button>
              </div>
            </Form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
