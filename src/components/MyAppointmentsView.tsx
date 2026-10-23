import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Scissors,
  MapPin,
  AlertCircle,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Bell,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  FileText,
  Sparkles,
} from 'lucide-react';
import { useBarbershop } from '../context/BarbershopContext';
import { Appointment, BookingNotification } from '../types';

export const MyAppointmentsView: React.FC = () => {
  const { appointments, notifications, cancelAppointment, setActiveTab } = useBarbershop();
  const [activeView, setActiveView] = useState<'appointments' | 'notifications'>('appointments');
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
  const [expandedNotifApptId, setExpandedNotifApptId] = useState<string | null>(null);

  const filteredAppointments = appointments.filter((appt) => {
    if (filter === 'confirmed') return appt.status === 'confirmed';
    if (filter === 'cancelled') return appt.status === 'cancelled';
    return true;
  });

  const toggleExpandNotification = (id: string) => {
    setExpandedNotifApptId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex-1 overflow-y-auto bg-stone-50 pb-20">
      {/* Header */}
      <div className="bg-stone-900 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold tracking-tight">我的预约中心</h1>
            <p className="text-xs text-stone-400 mt-0.5">预约档案与微信服务通知记录</p>
          </div>
          {notifications.length > 0 && (
            <div className="flex items-center gap-1.5 bg-stone-800 text-emerald-400 border border-stone-700 px-2.5 py-1 rounded-full text-xs font-mono">
              <Bell className="w-3.5 h-3.5" />
              <span>{notifications.length}条服务通知</span>
            </div>
          )}
        </div>

        {/* View Switcher: Appointments vs Notification Center */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-stone-800 rounded-xl mt-3 text-xs">
          <button
            onClick={() => setActiveView('appointments')}
            className={`py-1.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5 ${
              activeView === 'appointments'
                ? 'bg-stone-700 text-white shadow-xs font-semibold'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>预约记录 ({appointments.length})</span>
          </button>
          <button
            onClick={() => setActiveView('notifications')}
            className={`py-1.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5 ${
              activeView === 'notifications'
                ? 'bg-stone-700 text-emerald-300 shadow-xs font-semibold'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>消息通知记录 ({notifications.length})</span>
          </button>
        </div>

        {/* Filter Segmented Control (only when on appointments view) */}
        {activeView === 'appointments' && (
          <div className="flex items-center gap-1 p-1 bg-stone-800/60 rounded-xl mt-2 text-[11px]">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-1 rounded-lg transition-colors ${
                filter === 'all' ? 'bg-stone-700 text-white' : 'text-stone-400 hover:text-white'
              }`}
            >
              全部 ({appointments.length})
            </button>
            <button
              onClick={() => setFilter('confirmed')}
              className={`flex-1 py-1 rounded-lg transition-colors ${
                filter === 'confirmed' ? 'bg-stone-700 text-emerald-300' : 'text-stone-400 hover:text-white'
              }`}
            >
              待服务 ({appointments.filter((a) => a.status === 'confirmed').length})
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`flex-1 py-1 rounded-lg transition-colors ${
                filter === 'cancelled' ? 'bg-stone-700 text-stone-300' : 'text-stone-400 hover:text-white'
              }`}
            >
              已取消 ({appointments.filter((a) => a.status === 'cancelled').length})
            </button>
          </div>
        )}
      </div>

      <div className="p-3.5 space-y-3">
        {/* VIEW 1: Appointments List */}
        {activeView === 'appointments' && (
          <>
            {filteredAppointments.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-stone-200 text-center space-y-3 my-6">
                <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-stone-800 text-sm">暂无相关预约记录</p>
                  <p className="text-xs text-stone-500 mt-1">您可以挑选心仪的发型师，预约专属服务时段</p>
                </div>
                <button
                  onClick={() => setActiveTab('customer_booking')}
                  className="inline-flex items-center gap-1.5 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold py-2 px-4 rounded-xl transition-colors shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>立即去预约</span>
                </button>
              </div>
            ) : (
              filteredAppointments.map((appt) => {
                const isConfirmed = appt.status === 'confirmed';
                const notifCount = appt.notificationHistory?.length || 0;
                const isNotifExpanded = expandedNotifApptId === appt.id;

                return (
                  <div
                    key={appt.id}
                    className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs space-y-3"
                  >
                    {/* Top Row: Service & Status */}
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Scissors className="w-4 h-4 text-amber-700" />
                        <span className="font-bold text-stone-900 text-sm">{appt.serviceName}</span>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          isConfirmed
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-stone-100 text-stone-500 border border-stone-200'
                        }`}
                      >
                        {isConfirmed ? '待服务·已锁定' : '已取消'}
                      </span>
                    </div>

                    {/* Booking Code Banner */}
                    {isConfirmed && (
                      <div className="bg-stone-50 border border-dashed border-stone-300 rounded-xl px-3 py-2 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-stone-500 block">到店核销码</span>
                          <span className="font-mono text-base font-bold text-stone-900 tracking-wider">
                            {appt.bookingCode}
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-2 py-1 rounded-md">
                          保留15分钟
                        </span>
                      </div>
                    )}

                    {/* Details */}
                    <div className="space-y-1.5 text-xs text-stone-600">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-stone-500">
                          <User className="w-3.5 h-3.5 text-stone-400" />
                          指定理发师
                        </span>
                        <span className="font-bold text-stone-900">{appt.stylistName}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-stone-500">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          预约时间
                        </span>
                        <span className="font-mono font-bold text-amber-800">
                          {appt.date} · {appt.timeSlot}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-stone-500">预约人</span>
                        <span className="text-stone-800">
                          {appt.customerName} ({appt.customerPhone})
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-stone-500">费用总额</span>
                        <span className="font-bold text-stone-900 text-sm">¥{appt.servicePrice}</span>
                      </div>

                      {appt.notes && (
                        <div className="bg-stone-50 p-2 rounded-lg text-[11px] text-stone-500 mt-1">
                          备注：{appt.notes}
                        </div>
                      )}
                    </div>

                    {/* SAVED NOTIFICATION SECTION (Core Feature) */}
                    <div className="border-t border-stone-100 pt-2.5">
                      <button
                        onClick={() => toggleExpandNotification(appt.id)}
                        className="w-full flex items-center justify-between p-2 rounded-xl bg-stone-50 hover:bg-stone-100 text-xs text-stone-700 transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[9px] font-bold">
                            ✓
                          </div>
                          <span className="font-semibold text-stone-800">
                            已保存微信服务通知 ({notifCount}条)
                          </span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded font-mono">
                            已送达
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-stone-400">
                          <span>{isNotifExpanded ? '收起通知卡片' : '展开通知详情'}</span>
                          {isNotifExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </div>
                      </button>

                      {/* Expanded Simulated Notification Cards */}
                      {isNotifExpanded && (
                        <div className="mt-2 space-y-2 animate-in fade-in duration-200">
                          {appt.notificationHistory?.map((notif) => (
                            <div
                              key={notif.id}
                              className="bg-stone-900 text-white rounded-xl p-3 text-xs space-y-2 border border-stone-700 shadow-sm"
                            >
                              <div className="flex items-center justify-between pb-1.5 border-b border-stone-800 text-[10px] text-stone-400">
                                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                                  <Bell className="w-3 h-3" />
                                  <span>{notif.title}</span>
                                </div>
                                <span className="font-mono">{notif.sentAt}</span>
                              </div>

                              <p className="text-[11px] text-stone-300 font-medium">{notif.summary}</p>

                              <div className="bg-stone-800/80 rounded-lg p-2 space-y-1 text-[10px] text-stone-300">
                                <div className="flex justify-between">
                                  <span className="text-stone-400">服务项目</span>
                                  <span className="font-semibold text-white">{notif.serviceName}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-stone-400">预约发型师</span>
                                  <span className="text-white">{notif.stylistName}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-stone-400">预约时段</span>
                                  <span className="font-mono font-bold text-emerald-400">
                                    {notif.appointmentDateTime}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-stone-400">预约核销码</span>
                                  <span className="font-mono font-bold text-amber-300">
                                    {notif.bookingCodeText}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-stone-400">门店地址</span>
                                  <span className="text-stone-300 truncate max-w-[180px]">
                                    {notif.storeAddress}
                                  </span>
                                </div>
                              </div>

                              <div className="text-[9px] text-stone-400 flex items-center justify-between pt-0.5">
                                <span>{notif.warmPrompt}</span>
                                <span className="text-emerald-400 font-mono">微信服务号 · 模板消息已送达</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Store address hint */}
                    <div className="text-[10px] text-stone-400 flex items-center gap-1 pt-1">
                      <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                      <span>三里屯艺术街区A座102 简剪沙龙</span>
                    </div>

                    {/* Cancel Action */}
                    {isConfirmed && (
                      <div className="pt-2 border-t border-stone-100 flex justify-end">
                        {confirmCancelId === appt.id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-red-600">确认取消此预约？</span>
                            <button
                              onClick={() => {
                                cancelAppointment(appt.id);
                                setConfirmCancelId(null);
                              }}
                              className="px-2.5 py-1 text-xs bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                            >
                              确认取消
                            </button>
                            <button
                              onClick={() => setConfirmCancelId(null)}
                              className="px-2.5 py-1 text-xs bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
                            >
                              放弃
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmCancelId(appt.id)}
                            className="text-xs text-stone-500 hover:text-red-600 transition-colors px-2 py-1 rounded-md hover:bg-red-50"
                          >
                            取消预约
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </>
        )}

        {/* VIEW 2: Dedicated Notification History Log */}
        {activeView === 'notifications' && (
          <div className="space-y-3">
            <div className="bg-amber-50 border border-amber-200/70 rounded-xl p-3 text-xs text-amber-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
              <span>此处归档客户预约成功及状态变更的所有微信服务消息通知记录。</span>
            </div>

            {notifications.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-stone-200 text-center space-y-2">
                <Bell className="w-6 h-6 text-stone-300 mx-auto" />
                <p className="text-xs text-stone-500">暂无服务消息通知记录</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const isSuccess = notif.type === 'booking_success';
                return (
                  <div
                    key={notif.id}
                    className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${
                            isSuccess ? 'bg-emerald-600' : 'bg-stone-600'
                          }`}
                        >
                          <Bell className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-bold text-stone-900 text-xs block">{notif.title}</span>
                          <span className="text-[10px] text-stone-400 font-mono">微信服务号 · 模板推送</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono">{notif.sentAt}</span>
                    </div>

                    <div className="text-xs text-stone-800 font-medium">{notif.summary}</div>

                    <div className="bg-stone-50 rounded-xl p-3 space-y-1.5 text-xs border border-stone-100">
                      <div className="flex justify-between">
                        <span className="text-stone-500">预约项目</span>
                        <span className="font-bold text-stone-900">{notif.serviceName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">服务发型师</span>
                        <span className="text-stone-900 font-medium">{notif.stylistName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">预约时间</span>
                        <span className="font-mono font-bold text-emerald-700">
                          {notif.appointmentDateTime}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">预约核销码</span>
                        <span className="font-mono font-bold text-amber-800">
                          #{notif.bookingCodeText}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">客户信息</span>
                        <span className="text-stone-700">
                          {notif.customerName} ({notif.customerPhone})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">门店地址</span>
                        <span className="text-stone-700 text-[11px]">{notif.storeAddress}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                      <span>温馨提示：{notif.warmPrompt}</span>
                      <span className="text-emerald-700 font-medium text-[10px]">● 已保存至预约记录</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
