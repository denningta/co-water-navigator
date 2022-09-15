import { UserContext, UserProfile } from '@auth0/nextjs-auth0'

export type Auth0UserProfile = UserProfile & {
  app_metaData?: Auth0AppMetadata
  'coWaterExport/roles'?: string[]
}

export type Auth0UserContext = Omit<UserContext, 'user'> & {
  user?: Auth0UserProfile | undefined
}

export interface Auth0AppMetadata {
  permitRefs: {
    document_id: string
    status: 'requested' | 'approved'
  }[]
}