import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import linkRoutes from './Routes/linkRoutes.js'

dotenv.config();
const app = express()


app.use(cors({
  origin: "*",
  methods: ["GET", "POST"," DELETE", "PUT", "PATCH"],
}));

app.use(express.json());
app.use('/api',linkRoutes)
app.get('/healthz',(req,res)=>{
 res.status(200).json({ ok: true, version: '1.0' });
})

mongoose.connect(process.env.MONGO_URI,{
      useNewUrlParser: true,
  useUnifiedTopology: true

}).then(()=>{
    console.log("Connected")
}).catch(err=>{console.error(err); process.exit(1);})
app.listen(process.env.PORT||5000,()=>{
})