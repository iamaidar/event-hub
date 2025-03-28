import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { fetchTicketSales } from "../../api/ticketSalesApi.tsx";  // Импортируем функцию для загрузки данных

interface TicketSale {
  month: string;
  ticketsSold: number;
}

export default function MonthlyTicketSalesChart() {
  const [ticketSales, setTicketSales] = useState<TicketSale[]>([]);  // Состояние для данных
  const [loading, setLoading] = useState<boolean>(true);  // Состояние для загрузки

  useEffect(() => {
    // Запрос данных о продажах билетов
    const getTicketSales = async () => {
      try {
        const data = await fetchTicketSales();
        setTicketSales(data);  // Обновляем состояние с данными
        setLoading(false);  // Завершаем загрузку
      } catch (error) {
        console.error("Ошибка загрузки данных о продажах билетов:", error);
        setLoading(false);  // Завершаем загрузку в случае ошибки
      }
    };

    getTicketSales();
  }, []);  // useEffect с пустым массивом, чтобы запрос был выполнен только один раз

  const options: ApexOptions = {
    colors: ["#9333EA"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 200,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ticketSales.map((item) => item.month), // Динамическая ось X
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
        // Название оси Y
    },
    grid: { yaxis: { lines: { show: true } } },
    fill: { opacity: 1 },
    tooltip: {
      x: { show: true },
      y: { formatter: (val: number) => `${val} tickets` },
    },
  };

  const series = [
    {
      name: "Tickets Sold",
      data: ticketSales.map((item) => item.ticketsSold), // Данные о продажах билетов
    },
  ];

  if (loading) {
    return <div>Loading...</div>;  // Отображаем сообщение, пока данные загружаются
  }

  return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <h3 className="text-lg font-semibold text-gray-800 ">
          Monthly Ticket Sales
        </h3>
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
            <Chart options={options} series={series} type="bar" height={200} />
          </div>
        </div>
      </div>
  );
}
