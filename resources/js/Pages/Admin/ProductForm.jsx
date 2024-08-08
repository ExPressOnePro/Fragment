import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../Components/Navbar';

export default function ProductForm({ product = {} }) {
    const [name, setName] = useState(product.name || '');
    const [description, setDescription] = useState(product.description || '');
    const [price, setPrice] = useState(product.price || '');
    const [categoryId, setCategoryId] = useState(product.category_id || '');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Fetch categories for the dropdown
        axios.get('/api/admin/categories')
            .then(response => {
                setCategories(response.data.categories);
            })
            .catch(error => {
                console.error('Error fetching categories:', error.response?.data || error.message);
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({}); // Очистка ошибок перед отправкой формы

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('category_id', categoryId);
        if (image) formData.append('image', image);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setErrors({ global: 'No token found.' });
                setLoading(false);
                return;
            }

            const response = product.id
                ? await axios.post(`/api/admin/products/${product.id}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                })
                : await axios.post('/api/admin/products', formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });

            window.location.href = '/shop';
        } catch (error) {
            console.error('Error submitting form:', error.response?.data || error.message);
            setErrors(error.response?.data.errors || { global: 'Error submitting form. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-4">{product.id ? 'Edit Product' : 'Create Product'}</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        {errors.description && <p className="text-red-600 text-sm">{errors.description}</p>}
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                        <input
                            id="price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        {errors.price && <p className="text-red-600 text-sm">{errors.price}</p>}
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                            id="category"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="" disabled>Select a category</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.category_id && <p className="text-red-600 text-sm">{errors.category_id}</p>}
                    </div>
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
                        <input
                            id="image"
                            type="file"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="mt-1 block w-full"
                        />
                        {errors.image && <p className="text-red-600 text-sm">{errors.image}</p>}
                    </div>
                    <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : (product.id ? 'Update Product' : 'Create Product')}
                    </button>
                    {errors.global && <p className="mt-4 text-red-600">{errors.global}</p>}
                </form>
            </div>
        </div>
    );
}
