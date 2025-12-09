import React from 'react';
import { 
  Package, 
  Users, 
  Clock, 
  CheckCircle, 
  MessageSquare,
  TrendingUp 
} from 'lucide-react';

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Products',
      value: stats?.totalProducts?.toLocaleString() || '0',
      icon: <Package className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      change: '+12%',
      description: 'All listed products'
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers?.toLocaleString() || '0',
      icon: <Users className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-600',
      change: '+8%',
      description: 'Registered users'
    },
    {
      title: 'Pending Approval',
      value: stats?.pendingProducts?.toLocaleString() || '0',
      icon: <Clock className="w-6 h-6" />,
      color: 'from-amber-500 to-orange-600',
      change: stats?.pendingProducts > 0 ? 'Needs attention' : 'All clear',
      description: 'Awaiting review'
    },
    {
      title: 'Active Products',
      value: stats?.approvedProducts?.toLocaleString() || '0',
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'from-emerald-500 to-teal-600',
      change: '+15%',
      description: 'Approved & live'
    },
    {
      title: "Today's Inquiries",
      value: stats?.todayInquiries?.toLocaleString() || '0',
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'from-purple-500 to-violet-600',
      change: '+5',
      description: 'New messages today'
    },
    {
      title: 'Conversion Rate',
      value: `${stats?.conversionRate || '0'}%`,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-indigo-500 to-blue-600',
      change: '+2.5%',
      description: 'Success rate'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300 group"
        >
          <div className="flex items-center justify-between mb-6">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} bg-opacity-10`}>
              <div className={`bg-gradient-to-br ${card.color} bg-clip-text text-transparent`}>
                {card.icon}
              </div>
            </div>
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-700">
              {card.change}
            </span>
          </div>
          
          <div className="mb-4">
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{card.value}</h3>
            <p className="text-gray-600 font-medium">{card.title}</p>
          </div>
          
          <p className="text-sm text-gray-500 mb-4">{card.description}</p>
          
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Monthly growth</span>
              <span className="font-medium text-gray-900">85%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${card.color}`}
                style={{ width: '85%' }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;