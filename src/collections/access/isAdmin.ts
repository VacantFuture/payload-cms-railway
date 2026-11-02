import type { FieldAccess } from 'payload'

/**
 * Grants access only to users whose Role is exactly 'admin'.
 * Used for operations that must never be available to non-admins,
 * including the non-admin's own document (e.g. changing any Role).
 *
 * Typed as FieldAccess (the broader argument type) so the same helper can
 * be used for both collection-level access and field-level access.
 */
const isAdmin: FieldAccess = ({ req: { user } }) => user?.Role === 'admin'

export default isAdmin
