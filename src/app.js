import express from 'express';
import path from 'path';

import { Router } from 'express';
// import request from 'request'

// import logger from 'morgan';
import bodyParser from 'body-parser';

require('dotenv').config()

const IPFS = require('ipfs');
// const ipfsApi = require('ipfs-api')
const OrbitDB = require('orbit-db')
// const ipfs = ipfsApi()


// OrbitDB uses Pubsub which is an experimental feature
let ipfsOptions = {
  // repo: './ipfs-repo',

  repo: 'repo/ipfs',

  EXPERIMENTAL: {
    pubsub: true
  },

  // "Discovery": {
  //   "MDNS": {
  //     "Enabled": true,
  //     "Interval": 10
  //   },
  //   "webRTCStar": {
  //     "Enabled": true
  //   }
  // },
  config: {
    "Addresses": {
      "Swarm": [
        "/ip4/0.0.0.0/tcp/4002",
        "/ip4/127.0.0.1/tcp/4003/ws",
        "/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star"
      ],
      "API": "/ip4/127.0.0.1/tcp/5003",
      "Gateway": "/ip4/127.0.0.1/tcp/9091"
    },
    "Discovery": {
      "MDNS": {
        "Enabled": true,
        "Interval": 10
      },
      "webRTCStar": {
        "Enabled": true
      }
    },
    "Bootstrap": [
      "/ip4/104.236.176.52/tcp/4001/ipfs/QmSoLnSGccFuZQJzRadHn95W2CrSFmZuTdDWP8HXaHca9z",
      "/ip4/104.131.131.82/tcp/4001/ipfs/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ",
      "/ip4/104.236.179.241/tcp/4001/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM",
      "/ip4/162.243.248.213/tcp/4001/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm",
      "/ip4/128.199.219.111/tcp/4001/ipfs/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu",
      "/ip4/104.236.76.40/tcp/4001/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64",
      "/ip4/178.62.158.247/tcp/4001/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd",
      "/ip4/178.62.61.185/tcp/4001/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3",
      "/ip4/104.236.151.122/tcp/4001/ipfs/QmSoLju6m7xTh3DuokvT3886QRYqxAzb1kShaanJgW36yx",
      "/ip6/2604:a880:1:20::1f9:9001/tcp/4001/ipfs/QmSoLnSGccFuZQJzRadHn95W2CrSFmZuTdDWP8HXaHca9z",
      "/ip6/2604:a880:1:20::203:d001/tcp/4001/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM",
      "/ip6/2604:a880:0:1010::23:d001/tcp/4001/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm",
      "/ip6/2400:6180:0:d0::151:6001/tcp/4001/ipfs/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu",
      "/ip6/2604:a880:800:10::4a:5001/tcp/4001/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64",
      "/ip6/2a03:b0c0:0:1010::23:1001/tcp/4001/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd",
      "/ip6/2a03:b0c0:1:d0::e7:1/tcp/4001/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3",
      "/ip6/2604:a880:1:20::1d9:6001/tcp/4001/ipfs/QmSoLju6m7xTh3DuokvT3886QRYqxAzb1kShaanJgW36yx",
      "/dns4/wss0.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic",
      "/dns4/wss1.bootstrap.libp2p.io/tcp/443/wss/ipfs/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6",
      "/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star/ipfs/QmVNqmWGV248kCZpJq2yXSYzTQi5the7vxs82HLfZj3tcK" // necessary?
    ]
  }
}

let ipfs = new IPFS(ipfsOptions);

// let orbitdb;

// Load IPFS repo if exists (.env) 
function ipfsSetup(){
  return new Promise(async(resolve,reject)=>{

    ipfs.on('ready', async()=>{
      console.log('ipfs ready');

      console.log('isOnline:', ipfs.isOnline());

//       let txt = `
// ${(new Date()).getTime()} - Testing - kshf2398j829nur983urnc02u3rcnu2nc3
//       `;
//       let newFile = new Buffer(txt,'utf8');
//       ipfs.files.add(newFile,(err,data)=>{
//         console.log(err,data);
//       })

      const orbitdb = new OrbitDB(ipfs)

      // Create / Open a database
      console.log('syncing/replicationg orbitdb');

      try {

        const db = await orbitdb.log(process.env.ORBIT_DB_ADDRESS)

        console.log('loading db');
        await db.load()

        console.log('data:');
        let data = db.iterator({ limit: -1 }).collect().map((e) => e.payload.value)
        console.log(data);

        console.log('listening for replication');

        // Listen for updates from peers
        db.events.on('replicated', (address) => {
          console.log('Replicated', address);
          console.log(db.iterator({ limit: -1 }).collect())
        })

      }catch(err){
        console.error(err);
      }

    })
    // console.log('Setup orbitdb');
    // console.log('isOnline:', ipfs.isOnline());

    // // Create OrbitDB instance
    // let orbitdbInstance = new OrbitDB(ipfs)

    // // giving ourselves access 
    // const access = {
    //   // Give write access to ourselves
    //   write: [orbitdbInstance.key.getPublic('hex')],
    //   // write: [
    //   //   process.env.ORBIT_PUBLIC_WRITE_KEY
    //   // ]
    // }

    // console.log('creating orbit db 1');
    // orbitdb = await orbitdbInstance.log('node-chain-1', access)
    // console.log('loading data for orbit db 1');
    // await orbitdb.load()
    // // app.orbitLogDb = db;

    // console.log('OrbitDB Address (for sharing):', orbitdb.address.toString())

    // // /orbitdb/Qmd8TmZrWASypEp4Er9tgWP4kCNQnW4ncSnvjvyHQ3EVSU/first-database

    resolve();

  })
}


