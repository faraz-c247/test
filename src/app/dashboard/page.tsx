"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Container } from "react-bootstrap";
import SidebarLayout from "@/components/common/SidebarLayout";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import AdminDashboard from "@/components/admin/AdminDashboard";
import UserDashboard from "@/components/user/UserDashboard";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    console.log("Dashboard: Session status:", status, "Session:", session);

    // Don't redirect if we're in the middle of logging out
    if (isLoggingOut) {
      console.log("Dashboard: Logout in progress, skipping redirect check");
      return;
    }

    // Wait for session to be determined
    if (status === "loading") return;

    // Check if session is invalid or expired
    if (
      status === "unauthenticated" ||
      !session ||
      !session.user?.id ||
      session.user?.id === "" ||
      (session.expires && new Date(session.expires) < new Date())
    ) {
      console.log("Dashboard: No valid session, redirecting to login");
      router.push("/login?message=Please log in to access the dashboard");
      return;
    }
  }, [session, status, router, isLoggingOut]);

  // Show loading while session is being determined
  if (status === "loading" || isLoggingOut) {
    return (
      <SidebarLayout>
        <div className="main-content-figma">
          <Container className="py-5">
            <div className="table-empty-state">
              <div
                className="spinner-figma mx-auto mb-3"
                style={{ width: "48px", height: "48px" }}
              ></div>
              <h5 className="text-primary-custom">
                {isLoggingOut ? "Logging out..." : "Loading Dashboard..."}
              </h5>
              <p className="text-secondary-custom">
                {isLoggingOut
                  ? "Please wait while we securely log you out."
                  : "Please wait while we prepare your dashboard."}
              </p>
            </div>
          </Container>
        </div>
      </SidebarLayout>
    );
  }

  // If no session after loading, don't render anything (redirect will happen)
  if (!session) {
    return null;
  }

  const userRole = session.role || 2;

  return (
    <SidebarLayout>
      <div className="main-content-figma fade-in">
        {/* Dashboard Header */}
        <div className="table-container-figma mb-4">
          <div className="table-header-figma">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h3 className="text-primary-custom mb-1">
                  {userRole === 1 ? "🏛️ Admin Dashboard" : "📊 User Dashboard"}
                </h3>
                <p className="text-secondary-custom mb-0">
                  {userRole === 1
                    ? "Comprehensive platform overview and management tools"
                    : "Your rental intelligence command center"}
                </p>
              </div>
              <div className="d-flex align-items-center gap-3">
                <span className="badge-figma-green">🟢 Online</span>
                {userRole === 1 ? (
                  <span className="role-badge-admin">Admin Access</span>
                ) : (
                  <span className="role-badge-user">User Access</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <Container fluid>
          {userRole === 1 ? <AdminDashboard /> : <UserDashboard />}
        </Container>
      </div>
    </SidebarLayout>
  );
}
