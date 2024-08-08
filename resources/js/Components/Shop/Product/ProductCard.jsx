import React from 'react';
import { Link } from '@inertiajs/inertia-react';

export default function ProductCard({ product }) {
    // Функция для расчета среднего рейтинга
    const calculateAverageRating = (reviews) => {
        if (!reviews || reviews.length === 0) return 0;
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (totalRating / reviews.length).toFixed(1);
    };

    const averageRating = calculateAverageRating(product.reviews);

    return (
        <div className="border rounded-lg shadow-lg overflow-hidden bg-white transform transition-transform duration-300 hover:scale-105">
            <Link href={`/products/${product.id}`}>
                <img
                    src={`http://127.0.0.1:8000/storage/${product.image}`}
                    alt={product.name}
                    className="w-full h-48 object-cover cursor-pointer"
                />
            </Link>
            <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{product.name}</h2>
                <p className="text-gray-700 mb-2 truncate">
                    {product.description.length > 100 ? product.description.slice(0, 100) + '...' : product.description}
                </p>
                <p className="text-green-600 font-semibold mb-2">${product.price}</p>
                <div className="flex items-center mb-2">
                    <span className="text-yellow-500">
                        {'★'.repeat(Math.round(averageRating))}
                        {'☆'.repeat(5 - Math.round(averageRating))}
                    </span>
                    <span className="ml-2 text-gray-600">({averageRating} / 5)</span>
                </div>
            </div>
        </div>
    );
}
