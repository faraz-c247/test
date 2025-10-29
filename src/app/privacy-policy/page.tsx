"use client";

import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-vh-100 bg-light">
      {/* Header Section */}
      <div className="bg-gradient-primary text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col>
              <div className="text-center">
                <h1 className="display-4 fw-bold mb-3">🔒 Privacy Policy</h1>
                <p className="lead mb-0">
                  Your privacy is important to us. Learn how we collect, use, and protect your information.
                </p>
                <div className="mt-4">
                  <small className="opacity-75">
                    Last updated: December 31, 2024
                  </small>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Navigation Breadcrumb */}
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
                    Privacy Policy
                  </li>
                </ol>
              </nav>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="py-5">
        <Row>
          <Col lg={8} className="mx-auto">
            <div className="table-container-figma">
              <div className="table-header-figma">
                <h2 className="text-primary-custom mb-0">📋 Privacy Policy Overview</h2>
                <p className="text-secondary-custom mb-0 mt-1">
                  This policy explains how RentIntel collects, uses, and protects your personal information.
                </p>
              </div>
              <div className="p-4">
                <div className="bg-green-light rounded-figma-lg p-4 mb-4">
                  <h5 className="text-primary-custom fw-bold mb-3">🛡️ Our Commitment to Privacy</h5>
                  <p className="text-secondary-custom mb-0">
                    At RentIntel, we are committed to protecting your privacy and ensuring the security of your personal information. 
                    This Privacy Policy explains our practices regarding the collection, use, and disclosure of information when you use our service.
                  </p>
                </div>

                {/* Information We Collect */}
                <div className="mb-5">
                  <h3 className="text-primary-custom fw-bold mb-4">📊 Information We Collect</h3>
                  
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="card-figma h-100">
                        <div className="card-figma-header text-center">
                          <div className="icon-figma mx-auto mb-2" style={{ width: "48px", height: "48px" }}>
                            <span style={{ fontSize: "24px", color: "white" }}>👤</span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h5 className="text-primary-custom fw-bold">Personal Information</h5>
                          <ul className="text-secondary-custom">
                            <li>Name and email address</li>
                            <li>Account credentials</li>
                            <li>Payment information</li>
                            <li>Contact preferences</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="card-figma h-100">
                        <div className="card-figma-header text-center">
                          <div className="icon-figma mx-auto mb-2" style={{ width: "48px", height: "48px" }}>
                            <span style={{ fontSize: "24px", color: "white" }}>🏠</span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h5 className="text-primary-custom fw-bold">Property Data</h5>
                          <ul className="text-secondary-custom">
                            <li>Property addresses</li>
                            <li>Property specifications</li>
                            <li>Analysis requests</li>
                            <li>Generated reports</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* How We Use Information */}
                <div className="mb-5">
                  <h3 className="text-primary-custom fw-bold mb-4">🎯 How We Use Your Information</h3>
                  
                  <div className="bg-orange-light rounded-figma-lg p-4">
                    <div className="row g-3">
                      <div className="col-md-4">
                        <div className="text-center">
                          <div className="icon-figma mx-auto mb-3" style={{ width: "60px", height: "60px" }}>
                            <span style={{ fontSize: "30px", color: "white" }}>📊</span>
                          </div>
                          <h6 className="text-primary-custom fw-bold">Service Delivery</h6>
                          <p className="text-secondary-custom small mb-0">
                            Generate property analysis reports and provide rental intelligence services.
                          </p>
                        </div>
                      </div>
                      
                      <div className="col-md-4">
                        <div className="text-center">
                          <div className="icon-figma mx-auto mb-3" style={{ width: "60px", height: "60px" }}>
                            <span style={{ fontSize: "30px", color: "white" }}>💳</span>
                          </div>
                          <h6 className="text-primary-custom fw-bold">Billing & Payments</h6>
                          <p className="text-secondary-custom small mb-0">
                            Process payments, manage subscriptions, and handle billing inquiries.
                          </p>
                        </div>
                      </div>
                      
                      <div className="col-md-4">
                        <div className="text-center">
                          <div className="icon-figma mx-auto mb-3" style={{ width: "60px", height: "60px" }}>
                            <span style={{ fontSize: "30px", color: "white" }}>📧</span>
                          </div>
                          <h6 className="text-primary-custom fw-bold">Communication</h6>
                          <p className="text-secondary-custom small mb-0">
                            Send service updates, support responses, and important notifications.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Protection */}
                <div className="mb-5">
                  <h3 className="text-primary-custom fw-bold mb-4">🔐 Data Protection & Security</h3>
                  
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="d-flex align-items-start">
                        <div className="icon-figma me-3" style={{ width: "40px", height: "40px" }}>
                          <span style={{ fontSize: "20px", color: "white" }}>🔒</span>
                        </div>
                        <div>
                          <h6 className="text-primary-custom fw-bold">Encryption</h6>
                          <p className="text-secondary-custom mb-0">
                            All data is encrypted in transit and at rest using industry-standard protocols.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="d-flex align-items-start">
                        <div className="icon-figma me-3" style={{ width: "40px", height: "40px" }}>
                          <span style={{ fontSize: "20px", color: "white" }}>🛡️</span>
                        </div>
                        <div>
                          <h6 className="text-primary-custom fw-bold">Access Control</h6>
                          <p className="text-secondary-custom mb-0">
                            Strict access controls ensure only authorized personnel can access your data.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="d-flex align-items-start">
                        <div className="icon-figma me-3" style={{ width: "40px", height: "40px" }}>
                          <span style={{ fontSize: "20px", color: "white" }}>🔍</span>
                        </div>
                        <div>
                          <h6 className="text-primary-custom fw-bold">Monitoring</h6>
                          <p className="text-secondary-custom mb-0">
                            Continuous monitoring and security audits to protect against threats.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="d-flex align-items-start">
                        <div className="icon-figma me-3" style={{ width: "40px", height: "40px" }}>
                          <span style={{ fontSize: "20px", color: "white" }}>📋</span>
                        </div>
                        <div>
                          <h6 className="text-primary-custom fw-bold">Compliance</h6>
                          <p className="text-secondary-custom mb-0">
                            We comply with GDPR, CCPA, and other relevant privacy regulations.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Your Rights */}
                <div className="mb-5">
                  <h3 className="text-primary-custom fw-bold mb-4">⚖️ Your Privacy Rights</h3>
                  
                  <div className="bg-green-light rounded-figma-lg p-4">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="d-flex align-items-center">
                          <span className="me-3" style={{ fontSize: "24px" }}>👁️</span>
                          <div>
                            <h6 className="text-primary-custom fw-bold mb-1">Right to Access</h6>
                            <p className="text-secondary-custom mb-0 small">View your personal data we have collected</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-6">
                        <div className="d-flex align-items-center">
                          <span className="me-3" style={{ fontSize: "24px" }}>✏️</span>
                          <div>
                            <h6 className="text-primary-custom fw-bold mb-1">Right to Rectify</h6>
                            <p className="text-secondary-custom mb-0 small">Correct inaccurate personal information</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-6">
                        <div className="d-flex align-items-center">
                          <span className="me-3" style={{ fontSize: "24px" }}>🗑️</span>
                          <div>
                            <h6 className="text-primary-custom fw-bold mb-1">Right to Delete</h6>
                            <p className="text-secondary-custom mb-0 small">Request deletion of your personal data</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-6">
                        <div className="d-flex align-items-center">
                          <span className="me-3" style={{ fontSize: "24px" }}>📤</span>
                          <div>
                            <h6 className="text-primary-custom fw-bold mb-1">Data Portability</h6>
                            <p className="text-secondary-custom mb-0 small">Export your data in a portable format</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="mb-5">
                  <h3 className="text-primary-custom fw-bold mb-4">📞 Contact Us</h3>
                  
                  <div className="card-figma">
                    <div className="p-4">
                      <p className="text-secondary-custom mb-4">
                        If you have any questions about this Privacy Policy or our data practices, please contact us:
                      </p>
                      
                      <div className="row g-4">
                        <div className="col-md-6">
                          <div className="d-flex align-items-center">
                            <div className="icon-figma me-3" style={{ width: "48px", height: "48px" }}>
                              <span style={{ fontSize: "24px", color: "white" }}>📧</span>
                            </div>
                            <div>
                              <h6 className="text-primary-custom fw-bold mb-1">Email</h6>
                              <p className="text-secondary-custom mb-0">privacy@rentintel.com</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-md-6">
                          <div className="d-flex align-items-center">
                            <div className="icon-figma me-3" style={{ width: "48px", height: "48px" }}>
                              <span style={{ fontSize: "24px", color: "white" }}>🏢</span>
                            </div>
                            <div>
                              <h6 className="text-primary-custom fw-bold mb-1">Address</h6>
                              <p className="text-secondary-custom mb-0">
                                123 Tech Street<br />
                                Boston, MA 02101
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Policy Updates */}
                <div className="bg-orange-light rounded-figma-lg p-4">
                  <h5 className="text-primary-custom fw-bold mb-3">🔄 Policy Updates</h5>
                  <p className="text-secondary-custom mb-0">
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                    the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review 
                    this Privacy Policy periodically for any changes.
                  </p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Footer CTA */}
      <div className="bg-gradient-primary text-white py-5">
        <Container>
          <Row className="text-center">
            <Col>
              <h3 className="fw-bold mb-3">Questions About Our Privacy Policy?</h3>
              <p className="lead mb-4">
                We're here to help. Contact our privacy team for any questions or concerns.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link href="/contact-us" className="btn btn-light btn-lg">
                  📞 Contact Us
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
