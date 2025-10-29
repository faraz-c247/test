"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import SigninForm from "./SigninForm";
import SignupForm from "./SignupForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import EmailSentConfirmation from "./EmailSentConfirmation";
import ResetPasswordForm from "./ResetPasswordForm";
import {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  LoginFormData,
  SignupFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
} from "@/lib/validationSchemas";
import {
  useLogin,
  useSignup,
  useForgotPassword,
  useResetPassword,
} from "@/hooks/useAuth";

export default function PublicHeader() {
  const { data: session } = useSession();
  const loginMutation = useLogin();
  const signupMutation = useSignup();
  const forgotPasswordMutation = useForgotPassword();
  const resetPasswordMutation = useResetPassword();

  // Modal states
  const [showSigninModal, setShowSigninModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showEmailSentModal, setShowEmailSentModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

  // Modal control functions
  const openSignin = () => {
    setShowSignupModal(false);
    setShowForgotPasswordModal(false);
    setShowEmailSentModal(false);
    setShowResetPasswordModal(false);
    setShowSigninModal(true);
  };

  const openSignup = () => {
    setShowSigninModal(false);
    setShowForgotPasswordModal(false);
    setShowEmailSentModal(false);
    setShowResetPasswordModal(false);
    setShowSignupModal(true);
  };

  const closeAll = () => {
    setShowSigninModal(false);
    setShowSignupModal(false);
    setShowForgotPasswordModal(false);
    setShowEmailSentModal(false);
    setShowResetPasswordModal(false);
  };

  const handleGetMyReportClick = () => {
    if (session) {
      // If user is logged in, redirect to dashboard
      window.location.href = "/dashboard";
    } else {
      // If not logged in, redirect to get-report page
      window.location.href = "/get-report";
    }
  };

  // Form handlers
  const handleSigninSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const handleSignupSubmit = (data: SignupFormData) => {
    // Transform the data to match backend expectations
    const transformedData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: data.password,
      // Combine first and last name for backward compatibility if needed
      name: `${data.firstName} ${data.lastName}`,
    };

    signupMutation.mutate(transformedData);
  };

  const handleForgotPasswordSubmit = (data: ForgotPasswordFormData) => {
    setForgotPasswordEmail(data.email);
    forgotPasswordMutation.mutate(data, {
      onSuccess: (response: any) => {
        setShowForgotPasswordModal(false);
        setShowEmailSentModal(true);

        // Store the reset token if returned (development mode)
        if (response?.data?.resetToken) {
          setResetToken(response.data.resetToken);
        }
      },
    });
  };

  const handleResetPasswordSubmit = (data: ResetPasswordFormData) => {
    resetPasswordMutation.mutate({
      token: resetToken,
      newPassword: data.newPassword,
    });
  };

  const handleForgotPasswordClick = () => {
    closeAll();
    setTimeout(() => setShowForgotPasswordModal(true), 100);
  };

  const handleBackToSignin = () => {
    setShowEmailSentModal(false);
    setTimeout(() => setShowSigninModal(true), 100);
  };

  const handleOpenResetPassword = (token?: string) => {
    if (token) {
      setResetToken(token);
    }
    setShowEmailSentModal(false);
    setTimeout(() => setShowResetPasswordModal(true), 100);
  };

  return (
    <>
      <header
        style={{
          width: "100%",
          height: "120px",
          backgroundColor: "#FFFFFF",
          boxShadow: "0px 10px 30px 17px rgba(0, 0, 0, 0.05)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 140px",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1000,
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "163px",
              height: "80px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src="/images/logo.png"
              alt="RentIntel Logo"
              width={163}
              height={80}
              style={{ objectFit: "contain" }}
            />
          </div>
        </Link>

        {/* Menu & Buttons Container */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "80px",
          }}
        >
          {/* Navigation Menu */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "30px",
            }}
          >
            <Link
              href="/sample-report"
              style={{
                textDecoration: "none",
                padding: "2px 6px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "Poppins",
                  fontWeight: 500,
                  fontSize: "18px",
                  lineHeight: "1.5em",
                  color: "#222222",
                }}
              >
                Sample Report
              </span>
            </Link>

            <Link
              href="/purchase-plans"
              style={{
                textDecoration: "none",
                padding: "2px 6px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "Poppins",
                  fontWeight: 500,
                  fontSize: "18px",
                  lineHeight: "1.5em",
                  color: "#222222",
                }}
              >
                Pricing
              </span>
            </Link>

            <Link
              href="/about-us"
              style={{
                textDecoration: "none",
                padding: "2px 6px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "Poppins",
                  fontWeight: 500,
                  fontSize: "18px",
                  lineHeight: "1.5em",
                  color: "#222222",
                }}
              >
                About
              </span>
            </Link>

            <Link
              href="/blog"
              style={{
                textDecoration: "none",
                padding: "2px 6px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "Poppins",
                  fontWeight: 500,
                  fontSize: "18px",
                  lineHeight: "1.5em",
                  color: "#222222",
                }}
              >
                Blog
              </span>
            </Link>

            <Link
              href="/contact-us"
              style={{
                textDecoration: "none",
                padding: "2px 6px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "Poppins",
                  fontWeight: 500,
                  fontSize: "18px",
                  lineHeight: "1.5em",
                  color: "#222222",
                }}
              >
                Contact
              </span>
            </Link>
          </nav>

          {/* User Actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "30px",
            }}
          >
            {/* Sign In Button - Secondary */}
            {!session && (
              <button
                onClick={openSignin}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                  padding: "14px 30px",
                  borderRadius: "10px",
                  border: "2px solid transparent",
                  background:
                    "linear-gradient(white, white) padding-box, linear-gradient(90deg, rgba(19, 63, 113, 1) 0%, rgba(32, 205, 44, 1) 100%) border-box",
                  cursor: "pointer",
                  fontFamily: "Poppins",
                  fontWeight: 600,
                  fontSize: "18px",
                  lineHeight: "1.5em",
                  color: "#2CA248",
                }}
              >
                Sign In
              </button>
            )}

            {/* Get My Report Button - Primary */}
            <button
              onClick={handleGetMyReportClick}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                padding: "14px 30px",
                borderRadius: "10px",
                border: "none",
                background:
                  "linear-gradient(90deg, rgba(19, 63, 113, 1) 0%, rgba(32, 205, 44, 1) 100%)",
                cursor: "pointer",
                fontFamily: "Poppins",
                fontWeight: 600,
                fontSize: "18px",
                lineHeight: "1.5em",
                color: "#FFFFFF",
              }}
            >
              Get my Report
            </button>
          </div>
        </div>
      </header>

      {/* Auth Modals */}
      {showSigninModal && (
        <SigninForm
          show={showSigninModal}
          onClose={closeAll}
          onSubmit={handleSigninSubmit}
          onSignupClick={openSignup}
          onForgotPasswordClick={handleForgotPasswordClick}
          isLoading={loginMutation.isPending}
        />
      )}

      {showSignupModal && (
        <SignupForm
          show={showSignupModal}
          onClose={closeAll}
          onSubmit={handleSignupSubmit}
          onSigninClick={openSignin}
          isLoading={signupMutation.isPending}
        />
      )}

      {showForgotPasswordModal && (
        <ForgotPasswordForm
          show={showForgotPasswordModal}
          onClose={closeAll}
          onSubmit={handleForgotPasswordSubmit}
          onBackToSignin={handleBackToSignin}
          isLoading={forgotPasswordMutation.isPending}
        />
      )}

      {showEmailSentModal && (
        <EmailSentConfirmation
          show={showEmailSentModal}
          onClose={closeAll}
          email={forgotPasswordEmail}
          onBackToSignin={handleBackToSignin}
          resetToken={resetToken} // Pass the reset token for development mode
          onOpenResetPassword={handleOpenResetPassword}
        />
      )}

      {showResetPasswordModal && (
        <ResetPasswordForm
          show={showResetPasswordModal}
          onClose={closeAll}
          onSubmit={handleResetPasswordSubmit}
          isLoading={resetPasswordMutation.isPending}
        />
      )}
    </>
  );
}
