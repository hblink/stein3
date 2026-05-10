"use client";

import { useState, useEffect, useRef } from "react";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const NAV_LINKS = [
  { label: "Collection", href: "#collection" },
  { label: "Design Yours", href: "#design" },
  { label: "Our Story", href: "#story" },
  { label: "Sustainability", href: "#sustainability" },
  { label: "Orders", href: "/orders" },
];

const NECKLACES = [
  {
    id: "n1",
    name: "Whispering Leaves",
    price: 148,
    material: "Recycled Silver & Reclaimed Wood",
    color: "from-sage/20 to-gold/20",
    accent: "bg-sage",
    description: "Delicate leaf pendants on a fine chain, each unique as nature itself.",
  },
  {
    id: "n2",
    name: "Golden Hour",
    price: 195,
    material: "Fair-Mined Gold & Recycled Glass",
    color: "from-gold/20 to-terracotta/20",
    accent: "bg-gold",
    description: "Sun-kissed pendant that catches light like a meadow at dusk.",
  },
  {
    id: "n3",
    name: "Tide & Time",
    price: 172,
    material: "Recycled Silver & Sea Glass",
    color: "from-pearl/40 to-sage/20",
    accent: "bg-pearl",
    description: "Ocean-tumbled glass set in hand-forged silver, carrying the sea's story.",
  },
  {
    id: "n4",
    name: "Earth & Ember",
    price: 225,
    material: "Reclaimed Copper & Ethical Garnet",
    color: "from-terracotta/20 to-gold/20",
    accent: "bg-terracotta",
    description: "Warm copper curves cradling a garnet that glows like a campfire.",
  },
];

const BRACELETS = [
  {
    id: "b1",
    name: "Woven Meadow",
    price: 98,
    material: "Organic Cotton & Recycled Beads",
    color: "from-sage/20 to-cream/40",
    accent: "bg-sage",
    description: "Hand-woven threads in earth tones with sustainable glass accents.",
  },
  {
    id: "b2",
    name: "Moonstone Cuff",
    price: 165,
    material: "Recycled Silver & Ethical Moonstone",
    color: "from-pearl/30 to-gold/10",
    accent: "bg-gold-pale",
    description: "A sculptural cuff with a moonstone that shifts with the light.",
  },
  {
    id: "b3",
    name: "Roots & Rings",
    price: 120,
    material: "Reclaimed Brass & Wooden Beads",
    color: "from-gold/10 to-terracotta/10",
    accent: "bg-gold",
    description: "Interlocking rings and natural beads — strength meets softness.",
  },
  {
    id: "b4",
    name: "River Stone",
    price: 135,
    material: "Recycled Silver & Polished River Stone",
    color: "from-charcoal/10 to-sage/10",
    accent: "bg-charcoal-light",
    description: "A smooth river stone set in silver, worn by water over centuries.",
  },
];

