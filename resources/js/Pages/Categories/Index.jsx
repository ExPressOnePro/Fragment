import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/inertia-react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth }) {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('/api/admin/categories')
            .then(response => {
                setCategories(response.data.categories);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
                setError('An error occurred while fetching categories.');

                // Логирование ошибки на сервер
                axios.post('/api/logs', { error: error.message });
            });
    }, []);

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="container mx-auto p-6">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Categories</h2>
                <Link href={route('admin.categories.create')} className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Add New Category
                </Link>
                {error && <div className="text-red-600">{error}</div>}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map(category => (
                        <div key={category.id} className="bg-white shadow-lg rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
