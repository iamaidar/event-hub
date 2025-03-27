import { CheckCircle, XCircle } from "lucide-react";

export default function TicketStatusMessage({ status }: { status: "valid" | "used" | "invalid" | null }) {
    const statusConfig = {
        valid: {
            text: "✅ Ваш билет подтвержден!",
            color: "text-green-500",
            Icon: CheckCircle,
        },
        used: {
            text: "❌ Этот билет уже использован!",
            color: "text-red-500",
            Icon: XCircle,
        },
        invalid: {
            text: "❌ Билет недействителен.",
            color: "text-gray-500",
            Icon: XCircle,
        },
    };

    if (!status) return null;
    const { text, color, Icon } = statusConfig[status];

    return (
        <div className={`flex flex-col items-center ${color}`}>
            <Icon className="w-16 h-16" />
            <p className="text-xl font-bold mt-4">{text}</p>
        </div>
    );
}
