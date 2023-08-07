import express from 'express';
import fs from 'fs/promises';
import cors from 'cors';
import { log } from 'console';

const filename = "animalbase2023.json";

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Example app listening on port ${port}`));

app.get("/", (req,res) => res.send("Hello from animalbase"));

app.get("/animals", async (req,res) => {
  const animals = JSON.parse(await fs.readFile(filename));
//  console.log(animals);
  res.json(animals);
});

app.get("/animals/:id", async (req,res) => {
  const id = req.params.id;
  const animals = JSON.parse(await fs.readFile(filename));
  const animal = animals.find(animal => animal.id == id);

  if(animal) {
    res.json(animal);
  } else {
    res.status(404).end();
  }
});

app.post("/animals", async (req,res) => {
  const animals = JSON.parse(await fs.readFile(filename));

  // generate "unique" id
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const id = alphabet[Math.floor(Math.random()*alphabet.length)] + alphabet[Math.floor(Math.random()*alphabet.length)] + alphabet[Math.floor(Math.random()*alphabet.length)] + new Date().getTime();

  const animal = {
    id: id,
    name: req.body.name,
    type: req.body.type,
    desc: req.body.desc,
    age: req.body.age,
    winner: req.body.winner,
    star: req.body.star
  };

  // add new animal object to the list
  animals.push(animal);

  // re-save entire json-file (with the new animal object at the end)
  fs.writeFile(filename, JSON.stringify(animals));

  // and return the newly created object
  res.json(animal);
});

app.put("/animals/:id", async(req,res) => {
  const id = req.params.id;
  const animals = JSON.parse(await fs.readFile(filename));
  const animal = animals.find(animal => animal.id == id);

  console.log("Put");

  if(animal) {
    // update found animal with request body
    animal.name = req.body.name;
    animal.type = req.body.type;
    animal.desc = req.body.desc;
    animal.age = req.body.age;
    animal.winner = req.body.winner;
    animal.star = req.body.star;
    
    // re-save entire json-file (with the update animal object inside)
    fs.writeFile(filename, JSON.stringify(animals));

    // respond with the updated animal
    res.json(animal);
  } else {
    res.status(404).end();
  }
})

app.patch("/animals/:id", async(req,res) => {
  const id = req.params.id;
  const animals = JSON.parse(await fs.readFile(filename));
  const animal = animals.find(animal => animal.id == id);

  console.log("PATCH");

  if(animal) {
/*    console.log("Animal:");
    console.log(animal);
    console.log("Patch with: ");
    console.log(req.body);
*/
    // only patch properties that exist in the animal
    for(const prop in req.body) {
      if(animal[prop] != undefined) { // need to check for undefined, as some props are falsey
        animal[prop] = req.body[prop];
      }
    }
/*    console.log("To:");
    console.log(animal);
*/
    // re-save entire json-file (with the update animal object inside)
    fs.writeFile(filename, JSON.stringify(animals));
    // respond with the patched animal
    res.json(animal);

  } else {
    res.status(404).end();
  }

})

app.delete("/animals/:id", async(req,res) => {
  const id = req.params.id;
  const animals = JSON.parse(await fs.readFile(filename));
  const animal = animals.find(animal => animal.id == id);

  console.log("DELETE " + id);

  if(animal) {
    // remove animal from list, by finding and splicing its index
    const index = animals.indexOf(animal);
    animals.splice(index,1);

    // re-save entire json-file (with the deleted animal removed)
    fs.writeFile(filename, JSON.stringify(animals));
    
    res.json(animal);
  } else {
    res.status(404).end();
  }

});