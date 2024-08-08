import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ReviewForm from "@/Components/Shop/Review/ReviewForm.jsx";
import RatingSelector from "@/Components/Shop/Review/RatingSelector.jsx";
import ReviewList from "@/Components/Shop/Review/ReviewList.jsx";
import AverageRating from "@/Components/Shop/Review/AverageRating.jsx";


export default function ProductShow({ id, auth }) {
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios.get(`/api/products/${id}`)
            .then(response => {
                setProduct(response.data.product);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching product data:', error);
                setError('Error fetching product data.');
                setLoading(false);
            });
    }, [id]);

    const addToCart = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            setError('User is not authenticated. Please log in.');
            return;
        }

        try {
            const response = await axios.post('/api/cart',
                { product_id: product.id, quantity },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setMessage('Product added to cart!');
        } catch (error) {
            console.error('Error adding product to cart:', error.response);
            setError(`Error adding product to cart: ${error.response?.data?.message || 'Unknown error'}`);
        }
    };

    const handleReviewSubmitted = (review) => {
        setProduct(prevProduct => ({
            ...prevProduct,
            reviews: prevProduct.reviews ? [...prevProduct.reviews, review] : [review]
        }));
    };

    const calculateAverageRating = (reviews) => {
        if (!reviews || reviews.length === 0) return 0;

        const total = reviews.reduce((sum, review) => sum + review.rating, 0);
        return total / reviews.length;
    };

    const averageRating = product ? calculateAverageRating(product.reviews) : 0;

    if (loading) return <div className="text-center text-gray-700">Loading...</div>;
    if (error) return <div className="text-center text-red-600">{error}</div>;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Product {product.name}</h2>}
        >
            <div className="container mx-auto px-4 py-6">
                {product && (
                    <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg p-6">
                        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                            <img
                                src={`http://127.0.0.1:8000/storage/${product.image}`}
                                alt={product.name}
                                className="w-full h-96 object-cover rounded-lg"
                            />
                        </div>
                        <div className="flex-1">
                            <RatingSelector productId={id} onRatingSubmitted={handleReviewSubmitted} />
                            <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
                            <p className="text-gray-700 mb-4">{product.description}</p>
                            <p className="text-green-600 font-semibold text-xl mb-4">${product.price}</p>
                            <AverageRating rating={averageRating} />
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Quantity</label>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    min="1"
                                    className="border rounded px-4 py-2 w-full"
                                />
                            </div>
                            <button
                                onClick={addToCart}
                                className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition duration-300"
                            >
                                Add to Cart
                            </button>
                            {message && <p className="mt-4 text-green-600">{message}</p>}
                        </div>
                    </div>
                )}
                <ReviewList reviews={product?.reviews || []} />
                {auth.user && <ReviewForm productId={id} onReviewSubmitted={handleReviewSubmitted} />}
            </div>
        </AuthenticatedLayout>
    );
}
