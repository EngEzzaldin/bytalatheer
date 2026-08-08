import { useState } from "react";
import { Phone, Mail, MessageSquare, Clock, MapPin, Send, CheckCircle } from "lucide-react";

interface ContactProps {
  lang: "ar" | "en";
  whatsappNumber: string;
  phone: string;
  email: string;
}

export default function Contact({ lang, whatsappNumber, phone, email }: ContactProps) {
  const isAr = lang === "ar";
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    message: ""
  });

  const t = {
    sectionTitle: isAr ? "تواصل بنا" : "Contact Us",
    sectionSubtitle: isAr ? "يسعدنا الرد على استفسارك ومناقشة مخططكم البنائي" : "We are delighted to answer your inquiry and discuss your build layout",
    phoneLabel: isAr ? "رقم الاتصال المباشر" : "Direct Phone Line",
    emailLabel: isAr ? "البريد الإلكتروني للمؤسسة" : "Corporate Email Address",
    whatsappLabel: isAr ? "المراسلة الفورية عبر الواتساب" : "WhatsApp Instant Chatting",
    workHours: isAr ? "أوقات العمل الرسمية" : "Official Working Hours",
    workHoursVal: isAr ? "السبت - الخميس: 8:00 صباحاً - 6:00 مساءً" : "Saturday - Thursday: 8:00 AM - 6:00 PM",
    addressLabel: isAr ? "منطقة العمل والتركيز" : "Coverage Area",
    addressVal: isAr ? "الرياض والمنطقة الوسطى، المملكة العربية السعودية" : "Riyadh & Central Province, Saudi Arabia",
    formHeading: isAr ? "طلب معاينة أو عرض سعر مباشر" : "Request a Layout Inspection or Quotation",
    formName: isAr ? "الاسم الكريم" : "Your Name",
    formPhone: isAr ? "رقم الجوال الخاص بك" : "Your Phone Number",
    formService: isAr ? "القسم / الخدمة المطلوبة" : "Desired Service Category",
    formMsg: isAr ? "تفاصيل إضافية عن مساحة الفيلّا أو العمل" : "Describe the villa area or project details",
    formBtn: isAr ? "إرسال الطلب الآن لأخصائي التسعير" : "Submit Request to Estimators",
    successHeading: isAr ? "تم استلام طلبكم بنجاح وموثوقية" : "Request Received Successfully",
    successMsg: isAr ? "يقوم المهندس المسؤول بمراجعة تفاصيل الموقع والمراسلة فوراً." : "Our leading project estimator will reach out to you within 2 hours.",
    selectPlaceholder: isAr ? "-- اختر التخصص المطلوب --" : "-- Select desired category --",
    srv1: isAr ? "تأسيس عظم وبناء هياكل" : "Skeleton Core Structure",
    srv2: isAr ? "تشطيب متكامل للفلل والعمائر" : "Full Finishes (Plumbing, Electrical, Drywall)",
    srv3: isAr ? "صيانة وترميم مباني قديمة" : "Old Building Maintenance",
    srv4: isAr ? "إنشاء هناجر بمواصفات عالية" : "Steel Hangar Construction",
    srv5: isAr ? "أعمال الانترلوك وتنسيق الحدائق" : "Interlock Paving & Landscaping"
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value} = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: "", phone: "", service: "", message: "" });
    }, 5000);
  };

  // WhatsApp text formatting for auto message inside URL (house.alatheer request)
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    isAr 
      ? "مرحباً مؤسسة بيت الأثير للمقاولات العامة، أرغب بالاستفسار عن خدمات العظم والتشطيب والصيانة." 
      : "Hello House of Al-Atheer General Contracting, I would like to inquire about your construction, finishing, and repair services."
  )}`;

  return (
    <section id="contact" className="py-20 bg-brand-blue-50/50 text-slate-800" dir={isAr ? "rtl" : "ltr"}>
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Channel buttons Column */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            <div className="space-y-6">
              
              {/* Call dialer button */}
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-5 p-5 bg-white rounded-3xl border-2 border-brand-blue-100/80 hover:border-wood-medium hover:shadow-lg transition-all duration-300 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-wood-pale flex items-center justify-center border border-wood-light/35 flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Phone className="w-6 h-6 text-wood-medium" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-slate-400 capitalize">{t.phoneLabel}</h4>
                  <p className="text-lg sm:text-xl font-black text-brand-blue-900 mt-1 font-display" dir="ltr">
                    {phone}
                  </p>
                </div>
              </a>

              {/* Whatsapp direct chat linking */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-5 p-5 bg-white rounded-3xl border-2 border-brand-blue-100/80 hover:border-emerald-500 hover:shadow-lg transition-all duration-300 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-200/50 flex-shrink-0 group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-slate-400 capitalize">{t.whatsappLabel}</h4>
                  <p className="text-lg sm:text-xl font-black text-brand-blue-900 mt-1 font-display" dir="ltr">
                    +{whatsappNumber}
                  </p>
                </div>
              </a>

              {/* Email direct button */}
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-5 p-5 bg-white rounded-3xl border-2 border-brand-blue-100/80 hover:border-wood-medium hover:shadow-lg transition-all duration-300 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-wood-pale flex items-center justify-center border border-wood-light/35 flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="w-6 h-6 text-wood-medium" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-slate-400 capitalize">{t.emailLabel}</h4>
                  <p className="text-sm sm:text-md font-black text-brand-blue-900 mt-1 break-all select-all font-display">
                    {email}
                  </p>
                </div>
              </a>

            </div>

            {/* Micro Details (Operation days / coverage coordinates) */}
            <div className="bg-brand-blue-900 text-white rounded-3xl p-7 border-2 border-wood-medium relative overflow-hidden shadow-md">
              <div className="absolute top-0 right-0 w-20 h-20 bg-wood-light/10 blur-2xl rounded-full" />
              
              <div className="space-y-4 relative z-10">
                <div className="flex items-start gap-3.5">
                  <Clock className="w-5 h-5 text-wood-light flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-black text-slate-300 tracking-wide font-display">{t.workHours}</h5>
                    <p className="text-xs sm:text-sm font-bold text-white mt-1">{t.workHoursVal}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 border-t-2 border-dashed border-brand-blue-800 pt-4">
                  <MapPin className="w-5 h-5 text-wood-light flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-black text-slate-300 tracking-wide font-display">{t.addressLabel}</h5>
                    <p className="text-xs sm:text-sm font-bold text-white mt-1">{t.addressVal}</p>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Quotation request form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 border-2 border-brand-blue-100/80 shadow-md flex flex-col justify-center">
            
            {formSubmitted ? (
              <div className="text-center py-12 space-y-4 bg-slate-50 rounded-2xl border-2 border-dashed border-emerald-200">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 animate-bounce">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-brand-blue-900 font-display">{t.successHeading}</h3>
                <p className="text-slate-600 font-bold text-sm max-w-sm mx-auto leading-relaxed">
                  {t.successMsg}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-xl font-black text-brand-blue-900 border-b-2 border-brand-blue-100 pb-3 font-display flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-wood-medium inline-block"></span>
                  {t.formHeading}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Name field */}
                  <div>
                    <label className="block text-xs font-black text-slate-600 mb-1.5">{t.formName} *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-brand-blue-100 focus:border-brand-blue-600 focus:outline-none bg-slate-50 font-bold text-sm text-brand-blue-950 focus:bg-white transition-colors"
                    />
                  </div>

                  {/* Phone field */}
                  <div>
                    <label className="block text-xs font-black text-slate-600 mb-1.5">{t.formPhone} *</label>
                    <input
                      type="text"
                      name="phone"
                      required
                      placeholder="e.g. 0568679494"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-brand-blue-100 focus:border-brand-blue-600 focus:outline-none bg-slate-50 font-bold text-sm text-brand-blue-950 focus:bg-white transition-colors"
                    />
                  </div>

                </div>

                {/* Service type drop-down */}
                <div>
                  <label className="block text-xs font-black text-slate-600 mb-1.5">{t.formService}</label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-brand-blue-100 focus:border-brand-blue-600 focus:outline-none bg-slate-50 font-bold text-xs sm:text-sm text-brand-blue-950 cursor-pointer focus:bg-white transition-colors"
                  >
                    <option value="">{t.selectPlaceholder}</option>
                    <option value="masonry">{t.srv1}</option>
                    <option value="finishing">{t.srv2}</option>
                    <option value="maintenance">{t.srv3}</option>
                    <option value="hangars">{t.srv4}</option>
                    <option value="landscaping">{t.srv5}</option>
                  </select>
                </div>

                {/* Desc box */}
                <div>
                  <label className="block text-xs font-black text-slate-600 mb-1.5">{t.formMsg}</label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-brand-blue-100 focus:border-brand-blue-600 focus:outline-none bg-slate-50 font-bold text-sm text-brand-blue-950 focus:bg-white transition-colors"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-black transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer text-sm"
                >
                  <Send className="w-5 h-5 text-brand-blue-100" />
                  <span>{t.formBtn}</span>
                </button>

              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
