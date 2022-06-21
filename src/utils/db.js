import 'dotenv/config';
import mongoose from 'mongoose';

export const connect = (
  url = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  
) => {
  return mongoose.connect(url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true 
    
  })
};


// mongoose.connect(process.env.DATABASE_URL)
// const db = mongoose.connection
// db.on("error", (error) => console.error(error))
// db.once("open", () => console.log("Connected DB"))
