export interface AgentInfo {
  user_id: string
  permitNumber?: string | 'global'
  firstName?: string
  lastName?: string
  agentFor?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip?: string
}
