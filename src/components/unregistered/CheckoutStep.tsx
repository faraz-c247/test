"use client";

import React, { useState } from "react";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaCheck, FaCreditCard } from "react-icons/fa";
import { UnregisteredUserFormData } from "@/app/get-report/page";
import { useCreateUnregisteredUser } from "@/hooks/useAuth";
import { useValidatePromoCodeMutation } from "@/hooks/useSubscription";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import apiClient from "@/lib/apiClient";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import PaymentSuccessModal from "@/components/common/PaymentSuccessModal";

// Load Stripe
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
if (!stripeKey || stripeKey === "pk_test_51xxxxx") {
  console.warn(
    "⚠️ No valid Stripe publishable key found. Payment will be simulated."
  );
}
const stripePromise =
  stripeKey && stripeKey !== "pk_test_51xxxxx" ? loadStripe(stripeKey) : null;

const checkoutSchema = yup.object({
  promoCode: yup.string().optional(),
  termsAccepted: yup
    .boolean()
    .oneOf([true], "You must accept the terms of service"),
  informationalPurposesAccepted: yup
    .boolean()
    .oneOf([true], "You must acknowledge this is for informational purposes"),
});

type CheckoutFormData = yup.InferType<typeof checkoutSchema>;

interface CheckoutStepProps {
  formData: UnregisteredUserFormData;
  onComplete: (data: Partial<UnregisteredUserFormData>) => void;
  onPrevious: () => void;
}

// This component will handle the payment logic inside the main component

