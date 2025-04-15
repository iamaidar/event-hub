import { useState } from "react";
import Button from "../../UI/Button";
import Modal from "../../components/Modal";

interface Review {
  user: { username: string };
  rating: number;
  comment?: string;
}

interface ReviewsSummaryProps {
  reviews: Review[];
}

const ReviewsSummary = ({ reviews }: ReviewsSummaryProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  const handleSubmit = () => {
    setModalOpen(false);
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
        text="Оцените сейчас"
        onClick={() => setModalOpen(true)}
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Оставить отзыв</h2>
        <div className="flex mb-4">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-3xl cursor-pointer ${
                i < rating ? "text-yellow-400" : "text-gray-300"
              }`}
              onClick={() => setRating(i + 1)}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          className="w-full p-2 border rounded-md"
          placeholder="Напишите ваш отзыв..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button
          className="mt-4 bg-purple-500 text-white px-4 py-2 rounded-xl"
          text="Отправить"
          onClick={handleSubmit}
        />
      </Modal>
    </div>
  );
};

export default ReviewsSummary;
