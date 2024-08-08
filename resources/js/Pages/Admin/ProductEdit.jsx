import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductForm from './ProductForm';
import Navbar from '../../Components/Navbar';

export default function ProductEdit({ id }) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found.');
            setLoading(false);
            return;
        }

        axios.get(`/api/admin/products/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            setProduct(response.data.product);
        }).catch(error => {
            setError('Error fetching product.');
        }).finally(() => {
            setLoading(false);
        });
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!product) return <div>Product not found.</div>;

    return (
        <div>
            <ProductForm product={product} />
        </div>
    );
}
