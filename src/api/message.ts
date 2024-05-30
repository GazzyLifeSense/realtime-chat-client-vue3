import request from '@/api'

const SendPicUrl = '/api/sendPic'

function sendPicAPI(formData: FormData){
    return request.post(SendPicUrl, formData, { headers:{ 'Content-Type': 'multipart/formdata'}})
}

export {
    sendPicAPI
}