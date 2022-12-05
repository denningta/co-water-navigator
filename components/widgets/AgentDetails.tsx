import { useUser } from '@auth0/nextjs-auth0'
import { divide } from 'lodash'
import Link from 'next/link'
import useAgentInfo from '../../hooks/useAgentInfo'
import EditButton from '../common/EditButton'

const AgentDetails = () => {
  const { user } = useUser()
  const { data } = useAgentInfo(user?.sub) 
  console.log(data)

  return (
    <div>
      <div className="text-gray-500 mb-2">AGENT DETAILS</div>
        <div className="grid grid-cols-1 gap-2">
          
          <div className="text-2xl font-extrabold">
            { data && data.firstName ? <span>{data.firstName} </span> : <span className='font-thin'>Agent Name</span> }
            { data && data.lastName && <span>{data.lastName}</span> }
          </div>
          <div>
            <div className="text-gray-500">AGENT FOR</div>
            { data && data.contactName && <div>{data.contactName}</div>} 
          </div>
          <div>
            <div className="text-gray-500">PHONE</div>
            { data && data.phone && <div>{data.phone}</div>}
          </div>
          <div>
            <div className="text-gray-500">ADDRESS</div>
            {data && data.address && <div>{data.address}</div>}
            {data && 
              <div>
                {data.city && <span>{data.city}, </span>}
                {data.state && <span>{data.state} </span>}
                {data.zip && <span>{data.zip}</span>}
              </div>
            }
          </div>
          <div className="absolute top-5 right-5">
            <Link href="/profile">
              <a>
                <EditButton />
              </a>
            </Link>
          </div>
        </div>
    </div>
  )
}

export default AgentDetails
