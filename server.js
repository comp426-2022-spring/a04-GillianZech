const express = require('express');
const { exit } = require('process');
const app = express();
const args = require('minimist')(process.argv.slice(2));
args['port'];
const port_arg = args.port;
// I probably gotta do npm init
if (port_arg == "help") {
    console.log();
    exit(0);
}
var port = 5000
if (port_arg != null) {
    var port = port_arg;
}

const server = app.listen(port, () => {
    console.log('App is running on port %PORT%'.replace('%PORT%', port));
})

app.get('/app', (req, res) => {
    res.status(200).end('200 OK');
    // res.type("text/plain");
})

app.get('/app/flip', (req, res) => {
    res.status(200).json({ 'flip': coinFlip() })
})

app.get('/app/flips/:number', (req, res) => {
    arr = coinFlips(req.params.number)
    ay = countFlips(arr)
    result = arr + ay
    res.status(200).json({ 'raw': arr,'summary': ay })
})

app.get('/app/flip/call/heads', (req, res) => {
    res.status(200).json({ 'message': flipACoin('heads') })
})

app.get('/app/flip/call/tails', (req, res) => {
    res.status(200).json({ 'message': flipACoin('tails') })
})

app.use(function(req, res) {
    res.status(404).send("404 NOT FOUND");
    // res.type("text/plain");
})

function coinFlip() {
    return (Math.floor(Math.random() * 2) == 0) ? 'heads' : 'tails';
}

function coinFlips(flips) {
    let flip_array = [];
    while (flips > 0) {
        flip_array.push(coinFlip());
        flips--;
    }
    return flip_array;
}

function countFlips(array) {
    let head = 0, tail = 0;
    for (let item of array) {
        if (item === "heads".valueOf()) {
        head++;
        }
        else if (item === "tails".valueOf()) {
        tail++;
        }
    }
    return {heads: head, tails: tail}
}

function flipACoin(call) {
    let flip_result = coinFlip(), win_result = 'lose';
    if (flip_result == call) {
        win_result = 'win'
    }
    return {
        call: call,
        flip: flip_result,
        result: win_result 
    };
}