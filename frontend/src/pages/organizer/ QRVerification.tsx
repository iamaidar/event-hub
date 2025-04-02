import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "../../UI/QrCard.tsx";
import TicketStatusMessage from "../../UI/TicketStatus.tsx";
import { verifyTicket, markTicketUsed } from "../../api/ticketApi";

type TicketData = {
    ticket: {
        is_used: boolean;
        order: {
            user: {
                email: string;
            };
            event: {
                title: string;
                date_time: string;
            };
        };
    };
};

export default function QRVerification() {
    const { id } = useParams<{ id: string }>();
    const [ticketStatus, setTicketStatus] = useState<"valid" | "used" | "invalid" | "expired" | null>(null);
    const [ticketData, setTicketData] = useState<TicketData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleVerifyTicket = async (code: string) => {
        setLoading(true);
        setError("");
        setTicketStatus(null);
        setTicketData(null);

        try {
            const data = await verifyTicket(code);
            setTicketData(data);
            setTicketStatus(data.ticket.is_used ? "used" : "valid");
        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.message || err.message;
            if (msg === "Event is already over") {
                setTicketStatus("expired");
            } else if (msg === "Ticket already used") {
                setTicketStatus("used");
            } else {
                setTicketStatus("invalid");
            }
            setError(msg || "Ticket verification failed");
        } finally {
            setLoading(false);
        }
    };

    const handleMarkUsed = async () => {
        if (!id || !ticketData) return;
        setLoading(true);

        try {
            await markTicketUsed(id);
            setTicketStatus("used");
            setTicketData(prev =>
                prev
                    ? {
                        ticket: {
                            ...prev.ticket,
                            is_used: true,
                        },
                    }
                    : prev
            );
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || err.message || "Failed to mark ticket as used");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) handleVerifyTicket(id);
    }, [id]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <Card className="p-6 text-center shadow-lg rounded-2xl bg-white w-96">
                <CardContent>
                    {loading ? (
                        <p>Verifying ticket...</p>
                    ) : ticketStatus === null ? (
                        <p>No ticket code provided</p>
                    ) : ticketStatus === "invalid" ? (
                        <>
                            <TicketStatusMessage status={ticketStatus} />
                            {error && <p className="text-red-500 mt-4">{error}</p>}
                        </>
                    ) : (
                        <>
                            {ticketStatus === "valid" && <TicketStatusMessage status="valid" />}
                            {ticketStatus === "expired" && <TicketStatusMessage status="expired" />}
                            {ticketStatus === "used" && <TicketStatusMessage status="used" />}

                            {ticketData && (
                                <div className="text-left mt-4">
                                    <p><strong>User Email:</strong> {ticketData.ticket.order.user.email}</p>
                                    <p><strong>Event:</strong> {ticketData.ticket.order.event.title}</p>
                                    <p><strong>Date:</strong> {new Date(ticketData.ticket.order.event.date_time).toLocaleString()}</p>
                                    <p><strong>Status:</strong> {ticketData.ticket.is_used ? "Already used" : "Not yet used"}</p>
                                </div>
                            )}

                            {ticketStatus === "valid" && (
                                <button
                                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded w-full"
                                    onClick={handleMarkUsed}
                                    disabled={loading}
                                >
                                    Mark as used
                                </button>
                            )}

                            {error && <p className="text-red-500 mt-4">{error}</p>}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
