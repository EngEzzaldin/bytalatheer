import { useState } from "react";
import { FileText, ShieldCheck, Calendar, Eye, Trash2, Edit } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LicenseItem } from "../types";

interface LicensesProps {
  lang: "ar" | "en";
  licenses: LicenseItem[];
  isAdmin: boolean;
  onDeleteLicense: (id: string) => void;
  onEditLicense: (license: LicenseItem) => void;
}

export default function Licenses({ lang, licenses, isAdmin, onDeleteLicense, onEditLicense }: LicensesProps) {
  const isAr = lang === "ar";
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const t = {
    sectionTitle: isAr ? "الرخص والشهادات المعتمدة" : "Registrations & Credentials",
    sectionSubtitle: isAr ? "نعمل تحت مظلة الأنظمة الرسمية للتشييد والبناء بالمملكة" : "Operating under official Saudi regulatory structures",
    issuedBy: isAr ? "الجهة المصدرة" : "Issuing Authority",
    issueDate: isAr ? "تاريخ الإصدار" : "Issue Date",
    verifyTitle: isAr ? "انقر لاستعراض الوثيقة بدقة عالية" : "Click to view high-res document",
    noLicAr: "لا توجد شهادات مضافة حالياً.",
    noLicEn: "No certificates listed yet.",
    deleteConfirm: isAr ? "هل تريد حذف هذه الشهادة/الرخصة نهائياً؟" : "Are you sure you want to delete this certificate?"
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(t.deleteConfirm + `\n(${name})`)) {
      onDeleteLicense(id);
    }
  };

  return (
    <section id="licenses" className="py-20 bg-white text-slate-800" dir={isAr ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-black text-wood-medium tracking-widest uppercase mb-1.5 wood-light px-3 py-1 rounded inline-block">
            {t.sectionTitle}
          </h2>
          <p className="text-3xl sm:text-5xl font-black text-brand-blue-900 tracking-tighter leading-none mt-2 font-display">
            {t.sectionSubtitle}
          </p>
          <div className="w-16 h-1 bg-wood-medium mx-auto mt-4 rounded-full" />
        </div>

        {licenses.length === 0 ? (
          <div className="text-center py-10 bg-brand-blue-50/20 max-w-md mx-auto rounded-3xl border-2 border-brand-blue-100">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-semibold">{isAr ? t.noLicAr : t.noLicEn}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {licenses.map((lic) => (
              <div
                key={lic.id}
                className="bg-white hover:bg-brand-blue-50/30 border-2 border-brand-blue-100 rounded-3xl p-6 transition-all duration-300 relative group flex flex-col justify-between shadow-sm hover:shadow-md"
              >
                
                <div>
                  {/* Certificate preview */}
                  <div
                    onClick={() => setActiveImage(lic.imageUrl)}
                    className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-brand-blue-950/20 border-2 border-brand-blue-100/50 cursor-pointer mb-5 group-hover:shadow-md transition-shadow"
                    title={t.verifyTitle}
                  >
                    <div className="absolute inset-0 bg-brand-blue-950/10 group-hover:bg-brand-blue-950/30 transition-colors flex items-center justify-center z-10">
                      <div className="p-2.5 bg-brand-blue-900/90 rounded-xl text-wood-light border border-wood-light/20 scale-90 group-hover:scale-100 transition-transform opacity-0 group-hover:opacity-100 font-extrabold text-xs flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{isAr ? "شاهد" : "View"}</span>
                      </div>
                    </div>
                    <img
                      src={lic.imageUrl || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=600&q=80"}
                      alt={isAr ? lic.titleAr : lic.titleEn}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Cert details */}
                  <div className="flex gap-3.5 items-start">
                    <div className="p-2.5 bg-wood-pale rounded-xl border border-wood-light/35 flex-shrink-0">
                      <ShieldCheck className="w-6 h-6 text-wood-medium" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-brand-blue-900 text-sm sm:text-base mb-1.5 leading-snug font-display">
                        {isAr ? lic.titleAr : lic.titleEn}
                      </h3>
                      
                      {lic.issuedByAr && (
                        <p className="text-xs text-slate-600 font-bold select-all">
                          <span className="text-slate-400 font-black">{t.issuedBy}:</span>{" "}
                          {isAr ? lic.issuedByAr : lic.issuedByEn}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Date stamp at base of card */}
                {lic.issueDate && (
                  <div className="border-t-2 border-dashed border-brand-blue-100/80 pt-4 mt-4 flex items-center gap-1.5 text-xs font-bold text-slate-600">
                    <Calendar className="w-4 h-4 text-wood-medium" />
                    <span>{t.issueDate}: {lic.issueDate}</span>
                  </div>
                )}

                {/* Quick edit keys */}
                {isAdmin && (
                  <div className="absolute top-4 right-4 z-20 flex gap-1.5">
                    <button
                      onClick={() => onEditLicense(lic)}
                      className="p-1.5 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 shadow-md cursor-pointer border border-yellow-400/20"
                      title="Edit Certificate"
                    >
                      <Edit className="w-3" />
                    </button>
                    <button
                      onClick={() => handleDelete(lic.id, isAr ? lic.titleAr : lic.titleEn)}
                      className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 shadow-md cursor-pointer border border-rose-500/20"
                      title="Delete Certificate"
                    >
                      <Trash2 className="w-3" />
                    </button>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Lightbox pop up for verifying high-res image */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-brand-blue-950/80 backdrop-blur-sm p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-3xl max-h-[85vh] bg-white p-2.5 rounded-3xl overflow-hidden shadow-2xl border border-brand-blue-800"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveImage(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-brand-blue-900 text-white hover:bg-brand-blue-850 cursor-pointer shadow-lg font-bold"
              >
                ✕
              </button>
              <img
                src={activeImage}
                alt="High Registration Verification"
                className="max-w-full max-h-[80vh] rounded-2xl object-contain"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
