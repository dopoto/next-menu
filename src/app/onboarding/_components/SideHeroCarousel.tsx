'use client'; 

import React, { useCallback, useEffect } from "react";
import { Hero1 } from "~/app/_components/Hero1";
import { Hero2 } from "~/app/_components/Hero2";
import { Hero3 } from "~/app/_components/Hero3";
import { Hero4 } from "~/app/_components/Hero4";
import { Carousel, CarouselContent, CarouselItem } from "~/components/ui/carousel";
import type { CarouselApi } from "~/components/ui/carousel";

const slides = [
  <Hero1 key="1"/>,
  <Hero2 key="2"/>,
  <Hero3 key="3"/>,
  <Hero4 key="4"/>
]



export function SideHeroCarousel( ) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  const scrollToNextSlide = useCallback(() => {
    if (!api) {
      return
    }

    if (current === count) {
      // If at the last slide, scroll to the last slide again
      // This will bring the first slide into view from the bottom
      api.scrollTo(count - 1)

      // After a short delay, reset to the first slide without animation
      setTimeout(() => {
        api.scrollTo(0, false)
      }, 100)
    } else {
      api.scrollNext()
    }
  }, [api, current, count])

  useEffect(() => {
    if (!api) {
      return
    }

    const intervalId = setInterval(scrollToNextSlide, 1000)  

    return () => clearInterval(intervalId)
  }, [api, scrollToNextSlide])
  
  return (
    <div className="w-full max-w-xs mx-auto">
    <Carousel setApi={setApi} className="w-full h-[400px]" orientation="vertical" >
      <CarouselContent  className="-mt-1 h-[400px]">
      {Array.from({ length: slides.length }).map((_, index) => (
            <CarouselItem key={index}>
              {slides[index]}
            </CarouselItem>
          ))}
      </CarouselContent>
    </Carousel>
    </div>
  );
}
