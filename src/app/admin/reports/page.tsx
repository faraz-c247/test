"use client";

import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Form,
  InputGroup,
} from "react-bootstrap";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SidebarLayout from "@/components/common/SidebarLayout";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Table from "@/components/common/Table";
import { useAllReports } from "@/hooks/useAdmin";
import { FaSearch, FaFilter, FaDownload, FaEye, FaTrash } from "react-icons/fa";

export default function AdminReportsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const pageSize = 20;

  // Fetch reports data
  const {
    data: reportsData,
    isLoading,
    error,
  } = useAllReports(currentPage, pageSize);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!session) {
      router.push("/login");
    } else if (session.role !== 1) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (!session) {
    return (
      <SidebarLayout>
        <Container fluid className="py-4">
          <div className="text-center">
            <LoadingSpinner size="lg" />
          </div>
        </Container>
      </SidebarLayout>
    );
  }

  if (session.role !== 1) {
    return (
      <SidebarLayout>
        <Container fluid className="py-4">
          <div className="text-center">
            <div className="alert alert-danger">
              <h4>Access Denied</h4>
              <p>You don't have permission to access this page.</p>
              <Button
                onClick={() => router.push("/dashboard")}
                variant="primary"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </Container>
      </SidebarLayout>
    );
  }

  const reports = reportsData?.data?.reports || [];
  const totalReports = reportsData?.data?.total || 0;
  const totalPages = Math.ceil(totalReports / pageSize);

  // Filter reports based on search and filters
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      !searchTerm ||
      report.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter;

    const matchesType =
      typeFilter === "all" ||
      report.propertyDetails?.propertyType?.toLowerCase() ===
        typeFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate stats
  const completedReports = reports.filter(
    (r) => r.status === "completed"
  ).length;
  const processingReports = reports.filter(
    (r) => r.status === "analyzing" || r.status === "processing"
  ).length;
  const failedReports = reports.filter((r) => r.status === "failed").length;

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge bg="success">✅ Completed</Badge>;
      case "analyzing":
      case "processing":
        return <Badge bg="warning">⏳ Processing</Badge>;
      case "failed":
        return <Badge bg="danger">❌ Failed</Badge>;
      default:
        return <Badge bg="secondary">🔄 Unknown</Badge>;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewReport = (reportId: string) => {
    // Navigate to report details
    router.push(`/admin/reports/${reportId}`);
  };

  const handleDownloadReport = (reportId: string) => {
    // Download report logic
    console.log("Download report:", reportId);
  };

  const handleDeleteReport = (reportId: string) => {
    // Delete report logic
    console.log("Delete report:", reportId);
  };

  return (
    <SidebarLayout>
      <div className="main-content-figma">
        <Container fluid className="py-4">
          {/* Header */}
          <Row className="mb-4">
            <Col>
              <div className="table-container-figma">
                <div className="table-header-figma">
                  <Row className="align-items-center">
                    <Col>
                      <h3 className="text-primary-custom mb-1">
                        📊 All User Reports
                      </h3>
                      <p className="text-secondary-custom mb-0">
                        Monitor and manage property analysis reports from all
                        users
                      </p>
                    </Col>
                    <Col xs="auto">
                      <div className="d-flex gap-2">
                        <span className="badge-figma-green">
                          {totalReports.toLocaleString()} Total Reports
                        </span>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>

          {/* Stats Cards */}
          <Row className="mb-4">
            <Col lg={3} md={6} className="mb-3">
              <div className="card-figma h-100 slide-up">
                <div className="card-figma-header text-center">
                  <div
                    className="icon-figma mx-auto mb-2"
                    style={{ width: "48px", height: "48px" }}
                  >
                    <span style={{ fontSize: "24px", color: "white" }}>✅</span>
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h5 className="text-primary-custom fw-bold">Completed</h5>
                  <h2 className="text-green mb-2">{completedReports}</h2>
                  <div className="d-flex justify-content-center gap-2">
                    <span className="badge-figma-green">Success</span>
                  </div>
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
                    <span style={{ fontSize: "24px", color: "white" }}>⏳</span>
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h5 className="text-primary-custom fw-bold">Processing</h5>
                  <h2 className="text-orange mb-2">{processingReports}</h2>
                  <div className="d-flex justify-content-center gap-2">
                    <span className="badge-figma-orange">In Progress</span>
                  </div>
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
                    <span style={{ fontSize: "24px", color: "white" }}>❌</span>
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h5 className="text-primary-custom fw-bold">Failed</h5>
                  <h2 className="text-red mb-2">{failedReports}</h2>
                  <div className="d-flex justify-content-center gap-2">
                    <span className="badge-figma-red">Error</span>
                  </div>
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
                  <h2 className="text-green mb-2">{totalReports}</h2>
                  <div className="d-flex justify-content-center gap-2">
                    <span className="badge-figma-green">All Time</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {/* Filters and Search */}
          <Row className="mb-4">
            <Col>
              <div className="table-container-figma">
                <div className="p-4">
                  <Row className="g-3">
                    <Col md={4}>
                      <InputGroup>
                        <InputGroup.Text>
                          <FaSearch />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="Search by property address, user name, or email..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </InputGroup>
                    </Col>
                    <Col md={3}>
                      <Form.Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="all">All Statuses</option>
                        <option value="completed">Completed</option>
                        <option value="analyzing">Processing</option>
                        <option value="failed">Failed</option>
                      </Form.Select>
                    </Col>
                    <Col md={3}>
                      <Form.Select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                      >
                        <option value="all">All Property Types</option>
                        <option value="single family">Single Family</option>
                        <option value="condo">Condo</option>
                        <option value="townhouse">Townhouse</option>
                        <option value="multi-family">Multi-Family</option>
                      </Form.Select>
                    </Col>
                    <Col md={2}>
                      <Button
                        variant="outline-secondary"
                        className="w-100"
                        onClick={() => {
                          setSearchTerm("");
                          setStatusFilter("all");
                          setTypeFilter("all");
                        }}
                      >
                        <FaFilter className="me-2" />
                        Clear
                      </Button>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>

          {/* Reports Table */}
          <Row>
            <Col>
              <div className="table-container-figma">
                <div className="table-header-figma">
                  <h4 className="text-primary-custom mb-0">
                    Reports ({filteredReports.length})
                  </h4>
                  <p className="text-secondary-custom mb-0 mt-1">
                    {searchTerm ||
                    statusFilter !== "all" ||
                    typeFilter !== "all"
                      ? "Filtered results"
                      : "All property analysis reports"}
                  </p>
                </div>
                <div className="table-figma">
                  {isLoading ? (
                    <div className="p-4 text-center">
                      <LoadingSpinner size="lg" />
                    </div>
                  ) : error ? (
                    <div className="p-4 text-center">
                      <div className="alert alert-danger">
                        <h5>Error Loading Reports</h5>
                        <p>Failed to load reports. Please try again.</p>
                        <Button
                          variant="primary"
                          onClick={() => window.location.reload()}
                        >
                          Retry
                        </Button>
                      </div>
                    </div>
                  ) : filteredReports.length > 0 ? (
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
                        {filteredReports.map((report, index) => (
                          <tr key={report.id || index}>
                            <td>
                              <div className="d-flex align-items-center">
                                <span className="me-2">👤</span>
                                <div>
                                  <div className="fw-medium text-primary-custom">
                                    {report.userId?.name || "Unknown User"}
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
                                      "Property Address"}
                                  </div>
                                  <small className="text-secondary-custom">
                                    {report.address?.city &&
                                    report.address?.state
                                      ? `${report.address.city}, ${report.address.state}`
                                      : "Location"}
                                  </small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge-figma-outline">
                                {report.propertyDetails?.propertyType ||
                                  "Property"}
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
                            <td>{getStatusBadge(report.status)}</td>
                            <td>
                              <div className="action-buttons">
                                <button
                                  className="action-btn action-btn-edit"
                                  title="View Report"
                                  onClick={() => handleViewReport(report.id)}
                                >
                                  <FaEye />
                                </button>
                                <button
                                  className="action-btn action-btn-edit"
                                  title="Download Report"
                                  onClick={() =>
                                    handleDownloadReport(report.id)
                                  }
                                >
                                  <FaDownload />
                                </button>
                                <button
                                  className="action-btn action-btn-delete"
                                  title="Delete Report"
                                  onClick={() => handleDeleteReport(report.id)}
                                >
                                  <FaTrash />
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
                          {searchTerm ||
                          statusFilter !== "all" ||
                          typeFilter !== "all"
                            ? "No Reports Match Your Filters"
                            : "No Reports Yet"}
                        </h4>
                        <p className="text-secondary-custom mb-4">
                          {searchTerm ||
                          statusFilter !== "all" ||
                          typeFilter !== "all"
                            ? "Try adjusting your search criteria or filters."
                            : "No users have generated reports yet. Encourage users to start analyzing properties!"}
                        </p>
                        <Button
                          variant="outline-secondary"
                          onClick={() => {
                            setSearchTerm("");
                            setStatusFilter("all");
                            setTypeFilter("all");
                          }}
                        >
                          Clear Filters
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="p-4 border-top">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="text-secondary-custom">
                        Showing {(currentPage - 1) * pageSize + 1} to{" "}
                        {Math.min(currentPage * pageSize, totalReports)} of{" "}
                        {totalReports} reports
                      </div>
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          disabled={currentPage === 1}
                          onClick={() => handlePageChange(currentPage - 1)}
                        >
                          Previous
                        </Button>
                        {[...Array(Math.min(5, totalPages))].map((_, index) => {
                          const page = index + 1;
                          return (
                            <Button
                              key={page}
                              variant={
                                currentPage === page
                                  ? "primary"
                                  : "outline-secondary"
                              }
                              size="sm"
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </Button>
                          );
                        })}
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          disabled={currentPage === totalPages}
                          onClick={() => handlePageChange(currentPage + 1)}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </SidebarLayout>
  );
}
