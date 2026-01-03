import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { adminAPI } from '../services/adminAPI';
import StatsCards from '../components/dashboard/StatsCards';
import QuickStats from '../components/dashboard/QuickStats';
import PendingProducts from '../components/PendingProducts';
import ProductList from '../components/ProductList';
import InquiryList from '../components/InquiryList';

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tab = searchParams.get('tab') || 'overview';
    setActiveTab(tab);
    loadDashboardData();
  }, [searchParams]);

  const loadDashboardData = async () => {
    try {
      const statsData = await adminAPI.getTotalStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'pending', label: 'Pending Approval' },
    { id: 'products', label: 'All Products' },
    { id: 'inquiries', label: 'Inquiries' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to your admin control panel</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">

          {/* Add Product */}
          <Link
            to="/admin/post-product"
            className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg font-medium hover:bg-purple-100 transition-colors"
          >
            Add Product
          </Link>

          {/* Add Ads */}
          <Link
            to="/admin/post-ads"
            className="px-4 py-2 bg-green-50 text-green-600 rounded-lg font-medium hover:bg-green-100 transition-colors"
          >
            Add Ads
          </Link>
          {/* Refresh Data */}
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors"
          >
            Refresh Data
          </button>

          

          
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {activeTab === 'overview' && (
          <>
            <StatsCards stats={stats} />
            <QuickStats stats={stats} />

            {/* Recent Activity */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                <button className="text-primary-600 hover:text-primary-700 font-medium">
                  View All Activity
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { action: 'Product approved', user: 'iPhone 13 Pro', time: 'Just now' },
                  { action: 'New user registered', user: 'john.doe@email.com', time: '5 min ago' },
                  { action: 'Inquiry received', user: 'Sarah Smith', time: '15 min ago' },
                  { action: 'Product rejected', user: 'Used Laptop', time: '1 hour ago' },
                  { action: 'System updated', user: 'v2.1.0 deployed', time: '2 hours ago' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <p className="text-gray-900">
                        <span className="font-medium">{activity.action}</span> - {activity.user}
                      </p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'pending' && <PendingProducts />}
        {activeTab === 'products' && <ProductList />}
        {activeTab === 'inquiries' && <InquiryList />}
      </div>
    </div>
  );
};

export default Dashboard;
