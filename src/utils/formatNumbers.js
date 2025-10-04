// import numeral from "numeral";

// Menambahkan format custom dengan titik sebagai pemisah ribuan
export function formatAngka(value) {
  if (!value) return '0'

  // Konversi angka ke satuan besar (rb, jt, M, T, Q)
  const satuan = [
    { nilai: 1_000_000_000_000_000, label: 'Q' },
    { nilai: 1_000_000_000_000, label: 'T' },
    { nilai: 1_000_000_000, label: 'M' },
    { nilai: 1_000_000, label: 'jt' },
    { nilai: 1_000, label: 'rb' },
  ]

  for (const { nilai, label } of satuan) {
    if (value >= nilai) {
      let hasil = value / nilai
      return (hasil % 1 === 0 ? hasil.toFixed(0) : hasil.toFixed(1)) + label
    }
  }

  // Jika di bawah 1000, tetap gunakan titik pemisah ribuan
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

// numeral.register("locale", "id", {
//   delimiters: {
//     thousands: ".",
//     decimal: ",",
//   },
//   abbreviations: {
//     thousand: "rb",
//     million: "jt",
//     billion: "M",
//     trillion: "T",
//   },
//   currency: {
//     symbol: "Rp",
//   },
// });

// numeral.locale("id");

// export function formatAngka(value) {
//   return numeral(value)
//     .format("0.[0]a") // Menampilkan angka tanpa desimal berlebihan
//     .replace("k", "rb") // Ribu
//     .replace("m", "jt") // Juta
//     .replace("b", "M") // Miliar
//     .replace("t", "T"); // Triliun
// }

export function formatDelimiter(x) {
  if (!x) return '0'
  return x.toLocaleString('id-ID')
}
