/* ─────────────────────────────────────────────────────────────
   כל התמונות והסרטונים של האתר מוגדרים כאן.
   איך מוסיפים קובץ:
   1. ב-GitHub נכנסים לתיקייה media ← Add file ← Upload files ← מעלים ← Commit.
   2. מוסיפים כאן שורה עם שם הקובץ, למשל: { type: 'image', src: 'media/project1.jpg', title: '...', sub: '...' }
   3. סרטון: { type: 'video', src: 'media/reel1.mp4', title: '...', sub: '...' }
   4. סרטון מיוטיוב או קישור חיצוני: { type: 'youtube', id: 'מזהה הסרטון', title: '...' }
   הסדר כאן הוא הסדר באתר. כדי להסיר פריט, מוחקים את השורה שלו.
   ───────────────────────────────────────────────────────────── */
var K = 'https://media.kolbo.ai/kolboai-media/generated-images/6a90b7820d92b30dd2560541/6ae168392f760bb97affd0b4/';

window.SITE_MEDIA = {
  // אנימציית הגלילה בראש העמוד: מהרחוב, לאורך הבניין, ועד הסלון.
  scrollVideo: '', // ריק = בראש העמוד מוצגת תמונה קבועה במקום אנימציית הגלילה
  scrollPoster: K + 'Image-1-shows-the-residen-6ae16b22a7f161b80422821a-nano-banana-2-image.jpeg',

  // סרטון ההסבר.
  explainer: '', // ריק = קטע סרטון ההסבר מוסתר

  // לפני ואחרי. אפשר להוסיף עוד זוגות.
  beforeAfter: [
    { before: K + 'Photorealistic-architectu-6ae1684e2f760bb97affd0c9-nano-banana-pro.jpeg',
      after:  K + 'Image-1-is-the-existing-s-6ae168a3a7f161b804227ca2-nano-banana-2-image.jpeg',
      title: 'פינוי בינוי, גבעתיים (קונספט)' }
  ],

  // גלריית העבודות.
  gallery: [
    { type: 'image', src: K + 'Photorealistic-architectu-6ae1684d2f760bb97affd0c7-nano-banana-pro.jpeg', title: 'מגדל מגורים, תל אביב', sub: 'הדמיית חוץ, שעת ערב', size: 'lg' },
    { type: 'image', src: K + 'Photorealistic-interior-v-6ae1684da7f161b804227c3e-nano-banana-pro.jpeg', title: 'לובי כפול גובה', sub: 'עיצוב פנים' },
    { type: 'image', src: K + 'Photorealistic-interior-v-6ae1684ef3b2fe48fff74f5b-nano-banana-pro.jpeg', title: 'דירה לדוגמה, הרצליה פיתוח', sub: 'סלון עם נוף לים', size: 'md' },
    { type: 'image', src: K + 'Photorealistic-exterior-v-6ae1684ef3b2fe48fff74f5c-nano-banana-pro.jpeg', title: 'וילה פרטית, כפר שמריהו', sub: 'חוץ ובריכה', size: 'md' },
    { type: 'image', src: K + 'Photorealistic-interior-v-6ae1684da7f161b804227c3f-nano-banana-pro.jpeg', title: 'מטבח, דירת דוגמה', sub: 'מגדל בתל אביב' },
    { type: 'image', src: K + 'Photorealistic-exterior-v-6ae1684dd5b5ff1bb9c9e925-nano-banana-pro.jpeg', title: 'פנטהאוז, ירושלים', sub: 'מרפסת גג בשקיעה' },
    { type: 'image', src: K + 'Photorealistic-aerial-dro-6ae1684dd5b5ff1bb9c9e924-nano-banana-pro.jpeg', title: 'שכונה חדשה', sub: 'מבט מהאוויר' }
  ],

  // רילס וסרטונים (למשל מהאינסטגרם). ריק = הקטע מוסתר.
  reels: [
    // { type: 'video', src: 'media/reel1.mp4', title: 'שם הפרויקט' },
  ]
};
