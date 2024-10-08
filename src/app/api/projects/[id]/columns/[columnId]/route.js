import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { Project, Project_Columns } from '@/models/Project';

export async function GET(request, { params }) {
  await dbConnect();
  try {
    const { columnId } = params;
    const column = await Project_Columns.findById(columnId);
    if (!column) {
      return NextResponse.json({ error: 'Column not found' }, { status: 404 });
    }
    return NextResponse.json(column);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  await dbConnect();
  try {
    const { columnId } = params;
    const { title, color, icon } = await request.json();
    console.log(title, color, icon);
    const updatedColumn = await Project_Columns.findByIdAndUpdate(
      columnId,
      { title, color, icon },
      { new: true },
    );
    if (!updatedColumn) {
      return NextResponse.json({ error: 'Column not found' }, { status: 404 });
    }
    return NextResponse.json(updatedColumn);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  await dbConnect();
  try {
    const { id, columnId } = params;
    await Project_Columns.findByIdAndDelete(columnId);
    await Project.findByIdAndUpdate(id, { $pull: { columns: columnId } });
    return NextResponse.json({ message: 'Column deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
