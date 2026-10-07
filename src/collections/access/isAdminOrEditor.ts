import { Access } from 'payload'

const isAdminOrEditor: Access = ({ req: { user } }) => {
  if (user) {
    if (user.Role === 'admin') return true
    if (user.Role === 'editor') return true
  }
  return false
}

export default isAdminOrEditor
