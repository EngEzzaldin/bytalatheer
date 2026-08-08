import { useState, useEffect } from "react";
import { Menu, X, Languages, Lock, LogOut } from "lucide-react";

interface NavbarProps {
  lang: "ar" | "en";
  setLang: (l: "ar" | "en") => void;
  onAdminClick: () => void;
  isAdmin: boolean;
  logoutAdmin: () => void;
}

export default function Navbar({ lang, setLang, onAdminClick, isAdmin, logoutAdmin }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const t = {
    title: lang === "ar" ? "بيت الأثير" : "House of Al-Atheer",
    subtitle: lang === "ar" ? "للمقاولات العامة" : "General Contracting",
    home: lang === "ar" ? "الرئيسية" : "Home",
    about: lang === "ar" ? "من نحن" : "About Us",
    services: lang === "ar" ? "خدماتنا" : "Services",
    gallery: lang === "ar" ? "معرض الأعمال" : "Portfolio",
    licenses: lang === "ar" ? "الرخص والشهادات" : "Certificates",
    contact: lang === "ar" ? "اتصل بنا" : "Contact Us",
    admin: lang === "ar" ? "لوحة التحكم" : "Admin Panel",
    logout: lang === "ar" ? "خروج" : "Logout"
  };

  const navItems = [
    { label: t.home, id: "home" },
    { label: t.about, id: "about" },
    { label: t.services, id: "services" },
    { label: t.gallery, id: "gallery" },
    { label: t.licenses, id: "licenses" },
    { label: t.contact, id: "contact" }
  ];

  const scrollToSection = (id: string) => {
    setMobileOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth"
      });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${
        scrolled
          ? "bg-brand-blue-900/95 backdrop-blur-md shadow-lg border-b border-brand-blue-800/50 py-3"
          : "bg-gradient-to-b from-brand-blue-950/80 to-transparent py-5"
      }`}
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Brand area */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-wood-light to-wood-medium p-[2px] shadow-sm">
              <div className="w-full h-full bg-brand-blue-800 rounded-[10px] flex items-center justify-center">
                <span className="font-display font-extrabold text-xl text-wood-light">أ</span>
              </div>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight leading-none font-display">
                {t.title}
              </h1>
              <p className="text-xs text-wood-light mt-1 font-extrabold tracking-wide">
                {t.subtitle}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-slate-100 hover:text-wood-light text-sm font-extrabold transition-colors duration-200 cursor-pointer font-display"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Actions: Lang Selector & Admin Login */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-200 hover:text-white bg-brand-blue-800/40 hover:bg-brand-blue-800/70 border border-brand-blue-700/50 transition-smooth text-xs cursor-pointer"
            >
              <Languages className="w-4 h-4 text-wood-light" />
              <span>{lang === "ar" ? "English" : "العربية"}</span>
            </button>

            {isAdmin ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onAdminClick}
                  className="px-3 py-1.5 rounded-lg text-white bg-wood-medium hover:bg-wood-dark border border-wood-light/30 transition-smooth text-xs cursor-pointer"
                >
                  {t.admin}
                </button>
                <button
                  onClick={logoutAdmin}
                  title={t.logout}
                  className="p-1.5 rounded-lg text-rose-300 hover:text-white bg-rose-950/20 hover:bg-rose-900 border border-rose-800/40 transition-smooth cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onAdminClick}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white bg-brand-blue-800/30 hover:bg-brand-blue-700/50 border border-brand-blue-800 transition-smooth cursor-pointer"
                title={t.admin}
              >
                <Lock className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile Hamburguer Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="p-2 rounded-lg text-slate-200 bg-brand-blue-800/30 border border-brand-blue-800 cursor-pointer text-xs"
              title="Change Language"
            >
              <Languages className="w-4 h-4 text-wood-light" />
            </button>
            
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-1.5 rounded-lg text-slate-200 hover:text-white bg-brand-blue-800/50 cursor-pointer"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-brand-blue-900 border-b border-brand-blue-800 px-4 py-4 space-y-3 shadow-2xl animate-fade-in">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-right text-slate-200 hover:text-wood-light hover:bg-brand-blue-800/30 py-2.5 px-3 rounded-lg text-sm font-medium transition-all"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="border-t border-brand-blue-800 pt-3 flex items-center justify-between">
            {isAdmin ? (
              <div className="flex items-center gap-2 w-full justify-between">
                <button
                  onClick={() => { setMobileOpen(false); onAdminClick(); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-wood-medium hover:bg-wood-dark border border-wood-light/30 transition-smooth text-xs flex-grow justify-center cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{t.admin}</span>
                </button>
                <button
                  onClick={() => { setMobileOpen(false); logoutAdmin(); }}
                  className="p-2 rounded-lg text-rose-300 bg-rose-950/20 border border-rose-800/40 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setMobileOpen(false); onAdminClick(); }}
                className="flex items-center gap-2 w-full justify-center px-4 py-2 rounded-lg text-slate-300 hover:text-white bg-brand-blue-800/60 border border-brand-blue-700 transition-smooth text-xs cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-wood-light" />
                <span>{t.admin}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
