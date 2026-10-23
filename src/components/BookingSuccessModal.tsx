import React from 'react';
import { CheckCircle2, Calendar, Clock, User, Scissors, MapPin, X, ArrowRight } from 'lucide-react';
import { Appointment } from '../types';

interface BookingSuccessModalProps {
  appointment: Appointment | null;
  onClose: () => void;
  onViewMyAppointments: () => void;
}

export const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
  appointment,
  onClose,
  onViewMyAppointments,
}) => {
  if (!appointment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-stone-100 flex flex-col">
        {/* Top Header */}
        <div className="bg-emerald-600 text-white px-6 pt-6 pb-5 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-100 hover:text-white p-1 rounded-full transition-colors"
            aria-label="关闭"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-lg font-bold">预约成功！已确认档期</h3>
          <p className="text-xs text-emerald-100 mt-1">理发师已收到您的预约排班</p>
        </div>

        {/* Ticket Content */}
        <div className="p-6 space-y-4 text-stone-700 text-xs">
          {/* Booking Code Banner */}
          <div className="bg-stone-50 border border-dashed border-stone-300 rounded-2xl p-3 text-center">
            <span className="text-[11px] text-stone-500">到店出示预约核销码</span>
            <div className="font-mono text-2xl font-bold tracking-widest text-stone-900 my-0.5">
              {appointment.bookingCode}
            </div>
            <span className="text-[10px] text-emerald-700 font-medium">状态：已锁定档期 (无需预付)</span>
          </div>

          {/* Details list */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500 flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-stone-400" />
                预约项目
              </span>
              <span className="font-semibold text-stone-900">{appointment.serviceName}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-stone-400" />
                指定发型师
              </span>
              <span className="font-semibold text-stone-900">{appointment.stylistName}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                预约日期
              </span>
              <span className="font-semibold text-stone-900">{appointment.date}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                预约时段
              </span>
              <span className="font-mono font-bold text-amber-700 text-sm">{appointment.timeSlot}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500">预约人</span>
              <span className="text-stone-800">
                {appointment.customerName} ({appointment.customerPhone})
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-stone-500">到店支付金额</span>
              <span className="text-base font-bold text-stone-900">¥{appointment.servicePrice}</span>
            </div>
          </div>

          {/* Store Location & Notification Status */}
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-2.5 flex items-start gap-2 text-emerald-800 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">微信服务通知已推送</span>
              <span className="text-[10px] text-emerald-700">界面上方已弹窗提醒，并已同步归档到您的预约记录中。</span>
            </div>
          </div>

          <div className="bg-stone-50 rounded-xl p-2.5 flex items-start gap-2 text-stone-500 text-[11px]">
            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
            <span>三里屯北路88号艺术街区A座102 · 请提前5-10分钟到店</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-white border border-stone-200 rounded-xl transition-colors text-center"
          >
            继续浏览
          </button>
          <button
            onClick={() => {
              onClose();
              onViewMyAppointments();
            }}
            className="flex-1 py-2.5 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-xl transition-colors text-center flex items-center justify-center gap-1"
          >
            <span>查看我的预约</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
