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
app.get('/api/persons/:id', (request, response, next) => {
    Person
        .findById(request.params.id)
        .then(person => {
            response.json(person)
        })
        .catch((error) => next(error))
})

// DELETE: delete a person by id
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

// PUT: update a person with the same name
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    // findByIdAndUpdate function which takes id and new person object
    // { new: true } - return the updated person rather than the original
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

// Define unknown endpoint
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// Define error handler middleware
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    next(error)
}

// use unknown endpoint and error handler middleware
app.use(unknownEndpoint)
app.use(errorHandler)

// use PORT environment variable
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})