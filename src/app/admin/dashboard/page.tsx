"use client";

import React from "react";
import { Container, Row, Col, Card, Table, Badge, Button } from "react-bootstrap";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SidebarLayout from "@/components/common/SidebarLayout";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // Redirect to login if not authenticated (client-side only)
  React.useEffect(() => {
    if (!session) {
      router.push("/login");
    } else if (session.role !== 1) {
      // Redirect non-admin users to regular dashboard
      router.push("/dashboard");
    }
  }, [session, router]);

  if (!session) {
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

  if (session.role !== 1) {
    return (
      <SidebarLayout>
        <Container fluid className="py-4">
          <div className="text-center">
            <div className="alert alert-danger">
              <h4>Access Denied</h4>
              <p>You don't have permission to access the admin panel.</p>
              <Link href="/dashboard">
                <Button variant="primary">Go to Dashboard</Button>
              </Link>
            </div>
          </div>
        </Container>
      </SidebarLayout>
    );
  }

  // Mock admin data - in real app, this would come from API
  const adminStats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalReports: 5638,
    reportsToday: 23,
    totalRevenue: 45750,
    monthlyRevenue: 8420,
    systemHealth: "Excellent",
    uptime: "99.9%"
  };

  const recentUsers = [
    {
      id: "1",
      name: "John Smith",
      email: "john@example.com",
      role: 2,
      status: "active",
      joinDate: "2024-01-20",
      lastActive: "2024-01-22"
    },
    {
      id: "2", 
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: 2,
      status: "active",
      joinDate: "2024-01-19",
      lastActive: "2024-01-22"
    },
    {
      id: "3",
      name: "Mike Wilson",
      email: "mike@example.com", 
      role: 2,
      status: "inactive",
      joinDate: "2024-01-18",
      lastActive: "2024-01-21"
    }
  ];

  const systemAlerts = [
    {
      id: "1",
      type: "info",
      message: "System backup completed successfully",
      timestamp: "2024-01-22T10:30:00Z"
    },
    {
      id: "2",
      type: "warning", 
      message: "High API usage detected - 85% of daily limit",
      timestamp: "2024-01-22T09:15:00Z"
    },
    {
      id: "3",
      type: "success",
      message: "New server deployment completed",
      timestamp: "2024-01-22T08:00:00Z"
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short", 
      day: "numeric"
    });
  };

  const getStatusBadge = (status: string) => {
    return status === "active" ? 
      <Badge bg="success">Active</Badge> : 
      <Badge bg="secondary">Inactive</Badge>;
  };

  const getAlertBadge = (type: string) => {
    switch (type) {
      case "success":
        return <Badge bg="success">Success</Badge>;
      case "warning":
        return <Badge bg="warning">Warning</Badge>;
      case "error":
        return <Badge bg="danger">Error</Badge>;
      default:
        return <Badge bg="info">Info</Badge>;
    }
  };

  return (
    <SidebarLayout>
      <Container fluid className="py-4">
        <Row>
          <Col>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="h2 mb-1">Admin Dashboard</h1>
                <p className="text-muted">
                  System overview and management console
                </p>
              </div>
              <div>
                <Badge bg="success" className="me-2 px-3 py-2">
                  System: {adminStats.systemHealth}
                </Badge>
                <Badge bg="primary" className="px-3 py-2">
                  Uptime: {adminStats.uptime}
                </Badge>
              </div>
            </div>

            {/* Key Metrics */}
            <Row className="mb-4">
              <Col lg={3} md={6} className="mb-3">
                <Card className="h-100 border-primary shadow-sm">
                  <Card.Body className="text-center">
                    <div className="text-primary mb-2" style={{ fontSize: "2.5rem" }}>
                      👥
                    </div>
                    <h3 className="text-primary mb-1">{adminStats.totalUsers.toLocaleString()}</h3>
                    <p className="text-muted mb-1">Total Users</p>
                    <small className="text-success">
                      {adminStats.activeUsers.toLocaleString()} active
                    </small>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={3} md={6} className="mb-3">
                <Card className="h-100 border-success shadow-sm">
                  <Card.Body className="text-center">
                    <div className="text-success mb-2" style={{ fontSize: "2.5rem" }}>
                      📊
                    </div>
                    <h3 className="text-success mb-1">{adminStats.totalReports.toLocaleString()}</h3>
                    <p className="text-muted mb-1">Total Reports</p>
                    <small className="text-info">
                      {adminStats.reportsToday} today
                    </small>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={3} md={6} className="mb-3">
                <Card className="h-100 border-warning shadow-sm">
                  <Card.Body className="text-center">
                    <div className="text-warning mb-2" style={{ fontSize: "2.5rem" }}>
                      💰
                    </div>
                    <h3 className="text-warning mb-1">${adminStats.totalRevenue.toLocaleString()}</h3>
                    <p className="text-muted mb-1">Total Revenue</p>
                    <small className="text-success">
                      ${adminStats.monthlyRevenue.toLocaleString()} this month
                    </small>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={3} md={6} className="mb-3">
                <Card className="h-100 border-info shadow-sm">
                  <Card.Body className="text-center">
                    <div className="text-info mb-2" style={{ fontSize: "2.5rem" }}>
                      🚀
                    </div>
                    <h3 className="text-info mb-1">{adminStats.uptime}</h3>
                    <p className="text-muted mb-1">System Uptime</p>
                    <small className="text-success">
                      {adminStats.systemHealth}
                    </small>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Recent Users & System Alerts */}
            <Row className="mb-4">
              <Col lg={8}>
                <Card className="h-100 shadow-sm">
                  <Card.Header className="bg-white border-bottom">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">
                        <span className="me-2">👥</span>
                        Recent Users
                      </h5>
                      <Link href="/admin/user-management" className="text-decoration-none">
                        <Button variant="outline-primary" size="sm">
                          View All Users
                        </Button>
                      </Link>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <div className="table-responsive">
                      <Table hover>
                        <thead>
                          <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th>Last Active</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentUsers.map((user) => (
                            <tr key={user.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div
                                    className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                                    style={{ width: "32px", height: "32px" }}
                                  >
                                    <small className="fw-bold">
                                      {user.name.charAt(0)}
                                    </small>
                                  </div>
                                  <div>
                                    <div className="fw-semibold">{user.name}</div>
                                    <small className="text-muted">ID: {user.id}</small>
                                  </div>
                                </div>
                              </td>
                              <td>{user.email}</td>
                              <td>{getStatusBadge(user.status)}</td>
                              <td>{formatDate(user.joinDate)}</td>
                              <td>{formatDate(user.lastActive)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={4}>
                <Card className="h-100 shadow-sm">
                  <Card.Header className="bg-white border-bottom">
                    <h5 className="mb-0">
                      <span className="me-2">🔔</span>
                      System Alerts
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex flex-column gap-3">
                      {systemAlerts.map((alert) => (
                        <div key={alert.id} className="border-start border-3 border-primary ps-3">
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            {getAlertBadge(alert.type)}
                            <small className="text-muted">
                              {new Date(alert.timestamp).toLocaleTimeString()}
                            </small>
                          </div>
                          <p className="mb-0 small">{alert.message}</p>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Quick Actions */}
            <Card className="shadow-sm">
              <Card.Header className="bg-white border-bottom">
                <h5 className="mb-0">
                  <span className="me-2">⚡</span>
                  Quick Actions
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={3} className="mb-3">
                    <Link href="/admin/user-management" className="text-decoration-none">
                      <Card className="h-100 border-0 bg-light hover-shadow">
                        <Card.Body className="text-center">
                          <div className="text-primary mb-2" style={{ fontSize: "2rem" }}>
                            👥
                          </div>
                          <h6>Manage Users</h6>
                          <small className="text-muted">Add, edit, or deactivate users</small>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>

                  <Col md={3} className="mb-3">
                    <Link href="/admin/reports" className="text-decoration-none">
                      <Card className="h-100 border-0 bg-light hover-shadow">
                        <Card.Body className="text-center">
                          <div className="text-success mb-2" style={{ fontSize: "2rem" }}>
                            📊
                          </div>
                          <h6>View Reports</h6>
                          <small className="text-muted">Monitor all system reports</small>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>

                  <Col md={3} className="mb-3">
                    <Link href="/admin/analytics" className="text-decoration-none">
                      <Card className="h-100 border-0 bg-light hover-shadow">
                        <Card.Body className="text-center">
                          <div className="text-warning mb-2" style={{ fontSize: "2rem" }}>
                            📈
                          </div>
                          <h6>Analytics</h6>
                          <small className="text-muted">View detailed analytics</small>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>

                  <Col md={3} className="mb-3">
                    <Link href="/admin/settings" className="text-decoration-none">
                      <Card className="h-100 border-0 bg-light hover-shadow">
                        <Card.Body className="text-center">
                          <div className="text-info mb-2" style={{ fontSize: "2rem" }}>
                            ⚙️
                          </div>
                          <h6>System Settings</h6>
                          <small className="text-muted">Configure system settings</small>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </SidebarLayout>
  );
} 