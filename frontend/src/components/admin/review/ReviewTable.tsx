import { Link } from "react-router-dom";
import { ReviewType } from "../../api/reviewApi";
import { Star } from "lucide-react";

interface ReviewTableProps {
  reviews: ReviewType[];
  onDelete: (id: number | string) => void;
  onVerify: (id: number | string, verify: boolean) => void;
}

const ReviewTable: React.FC<ReviewTableProps> = ({
  reviews,
  onDelete,
  onVerify,
}) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow-lg bg-white p-4">
      <table className="min-w-full text-gray-900">
        <thead className="bg-gray-100">
          <tr>
            {[
              "Reviewer",
              "Event",
              "Date & Time",
              "Rating",
              "Is Verified",
              "Comment",
              "Actions",
            ].map((heading) => (
              <th
                key={heading}
                className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {reviews.map((review, index) => {
            return (
              <tr
                key={review.id}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="px-6 py-4">{review.user.username}</td>
                <td className="px-6 py-4">
                  <Link
                    to={`/admin/events/${review.event.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {review.event.title}
                  </Link>
                </td>
                <td className="px-6 py-4">{review.createdAt}</td>
                <td className="px-6 py-4 flex items-center">
                  {review.rating}
                  <Star
                    size={16}
                    color="black"
                    fill="gold"
                    className="ms-1"
                  ></Star>
                </td>
                <td className="px-6 py-4">
                  {review.is_moderated ? (
                    <span className="text-blue-500 text-xs font-semibold flex items-center space-x-1">
                      <span>✔</span> <span>Verified</span>
                    </span>
                  ) : (
                    <span className="text-red-500 text-xs font-semibold flex items-center space-x-1">
                      <span>✖</span> <span>Unverified</span>
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-wrap">{review.comment}</td>
                <td className="px-6 py-4 flex items-center space-x-1.5">
                  <button
                    onClick={() => onDelete(review.id)}
                    className="text-red-500 hover:underline me-3"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => onVerify(review.id, !review.is_moderated)}
                    className="text-blue-500 hover:underline"
                  >
                    {review.is_moderated ? "UnVerify" : "Verify"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewTable;
