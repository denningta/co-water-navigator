import { UserProfile, useUser } from "@auth0/nextjs-auth0"
import Image from "next/image"
import { UserManagement } from "../../../interfaces/User"

interface Props {
  user: UserManagement | UserProfile | undefined
}

const UserProfileComponent = ({ user }: Props) => {
  const test = useUser()

  return (
    <div>
      { user && 
        <div className="grid grid-cols-4">
          <div className="col-span-1 flex flex-col items-center border-r">
            {user.picture &&
              <Image
                src={user.picture}
                alt='Profile picture'
                width={100}
                height={100}
                className="rounded-full overflow-hidden"
              />
            }
            { user.name &&
              <div className="mt-4 font-bold text-xl">{ user.name }</div>
            }
            {
              user.email &&
              <div className="text-gray-500">{ user.email }</div>
            }
          </div>

          <div className="flex flex-col col-span-3">
            <div className="grow p-4 border-b">
              <span className="text-xl font-semibold">Roles</span>
              
            </div>
            <div className="grow p-4">profile info</div>
          </div>
        </div>
      }
    </div>
  )
}

export default UserProfileComponent