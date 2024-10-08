import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request, { params }) {
  const { id } = params;
  const { columnId } = await request.json();
  const updatedTask = await prisma.task.update({
    where: { id: parseInt(id) },
    data: { columnId },
  });
  return NextResponse.json(updatedTask);
}
