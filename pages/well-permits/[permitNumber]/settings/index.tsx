import { useRouter } from "next/router";
import { ReactElement } from "react";
import AppLayout from "../../../../components/AppLayout";
import MainContent, { Widget } from "../../../../components/MainContent";
import MeterReadingsHeader from "../../../../components/widgets/MeterReadings/MeterReadingsHeader";
import WellPermitsRecordsManager from "../../../../components/widgets/WellPermitsRecordsManager/WellPermitRecordsManager";
import { NextPageWithLayout } from "../../../_app";

const PermitSettings: NextPageWithLayout = () => {
  const router = useRouter()
  const { query } = router
  const permitNumber = Array.isArray(query.permitNumber) ? query.permitNumber[0] : query.permitNumber

  const widgets: Widget[] = [
    {
      component: () => {
        return (
          <MeterReadingsHeader
            permitNumber={permitNumber}
          />
        )
      },
      colspan: 3
    },
    {
      component: () => {
        return (
          <div className="space-y-4">
            <div className="text-3xl font-bold">Permit Data</div>
            <div>Select and manage meta data associated with this well permit</div>
            <div>This data will populate the fields on the DBB-004 and DBB-013 forms</div>
            <WellPermitsRecordsManager permitNumber={permitNumber} />
          </div>
        )
      },
      colspan: 3
    }

  ]


  return (
    <>
      <div className='mb-6'>
        <MainContent widgets={widgets} columns={3} />
      </div>
    </>
  )
}


PermitSettings.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>
      {page}
    </AppLayout>
  )
}

export default PermitSettings