export default function CheckoutStep({
  formData,
  onComplete,
  onPrevious,
}: CheckoutStepProps) {
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState<any>(null);
  const [promoError, setPromoError] = useState<string>("");
  const validatePromoMutation = useValidatePromoCodeMutation();
  // TODO: Implement useCreateUnregisteredPaymentIntentWithPromoMutation
  // const createPaymentWithPromoMutation = useCreateUnregisteredPaymentIntentWithPromoMutation();
  const [finalPrice, setFinalPrice] = useState(formData.selectedPlan.price);
  const [processing, setProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const createUserMutation = useCreateUnregisteredUser();

  // Stripe hooks
  const stripe = useStripe();
  const elements = useElements();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CheckoutFormData>({
    resolver: yupResolver(checkoutSchema),
    defaultValues: {
      promoCode: formData.promoCode || "",
      termsAccepted: formData.termsAccepted,
      informationalPurposesAccepted: formData.informationalPurposesAccepted,
    },
  });

  const promoCode = watch("promoCode");

  const handleApplyPromo = async () => {
    console.log(" 96");
    if (!promoCode) return;

    setPromoError("");

    try {
      console.log("102", promoCode);

      const result = await validatePromoMutation.mutateAsync(promoCode);
      console.log("result", result);

      if (result.valid && result.discount) {
        setPromoDiscount(result.discount);
        setPromoApplied(true);

        // Calculate final price with discount
        let discountAmount = 0;
        if (result.discount.type === "percentage") {
          discountAmount =
            formData.selectedPlan.price * (result.discount.value / 100);
        } else if (result.discount.type === "fixed") {
          discountAmount = result.discount.amount || 0;
        }

        const newFinalPrice = Math.max(
          0,
          formData.selectedPlan.price - discountAmount
        );
        setFinalPrice(newFinalPrice);

        toast.success(
          `Promo code applied! You saved $${discountAmount.toFixed(2)}`
        );
      } else {
        setPromoError(result.error || "Invalid promo code");
        toast.error(result.error || "Invalid promo code");
      }
    } catch (error: any) {
      setPromoError(error.message || "Failed to validate promo code");
      toast.error(error.message || "Failed to validate promo code");
    }
  };

  const handleGoToLogin = async () => {
    setShowSuccessModal(false);

    // Auto-login the user if we have their credentials
    if (
      successData &&
      !successData.isExistingUser &&
      successData.defaultPassword
    ) {
      try {
        const result = await signIn("credentials", {
          email: successData.email,
          password: successData.defaultPassword,
          redirect: false,
        });

        if (result?.ok) {
          // Login successful, redirect to dashboard
          window.location.href = "/dashboard";
        } else {
          // Login failed, redirect to dashboard where they can login manually
          window.location.href = "/dashboard";
          toast.error("Please login with your credentials");
        }
      } catch (error) {
        console.error("Auto-login error:", error);
        window.location.href = "/dashboard";
        toast.error("Please login with your credentials");
      }
    } else {
      // For existing users, just redirect to dashboard
      window.location.href = "/dashboard";
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    // Optionally redirect to homepage
    window.location.href = "/";
  };

  const handlePaymentSuccess = async (
    paymentIntentId: string,
    checkoutData: CheckoutFormData
  ) => {
    try {
      // Create the complete form data
      const completeFormData = {
        ...formData,
        ...checkoutData,
      };

      // Create user with payment verification
      const userCreationData = {
        firstName: formData.contactInfo.firstName,
        lastName: formData.contactInfo.lastName,
        email: formData.contactInfo.email,
        phoneNumber: formData.contactInfo.phoneNumber,
        password: "123456", // Default password as requested
        propertyDetails: formData.propertyDetails,
        selectedPlan: formData.selectedPlan,
        finalPrice,
        paymentIntentId, // Include payment intent ID for verification
      };

      const result = await createUserMutation.mutateAsync(userCreationData);

      if (result.success) {
        // Show success modal instead of toast and redirect
        setSuccessData({
          email: formData.contactInfo.email,
          isExistingUser: result.data?.isExistingUser || false,
          defaultPassword: result.data?.defaultPassword,
        });
        setShowSuccessModal(true);
        onComplete(completeFormData);
      }
    } catch (error) {
      console.error("Error creating user after payment:", error);
      toast.error(
        "Payment succeeded but account creation failed. Please contact support."
      );
    }
  };

  const onSubmit = async (data: CheckoutFormData) => {
    setProcessing(true);

    // Check if Stripe is properly configured
    if (!stripe || !elements) {
      // Simulation mode - skip Stripe payment
      console.warn("🧪 Stripe not available - simulating payment");

      try {
        // Simulate payment with fake payment intent ID
        await handlePaymentSuccess("pi_simulated_" + Date.now(), data);
        return;
      } catch (error: any) {
        console.error("Error in simulation mode:", error);
        toast.error("Account creation failed");
        setProcessing(false);
        return;
      }
    }

    try {
      // Debug: Check if apiClient is available
      console.log("apiClient:", apiClient);

      // Create payment intent for unregistered user with promo code
      const response = await apiClient.post(
        "/subscription/create-unregistered-payment-intent",
        {
          selectedPlan: {
            ...formData.selectedPlan,
            finalPrice,
          },
          customerInfo: {
            email: formData.contactInfo.email,
            firstName: formData.contactInfo.firstName,
            lastName: formData.contactInfo.lastName,
            phoneNumber: formData.contactInfo.phoneNumber,
          },
        }
      );

      const { clientSecret } = response.data.data;

      // Confirm payment with Stripe
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${formData.contactInfo.firstName} ${formData.contactInfo.lastName}`,
            email: formData.contactInfo.email,
            phone: formData.contactInfo.phoneNumber,
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message || "Payment failed");
      } else {
        // Payment successful, now create user
        await handlePaymentSuccess(result.paymentIntent.id, data);
      }
    } catch (error: any) {
      console.error("Payment error details:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);

      const errorMessage =
        error.response?.data?.message || error.message || "Payment failed";
      toast.error(`Payment failed: ${errorMessage}`);
    } finally {
      setProcessing(false);
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

        {/* Step 2 - Completed */}
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
              Choose a Report Tier
            </span>
          </div>
        </div>

        {/* Step 3 - Active */}
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
                03
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
              Payment
            </span>
          </div>
        </div>
      </div>

      <Row>
        <Col lg={7}>
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
            Secure Checkout
          </h3>

          <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Promo Code Section */}
            <div style={{ marginBottom: "40px" }}>
              <h4
                style={{
                  fontSize: "22px",
                  fontWeight: 600,
                  color: "#222222",
                  fontFamily: "Poppins",
                  marginBottom: "30px",
                }}
              >
                Promo Code Entry (Optional)
              </h4>

              <Row className="g-3">
                <Col md={8}>
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
                        Promo code
                      </span>
                    </div>
                    <Form.Control
                      type="text"
                      placeholder="Enter Promo Code"
                      {...register("promoCode")}
                      disabled={promoApplied}
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
                </Col>
                <Col md={4}>
                  <Button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={promoApplied || !promoCode}
                    style={{
                      border: "1px solid #CECECE",
                      borderRadius: "6px",
                      padding: "18px 24px",
                      fontSize: "18px",
                      fontFamily: "Poppins",
                      fontWeight: 600,
                      color: "#222222",
                      backgroundColor: "transparent",
                      width: "100%",
                    }}
                  >
                    {promoApplied ? "Applied" : "Apply"}
                  </Button>
                </Col>
              </Row>

              {promoError && (
                <Alert variant="danger" className="mt-3">
                  {promoError}
                </Alert>
              )}

              {promoApplied && (
                <Alert variant="success" className="mt-3">
                  Promo code applied! You saved $
                  {(formData.selectedPlan.price - finalPrice).toFixed(2)}
                </Alert>
              )}
            </div>

            {/* Terms and Conditions */}
            <div style={{ marginBottom: "40px", padding: "30px 0" }}>
              <div style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                  }}
                >
                  <Form.Check
                    type="checkbox"
                    id="terms-checkbox"
                    {...register("termsAccepted")}
                    isInvalid={!!errors.termsAccepted}
                    style={{ marginTop: "2px" }}
                  />
                  <Form.Label
                    htmlFor="terms-checkbox"
                    style={{
                      fontSize: "16px",
                      fontWeight: 400,
                      color: "#222222",
                      fontFamily: "Poppins",
                      lineHeight: "1.5",
                      cursor: "pointer",
                    }}
                  >
                    I acknowledge this is a digital product with final sales
                    policy and agree to the Terms of Service.
                  </Form.Label>
                </div>
                {errors.termsAccepted && (
                  <div
                    className="text-danger mt-1"
                    style={{ fontSize: "14px" }}
                  >
                    {errors.termsAccepted.message}
                  </div>
                )}
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                  }}
                >
                  <Form.Check
                    type="checkbox"
                    id="informational-checkbox"
                    {...register("informationalPurposesAccepted")}
                    isInvalid={!!errors.informationalPurposesAccepted}
                    style={{ marginTop: "2px" }}
                  />
                  <Form.Label
                    htmlFor="informational-checkbox"
                    style={{
                      fontSize: "16px",
                      fontWeight: 400,
                      color: "#222222",
                      fontFamily: "Poppins",
                      lineHeight: "1.5",
                      cursor: "pointer",
                    }}
                  >
                    I understand this report is for informational purposes only
                    and not professional financial advice.
                  </Form.Label>
                </div>
                {errors.informationalPurposesAccepted && (
                  <div
                    className="text-danger mt-1"
                    style={{ fontSize: "14px" }}
                  >
                    {errors.informationalPurposesAccepted.message}
                  </div>
                )}
              </div>
            </div>

            {/* Payment Information */}
            <div style={{ marginTop: "30px" }}>
              <h4
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#222222",
                  fontFamily: "Poppins",
                  marginBottom: "20px",
                }}
              >
                💳 Payment Information
              </h4>

              <div
                style={{
                  border: "2px solid #EEEEEE",
                  borderRadius: "10px",
                  padding: "20px",
                  backgroundColor: "#FAFAFA",
                }}
              >
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424242",
                        fontFamily: "Poppins",
                        "::placeholder": {
                          color: "#AAAAAA",
                        },
                      },
                      invalid: {
                        color: "#FA755A",
                        iconColor: "#FA755A",
                      },
                    },
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "10px",
                  color: "#666666",
                  fontSize: "14px",
                  fontFamily: "Poppins",
                }}
              >
                <FaCreditCard />
                Secured by Stripe • Test card: 4242 4242 4242 4242
              </div>
            </div>

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
                type="button"
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
                type="submit"
                disabled={processing || createUserMutation.isPending}
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
                  opacity:
                    processing || createUserMutation.isPending || !stripe
                      ? 0.7
                      : 1,
                }}
              >
                <FaCreditCard />
                {processing
                  ? "Processing Payment..."
                  : createUserMutation.isPending
                  ? "Creating Account..."
                  : !stripe
                  ? "Loading..."
                  : "Proceed to Payment"}
              </Button>
            </div>

            {createUserMutation.error && (
              <Alert variant="danger" className="mt-3">
                {createUserMutation.error.message}
              </Alert>
            )}

            {processing && (
              <Alert variant="info" className="mt-3">
                🔄 Processing your payment securely...
              </Alert>
            )}
          </Form>
        </Col>

        <Col lg={5}>
          {/* Order Summary */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "3px solid #EEEEEE",
              borderRadius: "20px",
              padding: "40px",
              height: "356px",
            }}
          >
            <h4
              style={{
                fontSize: "28px",
                fontWeight: 600,
                color: "#222222",
                fontFamily: "Poppins",
                marginBottom: "30px",
              }}
            >
              Order Summary
            </h4>

            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: 400,
                    color: "#424242",
                    fontFamily: "Poppins",
                  }}
                >
                  {formData.selectedPlan.title}
                </span>
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: 400,
                    color: "#424242",
                    fontFamily: "Poppins",
                  }}
                >
                  ${formData.selectedPlan.price}
                </span>
              </div>

              {promoError && (
                <Alert variant="danger" className="mt-3">
                  {promoError}
                </Alert>
              )}

              {promoApplied && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: 400,
                      color: "#2CA248",
                      fontFamily: "Poppins",
                    }}
                  >
                    Promo Discount
                  </span>
                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: 400,
                      color: "#2CA248",
                      fontFamily: "Poppins",
                    }}
                  >
                    -${(formData.selectedPlan.price - finalPrice).toFixed(2)}
                  </span>
                </div>
              )}

              <hr style={{ border: "1px solid #CECECE", margin: "20px 0" }} />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
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
                  Total
                </span>
                <span
                  style={{
                    fontSize: "22px",
                    fontWeight: 600,
                    color: "#2CA248",
                    fontFamily: "Poppins",
                  }}
                >
                  ${finalPrice}
                </span>
              </div>
            </div>

            {/* Property Summary */}
            <div
              style={{
                marginTop: "30px",
                padding: "20px 0",
                borderTop: "1px solid #EEEEEE",
              }}
            >
              <h5
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#222222",
                  fontFamily: "Poppins",
                  marginBottom: "15px",
                }}
              >
                Property Details
              </h5>

              <div
                style={{
                  fontSize: "14px",
                  color: "#424242",
                  fontFamily: "Poppins",
                }}
              >
                <div style={{ marginBottom: "8px" }}>
                  <strong>Address:</strong>{" "}
                  {formData.propertyDetails.address || "Not specified"}
                </div>
                <div style={{ marginBottom: "8px" }}>
                  <strong>Type:</strong>{" "}
                  {formData.propertyDetails.propertyType || "Not specified"}
                </div>
                <div style={{ marginBottom: "8px" }}>
                  <strong>Size:</strong>{" "}
                  {formData.propertyDetails.bedrooms || "Not specified"} bed,{" "}
                  {formData.propertyDetails.bathrooms || "Not specified"} bath
                </div>
                {formData.propertyDetails.squareFeet && (
                  <div>
                    <strong>Sq Ft:</strong>{" "}
                    {formData.propertyDetails.squareFeet.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Success Modal */}
      {successData && (
        <PaymentSuccessModal
          show={showSuccessModal}
          onHide={handleCloseSuccessModal}
          email={successData.email}
          isExistingUser={successData.isExistingUser}
          defaultPassword={successData.defaultPassword}
          onGoToLogin={handleGoToLogin}
        />
      )}
    </div>
  );
}

// Main component wrapped with Stripe Elements
export function CheckoutStepWithStripe(props: CheckoutStepProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutStep {...props} />
    </Elements>
  );
}
