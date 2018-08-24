const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('reqData', (req) => {
  return JSON.stringify(req.body)
})

const app = express()

app.use(bodyParser.json())
app.use(morgan(':method :url :reqData :status :res[content-length] - :response-time ms'))
app.use(cors())
app.use(express.static('build'))

app.get('/api/persons', (req, res) => {
  Person
    .find({}, { __v: 0 })
    .then(persons => {
      res.json(persons.map(Person.format))
    })
    .catch(error => console.log(error))
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  Person
    .find({ name: body.name })
    .then(result => {
      if (result.length > 0) {
        res.status(400).json({ error: 'name already exists in database' })
      } else {
        const person = new Person({
          name: body.name,
          number: body.number,
        })
        person
          .save()
          .then(savedPerson => {
            res.json(Person.format(savedPerson))
            console.log(`lisätään henkilö ${savedPerson.name} numero ${savedPerson.number} tietokantaan`)
          })
          .catch(error => console.log(error))
      }
    })
    .catch(error => {
      console.log(error)
    })
})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(Person.format(person))
      } else {
        res.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (req, res) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(() => {
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.put('/api/persons/:id', (req, res) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(req.params.id, person, { new: true } )
    .then(Person.format)
    .then(savedAndFormattedPerson => res.json(savedAndFormattedPerson))
    .catch(() => {
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.get('/info', (req, res) => {
  Person
    .find({}, { __v: 0 })
    .then(persons => {
      const personAmountString = `puhelinluettelossa on ${persons.length} henkilön tiedot`
      res.send('<p>' + personAmountString + '</p>' + '<p>' + new Date() + '</p>')
    })
    .catch(error => console.log(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})