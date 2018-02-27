import express from 'express';
import path from 'path';

import { Router } from 'express';
// import request from 'request'

// import logger from 'morgan';
import bodyParser from 'body-parser';

require('dotenv').config()


const ipfsApi = require('ipfs-api')
// const OrbitDB = require('orbit-db')
const ipfs = ipfsApi()

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

  // Add contents

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


routes.get('/hash/:hash', async (req, res) => {
  // hash, signature provided. public key is local (for matching) 

  console.log('Get Hash');


  // Verify signature
  let {
    hash,
  } = req.params.hash;

  let data = await ipfs.files.cat(hash);

  console.log('Got data');
  console.log(data);

  res.send({
    data: data
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
