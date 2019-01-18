var express = require("express");
var unirest = require('unirest');
var mongodb =   require("./mongo");
var session = require('express-session');
//var session = require('client-sessions');
var urlencodedParser = require('urlencoded-parser');
var app = express();
var bodyParser  =   require("body-parser");
var router = express.Router();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session({secret: 'ssshhhhh'}));
/*app.use(function (req, res, next) {
    if (req.session && req.session.user) {
        User.findOne({email: req.session.user.sessionId}, function (err, user) {
            if (user) {
                req.user = user;
                delete req.user.password; // delete the password from the session
                req.session.user = user;  //refresh the session value
                res.locals.user = user;
            }
            // finishing processing the middleware and run the route
            next();
        });
    } else {
        next();
    }
});*/
var http = require('http');

const url = require('url');
const querystring = require('querystring');

//cors access allow check this after finish    s.ketabifard
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/token', urlencodedParser, function (req, res) {
    /*if (!req.body) return res.sendStatus(400)
    res.send('welcome, ' + req.body.username)*/
    req.session.user = req.body.authorizationCode;
    console.log("app client send this code :")
    console.log(req.body.authorizationCode);
    var request = require("request");
    var options = {
        method: 'POST',
        url: 'http://pfm.myoxygen.ir/auth/realms/master/protocol/openid-connect/token',
        headers:
            {
                'Postman-Token': '395b7174-1c7c-4100-b42f-c45b4180731e',
                'cache-control': 'no-cache',
                Authorization: 'Basic NzllYWE3ZDctODNhOC00MmQzLTliOTUtOTRiNTM5NjQ6NGFmYWI1YWItMGJmMS00MzBmLTg4MzktMGIzNzJkODBjNzgx'
            },
        form:
            {
                grant_type: 'authorization_code',
                code: req.body.authorizationCode,
                /*code: 'eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..80V6CB8rjzfcIBA8swj59g.N9LbA5l7XFNIPnFInpwVXJvFVV1KFRxvUNSCffH0DuzycT6sDE4pUSbg-_TtdX2H9Acskx1q5B07gmyk_5-8xAakCD4OtbWaKn3t_4VKGYxp4pAq25I5y73AbpHdWTQBGVSU1I7ctBOWfns3-dwEzgyiDIgEpJ2g6mb_yxiUCXJ4o_xSeVnzvyNQz3J8htb4JPJAbltMaCvzZ9Wx9LA8sMmeDhTTZIm8lTlakodU1zYcU689_CKSQvR01wBI0CoB.ebdpSI7I98brYxsH_AfYNg',*/
                redirect_uri: 'http://192.168.25.142:3000/',
                client_id: '79eaa7d7-83a8-42d3-9b95-94b53964',
                undefined: undefined
            }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        res.send(body);
        console.log(body);
    });
console.info('session id is :');
console.log(req.session.user)
});

