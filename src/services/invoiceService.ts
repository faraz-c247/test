import { BaseService } from "./baseService";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  status: "paid" | "pending" | "overdue" | "cancelled" | "refunded";
  dueDate: string;
  issueDate: string;
  plan: string;
  credits: number;
  description?: string;
}

export interface InvoicesResponse {
  success: boolean;
  data?: {
    invoices: Invoice[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalInvoices: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  message?: string;
}

class InvoiceService extends BaseService {
  constructor() {
    super("/invoices");
  }

  async getInvoices(page: number = 1, limit: number = 10): Promise<Invoice[]> {
    try {
      // Fetch invoices from the new invoice endpoint
      const response = await this.get(`?page=${page}&limit=${limit}`);
      
      if (response.success && response.data && response.data.invoices && Array.isArray(response.data.invoices)) {
        // Convert backend invoices to frontend format
        const invoices: Invoice[] = response.data.invoices.map((invoice: any) => {
          const user = invoice.userId; // This should be populated
          const plan = invoice.planId; // This should be populated
          
          return {
            id: invoice._id || invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            customerName: user?.name || "Unknown User",
            customerEmail: user?.email || "user@example.com",
            amount: invoice.amount,
            status: invoice.status,
            dueDate: invoice.dueDate,
            issueDate: invoice.createdAt,
            plan: plan?.name || "Unknown Plan",
            credits: plan?.credits || 0,
            description: invoice.description,
          };
        });

        return invoices;
      }

      return [];
    } catch (error) {
      console.error("Invoice service error:", error);
      return [];
    }
  }

  async updateInvoiceStatus(invoiceId: string, status: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.patch(`/${invoiceId}/status`, { status });
      
      if (response.success) {
        return {
          success: true,
          message: "Invoice status updated successfully",
        };
      } else {
        return {
          success: false,
          message: response.message || "Failed to update invoice status",
        };
      }
    } catch (error) {
      console.error("Update invoice status error:", error);
      return {
        success: false,
        message: "Failed to update invoice status",
      };
    }
  }

  async getInvoiceById(invoiceId: string): Promise<Invoice | null> {
    try {
      const response = await this.get(`/${invoiceId}`);
      
      if (response.success && response.data && response.data.invoice) {
        const invoice = response.data.invoice;
        const user = invoice.userId;
        const plan = invoice.planId;
        
        return {
          id: invoice._id || invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          customerName: user?.name || "Unknown User",
          customerEmail: user?.email || "user@example.com",
          amount: invoice.amount,
          status: invoice.status,
          dueDate: invoice.dueDate,
          issueDate: invoice.createdAt,
          plan: plan?.name || "Unknown Plan",
          credits: plan?.credits || 0,
          description: invoice.description,
        };
      }

      return null;
    } catch (error) {
      console.error("Get invoice error:", error);
      return null;
    }
  }
}

export const invoiceService = new InvoiceService();
