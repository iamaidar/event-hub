interface ReviewsCardProps {

    totalReviews: number;
    averageRating: number;
    backgroundColor: string;
}

export default function ReviewsCard({ totalReviews, averageRating, backgroundColor }: ReviewsCardProps) {
    return (
        <div
            className="p-4 rounded-lg shadow-md flex flex-col grid grid-cols-2 items-center"
            style={{ backgroundColor }}
        >
            <p className="text-2xl px-32 font-bold">{totalReviews}</p>

            <p className="text-lg px-4 font-bold flex items-center mt-1">
                ⭐ {averageRating.toFixed(1)}
            </p>
            <p className="text-sm px-32 text-gray-700">reviews</p>
            <p className="text-sm px-4 text-gray-700">average rating</p>
        </div>

    );
}
