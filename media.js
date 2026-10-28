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
  // הסרטון הועלה ל-4K עם שיפור איכות (Bytedance), ואז כווץ: מחשב 1440p, טלפון חיתוך אנכי 1080x1920 מהמרכז. פריים מפתח כל 4 פריימים לגלילה חלקה.
  scrollVideo: 'https://media.kolbo.ai/kolboai-media/uploaded-videos/6a90b7820d92b30dd2560541/6ae168392f760bb97affd0b4/1793226118559-fpv_4k_desk2.mp4',
  scrollVideoMobile: 'https://media.kolbo.ai/kolboai-media/uploaded-videos/6a90b7820d92b30dd2560541/6ae168392f760bb97affd0b4/1793225614081-fpv_4k_mob.mp4',
  scrollPoster: K + 'Image-1-shows-the-residen-6ae16b22a7f161b80422821a-nano-banana-2-image.jpeg', // תמונת רקע לראש העמוד. ריק = פתיח לבן נקי

  // סרטון ההסבר.
  explainer: '', // ריק = קטע סרטון ההסבר מוסתר

  // סרטון התדמית האנכי באתר (אנימציה בקוד, promo.js). כל שורה כאן היא חומר שמשתתף בו.
  // כדי להחליף חומר, מחליפים את הקישור. promo: null מסתיר את הקטע.
  // תמונות אמיתיות (צילומי סטוק מ-Pexels ו-Unsplash, שמורים ב-Kolbo). לפני/אחרי נשאר הדמיה.
  promo: {
    music: 'https://media.kolbo.ai/kolboai-media/generated-music/6a90b7820d92b30dd2560541/6ae168392f760bb97affd0b4/CUT-productions-real-24b6f6bb-91b3-45e2-bedd-02d11f749f11-chirp-hawk%20-%20Track%201.mp3',
    main: 'https://media.kolbo.ai/kolboai-media/uploaded-videos/6a90b7820d92b30dd2560541/6ae168392f760bb97affd0b4/1793201194118-main_web.mp4',
    y38: 'https://media.kolbo.ai/kolboai-media/uploaded-videos/6a90b7820d92b30dd2560541/6ae168392f760bb97affd0b4/1793201199911-y38_web.mp4',
    street: K + 'Image-1-shows-the-residen-6ae16b22a7f161b80422821a-nano-banana-2-image.jpeg',
    lobby: K + 'Photorealistic-interior-v-6ae1684da7f161b804227c3e-nano-banana-pro.jpeg',
    living: K + 'Photorealistic-interior-v-6ae1684ef3b2fe48fff74f5b-nano-banana-pro.jpeg',
    before: K + 'Photorealistic-architectu-6ae1684e2f760bb97affd0c9-nano-banana-pro.jpeg',
    after: K + 'Image-1-is-the-existing-s-6ae168a3a7f161b804227ca2-nano-banana-2-image.jpeg',
    tower: K + 'Photorealistic-architectu-6ae1684d2f760bb97affd0c7-nano-banana-pro.jpeg',
    villa: K + 'Photorealistic-exterior-v-6ae1684ef3b2fe48fff74f5c-nano-banana-pro.jpeg',
    penthouse: K + 'Photorealistic-exterior-v-6ae1684dd5b5ff1bb9c9e925-nano-banana-pro.jpeg',
    aerial: K + 'Photorealistic-aerial-dro-6ae1684dd5b5ff1bb9c9e924-nano-banana-pro.jpeg',
    kitchen: K + 'Photorealistic-interior-v-6ae1684da7f161b804227c3f-nano-banana-pro.jpeg',
    logo: 'images/logo.png'
  },

  // הסרטון הראשי של העבודות: מתנגן לבד כל הזמן.
  // כל סרטון בתיקייה media/works ששמו מכיל את המילים האלה יהיה הסרטון הראשי.
  featuredName: 'נדלן לעצמי',
  featured: 'https://media.kolbo.ai/kolboai-media/uploaded-videos/6a90b7820d92b30dd2560541/6ae168392f760bb97affd0b4/1793201194118-main_web.mp4', // נדלן לעצמי (מכווץ לאתר, 1080p)
  // שאר הסרטונים בתיקייה מופיעים מתחת לראשי, ונפתחים בלחיצה. אפשר להוסיף גם כאן ידנית:
  moreVideos: [
    { src: 'https://media.kolbo.ai/kolboai-media/uploaded-videos/6a90b7820d92b30dd2560541/6ae168392f760bb97affd0b4/1793201199911-y38_web.mp4', title: 'פרויקט נדל״ן Y38' },
    // { src: 'media/works/סרטון.mp4', title: 'שם' },
  ],

  // לפני ואחרי. אפשר להוסיף עוד זוגות.
  beforeAfter: [
    { before: K + 'Photorealistic-architectu-6ae1684e2f760bb97affd0c9-nano-banana-pro.jpeg',
      after:  K + 'Image-1-is-the-existing-s-6ae168a3a7f161b804227ca2-nano-banana-2-image.jpeg',
      title: 'פינוי בינוי, גבעתיים (קונספט)' },
    // { before: 'media/before1.jpg', after: 'media/after1.jpg', title: 'שם הפרויקט' },
  ],

  // גלריית העבודות.
  gallery: [], // הגלריה הוסתה: האתר מתמקד בפרסומות


  // רילס וסרטונים (למשל מהאינסטגרם). ריק = הקטע מוסתר.
  reels: [
    // { type: 'video', src: 'media/reel1.mp4', title: 'שם הפרויקט' },
  ]
};
