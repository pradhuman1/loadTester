const getIndexesfuntion = require('./ResultIndex/indexes.js');

const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());

app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");

    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next();
});

app.post('/url', async (req, res) => {
    var body = req.body;
    var url = body.testUrl;
    var TestResult = await getIndexesfuntion.getIndexes(url);
    res.send(JSON.stringify(TestResult));
    res.end();
})

app.listen(4000, () => {
    console.log("Listening on port 4000")
})




