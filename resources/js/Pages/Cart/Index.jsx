import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../Components/Navbar';

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        axios.get('/api/cart').then(response => {
            setCartItems(response.data.cartItems);
            calculateTotal(response.data.cartItems);
        }).catch(error => {
            console.error('Error fetching cart items:', error.response?.data || error.message);
        });
    }, []);

    const handleQuantityChange = (id, quantity) => {
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, quantity: parseInt(quantity, 10) } : item
        ));
        calculateTotal(cartItems.map(item =>
            item.id === id ? { ...item, quantity: parseInt(quantity, 10) } : item
        ));
    };

    const calculateTotal = (items) => {
        const totalAmount = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
        setTotal(totalAmount.toFixed(2));
    };

    const handleCheckout = () => {
        Inertia.post('/api/checkout');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold mb-6 text-center">Cart</h2>
                <div className="flex flex-col lg:flex-row">
                    <div className="w-full lg:w-2/3">
                        {cartItems.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">Your cart is empty.</div>
                        ) : (
                            <ul className="bg-white shadow-md rounded-lg divide-y divide-gray-200">
                                {cartItems.map(item => (
                                    <li key={item.id} className="p-4 flex items-center">
                                        <img
                                            src={`http://127.0.0.1:8000/storage/${item.product.image}`}
                                            alt={item.product.name}
                                            className="w-24 h-24 object-cover rounded-md"
                                        />
                                        <div className="ml-4 flex-1">
                                            <h3 className="text-lg font-semibold">{item.product.name}</h3>
                                            <p className="text-gray-600">{item.product.description}</p>
                                            <div className="flex items-center mt-2">
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                                                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded-l-md"
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                    className="w-16 text-center border-gray-300 rounded-md"
                                                />
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded-r-md"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <div className="ml-4 flex items-center">
                                            <span className="text-lg font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="w-full lg:w-1/3 mt-6 lg:mt-0 lg:ml-6">
                        <div className="bg-white shadow-md rounded-lg p-4">
                            <h3 className="text-lg font-semibold mb-4">Summary</h3>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Total:</span>
                                <span className="font-semibold">${total}</span>
                            </div>
                            <button
                                onClick={handleCheckout}
                                className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
