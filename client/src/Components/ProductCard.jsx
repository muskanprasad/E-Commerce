import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    return (
    <div className="product-card">
        <img src={product.imageUrl} alt={product.name} />
        <div className="product-card-details">
            <h3>{product.name}</h3>
            <p>{product.category}</p>
            <p>{product.brand}</p>
            <p className="price">${product.price.toFixed(2)}</p>
        </div>
    </div>
    );
};

export default ProductCard;