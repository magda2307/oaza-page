"""
Seed script — inserts dummy cats into the local dev database.

Usage:
    python scripts/seed_cats.py

Requires DATABASE_URL in .env (or environment).
"""
import asyncio
import os
import sys
from pathlib import Path

# Allow importing app config from project root
sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv
load_dotenv()

import asyncpg

DATABASE_URL = os.environ["DATABASE_URL"].replace("+asyncpg", "")

CATS = [
    {
        "name": "Melchior",
        "age_years": 11.0,
        "breed": "Dachowiec",
        "description": (
            "Melchior ma 11 lat i raka płaskonabłonkowego jamy ustnej. "
            "Przeszedł operację i reaguje na leczenie lepiej niż się spodziewaliśmy — "
            "je samodzielnie, mrucząc przy tym głośno. Jest spokojny, lubi siedzieć obok, "
            "nie wymaga uwagi na siłę. Szuka domu, który nie będzie się bał słowa 'nowotwór'."
        ),
        "photo_url": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80",
        "tags": ["onkologia", "senior", "spokojny", "doświadczone ręce"],
    },
    {
        "name": "Zefir",
        "age_years": 4.0,
        "breed": "Dachowiec",
        "description": (
            "FIV+. Zefir trafił do nas po wypadku drogowym — złamana łapa, "
            "głęboka rana na karku. Wyleczył się. FIV u kota to nie wyrok: "
            "przy dobrym żywieniu i opiece może żyć tyle samo co zdrowy. "
            "Jest ciekawski, lubi zabawę z wędką, świetnie dogaduje się z innymi FIV+ kotami."
        ),
        "photo_url": "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=800&q=80",
        "tags": ["FIV+", "wypadek drogowy", "towarzyski", "aktywny"],
    },
    {
        "name": "Wróżka",
        "age_years": 7.0,
        "breed": "Dachowiec",
        "description": (
            "FeLV+. Kocia białaczka. Wróżka trafiła do nas jako jedyna ocalała "
            "z miotu — reszta nie przeżyła. Ona przeżyła i udowadnia to każdego dnia. "
            "Jest delikatna, cicha, kocha słońce na parapecie. Wymaga domu bez innych kotów "
            "i właściciela, który rozumie, że czas z nią jest bezcenny właśnie dlatego, "
            "że może być krótszy."
        ),
        "photo_url": "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&q=80",
        "tags": ["FeLV+", "kocia białaczka", "jedynak", "spokojny"],
    },
    {
        "name": "Basior",
        "age_years": 14.0,
        "breed": "Dachowiec",
        "description": (
            "14 lat, przewlekła choroba nerek w stadium 2. Basior żył w jednym domu "
            "przez całe życie — aż dom przestał istnieć. Jego opiekun zmarł. "
            "Basior jest ułożony, oswojony, wie czego chce. Nie potrzebuje zabawy — "
            "potrzebuje spokoju, dobrego jedzenia i kogoś, kto usiądzie obok."
        ),
        "photo_url": "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=800&q=80",
        "tags": ["senior", "nerki", "spokojny", "oswojony"],
    },
    {
        "name": "Iskra",
        "age_years": 2.0,
        "breed": "Dachowiec",
        "description": (
            "Iskra urodziła się z jednym okiem — drugie zostało usunięte w tygodniu życia "
            "z powodu infekcji. Nie wie, że jej czegoś brakuje. Gania po całym pomieszczeniu, "
            "poluje na wszystko co się rusza, śpi zwinięta w kłębek wielkości pięści. "
            "Idealna dla kogoś, kto chce energiczną towarzyszkę bez dramatów."
        ),
        "photo_url": "https://images.unsplash.com/photo-1561948955-570b270e7c36?w=800&q=80",
        "tags": ["niepełnosprawny", "jednooki", "aktywny", "młody"],
    },
    {
        "name": "Stefan",
        "age_years": 9.0,
        "breed": "Dachowiec",
        "description": (
            "Stefan jest głuchy od urodzenia. Biały, z jasnoniebieskimi oczami — "
            "klasyczna genetyka. Nigdy nie słyszał własnego mruczenia, "
            "a mimo to mrucząc przyciąga uwagę całego pokoju. "
            "Jest spokojny, lubi rutynę, świetnie czyta mowę ciała. "
            "Najlepiej odnajdzie się w spokojnym domu bez małych dzieci."
        ),
        "photo_url": "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=800&q=80",
        "tags": ["głuchy", "specjalna opieka", "spokojny", "biały"],
    },
    {
        "name": "Margot",
        "age_years": 6.0,
        "breed": "Dachowiec",
        "description": (
            "FIV+. Margot trafiła do nas ze schroniska — siedziała tam 3 lata, "
            "bo każdy widział etykietkę i odchodził. My widzimy kota, który reaguje "
            "na imię, daje się czesać i zasypia na kolanach po kwadransie. "
            "FIV nie jest chorobą zakaźną dla ludzi. Potrzebuje domu bez kłótni i bez "
            "kotów FIV-negatywnych."
        ),
        "photo_url": "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&q=80",
        "tags": ["FIV+", "łagodny", "oswojony", "towarzyski"],
    },
    {
        "name": "Bruno",
        "age_years": 3.0,
        "breed": "Dachowiec",
        "description": (
            "Bruno stracił tylną prawą łapę po wypadku z kosiarką — miał wtedy 8 miesięcy. "
            "Teraz ma 3 lata i biega szybciej niż większość czworonożnych kotów. "
            "Jest zadziwiająco zwinny, uwielbia wspinaczkę i nie ma pojęcia, "
            "że jest 'niepełnosprawny'. Szuka aktywnego domu z drapaczami."
        ),
        "photo_url": "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=800&q=80",
        "tags": ["niepełnosprawny", "trójnóg", "aktywny", "wypadek"],
    },
    {
        "name": "Luna",
        "age_years": 12.0,
        "breed": "Perska mieszanka",
        "description": (
            "Luna ma cukrzycę wymagającą insuliny dwa razy dziennie. "
            "Jej poprzednia rodzina oddała ją, bo 'to za dużo zachodu'. "
            "Zastrzyki zajmują 20 sekund. Luna — spokojna, czysta, purystka w kwestii "
            "zapachu kuwety — podaruje ci lata spokojnego towarzystwa. "
            "Szuka kogoś, kto nie boi się igły."
        ),
        "photo_url": "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=800&q=80",
        "tags": ["cukrzyca", "insulina", "senior", "specjalna opieka"],
    },
    {
        "name": "Rudy",
        "age_years": 5.0,
        "breed": "Maine Coon mieszanka",
        "description": (
            "Rudy trafił do nas po interwencji — mieszkał w mieszkaniu bez jedzenia "
            "przez 6 tygodni po śmierci właściciela. Przeżył. Teraz powoli uczy się, "
            "że ludzie mogą być bezpieczni. Nie jest jeszcze kotem na kolana, "
            "ale siedzi coraz bliżej. To jego tempo — i je szanujemy."
        ),
        "photo_url": "https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=800&q=80",
        "tags": ["trauma", "nieśmiały", "oswajanie", "doświadczone ręce"],
    },
    {
        "name": "Hela",
        "age_years": 13.0,
        "breed": "Syberyjska mieszanka",
        "description": (
            "Hela ma nadczynność tarczycy i przyjmuje codziennie małą tabletkę. "
            "Jest wredna dla obcych i absolutnie oddana swojemu człowiekowi. "
            "13 lat, przeżyła dwóch właścicieli — pierwszy odszedł, drugi trafił do domu opieki. "
            "Nie zasługuje na to, żeby kończyć w klatce. Jest gotowa na ostatni, dobry dom."
        ),
        "photo_url": "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80",
        "tags": ["senior", "tarczyca", "leki", "jedynak"],
    },
    {
        "name": "Piotrek",
        "age_years": 1.5,
        "breed": "Dachowiec",
        "description": (
            "Piotrek urodził się z wodogłowiem — jego głowa jest nieproporcjonalnie duża "
            "i chodzi z lekką chwiejnością. Neurolog potwierdził, że żyje bez bólu. "
            "Jest pogodny, ciekawski, uwielbia torebki foliowe i pudełka kartonowe. "
            "Wymaga kontrolnych wizyt weterynaryjnych co 6 miesięcy."
        ),
        "photo_url": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=800&q=80",
        "tags": ["wada wrodzona", "neurologiczny", "specjalna opieka", "młody"],
    },
    {
        "name": "Czarka",
        "age_years": 8.0,
        "breed": "Dachowiec",
        "description": (
            "Czarka jest niewidoma — stopniowo traciła wzrok przez jaskrę przez 2 lata. "
            "Teraz porusza się po przestrzeni wyłącznie za pomocą węchu i słuchu "
            "i robi to z zadziwiającą gracją. Lubi stałe miejsca, przewidywalność, "
            "ciche domy. Przemeblowania są dla niej stresem — prosi o stabilność."
        ),
        "photo_url": "https://images.unsplash.com/photo-1511044568932-338ceba04787?w=800&q=80",
        "tags": ["niewidomy", "specjalna opieka", "spokojny", "jaskra"],
    },
    {
        "name": "Arleta",
        "age_years": 10.0,
        "breed": "Brytyjska krótkowłosa mieszanka",
        "description": (
            "FeLV+. Arleta żyje z koją białaczką od 5 lat — dłużej niż ktokolwiek "
            "z nas się spodziewał. Jest dowodem na to, że diagnoza to nie data ważności. "
            "Uwielbia słońce, śmietankę kokosową z łyżeczki i długie sesje szczotkowania. "
            "Wymaga domu bez innych kotów i właściciela bez strachu."
        ),
        "photo_url": "https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?w=800&q=80",
        "tags": ["FeLV+", "kocia białaczka", "senior", "jedynak"],
    },
    {
        "name": "Max",
        "age_years": 0.5,
        "breed": "Dachowiec",
        "description": (
            "Max trafił do nas jako niemowlę — bez matki, z infekcją górnych dróg oddechowych "
            "i ropiejącymi oczami. Przeżył. Teraz ma pół roku, jest zdrowy "
            "i absolutnie nie zdaje sobie sprawy z powagi swojej historii. "
            "Gania, skacze, kradnie skarpetki. Klasyczne kocię — z wyjątkiem tego, "
            "że wie, że życie jest prezentem."
        ),
        "photo_url": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80",
        "tags": ["kocię", "zdrowy", "aktywny", "towarzyski"],
    },
]


async def seed():
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        existing = await conn.fetchval("SELECT COUNT(*) FROM cats")
        if existing > 0:
            print(f"Database already has {existing} cats. Skipping seed.")
            print("To reseed: DELETE FROM cats; then re-run.")
            return

        for cat in CATS:
            row = await conn.fetchrow(
                """
                INSERT INTO cats (name, age_years, breed, description, photo_url, tags)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id, name
                """,
                cat["name"],
                cat["age_years"],
                cat["breed"],
                cat["description"],
                cat["photo_url"],
                cat["tags"],
            )
            print(f"  ✓ #{row['id']} {row['name']}")

        print(f"\nSeeded {len(CATS)} cats.")
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(seed())
