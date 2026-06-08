# Tiltak innen bærekraft og demokrati og medborgerskap

Dette dokumentet beskriver tiltak som er gjennomført eller burde vært gjennomført innen bærekraft og demokrati og medborgerskap – både i selve applikasjonen og i bedriften.

## Tiltak i applikasjonen

### Bærekraft

Selv om en webapplikasjon er liten i den store sammenhengen, er det gjort flere valg som reduserer ressursbruk og dermed energiforbruk:

- **Komprimering av bilder:** Alle opplastede bilder komprimeres og konverteres til det effektive WebP-formatet med `sharp`, og skaleres ned til en fornuftig maksstørrelse. Serveringsruten kan i tillegg endre størrelse og kvalitet ved behov. Dette reduserer mengden data som overføres, noe som gir lavere båndbredde- og energibruk hos både server og besøkende.
- **Caching:** Bilder serveres med lang cache (ETag og `Cache-Control`), slik at de ikke lastes ned på nytt unødvendig. Søketekster som sendes til AI-modellen mellomlagres i minnet, slik at man unngår gjentatte, energikrevende kall til modellen for like søk.
- **Effektiv datalagring:** Embeddingene lagres i et `halfvec`-felt, som bruker omtrent halvparten så mye plass som vanlige flyttall-vektorer, og bilder lagres i objektlagring fremfor i databasen. Dette holder databasen liten og driften lettere.

Et mulig forbedringstiltak er å velge en hostingleverandør som hovedsakelig bruker fornybar energi for produksjonsmiljøet.

### Demokrati og medborgerskap

- **Universell utforming:** Ved å legge vekt på god kontrast, tastaturnavigasjon, alt-tekst på bilder og definert språk, gjøres applikasjonen tilgjengelig for flere – også personer med nedsatt funksjonsevne. Dette bidrar til at flest mulig kan delta i kulturlivet på lik linje.
- **Lavere terskel for deltakelse i kulturlivet:** Selve formålet med Bergen Kulturguide – å samle og synliggjøre kulturarrangementer i byen – gjør det enklere for innbyggerne å finne fram til og delta på kulturtilbud. Gratis arrangementer er tydelig merket med "Gratis" og kan filtreres fram, slik at også de som har begrenset økonomi lett finner tilbud som er åpne for alle.