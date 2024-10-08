import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { Task } from '@/models/Project';

export async function GET(request, { params }) {
  await dbConnect();
  const { taskId } = params;
  const task = await Task.findById(taskId);
  return NextResponse.json(task);
}