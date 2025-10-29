"use client";

import React from "react";
import { Container } from "react-bootstrap";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      {/* Background Pattern (optional) */}
      <div
        className="position-absolute w-100 h-100"
        style={{
          background:
            "linear-gradient(135deg, rgba(13, 110, 253, 0.1) 0%, rgba(108, 117, 125, 0.1) 100%)",
          zIndex: -1,
        }}
      />

      {/* Main Content */}
      <Container>
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            {/* Brand Header */}
            <div className="text-center mb-4">
              <div className="mb-3">
                <span style={{ fontSize: "4rem" }}>🏠</span>
              </div>
              <h1 className="h2 text-primary fw-bold mb-2">RentIntel</h1>
              <p className="text-muted">Property Management Platform</p>
            </div>

            {/* Auth Content */}
            <div className="card shadow-sm border-0">
              <div className="card-body p-4 p-sm-5">{children}</div>
            </div>

            {/* Footer */}
            <div className="text-center mt-4">
              <small className="text-muted">
                © 2024 RentIntel. All rights reserved.
              </small>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
