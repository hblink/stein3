"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase-client";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ShoppingBag, Search } from "lucide-react";
import type { Product, Category } from "@/lib/types";

function useInView(threshold = 0.15) {
  const [inView, setInView] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.unobserve(ref);
        }
      },
      { threshold }
    );
    obs.observe(ref);
    return () => obs.disconnect();
  }, [ref, threshold]);

  return { ref: setRef, inView };
}

const NAV_LINKS = [
  { label: "Collection", href: "#collection" },
  { label: "Design Yours", href: "#design" },
  { label: "Our Story", href: "#story" },
  { label: "Sustainability", href: "#sustainability" },
  { label: "Orders", href: "/orders" },
];

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
          <Link
            href="/shop"
            className="ml-4 px-5 py-2 rounded-full border border-gold/50 text-gold text-sm tracking-wider uppercase hover:bg-gold/10 transition-all"
          >
            Shop All
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="relative text-cream/70 hover:text-gold transition-colors"
            aria-label="Shopping bag"
          >
            <ShoppingBag size={20} />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold text-charcoal text-[10px] font-bold flex items-center justify-center">0</span>
          </Link>

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
          <Link
            href="/shop"
            onClick={() => setMobileOpen(false)}
            className="text-gold text-sm tracking-wider uppercase"
          >
            Shop All
          </Link>
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
        <p className="text-gold/80 text-sm tracking-[0.3em] uppercase mb-6 font-body">
          Handcrafted with Love · Sustainably Made
        </p>

        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display text-cream leading-[1.05] mb-6"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Adorn Yourself in{" "}
          <span className="text-gradient-gold italic">Intention</span>
        </h1>

<p className="text-cream/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-body leading-relaxed">
            Every piece is handmade with loving care — from sustainable materials
            that honor the earth, to designs that celebrate your unique story.
          </p>
          <p className="text-cream/40 text-sm font-body">
            We&apos;ll handcraft your vision into a one-of-a-kind piece that&apos;s uniquely yours.
          </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="px-8 py-3.5 rounded-full bg-gold text-charcoal font-semibold tracking-wider uppercase text-sm hover:bg-gold-light transition-all hover:shadow-[0_0_30px_rgba(201,169,110,0.4)]"
          >
            Explore Collection
          </Link>
          <a
            href="#design"
            className="px-8 py-3.5 rounded-full border border-cream/30 text-cream/80 tracking-wider uppercase text-sm hover:border-gold/60 hover:text-gold transition-all"
          >
            Design Your Own
          </a>
        </div>
      </div>
    </section>
  );
}

function CollectionSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView();

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      if (supabase) {
        const { data } = await supabase.from("products").select("*, category:categories(*)").eq("in_stock", true).eq("featured", true).limit(6);
        setProducts(data as Product[] || []);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <section id="collection" className="relative py-24 md:py-32 bg-cream">
      <div className="absolute inset-0 grain-overlay" />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div ref={ref} className={`text-center mb-16 ${inView ? "animate-fade-up" : "opacity-0"}`}>
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

        {loading ? (
          <div className="text-center py-12 text-charcoal/40 font-body">Loading collection...</div>
        ) : products.length === 0 ? (
          <div className="glass-warm rounded-3xl p-12 text-center">
            <p className="text-charcoal/40 font-body">No pieces available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/product/${product.slug}`} className="group">
                <div className="glass rounded-3xl overflow-hidden hover-lift cursor-pointer">
                  <div className="relative aspect-square bg-gradient-to-br from-gold/10 to-sage/10 flex items-center justify-center overflow-hidden">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <ShoppingBag size={64} className="text-charcoal/20" />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-display text-charcoal mb-2" style={{ fontFamily: "var(--font-display)" }}>
                      {product.name}
                    </h3>
                    {product.material && (
                      <p className="text-charcoal/50 text-sm font-body mb-3">{product.material}</p>
                    )}
                    <span className="text-lg font-display text-terracotta" style={{ fontFamily: "var(--font-display)" }}>
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/shop">
            <Button variant="primary">View Full Collection</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function DesignYourOwn() {
  const { ref, inView } = useInView();
  return (
    <section id="design" className="relative py-24 md:py-32 bg-charcoal overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gold/3 blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-sage/5 blur-[120px]" />
      </div>
      <div className="absolute inset-0 grain-overlay" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div ref={ref} className={`text-center mb-16 ${inView ? "animate-fade-up" : "opacity-0"}`}>
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

        <div className="glass rounded-3xl p-8 text-center">
          <p className="text-cream/60 font-body mb-6">
            Our custom design service lets you create a piece that reflects your personal story. 
            Work with our artisans to bring your vision to life.
          </p>
          <Link href="/shop">
            <Button variant="primary">Begin Your Design Journey</Button>
          </Link>
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
        <div ref={ref} className={`grid md:grid-cols-2 gap-12 items-center ${inView ? "" : "opacity-0"}`}>
          <div className={inView ? "animate-slide-in-left" : "opacity-0"}>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl bg-sage/20 aspect-[3/4] flex items-center justify-center" />
              <div className="rounded-3xl bg-gold/10 aspect-square flex items-center justify-center" />
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
            <div className="flex gap-8">
              <div>
                <p className="text-3xl font-display text-charcoal" style={{ fontFamily: "var(--font-display)" }}>
                  8+
                </p>
                <p className="text-charcoal/40 text-sm font-body">Years of craft</p>
              </div>
              <div>
                <p className="text-3xl font-display text-charcoal" style={{ fontFamily: "var(--font-display)" }}>
                  100%
                </p>
                <p className="text-charcoal/40 text-sm font-body">By hand</p>
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
  return (
    <section id="sustainability" className="relative py-24 md:py-32 bg-charcoal overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-sage/3 blur-[200px]" />
      </div>
      <div className="absolute inset-0 grain-overlay" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div ref={ref} className={`text-center mb-16 ${inView ? "animate-fade-up" : "opacity-0"}`}>
          <p className="text-sage text-sm tracking-[0.3em] uppercase mb-4 font-body">
            Sustainability
          </p>
          <h2
            className="text-4xl md:text-5xl font-display text-cream mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Beauty That <span className="italic text-sage-light">Gives Back</span>
          </h2>
          <p className="text-cream/50 max-w-lg mx-auto font-body">
            We believe the most beautiful things shouldn&apos;t cost the earth.
            Sustainability isn&apos;t an afterthought — it&apos;s where we begin.
          </p>
        </div>

        <div className="glass-warm rounded-3xl p-8 md:p-12 max-w-3xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-display text-charcoal mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Our Promise to You
          </h3>
          <p className="text-charcoal/60 font-body leading-relaxed mb-6">
            From the recycled metals we source, to the biodegradable packaging
            we ship in — every decision is guided by care for the planet and
            the people who share it. When you wear Lumière, you wear your
            values.
          </p>
          <div className="flex flex-wrap gap-3">
            {["Carbon Neutral", "Plastic Free Packaging", "Fair Trade Gems", "Zero Waste Studio"].map((badge) => (
              <span
                key={badge}
                className="px-3 py-1 rounded-full bg-sage/10 text-sage-dark text-xs tracking-wider uppercase font-body"
              >
                {badge}
              </span>
            ))}
          </div>
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
              {["Shop All", "Necklaces", "Bracelets", "Gift Cards"].map((l) => (
                <li key={l}>
                  <Link href="/shop" className="text-cream/30 text-sm font-body hover:text-gold transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-cream/60 text-xs tracking-widest uppercase mb-4 font-body">
              About
            </h4>
            <ul className="space-y-2">
              {["Our Story", "Sustainability", "Contact"].map((l) => (
                <li key={l}>
                  <a href={`#${l.toLowerCase().replace(" ", "")}`} className="text-cream/30 text-sm font-body hover:text-gold transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-cream/60 text-xs tracking-widest uppercase mb-4 font-body">
              Customer Care
            </h4>
            <ul className="space-y-2">
              {["Privacy", "Terms", "Shipping", "Returns"].map((l) => (
                <li key={l}>
                  <Link href={`/${l.toLowerCase()}`} className="text-cream/30 text-sm font-body hover:text-gold transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-cream/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream/20 text-xs font-body">
            &copy; 2026 Lumière. Handmade with love.
          </p>
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
      <Footer />
    </main>
  );
}