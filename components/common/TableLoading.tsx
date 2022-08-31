interface Props {
  height: number
  numberOfRows: number
}

const TableLoading = ({ height, numberOfRows = 1 }: Props) => {

  const rows: JSX.Element[] = []

  for (let i = 0; i <= numberOfRows; i++) {
    rows.push(<Row key={i} />)
  }

  return (
    <div
      style={{ height: height }}
      className="w-full">
      <div className="grid grid-cols-1 gap-4">
        { rows }
      </div>
    </div>
  )
}

interface RowProps {
  key: string | number
}

const Row = ({ key }: RowProps) => {
  return <div key={key} className="h-8 rounded-lg bg-gradient-to-r from-gray-200 via-white to-gray-200 bg-opacity-10 background-animate"></div>
}

export default TableLoading