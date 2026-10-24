import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const FilterSidebar = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        category: "",
        color: "",
        size: [],
        material: [],
        region: [],
        minPrice: 0,
        maxPrice: 1000,
    });

    const [priceRange, setPriceRange] = useState([0, 1000]);

    const categories = ["Fruits" ,"Vegetables", "Grains"];
    const colors = [
        "Red", "Blue", "Black", "Green", "Grey",
        "White", "Pink", "Beige", "Navy","default"
    ];
    const sizes = ["5 KG", "10 KG", "20 KG", "50 KG", "70 KG"];
    const materials = ["Organic", "Conventional", "Mixed/Other"];
    const regions = [
        "North India", "South India", "East India",
        "West India", "Central India", "North-East India",
    ];

    useEffect(() => {
        const params = Object.fromEntries([...searchParams]);
        setFilters({
            category: params.category || "",
            color: params.color || "",
            size: params.size ? params.size.split(",") : [],
            material: params.material ? params.material.split(",") : [],
            region: params.region ? params.region.split(",") : [],
            minPrice: params.minPrice || 0,
            maxPrice: params.maxPrice || 1000,
        });
        setPriceRange([0, params.maxPrice || 1000]);
    }, [searchParams]);

    const handleFilterChange = (e) => {
        const { name, value, checked, type } = e.target;
        let newFilters = { ...filters };

        if (type === "checkbox") {
            if (checked) {
                newFilters[name] = [...(newFilters[name] || []), value];
            } else {
                newFilters[name] = newFilters[name].filter(item => item !== value);
            }
        } else {
            newFilters[name] = value;
        }

        setFilters(newFilters);
        updateURLParams(newFilters);
    };

    const updateURLParams = (newFilters) => {
        const params = new URLSearchParams();
        Object.keys(newFilters).forEach((key) => {
            if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
                params.append(key, newFilters[key].join(","));
            } else if (newFilters[key]) {
                params.append(key, newFilters[key]);
            }
        });
        setSearchParams(params);
        navigate(`?${params.toString()}`);
    };

    const handlePriceChange = (e) => {
        const newPrice = e.target.value;
        setPriceRange([0, newPrice]);
        const newFilters = { ...filters, minPrice: 0, maxPrice: newPrice };
        setFilters(newFilters);
        updateURLParams(newFilters);
    };

    return (
        <div className="p-4">
            <h3 className="text-xl font-medium mb-4 text-gray-800">Filter</h3>

            {/* Category Filter */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Category</label>
                {categories.map((category) => (
                    <div key={category} className="flex items-center mb-1">
                        <input
                            type="radio"
                            name="category"
                            value={category}
                            onChange={handleFilterChange}
                            checked={filters.category === category}
                            className="mr-2 h-4 w-4 text-paddy focus:ring-paddy border-gray-300"
                        />
                        <span className="text-gray-700">{category}</span>
                    </div>
                ))}
            </div>

            {/* Color Filter */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Color</label>
                <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                        <button
                            key={color}
                            type="button"
                            name="color"
                            value={color}
                            onClick={(e) => handleFilterChange({ target: { name: "color", value: color, type: "text" } })}
                            className={`w-8 h-8 rounded-full border border-gray-300 cursor-pointer transition hover:scale-105 ${
                                filters.color === color ? "ring-2 ring-blue-500" : ""
                            }`}
                            style={{ backgroundColor: color.toLowerCase() }}
                        />
                    ))}
                </div>
            </div>

            {/* Size Filter */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Size</label>
                {sizes.map((size) => (
                    <div key={size} className="flex items-center mb-1">
                        <input
                            type="checkbox"
                            name="size"
                            value={size}
                            onChange={handleFilterChange}
                            checked={filters.size.includes(size)}
                            className="mr-2 h-4 w-4 text-paddy focus:ring-paddy border-gray-300"
                        />
                        <span className="text-gray-700">{size}</span>
                    </div>
                ))}
            </div>

            {/* Material Filter */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Material</label>
                {materials.map((material) => (
                    <div key={material} className="flex items-center mb-1">
                        <input
                            type="checkbox"
                            name="material"
                            value={material}
                            onChange={handleFilterChange}
                            checked={filters.material.includes(material)}
                            className="mr-2 h-4 w-4 text-paddy focus:ring-paddy border-gray-300"
                        />
                        <span className="text-gray-700">{material}</span>
                    </div>
                ))}
            </div>

            {/* Region Filter */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Region</label>
                {regions.map((region) => (
                    <div key={region} className="flex items-center mb-1">
                        <input
                            type="checkbox"
                            name="region"
                            value={region}
                            onChange={handleFilterChange}
                            checked={filters.region.includes(region)}
                            className="mr-2 h-4 w-4 text-paddy focus:ring-paddy border-gray-300"
                        />
                        <span className="text-gray-700">{region}</span>
                    </div>
                ))}
            </div>

            {/* Price Range Filter */}
            <div className="mb-8">
                <label className="block text-gray-600 font-medium mb-2">Price Range</label>
                <input
                    type="range"
                    name="priceRange"
                    min={0}
                    max={1000}
                    value={priceRange[1]}
                    onChange={handlePriceChange}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-gray-600 mt-2">
                    <span>Rs 0</span>
                    <span>Rs {priceRange[1]}</span>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;
