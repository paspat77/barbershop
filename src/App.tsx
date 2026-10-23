import React from 'react';
import { BarbershopProvider, useBarbershop } from './context/BarbershopContext';
import { PhoneMockup } from './components/PhoneMockup';
import { SideBySideView } from './components/SideBySideView';
import { CustomerBookingView } from './components/CustomerBookingView';
import { StylistScheduleView } from './components/StylistScheduleView';
import { MyAppointmentsView } from './components/MyAppointmentsView';
import { WeChatTabBar } from './components/WeChatTabBar';
import { WeChatHeader } from './components/WeChatHeader';
import { WeChatNotificationBanner } from './components/WeChatNotificationBanner';
import {
  Smartphone,
  Columns2,
  Maximize2,
  RotateCcw,
  Scissors,
  CalendarClock,
  Sparkles,
  CheckCircle2,
  Download,
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { displayMode, setDisplayMode, toastMessage, resetAllData, activeTab, setActiveTab } =
    useBarbershop();

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col text-stone-900 font-sans">
      {/* 🚀 PROMINENT ZERO-SEARCH DOWNLOAD BANNER */}
      <div className="bg-emerald-700 text-white px-4 py-2.5 shadow-md border-b border-emerald-800 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-white/20 rounded-md font-bold text-xs">📦 代码导出</span>
            <span className="font-semibold text-white">微信小程序原生工程已打包完毕（支持微信云开发）：</span>
            <span className="text-emerald-100 hidden md:inline">包含全部排班、预约、通知页面与配置文件</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <a
              href="/barbershop-wechat-miniprogram.zip"
              download="barbershop-wechat-miniprogram.zip"
              className="bg-white text-emerald-800 hover:bg-emerald-50 px-4 py-1.5 rounded-lg font-bold text-xs shadow-sm flex items-center gap-1.5 transition-transform active:scale-95 whitespace-nowrap"
            >
              <Download className="w-4 h-4 text-emerald-700" />
              <span>👉 点击此处直接下载 (ZIP)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Top Bar Navigation (Following Top Bar Contract: 3 Zones) */}
      <header className="bg-white border-b border-stone-200/90 sticky top-0 z-40 px-4 md:px-8 py-3 select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-amber-800 text-white flex items-center justify-center shadow-xs">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-stone-900 whitespace-nowrap block">
                简剪 · 理发预约小程序
              </span>
              <span className="text-[10px] text-stone-500 hidden sm:block">
                客户时段预约 & 理发师有空/没空自主设定
              </span>
            </div>
          </div>

          {/* Zone 2: View Mode Switcher Tabs */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setDisplayMode('mobile_mockup')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                displayMode === 'mobile_mockup'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>微信真机模拟</span>
            </button>

            <button
              onClick={() => setDisplayMode('side_by_side')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                displayMode === 'side_by_side'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Columns2 className="w-3.5 h-3.5 text-amber-700" />
              <span>双端实时联动演示</span>
            </button>

            <button
              onClick={() => setDisplayMode('fullscreen')}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                displayMode === 'fullscreen'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>宽屏模式</span>
            </button>
          </div>

          {/* Zone 3: Export & Quick Reset Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/barbershop-wechat-miniprogram.zip"
              download="barbershop-wechat-miniprogram.zip"
              title="下载微信小程序原生工程源码包 (.ZIP)"
              className="text-xs text-white bg-emerald-700 hover:bg-emerald-800 py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>下载小程序源码 (.ZIP)</span>
            </a>

            <button
              onClick={resetAllData}
              title="重置初始排班与预约测试数据"
              className="text-xs text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">重置演示数据</span>
            </button>
          </div>
        </div>
      </header>

      {/* Feature Demonstration Banner */}
      <div className="bg-amber-900/90 text-amber-50 px-4 py-2 border-b border-amber-800 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-amber-200">✅ 核心功能已就绪：</span>
            <span className="text-amber-100">1. 顾客选时段预约</span>
            <span className="text-amber-400">·</span>
            <span className="text-amber-100">2. 理发师设置有空/没空</span>
            <span className="text-amber-400">·</span>
            <span className="text-emerald-300 font-semibold">3. 预约成功顶部通知弹窗并存入预约记录</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-amber-300">快速体验：</span>
            <button
              onClick={() => {
                setDisplayMode('mobile_mockup');
                setActiveTab('customer_booking');
              }}
              className="underline hover:text-white"
            >
              预约发型
            </button>
            <span>/</span>
            <button
              onClick={() => {
                setDisplayMode('mobile_mockup');
                setActiveTab('stylist_schedule');
              }}
              className="underline hover:text-white"
            >
              理发师排班
            </button>
            <span>/</span>
            <button
              onClick={() => {
                setDisplayMode('mobile_mockup');
                setActiveTab('my_bookings');
              }}
              className="underline hover:text-white text-emerald-300"
            >
              查看消息与预约记录
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 md:p-6 overflow-x-hidden">
        {displayMode === 'mobile_mockup' && (
          <div className="w-full flex justify-center py-2 animate-in fade-in duration-200">
            <PhoneMockup />
          </div>
        )}

        {displayMode === 'side_by_side' && (
          <div className="w-full animate-in fade-in duration-200">
            <SideBySideView />
          </div>
        )}

        {displayMode === 'fullscreen' && (
          <div className="w-full max-w-4xl bg-white rounded-3xl border border-stone-200 shadow-md overflow-hidden flex flex-col h-[820px] animate-in fade-in duration-200">
            <WeChatHeader title="简剪理发预约" />
            <div className="relative">
              <WeChatNotificationBanner />
            </div>
            <div className="flex-1 flex flex-col overflow-hidden relative">
              {activeTab === 'customer_booking' && <CustomerBookingView />}
              {activeTab === 'stylist_schedule' && <StylistScheduleView />}
              {activeTab === 'my_bookings' && <MyAppointmentsView />}
            </div>
            <WeChatTabBar />
          </div>
        )}
      </main>

      {/* Fixed Floating Download Button at bottom-right */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href="/barbershop-wechat-miniprogram.zip"
          download="barbershop-wechat-miniprogram.zip"
          className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-full shadow-xl flex items-center gap-2 text-xs font-bold border-2 border-white ring-2 ring-emerald-500/40 hover:scale-105 active:scale-95 transition-all"
        >
          <Download className="w-4 h-4 animate-bounce" />
          <span>下载小程序代码包 (.zip)</span>
        </a>
      </div>

      {/* WeChat Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 bg-stone-900/90 text-white text-xs px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2 border border-stone-700 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium tracking-tight">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <BarbershopProvider>
      <MainAppContent />
    </BarbershopProvider>
  );
}
