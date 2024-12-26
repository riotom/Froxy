import "babel-polyfill";

import colors from "colors";
import cors from "cors";
import express from "express";
import fs from "fs";
import http from "http";
import path from "path";
import request from "request";

import { getAccount, getActions, getTable, getContract, getAccountByPubkey, getBlock, getToken, getTokens, getTransaction, getNft, getPrice } from "./actions.js";
import { getInfo, startInfoDaemon, startSlowDaemon } from "./daemons/index.js";

var host = process.env.API_HOST ?? '127.0.0.1';
const corsOptions = {
	origin: '*',
	optionsSuccessStatus: 200
};

const app = express();
const port = process.env.API_PORT ?? 3001;
app.use(cors(corsOptions));
//app.use(cors());
app.use(express.json());

var server = http.createServer();
server.listen(port, host, function () {
	console.log('Listening Block Explorer on '.bgGreen.white.bold, host + ':' + port);
});
server.on('request', app);

app.get('/api/getInfo', async (req, res) => {
	res.json(getInfo());
});

app.get('/api/getTokens/:id', async (req, res) => {
	res.json(await getTokens(req.params.id));
});

app.get('/api/getBlock/:id', async (req, res) => {
	res.json(await getBlock(req.params.id));
});

app.get('/api/getTransaction/:id', async (req, res) => {
	res.json(await getTransaction(req.params.id));
});

app.get('/api/getAccount/:id', async (req, res) => {
	res.json(await getAccount(req.params.id));
});

app.get('/api/getActions/:account/:limit?/:skip?/:filter?', async (req, res) => {
	res.json(await getActions(req.params.account, req.params.limit, req.params.skip, req.params.filter));
});

app.get('/api/getAccountByPubkey/:id/:from/:offset', async (req, res) => {
	res.json(await getAccountByPubkey(req.params.id, req.params.from, req.params.offset));
});

/*
curl -X 'POST' 'http://127.0.0.1:14701/api/getTable/testswapsfla/config/testswapsfla/5' -d '{"index_position": "3","key_type": "i64","upper_bound": "0","lower_bound": "0"}' | jq
*/
app.post('/api/getTable/:code/:table/:scope/:limit', async (req, res) => {
	res.json(await getTable(req.params.code, req.params.table, req.params.scope, req.body.index_position, req.body.key_type, req.body.upper_bound, req.body.lower_bound, req.params.limit));
});

app.get('/api/getContract/:id', async (req, res) => {
	res.json(await getContract(req.params.id));
});

app.get('/api/getToken/:name/:symbol', async (req, res) => {
	res.json(await getToken(req.params.name, req.params.symbol));
});

app.get('/api/getNft/:by/:query/:sort/:position/:limit', async (req, res) => {
	res.json(await getNft(req.params.by, req.params.query, req.params.sort, req.params.position, req.params.limit));
});

app.get('/api/getPrice/:contract/:symbol', async (req, res) => {
	res.json(await getPrice(req.params.contract, req.params.symbol));
});

startInfoDaemon();
startSlowDaemon();