import { Sequelize } from 'sequelize-typescript'

const db = new Sequelize({
  host: 'canvasrecruit-staging.cpufes8llodw.us-west-2.rds.amazonaws.com',
  dialect: 'mysql',
  username: 'canvasadmin',
  password: 'HOUWdP!oZa7v',
  database: 'canvas',
  logging: false,
  define: {
    underscored: true,
    timestamps: true,
    charset: 'utf8mb4',
  },
  modelPaths: [__dirname+'/models']
})

export default db
