import { Cpu } from "lucide-react";
import ChartContainer from "./ChartContainer";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  getTokenChartData,
  getEventDistributionData,
  getEventChartsData,
  miniChartOptions,
} from "./dashboardUtils";
import { useMemo } from "react";

const AdminSection = ({ data }) => {
  const tokenChartData = useMemo(
    () => getTokenChartData(data?.ai_token_trends),
    [data]
  );
  const eventDistributionData = useMemo(
    () => getEventDistributionData(data?.log_summary),
    [data]
  );
  const eventCharts = useMemo(
    () => getEventChartsData(data?.log_trends, data?.log_summary),
    [data]
  );

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        <Cpu size={20} /> System & 3rd Party Integrations (Server-Side)
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Token Chart */}
        <ChartContainer
          title="AI Token Usage (Global)"
          subtitle="Total tokens consumed"
        >
          {tokenChartData ? (
            <Bar
              data={tokenChartData}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                scales: { x: { stacked: true }, y: { stacked: true } },
              }}
            />
          ) : (
            <p>No Data</p>
          )}
        </ChartContainer>

        {/* Distribution Chart */}
        <ChartContainer
          title="Event Type Distribution"
          subtitle="Excluding YouTube Search"
        >
          <div className="h-full flex items-center justify-center p-2">
            {eventDistributionData ? (
              <Doughnut
                data={eventDistributionData}
                options={{
                  maintainAspectRatio: false,
                  cutout: "60%",
                  plugins: {
                    legend: {
                      position: "right",
                      labels: { boxWidth: 12, padding: 15, font: { size: 11 } },
                    },
                  },
                }}
              />
            ) : (
              <p>No Data</p>
            )}
          </div>
        </ChartContainer>
      </div>

      {/* Grid các Chart nhỏ cho từng Event Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventCharts.map((chart) => (
          <div
            key={chart.key}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700 flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {chart.title}
                </h4>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                  {chart.total.toLocaleString()}
                </p>
              </div>
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: chart.chartData.datasets[0].borderColor,
                }}
              />
            </div>

            <div className="h-32 w-full mt-auto">
              {chart.isLineChart ? (
                <Line data={chart.chartData} options={miniChartOptions} />
              ) : (
                <Bar data={chart.chartData} options={miniChartOptions} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSection;
