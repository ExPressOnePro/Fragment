import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import Navbar from '../../Components/Navbar';

export default function Checkout() {
    const handleSubmit = (e) => {
        e.preventDefault();
        Inertia.post('/api/checkout');
    };

    return (
        <div>
            <Navbar />
            <h2>Checkout</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Address</label>
                    <input type="text" required />
                </div>
                <button type="submit">Place Order</button>
            </form>
        </div>
    );
}
