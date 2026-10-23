import React from 'react';
import { Scissors, CalendarClock, TicketCheck } from 'lucide-react';
import { useBarbershop } from '../context/BarbershopContext';
import { ActiveTab } from '../types';

export const WeChatTabBar: React.FC = () => {
  const { activeTab, setActiveTab, appointments } = useBarbershop();

  const activeAppointmentsCount = appointments.filter((a) => a.status === 'confirmed').length;

  const tabs: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    {
      id: 'customer_booking',
      label: '顾客预约',
      icon: Scissors,
    },
    {
      id: 'stylist_schedule',
      label: '理发师排班',
      icon: CalendarClock,
    },
    {
      id: 'my_bookings',
      label: '我的预约',
      icon: TicketCheck,
    },
  ];

  return (
    <nav
      aria-label="小程序底部导航"
      className="shrink-0 bg-white border-t border-stone-200 px-2 py-1.5 flex items-center justify-around z-20 select-none shadow-[0_-2px_10px_rgba(0,0,0,0.03)]"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex flex-col items-center justify-center py-1 px-3 min-w-[72px] min-h-[44px] transition-colors rounded-lg ${
              isActive ? 'text-amber-700' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.7]'}`} />
              {tab.id === 'my_bookings' && activeAppointmentsCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 font-mono">
                  {activeAppointmentsCount}
                </span>
              )}
            </div>
            <span
              className={`text-[11px] mt-1 tracking-tight ${
                isActive ? 'font-semibold text-amber-900' : 'font-medium'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
