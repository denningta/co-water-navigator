import BreadcrumbsRouter from "../common/BreadcrumbsRouter"

interface Props {
  title: string
  subtitle: string
}

const Header = ({ title = 'Hello', subtitle = 'Welcome to Colorado Water Export' }: Props) => {

  return (
    <>        
      <div className="text-3xl font-extrabold">{title}</div>
      <div className="text-gray-400 mb-2">{subtitle}</div>
      <BreadcrumbsRouter />
    </>
  )
}

export default Header