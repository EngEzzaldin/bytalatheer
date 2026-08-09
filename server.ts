import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Enable JSON parser with sufficient limit for base64 images if user uploads them
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const DB_FILE = path.join(process.cwd(), "db.json");

// Default initial database content
const defaultDb = {
  settings: {
    adminPin: "Ezzo", // Default secure PIN
    whatsappNumber: "966568679494",
    phone: "+966568679494",
    email: "house.alatheer@gmail.com",
    aboutTextAr: "مؤسسة بيت الأثير للمقاولات العامة هي مؤسسة سعودية وطنية رائدة، تأسست في ديسمبر 2022. نحن متخصصون في أعمال العظم والتشطيب المتكامل للفلل والعمائر السكنية، بالإضافة إلى صيانة وترميم المباني القديمة. نلتزم بأعلى معايير الجودة والسلامة والسرعة في التنفيذ لجميع عملائنا بفريق هندسي وفني متكامل ذو خبرة عريقة في مشاريع البناء والتشطيب.",
    aboutTextEn: "House of Al-Atheer General Contracting is a leading Saudi national establishment, founded in December 2022. We specialize in skeleton building and turnkey finishing for residential villas and buildings, as well as maintaining and renovating old properties. We are committed to the highest standards of quality, safety, and rapid execution using a highly experienced and certified team of engineers and technicians.",
    visionTextAr: "أن نكون الشريك الأكثر موثوقية في قطاع التشييد والترميم بالمملكة، ونضع لمسات هندسية فريدة تجمع بين أصالة التصميم ومتانة البناء وعملية التشطيب الحديثة، ملتزمين بمستهدفات رؤية المملكة 2030 في تطوير المسكن الملائم.",
    visionTextEn: "To be the most trusted partner in the construction and renovation sector in Saudi Arabia, creating unique architectural touches that combine design integrity, construction structural durability, and modern structural finishes, aligned with Saudi Vision 2030."
  },
  portfolio: [
    {
      id: "p1",
      titleAr: "بناء الهيكل الإنشائي (عظم) لفيلا مودرن",
      titleEn: "Modern Villa Structural Skeleton Building",
      descAr: "تنفيذ أعمال الحفر، التأسيس، حديد التسليح، وصب الخرسانة الجاهزة بإشراف هندسي متكامل لفيلا دورين بمدينة الرياض.",
      descEn: "Execution of excavation, foundations, steel reinforcement, and ready-mix concrete pouring for a two-story modern villa in Riyadh under complete engineering supervision.",
      category: "masonry",
      mediaUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80",
      mediaType: "image",
      workerNameAr: "م. أحمد الشمري",
      workerNameEn: "Eng. Ahmed Al-Shammari",
      projectDate: "2024-02-10"
    },
    {
      id: "p2",
      titleAr: "تأسيس وتشطيب سباكة ذكية للفلل",
      titleEn: "Smart Leak-Proof Villa Plumbing Setup",
      descAr: "تمديد شبكات تغذية المياه الحرارية بالأنابيب الخضراء الألمانية، وتأسيس شبكة الصرف بجودة عالية واختبار الضغط قبل الإغلاق.",
      descEn: "Plumbing installation with German green pipes for water networks and high-quality drainage pipeline setups with complete pressure testing before wall closing.",
      category: "plumbing",
      mediaUrl: "https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&w=800&q=80",
      mediaType: "image",
      workerNameAr: "الفني رشيد خان",
      workerNameEn: "Tech. Rasheed Khan",
      projectDate: "2024-03-15"
    },
    {
      id: "p3",
      titleAr: "أعمال التأسيسات الكهربائية والإضاءة المخفية",
      titleEn: "Electrical Cabling & Recessed Lighting Installation",
      descAr: "تمديد كابلات الرياض المعتمدة وأنابيب مرنة مقاومة للحريق، وتوزيع الأحمال على طبلونات أصلية بضمان شامل.",
      descEn: "Cabling using certified Riyadh Cables with fire-resistant conduits, load balancing over premium DB distribution boards with comprehensive warranties.",
      category: "electrical",
      mediaUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
      mediaType: "image",
      workerNameAr: "الفني وسيم إقبال",
      workerNameEn: "Tech. Waseem Iqbal",
      projectDate: "2024-04-01"
    },
    {
      id: "p4",
      titleAr: "ديكورات جبس بورد وتشطيب لوحات فنية دهانات",
      titleEn: "Luxury Plasterboard & Sophisticated Acrylic Painting",
      descAr: "تنفيذ ديكورات جبسية عصرية للأسقف المعلقة بالتوازي مع تأسيس ومعالجة الجدران بالمعجون الفاخر والدهانات النهائية من جوتن.",
      descEn: "Execution of modern ceiling gypsum board decorations matched with professional surface preparation, premium putty coatings, and Jotun final paints.",
      category: "finishing",
      mediaUrl: "https://images.unsplash.com/photo-1562663474-6cbb3fee4c77?auto=format&fit=crop&w=800&q=80",
      mediaType: "image",
      workerNameAr: "المعلم أبوعلي",
      workerNameEn: "Artisan Abu Ali",
      projectDate: "2024-05-18"
    },
    {
      id: "p5",
      titleAr: "أعمال الهناجر الحديدية والمستودعات المتكاملة",
      titleEn: "Heavy-Duty Steel Hangar & Warehouse Fabrication",
      descAr: "تصميم، تفصيل، تركيب الهناجر الحديدية والمظلات وجوانب الساندوتش بانل العازل المقاوم للحرارة والأمطار.",
      descEn: "Design, cutting, welding, and erection of steel hangars, canopies, and thermal/waterproof insulated sandwich panels.",
      category: "hangars",
      mediaUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
      mediaType: "image",
      workerNameAr: "م. محمد كمال",
      workerNameEn: "Eng. Mohamed Kamal",
      projectDate: "2024-01-20"
    },
    {
      id: "p6",
      titleAr: "تنسيق ممرات الانترلوك والبلدورات والحدائق",
      titleEn: "Interlock Design, Curbs & Landscape Design",
      descAr: "رص الأرضيات بدقة هندسية، تركيب انترلوك خرساني مقاوم للضغوط مع تنسيق الإضاءة والمسطحات الخضراء والأشجار بأسلوب راقٍ.",
      descEn: "Pavement compaction under engineering control, high-pressure concrete interlock tile installation, coupled with custom landscape greenery and trees.",
      category: "landscaping",
      mediaUrl: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=800&q=80",
      mediaType: "image",
      workerNameAr: "الفني محمود بكر",
      workerNameEn: "Designer Mahmoud Bakr",
      projectDate: "2024-05-30"
    },
    {
      id: "p7",
      titleAr: "ترميم وصيانة واجهة لفيلا قديمة متهالكة",
      titleEn: "Reconstruction & Facade Repair of an Old Villa",
      descAr: "معالجة التصدعات والشروخ، إزالة اللياسة القديمة التالفة، إعادة طلاء النانو سيليكون المقاوم للرطوبة وتحديث المظهر العام.",
      descEn: "Full treatment of cracks, repair of damaged plaster sections, application of moisture-resistant insulation nano-paints, and high-end exterior decoration facelift.",
      category: "maintenance",
      mediaUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      mediaType: "image",
      workerNameAr: "م. خالد الرشيد",
      workerNameEn: "Eng. Khalid Al-Rasheed",
      projectDate: "2024-06-05"
    }
  ],
  licenses: [
    {
      id: "l1",
      titleAr: "السجل التجاري المعتمد لمؤسسة بيت الأثير",
      titleEn: "Official Commercial Registration",
      imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80",
      issuedByAr: "وزارة التجارة والاستثمار السعودية",
      issuedByEn: "Saudi Ministry of Commerce and Investment",
      issueDate: "2022-12-15"
    },
    {
      id: "l2",
      titleAr: "شهادة تصنيف ومعارضة الهيئة السعودية للمهندسين",
      titleEn: "Saudi Council of Engineers Membership Certificate",
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
      issuedByAr: "الهيئة السعودية للمهندسين",
      issuedByEn: "Saudi Council of Engineers",
      issueDate: "2023-01-10"
    },
    {
      id: "l3",
      titleAr: "ترخيص الدفاع المدني السعودي للسلامة الهندسية",
      titleEn: "Saudi Civil Defense Safety Qualification Permit",
      imageUrl: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80",
      issuedByAr: "المديرية العامة للدفاع المدني",
      issuedByEn: "General Directorate of Civil Defense",
      issueDate: "2023-02-14"
    }
  ]
};

