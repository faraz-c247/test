"use client";

import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import Link from "next/link";

export default function AboutUs() {
  return (
    <div className="min-vh-100 bg-light">
      {/* Header Section */}
      <div className="bg-gradient-primary text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col>
              <div className="text-center">
                <h1 className="display-4 fw-bold mb-3">ℹ️ About RentIntel</h1>
                <p className="lead mb-0">
                  Revolutionizing property analysis with AI-powered rental intelligence.
                </p>
                <div className="mt-4">
                  <small className="opacity-75">
                    Empowering real estate professionals since 2024
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
                    About Us
                  </li>
                </ol>
              </nav>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Mission Section */}
      <Container className="py-5">
        <Row>
          <Col lg={10} className="mx-auto">
            <div className="text-center mb-5">
              <h2 className="text-primary-custom fw-bold mb-4">🎯 Our Mission</h2>
              <p className="lead text-secondary-custom">
                To democratize real estate intelligence by providing accurate, data-driven rental analysis 
                that empowers property investors, landlords, and real estate professionals to make informed decisions.
              </p>
            </div>
          </Col>
        </Row>

        {/* Company Story */}
        <Row className="mb-5">
          <Col lg={8} className="mx-auto">
            <div className="table-container-figma">
              <div className="table-header-figma">
                <h3 className="text-primary-custom mb-0">📖 Our Story</h3>
                <p className="text-secondary-custom mb-0 mt-1">
                  How RentIntel came to be and our vision for the future
                </p>
              </div>
              <div className="p-4">
                <div className="bg-green-light rounded-figma-lg p-4">
                  <p className="text-secondary-custom mb-4">
                    Founded in 2024 by a team of real estate professionals and data scientists, RentIntel was born 
                    from a simple observation: the rental market analysis process was time-consuming, expensive, 
                    and often inaccurate. Traditional methods relied on outdated data and manual calculations, 
                    leaving investors and landlords guessing about optimal rental prices.
                  </p>
                  <p className="text-secondary-custom mb-0">
                    We set out to change that by leveraging cutting-edge AI technology, comprehensive market data, 
                    and advanced analytics to provide instant, accurate rental intelligence. Today, RentIntel serves 
                    thousands of users across the United States, helping them maximize their rental income and 
                    make smarter investment decisions.
                  </p>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Core Values */}
        <Row className="mb-5">
          <Col>
            <div className="text-center mb-5">
              <h2 className="text-primary-custom fw-bold mb-4">💎 Our Core Values</h2>
              <p className="lead text-secondary-custom">
                The principles that guide everything we do
              </p>
            </div>
          </Col>
        </Row>

        <Row className="g-4 mb-5">
          <Col lg={4} md={6}>
            <div className="card-figma h-100 text-center">
              <div className="card-figma-header">
                <div className="icon-figma mx-auto mb-3" style={{ width: "80px", height: "80px" }}>
                  <span style={{ fontSize: "40px", color: "white" }}>🎯</span>
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-primary-custom fw-bold mb-3">Accuracy</h4>
                <p className="text-secondary-custom">
                  We believe in providing the most accurate and up-to-date rental market data, 
                  ensuring our users can trust our analysis for their most important decisions.
                </p>
              </div>
            </div>
          </Col>

          <Col lg={4} md={6}>
            <div className="card-figma h-100 text-center">
              <div className="card-figma-header">
                <div className="icon-figma mx-auto mb-3" style={{ width: "80px", height: "80px" }}>
                  <span style={{ fontSize: "40px", color: "white" }}>⚡</span>
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-primary-custom fw-bold mb-3">Speed</h4>
                <p className="text-secondary-custom">
                  Time is money in real estate. Our AI-powered platform delivers comprehensive 
                  rental analysis in seconds, not days, giving you a competitive edge.
                </p>
              </div>
            </div>
          </Col>

          <Col lg={4} md={6}>
            <div className="card-figma h-100 text-center">
              <div className="card-figma-header">
                <div className="icon-figma mx-auto mb-3" style={{ width: "80px", height: "80px" }}>
                  <span style={{ fontSize: "40px", color: "white" }}>🔍</span>
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-primary-custom fw-bold mb-3">Transparency</h4>
                <p className="text-secondary-custom">
                  We provide clear, detailed reports with full visibility into our data sources 
                  and methodology, so you understand exactly how we reach our conclusions.
                </p>
              </div>
            </div>
          </Col>

          <Col lg={4} md={6}>
            <div className="card-figma h-100 text-center">
              <div className="card-figma-header">
                <div className="icon-figma mx-auto mb-3" style={{ width: "80px", height: "80px" }}>
                  <span style={{ fontSize: "40px", color: "white" }}>🤝</span>
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-primary-custom fw-bold mb-3">Partnership</h4>
                <p className="text-secondary-custom">
                  We view our users as partners in success. Our platform is designed to grow 
                  with your business and adapt to your evolving needs.
                </p>
              </div>
            </div>
          </Col>

          <Col lg={4} md={6}>
            <div className="card-figma h-100 text-center">
              <div className="card-figma-header">
                <div className="icon-figma mx-auto mb-3" style={{ width: "80px", height: "80px" }}>
                  <span style={{ fontSize: "40px", color: "white" }}>🚀</span>
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-primary-custom fw-bold mb-3">Innovation</h4>
                <p className="text-secondary-custom">
                  We continuously push the boundaries of what's possible in real estate analytics, 
                  incorporating the latest AI and machine learning technologies.
                </p>
              </div>
            </div>
          </Col>

          <Col lg={4} md={6}>
            <div className="card-figma h-100 text-center">
              <div className="card-figma-header">
                <div className="icon-figma mx-auto mb-3" style={{ width: "80px", height: "80px" }}>
                  <span style={{ fontSize: "40px", color: "white" }}>🛡️</span>
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-primary-custom fw-bold mb-3">Security</h4>
                <p className="text-secondary-custom">
                  Your data security is our top priority. We implement enterprise-grade security 
                  measures to protect your sensitive information and property data.
                </p>
              </div>
            </div>
          </Col>
        </Row>

        {/* Team Section */}
        <Row className="mb-5">
          <Col>
            <div className="text-center mb-5">
              <h2 className="text-primary-custom fw-bold mb-4">👥 Our Team</h2>
              <p className="lead text-secondary-custom">
                Meet the experts behind RentIntel
              </p>
            </div>
          </Col>
        </Row>

        <Row className="g-4 mb-5">
          <Col lg={4} md={6}>
            <div className="card-figma text-center">
              <div className="p-4">
                <div className="icon-figma mx-auto mb-3" style={{ width: "100px", height: "100px" }}>
                  <span style={{ fontSize: "50px", color: "white" }}>👨‍💼</span>
                </div>
                <h5 className="text-primary-custom fw-bold">Sarah Johnson</h5>
                <p className="text-orange mb-2">CEO & Co-Founder</p>
                <p className="text-secondary-custom small">
                  Former real estate investment banker with 15+ years of experience in property analytics and market research.
                </p>
              </div>
            </div>
          </Col>

          <Col lg={4} md={6}>
            <div className="card-figma text-center">
              <div className="p-4">
                <div className="icon-figma mx-auto mb-3" style={{ width: "100px", height: "100px" }}>
                  <span style={{ fontSize: "50px", color: "white" }}>👨‍💻</span>
                </div>
                <h5 className="text-primary-custom fw-bold">Michael Chen</h5>
                <p className="text-orange mb-2">CTO & Co-Founder</p>
                <p className="text-secondary-custom small">
                  AI and machine learning expert with a PhD in Computer Science and extensive experience in data analytics.
                </p>
              </div>
            </div>
          </Col>

          <Col lg={4} md={6}>
            <div className="card-figma text-center">
              <div className="p-4">
                <div className="icon-figma mx-auto mb-3" style={{ width: "100px", height: "100px" }}>
                  <span style={{ fontSize: "50px", color: "white" }}>👩‍💼</span>
                </div>
                <h5 className="text-primary-custom fw-bold">Emily Rodriguez</h5>
                <p className="text-orange mb-2">Head of Data Science</p>
                <p className="text-secondary-custom small">
                  Real estate data specialist with expertise in market analysis, property valuation, and predictive modeling.
                </p>
              </div>
            </div>
          </Col>
        </Row>

        {/* Technology Section */}
        <Row className="mb-5">
          <Col lg={8} className="mx-auto">
            <div className="table-container-figma">
              <div className="table-header-figma">
                <h3 className="text-primary-custom mb-0">🔬 Our Technology</h3>
                <p className="text-secondary-custom mb-0 mt-1">
                  Advanced AI and data science powering accurate rental analysis
                </p>
              </div>
              <div className="p-4">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <div className="icon-figma me-3" style={{ width: "48px", height: "48px" }}>
                        <span style={{ fontSize: "24px", color: "white" }}>🤖</span>
                      </div>
                      <div>
                        <h6 className="text-primary-custom fw-bold">AI-Powered Analysis</h6>
                        <p className="text-secondary-custom mb-0">
                          Our proprietary machine learning algorithms analyze thousands of data points 
                          to provide accurate rental estimates and market insights.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <div className="icon-figma me-3" style={{ width: "48px", height: "48px" }}>
                        <span style={{ fontSize: "24px", color: "white" }}>📊</span>
                      </div>
                      <div>
                        <h6 className="text-primary-custom fw-bold">Real-Time Data</h6>
                        <p className="text-secondary-custom mb-0">
                          We integrate with multiple data sources to ensure our analysis is based on 
                          the most current market conditions and property information.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <div className="icon-figma me-3" style={{ width: "48px", height: "48px" }}>
                        <span style={{ fontSize: "24px", color: "white" }}>🔍</span>
                      </div>
                      <div>
                        <h6 className="text-primary-custom fw-bold">Comprehensive Reports</h6>
                        <p className="text-secondary-custom mb-0">
                          Our reports include market trends, comparable properties, neighborhood insights, 
                          and detailed rental recommendations with confidence scores.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <div className="icon-figma me-3" style={{ width: "48px", height: "48px" }}>
                        <span style={{ fontSize: "24px", color: "white" }}>⚡</span>
                      </div>
                      <div>
                        <h6 className="text-primary-custom fw-bold">Lightning Fast</h6>
                        <p className="text-secondary-custom mb-0">
                          Get comprehensive rental analysis in under 60 seconds, 
                          giving you the speed you need in today's fast-paced market.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Stats Section */}
        <Row className="mb-5">
          <Col>
            <div className="bg-gradient-primary text-white rounded-figma-lg p-5">
              <div className="text-center mb-4">
                <h3 className="fw-bold mb-3">�� RentIntel by the Numbers</h3>
                <p className="lead opacity-75">
                  Our impact on the real estate industry
                </p>
              </div>
              
              <div className="row g-4 text-center">
                <div className="col-md-3">
                  <div className="icon-figma mx-auto mb-3" style={{ width: "80px", height: "80px" }}>
                    <span style={{ fontSize: "40px", color: "white" }}>👥</span>
                  </div>
                  <h2 className="fw-bold mb-2">10,000+</h2>
                  <p className="mb-0 opacity-75">Active Users</p>
                </div>
                
                <div className="col-md-3">
                  <div className="icon-figma mx-auto mb-3" style={{ width: "80px", height: "80px" }}>
                    <span style={{ fontSize: "40px", color: "white" }}>🏠</span>
                  </div>
                  <h2 className="fw-bold mb-2">50,000+</h2>
                  <p className="mb-0 opacity-75">Properties Analyzed</p>
                </div>
                
                <div className="col-md-3">
                  <div className="icon-figma mx-auto mb-3" style={{ width: "80px", height: "80px" }}>
                    <span style={{ fontSize: "40px", color: "white" }}>📊</span>
                  </div>
                  <h2 className="fw-bold mb-2">95%</h2>
                  <p className="mb-0 opacity-75">Accuracy Rate</p>
                </div>
                
                <div className="col-md-3">
                  <div className="icon-figma mx-auto mb-3" style={{ width: "80px", height: "80px" }}>
                    <span style={{ fontSize: "40px", color: "white" }}>⚡</span>
                  </div>
                  <h2 className="fw-bold mb-2">45s</h2>
                  <p className="mb-0 opacity-75">Average Analysis Time</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Contact CTA */}
        <Row>
          <Col lg={8} className="mx-auto">
            <div className="text-center">
              <h3 className="text-primary-custom fw-bold mb-4">🤝 Ready to Get Started?</h3>
              <p className="lead text-secondary-custom mb-4">
                Join thousands of real estate professionals who trust RentIntel for their rental analysis needs.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link href="/signup" className="btn btn-primary-gradient btn-lg">
                  🚀 Start Free Trial
                </Link>
                <Link href="/contact-us" className="btn btn-outline-gradient btn-lg">
                  📞 Contact Sales
                </Link>
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
              <h3 className="fw-bold mb-3">Have Questions About RentIntel?</h3>
              <p className="lead mb-4">
                Our team is here to help you succeed with your rental property investments.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link href="/contact-us" className="btn btn-light btn-lg">
                  📞 Contact Us
                </Link>
                <Link href="/privacy-policy" className="btn btn-outline-light btn-lg">
                  �� Privacy Policy
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
