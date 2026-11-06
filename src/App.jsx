import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  Heart,
  Instagram,
  Menu,
  Moon,
  Minus,
  Package,
  Plus,
  Search,
  ShoppingBag,
  Sun,
  Truck,
  X,
  Mail,
  Phone,
  MapPin,
  Send,
  Sparkles,
} from "lucide-react";
import { products, categories } from "./data/products";
import { useLocalStorage } from "./hooks/useLocalStorage";
import ProductCard from "./components/ProductCard";
import { Overlay, Modal, Field, TrackStep } from "./components/Modal";
const money = (n) => new Intl.NumberFormat("fa-IR").format(n) + " افغانی";
const enMoney = (n) => new Intl.NumberFormat("en-US").format(n) + " AFN";
export default function App() {
  const [lang, setLang] = useLocalStorage("bahar-language", "fa"),
    [theme, setTheme] = useLocalStorage("bahar-theme", "light"),
    [cart, setCart] = useLocalStorage("bahar-cart", []);
  const [category, setCategory] = useState("همه محصولات"),
    [query, setQuery] = useState(""),
    [cartOpen, setCartOpen] = useState(false),
    [selected, setSelected] = useState(null),
    [size, setSize] = useState("M"),
    [checkout, setCheckout] = useState(false),
    [success, setSuccess] = useState(null),
    [tracking, setTracking] = useState(false),
    [trackingCode, setTrackingCode] = useState(""),
    [trackedOrder, setTrackedOrder] = useState(null),
    [mobileMenu, setMobileMenu] = useState(false),
    [contactStatus, setContactStatus] = useState("idle"),
    [contactError, setContactError] = useState(""),
    [heroSlide, setHeroSlide] = useState(0);
  const fa = lang === "fa",
    dark = theme === "dark",
    t = (f, e) => (fa ? f : e),
    fmt = (n) => (fa ? money(n) : enMoney(n)),
    count = cart.reduce((s, i) => s + i.qty, 0),
    subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0),
    shipping = subtotal > 3000 || subtotal === 0 ? 0 : 120;
  const heroSlides = [
    {
      tag: t("کالکشن تازه؛ سادگی باوقار", "THE NEW EDIT · EFFORTLESS ELEGANCE"),
      title: t(
        "هر روز، با استایل تازه‌ای شکوفا شو.",
        "A fresh way to feel like yourself.",
      ),
      copy: t(
        "لباس‌هایی برای لحظه‌های واقعی زندگی؛ راحت، خوش‌دوخت و با جزئیاتی که به سلیقه تو احترام می‌گذارند.",
        "Thoughtful pieces for real life — easy to wear, beautifully considered, and made to feel like you.",
      ),
      image: "../images/new/9.jpg",
      label: t("کالکشن بهار", "THE BAHAR EDIT"),
    },
    {
      tag: t("انتخاب‌های دوست‌داشتنی برای هر روز", "EVERYDAY PIECES, ELEVATED"),
      title: t("زیبایی در انتخاب‌های ساده است.", "Make every day your own."),
      copy: t(
        "از دورهمی‌های دوستانه تا روزهای پرمشغله، انتخاب‌هایی پیدا کن که با تو و سبک زندگی‌ات هماهنگ‌اند.",
        "From relaxed days to special moments, discover pieces that move naturally with your life.",
      ),
      image: "../images/new/10.jpg",
      label: t("استایل روزمره", "EVERYDAY STYLE"),
    },
    {
      tag: t("جزئیات کوچک، حس متفاوت", "LITTLE DETAILS, BIG FEELING"),
      title: t("استایل تو، امضای توست.", "Your style. Your signature."),
      copy: t(
        "با رنگ‌ها، فرم‌ها و اکسسوری‌هایی که دوست داری ترکیب خودت را بساز؛ بدون قانون، با سلیقه خودت.",
        "Mix the shapes, colours and details you love. There are no rules — just your point of view.",
      ),
      image: "../images/new/11.jpg",
      label: t("استایل شخصی", "YOUR SIGNATURE"),
    },
  ];
  useEffect(() => {
    const timer = setInterval(
      () => setHeroSlide((v) => (v + 1) % heroSlides.length),
      3000,
    );
    return () => clearInterval(timer);
  }, [fa]);
  const visible = useMemo(
    () =>
      products.filter(
        (p) =>
          (category === "همه محصولات" || p.category === category) &&
          `${p.name} ${p.en} ${p.category}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [category, query],
  );
  const add = (p, s = "M") => {
    setCart((old) => {
      const f = old.find((i) => i.id === p.id && i.size === s);
      return f
        ? old.map((i) =>
            i.id === p.id && i.size === s ? { ...i, qty: i.qty + 1 } : i,
          )
        : [...old, { ...p, size: s, qty: 1 }];
    });
    setSelected(null);
    setCartOpen(true);
  };
  const changeQty = (id, s, d) =>
    setCart((old) =>
      old
        .map((i) =>
          i.id === id && i.size === s ? { ...i, qty: i.qty + d } : i,
        )
        .filter((i) => i.qty > 0),
    );
  const placeOrder = (e) => {
    e.preventDefault();
    setSuccess({
      code: "BH" + Math.floor(100000 + Math.random() * 900000),
      total: subtotal + shipping,
    });
    setCart([]);
    setCheckout(false);
    setCartOpen(false);
  };
  const track = (e) => {
    e.preventDefault();
    setTrackedOrder({ code: trackingCode });
  };
  return (
    <div
      dir={fa ? "rtl" : "ltr"}
      className={`app-shell ${dark ? "theme-dark" : "theme-light"} min-h-screen`}
    >
      <div className="bg-[#563b4b] px-4 py-2 text-center text-[11px] text-white sm:text-xs">
        {t(
          "برای سفارش‌های بالای ۳۰۰۰ افغانی ارسال رایگان است",
          "Free delivery on orders over 3,000 AFN",
        )}
        　✿　{t("تازه‌ترین استایل‌ها برای تو", "Fresh styles, just for you")}
      </div>
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--surface)]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            className="md:hidden"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="منو"
          >
            <Menu size={22} />
          </button>
          <a href="#" className="flex items-center gap-3">
            <BaharLogo fa={fa} />
          </a>
          <nav
            className={`${mobileMenu ? "flex" : "hidden"} absolute right-0 top-[76px] w-full flex-col gap-5 border-b border-[var(--line)] bg-[var(--surface)] px-6 py-5 text-sm md:static md:flex md:w-auto md:flex-row md:border-0 md:bg-transparent md:p-0`}
          >
            <a
              href="#shop"
              onClick={() => setMobileMenu(false)}
              className="nav-link"
            >
              {t("فروشگاه", "Shop")}
            </a>
            <a href="#about" className="nav-link">
              {t("درباره ما", "About")}
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenu(false)}
              className="nav-link"
            >
              {t("تماس با ما", "Contact")}
            </a>
            <button
              onClick={() => setTracking(true)}
              className="nav-link text-right"
            >
              {t("پیگیری سفارش", "Track order")}
            </button>
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(dark ? "light" : "dark")}
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)]"
              aria-label="تغییر تم"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setLang(fa ? "en" : "fa")}
              className="rounded-full border border-[var(--line)] px-3 py-2 text-[11px] font-bold"
            >
              {fa ? "EN" : "فارسی"}
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="relative grid h-10 w-10 place-items-center rounded-full bg-[var(--surface-2)]"
            >
              <ShoppingBag size={19} />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] text-white">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      <main>
        <section className="hero-section relative mx-auto max-w-[1600px] overflow-hidden px-4 py-8 sm:px-6 md:min-h-[690px] md:px-10 md:py-12 lg:px-16">
          <div className="hero-orb hero-orb-one" />
          <div className="hero-orb hero-orb-two" />
          <div className="relative z-10 grid items-center gap-8 md:grid-cols-[.9fr_1.1fr] md:gap-12">
            <div className="order-2 py-4 md:order-1 md:py-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={heroSlide}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-200/70 bg-[var(--surface)]/80 px-4 py-2 text-[11px] font-bold text-rose-600 shadow-sm">
                    <Sparkles size={14} />
                    {heroSlides[heroSlide].tag}
                  </div>
                  <h1 className="max-w-2xl whitespace-pre-line text-[2.65rem] font-black leading-[1.5] tracking-tight sm:text-6xl lg:text-[4.4rem]">
                    <span className="hero-highlight">
                      {heroSlides[heroSlide].title}
                    </span>
                  </h1>
                  <p className="mt-6 max-w-lg text-sm leading-8 text-[var(--muted)] sm:text-base">
                    {heroSlides[heroSlide].copy}
                  </p>
                </motion.div>
              </AnimatePresence>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#shop"
                  className="hero-cta inline-flex items-center gap-3 rounded-full bg-rose-500 px-7 py-4 text-sm font-bold text-white shadow-blush"
                >
                  {t("دیدن کالکشن", "Explore collection")}
                  <ArrowLeft size={16} />
                </a>
                <a
                  href="#about"
                  className="rounded-full border border-[var(--line)] px-6 py-4 text-sm font-bold transition hover:border-rose-400 hover:text-rose-600"
                >
                  {t("داستان بهار", "Our story")}
                </a>
              </div>
              <div className="mt-10 flex items-center justify-between border-t border-[var(--line)] pt-6">
                <div className="flex gap-2">
                  {heroSlides.map((slide, i) => (
                    <button
                      key={slide.label}
                      onClick={() => setHeroSlide(i)}
                      aria-label={`Slide ${i + 1}`}
                      className={`h-2.5 rounded-full transition-all ${heroSlide === i ? "w-9 bg-rose-500" : "w-2.5 bg-rose-200 hover:bg-rose-400"}`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold tabular-nums">
                    0{heroSlide + 1} / 0{heroSlides.length}
                  </span>
                  <button
                    onClick={() =>
                      setHeroSlide(
                        (v) => (v + heroSlides.length - 1) % heroSlides.length,
                      )
                    }
                    className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] transition hover:border-rose-400 hover:bg-rose-500 hover:text-white"
                    aria-label="Previous slide"
                  >
                    <ArrowRight size={16} />
                  </button>
                  <button
                    onClick={() =>
                      setHeroSlide((v) => (v + 1) % heroSlides.length)
                    }
                    className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] transition hover:border-rose-400 hover:bg-rose-500 hover:text-white"
                    aria-label="Next slide"
                  >
                    <ArrowLeft size={16} />
                  </button>
                </div>
              </div>
            </div>
            <div className="relative order-1 mx-auto h-[390px] w-full max-w-[620px] md:order-2 md:h-[570px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={heroSlide}
                  initial={{ opacity: 0, scale: 1.04, x: fa ? 18 : -18 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.55 }}
                  className="absolute inset-0 overflow-hidden rounded-[2.4rem] shadow-blush"
                >
                  <img
                    src={heroSlides[heroSlide].image}
                    alt={heroSlides[heroSlide].label}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#241923]/45 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 rounded-full border border-white/50 bg-white/90 px-5 py-3 text-xs font-black tracking-wider text-[#563b4b]">
                    BAHAR · {heroSlides[heroSlide].label}
                  </div>
                </motion.div>
              </AnimatePresence>
              {/* <div className="pointer-events-none absolute -right-3 -top-3 grid h-20 w-20 place-items-center rounded-full bg-rose-500 text-center text-xs font-black leading-5 text-white shadow-blush md:-right-5 md:top-7">
                NEW
                <br />
                SEASON
                <br />✿
              </div> */}
              <div className="pointer-events-none absolute -bottom-4 right-6 rounded-2xl border border-white/60 bg-[var(--surface)]/95 px-5 py-4 shadow-blush backdrop-blur">
                <span className="text-[10px] font-bold tracking-[.2em] text-rose-500">
                  BAHAR STORE
                </span>
                <p className="mt-1 text-sm font-extrabold">
                  {t("با سلیقه خودت بدرخش", "Wear what feels like you")}
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          id="shop"
          className="scroll-mt-24 bg-[var(--surface)] py-16 sm:py-20"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow">{t("دنیای بهار", "THE BAHAR EDIT")}</p>
                <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                  {t("چیزهای قشنگ برای تو", "Lovely things, just for you")}
                </h2>
                <p className="mt-3 text-sm text-[var(--muted)]">
                  {t(
                    "انتخاب‌های تازه برای استایل هر روزت.",
                    "Fresh picks for every version of your day.",
                  )}
                </p>
              </div>
              <div className="relative w-full sm:max-w-xs">
                <Search
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  size={17}
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("جستجوی محصول...", "Search products...")}
                  className="w-full rounded-full border border-[var(--line)] bg-[var(--surface-2)] py-3.5 pr-11 pl-4 text-sm outline-none focus:border-rose-400"
                />
              </div>
            </div>
            <div className="mt-9 flex gap-2 overflow-x-auto pb-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-bold ${category === c ? "bg-rose-500 text-white" : "bg-[var(--surface-2)] text-[var(--muted)]"}`}
                >
                  {fa
                    ? c
                    : {
                        "همه محصولات": "All items",
                        شال: "Shal",
                        واسکت: "Waskat",
                        کلاه: "Kulah",
                        چادر: "Chadar",
                        اکسسوری: "Accessories",
                      }[c]}
                </button>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {visible.map((p, i) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    index={i}
                    fa={fa}
                    money={fmt}
                    onOpen={() => {
                      setSelected(p);
                      setSize(p.sizes.includes("M") ? "M" : p.sizes[0]);
                    }}
                    onQuickAdd={() =>
                      add(p, p.sizes.includes("M") ? "M" : p.sizes[0])
                    }
                  />
                ))}
              </AnimatePresence>
            </div>
            {!visible.length && (
              <p className="py-20 text-center text-sm text-[var(--muted)]">
                {t("محصولی پیدا نشد.", "No products found.")}
              </p>
            )}
          </div>
        </section>
        <section
          id="about"
          className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24 lg:px-8"
        >
          <div className="overflow-hidden rounded-[2rem]">
            <img
              src="../images/new/12.jpg"
              alt="Bahar women fashion"
              className="h-[340px] w-full object-cover"
            />
          </div>
          <div className="md:px-8">
            <p className="eyebrow">{t("داستان بهار", "OUR STORY")}</p>
            <h2 className="mt-4 text-3xl font-black leading-[1.6] sm:text-4xl">
              {t(
                "برای خودت لباس بپوش،\\nبرای خودت بدرخش.",
                "Dress for yourself.\\nShine for yourself.",
              )
                .split("\\n")
                .map((x) => (
                  <span key={x} className="block">
                    {x}
                  </span>
                ))}
            </h2>
            <p className="mt-5 text-sm leading-8 text-[var(--muted)]">
              {t(
                "بهار استور جایی برای کشف استایل شخصی توست؛ مجموعه‌ای از لباس‌ها و اکسسوری‌های دخترانه و زنانه که با عشق و سادگی انتخاب شده‌اند.",
                "Bahar is a place to explore your personal style — a considered collection for girls and women, chosen with care.",
              )}
            </p>
          </div>
        </section>
        <section
          id="contact"
          className="scroll-mt-24 bg-[var(--surface)] py-16 sm:py-20"
        >
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-[.8fr_1.2fr] md:gap-16 lg:px-8">
            <div>
              <p className="eyebrow">{t("در تماس باشیم", "LET’S TALK")}</p>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                {t("ما اینجاییم تا کمک کنیم.", "We’re here to help.")}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-8 text-[var(--muted)]">
                {t(
                  "درباره محصولات، سایزبندی، ارسال یا سفارش خود سوالی داری؟ پیام بفرست؛ تیم بهار خوشحال می‌شود راهنمایی‌ات کند.",
                  "Questions about a product, sizing, delivery or an order? Send us a message and the Bahar team will be happy to help.",
                )}
              </p>
              <div className="mt-8 space-y-5">
                <ContactInfo
                  icon={<Mail size={18} />}
                  title={t("ایمیل", "Email")}
                  value={t(
                    "از طریق فرم پیام بفرستید",
                    "Send us a message using the form",
                  )}
                />
                <ContactInfo
                  icon={<Phone size={18} />}
                  title={t("پشتیبانی", "Support")}
                  value={t("از طریق فرم تماس", "Use the contact form")}
                />
                <ContactInfo
                  icon={<MapPin size={18} />}
                  title={t("محدوده خدمات", "Service area")}
                  value={t(
                    "کابل، افغانستان و ارسال سراسری",
                    "Kabul, Afghanistan · Nationwide delivery",
                  )}
                />
              </div>
            </div>
            <div className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface-2)] p-5 sm:p-8">
              {contactStatus === "sent" ? (
                <div className="grid min-h-[340px] place-items-center text-center">
                  <div>
                    <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-rose-500 text-white">
                      <Check />
                    </span>
                    <h3 className="mt-5 text-xl font-black">
                      {t("پیام شما ارسال شد!", "Your message was sent!")}
                    </h3>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      {t(
                        "پیام شما به تیم بهار رسید. به‌زودی با شما تماس می‌گیریم.",
                        "Your message has reached the Bahar team. We’ll get back to you soon.",
                      )}
                    </p>
                    <button
                      onClick={() => setContactStatus("idle")}
                      className="mt-6 rounded-full border border-[var(--line)] px-5 py-3 text-xs font-bold transition hover:border-rose-400 hover:bg-rose-500 hover:text-white"
                    >
                      {t("ارسال پیام دیگر", "Send another message")}
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    setContactStatus("sending");
                    setContactError("");
                    const fd = new FormData(e.currentTarget);
                    const payload = Object.fromEntries(fd.entries());
                    try {
                      const response = await fetch(
                        `${import.meta.env.VITE_API_URL || ""}/api/contact`,
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(payload),
                        },
                      );
                      const result = await response.json();
                      if (!response.ok)
                        throw new Error(
                          result.message || "Unable to send message",
                        );
                      setContactStatus("sent");
                      form.reset();
                    } catch (err) {
                      setContactStatus("error");
                      setContactError(
                        err.message ||
                          t(
                            "ارسال پیام ناموفق بود. دوباره تلاش کنید.",
                            "Message could not be sent. Please try again.",
                          ),
                      );
                    }
                  }}
                  className="space-y-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-bold">
                        {t("نام شما", "Your name")}
                      </label>
                      <input
                        name="name"
                        autoComplete="name"
                        required
                        minLength="2"
                        maxLength="80"
                        placeholder={t("نام و نام خانوادگی", "Full name")}
                        className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-rose-400"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-bold">
                        {t("ایمیل شما", "Your email")}
                      </label>
                      <input
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        maxLength="120"
                        placeholder="name@example.com"
                        className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-rose-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold">
                      {t("موضوع پیام", "Message subject")}
                    </label>
                    <select
                      name="subject"
                      required
                      defaultValue=""
                      className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-rose-400"
                    >
                      <option value="" disabled>
                        {t("یک موضوع انتخاب کنید", "Choose a topic")}
                      </option>
                      <option value="Product question">
                        {t("پرسش درباره محصول", "Product question")}
                      </option>
                      <option value="Sizing and availability">
                        {t("سایزبندی و موجودی", "Sizing and availability")}
                      </option>
                      <option value="Delivery and order">
                        {t("ارسال و سفارش", "Delivery and order")}
                      </option>
                      <option value="Other">{t("سایر موارد", "Other")}</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold">
                      {t("پیام شما", "Your message")}
                    </label>
                    <textarea
                      name="message"
                      required
                      minLength="10"
                      maxLength="4000"
                      rows={5}
                      placeholder={t(
                        "چطور می‌توانیم کمکتان کنیم؟",
                        "How can we help you?",
                      )}
                      className="w-full resize-y rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)] focus:border-rose-400"
                    />
                  </div>
                  <div className="hidden" aria-hidden="true">
                    <label>
                      Leave this field empty
                      <input name="website" tabIndex="-1" autoComplete="off" />
                    </label>
                  </div>
                  {contactStatus === "error" && (
                    <p
                      role="alert"
                      className="rounded-xl bg-red-50 px-4 py-3 text-xs text-red-700"
                    >
                      {contactError}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={contactStatus === "sending"}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-rose-500 py-4 text-sm font-bold text-white transition hover:bg-rose-600 disabled:cursor-wait disabled:opacity-60"
                  >
                    <Send size={16} />
                    {contactStatus === "sending"
                      ? t("در حال ارسال...", "Sending...")
                      : t("ارسال پیام", "Send message")}
                  </button>
                  <p className="text-[10px] leading-6 text-[var(--muted)]">
                    {t(
                      "پیام شما به ایمیل مدیریت فروشگاه ارسال می‌شود.",
                      "Your message is delivered to the store owner’s configured email address.",
                    )}
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>
        <section className="border-y border-[var(--line)] bg-[var(--surface)] py-10">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-7 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
            <Benefit
              icon={<Truck />}
              title={t("ارسال مطمئن", "Reliable delivery")}
              desc={t(
                "ارسال به سراسر افغانستان",
                "Delivery across Afghanistan",
              )}
            />
            <Benefit
              icon={<Package />}
              title={t("بسته‌بندی زیبا", "Lovely packaging")}
              desc={t(
                "هر سفارش با دقت آماده می‌شود",
                "Every order packed with care",
              )}
            />
            <Benefit
              icon={<Heart />}
              title={t("همیشه کنار تو", "Here for you")}
              desc={t(
                "پشتیبانی پیش و پس از خرید",
                "Support before and after purchase",
              )}
            />
          </div>
        </section>
      </main>
      <footer className="site-footer bg-[#382a35] py-12 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-4 sm:px-6 md:flex-row md:items-end lg:px-8">
          <div>
            <BaharLogo fa={fa} inverted />
            <p className="mt-3 text-xs text-white/55">
              {t(
                "استایل تو، انتخاب تو، بهار تو.",
                "Your style, your choice, your Bahar.",
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4 text-xs text-white/65">
            <a href="#shop">{t("فروشگاه", "Shop")}</a>
            <button onClick={() => setTracking(true)}>
              {t("پیگیری سفارش", "Track order")}
            </button>
            <a href="#contact">{t("تماس با ما", "Contact us")}</a>
            <a href="#" aria-label="Instagram">
              <Instagram size={16} />
            </a>
          </div>
          <div className="flex items-center justify-between gap-5">
            <p className="text-[10px] text-white/35">© 2026 BAHAR STORE</p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="back-to-top inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-3 text-xs font-bold text-white/80 transition"
              aria-label={t("بازگشت به بالا", "Back to top")}
            >
              <ArrowUp size={15} />
              {t("بازگشت به بالا", "Back to top")}
            </button>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {cartOpen && (
          <>
            <Overlay onClose={() => setCartOpen(false)} />
            <motion.aside
              initial={{ x: fa ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: fa ? "100%" : "-100%" }}
              className={`fixed ${fa ? "right-0" : "left-0"} top-0 z-[80] flex h-full w-full max-w-md flex-col bg-[var(--surface)] text-[var(--text)] shadow-2xl`}
            >
              <div className="flex items-center justify-between border-b border-[var(--line)] px-6 py-5">
                <div>
                  <h3 className="font-black">{t("سبد خرید", "Your bag")}</h3>
                  <p className="text-xs text-[var(--muted)]">
                    {count} {t("قلم کالا", "items")}
                  </p>
                </div>
                <button onClick={() => setCartOpen(false)}>
                  <X />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6">
                {cart.length ? (
                  cart.map((item) => (
                    <div
                      key={item.id + item.size}
                      className="flex gap-4 border-b border-[var(--line)] py-4"
                    >
                      <img
                        src={item.image}
                        className="h-24 w-20 rounded-xl object-cover"
                      />
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <b className="text-sm">{fa ? item.name : item.en}</b>
                          <p className="text-xs text-[var(--muted)]">
                            {t("سایز", "Size")}: {item.size}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">
                            {fmt(item.price)}
                          </span>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => changeQty(item.id, item.size, -1)}
                            >
                              <Minus size={13} />
                            </button>
                            {item.qty}
                            <button
                              onClick={() => changeQty(item.id, item.size, 1)}
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="grid h-full place-items-center text-sm text-[var(--muted)]">
                    {t("سبد خرید خالی است", "Your bag is empty")}
                  </div>
                )}
              </div>
              {cart.length > 0 && (
                <div className="border-t border-[var(--line)] p-6">
                  <div className="flex justify-between text-sm">
                    <span>{t("مجموع", "Total")}</span>
                    <b>{fmt(subtotal + shipping)}</b>
                  </div>
                  <button
                    onClick={() => setCheckout(true)}
                    className="mt-5 w-full rounded-full bg-rose-500 py-4 text-sm font-bold text-white"
                  >
                    {t("ادامه و ثبت سفارش", "Continue to checkout")}
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selected && (
          <>
            <Overlay onClose={() => setSelected(null)} />
            <Modal onClose={() => setSelected(null)}>
              <div className="grid md:grid-cols-2">
                <img
                  src={selected.image}
                  alt={fa ? selected.name : selected.en}
                  className="h-64 w-full object-cover sm:h-80 md:h-full md:min-h-[470px]"
                />
                <div className="p-6 pt-16 sm:p-8 sm:pt-16">
                  <p className="eyebrow">
                    {fa ? selected.category : selected.categoryEn}
                  </p>
                  <h3 className="mt-3 text-2xl font-black">
                    {fa ? selected.name : selected.en}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                    {selected.description}
                  </p>
                  <p className="mt-5 text-lg font-black">
                    {fmt(selected.price)}
                  </p>
                  <p className="mt-7 text-xs font-bold">
                    {t("انتخاب سایز", "Select size")}
                  </p>
                  <div className="mt-3 flex gap-2">
                    {selected.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`grid h-10 min-w-10 place-items-center rounded-full border px-3 text-xs ${size === s ? "border-rose-500 bg-rose-500 text-white" : "border-[var(--line)] bg-[var(--surface-2)]"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => add(selected, size)}
                    className="mt-8 w-full rounded-full bg-rose-500 py-4 text-sm font-bold text-white"
                  >
                    {t("افزودن به سبد خرید", "Add to bag")}
                  </button>
                </div>
              </div>
            </Modal>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {checkout && (
          <>
            <Overlay onClose={() => setCheckout(false)} />
            <Modal onClose={() => setCheckout(false)} maxWidth="max-w-xl">
              <div className="p-6 pt-16 sm:p-8">
                <h3 className="text-2xl font-black">
                  {t("اطلاعات تحویل سفارش", "Delivery details")}
                </h3>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  {t(
                    "نسخه نمایشی؛ پرداخت واقعی انجام نمی‌شود.",
                    "Demo only; no real payment.",
                  )}
                </p>
                <form onSubmit={placeOrder} className="mt-6 space-y-4">
                  <Field
                    label={t("نام و نام خانوادگی", "Full name")}
                    placeholder={t("نام شما", "Your name")}
                    required
                  />
                  <Field
                    label={t("شماره تماس", "Phone number")}
                    placeholder="07XX XXX XXX"
                    required
                  />
                  <Field
                    label={t("آدرس تحویل", "Delivery address")}
                    placeholder={t(
                      "ولایت، شهر و نشانی دقیق",
                      "Province, city and full address",
                    )}
                    required
                  />
                  <p className="rounded-xl bg-[var(--surface-2)] p-4 text-xs">
                    {t(
                      "پرداخت هنگام تحویل؛ درگاه آنلاین وصل نشده است.",
                      "Cash on delivery; online payment is not connected.",
                    )}
                  </p>
                  <button className="w-full rounded-full bg-rose-500 py-4 text-sm font-bold text-white">
                    {t("تأیید سفارش", "Confirm order")} ·{" "}
                    {fmt(subtotal + shipping)}
                  </button>
                </form>
              </div>
            </Modal>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {success && (
          <>
            <Overlay onClose={() => setSuccess(null)} />
            <Modal onClose={() => setSuccess(null)} maxWidth="max-w-md">
              <div className="p-8 pt-16 text-center">
                <Check size={36} className="mx-auto text-rose-500" />
                <h3 className="mt-4 text-2xl font-black">
                  {t("سفارش ثبت شد!", "Order placed!")}
                </h3>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {t("شماره پیگیری شما:", "Your tracking number:")}
                </p>
                <b className="mt-4 inline-block rounded-xl bg-[var(--surface-2)] px-5 py-3 text-lg">
                  {success.code}
                </b>
                <p className="mt-3 text-xs text-[var(--muted)]">
                  {fmt(success.total)}
                </p>
                <button
                  onClick={() => {
                    setTrackingCode(success.code);
                    setSuccess(null);
                    setTracking(true);
                  }}
                  className="mt-7 w-full rounded-full bg-rose-500 py-4 text-sm font-bold text-white"
                >
                  {t("پیگیری سفارش", "Track order")}
                </button>
              </div>
            </Modal>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {tracking && (
          <>
            <Overlay
              onClose={() => {
                setTracking(false);
                setTrackedOrder(null);
              }}
            />
            <Modal
              onClose={() => {
                setTracking(false);
                setTrackedOrder(null);
              }}
              maxWidth="max-w-xl"
            >
              <div className="p-6 pt-16 sm:p-8">
                <h3 className="text-2xl font-black">
                  {t("پیگیری سفارش", "Track your order")}
                </h3>
                <form onSubmit={track} className="mt-6 flex gap-2">
                  <input
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    placeholder="BH284615"
                    className="min-w-0 flex-1 rounded-full border border-[var(--line)] bg-[var(--surface-2)] px-5 py-3 text-sm"
                    required
                  />
                  <button className="rounded-full bg-rose-500 px-5 text-xs font-bold text-white">
                    {t("پیگیری", "Track")}
                  </button>
                </form>
                {trackedOrder && (
                  <div className="mt-8 space-y-5 rounded-2xl bg-[var(--surface-2)] p-5">
                    <b>{trackedOrder.code}</b>
                    <TrackStep
                      active
                      title={t("سفارش دریافت شد", "Order received")}
                      desc={t(
                        "سفارش شما ثبت شده است.",
                        "Your order has been received.",
                      )}
                    />
                    <TrackStep
                      active
                      title={t("در حال آماده‌سازی", "Preparing")}
                      desc={t(
                        "سفارش در حال آماده‌سازی است.",
                        "Your order is being prepared.",
                      )}
                    />
                    <TrackStep
                      title={t("تحویل به پیک", "With courier")}
                      desc={t(
                        "پس از ارسال به‌روزرسانی می‌شود.",
                        "Updates after dispatch.",
                      )}
                    />
                    <TrackStep
                      title={t("تحویل شده", "Delivered")}
                      desc={t(
                        "از انتخاب شما سپاسگزاریم.",
                        "Thank you for choosing Bahar.",
                      )}
                    />
                    <small className="text-[var(--muted)]">
                      {t(
                        "اطلاعات پیگیری نمایشی است.",
                        "Tracking is simulated.",
                      )}
                    </small>
                  </div>
                )}
              </div>
            </Modal>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
function BaharLogo({ fa, inverted = false }) {
  return (
    <span className="inline-flex items-center gap-3">
      <svg
        viewBox="0 0 64 64"
        role="img"
        aria-label="Bahar Store floral logo"
        className="h-12 w-12 shrink-0"
      >
        <defs>
          <linearGradient id="baharPetal" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#f7b9b8" />
            <stop offset="1" stopColor="#c8757c" />
          </linearGradient>
        </defs>
        <circle
          cx="32"
          cy="32"
          r="29"
          fill={inverted ? "#fff" : "#563b4b"}
          opacity=".96"
        />
        <g fill="url(#baharPetal)" transform="translate(32 32)">
          <ellipse cx="0" cy="-12" rx="6.5" ry="12" />
          <ellipse cx="0" cy="-12" rx="6.5" ry="12" transform="rotate(60)" />
          <ellipse cx="0" cy="-12" rx="6.5" ry="12" transform="rotate(120)" />
          <ellipse cx="0" cy="-12" rx="6.5" ry="12" transform="rotate(180)" />
          <ellipse cx="0" cy="-12" rx="6.5" ry="12" transform="rotate(240)" />
          <ellipse cx="0" cy="-12" rx="6.5" ry="12" transform="rotate(300)" />
        </g>
        <circle cx="32" cy="32" r="4" fill="#fff2d8" />
        <path
          d="M32 43c-4 5-10 7-15 5 3-6 8-9 15-9m0 4c4 5 10 7 15 5-3-6-8-9-15-9"
          fill="none"
          stroke={inverted ? "#563b4b" : "#fff"}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      <span>
        <b
          className={`block text-xl font-black leading-tight ${inverted ? "text-white" : "text-[var(--text)]"}`}
        >
          {fa ? "فروشگاه بهار" : "Bahar Store"}
        </b>
        {/* <small
          className={`block text-[9px] tracking-[.22em] ${inverted ? "text-white/55" : "text-[var(--muted)]"}`}
        >
          BLOOM IN YOUR STYLE
        </small> */}
      </span>
    </span>
  );
}
function Benefit({ icon, title, desc }) {
  return (
    <div className="flex items-center gap-4">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-rose-100 text-rose-600">
        {icon}
      </span>
      <div>
        <h3 className="text-sm font-bold">{title}</h3>
        <p className="mt-1 text-xs text-[var(--muted)]">{desc}</p>
      </div>
    </div>
  );
}
function ContactInfo({ icon, title, value }) {
  return (
    <div className="flex items-center gap-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-600">
        {icon}
      </span>
      <div>
        <p className="text-xs text-[var(--muted)]">{title}</p>
        <p className="mt-1 text-sm font-bold">{value}</p>
      </div>
    </div>
  );
}
