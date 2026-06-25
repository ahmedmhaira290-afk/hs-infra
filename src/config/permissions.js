export const ROLES = {
  RESPONSABLE: 'responsable',
  AGENT: 'agent',
}

export const PERMISSIONS = {
  VIEW_EMPLOYEES: 'view_employees',
  MANAGE_EMPLOYEES: 'manage_employees',
  VIEW_TEMPLATES: 'view_templates',
  MANAGE_TEMPLATES: 'manage_templates',
  GENERATE_DOCUMENTS: 'generate_documents',
  VIEW_HISTORY: 'view_history',
  MANAGE_USERS: 'manage_users',
  MANAGE_SETTINGS: 'manage_settings',
}

export const ROLE_PERMISSIONS = {
  [ROLES.RESPONSABLE]: [
    PERMISSIONS.VIEW_EMPLOYEES,
    PERMISSIONS.MANAGE_EMPLOYEES,
    PERMISSIONS.VIEW_TEMPLATES,
    PERMISSIONS.MANAGE_TEMPLATES,
    PERMISSIONS.GENERATE_DOCUMENTS,
    PERMISSIONS.VIEW_HISTORY,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_SETTINGS,
  ],
  [ROLES.AGENT]: [
    PERMISSIONS.VIEW_EMPLOYEES,
    PERMISSIONS.VIEW_TEMPLATES,
    PERMISSIONS.GENERATE_DOCUMENTS,
    PERMISSIONS.VIEW_HISTORY,
    PERMISSIONS.MANAGE_SETTINGS,
  ],
}

export function hasPermission(role, permission) {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function canAccessRoute(role, route) {
  const routePermissions = {
    '/dashboard': [],
    '/employees': [PERMISSIONS.VIEW_EMPLOYEES],
    '/employees/new': [PERMISSIONS.MANAGE_EMPLOYEES],
    '/employees/:id/edit': [PERMISSIONS.MANAGE_EMPLOYEES],
    '/templates': [PERMISSIONS.VIEW_TEMPLATES],
    '/templates/new': [PERMISSIONS.MANAGE_TEMPLATES],
    '/templates/:id/edit': [PERMISSIONS.MANAGE_TEMPLATES],
    '/agents': [PERMISSIONS.MANAGE_USERS],
    '/settings': [PERMISSIONS.MANAGE_SETTINGS],
    '/documents/generate': [PERMISSIONS.GENERATE_DOCUMENTS],
    '/documents/history': [PERMISSIONS.VIEW_HISTORY],
  }

  const required = routePermissions[route]
  if (!required) return true
  if (required.length === 0) return true
  return required.some((p) => hasPermission(role, p))
}
