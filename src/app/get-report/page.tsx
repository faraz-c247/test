"use client";

import React, { useState } from "react";
import PropertyContactForm from "@/components/unregistered/PropertyContactForm";
import PlanSelectionStep from "@/components/unregistered/PlanSelectionStep";
import { CheckoutStepWithStripe } from "@/components/unregistered/CheckoutStep";
import PublicHeader from "@/components/common/PublicHeader";

export interface UnregisteredUserFormData {
  // Step 1: Property & Contact Info
  propertyDetails: {
    address: string;
    propertyType: "apartment" | "house" | "condo" | "townhouse" | "studio";
    bedrooms: string;
    bathrooms: string;
    squareFeet?: number;
    yearBuilt?: number;
    parking?: number;
    furnished?: boolean;
    petPolicy?: "allowed" | "not-allowed" | "conditional";
  };
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
  };

  // Step 2: Plan Selection
  selectedPlan: {
    planType: "one-off" | "starter" | "pro" | "agency" | "enterprise";
    credits: number;
    price: number;
    title: string;
  };

  // Step 3: Checkout
  promoCode?: string;
  termsAccepted: boolean;
  informationalPurposesAccepted: boolean;
}

export default function GetReportPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<UnregisteredUserFormData>({
    propertyDetails: {
      address: "",
      propertyType: "apartment",
      bedrooms: "",
      bathrooms: "",
      squareFeet: undefined,
      parking: undefined,
      furnished: undefined,
      petPolicy: undefined,
    },
    contactInfo: {
      firstName: "",
      lastName: "",
      email: "",
    },
    selectedPlan: {
      planType: "one-off",
      credits: 1,
      price: 15,
      title: "One-Off Report",
    },
    termsAccepted: false,
    informationalPurposesAccepted: false,
  });

  const handleStep1Complete = (data: Partial<UnregisteredUserFormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
    setCurrentStep(2);
  };

  const handleStep2Complete = (data: Partial<UnregisteredUserFormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
    setCurrentStep(3);
  };

  const handleStep3Complete = (data: Partial<UnregisteredUserFormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));

    // Proceed to payment processing
    console.log("Final form data:", { ...formData, ...data });
    // This will trigger the payment flow and user creation
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <>
      {/* Fixed Header */}
      <PublicHeader />

      {/* Main Content - with top padding to account for fixed header */}
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          margin: 0,
          padding: 0,
          paddingTop: "120px", // Account for fixed header height
          overflowX: "hidden",
        }}
      >
        {/* Multi-Step Form */}
        {currentStep === 1 && (
          <PropertyContactForm
            formData={formData}
            onComplete={handleStep1Complete}
          />
        )}

        {currentStep === 2 && (
          <PlanSelectionStep
            formData={formData}
            onComplete={handleStep2Complete}
            onPrevious={handlePrevious}
          />
        )}

        {currentStep === 3 && (
          <CheckoutStepWithStripe
            formData={formData}
            onComplete={handleStep3Complete}
            onPrevious={handlePrevious}
          />
        )}
      </div>
    </>
  );
}
