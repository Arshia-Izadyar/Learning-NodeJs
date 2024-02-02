

async function register(req, res) {
    res.json({"status": "Ok"});


}


async function login(params) {
    res.json({"status": "Ok"});
}


async function logout(params) {
    res.json({"status": "Ok"});
    
}


module.exports = {login, logout, register}