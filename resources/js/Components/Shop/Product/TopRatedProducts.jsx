import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard.jsx';

export default function TopRatedProducts() {
    const [topRatedProducts, setTopRatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/top-rated-products')
            .then(response => {
                const products = response.data.top_rated_products || [];
                setTopRatedProducts(products);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching top rated products:', error);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-center text-gray-700">Loading...</div>;

    return (
        <div className="mt-8 mb-8 p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-center mb-6 text-indigo-600">Top 3 Rated Products</h3>
            <div className="flex flex-wrap -mx-4">
                {topRatedProducts.length > 0 ? (
                    topRatedProducts.map(product => (
                        <div key={product.id} className="w-full md:w-1/2 lg:w-1/3 px-4 mb-6">
                            <ProductCard product={product}/>
                        </div>
                    ))
                ) : (
                    <p className="w-full text-center text-gray-700">No top rated products available.</p>
                )}
            </div>
        </div>
    );
}
