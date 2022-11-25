// import packages
import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from'path';

import User from './models/user.js';
import Land from './models/land.js'; 

// import routes
import authRoutes from './routes/auth.js';
import listingRoutes from './routes/listing.js';
import categoryRoutes from './routes/category.js';
import subcategoryRoutes from './routes/subcategory.js';
import userRoutes from './routes/user.js';
import sellerRoutes from './routes/seller.js';
import subscriptionRoutes from './routes/subscription.js';
import venueRoutes from './routes/venue.js';
import landRoutes from './routes/land.js';
import favEmitter from './events/myevents.js';



// setup server
const app = express();
const server = express();
//config env 
dotenv.config();


// connect to mongodb
mongoose.connect(process.env.DB_URL,  
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //tls: true,
    //tlsCAFile: './ca-certificate.crt',
  },
  (err) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log(`database connected at: ${process.env.DB_URL}`);
    }
  }); 

// api middlewares
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));
app.use(bodyParser.json())
app.use(cors());

// route middleware
app.get('/', (req, res) => {
  res.send('<h1>Welcome to reacon spot api</h1>');
});
app.use('/public',express.static(path.resolve('./public')));
app.use('/auth', authRoutes);
app.use('/listings', listingRoutes);
app.use('/categories', categoryRoutes); // home, land, event
app.use('/subcategories', subcategoryRoutes); // apt, house, commercial land,ceremony
app.use('/user', userRoutes);
app.use('/seller', sellerRoutes);
app.use('/subscription', subscriptionRoutes);
app.use('/plots', landRoutes);
app.use('/venues', venueRoutes);


