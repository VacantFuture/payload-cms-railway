import { Access } from 'payload'

const isAdminEditorOrCopy: Access = ({ req: { user } }) => {
  if (user) {
    if (user.Role === 'admin') return true
    if (user.Role === 'editor' || user.Role === 'copy') return true
  }
  return false
}

export default isAdminEditorOrCopy
