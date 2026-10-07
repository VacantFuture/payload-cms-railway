import { Access } from 'payload'

const isAdminEditorCopyorAuthor: Access = ({ req: { user, data } }) => {
  if (!user) return false
  const isAdmin = user.Role?.includes('admin')
  const isEditor = user.Role?.includes('editor')
  const isAuthor = user.Role?.includes('author')
  if (isAdmin || isEditor || isAuthor) return true
  return { owner: { equals: user.id } }
}
export default isAdminEditorCopyorAuthor
