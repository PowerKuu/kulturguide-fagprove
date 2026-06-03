import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 py-40 px-5 sm:px-8 w-full max-w-6xl mx-auto">
        {children}
        </main>
                    <SiteFooter />

    </div>
}