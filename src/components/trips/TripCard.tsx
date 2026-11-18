import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { Clock, MapPin, Star } from "lucide-react";
import { destinationLabel, formatPrice, type Trip } from "@/data/trips";

export function TripCard({ trip, className, priority }: { trip: Trip; className?: string; priority?: boolean }) {
  const off = trip.originalPrice ? Math.round((1 - trip.price / trip.originalPrice) * 100) : 0;
  return (
    <Link
      href={`/trips/${trip.slug}`}
      data-cursor="View"
      className={clsx("group flex flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_20px_60px_-30px_rgba(26,18,11,0.35)]", className)}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={trip.image}
          alt={trip.title}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-[translate,scale,rotate] duration-[1.2s] ease-out-expo group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />
        <div className="absolute left-4 top-4 flex gap-2">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink-900 backdrop-blur">
            {destinationLabel[trip.destination]}
          </span>
          {off > 0 && <span className="bg-brand rounded-full px-3 py-1 text-xs font-semibold text-white">{off}% off</span>}
        </div>
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-sm font-semibold text-white">
          <Star className="h-4 w-4 fill-sun-300 text-sun-300" />
          {trip.rating.toFixed(1)} <span className="font-normal text-white/80">({trip.reviews})</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-4 text-xs font-medium text-ink-500">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> {trip.nights}N / {trip.days}D
          </span>
          <span className="flex items-center gap-1.5 truncate">
            <MapPin className="h-3.5 w-3.5 shrink-0" /> {trip.region}
          </span>
        </div>
        <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink-900">{trip.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-700/80">{trip.tagline}</p>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {trip.vibe.slice(0, 3).map((v) => (
            <span key={v} className="rounded-full bg-cream-100 px-2.5 py-1 text-[11px] font-semibold text-ink-700">
              {v}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-end justify-between pt-6">
          <div>
            {trip.originalPrice && <p className="text-xs text-ink-500 line-through">{formatPrice(trip.originalPrice)}</p>}
            <p className="font-display text-2xl font-bold text-ink-900">
              {formatPrice(trip.price)}
              <span className="text-sm font-medium text-ink-500"> /person</span>
            </p>
          </div>
          <span className="rounded-full border border-ink-900/15 px-4 py-2 text-sm font-semibold text-ink-900 transition-colors duration-300 group-hover:border-flame-500 group-hover:bg-flame-500 group-hover:text-white">
            View trip
          </span>
        </div>
      </div>
    </Link>
  );
}
