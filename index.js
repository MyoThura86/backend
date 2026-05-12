require('dotenv').config()
const express = require('express')

const Note = require('./models/note')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))


// ✅ GET all notes
app.get('/api/notes', (req, res) => {
    Note.find({}).then(result => {
        res.json(result)
    })
})

// ✅ GET single note
app.get('/api/notes/:id', (req, res) => {
  Note.findById(req.params.id)
    .then(result => {
      if (result) {
        res.json(result)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => {
      res.status(400).send({ error: 'malformatted id' })
    })
})

// ✅ CREATE note
app.post('/api/notes', (req, res) => {
    const body = req.body

    if (!body.content) {
        return res.status(400).json({ error: 'content missing' })
    }

    const note =new Note({
        content: body.content,
        important: body.important || false,
    })
    note.save().then(savedNote => {
        res.json(savedNote)
    })

})

// ✅ UPDATE note
app.put('/api/notes/:id', (req, res) => {
    const id = String(req.params.id)
    const body = req.body

    const updatedNote = {
        content: body.content,
        important: body.important
    }

    Note.findByIdAndUpdate(req.params.id, updatedNote, { new: true })
        .then(result => {
            res.json(result)
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })
})

// ✅ DELETE (optional but useful)
app.delete('/api/notes/:id', (req, res) => {
    const id = String(req.params.id)
    Note.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})