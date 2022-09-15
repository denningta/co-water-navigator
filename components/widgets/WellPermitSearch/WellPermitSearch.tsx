import { ChangeEvent, useEffect, useState } from "react"
import useSWRInfinite from "swr/infinite";
import WellPermitTable from "../WellPermitsTable/WellPermitTable";
import Select, { SingleValue } from 'react-select'
import searchOptions, { SearchTermName, SelectOption } from "./search-data";
import useSWR from "swr";
import wellPermitColumnDefs from "./well-permit-search-column-defs";
import { IoAdd, IoSearchSharp } from "react-icons/io5";
import { useUser } from "@auth0/nextjs-auth0";
import { UserData } from "../../../interfaces/User";

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
  permit: undefined, contactName: undefined, receipt: undefined, county: undefined, designatedBasinName: undefined, division: undefined, managementDistrictName: undefined, waterDistrict: undefined, modified: undefined, fields: 'receipt%2Cpermit%2CcontactName%2CpermitCurrentStatusDescr', format: 'json'
}

const WellPermitSearch = () => {
  const { user } = useUser()
  const [url, setUrl] = useState<string | null>(null)
  const [pageIndex, setPageIndex] = useState(1)
  const [searchTerms, setSearchTerms] = useState(initialSearchTerms)
  const [rowData, setRowData] = useState<any[] | undefined>([])
  const [selectedRowData, setSelectedRowData] = useState<any[] | undefined>(undefined)
  const [filterModel, setFilterModel] = useState<{}>({
    permitCurrentStatusDescr: {
      filterType: 'text',
      type: 'contains',
      filter: 'issued'
    }
  })
  const { data, error } = useSWR(
    url,
    fetcher
  );

  useEffect(() => {
    if (data) setRowData(data.ResultList)
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

  const handleRowSelectionChange = (rowData: any[]) => {
    setSelectedRowData(rowData)
  }

  const handleAddPermits = async () => {
    const url = `/api/v1/well-permits`
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(selectedRowData)
    })
      .then(res => res.json())
      .catch(error => error)

    if (!user) throw new Error('No user: cannot create reference to well permits for this user')
    const permitRefs = res.map((el: any) => ({ document_id: el.id, status: 'requested' }))

    await fetch('/api/auth/user/update-app-meta-data', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ permitRefs: permitRefs })
    })
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

  return (
    <div className="w-full">
      <div className="mb-4 text-xl font-bold">Search for well permits</div>

      <form onSubmit={handleSubmit} className="flex items-center">
        <div className="grid grid-cols-3 gap-2 mb-4 grow mr-6">
          <input
            className="border border-gray-300 rounded outline-blue-500 px-2 h-[38px] w-full placeholder:"
            placeholder="Permit Number"
            onChange={(event) => handleInputChange('permit', event)}>
          </input>
          <input
            className="border border-gray-300 rounded outline-blue-500 px-2 h-[38px] w-full"
            placeholder="Contact Name"
            onChange={(event) => handleInputChange('contactName', event)}>
          </input>
          <input
            className="border border-gray-300 rounded outline-blue-500 px-2 h-[38px] w-full"
            placeholder="Receipt Number"
            onChange={(event) => handleInputChange('receipt', event)}>
          </input>
          { selectTerms.map((term, i) =>
            <Select key={i}
              instanceId={term.name}
              options={term.options}
              isClearable={true}
              placeholder={term.title}
              onChange={(event) => handleSelectChange(term.name, event)}
            />
          )}
          <input type="date" className="px-2 border border-gray-300 rounded h-[38px]" placeholder="Modified" />
        </div>
        <button className="flex items-center mb-4 px-3 py-2 bg-primary text-white rounded-lg w-fit h-fit">
          <IoSearchSharp />
          <span className="ml-2">Search</span>
        </button>
      </form>
      <button 
        onClick={handleAddPermits}
        className={`flex items-center mb-4  rounded-lg py-3 drop-shadow w-fit transition ease-in-out ${(selectedRowData && selectedRowData.length) ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-400'}`}
        disabled={!selectedRowData?.length}>
        <span className="border-r border-slate-300 px-4 ">
          { selectedRowData ? selectedRowData.length : 0 } selected
        </span>
          <div className="flex items-center px-4">
            <span className="text-xl">
              <IoAdd className=" font-extrabold" />
            </span>
            <span className="ml-1">Add permits to account</span>
          </div>
      </button>
      <WellPermitTable 
        columnDefs={wellPermitColumnDefs} 
        rowData={rowData} 
        height={400} 
        filterModel={filterModel}
        onRowSelectionChanged={(rowData) => handleRowSelectionChange(rowData)}
      />

    </div>
  )
}

export default WellPermitSearch
