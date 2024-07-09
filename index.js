// import dotenv to use .env environment variables file
require('dotenv').config()
// import express and morgan and cors
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

// define express app
const app = express()

// getting Person mongoose schema
const Person = require('./modules/person')

let persons = [
    // {
    //     "id": "1",
    //     "name": "Arto Hellas",
    //     "number": "040-123456"
    // },
    // {
    //     "id": "2",
    //     "name": "Ada Lovelace",
    //     "number": "39-44-5323523"
    // },
    // {
    //     "id": "3",
    //     "name": "Dan Abramov",
    //     "number": "12-43-234345"
    // },
    // {
    //     "id": "4",
    //     "name": "Mary Poppendieck",
    //     "number": "39-23-6423122"
    // }
]

// use cors to allow requests from other origins
app.use(cors())

// show static content with 'static' middleware
app.use(express.static('dist'))

// use express json-parser
app.use(express.json())

// create and use morgan token and format for logging
const personToken = (req, res) => {
    return JSON.stringify(req.body)
}

morgan.token('person', personToken)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

// POST: use Person constructor function and 'save' operation to save to database
// TO-DO: check whether there is already a person in the database with the same name
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'Person name or number is missing'
        })
    }

    const newPerson = new Person({
        name: body.name,
        number: body.number
    })

    newPerson.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

// GET all: use find({}) to get the whole phonebook
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

// GET info use find({}) to get the whole phonebook length
app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        response.send(`
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${Date()}</p>
        `)
    })
})

// GET person: use findById
app.get('/api/persons/:id', (request, response) => {
    Person
        .findById(request.params.id)
        .then(person => {
            response.json(person)
        })
        .catch((error) => {
            response.status(404).end()
        })
})

// DELETE: TO-DO
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

// use PORT environment variable
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})