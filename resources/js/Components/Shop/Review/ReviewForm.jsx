import React, { useState } from 'react';
import axios from 'axios';
import RatingSelector from "@/Components/Shop/Review/RatingSelector.jsx";

export default function ReviewForm({ productId, onReviewSubmitted }) {
    const [rating, setRating] = useState(1);
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        if (!token) {
            setError('User is not authenticated. Please log in.');
            return;
        }

        try {
            const response = await axios.post('/api/reviews',
                { product_id: productId, rating, content },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (onReviewSubmitted) onReviewSubmitted(response.data.review);
            setRating(1);
            setContent('');
        } catch (error) {
            console.error('Error submitting review:', error.response?.data || error.message);
            setError('Error submitting review.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            {error && <p className="text-red-600">{error}</p>}
            <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating</label>
                <RatingSelector rating={rating} setRating={setRating} />
            </div>
            <div className="mt-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows="4"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
            </div>
            <button
                type="submit"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
                Submit Review
            </button>
        </form>
    );
}
