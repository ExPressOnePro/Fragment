import React, { useState } from 'react';
import { useForm } from '@inertiajs/inertia-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';

export default function CreateCategory({ auth }) {
    const { data, setData, errors, reset } = useForm({
        name: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/api/admin/categories', data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 201) {
                // Reset the form on success
                reset();
                alert('Category added successfully');
            }
        } catch (error) {
            console.error('Error adding category:', error.response ? error.response.data : error.message);

            // Optionally log the error to the server
            axios.post('/api/logs', { error: error.message });
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="container mx-auto p-6">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Add New Category</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Category Name</label>
                        <input
                            type="text"
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.name && <div className="text-red-600">{errors.name}</div>}
                    </div>
                    <button
                        type="submit"
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Add Category
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
