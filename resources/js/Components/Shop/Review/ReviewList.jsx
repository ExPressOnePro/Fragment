import React, { useState } from 'react';

export default function ReviewList({ reviews }) {
    const [isVisible, setIsVisible] = useState(false);

    if (!reviews || reviews.length === 0) {
        return <p>No reviews yet.</p>;
    }

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    return (
        <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">
                    Reviews ({reviews.length})
                </h3>
                <button
                    onClick={toggleVisibility}
                    className="text-blue-500 hover:underline"
                >
                    {isVisible ? 'Hide Reviews' : 'Show Reviews'}
                </button>
            </div>
            {isVisible && (
                <ul>
                    {reviews.map(review => (
                        <li key={review.id} className="mb-4 border-b pb-4">
                            <div className="flex items-center mb-2">
                                <span className="font-bold">
                                    {review.user?.name || 'Anonymous'}:
                                </span>
                                <span className="ml-2">{review.rating} stars</span>
                            </div>
                            <p>{review.content}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
