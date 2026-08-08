import { useState } from "react";
import {
  Lock,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Image,
  Video,
  Sparkles,
  Save,
  LogOut,
  X,
  FileText,
  Briefcase,
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { PortfolioItem, LicenseItem, SiteSettings } from "../types";

interface AdminPanelProps {
  lang: "ar" | "en";
  portfolio: PortfolioItem[];
  licenses: LicenseItem[];
  settings: SiteSettings;
  onSavePortfolio: (item: any) => Promise<boolean>;
  onDeletePortfolio: (id: string) => Promise<boolean>;
  onSaveLicense: (license: any) => Promise<boolean>;
  onDeleteLicense: (id: string) => Promise<boolean>;
  onSaveSettings: (newSettings: any) => Promise<boolean>;
  onVerifyPin: (pin: string) => Promise<boolean>;
  onClose: () => void;
}

export default function AdminPanel({
  lang,
  portfolio,
  licenses,
  settings,
  onSavePortfolio,
  onDeletePortfolio,
  onSaveLicense,
  onDeleteLicense,
  onSaveSettings,
  onVerifyPin,
  onClose
}: AdminPanelProps) {
  const isAr = lang === "ar";
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"works" | "licenses" | "settings">("works");
  
  // States for forms
  const [editingItem, setEditingItem] = useState<Partial<PortfolioItem> | null>(null);
  const [editingLicense, setEditingLicense] = useState<Partial<LicenseItem> | null>(null);
  
  // Settings form local state
  const [settingsForm, setSettingsForm] = useState<SiteSettings>({ ...settings });

  // Gemini AI descriptions helper state
  const [aiKeywords, setAiKeywords] = useState("");
  const [aiLang, setAiLang] = useState<"ar" | "en">("ar");
  const [aiCategory, setAiCategory] = useState("masonry");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState("");

  const t = {
    panelTitle: isAr ? "لوحة إدارة بيت الأثير (Filament v3 Style)" : "House of Al-Atheer Admin Dashboard",
    loginSubmit: isAr ? "دخول آمن" : "Secure Login",
    enterPin: isAr ? "أدخل الرمز السري للمالك لتأكيد الهوية" : "Enter Owner PIN Passcode to Authorize",
    pinError: isAr ? "الرمز السري غير صحيح." : "Incorrect PIN passcode.",
    tabWorks: isAr ? "إدارة الأعمال" : "Manage Works",
    tabLicenses: isAr ? "إدارة الرخص والشهادات" : "Manage Licenses",
    tabSettings: isAr ? "بيانات وإعدادات الموقع" : "Company & Site Settings",
    saveSuccess: isAr ? "تم الحفظ بنجاح." : "Saved successfully.",
    saveError: isAr ? "فشل الحفظ." : "Failed to save.",
    deleteSuccess: isAr ? "تم الحذف بنجاح." : "Deleted successfully.",
    aiHelperTitle: isAr ? "مساعد الوصف الذكي (Gemini Copilot)" : "AI Smart Description (Gemini Copilot)",
    aiKeywordsLabel: isAr ? "الكلمات المفتاحية للمشروع" : "Project Keywords",
    aiKeywordsPlaceholder: isAr ? "مثال: تأسيس سباكة ألماني فيلا الرياض مع اختبار كبس" : "e.g. core wiring Riyadh villa secondary board Jotun",
    aiGenerateBtn: isAr ? "إنشاء وصف احترافي بالذكاء الاصطناعي" : "Generate Professional Description",
    applyAiAr: isAr ? "تطبيق في حقل الوصف العربي" : "Apply to Arabic Desc Field",
    applyAiEn: isAr ? "تطبيق في حقل الوصف الإنجليزي" : "Apply to English Desc Field",
    logoutBtn: isAr ? "تسجيل خروج" : "Logout",
    formCategory: isAr ? "القسم الرئيسي" : "Category / Department",
    formTitleAr: isAr ? "العنوان بالعربية" : "Arabic Title",
    formTitleEn: isAr ? "العنوان بالإنجليزية" : "English Title",
    formDescAr: isAr ? "الوصف والتفاصيل بالعربية" : "Arabic Details",
    formDescEn: isAr ? "الوصف والتفاصيل بالإنجليزية" : "English Details",
    formWorkerAr: isAr ? "اسم الفني المسؤول (بالعربية)" : "Responsible Craftsman Name (Arabic)",
    formWorkerEn: isAr ? "اسم الفني (بالإنجليزية)" : "Craftsman Name (English)",
    formDate: isAr ? "تاريخ التنفيذ" : "Execution Date",
    formMediaUrl: isAr ? "رابط الصورة أو الفديو (أو ضع رابط Unsplash تلقائي)" : "Media URL (Image or Video)",
    formMediaType: isAr ? "نوع الملف" : "Media Type",
    addNewWork: isAr ? "إضافة عمل فني جديد" : "Add New Portfolio Work",
    addNewLicense: isAr ? "إضافة رخصة/شهادة جديدة" : "Add Official License/Certificate",
    formLicenseTitleAr: isAr ? "اسم الشهادة بالعربية" : "Certificate Title (Arabic)",
    formLicenseTitleEn: isAr ? "اسم الشهادة بالإنجليزية" : "Certificate Title (English)",
    formLicenseIssuerAr: isAr ? "الجهة المصدرة بالعربية" : "Issuer Authority (Arabic)",
    formLicenseIssuerEn: isAr ? "الجهة المصدرة بالإنجليزية" : "Issuer Authority (English)"
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    const ok = await onVerifyPin(pinInput);
    if (ok) {
      setIsAuthenticated(true);
      setSettingsForm({ ...settings });
    } else {
      setErrorMessage(t.pinError);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPinInput("");
  };

  // Portfolio items actions ( Filament style Form trigger )
  const triggerEditItem = (item: PortfolioItem) => {
    setEditingItem(item);
  };

  const triggerAddNewItem = () => {
    setEditingItem({
      category: "masonry",
      mediaType: "image",
      titleAr: "",
      titleEn: "",
      descAr: "",
      descEn: "",
      workerNameAr: "",
      workerNameEn: "",
      mediaUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80",
      projectDate: new Date().toISOString().split("T")[0]
    });
  };

  const savePortfolioItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    const ok = await onSavePortfolio(editingItem);
    if (ok) {
      setEditingItem(null);
      alert(t.saveSuccess);
    } else {
      alert(t.saveError);
    }
  };

  // License actions
  const triggerEditLicense = (lic: LicenseItem) => {
    setEditingLicense(lic);
  };

  const triggerAddNewLicense = () => {
    setEditingLicense({
      titleAr: "",
      titleEn: "",
      imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=600&q=80",
      issuedByAr: "",
      issuedByEn: "",
      issueDate: new Date().toISOString().split("T")[0]
    });
  };

  const saveLicenseItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLicense) return;
    const ok = await onSaveLicense(editingLicense);
    if (ok) {
      setEditingLicense(null);
      alert(t.saveSuccess);
    } else {
      alert(t.saveError);
    }
  };

  // Settings Actions
  const saveSiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await onSaveSettings(settingsForm);
    if (ok) {
      alert(t.saveSuccess);
    } else {
      alert(t.saveError);
    }
  };

  // Gemini API Marketing Descriptor trigger
  const generateAIDescription = async () => {
    if (!aiKeywords.trim()) return;
    setIsGenerating(true);
    setAiResult("");
    try {
      const response = await fetch("/api/ai/generate-desc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pin: pinInput,
          keywords: aiKeywords,
          language: aiLang,
          category: aiCategory
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setAiResult(data.text);
      } else {
        alert(data.error || "خطأ غير معروف في المنصة.");
      }
    } catch (err: any) {
      alert("Failed calling Gemini API: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const applyAiToDesc = (target: "ar" | "en") => {
    if (!aiResult || !editingItem) return;
    if (target === "ar") {
      setEditingItem((prev) => ({ ...prev, descAr: aiResult }));
    } else {
      setEditingItem((prev) => ({ ...prev, descEn: aiResult }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-blue-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
      <div className="relative w-full max-w-5xl bg-white border border-brand-blue-100 rounded-3xl overflow-hidden shadow-2xl min-h-[60vh] max-h-[90vh] flex flex-col justify-between">
        
        {/* Header Block ( Filament Charcoal style ) */}
        <div className="bg-brand-blue-900 border-b border-brand-blue-800 p-5 sm:p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-wood-pale/10 border border-wood-light/30 flex items-center justify-center text-wood-light">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-md sm:text-lg font-bold tracking-tight">{t.panelTitle}</h1>
              {isAuthenticated && (
                <p className="text-xs text-slate-300 font-semibold mt-1">
                  {isAr ? "جلسة مالك مصدقة ومحمية بالتشفير" : "Verified encrypted owner session"}
                </p>
              )}
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-brand-blue-850 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth check before viewable dashboard details */}
        {!isAuthenticated ? (
          <div className="flex-grow flex items-center justify-center py-20 px-6 bg-[#fcfbfa]">
            <form onSubmit={handleLogin} className="w-full max-w-sm bg-white p-8 rounded-2xl border border-brand-blue-100 shadow-lg text-center space-y-6">
              <div className="w-14 h-14 rounded-full bg-wood-pale border border-wood-light/40 flex items-center justify-center mx-auto text-wood-medium">
                <Lock className="w-6 h-6 animate-pulse" />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-extrabold text-brand-blue-900 text-lg">{isAr ? "التحقق من المالك" : "Owner Verification"}</h3>
                <p className="text-xs text-slate-400 font-semibold">{t.enterPin}</p>
                <p className="text-xs text-wood-light font-bold">({isAr ? "الرمز الافتراضي: 1222" : "Default PIN: 1222"})</p>
              </div>

              <input
                type="password"
                required
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••"
                className="w-full text-center tracking-[1rem] font-bold text-lg px-4 py-3 rounded-xl border border-brand-blue-100 focus:outline-none focus:border-brand-blue-600 bg-slate-50 text-brand-blue-950"
              />

              {errorMessage && (
                <p className="text-xs font-bold text-rose-500 bg-rose-50 p-2.5 rounded-lg flex items-center gap-1.5 justify-center">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errorMessage}</span>
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-brand-blue-600 hover:bg-brand-blue-700 font-bold text-white rounded-xl transition-all shadow-md cursor-pointer text-sm"
              >
                {t.loginSubmit}
              </button>
            </form>
          </div>
        ) : (
          /* Real Filament-Style Admin Space */
          <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar menu categories (Filament style) */}
            <div className="w-full md:w-64 bg-slate-50 border-b md:border-b-0 md:border-l border-brand-blue-100 flex flex-col justify-between">
              <div className="p-4 space-y-1">
                
                <button
                  onClick={() => { setActiveTab("works"); setEditingItem(null); setEditingLicense(null); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-right text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTab === "works"
                      ? "bg-brand-blue-900 border border-wood-light/40 text-wood-light shadow-md"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Briefcase className="w-4 h-4 flex-shrink-0" />
                  <span>{t.tabWorks}</span>
                </button>

                <button
                  onClick={() => { setActiveTab("licenses"); setEditingItem(null); setEditingLicense(null); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-right text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTab === "licenses"
                      ? "bg-brand-blue-900 border border-wood-light/40 text-wood-light shadow-md"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <FileText className="w-4 h-4 flex-shrink-0" />
                  <span>{t.tabLicenses}</span>
                </button>

                <button
                  onClick={() => { setActiveTab("settings"); setEditingItem(null); setEditingLicense(null); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-right text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTab === "settings"
                      ? "bg-brand-blue-900 border border-wood-light/40 text-wood-light shadow-md"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Settings className="w-4 h-4 flex-shrink-0" />
                  <span>{t.tabSettings}</span>
                </button>

              </div>

              {/* Logout mechanism down sidebar */}
              <div className="p-4 border-t border-brand-blue-100/60 flex items-center justify-between">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-xs font-bold text-rose-600 hover:text-white hover:bg-rose-600 px-3 py-2 rounded-lg transition-all cursor-pointer w-full justify-center"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t.logoutBtn}</span>
                </button>
              </div>

            </div>

            {/* Editing / Listing workspace */}
            <div className="flex-grow p-6 sm:p-8 overflow-y-auto">
              
              {/* TAB 1: PORTFOLIO WORKS WORKS SPACE */}
              {activeTab === "works" && (
                <div className="space-y-6">
                  
                  {/* Inline list area */}
                  {!editingItem ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-[#fcfbfa] p-4 rounded-xl border border-brand-blue-100">
                        <h2 className="font-extrabold text-brand-blue-900 text-sm sm:text-lg">{t.tabWorks}</h2>
                        <button
                          onClick={triggerAddNewItem}
                          className="flex items-center gap-2 px-3 py-1.5 bg-wood-medium hover:bg-wood-dark border border-wood-light/35 rounded-lg text-white font-bold text-xs cursor-pointer shadow-md"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{t.addNewWork}</span>
                        </button>
                      </div>

                      <div className="overflow-x-auto rounded-xl border border-brand-blue-100/80">
                        <table className="w-full text-right border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-brand-blue-100 text-xs font-extrabold text-slate-500">
                              <th className="p-4 capitalize">{isAr ? "العمل" : "Work"}</th>
                              <th className="p-4 capitalize">{isAr ? "التصنيف" : "Category"}</th>
                              <th className="p-4 capitalize">{isAr ? "الفني" : "Worker"}</th>
                              <th className="p-4 capitalize">{isAr ? "تاريخ العمل" : "Date"}</th>
                              <th className="p-4 text-center capitalize">{isAr ? "إجراءات" : "Actions"}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {portfolio.map((item) => (
                              <tr key={item.id} className="border-b border-brand-blue-100/40 text-xs font-semibold hover:bg-slate-50">
                                <td className="p-4 font-bold text-brand-blue-900">{isAr ? item.titleAr : item.titleEn}</td>
                                <td className="p-4 text-slate-500">{item.category}</td>
                                <td className="p-4">{isAr ? item.workerNameAr || "لا يوجد" : item.workerNameEn || "None"}</td>
                                <td className="p-3.5">{item.projectDate || "..."}</td>
                                <td className="p-4 text-center">
                                  <div className="flex gap-2 justify-center">
                                    <button
                                      onClick={() => triggerEditItem(item)}
                                      className="p-1 px-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white cursor-pointer"
                                    >
                                      {isAr ? "تعديل" : "Edit"}
                                    </button>
                                    <button
                                      onClick={async () => {
                                        if (confirm(isAr ? "حذف هذا العمل نهائياً؟" : "Confirm delete?")) {
                                          const ok = await onDeletePortfolio(item.id);
                                          if (ok) alert(t.deleteSuccess);
                                        }
                                      }}
                                      className="p-1 px-2 rounded bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
                                    >
                                      {isAr ? "حذف" : "Delete"}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    /* Filament style Form context for creating-editing */
                    <form onSubmit={savePortfolioItem} className="space-y-6">
                      <div className="flex justify-between items-center border-b border-brand-blue-100 pb-3">
                        <h2 className="font-extrabold text-brand-blue-900">
                          {editingItem.id ? (isAr ? `تعديل: ${editingItem.titleAr}` : `Edit: ${editingItem.titleEn}`) : t.addNewWork}
                        </h2>
                        <button
                          type="button"
                          onClick={() => setEditingItem(null)}
                          className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                        >
                          {isAr ? "تراجع" : "Back"}
                        </button>
                      </div>

                      {/* Filament Form Segment */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        <div>
                          <label className="block text-xs font-extrabold text-slate-500 mb-1.5">{t.formTitleAr} *</label>
                          <input
                            type="text"
                            required
                            value={editingItem.titleAr}
                            onChange={(e) => setEditingItem({ ...editingItem, titleAr: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-brand-blue-100 bg-slate-50 text-sm focus:border-brand-blue-600 focus:outline-none font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-slate-500 mb-1.5">{t.formTitleEn} *</label>
                          <input
                            type="text"
                            required
                            value={editingItem.titleEn}
                            onChange={(e) => setEditingItem({ ...editingItem, titleEn: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-brand-blue-100 bg-slate-50 text-sm focus:border-brand-blue-600 focus:outline-none font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-slate-500 mb-1.5">{t.formCategory}</label>
                          <select
                            value={editingItem.category}
                            onChange={(e: any) => setEditingItem({ ...editingItem, category: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-brand-blue-100 bg-slate-50 text-xs sm:text-sm focus:border-brand-blue-600 focus:outline-none"
                          >
                            <option value="masonry">{isAr ? "العظم والخرسانة" : "Masonry"}</option>
                            <option value="plumbing">{isAr ? "السباكة وعمل الصرف" : "Plumbing"}</option>
                            <option value="electrical">{isAr ? "الكهرباء والإنارة" : "Electricals"}</option>
                            <option value="finishing">{isAr ? "الدهانات والجبس بورد" : "Finishes"}</option>
                            <option value="landscaping">{isAr ? "الانترلوك وتنسيق الحدائق" : "Landscaping"}</option>
                            <option value="hangars">{isAr ? "أعمال الهناجر الحديدية" : "Hangars"}</option>
                            <option value="maintenance">{isAr ? "الصيانة والترميم" : "Maintenance"}</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-slate-500 mb-1.5">{t.formMediaUrl}</label>
                          <input
                            type="text"
                            required
                            value={editingItem.mediaUrl}
                            onChange={(e) => setEditingItem({ ...editingItem, mediaUrl: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-brand-blue-100 bg-slate-50 text-xs focus:border-brand-blue-600 focus:outline-none font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-slate-500 mb-1.5">{t.formMediaType}</label>
                          <div className="flex gap-4 p-1">
                            <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer font-bold">
                              <input
                                type="radio"
                                name="mediaType"
                                checked={editingItem.mediaType === "image"}
                                onChange={() => setEditingItem({ ...editingItem, mediaType: "image" })}
                              />
                              <Image className="w-3.5 h-3.5" />
                              <span>{isAr ? "صورة" : "Image Preview"}</span>
                            </label>

                            <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer font-bold">
                              <input
                                type="radio"
                                name="mediaType"
                                checked={editingItem.mediaType === "video"}
                                onChange={() => setEditingItem({ ...editingItem, mediaType: "video" })}
                              />
                              <Video className="w-3.5 h-3.5" />
                              <span>{isAr ? "فيديو" : "MP4 Video"}</span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-slate-500 mb-1.5">{t.formDate}</label>
                          <input
                            type="date"
                            value={editingItem.projectDate}
                            onChange={(e) => setEditingItem({ ...editingItem, projectDate: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-brand-blue-100 bg-slate-50 text-sm focus:border-brand-blue-600 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-slate-500 mb-1.5">{t.formWorkerAr}</label>
                          <input
                            type="text"
                            value={editingItem.workerNameAr || ""}
                            onChange={(e) => setEditingItem({ ...editingItem, workerNameAr: e.target.value })}
                            placeholder="مثال: المعلم رشيد"
                            className="w-full px-4 py-2.5 rounded-xl border border-brand-blue-100 bg-slate-50 text-sm focus:border-brand-blue-600 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-slate-500 mb-1.5">{t.formWorkerEn}</label>
                          <input
                            type="text"
                            value={editingItem.workerNameEn || ""}
                            onChange={(e) => setEditingItem({ ...editingItem, workerNameEn: e.target.value })}
                            placeholder="e.g. Master Rasheed"
                            className="w-full px-4 py-2.5 rounded-xl border border-brand-blue-100 bg-slate-50 text-sm focus:border-brand-blue-600 focus:outline-none"
                          />
                        </div>

                      </div>

                      {/* Raw descriptions fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-extrabold text-slate-500 mb-1.5">{t.formDescAr} *</label>
                          <textarea
                            rows={3}
                            required
                            value={editingItem.descAr}
                            onChange={(e) => setEditingItem({ ...editingItem, descAr: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-brand-blue-100 bg-slate-50 text-sm focus:border-brand-blue-600 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-slate-500 mb-1.5">{t.formDescEn} *</label>
                          <textarea
                            rows={3}
                            required
                            value={editingItem.descEn}
                            onChange={(e) => setEditingItem({ ...editingItem, descEn: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-brand-blue-100 bg-slate-50 text-sm focus:border-brand-blue-600 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* --- GEMINI COPILOT IN ACTION SECTION --- */}
                      <div className="bg-brand-blue-50/50 rounded-2xl p-5 border border-brand-blue-200/50 space-y-4">
                        <div className="flex items-center gap-2 text-brand-blue-900 border-b border-brand-blue-200/50 pb-2">
                          <Sparkles className="w-4 h-4 text-wood-medium animate-bounce" />
                          <h4 className="font-extrabold text-xs sm:text-sm">{t.aiHelperTitle}</h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                          <div className="col-span-1">
                            <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "لغة الوصف المستهدفة" : "Generation Language"}</label>
                            <select
                              value={aiLang}
                              onChange={(e: any) => setAiLang(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-brand-blue-100 bg-white text-xs focus:outline-none"
                            >
                              <option value="ar">العربية (Arabic)</option>
                              <option value="en">الإنجليزية (English)</option>
                            </select>
                          </div>

                          <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-500 mb-1">{t.aiKeywordsLabel}</label>
                            <input
                              type="text"
                              value={aiKeywords}
                              onChange={(e) => setAiKeywords(e.target.value)}
                              placeholder={t.aiKeywordsPlaceholder}
                              className="w-full px-3 py-2 rounded-xl border border-brand-blue-100 bg-white text-xs focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Trigger AI writer */}
                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            disabled={isGenerating || !aiKeywords.trim()}
                            onClick={generateAIDescription}
                            className="px-4 py-2 rounded-xl bg-brand-blue-900 hover:bg-brand-blue-850 text-wood-light border border-wood-light/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{isGenerating ? (isAr ? "جاري الإنشاء..." : "Generating...") : t.aiGenerateBtn}</span>
                          </button>
                        </div>

                        {/* Resulting text */}
                        {aiResult && (
                          <div className="bg-white p-4 rounded-xl border border-brand-blue-100 space-y-3.5">
                            <p className="text-xs font-medium text-slate-700 leading-relaxed max-h-[100px] overflow-y-auto">{aiResult}</p>
                            
                            <div className="flex flex-wrap gap-2 justify-end border-t border-slate-100 pt-2.5">
                              <button
                                type="button"
                                onClick={() => applyAiToDesc("ar")}
                                className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold cursor-pointer border border-emerald-200"
                              >
                                {t.applyAiAr}
                              </button>
                              <button
                                type="button"
                                onClick={() => applyAiToDesc("en")}
                                className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold cursor-pointer border border-indigo-200"
                              >
                                {t.applyAiEn}
                              </button>
                            </div>
                          </div>
                        )}

                      </div>

                      {/* Form submission button */}
                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-extrabold shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm"
                      >
                        <Save className="w-4 h-4 text-brand-blue-100" />
                        <span>{isAr ? "حفظ التغييرات بالعمل المعروض" : "Save Portfolio Changes"}</span>
                      </button>

                    </form>
                  )}

                </div>
              )}

              {/* TAB 2: CERTIFICATES & LICENSES WORKSPACE */}
              {activeTab === "licenses" && (
                <div className="space-y-6">
                  {!editingLicense ? (
                    <div className="space-y-4">
                      
                      <div className="flex justify-between items-center bg-[#fcfbfa] p-4 rounded-xl border border-brand-blue-100">
                        <h2 className="font-extrabold text-brand-blue-900 text-sm sm:text-lg">{t.tabLicenses}</h2>
                        <button
                          onClick={triggerAddNewLicense}
                          className="flex items-center gap-2 px-3 py-1.5 bg-wood-medium hover:bg-wood-dark border border-wood-light/35 rounded-lg text-white font-bold text-xs cursor-pointer shadow-md"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{t.addNewLicense}</span>
                        </button>
                      </div>

                      <div className="overflow-x-auto rounded-xl border border-brand-blue-100">
                        <table className="w-full text-right border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-brand-blue-100 text-xs font-extrabold text-slate-500">
                              <th className="p-4 capitalize">{isAr ? "الترخيص / الشهادة" : "License / Certificate"}</th>
                              <th className="p-4 capitalize">{isAr ? "الجهة المصدرة" : "Issuer"}</th>
                              <th className="p-4 capitalize">{isAr ? "التاريخ" : "Date"}</th>
                              <th className="p-4 text-center capitalize">{isAr ? "إجراءات" : "Actions"}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {licenses.map((lic) => (
                              <tr key={lic.id} className="border-b border-brand-blue-100/40 text-xs font-semibold hover:bg-slate-50">
                                <td className="p-4 font-bold text-brand-blue-900">{isAr ? lic.titleAr : lic.titleEn}</td>
                                <td className="p-4">{isAr ? lic.issuedByAr || "..." : lic.issuedByEn || "..."}</td>
                                <td className="p-4">{lic.issueDate || "..."}</td>
                                <td className="p-4 text-center">
                                  <div className="flex gap-2 justify-center">
                                    <button
                                      onClick={() => triggerEditLicense(lic)}
                                      className="p-1 px-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white cursor-pointer"
                                    >
                                      {isAr ? "تعديل" : "Edit"}
                                    </button>
                                    <button
                                      onClick={async () => {
                                        if (confirm(isAr ? "حذف هذه الرخصة نهائياً؟" : "Confirm delete?")) {
                                          const ok = await onDeleteLicense(lic.id);
                                          if (ok) alert(t.deleteSuccess);
                                        }
                                      }}
                                      className="p-1 px-2 rounded bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
                                    >
                                      {isAr ? "حذف" : "Delete"}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                    </div>
                  ) : (
                    /* Creating/editing license form */
                    <form onSubmit={saveLicenseItem} className="space-y-6">
                      <div className="flex justify-between items-center border-b border-brand-blue-100 pb-3">
                        <h2 className="font-extrabold text-brand-blue-900">
                          {editingLicense.id ? (isAr ? `تعديل: ${editingLicense.titleAr}` : `Edit Certificate`) : t.addNewLicense}
                        </h2>
                        <button
                          type="button"
                          onClick={() => setEditingLicense(null)}
                          className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                        >
                          {isAr ? "تراجع" : "Back"}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-extrabold text-slate-500 mb-1.5">{t.formLicenseTitleAr} *</label>
                          <input
                            type="text"
                            required
                            value={editingLicense.titleAr}
                            onChange={(e) => setEditingLicense({ ...editingLicense, titleAr: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-brand-blue-100 bg-slate-50 text-sm focus:border-brand-blue-600 focus:outline-none font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-slate-500 mb-1.5">{t.formLicenseTitleEn} *</label>
                          <input
                            type="text"
                            required
                            value={editingLicense.titleEn}
                            onChange={(e) => setEditingLicense({ ...editingLicense, titleEn: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-brand-blue-100 bg-slate-50 text-sm focus:border-brand-blue-600 focus:outline-none font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-slate-500 mb-1.5">{t.formLicenseIssuerAr}</label>
                          <input
                            type="text"
                            value={editingLicense.issuedByAr || ""}
                            onChange={(e) => setEditingLicense({ ...editingLicense, issuedByAr: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-brand-blue-100 bg-slate-50 text-sm focus:border-brand-blue-600 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-slate-500 mb-1.5">{t.formLicenseIssuerEn}</label>
                          <input
                            type="text"
                            value={editingLicense.issuedByEn || ""}
                            onChange={(e) => setEditingLicense({ ...editingLicense, issuedByEn: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-brand-blue-100 bg-slate-50 text-sm focus:border-brand-blue-600 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-slate-500 mb-1.5">{isAr ? "رابط صورة الوثيقة" : "Document Image URL"}</label>
                          <input
                            type="text"
                            required
                            value={editingLicense.imageUrl}
                            onChange={(e) => setEditingLicense({ ...editingLicense, imageUrl: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-brand-blue-100 bg-slate-50 text-xs focus:border-brand-blue-600 focus:outline-none font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-slate-500 mb-1.5">{isAr ? "تاريخ الإصدار" : "Issue Date"}</label>
                          <input
                            type="date"
                            value={editingLicense.issueDate}
                            onChange={(e) => setEditingLicense({ ...editingLicense, issueDate: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-brand-blue-100 bg-slate-50 text-sm focus:border-brand-blue-600 focus:outline-none"
                          />
                        </div>

                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-extrabold shadow-md flex items-center justify-center gap-2 cursor-pointer text-sm"
                      >
                        <Save className="w-4 h-4 text-brand-blue-100" />
                        <span>{isAr ? "حفظ وتوثيق الشهادة" : "Save Certificate"}</span>
                      </button>

                    </form>
                  )}
                </div>
              )}

              {/* TAB 3: CONTACT INFRASTRUCTURE & SETTINGS WORKSPACE */}
              {activeTab === "settings" && (
                <form onSubmit={saveSiteSettings} className="space-y-6">
                  
                  <div className="bg-[#fcfbfa] p-4 rounded-xl border border-brand-blue-100 pb-2">
                    <h2 className="font-extrabold text-brand-blue-900 text-sm sm:text-lg mb-1">{t.tabSettings}</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-500 mb-1.5">{isAr ? "رقم الواتساب (بدون زوائد)" : "WhatsApp Number (Digits only)"}</label>
                      <input
                        type="text"
                        required
                        value={settingsForm.whatsappNumber}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-brand-blue-100 bg-slate-50 text-sm focus:border-brand-blue-600 focus:outline-none font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-500 mb-1.5">{isAr ? "رقم الاتصال بهاتف المالك" : "Dialer Phone Number"}</label>
                      <input
                        type="text"
                        required
                        value={settingsForm.phone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-brand-blue-100 bg-slate-50 text-sm focus:border-brand-blue-600 focus:outline-none font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-500 mb-1.5">{isAr ? "البريد الإلكتروني للشركة" : "Company Email"}</label>
                      <input
                        type="email"
                        required
                        value={settingsForm.email}
                        onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-brand-blue-100 bg-slate-50 text-sm focus:border-brand-blue-600 focus:outline-none font-bold"
                      />
                    </div>
                  </div>

                  {/* Texts segments */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-500 mb-1.5">{isAr ? "نص (من نحن) بالعربية" : "About Text (Arabic)"}</label>
                      <textarea
                        rows={4}
                        required
                        value={settingsForm.aboutTextAr}
                        onChange={(e) => setSettingsForm({ ...settingsForm, aboutTextAr: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-brand-blue-100 bg-slate-50 text-sm focus:border-brand-blue-600 focus:outline-none leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-500 mb-1.5">{isAr ? "نص (من نحن) بالإنجليزية" : "About Text (English)"}</label>
                      <textarea
                        rows={4}
                        required
                        value={settingsForm.aboutTextEn}
                        onChange={(e) => setSettingsForm({ ...settingsForm, aboutTextEn: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-brand-blue-100 bg-slate-50 text-sm focus:border-brand-blue-600 focus:outline-none leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-500 mb-1.5">{isAr ? "رؤية ورسالة المؤسسة بالعربية" : "Corporate Vision (Arabic)"}</label>
                      <textarea
                        rows={3}
                        required
                        value={settingsForm.visionTextAr}
                        onChange={(e) => setSettingsForm({ ...settingsForm, visionTextAr: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-brand-blue-100 bg-slate-50 text-sm focus:border-brand-blue-600 focus:outline-none leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-500 mb-1.5">{isAr ? "رؤية ورسالة المؤسسة بالإنجليزية" : "Corporate Vision (English)"}</label>
                      <textarea
                        rows={3}
                        required
                        value={settingsForm.visionTextEn}
                        onChange={(e) => setSettingsForm({ ...settingsForm, visionTextEn: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-brand-blue-100 bg-slate-50 text-sm focus:border-brand-blue-600 focus:outline-none leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Passcode updater */}
                  <div className="bg-rose-50 border border-rose-100/80 rounded-2xl p-5 max-w-sm space-y-2">
                    <label className="block text-xs font-extrabold text-rose-800">{isAr ? "تغيير رمز المرور السري للوحة" : "Change Secure Access Passcode/PIN"}</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.adminPin}
                      onChange={(e) => setSettingsForm({ ...settingsForm, adminPin: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-rose-200 focus:outline-none focus:border-rose-600 text-sm font-mono text-center tracking-widest font-bold bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-extrabold shadow-md flex items-center justify-center gap-2 cursor-pointer text-sm"
                  >
                    <Save className="w-4 h-4 text-brand-blue-100" />
                    <span>{isAr ? "حفظ وتطبيق إعدادات الموقع" : "Save & Generalize Website Configurations"}</span>
                  </button>

                </form>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
