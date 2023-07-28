import axios from 'axios'
import { FormikHelpers, FormikValues } from 'formik'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { BsGearFill } from 'react-icons/bs'
import { TiExport } from 'react-icons/ti'
import { useSWRConfig } from 'swr'
import useConfirmationDialog from '../../../hooks/useConfirmationDialog'
import useDataSummaryByPermit from '../../../hooks/useDataSummaryByPermit'
import { ModifiedBanking } from '../../../interfaces/ModifiedBanking'
import BreadcrumbsRouter from '../../common/BreadcrumbsRouter'
import Button from '../../common/Button'
import InitializeWellWizard, { InitializeWellFormValues } from '../../common/InitializeWellWizard'

interface Props {
  permitNumber?: string
  year?: string
  owner?: string
  location?: string
}

const MeterReadingsHeader = ({ permitNumber, year }: Props) => {
  const { data } = useDataSummaryByPermit(permitNumber)
  const [wizardOpen, setWizardOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { getConfirmation } = useConfirmationDialog()
  const { enqueueSnackbar } = useSnackbar()
  const { mutate } = useSWRConfig()

  useEffect(() => {
    if (!data) return
    if (data && data.length > 0) return
    setTimeout(() => {
      setWizardOpen(true)
    }, 500)
  }, [data])

  const handleWizardClose = async () => {
    const confirm = await getConfirmation({
      title: 'Are you sure you want to exit the well setup wizard?',
      confirmConfig: {
        title: 'Exit setup'
      }
    })

    if (confirm) setWizardOpen(false)
  }


  const handleSubmit = async (
    values: InitializeWellFormValues,
  ) => {

    setIsLoading(true)
    try {
      const modifiedBanking: ModifiedBanking = {
        originalAppropriation: {
          value: +values.originalAppropriation
        },
        allowedAppropriation: {
          value: +values.allowedAppropriation
        },
        bankingReserveLastYear: {
          value: +values.bankingReserveLastYear
        }
      }
      delete modifiedBanking.pumpingLimitNextYear

      const key = `/api/v1/modified-banking/${permitNumber}/${year}`
      const modBankingRes = await axios.post(
        key,
        modifiedBanking
      )
      const calculationRes = await axios.post(
        key + '/calculate'
      )

      mutate(
        key,
        calculationRes,
        {
          revalidate: true,
          rollbackOnError: true
        }
      )
      mutate(`/api/v1/data-summary?permitNumber=${permitNumber}`)

      enqueueSnackbar(`Setup of permit ${permitNumber} successful!`, { variant: 'success' })

      setIsLoading(false)
      setWizardOpen(false)

    } catch (error: any) {
      enqueueSnackbar('Something went wrong', { variant: 'error' })
    }
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center space-y-2">
      <div>
        <div className="font-thin">WELL PERMIT</div>
        {permitNumber && <div className="font-extrabold text-3xl">{permitNumber}</div>}
        <div className="mt-2">
          <BreadcrumbsRouter />
        </div>
      </div>
      <div className="grow"></div>
      <div className="md:flex items-center h-full mr-8 space-x-6">
        {!data || data.length === 0 &&
          <Button
            title="Set up well"
            icon={<BsGearFill />}
            type="button"
            onClick={() => setWizardOpen(true)}
          />
        }
        {data && data.length > 0 &&
          <Button
            title="Export"
            href="/export"
            icon={<TiExport />}
            type="button"
          />
        }
      </div>
      <InitializeWellWizard
        dialogProps={{
          open: wizardOpen,
          onClose: handleWizardClose
        }}
        onFormSubmit={handleSubmit}
        permitnumber={permitNumber}
        year={year}
        isLoading={isLoading}
      />
    </div>
  )
}

export default MeterReadingsHeader
