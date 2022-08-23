import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { AgGridReact } from "ag-grid-react"
import { useState } from "react"

const WellPermitTable = () => {

  const [rowData] = useState([
    { 
      permit: '31643-FP',
      status: 'up-to-date',
      latestReading: '2021-12',
      contactName: 'Castle Rock Water'
    },
    { 
      permit: '14860-RFP',
      status: 'up-to-date',
      latestReading: '2021-12',
      contactName: 'Castle Rock Water'
    },
    { 
      permit: '12123-RFP',
      status: 'up-to-date',
      latestReading: '2021-12',
      contactName: 'Castle Rock Water'
    },
    { 
      permit: '12124-RFP',
      status: 'up-to-date',
      latestReading: '2021-12',
      contactName: 'Castle Rock Water'
    }
  ])

  const [columnDefs] = useState([
    { field: 'permit' },
    { field: 'status' },
    { field: 'latestReading' },
    { field: 'contactName' },
  ])

  return (
    <div>
      <div className='mb-4 text-xl font-extrabold'>Well permits assigned to you</div>
      <div className="ag-theme-alpine" style={{ height: 400 }}>
        <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}>
        </AgGridReact>
      </div>
    </div>
  )
}

export default WellPermitTable