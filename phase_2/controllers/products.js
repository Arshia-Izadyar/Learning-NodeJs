const {products} = require("../data");



function home(req, res) {
    let {name, age} = req.body;
    if (name && age) {
        return res.json({"data":{"name":name, "age":age}});
    }
    return res.json({"data":null});

}

function lol(req, res) {
    res.send("ok")
}


function root(req, res) {
    res.status(200);
    // res.json({"status":"Ok", "data":products});
    let newProds = products.map((prod) => {
        let {id, name, image} = prod;
        return {id, name, image}
    });
    res.json({"status":"Ok", "data":newProds});

}


function getProduct(req, res){
    let prod = products.find((prod)=> prod.id == req.params.id);
    if (prod){
        res.status(200);
        return res.json({"data":prod});
    }else {
        res.status(404);
        return res.json({"data":null});
    }
}


function prodQuery(req, res) {
    const {search, limit} = req.query
    let newProd = [...products]
    console.log(limit)
    if (search){
        newProd = newProd.filter((prod)=>{return prod.name.startsWith(search)})
    }
    if (limit) {
        newProd= newProd.slice(0, limit);
    }
    if (newProd.length < 1) {
        res.status(404);
        return res.json({"status":"no product found", "data":null});
        
    }
    return res.status(200).json({"status":"product found", "data":newProd});
}

module.exports = {home, lol, root, getProduct, prodQuery}