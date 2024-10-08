import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { Task } from '@/models/Project';

export async function GET(request, { params }) {
  await dbConnect();
  const { columnId } = params;
  const tasks = await Task.find({ column: columnId });
  return NextResponse.json(tasks);
}
