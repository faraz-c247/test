"use client";

import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { FaCheck, FaStar } from "react-icons/fa";
import { UnregisteredUserFormData } from "@/app/get-report/page";

interface PlanSelectionProps {
  formData: UnregisteredUserFormData;
  onComplete: (data: Partial<UnregisteredUserFormData>) => void;
  onPrevious: () => void;
}

const plans = [
  {
    planType: "one-off" as const,
    title: "One-Off Report",
    price: 15,
    credits: 1,
    description: "Quick insights when you need them",
    features: [
      "1 Credit – Single-use report",
      "No expiration – use anytime",
      "Perfect for one-time analysis",
      "Quick, no-commitment option",
    ],
    isPopular: false,
  },
  {
    planType: "starter" as const,
    title: "Starter 5-Pack",
    price: 59,
    pricePerReport: "$11.80/report",
    credits: 5,
    description: "Smart savings for growing portfolios",
    features: [
      "5 Credits – multiple properties",
      "6-month expiration",
      "Great for small landlords or casual investors",
      "Save 21% vs one-off price",
    ],
    isPopular: true,
  },
  {
    planType: "pro" as const,
    title: "Pro 20-Pack",
    price: 219,
    pricePerReport: "$10.95/report",
    credits: 20,
    description: "Data power for active investors",
    features: [
      "20 Credits – extended use",
      "12-month expiration",
      "Ideal for active investors or property managers",
      "Save 27% vs one-off price",
    ],
    isPopular: false,
  },
  {
    planType: "agency" as const,
    title: "Agency 50-Pack",
    price: 499,
    pricePerReport: "$9.98/report",
    credits: 50,
    description: "Scalable solutions for property pros",
    features: [
      "50 Credits – large-scale analysis",
      "12-month expiration",
      "Designed for agencies and portfolio managers",
      "Save 33% vs one-off price",
    ],
    isPopular: false,
  },
  {
    planType: "enterprise" as const,
    title: "Enterprise 100-Pack",
    price: 849,
    pricePerReport: "$8.49/report",
    credits: 100,
    description: "Enterprise-level intelligence at scale",
    features: [
      "100 Credits – maximum coverage",
      "12-month expiration",
      "Best for enterprises & bulk report needs",
      "Save 43% vs one-off price",
    ],
    isPopular: false,
  },
];

