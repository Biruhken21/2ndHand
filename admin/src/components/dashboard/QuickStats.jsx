import React from 'react';
import { DollarSign, Eye, TrendingUp, TrendingDown } from 'lucide-react';

const QuickStats = ({ stats }) => {
  const quickStats = [
    {
      label: 'Total Revenue',
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
      change: '+24%',
      trending: 'up',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'text-green-600 bg-green-50'
    },
    {
      label: 'Avg. Product Price',
      value: `$${stats?.avgProductPrice || '0'}`,
      change: '+5%',
      trending: 'up',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      label: 'Total Views',
      value: (stats?.totalViews || 0).toLocaleString(),
      change: '-3%',
      trending: 'down',
      icon: <Eye className="w-5 h-5" />,
      color: 'text-purple-600 bg-purple-50'
    },
    {
      label: 'Engagement Rate',
      value: `${stats?.engagementRate || '0'}%`,
      change: '+18%',
      trending: 'up',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-amber-600 bg-amber-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {quickStats.map((stat, index) => (
        <div
          key={index}
          className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg ${stat.color}`}>
              {stat.icon}
            </div>
            <div className={`flex items-center ${stat.trending === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {stat.trending === 'up' ? 
                <TrendingUp className="w-4 h-4 mr-1" /> : 
                <TrendingDown className="w-4 h-4 mr-1" />
              }
              <span className="text-sm font-semibold">{stat.change}</span>
            </div>
          </div>
          
          <h4 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h4>
          <p className="text-gray-600 text-sm">{stat.label}</p>
          
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Monthly target</span>
              <span className="font-semibold">85%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                style={{ width: '85%' }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;