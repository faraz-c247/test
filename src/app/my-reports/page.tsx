"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Table,
  Form,
  InputGroup,
  Modal,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SidebarLayout from "@/components/common/SidebarLayout";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import {
  useUserProperties,
  useDeletePropertyAnalysis,
} from "@/hooks/useProperty";
import { useUserCreditsQuery } from "@/hooks/useSubscription";
import { toast } from "react-hot-toast";

interface PropertyReport {
  id: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  propertyDetails: {
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    yearBuilt?: number;
    amenities?: string[];
  };
  subscription: {
    reportType: "single" | "pro" | "enterprise";
    purchasedAt: string;
    paymentStatus: string;
    amount: number;
  };
  marketAnalysis: {
    estimatedRent: {
      min: number;
      max: number;
      recommended: number;
    };
    confidence: number;
  };
  reportData: {
    reportId: string;
    generatedAt?: string;
    accuracy: number;
  };
  status: "analyzing" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
}

export default function MyReportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<PropertyReport | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?message=Please log in to view your reports");
    }
  }, [status, router]);

  // API calls
  const {
    data: propertiesData,
    isLoading: propertiesLoading,
    error: propertiesError,
    refetch: refetchProperties,
  } = useUserProperties(currentPage, pageSize);

  const { data: creditsData, isLoading: creditsLoading } =
    useUserCreditsQuery();

  const deletePropertyMutation = useDeletePropertyAnalysis();

  // Transform backend data to match frontend interface
  const reports: PropertyReport[] = propertiesData?.data?.properties || [];

  const filteredReports = reports.filter((report) => {
    const fullAddress = `${report.address.street}, ${report.address.city}, ${report.address.state} ${report.address.zipCode}`;
    const matchesSearch =
      fullAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.propertyDetails.propertyType
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter;
    const matchesType =
      typeFilter === "all" || report.subscription.reportType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="badge-figma-green">Completed</Badge>;
      case "analyzing":
        return <Badge className="badge-figma-orange">Processing</Badge>;
      case "failed":
        return <Badge className="badge-figma-red">Failed</Badge>;
      default:
        return <Badge className="badge-figma-outline">{status}</Badge>;
    }
  };

  const getReportTypeBadge = (type: string) => {
    switch (type) {
      case "single":
        return <Badge className="badge-figma-outline">Single</Badge>;
      case "pro":
        return <Badge className="badge-figma-orange">Pro</Badge>;
      case "enterprise":
        return <Badge className="badge-figma-green">Enterprise</Badge>;
      default:
        return <Badge className="badge-figma-outline">{type}</Badge>;
    }
  };

  const handleViewReport = (report: PropertyReport) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const handleDownloadReport = (reportId: string) => {
    // TODO: Implement download functionality with backend
    console.log("Downloading report:", reportId);
    toast.success("Download started!");
  };

  const handleRegenerateReport = (reportId: string) => {
    // TODO: Implement regenerate functionality
    console.log("Regenerating report:", reportId);
    toast.info("Regenerate functionality coming soon!");
  };

  const handleDeleteReport = async (propertyId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this report? This action cannot be undone."
      )
    ) {
      try {
        await deletePropertyMutation.mutateAsync(propertyId);
        refetchProperties();
      } catch (error) {
        console.error("Failed to delete report:", error);
      }
    }
  };

  const getCompletedReportsCount = () => {
    return reports.filter((report) => report.status === "completed").length;
  };

  const getTotalReportsCount = () => {
    return reports.length;
  };

  const getProcessingReportsCount = () => {
    return reports.filter((report) => report.status === "analyzing").length;
  };

  const getCreditsUsedCount = () => {
    return reports.length; // Each report uses 1 credit
  };

  const formatAddress = (address: any) => {
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString();
  };

  if (status === "loading" || propertiesLoading || creditsLoading) {
    return (
      <SidebarLayout>
        <div className="main-content-figma">
          <Container className="py-5">
            <div className="table-empty-state">
              <LoadingSpinner size="lg" />
              <h5 className="text-primary-custom mt-3">Loading Reports...</h5>
              <p className="text-secondary-custom">
                Please wait while we fetch your property reports.
              </p>
            </div>
          </Container>
        </div>
      </SidebarLayout>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect
  }

  if (propertiesError) {
    return (
      <SidebarLayout>
        <div className="main-content-figma">
          <Container className="py-5">
            <Alert variant="danger">
              <h5>Error Loading Reports</h5>
              <p>
                Unable to load your property reports. Please try again later.
              </p>
              <Button
                variant="outline-danger"
                onClick={() => refetchProperties()}
              >
                Try Again
              </Button>
            </Alert>
          </Container>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="main-content-figma fade-in">
        <Container fluid className="py-4">
          {/* Header Section */}
          <Row className="mb-4">
            <Col>
              <div className="table-container-figma">
                <div className="table-header-figma">
                  <Row className="align-items-center">
                    <Col>
                      <h3 className="text-primary-custom mb-1">
                        📋 My Property Reports
                      </h3>
                      <p className="text-secondary-custom mb-0">
                        View and manage all your generated property analysis
                        reports.
                      </p>
                    </Col>
                    <Col xs="auto">
                      <Button
                        as={Link}
                        href="/generate-report"
                        className="btn-primary-gradient"
                      >
                        📊 Generate New Report
                      </Button>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>

          {/* Key Metrics */}
          <Row className="mb-4">
            <Col lg={3} md={6} className="mb-3">
              <div className="card-figma h-100">
                <div className="card-body p-4 text-center">
                  <div
                    className="icon-figma mx-auto mb-3"
                    style={{ width: "50px", height: "50px" }}
                  >
                    <span style={{ fontSize: "24px", color: "white" }}>📊</span>
                  </div>
                  <h5 className="text-primary-custom fw-bold">Total Reports</h5>
                  <h3 className="text-green mb-2">{getTotalReportsCount()}</h3>
                  <div className="d-flex justify-content-center gap-2">
                    <span className="badge-figma-green">All time</span>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={3} md={6} className="mb-3">
              <div className="card-figma h-100">
                <div className="card-body p-4 text-center">
                  <div
                    className="icon-figma mx-auto mb-3"
                    style={{ width: "50px", height: "50px" }}
                  >
                    <span style={{ fontSize: "24px", color: "white" }}>✅</span>
                  </div>
                  <h5 className="text-primary-custom fw-bold">Completed</h5>
                  <h3 className="text-green mb-2">
                    {getCompletedReportsCount()}
                  </h3>
                  <div className="d-flex justify-content-center gap-2">
                    <span className="badge-figma-green">Ready to view</span>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={3} md={6} className="mb-3">
              <div className="card-figma h-100">
                <div className="card-body p-4 text-center">
                  <div
                    className="icon-figma mx-auto mb-3"
                    style={{ width: "50px", height: "50px" }}
                  >
                    <span style={{ fontSize: "24px", color: "white" }}>⏳</span>
                  </div>
                  <h5 className="text-primary-custom fw-bold">Processing</h5>
                  <h3 className="text-orange mb-2">
                    {getProcessingReportsCount()}
                  </h3>
                  <div className="d-flex justify-content-center gap-2">
                    <span className="badge-figma-orange">In progress</span>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={3} md={6} className="mb-3">
              <div className="card-figma h-100">
                <div className="card-body p-4 text-center">
                  <div
                    className="icon-figma mx-auto mb-3"
                    style={{ width: "50px", height: "50px" }}
                  >
                    <span style={{ fontSize: "24px", color: "white" }}>��</span>
                  </div>
                  <h5 className="text-primary-custom fw-bold">Credits Used</h5>
                  <h3 className="text-green mb-2">{getCreditsUsedCount()}</h3>
                  <div className="d-flex justify-content-center gap-2">
                    <span className="badge-figma-green">This month</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {/* Filters and Search */}
          <Row className="mb-4">
            <Col>
              <div className="table-container-figma">
                <div className="table-header-figma">
                  <Row className="align-items-center">
                    <Col>
                      <h4 className="text-primary-custom mb-0">
                        🔍 Search & Filters
                      </h4>
                    </Col>
                  </Row>
                </div>
                <div className="p-4">
                  <Row className="g-3">
                    <Col md={6}>
                      <InputGroup>
                        <InputGroup.Text>🔍</InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="Search by property address or type..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </InputGroup>
                    </Col>
                    <Col md={2}>
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
                    <Col md={2}>
                      <Form.Select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                      >
                        <option value="all">All Types</option>
                        <option value="single">Single</option>
                        <option value="pro">Pro</option>
                        <option value="enterprise">Enterprise</option>
                      </Form.Select>
                    </Col>
                    <Col md={2}>
                      <Button
                        className="btn-outline-gradient w-100"
                        onClick={() => refetchProperties()}
                      >
                        🔄 Refresh
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
                  <h4 className="text-primary-custom mb-0">📋 All Reports</h4>
                  <p className="text-secondary-custom mb-0 mt-1">
                    Your complete property analysis history
                  </p>
                </div>
                {filteredReports.length === 0 ? (
                  <div className="p-5 text-center">
                    <div className="mb-4">
                      <span style={{ fontSize: "4rem" }}>📊</span>
                    </div>
                    <h5 className="text-primary-custom mb-3">
                      No Reports Found
                    </h5>
                    <p className="text-secondary-custom mb-4">
                      {reports.length === 0
                        ? "You haven't generated any property reports yet. Start by creating your first analysis!"
                        : "No reports match your current filters. Try adjusting your search criteria."}
                    </p>
                    {reports.length === 0 && (
                      <Button
                        as={Link}
                        href="/generate-report"
                        className="btn-primary-gradient"
                      >
                        📊 Generate Your First Report
                      </Button>
                    )}
                  </div>
                ) : (
                  <Table className="table-figma mb-0">
                    <thead>
                      <tr>
                        <th>Property</th>
                        <th>Report Type</th>
                        <th>Status</th>
                        <th>Generated</th>
                        <th>Rent Estimate</th>
                        <th>Confidence</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReports.map((report) => (
                        <tr key={report.id}>
                          <td>
                            <div className="fw-medium text-primary-custom">
                              {formatAddress(report.address)}
                            </div>
                            <small className="text-secondary-custom">
                              {report.propertyDetails.propertyType} •{" "}
                              {report.propertyDetails.bedrooms} bed,{" "}
                              {report.propertyDetails.bathrooms} bath
                            </small>
                          </td>
                          <td>
                            {getReportTypeBadge(report.subscription.reportType)}
                          </td>
                          <td>{getStatusBadge(report.status)}</td>
                          <td>
                            <div className="text-primary-custom">
                              {formatDate(report.createdAt)}
                            </div>
                            <small className="text-secondary-custom">
                              {formatTime(report.createdAt)}
                            </small>
                          </td>
                          <td>
                            {report.status === "completed" ? (
                              <div>
                                <div className="fw-medium text-green">
                                  $
                                  {report.marketAnalysis.estimatedRent.recommended.toLocaleString()}
                                </div>
                                <small className="text-secondary-custom">
                                  $
                                  {report.marketAnalysis.estimatedRent.min.toLocaleString()}{" "}
                                  - $
                                  {report.marketAnalysis.estimatedRent.max.toLocaleString()}
                                </small>
                              </div>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>
                          <td>
                            {report.status === "completed" ? (
                              <div className="d-flex align-items-center">
                                <div className="me-2">
                                  {report.marketAnalysis.confidence}%
                                </div>
                                <div
                                  className="bg-green-light rounded-figma"
                                  style={{ width: "60px", height: "8px" }}
                                >
                                  <div
                                    style={{
                                      width: `${report.marketAnalysis.confidence}%`,
                                      height: "100%",
                                      background: "var(--gradient-primary)",
                                      borderRadius: "4px",
                                    }}
                                  ></div>
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              {report.status === "completed" && (
                                <>
                                  <Button
                                    size="sm"
                                    className="btn-primary-gradient"
                                    onClick={() => handleViewReport(report)}
                                  >
                                    👁️ View
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="btn-outline-gradient"
                                    onClick={() =>
                                      handleDownloadReport(
                                        report.reportData.reportId
                                      )
                                    }
                                  >
                                    📥
                                  </Button>
                                </>
                              )}
                              {report.status === "failed" && (
                                <Button
                                  size="sm"
                                  className="btn-outline-gradient"
                                  onClick={() =>
                                    handleRegenerateReport(report.id)
                                  }
                                >
                                  🔄 Retry
                                </Button>
                              )}
                              {report.status === "analyzing" && (
                                <span className="text-muted d-flex align-items-center">
                                  <Spinner size="sm" className="me-2" />
                                  Processing...
                                </span>
                              )}
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => handleDeleteReport(report.id)}
                                disabled={deletePropertyMutation.isPending}
                              >
                                🗑️
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </div>
            </Col>
          </Row>

          {/* Report Detail Modal */}
          <Modal
            show={showReportModal}
            onHide={() => setShowReportModal(false)}
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>Property Report Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedReport && (
                <div>
                  <Row>
                    <Col md={6}>
                      <h6>Property Information</h6>
                      <p>
                        <strong>Address:</strong>{" "}
                        {formatAddress(selectedReport.address)}
                      </p>
                      <p>
                        <strong>Type:</strong>{" "}
                        {selectedReport.propertyDetails.propertyType}
                      </p>
                      <p>
                        <strong>Bedrooms:</strong>{" "}
                        {selectedReport.propertyDetails.bedrooms}
                      </p>
                      <p>
                        <strong>Bathrooms:</strong>{" "}
                        {selectedReport.propertyDetails.bathrooms}
                      </p>
                      <p>
                        <strong>Square Feet:</strong>{" "}
                        {selectedReport.propertyDetails.squareFeet.toLocaleString()}
                      </p>
                      <p>
                        <strong>Report Type:</strong>{" "}
                        {getReportTypeBadge(
                          selectedReport.subscription.reportType
                        )}
                      </p>
                      <p>
                        <strong>Generated:</strong>{" "}
                        {formatDate(selectedReport.createdAt)} at{" "}
                        {formatTime(selectedReport.createdAt)}
                      </p>
                    </Col>
                    <Col md={6}>
                      <h6>Analysis Results</h6>
                      <p>
                        <strong>Status:</strong>{" "}
                        {getStatusBadge(selectedReport.status)}
                      </p>
                      <p>
                        <strong>Confidence:</strong>{" "}
                        {selectedReport.marketAnalysis.confidence}%
                      </p>
                      <p>
                        <strong>Recommended Rent:</strong> $
                        {selectedReport.marketAnalysis.estimatedRent.recommended.toLocaleString()}
                      </p>
                      <p>
                        <strong>Range:</strong> $
                        {selectedReport.marketAnalysis.estimatedRent.min.toLocaleString()}{" "}
                        - $
                        {selectedReport.marketAnalysis.estimatedRent.max.toLocaleString()}
                      </p>
                      <p>
                        <strong>Report ID:</strong>{" "}
                        {selectedReport.reportData.reportId}
                      </p>
                      <p>
                        <strong>Accuracy:</strong>{" "}
                        {selectedReport.reportData.accuracy}%
                      </p>
                    </Col>
                  </Row>
                  <hr />
                  <div className="text-center">
                    <h5 className="text-primary-custom">Report Summary</h5>
                    <p className="text-secondary-custom">
                      This {selectedReport.subscription.reportType} report
                      provides comprehensive analysis including market trends,
                      comparable properties, and detailed rental estimates for{" "}
                      {formatAddress(selectedReport.address)}.
                    </p>
                  </div>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowReportModal(false)}
              >
                Close
              </Button>
              {selectedReport?.status === "completed" && (
                <Button
                  className="btn-primary-gradient"
                  onClick={() =>
                    handleDownloadReport(selectedReport.reportData.reportId)
                  }
                >
                  📥 Download Full Report
                </Button>
              )}
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    </SidebarLayout>
  );
}