// Start replicating orbitdb database 

// async function startOrbit(){
//   console.log('start orbit');

//   const orbitdb = new OrbitDB(ipfs)
//   const db = await orbitdb.log('hello')

//   console.log('GOT DB!');

// }

// setTimeout(startOrbit,5000);

// orbitdb.eventlog('testing349sfk872',(err, db)=>{
//   if(err){
//     return console.error('Orbit init error:', err);
//   }

//   // process.env.ORBIT_DB_ADDRESS

//   console.log('Connected to ORBIT_DB_ADDRESS!', db.address.toString());

//   // // Listen for updates from peers
//   // db.events.on('replicated', (address) => {
//   //   console.log(db.iterator({ limit: -1 }).collect())
//   // })

//   // function add(){
//   //   if(!ipfs.isOnline()){
//   //     console.log('not online yet');
//   //     setTimeout(add,1000)
//   //     return;
//   //   }
//   //   console.log('add1');
//   //   db.add({ test: (new Date()).getTime() }, ()=>{
//   //     setTimeout(add,1000)
//   //   })
//   // }
//   // add();

// })


// var helmet = require('helmet')

// var cookieParser = require('cookie-parser')
// var compression = require('compression')

// var utilLogger = require("./utils/logging");

let publicKey = (new Buffer(process.env.PUBLIC_KEY,'base64')).toString('utf8')


const NodeRSA = require('node-rsa');
var cmd = require('node-cmd');

var cors = require('cors');


const app = express();
global.app = app;
// app.ipfs = ipfs;


app.use(cors({
	origin: '*',
	credentials: true
}));

app.use(bodyParser.json({
  limit: '10mb'
}));
app.use(bodyParser.urlencoded({ extended: false }));



// IPFS middleware 
let ipfsReady = ipfsSetup();
app.use(async (req,res,next)=>{
  await ipfsReady;
  next();
});


let routes = Router();
routes.post('/pin', async (req, res) => {
	// hash, signature provided. public key is local (for matching) 

  console.log('PIN');


  // Verify signature
  let {
    data,
    hash,
    timestamp, // within a second or two? 
    signature
  } = req.body;

  let key = new NodeRSA(publicKey);


  let verified = key.verify([hash].join(''), signature, 'utf8', 'hex');
  if(!verified){
    console.error('Verification failed');
    return res.status(500).send({
      error: 'Failed signature verification'
    });
  }

  console.log('Verification succeeded!');

  let responses = await ipfs.files.add(new Buffer(data,'utf8'));
  console.log('Responses:', responses);
  let calculatedHash = responses[0].hash;

  if(calculatedHash != hash){
    // File hashes do not match! 
    console.error('File hashes do not match');
    return res.status(500).send({
      error: 'File hashes do not match'
    });
  }

  console.log('File contents verified');

  // Pin contents
  let pinned = await ipfs.pin.add(hash);

  console.log('Pinned OK!:', pinned);

  res.send({
    pinned
  });

	// cmd.get('ipfs pin add ' + hash,(err,data,stderr)=>{
 //    if(err){
 //      console.error('Failed cmd.get: ipfs pin add.');
 //      console.error(err);
 //      console.error(stderr);
 //      return res.status(500).send({
 //        error: 'Failed'
 //      });
 //    }


 //    console.log('Command Result:', data);

 //    // return response
 //    res.send({
 //      data
 //      // result
 //    })

 //  });

});


routes.post('/hash/:hash', async (req, res) => {
  // hash, signature provided. public key is local (for matching) 

  // Verify signature
  let {
    hash,
  } = req.params;

  let data = await ipfs.files.cat(hash);

  let str;

  try {
    str = data.toString('utf8');
  }catch(err){
    console.error('Failed finding hash', hash, err);
  }

  res.send({
    data: str
  });

});


app.use(routes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  res
    .status(err.status || 500)
    .send({
    	error: err.status
    });
});

export default app;
