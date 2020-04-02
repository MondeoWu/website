import { Sequelize } from 'sequelize-typescript'

const db = new Sequelize({
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  dialect: 'mysql',
  logging: true,
  define: {
    underscored: true,
    timestamps: true,
    charset: 'utf8mb4',
  },
  modelPaths: [__dirname+'/models']
})

export default db
