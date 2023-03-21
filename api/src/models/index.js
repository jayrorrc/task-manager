import User from "./User.js"
import Task from "./Task.js"

User.hasMany(Task, {
  foreignKey: 'owner'
})

Task.belongsTo(User)

export { User, Task }