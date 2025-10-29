"use client";

import React from "react";
import { ConfirmModal } from "./Modal";

interface LogoutConfirmModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function LogoutConfirmModal({
  show,
  onHide,
  onConfirm,
  isLoading = false,
}: LogoutConfirmModalProps) {
  return (
    <ConfirmModal
      show={show}
      onHide={onHide}
      onConfirm={onConfirm}
      title="Confirm Logout"
      message="Are you sure you want to logout? You will need to sign in again to access your account."
      variant="warning"
      confirmText="Logout"
      cancelText="Cancel"
      loading={isLoading}
    />
  );
}
