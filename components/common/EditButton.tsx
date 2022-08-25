import { MdEdit } from "react-icons/md"

const EditButton = () => {
 return (
  <button 
    className="rounded-full p-3 bg-white text-gray-600 text-lg hover:drop-shadow-lg transition ease-in-out"
  >
    <MdEdit/>
  </button>
 )
}

export default EditButton