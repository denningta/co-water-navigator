import { ManagementClient } from "auth0"

const domain = process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', '')
if (!domain) throw new Error ('Environment variable not defined: AUTH0_ISSUER_BASE_URL')

const managementClient = new ManagementClient({
  domain: domain,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  scope: 'read:users_app_metadata update:users_app_metadata create:users_app_metadata delete:users_app_metadata read:users read:roles create:roles update:roles delete:roles'
})

export default managementClient