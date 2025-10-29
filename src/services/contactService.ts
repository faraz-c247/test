import { BaseService } from "./baseService";

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  inquiryType: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data?: {
    contactId: string;
    submittedAt: string;
  };
}

class ContactService extends BaseService {
  constructor() {
    super("/contact");
  }

  async submitContactForm(formData: ContactFormData): Promise<ContactResponse> {
    return this.post<ContactResponse, ContactFormData>("/submit", formData);
  }
}

export const contactService = new ContactService();
