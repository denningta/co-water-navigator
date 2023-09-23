import { ChangeEvent, useEffect, useState } from "react"
import WellPermitTable from "../DataTable/DataTable";
import { SingleValue } from 'react-select'
import { SearchTermName, SelectOption } from "./search-data";
import useSWR from "swr";
import wellPermitColumnDefs, { defaultColDef } from "./well-permit-search-column-defs";
import { IoAdd } from "react-icons/io5";
import { BsInfoCircleFill } from "react-icons/bs"
import { useUser } from "@auth0/nextjs-auth0";
import { RowNode } from "ag-grid-community";
import { useSnackbar } from "notistack";
import TableFilter from "./TableFilter";
import TableActionButton from "../../common/TableActionButton";
import { tailwindColors } from "../../../lib/tailwindcss/tailwindConfig";
import Link from "next/link";
import axios from "axios";


const fetcher = (url: string) => fetch(url).then((res) => res.json());
const baseUrl = 'https://dwr.state.co.us/Rest/GET/api/v2/wellpermits/wellpermit/'

type SearchTerms = {
  [key in SearchTermName]: string | undefined;
};

const initialSearchTerms: SearchTerms = {
  permit: undefined, contactName: undefined, receipt: undefined, county: undefined, designatedBasinName: undefined, division: undefined, managementDistrictName: undefined, waterDistrict: undefined, modified: undefined, fields: 'receipt%2Cpermit%2CcontactName%2CpermitCurrentStatusDescr%2Cmodified', format: 'json'
}

const WellPermitSearch = () => {
  const { user } = useUser()
  const [url, setUrl] = useState<string | null>(null)
  const [searchTerms, setSearchTerms] = useState(initialSearchTerms)
  const [rowData, setRowData] = useState<any[] | undefined>([])
  const [selectedRowNodes, setSelectedRowNodes] = useState<RowNode[] | undefined>(undefined)
  const { enqueueSnackbar } = useSnackbar()
  const [filterModel, setFilterModel] = useState<{}>()
  const [addPermitsLoading, setAddPermitsLoading] = useState(false)

  const { data } = useSWR(
    url,
    fetcher
  );

  useEffect(() => {
    if (!data) return
    setRowData(data.ResultList)
  }, [data])

  const handleInputChange = (termName: SearchTermName, { target }: ChangeEvent<HTMLInputElement>) => {
    if (termName === 'permit' || termName === 'contactName') {
      setFilterModel({
        ...filterModel,
        [termName]: {
          filterType: 'text',
          type: 'contains',
          filter: target.value
        }
      })
    }
    searchTerms[termName] = target.value === '' ? undefined : target.value
    setSearchTerms({ ...searchTerms })
  }

  const handleSelectChange = (termName: SearchTermName, option: SingleValue<SelectOption>) => {
    searchTerms[termName] = option?.value
    setSearchTerms({ ...searchTerms })
  }

  const handleRowSelectionChange = (rowNodes: RowNode[]) => {
    setSelectedRowNodes(rowNodes)
  }

  const handleAddPermits = async () => {
    try {
      setAddPermitsLoading(true)
      if (!selectedRowNodes) throw new Error('No rows selected')

      const recordsWithSamePermitNumber = rowData?.filter(row =>
        selectedRowNodes.map(rowNode => rowNode.data.permit).includes(row.permit)
      )

      const res = await axios.post(
        '/api/v1/well-permits/codwr',
        recordsWithSamePermitNumber
      )

      if (!user) throw new Error('User not defined')
      const permitRefs = res.data.map((el: any) => ({
        document_id: el.document_id,
        permit: el.permit,
        status: 'requested'
      }))

      const appMetaDataRes = await fetch('/api/auth/user/update-app-meta-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ permitRefs: permitRefs })
      }).then(res => res.json())

      const successMsg = (updates: number) => <div className="flex">
        <div>Success! {updates} permit(s) updated.  </div>
        <Link href="/well-permits">
          <a className="underline text-primary-300 ml-2">View well permits</a>
        </Link>
      </div>

      if (appMetaDataRes.updates) enqueueSnackbar(successMsg(appMetaDataRes.updates), { variant: 'success' })
      if (appMetaDataRes.warnings.length > 0) {
        appMetaDataRes.warnings.forEach((warning: string, index: number) =>
          index < 4 && enqueueSnackbar(warning)
        )
      }
      setAddPermitsLoading(false)
    } catch (error: any) {
      console.log(error)
      setAddPermitsLoading(false)
      enqueueSnackbar('Something went wrong, please try again', { variant: 'error' })
    }
  }


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setRowData(undefined)
    const terms = Object.keys(searchTerms) as (keyof typeof searchTerms)[]
    const urlQueryArray = terms
      .filter(termName => searchTerms[termName] !== undefined)
      .map(termName => {
        if (termName === 'receipt') return `${termName}=*${searchTerms[termName]}*`
        return `${termName}=${searchTerms[termName]}`
      })
    const urlQuery = urlQueryArray.join('&')
    setUrl(baseUrl + '?' + urlQuery)
  }

  const handleSearch = (searchQuery: string | undefined) => {
    if (!searchQuery) return
    setRowData(undefined)
    setUrl(baseUrl + '?' + searchQuery)
  }

  return (
    <div className="w-full">
      <div className="mb-4 text-xl font-bold">Search for well permits</div>
      <div className="mb-4">
        <TableFilter
          onFilterModelChange={setFilterModel}
          onSearch={(q) => handleSearch(q)}
          isLoading={!!(!data && url)}
        />
      </div>

      <div className="mb-4">
        <TableActionButton
          title="Add permits"
          icon={<IoAdd />}
          onClick={handleAddPermits}
          numSelected={selectedRowNodes?.length}
          color={tailwindColors['success']['600']}
          isLoading={addPermitsLoading}
        />
      </div>
      <WellPermitTable
        defaultColDef={defaultColDef}
        columnDefs={wellPermitColumnDefs}
        rowData={rowData}
        filterModel={filterModel}
        onRowSelectionChanged={handleRowSelectionChange}
        paginationPageSize={20}
        domLayout="autoHeight"
      />
      <div className="space-y-3 text-sm text-gray-500 mt-3">
        <div className="flex items-center">
          <BsInfoCircleFill className="mr-2" />
          This search tool queries the Colorado Department of Water Resrouces Decision Support System database.
        </div>

        <div className="flex items-center">
          <BsInfoCircleFill className="mr-2" />
          You may find multiple records for a single well permit.  Select the record that most closely matches the "contact name" and "location" you expect to include on your forms.
        </div>

        <div className="flex items-center">
          <BsInfoCircleFill className="mr-2" />
          This data can be customized at any time in the settings page of the well permit.

        </div>
      </div>
    </div>
  )
}

export default WellPermitSearch
