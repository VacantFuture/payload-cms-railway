import { Access } from 'payload'

const isAdminEditorOrOwner: Access = ({ req: { user, data } }) => {
  if (!user) return false
  const isAdmin = user.Role?.includes('admin')
  const isEditor = user.Role?.includes('editor')
  const { owner } = data || {}
  const isOwner = user.id === owner
  if (isAdmin || isEditor || isOwner) return true
  return { owner: { equals: user.id } }
}
export default isAdminEditorOrOwner
