import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

const CREATED_STATUS = 201;
const UNPROCESSABLE_ENTITY_STATUS = 422;

export async function POST(request) {
  const data = await request.json();
  const { email, password, name } = data;

  if (!email || !password) {
    return NextResponse.json(
      { message: 'Email and password are required' },
      { status: UNPROCESSABLE_ENTITY_STATUS },
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return NextResponse.json(
      { message: 'User with this email already exists' },
      { status: UNPROCESSABLE_ENTITY_STATUS },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  return NextResponse.json(
    { message: 'User created successfully' },
    { status: CREATED_STATUS },
  );
}
