import { CheckCircle, XCircle } from "lucide-react";

export default function TicketStatusMessage({ status }: { status: "valid" | "used" | "invalid" |"expired"| null }) {
    const statusConfig = {
        valid: {
            text: "✅ Your ticket has been confirmed!",
            color: "text-green-500",
            Icon: CheckCircle,
        },
        used: {
            text: "❌ This ticket has already been used!",
            color: "text-red-500",
            Icon: XCircle,
        },
        invalid: {
            text: "❌ The ticket is invalid.",
            color: "text-gray-500",
            Icon: XCircle,
        },
        expired: {
            text: "❌ The ticket is expired.",
            color: "text-gray-500",
            Icon: XCircle,
        }
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
