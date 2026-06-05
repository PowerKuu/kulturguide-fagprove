import React from "react"

export function useFavorites() {
    const [favorites, setFavorites] = React.useState<string[]>([])

    React.useEffect(() => {
        const stored = localStorage.getItem("favorites")
        if (stored) setFavorites(JSON.parse(stored))
    }, [])

    function toggleFavorite(id: string) {
        const stored = localStorage.getItem("favorites")
        const current: string[] = stored ? JSON.parse(stored) : []

        const newFavorites = current.includes(id) ? current.filter((fav) => fav !== id) : [...current, id]

        localStorage.setItem("favorites", JSON.stringify(newFavorites))
        setFavorites(newFavorites)
    }

    return { favorites, toggleFavorite }
}