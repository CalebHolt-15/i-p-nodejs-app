import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path'

// import { protect, reAuth, signin, signup } from './utils/auth';
import cookieParser from 'cookie-parser';
import { connect } from './utils/db.js';
import { signin, signup } from './utils/auth.js';


export const app = express();


app.use(
  cors({
    origin: "http://127.0.0.1:3000",
    methods: ["GET", "PUT", "POST", "DELETE"],
    allowedHeaders: [
      "Origin",
      "Content-Type", //Fixed CORS
    ],
    credentials: true,
  })
  )
  
  app.use(cookieParser())
  app.use(express.json()) //allowservertoaccept json asabody insideGET/POST/..element
  app.use(
    express.urlencoded({
      extended: true,
    })
  );

app.post('/signup', signup);
app.post('/signin', signin)

export const start = async () => {
  try {
    await connect();
    app.listen(process.env.PORT, () => {
      console.log(
        `listening on port ${process.env.PORT} : https://127.0.0.1: ${process.env.PORT}`
        );
      });
    } catch (e) {
      console.error(e);
    }
  };
  
  // app.use(function(req,res,next){
  //   res.header("Access-Control-Allow-Origin"); // or specify your domain i.e. https:// localhost.
  //   res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept");
  //   next();
  // });