const Hapi = require('@hapi/hapi');
const notes = require('./api/notes');
const NotesService = require('./services/NotesService');
require('dotenv').config();

const init = async () => {
  const notesService = new NotesService();

  const server = Hapi.server({
    host: 'localhost',
    port: 3000,
  })

  await server.register(
    {
      plugin: notes,
      options: {
        service: notesService,
      },
    },
  )
  
  await server.start();
  console.log(`server start at ${server.info.uri}`);
}

init();