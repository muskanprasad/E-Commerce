require('dotenv').config(); 
const mongoose = require('mongoose');
const Product = require('./models/Product'); 
const connectDB = require('./config/db'); 


connectDB();

const products = [
    {
        name: 'Gaming Laptop',
        description: 'High-performance laptop for serious gamers. Features a powerful GPU and fast processor.',
        price: 1500,
        category: 'Electronics',
        brand: 'Acer',
        imageUrl: 'https://images.unsplash.com/photo-1541807055898-0c6a2e48545b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        stock: 10
    },
    {
        name: 'Wireless Headphones',
        description: 'Noise-cancelling over-ear headphones with long battery life. Perfect for travel and daily commute.',
        price: 200,
        category: 'Electronics',
        brand: 'Sony',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06a244?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        stock: 25
    },
    {
        name: 'Ergonomic Office Chair',
        description: 'Comfortable and supportive chair designed for long hours of work. Adjustable features for personalized comfort.',
        price: 350,
        category: 'Home & Office',
        brand: 'Herman Miller',
        imageUrl: 'https://images.unsplash.com/photo-1567538177694-de447ed9269d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        stock: 15
    },
    {
        name: 'Smartwatch',
        description: 'Track your fitness, receive notifications, and make calls from your wrist. Water-resistant design.',
        price: 180,
        category: 'Electronics',
        brand: 'Apple',
        imageUrl: 'https://images.unsplash.com/photo-1579586326002-39c279430c5e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        stock: 30
    },
    {
        name: 'Running Shoes',
        description: 'Lightweight and breathable running shoes with excellent cushioning. Ideal for daily runs.',
        price: 90,
        category: 'Footwear',
        brand: 'Nike',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-79eddc872739?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        stock: 50
    },
    {
        name: 'Coffee Maker',
        description: 'Automatic drip coffee maker with a 12-cup capacity. Programmable settings for fresh coffee every morning.',
        price: 75,
        category: 'Home & Kitchen',
        brand: 'Keurig',
        imageUrl: 'https://images.unsplash.com/photo-1533800684138-b71569a473f3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        stock: 20
    },
    {
        name: 'Digital Camera',
        description: 'Mirrorless camera with 4K video recording and high-resolution stills. Perfect for aspiring photographers.',
        price: 950,
        category: 'Electronics',
        brand: 'Canon',
        imageUrl: 'https://images.unsplash.com/photo-1520393662363-f7d73010b503?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        stock: 8
    },
    {
        name: 'Yoga Mat',
        description: 'Non-slip, extra-thick yoga mat for comfortable workouts. Lightweight and easy to carry.',
        price: 30,
        category: 'Sports & Outdoors',
        brand: 'Lululemon',
        imageUrl: 'https://images.unsplash.com/photo-1591244304897-4b77f98ee52c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        stock: 40
    },
    {
        name: 'Bluetooth Speaker',
        description: 'Portable Bluetooth speaker with rich bass and clear audio. Water-resistant for outdoor use.',
        price: 80,
        category: 'Electronics',
        brand: 'JBL',
        imageUrl: 'https://images.unsplash.com/photo-1629853385750-f896c341142f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        stock: 35
    },
    {
        name: 'Cookware Set',
        description: '10-piece non-stick cookware set including frying pans, saucepans, and Dutch oven. Dishwasher safe.',
        price: 250,
        category: 'Home & Kitchen',
        brand: 'T-fal',
        imageUrl: 'https://images.unsplash.com/photo-1549488344-9333a391515f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        stock: 12
    }
];

const importData = async () => {
    try {
        await Product.deleteMany(); // Clears all existing products before adding new ones
        await Product.insertMany(products); // Inserts the array of products

        console.log('Data Imported!');
        process.exit(); // Exits the process
    } catch (error) {
        console.error(`${error}`);
        process.exit(1); // Exits with an error code
    }
};

const destroyData = async () => {
    try {
        await Product.deleteMany(); // Clears all products from the database

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

// This checks command line arguments to decide whether to import or destroy data
// To import: node seeder.js -i
// To destroy: node seeder.js -d
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}