// Ensure database file exists or write placeholders
function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), "utf8");
      return defaultDb;
    }
    const data = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading db.json, returning default db:", err);
    return defaultDb;
  }
}

function writeDb(data: typeof defaultDb) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing db.json:", err);
  }
}

// REST API Endpoints

// 1. Fetch all layout data, portfolio and licenses
app.get("/api/data", (req, res) => {
  const db = readDb();
  // Strip out admin PIN so it doesn't get exposed to client directly
  const safeSettings = { ...db.settings };
  // @ts-ignore
  delete safeSettings.adminPin;
  res.json({
    settings: safeSettings,
    portfolio: db.portfolio,
    licenses: db.licenses
  });
});

// Helper check function
function verifyPin(pin: string) {
  const db = readDb();
  return pin === db.settings.adminPin;
}

// 2. Explicit API for PIN verification
app.post("/api/admin/verify", (req, res) => {
  const { pin } = req.body;
  if (verifyPin(pin)) {
    res.json({ success: true, message: "Valid Admin Session" });
  } else {
    res.status(401).json({ success: false, message: "رمز العبور غير دقيق / Incorrect PIN Password" });
  }
});

// 3. Update company settings
app.post("/api/settings", (req, res) => {
  const { pin, settings } = req.body;
  if (!verifyPin(pin)) {
    return res.status(401).json({ error: "Unauthorized access" });
  }
  const db = readDb();
  db.settings = {
    ...db.settings,
    ...settings,
    adminPin: settings.adminPin || db.settings.adminPin // retain PIN or let them update it
  };
  writeDb(db);
  res.json({ success: true, settings: db.settings });
});

