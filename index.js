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
  console.log(animals);
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