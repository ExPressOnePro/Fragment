// src/Components/ProductItem.jsx

import React from 'react';
import { Link } from '@inertiajs/inertia-react';

const ProductItem = ({ product, onDelete }) => (
    <li key={product.id}>
        {product.name} - ${product.price}
        <Link href={`/admin/products/edit/${product.id}`}>Edit</Link>
        <button onClick={() => onDelete(product.id)}>Delete</button>
    </li>
);

export default ProductItem;