export default function PlanSelectionStep({
  formData,
  onComplete,
  onPrevious,
}: PlanSelectionProps) {
  const [selectedPlan, setSelectedPlan] = useState(
    formData.selectedPlan.planType
  );

  const handleSubmit = () => {
    const plan = plans.find((p) => p.planType === selectedPlan);
    if (plan) {
      onComplete({
        selectedPlan: {
          planType: plan.planType,
          credits: plan.credits,
          price: plan.price,
          title: plan.title,
        },
      });
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "12px",
        boxShadow: "0px 8px 24px 0px rgba(56, 65, 64, 0.3)",
        padding: "60px",
      }}
    >
      {/* Step Indicator */}
      <div
        style={{
          display: "flex",
          justifyContent: "stretch",
          alignItems: "stretch",
          gap: "60px",
          marginBottom: "60px",
          borderBottom: "1px solid #CECECE",
          paddingBottom: "16px",
        }}
      >
        {/* Step 1 - Completed */}
        <div style={{ flex: 1, padding: "16px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "54px",
                height: "54px",
                backgroundColor: "#FFB24A",
                borderRadius: "50px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FaCheck style={{ color: "#FFFFFF", fontSize: "20px" }} />
            </div>
            <span
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#222222",
                fontFamily: "Poppins",
              }}
            >
              Property & Contact Info
            </span>
          </div>
        </div>

        {/* Step 2 - Active */}
        <div style={{ flex: 1, padding: "16px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "54px",
                height: "54px",
                backgroundColor: "#FFFFFF",
                border: "3px solid #FFB24A",
                borderRadius: "50px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: 600,
                  color: "#222222",
                  fontFamily: "Poppins",
                }}
              >
                02
              </span>
            </div>
            <span
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#222222",
                fontFamily: "Poppins",
              }}
            >
              Choose a Report Tier
            </span>
          </div>
        </div>

        {/* Step 3 - Inactive */}
        <div style={{ flex: 1, padding: "16px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "54px",
                height: "54px",
                border: "3px solid #CECECE",
                borderRadius: "50px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: 600,
                  color: "#848484",
                  fontFamily: "Poppins",
                }}
              >
                03
              </span>
            </div>
            <span
              style={{
                fontSize: "18px",
                fontWeight: 500,
                color: "#CECECE",
                fontFamily: "Poppins",
              }}
            >
              Review & Payment
            </span>
          </div>
        </div>
      </div>

      {/* Section Title */}
      <h3
        style={{
          fontSize: "28px",
          fontWeight: 600,
          color: "#222222",
          fontFamily: "Poppins",
          marginBottom: "50px",
        }}
      >
        Choose a Report Tier
      </h3>

      {/* Plans Grid */}
      <Row className="g-4 mb-5">
        {plans.map((plan) => (
          <Col key={plan.planType} lg={4} md={6}>
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "470px",
                backgroundColor: "#FFFFFF",
                border:
                  selectedPlan === plan.planType
                    ? "1.5px solid #FFB24A"
                    : "1px solid #CECECE",
                borderRadius: "20px",
                boxShadow: "0px 8px 24px 0px rgba(56, 65, 64, 0.3)",
                padding: "30px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
              onClick={() => setSelectedPlan(plan.planType)}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div
                  style={{
                    position: "absolute",
                    top: "-16px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "#FFB24A",
                    borderRadius: "20px",
                    padding: "6px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <FaStar style={{ color: "#0D2A4C", fontSize: "14px" }} />
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#0D2A4C",
                      fontFamily: "Poppins",
                    }}
                  >
                    Most Popular
                  </span>
                </div>
              )}

              {/* Header */}
              <div style={{ marginBottom: "30px" }}>
                <h4
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#222222",
                    fontFamily: "Poppins",
                    marginBottom: "5px",
                  }}
                >
                  {plan.title}
                </h4>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "5px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "38px",
                      fontWeight: 700,
                      color: "#2CA248",
                      fontFamily: "Poppins",
                    }}
                  >
                    ${plan.price}
                  </span>
                  {plan.pricePerReport && (
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: 400,
                        color: "#424242",
                        fontFamily: "Poppins",
                      }}
                    >
                      {plan.pricePerReport}
                    </span>
                  )}
                </div>

                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: 400,
                    color: "#424242",
                    fontFamily: "Poppins",
                    margin: 0,
                  }}
                >
                  {plan.description}
                </p>
              </div>

              {/* Features */}
              <div style={{ marginBottom: "30px" }}>
                <h5
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#222222",
                    fontFamily: "Poppins",
                    marginBottom: "10px",
                  }}
                >
                  Includes:
                </h5>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {plan.features.map((feature, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "6px",
                      }}
                    >
                      <FaCheck
                        style={{
                          color: "#2CA248",
                          fontSize: "12px",
                          marginTop: "4px",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: 400,
                          color: "#424242",
                          fontFamily: "Poppins",
                          lineHeight: "1.5",
                        }}
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Radio Button */}
              <div
                style={{
                  position: "absolute",
                  top: "11px",
                  right: "11px",
                  width: "30px",
                  height: "30px",
                }}
              >
                <div
                  style={{
                    width: "25px",
                    height: "25px",
                    border: "2px solid #CECECE",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor:
                      selectedPlan === plan.planType ? "#FFB24A" : "#FFFFFF",
                  }}
                >
                  {selectedPlan === plan.planType && (
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        backgroundColor: "#FFFFFF",
                        borderRadius: "50%",
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Form Actions */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <Button
          variant="outline-secondary"
          onClick={onPrevious}
          style={{
            border: "2px solid #CECECE",
            borderRadius: "10px",
            padding: "20px 30px",
            fontSize: "18px",
            fontFamily: "Poppins",
            fontWeight: 600,
            color: "#222222",
            backgroundColor: "transparent",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "20px" }}>←</span>
          Previous
        </Button>

        <Button
          onClick={handleSubmit}
          style={{
            background:
              "linear-gradient(90deg, rgba(19, 63, 113, 1) 0%, rgba(32, 205, 44, 1) 100%)",
            border: "none",
            borderRadius: "10px",
            padding: "20px 30px",
            fontSize: "18px",
            fontFamily: "Poppins",
            fontWeight: 600,
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          Continue
          <span style={{ fontSize: "20px" }}>→</span>
        </Button>
      </div>
    </div>
  );
}
