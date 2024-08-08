import React, { useState } from 'react';
import axios from 'axios';

export default function RatingSelector({ productId, onRatingSubmitted }) {
    const [rating, setRating] = useState(1);
    const [error, setError] = useState(null);

    const handleRatingChange = async (newRating) => {
        const token = localStorage.getItem('token');

        if (!token) {
            setError('User is not authenticated. Please log in.');
            return;
        }

        try {
            const response = await axios.post('/api/reviews',
                { product_id: productId, rating: newRating },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (onRatingSubmitted) onRatingSubmitted(response.data.review);
        } catch (error) {
            console.error('Error submitting rating:', error.response?.data || error.message);
            setError('Error submitting rating.');
        }
    };

    return (
        <div className="flex items-center space-x-2">
            {error && <p className="text-red-600">{error}</p>}
            {[1, 2, 3, 4, 5].map(num => (
                <span
                    key={num}
                    onClick={() => handleRatingChange(num)}
                    className={`cursor-pointer text-yellow-400 ${num <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                    role="button"
                >
                    ★
                </span>
            ))}
        </div>
    );
}
