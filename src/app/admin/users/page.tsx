"use client";

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/admin/Card';
import { FormInput, FormButton } from '@/components/admin/FormInput';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
  _id: string;
  firebaseUID: string;
  email: string;
  displayName: string;
  isDisabled: boolean;
  disabledAt: string | null;
  disabledBy: string;
  reason: string;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [disableReason, setDisableReason] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/users');
      if (!res.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDisableUser = async () => {
    if (!selectedUser) return;

    try {
      const res = await fetch(`http://localhost:5001/api/users/${selectedUser._id}/disable`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          disabledBy: 'Admin',
          reason: disableReason,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to disable user');
      }

      setShowDisableModal(false);
      setDisableReason('');
      setSelectedUser(null);
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEnableUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to enable this user?')) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5001/api/users/${userId}/enable`, {
        method: 'PUT',
      });

      if (!res.ok) {
        throw new Error('Failed to enable user');
      }

      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this user? This cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5001/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete user');
      }

      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const disabledCount = users.filter(u => u.isDisabled).length;
  const activeCount = users.filter(u => !u.isDisabled).length;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading users...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            👥 User Management
          </h1>
          <p className="text-gray-600 text-lg">Manage user accounts and permissions</p>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div 
            className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center">
              <svg className="w-6 h-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-800 font-semibold">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{users.length}</p>
              </div>
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 flex items-center justify-center text-white shadow-xl text-2xl">
                👥
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Active Users</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mt-2">{activeCount}</p>
              </div>
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-xl text-2xl">
                ✓
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Disabled Users</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mt-2">{disabledCount}</p>
              </div>
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white shadow-xl text-2xl">
                ⚠
              </div>
            </div>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white text-gray-900 placeholder-gray-400 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
            />
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </Card>

        {/* Users Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <p className="text-gray-500 text-lg font-medium">No users found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`hover:bg-indigo-50/50 transition-colors ${user.isDisabled ? 'bg-red-50/30' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-bold text-gray-900">{user.email}</p>
                          <p className="text-xs text-gray-500">
                            {user.displayName || 'No display name'} • {user.firebaseUID.substring(0, 8)}...
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isDisabled 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {user.isDisabled ? '⚠ Disabled' : '✓ Active'}
                        </span>
                        {user.isDisabled && user.reason && (
                          <p className="text-xs text-gray-600 mt-1">{user.reason}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{formatDate(user.lastLogin)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{formatDate(user.createdAt)}</p>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <FormButton
                          variant="primary"
                          className="text-sm py-2 px-4"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDetailModal(true);
                          }}
                        >
                          👁️ View
                        </FormButton>
                        {user.isDisabled ? (
                          <FormButton
                            variant="success"
                            className="text-sm py-2 px-4"
                            onClick={() => handleEnableUser(user._id)}
                          >
                            ✓ Enable
                          </FormButton>
                        ) : (
                          <FormButton
                            variant="danger"
                            className="text-sm py-2 px-4"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDisableModal(true);
                            }}
                          >
                            ⚠ Disable
                          </FormButton>
                        )}
                        <FormButton
                          variant="danger"
                          className="text-sm py-2 px-4"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          🗑️ Delete
                        </FormButton>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Disable User Modal */}
      <AnimatePresence>
        {showDisableModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDisableModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Disable User Account</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to disable <strong>{selectedUser.email}</strong>? They will not be able to log in.
              </p>
              
              <FormInput
                label="Reason (Optional)"
                placeholder="e.g., Violation of terms, suspicious activity..."
                value={disableReason}
                onChange={(e) => setDisableReason(e.target.value)}
              />

              <div className="flex space-x-4 mt-6">
                <FormButton
                  variant="danger"
                  onClick={handleDisableUser}
                  className="flex-1"
                >
                  Disable Account
                </FormButton>
                <FormButton
                  variant="secondary"
                  onClick={() => {
                    setShowDisableModal(false);
                    setDisableReason('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </FormButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Details Modal */}
      <AnimatePresence>
        {showDetailModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 overflow-y-auto max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  User Details
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* User Info Card */}
                <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 border border-indigo-100">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {selectedUser.displayName ? selectedUser.displayName.charAt(0).toUpperCase() : selectedUser.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{selectedUser.displayName || 'No Name'}</h4>
                      <p className="text-sm text-gray-600">{selectedUser.email}</p>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Firebase UID</p>
                    <p className="text-sm font-mono text-gray-900 break-all">{selectedUser.firebaseUID}</p>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Status</p>
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      selectedUser.isDisabled 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {selectedUser.isDisabled ? '⚠ Disabled' : '✓ Active'}
                    </span>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Account Created</p>
                    <p className="text-sm text-gray-900">{formatDate(selectedUser.createdAt)}</p>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Last Login</p>
                    <p className="text-sm text-gray-900">{formatDate(selectedUser.lastLogin)}</p>
                  </div>

                  {selectedUser.isDisabled && (
                    <>
                      <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                        <p className="text-xs font-semibold text-red-600 uppercase mb-1">Disabled At</p>
                        <p className="text-sm text-gray-900">{formatDate(selectedUser.disabledAt)}</p>
                      </div>

                      <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                        <p className="text-xs font-semibold text-red-600 uppercase mb-1">Disabled By</p>
                        <p className="text-sm text-gray-900">{selectedUser.disabledBy || 'Unknown'}</p>
                      </div>

                      {selectedUser.reason && (
                        <div className="md:col-span-2 bg-red-50 rounded-xl p-4 border border-red-200">
                          <p className="text-xs font-semibold text-red-600 uppercase mb-1">Reason</p>
                          <p className="text-sm text-gray-900">{selectedUser.reason}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4 mt-8 pt-6 border-t border-gray-200">
                <FormButton
                  variant="secondary"
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1"
                >
                  Close
                </FormButton>
                {selectedUser.isDisabled ? (
                  <FormButton
                    variant="success"
                    onClick={() => {
                      setShowDetailModal(false);
                      handleEnableUser(selectedUser._id);
                    }}
                    className="flex-1"
                  >
                    ✓ Enable Account
                  </FormButton>
                ) : (
                  <FormButton
                    variant="danger"
                    onClick={() => {
                      setShowDetailModal(false);
                      setShowDisableModal(true);
                    }}
                    className="flex-1"
                  >
                    ⚠ Disable Account
                  </FormButton>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminUsersPage;

