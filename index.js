// Import express and morgan
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
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

// function to randomly generate a unique ID in range 0-99999999
const generateId = () => {
    return String(Math.floor(Math.random() * 100000000))
}

// POST
app.post('/api/persons', (request, response) => {
    const body = request.body
    const existingPerson = persons.find(person => person.name === body.name)

    if (existingPerson) {
        return response.status(400).json({
            error: 'Person name already exists'
        })
    }

    if (!body.name || !body.number || existingPerson) {
        return response.status(400).json({
            error: 'Person name or number is missing'
        })
    }

    const newPerson = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(newPerson)
    response.json(newPerson)
})

// GET all
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// GET info
app.get('/info', (request, response) => {
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${Date()}</p>
    `)
})

// GET person
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

// DELETE
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})