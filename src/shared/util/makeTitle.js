export default function makeTitle(book) {
  return book.serie
    ? book.version
      ? book.serie + " (v" + book.version + ") " + book.tome
        ? "T" + book.tome + " - " + book.titre
        : " - " + book.titre
      : book.serie + " T" + book.tome + " - " + book.titre
    : book.titre;
}
