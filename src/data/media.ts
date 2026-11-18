// Swap these with the client's own photos/videos (drop files in /public/images
// or /public/videos and update the paths). Videos are optional: when a video
// path is empty the poster image is shown instead.
export const media = {
  goa: {
    hero: "/images/goa-palolem.webp",
    palms: "/images/goa-palms.webp",
    vagator: "/images/goa-vagator.webp",
    shack: "/images/goa-shack.webp",
    mandrem: "/images/goa-mandrem.webp",
    querim: "/images/goa-querim.webp",
    dusk: "/images/goa-dusk.webp",
    boat: "/images/goa-boat.webp",
    cola: "/images/goa-cola.webp",
    butterfly: "/images/goa-butterfly.webp",
    palolem2: "/images/goa-palolem-2.webp",
  },
  hampi: {
    hero: "/images/hampi-vitthala.webp",
    virupaksha: "/images/hampi-virupaksha.webp",
    hemakuta: "/images/hampi-hemakuta.webp",
    chariot: "/images/hampi-chariot.webp",
    chariot2: "/images/hampi-chariot-2.webp",
    pushkarani: "/images/hampi-pushkarani.webp",
    ruins: "/images/hampi-ruins.webp",
    lakshmi: "/images/hampi-lakshmi.webp",
    relief: "/images/hampi-relief.webp",
    gopuram: "/images/hampi-gopuram.webp",
  },
  video: {
    showreel: "",
    showreelPoster: "/images/goa-dusk.webp",
  },
} as const;
