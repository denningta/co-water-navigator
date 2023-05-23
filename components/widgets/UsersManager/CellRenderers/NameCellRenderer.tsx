import { ICellRendererParams } from "ag-grid-community";
import Image from 'next/image'
import Link from "next/link";

const NameCellRenderer = (params: ICellRendererParams) => {
  return (
    <Link
      href={`/manage-users/${encodeURIComponent(params.data.user_id)}`}
    >
      <span className="flex items-center cursor-pointer hover:underline hover:text-blue-500">
        {params.data.picture &&
          <div className="flex items-center min-w-[30px]">
            <Image
              src={params.data.picture}
              alt='Profile picture'
              width={30}
              height={30}
              className="rounded-full overflow-hidden"
            />
          </div>
        }
        <span className="ml-2">{params.value}</span>
      </span>
    </Link>
  )
}

export default NameCellRenderer
