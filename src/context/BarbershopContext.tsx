import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Stylist,
  ServiceItem,
  Appointment,
  StylistDaySchedule,
  SlotStatus,
  SlotInfo,
  ActiveTab,
  DisplayMode,
  BookingNotification,
} from '../types';
import {
  INITIAL_STYLISTS,
  INITIAL_SERVICES,
  ALL_TIME_SLOTS,
  generateInitialSchedules,
  generateInitialAppointments,
  formatDate,
} from '../data/initialData';

interface BarbershopContextType {
  stylists: Stylist[];
  services: ServiceItem[];
  appointments: Appointment[];
  notifications: BookingNotification[];
  latestNotification: BookingNotification | null;
  dismissNotification: () => void;
  schedules: Record<string, StylistDaySchedule>;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
  // Stylist currently selected by Customer in booking view
  selectedStylistId: string;
  setSelectedStylistId: (id: string) => void;
  // Barber currently logged-in in stylist workspace view
  currentBarberId: string;
  setCurrentBarberId: (id: string) => void;
  // Active selected date for both views
  selectedDate: string;
  setSelectedDate: (d: string) => void;
  // Querying slot status
  getSlotInfo: (stylistId: string, date: string, time: string) => SlotInfo;
  getDaySlots: (stylistId: string, date: string) => SlotInfo[];
  // Customer action
  bookAppointment: (params: {
    customerName: string;
    customerPhone: string;
    stylistId: string;
    serviceId: string;
    date: string;
    timeSlot: string;
    notes?: string;
  }) => { success: boolean; appointment?: Appointment; error?: string };
  cancelAppointment: (appointmentId: string) => void;
  // Barber schedule setting action
  toggleSlotAvailability: (stylistId: string, date: string, timeSlot: string) => void;
  batchSetSchedule: (
    stylistId: string,
    date: string,
    action: 'all_open' | 'all_closed' | 'morning_only' | 'afternoon_only'
  ) => void;
  // Demo helpers
  resetAllData: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const BarbershopContext = createContext<BarbershopContextType | undefined>(undefined);

const STORAGE_KEY_SCHEDULES = 'barbershop_schedules_v3';
const STORAGE_KEY_APPOINTMENTS = 'barbershop_appointments_v3';

export const BarbershopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stylists] = useState<Stylist[]>(INITIAL_STYLISTS);
  const [services] = useState<ServiceItem[]>(INITIAL_SERVICES);

  const [schedules, setSchedules] = useState<Record<string, StylistDaySchedule>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SCHEDULES);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return generateInitialSchedules();
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_APPOINTMENTS);
      if (saved) {
        const parsed: Appointment[] = JSON.parse(saved);
        // Ensure notificationHistory exists
        return parsed.map((a) => ({
          ...a,
          notificationHistory: a.notificationHistory || [],
        }));
      }
    } catch {
      // fallback
    }
    return generateInitialAppointments();
  });

  const [latestNotification, setLatestNotification] = useState<BookingNotification | null>(null);

  const [activeTab, setActiveTab] = useState<ActiveTab>('customer_booking');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('mobile_mockup');
  const [selectedStylistId, setSelectedStylistId] = useState<string>(INITIAL_STYLISTS[0].id);
  const [currentBarberId, setCurrentBarberId] = useState<string>(INITIAL_STYLISTS[0].id);
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SCHEDULES, JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(appointments));
  }, [appointments]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2500);
  };

  const dismissNotification = () => {
    setLatestNotification(null);
  };

  // Helper to get slot info
  const getSlotInfo = (stylistId: string, date: string, time: string): SlotInfo => {
    // 1. Check if booked by appointment
    const matchingAppt = appointments.find(
      (a) =>
        a.stylistId === stylistId &&
        a.date === date &&
        a.timeSlot === time &&
        a.status === 'confirmed'
    );

    if (matchingAppt) {
      return {
        time,
        status: 'booked',
        appointment: matchingAppt,
      };
    }

    // 2. Check stylist schedule override
    const key = `${stylistId}_${date}`;
    const daySchedule = schedules[key];
    const slotSetting = daySchedule?.slots?.[time] ?? 'available';

    return {
      time,
      status: slotSetting === 'available' ? 'available' : 'unavailable',
    };
  };

  // Get full day's slots
  const getDaySlots = (stylistId: string, date: string): SlotInfo[] => {
    return ALL_TIME_SLOTS.map((slot) => getSlotInfo(stylistId, date, slot));
  };

  // Book appointment
  const bookAppointment = ({
    customerName,
    customerPhone,
    stylistId,
    serviceId,
    date,
    timeSlot,
    notes,
  }: {
    customerName: string;
    customerPhone: string;
    stylistId: string;
    serviceId: string;
    date: string;
    timeSlot: string;
    notes?: string;
  }) => {
    const slotInfo = getSlotInfo(stylistId, date, timeSlot);
    if (slotInfo.status === 'booked') {
      return { success: false, error: '该时段已被其他顾客预约，请选择其他时段' };
    }
    if (slotInfo.status === 'unavailable') {
      return { success: false, error: '该理发师在此时间段设为休息/暂无空档' };
    }

    const stylist = stylists.find((s) => s.id === stylistId);
    const service = services.find((s) => s.id === serviceId);

    if (!stylist || !service) {
      return { success: false, error: '理发师或服务项目无效' };
    }

    const bookingCode = 'B' + Math.floor(1000 + Math.random() * 9000);
    const now = new Date();
    const createdAt = `${formatDate(now)} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const appointmentId = 'apt_' + Date.now();

    // Create Simulated Message Notification
    const newNotification: BookingNotification = {
      id: 'notif_' + Date.now(),
      appointmentId,
      bookingCode,
      type: 'booking_success',
      title: '服务预约成功通知',
      summary: `您已成功预约【简剪 · 匠心发艺】的【${service.name}】服务`,
      stylistName: stylist.name,
      serviceName: service.name,
      appointmentDateTime: `${date} ${timeSlot}`,
      bookingCodeText: bookingCode,
      customerName,
      customerPhone,
      storeName: '简剪 · 匠心发艺 (三里屯店)',
      storeAddress: '三里屯艺术街区A座102',
      warmPrompt: '请凭预约核销码准时到店，档期将为您保留15分钟。',
      sentAt: createdAt,
      read: false,
    };

    const newAppointment: Appointment = {
      id: appointmentId,
      bookingCode,
      customerName,
      customerPhone,
      stylistId,
      stylistName: stylist.name,
      serviceId,
      serviceName: service.name,
      servicePrice: service.price,
      serviceDuration: service.durationMinutes,
      date,
      timeSlot,
      status: 'confirmed',
      notes,
      createdAt,
      notificationHistory: [newNotification],
    };

    setAppointments((prev) => [newAppointment, ...prev]);

    // Trigger top banner popup
    setLatestNotification(newNotification);

    showToast(`预约成功！微信服务通知已推送至上方`);
    return { success: true, appointment: newAppointment };
  };

  // Cancel appointment
  const cancelAppointment = (appointmentId: string) => {
    const now = new Date();
    const nowStr = `${formatDate(now)} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id !== appointmentId) return a;

        const cancelNotification: BookingNotification = {
          id: 'notif_cancel_' + Date.now(),
          appointmentId: a.id,
          bookingCode: a.bookingCode,
          type: 'booking_cancelled',
          title: '预约已取消通知',
          summary: `您的【${a.serviceName}】预约已成功取消`,
          stylistName: a.stylistName,
          serviceName: a.serviceName,
          appointmentDateTime: `${a.date} ${a.timeSlot}`,
          bookingCodeText: a.bookingCode,
          customerName: a.customerName,
          customerPhone: a.customerPhone,
          storeName: '简剪 · 匠心发艺 (三里屯店)',
          storeAddress: '三里屯艺术街区A座102',
          warmPrompt: '已取消档期并释放时段，欢迎下次预约。',
          sentAt: nowStr,
          read: false,
        };

        // Also trigger top notification popup for cancellation
        setLatestNotification(cancelNotification);

        return {
          ...a,
          status: 'cancelled',
          notificationHistory: [cancelNotification, ...a.notificationHistory],
        };
      })
    );
    showToast('已取消预约，档期已自动释放');
  };

  // Barber: Toggle slot availability between available & unavailable
  const toggleSlotAvailability = (stylistId: string, date: string, timeSlot: string) => {
    const slotInfo = getSlotInfo(stylistId, date, timeSlot);
    if (slotInfo.status === 'booked') {
      showToast('该时段已有顾客预约，请先取消该预约再关闭档期');
      return;
    }

    const key = `${stylistId}_${date}`;
    setSchedules((prev) => {
      const existing = prev[key] || {
        stylistId,
        date,
        slots: {},
      };

      const currentStatus = existing.slots[timeSlot] ?? 'available';
      const newStatus: 'available' | 'unavailable' =
        currentStatus === 'available' ? 'unavailable' : 'available';

      const updated: Record<string, StylistDaySchedule> = {
        ...prev,
        [key]: {
          ...existing,
          slots: {
            ...existing.slots,
            [timeSlot]: newStatus,
          },
        },
      };

      showToast(
        newStatus === 'available'
          ? `已将 ${timeSlot} 设为【有空·开放】`
          : `已将 ${timeSlot} 设为【休息·忙碌】`
      );
      return updated;
    });
  };

  // Barber: Batch set schedule
  const batchSetSchedule = (
    stylistId: string,
    date: string,
    action: 'all_open' | 'all_closed' | 'morning_only' | 'afternoon_only'
  ) => {
    const key = `${stylistId}_${date}`;
    setSchedules((prev) => {
      const existing = prev[key] || {
        stylistId,
        date,
        slots: {},
      };

      const newSlots: Record<string, 'available' | 'unavailable'> = { ...existing.slots };

      ALL_TIME_SLOTS.forEach((slot) => {
        const hour = parseInt(slot.split(':')[0], 10);
        if (action === 'all_open') {
          newSlots[slot] = 'available';
        } else if (action === 'all_closed') {
          newSlots[slot] = 'unavailable';
        } else if (action === 'morning_only') {
          newSlots[slot] = hour < 12 ? 'available' : 'unavailable';
        } else if (action === 'afternoon_only') {
          newSlots[slot] = hour >= 13 ? 'available' : 'unavailable';
        }
      });

      return {
        ...prev,
        [key]: {
          ...existing,
          slots: newSlots,
        },
      };
    });

    const labels = {
      all_open: '全天已设为开放有空',
      all_closed: '全天已设为休息勿扰',
      morning_only: '已设为仅上午有空',
      afternoon_only: '已设为仅下午有空',
    };
    showToast(labels[action]);
  };

  // Reset to default
  const resetAllData = () => {
    const freshSchedules = generateInitialSchedules();
    const freshAppointments = generateInitialAppointments();
    setSchedules(freshSchedules);
    setAppointments(freshAppointments);
    setLatestNotification(null);
    localStorage.removeItem(STORAGE_KEY_SCHEDULES);
    localStorage.removeItem(STORAGE_KEY_APPOINTMENTS);
    showToast('已重置为初始演示数据');
  };

  // All notifications flattened
  const allNotifications = useMemo(() => {
    const list: BookingNotification[] = [];
    appointments.forEach((a) => {
      if (a.notificationHistory && a.notificationHistory.length > 0) {
        list.push(...a.notificationHistory);
      }
    });
    return list.sort((a, b) => b.sentAt.localeCompare(a.sentAt));
  }, [appointments]);

  const value = useMemo(
    () => ({
      stylists,
      services,
      appointments,
      notifications: allNotifications,
      latestNotification,
      dismissNotification,
      schedules,
      activeTab,
      setActiveTab,
      displayMode,
      setDisplayMode,
      selectedStylistId,
      setSelectedStylistId,
      currentBarberId,
      setCurrentBarberId,
      selectedDate,
      setSelectedDate,
      getSlotInfo,
      getDaySlots,
      bookAppointment,
      cancelAppointment,
      toggleSlotAvailability,
      batchSetSchedule,
      resetAllData,
      toastMessage,
      showToast,
    }),
    [
      stylists,
      services,
      appointments,
      allNotifications,
      latestNotification,
      schedules,
      activeTab,
      displayMode,
      selectedStylistId,
      currentBarberId,
      selectedDate,
      toastMessage,
    ]
  );

  return <BarbershopContext.Provider value={value}>{children}</BarbershopContext.Provider>;
};

export const useBarbershop = () => {
  const context = useContext(BarbershopContext);
  if (!context) {
    throw new Error('useBarbershop must be used within BarbershopProvider');
  }
  return context;
};
