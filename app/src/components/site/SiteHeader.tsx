import Link from "next/link"
import { Button } from "@/components/ui/button"
import AppLogo from "../AppLogo"

export function SiteHeader() {
    const navLinks = [
        { href: `/contact`, label: "Kontakt" },
    ]

    return (
        <header className="fixed top-0 inset-x-0 z-50 border-b border-border/40 bg-background/75 backdrop-blur-md">
            <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
                <Link href="/" className="flex items-center gap-2.5 font-semibold text-lg tracking-tight">
                    <AppLogo width={26} height={25} />
                    Kulturguide
                </Link>

                <nav className="flex items-center gap-2 sm:gap-3">
                                        {navLinks.map((link) => (
                        <Link key={link.href} href={link.href} className="hover:text-foreground transition-colors text-sm">
                            {link.label}
                        </Link>
                    ))}
                    <Button size="sm" className=" h-9 rounded-md px-4" asChild>
                        <Link href="/events">Arrangementer</Link>
                    </Button>
                </nav>
            </div>
        </header>
    )
}
