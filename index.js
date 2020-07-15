const express = require('express')
const { json } = require('express')
const app = express()
app.use(express.json())

let persons = [
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
]

function generateId() {
    return Math.floor(Math.random() * 100000000)
}

app.get('/api/info', (req, resp) => {
    const info = `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
    resp.send(info)
})

app.get('/api/persons', (req, resp) => {
    resp.json(persons)
})
app.get('/api/persons/:id', (req, resp) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        resp.json(person)
        return
    }
    resp.status(404).end()
})
app.delete('/api/persons/:id', (req, resp) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    resp.status(204).end()
})
app.post('/api/persons', (req, resp) => {
    const person = req.body
    if (!person.name || !person.number) {
        let missing = 'name' // default case
        if (!person.name && !person.number) {
            missing = 'name and number'
        } else if (!person.number) {
            missing = 'number'
        }
        resp.status(400).json({ error: `${missing} must be filled` })
        return
    }
    const exist = persons.filter(p => p.name === person.name)
    if (exist.length > 0) {
        resp.status(400).json({ error: "name must be unique" })
        return
    }
    person.id = generateId()
    persons = persons.concat(person)
    resp.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})