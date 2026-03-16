"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "./ui/badge";
import { Calendar, CheckCircle2 } from "lucide-react";
import HeroVisual from "./hero-visual";

export default function Hero() {
  return (
    <section className="col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div className="lg:col-span-5 z-10">
        <div className="space-y-2">
          <Badge variant="secondary" className="font-medium">
            ISO 9001:2015 Certified
          </Badge>
          <h1 className="main-title">
            Your Health, <br />
            <span className="">Scheduled with Ease.</span>
          </h1>
        </div>

        <p className="body-text ">
          Skip the waiting room. Connect with world-class specialists and manage
          your family's health journey all from one secure platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button className="">
            Book Appointment <Calendar className="ml-2 size-5" />
          </Button>
          <Button variant="outline" className="">
            View Services
          </Button>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted-foreground pt-8">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-5 text-green-500" />
            <span className="font-medium">80+ Specialists</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-5 text-green-500" />
            <span className="font-medium">24/7 Availability</span>
          </div>
        </div>
      </div>

      <div className="lg:col-span-7 relative h-[200px] md:h-[600px] w-full">
        <HeroVisual />
      </div>
    </section>
  );
}
