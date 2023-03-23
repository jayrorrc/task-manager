import User from "./User.js"
import Task from "./Task.js"

User.hasMany(Task, {
  foreignKey: 'owner',
  allowNull: false,
})

Task.belongsTo(User, {
  foreignKey: 'owner',
  allowNull: false,
})

export { User, Task }