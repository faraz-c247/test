import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message, inquiryType } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "All required fields must be filled out",
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid email address",
        },
        { status: 400 }
      );
    }

    // Log the contact form submission
    console.log("Contact Form Submission:", {
      name,
      email,
      subject,
      message,
      inquiryType,
      submittedAt: new Date().toISOString(),
      ip: request.ip || request.headers.get("x-forwarded-for") || "unknown",
    });

    // Send email notification to admin if SendGrid is configured
    if (process.env.SENDGRID_API_KEY && process.env.ADMIN_EMAIL) {
      try {
        const adminEmail = {
          to: process.env.ADMIN_EMAIL,
          from: process.env.FROM_EMAIL || "noreply@rentintel.com",
          subject: `[RentIntel Contact] ${subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
                New Contact Form Submission
              </h2>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #2c3e50; margin-top: 0;">Contact Details</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Inquiry Type:</strong> ${inquiryType}</p>
                <p><strong>Subject:</strong> ${subject}</p>
              </div>
              
              <div style="background-color: #ffffff; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px;">
                <h3 style="color: #2c3e50; margin-top: 0;">Message</h3>
                <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>
              
              <div style="margin-top: 20px; padding: 15px; background-color: #e8f4fd; border-radius: 8px;">
                <p style="margin: 0; color: #2c3e50; font-size: 14px;">
                  <strong>Submitted:</strong> ${new Date().toLocaleString()}<br>
                  <strong>Source:</strong> RentIntel Contact Form
                </p>
              </div>
            </div>
          `,
        };

        await sgMail.send(adminEmail);
        console.log("Admin notification email sent successfully");
      } catch (emailError) {
        console.error("Failed to send admin notification email:", emailError);
        // Don't fail the request if email fails
      }

      // Send auto-reply to the user
      try {
        const autoReplyEmail = {
          to: email,
          from: process.env.FROM_EMAIL || "noreply@rentintel.com",
          subject: "Thank you for contacting RentIntel",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2c3e50;">🏠 RentIntel</h1>
                <p style="color: #7f8c8d; font-size: 18px;">Rental Intelligence Platform</p>
              </div>
              
              <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
                <h2 style="color: #2c3e50; margin-top: 0;">Thank you for contacting us!</h2>
                
                <p style="color: #2c3e50; line-height: 1.6;">
                  Hi ${name},
                </p>
                
                <p style="color: #2c3e50; line-height: 1.6;">
                  We've received your message regarding "<strong>${subject}</strong>" and our team will get back to you within 24 hours.
                </p>
                
                <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #2c3e50; margin-top: 0;">Your Message:</h3>
                  <p style="color: #2c3e50; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                </div>
                
                <p style="color: #2c3e50; line-height: 1.6;">
                  In the meantime, feel free to explore our platform and check out our latest features:
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${
                    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"
                  }/signup" 
                     style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 5px;">
                    🚀 Start Free Trial
                  </a>
                  <a href="${
                    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"
                  }/about-us" 
                     style="background-color: #95a5a6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 5px;">
                    ℹ️ About Us
                  </a>
                </div>
                
                <p style="color: #7f8c8d; font-size: 14px; margin-top: 30px;">
                  Best regards,<br>
                  The RentIntel Team
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #ecf0f1; border-radius: 8px;">
                <p style="color: #7f8c8d; font-size: 12px; margin: 0;">
                  This is an automated response. Please do not reply to this email.
                </p>
              </div>
            </div>
          `,
        };

        await sgMail.send(autoReplyEmail);
        console.log("Auto-reply email sent successfully");
      } catch (emailError) {
        console.error("Failed to send auto-reply email:", emailError);
        // Don't fail the request if email fails
      }
    } else {
      console.log("SendGrid not configured - skipping email notifications");
    }

    return NextResponse.json({
      success: true,
      message:
        "Contact form submitted successfully. We will get back to you within 24 hours.",
      data: {
        contactId: `contact_${Date.now()}`,
        submittedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Contact form error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit contact form. Please try again later.",
      },
      { status: 500 }
    );
  }
}
