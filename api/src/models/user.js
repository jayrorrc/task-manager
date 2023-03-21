import { DataTypes } from 'sequelize'
import db from '../db.js'
import task from './task.js'

const user = db.define('user', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['MANAGER', 'TECHNICIAN']],
    }
  },
});

user.hasMany(task, {
  foreignKey: 'owner'
})

export default user
