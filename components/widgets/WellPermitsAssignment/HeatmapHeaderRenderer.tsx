import { IHeaderParams } from "ag-grid-community"

const HeatmapHeaderRenderer = ({ displayName, api, column }: IHeaderParams) => {

  return (
    <div className="flex flex-col">
      <div className="my-2">{ displayName }</div>
    </div>
  )
}

export default HeatmapHeaderRenderer