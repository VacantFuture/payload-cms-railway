import type { Access } from 'payload'

/**
 * Grants full access to admins and self-service access to everyone else:
 * a logged-in non-admin can only ever see or modify their own document.
 * Anonymous requests are always denied.
 *
 * Returning a where clause (rather than false) means list queries are
 * filtered to the caller's own document instead of erroring, so the admin
 * panel's users list shows exactly one row for a non-admin.
 */
const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.Role === 'admin') return true
  return {
    id: {
      equals: user.id,
    },
  }
}

export default isAdminOrSelf
