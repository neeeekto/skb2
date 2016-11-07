import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.get('/task2A', (req, res) => {
  let a, b;
  if(req.query.a){
    a = parseInt(req.query.a);
  }
  else{
    a = 0;
  }

  if(req.query.b){
    b = parseInt(req.query.b);
  }
  else{
    b = 0;
  }
  let result = a + b;
  res.send(result+'');
});

app.listen(3000, () => {
  console.log('Your app listening on port 3000!');
});
