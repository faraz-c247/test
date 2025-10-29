"use client";

import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import SidebarLayout from "@/components/common/SidebarLayout";
import Table, { TableColumn } from "@/components/common/Table";
import Modal, {
  ConfirmModal,
  AlertModal,
  SuccessModal,
  LoadingModal,
} from "@/components/common/Modal";
import Input, {
  TextArea,
  NumberInput,
  SearchInput,
} from "@/components/common/Input";

// Sample data for table demo
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastLogin: string;
}

const sampleUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "active",
    lastLogin: "2024-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "active",
    lastLogin: "2024-01-14",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Manager",
    status: "inactive",
    lastLogin: "2024-01-10",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    role: "User",
    status: "active",
    lastLogin: "2024-01-16",
  },
  {
    id: 5,
    name: "Charlie Wilson",
    email: "charlie@example.com",
    role: "Admin",
    status: "active",
    lastLogin: "2024-01-15",
  },
];

export default function ComponentsDemoPage() {
  // Table state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    description: "",
    age: 25,
    search: "",
  });

  // Table columns configuration
  const tableColumns: TableColumn<User>[] = [
    {
      key: "id",
      title: "ID",
      dataIndex: "id",
      sortable: true,
      width: 80,
    },
    {
      key: "name",
      title: "Name",
      dataIndex: "name",
      sortable: true,
      filterable: true,
      render: (value, record) => (
        <div className="d-flex align-items-center">
          <div
            className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
            style={{ width: "32px", height: "32px", fontSize: "0.8rem" }}
          >
            {value.charAt(0)}
          </div>
          <strong>{value}</strong>
        </div>
      ),
    },
    {
      key: "email",
      title: "Email",
      dataIndex: "email",
      sortable: true,
      filterable: true,
    },
    {
      key: "role",
      title: "Role",
      dataIndex: "role",
      sortable: true,
      filterable: true,
      render: (value) => (
        <Badge
          bg={
            value === "Admin"
              ? "danger"
              : value === "Manager"
              ? "warning"
              : "secondary"
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "status",
      title: "Status",
      dataIndex: "status",
      sortable: true,
      render: (value) => (
        <Badge bg={value === "active" ? "success" : "secondary"}>{value}</Badge>
      ),
    },
    {
      key: "lastLogin",
      title: "Last Login",
      dataIndex: "lastLogin",
      sortable: true,
    },
    {
      key: "actions",
      title: "Actions",
      dataIndex: "id",
      render: (_, record) => (
        <div className="d-flex gap-1">
          <Button size="sm" variant="outline-primary">
            Edit
          </Button>
          <Button size="sm" variant="outline-danger">
            Delete
          </Button>
        </div>
      ),
    },
  ];

  // Handlers
  const handleTablePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleRowClick = (record: User) => {
    console.log("Row clicked:", record);
  };

  const handleModalSave = () => {
    setModalLoading(true);
    setTimeout(() => {
      setModalLoading(false);
      setShowModal(false);
    }, 2000);
  };

  const handleConfirmAction = () => {
    console.log("Action confirmed!");
    setShowConfirmModal(false);
    setShowSuccessModal(true);
  };

  const handleLoadingDemo = () => {
    setShowLoadingModal(true);
    setLoadingProgress(0);

    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowLoadingModal(false);
          setShowSuccessModal(true);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleInputChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const validateEmail = (value: string) => {
    if (!value) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(value)) return "Email is invalid";
    return undefined;
  };

  return (
    <SidebarLayout>
      <Container fluid>
        <Row className="mb-4">
          <Col>
            <h1 className="h3 mb-1">Components Demo</h1>
            <p className="text-muted">
              Demonstration of reusable Table, Modal, and Input components
            </p>
          </Col>
        </Row>

        {/* Table Demo */}
        <Row className="mb-5">
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">📊 Table Component Demo</h5>
              </Card.Header>
              <Card.Body>
                <Table
                  columns={tableColumns}
                  data={sampleUsers}
                  pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: sampleUsers.length,
                    showSizeChanger: true,
                    pageSizeOptions: [5, 10, 20],
                    onChange: handleTablePageChange,
                  }}
                  onRowClick={handleRowClick}
                  rowKey="id"
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Modal Demo */}
        <Row className="mb-5">
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">🔲 Modal Component Demo</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex gap-2 flex-wrap">
                  <Button variant="primary" onClick={() => setShowModal(true)}>
                    🔲 Custom Modal
                  </Button>
                  <Button
                    variant="warning"
                    onClick={() => setShowConfirmModal(true)}
                  >
                    ⚠️ Confirm Modal
                  </Button>
                  <Button
                    variant="info"
                    onClick={() => setShowAlertModal(true)}
                  >
                    ℹ️ Alert Modal
                  </Button>
                  <Button
                    variant="success"
                    onClick={() => setShowSuccessModal(true)}
                  >
                    ✅ Success Modal
                  </Button>
                  <Button variant="secondary" onClick={handleLoadingDemo}>
                    ⏳ Loading Modal
                  </Button>
                </div>

                <div className="mt-3">
                  <small className="text-muted">
                    <strong>Modal Variants:</strong> Default, Glass, Modern,
                    Minimal designs with animations
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Input Demo */}
        <Row className="mb-5">
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">📝 Input Component Demo</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Input
                      label="Name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleInputChange("name")}
                      required
                      helperText="Your full name"
                      clearable
                    />

                    <Input
                      label="Email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange("email")}
                      required
                      validator={validateEmail}
                      validateOnBlur
                      prefix="📧"
                    />

                    <Input
                      label="Password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange("password")}
                      required
                      showPasswordToggle
                      helperText="Minimum 8 characters"
                    />
                  </Col>

                  <Col md={6}>
                    <TextArea
                      label="Description"
                      placeholder="Enter description"
                      value={formData.description}
                      onChange={handleInputChange("description")}
                      helperText="Optional description"
                      minRows={3}
                    />

                    <NumberInput
                      label="Age"
                      value={formData.age}
                      onChange={handleInputChange("age")}
                      min={18}
                      max={100}
                      showControls
                    />

                    <SearchInput
                      label="Search"
                      placeholder="Search users..."
                      value={formData.search}
                      onChange={handleInputChange("search")}
                      onSearch={(value) => console.log("Searching for:", value)}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Form Data Display */}
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">📄 Form Data</h5>
              </Card.Header>
              <Card.Body>
                <pre className="bg-light p-3 rounded">
                  {JSON.stringify(formData, null, 2)}
                </pre>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modals */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        title="Enhanced Modal Design"
        headerIcon="🎨"
        onConfirm={handleModalSave}
        onCancel={() => setShowModal(false)}
        loading={modalLoading}
        size="lg"
        variant="modern"
        footerAlign="between"
      >
        <div className="py-2">
          <p className="mb-3">
            This modal showcases the enhanced design with modern styling and
            smooth animations.
          </p>

          <div className="row g-3">
            <div className="col-md-6">
              <div className="bg-primary bg-opacity-10 p-3 rounded-3">
                <h6 className="text-primary mb-2">🎨 Design Features</h6>
                <ul className="mb-0 small">
                  <li>Rounded corners & shadows</li>
                  <li>Smooth animations</li>
                  <li>Modern gradient backgrounds</li>
                  <li>Enhanced typography</li>
                </ul>
              </div>
            </div>
            <div className="col-md-6">
              <div className="bg-success bg-opacity-10 p-3 rounded-3">
                <h6 className="text-success mb-2">✨ Interactions</h6>
                <ul className="mb-0 small">
                  <li>Hover effects on buttons</li>
                  <li>Loading states with spinners</li>
                  <li>Backdrop blur effects</li>
                  <li>Keyboard navigation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmAction}
        title="Confirm Delete"
        message="Are you sure you want to delete this item? This action cannot be undone."
        variant="danger"
        confirmText="Delete"
      />

      <AlertModal
        show={showAlertModal}
        onHide={() => setShowAlertModal(false)}
        title="Success"
        message="Your action was completed successfully!"
        variant="success"
      />

      <SuccessModal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        title="Action Completed"
        message="Your operation was completed successfully! The system has been updated."
        onAction={() => {
          setShowSuccessModal(false);
          console.log("View details clicked");
        }}
        actionText="View Details"
      />

      <LoadingModal
        show={showLoadingModal}
        title="Processing"
        message="Please wait while we process your request..."
        progress={loadingProgress}
      />
    </SidebarLayout>
  );
}
