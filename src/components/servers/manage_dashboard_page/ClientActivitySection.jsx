import ChartContainer from "./ChartContainer";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import {
  getTokenChartData,
  getEventDistributionData,
  getEventChartsData,
  miniChartOptions,
} from "./dashboardUtils";
import { useMemo } from "react";

const ClientActivitySection = ({ data, type }) => {
  const tokenChartData = useMemo(() => getTokenChartData(data), [data]);
  const eventDistributionData = useMemo(
    () => getEventDistributionData(data),
    [data],
  );
  const eventCharts = useMemo(() => getEventChartsData(data), [data]);

  const hasData = data && data.length > 0;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          title={`AI Token Usage (${type})`}
          subtitle={`Tokens consumed by ${type.toLowerCase()}s`}
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
            <p className="text-neutral-400 text-sm">No AI Usage Data</p>
          )}
        </ChartContainer>

        <ChartContainer
          title="Activity Distribution"
          subtitle={`${type} action breakdown`}
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
              <p className="text-neutral-400 text-sm">No Activity Data</p>
            )}
          </div>
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {hasData ? (
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
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-neutral-400 text-sm">
            No chart data available for the selected period.
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientActivitySection;
