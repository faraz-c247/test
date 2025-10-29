"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Alert,
  Spinner,
  Form,
} from "react-bootstrap";
import SidebarLayout from "@/components/common/SidebarLayout";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Modal from "@/components/common/Modal";
import {
  useSubscriptionPlansQuery,
  useUserCreditsQuery,
  useValidatePromoCodeMutation,
  useCompletePurchaseMutation,
} from "@/hooks/useSubscription";
import { toast } from "react-hot-toast";
import apiClient from "@/lib/apiClient";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type {
  SubscriptionPlan,
  PaymentFormProps,
  PromoCodeFormData,
  PaymentFormData,
  ApiError,
  PromoCodeDiscount,
} from "@/types/subscription";

// Initialize Stripe
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
console.log("Stripe key loaded:", stripeKey ? "Yes" : "No");
const stripePromise = loadStripe(stripeKey);

// Form schema for promo code
const promoCodeSchema = yup.object({
  promoCode: yup.string().optional(),
});

// Payment Form Component
function PaymentForm({
  selectedPlan,
  onSuccess,
  onCancel,
  isLoading,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [completingPurchase, setCompletingPurchase] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Promo code states
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState<string>("");
  const [finalPrice, setFinalPrice] = useState(selectedPlan?.price || 0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const validatePromoMutation = useValidatePromoCodeMutation();
  const completePurchaseMutation = useCompletePurchaseMutation();

  // Form handling
  const {
    register,
    watch,
    handleSubmit: handlePromoSubmit,
  } = useForm<PromoCodeFormData>({
    resolver: yupResolver(promoCodeSchema),
  });

  const promoCode = watch("promoCode");

  // Update final price when selected plan changes
  React.useEffect(() => {
    if (selectedPlan?.price && !promoApplied) {
      setFinalPrice(selectedPlan.price);
    }
  }, [selectedPlan?.price, promoApplied]);

  // Early return if selectedPlan is invalid
  if (!selectedPlan) {
    return (
      <div className="p-4 text-center">
        <Alert variant="danger">
          Error: No plan selected. Please try again.
        </Alert>
        <Button variant="secondary" onClick={onCancel}>
          Close
        </Button>
      </div>
    );
  }

  const handleApplyPromo = async () => {
    if (!promoCode) return;

    setPromoError("");

    try {
      const result = await validatePromoMutation.mutateAsync(promoCode);

      if (result.valid && result.discount) {
        setPromoApplied(true);

        // Calculate final price with discount
        let calculatedDiscount = 0;
        const planPrice = selectedPlan?.price || 0;
        if (result.discount.type === "percentage") {
          calculatedDiscount = planPrice * (result.discount.value / 100);
        } else if (result.discount.type === "fixed") {
          calculatedDiscount = result.discount.amount || 0;
        }

        const newFinalPrice = Math.max(0, planPrice - calculatedDiscount);
        setFinalPrice(newFinalPrice);
        setDiscountAmount(calculatedDiscount);

        toast.success(
          `Promo code applied! You saved $${calculatedDiscount.toFixed(2)}`
        );
      } else {
        setPromoError(result.error || "Invalid promo code");
        toast.error(result.error || "Invalid promo code");
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      setPromoError(apiError.message || "Failed to validate promo code");
      toast.error(apiError.message || "Failed to validate promo code");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      // Create payment intent (with promo code if applied)
      if (!selectedPlan?.id) {
        throw new Error("Invalid plan selected");
      }

      const paymentData: PaymentFormData = {
        planId: selectedPlan.id,
        amount: finalPrice * 100, // Convert to cents (use discounted price)
      };

      if (promoApplied && promoCode) {
        (
          paymentData as PaymentFormData & {
            promoCode: string;
            originalAmount: number;
          }
        ).promoCode = promoCode;
        (
          paymentData as PaymentFormData & {
            promoCode: string;
            originalAmount: number;
          }
        ).originalAmount = (selectedPlan.price || 0) * 100;
      }

      const response = await apiClient.post(
        "/subscription/create-payment-intent",
        paymentData
      );

      const { clientSecret } = response.data.data;

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        setError(result.error.message || "Payment failed");
      } else {
        // Payment succeeded, now complete the purchase on backend
        try {
          // Prevent multiple completion calls
          if (completingPurchase) {
            console.log("Purchase completion already in progress, skipping...");
            return;
          }
          setCompletingPurchase(true);

          console.log(
            "Payment succeeded. Payment Intent:",
            result.paymentIntent
          );
          console.log(
            "Payment Intent ID:",
            result.paymentIntent.id,
            "Type:",
            typeof result.paymentIntent.id
          );

          // Ensure payment intent ID is a clean string
          const paymentIntentId = String(result.paymentIntent.id).trim();

          if (!paymentIntentId || !paymentIntentId.startsWith("pi_")) {
            throw new Error(`Invalid payment intent ID: ${paymentIntentId}`);
          }

          await completePurchaseMutation.mutateAsync({
            paymentIntentId: paymentIntentId,
          });

          // Success toast is handled by the mutation hook
          onSuccess();
        } catch (completionError: any) {
          console.error("Purchase completion failed:", completionError);
          setError(
            "Payment succeeded but failed to add credits. Please contact support."
          );
          toast.error(
            "Payment succeeded but failed to add credits. Please contact support."
          );
        }
      }
    } catch (err: any) {
      setError(err.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="mb-4">
        <h5 className="fw-bold text-primary-custom mb-4">
          Complete Your Purchase
        </h5>
        <div className="d-flex justify-content-between align-items-center mb-4 p-4 bg-light rounded">
          <div>
            <div className="fw-semibold">
              {selectedPlan?.name || "Selected Plan"}
            </div>
            <small className="text-muted">
              {selectedPlan?.credits || 0} Credits
            </small>
          </div>
          <div>
            {promoApplied && discountAmount > 0 && (
              <div className="text-decoration-line-through text-muted small">
                ${selectedPlan?.price || 0}
              </div>
            )}
            <div className="h5 mb-0 text-primary-custom">
              ${finalPrice.toFixed(2)}
            </div>
            {promoApplied && discountAmount > 0 && (
              <small className="text-success">
                Saved ${discountAmount.toFixed(2)}
              </small>
            )}
          </div>
        </div>
      </div>

      {/* Promo Code Section */}
      <div className="mb-4">
        <label className="form-label fw-semibold">Promo Code (Optional)</label>
        <div className="d-flex gap-3">
          <div className="flex-grow-1">
            <input
              type="text"
              className="form-control"
              placeholder="Enter promo code"
              {...register("promoCode")}
              disabled={promoApplied}
            />
          </div>
          <Button
            type="button"
            variant="outline-primary"
            onClick={handleApplyPromo}
            disabled={
              promoApplied || !promoCode || validatePromoMutation.isPending
            }
          >
            {validatePromoMutation.isPending ? (
              <>
                <Spinner size="sm" className="me-2" />
                Applying...
              </>
            ) : promoApplied ? (
              "Applied"
            ) : (
              "Apply"
            )}
          </Button>
        </div>

        {promoError && (
          <Alert variant="danger" className="mt-2 mb-0">
            {promoError}
          </Alert>
        )}

        {promoApplied && (
          <Alert variant="success" className="mt-2 mb-0">
            Promo code applied! You saved ${discountAmount.toFixed(2)}
          </Alert>
        )}
      </div>

      <div className="mb-4">
        <label className="form-label fw-semibold">Card Information</label>
        <div className="p-4 border rounded">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="d-flex gap-4">
        <Button
          variant="outline-secondary"
          onClick={onCancel}
          className="flex-fill"
          disabled={processing}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          className="flex-fill btn-primary-gradient"
          disabled={!stripe || processing || completePurchaseMutation.isPending}
        >
          {processing ? (
            <>
              <Spinner size="sm" className="me-2" />
              Processing Payment...
            </>
          ) : completePurchaseMutation.isPending ? (
            <>
              <Spinner size="sm" className="me-2" />
              Adding Credits...
            </>
          ) : (
            `Pay $${finalPrice.toFixed(2)}`
          )}
        </Button>
      </div>
    </form>
  );
}

export default function PurchasePlansPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?message=Please log in to purchase plans");
    }
  }, [status, router]);

  // API calls
  const {
    data: plansData,
    isLoading: plansLoading,
    error: plansError,
  } = useSubscriptionPlansQuery();

  const {
    data: creditsData,
    isLoading: creditsLoading,
    refetch: refetchCredits,
  } = useUserCreditsQuery();

  if (status === "loading" || plansLoading || creditsLoading) {
    return (
      <SidebarLayout>
        <div className="main-content-figma">
          <Container className="py-5">
            <div className="table-empty-state">
              <LoadingSpinner size="lg" />
              <h5 className="text-primary-custom mt-3">Loading Plans...</h5>
              <p className="text-secondary-custom">
                Please wait while we fetch your subscription options.
              </p>
            </div>
          </Container>
        </div>
      </SidebarLayout>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect
  }

  if (plansError) {
    return (
      <SidebarLayout>
        <div className="main-content-figma">
          <Container className="py-5">
            <Alert variant="danger">
              <h5>Error Loading Plans</h5>
              <p>Unable to load subscription plans. Please try again later.</p>
            </Alert>
          </Container>
        </div>
      </SidebarLayout>
    );
  }

  const plans = plansData?.data?.plans || [];
  const credits = creditsData?.data;

  const handleSelectPlan = (plan: any) => {
    console.log("Selected plan:", plan);
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setSelectedPlan(null);
    refetchCredits(); // Refresh credits after purchase

    // Redirect to credits page to show the new credits
    router.push("/my-credits");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const calculatePricePerReport = (plan: any) => {
    const pricePerReport = plan.price / plan.credits;
    return formatCurrency(pricePerReport);
  };

  const calculateSavings = (plan: any) => {
    const oneOffPrice = 15; // Price of One-Off Report
    const totalOneOffPrice = oneOffPrice * plan.credits;
    const savings = totalOneOffPrice - plan.price;
    return savings > 0 ? savings : 0;
  };

  const getSavingsPercentage = (plan: any) => {
    const oneOffPrice = 15;
    const totalOneOffPrice = oneOffPrice * plan.credits;
    const savings = calculateSavings(plan);
    return Math.round((savings / totalOneOffPrice) * 100);
  };

  return (
    <SidebarLayout>
      <Container fluid className="py-4">
        {/* Header Section */}
        <div className="text-center mb-4">
          <div className="mb-4">
            <h1 className="h2 fw-bold text-primary-custom mb-3">
              Choose Your Plan
            </h1>
            <p className="text-muted mb-0">
              Unlock powerful rental intelligence with our flexible credit
              packages
            </p>
          </div>

          {credits && (
            <div className="d-inline-flex align-items-center bg-green-light px-3 py-2 rounded-figma">
              <div className="me-2">💳</div>
              <div className="text-start">
                <div className="h6 text-primary-custom mb-0">
                  {credits.remainingCredits} Credits
                </div>
                <small className="text-secondary-custom">
                  Available in your account
                </small>
              </div>
            </div>
          )}
        </div>

        {/* Current Credits Alert */}
        {credits && credits.remainingCredits > 0 && (
          <Alert
            variant="info"
            className="d-flex justify-content-between align-items-center mb-4 border-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-figma"
          >
            <div className="d-flex align-items-center">
              <span className="me-2">🎯</span>
              <div>
                <strong className="text-primary-custom">
                  You have {credits.remainingCredits} credits ready to use!
                </strong>
                <div className="small text-secondary-custom mt-1">
                  Generate up to {credits.remainingCredits} detailed property
                  report{credits.remainingCredits !== 1 ? "s" : ""} right now.
                </div>
              </div>
            </div>
            <Button
              variant="primary"
              className="rounded-figma fw-semibold px-3"
              as="a"
              href="/generate-report"
            >
              Generate Report →
            </Button>
          </Alert>
        )}

        {/* Subscription Plans */}
        <Row className="g-4 justify-content-center">
          {plans.map((plan: any, index: number) => {
            const isPopular = plan.name === "Pro 20-Pack";
            const savings = calculateSavings(plan);
            const savingsPercentage = getSavingsPercentage(plan);

            return (
              <Col key={plan.id} xl={3} lg={4} md={6}>
                <Card
                  className={`h-100 border-0 shadow-sm position-relative transition-all duration-300 hover:shadow-md ${
                    isPopular ? "border-primary-custom" : ""
                  }`}
                  style={{
                    background: isPopular
                      ? "linear-gradient(135deg, rgba(44, 162, 72, 0.05) 0%, rgba(44, 162, 72, 0.1) 100%)"
                      : "white",
                  }}
                >
                  {isPopular && (
                    <div className="position-absolute top-0 start-50 translate-middle z-3">
                      <Badge
                        className="px-2 py-1 rounded-figma fw-semibold"
                        style={{
                          background:
                            "linear-gradient(135deg, #FFB24A 0%, #FF8C42 100%)",
                          border: "none",
                          color: "white",
                          fontSize: "11px",
                        }}
                      >
                        ⭐ MOST POPULAR
                      </Badge>
                    </div>
                  )}

                  {savings > 0 && (
                    <div className="position-absolute top-0 end-0 m-2">
                      <Badge
                        bg="success"
                        className="rounded-figma px-2 py-1 fw-semibold"
                        style={{ fontSize: "10px" }}
                      >
                        Save {savingsPercentage}%
                      </Badge>
                    </div>
                  )}

                  <Card.Body className="p-4 text-center d-flex flex-column">
                    <div className="mb-4">
                      <div className="mb-3">
                        <div
                          className="mx-auto rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: "50px",
                            height: "50px",
                            background: isPopular
                              ? "linear-gradient(135deg, #2CA248 0%, #20CD2C 100%)"
                              : "linear-gradient(135deg, #133F71 0%, #0D2A4C 100%)",
                          }}
                        >
                          <span
                            className="text-white"
                            style={{ fontSize: "1.25rem" }}
                          >
                            {index === 0
                              ? "⚡"
                              : index === 1
                              ? "🚀"
                              : index === 2
                              ? "💎"
                              : index === 3
                              ? "🏢"
                              : "��"}
                          </span>
                        </div>
                      </div>

                      <h5 className="fw-bold text-primary-custom mb-2">
                        {plan.name}
                      </h5>
                      <p
                        className="text-secondary-custom small mb-0"
                        style={{ minHeight: "40px", fontSize: "13px" }}
                      >
                        {plan.description}
                      </p>
                    </div>

                    <div className="mb-4">
                      <div className="position-relative">
                        <div className="h3 fw-bold text-primary-custom mb-2">
                          {formatCurrency(plan.price)}
                        </div>
                        <div className="text-secondary-custom small">
                          {calculatePricePerReport(plan)} per report
                        </div>
                        {savings > 0 && (
                          <div className="small text-success fw-semibold mt-1">
                            Save {formatCurrency(savings)} vs individual reports
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-4 flex-grow-1">
                      <div className="d-flex justify-content-center align-items-center mb-3 p-3 bg-green-light rounded-figma">
                        <span className="me-2">📊</span>
                        <div>
                          <div className="h5 mb-0 text-primary-custom">
                            {plan.credits}
                          </div>
                          <div className="small text-secondary-custom">
                            Report{plan.credits !== 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>

                      {plan.expirationMonths && (
                        <div className="d-flex align-items-center justify-content-center text-secondary-custom small mb-3">
                          <span className="me-1">⏰</span>
                          Valid for {plan.expirationMonths} month
                          {plan.expirationMonths !== 1 ? "s" : ""}
                        </div>
                      )}

                      {!plan.expirationMonths && (
                        <div className="d-flex align-items-center justify-content-center text-success small mb-3">
                          <span className="me-1">♾️</span>
                          Never expires
                        </div>
                      )}

                      <div className="text-start">
                        <div className="small text-secondary-custom fw-semibold mb-2">
                          What's included:
                        </div>
                        <ul className="list-unstyled small text-secondary-custom">
                          <li className="d-flex align-items-center mb-2">
                            <span
                              className="text-success me-2"
                              style={{ fontSize: "10px" }}
                            >
                              ✅
                            </span>
                            Property Summary Analysis
                          </li>
                          <li className="d-flex align-items-center mb-2">
                            <span
                              className="text-success me-2"
                              style={{ fontSize: "10px" }}
                            >
                              ✅
                            </span>
                            Rent Estimate & Market Positioning
                          </li>
                          <li className="d-flex align-items-center mb-2">
                            <span
                              className="text-success me-2"
                              style={{ fontSize: "10px" }}
                            >
                              ✅
                            </span>
                            AI-Generated Investor Insights
                          </li>
                          <li className="d-flex align-items-center mb-2">
                            <span
                              className="text-success me-2"
                              style={{ fontSize: "10px" }}
                            >
                              ✅
                            </span>
                            Local Rent Comparables
                          </li>
                          <li className="d-flex align-items-center mb-2">
                            <span
                              className="text-success me-2"
                              style={{ fontSize: "10px" }}
                            >
                              ✅
                            </span>
                            Comprehensive Investor Metrics
                          </li>
                          <li className="d-flex align-items-center mb-2">
                            <span
                              className="text-success me-2"
                              style={{ fontSize: "10px" }}
                            >
                              ✅
                            </span>
                            PDF Download
                          </li>
                          {plan.credits >= 5 && (
                            <li className="d-flex align-items-center mb-2">
                              <span
                                className="text-warning me-2"
                                style={{ fontSize: "10px" }}
                              >
                                ⭐
                              </span>
                              Priority Support
                            </li>
                          )}
                          {plan.credits >= 20 && (
                            <li className="d-flex align-items-center mb-2">
                              <span
                                className="text-warning me-2"
                                style={{ fontSize: "10px" }}
                              >
                                📈
                              </span>
                              Advanced Analytics
                            </li>
                          )}
                          {plan.credits >= 50 && (
                            <li className="d-flex align-items-center mb-2">
                              <span
                                className="text-warning me-2"
                                style={{ fontSize: "10px" }}
                              >
                                🔗
                              </span>
                              API Access
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>

                    <Button
                      variant={isPopular ? "primary" : "outline-primary"}
                      className={`w-100 py-2 fw-semibold rounded-figma ${
                        isPopular ? "btn-primary-gradient" : ""
                      }`}
                      onClick={() => handleSelectPlan(plan)}
                      disabled={isLoading}
                      style={{
                        fontSize: "14px",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {isLoading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Processing...
                        </>
                      ) : (
                        `Get ${plan.name} - ${formatCurrency(plan.price)}`
                      )}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>

        {/* Payment Modal */}
        <Modal
          show={showPaymentModal}
          onHide={() => setShowPaymentModal(false)}
          title="Complete Payment"
          size="lg"
        >
          <Elements stripe={stripePromise}>
            <PaymentForm
              selectedPlan={selectedPlan}
              onSuccess={handlePaymentSuccess}
              onCancel={() => setShowPaymentModal(false)}
              isLoading={isLoading}
            />
          </Elements>
        </Modal>
      </Container>
    </SidebarLayout>
  );
}
