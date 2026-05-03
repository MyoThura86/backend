const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
let notes = [
    { id: 1, content: "HTML is easy", important: true },
    { id: 2, content: "Browser can execute only JavaScript", important: false },
    { id: 3, content: "GET and POST are the most important methods of HTTP protocol", important: true }
]

const generateId = () => {
    return Math.max(...notes.map(n => n.id)) + 1
}

// ✅ GET all notes
app.get('/api/notes', (req, res) => {
    res.json(notes)
})

// ✅ GET single note
app.get('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id)
    const note = notes.find(n => n.id === id)

    if (note) {
        res.json(note)
    } else {
        res.status(404).end()
    }
})

// ✅ CREATE note
app.post('/api/notes', (req, res) => {
    const body = req.body

    if (!body.content) {
        return res.status(400).json({ error: 'content missing' })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        id: generateId()
    }

    notes = notes.concat(note)
    res.json(note)
})

// ✅ UPDATE note
app.put('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id)
    const body = req.body

    const updatedNote = {
        id: id,
        content: body.content,
        important: body.important
    }

    notes = notes.map(n => n.id === id ? updatedNote : n)

    res.json(updatedNote)
})

// ✅ DELETE (optional but useful)
app.delete('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id)
    notes = notes.filter(n => n.id !== id)

    res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})