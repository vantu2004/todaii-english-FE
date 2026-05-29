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
  const tokenChartData = useMemo(() => getTokenChartData(data), [data]);
  const eventDistributionData = useMemo(
    () => getEventDistributionData(data),
    [data],
  );
  const eventCharts = useMemo(() => getEventChartsData(data), [data]);

  const hasData = data && data.length > 0;

  return (
    <div className="mb-10">
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-5 flex items-center gap-2">
        <Cpu size={20} className="text-neutral-500" /> System & Integrations
        (Server-Side)
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartContainer
          title="AI Token Usage"
          subtitle="Total tokens consumed by admins"
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
            <p className="text-sm text-neutral-400">No Data Available</p>
          )}
        </ChartContainer>

        <ChartContainer
          title="Event Type Distribution"
          subtitle="System operational breakdown"
        >
          <div className="h-full flex items-center justify-center p-2">
            {eventDistributionData ? (
              <Doughnut
                data={eventDistributionData}
                options={{
                  maintainAspectRatio: false,
                  cutout: "65%",
                  plugins: {
                    legend: {
                      position: "right",
                      labels: { boxWidth: 10, padding: 15, font: { size: 11 } },
                    },
                  },
                }}
              />
            ) : (
              <p className="text-sm text-neutral-400">No Data Available</p>
            )}
          </div>
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hasData &&
          eventCharts.map((chart) => (
            <div
              key={chart.key}
              className="bg-white dark:bg-neutral-900 rounded-xl p-5 ring-1 ring-neutral-200/60 dark:ring-neutral-800 flex flex-col hover:shadow-md hover:ring-neutral-200 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    {chart.title}
                  </h4>
                  <p className="text-xl font-semibold tabular-nums tracking-tight text-neutral-900 dark:text-white mt-1">
                    {chart.total.toLocaleString()}
                  </p>
                </div>
                <div
                  className="w-2.5 h-2.5 rounded-full mt-1"
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
