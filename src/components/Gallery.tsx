import { useState } from "react";
import { Hammer, Calendar, User, Eye, Trash2, Edit2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PortfolioItem } from "../types";

interface GalleryProps {
  lang: "ar" | "en";
  items: PortfolioItem[];
  isAdmin: boolean;
  onDeleteItem: (id: string) => void;
  onEditItem: (item: PortfolioItem) => void;
}

export default function Gallery({ lang, items, isAdmin, onDeleteItem, onEditItem }: GalleryProps) {
  const isAr = lang === "ar";
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const categories = [
    { id: "all", labelAr: "كل الأقسام", labelEn: "All Departments" },
    { id: "masonry", labelAr: "العظم والخرسانة", labelEn: "Masonry & Skeleton" },
    { id: "plumbing", labelAr: "السباكة والصرف", labelEn: "Plumbing Services" },
    { id: "electrical", labelAr: "الكهرباء والإنارة", labelEn: "Electrical Works" },
    { id: "finishing", labelAr: "الدهان والجبس بورد", labelEn: "Paints & Drywall" },
    { id: "landscaping", labelAr: "الانترلوك والحدائق", labelEn: "Interlock & Garden" },
    { id: "hangars", labelAr: "الهناجر والحديد", labelEn: "Steel Hangars" },
    { id: "maintenance", labelAr: "الصيانة والترميم", labelEn: "Villa Maintenance" }
  ];

  const filteredItems = activeCategory === "all"
    ? items
    : items.filter(item => item.category === activeCategory);

  const t = {
    sectionTitle: isAr ? "معرض الأعمال" : "Project Showcase",
    sectionSubtitle: isAr ? "تصفح مشاريعنا المنفذة مقسمة ومصنفة لكل تخصص مهني" : "Browse our completed works sorted by engineering departments",
    emptyAr: "لا توجد أعمال مضافة حالياً في هذا القسم.",
    emptyEn: "No portfolio items added in this department yet.",
    execDate: isAr ? "تاريخ التنفيذ" : "Execution Date",
    handWorker: isAr ? "الفني / المهندس المسؤول" : "Responsible Craftsman / Engineer",
    closeBtn: isAr ? "إغلاق النافذة" : "Close Viewer",
    watchVideo: isAr ? "تشغيل الفديو" : "Play Video",
    deleteConfirm: isAr ? "هل أنت متأكد من حذف هذا العمل نهائياً؟" : "Are you sure you want to delete this item permanently?"
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(t.deleteConfirm + `\n(${name})`)) {
      onDeleteItem(id);
    }
  };

  return (
    <section id="gallery" className="py-20 bg-brand-blue-50/30 text-slate-800" dir={isAr ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-black text-wood-medium tracking-widest uppercase mb-1.5 wood-light px-3 py-1 rounded inline-block">
            {t.sectionTitle}
          </h2>
          <p className="text-3xl sm:text-5xl font-black text-brand-blue-900 tracking-tighter leading-none mt-2 font-display">
            {t.sectionSubtitle}
          </p>
          <div className="w-16 h-1 bg-wood-medium mx-auto mt-4 rounded-full" />
        </div>

        {/* Categories Tab Row (Perfect separate categories responsive list) */}
        <div className="flex flex-wrap gap-2.5 justify-center mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-black border-2 transition-smooth cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-brand-blue-900 border-wood-medium text-wood-light shadow-md"
                  : "bg-white border-brand-blue-100 text-slate-700 hover:border-brand-blue-600 hover:text-brand-blue-900 flex-shrink-0"
              }`}
            >
              {isAr ? cat.labelAr : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Gallery Grid (with smooth element entrance) */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-brand-blue-100/60 max-w-lg mx-auto">
            <Hammer className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-semibold">{isAr ? t.emptyAr : t.emptyEn}</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={item.id}
                  className="bg-white rounded-3xl overflow-hidden border-2 border-brand-blue-100/80 shadow-md hover:shadow-xl transition-all group relative flex flex-col justify-between"
                >
                  {/* Media wrapper */}
                  <div className="relative aspect-video w-full overflow-hidden bg-brand-blue-950 cursor-pointer" onClick={() => setSelectedItem(item)}>
                    <div className="absolute inset-0 bg-brand-blue-950/20 group-hover:bg-brand-blue-950/40 transition-colors z-10" />
                    
                    {item.mediaType === "video" ? (
                      <div className="relative w-full h-full">
                        {/* If it's video, show play indicator */}
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                          <div className="w-14 h-14 rounded-full bg-wood-medium/95 border-2 border-white/40 flex items-center justify-center text-white shadow-xl animate-pulse">
                            <Eye className="w-7 h-7" />
                          </div>
                        </div>
                        {/* We use an image preview or simple embedded video */}
                        <img
                          src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80" 
                          alt="Video Preview"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <img
                        src={item.mediaUrl || "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80"}
                        alt={isAr ? item.titleAr : item.titleEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    )}

                    {/* Department badge (wooden colored) */}
                    <span className="absolute bottom-3 left-3 z-20 bg-brand-blue-900 border-2 border-wood-medium text-wood-light text-xs font-black px-3 py-1 rounded-xl">
                      {isAr 
                        ? categories.find(c => c.id === item.category)?.labelAr 
                        : categories.find(c => c.id === item.category)?.labelEn}
                    </span>
                  </div>

                  {/* Item Description block */}
                  <div className="p-7 flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="font-black text-brand-blue-900 text-lg mb-2 leading-snug cursor-pointer group-hover:text-brand-blue-700 transition-colors font-display" onClick={() => setSelectedItem(item)}>
                        {isAr ? item.titleAr : item.titleEn}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-700 font-bold line-clamp-2 leading-relaxed mb-4">
                        {isAr ? item.descAr : item.descEn}
                      </p>
                    </div>

                    <div className="border-t-2 border-dashed border-brand-blue-100/85 pt-4 flex items-center justify-between mt-auto">
                      {item.projectDate && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                          <Calendar className="w-4 h-4 text-wood-medium" />
                          <span>{item.projectDate}</span>
                        </div>
                      )}
                      
                      {item.workerNameAr && (
                        <div className="flex items-center gap-1.5 text-xs font-black text-brand-blue-900">
                          <User className="w-4 h-4 text-wood-medium" />
                          <span className="truncate max-w-[120px] font-display">
                            {isAr ? item.workerNameAr : item.workerNameEn}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Admin inline management action tags */}
                  {isAdmin && (
                    <div className="absolute top-3 right-3 z-20 flex gap-1.5">
                      <button
                        onClick={() => onEditItem(item)}
                        className="p-1.5 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 shadow-md cursor-pointer border border-yellow-400/20"
                        title="Edit Item"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, isAr ? item.titleAr : item.titleEn)}
                        className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 shadow-md cursor-pointer border border-rose-500/20"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </div>

      {/* Lightbox Modal overlay for selected details */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-blue-950/80 backdrop-blur-sm animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
          <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-brand-blue-100">
            
            {/* Top Close indicator */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-brand-blue-900 text-white hover:bg-brand-blue-850 cursor-pointer shadow-lg border border-brand-blue-700/50 text-xs font-bold"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              
              {/* Media viewer */}
              <div className="bg-brand-blue-950 flex items-center justify-center min-h-[250px] md:min-h-[400px]">
                {selectedItem.mediaType === "video" ? (
                  <video
                    src={selectedItem.mediaUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <img
                    src={selectedItem.mediaUrl || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1000&q=80"}
                    alt={isAr ? selectedItem.titleAr : selectedItem.titleEn}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>

              {/* Data narrative details */}
              <div className="p-8 flex flex-col justify-between">
                <div>
                  <span className="inline-block bg-wood-pale border border-wood-light/40 text-wood-dark font-extrabold text-xs px-3 py-1 rounded-full mb-4">
                    {isAr 
                      ? categories.find(c => c.id === selectedItem.category)?.labelAr 
                      : categories.find(c => c.id === selectedItem.category)?.labelEn}
                  </span>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-brand-blue-900 mb-4 leading-tight">
                    {isAr ? selectedItem.titleAr : selectedItem.titleEn}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed mb-6 whitespace-pre-wrap">
                    {isAr ? selectedItem.descAr : selectedItem.descEn}
                  </p>
                </div>

                {/* Craft specs */}
                <div className="border-t border-brand-blue-100 pt-6 space-y-3.5">
                  {selectedItem.workerNameAr && (
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <User className="w-4 h-4 text-wood-medium" />
                      <span className="text-slate-500 font-medium">{t.handWorker}:</span>
                      <strong className="text-brand-blue-900 font-extrabold">
                        {isAr ? selectedItem.workerNameAr : selectedItem.workerNameEn}
                      </strong>
                    </div>
                  )}

                  {selectedItem.projectDate && (
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <Calendar className="w-4 h-4 text-wood-medium" />
                      <span className="text-slate-500 font-medium">{t.execDate}:</span>
                      <strong className="text-brand-blue-900 font-semibold">
                        {selectedItem.projectDate}
                      </strong>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedItem(null)}
                  className="mt-8 w-full py-2.5 rounded-xl bg-brand-blue-900 hover:bg-brand-blue-800 text-white font-bold transition-colors cursor-pointer text-xs"
                >
                  {t.closeBtn}
                </button>

              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
}
