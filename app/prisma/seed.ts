import { randomUUID } from "node:crypto"
import { hashPassword } from "@better-auth/utils/password"
import { prisma } from "@/server/database/prisma"
import { Role } from "@/prisma/enums"

const DAY = 24 * 60 * 60 * 1000

function at(days: number, hour = 19): Date {
    const d = new Date(Date.now() + days * DAY)
    d.setHours(hour, 0, 0, 0)
    return d
}

async function createUser(input: { name: string; email: string; password: string; role: Role }) {
    const userId = randomUUID()
    await prisma.user.create({
        data: {
            id: userId,
            name: input.name,
            email: input.email,
            emailVerified: true,
            role: input.role
        }
    })

    await prisma.account.create({
        data: {
            id: randomUUID(),
            providerId: "credential",
            accountId: userId,
            userId,
            password: await hashPassword(input.password)
        }
    })

    return userId
}

async function main() {
    console.log("🌱  Seeding database…")

    await prisma.session.deleteMany()
    await prisma.account.deleteMany()
    await prisma.event.deleteMany()
    await prisma.contact.deleteMany()
    await prisma.user.deleteMany()
    await prisma.eventCategory.deleteMany()

    const [adminId, editorId, userId] = await Promise.all([
        createUser({
            name: "Astrid Admin",
            email: "admin@kulturguide.no",
            password: "Admin123!",
            role: Role.ADMIN
        }),
        createUser({
            name: "Erik Redaktør",
            email: "editor@kulturguide.no",
            password: "Redaktor99#",
            role: Role.ADMIN
        }),
        createUser({
            name: "Nora Nordmann",
            email: "user@kulturguide.no",
            password: "Bruker123$",
            role: Role.USER
        })
    ])
    console.log(`👤  Created 3 users (admin=${adminId.slice(0, 8)}, editor=${editorId.slice(0, 8)}, user=${userId.slice(0, 8)})`)

    const [konsert, teater, festival] = await Promise.all([
        prisma.eventCategory.create({ data: { name: "Konsert" } }),
        prisma.eventCategory.create({ data: { name: "Teater & Scene" } }),
        prisma.eventCategory.create({ data: { name: "Festival" } })
    ])
    console.log("🏷️   Created 3 categories")

    const events = [
        {
            title: "Jazz under Stjernene",
            price: 349,
            location: "Sentralen, Oslo",
            description: "En intim kveld med norsk samtidsjazz i historiske lokaler.",
            startDate: at(7),
            endDate: at(7, 23),
            categoryId: konsert.id,
            featured: true
        },
        {
            title: "Symfoni nr. 9 - Beethoven",
            price: 595,
            location: "Grieghallen, Bergen",
            description: "Bergen Filharmoniske Orkester fremfører Beethovens niende symfoni.",
            startDate: at(14, 18),
            endDate: at(14, 21),
            categoryId: konsert.id,
            featured: false
        },
        {
            title: "Indie-kveld: Lokale Helter",
            price: 199,
            location: "Blå, Oslo",
            description: "Fire fremadstormende indieband fra Østlandet på én scene.",
            startDate: at(3, 20),
            endDate: at(4, 1),
            categoryId: konsert.id,
            featured: false
        },
        {
            title: "Peer Gynt",
            price: 450,
            location: "Den Nationale Scene, Bergen",
            description: "Ibsens klassiker i en ny og dristig oppsetning.",
            startDate: at(21, 19),
            endDate: at(21, 22),
            categoryId: teater.id,
            featured: true
        },
        {
            title: "Improshow: Helt på Sparket",
            price: 220,
            location: "Det Andre Teatret, Oslo",
            description: "Improvisert komedie der publikum bestemmer handlingen.",
            startDate: at(5, 20),
            endDate: at(5, 22),
            categoryId: teater.id,
            featured: false
        },
        {
            title: "Svanesjøen - Ballett",
            price: 680,
            location: "Operaen, Oslo",
            description: "Nasjonalballetten fremfører Tsjajkovskijs tidløse mesterverk.",
            startDate: at(30, 18),
            endDate: at(30, 21),
            categoryId: teater.id,
            featured: false
        },
        {
            title: "Øyafestivalen",
            price: 1290,
            location: "Tøyenparken, Oslo",
            description: "Tre dager med musikk, mat og bærekraft midt i Oslo.",
            startDate: at(45, 12),
            endDate: at(48, 23),
            categoryId: festival.id,
            featured: true
        },
        {
            title: "Bergenfest",
            price: 1150,
            location: "Bergenhus Festning, Bergen",
            description: "Internasjonale og norske artister på den historiske festningen.",
            startDate: at(60, 16),
            endDate: at(63, 23),
            categoryId: festival.id,
            featured: false
        },
        {
            title: "Matstreif - Matfestival",
            price: 0,
            location: "Rådhusplassen, Oslo",
            description: "Gratis matfestival med lokale produsenter fra hele landet.",
            startDate: at(40, 11),
            endDate: at(41, 18),
            categoryId: festival.id,
            featured: false
        },
        {
            title: "Vinterlyd - Akustisk Aften",
            price: 275,
            location: "Røros Kirke, Røros",
            description: "Stemningsfull akustisk konsert i vakre Røros kirke. (Avholdt)",
            startDate: at(-20, 19),
            endDate: at(-20, 21),
            categoryId: konsert.id,
            featured: false
        }
    ]

    await prisma.event.createMany({
        data: events.map((e) => ({ ...e, mediaIds: [] }))
    })
    console.log(`🎫  Created ${events.length} events`)

    await prisma.contact.createMany({
        data: [
            {
                name: "Kari Hansen",
                email: "kari.hansen@example.no",
                message: "Hei! Tilbyr dere studentrabatt på konsertbillettene?"
            },
            {
                name: "Ola Berg",
                email: "ola.berg@example.no",
                message: "Er det rullestoltilgang på Grieghallen-arrangementet?"
            },
            {
                name: "Ingrid Solberg",
                email: "ingrid.solberg@example.no",
                message: "Vi vil gjerne ha bandet vårt med på neste festival. Hvem kontakter vi?"
            },
            {
                name: "Lars Johansen",
                email: "lars.johansen@example.no",
                message: "Kjøpte to billetter til Peer Gynt, men fikk ikke bekreftelse på e-post."
            },
            {
                name: "Mette Lie",
                email: "mette.lie@example.no",
                message: "Flott nettside! Kan dere legge til en kalendervisning av arrangementene?"
            }
        ]
    })
    console.log("✉️   Created 5 contacts")

    console.log("\n✅  Seed complete.\n")
    console.log("   Login credentials:")
    console.log("   • admin@kulturguide.no   / Admin123!     (ADMIN)")
    console.log("   • editor@kulturguide.no  / Redaktor99#   (ADMIN)")
    console.log("   • user@kulturguide.no    / Bruker123$    (USER)")
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error("❌  Seed failed:", e)
        await prisma.$disconnect()
        process.exit(1)
    })
