'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isAdmin } from '@/lib/permissions';

interface User {
  id: string;
  username: string;
  role_status: string;
  contact: string | null;
  gender: string | null;
  age: number | null;
  training_start_date: string | null;
  created_at: string;
  is_active: boolean;
}

interface UserStat {
  id: string;
  username: string;
  role_status: string;
  totalProgress: number;
  completedCourses: number;
  totalCourses: number;
  lastStudyTime: string | null;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'users' | 'monitoring'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [filterRole, setFilterRole] = useState<string>('全部');

  // 新用户表单
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role_status: '学员',
    contact: '',
    gender: '',
    age: '',
    training_start_date: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/console');
    } else if (session?.user && !isAdmin(session.user.role_status as any)) {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user && isAdmin(session.user.role_status as any)) {
      fetchUsers();
      fetchMonitoring();
    }
  }, [session]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMonitoring = async () => {
    try {
      const response = await fetch('/api/admin/monitoring');
      const data = await response.json();
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching monitoring data:', error);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          age: formData.age ? parseInt(formData.age) : null,
        }),
      });

      if (response.ok) {
        await fetchUsers();
        setShowAddModal(false);
        setFormData({
          username: '',
          password: '',
          role_status: '学员',
          contact: '',
          gender: '',
          age: '',
          training_start_date: '',
        });
        alert('学员添加成功！');
      } else {
        const data = await response.json();
        alert(data.error || '添加失败');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert('添加失败');
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role_status: formData.role_status,
          contact: formData.contact,
          gender: formData.gender,
          age: formData.age ? parseInt(formData.age) : null,
          training_start_date: formData.training_start_date,
        }),
      });

      if (response.ok) {
        await fetchUsers();
        setEditingUser(null);
        alert('更新成功！');
      } else {
        alert('更新失败');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('更新失败');
    }
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    if (!confirm(`确定要删除学员 ${username} 吗？此操作不可恢复。`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchUsers();
        alert('删除成功');
      } else {
        alert('删除失败');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('删除失败');
    }
  };

  const startEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: '',
      role_status: user.role_status,
      contact: user.contact || '',
      gender: user.gender || '',
      age: user.age?.toString() || '',
      training_start_date: user.training_start_date || '',
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-neutral-400">加载中...</div>
      </div>
    );
  }

  if (!session?.user || !isAdmin(session.user.role_status as any)) {
    return null;
  }

  const filteredUsers = filterRole === '全部'
    ? users
    : users.filter(u => u.role_status === filterRole);

  const filteredStats = filterRole === '全部'
    ? stats
    : stats.filter(s => s.role_status === filterRole);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-4xl font-serif">学员后台控制系统</h1>
            <button
              onClick={() => router.push('/console')}
              className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
            >
              返回控制台
            </button>
          </div>

          {/* 标签页 */}
          <div className="flex gap-2 mb-8 border-b border-neutral-800">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 ${
                activeTab === 'users'
                  ? 'border-b-2 border-accent text-accent'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              学员管理
            </button>
            <button
              onClick={() => setActiveTab('monitoring')}
              className={`px-6 py-3 ${
                activeTab === 'monitoring'
                  ? 'border-b-2 border-accent text-accent'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              学习监控
            </button>
          </div>

          {/* 学员管理标签页 */}
          {activeTab === 'users' && (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-3 bg-accent text-white hover:bg-accent/90 transition-colors"
                >
                  + 添加学员
                </button>
                <div className="flex gap-2">
                  {['全部', '准学员', '学员', '付费学员', '交易员', '团队长'].map((role) => (
                    <button
                      key={role}
                      onClick={() => setFilterRole(role)}
                      className={`px-4 py-2 ${
                        filterRole === role
                          ? 'bg-accent text-white'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white'
                      } transition-colors`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-800">
                      <th className="text-left p-4 text-neutral-400 font-normal">账号</th>
                      <th className="text-left p-4 text-neutral-400 font-normal">等级</th>
                      <th className="text-left p-4 text-neutral-400 font-normal">联系方式</th>
                      <th className="text-left p-4 text-neutral-400 font-normal">性别</th>
                      <th className="text-left p-4 text-neutral-400 font-normal">年龄</th>
                      <th className="text-left p-4 text-neutral-400 font-normal">培训日期</th>
                      <th className="text-left p-4 text-neutral-400 font-normal">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-neutral-800 hover:bg-neutral-800/50">
                        <td className="p-4">{user.username}</td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-accent/20 text-accent text-sm">
                            {user.role_status}
                          </span>
                        </td>
                        <td className="p-4 text-neutral-400">{user.contact || '-'}</td>
                        <td className="p-4 text-neutral-400">{user.gender || '-'}</td>
                        <td className="p-4 text-neutral-400">{user.age || '-'}</td>
                        <td className="p-4 text-neutral-400">{user.training_start_date || '-'}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(user)}
                              className="px-3 py-1 text-sm text-blue-400 hover:text-blue-300"
                            >
                              编辑
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id, user.username)}
                              className="px-3 py-1 text-sm text-red-400 hover:text-red-300"
                            >
                              删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredUsers.length === 0 && (
                  <div className="p-12 text-center text-neutral-500">
                    暂无学员数据
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 学习监控标签页 */}
          {activeTab === 'monitoring' && (
            <div>
              <div className="mb-6 flex gap-2">
                {['全部', '准学员', '学员', '付费学员', '交易员', '团队长'].map((role) => (
                  <button
                    key={role}
                    onClick={() => setFilterRole(role)}
                    className={`px-4 py-2 ${
                      filterRole === role
                        ? 'bg-accent text-white'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white'
                    } transition-colors`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              <div className="bg-neutral-900 border border-neutral-800 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-800">
                      <th className="text-left p-4 text-neutral-400 font-normal">学员名</th>
                      <th className="text-left p-4 text-neutral-400 font-normal">等级</th>
                      <th className="text-left p-4 text-neutral-400 font-normal">总进度</th>
                      <th className="text-left p-4 text-neutral-400 font-normal">已完成课程</th>
                      <th className="text-left p-4 text-neutral-400 font-normal">最后学习时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStats.map((stat) => (
                      <tr key={stat.id} className="border-b border-neutral-800 hover:bg-neutral-800/50">
                        <td className="p-4">{stat.username}</td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-accent/20 text-accent text-sm">
                            {stat.role_status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-neutral-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-accent"
                                style={{ width: `${stat.totalProgress}%` }}
                              />
                            </div>
                            <span className="text-accent">{stat.totalProgress}%</span>
                          </div>
                        </td>
                        <td className="p-4 text-neutral-400">
                          {stat.completedCourses}/{stat.totalCourses}
                        </td>
                        <td className="p-4 text-neutral-400">
                          {stat.lastStudyTime
                            ? new Date(stat.lastStudyTime).toLocaleDateString('zh-CN')
                            : '从未学习'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredStats.length === 0 && (
                  <div className="p-12 text-center text-neutral-500">
                    暂无监控数据
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 添加学员弹窗 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-800 max-w-md w-full p-8">
            <h2 className="text-2xl font-medium mb-6">添加新学员</h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">账号*</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-950 border border-neutral-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">密码*</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-950 border border-neutral-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">等级*</label>
                <select
                  value={formData.role_status}
                  onChange={(e) => setFormData({ ...formData, role_status: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-950 border border-neutral-700 text-white"
                >
                  <option>准学员</option>
                  <option>学员</option>
                  <option>付费学员</option>
                  <option>交易员</option>
                  <option>团队长</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">联系方式</label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-950 border border-neutral-700 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">性别</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-2 bg-neutral-950 border border-neutral-700 text-white"
                  >
                    <option value="">请选择</option>
                    <option>男</option>
                    <option>女</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">年龄</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-4 py-2 bg-neutral-950 border border-neutral-700 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">培训开始日期</label>
                <input
                  type="date"
                  value={formData.training_start_date}
                  onChange={(e) => setFormData({ ...formData, training_start_date: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-950 border border-neutral-700 text-white"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-accent text-white hover:bg-accent/90"
                >
                  添加
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 border border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 编辑学员弹窗 */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-800 max-w-md w-full p-8">
            <h2 className="text-2xl font-medium mb-6">编辑学员：{editingUser.username}</h2>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">等级</label>
                <select
                  value={formData.role_status}
                  onChange={(e) => setFormData({ ...formData, role_status: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-950 border border-neutral-700 text-white"
                >
                  <option>准学员</option>
                  <option>学员</option>
                  <option>付费学员</option>
                  <option>交易员</option>
                  <option>团队长</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">联系方式</label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-950 border border-neutral-700 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">性别</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-2 bg-neutral-950 border border-neutral-700 text-white"
                  >
                    <option value="">请选择</option>
                    <option>男</option>
                    <option>女</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">年龄</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-4 py-2 bg-neutral-950 border border-neutral-700 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">培训开始日期</label>
                <input
                  type="date"
                  value={formData.training_start_date}
                  onChange={(e) => setFormData({ ...formData, training_start_date: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-950 border border-neutral-700 text-white"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-accent text-white hover:bg-accent/90"
                >
                  保存
                </button>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 px-6 py-3 border border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
