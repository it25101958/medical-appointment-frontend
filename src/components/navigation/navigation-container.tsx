"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  HeartPulse,
  Menu,
  Pill,
  Calendar,
  Video,
  FlaskConical,
  Drill,
  PhoneCall,
  LogOut,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "./theme-toggle";
import { logoutAction } from "@/features/auth";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
  NavigationMenuContent,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const services = [
  {
    title: "Pharmacy",
    href: "/pharmacy",
    desc: "Order medicines online.",
    icon: Pill,
  },
  {
    title: "Appointments",
    href: "/appointments",
    desc: "Book a specialist.",
    icon: Calendar,
  },
  {
    title: "Consultant",
    href: "/consultant",
    desc: "Video consultations.",
    icon: Video,
  },
  {
    title: "Laboratories",
    href: "/labs",
    desc: "View test results.",
    icon: FlaskConical,
  },
  {
    title: "Dental",
    href: "/dental",
    desc: "Oral care services.",
    icon: Drill,
  },
  {
    title: "Emergency",
    href: "/contact",
    desc: "24/7 Urgent care and ambulance services.",
    icon: PhoneCall,
    className: "lg:col-span-6 bg-destructive/10 border border-destructive/20",
  },
];

function getCookieValue(name: string) {
  if (typeof document === "undefined") return null;

  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
}

function getUserRole() {
  const role = Number(getCookieValue("user-role"));
  return Number.isFinite(role) && role > 0 ? role : null;
}

const NavigationContainer = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userRole, setUserRole] = React.useState<number | null>(null);
  const [hasCheckedAuth, setHasCheckedAuth] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const isAuthenticated = userRole !== null;

  React.useEffect(() => {
    setUserRole(getUserRole());
    setHasCheckedAuth(true);
  }, [pathname]);

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      await logoutAction();
      setUserRole(null);
      setMobileMenuOpen(false);
      router.replace("/");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <header className="col-span-full flex items-center justify-between w-full">
      <Link href="/" className="flex items-center gap-2 group">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <HeartPulse className="size-5" />
        </div>
        <span className="text-xl font-bold tracking-tight text-foreground">
          Med<span className="text-primary">Care</span>
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-6">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search doctors or services..."
            className="pl-9 w-full bg-muted/50 border-none focus-visible:ring-1"
          />
        </div>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={cn(navigationMenuTriggerStyle(), "bg-transparent")}
              >
                <Link href="/">Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent">
                Services
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                  {services.map((service) => (
                    <li key={service.title}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={service.href}
                          className="flex items-start gap-4 select-none rounded-lg p-3 leading-none no-underline outline-none transition-all duration-200 hover:bg-primary/5 group"
                        >
                          <div className=" flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-background group-hover:border-primary/30 group-hover:bg-primary/10 transition-colors">
                            <service.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm font-semibold leading-none group-hover:text-primary">
                              {service.title}
                            </div>
                            <p className="line-clamp-2 text-xs leading-snug text-muted-foreground/80">
                              {service.desc}
                            </p>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={cn(navigationMenuTriggerStyle(), "bg-transparent")}
              >
                <Link href="/contact">Contact</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          {hasCheckedAuth &&
            (isAuthenticated ? (
              <Button
                type="button"
                variant="outline"
                className="hidden sm:inline-flex px-4 py-2 font-medium"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut className="size-4" />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Button>
            ) : (
              <Link href="/patient/login" passHref>
                <Button
                  variant="outline"
                  className="hidden sm:inline-flex px-4 py-2 font-medium"
                >
                  Sign in
                </Button>
              </Link>
            ))}
          <ThemeToggle />
          {/* <Link href="/payment/online-payment" passHref>
            <Button
              variant="default"
              className="hidden sm:inline-flex px-4 py-2 font-medium"
            >
              Online Payment
            </Button>
          </Link> */}
        </div>
      </div>
      <div className="flex items-center md:hidden">
        <ThemeToggle />
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="ml-3">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader className="text-left mb-6">
              <SheetTitle className="flex items-center gap-2">
                <HeartPulse className="size-5 text-primary" /> MedCare
              </SheetTitle>
            </SheetHeader>
            <div className="px-6 flex flex-col gap-6">
              <nav className="flex flex-col gap-2">
                {hasCheckedAuth &&
                  (isAuthenticated ? (
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex items-center gap-2 p-3 text-left text-sm font-medium text-primary hover:bg-muted rounded-xl transition-colors disabled:opacity-60"
                    >
                      <LogOut className="size-4" />
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>
                  ) : (
                    <Link
                      href="/patient/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-3 text-sm font-medium hover:bg-muted rounded-xl transition-colors text-primary"
                    >
                      Sign in
                    </Link>
                  ))}
                <Link
                  href="/admin/laboratory"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 text-sm font-medium hover:bg-muted rounded-xl transition-colors"
                >
                  Laboratory
                </Link>
                <Link
                  href="/admin/labtest"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 text-sm font-medium hover:bg-muted rounded-xl transition-colors"
                >
                  Lab Tests
                </Link>
                <Link
                  href="/services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 text-sm font-medium hover:bg-muted rounded-xl transition-colors"
                >
                  Services
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 text-sm font-medium hover:bg-muted rounded-xl transition-colors"
                >
                  Contact
                </Link>
              </nav>
              <Link
                href={isAuthenticated ? "/patient/dashboard" : "/patient/login"}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button className="px-4 py-2">Book Appointment</Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default NavigationContainer;
