// src/Pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductItem from "@/Components/Shop/ProductItem.jsx";
import OrderItem from "@/Components/Shop/OrderItem.jsx";
import Navbar from "@/Components/Navbar.jsx";
import {Link} from "@inertiajs/react";


export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productsResponse = await axios.get('/api/admin/products');
                setProducts(productsResponse.data.products);
                const ordersResponse = await axios.get('/api/admin/orders');
                setOrders(ordersResponse.data.orders);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleDeleteProduct = async (id) => {
        try {
            await axios.delete(`/api/admin/products/${id}`);
            setProducts(products.filter(product => product.id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    return (
        <div>
            <Navbar />
            <h2>Admin Dashboard</h2>
            <h3>Products</h3>
            <Link href="/admin/products/create">Add New Product</Link>
            <ul>
                {products.map(product => (
                    <ProductItem key={product.id} product={product} onDelete={handleDeleteProduct} />
                ))}
            </ul>
            <h3>Orders</h3>
            <ul>
                {orders.map(order => (
                    <OrderItem key={order.id} order={order} />
                ))}
            </ul>
        </div>
    );
}
