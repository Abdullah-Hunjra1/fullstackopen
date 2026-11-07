import { useState, useEffect } from 'react'
import personService from './services/persons'


const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      filter shown with: <input
        value={filter}
        onChange={handleFilterChange}
      />
    </div>
  )
}



const PersonForm = ({
  handleSubmit,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input
          value={newName}
          onChange={handleNameChange}
        />
      </div>
      <div>
        number: <input
          value={newNumber}
          onChange={handleNumberChange}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}


const Persons = ({ persons, handleDelete }) => {
  return (
    <div>
      {persons.map(person =>
        <p key={person.id}>
          {person.name} {person.number}
          <button onClick={() => handleDelete(person.id, person.name)}>
            delete
          </button>
        </p>
      )}
    </div>
  )
}


const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(
      person => person.name.toLowerCase() === newName.toLowerCase()
    )

    if (existingPerson) {
      const confirmed = window.confirm(
        `${existingPerson.name} is already added to phonebook. Replace the old number with a new one?`
      )

      if (confirmed) {
        const updatedPerson = {
          ...existingPerson,
          number: newNumber
        }

        personService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(
              persons.map(person =>
                person.id !== existingPerson.id ? person : returnedPerson
              )
            )
            setNewName('')
            setNewNumber('')
          })
      }

      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter
        filter={filter}
        handleFilterChange={handleFilterChange}
      />

      <PersonForm
        handleSubmit={handleSubmit}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>
      <Persons
        persons={personsToShow}
        handleDelete={handleDelete}
      />
    </div>
  )
}

export default App