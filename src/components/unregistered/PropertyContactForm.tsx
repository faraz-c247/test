"use client";

import React from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaLocationDot, FaChevronDown, FaArrowRight } from "react-icons/fa6";
import { UnregisteredUserFormData } from "@/app/get-report/page";

const propertyContactSchema = yup.object({
  propertyDetails: yup.object({
    address: yup.string().required("Property address is required"),
    propertyType: yup
      .string()
      .oneOf(["apartment", "house", "condo", "townhouse", "studio"])
      .required("Property type is required"),
    bedrooms: yup.string().required("Bedrooms required"),
    bathrooms: yup.string().required("Bathrooms required"),
    squareFeet: yup.number().min(100).max(20000).optional(),
    yearBuilt: yup.number().min(1800).max(2024).optional(),
    parking: yup.number().min(0).max(20).optional(),
    furnished: yup.boolean().optional(),
    petPolicy: yup
      .string()
      .oneOf(["allowed", "not-allowed", "conditional"])
      .optional(),
  }),
  contactInfo: yup.object({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: yup.string().optional(),
  }),
});

type PropertyContactFormData = yup.InferType<typeof propertyContactSchema>;

interface PropertyContactFormProps {
  formData: UnregisteredUserFormData;
  onComplete: (data: Partial<UnregisteredUserFormData>) => void;
}

