import dbConnect from '@/lib/mongoose';
import { NextResponse } from 'next/server';
import { Task, Project_Columns } from '@/models/Project';

export async function GET() {
  await dbConnect();
  const tasks = await Task.find();
  return NextResponse.json(tasks);
}

export async function POST(req) {
  await dbConnect();
  const { content, priority, assignee, dueDate, columnId } = await req.json();
  const newTask = await Task.create({
    content,
    priority,
    assignee,
    dueDate,
    column: columnId,
  });
  const updatedColumn = await Project_Columns.findByIdAndUpdate(columnId, {
    $push: { tasks: newTask._id },
  });
  return NextResponse.json(newTask);
}
