/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Filter from "./Filter";
import PersonForm from "./PersonForm";
import Persons from "./Persons";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);

  const Notification = ({ message, isError }) => {
    if (message === null) {
      return null;
    }

    const className = isError ? "error" : "success";
    return <div className={className}>{message}</div>;
  };

  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);

  const addName = (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName,
      number: newNumber,
    };

    personService.create(newPerson).then((response) => {
      setPersons(persons.concat(response.data));
      setNewName("");
      setNewNumber("");
      setSuccessMessage(`Added ${newPerson.name}`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    });
  };

  const deletePerson = (id) => {
    const personToDelete = persons.find((p) => p.id === id);
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      personService.remove(id).then(() => {
        setPersons(persons.filter((p) => p.id !== id));
      });
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredPersons = () => {
    if (!searchTerm) {
      return persons;
    }
    return persons.filter((person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} isError={false} />
      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
      <h3>Add a new</h3>
      <PersonForm
        addName={addName}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />
      <h3>Numbers</h3>
      <Persons persons={getFilteredPersons()} onDelete={deletePerson} />
    </div>
  );
};

export default App;
