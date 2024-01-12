class NotesHandler {
  constructor(service) {
    this._service = service;

    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
    this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
  }

  async postNoteHandler(request, h) {
    const { title = 'untitled', body, tags } = request.payload;

    const noteId = await this._service.addNote({
      title, body, tags,
    });

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId,
      },
    });
    response.code(201);

    return response;
  }

  async getNoteByIdHandler(request, h) {
    const { id } = request.params;

    const note = await this._service.getNoteById(id);
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditampilkan',
      data: {
        note,
      },
    }).code(201);

    return response;
  }

  async deleteNoteByIdHandler(request, h) {
    const { id } = request.params;

    const note = await this._service.deleteNoteById(id);

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
      data: {
        note,
      },
    }).code(202)

    return response;
  }
}

module.exports = NotesHandler;