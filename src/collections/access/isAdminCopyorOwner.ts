import { Access } from 'payload'

const isAdminEditorCopyorOwner: Access = ({ req: { user, data } }) => {
  if (!user) return false

  const isAdmin = user.Role?.includes('admin')
  const isCopy = user.Role?.includes('copy')
  const isEditor = user.Role?.includes('editor')
  const { owner } = data || {}
  const isOwner = user.id === owner
  // console.log(typeof owner)
  // console.log(typeof user.id)

  // console.log(data)
  if (isAdmin || isCopy || isEditor || isOwner) return true

  return {
    owner: {
      equals: user.id,
    },
  }
}

export default isAdminEditorCopyorOwner
