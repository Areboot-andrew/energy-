import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, unit, price, category } = body;
    
    const updatedPrice = await prisma.priceItem.update({
      where: { id },
      data: { 
        name, 
        unit, 
        price: typeof price === 'string' ? parseFloat(price) : price, 
        category 
      },
    });
    
    return NextResponse.json(updatedPrice);
  } catch (error) {
    console.error('Error updating price item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.priceItem.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting price item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
