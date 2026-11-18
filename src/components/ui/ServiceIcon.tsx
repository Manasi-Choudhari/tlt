import { Briefcase, CalendarDays, GraduationCap, Hotel, Map, Mountain, ShieldCheck, Users, type LucideProps } from "lucide-react";
import type { Service } from "@/data/content";

const icons = {
  users: Users,
  map: Map,
  calendar: CalendarDays,
  briefcase: Briefcase,
  graduation: GraduationCap,
  hotel: Hotel,
  shield: ShieldCheck,
  mountain: Mountain,
} satisfies Record<Service["icon"], unknown>;

export function ServiceIcon({ name, ...props }: { name: Service["icon"] } & LucideProps) {
  const Icon = icons[name];
  return <Icon {...props} />;
}
