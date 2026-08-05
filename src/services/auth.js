/**
 * Authentication & Role-Based Access Control (RBAC) Service
 * Simulates user sessions, JWT/token state, and permission guards for enterprise workflow.
 */

export const ROLES = {
  ADMIN: 'admin',
  REVIEWER: 'reviewer',
  VIEWER: 'viewer',
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: {
    canRunPipeline: true,
    canReview: true,
    canEditAttributes: true,
    canExport: true,
    canResetState: true,
    label: 'Administrator (Full Access)',
  },
  [ROLES.REVIEWER]: {
    canRunPipeline: true,
    canReview: true,
    canEditAttributes: true,
    canExport: true,
    canResetState: false,
    label: 'Product Reviewer',
  },
  [ROLES.VIEWER]: {
    canRunPipeline: false,
    canReview: false,
    canEditAttributes: false,
    canExport: true,
    canResetState: false,
    label: 'Read-Only Viewer',
  },
};

let currentRole = ROLES.ADMIN;
let mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMyIsInJvbGUiOiJhZG1pbiJ9';

export function getCurrentRole() {
  return currentRole;
}

export function setRole(role) {
  if (ROLES[role.toUpperCase()]) {
    currentRole = role;
    return true;
  }
  return false;
}

export function getRolePermissions(role = currentRole) {
  return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS[ROLES.VIEWER];
}

export function checkPermission(permission, role = currentRole) {
  const perms = getRolePermissions(role);
  return Boolean(perms[permission]);
}

export function getAuthUser() {
  return {
    id: 'usr_ind_9921',
    name: 'Industrial Data Specialist',
    role: currentRole,
    roleLabel: ROLE_PERMISSIONS[currentRole].label,
    token: mockToken,
  };
}
