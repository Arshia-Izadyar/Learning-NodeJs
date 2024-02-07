
export default function generateResponse(res, data, error, status, extra){
    res.status(status)
    return {data:data, error: error, success: error ? false : true, extra}
}