interface StatCardProps {
    title: string;
    value: number | string | [number | string, number | string];
    backgroundColor: string;
}

export default function StatCard({ title, value, backgroundColor }: StatCardProps) {
    const isArray = Array.isArray(value);

    return (
        <div
            className="p-4 rounded-lg shadow-md flex flex-col items-center"
            style={{ backgroundColor }}
        >
            {isArray ? (
                <p className="text-2xl font-bold">
                    {(value as [number | string, number | string]).join(" / ")}
                </p>
            ) : (
                <p className="text-2xl font-bold">{value}</p>
            )}
            <p className="text-sm text-gray-700 text-center">{title}</p>
        </div>
    );
}
