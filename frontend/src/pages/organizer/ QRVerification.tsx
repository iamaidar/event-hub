import { useState } from "react";
import { Card, CardContent } from "../../UI/QrCard.tsx";
import TicketStatusMessage from "../../UI/TicketStatus.tsx";

export default function QRVerification() {
    const [qrCode, setQrCode] = useState("");
    const [ticketStatus, setTicketStatus] = useState<"valid" | "used" | "invalid" | null>(null);
    const [loading, setLoading] = useState(false);

    const handleVerifyTicket = () => {
        setLoading(true);
        setTimeout(() => {
            const mockData = ["valid", "used", "invalid"];
            const randomStatus = mockData[Math.floor(Math.random() * mockData.length)];
            setTicketStatus(randomStatus as "valid" | "used" | "invalid");
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <Card className="p-6 text-center shadow-lg rounded-2xl bg-white w-96">
                <CardContent>
                    {ticketStatus === null ? (
                        <div>
                            <input
                                type="text"
                                className="mb-4 w-full p-2 border rounded"
                                placeholder="Введите QR-код"
                                value={qrCode}
                                onChange={(e) => setQrCode(e.target.value)}
                            />
                            <button
                                className="mb-4 px-4 py-2 bg-purple-500 text-white rounded w-full"
                                onClick={handleVerifyTicket}
                                disabled={loading || !qrCode}
                            >
                                {loading ? "Проверка..." : "Проверить билет"}
                            </button>
                        </div>
                    ) : loading ? (
                        <p>Проверка билета...</p>
                    ) : (
                        <TicketStatusMessage status={ticketStatus} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
