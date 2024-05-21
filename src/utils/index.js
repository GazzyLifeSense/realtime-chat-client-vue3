export const parseTime = (timestamp)=>{
    return new Date(timestamp).toLocaleString().split(' ')[1]
}