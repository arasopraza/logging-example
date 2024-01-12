const { Pool } = require('pg');
const { nanoid } = require('nanoid');

class NotesService {
  constructor() {
    this._pool = new Pool();
  }

  async addNote({
    title, body, tags,
  }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO notes VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, title, body, tags, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new Error('Catatan gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getNoteById(id) {
    const query = {
      text: `SELECT *
    FROM notes
    WHERE notes.id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new Error('Catatan tidak ditemukan');
    }

    return result.rows[0];
  }

  async deleteNoteById(id) {
    const query = {
      text: 'DELETE FROM notes WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new Error('Catatan gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = NotesService;