const fastify = require('fastify')({
  logger: true,
  querystringParser: str => require('qs').parse(str)
});

const fastifyEnv = require('@fastify/env');
const packageJson = require('./package.json');
const path = require('path');
const fs = require('fs');

const version = `v${packageJson.version.split('.')[0]}`;

const options = {
  name: 'project',
  prefix: `/api/${version}`,
  getUserModel: () => {
    return fastify.account.models.user;
  }
};

const createServer = () => {
  fastify.register(fastifyEnv, {
    dotenv: true,
    schema: require('./env.schema.json')
  });

  fastify.register(
    require('fastify-plugin')(async fastify => {
      fastify.register(require('@kne/fastify-sequelize'), {
        db: {
          dialect: fastify.config.DB_DIALECT,
          host: fastify.config.DB_HOST,
          port: fastify.config.DB_PORT,
          database: fastify.config.DB_DATABASE,
          username: fastify.config.DB_USERNAME,
          password: fastify.config.DB_PASSWORD
        },
        modelsGlobOptions: {
          syncOptions: {}
        },
        getUserModel: options.getUserModel
      });

      fastify.register(require('@kne/fastify-account'), {
        isTest: true,
        prefix: `${options.prefix}`<% if (includeOidc) { %>,
        getUserAuthenticate: () => fastify.oidc.authenticate.user<% } %>
      });<% if (includeOidc) { %>

      // .env 里的值不一定写入 process.env（@fastify/env 7 起不再写入），fastify-oidc 的环境变量默认值可能读不到，需显式传入
      fastify.register(require('@kne/fastify-oidc'), {
        selfClient: { clientName: '<%= name.charAt(0).toUpperCase() + name.slice(1) %>' },
        origin: fastify.config.ORIGIN,
        keyEncryptionSecret: fastify.config.OIDC_KEY_SECRET
      });<% } %>
    })
  );

  fastify.register(require('@kne/fastify-file-manager'), {
    prefix: `${options.prefix}/static`,
    root: path.resolve('./static')
  });

  fastify.register(
    require('fastify-plugin')(async fastify => {
      fastify.register(require('@kne/fastify-namespace'), {
        options,
        name: options.name,
        modules: [
          ['controllers', path.resolve(__dirname, './libs/controllers')],
          [
            'models',
            await fastify.sequelize.addModels(path.resolve(__dirname, './libs/models'), {
              getUserModel: options.getUserModel
            })
          ],
          ['services', path.resolve(__dirname, './libs/services')]
        ]
      });
      // 内含 @kne/fastify-setting，须在 sync 之前注册
      await fastify.register(require('@kne/fastify-app-runtime'), {
        root: path.join(__dirname, './build'),
        packageJson: fs.existsSync(path.join(__dirname, '../package.json')) ? require('../package.json') : packageJson,
        setting: {
          prefix: `${options.prefix}/setting`
        },
        static: {
          manifestFiles: ['manifest.json']
        }
      });
      await fastify.sequelize.sync();
    })
  );

  fastify.register(require('@kne/fastify-response-data-format'));
};

module.exports = {
  fastify,
  createServer,
  start: () => {
    createServer();
    return fastify.then(() => {
      fastify.listen({ port: fastify.config.PORT, host: '0.0.0.0' }, (err, address) => {
        if (err) throw err;
        console.log(`Server is now listening on ${address}`);
      });
    });
  }
};
