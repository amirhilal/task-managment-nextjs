import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import {Task }from '@/models/Project';

export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = params;
  const { columnId } = await request.json();
  const updatedTask = await Task.findByIdAndUpdate(id, { column: columnId }, { new: true });
  return NextResponse.json(updatedTask);
}
