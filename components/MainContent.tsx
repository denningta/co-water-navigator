export interface Widget {
  component: ((props?: any) => JSX.Element)
  colspan: number
}

interface Props {
  widgets: Widget[]
  columns?: number
}

const MainContent = ({ columns, widgets }: Props) => {

  return (
    <div
      className='grid md:gap-6 max-w-primary-col mx-auto'
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {widgets.map((widget, i) => {
        return (
          <div
            key={`widget-${i}`}
            className="bg-white md:rounded-lg drop-shadow-xl py-6 px-2 md:px-6 h-fit col-span-2"
            style={{ gridColumn: `span ${widget.colspan} / span ${widget.colspan}` }}
          >
            {widget.component()}
          </div>
        )
      })}
    </div>
  )
}

export default MainContent
