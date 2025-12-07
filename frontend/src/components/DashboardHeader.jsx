import React from 'react';
import { PlusCircle } from 'lucide-react';

const DashboardHeader = ({ user, showPostForm, setShowPostForm }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-blue-100">Manage your products and explore listings</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setShowPostForm(!showPostForm)}
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <PlusCircle className="w-5 h-5" />
              <span>{showPostForm ? 'Cancel Posting' : 'Post New Product'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;