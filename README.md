# Ebbinghaus Spaced Repetition

Ingliz tilini o'rganish uchun Hermann Ebbinghaus spaced repetition metodini ishlatuvchi Next.js ilovasi.

## Xususiyatlar

- **5 ta quti tizimi**: Har xil vaqt oralig'ida so'zlarni takrorlash
- **Kartochkalar**: So'z va tarjima bilan interaktiv kartochkalar
- **Spaced Repetition**: Ilmiy asoslangan yodlash metodologiyasi
- **Sinonim tekshirish**: Yaqin ma'noli so'zlarni ham qabul qilish
- **Mobil optimallashtirilgan**: Telefon va planshet uchun qulay
- **Offline ishlash**: localStorage yordamida ma'lumotlar saqlanadi

## Qutilar tizimi

1. **Box 1 (Every hour)**: Har soatda tekshirish
2. **Box 2 (Five hours)**: Har 5 soatda tekshirish
3. **Box 3 (Every day)**: Har kuni tekshirish
4. **Box 4 (Five days)**: Har 5 kunda tekshirish
5. **Box 5 (Every month)**: Har oyda tekshirish

## Spaced Repetition logikasi

- **To'g'ri javob** → Keyingi qutiga o'tish
- **Noto'g'ri javob** → Oldingi qutiga qaytish yoki o'zida qolish

## O'rnatish

```bash
# Loyihani klonlash
git clone <repository-url>
cd ebbinghaus-spaced-repetition

# Dependencelarni o'rnatish
npm install

# Development server ishga tushirish
npm run dev
```

Brauzerda [http://localhost:3000](http://localhost:3000) oching.

## Foydalanish

1. **So'z qo'shish**: "So'z qo'shish" tugmasini bosing va inglizcha so'z va o'zbekcha tarjimasini kiriting
2. **Tekshirish**: Har qanday qutida "Tekshirishni boshlash" tugmasini bosing
3. **Javob berish**: Kartochkada ko'rsatilgan so'zni tarjima qiling yoki aksincha
4. **Natijani ko'rish**: Javobingiz to'g'ri yoki noto'g'ri ekanligini bilib oling

## Texnologiyalar

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **localStorage** - Data persistence

## Kelajakdagi rejalar

- AI integratsiyasi (OpenAI API)
- Ko'proq til qo'llab-quvvatlash
- Progress tracking
- Export/Import funksiyalari
- Push notifications


# Ebbinghaus
