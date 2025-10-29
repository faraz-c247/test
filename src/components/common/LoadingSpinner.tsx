import React from "react";
import { Container, Row, Col } from "react-bootstrap";

interface LoadingSpinnerProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  text = "Loading...",
  size = "md",
  fullScreen = false,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "loading-spinner-sm",
    md: "loading-spinner",
    lg: "loading-spinner-lg",
  };

  const content = (
    <div className="text-center">
      <div className={`${sizeClasses[size]} mx-auto mb-3`}></div>
      <p className="text-muted">{text}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <Container
        fluid
        className="min-vh-100 d-flex align-items-center justify-content-center"
      >
        <Row className="w-100 justify-content-center">
          <Col xs="auto">{content}</Col>
        </Row>
      </Container>
    );
  }

  return content;
}

// Add these styles to your global CSS
const styles = `
.loading-spinner-sm {
  width: 1.5rem;
  height: 1.5rem;
  border: 0.125rem solid #e5e7eb;
  border-top: 0.125rem solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-spinner-lg {
  width: 4rem;
  height: 4rem;
  border: 0.375rem solid #e5e7eb;
  border-top: 0.375rem solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
`;
