const express =require ("express")
const app=express();
const cors=require('cors')
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json())

app.get('/',(req,res)=>{
    res.json({
        message:"back"
    })
})

const userRoutes=require("./routes/userRoutes");
app.use('/user',userRoutes);


app.listen(3000)