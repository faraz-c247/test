"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "react-bootstrap";
import Sidebar from "./Sidebar";
import { useLogout } from "@/hooks/useAuth";
import LogoutConfirmModal from "./LogoutConfirmModal";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const { data: session } = useSession();
  const logoutMutation = useLogout();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  const userRole = session?.role || 2;

  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar */}
      <Sidebar userRole={userRole} />

      {/* Main Content */}
      <div className="sidebar-layout-main">
        {/* Top Header Bar */}
        <div
          className="navbar-figma position-sticky top-0"
          style={{ zIndex: 999 }}
        >
          <div className="d-flex justify-content-between align-items-center px-4">
            <div className="d-flex align-items-center">
              {/* Mobile Menu Toggle */}
              <Button
                variant="outline-secondary"
                size="sm"
                className="d-lg-none me-3 rounded-figma-md"
              >
                ☰
              </Button>

              {/* Breadcrumb or Page Title could go here */}
              <div className="text-secondary-custom">
                Welcome back, {session?.user?.name || "User"}!
              </div>
            </div>

            {/* User Actions */}
            <div className="d-flex align-items-center gap-3">
              {/* User Profile */}
              {session && (
                <div className="d-flex align-items-center">
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
                  <div className="d-none d-md-block">
                    <div
                      className="text-primary-custom fw-medium"
                      style={{ fontSize: "14px" }}
                    >
                      {session.user?.name || "User"}
                    </div>
                    <small className="text-secondary-custom">
                      {userRole === 1 ? "Administrator" : "User"}
                    </small>
                  </div>
                </div>
              )}

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
                    <span className="d-none d-md-inline">Logging out...</span>
                  </>
                ) : (
                  <>
                    🚪 <span className="d-none d-md-inline ms-1">Logout</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-grow-1">{children}</main>

        {/* Footer */}
        <footer className="bg-green-light border-top border-figma py-3 px-4">
          <div className="text-center">
            <small className="text-secondary-custom">
              © 2025 RentIntel. All rights reserved. |
              <span className="text-green ms-1">
                Powered by AI Intelligence
              </span>
            </small>
          </div>
        </footer>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        show={showLogoutModal}
        onHide={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        isLoading={logoutMutation.isPending}
      />
    </div>
  );
}