export default function PropertyContactForm({
  formData,
  onComplete,
}: PropertyContactFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PropertyContactFormData>({
    resolver: yupResolver(propertyContactSchema),
    defaultValues: {
      propertyDetails: formData.propertyDetails,
      contactInfo: formData.contactInfo,
    },
  });

  const onSubmit = (data: PropertyContactFormData) => {
    onComplete(data);
  };

  return (
    <div
      style={{
        background:
          "linear-gradient(180deg, rgba(84, 245, 21, 1) 0%, rgba(255, 255, 255, 1) 37%)",
        minHeight: "100vh",
        width: "100%",
        margin: 0,
        padding: "40px 10px 100px 10px", // Reduced top padding since we have fixed header
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "60px",
          width: "100%",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            fontWeight: 700,
            color: "#343434",
            fontFamily: "Poppins",
            lineHeight: "1.2",
            marginBottom: "10px",
          }}
        >
          Get Your Rental Intelligence Report
        </h1>
        <p
          style={{
            fontSize: "18px",
            fontWeight: 400,
            color: "#595959",
            fontFamily: "Poppins",
            lineHeight: "1.5",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          Make informed rental decisions with our comprehensive AI-powered
          analysis. Get accurate rent estimates, market trends, and property
          insights in minutes.
        </p>
      </div>

      {/* Multi-Step Form Container */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "none",
          overflow: "hidden",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {/* Step Indicator */}
        <div
          style={{
            display: "flex",
            justifyContent: "stretch",
            alignItems: "stretch",
            gap: "60px",
            borderBottom: "1px solid #CECECE",
            padding: "0",
          }}
        >
          {/* Step 1 - Active */}
          <div
            style={{
              flex: 1,
              padding: "16px 24px",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "54px",
                  height: "54px",
                  backgroundColor: "#FFB24A",
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
                  01
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
                Property & Contact Info
              </span>
            </div>
            {/* Arrow */}
            <div
              style={{
                position: "absolute",
                right: "-7.5px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "15px",
                height: "86px",
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='15' height='86' viewBox='0 0 15 86' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L14 43L1 85' stroke='%23CECECE' stroke-width='1'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            />
          </div>

          {/* Step 2 - Inactive */}
          <div
            style={{
              flex: 1,
              padding: "16px 24px",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
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
                  02
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
                Choose a Report Tier
              </span>
            </div>
            {/* Arrow */}
            <div
              style={{
                position: "absolute",
                right: "-7.5px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "15px",
                height: "86px",
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='15' height='86' viewBox='0 0 15 86' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L14 43L1 85' stroke='%23CECECE' stroke-width='1'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            />
          </div>

          {/* Step 3 - Inactive */}
          <div
            style={{
              flex: 1,
              padding: "16px 24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
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

        {/* Form Section */}
        <div style={{ padding: "60px 80px", boxSizing: "border-box" }}>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: 600,
              color: "#222222",
              fontFamily: "Poppins",
              marginBottom: "50px",
            }}
          >
            Property & Contact Information
          </h2>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <div
              style={{
                display: "flex",
                gap: "60px",
                alignItems: "flex-start",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              {/* Left Column - Contact Information First, then Property Info */}
              <div
                style={{
                  flex: "3",
                  display: "flex",
                  flexDirection: "column",
                  gap: "40px",
                  width: "100%",
                }}
              >
                {/* Contact Information Section */}
                <div>
                  <h3
                    style={{
                      fontSize: "22px",
                      fontWeight: 600,
                      color: "#222222",
                      fontFamily: "Poppins",
                      marginBottom: "40px",
                    }}
                  >
                    Contact Information
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "40px",
                    }}
                  >
                    {/* First and Last Name Row */}
                    <div
                      style={{
                        display: "flex",
                        gap: "30px",
                        width: "100%",
                      }}
                    >
                      {/* First Name */}
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            border: "1px solid #CECECE",
                            borderRadius: "6px",
                            padding: "18px 24px",
                            position: "relative",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              top: "-14px",
                              left: "18px",
                              backgroundColor: "#FFFFFF",
                              padding: "2px 6px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: 500,
                                color: "#222222",
                                fontFamily: "Poppins",
                              }}
                            >
                              First Name
                            </span>
                          </div>
                          <Form.Control
                            type="text"
                            placeholder="Enter Your First Name"
                            {...register("contactInfo.firstName")}
                            isInvalid={!!errors.contactInfo?.firstName}
                            style={{
                              border: "none",
                              padding: 0,
                              fontSize: "16px",
                              fontFamily: "Poppins",
                              color: "#848484",
                              backgroundColor: "transparent",
                              boxShadow: "none",
                            }}
                          />
                          {errors.contactInfo?.firstName && (
                            <Form.Control.Feedback type="invalid">
                              {errors.contactInfo.firstName.message}
                            </Form.Control.Feedback>
                          )}
                        </div>
                      </div>

                      {/* Last Name */}
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            border: "1px solid #CECECE",
                            borderRadius: "6px",
                            padding: "18px 24px",
                            position: "relative",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              top: "-14px",
                              left: "18px",
                              backgroundColor: "#FFFFFF",
                              padding: "2px 6px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: 500,
                                color: "#222222",
                                fontFamily: "Poppins",
                              }}
                            >
                              Last Name
                            </span>
                          </div>
                          <Form.Control
                            type="text"
                            placeholder="Enter Your Last Name"
                            {...register("contactInfo.lastName")}
                            isInvalid={!!errors.contactInfo?.lastName}
                            style={{
                              border: "none",
                              padding: 0,
                              fontSize: "16px",
                              fontFamily: "Poppins",
                              color: "#848484",
                              backgroundColor: "transparent",
                              boxShadow: "none",
                            }}
                          />
                          {errors.contactInfo?.lastName && (
                            <Form.Control.Feedback type="invalid">
                              {errors.contactInfo.lastName.message}
                            </Form.Control.Feedback>
                          )}
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            border: "1px solid #CECECE",
                            borderRadius: "6px",
                            padding: "18px 24px",
                            position: "relative",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              top: "-14px",
                              left: "18px",
                              backgroundColor: "#FFFFFF",
                              padding: "2px 6px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: 500,
                                color: "#222222",
                                fontFamily: "Poppins",
                              }}
                            >
                              Phone Number
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: 500,
                                color: "#222222",
                                fontFamily: "Poppins",
                              }}
                            >
                              +1
                            </span>
                            <Form.Control
                              type="tel"
                              placeholder="202-555-0198"
                              {...register("contactInfo.phoneNumber")}
                              isInvalid={!!errors.contactInfo?.phoneNumber}
                              style={{
                                border: "none",
                                padding: 0,
                                fontSize: "16px",
                                fontFamily: "Poppins",
                                color: "#848484",
                                backgroundColor: "transparent",
                                boxShadow: "none",
                              }}
                            />
                          </div>
                          {errors.contactInfo?.phoneNumber && (
                            <Form.Control.Feedback type="invalid">
                              {errors.contactInfo.phoneNumber.message}
                            </Form.Control.Feedback>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <div
                        style={{
                          border: "1px solid #CECECE",
                          borderRadius: "6px",
                          padding: "18px 24px",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: "-14px",
                            left: "18px",
                            backgroundColor: "#FFFFFF",
                            padding: "2px 6px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: 500,
                              color: "#222222",
                              fontFamily: "Poppins",
                            }}
                          >
                            Email Address *
                          </span>
                        </div>
                        <Form.Control
                          type="email"
                          placeholder="Enter Your Email Address"
                          {...register("contactInfo.email")}
                          isInvalid={!!errors.contactInfo?.email}
                          style={{
                            border: "none",
                            padding: 0,
                            fontSize: "16px",
                            fontFamily: "Poppins",
                            color: "#848484",
                            backgroundColor: "transparent",
                            boxShadow: "none",
                          }}
                        />
                        {errors.contactInfo?.email && (
                          <Form.Control.Feedback type="invalid">
                            {errors.contactInfo.email.message}
                          </Form.Control.Feedback>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Property Information Section */}
                <div>
                  <h3
                    style={{
                      fontSize: "22px",
                      fontWeight: 600,
                      color: "#222222",
                      fontFamily: "Poppins",
                      marginBottom: "40px",
                    }}
                  >
                    Property Information
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "50px",
                    }}
                  >
                    {/* Property Address */}
                    <div>
                      <div
                        style={{
                          border: "1px solid #CECECE",
                          borderRadius: "6px",
                          padding: "18px",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: "-14px",
                            left: "18px",
                            backgroundColor: "#FFFFFF",
                            padding: "2px 6px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: 500,
                              color: "#222222",
                              fontFamily: "Poppins",
                            }}
                          >
                            Property Address *
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <FaLocationDot
                            style={{
                              width: "20px",
                              height: "20px",
                              color: "#424242",
                            }}
                          />
                          <Form.Control
                            type="text"
                            placeholder="Enter Property Address"
                            {...register("propertyDetails.address")}
                            isInvalid={!!errors.propertyDetails?.address}
                            style={{
                              border: "none",
                              padding: 0,
                              fontSize: "16px",
                              fontFamily: "Poppins",
                              color: "#848484",
                              backgroundColor: "transparent",
                              boxShadow: "none",
                            }}
                          />
                        </div>
                        {errors.propertyDetails?.address && (
                          <Form.Control.Feedback type="invalid">
                            {errors.propertyDetails.address.message}
                          </Form.Control.Feedback>
                        )}
                      </div>
                    </div>

                    {/* Property Type, Bedrooms, Bathrooms */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                      }}
                    >
                      {/* Property Type */}
                      <div>
                        <div
                          style={{
                            border: "1px solid #CECECE",
                            borderRadius: "6px",
                            padding: "18px 24px",
                            position: "relative",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              top: "-14px",
                              left: "18px",
                              backgroundColor: "#FFFFFF",
                              padding: "2px 6px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: 500,
                                color: "#222222",
                                fontFamily: "Poppins",
                              }}
                            >
                              Property Type *
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Form.Select
                              {...register("propertyDetails.propertyType")}
                              isInvalid={!!errors.propertyDetails?.propertyType}
                              style={{
                                border: "none",
                                padding: 0,
                                fontSize: "16px",
                                fontFamily: "Poppins",
                                color: "#848484",
                                backgroundColor: "transparent",
                                boxShadow: "none",
                                appearance: "none",
                              }}
                            >
                              <option value="">Select Property Type</option>
                              <option value="apartment">Apartment</option>
                              <option value="house">House</option>
                              <option value="condo">Condo</option>
                              <option value="townhouse">Townhouse</option>
                              <option value="studio">Studio</option>
                            </Form.Select>
                            <FaChevronDown
                              style={{
                                width: "14px",
                                height: "14px",
                                color: "#424242",
                                pointerEvents: "none",
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Bedrooms */}
                      <div>
                        <div
                          style={{
                            border: "1px solid #CECECE",
                            borderRadius: "6px",
                            padding: "18px 24px",
                            position: "relative",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              top: "-14px",
                              left: "18px",
                              backgroundColor: "#FFFFFF",
                              padding: "2px 6px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: 500,
                                color: "#222222",
                                fontFamily: "Poppins",
                              }}
                            >
                              Bedrooms *
                            </span>
                          </div>
                          <Form.Select
                            {...register("propertyDetails.bedrooms")}
                            isInvalid={!!errors.propertyDetails?.bedrooms}
                            style={{
                              border: "none",
                              padding: 0,
                              fontSize: "16px",
                              fontFamily: "Poppins",
                              color: "#848484",
                              backgroundColor: "transparent",
                              boxShadow: "none",
                              appearance: "none",
                            }}
                          >
                            <option value="">Select</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5+</option>
                          </Form.Select>
                        </div>
                      </div>

                      {/* Bathrooms */}
                      <div>
                        <div
                          style={{
                            border: "1px solid #CECECE",
                            borderRadius: "6px",
                            padding: "18px 24px",
                            position: "relative",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              top: "-14px",
                              left: "18px",
                              backgroundColor: "#FFFFFF",
                              padding: "2px 6px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: 500,
                                color: "#222222",
                                fontFamily: "Poppins",
                              }}
                            >
                              Bathrooms *
                            </span>
                          </div>
                          <Form.Select
                            {...register("propertyDetails.bathrooms")}
                            isInvalid={!!errors.propertyDetails?.bathrooms}
                            style={{
                              border: "none",
                              padding: 0,
                              fontSize: "16px",
                              fontFamily: "Poppins",
                              color: "#848484",
                              backgroundColor: "transparent",
                              boxShadow: "none",
                              appearance: "none",
                            }}
                          >
                            <option value="">Select</option>
                            <option value="1">1</option>
                            <option value="1.5">1.5</option>
                            <option value="2">2</option>
                            <option value="2.5">2.5</option>
                            <option value="3">3</option>
                            <option value="3.5">3.5</option>
                            <option value="4">4+</option>
                          </Form.Select>
                        </div>
                      </div>
                    </div>

                    {/* Continue Button */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        type="submit"
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
                        <FaArrowRight
                          style={{
                            width: "16px",
                            height: "16px",
                            transform: "rotate(180deg)",
                          }}
                        />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Property Map */}
              <div
                style={{
                  flex: "2",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  minHeight: "400px",
                  maxWidth: "500px",
                }}
              >
                {/* Property Map Container */}
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "2px solid #EEEEEE",
                    borderRadius: "6px",
                    padding: "10px",
                    boxShadow: "0px 0px 16px 0px rgba(0, 0, 0, 0.08)",
                    height: "500px",
                    position: "relative",
                    overflow: "hidden",
                    width: "100%",
                  }}
                >
                  {/* Map Background */}
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: "4px",
                      position: "relative",
                    }}
                  >
                    {/* Map Placeholder */}
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        color: "#FFFFFF",
                        fontSize: "16px",
                        fontFamily: "Poppins",
                        fontWeight: 500,
                        textAlign: "center",
                      }}
                    >
                      🗺️ <br />
                      Property Map View
                      <br />
                      <small style={{ opacity: 0.8 }}>
                        Enter address to view location
                      </small>
                    </div>

                    {/* Map Marker */}
                    <div
                      style={{
                        position: "absolute",
                        top: "45%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "27px",
                        height: "43px",
                      }}
                    >
                      {/* Marker Pin */}
                      <div
                        style={{
                          position: "relative",
                          width: "25px",
                          height: "38px",
                          backgroundColor: "#EA352B",
                          borderRadius: "50% 50% 50% 0",
                          transform: "rotate(-45deg)",
                          border: "1px solid rgba(255, 255, 255, 0.5)",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%) rotate(45deg)",
                            width: "10px",
                            height: "10px",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            borderRadius: "50%",
                          }}
                        />
                      </div>
                      {/* Marker Shadow */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: "-5px",
                          left: "9px",
                          width: "9px",
                          height: "5px",
                          backgroundColor: "rgba(0, 0, 0, 0.12)",
                          borderRadius: "50%",
                          filter: "blur(2px)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
