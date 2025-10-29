"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import SidebarLayout from "@/components/common/SidebarLayout";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function AdminAnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Check if user is admin
  if (status === "loading") {
    return (
      <SidebarLayout>
        <Container className="py-5">
          <LoadingSpinner size="lg" fullScreen={false} />
        </Container>
      </SidebarLayout>
    );
  }

  if (!session || session.role !== 1) {
    router.push("/dashboard");
    return null;
  }

  return (
    <SidebarLayout>
      <Container fluid>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h3 mb-1">Analytics</h1>
                <p className="text-muted mb-0">System analytics and insights</p>
              </div>
              <Badge bg="danger" className="fs-6">
                <span className="me-2">👑</span>
                Admin Only
              </Badge>
            </div>
          </Col>
        </Row>

        {/* Coming Soon */}
        <Row>
          <Col>
            <Card className="border-0 shadow-sm text-center py-5">
              <Card.Body>
                <div className="fs-1 mb-3">📈</div>
                <h3>Analytics Dashboard</h3>
                <p className="text-muted mb-4">
                  Advanced analytics and reporting features coming soon.
                </p>
                <div className="text-muted">
                  <small>This page is under development</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </SidebarLayout>
  );
}
