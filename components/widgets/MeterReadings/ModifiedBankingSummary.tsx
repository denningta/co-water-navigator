import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material"
import useDbb004BankingSummary from "../../../hooks/useDbb004BankingSummary"
import useTailwindBreakpoints from "../../../hooks/useTailwindBreakpoints"
import EditButton from "../../common/EditButton"
import { IoChevronDown } from "react-icons/io5"

interface Props {
  permitNumber: string | undefined
  year: string | undefined
}

const ModifiedBankingSummary = ({ permitNumber, year }: Props) => {
  const { data } = useDbb004BankingSummary(permitNumber, year)
  const breakpoint = useTailwindBreakpoints()

  const title = <div className="font-bold text-xl">Three Year Modified Banking (from DBB-013)</div>

  const content = <div>
    <div className="grid grid-cols-6 gap-4 mt-2">
      {data?.allowedAppropriation
        ? <div className="col-span-2 font-bold text-right">{data.allowedAppropriation} acre-feet</div>
        : <div className="col-span-2 text-right text-gray-400">not defined</div>
      }
      <div className="col-span-4 font-thin">ALLOWED ANNUAL APPROPRIATION PER APPROVED CHANGE</div>

      {data?.pumpingLimitThisYear
        ? <div className="col-span-2 font-bold text-right">{data.pumpingLimitThisYear} acre-feet</div>
        : <div className="col-span-2 text-right text-gray-400">not defined</div>
      }
      <div className="col-span-4 font-thin">ALLOWED PUMPING THIS YEAR WITH 3-YEAR BANKING</div>

      {data?.flowMeterLimit
        ? <div className="col-span-2 font-bold text-right">{data.flowMeterLimit} acre-feet</div>
        : <div className="col-span-2 text-right text-gray-400">not defined</div>
      }
      <div className="col-span-4 font-thin">FLOW METER LIMIT</div>
    </div>
  </div>

  return (
    <div className="relative">
      {(breakpoint !== 'sm' && breakpoint !== 'md') ?
        <>
          <>{title}</>
          <>{content}</>
        </>
        :
        <Accordion>
          <AccordionSummary
            expandIcon={<IoChevronDown />}
          >
            {title}
          </AccordionSummary>
          <AccordionDetails>
            {content}
          </AccordionDetails>
        </Accordion>

      }


    </div>
  )
}

export default ModifiedBankingSummary
