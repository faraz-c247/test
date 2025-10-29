"use client";

import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  ProgressBar,
} from "react-bootstrap";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  useUserCreditsQuery,
  useUserTransactionsQuery,
} from "@/hooks/useSubscription";
import { useUserReports } from "@/hooks/useProperty";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function UserDashboard() {
  const { data: session } = useSession();

  // Fetch real data
  const { data: creditsData, isLoading: creditsLoading } =
    useUserCreditsQuery();
  const { data: transactionsData } = useUserTransactionsQuery({
    page: 1,
    limit: 5,
  }); // Get recent 5 transactions
  const { data: reportsData, isLoading: reportsLoading } = useUserReports(1, 5); // Get recent 5 reports

  const credits = creditsData?.data;
  const recentTransactions = transactionsData?.data?.transactions || [];
  const recentReports = reportsData?.data?.reports || [];

  // Calculate stats
  const totalReports = reportsData?.data?.total || 0;
  const availableCredits = credits?.remainingCredits || 0;
  const thisMonthReports = recentReports.filter((report) => {
    const reportDate = new Date(report.createdAt);
    const now = new Date();
    return (
      reportDate.getMonth() === now.getMonth() &&
      reportDate.getFullYear() === now.getFullYear()
    );
  }).length;

  // Get current plan from most recent transaction
  const currentPlan = recentTransactions[0]?.metadata?.planName || "Starter";

  // Format date helper
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
                    👋 Welcome back, {session?.user?.name || "User"}!
                  </h3>
                  <p className="text-secondary-custom mb-0">
                    Ready to analyze your next property? Here's your account
                    overview.
                  </p>
                </Col>
                <Col xs="auto">
                  <div className="d-flex gap-2">
                    <span className="badge-figma-green">🟢 Account Active</span>
                    <span className="role-badge-user">👤 User</span>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>

      {/* Account Overview Cards */}
      <Row className="mb-4">
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
              <h5 className="text-primary-custom fw-bold">Reports Generated</h5>
              {reportsLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <h2 className="text-green mb-2">{totalReports}</h2>
                  <div className="d-flex justify-content-center gap-2">
                    <span className="badge-figma-orange">
                      +{thisMonthReports} this month
                    </span>
                  </div>
                </>
              )}
              <Button
                as={Link}
                href="/my-reports"
                className="btn-outline-gradient mt-3 w-100"
                style={{ fontSize: "14px" }}
              >
                📋 View Reports
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
                <span style={{ fontSize: "24px", color: "white" }}>💳</span>
              </div>
            </div>
            <div className="p-4 text-center">
              <h5 className="text-primary-custom fw-bold">Available Credits</h5>
              {creditsLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <h2 className="text-green mb-2">{availableCredits}</h2>
                  <div className="d-flex justify-content-center gap-2">
                    <span
                      className={`badge-figma-${
                        availableCredits > 0 ? "green" : "orange"
                      }`}
                    >
                      {availableCredits > 0
                        ? "Ready to use"
                        : "Need more credits"}
                    </span>
                  </div>
                </>
              )}
              <Button
                as={Link}
                href="/my-credits"
                className="btn-outline-gradient mt-3 w-100"
                style={{ fontSize: "14px" }}
              >
                💳 View Credits
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
              <h5 className="text-primary-custom fw-bold">Current Plan</h5>
              <h2 className="text-green mb-2">{currentPlan}</h2>
              <div className="d-flex justify-content-center gap-2">
                <span className="badge-figma-green">
                  {credits?.totalCredits || 0} Credits Total
                </span>
              </div>
              <Button
                as={Link}
                href="/purchase-plans"
                className="btn-outline-gradient mt-3 w-100"
                style={{ fontSize: "14px" }}
              >
                🛒 Upgrade Plan
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
                <span style={{ fontSize: "24px", color: "white" }}>📅</span>
              </div>
            </div>
            <div className="p-4 text-center">
              <h5 className="text-primary-custom fw-bold">Credits Validity</h5>
              {creditsLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  {credits?.expirationDate ? (
                    <>
                      <h2 className="text-green mb-2">
                        {formatDate(credits.expirationDate)}
                      </h2>
                      <div className="d-flex justify-content-center gap-2">
                        <span className="badge-figma-orange">Expires</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-green mb-2">♾️</h2>
                      <div className="d-flex justify-content-center gap-2">
                        <span className="badge-figma-green">Never expires</span>
                      </div>
                    </>
                  )}
                </>
              )}
              <Button
                as={Link}
                href="/my-credits"
                className="btn-outline-gradient mt-3 w-100"
                style={{ fontSize: "14px" }}
              >
                📅 View Validity
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
              <h4 className="text-primary-custom mb-0">🚀 Quick Actions</h4>
              <p className="text-secondary-custom mb-0 mt-1">
                Get started with your next property analysis
              </p>
            </div>
            <div className="p-4">
              <Row className="g-3">
                <Col md={6}>
                  <Button
                    as={Link}
                    href="/generate-report"
                    className="btn-primary-gradient w-100 d-flex align-items-center justify-content-center"
                    style={{ height: "80px", fontSize: "18px" }}
                    disabled={availableCredits === 0}
                  >
                    <span className="me-3" style={{ fontSize: "32px" }}>
                      📊
                    </span>
                    <div>
                      <div className="fw-bold">Generate New Report</div>
                      <small style={{ opacity: 0.8 }}>
                        {availableCredits > 0
                          ? "Analyze your property in 60 seconds"
                          : "Need credits to generate reports"}
                      </small>
                    </div>
                  </Button>
                </Col>
                <Col md={6}>
                  <Button
                    as={Link}
                    href="/purchase-plans"
                    className="btn-outline-gradient w-100 d-flex align-items-center justify-content-center"
                    style={{ height: "80px", fontSize: "18px" }}
                  >
                    <span className="me-3" style={{ fontSize: "32px" }}>
                      🛒
                    </span>
                    <div>
                      <div className="fw-bold">Buy More Credits</div>
                      <small style={{ opacity: 0.8 }}>
                        Expand your analysis capacity
                      </small>
                    </div>
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>

      {/* Recent Reports & Account Info */}
      <Row>
        <Col lg={8}>
          <div className="table-container-figma h-100">
            <div className="table-header-figma">
              <h4 className="text-primary-custom mb-0">📋 Recent Reports</h4>
              <p className="text-secondary-custom mb-0 mt-1">
                Your latest property analysis reports
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
                              className="action-btn action-btn-edit"
                              title="Download PDF"
                            >
                              📥
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
                      You haven't generated any reports yet. Start by analyzing
                      your first property!
                    </p>
                    <Button
                      as={Link}
                      href="/generate-report"
                      className="btn-primary-gradient"
                      disabled={availableCredits === 0}
                    >
                      {availableCredits > 0
                        ? "Generate Your First Report"
                        : "Buy Credits to Get Started"}
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
              <h4 className="text-primary-custom mb-0">💳 Recent Purchases</h4>
              <p className="text-secondary-custom mb-0 mt-1">
                Your latest credit purchases
              </p>
            </div>
            <div className="p-4">
              {recentTransactions.length > 0 ? (
                <div className="space-y-3">
                  {recentTransactions.slice(0, 3).map((transaction, index) => (
                    <div
                      key={transaction.id || index}
                      className="d-flex justify-content-between align-items-center py-3 border-bottom"
                    >
                      <div>
                        <div className="fw-medium text-primary-custom">
                          {transaction.metadata?.planName || "Credit Purchase"}
                        </div>
                        <small className="text-secondary-custom">
                          {formatDate(transaction.createdAt)}
                        </small>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold text-green">
                          +{transaction.metadata?.totalCredits || 0} credits
                        </div>
                        <small className="text-secondary-custom">
                          ${(transaction.amount || 0).toFixed(2)}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="mb-3">💳</div>
                  <p className="text-secondary-custom mb-3">No purchases yet</p>
                  <Button
                    as={Link}
                    href="/purchase-plans"
                    className="btn-outline-gradient btn-sm"
                  >
                    Buy Your First Plan
                  </Button>
                </div>
              )}

              {recentTransactions.length > 0 && (
                <div className="mt-4 text-center">
                  <Button
                    as={Link}
                    href="/my-credits"
                    className="btn-outline-gradient w-100"
                  >
                    View All Transactions
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
