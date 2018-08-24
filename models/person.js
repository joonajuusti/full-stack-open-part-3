const mongoose = require('mongoose')
const Schema = mongoose.Schema

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const url = process.env.MONGODB_URL

const personSchema = new Schema({
  name: { type: String, unique: true },
  number: String,
})

personSchema.statics.format = function(person) {
  const formattedPerson = {
    name: person.name,
    number: person.number,
    id: person._id
  }
  return formattedPerson
}

const Person = mongoose.model('Person', personSchema)

mongoose.connect(url, { useNewUrlParser: true })

module.exports = Person