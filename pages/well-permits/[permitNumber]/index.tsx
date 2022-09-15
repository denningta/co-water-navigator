import { useRouter } from "next/router"

const WellPermitRedirect = () => {
  const router = useRouter()
  const path = router.asPath
  const currentYear = new Date().getFullYear()
  router.push(`${path}/${currentYear}`)
}

export default WellPermitRedirect