import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  name: String,
  columns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project_Columns' }]
});

const Project_ColumnsSchema = new mongoose.Schema({
  title: String,
  color: { type: String, default: '#3B82F6' },
  icon: { type: String, default: 'clipboard' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
});

const TaskSchema = new mongoose.Schema({
  content: String,
  priority: String,
  assignee: String,
  dueDate: Date,
  column: { type: mongoose.Schema.Types.ObjectId, ref: 'Project_Columns' }
});

export const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
export const Project_Columns = mongoose.models.Project_Columns || mongoose.model('Project_Columns', Project_ColumnsSchema);
export const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);