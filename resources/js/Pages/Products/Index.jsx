import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ProductFilter from "@/Components/Shop/Product/ProductFilter.jsx";
import ProductCard from "@/Components/Shop/Product/ProductCard.jsx";
import TopRatedProducts from "@/Components/Shop/Product/TopRatedProducts.jsx";
import SearchBar from "@/Components/Shop/SearchBar.jsx";

export default function Products({ auth }) {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [sortOrder, setSortOrder] = useState('desc');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Загрузка продуктов
        axios.get('/api/products').then(response => {
            setProducts(response.data.products);
        });

        // Загрузка категорий
        axios.get('/api/categories').then(response => {
            setCategories(response.data.categories);
        });
    }, []);

    // Фильтрация продуктов по выбранным категориям
    const filteredProducts = products.filter(product =>
        selectedCategories.length === 0 || selectedCategories.includes(product.category_id)
    );

    // Сортировка продуктов по рейтингу
    const sortedProducts = filteredProducts.sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.average_rating - b.average_rating;
        }
        return b.average_rating - a.average_rating;
    });

    // Обработка поиска
    const handleSearch = (query) => {
        setLoading(true);
        axios.get(`/api/search?query=${query}`)
            .then(response => {
                setProducts(response.data.products);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error searching products:', error);
                setError('Error searching products.');
                setLoading(false);
            });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Shop</h2>}
        >
            <div className="container mx-auto px-4 flex flex-col md:flex-row">
                <div className="w-full md:w-1/4 p-4">
                    <ProductFilter
                        categories={categories}
                        selectedCategories={selectedCategories}
                        setCategoryFilter={setSelectedCategories}
                    />
                    <div className="mt-4">
                        <button
                            onClick={() => setSortOrder('asc')}
                            className={`w-full py-2 mb-2 rounded ${sortOrder === 'asc' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            Sort by Rating: Low to High
                        </button>
                        <button
                            onClick={() => setSortOrder('desc')}
                            className={`w-full py-2 rounded ${sortOrder === 'desc' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            Sort by Rating: High to Low
                        </button>
                    </div>
                </div>
                <div className="w-full md:w-3/4 p-4">
                    <SearchBar onSearch={handleSearch} />
                    {loading ? (
                        <div className="text-center text-gray-700">Loading...</div>
                    ) : error ? (
                        <div className="text-center text-red-600">{error}</div>
                    ) : (
                        <div className="flex flex-wrap -mx-4">
                            {sortedProducts.map(product => (
                                <div key={product.id} className="w-full md:w-1/2 lg:w-1/3 px-4 mb-4">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    )}
                    <TopRatedProducts />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
