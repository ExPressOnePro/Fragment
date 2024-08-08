import React, { useState, useEffect } from 'react';

export default function ProductFilter({ categories, setCategoryFilter }) {
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        // Передача выбранных категорий в родительский компонент
        setCategoryFilter(selectedCategories);
    }, [selectedCategories, setCategoryFilter]);

    const handleCategoryChange = (categoryId) => {
        setSelectedCategories(prevSelected =>
            prevSelected.includes(categoryId)
                ? prevSelected.filter(id => id !== categoryId)
                : [...prevSelected, categoryId]
        );
    };

    return (
        <div className="mb-4">
            <div className="flex flex-col">
                <label className="font-semibold mb-2">Filter by Category:</label>
                <div className="space-y-2">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={selectedCategories.length === 0}
                            onChange={() => setSelectedCategories([])}
                            className="form-checkbox"
                        />
                        <span className="ml-2">All Categories</span>
                    </label>
                    {categories.map(category => (
                        <label key={category.id} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(category.id)}
                                onChange={() => handleCategoryChange(category.id)}
                                className="form-checkbox"
                            />
                            <span className="ml-2">{category.name}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
