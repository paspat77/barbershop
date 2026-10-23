import React, { useState } from 'react';
import { Wifi, Battery, RotateCcw, HelpCircle, X, CheckCircle2 } from 'lucide-react';
import { useBarbershop } from '../context/BarbershopContext';

interface WeChatHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const WeChatHeader: React.FC<WeChatHeaderProps> = ({ title = 'BT100 · 理发预约' }) => {
  const { resetAllData, activeTab, setActiveTab } = useBarbershop();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative z-30 select-none bg-stone-900 text-stone-100">
      {/* Phone Status Bar (Battery, Time, WiFi) */}
      <div className="flex items-center justify-between px-6 pt-3 pb-1 text-xs font-medium text-stone-300">
        <span className="font-mono text-xs font-semibold tracking-tight">09:41</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] tracking-tight">5G</span>
          <Wifi className="w-3.5 h-3.5" />
          <Battery className="w-4 h-4" />
        </div>
      </div>

      {/* Mini Program Navigation Bar with WeChat Capsule */}
      <div className="relative flex items-center justify-between px-4 py-2.5">
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold tracking-tight text-white">{title}</span>
          <span className="text-[10px] text-stone-400 font-mono">小程序</span>
        </div>

        {/* Right: WeChat Capsule Button (··· ⊚) */}
        <div className="relative">
          <div className="flex items-center bg-stone-800/90 border border-stone-700/80 rounded-full py-1 px-2.5 gap-2 shadow-inner">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-stone-300 hover:text-white transition-colors flex items-center justify-center p-0.5 active:scale-95"
              title="小程序更多操作"
              aria-label="小程序选项"
            >
              <span className="text-sm tracking-widest font-bold leading-none">···</span>
            </button>
            <div className="w-[1px] h-3 bg-stone-700" />
            <button
              onClick={() => {
                // Toggle back to booking home
                setActiveTab('customer_booking');
              }}
              className="text-stone-300 hover:text-white transition-colors flex items-center justify-center p-0.5 active:scale-95"
              title="回到小程序首页"
              aria-label="关闭或回主页"
            >
              <div className="w-3.5 h-3.5 rounded-full border-[1.5px] border-current flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-current" />
              </div>
            </button>
          </div>

          {/* Capsule dropdown menu */}
          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-10 w-48 bg-stone-900 border border-stone-700 rounded-xl shadow-2xl py-1 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-stone-800">
                  <p className="font-medium text-stone-200">BT100 理发预约</p>
                  <p className="text-[11px] text-stone-400">深圳市宝安区壆岗大道围浅楼37号</p>
                </div>

                <button
                  onClick={() => {
                    setActiveTab(activeTab === 'stylist_schedule' ? 'customer_booking' : 'stylist_schedule');
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-2.5 hover:bg-stone-800 flex items-center justify-between text-stone-200"
                >
                  <span>切换至{activeTab === 'stylist_schedule' ? '客户预约端' : '理发师排班端'}</span>
                </button>

                <button
                  onClick={() => {
                    resetAllData();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-2.5 hover:bg-stone-800 flex items-center gap-2 text-amber-300"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>重置演示排班数据</span>
                </button>

                <button
                  onClick={() => {
                    alert('功能特点：\n1. 客户可自由选择发型师、服务项目及有空时段预约。\n2. 理发师可随时自主设置各时间段有空/没空（休息）。\n3. 预约与排班实时互斥同步！');
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-2.5 hover:bg-stone-800 flex items-center gap-2 text-stone-300 border-t border-stone-800"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>使用指南与说明</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
