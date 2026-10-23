import React, { useState } from 'react';
import {
  CalendarClock,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  Calendar,
  AlertTriangle,
  Sparkles,
  Phone,
  Scissors,
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  Sun,
  Moon,
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import { useBarbershop } from '../context/BarbershopContext';
import { getUpcomingDays } from '../data/initialData';
import { Appointment } from '../types';

export const StylistScheduleView: React.FC = () => {
  const {
    stylists,
    currentBarberId,
    setCurrentBarberId,
    selectedDate,
    setSelectedDate,
    getDaySlots,
    toggleSlotAvailability,
    batchSetSchedule,
    appointments,
    setActiveTab,
    isBarberAuthed,
    loginAsBarber,
    logoutBarber,
  } = useBarbershop();

  const [pinInput, setPinInput] = useState('');

  const days = getUpcomingDays(7);
  const currentStylist = stylists.find((s) => s.id === currentBarberId) || stylists[0];

  const [activeAppointmentDetail, setActiveAppointmentDetail] = useState<Appointment | null>(null);

  // Time slots for this stylist & date
  const daySlots = getDaySlots(currentBarberId, selectedDate);

  const availableCount = daySlots.filter((s) => s.status === 'available').length;
  const unavailableCount = daySlots.filter((s) => s.status === 'unavailable').length;
  const bookedCount = daySlots.filter((s) => s.status === 'booked').length;

  // Appointments on this day for this stylist
  const currentDayAppointments = appointments.filter(
    (a) => a.stylistId === currentBarberId && a.date === selectedDate && a.status === 'confirmed'
  );

  return (
    <div className="flex-1 overflow-y-auto bg-stone-50 pb-20">
      {/* Barber Console Header */}
      <div className="bg-stone-900 text-white p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-amber-400" />
            <h1 className="text-base font-bold tracking-tight">理发师档期设置工作台</h1>
          </div>
          <button
            onClick={() => setActiveTab('customer_booking')}
            className="text-[11px] bg-amber-800/80 hover:bg-amber-800 text-white px-2.5 py-1 rounded-full border border-amber-600 transition-colors"
          >
            返回顾客预约端
          </button>
        </div>

        {/* Stylist Identity */}
        <div className="bg-stone-800/80 rounded-2xl p-3 border border-stone-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentStylist.avatar}
              alt={currentStylist.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-xl object-cover shrink-0 border border-amber-600/60"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{currentStylist.name}</span>
                <span className="text-[10px] bg-amber-900/60 text-amber-300 px-1.5 py-0.5 rounded border border-amber-600/40">
                  {currentStylist.title}
                </span>
              </div>
              <div className="text-[11px] text-stone-300 mt-0.5 font-mono">
                发龄 {currentStylist.experienceYears} 年 · {currentStylist.completedOrders}+ 服务
              </div>
              <div className="text-[10px] text-amber-300/90 italic mt-0.5">
                “{currentStylist.bio}”
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-700/50 px-2 py-1 rounded-full font-medium">
              ● 工作台中
            </span>
          </div>
        </div>
      </div>

      <div className="p-3.5 space-y-4">
        {/* Date Selector */}
        <section className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-amber-700 rounded-full" />
              <h2 className="text-xs font-bold text-stone-900">选择排班排期</h2>
            </div>
            <span className="text-[11px] text-stone-500 font-mono">{selectedDate}</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {days.map((day) => {
              const isSelected = day.dateStr === selectedDate;
              return (
                <button
                  key={day.dateStr}
                  onClick={() => setSelectedDate(day.dateStr)}
                  className={`shrink-0 flex flex-col items-center justify-center py-2 px-3 rounded-xl min-w-[56px] border transition-all ${
                    isSelected
                      ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span
                    className={`text-[10px] font-semibold ${
                      isSelected ? 'text-amber-300' : 'text-stone-500'
                    }`}
                  >
                    {day.relativeLabel}
                  </span>
                  <span className="text-base font-bold font-mono my-0.5">{day.dayNumber}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                    {day.dayOfWeek}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Schedule Dashboard & Stats */}
        <section className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-amber-700 rounded-full" />
              <h2 className="text-xs font-bold text-stone-900">
                {currentStylist.name} · 当日档期概览
              </h2>
            </div>
            <span className="text-[10px] text-stone-400">点击下方时间段即可自由切换</span>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-2.5 text-center">
              <span className="text-[10px] text-emerald-800 font-medium block">有空·开放预约</span>
              <span className="text-lg font-bold font-mono text-emerald-700">{availableCount}</span>
              <span className="text-[9px] text-emerald-600 block">个时段</span>
            </div>

            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-2.5 text-center">
              <span className="text-[10px] text-amber-900 font-medium block">没空·理发师休息</span>
              <span className="text-lg font-bold font-mono text-amber-800">{unavailableCount}</span>
              <span className="text-[9px] text-amber-700 block">个时段</span>
            </div>

            <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-2.5 text-center">
              <span className="text-[10px] text-sky-900 font-medium block">已有顾客预约</span>
              <span className="text-lg font-bold font-mono text-sky-800">{bookedCount}</span>
              <span className="text-[9px] text-sky-700 block">位客户</span>
            </div>
          </div>

          {/* Batch Setting Tools (一键快捷排班) */}
          <div className="bg-stone-50 rounded-xl p-2.5 border border-stone-200 mb-3">
            <div className="text-[11px] font-semibold text-stone-700 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>快捷批量排班设定：</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => batchSetSchedule(currentBarberId, selectedDate, 'all_open')}
                className="py-1.5 px-2 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg font-medium transition-colors text-center"
              >
                ✅ 全天设为有空
              </button>
              <button
                onClick={() => batchSetSchedule(currentBarberId, selectedDate, 'all_closed')}
                className="py-1.5 px-2 bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 rounded-lg font-medium transition-colors text-center"
              >
                ☕ 全天设为休息/请假
              </button>
              <button
                onClick={() => batchSetSchedule(currentBarberId, selectedDate, 'morning_only')}
                className="py-1.5 px-2 bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-1"
              >
                <Sun className="w-3 h-3 text-amber-600" />
                <span>仅上午有空</span>
              </button>
              <button
                onClick={() => batchSetSchedule(currentBarberId, selectedDate, 'afternoon_only')}
                className="py-1.5 px-2 bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-1"
              >
                <Moon className="w-3 h-3 text-indigo-600" />
                <span>仅下午有空</span>
              </button>
            </div>
          </div>

          {/* Matrix of Slots */}
          <div className="space-y-1.5">
            <div className="text-[11px] text-stone-500 font-medium mb-1 flex items-center justify-between">
              <span>档期列表 (点击即可切换 有空 / 没空 状态)：</span>
              <span className="text-[10px] text-stone-400">实时同步客户端</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {daySlots.map((slot) => {
                const isAvailable = slot.status === 'available';
                const isUnavailable = slot.status === 'unavailable';
                const isBooked = slot.status === 'booked';

                return (
                  <div
                    key={slot.time}
                    onClick={() => {
                      if (isBooked) {
                        setActiveAppointmentDetail(slot.appointment || null);
                      } else {
                        toggleSlotAvailability(currentBarberId, selectedDate, slot.time);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isBooked
                        ? 'bg-sky-50/80 border-sky-300 hover:bg-sky-100/70'
                        : isAvailable
                        ? 'bg-emerald-50/40 border-emerald-300 hover:bg-emerald-100/50'
                        : 'bg-stone-100/70 border-stone-200 hover:bg-stone-200/60'
                    }`}
                  >
                    {/* Left: Time and Status */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-stone-500" />
                        <span className="font-mono text-sm font-bold text-stone-900">{slot.time}</span>
                      </div>

                      {/* Status indicator badge */}
                      {isBooked ? (
                        <div className="flex items-center gap-1.5 text-xs text-sky-800">
                          <span className="w-2 h-2 rounded-full bg-sky-600" />
                          <span className="font-semibold">
                            已约: {slot.appointment?.customerName} ({slot.appointment?.serviceName})
                          </span>
                        </div>
                      ) : isAvailable ? (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="font-bold">有空 (开放顾客预约)</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-stone-500">
                          <XCircle className="w-4 h-4 text-stone-400" />
                          <span className="font-medium">没空 (休息 / 暂停接单)</span>
                        </div>
                      )}
                    </div>

                    {/* Right: Interactive Action Button */}
                    <div className="shrink-0">
                      {isBooked ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveAppointmentDetail(slot.appointment || null);
                          }}
                          className="text-[11px] bg-white border border-sky-300 text-sky-800 px-2.5 py-1 rounded-lg font-medium shadow-2xs hover:bg-sky-50"
                        >
                          查看客户详情
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSlotAvailability(currentBarberId, selectedDate, slot.time);
                          }}
                          className={`text-xs px-2.5 py-1 rounded-lg font-medium border shadow-2xs transition-colors ${
                            isAvailable
                              ? 'bg-white border-amber-300 text-amber-900 hover:bg-amber-50'
                              : 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {isAvailable ? '设为没空(休息)' : '设为有空(开放)'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section: Today's Customer Appointments */}
        <section className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-sky-600 rounded-full" />
              <h2 className="text-xs font-bold text-stone-900">
                {selectedDate} 已预约客户名单 ({currentDayAppointments.length}人)
              </h2>
            </div>
          </div>

          {currentDayAppointments.length === 0 ? (
            <div className="py-6 text-center text-stone-400 text-xs">
              <p>该日期暂无客户预约，开放时段等待预约中</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {currentDayAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-800 text-sm bg-amber-100/80 px-2 py-0.5 rounded-md">
                        {appt.timeSlot}
                      </span>
                      <span className="font-bold text-stone-900 text-sm">{appt.customerName}</span>
                      <span className="text-stone-500 font-mono text-[11px]">{appt.customerPhone}</span>
                    </div>
                    <span className="font-mono text-xs text-stone-500">#{appt.bookingCode}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-600 pt-1 border-t border-stone-200/60">
                    <span className="flex items-center gap-1">
                      <Scissors className="w-3 h-3 text-stone-400" />
                      {appt.serviceName}
                    </span>
                    <span className="font-bold text-stone-900">¥{appt.servicePrice}</span>
                  </div>

                  {appt.notes && (
                    <div className="text-[11px] text-stone-500 bg-white p-2 rounded-lg border border-stone-100">
                      顾客备注：{appt.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Appointment Detail Popup */}
      {activeAppointmentDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-stone-900 text-sm">顾客预约详情</h3>
              <span className="font-mono text-xs font-bold text-amber-800">
                #{activeAppointmentDetail.bookingCode}
              </span>
            </div>

            <div className="space-y-2 text-xs text-stone-700">
              <div className="flex justify-between">
                <span className="text-stone-500">顾客姓名</span>
                <span className="font-bold text-stone-900">{activeAppointmentDetail.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">联系手机</span>
                <span className="font-mono text-stone-900">{activeAppointmentDetail.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">服务项目</span>
                <span className="font-medium text-stone-900">{activeAppointmentDetail.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">预约时段</span>
                <span className="font-mono font-bold text-emerald-700">
                  {activeAppointmentDetail.date} {activeAppointmentDetail.timeSlot}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">费用金额</span>
                <span className="font-bold text-stone-900">¥{activeAppointmentDetail.servicePrice}</span>
              </div>
              {activeAppointmentDetail.notes && (
                <div className="bg-stone-50 p-2 rounded-lg text-stone-600">
                  备注：{activeAppointmentDetail.notes}
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveAppointmentDetail(null)}
                className="w-full py-2 bg-stone-900 text-white rounded-xl text-xs font-medium hover:bg-stone-800 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
