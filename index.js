import express from "express";
import { dirname } from "path"; 
import { fileURLToPath } from "url";
import fs from "fs";
//import data from './data.json' with { type: "json" };

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
const __dirname = dirname(fileURLToPath(import.meta.url)); 

const data = JSON.parse(fs.readFileSync(new URL('./data.json', import.meta.url)));
//1. GET a random joke
app.get("/random", (req, res) => { 
    const random = Math.floor((Math.random() * data.jokes.length));
    res.json(data.jokes[random]);
});  

//2. GET a specific joke
app.get("/jokes/:id", (req, res) => { 
    const id = parseInt(req.params.id);
    const foundJoke = (data.jokes).find((joke)=>(joke.id ===id));
    res.json(foundJoke);
}); 
//
//3. GET a jokes by filtering on the joke type
app.get("/filter", (req, res) => { 
  const type = req.query.type;
  const foundJoke = (data.jokes).filter((joke)=>(joke.jokeType ===type));
  res.json(foundJoke);
});

//4. POST a new joke
app.post("/jokes", (req, res) => { 
  const newJoke ={
    id: data.jokes.length +1 ,
    jokeText: req.body.text,
    jokeType: req.body.type,
  }
  data.jokes.push(newJoke);
  res.json(data.jokes.slice(-1));
});

//5. PUT a joke
app.put("/jokes/:id", (req, res) => { 
  const id = parseInt(req.params.id);
  const newJoke ={
    id: id ,
    jokeText: req.body.text,
    jokeType: req.body.type,
  }
  const index = data.jokes.findIndex( (joke)=>{joke.id === id}  );
  data.jokes[index] = newJoke;
  res.json(data.jokes[index]);
});

//6. PATCH a joke
app.patch("/jokes/:id", (req, res) => { 
  const id = parseInt(req.params.id);
  const foundJoke = (data.jokes).find((joke)=>( joke.id===id )); 
  const newJoke ={
    id: foundJoke.id ,
    jokeText: req.body.text||foundJoke.jokeText,
    jokeType: req.body.type||foundJoke.jokeType,
  }
  const index = data.jokes.findIndex( (joke)=>(joke.id === id)  );
  data.jokes[index] = newJoke;
  res.json(data.jokes[index]); 
});
//7. DELETE Specific joke
app.delete("/jokes/:id", (req, res) => { 
  const id = parseInt(req.params.id);
  const index = data.jokes.findIndex( (joke)=>(joke.id === id)  );
  if( index >-1){
    data.jokes.splice(index, 1);
    res.sendStatus(200);
  }
  else{
    res.status(404).json({"error":"joke with id:"+id+" not found. can not be deleted!"});
  }
});
//8. DELETE All jokes
const masterKey = "4VGP2DN-6EWM4SJ-N6FGRHV-Z3PR3TT";
app.delete("/all", (req, res) => { 
  const userKey = req.query.userKey;
  if(userKey === masterKey){
      data.jokes = [];
      res.sendStatus(200);
  }
  else{
    res.status(404).json({"error":"you are not authorised to delete data."});
  }
});


app.listen(port, () => {
  console.log(`Successfully started server on port ${port}.`);
});

