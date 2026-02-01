import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Loader2 } from 'lucide-react';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'VIEWER' | 'EDITOR' | 'ADMIN';
  createdAt: string;
}

export default function UserManagement() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setError('Failed to fetch users. You might not have permission.');
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
      setError('Network error connecting to user service.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole as any } : u));
      } else {
        console.error('Failed to update role');
      }
    } catch (err) {
      console.error('Error updating role', err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel p-6 rounded-xl border border-white/5 text-center">
        <p className="text-red-400 mb-2">{error}</p>
        <button 
          onClick={fetchUsers}
          className="text-sm text-primary hover:underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-xl border border-white/5">
        <h2 className="text-xl font-semibold mb-6 text-text-main flex items-center gap-2">
          <Users size={20} className="text-primary" />
          User Management
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-text-muted text-sm">
                <th className="py-3 px-4 font-medium">User</th>
                <th className="py-3 px-4 font-medium">Email</th>
                <th className="py-3 px-4 font-medium">Role</th>
                <th className="py-3 px-4 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-text-main">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                        {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                      </div>
                      <span>{user.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-text-muted">{user.email}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        disabled={updatingId === user.id}
                        className="bg-surface/30 border border-white/10 rounded px-2 py-1 text-sm text-text-main focus:border-primary/50 outline-none cursor-pointer hover:bg-surface/50 transition-colors"
                      >
                        <option value="VIEWER">Viewer</option>
                        <option value="EDITOR">Editor</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                      {updatingId === user.id && <Loader2 size={14} className="animate-spin text-primary" />}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-text-muted text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
