"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Modal,
  Form,
  Alert,
} from "react-bootstrap";
import SidebarLayout from "@/components/common/SidebarLayout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied" | "closed";
  createdAt: string;
  updatedAt: string;
}

interface ContactsResponse {
  success: boolean;
  data?: {
    contacts: Contact[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalContacts: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  message?: string;
}

export default function AdminContacts() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session.role !== 1) {
      console.log("Session role check:", {
        status,
        sessionRole: session?.role,
        session,
      });
      router.push("/dashboard");
      return;
    }

    if (status === "authenticated") {
      fetchContacts();
    }
  }, [status, session, statusFilter, currentPage]);

  const fetchContacts = async () => {
    console.log("fetchContacts called with session:", session);
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/contact?page=${currentPage}&limit=10&status=${statusFilter}`,
        {
          headers: {
            Authorization: `Bearer ${session?.backendToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch contacts");
      }

      const data: ContactsResponse = await response.json();

      if (data.success && data.data) {
        setContacts(data.data.contacts);
        setTotalPages(data.data.pagination.totalPages);
        setTotalContacts(data.data.pagination.totalContacts);
      } else {
        setError(data.message || "Failed to fetch contacts");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const updateContactStatus = async (contactId: string, newStatus: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/contact/${contactId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${session?.backendToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update contact status");
      }

      const data = await response.json();

      if (data.success) {
        // Update the contact in the local state
        setContacts((prevContacts) =>
          prevContacts.map((contact) =>
            contact._id === contactId
              ? { ...contact, status: newStatus as any }
              : contact
          )
        );
      } else {
        setError(data.message || "Failed to update contact status");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { variant: "danger", text: "New" },
      read: { variant: "warning", text: "Read" },
      replied: { variant: "info", text: "Replied" },
      closed: { variant: "secondary", text: "Closed" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (status === "loading") {
    return (
      <SidebarLayout>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "50vh" }}
        >
          <div className="spinner-figma"></div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <Container fluid className="py-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h3 fw-bold text-primary-custom mb-2">
                  📞 Contact Management
                </h1>
                <p className="text-secondary-custom mb-0">
                  Manage customer inquiries and support requests
                </p>
              </div>
              <div className="d-flex gap-2">
                <Badge bg="primary" className="px-3 py-2">
                  Total: {totalContacts}
                </Badge>
              </div>
            </div>
          </Col>
        </Row>

        {/* Filters */}
        <Row className="mb-4">
          <Col>
            <Card className="card-figma">
              <Card.Body>
                <div className="d-flex gap-3 align-items-center">
                  <Form.Select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    style={{ width: "200px" }}
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="closed">Closed</option>
                  </Form.Select>
                  <Button
                    variant="outline-primary"
                    onClick={fetchContacts}
                    disabled={loading}
                  >
                    🔄 Refresh
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Error Alert */}
        {error && (
          <Row className="mb-4">
            <Col>
              <Alert
                variant="danger"
                dismissible
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            </Col>
          </Row>
        )}

        {/* Contacts List */}
        <Row>
          <Col>
            <Card className="card-figma">
              <Card.Header className="bg-white border-bottom">
                <h5 className="mb-0 fw-bold text-primary-custom">
                  Contact Inquiries
                </h5>
              </Card.Header>
              <Card.Body className="p-0">
                {loading ? (
                  <div className="d-flex justify-content-center align-items-center py-5">
                    <div className="spinner-figma"></div>
                  </div>
                ) : contacts.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="text-muted">
                      <i className="fas fa-inbox fa-3x mb-3"></i>
                      <p>No contacts found</p>
                    </div>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Subject</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contacts.map((contact) => (
                          <tr key={contact._id}>
                            <td>
                              <div className="fw-medium text-primary-custom">
                                {contact.name}
                              </div>
                            </td>
                            <td>
                              <a
                                href={`mailto:${contact.email}`}
                                className="text-decoration-none"
                              >
                                {contact.email}
                              </a>
                            </td>
                            <td>
                              <div
                                className="text-truncate"
                                style={{ maxWidth: "200px" }}
                              >
                                {contact.subject}
                              </div>
                            </td>
                            <td>{getStatusBadge(contact.status)}</td>
                            <td>
                              <small className="text-muted">
                                {formatDate(contact.createdAt)}
                              </small>
                            </td>
                            <td>
                              <div className="d-flex gap-1">
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedContact(contact);
                                    setShowModal(true);
                                  }}
                                >
                                  👁️ View
                                </Button>
                                <Form.Select
                                  size="sm"
                                  value={contact.status}
                                  onChange={(e) =>
                                    updateContactStatus(
                                      contact._id,
                                      e.target.value
                                    )
                                  }
                                  style={{ width: "100px" }}
                                >
                                  <option value="new">New</option>
                                  <option value="read">Read</option>
                                  <option value="replied">Replied</option>
                                  <option value="closed">Closed</option>
                                </Form.Select>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Pagination */}
        {totalPages > 1 && (
          <Row className="mt-4">
            <Col>
              <div className="d-flex justify-content-center">
                <div className="btn-group">
                  <Button
                    variant="outline-primary"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    ← Previous
                  </Button>
                  <Button variant="outline-primary" disabled>
                    Page {currentPage} of {totalPages}
                  </Button>
                  <Button
                    variant="outline-primary"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next →
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        )}
      </Container>

      {/* Contact Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Contact Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedContact && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Name:</strong>
                  <p>{selectedContact.name}</p>
                </Col>
                <Col md={6}>
                  <strong>Email:</strong>
                  <p>
                    <a href={`mailto:${selectedContact.email}`}>
                      {selectedContact.email}
                    </a>
                  </p>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Subject:</strong>
                  <p>{selectedContact.subject}</p>
                </Col>
                <Col md={6}>
                  <strong>Status:</strong>
                  <p>{getStatusBadge(selectedContact.status)}</p>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <strong>Message:</strong>
                  <div className="border rounded p-3 bg-light">
                    {selectedContact.message}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <strong>Submitted:</strong>
                  <p>{formatDate(selectedContact.createdAt)}</p>
                </Col>
                <Col md={6}>
                  <strong>Last Updated:</strong>
                  <p>{formatDate(selectedContact.updatedAt)}</p>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          {selectedContact && (
            <Button
              variant="primary"
              onClick={() => {
                window.open(
                  `mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`
                );
              }}
            >
              📧 Reply via Email
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </SidebarLayout>
  );
}
