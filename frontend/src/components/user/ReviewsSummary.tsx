import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../UI/Button";
import Modal from "../../components/Modal";
import { createReview } from "../../api/reviewApi";
import { useAuth } from "../../hooks/useAuth";

interface Review {
    user: { username: string };
    rating: number;
    comment?: string;
}

interface ReviewsSummaryProps {
    event_id: number;
    reviews: Review[];
    onReviewAdded?: () => void;
}

const ReviewsSummary = ({
                            reviews,
                            event_id,
                            onReviewAdded,
                        }: ReviewsSummaryProps) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const navigate = useNavigate();
    const { user } = useAuth();

    const averageRating =
        reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
            : 0;

    const handleSubmit = async () => {
        try {
            await createReview({ rating, comment, event_id });
            setModalOpen(false);
            setRating(0);
            setComment("");
            if (onReviewAdded) onReviewAdded();
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };

    const handleRateClick = () => {
        if (!user) {
            navigate("/login");
        } else {
            setModalOpen(true);
        }
    };

    return (
        <div className="mt-2 max-w-md flex items-center justify-between bg-purple-100 rounded-2xl p-4">
            <div className="flex items-center text-yellow-400 text-2xl">
                {[...Array(5)].map((_, i) => (
                    <span key={i}>{i < Math.floor(averageRating) ? "★" : "☆"}</span>
                ))}
                <span className="text-xl font-semibold text-black ml-3">
          {averageRating.toFixed(1)}/5
        </span>
            </div>
            <Button
                className="bg-purple-500 text-white px-4 py-2 rounded-xl"
                text="Rate now"
                onClick={handleRateClick}
            />

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                <div className="max-w-md w-full mx-auto p-6">
                    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Leave feedback</h2>

                    <div className="flex justify-center mb-6">
                        {[...Array(5)].map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                className={`text-4xl mx-1 transition-transform hover:scale-110 ${
                                    i < rating ? "text-yellow-400" : "text-gray-200"
                                }`}
                                onClick={() => setRating(i + 1)}
                                aria-label={`Grade ${i + 1}`}
                            >
                                ★
                            </button>
                        ))}
                    </div>

                    <textarea
                        className="w-full p-4 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors duration-200 mb-4"
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />

                    <button
                        onClick={handleSubmit}
                        disabled={!rating || !comment.trim()}
                        className={`w-full py-3 px-6 rounded-xl font-medium text-white transition-all ${
                            rating && comment.trim()
                                ? "bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg"
                                : "bg-gray-300 cursor-not-allowed"
                        }`}
                    >
                        Send feedback
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default ReviewsSummary;