app.get('/account/balances/:accountNumber', requireLogin, urlencodedParser, function (req, res) {

    var request = require("request");

    console.log(req.header('Authorization'));
    var options = {
        method: 'GET',

        url: 'http://pfm.myoxygen.ir/api/sandbox/account/v1/account/balances/' + req.params.accountNumber,

        headers:

            {
                'cache-control': 'no-cache',
                Authorization: req.header('Authorization'),
                // Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJINGpXcmRDYl9sUHZRbmkwd3ZSOVQ2UkpMNlF2Mmt1V2NSakh4SjFrY2NRIn0.eyJqdGkiOiIyZDI2ZDU3Yy00N2IwLTQxODMtODI3YS1mMGRmNDc0ZjBjYTIiLCJleHAiOjE1NDc3NTE0OTQsIm5iZiI6MCwiaWF0IjoxNTQ3NzE1NTg5LCJpc3MiOiJodHRwOi8vcGZtLm15b3h5Z2VuLmlyL2F1dGgvcmVhbG1zL21hc3RlciIsImF1ZCI6Ijc5ZWFhN2Q3LTgzYTgtNDJkMy05Yjk1LTk0YjUzOTY0Iiwic3ViIjoiZTU3MzYwMmYtMjViNS00YmUwLTk1YTUtYWJlZWM4MWE0NzlkIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiNzllYWE3ZDctODNhOC00MmQzLTliOTUtOTRiNTM5NjQiLCJhdXRoX3RpbWUiOjE1NDc3MTU0OTQsInNlc3Npb25fc3RhdGUiOiI2ZGUxMTVlYS0yYjI0LTQ5Y2UtODRlZi1iM2ZhNTJhODcyYTAiLCJhY3IiOiIwIiwiYWxsb3dlZC1vcmlnaW5zIjpbIioiXSwicmVzb3VyY2VfYWNjZXNzIjp7IlNCQWNjb3VudFRyYW5zYWN0aW9uIjp7InJvbGVzIjpbInN2Yy1tZ210LWFjY291bnQtdHJ4Il19LCJTQkFjY291bnRCYWxhbmNlIjp7InJvbGVzIjpbInN2Yy1tZ210LWFjY291bnQtYmFsYW5jZSJdfSwiU0JDdXN0b21lckFjY291bnRJbmZvIjp7InJvbGVzIjpbInN2Yy1tZ210LWN1c3RvbWVyLWFjY291bnQiXX19LCJzc24iOiIwODY3Nzc2MTI5In0.XNqBSPB92ntYEPJtPcAtRgMmhpJo6HQEpFebo6kB7o4kyu_q8bVueRrlM_06b_laT56lBhgSk5E53dOdff3EMDuHJUfzUedfUx8g4JffFrvNXgpind2psBjrXrY1HEl21CDF_oxM0kUjY2CseFYzMmNHOW6mJ5rb37GwAB1BiPz6QW9UZ8PZE3JVLtZpCrJyUv2DnHWwfqZI6r0xwdyzONmNpLV1ZoZufwJa8zn2UsXUblBYkLNRaX6pSP4GaOfWRAN2TeBgk2q5A5XZIvRaxRVsXyI4mnlNw_G3BGUPPtvgg4Y_-zuJhfMR9m9VzFGwR-HNxl5JYCyh6gLqLH239w' } };
            }
    };

    request(options, function (error, response, body) {

        if (error) throw new Error(error);

        res.send(body);
        console.log(body);

    });


});

app.post('/account/transactions', requireLogin, urlencodedParser, function (req, res) {
    var request = require("request");
    console.log(req.header('Authorization'));
    var options = {
        method: 'POST',

        url: 'http://pfm.myoxygen.ir/api/statement/v1/account/transactions',

        headers:

            {
                'cache-control': 'no-cache',
                Authorization: req.header('Authorization'),
                'Content-Type': 'application/json'
            },

        body:

            {
                accountNumber: req.body.accountNumber,

                dateRange:

                    {
                        fromDateTime: req.body.fromDateTime,

                        toDateTime: req.body.fromDateTime
                    },

                pageable: {page: 1, size: 10}
            },

        json: true
    };

    request(options, function (error, response, body) {

        if (error) throw new Error(error);
        res.send(body);
        console.log(body);

    });

});

app.post('accounts-info', requireLogin, urlencodedParser, function (req, res) {
    var request = require("request");
    console.log(req.header('Authorization'));
    var options = {
        method: 'POST',

        url: 'http://pfm.myoxygen.ir/api/account/v1/customer/individual/accounts-info',

        headers:
            {
                'cache-control': 'no-cache',
                Authorization: req.header('Authorization'),
                'Content-Type': 'application/json'
            },

        body: {nationalIdentifier: req.body.nationalNo},

        json: true
    };

    request(options, function (error, response, body) {

        if (error) throw new Error(error);
        res.send(body);
        console.log(body);

    });
});
app.get('/logout', function (req, res) {

    console.log('try to destroy session');
    req.session.destroy();
    if (!(req.session && req.session.user)) {
        console.log('session destroyed successfully !!!');
    }
    res.send('<br />logged out!<br /><a href="/user">Check Session</a>');
});

function requireLogin(req, res, next) {
    if (!req.user) {
        res.redirect('/token');
    } else {
        next();
    }
};
app.listen(3000, () => {
    console.log("Server running on port 3000");
});