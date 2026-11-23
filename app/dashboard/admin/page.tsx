
import {
  Users,
  Wrench,
  Clock3,
  LayoutDashboard,
  RefreshCw,
} from "lucide-react";

import { getAdminStats } from "@/lib/api/user";

const AdminDashboardPage = async () => {
  let stats = null;
  let errorMessage = "";

  try {
    stats = await getAdminStats();
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to load dashboard statistics";
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers,
      description: "Registered platform users",
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Technicians",
      value: stats?.totalTechnicians,
      description: "Registered technicians",
      icon: Wrench,
      iconBg: "bg-teal-50",
      iconColor: "text-teal-600",
    },
    {
      title: "Pending Services",
      value: stats?.pendingServices,
      description: "Waiting for approval",
      icon: Clock3,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  return (
    <div className="min-h-full space-y-8 bg-[#F5F7FA] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#167D9A]">
            <LayoutDashboard size={17} />
            Admin Panel
          </div>

          <h1 className="text-2xl font-bold text-[#102A43] sm:text-3xl">
            Dashboard Overview
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Welcome back! Here is what&apos;s happening on RepairLagbe.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 shadow-sm">
          <RefreshCw size={15} className="text-[#167D9A]" />
          Live Statistics
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          Failed to load dashboard statistics: {errorMessage}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {card.title}
                  </p>

                  <h2 className="mt-3 text-3xl font-bold text-[#102A43]">
                    {card.value !== undefined
                      ? card.value.toLocaleString()
                      : "--"}
                  </h2>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg}`}
                >
                  <Icon size={23} className={card.iconColor} />
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-400">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-[#102A43] p-6 text-white sm:p-8">
        <div className="relative z-10 max-w-xl">
          <p className="mb-2 text-sm font-medium text-teal-300">
            RepairLagbe Administration
          </p>

          <h2 className="text-2xl font-bold sm:text-3xl">
            Manage Your Platform
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            Monitor users, review technician services, and keep track of
            bookings and transactions from your admin dashboard.
          </p>
        </div>

        <div className="absolute -right-10 -top-16 h-64 w-64 rounded-full border-[35px] border-white/5" />
        <div className="absolute -bottom-24 right-24 h-48 w-48 rounded-full bg-[#167D9A]/20 blur-2xl" />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
