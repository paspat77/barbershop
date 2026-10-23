import { Stylist, ServiceItem, Appointment, StylistDaySchedule } from '../types';

export const ALL_TIME_SLOTS = [
  '09:00',
  '10:00',
  '11:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
];

// 按照用户需求：仅保留1位理发师，名称007，发龄20年，留言：never joke about my work, 007
export const INITIAL_STYLISTS: Stylist[] = [
  {
    id: 'stylist_007',
    name: '007',
    title: '特工发艺主理人 · 造型宗师',
    avatar: '/src/assets/images/barber_007_1792743580725.jpg',
    experienceYears: 20,
    rating: 5.0,
    completedOrders: 3680,
    bio: 'never joke about my work, 007',
    tags: ['精准利落', '精雕细琢', '特工美学'],
  },
];

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv_cut_standard',
    name: '总监设计洗剪吹',
    category: '剪发',
    durationMinutes: 45,
    price: 68,
    description: '包含舒缓头皮深层洗发、根据面型三维轮廓定制精修剪发及吹风造型。',
  },
  {
    id: 'srv_cut_shave',
    name: '美式精修剪发 + 复古热敷刮面',
    category: '修面',
    durationMinutes: 60,
    price: 118,
    description: '匠人剪发、发际线精雕、老式热毛巾敷脸软化与剃须刀净颜护理。',
  },
  {
    id: 'srv_perm_texture',
    name: '日系自然纹理烫 / 气垫烫',
    category: '烫染',
    durationMinutes: 90,
    price: 288,
    description: '进口弱酸性护发药水，增加发根蓬松度与空气感，易于日常打理。',
  },
  {
    id: 'srv_spa_scalp',
    name: '日本原装头皮水疗深层焕活',
    category: '护理',
    durationMinutes: 45,
    price: 158,
    description: '微气泡碳酸清洁、草本植物精粹赋活毛囊、肩颈经络指压放松。',
  },
  {
    id: 'srv_color_custom',
    name: '高级质感微潮色染发',
    category: '烫染',
    durationMinutes: 100,
    price: 368,
    description: '植物温和配方染膏，显白肤色定制调配，附赠染后锁色滋养护理。',
  },
];

// Helper to format Date to YYYY-MM-DD
export function formatDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Generate the upcoming 7 days with safe midnight alignment
export function getUpcomingDays(count: number = 7) {
  const days = [];
  const weekDayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const now = new Date();
  const baseYear = now.getFullYear();
  const baseMonth = now.getMonth();
  const baseDate = now.getDate();

  for (let i = 0; i < count; i++) {
    // 使用纯年月日构造，消除夏令时与夜间跨时区时间抖动
    const target = new Date(baseYear, baseMonth, baseDate + i);
    const dateStr = formatDate(target);
    const dayOfWeek = weekDayNames[target.getDay()];
    let relativeLabel = '';
    if (i === 0) relativeLabel = '今天';
    else if (i === 1) relativeLabel = '明天';
    else if (i === 2) relativeLabel = '后天';
    else relativeLabel = dayOfWeek;

    days.push({
      dateStr,
      dayNumber: target.getDate(),
      month: target.getMonth() + 1,
      dayOfWeek,
      relativeLabel,
      fullText: `${target.getMonth() + 1}月${target.getDate()}日 (${dayOfWeek})`,
    });
  }
  return days;
}

// Generate initial demo schedule for 007
export function generateInitialSchedules(): Record<string, StylistDaySchedule> {
  const days = getUpcomingDays(7);
  const schedules: Record<string, StylistDaySchedule> = {};

  INITIAL_STYLISTS.forEach((stylist) => {
    days.forEach((day, dayIndex) => {
      const key = `${stylist.id}_${day.dateStr}`;
      const slots: Record<string, 'available' | 'unavailable'> = {};

      ALL_TIME_SLOTS.forEach((slot) => {
        // 默认开放预约
        slots[slot] = 'available';

        // 007 午休时段 13:00 设为休息；晚间20:00隔天设为休息
        if (slot === '13:00') slots[slot] = 'unavailable';
        if (slot === '20:00' && dayIndex % 2 === 1) slots[slot] = 'unavailable';
      });

      schedules[key] = {
        stylistId: stylist.id,
        date: day.dateStr,
        slots,
      };
    });
  });

  return schedules;
}

// Generate sample initial appointments for 007
export function generateInitialAppointments(): Appointment[] {
  const now = new Date();
  const todayStr = formatDate(now);
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const tomorrowStr = formatDate(tomorrow);

  return [
    {
      id: 'apt_1001',
      bookingCode: 'B8007',
      customerName: '邦德先生',
      customerPhone: '138****0077',
      stylistId: 'stylist_007',
      stylistName: '007',
      serviceId: 'srv_cut_standard',
      serviceName: '总监设计洗剪吹',
      servicePrice: 68,
      serviceDuration: 45,
      date: todayStr,
      timeSlot: '11:00',
      status: 'confirmed',
      notes: '保持极致干练，配合经典西装领口轮廓',
      createdAt: `${todayStr} 09:30`,
      notificationHistory: [
        {
          id: 'notif_1001',
          appointmentId: 'apt_1001',
          bookingCode: 'B8007',
          type: 'booking_success',
          title: '服务预约成功通知',
          summary: '您已成功预约【简剪 · 007发艺】服务',
          stylistName: '007',
          serviceName: '总监设计洗剪吹',
          appointmentDateTime: `${todayStr} 11:00`,
          bookingCodeText: 'B8007',
          customerName: '邦德先生',
          customerPhone: '138****0077',
          storeName: '简剪 · 007发艺工作室 (三里屯店)',
          storeAddress: '三里屯艺术街区A座102',
          warmPrompt: '请凭核销码准时到店，档期将为您保留15分钟。',
          sentAt: `${todayStr} 09:30`,
          read: true,
        },
      ],
    },
    {
      id: 'apt_1002',
      bookingCode: 'B8009',
      customerName: '林小姐',
      customerPhone: '139****0079',
      stylistId: 'stylist_007',
      stylistName: '007',
      serviceId: 'srv_cut_shave',
      serviceName: '美式精修剪发 + 复古热敷刮面',
      servicePrice: 118,
      serviceDuration: 60,
      date: tomorrowStr,
      timeSlot: '15:00',
      status: 'confirmed',
      notes: '体验20年发龄精修刀工',
      createdAt: `${todayStr} 10:15`,
      notificationHistory: [
        {
          id: 'notif_1002',
          appointmentId: 'apt_1002',
          bookingCode: 'B8009',
          type: 'booking_success',
          title: '服务预约成功通知',
          summary: '您已成功预约【简剪 · 007发艺】服务',
          stylistName: '007',
          serviceName: '美式精修剪发 + 复古热敷刮面',
          appointmentDateTime: `${tomorrowStr} 15:00`,
          bookingCodeText: 'B8009',
          customerName: '林小姐',
          customerPhone: '139****0079',
          storeName: '简剪 · 007发艺工作室 (三里屯店)',
          storeAddress: '三里屯艺术街区A座102',
          warmPrompt: '请凭核销码准时到店，档期将为您保留15分钟。',
          sentAt: `${todayStr} 10:15`,
          read: true,
        },
      ],
    },
  ];
}
