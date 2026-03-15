import Link from "next/link";
import {
  Pill,
  Calendar,
  Video,
  FlaskConical,
  Drill,
  ArrowUpRight,
  PhoneCall,
} from "lucide-react";
import { cn } from "@/lib/utils";

import Image from "next/image";

const services = [
  {
    title: "Appointments",
    href: "/appointments",
    desc: "Book a specialist doctor for in-person visits with minimal waiting time.",
    icon: Calendar,
    className:
      "lg:col-span-6 lg:row-span-2 bg-primary text-primary-foreground flex flex-col justify-between",
    stats: "Next Available: Today, 2:00 PM",
    doctors: ["/d1.png", "/d2.png", "/d3.png", "/d4.png"],
  },
  {
    title: "Pharmacy",
    href: "/pharmacy",
    desc: "Order medicines online with home delivery.",
    icon: Pill,
    className: "lg:col-span-6 lg:row-span-1 bg-secondary",
  },
  {
    title: "Laboratories",
    href: "/labs",
    desc: "Fast and accurate clinical test results.",
    icon: FlaskConical,
    className: "lg:col-span-3 lg:row-span-1 bg-background border border-border",
  },
  {
    title: "Consultant",
    href: "/consultant",
    desc: "Secure video consultations.",
    icon: Video,
    className: "lg:col-span-3 lg:row-span-1 bg-background border border-border",
  },
  {
    title: "Dental",
    href: "/dental",
    desc: "Complete oral health and surgery.",
    icon: Drill,
    className: "lg:col-span-6 lg:row-span-1 bg-secondary",
  },
  {
    title: "Emergency",
    href: "/contact",
    desc: "24/7 Urgent care and ambulance services.",
    icon: PhoneCall,
    className: "lg:col-span-6 bg-destructive/10 border border-destructive/20",
  },
];

export default function ServicesBento() {
  return (
    <section className="col-span-12 pb-10 lg:pb-20">
      <div className="space-y-3 mb-12">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Our Services
        </h2>
        <p className="body-text text-sm md:text-lg max-w-xl">
          Comprehensive healthcare solutions designed for your convenience and
          well-being.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 lg:row-span-2 gap-4">
        {services.map((service) => {
          const isAppointments = service.title === "Appointments";

          return (
            <Link
              key={service.title}
              href={service.href}
              className={cn(
                "group relative overflow-hidden rounded-3xl p-6 lg:p-8 transition-all duration-500",
                "border border-border/50 hover:border-primary/50",
                service.className,
                isAppointments &&
                  "shadow-xl shadow-primary/10 dark:shadow-none",
              )}
            >
              {isAppointments && (
                <div className="absolute inset-0 z-0 pointer-events-none">
                  <div className="absolute -right-22 top-8 h-[100%] w-[90%] md:w-[60%] lg:w-[90%]">
                    <Image
                      src="/appointmentImage.png"
                      alt="Appointments"
                      fill
                      className="object-contain object-right-bottom transition-all duration-700 group-hover:scale-110 group-hover:-rotate-3 opacity-90 group-hover:opacity-100"
                      priority
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-transparent z-10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent z-10" />
                </div>
              )}
              <div className="relative z-20 flex h-full flex-col justify-between">
                <div className="space-y-4">
                  <div
                    className={cn(
                      "inline-flex p-3 rounded-2xl transition-all",
                      isAppointments
                        ? "bg-primary-foreground/10 text-primary-foreground backdrop-blur-md border border-white/10"
                        : "bg-primary/10 text-primary",
                    )}
                  >
                    <service.icon className="size-6" />
                  </div>

                  <div className="max-w-[80%] md:max-w-[70%] lg:max-w-[65%]">
                    <h2
                      className={cn(
                        "main-title text-lg mb-2",
                        isAppointments
                          ? "text-primary-foreground"
                          : "text-foreground",
                      )}
                    >
                      {service.title}
                    </h2>
                    <p
                      className={cn(
                        " text-base md:text-lg dark:text-zinc-400 font-light leading-relaxed",
                        isAppointments ? "text-zinc-400" : "text-zinc-600",
                      )}
                    >
                      {service.desc}
                    </p>
                  </div>
                </div>

                {isAppointments && (
                  <div className="mt-8 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-3">
                        {service.doctors?.map((src, i) => (
                          <div
                            key={i}
                            className="size-10 rounded-full border-2 border-primary bg-background overflow-hidden relative shadow-lg"
                          >
                            <Image
                              src={src}
                              alt="Doctor"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-[11px] font-bold text-primary-foreground uppercase tracking-wider">
                        +12 Doctors Online
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-foreground/15 backdrop-blur-xl rounded-full border border-primary-foreground/20 w-fit">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      <span className="text-[10px] font-black tracking-widest text-primary-foreground">
                        AVAILABLE NOW
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <ArrowUpRight
                className={cn(
                  "absolute top-8 right-8 size-6 z-20 transition-all",
                  isAppointments
                    ? "text-primary-foreground/40 group-hover:text-primary-foreground"
                    : "text-muted-foreground/40 group-hover:text-primary",
                  "group-hover:translate-x-1 group-hover:-translate-y-1",
                )}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
