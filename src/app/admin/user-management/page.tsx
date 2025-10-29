"use client";

import React, { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Table,
  Form,
  InputGroup,
  Pagination,
  Dropdown,
  Alert,
} from "react-bootstrap";
import SidebarLayout from "@/components/common/SidebarLayout";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import UserFormModal from "@/components/admin/UserFormModal";
import { ConfirmModal } from "@/components/common/Modal";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useChangeUserStatus,
  useBulkUserOperations,
} from "@/hooks/useUser";
import { toast } from "react-hot-toast";

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  countryCode?: string;
  role: number;
  status: number;
  createdAt: string;
  updatedAt: string;
}

interface UserFormData {
  name: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  role: number;
  status: number;
}

interface CreateUserRequest {
  name: string;
  email: string;
  phoneNumber?: string;
  countryCode?: string;
  role: number;
  status: number;
}

interface UpdateUserRequest extends CreateUserRequest {
  id: string;
}

const initialFormData: UserFormData = {
  name: "",
  email: "",
  phoneNumber: "",
  countryCode: "",
  role: 2,
  status: 1,
};

export default function UserManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [orderBy, setOrderBy] = useState("desc");

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  // Form and selection states
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // All hooks must be called before any conditional logic
  const {
    data: usersData,
    isLoading,
    error,
    refetch,
  } = useUsers(currentPage, pageSize, searchTerm || undefined, sortBy, orderBy);

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const changeStatusMutation = useChangeUserStatus();
  const { bulkDelete } = useBulkUserOperations();

  // Event handlers (hooks)
  const handleInputChange = useCallback(
    (field: keyof UserFormData) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((prev) => ({
          ...prev,
          [field]:
            field === "role" || field === "status"
              ? parseInt(e.target.value)
              : e.target.value,
        }));
      },
    []
  );

  // Conditional logic AFTER all hooks
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

  const users = usersData?.data?.users || [];
  const pagination = usersData?.data?.pagination;

  // Helper functions
  const getRoleBadge = (role: number) => {
    return role === 1 ? (
      <span className="role-badge-admin">Admin</span>
    ) : (
      <span className="role-badge-user">User</span>
    );
  };

  const getStatusBadge = (status: number) => {
    return status === 1 ? (
      <span className="status-badge-active">Active</span>
    ) : (
      <span className="status-badge-inactive">Inactive</span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleCreateUser = async () => {
    try {
      const userData: CreateUserRequest = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber || undefined,
        countryCode: formData.countryCode || undefined,
        role: formData.role,
        status: formData.status,
      };

      await createUserMutation.mutateAsync(userData);
      setShowCreateModal(false);
      setFormData(initialFormData);
      refetch();
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      const userData: UpdateUserRequest = {
        id: editingUser.id,
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber || undefined,
        countryCode: formData.countryCode || undefined,
        role: formData.role,
        status: formData.status,
      };

      await updateUserMutation.mutateAsync(userData);
      setShowEditModal(false);
      setEditingUser(null);
      setFormData(initialFormData);
      refetch();
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleEditUser = (user: User) => {
    setFormData({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber || "",
      countryCode: user.countryCode || "",
      role: user.role,
      status: user.status,
    });
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = (user: User) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!deletingUser) return;

    try {
      await deleteUserMutation.mutateAsync(deletingUser.id);
      setShowDeleteModal(false);
      setDeletingUser(null);
      refetch();
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleStatusChange = async (userId: string, newStatus: number) => {
    try {
      await changeStatusMutation.mutateAsync({ userId, status: newStatus });
      refetch();
    } catch (error) {
      console.error("Failed to change user status:", error);
    }
  };

  const handleUserSelect = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
    setSelectAll(newSelected.size === users.length && users.length > 0);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(users.map((user) => user.id)));
    }
    setSelectAll(!selectAll);
  };

  const handleBulkDelete = async () => {
    try {
      await bulkDelete(Array.from(selectedUsers));
      setSelectedUsers(new Set());
      setSelectAll(false);
      setShowBulkDeleteModal(false);
      refetch();
    } catch (error) {
      console.error("Failed to bulk delete users:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !searchTerm ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      selectedRole === "all" || user.role.toString() === selectedRole;
    const matchesStatus =
      selectedStatus === "all" || user.status.toString() === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <SidebarLayout>
      <div className="main-content-figma">
        <Container fluid className="px-3">
          {/* Header Section */}
          <div className="table-container-figma mb-4">
            <div className="table-header-figma">
              <Row className="align-items-center">
                <Col>
                  <h4 className="text-primary-custom">User Management</h4>
                  <p className="text-secondary-custom mb-0">
                    Manage system users and their permissions
                  </p>
                </Col>
                <Col xs="auto">
                  <div className="d-flex gap-2 align-items-center">
                    {/* Debug Button */}
                    <Button
                      variant="outline-info"
                      size="sm"
                      onClick={() => {
                        console.log("🔍 Current Session:", session);
                        console.log(
                          "🔍 localStorage token:",
                          localStorage.getItem("auth-token")
                        );
                        console.log(
                          "🔍 API Base URL:",
                          process.env.NEXT_PUBLIC_REST_API_ENDPOINT ||
                            "http://localhost:8000/api/v1"
                        );
                      }}
                    >
                      🔍 Debug Auth
                    </Button>
                    <span className="badge-figma-orange">👑 Admin Only</span>
                  </div>
                </Col>
              </Row>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="search-filter-container">
            <Row className="g-3 align-items-end">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="text-primary-custom fw-medium">
                    Search Users
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control-figma"
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label className="text-primary-custom fw-medium">
                    Role
                  </Form.Label>
                  <Form.Select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="form-control-figma"
                  >
                    <option value="all">All Roles</option>
                    <option value="1">Admin</option>
                    <option value="2">User</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label className="text-primary-custom fw-medium">
                    Status
                  </Form.Label>
                  <Form.Select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="form-control-figma"
                  >
                    <option value="all">All Status</option>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label className="text-primary-custom fw-medium">
                    Sort By
                  </Form.Label>
                  <Form.Select
                    value={`${sortBy}-${orderBy}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split("-");
                      setSortBy(field);
                      setOrderBy(order);
                    }}
                    className="form-control-figma"
                  >
                    <option value="createdAt-desc">Newest First</option>
                    <option value="createdAt-asc">Oldest First</option>
                    <option value="name-asc">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                    <option value="email-asc">Email A-Z</option>
                    <option value="email-desc">Email Z-A</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Button
                  className="btn-primary-gradient w-100"
                  onClick={() => setShowCreateModal(true)}
                >
                  ➕ Add User
                </Button>
              </Col>
            </Row>
          </div>

          {/* Main Content Card */}
          <div className="table-container-figma">
            {/* Loading State */}
            {isLoading && (
              <div className="table-empty-state">
                <div
                  className="spinner-figma mx-auto mb-3"
                  style={{ width: "40px", height: "40px" }}
                ></div>
                <h5>Loading users...</h5>
                <p>Please wait while we fetch the user data.</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="table-empty-state">
                <div className="text-danger mb-3" style={{ fontSize: "48px" }}>
                  ⚠️
                </div>
                <h5>Failed to load users</h5>
                <p className="text-danger">
                  {error instanceof Error
                    ? error.message
                    : "An unexpected error occurred"}
                </p>
                <Button
                  className="btn-primary-gradient mt-3"
                  onClick={() => refetch()}
                >
                  🔄 Retry
                </Button>
              </div>
            )}

            {/* Table Content */}
            {!isLoading && !error && (
              <>
                {/* Table Header with Stats */}
                <div className="table-header-figma">
                  <Row className="align-items-center">
                    <Col>
                      <h4>Users Overview</h4>
                      <div className="d-flex gap-3 mt-2">
                        <span className="badge-figma-green">
                          📊 Total: {pagination?.total || 0}
                        </span>
                        <span className="badge-figma-outline">
                          👥 Active:{" "}
                          {users.filter((u) => u.status === 1).length}
                        </span>
                        <span className="badge-figma-orange">
                          👑 Admins: {users.filter((u) => u.role === 1).length}
                        </span>
                      </div>
                    </Col>
                    <Col xs="auto">
                      <div className="d-flex gap-2">
                        {selectedUsers.size > 0 && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => setShowBulkDeleteModal(true)}
                            className="rounded-figma-md"
                          >
                            🗑️ Delete ({selectedUsers.size})
                          </Button>
                        )}
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => refetch()}
                          className="rounded-figma-md"
                        >
                          🔄 Refresh
                        </Button>
                        <Form.Select
                          size="sm"
                          value={pageSize}
                          onChange={(e) =>
                            setPageSize(parseInt(e.target.value))
                          }
                          className="form-control-figma"
                          style={{ width: "auto" }}
                        >
                          <option value={5}>5 per page</option>
                          <option value={10}>10 per page</option>
                          <option value={20}>20 per page</option>
                          <option value={50}>50 per page</option>
                        </Form.Select>
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Table or Empty State */}
                {filteredUsers.length === 0 ? (
                  <div className="table-empty-state">
                    <div
                      className="text-muted-custom mb-3"
                      style={{ fontSize: "64px" }}
                    >
                      👥
                    </div>
                    <h5>No users found</h5>
                    <p>
                      {searchTerm ||
                      selectedRole !== "all" ||
                      selectedStatus !== "all"
                        ? "No users match your current filters. Try adjusting your search criteria."
                        : "No users have been created yet. Click 'Add User' to create the first user."}
                    </p>
                    {(searchTerm ||
                      selectedRole !== "all" ||
                      selectedStatus !== "all") && (
                      <Button
                        variant="outline-secondary"
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedRole("all");
                          setSelectedStatus("all");
                        }}
                        className="rounded-figma-md mt-3"
                      >
                        🔄 Clear Filters
                      </Button>
                    )}
                  </div>
                ) : (
                  <Table className="table-figma-compact mb-0" responsive>
                    <thead>
                      <tr>
                        <th style={{ width: "50px" }}>
                          <Form.Check
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAll}
                            disabled={users.length === 0}
                          />
                        </th>
                        <th>User Details</th>
                        <th>Contact</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th style={{ width: "120px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Show only actual user data - no placeholder rows */}
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="fade-in">
                          <td>
                            <Form.Check
                              type="checkbox"
                              checked={selectedUsers.has(user.id)}
                              onChange={() => handleUserSelect(user.id)}
                            />
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  background: "var(--gradient-primary)",
                                  color: "white",
                                  fontSize: "16px",
                                  fontWeight: "600",
                                }}
                              >
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="fw-medium text-primary-custom">
                                  {user.name}
                                </div>
                                <small className="text-secondary-custom">
                                  ID: {user.id.slice(-8)}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="text-primary-custom">
                              {user.email}
                            </div>
                            <small className="text-secondary-custom">
                              {user.phoneNumber
                                ? `${user.countryCode || ""} ${
                                    user.phoneNumber
                                  }`
                                : "No phone"}
                            </small>
                          </td>
                          <td>{getRoleBadge(user.role)}</td>
                          <td>
                            <Dropdown className="dropdown-figma">
                              <Dropdown.Toggle
                                variant="link"
                                className="p-0 border-0 text-decoration-none"
                                style={{ background: "none" }}
                              >
                                {getStatusBadge(user.status)}
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item
                                  onClick={() => handleStatusChange(user.id, 1)}
                                  disabled={user.status === 1}
                                >
                                  ✅ Set Active
                                </Dropdown.Item>
                                <Dropdown.Item
                                  onClick={() => handleStatusChange(user.id, 0)}
                                  disabled={user.status === 0}
                                >
                                  ❌ Set Inactive
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                          <td>
                            <div className="text-primary-custom">
                              {formatDate(user.createdAt)}
                            </div>
                            <small className="text-secondary-custom">
                              Updated: {formatDate(user.updatedAt)}
                            </small>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="action-btn action-btn-edit"
                                onClick={() => handleEditUser(user)}
                                title="Edit User"
                              >
                                ✏️
                              </button>
                              <button
                                className="action-btn action-btn-delete"
                                onClick={() => handleDeleteUser(user)}
                                title="Delete User"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center p-4">
                    <div className="text-secondary-custom">
                      Showing {(currentPage - 1) * pageSize + 1} to{" "}
                      {Math.min(currentPage * pageSize, pagination.total)} of{" "}
                      {pagination.total} users
                    </div>
                    <Pagination className="pagination-figma mb-0">
                      <Pagination.First
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(1)}
                      />
                      <Pagination.Prev
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                      />

                      {Array.from(
                        { length: Math.min(5, pagination.totalPages) },
                        (_, i) => {
                          const page = i + 1;
                          return (
                            <Pagination.Item
                              key={page}
                              active={page === currentPage}
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </Pagination.Item>
                          );
                        }
                      )}

                      <Pagination.Next
                        disabled={currentPage === pagination.totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                      />
                      <Pagination.Last
                        disabled={currentPage === pagination.totalPages}
                        onClick={() => handlePageChange(pagination.totalPages)}
                      />
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </div>
        </Container>

        {/* Create User Modal */}
        <UserFormModal
          show={showCreateModal}
          onHide={() => {
            setShowCreateModal(false);
            setFormData(initialFormData);
          }}
          title="Create New User"
          onSubmit={handleCreateUser}
          isLoading={createUserMutation.isPending}
          formData={formData}
          handleInputChange={handleInputChange}
        />

        {/* Edit User Modal */}
        <UserFormModal
          show={showEditModal}
          onHide={() => {
            setShowEditModal(false);
            setEditingUser(null);
            setFormData(initialFormData);
          }}
          title="Edit User"
          onSubmit={handleUpdateUser}
          isLoading={updateUserMutation.isPending}
          formData={formData}
          handleInputChange={handleInputChange}
        />

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          show={showDeleteModal}
          onHide={() => {
            setShowDeleteModal(false);
            setDeletingUser(null);
          }}
          onConfirm={confirmDeleteUser}
          title="Confirm Delete"
          message={`Are you sure you want to delete user ${deletingUser?.name}? This action cannot be undone.`}
          confirmText="Delete User"
          variant="danger"
          loading={deleteUserMutation.isPending}
          icon="🗑️"
        />

        {/* Bulk Delete Modal */}
        <ConfirmModal
          show={showBulkDeleteModal}
          onHide={() => setShowBulkDeleteModal(false)}
          onConfirm={handleBulkDelete}
          title="Bulk Delete Confirmation"
          message={`Are you sure you want to delete ${selectedUsers.size} selected user(s)? This will permanently delete multiple users and cannot be undone.`}
          confirmText={`Delete ${selectedUsers.size} Users`}
          variant="danger"
          loading={bulkDelete.isPending}
          icon="🗑️"
        />
      </div>
    </SidebarLayout>
  );
}
