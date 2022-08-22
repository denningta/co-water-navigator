import AgentDetails from "./widgets/AgentDetails"
import PermitPreview from "./widgets/PermitPreview"

const Dashboard = () => {
  const widgetStyle = 'bg-white rounded-lg drop-shadow-xl p-6 h-fit'

  return (
    <div className="grid grid-cols-3 gap-6">
      
      <div className={`col-span-3 ${widgetStyle}`}>
        <div className="text-3xl mb-1 font-extrabold">Welcome, Tim</div>
        <div className="text-gray-400">Here is what is going on with your permits</div>
      </div>

      <div className={`col-span-2 ${widgetStyle}`}>
        <PermitPreview />
      </div>

      <div className={`col-span-1 ${widgetStyle}`}>
        <AgentDetails />
      </div>
    </div>
  )
}

export default Dashboard