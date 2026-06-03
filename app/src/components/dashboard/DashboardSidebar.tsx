"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar"
import { useSession, authClient } from "@/lib/authClient"
import {
    FileText,
    Tag,
    Store,
    Music,
    Flag,
    Users,
    LogOut,
    Timer,
    Bell,
    UserCircle2,
    Layers,
    Sparkles
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import AppLogo from "@/components/AppLogo"
import { ThemeToggle } from "@/components/ThemeToggle"

const items = [
    { title: "Events", url: "/admin/events", icon: Store },
    { title: "Event Categories", url: "/admin/event-categories", icon: Tag }
]

export function DashboardSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const { data: session } = useSession()

    async function handleLogout() {
        await authClient.signOut()
        router.push("/admin/auth/login")
    }

    return (
        <Sidebar>
            <SidebarHeader>
                <Link href="/" className="flex items-center gap-2 px-2 py-2">
                    <AppLogo width={28} height={27} />
                    <span className="text-lg font-bold">Plagg</span>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div className="flex flex-col gap-3 px-2 py-3">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                            <button
                                onClick={handleLogout}
                                className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                                title="Log out"
                            >
                                <LogOut className="size-4" />
                            </button>
                            <span className="truncate text-sm text-muted-foreground">{session?.user.email}</span>
                        </div>
                        <ThemeToggle />
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
