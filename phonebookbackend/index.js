const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

let phonebookEntries = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  let newId;
  do {
    newId = Math.floor(Math.random() * 1000000);
  } while (phonebookEntries.some((entry) => entry.id === newId));
  return newId;
};

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: "Name or number is missing" });
  }
  if (phonebookEntries.some((entry) => entry.name === name)) {
    return res.status(400).json({ error: "Name must be unique" });
  }

  const newEntry = {
    id: generateId(),
    name,
    number,
  };

  phonebookEntries.push(newEntry);
  res.json(newEntry);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const entry = phonebookEntries.find((entry) => entry.id === id);

  if (entry) {
    res.json(entry);
  } else {
    res.status(404).send({ error: "Entry not found" });
  }
});

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (req, res) => {
  res.json(phonebookEntries);
});

app.get("/info", (req, res) => {
  const date = new Date();
  const phonebookEntryCount = phonebookEntries.length;
  res.send(
    `Phonebook has info for ${phonebookEntryCount} people <br />` + `${date}`
  );
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const initialLength = phonebookEntries.length;
  phonebookEntries = phonebookEntries.filter((entry) => entry.id !== id);

  if (phonebookEntries.length < initialLength) {
    res.status(204).end(); // No content, but successful deletion
  } else {
    res.status(404).send({ error: "Entry not found" }); // Entry not found
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
