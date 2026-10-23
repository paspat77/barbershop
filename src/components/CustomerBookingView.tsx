import React, { useState } from 'react';
import {
  Scissors,
  Clock,
  Sparkles,
  Star,
  MapPin,
  ChevronRight,
  CalendarDays,
  User,
  Phone,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useBarbershop } from '../context/BarbershopContext';
import { getUpcomingDays } from '../data/initialData';
import { BookingSuccessModal } from './BookingSuccessModal';
import { Appointment } from '../types';

export const CustomerBookingView: React.FC = () => {
  const {
    stylists,
    services,
    selectedStylistId,
    setSelectedStylistId,
    selectedDate,
    setSelectedDate,
    getDaySlots,
    bookAppointment,
    setActiveTab,
  } = useBarbershop();

  const days = getUpcomingDays(7);
  const currentStylist = stylists.find((s) => s.id === selectedStylistId) || stylists[0];

  // Selected state
  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0].id);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Booking drawer / form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Success modal
  const [latestAppointment, setLatestAppointment] = useState<Appointment | null>(null);

  // Time slots for current date & stylist
  const daySlots = getDaySlots(selectedStylistId, selectedDate);

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];

  // Quick fill preset info for demo convenience
  const handleQuickFill = () => {
    setCustomerName('陈默');
    setCustomerPhone('13912345678');
    setCustomerNotes('希望稍微打薄头顶，平时戴眼镜，两侧干净清爽即可');
  };

  const handleSelectSlot = (time: string, status: string) => {
    if (status !== 'available') return;
    setSelectedSlot(time);
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setFormError('请填写预约人姓名');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 7) {
      setFormError('请填写有效的联系手机号');
      return;
    }
    if (!selectedSlot) {
      setFormError('请选择预约时间段');
      return;
    }

    const result = bookAppointment({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      stylistId: selectedStylistId,
      serviceId: selectedServiceId,
      date: selectedDate,
      timeSlot: selectedSlot,
      notes: customerNotes.trim(),
    });

    if (result.success && result.appointment) {
      setIsFormOpen(false);
      setSelectedSlot(null);
      setLatestAppointment(result.appointment);
    } else {
      setFormError(result.error || '预约失败，请重试');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-stone-50 pb-20">
      {/* Salon Top Hero Banner */}
      <div className="relative bg-stone-900 text-white">
        <div className="h-32 w-full overflow-hidden relative">
          <img
            src="/src/assets/images/barbershop_interior_1792723619362.jpg"
            alt="简剪沙龙环境"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
        </div>
        <div className="px-4 pb-3 -mt-10 relative z-10">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-amber-300">
                Studio & Grooming
              </span>
              <h1 className="text-xl font-bold tracking-tight text-white mt-0.5">简剪 · 匠心发艺</h1>
              <p className="text-[11px] text-stone-300 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                <span>三里屯艺术街区A座102</span>
                <span>·</span>
                <span className="text-amber-300 flex items-center gap-0.5 font-medium">
                  <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                  4.9分
                </span>
              </p>
            </div>
            <button
              onClick={() => setActiveTab('stylist_schedule')}
              className="text-[11px] bg-white/10 hover:bg-white/20 text-stone-200 border border-white/20 rounded-full px-3 py-1 flex items-center gap-1 transition-colors"
            >
              <span>理发师排班端</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-3.5 space-y-4">
        {/* Section 1: Select Stylist */}
        <section className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-amber-700 rounded-full" />
              <h2 className="text-sm font-bold text-stone-900">1. 选择发型师</h2>
            </div>
            <span className="text-[11px] text-stone-500">点击切换理发师与档期</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {stylists.map((stylist) => {
              const isSelected = stylist.id === selectedStylistId;
              return (
                <button
                  key={stylist.id}
                  onClick={() => {
                    setSelectedStylistId(stylist.id);
                    setSelectedSlot(null);
                  }}
                  className={`text-left p-2 rounded-xl transition-all border relative flex flex-col items-center ${
                    isSelected
                      ? 'border-amber-700 bg-amber-50/50 shadow-xs ring-1 ring-amber-700'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="relative mb-1.5">
                    <img
                      src={stylist.avatar}
                      alt={stylist.name}
                      referrerPolicy="no-referrer"
                      className="w-13 h-13 rounded-full object-cover border-2 border-white shadow-xs"
                    />
                    {isSelected && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-700 rounded-full flex items-center justify-center text-white">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-bold text-stone-900 truncate w-full text-center">
                    {stylist.name}
                  </span>
                  <span className="text-[10px] text-amber-800 font-medium truncate w-full text-center">
                    {stylist.title}
                  </span>
                  <span className="text-[10px] text-stone-600 mt-0.5 font-mono">
                    {stylist.experienceYears}年发龄
                  </span>
                </button>
              );
            })}
          </div>

          {/* Current Stylist Intro */}
          <div className="mt-3 pt-3 border-t border-stone-100 flex items-center gap-2 text-[11px] text-stone-600">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <p className="line-clamp-1">
              <span className="font-semibold text-stone-800">{currentStylist.name}</span>: {currentStylist.bio}
            </p>
          </div>
        </section>

        {/* Section 2: Select Date */}
        <section className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-amber-700 rounded-full" />
              <h2 className="text-sm font-bold text-stone-900">2. 选择预约日期</h2>
            </div>
            <span className="text-[11px] text-stone-500 font-mono flex items-center gap-1">
              <CalendarDays className="w-3 h-3 text-stone-400" />
              可预约未来7天
            </span>
          </div>

          {/* Horizontal Date Scroller */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {days.map((day) => {
              const isSelected = day.dateStr === selectedDate;
              return (
                <button
                  key={day.dateStr}
                  onClick={() => {
                    setSelectedDate(day.dateStr);
                    setSelectedSlot(null);
                  }}
                  className={`shrink-0 flex flex-col items-center justify-center py-2 px-3 rounded-xl min-w-[56px] border transition-all ${
                    isSelected
                      ? 'bg-amber-800 text-white border-amber-800 shadow-xs ring-1 ring-amber-800'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span
                    className={`text-[10px] uppercase font-semibold ${
                      isSelected ? 'text-amber-200' : 'text-stone-600'
                    }`}
                  >
                    {day.relativeLabel}
                  </span>
                  <span className="text-base font-bold font-mono my-0.5">{day.dayNumber}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-amber-200' : 'text-stone-600'}`}>
                    {day.dayOfWeek}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 3: Select Service Item */}
        <section className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-amber-700 rounded-full" />
              <h2 className="text-sm font-bold text-stone-900">3. 选择服务项目</h2>
            </div>
          </div>

          <div className="space-y-2">
            {services.map((srv) => {
              const isSelected = srv.id === selectedServiceId;
              return (
                <button
                  key={srv.id}
                  onClick={() => setSelectedServiceId(srv.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'border-amber-700 bg-amber-50/40 ring-1 ring-amber-700'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-900">{srv.name}</span>
                      <span className="text-[10px] text-stone-500 font-mono">
                        约{srv.durationMinutes}分钟
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1 line-clamp-1">{srv.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-amber-900">¥{srv.price}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 4: Select Time Slot (Core Feature) */}
        <section className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-amber-700 rounded-full" />
              <h2 className="text-sm font-bold text-stone-900">4. 选择预约时间段</h2>
            </div>
            <span className="text-[10px] text-stone-500 font-mono">单次服务约45-60分钟</span>
          </div>

          {/* Status Legend */}
          <div className="flex items-center gap-3 py-1.5 px-2 bg-stone-50 rounded-lg text-[10px] text-stone-600 mb-3">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>有空可预约</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
              <span>已约满</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-200 border border-amber-400" />
              <span>理发师休息/没空</span>
            </div>
          </div>

          {/* Time Slot Grid */}
          <div className="grid grid-cols-4 gap-2">
            {daySlots.map((slot) => {
              const isAvailable = slot.status === 'available';
              const isBooked = slot.status === 'booked';
              const isUnavailable = slot.status === 'unavailable';
              const isCurrentSelected = selectedSlot === slot.time;

              let slotClass = '';
              let badgeText = '可约';

              if (isBooked) {
                slotClass = 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed';
                badgeText = '已约满';
              } else if (isUnavailable) {
                slotClass = 'bg-amber-50/70 text-stone-400 border-amber-200/60 cursor-not-allowed';
                badgeText = '休息/忙';
              } else if (isCurrentSelected) {
                slotClass = 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-600 ring-offset-1 font-bold';
                badgeText = '已选';
              } else {
                slotClass =
                  'bg-white text-stone-900 border-emerald-300 hover:border-emerald-600 hover:bg-emerald-50/50 cursor-pointer shadow-2xs';
                badgeText = '可约';
              }

              return (
                <button
                  key={slot.time}
                  disabled={!isAvailable}
                  onClick={() => handleSelectSlot(slot.time, slot.status)}
                  className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border transition-all text-center min-h-[56px] ${slotClass}`}
                >
                  <span className="font-mono text-xs font-bold">{slot.time}</span>
                  <span
                    className={`text-[9px] mt-0.5 tracking-tight ${
                      isCurrentSelected
                        ? 'text-emerald-100'
                        : isAvailable
                        ? 'text-emerald-600 font-medium'
                        : isUnavailable
                        ? 'text-amber-800/70'
                        : 'text-stone-400'
                    }`}
                  >
                    {badgeText}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 text-[11px] text-stone-500 flex items-center justify-between">
            <span>💡 若理发师设置了休息，此时段将自动置灰无法预约</span>
            <button
              onClick={() => setActiveTab('stylist_schedule')}
              className="text-amber-800 underline font-medium hover:text-amber-900"
            >
              去理发师端排班测试 &rarr;
            </button>
          </div>
        </section>
      </div>

      {/* Booking Form Sheet / Drawer */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-t-3xl p-5 shadow-2xl border-t border-stone-100 animate-in slide-in-from-bottom duration-200 max-h-[90vh] overflow-y-auto">
            {/* Sheet Handle */}
            <div className="w-10 h-1 bg-stone-300 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-stone-900">填写预约信息</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {selectedDate} · {selectedSlot} · {currentStylist.name}
                </p>
              </div>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-[11px] text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-full font-medium transition-colors"
              >
                一键填入微信信息
              </button>
            </div>

            {/* Error Message */}
            {formError && (
              <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitBooking} className="space-y-3.5">
              {/* Selected Service Card */}
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-stone-900">{selectedService.name}</span>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    发型师：{currentStylist.name} · 服务耗时约{selectedService.durationMinutes}分钟
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-amber-900">¥{selectedService.price}</span>
                  <div className="text-[10px] text-stone-400">到店结算</div>
                </div>
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  预约人姓名 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="如：张先生 / 微信昵称"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-700"
                  />
                </div>
              </div>

              {/* Customer Phone */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  联系手机号 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="用于接收预约确认短信及排班通知"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-700 font-mono"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  发型要求或特别说明 (选填)
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="如：需要修刘海、头皮敏感、之前漂过发等"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-700"
                  />
                </div>
              </div>

              {/* Warm Notice */}
              <p className="text-[10px] text-stone-400 leading-relaxed">
                * 预约档期将为您保留15分钟，如行程变更请提前在“我的预约”中取消，感谢理解。
              </p>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 py-2.5 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
                >
                  返回重选
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-xl transition-colors shadow-sm active:scale-[0.99]"
                >
                  确认立即预约
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Booking Success Ticket Modal */}
      <BookingSuccessModal
        appointment={latestAppointment}
        onClose={() => setLatestAppointment(null)}
        onViewMyAppointments={() => setActiveTab('my_bookings')}
      />
    </div>
  );
};
