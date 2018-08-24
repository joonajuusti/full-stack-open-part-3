const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const url = process.env.MONGODB_URL

mongoose.connect(url, { useNewUrlParser: true })

const Person = mongoose.model('Person', {
  name: String,
  number: String,
})

if (process.argv.length === 2) {
  console.log('puhelinluettelo:')
  Person
    .find({}, { __v: 0 })
    .then(result => {
      result.forEach(person => {
        console.log(person)
      })
      mongoose.connection.close()
    }).catch(error => console.log(error.message))
}

else if (process.argv.length === 4) {
  console.log()
  const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
  })

  person
    .save()
    .then(() => {
      console.log(`lisätään henkilö ${process.argv[2]} numero ${process.argv[3]} luetteloon`)
      mongoose.connection.close()
    })
}

else {
  console.log('else')
  mongoose.connection.close()
}
