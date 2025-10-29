"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SidebarLayout from "@/components/common/SidebarLayout";
import { useUserCreditsQuery } from "@/hooks/useSubscription";
import { useGenerateReportMutation } from "@/hooks/useSubscription";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  address: yup.string().required("Property address is required"),
  bedrooms: yup
    .number()
    .min(1, "Bedrooms must be 1 or greater")
    .required("Number of bedrooms is required"),
  bathrooms: yup
    .number()
    .min(1, "Bathrooms must be 1 or greater")
    .required("Number of bathrooms is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email address is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function GenerateReportPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showCreditAlert, setShowCreditAlert] = useState(false);

  // API calls
  const { data: creditsData, isLoading: creditsLoading } =
    useUserCreditsQuery();
  const generateReport = useGenerateReportMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      bedrooms: 2,
      bathrooms: 2,
    },
  });

  // Check if user has credits
  const hasCredits = creditsData?.data?.remainingCredits > 0;
  const remainingCredits = creditsData?.data?.remainingCredits || 0;

  // Show credit alert if user has no credits
  useEffect(() => {
    if (!creditsLoading && !hasCredits) {
      setShowCreditAlert(true);
    }
  }, [creditsLoading, hasCredits]);

  if (status === "loading" || creditsLoading) {
    return (
      <SidebarLayout>
        <Container className="py-5">
          <div className="text-center">
            <Spinner animation="border" size="lg" />
            <p className="mt-3 text-secondary-custom">Loading...</p>
          </div>
        </Container>
      </SidebarLayout>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  const onSubmit = async (data: FormData) => {
    if (!hasCredits) {
      toast.error(
        "You need credits to generate a report. Please purchase a subscription plan."
      );
      router.push("/purchase-plans");
      return;
    }

    try {
      const reportRequest = {
        address: data.address,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        email: data.email,
      };

      const result = await generateReport.mutateAsync(reportRequest);

      if (result.success) {
        toast.success(
          "Report generation started! You'll be notified when it's ready."
        );
        reset();
      } else {
        toast.error(result.message || "Failed to generate report");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to generate report");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <SidebarLayout>
      <Container fluid className="py-4">
        {/* Header Section */}
        <div className="text-center mb-5">
          <div className="mb-4">
            <h1 className="display-4 fw-bold text-primary-custom mb-3">
              Generate Property Report
            </h1>
            <p className="fs-5 text-secondary-custom mb-0">
              Get AI-powered rental insights for your property in 60 seconds
            </p>
          </div>

          {/* Credits Status */}
          {hasCredits && (
            <div className="d-inline-flex align-items-center bg-green-light px-4 py-3 rounded-figma-xl mb-4">
              <div className="me-3 fs-2">💳</div>
              <div className="text-start">
                <div className="h4 text-primary-custom mb-0">
                  {remainingCredits} Credits Available
                </div>
                <small className="text-secondary-custom">
                  Each report uses 1 credit
                </small>
              </div>
            </div>
          )}

          {/* No Credits Alert */}
          {showCreditAlert && (
            <Alert
              variant="warning"
              className="border-0 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-figma-xl mb-4"
              onClose={() => setShowCreditAlert(false)}
              dismissible
            >
              <div className="d-flex align-items-center">
                <div className="me-4">
                  <span className="display-4">⚠️</span>
                </div>
                <div className="flex-grow-1">
                  <h5 className="text-warning fw-bold mb-2">
                    No Credits Available
                  </h5>
                  <p className="text-secondary-custom mb-3">
                    You need credits to generate property reports. Purchase a
                    subscription plan to get started.
                  </p>
                  <Button
                    variant="warning"
                    size="lg"
                    className="rounded-figma-md px-4"
                    onClick={() => router.push("/purchase-plans")}
                  >
                    <span className="me-2">🛒</span>
                    Purchase Credits
                  </Button>
                </div>
              </div>
            </Alert>
          )}
        </div>

        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            <Card className="border-0 shadow-lg rounded-figma-xl overflow-hidden">
              <Card.Header className="bg-gradient-primary text-white p-4 border-0">
                <div className="d-flex align-items-center">
                  <span className="fs-1 me-3">🏠</span>
                  <div>
                    <h3 className="mb-1 fw-bold">Property Information</h3>
                    <p className="mb-0 opacity-90">
                      Fill in the details below to generate your comprehensive
                      rental report
                    </p>
                  </div>
                </div>
              </Card.Header>
              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit(onSubmit)}>
                  {/* Property Address Section */}
                  <div className="mb-4">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        Property Address *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="123 Main St, City, State, ZIP"
                        {...register("address")}
                        isInvalid={!!errors.address}
                        className="rounded-figma-md"
                        size="lg"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.address?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>

                  {/* Bedrooms and Bathrooms */}
                  <Row className="g-3 mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          Bedrooms *
                        </Form.Label>
                        <Form.Select
                          {...register("bedrooms")}
                          isInvalid={!!errors.bedrooms}
                          className="rounded-figma-md"
                          size="lg"
                        >
                          <option value="">Select Bedrooms</option>
                          <option value={1}>1</option>
                          <option value={2}>2</option>
                          <option value={3}>3</option>
                          <option value={4}>4+</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.bedrooms?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          Bathrooms *
                        </Form.Label>
                        <Form.Select
                          {...register("bathrooms")}
                          isInvalid={!!errors.bathrooms}
                          className="rounded-figma-md"
                          size="lg"
                        >
                          <option value="">Select Bathrooms</option>
                          <option value={1}>1</option>
                          <option value={1.5}>1.5</option>
                          <option value={2}>2</option>
                          <option value={2.5}>2.5</option>
                          <option value={3}>3</option>
                          <option value={3.5}>3.5</option>
                          <option value={4}>4+</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.bathrooms?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Email Address */}
                  <div className="mb-4">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        Email Address *
                      </Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="your@email.com"
                        {...register("email")}
                        isInvalid={!!errors.email}
                        className="rounded-figma-md"
                        size="lg"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>

                  {/* Submit Button */}
                  <div className="text-center">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="px-5 py-3 fw-semibold rounded-figma-md"
                      disabled={isSubmitting || !hasCredits}
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            className="me-2"
                          />
                          Generating Report...
                        </>
                      ) : (
                        "Generate Analysis Report"
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </SidebarLayout>
  );
}
