export interface Stylist {
  id: string;
  name: string;
  title: string;
  avatar: string;
  experienceYears: number;
  rating: number;
  completedOrders: number;
  bio: string;
  tags: string[];
}

export interface ServiceItem {
  id: string;
  name: string;
  category: '剪发' | '洗吹' | '烫染' | '护理' | '修面';
  durationMinutes: number;
  price: number;
  description: string;
}

export interface BookingNotification {
  id: string;
  appointmentId: string;
  bookingCode: string;
  type: 'booking_success' | 'booking_cancelled';
  title: string; // e.g. "服务预约成功通知"
  summary: string; // e.g. "您已成功预约【简剪 · 匠心发艺】服务"
  stylistName: string;
  serviceName: string;
  appointmentDateTime: string; // e.g. "2026-10-23 14:00"
  bookingCodeText: string;
  customerName: string;
  customerPhone: string;
  storeName: string;
  storeAddress: string;
  warmPrompt: string;
  sentAt: string;
  read: boolean;
}

export interface Appointment {
  id: string;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  stylistId: string;
  stylistName: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:mm
  status: 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  notificationHistory: BookingNotification[];
}

// Key format: `${stylistId}_${date}`
// Record maps timeSlot e.g. "10:00" -> 'available' | 'unavailable'
export interface StylistDaySchedule {
  stylistId: string;
  date: string; // YYYY-MM-DD
  slots: Record<string, 'available' | 'unavailable'>;
}

export type SlotStatus = 'available' | 'unavailable' | 'booked';

export interface SlotInfo {
  time: string;
  status: SlotStatus;
  appointment?: Appointment;
}

export type ActiveTab = 'customer_booking' | 'stylist_schedule' | 'my_bookings';
export type DisplayMode = 'mobile_mockup' | 'side_by_side' | 'fullscreen';
