import User from "./User.js"
import Task from "./Task.js"

User.hasMany(Task, {
  foreignKey: 'owner',
  allowNull: false,
})

Task.belongsTo(User)

export { User, Task }