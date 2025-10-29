"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  resetPasswordSchema,
  ResetPasswordFormData,
} from "@/lib/validationSchemas";
import { useResetPassword } from "@/hooks/useAuth";
import Link from "next/link";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40 }}>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const resetPasswordMutation = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      token: "", // Will be set from URL
    },
  });

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      // Redirect to home if no token
      router.push("/");
    }
  }, [searchParams, router]);

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!token) return;

    const resetData = {
      token,
      password: data.password,
    };

    resetPasswordMutation.mutate(resetData, {
      onSuccess: () => {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/?signin=true");
        }, 3000);
      },
    });
  };

  if (!token) {
    return (
      <Container className="mt-5 pt-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card>
              <Card.Body className="text-center">
                <h4>Invalid Reset Link</h4>
                <p>The password reset link is invalid or has expired.</p>
                <Link href="/" className="btn btn-primary">
                  Go to Home
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  if (success) {
    return (
      <Container className="mt-5 pt-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card>
              <Card.Body className="text-center">
                <div className="mb-4">
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      backgroundColor: "rgba(40, 167, 69, 0.1)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "40px",
                        color: "#28a745",
                      }}
                    >
                      ✓
                    </div>
                  </div>
                </div>
                <h4 style={{ color: "#28a745", marginBottom: "16px" }}>
                  Password Reset Successful!
                </h4>
                <p style={{ color: "#6c757d", marginBottom: "20px" }}>
                  Your password has been successfully updated. You will be
                  redirected to the login page shortly.
                </p>
                <Link href="/?signin=true" className="btn btn-success">
                  Sign In Now
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="mt-5 pt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h3
                  style={{
                    fontSize: "28px",
                    fontWeight: 600,
                    color: "#222222",
                    fontFamily: "Poppins",
                    marginBottom: "8px",
                  }}
                >
                  Reset Your Password
                </h3>
                <p
                  style={{
                    fontSize: "16px",
                    color: "#6c757d",
                    fontFamily: "Poppins",
                    margin: 0,
                  }}
                >
                  Enter your new password below
                </p>
              </div>

              {resetPasswordMutation.error && (
                <Alert variant="danger" className="mb-3">
                  {resetPasswordMutation.error.message}
                </Alert>
              )}

              <Form onSubmit={handleSubmit(onSubmit)}>
                {/* Password Field */}
                <div className="mb-3">
                  <Form.Label
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#222222",
                      fontFamily: "Poppins",
                    }}
                  >
                    New Password *
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your new password"
                    {...register("password")}
                    isInvalid={!!errors.password}
                    style={{
                      fontSize: "16px",
                      fontFamily: "Poppins",
                      padding: "12px 16px",
                      border: "1px solid #cecece",
                      borderRadius: "6px",
                    }}
                  />
                  {errors.password && (
                    <Form.Control.Feedback type="invalid">
                      {errors.password.message}
                    </Form.Control.Feedback>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="mb-4">
                  <Form.Label
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#222222",
                      fontFamily: "Poppins",
                    }}
                  >
                    Confirm New Password *
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm your new password"
                    {...register("confirmPassword")}
                    isInvalid={!!errors.confirmPassword}
                    style={{
                      fontSize: "16px",
                      fontFamily: "Poppins",
                      padding: "12px 16px",
                      border: "1px solid #cecece",
                      borderRadius: "6px",
                    }}
                  />
                  {errors.confirmPassword && (
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword.message}
                    </Form.Control.Feedback>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={resetPasswordMutation.isPending}
                  style={{
                    width: "100%",
                    background:
                      "linear-gradient(90deg, rgba(19, 63, 113, 1) 0%, rgba(32, 205, 44, 1) 100%)",
                    border: "none",
                    borderRadius: "8px",
                    padding: "12px 24px",
                    fontSize: "16px",
                    fontFamily: "Poppins",
                    fontWeight: 600,
                    color: "#FFFFFF",
                  }}
                >
                  {resetPasswordMutation.isPending
                    ? "Updating Password..."
                    : "Update Password"}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <Link
                  href="/"
                  style={{
                    fontSize: "14px",
                    fontFamily: "Poppins",
                    color: "#2CA248",
                    textDecoration: "none",
                  }}
                >
                  Back to Home
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
