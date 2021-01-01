export function chknum(num: string): string {
    if(num.length >= 6) {
        return num;
    }
    let n = num;
    while(n.length < 6) {
        n = `0${n}`
    }
    return n;
}