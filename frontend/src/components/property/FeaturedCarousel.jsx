import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FeaturedPropertyCard from "./FeaturedPropertyCard";

const navButtonClass =
  "flex items-center gap-1 rounded-lg border border-primary px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300 disabled:hover:bg-transparent";

export default function FeaturedCarousel({ properties }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [snapCount, setSnapCount] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const scrollTo = useCallback((index) => emblaApi?.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    const onReInit = () => {
      setSnapCount(emblaApi.scrollSnapList().length);
      onSelect();
    };
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onReInit);
    onReInit();
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onReInit);
    };
  }, [emblaApi]);

  return (
    <div>
      {/* -my-4 py-4: room for a hovered card to lift without being clipped. */}
      <div className="-my-4 overflow-hidden py-4" ref={emblaRef}>
        <div className="-ml-6 flex">
          {properties.map((property) => (
            <div key={property.id} className="min-w-0 flex-[0_0_100%] pl-6 sm:flex-[0_0_50%] lg:flex-[0_0_33.3333%]">
              <FeaturedPropertyCard property={property} />
            </div>
          ))}
        </div>
      </div>

      {snapCount > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canPrev}
            className={navButtonClass}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: snapCount }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={selectedIndex === index}
                className={`h-2.5 rounded-full transition-all ${
                  selectedIndex === index ? "w-6 bg-primary" : "w-2.5 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
            className={navButtonClass}
          >
            Next
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
