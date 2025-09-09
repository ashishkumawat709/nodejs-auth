require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3002; 


app.use(express.json());
const authRoutes = require('./routes/auth-routes.js');
const homeRoutes = require('./routes/home-routes.js');
const adminRoutes = require('./routes/admin-routes.js');
const uploadImgroute = require('./routes/img-routes.js');

app.use('/api/auth/', authRoutes);
app.use('/api/home/', homeRoutes);
app.use('/api/admin/', adminRoutes);
app.use('/api/image/', uploadImgroute);


const connectToDB = require('./database/db.js');
connectToDB();

app.get('/', (req,res)=>{
  res.send('hello');
})

app.listen(PORT, ()=>{
  console.log(`listening port on server ${PORT}`);
  
}); 