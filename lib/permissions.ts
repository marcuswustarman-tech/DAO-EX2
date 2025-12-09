// 用户角色状态类型
export type RoleStatus = '准学员' | '学员' | '付费学员' | '交易员' | '考核失败' | '团队长';

// 检查用户是否有访问付费专属内容的权限
export function canAccessPremiumContent(roleStatus: RoleStatus): boolean {
  return ['付费学员', '交易员', '团队长'].includes(roleStatus);
}

// 检查用户是否是团队长（管理员）
export function isTeamLeader(roleStatus: RoleStatus): boolean {
  return roleStatus === '团队长';
}

// 检查用户是否可以访问学习系统
export function canAccessLearning(roleStatus: RoleStatus): boolean {
  return ['学员', '付费学员', '交易员', '团队长'].includes(roleStatus);
}

// 检查用户是否可以申请面试
export function canApplyInterview(roleStatus: RoleStatus): boolean {
  return roleStatus === '准学员';
}

// 检查用户是否可以提交作业
export function canSubmitAssignment(roleStatus: RoleStatus): boolean {
  return ['学员', '付费学员', '交易员'].includes(roleStatus);
}

// 检查用户是否可以审核作业（团队长权限）
export function canReviewAssignment(roleStatus: RoleStatus): boolean {
  return roleStatus === '团队长';
}

// 检查用户是否可以管理面试（团队长权限）
export function canManageInterview(roleStatus: RoleStatus): boolean {
  return roleStatus === '团队长';
}

// 检查用户是否已经是正式学员或更高级别
export function isActiveStudent(roleStatus: RoleStatus): boolean {
  return ['学员', '付费学员', '交易员', '团队长'].includes(roleStatus);
}

// 向后兼容的别名
export const isAdmin = isTeamLeader;
