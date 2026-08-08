import {
  Home,
  CheckCircle,
  Wrench,
  Zap,
  Grid,
  Paintbrush,
  ShieldAlert,
  TreePine,
  Layers
} from "lucide-react";

interface ServicesProps {
  lang: "ar" | "en";
}

export default function Services({ lang }: ServicesProps) {
  const isAr = lang === "ar";

  const t = {
    sectionTitle: isAr ? "خدماتنا المعتمدة" : "Our Certified Services",
    sectionSubtitle: isAr ? "نقدم باقة خدمات هندسية وتنفيذية متكاملة للفلل والمصانع" : "Our Comprehensive Engineering & Execution Services Portfolio",
    ctaText: isAr ? "هل ترغب بالاستفسار عن الأسعار وضمان التشطيب؟" : "Want to inquire about our pricing and structural warranties?",
    ctaBtn: isAr ? "طلب استشارة هاتفية مجانية" : "Request Free Consultation Call"
  };

  const servicesList = [
    {
      icon: <Home className="w-7 h-7 text-wood-medium" />,
      titleAr: "بناء العظم والخرسانة",
      titleEn: "Core Skeleton & Structural Masonry",
      descAr: "حفر وتأسيس القواعد، صب الأعمدة والأسقف المعتمدة تحت أفضل معايير ضبط الجودة وعينات الخرسانة للفلل والعمائر السكنية.",
      descEn: "Excavation, reinforced foundation footing, column columns and slab castings under high standard supervision and concrete lab testing.",
      bulletsAr: ["تأسيس لبشة وقواعد متينة", "صب خرسانة مقاومة للأملاح", "إشراف هندسي على حديد التسليح"],
      bulletsEn: ["Heavy-duty foundation slabs", "Anti-saline high-grade concrete", "Structural steel engineer checkups"]
    },
    {
      icon: <Layers className="w-7 h-7 text-wood-medium" />,
      titleAr: "صيانة وترميم الفلل القديمة",
      titleEn: "Classic Property Restoration",
      descAr: "علاج وتدعيم الأعمدة القديمة المتآكلة، معالجة تصدعات الهبوط والشروخ والشعرية، وإصلاح تهبيط الحمامات والمطابخ.",
      descEn: "Strengthening older reinforcement slabs, repairing structural settlement cracks, moisture leakage damage, and bathroom flooring descents.",
      bulletsAr: ["حقن وترميم الشروخ الإنشائية", "تحديث شبكات الصرف التالفة", "صيانة الواجهات الحجرية والسيليكون"],
      bulletsEn: ["Epoxy structural crack injections", "Replacing damaged drain layouts", "Stone facade facelift & sealants"]
    },
    {
      icon: <Wrench className="w-7 h-7 text-wood-medium" />,
      titleAr: "أعمال السباكة وتأسيس الصرف",
      titleEn: "Elite Fluid & Plumbing Installations",
      descAr: "تمديد شبكات المياه الباردة والحارة بأنابيب معالجة، وتركيب خلاطات مدفونة وأطقم صحية وإكسسوارات مع اختبارات الكبس والضغط.",
      descEn: "Laying certified cold/hot pipes, installing concealed wall mixers, premium floor drains, and high-end sanitaryware with pressure test certificates.",
      bulletsAr: ["تأسيس تمديدات حرارية ألمانية", "حلول العزل قبل تمديد السباكة", "تركيب فلاتر ومضخات ضغط متطورة"],
      bulletsEn: ["German heat-fusion pipelines", "Advanced pre-plumbing insulation", "Installing professional water pumps"]
    },
    {
      icon: <Zap className="w-7 h-7 text-wood-medium" />,
      titleAr: "أعمال الكهرباء وتأسيس الإنارة",
      titleEn: "Elite Wiring & Electrical Systems",
      descAr: "توزيع مفاتيح ولوحات الكهرباء، تأسيس مسارات الإنارة والإنترنت والتحكم المنزلي الذكي بكابلات وقواطع معتمدة.",
      descEn: "Wiring routes for heavy-load AC units, fiber internet conduits, indirect LED paths, smart home modules, using high-end certified breakers.",
      bulletsAr: ["تمديد كابلات الرياض المعتمدة", "سحب الأسلاك وتأسيس طبلونات ذكية", "تركيب الإنارات المعلقة والمخفية"],
      bulletsEn: ["Certified copper Riyadh Cables", "Safe load balancing & smart panels", "Chandelier & indirect LED setups"]
    },
    {
      icon: <Grid className="w-7 h-7 text-wood-medium" />,
      titleAr: "اللياسة ومحارة السيراميك والبورسلين",
      titleEn: "Plastering, Ceramic & Porcelain Tiling",
      descAr: "تنفيذ أعمال اللياسة بالودع الميزان والزوايا المعدنية المقاومة للصدأ، وتركيب أفخم أنواع بلاط الأرضيات والبورسلين والجرانيت.",
      descEn: "Heavy plastering with absolute string levels and corner steel mesh protections, coupled with installation of luxury granite, ceramic, and marble flooring.",
      bulletsAr: ["لياسة ودع وأوتار مستوية تماماً", "تركيب سيراميك بمادة الغراء الأصلية", "ميزان ليزر للأرضيات الواسعة"],
      bulletsEn: ["Laser-leveled wall plastering", "Tile installations using high-bond glue", "Porcelain laser alignments"]
    },
    {
      icon: <Paintbrush className="w-7 h-7 text-wood-medium" />,
      titleAr: "الجبس بورد وأرقى أعمال الدهانات",
      titleEn: "Gypsum Drywall & Creative Textures",
      descAr: "تفصيل وتركيب ألواح الجبس بورد المضادة للرطوبة بتصميمات مودرن للأسقف، وتجهيز دهانات داخلية وخارجية (جوتن) بدقة غسيل عالية.",
      descEn: "Fabrication of moisture-resistant gypsum ceiling sections in modern designs, paired with high-washable, premium Jotun interior and exterior paint applications.",
      bulletsAr: ["جبس بورد معالج ضد الرطوبة والحرارة", "أصباغ منتقاة وصنفرة ليزر للجدران", "ورق حائط ودهانات خارجية بروفايل"],
      bulletsEn: ["Silicone-treated drywall sections", "Premium Jotun paint selections", "Exterior texture profile paints"]
    },
    {
      icon: <ShieldAlert className="w-7 h-7 text-wood-medium" />,
      titleAr: "عزل الأسطح والمطابخ والخزانات",
      titleEn: "Advanced Fluid & Thermal Insulation",
      descAr: "تطبيق أنظمة العزل المائي (بيتومين ولفائف) والحراري (لفوم بولي يوريثان) للأسطح لحماية الهياكل الإنشائية من تسرب مياه الأمطار والرطوبة.",
      descEn: "Application of liquid bitumen, torch-applied membranes (waterproofing), and durable polyurethane foam (thermal insulation) to save concrete from weather damage.",
      bulletsAr: ["عزل اللفائف المائي للخزانات", "عزل حراري للأسطح فوق البلاط", "ضمان معتمد يصل لـ 10 سنوات"],
      bulletsEn: ["Torch membranes for ground tanks", "Foam polyurethane insulation", "Up to 10 years certified warranty"]
    },
    {
      icon: <TreePine className="w-7 h-7 text-wood-medium" />,
      titleAr: "انترلوك وبلدورات وتنسيق حدائق",
      titleEn: "Interlock Paving, Curbs & Landscapes",
      descAr: "توريد ورص الانترلوك فائق القوة والمقاوم للأحمال لممرات الفلل والسيارات، تركيب بلدورات الطرق، وزراعة وتنسيق مزارع وحدائق فيلا خلابة.",
      descEn: "Laying high-density interlock pavers for driveways, installing concrete road curbs (bandourat), and creating fully-automatic irrigated lush lawns and trees.",
      bulletsAr: ["انترلوك سمك 6 أو 8 سم للسيارات", "تأسيس شبكات ري إلكترونية للحديقة", "تركيب ثيل صناعي وطبيعي منسق"],
      bulletsEn: ["6-8cm thick heavy interlock tiles", "Irrigation pipeline loops setup", "Premium synthetic or organic turf"]
    },
    {
      icon: <Layers className="w-7 h-7 text-wood-medium" />,
      titleAr: "أعمال الهناجر الحديدية المتكاملة",
      titleEn: "Industrial Steel Hangars & Warehouses",
      descAr: "تصميم وتنفيذ جمالونات الحديد والجسور المقاومة للأوزان الثقيلة وتغطيتها بسقوف الساندوتش بانل المقاوم للحريق والمطابق للمواصفات المدنية.",
      descEn: "Structural layout, steel truss assembly, erection of long-span frame warehouses using certified fire-rated insulated sandwich panel sheeting.",
      bulletsAr: ["أعمدة حديد وجسور سابك المعتمدة", "ساندوتش بانل عازل للصوت والحرارة", "تشطيب أرضيات إيبوكسي عالية الكفاءة"],
      bulletsEn: ["SABIC certified heavy steel beams", "Acoustic fire-rated panel cladding", "Epoxy floor coatings finishings"]
    }
  ];

  return (
    <section id="services" className="py-20 bg-white text-slate-800" dir={isAr ? "rtl" : "ltr"}>
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

        {/* Services Bento/Grid (Styled with deep-slate blue, wood-accents in small boxes, NO BLACK) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((srv, idx) => (
            <div
              key={idx}
              className="group relative bg-white hover:bg-brand-blue-50/50 rounded-3xl p-8 border-2 border-brand-blue-100/80 transition-all duration-300 shadow-sm hover:shadow-lg flex flex-col justify-between"
            >
              <div>
                
                {/* Icon framed in wood accent */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-wood-pale border-2 border-wood-light flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                    {srv.icon}
                  </div>
                  <span className="text-xs font-black text-brand-blue-600/30 font-mono tracking-widest">
                    #{String(idx + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="w-8 h-1 wood-bg mb-3 rounded-full"></div>

                <h3 className="text-xl font-black text-brand-blue-900 mb-3 group-hover:text-brand-blue-700 transition-colors font-display">
                  {isAr ? srv.titleAr : srv.titleEn}
                </h3>

                <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed mb-6">
                  {isAr ? srv.descAr : srv.descEn}
                </p>

              </div>

              {/* Bullets lists */}
              <div className="border-t-2 border-dashed border-brand-blue-100/80 pt-5 mt-auto">
                <ul className="space-y-2.5">
                  {(isAr ? srv.bulletsAr : srv.bulletsEn).map((bullet, bidx) => (
                    <li key={bidx} className="flex items-center gap-2 text-xs font-bold text-brand-blue-900">
                      <CheckCircle className="w-4 h-4 text-wood-medium flex-shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          ))}
        </div>

        {/* CTA section in services */}
        <div className="mt-16 bg-gradient-to-br from-brand-blue-950 to-brand-blue-900 rounded-3xl p-8 sm:p-12 border border-wood-light/30 text-center relative overflow-hidden">
          {/* Subtle wooden texture color accent dots */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-wood-light/10 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-blue-600/20 blur-3xl rounded-full" />
          
          <div className="relative z-10">
            <h4 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {t.ctaText}
            </h4>
            <p className="text-slate-300 text-xs sm:text-sm font-medium mb-6 max-w-xl mx-auto">
              {isAr
                ? "خبرتنا البنائية الممتدة منذ التأسيس تضمن لكم عقوداً تنفيذية مصدقة تخلو من الأخطاء وتقدم أعلى معدلات الجودة."
                : "Our construction lineage guarantees certified, hassle-free structural execution of contract standards."}
            </p>
            <a
              href="tel:+966568679494"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-wood-light to-wood-medium hover:from-wood-medium hover:to-wood-dark text-brand-blue-950 font-extrabold shadow-md hover:shadow-lg transition-smooth cursor-pointer text-sm"
            >
              <span>{t.ctaBtn}</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
