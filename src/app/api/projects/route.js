import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { Project } from '@/models/Project';

export async function GET() {
  await dbConnect();
  try {
    const projects = await Project.find().populate('columns');
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await dbConnect();
  try {
    const { name } = await request.json();
    const project = await Project.create({ name });
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}