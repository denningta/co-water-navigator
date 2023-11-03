import { fql } from "fauna";

export default function getAgentInfo(
  user_id: string,
  permitNumber: string | 'global' = 'global'
) {
  return fql`
    let user_id = ${user_id}
    let permitNumber = ${permitNumber as string}

    let agentInfo = {
      let wellSpecific = agentInfo.firstWhere(.user_id == user_id && .permitNumber == permitNumber)

      if (wellSpecific == null) {
        agentInfo.firstWhere(.user_id == user_id && .permitNumber == 'global')
      } else {
        wellSpecific
      }
    }

    agentInfo

  `
}

