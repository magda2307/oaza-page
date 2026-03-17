from typing import TypedDict


class TagCategory(TypedDict):
    label: str
    tags: list[str]


TAG_VOCABULARY: dict[str, TagCategory] = {
    "medyczne": {
        "label": "Medyczne",
        "tags": [
            "FIV+",
            "FeLV+",
            "kocia białaczka",
            "cukrzyca",
            "insulina",
            "nerki",
            "tarczyca",
            "onkologia",
            "jaskra",
            "neurologiczny",
            "wada wrodzona",
            "leki",
            "po operacji",
            "rehabilitacja",
            "choroba serca",
            "FIP",
            "zdrowy",
        ],
    },
    "fizyczne": {
        "label": "Cechy fizyczne",
        "tags": [
            "trójnóg",
            "niewidomy",
            "głuchy",
            "jednooki",
            "niepełnosprawny",
            "brak ogona",
            "blizny",
        ],
    },
    "charakter": {
        "label": "Charakter",
        "tags": [
            "spokojny",
            "aktywny",
            "towarzyski",
            "nieśmiały",
            "łagodny",
            "niezależny",
            "oswojony",
            "oswajanie",
            "płochliwy",
            "czuły",
            "zabawny",
            "ciekawski",
        ],
    },
    "opieka": {
        "label": "Poziom opieki",
        "tags": [
            "specjalna opieka",
            "doświadczone ręce",
            "jedynak",
            "tylko dom",
            "dieta specjalna",
            "regularne wizyty weterynaryjne",
        ],
    },
    "wiek": {
        "label": "Wiek",
        "tags": [
            "kocię",
            "młody",
            "dorosły",
            "senior",
        ],
    },
    "historia": {
        "label": "Historia",
        "tags": [
            "wypadek",
            "wypadek drogowy",
            "trauma",
            "porzucony",
            "znaleziony",
            "oddany",
            "uratowany",
        ],
    },
}


def all_known_tags() -> set[str]:
    """Flat set of every tag defined in the vocabulary."""
    return {tag for cat in TAG_VOCABULARY.values() for tag in cat["tags"]}
