import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface TicketSale {
  month: string;
  ticketsSold: number;
}

interface Props {
  ticketSales: TicketSale[];
}

export default function MonthlyTicketSalesChart({ ticketSales }: Props) {
  if (!ticketSales.length) {
    return <p className="text-center text-sm text-gray-500 py-6">Empty data</p>;
  }

  const options: ApexOptions = { /* …как было, без useState/useEffect… */ };
  const series = [{ name: "Tickets Sold", data: ticketSales.map(t => t.ticketsSold) }];

  return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <h3 className="text-lg font-semibold text-gray-800">Monthly Ticket Sales</h3>
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <Chart options={options} series={series} type="bar" height={200} />
        </div>
      </div>
  );
}
