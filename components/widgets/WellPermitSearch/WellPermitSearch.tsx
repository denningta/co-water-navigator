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
    setSearchTerms({...searchTerms})
  }

  const handleSelectChange = (termName: SearchTermName, option: SingleValue<SelectOption>) => {
    searchTerms[termName] = option?.value
    setSearchTerms({...searchTerms})
  }

  const handleRowSelectionChange = (rowNodes: RowNode[]) => {
    setSelectedRowNodes(rowNodes)
  }

  const handleAddPermits = async () => {
    try {
      setAddPermitsLoading(true)
      if (!selectedRowNodes) throw new Error('No rows selected')

      const url = `/api/v1/well-permits`
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedRowNodes.map(rowNode => rowNode.data))
      }).then(res => res.json())
  
      if (!user) throw new Error('User not defined')
      const permitRefs = res.map((el: any) => ({ 
        document_id: el.document_id, 
        permit: el.permit, 
        status: 'requested' 
      }))
  
      const appMetaDataRes = await fetch('/api/auth/user/update-app-meta-data', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ permitRefs: permitRefs })
      }).then(res => res.json())

      enqueueSnackbar('Permit(s) successfully added', { variant: 'success' })
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

      <button 
        onClick={handleAddPermits}
        className={`flex items-center mb-4  rounded-lg py-3 drop-shadow w-fit transition ease-in-out ${(selectedRowNodes && selectedRowNodes.length) ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-400'}`}
        disabled={!selectedRowNodes?.length}>
        <span className="border-r border-slate-300 px-4 ">
          { selectedRowNodes ? selectedRowNodes.length : 0 } selected
        </span>
          <div className="flex items-center justify-center px-4 w-[150px] ">
              {!addPermitsLoading && 
                <IoAdd className=" font-extrabold" size={20} />
              }
              {addPermitsLoading && 
                <CircularProgress color="inherit" size={20} />
              }
            <span className="ml-1">Add permits</span>
          </div>
      </button>
      <WellPermitTable 
        defaultColDef={defaultColDef}
        columnDefs={wellPermitColumnDefs} 
        rowData={rowData} 
        height={400} 
        filterModel={filterModel}
        onRowSelectionChanged={handleRowSelectionChange}
      />
    </div>
  )
}

export default WellPermitSearch
