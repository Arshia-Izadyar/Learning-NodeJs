export default function notFound(req, res){
    return res.status(404).json({data: null, error: 'not found', success: false})
}