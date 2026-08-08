import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Gallery from "./components/Gallery";
import Licenses from "./components/Licenses";
import Contact from "./components/Contact";
import AdminPanel from "./components/AdminPanel";
import { PortfolioItem, LicenseItem, SiteSettings } from "./types";
import { Hammer, Sparkles, Phone, MessageSquare } from "lucide-react";

export default function App() {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  
  // App data state
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [licenses, setLicenses] = useState<LicenseItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    adminPin: "1222",
    whatsappNumber: "966568679494",
    phone: "+966568679494",
    email: "house.alatheer@gmail.com",
    aboutTextAr: "مؤسسة بيت الأثير للمقاولات العامة هي مؤسسة سعودية وطنية رائدة، تأسست في ديسمبر 2022م.",
    aboutTextEn: "House of Al-Atheer General Contracting is a leading Saudi national establishment, founded in Dec 2022.",
    visionTextAr: "أن نكون الشريك الأكثر موثوقية في قطاع التشييد والترميم بالمملكة.",
    visionTextEn: "To be the most trusted partner in the construction and renovation sector in Saudi Arabia."
  });
  const [loading, setLoading] = useState(true);

  // Synchronize document dir and language on language select
  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  // Read backend database on mount
  const fetchData = async () => {
    try {
      const response = await fetch("/api/data");
      const data = await response.json();
      if (response.ok) {
        setPortfolio(data.portfolio || []);
        setLicenses(data.licenses || []);
        if (data.settings) {
          setSettings((prev) => ({ ...prev, ...data.settings }));
        }
      }
    } catch (err) {
      console.error("Failed fetching database backend, using fallback data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Admin PIN checking
  const handleVerifyPin = async (pin: string) => {
    try {
      const response = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setIsAdmin(true);
        setAdminPin(pin);
        return true;
      }
    } catch (err) {
      console.error("PIN verification failed:", err);
    }
    return false;
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setAdminPin("");
    setIsAdminOpen(false);
  };

  // Actions connecting client view to our REST endpoints
  const handleSavePortfolio = async (item: PortfolioItem) => {
    try {
      const response = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: adminPin, item })
      });
      if (response.ok) {
        await fetchData();
        return true;
      }
    } catch (err) {
      console.error("Save portfolio failed:", err);
    }
    return false;
  };

  const handleDeletePortfolio = async (id: string) => {
    try {
      const response = await fetch(`/api/portfolio/${id}?pin=${adminPin}`, {
        method: "DELETE"
      });
      if (response.ok) {
        await fetchData();
        return true;
      }
    } catch (err) {
      console.error("Delete portfolio failed:", err);
    }
    return false;
  };

  const handleSaveLicense = async (license: LicenseItem) => {
    try {
      const response = await fetch("/api/licenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: adminPin, license })
      });
      if (response.ok) {
        await fetchData();
        return true;
      }
    } catch (err) {
      console.error("Save license failed:", err);
    }
    return false;
  };

  const handleDeleteLicense = async (id: string) => {
    try {
      const response = await fetch(`/api/licenses/${id}?pin=${adminPin}`, {
        method: "DELETE"
      });
      if (response.ok) {
        await fetchData();
        return true;
      }
    } catch (err) {
      console.error("Delete license failed:", err);
    }
    return false;
  };

  const handleSaveSettings = async (newSettings: SiteSettings) => {
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: adminPin, settings: newSettings })
      });
      if (response.ok) {
        setSettings(newSettings);
        await fetchData();
        return true;
      }
    } catch (err) {
      console.error("Save settings failed:", err);
    }
    return false;
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-800">
      
      {/* 1. Navbar Navigation Module */}
      <Navbar
        lang={lang}
        setLang={setLang}
        onAdminClick={() => setIsAdminOpen(true)}
        isAdmin={isAdmin}
        logoutAdmin={handleLogout}
      />

      {/* Main Body Grid */}
      <main className="flex-grow">
        
        {/* 2. Interactive Hero Carousel Segment */}
        <Hero lang={lang} />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white">
            <div className="w-10 h-10 border-4 border-wood-medium border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-xs sm:text-sm font-semibold text-slate-500">
              {lang === "ar" ? "جاري تحميل بيانات المؤسسة..." : "Loading corporate data..."}
            </p>
          </div>
        ) : (
          <>
            {/* 3. About Us & corporate Vision values */}
            <About
              lang={lang}
              aboutTextAr={settings.aboutTextAr}
              aboutTextEn={settings.aboutTextEn}
              visionTextAr={settings.visionTextAr}
              visionTextEn={settings.visionTextEn}
            />

            {/* 4. Concrete Services items */}
            <Services lang={lang} />

            {/* 5. Filterable Works Portfolio Grid with Lightbox */}
            <Gallery
              lang={lang}
              items={portfolio}
              isAdmin={isAdmin}
              onDeleteItem={handleDeletePortfolio}
              onEditItem={(item) => {
                setIsAdminOpen(true);
                // Simple delayed dispatch to open administrative modal directly into editing mode
                setTimeout(() => {
                  const editBtn = document.querySelector(`[title="Edit Item"]`);
                  if (editBtn) (editBtn as HTMLButtonElement).click();
                }, 100);
              }}
            />

            {/* 6. Dynamic official licenses and qualification seals display */}
            <Licenses
              lang={lang}
              licenses={licenses}
              isAdmin={isAdmin}
              onDeleteLicense={handleDeleteLicense}
              onEditLicense={(lic) => {
                setIsAdminOpen(true);
                setTimeout(() => {
                  const editBtn = document.querySelector(`[title="Edit Certificate"]`);
                  if (editBtn) (editBtn as HTMLButtonElement).click();
                }, 100);
              }}
            />

            {/* 7. Immediate Dial/Whatsapp action bars and quotation forms */}
            <Contact
              lang={lang}
              whatsappNumber={settings.whatsappNumber}
              phone={settings.phone}
              email={settings.email}
            />
          </>
        )}

      </main>

      {/* 8. Full-stack Filament-configured Administration Panel overlay */}
      {isAdminOpen && (
        <AdminPanel
          lang={lang}
          portfolio={portfolio}
          licenses={licenses}
          settings={settings}
          onSavePortfolio={handleSavePortfolio}
          onDeletePortfolio={handleDeletePortfolio}
          onSaveLicense={handleSaveLicense}
          onDeleteLicense={handleDeleteLicense}
          onSaveSettings={handleSaveSettings}
          onVerifyPin={handleVerifyPin}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {/* 9. Elegant Responsive Footer (No pure black "#000", custom royal slate layout) */}
      <footer className="bg-brand-blue-950 text-white py-12 border-t border-brand-blue-900" dir={lang === "ar" ? "rtl" : "ltr"}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Info sector */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-wood-pale/10 border border-wood-light/45 flex items-center justify-center text-wood-light">
                  <span className="font-extrabold text-md">أ</span>
                </div>
                <h3 className="font-extrabold text-sm sm:text-md text-white tracking-wide">
                  {lang === "ar" ? "مؤسسة بيت الأثير للمقاولات العامة" : "House of Al-Atheer General Contracting"}
                </h3>
              </div>
              
              <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed max-w-sm">
                {lang === "ar"
                  ? "متخصصون بأعمال العظم، الترميم والتحديث الكلي للفلل السكنية والتجارية، مقاولات الهناجر وتنسيق ممرات الانترلوك بالرياض."
                  : "Leading residential structural skeleton building, premium finish contracting, old villa renovations and steel warehouse fabrications in Riyadh."}
              </p>

              <p className="text-xs text-wood-light font-bold">
                {lang === "ar" ? "تأسست المؤسسة المعتمدة عام: ١٢/٢٠٢٢م" : "Certified Establishment founded: Dec 2022"}
              </p>
            </div>

            {/* Quick sections anchors */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="font-bold text-xs sm:text-sm text-wood-light tracking-widest uppercase">
                {lang === "ar" ? "روابط سريعة" : "Navigation Links"}
              </h4>
              <div className="flex flex-col gap-2.5">
                {[
                  { label: lang === "ar" ? "الصفحة الرئيسية" : "Home Page", id: "home" },
                  { label: lang === "ar" ? "من نحن ورؤيتنا" : "About & Vision", id: "about" },
                  { label: lang === "ar" ? "خدمات المقاولات" : "Contracting Services", id: "services" },
                  { label: lang === "ar" ? "معرض الصور المقسم" : "Separate Portfolio", id: "gallery" },
                  { label: lang === "ar" ? "مستندات التراخيص" : "Legal Licenses", id: "licenses" }
                ].map((lnk) => (
                  <button
                    key={lnk.id}
                    onClick={() => {
                      const el = document.getElementById(lnk.id);
                      if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
                    }}
                    className="text-right text-xs sm:text-sm text-slate-400 hover:text-wood-light font-medium cursor-pointer transition-colors w-fit block"
                  >
                    {lnk.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Legal / safety values indicators */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="font-bold text-xs sm:text-sm text-wood-light tracking-widest uppercase">
                {lang === "ar" ? "الموثوقية والأمان" : "Safety & Authorization"}
              </h4>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                {lang === "ar" 
                  ? "مؤسسة مسجلة بوزارة التجارة السعودية برقم سجل معتمد، عضو بالهيئة السعودية للمهندسين ومؤهلة لأعمال التشييد والترميم السكني والصيانة الشاملة للمرافق." 
                  : "Licensed under Saudi Ministry of Commerce registration, fully certified by Saudi Council of Engineers for structural contracting works."}
              </p>
              
              <div className="pt-2 flex flex-wrap gap-2.5">
                <span className="text-[10px] font-bold bg-brand-blue-900 border border-brand-blue-800 text-slate-300 px-2 py-1 rounded-md">
                  {lang === "ar" ? "سجل تجاري ساري" : "Active Commercial CR"}
                </span>
                <span className="text-[10px] font-bold bg-brand-blue-900 border border-brand-blue-800 text-slate-300 px-2 py-1 rounded-md">
                  {lang === "ar" ? "هيئة المهندسين" : "Saudi Engineers Member"}
                </span>
              </div>
            </div>

          </div>

          {/* Base bottom border credits */}
          <div className="border-t border-brand-blue-900 mt-10 pt-6 text-center text-xs text-slate-500 font-semibold flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>
              © {new Date().getFullYear()} {lang === "ar" ? "مؤسسة بيت الأثير للمقاولات العامة" : "House of Al-Atheer General Contracting"}. {lang === "ar" ? "جميع الحقوق محفوظة للكادر الوطني" : "All Rights Reserved."}
            </p>
            <p className="text-wood-light/65 text-[10px] uppercase font-mono">
              Designed For Supreme Civil Engineering
            </p>
          </div>
    <div className="border-t border-brand-blue-900 mt-10 pt-6 text-center text-xs text-slate-500 font-semibold flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>
              © {new Date().getFullYear()} {lang === "ar" ? "عمل المهندس عزالدين  " : "House of Al-Atheer General Contracting"}. {lang === "ar" ? "جميع الحقوق محفوظة ل EZZO" : "All Rights Reserved."}
            </p>
            <p className="text-wood-light/65 text-[10px] uppercase font-mono">
              Designed For Supreme Civil Engineering
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
