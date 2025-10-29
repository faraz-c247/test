"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Table,
  ProgressBar,
  Alert,
  Spinner,
} from "react-bootstrap";
import SidebarLayout from "@/components/common/SidebarLayout";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import {
  useUserCreditsQuery,
  useUserTransactionsQuery,
} from "@/hooks/useSubscription";
import Link from "next/link";

export default function MyCreditsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // API calls
  const { data: creditsData, isLoading: creditsLoading } =
    useUserCreditsQuery();
  const { data: transactionsData, isLoading: transactionsLoading } =
    useUserTransactionsQuery({ page: 1, limit: 10 });

  // Debug transaction data and transform UserCredits to Transaction format
  const rawTransactions = transactionsData?.data?.transactions || [];

  // Debug: Log the raw transaction data to see what we're getting
  React.useEffect(() => {
    if (rawTransactions.length > 0) {
      console.log("Raw UserCredits data:", rawTransactions[0]);
      console.log("Plan data:", rawTransactions[0]?.planId);
    }
  }, [rawTransactions]);
  const transactions = rawTransactions.map((credit: any) => ({
    id: credit.id || credit._id,
    amount: credit.amount || credit.planId?.price || 0, // Use stored amount first, fallback to plan price
    currency: "USD",
    status: credit.status === "active" ? "completed" : credit.status,
    description: `Credit Purchase - ${credit.totalCredits} credits (${
      credit.planId?.name || "Plan"
    })`,
    paymentGateway: "stripe",
    createdAt: credit.createdAt,
    updatedAt: credit.updatedAt,
    // Extract metadata from paymentIntentId if it contains promo info
    metadata: {
      paymentIntentId: credit.paymentIntentId,
      totalCredits: credit.totalCredits,
      expirationDate: credit.expirationDate,
      planName: credit.planId?.name,
      planPrice: credit.planId?.price,
      actualAmountPaid: credit.amount,
    },
  }));

  React.useEffect(() => {
    if (rawTransactions.length > 0) {
      console.log("Raw UserCredits data:", rawTransactions[0]);
      console.log("Transformed transaction data:", transactions[0]);
    }
  }, [rawTransactions, transactions]);

  const credits = creditsData?.data;

  // Debug: Log the credits data to see what we're getting from backend
  React.useEffect(() => {
    if (credits) {
      console.log("Credits data from backend:", credits);
      console.log("Expiration date:", credits.expirationDate);
      console.log("Total amount:", credits.totalAmount);
    }
  }, [credits]);

  // Session loading
  if (status === "loading" || creditsLoading || transactionsLoading) {
    return (
      <SidebarLayout>
        <Container className="py-5">
          <LoadingSpinner size="lg" fullScreen={false} />
        </Container>
      </SidebarLayout>
    );
  }

  // Redirect if not authenticated
  if (!session) {
    router.push("/login");
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined || isNaN(Number(amount))) {
      return "$0.00";
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(amount));
  };

  const getDaysUntilExpiration = (expirationDate: string | null) => {
    if (!expirationDate) return null;
    const now = new Date();
    const expiry = new Date(expirationDate);
    const diffTime = expiry.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getPromoCodeInfo = (transaction: any) => {
    try {
      if (transaction.metadata && typeof transaction.metadata === "object") {
        const promoCode =
          transaction.metadata.promoCode || transaction.metadata.promotion_code;
        const discount =
          transaction.metadata.discount || transaction.metadata.promoDiscount;
        if (promoCode || discount) {
          return { promoCode, discount };
        }
      }

      // Check if actual amount paid is less than plan price (discount applied)
      const planPrice = transaction.metadata?.planPrice;
      const actualAmount =
        transaction.metadata?.actualAmountPaid || transaction.amount;

      if (planPrice && actualAmount && actualAmount < planPrice) {
        const discountAmount = planPrice - actualAmount;
        const discountPercentage = Math.round(
          (discountAmount / planPrice) * 100
        );
        return {
          promoCode: "DISCOUNT_APPLIED", // Placeholder since we don't have the actual code
          discount: {
            type: "percentage",
            value: discountPercentage,
            amount: discountAmount,
          },
        };
      }

      return null;
    } catch (error) {
      return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "success",
      expired: "danger",
      exhausted: "secondary",
    };
    return (
      <Badge
        bg={variants[status as keyof typeof variants] || "secondary"}
        className="px-3 py-2 rounded-pill fw-semibold"
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <SidebarLayout>
      <Container fluid className="py-4">
        {/* Header Section */}
        <div className="text-center mb-5">
          <div className="mb-4">
            <h1 className="display-4 fw-bold text-primary-custom mb-3">
              My Credits Dashboard
            </h1>
            <p className="fs-5 text-secondary-custom mb-0">
              Track your credit usage, view purchase history, and manage your
              subscription
            </p>
          </div>

          <div className="d-flex justify-content-center gap-3">
            <Link href="/purchase-plans">
              <Button
                variant="primary"
                size="lg"
                className="rounded-figma-md px-4 py-3 fw-semibold"
              >
                <span className="me-2">💳</span>
                Purchase More Credits
              </Button>
            </Link>
            <Link href="/generate-report">
              <Button
                variant="outline-primary"
                size="lg"
                className="rounded-figma-md px-4 py-3 fw-semibold"
                disabled={
                  !credits?.remainingCredits || credits.remainingCredits === 0
                }
              >
                <span className="me-2">🚀</span>
                Generate Report
              </Button>
            </Link>
          </div>
        </div>

        {/* Credits Overview Cards */}
        <Row className="g-4 mb-5">
          <Col lg={3} md={6}>
            <Card className="border-0 shadow-lg h-100 rounded-figma-xl overflow-hidden">
              <div className="bg-gradient-primary text-white p-4 text-center">
                <div className="display-2 mb-2 fw-bold">
                  {credits?.remainingCredits || 0}
                </div>
                <h4 className="mb-0 opacity-90">Available Credits</h4>
              </div>
              <Card.Body className="text-center p-4">
                <div className="mb-3">
                  <span className="text-success fs-1">🎯</span>
                </div>
                <p className="text-secondary-custom mb-0">
                  Ready to use for generating detailed property reports
                </p>
                {credits?.remainingCredits === 0 && (
                  <Alert variant="warning" className="mt-3 mb-0">
                    <strong>No credits available</strong>
                    <br />
                    <small>Purchase a plan to get started</small>
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6}>
            <Card className="border-0 shadow-lg h-100 rounded-figma-xl overflow-hidden">
              <div className="bg-gradient-to-r from-success to-green text-white p-4 text-center">
                <div className="display-2 mb-2 fw-bold">
                  {credits?.usedCredits || 0}
                </div>
                <h4 className="mb-0 opacity-90">Credits Used</h4>
              </div>
              <Card.Body className="text-center p-4">
                <div className="mb-3">
                  <span className="text-success fs-1">📊</span>
                </div>
                <p className="text-secondary-custom mb-0">
                  Reports generated successfully with your credits
                </p>
                {credits?.usedCredits > 0 && (
                  <div className="mt-3">
                    <small className="text-success fw-semibold">
                      Great job! You're getting value from your investment
                    </small>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6}>
            <Card className="border-0 shadow-lg h-100 rounded-figma-xl overflow-hidden">
              <div className="bg-gradient-to-r from-info to-blue text-white p-4 text-center">
                <div className="display-2 mb-2 fw-bold">
                  {credits?.totalCredits || 0}
                </div>
                <h4 className="mb-0 opacity-90">Total Purchased</h4>
              </div>
              <Card.Body className="text-center p-4">
                <div className="mb-3">
                  <span className="text-info fs-1">💎</span>
                </div>
                <p className="text-secondary-custom mb-0">
                  Lifetime credit purchases across all your subscriptions
                </p>
                {credits?.totalCredits > 0 && (
                  <div className="mt-3">
                    <small className="text-info fw-semibold">
                      You've invested in {credits.totalCredits} reports
                    </small>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6}>
            <Card className="border-0 shadow-lg h-100 rounded-figma-xl overflow-hidden">
              <div className="bg-gradient-to-r from-warning to-orange text-white p-4 text-center">
                <div className="mb-2">
                  <span className="fs-1">📅</span>
                </div>
                <h4 className="mb-0 opacity-90">Credit Validity</h4>
              </div>
              <Card.Body className="text-center p-4">
                {credits?.expirationDate ? (
                  <>
                    <div className="mb-3">
                      <div className="fw-bold text-dark fs-5">
                        {formatDate(credits.expirationDate)}
                      </div>
                      <small className="text-secondary-custom">
                        Expires on
                      </small>
                    </div>
                    {(() => {
                      const daysLeft = getDaysUntilExpiration(
                        credits.expirationDate
                      );
                      const isExpiringSoon =
                        daysLeft !== null && daysLeft <= 30;

                      return (
                        <div className="mt-3">
                          {daysLeft !== null ? (
                            <Badge
                              bg={isExpiringSoon ? "warning" : "success"}
                              className="px-3 py-2 rounded-pill"
                            >
                              {isExpiringSoon ? "⚠️" : "✅"} {daysLeft} days
                              remaining
                            </Badge>
                          ) : (
                            <small className="text-secondary-custom">
                              Credits are about to expire
                            </small>
                          )}
                        </div>
                      );
                    })()}
                  </>
                ) : (
                  <>
                    <div className="mb-3">
                      <div className="text-success fs-1">♾️</div>
                    </div>
                    <Badge bg="success" className="px-3 py-2 rounded-pill">
                      ✨ Never expires
                    </Badge>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Credit Status Alert */}
        {credits?.remainingCredits === 0 && (
          <Row className="mb-5">
            <Col>
              <Alert
                variant="warning"
                className="border-0 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-figma-xl"
              >
                <div className="d-flex align-items-center">
                  <div className="me-4">
                    <span className="display-4">⚠️</span>
                  </div>
                  <div className="flex-grow-1">
                    <h5 className="text-warning fw-bold mb-2">
                      No Credits Available
                    </h5>
                    <p className="text-secondary-custom mb-3">
                      You need to purchase a subscription plan to generate new
                      reports. Choose from our flexible credit packages to
                      continue your analysis.
                    </p>
                    <Link href="/purchase-plans">
                      <Button
                        variant="warning"
                        size="lg"
                        className="rounded-figma-md px-4"
                      >
                        <span className="me-2">🛒</span>
                        Browse Subscription Plans
                      </Button>
                    </Link>
                  </div>
                </div>
              </Alert>
            </Col>
          </Row>
        )}

        {/* Purchase History */}
        <Row className="mb-5">
          <Col>
            <Card className="border-0 shadow-lg rounded-figma-xl overflow-hidden">
              <Card.Header className="bg-gradient-to-r from-purple to-indigo text-white p-4 border-0">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <span className="fs-1 me-3">📋</span>
                    <div>
                      <h3 className="mb-1 fw-bold">Purchase History</h3>
                      <p className="mb-0 opacity-90">
                        Track all your subscription purchases and transactions
                      </p>
                    </div>
                  </div>
                  <Badge
                    bg="light"
                    text="dark"
                    className="px-3 py-2 rounded-pill"
                  >
                    {transactionsData?.data?.total || 0} transactions
                  </Badge>
                </div>
              </Card.Header>
              <Card.Body className="p-4">
                {transactions.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="display-1 mb-4">💳</div>
                    <h4 className="text-secondary-custom mb-3">
                      No Purchases Yet
                    </h4>
                    <p className="text-secondary-custom mb-4">
                      Your purchase history will appear here after you buy your
                      first subscription plan. Start with our flexible credit
                      packages to unlock powerful rental intelligence.
                    </p>
                    <Link href="/purchase-plans">
                      <Button
                        variant="primary"
                        size="lg"
                        className="rounded-figma-md px-4"
                      >
                        <span className="me-2">🛒</span>
                        Browse Subscription Plans
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table className="mb-0">
                      <thead>
                        <tr className="border-0">
                          <th className="border-0 text-secondary-custom fw-semibold">
                            Transaction ID
                          </th>
                          <th className="border-0 text-secondary-custom fw-semibold">
                            Plan
                          </th>
                          <th className="border-0 text-secondary-custom fw-semibold">
                            Amount
                          </th>
                          <th className="border-0 text-secondary-custom fw-semibold">
                            Status
                          </th>
                          <th className="border-0 text-secondary-custom fw-semibold">
                            Date
                          </th>
                          <th className="border-0 text-secondary-custom fw-semibold">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((transaction) => (
                          <tr key={transaction.id} className="border-bottom">
                            <td className="py-3">
                              <code className="bg-light px-2 py-1 rounded small">
                                {transaction.id.slice(0, 8)}...
                              </code>
                            </td>
                            <td className="py-3">
                              <div className="fw-semibold text-primary-custom">
                                {transaction.description}
                              </div>
                              {getPromoCodeInfo(transaction) && (
                                <div className="mt-1">
                                  <Badge bg="info" className="me-2">
                                    Promo:{" "}
                                    {getPromoCodeInfo(transaction)?.promoCode}
                                  </Badge>
                                  {getPromoCodeInfo(transaction)?.discount && (
                                    <small className="text-success">
                                      Discount Applied:{" "}
                                      {getPromoCodeInfo(transaction)?.discount
                                        ?.type === "percentage"
                                        ? `${
                                            getPromoCodeInfo(transaction)
                                              ?.discount?.value
                                          }%`
                                        : `$${
                                            getPromoCodeInfo(transaction)
                                              ?.discount?.value
                                          }`}
                                    </small>
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="py-3">
                              <span className="fw-bold fs-5 text-success">
                                {formatCurrency(transaction.amount)}
                              </span>
                            </td>
                            <td className="py-3">
                              <Badge
                                bg={
                                  transaction.status === "completed"
                                    ? "success"
                                    : transaction.status === "failed"
                                    ? "danger"
                                    : transaction.status === "refunded"
                                    ? "warning"
                                    : "secondary"
                                }
                                className="px-3 py-2 rounded-pill fw-semibold"
                              >
                                {transaction.status.charAt(0).toUpperCase() +
                                  transaction.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="py-3">
                              <small className="text-secondary-custom">
                                {formatDate(transaction.createdAt)}
                              </small>
                            </td>
                            <td className="py-3">
                              <div className="d-flex gap-2">
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  className="rounded-pill"
                                >
                                  📄 Invoice
                                </Button>
                                {transaction.status === "completed" && (
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="rounded-pill"
                                  >
                                    📧 Resend
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Credit Usage Tips */}
        <Row>
          <Col>
            <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-figma-xl overflow-hidden">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <span className="display-4 mb-3 d-block">💡</span>
                  <h3 className="text-primary-custom fw-bold mb-2">
                    Credit Usage Tips
                  </h3>
                  <p className="text-secondary-custom mb-0">
                    Maximize the value of your credits with these smart
                    strategies
                  </p>
                </div>
                <Row className="g-4">
                  <Col lg={6}>
                    <div className="bg-white p-4 rounded-figma-lg shadow-sm h-100">
                      <h6 className="text-primary-custom fw-bold mb-3">
                        🎯 Strategic Usage
                      </h6>
                      <ul className="list-unstyled small">
                        <li className="mb-3 d-flex align-items-start">
                          <span className="text-success me-2">✓</span>
                          <span>
                            <strong>Maximize Value:</strong> Use credits for
                            properties you're seriously considering
                          </span>
                        </li>
                        <li className="mb-3 d-flex align-items-start">
                          <span className="text-success me-2">✓</span>
                          <span>
                            <strong>Check Expiration:</strong> Credits expire
                            based on your subscription plan
                          </span>
                        </li>
                        <li className="mb-3 d-flex align-items-start">
                          <span className="text-success me-2">✓</span>
                          <span>
                            <strong>Plan Ahead:</strong> Larger packs offer
                            better per-report pricing
                          </span>
                        </li>
                      </ul>
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="bg-white p-4 rounded-figma-lg shadow-sm h-100">
                      <h6 className="text-primary-custom fw-bold mb-3">
                        💰 Smart Savings
                      </h6>
                      <ul className="list-unstyled small">
                        <li className="mb-3 d-flex align-items-start">
                          <span className="text-success me-2">✓</span>
                          <span>
                            <strong>Best Value:</strong> Enterprise packs save
                            up to 43% per report
                          </span>
                        </li>
                        <li className="mb-3 d-flex align-items-start">
                          <span className="text-success me-2">✓</span>
                          <span>
                            <strong>Auto-Renewal:</strong> Set up auto-renewal
                            to never run out
                          </span>
                        </li>
                        <li className="mb-3 d-flex align-items-start">
                          <span className="text-success me-2">✓</span>
                          <span>
                            <strong>Bulk Options:</strong> Contact support for
                            custom pricing
                          </span>
                        </li>
                      </ul>
                    </div>
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
