// const express = require('express'); 


// const app = express()


// app.get("/", (req, res)=>{
//     res.json({"status": "Ok"});
// })
// app.all("*", (req, res) => {
//     res.status(404);
//     res.json({"status":"Not found"})
// })

// app.listen(8000, () => {
//     console.log("server is listening on port 8000 ...")
// })



// const express = require('express'); 
// const path = require('path');


// const app = express();

// app.use(express.static("./public"))

// app.get("/", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "./index.html"), (err) => {if (err){console.log(err);}});
// });

// app.all("*", (req, res) => {
//     res.status(400);
//     res.json({"status":"Not Found"});
// });


// app.listen(8000, () => {console.log("server is running")})

const express = require('express');
const {products} = require("./data");
const app = express();

app.get("/", (req, res) => {
    res.status(200);
    // res.json({"status":"Ok", "data":products});
    let newProds = products.map((prod) => {
        let {id, name, image} = prod;
        return {id, name, image}
    });
    res.json({"status":"Ok", "data":newProds});

});

app.get("/:id", (req, res) => {
    let prod = products.find((prod)=> prod.id == req.params.id);
    if (prod){
        res.status(200);
        return res.json({"data":prod});
    }else {
        res.status(404);
        return res.json({"data":null});
    }
});

// `` `` `` `` `` `` `` `` `` `` `` `` `` `` `` `` `` `` `` `` `` `` `` `` `` `` ``

app.get("/products/query", (req, res) => {
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
})




app.listen(8000, () => {console.log('app is running on port 8000')});