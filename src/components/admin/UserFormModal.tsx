"use client";

import React from "react";
import {
  Modal,
  Form,
  Row,
  Col,
  Button,
  Spinner,
  InputGroup,
} from "react-bootstrap";

interface UserFormData {
  name: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  role: number;
  status: number;
}

interface UserFormModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
  onSubmit: () => void;
  isLoading: boolean;
  formData: UserFormData;
  handleInputChange: (
    field: keyof UserFormData
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const UserFormModal: React.FC<UserFormModalProps> = ({
  show,
  onHide,
  title,
  onSubmit,
  isLoading,
  formData,
  handleInputChange,
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      className="modal-figma"
    >
      <Modal.Header closeButton className="bg-green-light border-0">
        <Modal.Title className="text-primary-custom fw-bold">
          {title.includes("Create") ? "➕" : "✏️"} {title}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        <Form>
          <Row className="g-3">
            {/* Basic Information */}
            <Col xs={12}>
              <div className="mb-3">
                <h6 className="text-primary-custom fw-medium mb-3">
                  👤 Basic Information
                </h6>
                <div className="bg-green-light p-3 rounded-figma-md">
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="text-primary-custom fw-medium">
                          Full Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter full name"
                          value={formData.name}
                          onChange={handleInputChange("name")}
                          className="form-control-figma"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="text-primary-custom fw-medium">
                          Email Address <span className="text-danger">*</span>
                        </Form.Label>
                        <InputGroup className="input-group-figma">
                          <InputGroup.Text>📧</InputGroup.Text>
                          <Form.Control
                            type="email"
                            placeholder="Enter email address"
                            value={formData.email}
                            onChange={handleInputChange("email")}
                            className="form-control-figma"
                            required
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>

            {/* Contact Information */}
            <Col xs={12}>
              <div className="mb-3">
                <h6 className="text-primary-custom fw-medium mb-3">
                  📞 Contact Information
                </h6>
                <div className="bg-orange-light p-3 rounded-figma-md">
                  <Row className="g-3">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="text-primary-custom fw-medium">
                          Country Code
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="+1"
                          value={formData.countryCode}
                          onChange={handleInputChange("countryCode")}
                          className="form-control-figma"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={8}>
                      <Form.Group>
                        <Form.Label className="text-primary-custom fw-medium">
                          Phone Number
                        </Form.Label>
                        <InputGroup className="input-group-figma">
                          <InputGroup.Text>📱</InputGroup.Text>
                          <Form.Control
                            type="tel"
                            placeholder="Enter phone number"
                            value={formData.phoneNumber}
                            onChange={handleInputChange("phoneNumber")}
                            className="form-control-figma"
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>

            {/* Permissions & Status */}
            <Col xs={12}>
              <div className="mb-3">
                <h6 className="text-primary-custom fw-medium mb-3">
                  ⚙️ Permissions & Status
                </h6>
                <div className="bg-green-light p-3 rounded-figma-md">
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="text-primary-custom fw-medium">
                          User Role <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          value={formData.role}
                          onChange={handleInputChange("role")}
                          className="form-control-figma"
                          required
                        >
                          <option value={2}>👤 User</option>
                          <option value={1}>👑 Admin</option>
                        </Form.Select>
                        <Form.Text className="text-secondary-custom">
                          {formData.role === 1
                            ? "Full system access"
                            : "Limited user access"}
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="text-primary-custom fw-medium">
                          Account Status <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          value={formData.status}
                          onChange={handleInputChange("status")}
                          className="form-control-figma"
                          required
                        >
                          <option value={1}>✅ Active</option>
                          <option value={0}>❌ Inactive</option>
                        </Form.Select>
                        <Form.Text className="text-secondary-custom">
                          {formData.status === 1
                            ? "User can access the system"
                            : "User access is blocked"}
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer className="bg-light border-0 p-4">
        <Button
          variant="outline-secondary"
          onClick={onHide}
          disabled={isLoading}
          className="rounded-figma-md"
        >
          Cancel
        </Button>
        <Button
          className="btn-primary-gradient"
          onClick={onSubmit}
          disabled={isLoading || !formData.name || !formData.email}
        >
          {isLoading ? (
            <>
              <div className="spinner-border spinner-border-sm me-2"></div>
              {title.includes("Create") ? "Creating..." : "Updating..."}
            </>
          ) : (
            <>
              {title.includes("Create") ? "➕ Create User" : "💾 Update User"}
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserFormModal;
