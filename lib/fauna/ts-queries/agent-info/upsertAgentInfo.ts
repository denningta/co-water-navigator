import { fql } from "fauna";
import { AgentInfo } from "../../../../interfaces/AgentInfo";

export default function upsertAgentInfo(data: AgentInfo, user_id: string, permitNumber: string | 'global' = 'global') {

  return fql`
    let data = ${data as any}
    let user_id = ${user_id}
    let permitNumber = ${permitNumber}

    let doc = agentInfo.firstWhere(.user_id == user_id && .permitNumber == permitNumber)
    
    if (doc == null) {
      agentInfo.create(data)
    } else {
      doc.update(data)
    }
  `
}
