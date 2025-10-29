"use client";

import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import Link from "next/link";
import { contactService, ContactFormData } from "@/services/contactService";

export default function ContactUs() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
    inquiryType: "general"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");
    
    try {
      const response = await contactService.submitContactForm(formData);
      
      if (response.success) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          inquiryType: "general"
        });
      } else {
        setSubmitStatus("error");
        setErrorMessage(response.message || "Failed to submit contact form");
      }
    } catch (error: any) {
      console.error("Contact form submission error:", error);
      setSubmitStatus("error");
      setErrorMessage(error.message || "Failed to submit contact form. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <div className="bg-gradient-primary text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col>
              <div className="text-center">
                <h1 className="display-4 fw-bold mb-3">📞 Contact Us</h1>
                <p className="lead mb-0">
                  Get in touch with our team. We're here to help with your rental intelligence needs.
                </p>
                <div className="mt-4">
                  <small className="opacity-75">
                    We typically respond within 24 hours
                  </small>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="bg-white border-bottom">
        <Container>
          <Row>
            <Col>
              <nav className="py-3">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link href="/" className="text-decoration-none text-primary-custom">
                      🏠 Home
                    </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Contact Us
                  </li>
                </ol>
              </nav>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-5">
        <Row>
          <Col lg={8} className="mx-auto">
            <div className="text-center mb-5">
              <h2 className="text-primary-custom fw-bold mb-4">💬 Get in Touch</h2>
              <p className="lead text-secondary-custom">
                Have questions about our rental intelligence platform? We'd love to hear from you.
              </p>
            </div>
          </Col>
        </Row>

        <Row className="g-5">
          <Col lg={8}>
            <div className="table-container-figma">
              <div className="table-header-figma">
                <h3 className="text-primary-custom mb-0">📝 Send us a Message</h3>
                <p className="text-secondary-custom mb-0 mt-1">
                  Fill out the form below and we'll get back to you as soon as possible
                </p>
              </div>
              <div className="p-4">
                {submitStatus === "success" && (
                  <Alert variant="success" className="mb-4">
                    <div className="d-flex align-items-center">
                      <span className="me-2">✅</span>
                      <div>
                        <strong>Message sent successfully!</strong><br />
                        We'll get back to you within 24 hours.
                      </div>
                    </div>
                  </Alert>
                )}

                {submitStatus === "error" && (
                  <Alert variant="danger" className="mb-4">
                    <div className="d-flex align-items-center">
                      <span className="me-2">❌</span>
                      <div>
                        <strong>Error sending message.</strong><br />
                        {errorMessage}
                      </div>
                    </div>
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="text-primary-custom fw-medium">Full Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="form-control-figma"
                          placeholder="Enter your full name"
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="text-primary-custom fw-medium">Email Address *</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="form-control-figma"
                          placeholder="Enter your email address"
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="text-primary-custom fw-medium">Inquiry Type</Form.Label>
                        <Form.Select
                          name="inquiryType"
                          value={formData.inquiryType}
                          onChange={handleInputChange}
                          className="form-control-figma"
                        >
                          <option value="general">General Inquiry</option>
                          <option value="support">Technical Support</option>
                          <option value="sales">Sales Question</option>
                          <option value="billing">Billing Issue</option>
                          <option value="partnership">Partnership</option>
                          <option value="feedback">Feedback</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="text-primary-custom fw-medium">Subject *</Form.Label>
                        <Form.Control
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="form-control-figma"
                          placeholder="Brief subject of your message"
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col>
                      <Form.Group>
                        <Form.Label className="text-primary-custom fw-medium">Message *</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={6}
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          className="form-control-figma"
                          placeholder="Please provide details about your inquiry..."
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <div className="mt-4">
                    <Button
                      type="submit"
                      className="btn-primary-gradient btn-lg w-100"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          📤 Send Message
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </Col>

          <Col lg={4}>
            <div className="sticky-top" style={{ top: "2rem" }}>
              <div className="table-container-figma mb-4">
                <div className="table-header-figma">
                  <h4 className="text-primary-custom mb-0">📍 Contact Information</h4>
                </div>
                <div className="p-4">
                  <div className="mb-4">
                    <div className="d-flex align-items-start">
                      <div className="icon-figma me-3" style={{ width: "48px", height: "48px" }}>
                        <span style={{ fontSize: "24px", color: "white" }}>📧</span>
                      </div>
                      <div>
                        <h6 className="text-primary-custom fw-bold mb-1">Email</h6>
                        <p className="text-secondary-custom mb-1">support@rentintel.com</p>
                        <p className="text-secondary-custom mb-0">sales@rentintel.com</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="d-flex align-items-start">
                      <div className="icon-figma me-3" style={{ width: "48px", height: "48px" }}>
                        <span style={{ fontSize: "24px", color: "white" }}>📞</span>
                      </div>
                      <div>
                        <h6 className="text-primary-custom fw-bold mb-1">Phone</h6>
                        <p className="text-secondary-custom mb-1">+1 (555) 123-4567</p>
                        <p className="text-secondary-custom mb-0">Mon-Fri, 9AM-6PM EST</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="d-flex align-items-start">
                      <div className="icon-figma me-3" style={{ width: "48px", height: "48px" }}>
                        <span style={{ fontSize: "24px", color: "white" }}>🏢</span>
                      </div>
                      <div>
                        <h6 className="text-primary-custom fw-bold mb-1">Office</h6>
                        <p className="text-secondary-custom mb-0">
                          123 Tech Street<br />
                          Boston, MA 02101<br />
                          United States
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="table-container-figma">
                <div className="table-header-figma">
                  <h4 className="text-primary-custom mb-0">🔗 Quick Links</h4>
                </div>
                <div className="p-4">
                  <div className="d-grid gap-2">
                    <Link href="/about-us" className="btn btn-outline-gradient">
                      ℹ️ About Us
                    </Link>
                    <Link href="/privacy-policy" className="btn btn-outline-gradient">
                      🔒 Privacy Policy
                    </Link>
                    <Link href="/signup" className="btn btn-primary-gradient">
                      🚀 Start Free Trial
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <div className="bg-gradient-primary text-white py-5">
        <Container>
          <Row className="text-center">
            <Col>
              <h3 className="fw-bold mb-3">Still Have Questions?</h3>
              <p className="lead mb-4">
                Our support team is standing by to help you succeed with your rental property investments.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link href="/signup" className="btn btn-light btn-lg">
                  🚀 Start Free Trial
                </Link>
                <Link href="/about-us" className="btn btn-outline-light btn-lg">
                  ℹ️ About Us
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
