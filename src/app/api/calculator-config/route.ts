import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const config = await prisma.calculatorConfig.findUnique({
      where: { id: 'singleton' },
    });
    return NextResponse.json(config || { 
      basePrice: 7500,
      sliderLabel: "Кількість кімнат",
      sliderMin: 1,
      sliderMax: 5,
      sliderStep: 1,
      sliderSuffix: " кімн.",
      packagesLabel: "Рівень інсталяції",
      packagesJson: "[{\"name\":\"Base\",\"multiplier\":1},{\"name\":\"Standard\",\"multiplier\":1.5},{\"name\":\"Premium\",\"multiplier\":2.5}]",
      resultLabel: "Орієнтовна вартість",
      resultPrefix: "від",
      resultCurrency: "₴"
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const dataToSave = { ...body };
    if (dataToSave.basePrice) dataToSave.basePrice = parseInt(dataToSave.basePrice);
    if (dataToSave.sliderMin) dataToSave.sliderMin = parseInt(dataToSave.sliderMin);
    if (dataToSave.sliderMax) dataToSave.sliderMax = parseInt(dataToSave.sliderMax);
    if (dataToSave.sliderStep) dataToSave.sliderStep = parseInt(dataToSave.sliderStep);

    const config = await prisma.calculatorConfig.upsert({
      where: { id: 'singleton' },
      update: dataToSave,
      create: { id: 'singleton', ...dataToSave },
    });
    return NextResponse.json(config);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
