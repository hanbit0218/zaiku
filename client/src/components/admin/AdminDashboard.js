// src/components/admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

function AdminDashboard({ navigate }) {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is admin
    if (!currentUser || !currentUser.isAdmin) {
      navigate('home');
      return;
    }

    // Fetch all necessary data for admin dashboard
    const fetchAdminData = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        // Fetch products
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        const productsResponse = await fetch('http://localhost:5001/api/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const productsData = await productsResponse.json();
        setProducts(productsData);
        
        // Fetch users (admin only endpoint)
        const usersResponse = await fetch('http://localhost:5001/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!usersResponse.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const usersData = await usersResponse.json();
        setUsers(usersData);
        
        // Fetch orders
        const ordersResponse = await fetch('http://localhost:5001/api/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!ordersResponse.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const ordersData = await ordersResponse.json();
        setOrders(ordersData);
        
      } catch (error) {
        console.error('Admin dashboard data fetch error:', error);
        setError('Failed to load admin data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, [currentUser, navigate]);

  if (isLoading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-indicator">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {currentUser?.username}</p>
      </div>
      
      <div className="admin-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''} 
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'products' ? 'active' : ''} 
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''} 
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={activeTab === 'orders' ? 'active' : ''} 
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>
      
      <div className="admin-content">
        {activeTab === 'overview' && (
          <div className="admin-overview">
            <div className="stats-card">
              <h3>Products</h3>
              <p className="stat-number">{products.length}</p>
            </div>
            <div className="stats-card">
              <h3>Users</h3>
              <p className="stat-number">{users.length}</p>
            </div>
            <div className="stats-card">
              <h3>Orders</h3>
              <p className="stat-number">{orders.length}</p>
            </div>
            <div className="stats-card">
              <h3>Revenue</h3>
              <p className="stat-number">
                ${orders.reduce((total, order) => total + order.totalPrice, 0).toFixed(2)}
              </p>
            </div>
          </div>
        )}
        
        {activeTab === 'products' && (
          <div className="admin-products">
            <div className="admin-table-header">
              <h2>Products</h2>
              <button className="add-button">Add New Product</button>
            </div>
            
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>
                      <img src={product.image} alt={product.name} className="product-thumbnail" />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>
                      <button className="action-button edit">Edit</button>
                      <button className="action-button delete">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'users' && (
          <div className="admin-users">
            <h2>Users</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Admin Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.isAdmin ? 'Admin' : 'User'}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="action-button edit">Edit</button>
                      <button className="action-button delete">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'orders' && (
          <div className="admin-orders">
            <h2>Orders</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Delivered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.user?.username || 'Unknown'}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>${order.totalPrice.toFixed(2)}</td>
                    <td>{order.isPaid ? 'Yes' : 'No'}</td>
                    <td>{order.isDelivered ? 'Yes' : 'No'}</td>
                    <td>
                      <button className="action-button view">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;