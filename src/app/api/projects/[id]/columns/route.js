import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { Project, Project_Columns } from '@/models/Project';

export async function GET(request, { params }) {
  await dbConnect();
  try {
    const { id } = params;
    const project = await Project.findById(id).populate('columns');
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json(project.columns);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  await dbConnect();
  try {
    const { id } = params;
    const { title, color, icon } = await request.json();
    const column = await Project_Columns.create({ title, color, icon, project: id });
    await Project.findByIdAndUpdate(id, { $push: { columns: column._id } });
    return NextResponse.json(column);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  await dbConnect();
  try {
    const { id } = params;
    const { changes } = await request.json();
    const column = await Project_Columns.findByIdAndUpdate(id, changes, { new: true });
    return NextResponse.json(column);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
