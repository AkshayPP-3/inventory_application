import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface FeaturePill {
  label: string;
  color: string;
}

interface PreviewCard {
  category: string;
  name: string;
  gradient: string;
  dots: string[];
  offset?: boolean;
}

const featurePills: FeaturePill[] = [
  { label: "Custom categories", color: "bg-lime-300" },
  { label: "Color coding", color: "bg-violet-300" },
  { label: "Add products fast", color: "bg-sky-200" },
  { label: "Custom images", color: "bg-orange-400" },
];

const previewCards: PreviewCard[] = [
  {
    category: "Produce",
    name: "Fresh Fruits",
    gradient: "from-lime-300 to-lime-500",
    dots: ["bg-lime-400", "bg-orange-400", "bg-yellow-400"],
    offset: false,
  },
  {
    category: "Beverages",
    name: "Cold Drinks",
    gradient: "from-violet-300 to-violet-500",
    dots: ["bg-violet-300", "bg-sky-300"],
    offset: true,
  },
  {
    category: "Bakery",
    name: "Daily Bakes",
    gradient: "from-orange-400 to-red-500",
    dots: ["bg-orange-400", "bg-yellow-400", "bg-lime-400"],
    offset: false,
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-amber-50 flex flex-col items-center justify-center text-center px-6 py-24">

      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-20 -left-28 w-96 h-96 rounded-full bg-lime-300 opacity-40 blur-3xl animate-[drift1_8s_ease-in-out_infinite_alternate]" />
        <div className="absolute -bottom-16 -right-20 w-72 h-72 rounded-full bg-orange-400 opacity-35 blur-3xl animate-[drift2_10s_ease-in-out_infinite_alternate]" />
        <div className="absolute top-1/2 left-2/3 w-56 h-56 rounded-full bg-violet-300 opacity-30 blur-3xl animate-[drift1_12s_ease-in-out_infinite_alternate-reverse]" />
        <div className="absolute top-1/4 right-10 w-44 h-44 rounded-full bg-sky-300 opacity-35 blur-3xl animate-[drift2_9s_ease-in-out_infinite_alternate]" />
      </div>

      {/* Badge */}
      <div
        className={`relative z-10 inline-flex items-center gap-2 bg-stone-900 text-lime-300 text-xs font-medium uppercase tracking-widest px-4 py-2 rounded-full mb-6 transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
        Inventory, simplified
      </div>

      {/* Heading */}
      <h1
        className={`relative z-10 font-extrabold leading-[1.05] tracking-tight text-stone-900 transition-all duration-700 delay-100 text-5xl sm:text-7xl lg:text-8xl ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"
        }`}
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        Welcome to
        <br />
        <span className="inline-block bg-lime-300 text-stone-900 px-3 pb-1 rounded-lg mt-1">
          FreshStock!
        </span>
      </h1>

      {/* Tagline */}
      <p
        className={`relative z-10 max-w-xl mx-auto mt-6 text-lg sm:text-xl font-light text-stone-500 leading-relaxed transition-all duration-700 delay-150 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"
        }`}
      >
        Where all of your inventory needs are met. Here, you have full control
        over your products. Add any product or category with{" "}
        <span className="font-medium text-stone-700">color coding</span> and{" "}
        <span className="font-medium text-stone-700">custom images!</span>
      </p>

      {/* Login required notice */}
      <div
        className={`relative z-10 inline-flex items-center gap-2 bg-amber-100 border border-amber-300 text-amber-700 text-sm px-4 py-2.5 rounded-xl mt-8 transition-all duration-700 delay-175 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
          <path d="M8 1.5a3 3 0 0 0-3 3V6H4.5A1.5 1.5 0 0 0 3 7.5v5A1.5 1.5 0 0 0 4.5 14h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 6H11V4.5a3 3 0 0 0-3-3Zm2 4.5H6V4.5a2 2 0 1 1 4 0V6Z" fill="currentColor"/>
        </svg>
        <span>
          <span className="font-medium">Login required</span> to add or manage products and categories
        </span>
      </div>

      {/* CTA Buttons */}
      <div
        className={`relative z-10 flex flex-wrap gap-4 justify-center mt-10 transition-all duration-700 delay-200 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"
        }`}
      >
        <button
          onClick={() => navigate("/products")}
          className="group inline-flex items-center gap-2 bg-stone-900 text-lime-300 border-2 border-stone-900 font-medium text-base px-8 py-3.5 rounded-full cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:scale-105 hover:shadow-2xl active:scale-95"
        >
          View Products
          <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-1" />
        </button>

        <button
          onClick={() => navigate("/categories")}
          className="group inline-flex items-center gap-2 bg-transparent text-stone-900 border-2 border-stone-900 font-medium text-base px-8 py-3.5 rounded-full cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:scale-105 hover:bg-white hover:text-black hover:shadow-2xl active:scale-95"
        >
          View Categories
          <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </div>

      {/* Feature pills */}
      <div
        className={`relative z-10 flex flex-wrap gap-3 justify-center mt-10 transition-all duration-700 delay-300 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"
        }`}
      >
        {featurePills.map((pill) => (
          <div
            key={pill.label}
            className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm"
          >
            <span className={`w-4 h-4 rounded-sm ${pill.color} shrink-0`} />
            <span className="text-sm text-stone-500">{pill.label}</span>
          </div>
        ))}
      </div>

      {/* Preview cards */}
      <div
        className={`relative z-10 flex flex-wrap gap-4 justify-center mt-14 transition-all duration-700 delay-400 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"
        }`}
      >
        {previewCards.map((card) => (
          <div
            key={card.name}
            className={`bg-white rounded-2xl p-5 w-44 text-left shadow-md cursor-default transition-transform duration-300 hover:-translate-y-2 ${
              card.offset ? "mt-5" : ""
            } ${card.name === "Cold Drinks" ? "hover:rotate-1" : "hover:-rotate-1"}`}
          >
            <div className={`h-2 rounded-full bg-linear-to-r ${card.gradient} mb-4`} />
            <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">{card.category}</p>
            <p className="font-bold text-stone-900 text-sm leading-snug">{card.name}</p>
            <div className="flex gap-1 mt-3">
              {card.dots.map((dot, i) => (
                <span key={i} className={`w-2.5 h-2.5 rounded-full ${dot}`} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* App store nudge */}
      <p
        className={`relative z-10 mt-10 text-sm text-stone-400 transition-all duration-700 delay-500 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"
        }`}
      >
        <span className="text-yellow-400 tracking-wide">★★★★★</span>
        &nbsp; Give it a try and leave a review!
      </p>
    </main>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}