interface StatCardProps {
    title: string;
    value: number | string;
    backgroundColor: string;
}

export default function StatCard({ title, value, backgroundColor }: StatCardProps) {
    return (
        <div
            className="p-4 rounded-lg shadow-md flex flex-col items-center"
            style={{ backgroundColor }}
        >
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-gray-700">{title}</p>
        </div>
    );
}
