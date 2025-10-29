"use client";

import React from "react";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const { data: session } = useSession();

  return (
    <div className="min-vh-100">
      {/* Header Navigation - Figma Design */}
      <Navbar expand="lg" className="figma-header" fixed="top">
        <Container>
          {/* Logo */}
          <Navbar.Brand as={Link} href="/" className="figma-logo">
            <div className="logo-container">
              <div className="logo-image"></div>
            </div>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="figma-navbar-nav" />

          <Navbar.Collapse id="figma-navbar-nav">
            <div className="navbar-content">
              {/* Navigation Menu */}
              <Nav className="navbar-menu">
                <Nav.Link
                  as={Link}
                  href="#sample-report"
                  className="nav-menu-item"
                >
                  Sample Report
                </Nav.Link>
                <Nav.Link as={Link} href="#pricing" className="nav-menu-item">
                  Pricing
                </Nav.Link>
                <Nav.Link as={Link} href="#about" className="nav-menu-item">
                  About
                </Nav.Link>
                <Nav.Link as={Link} href="#blog" className="nav-menu-item">
                  Blog
                </Nav.Link>
                <Nav.Link as={Link} href="/contact-us" className="nav-menu-item">
                  Contact
                </Nav.Link>
              </Nav>

              {/* User Actions */}
              <div className="user-actions">
                {session ? (
                  <>
                    <Navbar.Text className="welcome-text">
                      Welcome,{" "}
                      <strong>
                        {session.user?.name || session.user?.email}
                      </strong>
                    </Navbar.Text>
                    <Link href="/dashboard" className="text-decoration-none">
                      <Button className="figma-primary-btn">Dashboard</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-decoration-none">
                      <Button className="figma-secondary-btn">Sign In</Button>
                    </Link>
                    <Link href="/signup" className="text-decoration-none">
                      <Button className="figma-primary-btn">
                        Get my Report
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content with proper spacing for fixed header */}
      <main className="main-content">{children}</main>

      {/* Footer - Figma Design */}
      <footer className="figma-footer">
        <Container>
          <div className="footer-content">
            {/* Company Info */}
            <div className="footer-section company-info">
              <div className="footer-logo">
                <div className="logo-container">
                  <div className="logo-image white"></div>
                </div>
              </div>
              <p className="company-description">
                Your Edge in Rental Intelligence. Professional rental market
                reports powered by AI and real-time data.
              </p>
            </div>

            {/* Product Links */}
            <div className="footer-section">
              <div className="footer-title">
                <h6>Product</h6>
                <div className="title-line"></div>
              </div>
              <ul className="footer-links">
                <li>
                  <a href="#one-time-reports">One-Time Reports</a>
                </li>
                <li>
                  <a href="#subscription-plans">Subscription Plans</a>
                </li>
                <li>
                  <a href="#api-access">API Access</a>
                </li>
                <li>
                  <a href="#sample-reports">Sample Reports</a>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div className="footer-section">
              <div className="footer-title">
                <h6>Company</h6>
                <div className="title-line"></div>
              </div>
              <ul className="footer-links">
                <li>
                  <a href="/about-us">About Us</a>
                </li>
                <li>
                  <a href="/contact-us">Contact</a>
                </li>
                <li>
                  <a href="/privacy-policy">Privacy Policy</a>
                </li>
                <li>
                  <a href="#terms-of-service">Terms of Service</a>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div className="footer-section">
              <div className="footer-title">
                <h6>Support</h6>
                <div className="title-line"></div>
              </div>
              <ul className="footer-links">
                <li>
                  <a href="#help-center">Help Center</a>
                </li>
                <li>
                  <a href="#faq">FAQ</a>
                </li>
                <li>
                  <a href="#technical-support">Technical Support</a>
                </li>
                <li>
                  <a href="#status-page">Status Page</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-divider"></div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="copyright">
              <small>
                © 2025 All Rights Reserved | Powered by YourRentIntel
              </small>
            </div>
            <div className="social-icons">
              <a href="#twitter" className="social-icon">
                <svg width="25" height="20" viewBox="0 0 25 20" fill="none">
                  <path
                    d="M25 2.37C24.08 2.78 23.11 3.06 22.1 3.2C23.15 2.56 23.96 1.55 24.34 0.37C23.37 0.96 22.3 1.38 21.18 1.6C20.24 0.59 18.95 0 17.54 0C14.85 0 12.66 2.2 12.66 4.92C12.66 5.32 12.71 5.71 12.8 6.08C8.36 5.88 4.44 3.9 1.81 0.91C1.37 1.67 1.12 2.56 1.12 3.5C1.12 5.31 2.04 6.9 3.46 7.82C2.61 7.8 1.81 7.57 1.1 7.18V7.25C1.1 9.61 2.8 11.57 5.03 12.04C4.61 12.15 4.16 12.21 3.7 12.21C3.37 12.21 3.06 12.18 2.76 12.12C3.39 14.05 5.22 15.46 7.4 15.5C5.71 16.81 3.61 17.6 1.33 17.6C0.91 17.6 0.51 17.58 0.1 17.53C2.31 18.92 4.97 19.73 7.81 19.73C17.54 19.73 22.82 12.3 22.82 5.52C22.82 5.3 22.82 5.09 22.81 4.88C23.8 4.15 24.67 3.24 25.35 2.2L25 2.37Z"
                    fill="#CECECE"
                  />
                </svg>
              </a>
              <a href="#facebook" className="social-icon">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path
                    d="M28 14C28 6.27 21.73 0 14 0S0 6.27 0 14C0 20.99 5.11 26.73 11.81 27.84V18.05H8.26V14H11.81V10.92C11.81 7.41 13.91 5.47 17.11 5.47C18.64 5.47 20.24 5.75 20.24 5.75V9.18H18.48C16.75 9.18 16.19 10.28 16.19 11.42V14H20.08L19.45 18.05H16.19V27.84C22.89 26.73 28 20.99 28 14Z"
                    fill="#CECECE"
                  />
                </svg>
              </a>
              <a href="#linkedin" className="social-icon">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path
                    d="M6.11 10.36H0.82V27.18H6.11V10.36ZM3.46 7.95C1.55 7.95 0 6.37 0 4.47C0 2.56 1.55 1 3.46 1C5.37 1 6.93 2.56 6.93 4.47C6.93 6.37 5.37 7.95 3.46 7.95ZM27.18 27.18H21.9V19.03C21.9 16.91 21.86 14.19 18.93 14.19C15.96 14.19 15.49 16.46 15.49 18.87V27.18H10.21V10.36H15.29V12.89H15.36C16.06 11.56 17.8 10.15 20.39 10.15C25.76 10.15 26.73 13.68 26.73 18.31V27.18H27.18Z"
                    fill="#CECECE"
                  />
                </svg>
              </a>
            </div>
          </div>
        </Container>
      </footer>

      <style jsx global>{`
        /* Figma Header Styles */
        .figma-header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          padding: 20px 0;
          z-index: 1050;
          transition: all 0.3s ease;
        }

        .figma-header .container {
          padding: 0 140px;
        }

        /* Logo Styles */
        .figma-logo {
          text-decoration: none;
        }

        .logo-container {
          width: 163px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-image {
          width: 163px;
          height: 80px;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 163 80"><rect width="163" height="80" fill="%23f8f9fa" rx="8"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="%232CA248" font-family="Poppins, sans-serif" font-weight="700" font-size="18">RentIntel</text></svg>')
            center/contain no-repeat;
        }

        .logo-image.white {
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 163 80"><rect width="163" height="80" fill="transparent" rx="8"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="%23FFFFFF" font-family="Poppins, sans-serif" font-weight="700" font-size="18">RentIntel</text></svg>')
            center/contain no-repeat;
        }

        /* Navbar Content */
        .navbar-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: 80px;
        }

        .navbar-menu {
          display: flex;
          align-items: center;
          gap: 30px;
          margin: 0;
        }

        .nav-menu-item {
          padding: 2px 6px !important;
          font-family: "Poppins", sans-serif;
          font-weight: 500;
          font-size: 18px;
          line-height: 1.5;
          color: #222222 !important;
          text-decoration: none;
          transition: all 0.3s ease;
          border-radius: 4px;
        }

        .nav-menu-item:hover {
          color: #2ca248 !important;
          background: rgba(44, 162, 72, 0.1);
        }

        /* User Actions */
        .user-actions {
          display: flex;
          align-items: center;
          gap: 30px;
        }

        .welcome-text {
          font-family: "Poppins", sans-serif;
          font-weight: 500;
          font-size: 16px;
          color: #222222;
        }

        .figma-secondary-btn {
          background: transparent;
          border: 2px solid;
          border-image: linear-gradient(90deg, #133f71 0%, #20cd2c 100%) 1;
          border-radius: 10px;
          padding: 10px 30px;
          font-family: "Poppins", sans-serif;
          font-weight: 600;
          font-size: 18px;
          line-height: 2;
          color: #2ca248;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .figma-secondary-btn:hover {
          background: rgba(44, 162, 72, 0.1);
          color: #2ca248;
          transform: translateY(-1px);
        }

        .figma-primary-btn {
          background: linear-gradient(90deg, #133f71 0%, #20cd2c 100%);
          border: none;
          border-radius: 10px;
          padding: 10px 30px;
          font-family: "Poppins", sans-serif;
          font-weight: 600;
          font-size: 18px;
          line-height: 2;
          color: #ffffff;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(19, 63, 113, 0.3);
        }

        .figma-primary-btn:hover {
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(19, 63, 113, 0.4);
        }

        /* Main Content Spacing */
        .main-content {
          margin-top: 120px;
        }

        /* Figma Footer Styles */
        .figma-footer {
          background: #0d2a4c;
          color: #ffffff;
          padding: 100px 0 70px;
        }

        .figma-footer .container {
          padding: 0 140px;
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          gap: 93px;
          margin-bottom: 70px;
        }

        .footer-section {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .company-info {
          max-width: 420px;
        }

        .footer-logo {
          margin-bottom: 30px;
        }

        .company-description {
          font-family: "Poppins", sans-serif;
          font-weight: 400;
          font-size: 18px;
          line-height: 1.5;
          color: #cecece;
          margin: 0;
        }

        .footer-title {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .footer-title h6 {
          font-family: "Poppins", sans-serif;
          font-weight: 600;
          font-size: 18px;
          color: #ffffff;
          margin: 0;
        }

        .title-line {
          width: 40px;
          height: 2px;
          background: #ffb24a;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-links li {
          height: 24px;
          display: flex;
          align-items: center;
        }

        .footer-links a {
          font-family: "Poppins", sans-serif;
          font-weight: 400;
          font-size: 16px;
          line-height: 1.5;
          color: #cecece;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .footer-links a:hover {
          color: #ffb24a;
        }

        .footer-divider {
          width: 100%;
          height: 1px;
          background: #cecece;
          opacity: 0.5;
          margin: 40px 0;
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .copyright small {
          font-family: "Poppins", sans-serif;
          font-weight: 400;
          font-size: 16px;
          line-height: 1.5;
          color: #cecece;
        }

        .social-icons {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .social-icon:hover {
          transform: translateY(-2px);
        }

        .social-icon svg {
          transition: all 0.3s ease;
        }

        .social-icon:hover svg path {
          fill: #ffb24a;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .figma-header .container {
            padding: 0 20px;
          }

          .navbar-content {
            flex-direction: column;
            gap: 20px;
          }

          .navbar-menu {
            flex-direction: column;
            gap: 15px;
            width: 100%;
            text-align: center;
          }

          .user-actions {
            justify-content: center;
            width: 100%;
          }

          .figma-footer .container {
            padding: 0 20px;
          }

          .footer-content {
            flex-direction: column;
            gap: 40px;
          }

          .footer-bottom {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }

          .main-content {
            margin-top: 80px;
          }
        }

        @media (max-width: 1200px) {
          .figma-header .container {
            padding: 0 40px;
          }

          .figma-footer .container {
            padding: 0 40px;
          }

          .navbar-content {
            gap: 40px;
          }

          .navbar-menu {
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
}
