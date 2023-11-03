import { fql } from "fauna";

export default function deleteAgentInfo(user_id: string, permitNumber: string) {

  return fql`
    let user_id = ${user_id}
    let permitNumber = ${permitNumber}
    
    let doc = agentInfo.firstWhere(.user_id == user_id && .permitNumber == permitNumber)
    
    doc!.delete()
  `
}
