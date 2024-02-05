const notFound = (req, res) => res.status(404).json({status:'Route does not exist'});

module.exports = notFound
