// const mongoose = require('mongoose');


// if (process.argv.length < 3) {
//   console.log('Please provide password: node mongo.js <password>')
//   process.exit(1)
// }

// const password = process.argv[2]

// const url = `mongodb+srv://myowithmom_db_user:${password}@cluster0.ivol8wt.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

// mongoose.set('strictQuery', false)

// mongoose.connect(url, { family: 4 })

// const noteSchema = new mongoose.Schema({
//   content: String,
//   important: Boolean,
// })

// const Note = mongoose.model('Note', noteSchema)

// // WAIT for connection before querying
// mongoose.connection.once('open', () => {
//   console.log('📡 Connected to MongoDB')

//   Note.find({}).then(result => {
//     console.log('📄 notes:')
//     result.forEach(note => {
//       console.log(note)
//     })

//     mongoose.connection.close()
//   })
// })
const mongoose = require('mongoose')

if (process.argv.length < 5) {
  console.log('give password, content, and important as arguments')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://myowithmom_db_user:${password}@cluster0.ivol8wt.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'mongo is easy',
  important: false,
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})

// Note.find({important: false}).then(result => {
//   result.forEach(note => {
//     console.log(note)
//   })
//   mongoose.connection.close()
// })