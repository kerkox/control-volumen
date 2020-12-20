const { exec } = require('child_process');
const qs = require('qs')
const fastify = require('fastify')({
  logger: true,
  querystringParser: str => qs.parse(str)
});

fastify.get('/', function (request, reply) {
  reply.send({ hello: 'world' })
})

const opts = {
  schema: {
    querystring: {
      value: { type: 'integer' }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          ok: { type: 'boolean' }
        }
      }
    }
  },
}

fastify.get('/volumen/:value', opts,
  (req, reply) => {
    console.log('req.params',req.params)
    let value = req.params.value;
    console.log(`value of volumen= ${value}`);
    const command = `libs\\nircmd.exe changesysvolume ${value}`;
    console.log(`command: ${command}`)
    exec(command, (err, stdout, sterr) => {
      if (err) {
        console.error(err);
        reply.send({ ok: false })
        return false;
      }
      console.log(stdout)
      reply.send({ ok: true })
    })
  })

const PORT = process.env.PORT || 3000;
fastify.listen(PORT,'0.0.0.0', function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`)
})