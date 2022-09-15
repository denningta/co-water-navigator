import { Breadcrumbs, Link } from "@mui/material"
import { useRouter } from "next/router"
import { BsChevronRight } from "react-icons/bs"
import { IoHome } from "react-icons/io5"

const BreadcrumbsRouter = () => {
  const router = useRouter()
  const path = router.asPath.split('/')

  const toTitleCase = (input: string) => {
    const permitNumber = new RegExp(/([0-9])+-\w*/)
    if (permitNumber.test(input)) return input
    const result = input.replace(/(?:^|[\s-/])\w/g, (match) => match.toUpperCase()).replace('-', ' ')
    return result
  }

  return (
    <div>
      {router && (path.length > 1 && !path.includes('dashboard')) && <Breadcrumbs aria-label='breadcrumb' separator={<BsChevronRight/>}>
          {path.map((el, i) => {
            // console.log('el', el, 'path:', i === 0 ? '/' : path.slice(0, i+1).join('/'))
            return <Link key={i} href={i === 0 ? '/' : path.slice(0, i+1).join('/')} underline="hover">
              { el === '' ? <IoHome /> : toTitleCase(el) }
            </Link>
          })}
      </Breadcrumbs>}
    </div>
  )
}

export default BreadcrumbsRouter