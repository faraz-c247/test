"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import * as yup from "yup";
import PublicHeader from "@/components/common/PublicHeader";
import GooglePlacesAutocomplete, {
  StructuredAddress,
} from "@/components/common/GooglePlacesAutocomplete";

const schema = yup.object().shape({
  address: yup.string().required("Property address is required"),
  bedrooms: yup.string().required("Bedrooms are required"),
  bathrooms: yup.string().required("Bathrooms are required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function HomePage() {
  const [addressInput, setAddressInput] = React.useState<string>("");
  const [selectedAddress, setSelectedAddress] =
    React.useState<StructuredAddress | null>(null);

  return (
    <div className="homepage">
      <PublicHeader />

      {/* Hero Section with Banner Background - Updated to match Figma */}
      <section
        className="hero-section position-relative"
        style={{
          paddingTop: "120px", // Account for fixed header
          minHeight: "1200px", // Reduced height to prevent overlap
          background: "rgba(44, 162, 72, 0.08)",
          overflow: "hidden",
        }}
      >
        {/* Background Vector/Shape - Updated */}
        <div
          className="position-absolute"
          style={{
            top: "0",
            right: "0",
            width: "1244px",
            height: "550px",
            background: "rgba(44, 162, 72, 0.1)",
            zIndex: 0,
          }}
        ></div>

        {/* Banner Content Container */}
        <div
          className="container-fluid position-relative"
          style={{
            zIndex: 1,
            paddingLeft: "140px",
            paddingRight: "140px",
          }}
        >
          <div
            className="row g-0 align-items-center"
            style={{ minHeight: "700px" }}
          >
            {/* Left Column - Text Content */}
            <div className="col-lg-6 d-flex align-items-center">
              <div
                className="banner-content"
                style={{
                  width: "710px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "60px",
                  marginTop: "100px", // Reduced from 348px to prevent overlap
                }}
              >
                {/* Info Content */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  {/* Texts Container */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                    }}
                  >
                    {/* Subtitle Badge */}
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px 20px",
                        backgroundColor: "#FFB24A",
                        borderRadius: "30px",
                        width: "fit-content",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "Poppins",
                          fontWeight: 500,
                          fontSize: "18px",
                          lineHeight: "1.5em",
                          color: "#0D2A4C",
                        }}
                      >
                        Trusted by 1,000+ Landlords
                      </span>
                    </div>

                    {/* Main Heading */}
                    <h1
                      style={{
                        fontFamily: "Poppins",
                        fontWeight: 700,
                        fontSize: "58px",
                        lineHeight: "1.2em",
                        color: "#222222",
                        margin: 0,
                      }}
                    >
                      Smarter Rent Pricing in
                      <br />
                      60 Seconds
                    </h1>
                  </div>

                  {/* Description */}
                  <p
                    style={{
                      fontFamily: "Poppins",
                      fontWeight: 400,
                      fontSize: "24px",
                      lineHeight: "1.5em",
                      color: "#222222",
                      width: "667px",
                      margin: 0,
                    }}
                  >
                    Instant AI-Powered Rental Reports for Landlords & Investors
                  </p>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => (window.location.href = "/get-report")}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                    padding: "20px 46px",
                    borderRadius: "10px",
                    border: "none",
                    background:
                      "linear-gradient(90deg, rgba(19, 63, 113, 1) 0%, rgba(32, 205, 44, 1) 100%)",
                    cursor: "pointer",
                    fontFamily: "Poppins",
                    fontWeight: 600,
                    fontSize: "22px",
                    lineHeight: "1.4em",
                    color: "#FFFFFF",
                    width: "fit-content",
                  }}
                >
                  Get My Report
                </button>
              </div>
            </div>

            {/* Right Column - Banner Image */}
            <div className="col-lg-6">
              <div
                style={{
                  width: "100%",
                  height: "600px", // Adjusted height
                  marginTop: "100px", // Aligned with text content
                  position: "relative",
                }}
              >
                <Image
                  src="/images/banner-image.png"
                  alt="Rental Analysis"
                  fill
                  style={{
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Property Analysis Form - Updated positioning to avoid overlap */}
        <div
          className="position-absolute"
          style={{
            left: "50%",
            transform: "translateX(-50%)", // Center the form horizontally
            bottom: "-100px", // Moved up to prevent being hidden under next section
            width: "1390px",
            zIndex: 2, // High z-index to ensure it's on top
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "50px",
              padding: "40px 30px 50px",
              background: "linear-gradient(rgba(240, 188, 144, 0.9), #FFFFFF)",
              borderRadius: "24px",
              boxShadow: "0px 10px 30px 0px rgba(0, 0, 0, 0.25)",
            }}
          >
            {/* Form Title */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                width: "850px",
                textAlign: "center",
              }}
            >
              <h2
                style={{
                  fontFamily: "Poppins",
                  fontWeight: 700,
                  fontSize: "38px",
                  lineHeight: "1.3em",
                  color: "#222222",
                  margin: 0,
                }}
              >
                Get Your Property Analysis
              </h2>
              <p
                style={{
                  fontFamily: "Poppins",
                  fontWeight: 400,
                  fontSize: "20px",
                  lineHeight: "1.5em",
                  color: "#424242",
                  margin: 0,
                }}
              >
                Enter your property details to receive a comprehensive rental
                analysis report
              </p>
            </div>

            {/* Form Input Fields */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "30px",
                width: "1114px",
                justifyContent: "center", // Center the form fields
              }}
            >
              {/* Property Address - Full Width */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "540px",
                  height: "70px",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #CECECE",
                  borderRadius: "6px",
                  boxShadow: "0px 0px 12px 0px rgba(12, 12, 13, 0.22)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "56px",
                    height: "100%",
                    backgroundColor: "rgba(206, 206, 206, 0.5)",
                    borderRight: "1px solid #CECECE",
                    borderRadius: "6px 0 0 6px",
                  }}
                >
                  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                    <path
                      d="M13 1L13 13L21 21L13 13L5 21L13 13L13 1Z"
                      stroke="#848484"
                      strokeWidth="2"
                    />
                    <circle
                      cx="13"
                      cy="13"
                      r="3.9"
                      stroke="#848484"
                      strokeWidth="1.33"
                    />
                  </svg>
                </div>
                <GooglePlacesAutocomplete
                  placeholder="Property Address"
                  style={{
                    flex: 1,
                    height: "100%",
                    border: "none",
                    outline: "none",
                    padding: "6px 10px",
                    fontFamily: "Poppins",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "1.5em",
                    color: "#848484",
                    backgroundColor: "transparent",
                  }}
                  value={addressInput}
                  onChange={setAddressInput}
                  onPlaceSelect={(addr) => setSelectedAddress(addr)}
                />
              </div>

              {/* Email Address - Full Width */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "540px",
                  height: "70px",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #CECECE",
                  borderRadius: "6px",
                  boxShadow: "0px 0px 12px 0px rgba(12, 12, 13, 0.22)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "56px",
                    height: "100%",
                    backgroundColor: "rgba(206, 206, 206, 0.5)",
                    borderRight: "1px solid #CECECE",
                    borderRadius: "6px 0 0 6px",
                  }}
                >
                  <svg width="26" height="20" viewBox="0 0 26 20" fill="none">
                    <path d="M1 4L13 12L25 4V17H1V4Z" fill="#848484" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  style={{
                    flex: 1,
                    height: "100%",
                    border: "none",
                    outline: "none",
                    padding: "6px 10px",
                    fontFamily: "Poppins",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "1.5em",
                    color: "#848484",
                    backgroundColor: "transparent",
                  }}
                />
              </div>

              {/* Property Type */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "350px",
                  height: "70px",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #CECECE",
                  borderRadius: "6px",
                  boxShadow: "0px 0px 12px 0px rgba(12, 12, 13, 0.22)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "56px",
                    height: "100%",
                    backgroundColor: "rgba(206, 206, 206, 0.5)",
                    borderRight: "1px solid #CECECE",
                    borderRadius: "6px 0 0 6px",
                  }}
                >
                  <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
                    <rect x="4" y="2" width="14" height="17" fill="#848484" />
                  </svg>
                </div>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "6px 10px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Poppins",
                      fontWeight: 400,
                      fontSize: "16px",
                      lineHeight: "1.5em",
                      color: "#848484",
                    }}
                  >
                    Select Property Type
                  </span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M7 10L12 15L17 10"
                      stroke="#848484"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>

              {/* Bedrooms */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "350px",
                  height: "70px",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #CECECE",
                  borderRadius: "6px",
                  boxShadow: "0px 0px 12px 0px rgba(12, 12, 13, 0.22)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "56px",
                    height: "100%",
                    backgroundColor: "rgba(206, 206, 206, 0.5)",
                    borderRight: "1px solid #CECECE",
                    borderRadius: "6px 0 0 6px",
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <rect x="2" y="6" width="24" height="16" fill="#848484" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="3"
                  style={{
                    flex: 1,
                    height: "100%",
                    border: "none",
                    outline: "none",
                    padding: "6px 10px",
                    fontFamily: "Poppins",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "1.5em",
                    color: "#848484",
                    backgroundColor: "transparent",
                  }}
                />
              </div>

              {/* Bathrooms */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "350px",
                  height: "70px",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #CECECE",
                  borderRadius: "6px",
                  boxShadow: "0px 0px 12px 0px rgba(12, 12, 13, 0.22)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "56px",
                    height: "100%",
                    backgroundColor: "rgba(206, 206, 206, 0.5)",
                    borderRight: "1px solid #CECECE",
                    borderRadius: "6px 0 0 6px",
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <ellipse
                      cx="11"
                      cy="16"
                      rx="10"
                      ry="5"
                      stroke="#848484"
                      strokeWidth="1.5"
                    />
                    <ellipse
                      cx="11"
                      cy="16"
                      rx="11"
                      ry="6"
                      stroke="#848484"
                      strokeWidth="1.5"
                    />
                    <rect x="0" y="0" width="12" height="14" fill="#848484" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="2"
                  style={{
                    flex: 1,
                    height: "100%",
                    border: "none",
                    outline: "none",
                    padding: "6px 10px",
                    fontFamily: "Poppins",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "1.5em",
                    color: "#848484",
                    backgroundColor: "transparent",
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={() => (window.location.href = "/get-report")}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                padding: "20px 46px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#0D2A4C",
                cursor: "pointer",
                fontFamily: "Poppins",
                fontWeight: 600,
                fontSize: "22px",
                lineHeight: "1.4em",
                color: "#FFFFFF",
                width: "fit-content",
              }}
            >
              Generate Analysis Report
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-5" style={{ paddingTop: "200px" }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="h2 fw-bold text-dark mb-3">How It Works</h2>
            <p className="text-muted">
              Get professional rental market intelligence in three simple steps.
              Our automated system delivers comprehensive reports within
              minutes.
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            <div className="col-lg-4 text-center">
              <div className="step-item">
                <div
                  className="step-icon rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "120px",
                    height: "120px",
                    background:
                      "linear-gradient(135deg, #2CA248 0%, #20CD2C 100%)",
                  }}
                >
                  <Image
                    src="/images/step1-image.png"
                    alt="Step 1"
                    width={80}
                    height={80}
                    className="img-fluid"
                  />
                </div>
                <h3 className="h4 fw-bold text-dark mb-3">
                  Enter Property Info
                </h3>
                <p className="text-muted">
                  We collect rental comps, market trends, and neighborhood-level
                  data from trusted sources.
                </p>
              </div>
            </div>

            <div className="col-lg-4 text-center">
              <div className="step-item">
                <div
                  className="step-icon rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "120px",
                    height: "120px",
                    background:
                      "linear-gradient(135deg, #2CA248 0%, #20CD2C 100%)",
                  }}
                >
                  <Image
                    src="/images/step2-image.png"
                    alt="Step 2"
                    width={80}
                    height={80}
                    className="img-fluid"
                  />
                </div>
                <h3 className="h4 fw-bold text-dark mb-3">
                  Gather Market Data
                </h3>
                <p className="text-muted">
                  Our AI engine interprets the data, summarizes strategy, and
                  assembles the report.
                </p>
              </div>
            </div>

            <div className="col-lg-4 text-center">
              <div className="step-item">
                <div
                  className="step-icon rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "120px",
                    height: "120px",
                    background:
                      "linear-gradient(135deg, #2CA248 0%, #20CD2C 100%)",
                  }}
                >
                  <Image
                    src="/images/step3-image.png"
                    alt="Step 3"
                    width={80}
                    height={80}
                    className="img-fluid"
                  />
                </div>
                <h3 className="h4 fw-bold text-dark mb-3">
                  Receive AI Analysis Report
                </h3>
                <p className="text-muted">
                  Your investor-analysis PDF report specific to your property is
                  delivered to your inbox in minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Report Preview */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="h2 fw-bold text-dark mb-3">Sample Report Preview</h2>
            <p className="text-muted">
              See exactly what you'll receive. Preview a blurred snapshot below
              or view the complete sample report.
            </p>
          </div>

          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="sample-report-preview position-relative">
                <Image
                  src="/images/sample-report.png"
                  alt="Sample Report"
                  width={300}
                  height={400}
                  className="img-fluid rounded shadow"
                  style={{ filter: "blur(3px)" }}
                />
                <div className="overlay-content text-center position-absolute top-50 start-50 translate-middle">
                  <div
                    className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <i
                      className="bi bi-eye"
                      style={{ fontSize: "1.5rem", color: "#2CA248" }}
                    ></i>
                  </div>
                  <h3 className="h4 fw-bold text-dark mb-2">
                    Sample Report Preview
                  </h3>
                  <p className="text-muted mb-4">
                    This is a blurred preview. Click below to see the full
                    sample report.
                  </p>
                  <button className="btn btn-primary-gradient">
                    View Full Sample
                  </button>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <h3 className="h3 fw-bold text-dark mb-4">
                What's Included in Your Report
              </h3>

              <div className="features-list">
                {[
                  {
                    icon: "bi-geo-alt",
                    title: "Address-Based Rent Estimate",
                    description:
                      "Accurate market rent analysis using property-specific data and local comparables, giving you a clear snapshot of what your rental can earn today.",
                  },
                  {
                    icon: "bi-cpu",
                    title: "AI-Powered Data Insights",
                    description:
                      "Our AI engine analyzes vacancy rates, rent-to-income ratios, and 5-year rent growth trends to deliver a precise and accurate assessment of your property's rental performance and long-term stability.",
                  },
                  {
                    icon: "bi-pie-chart",
                    title: "Investor Metrics That Matter",
                    description:
                      "Cap rates, cash flow projections, and rent-to-value ratios are calculated for your property. These metrics highlight profitability and investment potential compared to local and national benchmarks.",
                  },
                  {
                    icon: "bi-graph-up",
                    title: "Trend & Formula Analysis",
                    description:
                      "We evaluate medium household income shifts, rent growth versus income growth, and historical vacancy cycles. This ensures you see how your property aligns with broader market health and risks.",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="feature-item d-flex align-items-start mb-4"
                  >
                    <div
                      className="feature-icon rounded d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "50px",
                        height: "50px",
                        minWidth: "50px",
                        backgroundColor: "#2CA248",
                        boxShadow: "-4px 4px 0px 0px rgba(44, 162, 72, 0.3)",
                      }}
                    >
                      <i
                        className={`bi ${feature.icon} text-white`}
                        style={{ fontSize: "20px" }}
                      ></i>
                    </div>
                    <div>
                      <h4 className="h6 fw-bold text-dark mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-muted small mb-0">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="card border-2 mt-4"
                style={{
                  borderColor:
                    "linear-gradient(90deg, #2CA248 15%, #54F515 100%)",
                  background: "white",
                }}
              >
                <div className="card-body text-center p-4">
                  <h4 className="fw-bold text-dark mb-2">
                    Ready to Get Your Report?
                  </h4>
                  <p className="text-muted mb-3">
                    Professional rental intelligence delivered in minutes, not
                    days.
                  </p>
                  <button
                    className="btn btn-primary-gradient"
                    onClick={() => (window.location.href = "/get-report")}
                  >
                    Get My Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        className="py-5 position-relative"
        style={{
          background: "linear-gradient(135deg, #109445 0%, #2CA248 100%)",
          overflow: "hidden",
        }}
      >
        {/* Background decorative elements */}
        <div
          className="position-absolute"
          style={{
            top: "50%",
            left: "-10%",
            width: "30%",
            height: "60%",
            background: "rgba(44, 162, 72, 0.7)",
            borderRadius: "50%",
            opacity: 0.08,
          }}
        ></div>

        <div className="container position-relative">
          <div className="row align-items-center">
            <div className="col-lg-5 text-white">
              <h2 className="h2 fw-bold mb-4">
                Smarter Rent Pricing Starts Here
              </h2>
              <p className="text-lg mb-4">
                Get instant, AI-powered rental reports tailored for landlords,
                investors, and property managers.
                <br />
                <br />
                No guesswork. No waiting. Just clear insights in minutes.
              </p>

              <ul className="list-unstyled">
                {[
                  "Accurate, address-based rent estimates",
                  "Market trends & comparable properties",
                  "Neighborhood demographics & investor metrics",
                ].map((item, index) => (
                  <li key={index} className="d-flex align-items-center mb-3">
                    <div
                      className="rounded-circle d-inline-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: "#FFB24A",
                      }}
                    >
                      <i
                        className="bi bi-check text-dark"
                        style={{ fontSize: "10px" }}
                      ></i>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-lg-7">
              <div className="row g-3">
                {[
                  {
                    name: "One-Off Report",
                    price: "$15",
                    description: "Quick insights when you need them",
                  },
                  {
                    name: "Starter 5-Pack",
                    price: "$59",
                    description: "Smart savings for growing portfolios",
                    popular: true,
                  },
                  {
                    name: "Pro 20-Pack",
                    price: "$219",
                    description: "Data power for active investors",
                  },
                  {
                    name: "Agency 50-Pack",
                    price: "$499",
                    description: "Scalable solutions for property pros",
                  },
                  {
                    name: "Enterprise 100-Pack",
                    price: "$849",
                    description: "Enterprise-level intelligence at scale",
                  },
                ].map((plan, index) => (
                  <div key={index} className="col-6 col-md-4 col-lg-2">
                    <div
                      className={`card h-100 ${
                        plan.popular ? "border-warning border-2" : ""
                      }`}
                      style={{
                        borderRadius: "15px",
                        boxShadow: "0px 4px 12px 0px rgba(56, 65, 64, 0.2)",
                      }}
                    >
                      {plan.popular && (
                        <div
                          className="position-absolute top-0 start-50 translate-middle badge px-3 py-2 rounded-pill"
                          style={{
                            marginTop: "-12px",
                            backgroundColor: "#FFB24A",
                            color: "#0D2A4C",
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
                        >
                          <i className="bi bi-star me-2"></i>
                          Most Popular
                        </div>
                      )}
                      <div className="card-body text-center p-3">
                        <h5 className="fw-bold text-dark mb-2">{plan.name}</h5>
                        <div className="price mb-2">
                          <span
                            className="h3 fw-bold"
                            style={{ color: "#2CA248" }}
                          >
                            {plan.price}
                          </span>
                        </div>
                        <p className="text-muted small mb-3">
                          {plan.description}
                        </p>
                        <button
                          className={`btn btn-sm w-100 ${
                            plan.popular ? "btn-primary" : "btn-outline-primary"
                          }`}
                        >
                          {plan.popular
                            ? "Get Starter Pack"
                            : `Buy ${plan.name}`}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="h2 fw-bold text-dark mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-muted">
              Everything you need to know about our rental intelligence reports
            </p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="accordion" id="faqAccordion">
                {[
                  "How accurate are your rental estimates?",
                  "How quickly do I receive my report?",
                  "What areas of analysis does the report cover?",
                  "What makes YourRentIntel different from other tools?",
                  "How reliable is the data over time?",
                ].map((question, index) => (
                  <div
                    key={index}
                    className="accordion-item mb-3"
                    style={{
                      border: "1px solid",
                      borderColor:
                        "linear-gradient(90deg, #2CA248 15%, #54F515 100%)",
                      borderRadius: "10px",
                    }}
                  >
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed fw-bold"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#faq${index}`}
                      >
                        {question}
                      </button>
                    </h2>
                    <div
                      id={`faq${index}`}
                      className="accordion-collapse collapse"
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body text-muted">
                        Detailed answer to this frequently asked question will
                        be provided here.
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="bg-dark text-white py-5"
        style={{ backgroundColor: "#0D2A4C" }}
      >
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4">
              <Image
                src="/images/logo.png"
                alt="RentIntel"
                width={100}
                height={50}
                className="mb-3"
              />
              <p className="text-muted">
                Your Edge in Rental Intelligence. Professional rental market
                reports powered by AI and real-time data.
              </p>
            </div>

            <div className="col-lg-2">
              <h6 className="fw-bold mb-3" style={{ color: "white" }}>
                Product
              </h6>
              <ul className="list-unstyled">
                <li>
                  <Link
                    href="/one-time-reports"
                    className="text-decoration-none"
                    style={{ color: "#CECECE" }}
                  >
                    One-Time Reports
                  </Link>
                </li>
                <li>
                  <Link
                    href="/purchase-plans"
                    className="text-decoration-none"
                    style={{ color: "#CECECE" }}
                  >
                    Subscription Plans
                  </Link>
                </li>
                <li>
                  <Link
                    href="/api-access"
                    className="text-decoration-none"
                    style={{ color: "#CECECE" }}
                  >
                    API Access
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sample-report"
                    className="text-decoration-none"
                    style={{ color: "#CECECE" }}
                  >
                    Sample Reports
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-lg-2">
              <h6 className="fw-bold mb-3" style={{ color: "white" }}>
                Company
              </h6>
              <ul className="list-unstyled">
                <li>
                  <Link
                    href="/about-us"
                    className="text-decoration-none"
                    style={{ color: "#CECECE" }}
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-decoration-none"
                    style={{ color: "#CECECE" }}
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-decoration-none"
                    style={{ color: "#CECECE" }}
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-decoration-none"
                    style={{ color: "#CECECE" }}
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-lg-2">
              <h6 className="fw-bold mb-3" style={{ color: "white" }}>
                Support
              </h6>
              <ul className="list-unstyled">
                <li>
                  <Link
                    href="/help"
                    className="text-decoration-none"
                    style={{ color: "#CECECE" }}
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-decoration-none"
                    style={{ color: "#CECECE" }}
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support"
                    className="text-decoration-none"
                    style={{ color: "#CECECE" }}
                  >
                    Technical Support
                  </Link>
                </li>
                <li>
                  <Link
                    href="/status"
                    className="text-decoration-none"
                    style={{ color: "#CECECE" }}
                  >
                    Status Page
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <hr
            className="my-4"
            style={{ borderColor: "#CECECE", opacity: 0.5 }}
          />

          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="text-muted mb-0">
                © 2025 All Rights Reserved | Powered by YourRentIntel
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="social-links">
                <Link href="#" className="me-3" style={{ color: "#CECECE" }}>
                  <i className="bi bi-twitter"></i>
                </Link>
                <Link href="#" className="me-3" style={{ color: "#CECECE" }}>
                  <i className="bi bi-facebook"></i>
                </Link>
                <Link href="#" style={{ color: "#CECECE" }}>
                  <i className="bi bi-linkedin"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
