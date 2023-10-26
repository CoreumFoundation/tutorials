export function getDatetime(timestamp: string) {
  let datetime = new Date(parseInt(timestamp) / 1_000_000);
  return datetime.toDateString();
}
/* 
export function getUsername(address: string, members: Member[]) {
    let m = props.members.find(x => x.addr== address)
    return m.name        
}
 */
