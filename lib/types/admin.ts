export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface IAdminService {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice?: number;
  price?: number;
  estimatedDuration: string;
  serviceMode: "Home Visit" | "Shop Drop-off";
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  approvalStatus: ApprovalStatus;
  isAvailable: boolean;
  createdAt: string | Date;
}


export type BookingStatus =
  | "requested"
  | "accepted"
  | "rejected"
  | "in-progress"
  | "completed"
  | "cancelled";

export type PaymentStatus = "paid" | "unpaid";

export interface IAdminBooking {
  _id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  category: string;
  basePrice: number;

  technicianName: string;
  technicianEmail: string;

  customerName: string;
  customerEmail: string;
  customerPhone: string;

  address: string;
  preferredDate: string | Date;
  problemDescription: string;

  status: BookingStatus;
  finalAmount: number;
  paymentStatus: PaymentStatus;
}


export interface IAdminPayment {
  _id: string;
  bookingId: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  technicianName: string;
  technicianEmail: string;
  amount: number;
  currency: string;
  transactionId: string;
  stripeSessionId: string;
  paymentStatus: "paid";
  paidAt: string | Date;
}

export interface IAdminPaymentsResponse {
  payments: IAdminPayment[];
  totalRevenue: number;
}
