import { ColDef } from "ag-grid-community"
import Checkbox from "../../common/Checkbox"

interface Props {
  columnDefs: ColDef[]
  selectionChanged?: (columnDefs: ColDef[]) => void
}

const ColumnSelector = ({ 
  columnDefs, 
  selectionChanged = () => null
}: Props) => {

  const handleChange = ([value, checked]: [string, boolean]) => {
    columnDefs.map(colDef => {
      if (colDef.field !== value) return
      colDef.hide = !checked
    })
    selectionChanged(columnDefs)
  }

  const columnData = columnDefs.map((colDef, i) => {
    return (
      <Checkbox 
        key={i} 
        checked={!colDef.hide}
        value={colDef.field}
        onChange={(change) => handleChange(change)} 
      />
    )
  })

  return (
    <>
      { columnData }
    </>
  )
}

export default ColumnSelector