import { useEffect, useState } from "react";
import {
  deleteReview,
  fetchAllPaginatedReviews,
  ReviewType,
  updateReview,
} from "../../../api/reviewApi";
import ReviewTable from "../../../components/admin/review/ReviewTable";

const ReviewList: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const loadReviews = (page: number) => {
    setLoading(true);
    fetchAllPaginatedReviews(page, 10)
      .then((result) => {
        setReviews(result.data);
        setCurrentPage(result.page);
        setTotalPages(result.totalPages);
        setLoading(false);
      })
      .catch(() => {
        setError("Error loading reviews");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadReviews(currentPage);
  }, [currentPage]);

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleDelete = (id: number | string) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      deleteReview(id)
        .then(() => {
          setReviews(reviews.filter((review) => review.id !== id));
        })
        .catch(() => {
          alert("Error deleting review");
        });
    }
  };

  const handleVerifyUnverify = (id: number | string, verify: boolean) => {
    if (window.confirm("Are you sure you want to confirm this review?")) {
      updateReview(id, { is_moderated: verify })
        .then(() => {
          console.log("✅ Review verified successfully!");
          loadReviews(currentPage);
        })
        .catch(() => {
          alert("Error deleting review");
        });
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (error) {
    <div className="container mx-auto px-4 py-8 text-red-800">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-start mb-4">
        <h1 className="text-2xl font-bold">Reviews</h1>
      </div>

      <ReviewTable
        reviews={reviews}
        onDelete={handleDelete}
        onVerify={handleVerifyUnverify}
      ></ReviewTable>

      <div className="flex items-center justify-center mt-8 space-x-4">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded-2xl disabled:opacity-50"
        >
          Previous
        </button>
        <div className="flex space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-white text-black"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded-2xl disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ReviewList;
