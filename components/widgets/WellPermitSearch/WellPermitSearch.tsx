import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react"
import useSWRInfinite from "swr/infinite";
import WellPermitTable from "../DataTable/DataTable";
import Select, { SingleValue } from 'react-select'
import searchOptions, { SearchTermName, SelectOption } from "./search-data";
import useSWR from "swr";
import wellPermitColumnDefs, { defaultColDef } from "./well-permit-search-column-defs";
import { IoAdd, IoSearchSharp } from "react-icons/io5";
import { useUser } from "@auth0/nextjs-auth0";
import { UserData } from "../../../interfaces/User";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import { RowNode } from "ag-grid-community";
import { useSnackbar } from "notistack";
import { WellPermit } from "../../../interfaces/WellPermit";
import TableFilters from "../../common/TableFilterSelect";
import TableFilter from "./TableFilter";
import TableActionButton from "../../common/TableActionButton";
import { tailwindColors } from "../../../lib/tailwindcss/tailwindConfig";
import Link from "next/link";

interface SearchTerm {
  term: string
  value: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const PAGE_SIZE = 10
const selectTerms = searchOptions
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
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const [filterModel, setFilterModel] = useState<{}>()
  const [addPermitsLoading, setAddPermitsLoading] = useState(false)

  const { data, error } = useSWR(
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

      const url = `/api/v1/well-permits`
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(recordsWithSamePermitNumber)
      }).then(res => res.json())

      if (!user) throw new Error('User not defined')
      const permitRefs = res.map((el: any) => ({
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
    </div>
  )
}

export default WellPermitSearch
