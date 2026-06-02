import { Terminal } from "lucide-react"

export default function AppLogo({ width = 52, height = 50 }: { width?: number; height?: number }) {
    return <Terminal width={width} height={height} className="text-primary" />
}
