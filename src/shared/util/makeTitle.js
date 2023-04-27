export default function makeTitle(book) {
  const { serie, version, tome, titre } = book;
  let realTitle = "";

  if (serie) {
    realTitle += serie;
    if (version) {
      realTitle += ` (v${version})`;
    }
    if (tome) {
      realTitle += tome < 10 ? ` T0${tome}` : ` T${tome}`;
    }

    if (
      !titre.toLowerCase().includes("volume") &&
      !titre.toLowerCase().includes("tome")
    ) {
      realTitle += ` : ${titre}`;
    }
  } else {
    realTitle += titre;
  }

  return realTitle;
}
