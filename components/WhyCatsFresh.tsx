// import { Leaf, Shield, Zap, DollarSign, Trash2 } from "lucide-react";
// import { FaLeaf, FaDollarSign } from "react-icons/fa6";
import { FaAirFreshener } from "react-icons/fa";
import {
  FaLeaf,
  // FaAirFreshener,
  FaCube,
  FaMoneyBillWave,
  FaToilet,
} from "react-icons/fa6";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import { useDictionary } from "@/hooks/getDictionary";
import { Locale } from "@/i18n/config";

export default function WhyCatsFresh() {
  const locale = useCurrentLanguage() as Locale;
  const { dict } = useDictionary(locale);

  const advantages = [
    {
      icon: FaLeaf,
      key: "ecology_safety",
      title:
        dict?.why_cats_fresh?.advantages.ecology_safety?.title ||
        "Екологічність та безпека",
      points: dict?.why_cats_fresh?.advantages.ecology_safety?.points || [
        "Наповнювач вироблено з хімічно чистого волокна",
        "Якість преміум",
        "100% біорозкладність",
      ],
    },
    {
      icon: FaAirFreshener,
      key: "disinfection_freshness",
      title:
        dict?.why_cats_fresh?.advantages.disinfection_freshness?.title ||
        "Знезараження та свіжість",
      points: dict?.why_cats_fresh?.advantages.disinfection_freshness
        ?.points || [
        "Усуває запахи в 2 рази ефективніше",
        "Завдяки капілярній системі рослинного волокна",
      ],
    },
    {
      icon: FaCube,
      key: "clumping",
      title: dict?.why_cats_fresh?.advantages.clumping?.title || "Комкування",
      points: dict?.why_cats_fresh?.advantages.clumping?.points || [
        "Створює цілісні комки без залишків",
      ],
    },
    {
      icon: FaMoneyBillWave,
      key: "economy",
      title: dict?.why_cats_fresh?.advantages.economy?.title || "Економія",
      points: dict?.why_cats_fresh?.advantages.economy?.points || [
        "1 кг Cats Fresh = 5 кг звичайного наповнювача",
        "Поглинає до 600% власної ваги",
      ],
    },
    {
      icon: FaToilet,
      key: "disposal_convenience",
      title:
        dict?.why_cats_fresh?.advantages.disposal_convenience?.title ||
        "Утилізація та зручність",
      points: dict?.why_cats_fresh?.advantages.disposal_convenience?.points || [
        "Можна змивати в унітаз",
        "Не пилить, не прилипає до лап",
      ],
    },
  ];

  return (
    <section
      className="relative w-full py-8 pb-2 bg-[var(--color-cream)]"
      id="why-cats-fresh"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--color-forest-green)]">
            {dict?.why_cats_fresh?.title || "Чому Cats Fresh?"}
          </h2>
          <p className="text-xl md:text-2xl text-[var(--color-burnt-orange)]">
            {dict?.why_cats_fresh?.subtitle ||
              "5 ключових переваг преміум наповнювача"}
          </p>
        </div>

        {/* Сітка переваг */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => {
            const IconComponent = advantage.icon;
            return (
              <div
                key={index}
                className="group relative bg-[var(--color-lime-green)] rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-[var(--color-burnt-orange)]"
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-full mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 bg-[var(--color-forest-green)]">
                  <IconComponent
                    size={32}
                    className="text-[var(--color-cream)]"
                    strokeWidth={2.5}
                  />
                </div>

                <h3 className="text-xl font-bold text-center mb-4 text-[var(--color-forest-green)]">
                  {advantage.title}
                </h3>

                <ul className="space-y-3">
                  {advantage.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-start">
                      <span className="mr-3 mt-1 font-bold text-lg flex-shrink-0 text-[var(--color-burnt-orange)]">
                        ✓
                      </span>
                      <span className="text-base leading-relaxed text-[var(--color-forest-green)]">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-14">
          <div className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[var(--color-forest-green)]">
            <FaLeaf size={24} className="mr-3 text-[var(--color-lime-green)]" />
            <span className="text-lg font-semibold text-[var(--color-cream)]">
              {dict?.why_cats_fresh?.slogan ||
                "Природний вибір для турботливих власників"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
