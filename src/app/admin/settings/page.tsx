"use client";

import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SidebarLayout from "@/components/common/SidebarLayout";

export default function AdminSettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (!session) {
      router.push("/login");
    } else if (session.role !== 1) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (!session || session.role !== 1) {
    return (
      <SidebarLayout>
        <Container fluid className="py-4">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </Container>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <Container fluid className="py-4">
        <Row>
          <Col>
            <div className="text-center mb-4">
              <div className="mb-3">
                <div
                  className="bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                  style={{ width: "80px", height: "80px", fontSize: "2rem" }}
                >
                  ⚙️
                </div>
              </div>
              <h1 className="h2 mb-1">System Settings</h1>
              <p className="text-muted">
                Configure system-wide settings and preferences
              </p>
            </div>

            <Card className="text-center py-5">
              <Card.Body>
                <div className="text-muted mb-3" style={{ fontSize: "4rem" }}>
                  🚧
                </div>
                <h4>Coming Soon</h4>
                <p className="text-muted mb-0">
                  System configuration panel for managing application settings,
                  API keys, and system preferences.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </SidebarLayout>
  );
}
