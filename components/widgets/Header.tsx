
interface Props {
  title: string
  subtitle: string
}

const Header = ({ title = 'Hello', subtitle = 'Welcome to Colorado Water Export' }: Props) => {

  return (
    <>        
      <div className="text-3xl mb-1 font-extrabold">{title}</div>
      <div className="text-gray-400">{subtitle}</div>
    </>
  )
}

export default Header