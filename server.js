const express = require('express');
const { exit } = require('process');
const app = express();
const args = require('minimist')(process.argv.slice(2));
// console.log(args)
const help = (`
server.js [options]

--port	    Set the port number for the server to listen on. Must be an integer
            between 1 and 65535.

--debug	    If set to true, creates endlpoints /app/log/access/ which returns
            a JSON access log from the database and /app/error which throws 
            an error with the message "Error test successful." Defaults to 
            false.

--log	    If set to false, no log files are written. Defaults to true.
            Logs are always written to database.

--help	    Return this message and exit.
`)
var port = 5000;
var debug = false;
var log = true;
if (args["port"] == null) {
    if (args["help"] == true | args["help"] == "true") {
        // console.log("server.js [options]")
        // console.log("--port	Set the port number for the server to listen on. Must be an integer between 1 and 65535.");
        // console.log("--debug	If set to `true`, creates endlpoints /app/log/access/ which returns a JSON access log from the database and /app/error which throws an error with the message \"Error test successful.\" Defaults to `false`.");
        // console.log("--log		If set to false, no log files are written. Defaults to true. Logs are always written to database.");
        // console.log("--help	Return this message and exit.");
        console.log(help)
        exit(0);
    }
    if (args["debug"] == true | args["debug"] == "true") {
        debug = true;
        // console.log("debugging turned on")
    }
    if (args["log"] === false | args["log"] === "false") {
        log = false;
        // console.log("no logs will be written")
    }
} else {
    args['port'];
    const port_arg = args.port;
    if (port_arg < 1 || port_arg > 65535) {
        console.log("Port must be an integer between 1 and 65535.")
        exit(1)
    }
    if (port_arg != null) {
        port = port_arg;
    }
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