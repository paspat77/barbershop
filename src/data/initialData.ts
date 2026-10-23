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

export const INITIAL_STYLISTS: Stylist[] = [
  {
    id: 'stylist_tony',
    name: 'Tony 老师',
    title: '首席发型总监',
    avatar: '/src/assets/images/barber_tony_1792723619612.jpg',
    experienceYears: 9,
    rating: 4.9,
    completedOrders: 1420,
    bio: '擅长日系轻盈男发、法式芭比烫、头骨立体修容剪裁，耐心沟通发型细节。',
    tags: ['立体雕刻', '自然纹理', '日系短发'],
  },
  {
    id: 'stylist_lily',
    name: 'Lily 设计师',
    title: '资深美发设计师',
    avatar: '/src/assets/images/barber_lily_1792723620315.jpg',
    experienceYears: 7,
    rating: 4.95,
    completedOrders: 1180,
    bio: '专注女性气质短发、轻奢法式卷、高质感冷茶色与头皮水疗养护，注重发质健康。',
    tags: ['锁骨微卷', '质感染发', '减龄刘海'],
  },
  {
    id: 'stylist_ming',
    name: '阿铭 匠师',
    title: '美式复古理容主理人',
    avatar: '/src/assets/images/barber_ming_1792723620359.jpg',
    experienceYears: 14,
    rating: 5.0,
    completedOrders: 2360,
    bio: '十四年传统理发匠心，精通美式渐变油头、热敷修面、胡须雕刻及男士硬派造型。',
    tags: ['美式渐变Fade', '热毛巾修面', '硬核复古'],
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

// Generate the upcoming 7 days
export function getUpcomingDays(count: number = 7) {
  const days = [];
  const weekDayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const target = new Date();
    target.setDate(today.getDate() + i);
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

// Generate initial demo schedule
export function generateInitialSchedules(): Record<string, StylistDaySchedule> {
  const days = getUpcomingDays(7);
  const schedules: Record<string, StylistDaySchedule> = {};

  INITIAL_STYLISTS.forEach((stylist) => {
    days.forEach((day, dayIndex) => {
      const key = `${stylist.id}_${day.dateStr}`;
      const slots: Record<string, 'available' | 'unavailable'> = {};

      ALL_TIME_SLOTS.forEach((slot) => {
        // By default open
        slots[slot] = 'available';

        // Tony has lunch break at 13:00 and off at 20:00
        if (stylist.id === 'stylist_tony') {
          if (slot === '13:00') slots[slot] = 'unavailable';
          if (slot === '20:00' && dayIndex % 2 === 1) slots[slot] = 'unavailable';
        }

        // Lily has morning off on day 2, or breaks at 14:00
        if (stylist.id === 'stylist_lily') {
          if (slot === '09:00') slots[slot] = 'unavailable';
          if (slot === '14:00' && dayIndex === 0) slots[slot] = 'unavailable';
        }

        // Ming takes evening off on day 1
        if (stylist.id === 'stylist_ming') {
          if (slot === '19:00' || slot === '20:00') {
            if (dayIndex === 1) slots[slot] = 'unavailable';
          }
        }
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

// Generate sample initial appointments
export function generateInitialAppointments(): Appointment[] {
  const todayStr = formatDate(new Date());
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = formatDate(tomorrow);

  return [
    {
      id: 'apt_1001',
      bookingCode: 'B8291',
      customerName: '张先生',
      customerPhone: '138****6672',
      stylistId: 'stylist_tony',
      stylistName: 'Tony 老师',
      serviceId: 'srv_cut_standard',
      serviceName: '总监设计洗剪吹',
      servicePrice: 68,
      serviceDuration: 45,
      date: todayStr,
      timeSlot: '11:00',
      status: 'confirmed',
      notes: '需要保留鬓角，稍微修薄顶部',
      createdAt: '2026-10-22 14:20',
      notificationHistory: [
        {
          id: 'notif_1001',
          appointmentId: 'apt_1001',
          bookingCode: 'B8291',
          type: 'booking_success',
          title: '服务预约成功通知',
          summary: '您已成功预约【简剪 · 匠心发艺】服务',
          stylistName: 'Tony 老师',
          serviceName: '总监设计洗剪吹',
          appointmentDateTime: `${todayStr} 11:00`,
          bookingCodeText: 'B8291',
          customerName: '张先生',
          customerPhone: '138****6672',
          storeName: '简剪 · 匠心发艺 (三里屯店)',
          storeAddress: '三里屯艺术街区A座102',
          warmPrompt: '请凭核销码准时到店，档期将为您保留15分钟。',
          sentAt: '2026-10-22 14:20',
          read: true,
        },
      ],
    },
    {
      id: 'apt_1002',
      bookingCode: 'B8304',
      customerName: '林女士',
      customerPhone: '139****5821',
      stylistId: 'stylist_lily',
      stylistName: 'Lily 设计师',
      serviceId: 'srv_perm_texture',
      serviceName: '日系自然纹理烫 / 气垫烫',
      servicePrice: 288,
      serviceDuration: 90,
      date: todayStr,
      timeSlot: '15:00',
      status: 'confirmed',
      notes: '首次来店，之前漂过头发',
      createdAt: '2026-10-22 16:05',
      notificationHistory: [
        {
          id: 'notif_1002',
          appointmentId: 'apt_1002',
          bookingCode: 'B8304',
          type: 'booking_success',
          title: '服务预约成功通知',
          summary: '您已成功预约【简剪 · 匠心发艺】服务',
          stylistName: 'Lily 设计师',
          serviceName: '日系自然纹理烫 / 气垫烫',
          appointmentDateTime: `${todayStr} 15:00`,
          bookingCodeText: 'B8304',
          customerName: '林女士',
          customerPhone: '139****5821',
          storeName: '简剪 · 匠心发艺 (三里屯店)',
          storeAddress: '三里屯艺术街区A座102',
          warmPrompt: '请凭核销码准时到店，档期将为您保留15分钟。',
          sentAt: '2026-10-22 16:05',
          read: true,
        },
      ],
    },
    {
      id: 'apt_1003',
      bookingCode: 'B8312',
      customerName: '王先生',
      customerPhone: '186****9910',
      stylistId: 'stylist_ming',
      stylistName: '阿铭 匠师',
      serviceId: 'srv_cut_shave',
      serviceName: '美式精修剪发 + 复古热敷刮面',
      servicePrice: 118,
      serviceDuration: 60,
      date: tomorrowStr,
      timeSlot: '16:00',
      status: 'confirmed',
      notes: '老顾客，常规渐变推边',
      createdAt: '2026-10-22 18:30',
      notificationHistory: [
        {
          id: 'notif_1003',
          appointmentId: 'apt_1003',
          bookingCode: 'B8312',
          type: 'booking_success',
          title: '服务预约成功通知',
          summary: '您已成功预约【简剪 · 匠心发艺】服务',
          stylistName: '阿铭 匠师',
          serviceName: '美式精修剪发 + 复古热敷刮面',
          appointmentDateTime: `${tomorrowStr} 16:00`,
          bookingCodeText: 'B8312',
          customerName: '王先生',
          customerPhone: '186****9910',
          storeName: '简剪 · 匠心发艺 (三里屯店)',
          storeAddress: '三里屯艺术街区A座102',
          warmPrompt: '请凭核销码准时到店，档期将为您保留15分钟。',
          sentAt: '2026-10-22 18:30',
          read: true,
        },
      ],
    },
  ];
}
