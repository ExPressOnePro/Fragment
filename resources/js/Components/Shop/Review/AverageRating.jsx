import React from 'react';

export default function AverageRating({ rating }) {
    const roundedRating = Math.round(rating * 10) / 10; // Округление до 1 знака после запятой

    return (
        <div className="flex items-center space-x-2">
            <span className="font-bold text-xl">Average Rating:</span>
            <span className="text-yellow-500">{'★'.repeat(Math.floor(roundedRating))}</span>
            <span className="text-gray-300">{'★'.repeat(5 - Math.floor(roundedRating))}</span>
            <span className="ml-2 text-gray-600">({roundedRating})</span>
        </div>
    );
}