// websockets
/*const existsWs = new WebSocketServer({ noServer: true });
const homeSavedWs = new WebSocketServer({ noServer: true });
const landSavedWs = new WebSocketServer({ noServer: true });
const venueSavedWs = new WebSocketServer({ noServer: true });
const searchWs = new WebSocketServer({ noServer: true });

existsWs.on('connection', (ws) => {
  
  ws.on('message', async (msg) => {
    const obj = JSON.parse(msg);
    const favName = obj.favName; // rep of 'listings','lands', venues
    if (obj.userId.match(/^[0-9a-fA-F]{24}$/)) {
      // check for user normally first when user visists the uri
      const user = await User.findById(obj.userId);
      if (user) {
        var exists;
        //check property type
        if(favName == "listing"){
          exists = user.listings.includes(obj.listingId);
        }
        else if(favName == "land") {
          exists = user.lands.includes(obj.listingId);
        }
        else if(favName == "venue") {
          exists = user.venues.includes(obj.listingId);
        }
        
        ws.send(JSON.stringify(exists));
      } else {
        ws.send(JSON.stringify(false));
      }
      // listen to event
      favEmitter.on('done', (favs) => {
        var exists;
        if(favName == "listing"){
          exists = user.listings.includes(obj.listingId);
        }
        else if(favName == "land") {
          exists = user.lands.includes(obj.listingId);
        }
        else if(favName == "venue") {
          exists = user.venues.includes(obj.listingId);
        }
        ws.send(JSON.stringify(exists));
      });
    } else {
      ws.send(JSON.stringify(false));
    }
  });
});

homeSavedWs.on('connection', (ws) => {  
  ws.on('message', async (msg) => {
    // parse msg
    const obj = JSON.parse(msg);
    
    // if valid id
    if (obj.userId.match(/^[0-9a-fA-F]{24}$/)) {
      // do it noirmally when user first access the uri
      const user = await User.findOne({ _id: obj.userId }).populate('listings');

      if (user) {
        let favourites = [];
        favourites = user.listings;
        ws.send(JSON.stringify(favourites));
      } else ws.send(JSON.stringify([]));

      // watch user collection
      const pipeline = [{
        $match: {
          operationType: 'update',
          'fullDocument._id': mongoose.Types.ObjectId(obj.userId),
        },
      }];
      const options = { fullDocument: 'updateLookup' };
      // register change stream
      const changeStream = User.watch(pipeline, options);
      changeStream.on('change', async (data) => {
        const favourites = [];

        data.fullDocument.listings.forEach((id) => {
          favourites.push(Listing.findById(id));
        });
        ws.send(JSON.stringify(await Promise.all(favourites)));
      });
    } else {
      ws.send(JSON.stringify([]));
    }
  });
});

landSavedWs.on('connection', (ws) => {  
  ws.on('message', async (msg) => {
    // parse msg
    const obj = JSON.parse(msg);
    
    // if valid id
    if (obj.userId.match(/^[0-9a-fA-F]{24}$/)) {
      // do it noirmally when user first access the uri
      const user = await User.findOne({ _id: obj.userId }).populate('lands');

      if (user) {
        let favourites = [];
        favourites = user.lands;
        ws.send(JSON.stringify(favourites));
      } else ws.send(JSON.stringify([]));

      // watch user collection
      const pipeline = [{
        $match: {
          operationType: 'update',
          'fullDocument._id': mongoose.Types.ObjectId(obj.userId),
        },
      }];
      const options = { fullDocument: 'updateLookup' };
      // register change stream
      const changeStream = User.watch(pipeline, options);
      changeStream.on('change', async (data) => {
        const favourites = [];

        data.fullDocument.lands.forEach((id) => {
          favourites.push(Land.findById(id));
        });
        ws.send(JSON.stringify(await Promise.all(favourites)));
      });
    } else {
      ws.send(JSON.stringify([]));
    }
  });
});

venueSavedWs.on('connection', (ws) => {  
  ws.on('message', async (msg) => {
    // parse msg
    const obj = JSON.parse(msg);
    
    // if valid id
    if (obj.userId.match(/^[0-9a-fA-F]{24}$/)) {
      // do it noirmally when user first access the uri
      const user = await User.findOne({ _id: obj.userId }).populate('venues');

      if (user) {
        let favourites = [];
        favourites = user.venues;
        ws.send(JSON.stringify(favourites));
      } else ws.send(JSON.stringify([]));

      // watch user collection
      const pipeline = [{
        $match: {
          operationType: 'update',
          'fullDocument._id': mongoose.Types.ObjectId(obj.userId),
        },
      }];
      const options = { fullDocument: 'updateLookup' };
      // register change stream
      const changeStream = User.watch(pipeline, options);
      changeStream.on('change', async (data) => {
        const favourites = [];

        data.fullDocument.venues.forEach((id) => {
          favourites.push(Land.findById(id));
        });
        ws.send(JSON.stringify(await Promise.all(favourites)));
      });
    } else {
      ws.send(JSON.stringify([]));
    }
  });
});

searchWs.on('connection', (ws) => {
  
  ws.on('message', async (msg) => {
    const obj = JSON.parse(msg);
    const listings = await Listing.find({
      $or: [
        { name: search },
        { building: search },
        { 'location.country': search },
        { 'location.region': search },
        { 'location.district': search },
        { 'location.street': search },
      ],
    }).limit(5);
  });
});*/


// web sockt config
/*server.on('upgrade', (request, socket, head) => {
  const { pathname } = parse(request.url);

  if (pathname === '/user/saved/exists') {
    existsWs.handleUpgrade(request, socket, head, (ws) => {
      existsWs.emit('connection', ws, request);
    });
  } else if (pathname === '/user/saved/home') {
    homeSavedWs.handleUpgrade(request, socket, head, (ws) => {
      homeSavedWs.emit('connection', ws, request);
    });
  }  else if (pathname === '/user/saved/land') {
    landSavedWs.handleUpgrade(request, socket, head, (ws) => {
      landSavedWs.emit('connection', ws, request);
    });
  }  else if (pathname === '/user/saved/venue') {
    venueSavedWs.handleUpgrade(request, socket, head, (ws) => {
      venueSavedWs.emit('connection', ws, request);
    });
  }else if (pathname === '/search') {
    searchWs.handleUpgrade(request, socket, head, (ws) => {
      searchWs.emit('connection', ws, request);
    });
  }  else {
    socket.destroy();
  }
 
});*/

// start server and listen
app.listen(3000, (err) => {
    if (err) throw err;
    else {
      console.log('server started at port ' + 3000);
    }
  });