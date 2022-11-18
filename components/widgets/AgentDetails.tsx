import Link from 'next/link'
import EditButton from '../common/EditButton'

const AgentDetails = () => {
  return (
    <div className="grid grid-cols-1 gap-2">
      <div className="text-gray-500 mb-2">AGENT DETAILS</div>
      <div className="text-2xl font-extrabold">Tim Denning</div>
      <div>
        <div className="text-gray-500">AGENT FOR</div>
        <div>Castle Rock Water</div>
      </div>
      <div>
        <div className="text-gray-500">PHONE</div>
        <div>7026066540</div>
      </div>
      <div>
        <div className="text-gray-500">ADDRESS</div>
        <div>6583 Cartgate Court</div>
        <div>Las Vegas, Nv 80918</div>
      </div>
      <div className="absolute top-5 right-5">
        <Link href="/profile">
          <a>
            <EditButton />
          </a>
        </Link>
      </div>
    </div>
  )
}

export default AgentDetails
