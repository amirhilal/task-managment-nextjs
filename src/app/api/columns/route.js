import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { Project, Project_Columns } from '@/models/Project';

export async function GET() {
    await dbConnect();
    const columns = await Project_Columns.find().populate('tasks');
    return NextResponse.json(columns);
}