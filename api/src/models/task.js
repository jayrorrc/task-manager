import { DataTypes } from 'sequelize'
import db from '../db.js'
import user from './user.js'

const task = db.define('task', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  sumary: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['TODO', 'IN-PROGRESS', 'COMPLETE']],
    }
  },
  completedAt: {
     type: DataTypes.DataTypes.DATE(6),
  }
});

task.belongsTo(user)

export default task
