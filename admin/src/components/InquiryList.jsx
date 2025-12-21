import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Mail, Phone, Clock, CheckCircle, XCircle, 
  User, ShoppingBag, ChevronRight, Eye, Trash2, Search,
  ArrowUpDown, Filter, Calendar, DollarSign, Image as ImageIcon,
  MapPin, Tag
} from 'lucide-react';
import { adminAPI } from '../services/adminAPI';

const InquiryList = () => {
  const [inquiries, setInquiries] = useState([]);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'detail'
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  useEffect(() => {
    loadInquiries();
  }, []);

  useEffect(() => {
    // Filter and search
    let result = inquiries;
    
    if (filter !== 'all') {
      result = result.filter(inquiry => inquiry.status === filter);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(inquiry => 
        inquiry.buyerName?.toLowerCase().includes(term) ||
        inquiry.buyerEmail?.toLowerCase().includes(term) ||
        inquiry.productTitle?.toLowerCase().includes(term) ||
        inquiry.productLocation?.toLowerCase().includes(term) ||
        inquiry.productCategory?.toLowerCase().includes(term) ||
        inquiry.message?.toLowerCase().includes(term)
      );
    }
    
    // Sort
    result = [...result].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredInquiries(result);
  }, [inquiries, filter, searchTerm, sortConfig]);

  const loadInquiries = async () => {
    try {
      const response = await adminAPI.getAllInquiries();
      console.log('Inquiries data:', response.inquiries?.[0]); // Debug log
      setInquiries(response.inquiries || response.data || []);
    } catch (error) {
      console.error('Failed to load inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleUpdateStatus = async (inquiryId, newStatus) => {
    try {
      await adminAPI.updateInquiryStatus(inquiryId, newStatus);
      loadInquiries(); // Refresh
      // If updating the selected inquiry, update it in state too
      if (selectedInquiry && selectedInquiry.inquiryId === inquiryId) {
        setSelectedInquiry(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleViewDetails = (inquiry) => {
    setSelectedInquiry(inquiry);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setViewMode('table');
    setSelectedInquiry(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'read': return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'replied': return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'closed': return 'bg-green-100 text-green-800 border border-green-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new': return <Clock className="w-3 h-3" />;
      case 'read': return <CheckCircle className="w-3 h-3" />;
      case 'replied': return <MessageSquare className="w-3 h-3" />;
      case 'closed': return <XCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusOptions = [
    { value: 'new', label: 'New', color: 'blue', count: 0 },
    { value: 'read', label: 'Read', color: 'amber', count: 0 },
    { value: 'replied', label: 'Replied', color: 'purple', count: 0 },
    { value: 'closed', label: 'Closed', color: 'green', count: 0 }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Detail View (when an inquiry is selected)
  if (viewMode === 'detail' && selectedInquiry) {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={handleBackToList}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back to Inquiries List
        </button>

        {/* Detail Card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Inquiry Details
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(selectedInquiry.status)}`}>
                    {getStatusIcon(selectedInquiry.status)}
                    {selectedInquiry.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(selectedInquiry.inquiredAt || selectedInquiry.createdAt)}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {selectedInquiry.status === 'new' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedInquiry.inquiryId || selectedInquiry._id, 'read')}
                    className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium hover:bg-amber-200"
                  >
                    Mark as Read
                  </button>
                )}
                {selectedInquiry.status !== 'replied' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedInquiry.inquiryId || selectedInquiry._id, 'replied')}
                    className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium hover:bg-purple-200"
                  >
                    Mark Replied
                  </button>
                )}
                {selectedInquiry.status !== 'closed' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedInquiry.inquiryId || selectedInquiry._id, 'closed')}
                    className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium hover:bg-green-200"
                  >
                    Close Inquiry
                  </button>
                )}
              </div>
            </div>

            {/* Three Column Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Buyer Info */}
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                <div className="flex items-center mb-4">
                  <User className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-blue-800">Buyer Information</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Name</p>
                    <p className="font-medium text-gray-900">{selectedInquiry.buyerName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <a href={`mailto:${selectedInquiry.buyerEmail}`} className="font-medium text-gray-900 hover:text-blue-600">
                        {selectedInquiry.buyerEmail || 'N/A'}
                      </a>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <a href={`tel:${selectedInquiry.buyerPhone}`} className="font-medium text-gray-900 hover:text-blue-600">
                        {selectedInquiry.buyerPhone || 'N/A'}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Info - Updated with location and category */}
              <div className="bg-green-50 p-5 rounded-xl border border-green-100">
                <div className="flex items-center mb-4">
                  <ShoppingBag className="w-5 h-5 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-green-800">Product Information</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    {selectedInquiry.productImage ? (
                      <img 
                        src={selectedInquiry.productImage} 
                        alt={selectedInquiry.productTitle}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/64?text=No+Image";
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Product Name</p>
                      <p className="font-medium text-gray-900">{selectedInquiry.productTitle || 'Unknown Product'}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Price</p>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                        <p className="font-bold text-green-700">
                          ${selectedInquiry.productPrice || selectedInquiry.productInfo?.price || 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Category</p>
                      <div className="flex items-center">
                        <Tag className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded capitalize">
                          {selectedInquiry.productCategory || selectedInquiry.productInfo?.category || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Location</p>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      <p className="text-gray-700">
                        {selectedInquiry.productLocation || selectedInquiry.productInfo?.location || 'Location not specified'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Product ID</p>
                    <p className="text-sm font-mono text-gray-700">
                      {selectedInquiry.productId?.substring(0, 8) || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Seller Info */}
              <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
                <div className="flex items-center mb-4">
                  <User className="w-5 h-5 text-purple-600 mr-2" />
                  <h3 className="text-lg font-semibold text-purple-800">Seller Information</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Name</p>
                    <p className="font-medium text-gray-900">{selectedInquiry.brokerName || selectedInquiry.sellerInfo?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <a href={`mailto:${selectedInquiry.brokerEmail || selectedInquiry.sellerInfo?.email}`} className="font-medium text-gray-900 hover:text-blue-600">
                        {selectedInquiry.brokerEmail || selectedInquiry.sellerInfo?.email || 'N/A'}
                      </a>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <a href={`tel:${selectedInquiry.brokerPhone || selectedInquiry.sellerInfo?.phone}`} className="font-medium text-gray-900 hover:text-blue-600">
                        {selectedInquiry.brokerPhone || selectedInquiry.sellerInfo?.phone || 'N/A'}
                      </a>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Seller ID</p>
                    <p className="text-sm font-mono text-gray-700">
                      {selectedInquiry.sellerId?.substring(0, 8) || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="mb-8">
              <div className="flex items-center mb-3">
                <MessageSquare className="w-5 h-5 text-gray-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">Message</h3>
              </div>
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <p className="text-gray-700 whitespace-pre-wrap">{selectedInquiry.message || 'No message provided'}</p>
                <div className="mt-3 pt-3 border-t border-gray-300 flex justify-between text-sm text-gray-500">
                  <span>{selectedInquiry.message?.length || 0} characters</span>
                  <span>Inquiry ID: {selectedInquiry.inquiryId?.substring(0, 12) || selectedInquiry._id?.substring(0, 12)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <div className="flex gap-3">
                <a
                  href={`mailto:${selectedInquiry.buyerEmail}`}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Mail className="w-4 h-4" />
                  Email Buyer
                </a>
                {selectedInquiry.buyerPhone && (
                  <a
                    href={`tel:${selectedInquiry.buyerPhone}`}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Phone className="w-4 h-4" />
                    Call Buyer
                  </a>
                )}
              </div>
              <button className="text-red-600 hover:text-red-800 flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete Inquiry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Table View (default) - Updated to show location and category
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Customer Inquiries</h2>
        <p className="text-gray-600">Manage and respond to customer inquiries</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Inquiries</p>
              <p className="text-2xl font-bold text-gray-900">{inquiries.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        {statusOptions.map((status) => {
          const count = inquiries.filter(i => i.status === status.value).length;
          return (
            <div key={status.value} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{status.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
                <div className={`p-3 ${getStatusColor(status.value)} rounded-lg`}>
                  {getStatusIcon(status.value)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by buyer name, email, product, location, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <div className="flex gap-2">
              {['all', 'new', 'read', 'replied', 'closed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize ${
                    filter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'All' : status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Inquiries Table - Updated columns */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('createdAt')} className="flex items-center gap-1">
                    Date <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('buyerName')} className="flex items-center gap-1">
                    Buyer <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('status')} className="flex items-center gap-1">
                    Status <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                      <MessageSquare className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries found</h3>
                    <p className="text-gray-600">Try adjusting your search or filter</p>
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inquiry) => (
                  <tr key={inquiry.inquiryId || inquiry._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(inquiry.inquiredAt || inquiry.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                            {inquiry.buyerName?.charAt(0) || 'B'}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {inquiry.buyerName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {inquiry.buyerEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {inquiry.productImage ? (
                          <img 
                            src={inquiry.productImage} 
                            alt={inquiry.productTitle}
                            className="w-10 h-10 object-cover rounded border border-gray-200"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/40?text=No+Image";
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {inquiry.productTitle || 'Unknown Product'}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <DollarSign className="w-3 h-3" />
                            ${inquiry.productPrice || 'N/A'}
                            <span className="text-gray-300">•</span>
                            <Tag className="w-3 h-3" />
                            <span className="capitalize">{inquiry.productCategory || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        {inquiry.productLocation || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(inquiry.status)}`}>
                        {getStatusIcon(inquiry.status)}
                        {inquiry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(inquiry)}
                        className="text-blue-600 hover:text-blue-900 mr-3 flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button className="text-red-600 hover:text-red-900 flex items-center gap-1">
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InquiryList;