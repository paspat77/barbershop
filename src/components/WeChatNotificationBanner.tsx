import React, { useEffect } from 'react';
import { Bell, CheckCircle2, ChevronRight, X, Clock, Scissors, User, MapPin } from 'lucide-react';
import { useBarbershop } from '../context/BarbershopContext';

export const WeChatNotificationBanner: React.FC = () => {
  const { latestNotification, dismissNotification, setActiveTab } = useBarbershop();

  useEffect(() => {
    if (!latestNotification) return;

    // Auto dismiss after 8 seconds
    const timer = setTimeout(() => {
      dismissNotification();
    }, 8000);

    return () => clearTimeout(timer);
  }, [latestNotification, dismissNotification]);

  if (!latestNotification) return null;

  const handleClickBanner = () => {
    dismissNotification();
    setActiveTab('my_bookings');
  };

  return (
    <div className="absolute top-2 left-2 right-2 z-50 pointer-events-auto select-none animate-in slide-in-from-top-4 fade-in duration-300">
      <div
        onClick={handleClickBanner}
        role="button"
        tabIndex={0}
        className="w-full bg-stone-900/95 hover:bg-stone-900 text-white rounded-2xl p-3 shadow-2xl border border-stone-700/80 backdrop-blur-md cursor-pointer transition-all active:scale-[0.99] group ring-1 ring-emerald-500/30"
      >
        {/* Banner Top Bar */}
        <div className="flex items-center justify-between pb-1.5 border-b border-stone-800 text-[11px] text-stone-400">
          <div className="flex items-center gap-1.5">
            {/* WeChat Green Mini Icon */}
            <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white">
              <CheckCircle2 className="w-3 h-3 stroke-[3]" />
            </div>
            <span className="font-semibold text-emerald-400">微信服务通知</span>
            <span>·</span>
            <span className="font-mono text-[10px] text-stone-400">{latestNotification.sentAt.slice(-5)}</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[10px] text-stone-400 group-hover:text-stone-200 transition-colors">
              点击查看记录
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                dismissNotification();
              }}
              className="p-1 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors ml-1"
              aria-label="关闭通知弹窗"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Banner Main Content */}
        <div className="pt-2 space-y-1.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
              <span>{latestNotification.title}</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700/60 px-1.5 py-0.2 rounded font-medium">
                已确认
              </span>
            </h4>
            <span className="font-mono text-xs font-bold text-amber-300">
              #{latestNotification.bookingCodeText}
            </span>
          </div>

          <p className="text-[11px] text-stone-300 line-clamp-1">
            {latestNotification.summary}
          </p>

          {/* Quick Info Grid */}
          <div className="bg-stone-800/90 rounded-xl p-2 grid grid-cols-2 gap-2 text-[11px] text-stone-300 border border-stone-700/50 mt-1">
            <div className="flex items-center gap-1.5 truncate">
              <Scissors className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="truncate">{latestNotification.serviceName}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <User className="w-3 h-3 text-stone-400 shrink-0" />
              <span className="truncate">{latestNotification.stylistName}</span>
            </div>
            <div className="flex items-center gap-1.5 col-span-2 truncate font-mono text-emerald-400">
              <Clock className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>预约时间：{latestNotification.appointmentDateTime}</span>
            </div>
          </div>

          {/* Footer prompt */}
          <div className="flex items-center justify-between text-[10px] text-stone-400 pt-0.5">
            <span className="truncate">{latestNotification.warmPrompt}</span>
            <div className="flex items-center text-amber-300 font-medium shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform">
              <span>查看预约</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
