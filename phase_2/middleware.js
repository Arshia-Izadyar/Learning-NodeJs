const express = require('express'); 
const {logger} = require('./logger');
const auth = require('./authorize');
const router = require("./routs/urls")

const app = express();

app.use('/api',[logger, auth]);
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use("/api/v1/", router)
 
// app.get('/api/v1/lol', (req, res) => {
//     res.send("ok")
// });

// app.post("/", (req, res) => {
//     let {name, age} = req.body;
//     if (name && age) {
//         return res.json({"data":{"name":name, "age":age}});
//     }
//     return res.json({"data":null});

// })
// app.get('/', logger, (req, res) => {
//     res.send("ok")
// });

app.listen(8000, () => {console.log("server started")})