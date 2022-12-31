import { UserProfile, useUser } from "@auth0/nextjs-auth0"
import { User, UserMetadata } from "auth0"
import Image from "next/image"
import { useEffect, useState } from "react"
import { AppMetadata, UserManagement } from "../../../interfaces/User"
import RoleTag from "../../common/RoleTag"
import DataTable from "../DataTable/DataTable"
import wellPermitColumnDefs from "../WellPermitsAssignment/well-permit-column-defs"
import WellPermitsAssignment from "../WellPermitsAssignment/WellPermitsAssignment"
import RolesManager from "./RolesManager"
import WellPermitsManager from "./WellPermitsManager"
import { BsCheckCircleFill, BsHourglassSplit } from 'react-icons/bs'
import { Tooltip } from "@mui/material"
import useRoles from "../../../hooks/useRoles"

interface Props {
  user: UserManagement | undefined
}

const AdminProfileComponent = ({ user }: Props) => {

  return (
    <div className="grid grid-cols-4">
      <div className="col-span-4 md:col-span-1 flex flex-col items-center border-r">
        {user?.picture &&
          <Image
            src={user.picture}
            alt='Profile picture'
            width={100}
            height={100}
            className="rounded-full overflow-hidden"
          />
        }
        { user?.name &&
          <div className="mt-4 font-bold text-xl">{ user?.name }</div>
        }
        {
          user?.email &&
          <div className="text-gray-500 flex items-center">
            {user.email_verified && 
              <Tooltip title="Verified email">
                <span className="mr-2 text-success-600"><BsCheckCircleFill /></span>
              </Tooltip>
            } 
            {!user.email_verified && 
              <Tooltip title="email not verified">
                <span className="mr-2 text-gray-500"><BsHourglassSplit /></span>
              </Tooltip>
            } 
            { user?.email }
          </div>
        }

        <div className="mt-4 w-full">
          { user?.last_login &&
            <div className="mt-4">
              <span className="text-gray-500">Last Login</span>
              <div className="font-bold">
                {new Date(user?.last_login).toLocaleDateString('en-us', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          }
          { user?.last_ip &&
            <div className="mt-4">
              <span className="text-gray-500">Last IP</span>
              <div className="font-bold">
                {user.last_ip}
              </div>
            </div>
          }
          { user?.created_at &&
            <div className="mt-4">
              <span className="text-gray-500">Account Created</span>
              <div className="font-bold">
                {new Date(user.created_at).toLocaleDateString('en-us', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          }
          { user?.logins_count &&
            <div className="mt-4">
              <span className="text-gray-500">Number of Logins</span>
              <div className="font-bold">
                {user.logins_count}
              </div>
            </div>
          }
          { user?.user_id &&
            <div className="mt-4">
              <span className="text-gray-500">User ID</span>
              <div className="font-bold">
                {user.user_id}
              </div>
            </div>
          }
          { user?.identities && 
          <div className="mt-4">
            <span className="text-gray-500">Identity Providers</span>
            {user.identities.map((identity, i) =>
              <div key={i} className="font-bold">
                {identity.provider}
              </div>
            )}

          </div>
          }
        </div>
      </div>

      <div className="flex flex-col col-span-4 md:col-span-3">
        <div className="grow px-2 py-4 md:py-4 md:px-4 border-b">
          <div className="text-xl font-semibold mb-4">Roles</div>
          <RolesManager user={user} assignedRoles={user?.roles} />
        </div>
        <div className="grow mt-4">
          <div className="text-xl font-semibold mb-4">Well Permits</div>
          <WellPermitsManager user={user} />
        </div>
      </div>
    </div>
  )
}

export default AdminProfileComponent