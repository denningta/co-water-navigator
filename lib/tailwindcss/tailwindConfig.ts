import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../tailwind.config.js'
import { Config } from 'tailwindcss'
import { KeyValuePair } from 'tailwindcss/types/config.js'

const tailwindCss: Config = resolveConfig(tailwindConfig)

export const tailwindColors = (tailwindCss.theme?.colors as KeyValuePair)

export default tailwindCss