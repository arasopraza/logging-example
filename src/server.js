const Hapi = require('@hapi/hapi');
const notes = require('./api/notes');
const NotesService = require('./services/NotesService');
const logger = require('./logger/index');
const ClientError = require('./exceptions/ClientError');
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
  
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
    const url = request.server.info.uri + request.path

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    logger.info(`hostid=${request.server.info.id}, ipaddress=${request.info.remoteAddress}, method=${request.method}, url=${url}, statuscode=${response.statusCode}, message:${response.source.message}`);
    return h.continue;
  });

  await server.start();
  console.log(`server start at ${server.info.uri}`);
}

init();