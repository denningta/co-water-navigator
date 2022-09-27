import { UserProfile, useUser } from "@auth0/nextjs-auth0"
import Image from "next/image"
import { UserManagement } from "../../../interfaces/User"
import RoleTag from "../../common/RoleTag"
import ReportingAgentForm from "./ReportingAgentForm"

type CustomUserProfile = UserProfile & {
  'coWaterExport/roles'?: string[]
}

interface Props {
  user: CustomUserProfile | undefined
}

const UserProfileComponent = ({ user }: Props) => {

  return (
    <div>
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
            <div className="mt-4 font-bold text-xl">{ user.name }</div>
          }
          { user?.email &&
            <div className="text-gray-500">{ user.email }</div>
          }
        </div>

        <div className="col-span-3">
          <>
            { user && user['coWaterExport/roles'] &&
              <div className="grow p-4 border-b">
                <span className="text-xl font-semibold">Roles</span>
                <div className="mt-3">
                  {user['coWaterExport/roles'].map((role, i) =>
                      <RoleTag key={i} role={{ name: role }} />
                  )}
                </div>
              </div>
            }
            <div className="grow p-4">
              <ReportingAgentForm />
            </div>
          </>
        </div>
      </div>
    </div>
  )
}

export default UserProfileComponent