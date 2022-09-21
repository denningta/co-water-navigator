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

interface Props {
  user: UserManagement | undefined
}

const AdminProfileComponent = ({ user }: Props) => {

  return (
    <div className="grid grid-cols-4">
      <div className="col-span-1 flex flex-col items-center border-r">
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
          <div className="text-gray-500">{ user?.email }</div>
        }
      </div>

      <div className="flex flex-col col-span-3">
        <div className="grow p-4 border-b">
          <div className="text-xl font-semibold mb-4">Roles</div>
          <RolesManager roles={user?.roles} />
        </div>
        <div className="grow p-4">
          <div className="text-xl font-semibold mb-4">Well Permits</div>
          <WellPermitsManager user={user} />
        </div>
      </div>
    </div>
  )
}

export default AdminProfileComponent