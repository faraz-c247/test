"use client";

import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Tabs,
  Tab,
  Badge,
} from "react-bootstrap";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SidebarLayout from "@/components/common/SidebarLayout";
import {
  useUserProfile,
  useUpdateProfile,
  useChangePassword,
  useDeleteAccount,
} from "@/hooks/useUser";
import { ConfirmModal, AlertModal } from "@/components/common/Modal";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-hot-toast";

// Validation schemas
const profileSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
});

const passwordSchema = yup.object({
  oldPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your password"),
});

type ProfileFormData = yup.InferType<typeof profileSchema>;
type PasswordFormData = yup.InferType<typeof passwordSchema>;

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Queries and mutations
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useUserProfile();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const deleteAccount = useDeleteAccount();

  // Forms
  const profileForm = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: profile?.name || session?.user?.name || "",
      email: profile?.email || session?.user?.email || "",
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: yupResolver(passwordSchema),
  });

  // Update form when profile loads
  React.useEffect(() => {
    if (profile) {
      profileForm.reset({
        name: profile.name || "",
        email: profile.email || "",
      });
    }
  }, [profile, profileForm]);

  if (status === "loading" || profileLoading) {
    return (
      <SidebarLayout>
        <Container className="py-5">
          <LoadingSpinner size="lg" fullScreen={false} />
          <div className="text-center mt-3">
            <p className="text-muted">Loading profile...</p>
          </div>
        </Container>
      </SidebarLayout>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  if (profileLoading) {
    return (
      <SidebarLayout>
        <Container className="py-5">
          <LoadingSpinner size="lg" fullScreen={false} />
          <div className="text-center mt-3">
            <p className="text-muted">Loading profile...</p>
          </div>
        </Container>
      </SidebarLayout>
    );
  }

  const handleProfileSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile.mutateAsync({
        name: data.name,
        email: data.email,
      });
      setSuccessMessage("Profile updated successfully!");
      setShowSuccessModal(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handlePasswordSubmit = async (data: PasswordFormData) => {
    try {
      await changePassword.mutateAsync({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      passwordForm.reset();
      setSuccessMessage("Password changed successfully!");
      setShowSuccessModal(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount.mutateAsync();
      setShowDeleteModal(false);
      router.push("/login?message=Account deleted successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete account");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <SidebarLayout>
      <Container fluid className="py-4">
        <Row className="justify-content-center">
          <Col lg={8} xl={6}>
            {/* Header */}
            <div className="text-center mb-4">
              <div className="mb-3">
                <div
                  className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                  style={{ width: "80px", height: "80px", fontSize: "2rem" }}
                >
                  {session.user?.name?.charAt(0) ||
                    session.user?.email?.charAt(0) ||
                    "👤"}
                </div>
              </div>
              <h1 className="h2 mb-1">
                {session.user?.name || "User Profile"}
              </h1>
              <p className="text-muted">
                Manage your account settings and preferences
              </p>
            </div>

            {/* Profile Card */}
            <Card className="shadow-sm">
              <Card.Body className="p-0">
                <Tabs
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k || "profile")}
                  className="border-bottom"
                  justify
                >
                  <Tab eventKey="profile" title="👤 Profile">
                    <div className="p-4">
                      {profileError && (
                        <Alert variant="danger" className="mb-4">
                          Failed to load profile information. Please try
                          refreshing the page.
                        </Alert>
                      )}

                      <Form
                        onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
                      >
                        <Row className="mb-4">
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Full Name *</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter your full name"
                                {...profileForm.register("name")}
                                isInvalid={!!profileForm.formState.errors.name}
                              />
                              <Form.Control.Feedback type="invalid">
                                {profileForm.formState.errors.name?.message}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Email Address *</Form.Label>
                              <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                {...profileForm.register("email")}
                                isInvalid={!!profileForm.formState.errors.email}
                              />
                              <Form.Control.Feedback type="invalid">
                                {profileForm.formState.errors.email?.message}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>

                        {/* Account Info */}
                        <div className="mb-4">
                          <h6 className="text-muted mb-3">
                            Account Information
                          </h6>
                          <Row>
                            <Col md={6}>
                              <div className="mb-2">
                                <strong>User ID:</strong>
                                <code className="ms-2 small">
                                  {session.user?.id}
                                </code>
                              </div>
                              <div className="mb-2">
                                <strong>Role:</strong>
                                <Badge bg="primary" className="ms-2">
                                  {session.role || "User"}
                                </Badge>
                              </div>
                            </Col>
                            <Col md={6}>
                              {profile?.createdAt && (
                                <div className="mb-2">
                                  <strong>Member Since:</strong>
                                  <span className="ms-2">
                                    {formatDate(profile.createdAt.toString())}
                                  </span>
                                </div>
                              )}
                            </Col>
                          </Row>
                        </div>

                        <div className="d-flex justify-content-end">
                          <Button
                            type="submit"
                            variant="primary"
                            disabled={updateProfile.isPending}
                            className="px-4"
                          >
                            {updateProfile.isPending ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Updating...
                              </>
                            ) : (
                              "Update Profile"
                            )}
                          </Button>
                        </div>
                      </Form>
                    </div>
                  </Tab>

                  <Tab eventKey="security" title="🔒 Security">
                    <div className="p-4">
                      <h5 className="mb-3">Change Password</h5>
                      <p className="text-muted mb-4">
                        Choose a strong password to keep your account secure.
                      </p>

                      <Form
                        onSubmit={passwordForm.handleSubmit(
                          handlePasswordSubmit
                        )}
                      >
                        <Row>
                          <Col md={12}>
                            <Form.Group className="mb-3">
                              <Form.Label>Current Password *</Form.Label>
                              <Form.Control
                                type="password"
                                placeholder="Enter your current password"
                                {...passwordForm.register("oldPassword")}
                                isInvalid={
                                  !!passwordForm.formState.errors.oldPassword
                                }
                              />
                              <Form.Control.Feedback type="invalid">
                                {
                                  passwordForm.formState.errors.oldPassword
                                    ?.message
                                }
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>New Password *</Form.Label>
                              <Form.Control
                                type="password"
                                placeholder="Enter new password"
                                {...passwordForm.register("newPassword")}
                                isInvalid={
                                  !!passwordForm.formState.errors.newPassword
                                }
                              />
                              <Form.Control.Feedback type="invalid">
                                {
                                  passwordForm.formState.errors.newPassword
                                    ?.message
                                }
                              </Form.Control.Feedback>
                              <Form.Text className="text-muted">
                                Must be at least 8 characters with uppercase,
                                lowercase, and number
                              </Form.Text>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Confirm New Password *</Form.Label>
                              <Form.Control
                                type="password"
                                placeholder="Confirm new password"
                                {...passwordForm.register("confirmPassword")}
                                isInvalid={
                                  !!passwordForm.formState.errors
                                    .confirmPassword
                                }
                              />
                              <Form.Control.Feedback type="invalid">
                                {
                                  passwordForm.formState.errors.confirmPassword
                                    ?.message
                                }
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>

                        <div className="d-flex justify-content-end">
                          <Button
                            type="submit"
                            variant="primary"
                            disabled={changePassword.isPending}
                            className="px-4"
                          >
                            {changePassword.isPending ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Changing...
                              </>
                            ) : (
                              "Change Password"
                            )}
                          </Button>
                        </div>
                      </Form>
                    </div>
                  </Tab>

                  <Tab eventKey="danger" title="⚠️ Danger Zone">
                    <div className="p-4">
                      <div className="border border-danger rounded p-4">
                        <h5 className="text-danger mb-3">Delete Account</h5>
                        <p className="text-muted mb-4">
                          Once you delete your account, there is no going back.
                          This will permanently delete your account and remove
                          all your data from our servers.
                        </p>

                        <Alert variant="warning" className="mb-4">
                          <strong>This action cannot be undone!</strong> All
                          your property reports, analyses, and account data will
                          be permanently deleted.
                        </Alert>

                        <Button
                          variant="danger"
                          onClick={() => setShowDeleteModal(true)}
                          disabled={deleteAccount.isPending}
                        >
                          {deleteAccount.isPending ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" />
                              Deleting Account...
                            </>
                          ) : (
                            "Delete My Account"
                          )}
                        </Button>
                      </div>
                    </div>
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Delete Account Confirmation Modal */}
        <ConfirmModal
          show={showDeleteModal}
          title="Delete Account"
          message={`Are you sure you want to permanently delete your account? This action cannot be undone and will remove all your data including property reports and analyses.`}
          confirmText="Yes, Delete My Account"
          variant="danger"
          onConfirm={handleDeleteAccount}
          onHide={() => setShowDeleteModal(false)}
          loading={deleteAccount.isPending}
        />

        {/* Success Modal */}
        <AlertModal
          show={showSuccessModal}
          variant="success"
          title="Success!"
          message={successMessage}
          onHide={() => setShowSuccessModal(false)}
        />
      </Container>
    </SidebarLayout>
  );
}
