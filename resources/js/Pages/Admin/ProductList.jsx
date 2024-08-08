import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from '@inertiajs/inertia-react';
import Navbar from '../../Components/Navbar';

export default function ProductList( {auth} ) {
    const [products, setProducts] = useState([]);

    // useEffect(() => {
    //     axios.get('/api/admin/products')
    //         .then(response => {
    //             setProducts(response.data.products);
    //         })
    //         .catch(error => {
    //             console.error('Error fetching products:', error);
    //             setError('An error occurred while fetching products.');
    //
    //             // Логирование ошибки на сервер
    //             axios.post('/api/logs', { error: error.message });
    //         });
    // }, []);

    const deleteProduct = (id) => {
        axios.delete(`/api/admin/products/${id}`)
            .then(() => {
                // Удаление продукта из списка
                setProducts(products.filter(product => product.id !== id));
            })
            .catch(error => {
                // Логирование ошибки на сервер
                console.error('Error deleting product:', error);
                setError('An error occurred while deleting the product.');

                // Отправка ошибки на сервер
                axios.post('/api/logs', { error: error.message });
            });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar  user={auth.user}/>
            <div className="container mx-auto p-6">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Product List</h2>
                <Link href={route('admin.products.create')} className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Add New Product
                </Link>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <div key={product.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                            <img src={`http://127.0.0.1:8000/storage/${product.image}`} alt={product.name} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
                                <p className="text-gray-600 mt-2">{product.description}</p>
                                <p className="text-gray-800 font-bold mt-2">${product.price}</p>
                                <div className="flex mt-4 space-x-2">
                                    <Link href={`/admin/products/edit/${product.id}`} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => deleteProduct(product.id)}
                                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
