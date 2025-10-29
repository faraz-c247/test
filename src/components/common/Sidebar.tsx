"use client";

import React from "react";
import { Nav, Container, Badge } from "react-bootstrap";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  userRole: number;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/admin/dashboard";
    }
    return pathname === path;
  };

  const userMenuItems = [
    {
      href: "/dashboard",
      icon: "🏠",
      label: "Dashboard",
      description: "Overview & Analytics",
    },
    {
      href: "/generate-report",
      icon: "📊",
      label: "Generate Report",
      description: "Property Analysis",
    },
    {
      href: "/my-reports",
      icon: "📋",
      label: "My Reports",
      description: "View Reports",
    },
    {
      href: "/my-credits",
      icon: "💳",
      label: "My Credits",
      description: "Credit Balance",
    },
    {
      href: "/purchase-plans",
      icon: "🛒",
      label: "Purchase Plans",
      description: "Subscription Options",
    },
    {
      href: "/payment-methods",
      icon: "💰",
      label: "Payment Methods",
      description: "Billing Settings",
    },
    {
      href: "/profile",
      icon: "👤",
      label: "Profile",
      description: "Account Settings",
    },
  ];

  const adminMenuItems = [
    {
      href: "/dashboard",
      icon: "🏠",
      label: "Dashboard",
      description: "Admin Overview",
    },
    {
      href: "/admin/reports",
      icon: "📊",
      label: "All Reports",
      description: "User Reports",
    },
    {
      href: "/admin/user-management",
      icon: "👥",
      label: "User Management",
      description: "Manage Users",
      badge: "CRUD",
    },
    {
      href: "/admin/invoices",
      icon: "🧾",
      label: "Invoices",
      description: "Billing & Invoices",
    },
    {
      href: "/admin/contacts",
      icon: "📞",
      label: "Contacts",
      description: "Customer Inquiries",
    },
    {
      href: "/admin/settings",
      icon: "⚙️",
      label: "Settings",
      description: "Platform Config",
    },
    {
      href: "/profile",
      icon: "👤",
      label: "Profile",
      description: "Account Settings",
    },
  ];

  const menuItems = userRole === 1 ? adminMenuItems : userMenuItems;

  return (
    <div
      className="sidebar-figma position-fixed top-0 start-0 h-100 overflow-auto"
      style={{ width: "260px", zIndex: 1000 }}
    >
      {/* Logo Section */}
      <div className="p-4 border-bottom border-figma">
        <Link href="/" className="text-decoration-none">
          <div className="d-flex align-items-center">
            <div
              className="icon-figma me-3"
              style={{
                width: "48px",
                height: "48px",
                background: "var(--gradient-primary)",
                boxShadow: "none",
              }}
            >
              <span style={{ fontSize: "24px", color: "white" }}>🏠</span>
            </div>
            <div>
              <h5 className="text-dark-blue fw-bold mb-0">RentIntel</h5>
              <small className="text-secondary-custom">
                Rental Intelligence
              </small>
            </div>
          </div>
        </Link>
      </div>

      {/* Role Badge */}
      <div className="p-3 text-center">
        {userRole === 1 ? (
          <span className="role-badge-admin">👑 Admin Panel</span>
        ) : (
          <span className="role-badge-user">👤 User Dashboard</span>
        )}
      </div>

      {/* Navigation Menu */}
      <Container className="px-0">
        <Nav className="flex-column py-3">
          {menuItems.map((item, index) => (
            <Nav.Item key={index} className="mb-1">
              <Link
                href={item.href}
                className={`nav-link d-flex align-items-center text-decoration-none ${
                  isActive(item.href) ? "active" : ""
                }`}
                style={{
                  color: isActive(item.href)
                    ? "var(--text-white)"
                    : "var(--text-secondary)",
                  background: isActive(item.href)
                    ? "var(--gradient-primary)"
                    : "transparent",
                  borderRadius: "var(--border-radius-md)",
                  margin: "4px 12px",
                  padding: "12px 20px",
                  transition: "all 0.3s ease",
                  fontSize: "16px",
                  fontWeight: "500",
                }}
              >
                <span
                  className="me-3"
                  style={{ fontSize: "20px", minWidth: "24px" }}
                >
                  {item.icon}
                </span>
                <div className="flex-grow-1">
                  <div className="fw-medium">{item.label}</div>
                  <small
                    className="d-block"
                    style={{
                      opacity: 0.8,
                      fontSize: "12px",
                      color: isActive(item.href)
                        ? "rgba(255,255,255,0.8)"
                        : "var(--text-muted)",
                    }}
                  >
                    {item.description}
                  </small>
                </div>
                {item.badge && (
                  <span
                    className="badge-figma-orange"
                    style={{ fontSize: "10px" }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            </Nav.Item>
          ))}
        </Nav>
      </Container>

      {/* Footer Section */}
      <div className="mt-auto p-3 border-top border-figma">
        <div className="text-center">
          <div className="bg-green-light rounded-figma-md p-3">
            <div className="text-primary-custom fw-medium mb-1">
              💡 Need Help?
            </div>
            <small className="text-secondary-custom">
              Check our documentation or contact support for assistance.
            </small>
            <div className="mt-2">
              <Link
                href="/help"
                className="btn btn-outline-gradient btn-sm rounded-figma-md"
                style={{ fontSize: "12px" }}
              >
                📚 Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
