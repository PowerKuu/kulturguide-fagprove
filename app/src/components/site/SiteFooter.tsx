import { ThemeToggle } from "../ThemeToggle";
import Link from "next/link";

export function SiteFooter() {
        return (
            <footer className="border-t border-border/60 mt-12">
                <div className="max-w-6xl mx-auto px-5 sm:px-8 py-6 flex flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Kulturguide. Alle rettigheter reservert.</p>
                                                                           <div className="flex gap-4 items-center">
                                                                                                                                                        <Link href="/admin" className="text-xs text-muted-foreground">
                                                                                Admin
                                                                            </Link>
                                                                            <Link href="/contact" className="text-xs text-muted-foreground">
                                                                                Kontakt
                                                                            </Link>
                                                                            <ThemeToggle />
                                                                            </div>

                </div>
            </footer>
        )
    
}
