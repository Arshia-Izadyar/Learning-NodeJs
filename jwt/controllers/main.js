const {BadRequest} = require('../errors/custom-error');
const jwt = require('jsonwebtoken');


async function login(req, res){
    const {username, password} = req.body;
    if (!username || !password) {
        throw new BadRequest('bad credentials entered');
    }
    const id = new Date().getDate();
    const token = jwt.sign({username:username, id: id}, 'jwt', {expiresIn:'30d'})

    res.json({"token":token});
} 


async function dashboard(req, res){
    const num = Math.floor(Math.random()*100);
    // const authHeader = req.headers.authorization;
    // if (!authHeader ){
    //     return res.status(403).json({"dash":"un authenticated"});

    // }
    // let splitedHeader = authHeader.split(" ")
    // const token = splitedHeader[1];
    // if (splitedHeader.length != 2 || splitedHeader[0] !== 'Bearer'){
    //     console.log(splitedHeader.length)
    //     res.status(500).json({"dash":num, "secret":"ridi"});
    //     return;  

    // }
    // try {
    //     const decoded = jwt.verify(token, 'jwt', {});
    //     return res.json({"dash":num, "secret":`salam ${decoded.username}`});
    
    // } catch (err) {
    //     res.status(500).json({"dash":err, "secret":"ridi"});
    //     return;
    // }
        return res.json({"dash":num, "secret":`salam ${req.user.username} lol`});

    
}



module.exports = {login, dashboard};