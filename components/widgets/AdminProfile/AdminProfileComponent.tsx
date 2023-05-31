import Image from "next/image"
import { UserManagement } from "../../../interfaces/User"
import RolesManager from "./RolesManager"
import { BsCheckCircleFill, BsHourglassSplit } from 'react-icons/bs'
import { Tooltip } from "@mui/material"
import WellPermitsManager from "./WellPermitsManager"
import ReportingAgentForm from "../UserProfile/ReportingAgentForm"
import { useSnackbar } from "notistack"
import useConfirmationDialog from "../../../hooks/useConfirmationDialog"
import Button from "../../common/Button"
import { useRouter } from "next/router"

interface Props {
  user: UserManagement | undefined
}

const AdminProfileComponent = ({ user }: Props) => {
  const { enqueueSnackbar } = useSnackbar()
  const { getConfirmation } = useConfirmationDialog()
  const router = useRouter()

  const handleDeleteUser = async () => {
    const confirmed = await getConfirmation({
      title: `Delete User`,
      message: `Are you sure you want to delete user ${user?.name}?`,
      confirmConfig: { title: 'Delete User', color: 'error' },
      confirmationMessage: `delete ${user && user.name}`
    })

    if (confirmed) {
      try {

        const res = await fetch(`/api/auth/users/${user?.user_id}`, {
          method: 'DELETE',
          headers: {
            "Content-Type": "application/json",
          },
        })

        enqueueSnackbar(`User deleted successfully`, { variant: 'success' })
        router.push('/manage-users')
      } catch (error: any) {
        enqueueSnackbar(`Something went wrong - please try again.`, { variant: 'error' })
      }
    }

  }

  return (
    <div className="grid grid-cols-4">
      <div className="col-span-4 md:col-span-1 flex flex-col items-center border-r px-2">
        {user?.picture &&
          <Image
            src={user.picture}
            alt='Profile picture'
            width={100}
            height={100}
            className="rounded-full overflow-hidden"
          />
        }
        {user?.name &&
          <div className="mt-4 font-bold text-xl">{user?.name}</div>
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
            {user?.email}
          </div>
        }

        <div className="mt-4 w-full">
          {user?.last_login &&
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
          {user?.last_ip &&
            <div className="mt-4">
              <span className="text-gray-500">Last IP</span>
              <div className="font-bold">
                {user.last_ip}
              </div>
            </div>
          }
          {user?.created_at &&
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
          {user?.logins_count &&
            <div className="mt-4">
              <span className="text-gray-500">Number of Logins</span>
              <div className="font-bold">
                {user.logins_count}
              </div>
            </div>
          }
          {user?.user_id &&
            <div className="mt-4">
              <span className="text-gray-500">User ID</span>
              <div className="font-bold">
                {user.user_id}
              </div>
            </div>
          }
          {user?.identities &&
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
          <RolesManager />
        </div>
        <div className="grow pt-4 pb-8 px-4 border-b">
          <div className="text-xl font-semibold mb-4">Well Permits</div>
          <WellPermitsManager user={user} />
        </div>
        <div className="grow pt-6 pb-8 px-4 border-b">
          <ReportingAgentForm user_id={user?.user_id} />
        </div>
        <div className="grow pt-6 pb-8 px-4">

          <div className="text-xl font-semibold mb-4">Danger Zone</div>
          <div className="flex items-center border border-error-500 rounded p-6">
            <div className="pr-4">
              <div className="text-lg font-bold">
                Delete User
              </div>
              <div>
                Delete user and all associated data.  Roles and well permit assignment will be permenantly deleted.  Deleting a user will not affect well data.
              </div>
            </div>
            <div className="min-w-fit">
              <Button title="Delete User" color="error" onClick={handleDeleteUser} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminProfileComponent
