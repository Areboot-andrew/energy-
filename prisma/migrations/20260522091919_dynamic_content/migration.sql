-- AlterTable
ALTER TABLE "ClientRequest" ADD COLUMN "totalPrice" REAL;

-- CreateTable
CREATE TABLE "PageContent" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "heroTitle" TEXT NOT NULL DEFAULT 'Енергія Вашого Прогресу Під Ключ',
    "heroSub" TEXT NOT NULL DEFAULT 'Професійні інженерні рішення для преміальної нерухомості та комерційних об''єктів.',
    "aboutTitle" TEXT NOT NULL DEFAULT 'VOLT PREMIUM: Хірургічна точність у кожному контакті',
    "aboutText" TEXT NOT NULL DEFAULT 'Ми не просто прокладаємо дроти. Ми створюємо нервову систему вашого будинку.',
    "videoUrl" TEXT
);
