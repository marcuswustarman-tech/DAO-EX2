// 用户角色类型
export type UserRole = '学员' | '付费学员' | '交易员' | '团队长';

// 检查用户是否有访问付费专属内容的权限
export function canAccessPremiumContent(role: UserRole): boolean {
  return ['付费学员', '交易员', '团队长'].includes(role);
}

// 检查用户是否是管理员
export function isAdmin(role: UserRole): boolean {
  return role === '团队长';
}

// 检查用户是否可以访问学习进度
export function canAccessProgress(role: UserRole): boolean {
  return ['学员', '付费学员', '交易员', '团队长'].includes(role);
}
