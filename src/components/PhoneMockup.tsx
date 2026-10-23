import React from 'react';
import { WeChatHeader } from './WeChatHeader';
import { WeChatTabBar } from './WeChatTabBar';
import { CustomerBookingView } from './CustomerBookingView';
import { StylistScheduleView } from './StylistScheduleView';
import { MyAppointmentsView } from './MyAppointmentsView';
import { WeChatNotificationBanner } from './WeChatNotificationBanner';
import { useBarbershop } from '../context/BarbershopContext';

export const PhoneMockup: React.FC = () => {
  const { activeTab } = useBarbershop();

  const getTitle = () => {
    switch (activeTab) {
      case 'customer_booking':
        return 'BT100 · 预约发型';
      case 'stylist_schedule':
        return '007 · 档期设置';
      case 'my_bookings':
        return 'BT100 · 预约记录';
      default:
        return 'BT100 理发预约';
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-[390px] h-[780px] bg-stone-900 rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.1)] flex flex-col select-none ring-1 ring-stone-800">
      {/* Dynamic Island / Notch */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-black rounded-full z-40 pointer-events-none flex items-center justify-end pr-2.5">
        <div className="w-2.5 h-2.5 rounded-full bg-stone-950 border border-stone-800" />
      </div>

      {/* Screen Container */}
      <div className="relative w-full h-full bg-stone-50 rounded-[38px] overflow-hidden flex flex-col border border-stone-800/40">
        {/* WeChat Navigation & Status */}
        <WeChatHeader title={getTitle()} />

        {/* WeChat Top Notification Banner Popup */}
        <div className="relative">
          <WeChatNotificationBanner />
        </div>

        {/* Dynamic Content View */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {activeTab === 'customer_booking' && <CustomerBookingView />}
          {activeTab === 'stylist_schedule' && <StylistScheduleView />}
          {activeTab === 'my_bookings' && <MyAppointmentsView />}
        </div>

        {/* WeChat Bottom TabBar */}
        <WeChatTabBar />

        {/* iPhone Home Indicator bar */}
        <div className="bg-white pb-1.5 pt-0.5 flex justify-center">
          <div className="w-32 h-1 bg-stone-300 rounded-full" />
        </div>
      </div>
    </div>
  );
};
