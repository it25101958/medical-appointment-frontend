"use client";
import { useState } from "react";
import {
  Search,
  MapPin,
  Stethoscope,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const specializations = [
  { value: "cardiology", label: "Cardiology" },
  { value: "pediatrics", label: "Pediatrics" },
  { value: "neurology", label: "Neurology" },
  { value: "dentistry", label: "Dentistry" },
  { value: "dermatology", label: "Dermatology" },
  { value: "ophthalmology", label: "Ophthalmology" },
];

export default function FindDoctorSearch() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <section className="col-span-full">
      <div className="mx-auto">
        <div className="max-w-3xl mb-10">
          <h1 className="main-title text-4xl md:text-5xl lg:text-6xl">
            Find the Right{" "}
            <span className="text-primary italic">Specialist</span> <br />
            <span className="span-title">for Your Family.</span>
          </h1>
          <p className="body-text mt-4">
            Search from over 80+ certified specialists across 20+ departments.
            Instant booking, 24/7 availability.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-center rounded-2xl md:rounded-full">
          <div className="relative flex-[1.5] w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <Input
              placeholder="Doctor's name..."
              className="pl-12 border-border bg-transparent focus-visible:ring-0 text-lg h-12 rounded-full"
            />
          </div>
          <div className="relative flex-1 w-full">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  role="combobox"
                  aria-expanded={open}
                  className="justify-start h-12 px-4 hover:bg-transparent font-normal text-lg"
                >
                  <span
                    className={cn(
                      "truncate",
                      !value && "text-muted-foreground",
                    )}
                  >
                    {value
                      ? specializations.find((s) => s.value === value)?.label
                      : "Specialization"}
                  </span>
                  <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[250px] p-0" align="start">
                <Command className="bg-card">
                  <CommandInput placeholder="Search specialization..." />
                  <CommandList>
                    <CommandEmpty>No specialization found.</CommandEmpty>
                    <CommandGroup>
                      {specializations.map((spec) => (
                        <CommandItem
                          key={spec.value}
                          value={spec.value}
                          onSelect={(currentValue) => {
                            setValue(
                              currentValue === value ? "" : currentValue,
                            );
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === spec.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {spec.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <Button
            size="lg"
            className="rounded-full px-8 h-12 font-semibold transition-all hover:scale-105"
          >
            Search Doctors
          </Button>
        </div>
        <div className="flex flex-wrap gap-3 mt-6">
          {specializations.slice(0, 4).map((spec) => (
            <button
              key={spec.value}
              onClick={() => setValue(spec.value)}
              className={cn(
                "px-4 py-1.5 rounded-full border text-sm font-medium transition-all",
                value === spec.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "hover:bg-secondary text-foreground border-border",
              )}
            >
              {spec.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
