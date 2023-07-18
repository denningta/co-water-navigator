
export interface Subject {
  attach(observer: Observer): void
  detach(observer: Observer): void
  notify(): void
}

interface Observer {
  update(subject: Subject): void
}


export class MeterReading {
  date?: CellValue = undefined
  permitNumber?: CellValue = undefined
  flowMeter?: CellValue = undefined
  powerMeter?: CellValue = undefined
  powerConsumptionCoef?: CellValue = undefined
  pumpedThisPeriod?: CellValue = undefined
  pumpedYearToDate?: CellValue = undefined
  availableThisYear?: CellValue = undefined
  readBy?: CellValue = undefined
  comments?: CellValue = undefined
  createdAt?: CellValue = undefined
  createdBy?: CellValue = undefined
  updatedAt?: CellValue = undefined
  updatedBy?: CellValue = undefined

  constructor() { }

}

export class Table<T> {
  private numRows: number
  private numCols: number
  private columns: Array<keyof T>
  private cells: Cell<T>[][] = []
  compareFunction?: ((a: Cell<T>[], b: Cell<T>[]) => number) | undefined

  constructor(
    structure?: T,
    data?: T[],
    compareFunction?: ((a: Cell<T>[], b: Cell<T>[]) => number) | undefined
  ) {
    this.numRows = data?.length ?? 0
    this.columns = Object.getOwnPropertyNames(structure) as Array<keyof T>
    this.numCols = this.columns.length

    if (data) {
      this.cells = data.map((row, rowIndex) => {
        return this.columns.map((col, colIndex) => {
          return new Cell(
            row[col],
            col
          )
        })
      })

      this.cells.sort(compareFunction)


      this.loopThroughCells((cell) => cell.setContext(this.cells))
    }


  }

  private loopThroughCells(callback: (cell: Cell<T>) => void) {
    for (let row = 0; row < this.numRows; row++) {
      for (let col = 0; col < this.numCols; col++) {
        const cell = this.cells[row][col]
        callback(cell)
      }
    }
  }

  setCellData(row: number, col: number, data: any) {
    if (!this.isCellValid(row, col))
      throw new Error('Invalid row or column index.')

    this.cells[row][col].setState(data)
  }

  getCell(row: number, col: number) {
    if (!this.isCellValid(row, col))
      throw new Error('Invalid row or column index.')

    return this.cells[row][col]
  }

  getColumnCells(colName: keyof T): Cell<T>[] {
    const column: Cell<T>[] = []
    this.loopThroughCells((cell) => {
      if (cell.columnName === colName) {
        column.push(cell)
      }
    })

    return column

  }



  private isCellValid(row: number, col: number) {
    if (row < 0 || row > this.numRows || col < 0 || col > this.numCols) return false
    return true
  }


}

export interface CellValue {
  value?: string | number | { [key: string]: any }
  shouldBe?: string | number
  calculationState?: 'success' | 'warning' | 'error'
  calculationMessage?: string
  source?: 'user' | 'calculation'
  comments?: string[]
}


export class Cell<T> implements Subject, Observer {
  public state?: CellValue
  public columnName?: keyof T
  public rowName?: string | number
  public formula?: (thisCell: Cell<T>, refCells: Cell<T>[]) => any
  private observers: Observer[] = []
  private context?: Cell<T>[][]

  constructor(
    state?: CellValue,
    columnName?: keyof T,
    rowName?: string | number
  ) {
    this.state = state
    this.columnName = columnName
    this.rowName = rowName
  }

  public setContext(context: Cell<T>[][]) {
    this.context = context
  }

  public setState(state: CellValue): void {
    this.state = state
    this.notify()
  }

  public setFormula(formula: (thisCell: Cell<T>, refCells: Cell<T>[]) => any) {
    this.formula = formula
  }


  /**
   * The subscription management methods.
   */
  public attach(observer: Observer): void {
    const isExist = this.observers.includes(observer)
    if (isExist) {
      return console.log("Subject: Observer has been attached already.")
    }

    console.log("Subject: Attached an observer.")
    this.observers.push(observer)
  }

  public detach(observer: Observer): void {
    const observerIndex = this.observers.indexOf(observer)
    if (observerIndex === -1) {
      return console.log("Subject: Nonexistent observer.")
    }

    this.observers.splice(observerIndex, 1)
    console.log("Subject: Detached an observer.")
  }

  /**
   * Trigger an update in each subscriber.
   */
  public notify(): void {
    console.log("Subject: Notifying observers...")
    for (const observer of this.observers) {
      observer.update(this)
    }
  }

  public update(subject: Subject): void {
    if (subject instanceof Cell) {
      console.log('Cell: reacted to the update')

    }
  }

}
