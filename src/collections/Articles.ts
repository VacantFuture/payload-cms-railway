import type { CollectionConfig } from 'payload'
import isAdminEditorCopyorOwner from './access/isAdminCopyorOwner'
import isAdminEditororAuthor from './access/isAdminEditororAuthor'
import isAdminEditorOrCopy from './access/isAdminEditorOrCopy'
import { createPublishingGatekeeperHook, createStateMachineHook } from '../utils/stateMachine'

const articleStateMachine = createStateMachineHook({
  stateField: 'workflowStatus',
  transitions: {
    author: { draft: ['inReview'], changesRequested: ['inReview'] },
    editor: {
      draft: ['inReview'],
      inReview: ['approved', 'changesRequested'],
      changesRequested: ['inReview'],
    },
  },
})

const articlePublishingGatekeeper = createPublishingGatekeeperHook({
  stateField: 'workflowStatus',
  approvedState: 'approved',
  publishingRoles: ['admin', 'editor'],
})
/**
 * Collection configuration for Articles.
 * Defines the schema, access control, hooks, and admin UI behavior for articles.
 */
export const Articles: CollectionConfig = {
  /** The slug for the collection, used in API endpoints and database table names. */
  slug: 'Articles',
  /** Admin UI configuration. */
  admin: {
    useAsTitle: 'title',
    defaultColumns: [
      'title',
      'author',
      'section',
      'status',
      'workflowStatus',
      'createdAt',
      'updatedAt',
    ],
  },
  /**
   * Document locking configuration.
   * Prevents multiple users from editing the same document simultaneously.
   */
  lockDocuments: {
    duration: 600, // Duration in seconds
  },
  /** Default sort order for articles in the admin UI. */
  defaultSort: '-createdAt',
  /** Labels for the collection in the admin UI. */
  labels: { singular: 'Article', plural: 'Articles' },
  /** Access control rules for the collection. */
  access: {
    /** Defines who can create articles. Uses a custom access control function. */
    create: isAdminEditororAuthor,
    /** Defines who can read articles. */
    read: ({ req: { user } }) => {
      if (user) {
        // Allow access for admin, editor, or copy users to all articles.
        if (user.Role === 'admin' || user.Role === 'editor' || user.Role === 'copy') return true
        // For other users, allow access only to articles they own.
        return {
          owner: {
            equals: user.id, // Ensure the owner matches the logged-in user's ID
          },
        } as any
      }

      // Allow public access to published articles
      return {
        _status: {
          equals: 'published',
        },
      } as any
    },
    /** Defines who can update articles. Uses a custom access control function. */
    update: isAdminEditorCopyorOwner,
    /** Defines who can delete articles. */
    delete: ({ req: { user } }) => {
      // Allow delete access only if the user has the 'admin' role
      return user?.Role === 'admin'
    },
  },
  /**
   * Versioning configuration.
   * Enables drafts and scheduled publishing for articles.
   */
  versions: { drafts: { schedulePublish: true } },
  /** Hooks to run at different stages of the document lifecycle. */
  hooks: {
    beforeChange: [
      // Apply the state machine hook to enforce transition rules.
      articleStateMachine,
      // Apply the publishing gatekeeper to protect the publish action.
      articlePublishingGatekeeper,
    ],
  },

  fields: [
    {
      type: 'tabs', // This must be the first field when using tabbedUI
      tabs: [
        {
          label: 'Content', // Define the 'Content' tab
          fields: [
            /** Upload field for the article's main image. */
            {
              name: 'mainImage',
              label: 'Main Image',
              type: 'upload',
              relationTo: 'media',
              admin: { allowCreate: false },
            },
            /** Text field for the article title. */
            { name: 'title', type: 'text', maxLength: 60, required: true },
            /** Textarea for a short excerpt or summary of the article. */
            { name: 'excerpt', type: 'textarea', minLength: 90, maxLength: 150, required: true },
            /** Rich text editor for the main body of the article. */
            { name: 'body', type: 'richText' },
          ],
        },
        // You can add more tabs here if needed
        // {
        //   label: 'SEO',
        //   fields: [
        //     // SEO related fields, or use the seoPlugin which might handle its own tab/placement
        //   ],
        // },
      ],
    },
    {
      name: 'workflowStatus',
      label: 'Workflow Status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'In Review', value: 'inReview' },
        { label: 'Changes Requested', value: 'changesRequested' },
        { label: 'Approved', value: 'approved' },
      ],
      defaultValue: 'draft',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      /** Relationship field to link articles to authors (users). */
      name: 'Author',
      type: 'relationship',
      relationTo: 'users',
      defaultValue: ({ user }) => user?.id,
      hasMany: true,
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      /** Relationship field to link articles to sections. */
      name: 'section',
      label: 'Section',
      type: 'relationship',
      relationTo: 'sections',
      hasMany: false,
      required: true,
      access: {
        /** All users can read the section relationship. */
        read: () => true,
        update: ({ req: { user } }) => {
          if (user) {
            if (user.Role === 'admin') return true
            if (user.Role === 'editor' || user.Role === 'copy') return true
          }
          return false
        },
        /** Defines who can create/set the section relationship. */
        create: ({ req: { user } }) => {
          if (user) {
            if (user.Role === 'admin') return true
            if (user.Role === 'editor' || user.Role === 'copy') return true
          }
          return false
        },
      },
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sectionFeatured',
      label: 'Section Featured',
      type: 'radio',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
      defaultValue: 'no',
      required: true,
      access: {
        /** All users can read the section relationship. */
        read: () => true,
        update: ({ req: { user } }) => {
          if (user) {
            if (user.Role === 'admin') return true
            if (user.Role === 'editor' || user.Role === 'copy') return true
          }
          return false
        },
        /** Defines who can create/set the section relationship. */
        create: ({ req: { user } }) => {
          if (user) {
            if (user.Role === 'admin') return true
            if (user.Role === 'editor' || user.Role === 'copy') return true
          }
          return false
        },
      },
  admin: {
    position: 'sidebar',
  },
    },

    {
      /**
       * Relationship field to store the owner of the article.
       * Defaults to the currently logged-in user.
       * Hidden in the admin UI as it's managed programmatically.
       */
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
      defaultValue: ({ user }) => user?.id,
      admin: {
        hidden: true,
        // position: 'sidebar',
        // readOnly: true,
        description: 'This is the owner of the article',
      },
    },
  ],
}
