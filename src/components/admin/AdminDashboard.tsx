"use client";

import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Table,
} from "react-bootstrap";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  useAdminStats,
  useAllUsers,
  useAllReports,
  useSystemHealth,
  useCalculatedAdminStats,
} from "@/hooks/useAdmin";
import { useUserTransactionsQuery } from "@/hooks/useSubscription";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function AdminDashboard() {
  const { data: session } = useSession();

  // Fetch admin data - try real API first, fallback to calculated stats
  const {
    data: adminStatsData,
    isLoading: statsLoading,
    error: statsError,
  } = useAdminStats();
  const { data: usersData, isLoading: usersLoading } = useAllUsers(1, 10);
  const { data: reportsData, isLoading: reportsLoading } = useAllReports(1, 10);
  const { data: systemHealthData } = useSystemHealth();
  const { data: transactionsData } = useUserTransactionsQuery({
    page: 1,
    limit: 10,
  });

  // Fallback to calculated stats if API doesn't provide them yet
  const calculatedStats = useCalculatedAdminStats();

  // Use API stats if available, otherwise use calculated stats
  const stats = adminStatsData?.data || calculatedStats.data || {
    totalUsers: 0,
    activeUsers: 0,
    totalReports: 0,
    reportsToday: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalCredits: 0,
    activeSubscriptions: 0
  };
  const isLoadingStats = statsLoading || calculatedStats.isLoading;

  const recentUsers = usersData?.data?.users || [];
  const recentReports = reportsData?.data?.reports || [];
  const recentTransactions = transactionsData?.data?.transactions || [];
  const systemHealth = systemHealthData?.data;

  // Calculate this week's new users
  const thisWeekUsers = recentUsers.filter((user) => {
    const userDate = new Date(user.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return userDate > weekAgo;
  }).length;

  // Calculate this week's reports
  const thisWeekReports = recentReports.filter((report) => {
    const reportDate = new Date(report.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return reportDate > weekAgo;
  }).length;

  // Calculate total revenue from transactions
  const totalRevenue = recentTransactions.reduce(
    (sum, transaction) => sum + (transaction.amount || 0),
    0
  );
  const thisMonthRevenue = recentTransactions
    .filter((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      const now = new Date();
      return (
        transactionDate.getMonth() === now.getMonth() &&
        transactionDate.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, transaction) => sum + (transaction.amount || 0), 0);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    return `${diffInDays} days ago`;
  };

  return (
    <div className="fade-in">
      {/* Welcome Section */}
      <Row className="mb-4">
        <Col>
          <div className="table-container-figma">
            <div className="table-header-figma">
              <Row className="align-items-center">
                <Col>
                  <h3 className="text-primary-custom mb-1">
                    👋 Welcome back, {session?.user?.name || "Administrator"}!
                  </h3>
                  <p className="text-secondary-custom mb-0">
                    Here's what's happening with your rental intelligence
                    platform today.
                  </p>
                </Col>
                <Col xs="auto">
                  <div className="d-flex gap-2">
                    <span
                      className={`badge-figma-${
                        systemHealth?.systemHealth === "Excellent"
                          ? "green"
                          : "orange"
                      }`}
                    >
                      🟢{" "}
                      {systemHealth?.systemHealth || "All Systems Operational"}
                    </span>
                    <span className="role-badge-admin">👑 Administrator</span>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>

      {/* Key Metrics Cards */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <div className="card-figma h-100 slide-up">
            <div className="card-figma-header text-center">
              <div
                className="icon-figma mx-auto mb-2"
                style={{ width: "48px", height: "48px" }}
              >
                <span style={{ fontSize: "24px", color: "white" }}>👥</span>
              </div>
            </div>
            <div className="p-4 text-center">
              <h5 className="text-primary-custom fw-bold">Total Users</h5>
              {isLoadingStats || usersLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <h2 className="text-green mb-2">
                    {(stats.totalUsers || 0).toLocaleString()}
                  </h2>
                  <div className="d-flex justify-content-center gap-2">
                    <span className="badge-figma-green">
                      +{thisWeekUsers} this week
                    </span>
                  </div>
                </>
              )}
              <Button
                as={Link}
                href="/admin/user-management"
                className="btn-outline-gradient mt-3 w-100"
                style={{ fontSize: "14px" }}
              >
                👥 Manage Users
              </Button>
            </div>
          </div>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <div className="card-figma h-100 slide-up">
            <div className="card-figma-header text-center">
              <div
                className="icon-figma mx-auto mb-2"
                style={{ width: "48px", height: "48px" }}
              >
                <span style={{ fontSize: "24px", color: "white" }}>📊</span>
              </div>
            </div>
            <div className="p-4 text-center">
              <h5 className="text-primary-custom fw-bold">Total Reports</h5>
              {isLoadingStats || reportsLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <h2 className="text-green mb-2">
                    {(stats.totalReports || 0).toLocaleString()}
                  </h2>
                  <div className="d-flex justify-content-center gap-2">
                    <span className="badge-figma-orange">
                      +{thisWeekReports} this week
                    </span>
                  </div>
                </>
              )}
              <Button
                as={Link}
                href="/admin/reports"
                className="btn-outline-gradient mt-3 w-100"
                style={{ fontSize: "14px" }}
              >
                📊 View All Reports
              </Button>
            </div>
          </div>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <div className="card-figma h-100 slide-up">
            <div className="card-figma-header text-center">
              <div
                className="icon-figma mx-auto mb-2"
                style={{ width: "48px", height: "48px" }}
              >
                <span style={{ fontSize: "24px", color: "white" }}>💰</span>
              </div>
            </div>
            <div className="p-4 text-center">
              <h5 className="text-primary-custom fw-bold">Revenue</h5>
              <h2 className="text-green mb-2">
                {formatCurrency(totalRevenue)}
              </h2>
              <div className="d-flex justify-content-center gap-2">
                <span className="badge-figma-green">
                  {formatCurrency(thisMonthRevenue)} this month
                </span>
              </div>
              <Button
                as={Link}
                href="/admin/invoices"
                className="btn-outline-gradient mt-3 w-100"
                style={{ fontSize: "14px" }}
              >
                🧾 View Invoices
              </Button>
            </div>
          </div>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <div className="card-figma h-100 slide-up">
            <div className="card-figma-header text-center">
              <div
                className="icon-figma mx-auto mb-2"
                style={{ width: "48px", height: "48px" }}
              >
                <span style={{ fontSize: "24px", color: "white" }}>⚡</span>
              </div>
            </div>
            <div className="p-4 text-center">
              <h5 className="text-primary-custom fw-bold">Active Users</h5>
              {isLoadingStats ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <h2 className="text-green mb-2">
                    {(stats.activeUsers || 0).toLocaleString()}
                  </h2>
                  <div className="d-flex justify-content-center gap-2">
                    <span className="badge-figma-green">
                      {(stats.totalUsers || 0) > 0
                        ? Math.round(
                            ((stats.activeUsers || 0) / (stats.totalUsers || 1)) * 100
                          )
                        : 0}
                      % active
                    </span>
                  </div>
                </>
              )}
              <Button
                as={Link}
                href="/admin/user-management"
                className="btn-outline-gradient mt-3 w-100"
                style={{ fontSize: "14px" }}
              >
                📈 View Activity
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col>
          <div className="table-container-figma">
            <div className="table-header-figma">
              <h4 className="text-primary-custom mb-0">
                🚀 Quick Admin Actions
              </h4>
              <p className="text-secondary-custom mb-0 mt-1">
                Manage your platform efficiently
              </p>
            </div>
            <div className="p-4">
              <Row className="g-3">
                <Col md={3}>
                  <Button
                    as={Link}
                    href="/admin/user-management"
                    className="btn-primary-gradient w-100 d-flex align-items-center justify-content-center"
                    style={{ height: "80px", fontSize: "16px" }}
                  >
                    <span className="me-2" style={{ fontSize: "24px" }}>
                      👥
                    </span>
                    <div>
                      <div className="fw-bold">Manage Users</div>
                      <small style={{ opacity: 0.8 }}>
                        Add, edit, or remove users
                      </small>
                    </div>
                  </Button>
                </Col>
                <Col md={3}>
                  <Button
                    as={Link}
                    href="/admin/reports"
                    className="btn-outline-gradient w-100 d-flex align-items-center justify-content-center"
                    style={{ height: "80px", fontSize: "16px" }}
                  >
                    <span className="me-2" style={{ fontSize: "24px" }}>
                      📊
                    </span>
                    <div>
                      <div className="fw-bold">View All Reports</div>
                      <small style={{ opacity: 0.8 }}>
                        Monitor user reports
                      </small>
                    </div>
                  </Button>
                </Col>
                <Col md={3}>
                  <Button
                    as={Link}
                    href="/admin/invoices"
                    className="btn-outline-gradient w-100 d-flex align-items-center justify-content-center"
                    style={{ height: "80px", fontSize: "16px" }}
                  >
                    <span className="me-2" style={{ fontSize: "24px" }}>
                      🧾
                    </span>
                    <div>
                      <div className="fw-bold">Billing</div>
                      <small style={{ opacity: 0.8 }}>Manage invoices</small>
                    </div>
                  </Button>
                </Col>
                <Col md={3}>
                  <Button
                    as={Link}
                    href="/admin/settings"
                    className="btn-outline-gradient w-100 d-flex align-items-center justify-content-center"
                    style={{ height: "80px", fontSize: "16px" }}
                  >
                    <span className="me-2" style={{ fontSize: "24px" }}>
                      ⚙️
                    </span>
                    <div>
                      <div className="fw-bold">Settings</div>
                      <small style={{ opacity: 0.8 }}>
                        Platform configuration
                      </small>
                    </div>
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>

      {/* Recent Reports & User Activity */}
      <Row>
        <Col lg={8}>
          <div className="table-container-figma h-100">
            <div className="table-header-figma">
              <h4 className="text-primary-custom mb-0">
                📊 Recent Reports (All Users)
              </h4>
              <p className="text-secondary-custom mb-0 mt-1">
                Latest property analysis reports from all users
              </p>
            </div>
            <div className="table-figma">
              {reportsLoading ? (
                <div className="p-4 text-center">
                  <LoadingSpinner size="lg" />
                </div>
              ) : recentReports.length > 0 ? (
                <table className="table mb-0">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Generated</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentReports.map((report, index) => (
                      <tr key={report.id || index}>
                        <td>
                          <div className="d-flex align-items-center">
                            <span className="me-2">👤</span>
                            <div>
                              <div className="fw-medium text-primary-custom">
                                {report.userId?.name ||
                                  report.userId ||
                                  "Unknown User"}
                              </div>
                              <small className="text-secondary-custom">
                                {report.userId?.email || "No email"}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <span className="me-2">🏠</span>
                            <div>
                              <div className="fw-medium text-primary-custom">
                                {report.address?.street ||
                                  report.address ||
                                  "Property"}
                              </div>
                              <small className="text-secondary-custom">
                                {report.address?.city && report.address?.state
                                  ? `${report.address.city}, ${report.address.state}`
                                  : "Location"}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge-figma-outline">
                            {report.propertyDetails?.propertyType || "Property"}
                          </span>
                        </td>
                        <td>
                          <div className="text-primary-custom">
                            {formatDate(report.createdAt)}
                          </div>
                          <small className="text-secondary-custom">
                            {formatTimeAgo(report.createdAt)}
                          </small>
                        </td>
                        <td>
                          <span
                            className={`status-badge-${
                              report.status === "completed"
                                ? "active"
                                : report.status === "analyzing"
                                ? "pending"
                                : "inactive"
                            }`}
                          >
                            {report.status || "Processing"}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="action-btn action-btn-edit"
                              title="View Report"
                            >
                              👁️
                            </button>
                            <button
                              className="action-btn action-btn-delete"
                              title="Delete Report"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="table-empty-state">
                  <div className="text-center py-5">
                    <div className="display-1 mb-4">📊</div>
                    <h4 className="text-secondary-custom mb-3">
                      No Reports Yet
                    </h4>
                    <p className="text-secondary-custom mb-4">
                      No users have generated reports yet. Encourage users to
                      start analyzing properties!
                    </p>
                    <Button
                      as={Link}
                      href="/admin/user-management"
                      className="btn-primary-gradient"
                    >
                      Manage Users
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Col>

        <Col lg={4}>
          <div className="table-container-figma h-100">
            <div className="table-header-figma">
              <h4 className="text-primary-custom mb-0">👥 Recent Users</h4>
              <p className="text-secondary-custom mb-0 mt-1">
                Newly registered users
              </p>
            </div>
            <div className="p-4">
              {usersLoading ? (
                <div className="text-center py-4">
                  <LoadingSpinner size="lg" />
                </div>
              ) : recentUsers.length > 0 ? (
                <div className="space-y-3">
                  {recentUsers.slice(0, 5).map((user, index) => (
                    <div
                      key={user.id || index}
                      className="d-flex justify-content-between align-items-center py-3 border-bottom"
                    >
                      <div>
                        <div className="fw-medium text-primary-custom">
                          {user.name || "Unknown User"}
                        </div>
                        <small className="text-secondary-custom">
                          {user.email}
                        </small>
                        <div className="mt-1">
                          <span
                            className={`badge-figma-${
                              user.isVerified ? "green" : "orange"
                            }`}
                          >
                            {user.isVerified ? "✅ Verified" : "⏳ Pending"}
                          </span>
                        </div>
                      </div>
                      <div className="text-end">
                        <div className="text-secondary-custom">
                          {formatDate(user.createdAt)}
                        </div>
                        <small className="text-secondary-custom">
                          {formatTimeAgo(user.createdAt)}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="mb-3">👥</div>
                  <p className="text-secondary-custom mb-3">No users yet</p>
                  <Button
                    as={Link}
                    href="/admin/user-management"
                    className="btn-outline-gradient btn-sm"
                  >
                    Manage Users
                  </Button>
                </div>
              )}

              {recentUsers.length > 0 && (
                <div className="mt-4 text-center">
                  <Button
                    as={Link}
                    href="/admin/user-management"
                    className="btn-outline-gradient w-100"
                  >
                    View All Users
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
