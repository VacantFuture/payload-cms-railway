import type { CollectionBeforeChangeHook } from 'payload'
import { Forbidden, APIError } from 'payload'

/**
 * Configuration for the state machine hook.
 */
export interface StateMachineConfig {
  /** The name of the field that holds the state value (e.g., 'workflowStatus'). */
  stateField: string
  /**
   * Defines the allowed transitions between states, keyed by user role.
   * 'admin' role is always allowed to transition between any state.
   * @example
   * {
   *   author: { draft: ['inReview'] },
   *   editor: { inReview: ['approved', 'changesRequested'] }
   * }
   */
  transitions: Record<string, Record<string, string[]>>
}

/**
 * A factory function that creates a Payload `beforeChange` hook to enforce a state machine.
 * It validates state transitions based on the user's role and the provided configuration.
 *
 * @param config - The state machine configuration.
 * @returns A `CollectionBeforeChangeHook` function.
 */
export const createStateMachineHook =
  (config: StateMachineConfig): CollectionBeforeChangeHook =>
  async ({ data, req, operation, originalDoc }) => {
    // This hook only applies to updates
    if (operation !== 'update') {
      return data
    }

    const user = req.user
    if (!user) throw new Forbidden(req.t)

    const originalState = originalDoc?.[config.stateField] as string | undefined
    const newState = data?.[config.stateField] as string | undefined

    // If the state hasn't changed or is unknown, no need to validate the transition.
    if (originalState === newState || !originalState || !newState) {
      return data
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userRole = (user as any).Role as string

    // Admins can always transition between any state.
    if (userRole === 'admin') {
      return data
    }

    const userTransitions = config.transitions[userRole]
    if (!userTransitions) {
      throw new APIError(
        `Your role "${userRole}" has no defined state transitions.`,
        403,
      )
    }

    const allowedNextStates = userTransitions[originalState]
    if (!allowedNextStates || !allowedNextStates.includes(newState)) {
      throw new APIError(
        `As a(n) ${userRole}, you cannot move this document from "${originalState}" to "${newState}".`,
        403,
      )
    }

    return data
  }

/**
 * Configuration for the publishing gatekeeper hook.
 */
export interface PublishingGatekeeperConfig {
  /** The name of the field that holds the state value (e.g., 'workflowStatus'). */
  stateField: string
  /** The state a document must be in to be published. */
  approvedState: string
  /** An array of user roles that are permitted to publish. */
  publishingRoles: string[]
}

/**
 * A factory function that creates a Payload `beforeChange` hook to protect the publishing action.
 * It ensures a document is in an 'approved' state and the user has the correct role before
 * the `_status` can be set to 'published'.
 *
 * @param config - The publishing gatekeeper configuration.
 * @returns A `CollectionBeforeChangeHook` function.
 */
export const createPublishingGatekeeperHook =
  (config: PublishingGatekeeperConfig): CollectionBeforeChangeHook =>
  async ({ data, req, operation, originalDoc }) => {
    const user = req.user
    if (!user) throw new Forbidden(req.t)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userData = user as any

    const isPublishing =
      operation === 'update' &&
      (data._status as string) === 'published' &&
      (originalDoc?._status as string) !== 'published'

    if (isPublishing) {
      // Check 1: Does the user have a role that is allowed to publish?
      if (!config.publishingRoles.includes(userData.Role as string)) {
        throw new APIError(
          'You do not have permission to publish this document.',
          403,
        )
      }

      // Check 2: Is the document in the required state to be published?
      if ((data[config.stateField] as string) !== config.approvedState) {
        throw new APIError(
          `Document must be in the "${config.approvedState}" state to be published.`,
          403,
        )
      }
    }

    return data
  }
