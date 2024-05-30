function parseTime(timestamp: number){
    return new Date(timestamp).toLocaleString().split(' ')[1]
}

function getValue(arr: [], key: string, value: any, path = ''){
    if (!Array.isArray(arr)) return undefined
    let result = arr.find(o => o[key] === value)
    path.split('.').forEach(k => {
        result = k && result ? result[k] : result
    })
    return result
}

// 判断是否为链接
function isLink(content: string){
  if(/^http/.test(content)) return true
  return false
}

export { parseTime, getValue, isLink }