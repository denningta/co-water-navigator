import Navbar from "./Navbar"

interface Props {
  children: JSX.Element[] | JSX.Element
}

const PublicLayout = ({ children }: Props) => {
  return (
    <div>
      <Navbar />
      <div>{ children }</div>
    </div>
  )
}

export default PublicLayout