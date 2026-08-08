import { Award, Target, Calendar, UserCheck } from "lucide-react";
import { motion } from "motion/react";

interface AboutProps {
  lang: "ar" | "en";
  aboutTextAr: string;
  aboutTextEn: string;
  visionTextAr: string;
  visionTextEn: string;
}

export default function About({ lang, aboutTextAr, aboutTextEn, visionTextAr, visionTextEn }: AboutProps) {
  const isAr = lang === "ar";

  const t = {
    sectionTitle: isAr ? "من نحن" : "About Us",
    sectionSubtitle: isAr ? "قصة متانة وتفرد مؤسستنا البنائية" : "Engineering Durability & Structural Distinction",
    aboutHeading: isAr ? "مؤسسة بيت الأثير للمقاولات العامة" : "House of Al-Atheer General Contracting",
    visionTitle: isAr ? "رؤية المؤسسة وقيمنا" : "Our Corporate Vision & Core Values",
    foundingBadge: isAr ? "تاريخ التأسيس: ديسمبر 2022م" : "Founded: December 2022",
    satisfactionBadge: isAr ? "إشراف هندسي وضمان شامل" : "Engineering Supervision & Structural Warranties",
  };

  const stats = [
    {
      icon: <Calendar className="w-8 h-8 text-wood-medium" />,
      titleAr: "ديسمبر 2022م",
      titleEn: "Dec 2022",
      descAr: "تأسيس معتمد بسجل تجاري",
      descEn: "Officially Registered Founding Date",
    },
    {
      icon: <Award className="w-8 h-8 text-wood-medium" />,
      titleAr: "100% جودة مضمونة",
      titleEn: "100% Quality Assurred",
      descAr: "مواد أصلية واختبارات لجميع الصبات",
      descEn: "Premium certified materials and pressure testings",
    },
    {
      icon: <UserCheck className="w-8 h-8 text-wood-medium" />,
      titleAr: "طاقم فني خبير",
      titleEn: "Highly Certified Crew",
      descAr: "فريق هندسي متخصص لكل عمل وميدان",
      descEn: "Bespoke engineering crew for every specialized area",
    }
  ];

  return (
    <section id="about" className="py-20 bg-brand-blue-50/50 text-slate-800" dir={isAr ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-black text-wood-medium tracking-widest uppercase mb-1.5 wood-light px-3 py-1 rounded inline-block">
            {t.sectionTitle}
          </h2>
          <p className="text-3xl sm:text-5xl font-extrabold text-brand-blue-900 tracking-tighter leading-none mt-2 font-display">
            {t.sectionSubtitle}
          </p>
          <div className="w-16 h-1 bg-wood-medium mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Visual card showing company context */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-2 border-brand-blue-100">
              <div className="absolute inset-0 bg-gradient-to-t from-brand-blue-950/80 to-transparent z-10" />
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80"
                alt="House of Al-Atheer General Contracting"
                className="w-full h-[400px] object-cover transform hover:scale-105 transition-transform duration-700"
              />
              
              {/* Overlay Badge for Dec 2022 (تأسيس المؤسسة عام 12م/2022) */}
              <div className="absolute bottom-6 left-6 right-6 z-20 bg-white/95 rounded-2xl p-5 border-r-4 border-wood-medium shadow-xl">
                <p className="text-xs text-wood-dark font-black uppercase tracking-wider">
                  {t.foundingBadge}
                </p>
                <h4 className="text-md sm:text-lg font-black text-brand-blue-900 mt-1 font-display">
                  {t.satisfactionBadge}
                </h4>
              </div>
            </div>
            
            {/* Elegant Background decorative boxes (woody accents) */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-wood-pale rounded-3xl -z-10 border-2 border-dashed border-wood-light/40" />
          </div>

          {/* Description & Narrative */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="w-8 h-1 wood-bg mb-2"></div>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-brand-blue-900 tracking-tight font-display">
                {t.aboutHeading}
              </h3>
              <p className="text-slate-700 leading-relaxed text-md font-bold whitespace-pre-wrap">
                {isAr ? aboutTextAr : aboutTextEn}
              </p>
            </div>

            {/* Vision Segment with Target Icon and woody highlights */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-brand-blue-100 shadow-md space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-wood-pale rounded-xl border border-wood-light/35">
                  <Target className="w-7 h-7 text-wood-medium" />
                </div>
                <h4 className="text-xl font-black text-brand-blue-900 font-display">
                  {t.visionTitle}
                </h4>
              </div>
              <p className="text-slate-650 leading-relaxed text-md font-medium whitespace-pre-wrap">
                {isAr ? visionTextAr : visionTextEn}
              </p>
            </div>

            {/* Micro Specs Indicators Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex gap-3.5 items-start">
                  <div className="p-3 bg-brand-blue-100/50 rounded-2xl border border-brand-blue-200 flex-shrink-0">
                    {stat.icon}
                  </div>
                  <div>
                    <h5 className="font-extrabold text-brand-blue-900 text-sm sm:text-base tracking-tight font-display">
                      {isAr ? stat.titleAr : stat.titleEn}
                    </h5>
                    <p className="text-xs text-slate-600 mt-1 font-bold leading-normal">
                      {isAr ? stat.descAr : stat.descEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
