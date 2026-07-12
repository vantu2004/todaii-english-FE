import { Cpu, BookOpen, Languages, LogIn } from "lucide-react";
import DateRangePicker from "@/components/servers/dashboard/DateRangePicker";
import DashboardCharts from "@/components/servers/dashboard/DashboardCharts";

export default function SystemActivityTab({
  dates,
  handleRangeChange,
  preset,
  setPreset,
  fetchMyChartData,
  loadingActivity,
  totalAiRequests,
  totalTokens,
  totalDictQueries,
  totalDictLocal,
  totalDictApi,
  totalGgTranslations,
  totalCharsTranslated,
  totalLogins,
  totalEmails,
  totalUploads,
  chartData,
}) {
  return (
    <div className="animate-fade-in">
      {/* Date Filter & Controls */}
      <DateRangePicker
        startDate={dates.startDate}
        endDate={dates.endDate}
        onRangeChange={handleRangeChange}
        preset={preset}
        setPreset={setPreset}
        onRefresh={fetchMyChartData}
        loading={loadingActivity}
      />

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Card 1: AI Assistant */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-lg flex flex-col justify-between transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-50 dark:bg-brand-950/30 text-brand-500 rounded-md">
              <Cpu size={20} />
            </div>
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                Trí tuệ nhân tạo (AI)
              </p>
              <h3 className="text-xl font-light text-neutral-900 dark:text-white mt-1">
                {loadingActivity ? "..." : totalAiRequests.toLocaleString()}{" "}
                <span className="text-xs font-normal text-neutral-400">
                  lượt
                </span>
              </h3>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>Tổng số token:</span>
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
              {loadingActivity ? "..." : totalTokens.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Card 2: Dictionary */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-lg flex flex-col justify-between transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-50 dark:bg-brand-950/30 text-brand-500 rounded-md">
              <BookOpen size={20} />
            </div>
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                Tra cứu từ điển
              </p>
              <h3 className="text-xl font-light text-neutral-900 dark:text-white mt-1">
                {loadingActivity ? "..." : totalDictQueries.toLocaleString()}{" "}
                <span className="text-xs font-normal text-neutral-400">
                  lần
                </span>
              </h3>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>Todaii Dict / Free API:</span>
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
              {loadingActivity ? "..." : `${totalDictLocal} / ${totalDictApi}`}
            </span>
          </div>
        </div>

        {/* Card 3: Google Translation */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-lg flex flex-col justify-between transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-50 dark:bg-brand-950/30 text-brand-500 rounded-md">
              <Languages size={20} />
            </div>
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                Google Dịch
              </p>
              <h3 className="text-xl font-light text-neutral-900 dark:text-white mt-1">
                {loadingActivity ? "..." : totalGgTranslations.toLocaleString()}{" "}
                <span className="text-xs font-normal text-neutral-400">
                  lượt
                </span>
              </h3>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>Ký tự đã dịch:</span>
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
              {loadingActivity ? "..." : totalCharsTranslated.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Card 4: Account Activity */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-lg flex flex-col justify-between transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-50 dark:bg-brand-950/30 text-brand-500 rounded-md">
              <LogIn size={20} />
            </div>
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                Tương tác hệ thống
              </p>
              <h3 className="text-xl font-light text-neutral-900 dark:text-white mt-1">
                {loadingActivity ? "..." : totalLogins.toLocaleString()}{" "}
                <span className="text-xs font-normal text-neutral-400">
                  lần
                </span>
              </h3>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-between text-xs text-neutral-500 dark:text-neutral-400 gap-2">
            <span className="truncate">Thư nhận / Tải ảnh:</span>
            <span className="font-semibold text-neutral-700 dark:text-neutral-300 shrink-0">
              {loadingActivity ? "..." : `${totalEmails} / ${totalUploads}`}
            </span>
          </div>
        </div>
      </div>

      {/* Render Charts */}
      <div className="mt-8">
        <DashboardCharts
          chartData={chartData}
          loading={loadingActivity}
          activeTab="user-chart"
        />
      </div>
    </div>
  );
}
