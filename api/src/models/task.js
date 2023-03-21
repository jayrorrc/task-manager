import { DataTypes } from 'sequelize'
import db from '../db.js'

const Task = db.define('task', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
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
     type: DataTypes.DATE(6),
  }
});

export default Task
