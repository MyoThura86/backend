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
    }).catch(error => {
        res.status(500).json({ error: 'failed to fetch notes' })
    })
})

// ✅ GET single note
app.get('/api/notes/:id', (req, res, next) => {
  Note.findById(req.params.id)
    .then(result => {
      if (result) {
        res.json(result)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

// ✅ CREATE note
app.post('/api/notes', (req, res,next) => {
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
    }).catch(error => next(error))
})

// ✅ UPDATE note
app.put('/api/notes/:id', (req, res) => {
    const { content, important } = req.body
    
    Note.findById(req.params.id)
        .then(note =>{
            if(!note) {
                return res.status(404).end()
            }
            note.content = content
            note.important = important
            return note.save().then(updatedNote => {
                res.json(updatedNote)
            })
        })
        .catch(error => next(error))
})

// ✅ DELETE (optional but useful)
app.delete('/api/notes/:id', (req, res, next) => {

    Note.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

const unkownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unkownEndpoint)
const errorHandler = (error, req, res, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    }
    if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})