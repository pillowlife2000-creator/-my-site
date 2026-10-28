/* ─────────────────────────────────────────────────────────────
   כל התמונות והסרטונים של האתר מוגדרים כאן.
   איך מוסיפים קובץ:
   1. ב-GitHub נכנסים לתיקייה media ← Add file ← Upload files ← מעלים ← Commit.
   2. מוסיפים כאן שורה עם שם הקובץ, למשל: { type: 'image', src: 'media/project1.jpg', title: '...', sub: '...' }
   3. סרטון: { type: 'video', src: 'media/reel1.mp4', title: '...', sub: '...' }
   4. סרטון מיוטיוב או קישור חיצוני: { type: 'youtube', id: 'מזהה הסרטון', title: '...' }
   הסדר כאן הוא הסדר באתר. כדי להסיר פריט, מוחקים את השורה שלו.
   ───────────────────────────────────────────────────────────── */
window.SITE_MEDIA = {
  // אנימציית הגלילה בראש העמוד: מהרחוב, לאורך הבניין, ועד הסלון.
  scrollVideo: '', // ריק = בראש העמוד מוצגת תמונה קבועה במקום אנימציית הגלילה
  scrollPoster: '', // תמונת רקע לראש העמוד. ריק = פתיח לבן נקי

  // סרטון ההסבר.
  explainer: '', // ריק = קטע סרטון ההסבר מוסתר

  // הסרטון הראשי של העבודות: מתנגן לבד כל הזמן.
  // כל סרטון בתיקייה media/works ששמו מכיל את המילים האלה יהיה הסרטון הראשי.
  featuredName: 'נדלן לעצמי',
  featured: 'https://d2ol7oe51mr4n9.cloudfront.net/user_389DnEW8xcLcJLSukn6WPtOJEA9/ed028289-57bd-4531-8e0e-9cfa51ec6f91.mp4', // נדלן לעצמי (מכווץ לאתר, 1080p)
  // שאר הסרטונים בתיקייה מופיעים מתחת לראשי, ונפתחים בלחיצה. אפשר להוסיף גם כאן ידנית:
  moreVideos: [
    { src: 'https://d2ol7oe51mr4n9.cloudfront.net/user_389DnEW8xcLcJLSukn6WPtOJEA9/13ded80d-f575-46f3-8e6a-e0ce682ddd82.mp4', title: 'פרויקט נדל״ן Y38' },
    { src: 'https://d2ol7oe51mr4n9.cloudfront.net/user_389DnEW8xcLcJLSukn6WPtOJEA9/d1cb531f-4f93-478d-8997-7320ad1cd935.mp4', title: 'סרטון למשקיעים' },
    // { src: 'media/works/סרטון.mp4', title: 'שם' },
  ],

  // לפני ואחרי. אפשר להוסיף עוד זוגות.
  beforeAfter: [
    // { before: 'media/before1.jpg', after: 'media/after1.jpg', title: 'שם הפרויקט' },
  ],

  // גלריית העבודות.
  gallery: [
    // { type: 'image', src: 'media/project1.jpg', title: 'שם הפרויקט', sub: 'תיאור קצר', size: 'lg' },
  ],

  // רילס וסרטונים (למשל מהאינסטגרם). ריק = הקטע מוסתר.
  reels: [
    // { type: 'video', src: 'media/reel1.mp4', title: 'שם הפרויקט' },
  ]
};
