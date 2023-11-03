import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import AppLayout from "../../../../components/AppLayout";
import MainContent, { Widget } from "../../../../components/MainContent";
import MeterReadingsHeader from "../../../../components/widgets/MeterReadings/MeterReadingsHeader";
import ReportingAgentForm from "../../../../components/widgets/UserProfile/ReportingAgentForm";
import WellPermitsRecordsManager from "../../../../components/widgets/WellPermitsRecordsManager/WellPermitRecordsManager";
import { NextPageWithLayout } from "../../../_app";

const PermitSettings: NextPageWithLayout = () => {
  const router = useRouter()
  const { user } = useUser()
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
    },
    {
      component: () =>
        <div>
          <ReportingAgentForm
            user_id={user?.sub}
            subTitle={<>
              <div>Set reporting agent information for permit {permitNumber}.</div>
              <div>You can still edit agent information globally in your
                <span className="text-blue-500 underline ml-1"><Link href='/profile'>profile</Link></span>.</div>
            </>}
            permitNumber={permitNumber}
          />
        </div>
      ,
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
