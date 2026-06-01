# Bergen Kulturguide – Fagprøve: Planlegging

## Oppdrag
Bergen Kulturguide ønsker en moderne webapplikasjon med oversikt over kulturarrangementer i Bergen.

## Krav
- **Teknologistack:** TypeScript, Next.js og Tailwind CSS
- Forside med introduksjon og liste over arrangementer
- Header, navigasjon og footer
- Mulighet for å legge til arrangementer som favoritt
- Søk og filtrering på arrangementer
- Detaljeside for arrangementer
- Versjonskontroll i Git
- Kontaktskjema med feilhåndtering for tomme felter
- Responsivt design på alle skjermstørrelser

## Tech stack
- **Next.js** – React-rammeverk
- **TypeScript** – typer
- **Tailwind CSS** – styling
- **shadcn/ui** – komponentbibliotek / designsystem
- **Prisma** – ORM og databasemodellering
- **PostgreSQL** – database (med `pgvector`-utvidelsen for vektorsøk)
- **Better Auth** – autentisering
- **Cloudflare R2** – objektlagring for bilder
- **Zod** – validering av input
- **Vercel AI gateway** - For å koble opp mot AI modeller

## Admin-grensesnitt

### Autentisering og brukere
- Autentisering med **Better Auth**
- Databasemodell med `User`, `Session`, `Account` og `Verification`
- Kryptering av passord (Scrypt)
- Rolle-enum: `ADMIN`, `USER`
- Alle admin-handlinger er beskyttet og krever rollen `ADMIN`

### Admin-dashboard
- Oversikt over innsendte kontaktskjemaer
- Oversikt over arrangementer
- Opprette, slette og redigere arrangementer (inkl. opplasting av bilder)
- Opprette, redigere og slette **arrangementskategorier** (`EventCategory`)
- Slette og redigere admin-brukere
- Gi andre brukere admin-tilgang

## Brukerfunksjonalitet

### Kontaktskjema
Brukere skal kunne sende inn et kontaktskjema som lagres i databasen og vises i admin-grensesnittet. Feltene inkluderer **navn**, **e-post** og **melding**. All input valideres server-side med **Zod**, med feilhåndtering for tomme og ugyldige felter (f.eks. ugyldig e-postformat).

### Søk og filtrering
- Brukere skal kunne filtrere på **pris** og **kategori**.
- Det skal også være mulig å søke på arrangementer. Applikasjonen embedder tittel og beskrivelse til hvert arrangement med en AI-modell (`google/gemini-embedding-001`). Embeddingen genereres/oppdateres når et arrangement opprettes eller redigeres, og lagres i `embedding`-feltet. Når brukerens søk embeddes, finner vi likheten til arrangementene med **cosine similarity** (via `pgvector`) og returnerer de mest relevante treffene.

### Favoritter
Håndteres i `localStorage`, som beskrevet i oppgaven, slik at brukeren ikke trenger en konto for å legge til arrangementer som favoritt.

## Bildehåndtering
Bilder lagres i **Cloudflare R2**. Ved opprettelse/redigering av et arrangement lastes bildene opp til R2, og objektnøklene (keys) lagres i `mediaIds`-feltet på `Event`. Visning skjer ved å hente bildene fra R2 via deres key/URL. Alle bilder skal ha alt-tekst for universell utforming ved hjelp av custom metadata.

## Design og universell utforming

### Design
- Moderne design
- Bruker designsystemet **shadcn/ui**
- Lenke til wireframe: https://www.figma.com/design/2fbykkFPWaLxEtN4wBCRSD/Untitled?node-id=0-1&t=vFa8ebXJb56auODD-1

### Universell utforming
- Alt på siden skal være mulig å navigere med tab
- God struktur som gjør siden lett å forstå for brukere
- Skarpe kontraster og enkel UI
- Alt-tekst på alle bilder

## Sider og endepunkter

### Offentlige sider
| Rute | Beskrivelse |
| --- | --- |
| `/` | Landingsside med liste over arrangementer |
| `/event/[eventId]` | Informasjon om et spesifikt arrangement |
| `/contact` | Kontaktside |

### API-endepunkter / Actions
| Endepunkt | Metoder
| --- | --- |
| `/api/events` | `GET` (offentlig), `POST` (admin) |
| `/api/event/[eventId]` | `GET` (offentlig), `PATCH` / `DELETE` (admin) |
| `/api/categories` | `GET` (offentlig), `POST` (admin) | Blandet |
| `/api/categories/[categoryId]` | `GET` (offentlig), `PATCH` / `DELETE` (admin) |
| `/api/contact` | `POST` (offentlig), `GET` (admin) |

## Database-modell
Databasen skal ha to hovedmodeller: **Event** og **EventCategory**.

- **Event** inneholder informasjon om arrangementet, som navn, dato, sted, pris og bilder (R2-nøkler i `mediaIds`).
- **EventCategory** er koblet til Event med en one-to-many-relasjon og inneholder informasjon om arrangementskategorier.
- **Contact** er kontaktskjemaene som er sendt inn av brukere.

Brukermodellene (`User`, `Session`, `Account`, `Verification`) håndteres av Better Auth.

> **Merk:** `Embedding` feltet bruker `halfvec(3072)`, som krever at `pgvector` utvidelsen er aktivert i PostgreSQL (`CREATE EXTENSION IF NOT EXISTS vector;`).

```prisma
model EventCategory {
  id     String  @id @default(cuid())
  name   String
  events Event[]
}

model Event {
  id          String                          @id @default(cuid())
  title       String
  price       Float
  location    String
  description String?
  embedding   Unsupported("halfvec(3072)")?

  startDate  DateTime
  endDate    DateTime?
  category   EventCategory @relation(fields: [categoryId], references: [id])
  categoryId String
  mediaIds   String[]
}

model Contact {
  id        String   @id @default(cuid())
  name      String
  email     String
  message   String
  createdAt DateTime @default(now())
}
```

## Miljøvariabler
Følgende secrets/konfig håndteres via `.env` (og settes i produksjon på VPS):

- `DATABASE_URL` – tilkobling til PostgreSQL
- `BETTER_AUTH_SECRET` – secret for Better Auth
- `AI_GATEWAY_API_KEY` – Vercel AI gateway for embedding
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET` – Cloudflare R2

## Drift og ressurser

### Nødvendig programvare og utstyr
- Laptop for utvikling
- Visual Studio Code
- Node.js/Bun
- Se `README.md` for dependencies som trengs for å kjøre prosjektet

### Deployment
Applikasjonen deployes på egen VPS hos **OVH** med **Docker**.

## Estimat
- Oppsett, database og autentisering (Next.js, Prisma, pgvector, Better Auth): 4–6 timer
- Admin-grensesnitt (dashboard, CRUD for arrangementer og kategorier, brukeradministrasjon): 9–10 timer
- Offentlige sider (forside, detaljeside, header/navigasjon/footer): 4–6 timer
- Søk og filtrering (embedding, cosine similarity, pris/kategori, favoritter): 5–6 timer
- Bildehåndtering og kontaktskjema (R2-opplasting, validering, feilhåndtering): 3–4 timer
- Universell utforming og responsivitet: 2–3 timer
- Deployment, testing (Docker, OVH VPS, egenvurdering): 1–3 timer

Summert blir dette omtrent 28–38 timer

## Sparringspartnere
AI og kollegaer som Kristian, Sindre og Sindre M.