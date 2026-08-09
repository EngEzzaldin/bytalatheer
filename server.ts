import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Enable JSON parser with sufficient limit for base64 images if user uploads them
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const DB_FILE = path.join(process.cwd(), "db.json");

// Optional Supabase persistence (used on serverless platforms like Vercel)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// Load seed/default database from the committed db.json file if present
let defaultDbCache: any = null;
function getDefaultDb() {
  if (defaultDbCache) return defaultDbCache;
  try {
    if (fs.existsSync(DB_FILE)) {
      defaultDbCache = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
      return defaultDbCache;
    }
  } catch (err) {
    console.error("Error reading db.json seed:", err);
  }
  defaultDbCache = {
    settings: {
      adminPin: "Ezzo",
      whatsappNumber: "966568679494",
      phone: "+966568679494",
      email: "house.alatheer@gmail.com"
    },
    portfolio: [],
    licenses: []
  };
  return defaultDbCache;
}

async function readDb() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("app_data")
        .select("data")
        .eq("id", "main")
        .single();
      if (error) {
        if (error.code === "PGRST116") {
          // No row yet - seed it with the current db.json content
          const seed = getDefaultDb();
          const { error: seedErr } = await supabase
            .from("app_data")
            .upsert({ id: "main", data: seed });
          if (seedErr) console.error("Supabase seed error:", seedErr.message);
          return seed;
        }
        console.error("Supabase read error:", error.message);
        return getDefaultDb();
      }
      return data.data;
    } catch (err: any) {
      console.error("Supabase read exception:", err.message);
      return getDefaultDb();
    }
  }

  // Local file fallback (development / self-hosted)
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(getDefaultDb(), null, 2), "utf8");
      return getDefaultDb();
    }
    const raw = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading db.json, returning default db:", err);
    return getDefaultDb();
  }
}

async function writeDb(data: any) {
  if (supabase) {
    try {
      const { error } = await supabase.from("app_data").upsert({ id: "main", data });
      if (error) console.error("Supabase write error:", error.message);
    } catch (err: any) {
      console.error("Supabase write exception:", err.message);
    }
    return;
  }
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing db.json:", err);
  }
}

async function verifyPin(pin: string) {
  const db = await readDb();
  return pin === db.settings.adminPin;
}

// REST API Endpoints

// 1. Fetch all layout data, portfolio and licenses
app.get("/api/data", async (req, res) => {
  const db = await readDb();
  // Strip out admin PIN so it doesn't get exposed to client directly
  const safeSettings = { ...db.settings };
  delete safeSettings.adminPin;
  res.json({
    settings: safeSettings,
    portfolio: db.portfolio,
    licenses: db.licenses
  });
});

// 2. Explicit API for PIN verification
app.post("/api/admin/verify", async (req, res) => {
  const { pin } = req.body;
  if (await verifyPin(pin)) {
    res.json({ success: true, message: "Valid Admin Session" });
  } else {
    res.status(401).json({ success: false, message: "رمز العبور غير دقيق / Incorrect PIN Password" });
  }
});

// 3. Update company settings
app.post("/api/settings", async (req, res) => {
  const { pin, settings } = req.body;
  if (!(await verifyPin(pin))) {
    return res.status(401).json({ error: "Unauthorized access" });
  }
  const db = await readDb();
  db.settings = {
    ...db.settings,
    ...settings,
    adminPin: settings.adminPin || db.settings.adminPin // retain PIN or let them update it
  };
  await writeDb(db);
  res.json({ success: true, settings: db.settings });
});

// 4. Create or Update general Portfolio item
app.post("/api/portfolio", async (req, res) => {
  const { pin, item } = req.body;
  if (!(await verifyPin(pin))) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  const db = await readDb();
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
    db.portfolio.push({ ...item, id: "p_" + Date.now().toString() });
  }

  await writeDb(db);
  res.json({ success: true, portfolio: db.portfolio });
});

// 5. Delete portfolio item
app.delete("/api/portfolio/:id", async (req, res) => {
  const { pin } = req.query;
  if (!(await verifyPin(pin as string))) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  const db = await readDb();
  const idToDelete = req.params.id;
  db.portfolio = db.portfolio.filter((p: any) => p.id !== idToDelete);
  await writeDb(db);
  res.json({ success: true, portfolio: db.portfolio });
});

// 6. Create or Update official license
app.post("/api/licenses", async (req, res) => {
  const { pin, license } = req.body;
  if (!(await verifyPin(pin))) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  const db = await readDb();
  if (license.id) {
    const idx = db.licenses.findIndex((l: any) => l.id === license.id);
    if (idx !== -1) {
      db.licenses[idx] = { ...db.licenses[idx], ...license };
    } else {
      db.licenses.push(license);
    }
  } else {
    db.licenses.push({ ...license, id: "l_" + Date.now().toString() });
  }

  await writeDb(db);
  res.json({ success: true, licenses: db.licenses });
});

// 7. Delete official license
app.delete("/api/licenses/:id", async (req, res) => {
  const { pin } = req.query;
  if (!(await verifyPin(pin as string))) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  const db = await readDb();
  const idToDelete = req.params.id;
  db.licenses = db.licenses.filter((l: any) => l.id !== idToDelete);
  await writeDb(db);
  res.json({ success: true, licenses: db.licenses });
});

// 8. Gemini-powered Marketing Description Auto-Generator inside the dashboard
app.post("/api/ai/generate-desc", async (req, res) => {
  const { pin, keywords, language, category } = req.body;
  if (!(await verifyPin(pin))) {
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

// Standalone entrypoint (local dev / self-hosted)
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

// On Vercel, server.ts is imported by api/index.ts and must not listen by itself
if (process.env.VERCEL !== "1") {
  start();
}

export { app };