// 4. Create or Update general Portfolio item
app.post("/api/portfolio", (req, res) => {
  const { pin, item } = req.body;
  if (!verifyPin(pin)) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  const db = readDb();
  if (item.id) {
    // update
    const idx = db.portfolio.findIndex((p: any) => p.id === item.id);
    if (idx !== -1) {
      db.portfolio[idx] = { ...db.portfolio[idx], ...item };
    } else {
      db.portfolio.push(item);
    }
  } else {
    // create new
    const newItem = {
      ...item,
      id: "p_" + Date.now().toString()
    };
    db.portfolio.push(newItem);
  }

  writeDb(db);
  res.json({ success: true, portfolio: db.portfolio });
});

// 5. Delete portfolio item
app.delete("/api/portfolio/:id", (req, res) => {
  const { pin } = req.query;
  if (!verifyPin(pin as string)) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  const db = readDb();
  const idToDelete = req.params.id;
  db.portfolio = db.portfolio.filter((p: any) => p.id !== idToDelete);
  writeDb(db);
  res.json({ success: true, portfolio: db.portfolio });
});

// 6. Create or Update official license
app.post("/api/licenses", (req, res) => {
  const { pin, license } = req.body;
  if (!verifyPin(pin)) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  const db = readDb();
  if (license.id) {
    const idx = db.licenses.findIndex((l: any) => l.id === license.id);
    if (idx !== -1) {
      db.licenses[idx] = { ...db.licenses[idx], ...license };
    } else {
      db.licenses.push(license);
    }
  } else {
    const newLicense = {
      ...license,
      id: "l_" + Date.now().toString()
    };
    db.licenses.push(newLicense);
  }

  writeDb(db);
  res.json({ success: true, licenses: db.licenses });
});

// 7. Delete official license
app.delete("/api/licenses/:id", (req, res) => {
  const { pin } = req.query;
  if (!verifyPin(pin as string)) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  const db = readDb();
  const idToDelete = req.params.id;
  db.licenses = db.licenses.filter((l: any) => l.id !== idToDelete);
  writeDb(db);
  res.json({ success: true, licenses: db.licenses });
});

// 8. Gemini-powered Marketing Description Auto-Generator inside the dashboard
app.post("/api/ai/generate-desc", async (req, res) => {
  const { pin, keywords, language, category } = req.body;
  if (!verifyPin(pin)) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
    return res.status(500).json({ error: "مفتاح API الخاص بـ Gemini غير مهيأ بالخادم. / Gemini API Key is not set." });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const isArabic = language === "ar";
    
    const prompt = isArabic 
      ? `أنت خبير تسويق لشركة مقاولات وإنشاءات سعودية اسمها "بيت الأثير للمقاولات العامة". اكتب لي وصف تفصيلي تسويقي جذاب واحترافي لعمل مقاولات تحت قسم "${category}" بناءً على الكلمات المفتاحية التالية: "${keywords}". يجب أن يكون الوصف بلهجة احترافية سعودية ملائمة للموقع، لا يتجاوز 3 غراس أو فقرتين قصيرتين.`
      : `You are an expert marketing writer for a prestigious Saudi general contracting company "House of Al-Atheer General Contracting". Write a premium, engaging, and professional portfolio description for a project in the category: "${category}", based on these keywords: "${keywords}". Keep it professional, concise (maximum 2 short paragraphs suitable for a website).`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const generatedText = response.text || "";
    res.json({ success: true, text: generatedText.trim() });
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    res.status(500).json({ error: "فشل إنشاء الوصف التسويقي عبر الذكاء الاصطناعي. / AI Generation Failed: " + error.message });
  }
});

// Vite & Static file handler integration
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server starting on port ${PORT}...`);
  });
}

start();
