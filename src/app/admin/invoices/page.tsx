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
} from "react-bootstrap";
import { useSession } from "next-auth/react";
import SidebarLayout from "@/components/common/SidebarLayout";
import { useRouter } from "next/navigation";
import { invoiceService, Invoice } from "@/services/invoiceService";

export default function AdminInvoices() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Redirect if not admin
  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.role !== 1) {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  // Fetch invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const data = await invoiceService.getInvoices();
        setInvoices(data);
      } catch (err) {
        setError("Failed to fetch invoices");
        console.error("Error fetching invoices:", err);
      } finally {
        setLoading(false);
      }
    };

    if (session?.backendToken) {
      fetchInvoices();
    }
  }, [session]);

  const handleMarkAsPaid = async (invoiceId: string) => {
    try {
      await invoiceService.updateInvoiceStatus(invoiceId, "paid");
      setInvoices(prev => 
        prev.map(invoice => 
          invoice.id === invoiceId 
            ? { ...invoice, status: "paid" }
            : invoice
        )
      );
    } catch (err) {
      console.error("Error updating invoice:", err);
    }
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowModal(true);
  };

  const getTotalRevenue = () => {
    return invoices
      .filter(invoice => invoice.status === "paid")
      .reduce((sum, invoice) => sum + invoice.amount, 0);
  };

  const getPendingAmount = () => {
    return invoices
      .filter(invoice => invoice.status === "pending")
      .reduce((sum, invoice) => sum + invoice.amount, 0);
  };

  const getOverdueAmount = () => {
    return invoices
      .filter(invoice => invoice.status === "overdue")
      .reduce((sum, invoice) => sum + invoice.amount, 0);
  };

  const getTotalInvoices = () => {
    return invoices.length;
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (status === "loading") {
    return (
      <SidebarLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
          <div className="spinner-figma"></div>
        </div>
      </SidebarLayout>
    );
  }

  if (!session || session.role !== 1) {
    return null;
  }

  return (
    <SidebarLayout>
      <Container fluid className="py-4">
        {/* Header Section */}
        <Row className="mb-4">
          <Col>
            <div className="table-container-figma">
              <div className="table-header-figma">
                <Row className="align-items-center">
                  <Col>
                    <h3 className="text-primary-custom mb-1">
                      🧾 Invoice Management
                    </h3>
                    <p className="text-muted mb-0">
                      Manage and track all platform invoices
                    </p>
                  </Col>
                  <Col xs="auto">
                    <div className="d-flex gap-2">
                      <Button className="btn-primary-gradient">
                        📊 Export Data
                      </Button>
                      <Button className="btn-outline-gradient">
                        ⚙️ Settings
                      </Button>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>

        {/* Key Metrics */}
        <Row className="mb-4">
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
                <h5 className="text-primary-custom fw-bold">Total Revenue</h5>
                <h2 className="text-green mb-2">
                  ${getTotalRevenue().toFixed(2)}
                </h2>
                <div className="d-flex justify-content-center gap-2">
                  <span className="badge-figma-green">This month</span>
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
                <h5 className="text-primary-custom fw-bold">Pending Amount</h5>
                <h2 className="text-orange mb-2">
                  ${getPendingAmount().toFixed(2)}
                </h2>
                <div className="d-flex justify-content-center gap-2">
                  <span className="badge-figma-orange">Awaiting payment</span>
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
                  <span style={{ fontSize: "24px", color: "white" }}>⚠️</span>
                </div>
              </div>
              <div className="p-4 text-center">
                <h5 className="text-primary-custom fw-bold">Overdue Amount</h5>
                <h2 className="text-red mb-2">
                  ${getOverdueAmount().toFixed(2)}
                </h2>
                <div className="d-flex justify-content-center gap-2">
                  <span className="badge-figma-red">Past due</span>
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
                  <span style={{ fontSize: "24px", color: "white" }}>📄</span>
                </div>
              </div>
              <div className="p-4 text-center">
                <h5 className="text-primary-custom fw-bold">Total Invoices</h5>
                <h2 className="text-blue mb-2">
                  {getTotalInvoices()}
                </h2>
                <div className="d-flex justify-content-center gap-2">
                  <span className="badge-figma-blue">All time</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Filters and Search */}
        <Row className="mb-4">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>🔍</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search invoices..."
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
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Button 
              className="btn-primary-gradient w-100"
              onClick={() => window.location.reload()}
            >
              🔄 Refresh
            </Button>
          </Col>
        </Row>

        {/* Invoices Table */}
        <Row>
          <Col>
            <div className="table-container-figma">
              <div className="table-header-figma">
                <h5 className="text-primary-custom mb-0">📋 Invoices List</h5>
              </div>
              <div className="table-responsive">
                {loading ? (
                  <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                    <div className="spinner-figma"></div>
                  </div>
                ) : error ? (
                  <div className="text-center p-4">
                    <p className="text-danger">{error}</p>
                    <Button 
                      className="btn-primary-gradient"
                      onClick={() => window.location.reload()}
                    >
                      🔄 Retry
                    </Button>
                  </div>
                ) : (
                  <Table hover className="mb-0">
                    <thead className="table-figma-header">
                      <tr>
                        <th>Invoice ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Due Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInvoices.map((invoice) => (
                        <tr key={invoice.id}>
                          <td>
                            <code className="text-primary-custom">
                              {invoice.id}
                            </code>
                          </td>
                          <td>
                            <div>
                              <div className="fw-bold">{invoice.customerName}</div>
                              <small className="text-muted">{invoice.customerEmail}</small>
                            </div>
                          </td>
                          <td>
                            <span className="fw-bold text-green">
                              ${invoice.amount.toFixed(2)}
                            </span>
                          </td>
                          <td>
                            <Badge
                              className={
                                invoice.status === "paid"
                                  ? "badge-figma-green"
                                  : invoice.status === "pending"
                                  ? "badge-figma-orange"
                                  : "badge-figma-red"
                              }
                            >
                              {invoice.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td>
                            <span className="text-muted">
                              {new Date(invoice.dueDate).toLocaleDateString()}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button
                                size="sm"
                                className="btn-outline-gradient"
                                onClick={() => handleViewInvoice(invoice)}
                              >
                                👁️ View
                              </Button>
                              {invoice.status === "pending" && (
                                <Button
                                  size="sm"
                                  className="btn-primary-gradient"
                                  onClick={() => handleMarkAsPaid(invoice.id)}
                                >
                                  ✅ Mark Paid
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </div>
            </div>
          </Col>
        </Row>

        {/* Invoice Details Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>📄 Invoice Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedInvoice && (
              <div>
                <Row className="mb-3">
                  <Col md={6}>
                    <h6 className="text-primary-custom">Invoice Information</h6>
                    <p><strong>ID:</strong> {selectedInvoice.id}</p>
                    <p><strong>Amount:</strong> ${selectedInvoice.amount.toFixed(2)}</p>
                    <p><strong>Status:</strong> 
                      <Badge
                        className={
                          selectedInvoice.status === "paid"
                            ? "badge-figma-green ms-2"
                            : selectedInvoice.status === "pending"
                            ? "badge-figma-orange ms-2"
                            : "badge-figma-red ms-2"
                        }
                      >
                        {selectedInvoice.status.toUpperCase()}
                      </Badge>
                    </p>
                  </Col>
                  <Col md={6}>
                    <h6 className="text-primary-custom">Customer Information</h6>
                    <p><strong>Name:</strong> {selectedInvoice.customerName}</p>
                    <p><strong>Email:</strong> {selectedInvoice.customerEmail}</p>
                    <p><strong>Due Date:</strong> {new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <h6 className="text-primary-custom">Description</h6>
                    <p className="text-muted">{selectedInvoice.description}</p>
                  </Col>
                </Row>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Close
            </Button>
            <Button className="btn-primary-gradient">📥 Download PDF</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </SidebarLayout>
  );
}
