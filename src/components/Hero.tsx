import { useState, useEffect } from "react";
import { Phone, ArrowRight, ArrowLeft, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HeroProps {
  lang: "ar" | "en";
}

export default function Hero({ lang }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80",
      titleAr: "مؤسسة بيت الأثير للمقاولات العامة",
      titleEn: "House of Al-Atheer General Contracting",
      descAr: "نصنع لك مجمع أو بيت العمر على أسس خرسانية وإشراف فني وهندسي متكامل من العظم إلى مفتاح التشطيب.",
      descEn: "We construct your dream property on solid concrete foundations with integrated engineering supervision from skeleton to key turnkey finishes.",
    },
    {
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80",
      titleAr: "تشطيبات عصرية بأرقى معايير الجودة",
      titleEn: "Modern Turnkey Finishes with Premium Quality",
      descAr: "حلول احترافية متكاملة تفتخر بها لخدمات السباكة، الكهرباء، اللياسة، السيراميك، الجبس بورد، الدهانات، والعوازل المائية والحرارية.",
      descEn: "Turnkey services to be proud of for plumbing, electricals, plaster, tiling, drywall, paints, and advanced thermal-fluid insulations.",
    },
    {
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80",
      titleAr: "بناء الهناجر الحديدية وترميم وإحياء المباني الكلاسيكية",
      titleEn: "Steel Hangar Structures & Classic Property Restoration",
      descAr: "خدمات شاملة في تفصيل حديد الهناجر وتأسيسها وتغطيتها بالساندوتش بانل المقاوم، وصيانة وترميم شروخ وتصدعات الفلل القديمة.",
      descEn: "Comprehensive services in steel hangar fabrication, sandwich-panel sheeting, as well as fixing structural cracks in older premium villas.",
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth"
      });
    }
  };

  const text = {
    explore: lang === "ar" ? "استكشف خدماتنا" : "Explore Services",
    callUs: lang === "ar" ? "اتصل بنا الآن" : "Call Us Now",
    whatsapp: lang === "ar" ? "واتساب مباشر" : "Direct WhatsApp",
  };

  return (
    <section id="home" className="relative h-[90vh] md:h-[95vh] w-full overflow-hidden bg-brand-blue-950" dir="ltr">
      
      {/* Slide Images */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-brand-blue-950 via-brand-blue-900/60 to-brand-blue-950/40 z-10" />
            <img
              src={slides[currentSlide].image}
              alt="House of Al-Atheer General Contracting"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content overlays */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center" dir={lang === "ar" ? "rtl" : "ltr"}>
          
          {/* Slogan badge with Wood Accent and NO absolute black */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-blue-900/80 border border-wood-light/45 text-wood-light mb-6 text-xs sm:text-sm font-semibold tracking-wide"
          >
            <span className="w-2 h-2 rounded-full bg-wood-medium animate-pulse" />
            {lang === "ar" ? "تأسست في ديسمبر 2022م " : "Established in December 2022"}
          </motion.div>

          {/* Slogan text */}
          <AnimatePresence mode="wait">
            <motion.h2
              key={`h-${currentSlide}`}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-tight md:leading-[1.1] font-display drop-shadow-xl"
            >
              {lang === "ar" ? slides[currentSlide].titleAr : slides[currentSlide].titleEn}
            </motion.h2>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.p
              key={`p-${currentSlide}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-6 text-base sm:text-lg md:text-2xl text-slate-100 max-w-4xl mx-auto font-bold leading-relaxed drop-shadow-md"
            >
              {lang === "ar" ? slides[currentSlide].descAr : slides[currentSlide].descEn}
            </motion.p>
          </AnimatePresence>

          {/* Action buttons (Blue + Egyptian Wood theme with no black color) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex flex-wrap gap-4 justify-center"
          >
            <button
              onClick={() => scrollToSection("services")}
              className="flex items-center gap-2 px-7 py-4 rounded-2xl text-white bg-brand-blue-600 hover:bg-brand-blue-700 font-extrabold border-2 border-brand-blue-500 shadow-md transition-smooth cursor-pointer text-sm sm:text-base"
            >
              <span>{text.explore}</span>
              <ArrowRight className={`w-4 h-4 transition-transform ${lang === 'ar' ? 'rotate-180' : ''}`} />
            </button>

            <a
              href="tel:+966568679494"
              className="flex items-center gap-2 px-7 py-4 rounded-2xl text-brand-blue-900 bg-wood-pale hover:bg-wood-light/40 font-extrabold border-2 border-wood-medium/60 transition-smooth cursor-pointer text-sm sm:text-base text-wood-dark"
            >
              <Phone className="w-4 h-4 text-wood-medium" />
              <span>{text.callUs}</span>
            </a>

            <a
              href="https://wa.me/966568679494?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%85%D8%A4%D8%B3%D8%B3%D8%A9%20%D8%A8%D9%8A%D8%AA%20%D8%A7%D9%84%D8%A3%D9%80%D8%AB%D9%8A%D8%B1%D8%8C%20%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%A3%D8%B9%D9%85%D8%A7%D9%84%20%D8%A7%D9%84%D9%85%D9%82%D8%A7%D9%88%D9%84%D8%A7%D8%AA"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-7 py-4 rounded-2xl text-white bg-emerald-600 hover:bg-emerald-700 font-extrabold border-2 border-emerald-500 transition-smooth cursor-pointer text-sm sm:text-base shadow-md"
            >
              <MessageSquare className="w-5 h-5 text-emerald-100" />
              <span>{text.whatsapp}</span>
            </a>
          </motion.div>

        </div>
      </div>

      {/* Manual Slide Navigation toggles */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-brand-blue-900/40 hover:bg-brand-blue-800 text-white border border-brand-blue-800/40 transition-smooth cursor-pointer hidden sm:flex"
        title="Previous Slide"
      >
        <ArrowLeft className="w-4.5 h-4.5 text-wood-light" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-brand-blue-900/40 hover:bg-brand-blue-800 text-white border border-brand-blue-800/40 transition-smooth cursor-pointer hidden sm:flex"
        title="Next Slide"
      >
        <ArrowRight className="w-4.5 h-4.5 text-wood-light" />
      </button>

      {/* Slider indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2.5 rounded-full transition-smooth cursor-pointer ${
              currentSlide === idx ? "w-8 bg-wood-light" : "w-2.5 bg-white/40"
            }`}
            title={`Go to Slide ${idx + 1}`}
          />
        ))}
      </div>

    </section>
  );
}
