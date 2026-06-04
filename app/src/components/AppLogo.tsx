export default function AppLogo({ width = 52, height = 50 }: { width?: number; height?: number }) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary"
            aria-label="Kulturguide i Bergen"
            role="img"
        >
            {/* Location pin frame — the "guide" mark, with a circular window cut out */}
            <path
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M24 3C14.6 3 7 10.6 7 20c0 11 12.3 21.4 16.1 24.4a1.4 1.4 0 0 0 1.8 0C28.7 41.4 41 31 41 20 41 10.6 33.4 3 24 3Zm0 28a11 11 0 1 1 0-22 11 11 0 0 1 0 22Z"
            />
            {/* Sun rising over Bergen's mountains */}
            <circle cx="30.5" cy="14.5" r="2.6" fill="currentColor" />
            {/* The seven-mountain skyline, inside the window */}
            <path fill="currentColor" d="M14 27.5 20.5 16l3.6 6 4.4-8 5.5 13.5a11 11 0 0 1-20 0Z" />
        </svg>
    )
}
