"use client";

import React, { useState } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useLogout } from "@/hooks/useAuth";
import LogoutConfirmModal from "./LogoutConfirmModal";
import { useAuthModal } from "./AuthModal";
import SigninForm from "./SigninForm";
import SignupForm from "./SignupForm";
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
import ForgotPasswordForm from "./ForgotPasswordForm";
import EmailSentConfirmation from "./EmailSentConfirmation";
import ResetPasswordForm from "./ResetPasswordForm";

export default function AppNavbar() {
  const { data: session, status } = useSession();
  const logoutMutation = useLogout();
  const loginMutation = useLogin();
  const signupMutation = useSignup();
  const forgotPasswordMutation = useForgotPassword();
  const resetPasswordMutation = useResetPassword();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showEmailSentModal, setShowEmailSentModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const { showSigninModal, showSignupModal, openSignin, openSignup, closeAll } =
    useAuthModal();

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    logoutMutation.mutate();
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

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

  const handleForgotPasswordClick = () => {
    closeAll();
    setTimeout(() => setShowForgotPasswordModal(true), 100);
  };

  const handleBackToSignin = () => {
    setShowForgotPasswordModal(false);
    setTimeout(() => openSignin(), 100);
  };

  const handleResendEmail = () => {
    if (forgotPasswordEmail) {
      forgotPasswordMutation.mutate({ email: forgotPasswordEmail });
    }
  };

  const handleResetPasswordSubmit = (data: ResetPasswordFormData) => {
    resetPasswordMutation.mutate(data, {
      onSuccess: () => {
        setShowResetPasswordModal(false);
        // You could show a success message or redirect
        alert(
          "Password reset successfully! You can now sign in with your new password."
        );
        openSignin();
      },
    });
  };

  const handleOpenResetPassword = (token: string) => {
    setResetToken(token);
    setShowEmailSentModal(false);
    setShowResetPasswordModal(true);
  };

  const closeAllModals = () => {
    closeAll();
    setShowForgotPasswordModal(false);
    setShowEmailSentModal(false);
    setShowResetPasswordModal(false);
  };

  return (
    <>
      <Navbar expand="lg" className="navbar-figma shadow-figma-sm" fixed="top">
        <Container>
          {/* Brand Logo */}
          <Navbar.Brand
            as={Link}
            href="/"
            className="d-flex align-items-center text-decoration-none"
          >
            <div
              className="icon-figma me-3"
              style={{
                width: "40px",
                height: "40px",
                background: "var(--gradient-primary)",
                boxShadow: "none",
              }}
            >
              <span style={{ fontSize: "20px", color: "white" }}>🏠</span>
            </div>
            <div>
              <span
                className="text-dark-blue fw-bold"
                style={{ fontSize: "20px" }}
              >
                RentIntel
              </span>
              <div
                style={{
                  fontSize: "10px",
                  color: "var(--text-muted)",
                  lineHeight: 1,
                }}
              >
                Rental Intelligence Platform
              </div>
            </div>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            {/* Navigation Links */}
            <Nav className="me-auto">
              <Nav.Link
                as={Link}
                href="/"
                className="text-secondary-custom fw-medium mx-2"
                style={{ fontSize: "14px" }}
              >
                🏠 Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                href="/about-us"
                className="text-secondary-custom fw-medium mx-2"
                style={{ fontSize: "14px" }}
              >
                ℹ️ About Us
              </Nav.Link>
              <Nav.Link
                as={Link}
                href="/contact-us"
                className="text-secondary-custom fw-medium mx-2"
                style={{ fontSize: "14px" }}
              >
                📞 Contact
              </Nav.Link>
              <Nav.Link
                as={Link}
                href="/privacy-policy"
                className="text-secondary-custom fw-medium mx-2"
                style={{ fontSize: "14px" }}
              >
                🔒 Privacy
              </Nav.Link>
            </Nav>

            {/* User Actions */}
            <Nav className="align-items-center">
              {status === "loading" ? (
                <div
                  className="spinner-figma me-3"
                  style={{ width: "24px", height: "24px" }}
                ></div>
              ) : session ? (
                <>
                  {/* User Info */}
                  <div className="d-flex align-items-center me-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-2"
                      style={{
                        width: "32px",
                        height: "32px",
                        background: "var(--gradient-primary)",
                        color: "white",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      {session.user?.name?.charAt(0) ||
                        session.user?.email?.charAt(0) ||
                        "U"}
                    </div>
                    <div className="d-none d-lg-block">
                      <div
                        className="text-primary-custom fw-medium"
                        style={{ fontSize: "14px" }}
                      >
                        {session.user?.name || "User"}
                      </div>
                      <small className="text-secondary-custom">
                        {session.role === 1 ? "Administrator" : "User"}
                      </small>
                    </div>
                  </div>

                  {/* Dashboard Link */}
                  <Button
                    as={Link}
                    href="/dashboard"
                    className="btn-outline-gradient me-2"
                    style={{ fontSize: "14px" }}
                  >
                    📊 Dashboard
                  </Button>

                  {/* Logout Button */}
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={handleLogoutClick}
                    disabled={logoutMutation.isPending}
                    className="rounded-figma-md"
                  >
                    {logoutMutation.isPending ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-1"></div>
                        <span className="d-none d-md-inline">
                          Logging out...
                        </span>
                      </>
                    ) : (
                      <>
                        🚪{" "}
                        <span className="d-none d-md-inline ms-1">Logout</span>
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  {/* Sign In Button */}
                  <Button
                    onClick={openSignin}
                    className="btn-outline-gradient me-2"
                    style={{ fontSize: "14px" }}
                  >
                    🔑 Sign In
                  </Button>

                  {/* Get Report Button */}
                  <Button
                    onClick={() => {
                      if (session) {
                        // Authenticated user - open existing flow
                        openSignup();
                      } else {
                        // Unregistered user - redirect to new flow
                        window.location.href = "/get-report";
                      }
                    }}
                    className="btn-primary-gradient"
                    style={{ fontSize: "14px" }}
                  >
                    ✨ Get My Report
                  </Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        show={showLogoutModal}
        onHide={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        isLoading={logoutMutation.isPending}
      />

      {/* Auth Modals */}
      <SigninForm
        show={showSigninModal}
        onHide={closeAll}
        onSubmit={handleSigninSubmit}
        validationSchema={loginSchema}
        error={loginMutation.error?.message}
        loading={loginMutation.isPending}
        onSignupClick={() => {
          closeAll();
          setTimeout(() => openSignup(), 100);
        }}
        onForgotPasswordClick={handleForgotPasswordClick}
      />

      <SignupForm
        show={showSignupModal}
        onHide={closeAll}
        onSubmit={handleSignupSubmit}
        validationSchema={signupSchema}
        error={signupMutation.error?.message}
        loading={signupMutation.isPending}
        onSigninClick={() => {
          closeAll();
          setTimeout(() => openSignin(), 100);
        }}
      />

      {/* Forgot Password Modal */}
      <ForgotPasswordForm
        show={showForgotPasswordModal}
        onHide={() => setShowForgotPasswordModal(false)}
        onSubmit={handleForgotPasswordSubmit}
        validationSchema={forgotPasswordSchema}
        error={forgotPasswordMutation.error?.message}
        loading={forgotPasswordMutation.isPending}
        onBackToSignin={handleBackToSignin}
      />

      {/* Email Sent Confirmation Modal */}
      <EmailSentConfirmation
        show={showEmailSentModal}
        onHide={() => setShowEmailSentModal(false)}
        email={forgotPasswordEmail}
        onResendEmail={handleResendEmail}
        resending={forgotPasswordMutation.isPending}
        resetToken={resetToken}
        onOpenResetPassword={handleOpenResetPassword}
      />

      {/* Reset Password Modal */}
      <ResetPasswordForm
        show={showResetPasswordModal}
        onHide={() => setShowResetPasswordModal(false)}
        onSubmit={handleResetPasswordSubmit}
        validationSchema={resetPasswordSchema}
        error={resetPasswordMutation.error?.message}
        loading={resetPasswordMutation.isPending}
        token={resetToken}
      />
    </>
  );
}
