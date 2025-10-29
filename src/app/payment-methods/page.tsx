"use client";

import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Badge,
  Alert,
} from "react-bootstrap";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SidebarLayout from "@/components/common/SidebarLayout";
import { ConfirmModal } from "@/components/common/Modal";
import { toast } from "react-hot-toast";

export default function PaymentMethodsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<{
    show: boolean;
    methodId: string;
    cardName: string;
  }>({
    show: false,
    methodId: "",
    cardName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardholderName: "",
    billingAddress: "",
    city: "",
    state: "",
    zipCode: "",
  });

  // Redirect to login if not authenticated (client-side only)
  React.useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

  if (!session) {
    return (
      <SidebarLayout>
        <Container fluid className="py-4">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </Container>
      </SidebarLayout>
    );
  }

  // Mock data - in real app, this would come from API
  const paymentMethods = [
    {
      id: "1",
      type: "visa",
      lastFour: "4242",
      expiryMonth: "12",
      expiryYear: "2025",
      cardholderName: "Sarah Johnson",
      isDefault: true,
      billingAddress: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zipCode: "90210",
      },
    },
    {
      id: "2",
      type: "mastercard",
      lastFour: "5555",
      expiryMonth: "08",
      expiryYear: "2026",
      cardholderName: "Sarah Johnson",
      isDefault: false,
      billingAddress: {
        street: "456 Oak Ave",
        city: "Another City",
        state: "CA",
        zipCode: "90211",
      },
    },
  ];

  const getCardIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "visa":
        return "💳";
      case "mastercard":
        return "💳";
      case "amex":
        return "💳";
      case "discover":
        return "💳";
      default:
        return "💳";
    }
  };

  const getCardName = (type: string) => {
    switch (type.toLowerCase()) {
      case "visa":
        return "Visa";
      case "mastercard":
        return "Mastercard";
      case "amex":
        return "American Express";
      case "discover":
        return "Discover";
      default:
        return "Credit Card";
    }
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Payment method added successfully!");
      setShowAddModal(false);
      setNewCard({
        cardNumber: "",
        expiryMonth: "",
        expiryYear: "",
        cvv: "",
        cardholderName: "",
        billingAddress: "",
        city: "",
        state: "",
        zipCode: "",
      });
    } catch (error) {
      toast.error("Failed to add payment method. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCard = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Payment method deleted successfully!");
      setShowDeleteModal({ show: false, methodId: "", cardName: "" });
    } catch (error) {
      toast.error("Failed to delete payment method. Please try again.");
    }
  };

  const handleSetDefault = async (methodId: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Default payment method updated!");
    } catch (error) {
      toast.error("Failed to update default payment method.");
    }
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    // Add space every 4 digits
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setNewCard((prev) => ({ ...prev, cardNumber: formatted }));
  };

  return (
    <SidebarLayout>
      <Container fluid className="py-4">
        <Row>
          <Col>
            {/* Header */}
            <div className="text-center mb-4">
              <div className="mb-3">
                <div
                  className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                  style={{ width: "80px", height: "80px", fontSize: "2rem" }}
                >
                  💰
                </div>
              </div>
              <h1 className="h2 mb-1">Payment Methods</h1>
              <p className="text-muted">
                Manage your payment methods and billing information
              </p>
            </div>

            {/* Add New Payment Method Button */}
            <div className="text-end mb-4">
              <Button variant="primary" onClick={() => setShowAddModal(true)}>
                <i className="bi bi-plus-circle me-2"></i>
                Add Payment Method
              </Button>
            </div>

            {/* Payment Methods List */}
            <Row className="g-4">
              {paymentMethods.map((method) => (
                <Col lg={6} key={method.id}>
                  <Card
                    className={`h-100 ${
                      method.isDefault ? "border-success" : ""
                    } shadow-sm`}
                  >
                    {method.isDefault && (
                      <div className="position-absolute top-0 end-0 m-2">
                        <Badge bg="success">Default</Badge>
                      </div>
                    )}

                    <Card.Body>
                      <div className="d-flex align-items-center mb-3">
                        <div className="me-3" style={{ fontSize: "2rem" }}>
                          {getCardIcon(method.type)}
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{getCardName(method.type)}</h6>
                          <div className="text-muted">
                            •••• •••• •••• {method.lastFour}
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="row">
                          <div className="col-6">
                            <small className="text-muted d-block">
                              Cardholder
                            </small>
                            <div>{method.cardholderName}</div>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block">
                              Expires
                            </small>
                            <div>
                              {method.expiryMonth}/{method.expiryYear}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <small className="text-muted d-block">
                          Billing Address
                        </small>
                        <div>
                          {method.billingAddress.street}
                          <br />
                          {method.billingAddress.city},{" "}
                          {method.billingAddress.state}{" "}
                          {method.billingAddress.zipCode}
                        </div>
                      </div>
                    </Card.Body>

                    <Card.Footer className="bg-white border-top-0">
                      <div className="d-flex gap-2">
                        {!method.isDefault && (
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleSetDefault(method.id)}
                          >
                            Set as Default
                          </Button>
                        )}
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() =>
                            setShowDeleteModal({
                              show: true,
                              methodId: method.id,
                              cardName: `${getCardName(method.type)} •••• ${
                                method.lastFour
                              }`,
                            })
                          }
                          disabled={
                            method.isDefault && paymentMethods.length === 1
                          }
                        >
                          Delete
                        </Button>
                      </div>
                      {method.isDefault && paymentMethods.length === 1 && (
                        <small className="text-muted d-block mt-2">
                          Cannot delete the only payment method
                        </small>
                      )}
                    </Card.Footer>
                  </Card>
                </Col>
              ))}

              {paymentMethods.length === 0 && (
                <Col>
                  <Card className="text-center py-5">
                    <Card.Body>
                      <div
                        className="text-muted mb-3"
                        style={{ fontSize: "4rem" }}
                      >
                        💳
                      </div>
                      <h4>No Payment Methods</h4>
                      <p className="text-muted mb-4">
                        Add a payment method to purchase credit packages and
                        generate reports.
                      </p>
                      <Button
                        variant="primary"
                        onClick={() => setShowAddModal(true)}
                      >
                        Add Your First Payment Method
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              )}
            </Row>

            {/* Security Notice */}
            <Alert variant="info" className="mt-4">
              <div className="d-flex align-items-start">
                <i className="bi bi-shield-check me-2 mt-1"></i>
                <div>
                  <strong>Your payment information is secure.</strong>
                  <br />
                  We use industry-standard encryption and never store your
                  complete card details. All payments are processed securely
                  through our certified payment partners.
                </div>
              </div>
            </Alert>
          </Col>
        </Row>

        {/* Add Payment Method Modal */}
        <Modal
          show={showAddModal}
          onHide={() => setShowAddModal(false)}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Payment Method</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleAddCard}>
            <Modal.Body>
              <Row>
                <Col md={12} className="mb-3">
                  <Form.Group>
                    <Form.Label>Card Number *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={newCard.cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={12} className="mb-3">
                  <Form.Group>
                    <Form.Label>Cardholder Name *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="John Doe"
                      value={newCard.cardholderName}
                      onChange={(e) =>
                        setNewCard((prev) => ({
                          ...prev,
                          cardholderName: e.target.value,
                        }))
                      }
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={4} className="mb-3">
                  <Form.Group>
                    <Form.Label>Expiry Month *</Form.Label>
                    <Form.Select
                      value={newCard.expiryMonth}
                      onChange={(e) =>
                        setNewCard((prev) => ({
                          ...prev,
                          expiryMonth: e.target.value,
                        }))
                      }
                      required
                    >
                      <option value="">Month</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option
                          key={i + 1}
                          value={String(i + 1).padStart(2, "0")}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={4} className="mb-3">
                  <Form.Group>
                    <Form.Label>Expiry Year *</Form.Label>
                    <Form.Select
                      value={newCard.expiryYear}
                      onChange={(e) =>
                        setNewCard((prev) => ({
                          ...prev,
                          expiryYear: e.target.value,
                        }))
                      }
                      required
                    >
                      <option value="">Year</option>
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = new Date().getFullYear() + i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={4} className="mb-3">
                  <Form.Group>
                    <Form.Label>CVV *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="123"
                      value={newCard.cvv}
                      onChange={(e) =>
                        setNewCard((prev) => ({
                          ...prev,
                          cvv: e.target.value.replace(/\D/g, ""),
                        }))
                      }
                      maxLength={4}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={12} className="mb-3">
                  <h6 className="text-muted border-bottom pb-2">
                    Billing Address
                  </h6>
                </Col>

                <Col md={12} className="mb-3">
                  <Form.Group>
                    <Form.Label>Street Address *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="123 Main Street"
                      value={newCard.billingAddress}
                      onChange={(e) =>
                        setNewCard((prev) => ({
                          ...prev,
                          billingAddress: e.target.value,
                        }))
                      }
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>City *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="City"
                      value={newCard.city}
                      onChange={(e) =>
                        setNewCard((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={3} className="mb-3">
                  <Form.Group>
                    <Form.Label>State *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="CA"
                      value={newCard.state}
                      onChange={(e) =>
                        setNewCard((prev) => ({
                          ...prev,
                          state: e.target.value,
                        }))
                      }
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={3} className="mb-3">
                  <Form.Group>
                    <Form.Label>ZIP Code *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="90210"
                      value={newCard.zipCode}
                      onChange={(e) =>
                        setNewCard((prev) => ({
                          ...prev,
                          zipCode: e.target.value,
                        }))
                      }
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Adding...
                  </>
                ) : (
                  "Add Payment Method"
                )}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          show={showDeleteModal.show}
          title="Delete Payment Method"
          message={`Are you sure you want to delete ${showDeleteModal.cardName}? This action cannot be undone.`}
          confirmText="Delete"
          variant="danger"
          onConfirm={handleDeleteCard}
          onHide={() =>
            setShowDeleteModal({ show: false, methodId: "", cardName: "" })
          }
        />
      </Container>
    </SidebarLayout>
  );
}
