import { PieChart, Pie, Cell, Tooltip } from "recharts";

interface ChartData {
    name: string;
    value: number;
    color: string;
}

interface UserChartProps {
    title: string;
    data: ChartData[];
}

export default function UserChart({ title, data }: UserChartProps) {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">{title}</h2>
            <div className="flex flex-col items-center">
                <div className="flex items-center relative">
                    <PieChart width={220} height={220}>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                    <div className="absolute left-[88px] top-[75px] text-center">
                        <p className="text-lg">Total</p>
                        <p className="text-sm text-gray-500">{total}</p>
                    </div>
                </div>

                <div className="mt-4 text-left">
                    {data.map((item, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <span
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: item.color }}
                            ></span>
                            <span className="text-sm font-semibold">{item.name}</span>
                            <span className="text-gray-500 text-xs ml-2">
                                {total > 0 ? `${((item.value / total) * 100).toFixed(0)}%` : "0%"} • {item.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
