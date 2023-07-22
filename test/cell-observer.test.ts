import { Cell, MeterReading, Table } from "../pages/api/v1/meter-readings/[permitNumber]/calculate/Observer"

describe('Cell Subject Observer', () => {

  it('Cell state change should trigger update in observer', () => {



    const flowMeters = [
      new Cell(
        {
          value: 100,
          source: 'user'
        }
      ),
      new Cell(
        {
          value: 200,
          source: 'user'
        }
      )
    ]

  })


})

describe('Table', () => {

  it('Initialize table with data', () => {

    const meterReadings = [
      { date: { value: '2023-01' }, flowMeter: { value: 100 }, powerMeter: { value: 300 } },
      { date: { value: '2023-02' }, flowMeter: { value: 200 }, powerMeter: { value: 500 } },
      { date: { value: '2023-03' }, flowMeter: { value: 300 }, powerMeter: { value: 800 } },
    ]

    const table = new Table<MeterReading>(
      new MeterReading(),
      meterReadings
    )



    const cell = table.getCell(2, 5)
    cell.setFormula((thisCell, refCells) => {




    })



  })

})
