// Copyright (c) 2022 Bondo Pangaji
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

const { nanoid } = require('nanoid')
const notes = require('./notes')


/**
 * Handler for creating notes
 * @param request object with details about the end user's request
 * @param h response toolkit, an object with several methods used to respond to the request.
 * @returns {*}
 */
const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload

  const id = nanoid(16)
  const createdAt = new Date().toISOString()
  const updatedAt = createdAt

  const newNote = {
    title, tags, body, id, createdAt, updatedAt
  }

  notes.push(newNote)

  const isSuccess = notes.filter((note) => note.id === id).length > 0

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Notes successfully added',
      data: {
        noteId: id
      }
    })
    response.code(201)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Failed to add notes'
  })

  response.code(500)
  return response
}

/**
 * Handler for getting all notes
 * @returns {{data: {notes: []}, status: string}}
 */
const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes
  }
})

/**
 * Handler for getting note by id
 * @param request object with details about the end user's request
 * @param h response toolkit, an object with several methods used to respond to the request.
 * @returns {{data: {note: *}, status: string}|*}
 */
const getNoteByIdHandler = (request, h) => {
  const { id } = request.params

  const note = notes.filter((n) => n.id === id)[0]

  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note
      }
    }
  }

  const response = h.response({
    status: 'fail',
    message: 'Notes cannot be found'
  })
  response.code(404)
  return response
}

/**
 * Handler for edit note by id
 * @param request object with details about the end user's request
 * @param h response toolkit, an object with several methods used to respond to the request.
 * @returns {*}
 */
const editNoteByIdHandler = (request, h) => {
  const { id } = request.params

  const { title, tags, body } = request.payload
  const updatedAt = new Date().toISOString()

  const index = notes.findIndex((note) => note.id === id)

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt
    }

    const response = h.response({
      status: 'success',
      message: 'Notes have been updated'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Failed to update notes. Id cannot be found'
  })
  response.code(404)
  return response
}

/**
 * Handler for delete note by id
 * @param request object with details about the end user's request
 * @param h response toolkit, an object with several methods used to respond to the request.
 * @returns {*}
 */
const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params

  const index = notes.findIndex((note) => note.id === id)

  if (index !== -1) {
    notes.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Notes successfully deleted'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Failed to delete notes. Id cannot be found'
  })
  response.code(404)
  return response
}

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler
}
