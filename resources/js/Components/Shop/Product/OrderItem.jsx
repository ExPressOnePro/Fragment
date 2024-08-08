// src/Components/OrderItem.jsx

import React from 'react';

const OrderItem = ({ order }) => (
    <li key={order.id}>Order #{order.id} - ${order.total}</li>
);

export default OrderItem;
