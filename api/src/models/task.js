import { DataTypes } from 'sequelize'
import db from '../db.js'

import { TASKS } from '../utils/constantes/index.js';

const Task = db.define('task', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [0, 2500],
    }
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [Object.values(TASKS.STATUS)],
    }
  },
  completedAt: {
     type: DataTypes.DATE,
  }
});

export default Task
