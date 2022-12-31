
import Image from 'next/image'
import meterReadingsPhoto from '../public/landing_page_img_1.png'
import exportPhoto from '../public/export_img.png'
import Button from '../components/common/Button'
import { useRouter } from 'next/router'

const LandingPage = () => {
  const router = useRouter()

  const handleLogin = () => {
    router.push('/api/auth/login')
  }

  return (
    <div className="max-w-primary-col mx-auto">

      <div className="w-full h-[300px] flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="text-5xl font-bold mb-2">Smart Well Management</div>
          <div className="text-xl mb-6">Store, manage, analyze, and export ground well data.</div>
          <div className="flex">
            <div className="mr-4"><Button title="Get started" onClick={handleLogin} /></div>
            <div><Button title="Log in" color="secondary" onClick={handleLogin} /></div>
          </div>
        </div>
      </div>

      <div className="w-full grid grid-cols-2">
        <div className="grow p-6 flex justify-center">
          <div className='max-w-[600px] p-2 bg-white rounded drop-shadow-lg'> 
            <Image src={meterReadingsPhoto} alt="Meter readings photo" ></Image>
          </div>
        </div>
        <div className="grow p-6 flex flex-col items-center justify-center">
          <div className="w-full">
            <div className="uppercase text-primary-500 font-extrabold mb-2">Flow meter Data</div>
            <div className="font-bold text-3xl mb-5">Collect, Store and View Meter Data</div>
            <div>
              Simply enter the flow meter or power meter from your well each month and we calculate all fields required for the Colorado Department or Water Resources reporting requirements.
            </div>
          </div>
        </div>
      </div>

      <div className="w-full grid grid-cols-2">
        <div className="grow p-6 flex flex-col items-center justify-center">
          <div className="w-full">
            <div className="uppercase text-primary-500 font-extrabold mb-2">Export to PDF</div>
            <div className="font-bold text-3xl mb-5">Export DBB-004 and DBB-013 Forms to PDF</div>
            <div>
              When it comes time to report your well usage to Colorado Department of Water Resources, a few clicks exports the data into the DBB-004 and DBB-013 forms.
            </div>
          </div>
        </div>
        <div className="grow p-6 flex justify-center">
          <div className='max-w-[600px] p-2 bg-white rounded drop-shadow-lg'> 
            <Image src={exportPhoto} alt="Meter readings photo" ></Image>
          </div>
        </div>
      </div>

    </div>
  )
}

export default LandingPage