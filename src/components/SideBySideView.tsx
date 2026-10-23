import React from 'react';
import { WeChatHeader } from './WeChatHeader';
import { CustomerBookingView } from './CustomerBookingView';
import { StylistScheduleView } from './StylistScheduleView';
import { WeChatNotificationBanner } from './WeChatNotificationBanner';
import { RefreshCw, ArrowLeftRight, CheckCircle2, Sparkles, Scissors, CalendarClock } from 'lucide-react';
import { useBarbershop } from '../context/BarbershopContext';

export const SideBySideView: React.FC = () => {
  const { currentBarberId, selectedStylistId, selectedDate, stylists } = useBarbershop();

  const barber = stylists.find((s) => s.id === currentBarberId) || stylists[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 space-y-4">
      {/* Real-time sync instruction header */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white rounded-2xl p-4 shadow-sm border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-sm font-bold tracking-tight text-white">
              双端同屏实时联动演示模式 (Dual-Screen Interactive Demo)
            </h2>
          </div>
          <p className="text-xs text-stone-300">
            左侧模拟【顾客微信小程序】，右侧模拟【发型师档期设置工作台】。在右侧点击设置“没空/有空”，左侧客户预约时段即时互斥联动！
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs bg-stone-800/80 px-3 py-2 rounded-xl border border-stone-700">
          <div className="flex items-center gap-1.5 text-stone-300">
            <span className="text-stone-400">当前联动日期:</span>
            <span className="font-mono font-bold text-amber-300">{selectedDate}</span>
          </div>
          <span className="text-stone-600">|</span>
          <div className="flex items-center gap-1.5 text-stone-300">
            <span className="text-stone-400">工作理发师:</span>
            <span className="font-bold text-white">{barber.name}</span>
          </div>
        </div>
      </div>

      {/* Two Columns Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Customer Booking Mini-Program View */}
        <div className="bg-stone-900 rounded-[36px] p-2.5 shadow-xl border border-stone-800 flex flex-col h-[750px] overflow-hidden">
          {/* Label Bar */}
          <div className="bg-stone-800/90 text-stone-200 text-xs px-4 py-1.5 flex items-center justify-between border-b border-stone-700/60 rounded-t-[26px]">
            <span className="font-bold flex items-center gap-1.5 text-amber-400">
              <Scissors className="w-3.5 h-3.5" />
              1. 客户预约微信小程序 (移动端)
            </span>
            <span className="text-[10px] text-stone-400">顾客视角</span>
          </div>

          <div className="relative flex-1 bg-stone-50 rounded-b-[26px] overflow-hidden flex flex-col">
            <WeChatHeader title="简剪 · 顾客预约" />
            <div className="relative">
              <WeChatNotificationBanner />
            </div>
            <CustomerBookingView />
          </div>
        </div>

        {/* Right Column: Stylist Schedule Workspace View */}
        <div className="bg-stone-900 rounded-[36px] p-2.5 shadow-xl border border-stone-800 flex flex-col h-[750px] overflow-hidden">
          {/* Label Bar */}
          <div className="bg-stone-800/90 text-stone-200 text-xs px-4 py-1.5 flex items-center justify-between border-b border-stone-700/60 rounded-t-[26px]">
            <span className="font-bold flex items-center gap-1.5 text-emerald-400">
              <CalendarClock className="w-3.5 h-3.5" />
              2. 理发师档期设置工作台 (管理端)
            </span>
            <span className="text-[10px] text-stone-400">发型师视角</span>
          </div>

          <div className="relative flex-1 bg-stone-50 rounded-b-[26px] overflow-hidden flex flex-col">
            <WeChatHeader title="理发师 · 档期排班" />
            <StylistScheduleView />
          </div>
        </div>
      </div>
    </div>
  );
};