const DESIGN_OPTIONS = {
  type: ["Necklace", "Bracelet"],
  metal: ["Recycled Silver", "Reclaimed Gold", "Copper", "Brass"],
  stone: [
    "Ethical Garnet",
    "Moonstone",
    "River Stone",
    "Sea Glass",
    "None",
  ],
  length: ["Petite (14\")", "Classic (18\")", "Statement (22\")"],
  finish: ["Polished", "Matte", "Hammered", "Oxidized"],
};

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-dark py-3" : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border border-gold/60 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-gold/80" />
          </div>
          <span
            className="font-display text-xl tracking-widest text-cream uppercase"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Lumière
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-cream/70 hover:text-gold transition-colors text-sm tracking-wider uppercase font-body"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#design"
            className="ml-4 px-5 py-2 rounded-full border border-gold/50 text-gold text-sm tracking-wider uppercase hover:bg-gold/10 transition-all"
          >
            Design Yours
          </a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-cream/80 hover:text-gold transition-colors"
          aria-label="Menu"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {mobileOpen ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden glass-dark mt-2 mx-4 rounded-2xl p-6 flex flex-col gap-4 animate-fade-in">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="text-cream/80 hover:text-gold transition-colors text-sm tracking-wider uppercase"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-charcoal grain-overlay">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-gold/5 blur-[120px] animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-terracotta/5 blur-[100px] animate-pulse-soft" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full bg-sage/5 blur-[80px] animate-pulse-soft" style={{ animationDelay: "3s" }} />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <p className="text-gold/80 text-sm tracking-[0.3em] uppercase mb-6 font-body">
            Handcrafted with Love · Sustainably Made
          </p>
        </div>

        <h1
          className="animate-fade-up text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display text-cream leading-[1.05] mb-6"
          style={{ fontFamily: "var(--font-display)", animationDelay: "0.4s" }}
        >
          Adorn Yourself in{" "}
          <span className="text-gradient-gold italic">Intention</span>
        </h1>

        <p
          className="animate-fade-up text-cream/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-body leading-relaxed"
          style={{ animationDelay: "0.6s" }}
        >
          Every piece is handmade with loving care — from sustainable materials
          that honor the earth, to designs that celebrate your unique story.
        </p>

        <div className="animate-fade-up flex flex-col sm:flex-row gap-4 justify-center" style={{ animationDelay: "0.8s" }}>
          <a
            href="#collection"
            className="px-8 py-3.5 rounded-full bg-gold text-charcoal font-semibold tracking-wider uppercase text-sm hover:bg-gold-light transition-all hover:shadow-[0_0_30px_rgba(201,169,110,0.4)]"
          >
            Explore Collection
          </a>
          <a
            href="#design"
            className="px-8 py-3.5 rounded-full border border-cream/30 text-cream/80 tracking-wider uppercase text-sm hover:border-gold/60 hover:text-gold transition-all"
          >
            Design Your Own
          </a>
        </div>

        <div className="animate-fade-up mt-20 flex items-center justify-center gap-12 text-cream/40" style={{ animationDelay: "1s" }}>
          <div className="text-center">
            <p className="text-3xl font-display text-cream/70" style={{ fontFamily: "var(--font-display)" }}>2,400+</p>
            <p className="text-xs tracking-widest uppercase mt-1">Pieces Crafted</p>
          </div>
          <div className="w-px h-10 bg-cream/10" />
          <div className="text-center">
            <p className="text-3xl font-display text-cream/70" style={{ fontFamily: "var(--font-display)" }}>100%</p>
            <p className="text-xs tracking-widest uppercase mt-1">Sustainable</p>
          </div>
          <div className="w-px h-10 bg-cream/10" />
          <div className="text-center">
            <p className="text-3xl font-display text-cream/70" style={{ fontFamily: "var(--font-display)" }}>1</p>
            <p className="text-xs tracking-widest uppercase mt-1">Of a Kind</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float z-10">
        <svg width="24" height="36" viewBox="0 0 24 36" fill="none" className="text-cream/30">
          <rect x="1" y="1" width="22" height="34" rx="11" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  index,
}: {
  product: (typeof NECKLACES)[0];
  index: number;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`group relative rounded-3xl overflow-hidden hover-lift cursor-pointer ${
        inView ? "animate-scale-in" : "opacity-0"
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${product.color}`} />
      <div className="absolute inset-0 grain-overlay" />
      <div className="relative z-10 p-6 sm:p-8 flex flex-col h-full min-h-[340px]">
        <div className="flex items-start justify-between mb-6">
          <span className="text-xs tracking-widest uppercase text-charcoal/50 font-body">
            {product.material}
          </span>
          <div className={`w-3 h-3 rounded-full ${product.accent}`} />
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border-2 border-dashed border-charcoal/10 group-hover:border-gold/30 transition-colors flex items-center justify-center">
            <div className={`w-20 h-20 rounded-full ${product.accent}/30 group-hover:scale-110 transition-transform duration-500`} />
          </div>
        </div>

        <div>
          <h3
            className="text-2xl font-display text-charcoal mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {product.name}
          </h3>
          <p className="text-charcoal/50 text-sm font-body mb-4 leading-relaxed">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-display text-charcoal" style={{ fontFamily: "var(--font-display)" }}>
              ${product.price}
            </span>
            <button className="px-4 py-2 rounded-full border border-charcoal/20 text-xs tracking-wider uppercase text-charcoal/60 hover:bg-charcoal hover:text-cream transition-all">
              Add to Bag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CollectionSection() {
  const [tab, setTab] = useState<"necklaces" | "bracelets">("necklaces");
  const { ref, inView } = useInView();

  const items = tab === "necklaces" ? NECKLACES : BRACELETS;

  return (
    <section id="collection" className="relative py-24 md:py-32 bg-cream">
      <div className="absolute inset-0 grain-overlay" />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div
          ref={ref}
          className={`text-center mb-16 ${inView ? "animate-fade-up" : "opacity-0"}`}
        >
          <p className="text-sage text-sm tracking-[0.3em] uppercase mb-4 font-body">
            The Collection
          </p>
          <h2
            className="text-4xl md:text-5xl font-display text-charcoal mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Made by Hand,{" "}
            <span className="italic text-terracotta">Worn by Heart</span>
          </h2>
          <p className="text-charcoal/50 max-w-lg mx-auto font-body">
            Each piece is lovingly crafted using sustainable materials — no two
            are ever the same.
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-12 bg-charcoal/5 rounded-full p-1.5 max-w-xs mx-auto">
          {(["necklaces", "bracelets"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2 rounded-full text-sm tracking-wider uppercase transition-all font-body ${
                tab === t
                  ? "bg-charcoal text-cream shadow-lg"
                  : "text-charcoal/50 hover:text-charcoal/70"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DesignYourOwn() {
  const [selections, setSelections] = useState({
    type: "Necklace",
    metal: "Recycled Silver",
    stone: "Moonstone",
    length: "Classic (18\")",
    finish: "Polished",
  });
  const [hovered, setHovered] = useState<string | null>(null);
  const { ref, inView } = useInView();

  const metalColors: Record<string, string> = {
    "Recycled Silver": "from-neutral-300 to-neutral-400",
    "Reclaimed Gold": "from-gold to-gold-light",
    Copper: "from-terracotta to-terracotta-light",
    Brass: "from-gold-light to-gold-pale",
  };

  const stoneColors: Record<string, string> = {
    "Ethical Garnet": "bg-terracotta",
    Moonstone: "bg-pearl",
    "River Stone": "bg-charcoal-light",
    "Sea Glass": "bg-sage",
    None: "bg-transparent",
  };

  return (
    <section
      id="design"
      className="relative py-24 md:py-32 bg-charcoal overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gold/3 blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-sage/5 blur-[120px]" />
      </div>
      <div className="absolute inset-0 grain-overlay" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div
          ref={ref}
          className={`text-center mb-16 ${inView ? "animate-fade-up" : "opacity-0"}`}
        >
          <p className="text-gold/70 text-sm tracking-[0.3em] uppercase mb-4 font-body">
            Create Your Own
          </p>
          <h2
            className="text-4xl md:text-5xl font-display text-cream mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Design <span className="italic text-gradient-gold">Your</span> Story
          </h2>
          <p className="text-cream/50 max-w-lg mx-auto font-body">
            Choose every detail. We&apos;ll handcraft your vision into a one-of-a-kind
            piece that&apos;s uniquely yours.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="glass rounded-3xl p-8 space-y-8">
            {(Object.entries(DESIGN_OPTIONS) as [keyof typeof selections, string[]][]).map(
              ([category, options]) => (
                <div key={category}>
                  <label className="text-cream/40 text-xs tracking-widest uppercase mb-3 block font-body">
                    {category}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() =>
                          setSelections((s) => ({ ...s, [category]: opt }))
                        }
                        onMouseEnter={() => setHovered(`${category}-${opt}`)}
                        onMouseLeave={() => setHovered(null)}
                        className={`px-4 py-2 rounded-full text-sm transition-all font-body ${
                          selections[category] === opt
                            ? "bg-gold text-charcoal shadow-lg shadow-gold/20"
                            : "border border-cream/15 text-cream/50 hover:border-gold/40 hover:text-cream/70"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )
            )}

            <button className="w-full py-4 rounded-full bg-gold text-charcoal font-semibold tracking-wider uppercase hover:bg-gold-light transition-all hover:shadow-[0_0_30px_rgba(201,169,110,0.4)]">
              Begin Crafting — From $89
            </button>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-sm aspect-square">
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={`absolute w-64 h-64 rounded-full bg-gradient-to-br ${
                    metalColors[selections.metal] || "from-neutral-300 to-neutral-400"
                  } opacity-20 blur-2xl transition-all duration-700`}
                />
                <div className="relative w-48 h-48 rounded-full border border-cream/10 flex items-center justify-center glass">
                  <div
                    className={`w-32 h-32 rounded-full bg-gradient-to-br ${
                      metalColors[selections.metal] || "from-neutral-300 to-neutral-400"
                    } opacity-60 transition-all duration-700 flex items-center justify-center`}
                  >
                    {selections.stone !== "None" && (
                      <div
                        className={`w-8 h-8 rounded-full ${
                          stoneColors[selections.stone] || "bg-pearl"
                        } shadow-lg transition-all duration-500 ${
                          hovered?.startsWith("stone") ? "scale-125" : ""
                        }`}
                      />
                    )}
                  </div>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-cream/30 text-xs tracking-widest uppercase font-body">
                    {selections.length}
                  </div>
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-cream/30 text-xs tracking-widest uppercase font-body">
                    {selections.finish}
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 glass rounded-2xl p-4 animate-float">
                <p className="text-cream/80 text-xs font-body">
                  <span className="text-gold font-semibold">{selections.type}</span>
                </p>
                <p className="text-cream/40 text-[10px] font-body mt-1">
                  {selections.metal}
                </p>
              </div>

              <div className="absolute -bottom-6 -left-6 glass rounded-2xl p-4 animate-float" style={{ animationDelay: "2s" }}>
                <p className="text-cream/80 text-xs font-body">
                  <span className="text-gold font-semibold">{selections.stone}</span>
                </p>
                <p className="text-cream/40 text-[10px] font-body mt-1">
                  {selections.finish} finish
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StorySection() {
  const { ref, inView } = useInView();

  return (
    <section id="story" className="relative py-24 md:py-32 bg-pearl overflow-hidden">
      <div className="absolute inset-0 grain-overlay" />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div
          ref={ref}
          className={`grid md:grid-cols-2 gap-12 lg:gap-20 items-center ${
            inView ? "" : "opacity-0"
          }`}
        >
          <div className={inView ? "animate-slide-in-left" : "opacity-0"}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-3xl bg-sage/20 aspect-[3/4] flex items-center justify-center hover-glow overflow-hidden">
                  <div className="w-16 h-16 rounded-full border-2 border-sage/30 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-sage/40" />
                  </div>
                </div>
                <div className="rounded-3xl bg-gold/10 aspect-square flex items-center justify-center hover-glow overflow-hidden">
                  <div className="w-12 h-12 rounded-full bg-gold/30" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-3xl bg-terracotta/10 aspect-square flex items-center justify-center hover-glow overflow-hidden">
                  <div className="w-12 h-12 rounded-full bg-terracotta/30" />
                </div>
                <div className="rounded-3xl bg-blush/30 aspect-[3/4] flex items-center justify-center hover-glow overflow-hidden">
                  <div className="w-16 h-16 rounded-full border-2 border-blush flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-blush/60" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={inView ? "animate-slide-in-right" : "opacity-0"}>
            <p className="text-sage text-sm tracking-[0.3em] uppercase mb-4 font-body">
              Our Story
            </p>
            <h2
              className="text-4xl md:text-5xl font-display text-charcoal mb-6 leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Crafted with <span className="italic text-terracotta">Loving Care</span>
            </h2>
            <p className="text-charcoal/60 font-body leading-relaxed mb-6">
              In our sunlit studio, every piece begins as a conversation — between
              maker and material, between your story and our hands. We believe
              jewellery should carry meaning, not just beauty.
            </p>
            <p className="text-charcoal/60 font-body leading-relaxed mb-8">
              Each necklace and bracelet is shaped over hours, not minutes. The
              slight imperfections you might notice? They&apos;re the fingerprints of
              someone who cared enough to make it by hand.
            </p>
            <div className="flex gap-8">
              <div>
                <p
                  className="text-3xl font-display text-charcoal"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  8+
                </p>
                <p className="text-charcoal/40 text-sm font-body">Years of craft</p>
              </div>
              <div>
                <p
                  className="text-3xl font-display text-charcoal"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  100%
                </p>
                <p className="text-charcoal/40 text-sm font-body">By hand</p>
              </div>
              <div>
                <p
                  className="text-3xl font-display text-charcoal"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  0
                </p>
                <p className="text-charcoal/40 text-sm font-body">
                  Waste to landfill
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SustainabilitySection() {
  const { ref, inView } = useInView();

  const pillars = [
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          <path d="M7 12c0-2.76 2.24-5 5-5s5 2.24 5 5-2.24 5-5 5" />
        </svg>
      ),
      title: "Recycled Metals",
      description:
        "Every gram of silver and gold we use comes from recycled sources — no new mining required.",
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
      title: "Ethical Stones",
      description:
        "Our gemstones are traceable from mine to studio, ensuring fair wages and safe conditions.",
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34" />
          <path d="M2.25 22l1.09-3.34" />
          <path d="M17 8c0-3 2-6 5-6-2 3-2 6-2 6" />
        </svg>
      ),
      title: "Low-Waste Studio",
      description:
        "Our workshop runs on renewable energy with zero waste to landfill. Every scrap is reborn.",
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
      ),
      title: "Lovingly Made",
      description:
        "Each piece is crafted by hand with intention and care — jewellery that carries warmth, not just style.",
    },
  ];

  return (
    <section
      id="sustainability"
      className="relative py-24 md:py-32 bg-charcoal overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-sage/3 blur-[200px]" />
      </div>
      <div className="absolute inset-0 grain-overlay" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div
          ref={ref}
          className={`text-center mb-16 ${inView ? "animate-fade-up" : "opacity-0"}`}
        >
          <p className="text-sage text-sm tracking-[0.3em] uppercase mb-4 font-body">
            Sustainability
          </p>
          <h2
            className="text-4xl md:text-5xl font-display text-cream mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Beauty That{" "}
            <span className="italic text-sage-light">Gives Back</span>
          </h2>
          <p className="text-cream/50 max-w-lg mx-auto font-body">
            We believe the most beautiful things shouldn&apos;t cost the earth.
            Sustainability isn&apos;t an afterthought — it&apos;s where we begin.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, i) => (
            <div
              key={pillar.title}
              className={`glass rounded-3xl p-8 hover-glow cursor-default text-center ${
                inView ? "animate-scale-in" : "opacity-0"
              }`}
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <div className="w-16 h-16 rounded-2xl bg-sage/10 flex items-center justify-center mx-auto mb-5 text-sage">
                {pillar.icon}
              </div>
              <h3
                className="text-lg font-display text-cream mb-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {pillar.title}
              </h3>
              <p className="text-cream/40 text-sm font-body leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 glass-warm rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h3
              className="text-2xl md:text-3xl font-display text-charcoal mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Our Promise to You
            </h3>
            <p className="text-charcoal/60 font-body leading-relaxed mb-6">
              From the recycled metals we source, to the biodegradable packaging
              we ship in — every decision is guided by care for the planet and
              the people who share it. When you wear Lumière, you wear your
              values.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                "Carbon Neutral",
                "Plastic Free Packaging",
                "Fair Trade Gems",
                "Zero Waste Studio",
              ].map((badge) => (
                <span
                  key={badge}
                  className="px-3 py-1 rounded-full bg-sage/10 text-sage-dark text-xs tracking-wider uppercase font-body"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
          <div className="w-full md:w-64 aspect-square rounded-3xl bg-gradient-to-br from-sage/30 to-gold/20 flex items-center justify-center shrink-0">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-sage-dark/40">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M8 12c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4" />
              <path d="M12 2v4" />
              <path d="M12 18v4" />
              <path d="M2 12h4" />
              <path d="M18 12h4" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialSection() {
  const { ref, inView } = useInView();

  const testimonials = [
    {
      text: "I designed my own necklace for my wedding. When it arrived, I cried — it was more beautiful than I imagined.",
      author: "Amara S.",
      detail: "Custom Moonstone Necklace",
    },
    {
      text: "Knowing my bracelet was made sustainably makes wearing it feel even more special. It's like carrying a little piece of hope.",
      author: "Elena R.",
      detail: "Woven Meadow Bracelet",
    },
    {
      text: "The craftsmanship is extraordinary. You can feel the love in every curve and link.",
      author: "Jun T.",
      detail: "Golden Hour Necklace",
    },
  ];

  return (
    <section className="relative py-24 md:py-32 bg-cream-dark overflow-hidden">
      <div className="absolute inset-0 grain-overlay" />
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div
          ref={ref}
          className={`text-center mb-16 ${inView ? "animate-fade-up" : "opacity-0"}`}
        >
          <p className="text-terracotta text-sm tracking-[0.3em] uppercase mb-4 font-body">
            Kind Words
          </p>
          <h2
            className="text-4xl md:text-5xl font-display text-charcoal"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Stories <span className="italic">They Tell</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.author}
              className={`glass-warm rounded-3xl p-8 hover-lift ${
                inView ? "animate-fade-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="flex mb-4 text-gold">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="text-charcoal/70 font-body leading-relaxed mb-6 text-sm">
                &ldquo;{t.text}&rdquo;
              </p>
              <div>
                <p className="font-display text-charcoal" style={{ fontFamily: "var(--font-display)" }}>
                  {t.author}
                </p>
                <p className="text-charcoal/40 text-xs font-body">{t.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const { ref, inView } = useInView();

  return (
    <section className="relative py-24 md:py-32 bg-charcoal overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gold/5 via-transparent to-terracotta/5" />
      </div>
      <div className="absolute inset-0 grain-overlay" />

      <div
        ref={ref}
        className={`relative z-10 max-w-3xl mx-auto px-6 text-center ${
          inView ? "animate-fade-up" : "opacity-0"
        }`}
      >
        <div className="w-16 h-16 rounded-full border border-gold/30 flex items-center justify-center mx-auto mb-8">
          <div className="w-6 h-6 rounded-full bg-gold/60" />
        </div>

        <h2
          className="text-4xl md:text-6xl font-display text-cream mb-6 leading-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Your Story,{" "}
          <span className="italic text-gradient-gold">Our Hands</span>
        </h2>
        <p className="text-cream/50 font-body text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Begin with a feeling, a memory, a colour. We&apos;ll shape it into
          something you can hold close — made just for you, with love.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#design"
            className="px-10 py-4 rounded-full bg-gold text-charcoal font-semibold tracking-wider uppercase hover:bg-gold-light transition-all hover:shadow-[0_0_40px_rgba(201,169,110,0.4)]"
          >
            Design Your Piece
          </a>
          <a
            href="#collection"
            className="px-10 py-4 rounded-full border border-cream/20 text-cream/70 tracking-wider uppercase hover:border-gold/50 hover:text-gold transition-all"
          >
            Browse Collection
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-charcoal border-t border-cream/5 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full border border-gold/60 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-gold/80" />
              </div>
              <span
                className="font-display text-lg tracking-widest text-cream uppercase"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Lumière
              </span>
            </div>
            <p className="text-cream/30 text-sm font-body leading-relaxed">
              Handmade jewellery crafted with loving care from sustainable materials.
            </p>
          </div>
          <div>
            <h4 className="text-cream/60 text-xs tracking-widest uppercase mb-4 font-body">
              Shop
            </h4>
            <ul className="space-y-2">
              {["Necklaces", "Bracelets", "Design Your Own", "Gift Cards"].map(
                (l) => (
                  <li key={l}>
                    <a href="#" className="text-cream/30 text-sm font-body hover:text-gold transition-colors">
                      {l}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
          <div>
            <h4 className="text-cream/60 text-xs tracking-widest uppercase mb-4 font-body">
              About
            </h4>
            <ul className="space-y-2">
              {["Our Story", "Sustainability", "Studio", "Journal"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-cream/30 text-sm font-body hover:text-gold transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-cream/60 text-xs tracking-widest uppercase mb-4 font-body">
              Stay Connected
            </h4>
            <p className="text-cream/30 text-sm font-body mb-4">
              Stories, new pieces, and studio moments — delivered with care.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-full bg-cream/5 border border-cream/10 text-cream/60 text-sm font-body placeholder:text-cream/20 focus:outline-none focus:border-gold/40"
              />
              <button className="px-4 py-2 rounded-full bg-gold text-charcoal text-sm font-body hover:bg-gold-light transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-cream/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream/20 text-xs font-body">
            &copy; 2026 Lumière. Handmade with love.
          </p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Shipping"].map((l) => (
              <a key={l} href="#" className="text-cream/20 text-xs font-body hover:text-cream/40 transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-charcoal">
      <Navbar />
      <HeroSection />
      <CollectionSection />
      <DesignYourOwn />
      <StorySection />
      <SustainabilitySection />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </main>
  );
}