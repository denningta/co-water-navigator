import { CircularProgress } from "@mui/material"
import { TextFilterModel } from "ag-grid-community"
import React, { useEffect, useState } from "react"
import { IoClose, IoSearchSharp } from "react-icons/io5"
import { IoMdAdd } from "react-icons/io"
import { ActionMeta, InputProps } from "react-select"
import TableFilterSelect from "../../common/TableFilterSelect"
import searchOptions, { filterOptions, SearchOption } from "./search-data"
import Button from "../../common/Button"

interface FilterProps {
  title?: string
  filterType?: string
  type?: string
  filter?: string
}

export type FilterModel = {
  [key: string]: FilterProps
}

interface Props {
  isLoading?: boolean
  onSearch?: (searchQuery?: string, filterModel?: TextFilterModel[]) => void
  onFilterModelChange?: (filterModel: FilterModel) => void
}

const TableFilter = ({ 
  isLoading = false,
  onSearch = () => {},
  onFilterModelChange = () => {}
}: Props) => {
  const [location, setLocation] = useState<string | undefined>(undefined)
  const [searchOption, setSearchOption] = useState<SearchOption | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined)
  const [filterModel, setFilterModel] = useState<FilterModel>()

  useEffect(() => {
    setSearchOption(
      searchOptions.find(opt => opt.name === location)
    )
  }, [location])

  useEffect(() => {
    onFilterModelChange(filterModel ?? {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterModel])

  const handleLocationChange = (newValue: any, actionMeta: ActionMeta<any>) => {
    if (!newValue) {
      setLocation(undefined) 
      return
    }
    setLocation(newValue.value)
  }

  const handleSearchTermChange = (newValue: any, actionMeta: ActionMeta<any>) => {
    if (!newValue) {
      setSearchQuery(undefined)
      return
    }
    setSearchQuery(`${location}=${newValue.value}`)
  }

  const handleFilterModel = (newValue: any) => {
    setFilterModel({
      ...filterModel,
      [newValue.value]: {
        title: newValue.label,
        filterType: 'text',
        type: 'contains',
        filter: ''
      }
    })
  }

  const handleCloseFilter = ({ target }: React.MouseEvent<HTMLDivElement>, filterName: string) => {
    const filterModelUpdate = {
      ...filterModel
    }
    delete filterModelUpdate[filterName]
    setFilterModel(filterModelUpdate)
  }

  const handleFilterChange = ({ target }: React.ChangeEvent<HTMLInputElement>, filterName: string) => {
    const filterModelUpdate = {
      ...filterModel
    }
    filterModelUpdate[filterName].filter = target.value
    setFilterModel(filterModelUpdate)

  }

  const handleSearch = (event: React.MouseEvent) => {
    event.preventDefault()
    onSearch(searchQuery)
  }

  return (
    <div>
      <div className="flex flex-wrap">
        <div className="w-[250px]">
          <TableFilterSelect
            instanceId="location"
            placeholder="Geographic Location"
            options={searchOptions.map(option =>
              ({ label: option.title, value: option.name }))
            }
            onChange={handleLocationChange}
            isClearable={true}
            required={true}
          />
        </div>
        {location && searchOption &&
          <>
            <div className="ml-4 w-fit">
              <TableFilterSelect
                instanceId={searchOption.name}
                placeholder={`Select a ${searchOption.title}`}
                options={searchOption.options}
                required={true}
                isClearable={true}
                onChange={handleSearchTermChange}
              />
            </div>
            {filterModel && Object.keys(filterModel).map((key, i) => 
              <div key={i} className="relative ml-4 flex h-fit items-center">
                <input 
                  type="text" 
                  className="px-2 border border-gray-300 rounded h-[38px] outline-none" 
                  placeholder={filterModel[key].title}
                  style={{
                    background: 'white',
                    border: '1px solid rgb(0, 0, 0, 0.05)',
                    boxShadow: 'none',
                    filter: 'drop-shadow(2px 2px 2px rgb(0, 0, 0, 0.2))',
                    borderRadius: '7px',
                    }}
                  onChange={(e) => handleFilterChange(e, key)}
                />
                <div 
                  className="absolute z-40 right-4 text-gray-400 cursor-pointer"
                  onClick={(e) => handleCloseFilter(e, key)}
                >
                  <IoClose />
                </div>
              </div>
            )}
            <div className="ml-4 w-[150px]">
              <TableFilterSelect
                instanceId={searchOption.name}
                options={filterOptions}
                placeholder={
                  <div className="flex items-center"><IoMdAdd /> Add Filter</div>
                }
                isClearable={true}
                value={'Add Filter'}
                hideCursor={true}
                onChange={handleFilterModel}
              />
            </div>
          </>
        }
      </div>
      <Button 
        title="Search" 
        icon={<IoSearchSharp />}
        isLoading={isLoading} 
        onClick={handleSearch} 
      />
    </div>
  )
}



export default TableFilter