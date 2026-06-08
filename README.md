# Bergen Kulturguide – teknisk dokumentasjon

Bergen Kulturguide er en webapplikasjon som gir en oversikt over kulturarrangementer i Bergen. Den består av en **offentlig nettside** der besøkende kan bla i, søke etter og filtrere arrangementer, og et **admin-panel** der administratorer kan opprette og redigere arrangementer, kategorier og lese kontakthenvendelser.

Denne filen er den tekniske dokumentasjonen. De øvrige dokumentene finner du her:

1. [Plan](./docs/plan.md)
2. [Utviklingslogg](./docs/log.md)
3. [Brukerveiledning](./docs/brukerveiledning.md)
4. [Relevant lovverk](./docs/relevant-lovverk.md)
5. [Demokrati og medborgerskap, og bærekraft](./docs/bærekraft-demokrati-medborgerskap.md)
6. [Bruk av KI](./docs/ai.md)

## Teknologier

Hele applikasjonen er bygget som ett Next.js-prosjekt (både frontend og backend ligger i samme prosjekt).

- **Språk:** [TypeScript](https://www.typescriptlang.org/)
- **Rammeverk:** [Next.js](https://nextjs.org/) (App Router) med [React](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) og komponentbiblioteket [shadcn/ui](https://ui.shadcn.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) med utvidelsen [pgvector](https://github.com/pgvector/pgvector) for søk
- **ORM:** [Prisma](https://www.prisma.io/orm)
- **Innlogging:** [Better Auth](https://www.better-auth.com/)
- **Validering:** [Zod](https://zod.dev/)
- **Bildelagring:** [Cloudflare R2](https://www.cloudflare.com/developer-platform/products/r2/) (S3-kompatibel objektlagring)
- **AI/søk:** [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) med embedding-modellen `google/gemini-embedding-001`
- **Runtime:** [Bun](https://bun.sh/)
- **Drift:** [Docker](https://www.docker.com/)

## Sett opp utviklingsmiljø

### Krav

- [Docker](https://docs.docker.com/engine/install/) med [Compose](https://docs.docker.com/compose/)
- [Bun](https://bun.sh/)

### Oppsett

Stegene under starter en lokal database og kjører selve applikasjonen.

**1. Start databasen**

Fra hovedmappen, start en lokal PostgreSQL-database (med pgvector) i Docker:

```bash
docker compose -f docker/dev/docker-compose.yml up -d
```

Databasen kjører nå på port `6789`.

**2. Installer pakker**

```bash
cd app
bun install
```

**3. Sett opp miljøvariabler**

```bash
cp .env.example .env
```

Åpne `.env` og fyll inn verdiene som mangler. `DATABASE_URL` peker allerede på den lokale databasen. For at bildeopplasting og søk skal fungere må du i tillegg fylle inn:

- `AI_GATEWAY_API_KEY` – nøkkel til Vercel AI Gateway (brukes til søk/embeddings)
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME` – Cloudflare R2 (bildelagring)

**4. Kjør migreringen**

```bash
bunx prisma migrate dev
```

**5. Fyll databasen med eksempeldata (valgfritt, men anbefalt)**

```bash
bun run seed
```

Dette oppretter eksempel arrangementer, kategorier, kontakthenvendelser og noen brukere. Innloggingsdetaljene til testbrukerne skrives ut i terminalen (f.eks. `admin@kulturguide.no` / `Admin123!`).

**6. Start utviklingsserveren**

```bash
bun dev
```

Applikasjonen kjører nå på [http://localhost:3000](http://localhost:3000).

### Nyttige kommandoer

Alle kommandoer kjøres fra `./app`:

- `bun dev` – start utviklingsserver
- `bun run build` – bygg for produksjon
- `bun run seed` – fyll databasen med eksempeldata
- `bun run format` – formater koden med Prettier
- `bunx prisma migrate dev` – lag og bruk databasemigreringer
- `bunx prisma studio` – åpne et webgrensesnitt for å se og endre data i databasen

## Prosjektstruktur

Selve applikasjonen ligger i mappen `./app`. Under er en oversikt over hvordan koden er organisert:

```
app/
├── prisma/                  # Database
│   ├── schema.prisma        # Datamodellene (Event, EventCategory, Contact, User, File ...)
│   ├── migrations/          # Databasemigreringer
│   └── seed.ts              # Skript som fyller databasen med eksempeldata
├── public/                  # Statiske filer (hero- og kontaktbilde)
├── src/
│   ├── app/                 # Sider og ruter (Next.js App Router)
│   │   ├── (site)/          # Den offentlige nettsiden
│   │   │   ├── page.tsx     #   Landingsside
│   │   │   ├── events/      #   Arrangementsoversikt + detaljside ([eventId])
│   │   │   ├── contact/     #   Kontaktside
│   │   │   └── layout.tsx   #   Felles ramme med header og footer
│   │   ├── admin/           # Admin-panelet (krever innlogging)
│   │   │   ├── (dashboard)/ #   Dashboard: events, event-categories, contact
│   │   │   └── auth/        #   Innlogging, registrering og tilbakestilling av passord
│   │   ├── api/             # API-ruter
│   │   │   ├── auth/        #   Better Auth
│   │   │   └── uploads/     #   Opplasting og servering av bilder
│   │   └── layout.tsx       # Rot-layout (tema, fonter, varsler)
│   ├── components/          # Gjenbrukbare komponenter (se under)
│   ├── hooks/               # Egne React-hooks (f.eks. favoritter)
│   ├── lib/                 # Hjelpefunksjoner og klient for innlogging
│   ├── server/              # All logikk som kjører på serveren (se under)
│   ├── styles/              # Global CSS
│   └── proxy.ts             # Middleware som beskytter alle /admin-ruter
└── Dockerfile               # Oppskrift for produksjonsbygg
```

### Komponenter (`src/components`)

Komponentene er delt opp etter hvor de hører hjemme:

- **`components/site/`** – komponenter for den offentlige nettsiden:
  - `SiteHeader.tsx` – toppmenyen
  - `SiteFooter.tsx` – bunnmenyen (med lenke til admin og tema-knapp)
  - `EventCard.tsx` – kort som viser ett arrangement i en liste (med favoritt-knapp)
  - `EventDetails.tsx` – detaljvisning av ett arrangement, inkludert bildekarusell

- **`components/dashboard/`** – komponenter for admin-panelet:
  - `DashboardSidebar.tsx` – sidemenyen i admin
  - `event/` – kort, skjema (dialog) og overskrift for å administrere arrangementer
  - `event-categories/` – kort, skjema og overskrift for å administrere kategorier
  - `contact/` – overskrift for kontaktsiden

- **`components/ui/`** – grunnleggende UI-komponenter fra shadcn/ui (knapper, kort, dialoger, skjemafelt osv.). Disse brukes av alle de andre komponentene.

- **`components/AppLogo.tsx`** – logoen (en SVG med sol og fjell), og **`components/ThemeToggle.tsx`** – knappen for å bytte mellom lys og mørk modus.

### Server-logikk (`src/server`)

All kode som kun skal kjøre på serveren ligger samlet her:

- **`server/site/actions/`** og **`server/admin/actions/`** – «Server Actions». Dette er funksjoner som frontend kaller direkte for å hente og endre data (arrangementer, kategorier, kontakt). Handlingene under `admin/` krever at brukeren er administrator.
- **`server/auth/`** – oppsett av Better Auth (`auth.ts`) og tilgangskontroll (`guard.ts` med `requireAdmin()`).
- **`server/database/`** – Prisma-klienten (koblingen til databasen).
- **`server/embedding/`** – logikken for det semantiske søket (se under).
- **`server/uploads/`** – behandling av bilder (komprimering med `sharp`) og lagring/henting fra Cloudflare R2.
- **`server/mail/`** – e-postmaler (verifisering, tilbakestilling av passord).

## Datamodell

De viktigste tabellene i databasen (se `app/prisma/schema.prisma`):

- **`Event`** – et arrangement (tittel, pris, sted, beskrivelse, start-/sluttdato, kategori, bilder, om det er «featured», og en `embedding` for søk).
- **`EventCategory`** – en kategori som arrangementer kan tilhøre (én-til-mange).
- **`Contact`** – en henvendelse sendt inn via kontaktskjemaet (navn, e-post, melding).
- **`File`** – metadata om et opplastet bilde (filnavn, type og alt-tekst). Selve filen ligger i R2.
- **`User`, `Session`, `Account`, `Verification`** – brukere og innlogging, styrt av Better Auth. `User` har en rolle (`USER` eller `ADMIN`).

## Semantisk søk

Søket på arrangementssiden er et **semantisk søk**. Det betyr at søket forstår *meningen* bak ordene, og ikke bare leter etter eksakte tekstmatch.

Det fungerer slik:

1. Når et arrangement opprettes eller endres, settes tittel, beskrivelse og sted sammen til én tekst. Denne teksten sendes til en AI-modell (`google/gemini-embedding-001`) som gjør den om til en **embedding** – en liste med tall som beskriver innholdet. Embeddingen lagres i `embedding`-feltet på arrangementet (`server/admin/actions/event.ts` og `server/embedding/embedding.ts`).
2. Når en bruker søker, gjøres søketeksten om til en embedding på samme måte.
3. Databasen sammenligner søkets embedding med arrangementenes embeddinger ved hjelp av **cosine similarity** (via `pgvector`), og returnerer de arrangementene som ligner mest (`server/site/actions/event.ts`).

For å spare tid caches embeddingene av søket i minnet.

## Bildehåndtering

Bilder lastes opp via `/api/uploads/upload`. Ved opplasting blir de komprimert og konvertert til WebP med `sharp`, før de lagres i Cloudflare R2. Selve bildet vises via `/api/uploads/[id]`, som kan endre størrelse og kvalitet ved behov og bruker caching (ETag). Hvert bilde har en alt-tekst for universell utforming.

## Tilgangskontroll

Admin-panelet er beskyttet på to nivåer:

1. **Middleware (`src/proxy.ts`):** alle forespørsler til `/admin` sjekkes. Er du ikke innlogget som administrator, blir du sendt til innloggingssiden.
2. **Server Actions:** hver handling under `server/admin/` kaller `requireAdmin()`, slik at data ikke kan endres uten admin-tilgang – selv om noen skulle forsøke å kalle funksjonen direkte.

## Drift / deployment

Applikasjonen bruker et Docker image. Filen `docker-compose.yml` starter:

- **`postgres`** – databasen med pgvector
- **`kulturguide-app`** – selve applikasjonen
- **`kulturguide-dozzle`** – [Dozzle](https://dozzle.dev/), en nettside for å se loggene

Migreringer (`prisma migrate deploy`) kjøres automatisk når applikasjons-containeren starter. Applikasjonen driftes på en egen VPS.
