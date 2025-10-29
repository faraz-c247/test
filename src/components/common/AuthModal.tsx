"use client";

import React, { useState } from "react";
import SigninForm from "./SigninForm";
import SignupForm from "./SignupForm";
import {
  loginSchema,
  signupSchema,
  LoginFormData,
  SignupFormData,
} from "@/lib/validationSchemas";
import { useLogin, useSignup } from "@/hooks/useAuth";

interface AuthModalProps {
  initialMode?: "signin" | "signup";
  showInitially?: boolean;
  onClose?: () => void;
}

export default function AuthModal({
  initialMode = "signin",
  showInitially = false,
  onClose,
}: AuthModalProps) {
  const [showSigninModal, setShowSigninModal] = useState(
    initialMode === "signin" && showInitially
  );
  const [showSignupModal, setShowSignupModal] = useState(
    initialMode === "signup" && showInitially
  );

  const loginMutation = useLogin();
  const signupMutation = useSignup();

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

  const handleCloseSignin = () => {
    setShowSigninModal(false);
    if (onClose) onClose();
  };

  const handleCloseSignup = () => {
    setShowSignupModal(false);
    if (onClose) onClose();
  };

  const handleSwitchToSignup = () => {
    setShowSigninModal(false);
    setShowSignupModal(true);
  };

  const handleSwitchToSignin = () => {
    setShowSignupModal(false);
    setShowSigninModal(true);
  };

  // Expose functions to open modals
  const openSignin = () => {
    setShowSignupModal(false);
    setShowSigninModal(true);
  };

  const openSignup = () => {
    setShowSigninModal(false);
    setShowSignupModal(true);
  };

  // Expose these functions through refs
  React.useImperativeHandle(
    React.forwardRef(() => null),
    () => ({
      openSignin,
      openSignup,
    })
  );

  return (
    <>
      <SigninForm
        show={showSigninModal}
        onHide={handleCloseSignin}
        onSubmit={handleSigninSubmit}
        validationSchema={loginSchema}
        error={loginMutation.error?.message}
        loading={loginMutation.isPending}
        onSignupClick={handleSwitchToSignup}
      />

      <SignupForm
        show={showSignupModal}
        onHide={handleCloseSignup}
        onSubmit={handleSignupSubmit}
        validationSchema={signupSchema}
        error={signupMutation.error?.message}
        loading={signupMutation.isPending}
      />
    </>
  );
}

// Hook to control AuthModal from parent components
export function useAuthModal() {
  const [showSigninModal, setShowSigninModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const openSignin = () => {
    setShowSignupModal(false);
    setShowSigninModal(true);
  };

  const openSignup = () => {
    setShowSigninModal(false);
    setShowSignupModal(true);
  };

  const closeAll = () => {
    setShowSigninModal(false);
    setShowSignupModal(false);
  };

  return {
    showSigninModal,
    showSignupModal,
    openSignin,
    openSignup,
    closeAll,
  };
}
