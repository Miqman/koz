import * as XLSX from 'xlsx-js-style'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

/**
 * Export Excel dengan title rows, lebar kolom, dan opsi border.
 *
 * @param {Array<Array>} titleRows - Baris judul dan info tambahan

/**
 * Export Excel dengan title rows, lebar kolom, dan opsi border.
 *
 * @param {Array<Array>} titleRows - Baris judul dan info tambahan
 * @param {Array<Object>} headers - Header tabel, dengan text dan width
 * @param {Array<Array>} tableData - Data isi tabel (array of array)
 * @param {string} filename - Nama file Excel
 * @param {boolean} useBorder - Aktifkan border atau tidak
 */
export function exportToExcel(
  titleRows = [],
  headers = [],
  tableData = [],
  filename = 'data.xlsx',
  namePage,
  useBorder = true,
  originalData = null,
  totalColumnKey = null,
  ticketSubHeaders = null, // Parameter baru untuk sub header tiket
) {
  try {
    // Buat header dengan sub header untuk tiket
    let headerTexts = []
    let subHeaderTexts = []
    let columnWidths = []
    let mergeRanges = []

    if (ticketSubHeaders && ticketSubHeaders.length > 0) {
      // Header level 1
      let colIndex = 0
      headers.forEach((header, index) => {
        if (header.key === 'tiket') {
          // Untuk kolom tiket, buat merge cell
          headerTexts.push(header.text)
          mergeRanges.push({
            s: { r: titleRows.length, c: colIndex },
            e: { r: titleRows.length, c: colIndex + ticketSubHeaders.length - 1 },
          })

          // Tambahkan sub headers
          ticketSubHeaders.forEach((subHeader, subIndex) => {
            if (subIndex !== 0) {
              headerTexts.push('')
            }
            columnWidths.push({ wpx: 80 })
          })
          colIndex += ticketSubHeaders.length
        } else {
          headerTexts.push(header.text)
          columnWidths.push({ wpx: header.width || 100 })
          // Merge cell untuk header non-tiket (span 2 rows)
          mergeRanges.push({
            s: { r: titleRows.length, c: colIndex },
            e: { r: titleRows.length + 1, c: colIndex },
          })
          colIndex++
        }
      })

      // Header level 2 (sub headers)
      colIndex = 0
      headers.forEach((header) => {
        if (header.key === 'tiket') {
          ticketSubHeaders.forEach((subHeader) => {
            subHeaderTexts.push(subHeader)
            colIndex++
          })
        } else {
          subHeaderTexts.push('')
          colIndex++
        }
      })
    } else {
      // Fallback ke header normal jika tidak ada sub header
      headerTexts = headers.map((h) => h.text)
      columnWidths = headers.map((h) => ({ wpx: h.width || 100 }))
    }

    // Process table data
    if (tableData.length && typeof tableData[0] === 'object' && !Array.isArray(tableData[0])) {
      tableData = tableData.map((obj) => {
        let row = []
        headers.forEach((header) => {
          if (header.key === 'tiket' && ticketSubHeaders) {
            // Untuk kolom tiket, pecah menjadi sub kolom
            const tickets = obj.jumlah_tiket || []
            ticketSubHeaders.forEach((subHeaderName) => {
              const ticket = tickets.find((t) => {
                const cleanName = t.name.replace(/^(Tiket Masuk |Tiket )/i, '')
                return cleanName === subHeaderName
              })
              row.push(ticket ? ticket.total : 0)
            })
          } else {
            // Untuk kolom non-tiket, ambil data sesuai key
            row.push(obj[header.key] || '')
          }
        })
        return row
      })
    }

    // Tambahkan baris jumlah untuk setiap sub header tiket
    let jumlahRow = null
    let jumlahRowIndex = null
    if (originalData && ticketSubHeaders && ticketSubHeaders.length > 0) {
      jumlahRow = []

      headers.forEach((header) => {
        if (header.key === 'tiket') {
          ticketSubHeaders.forEach((subHeaderName) => {
            const total = originalData.reduce((sum, item) => {
              const tickets = item.jumlah_tiket || []
              const ticket = tickets.find((t) => {
                const cleanName = t.name.replace(/^(Tiket Masuk |Tiket )/i, '')
                return cleanName === subHeaderName
              })
              return sum + (ticket ? ticket.total : 0)
            }, 0)
            jumlahRow.push(total)
          })
        } else if (header.key === 'no') {
          jumlahRow.push('JUMLAH')
        } else {
          jumlahRow.push('')
        }
      })
    }

    // Tambahkan baris total
    let totalRow = null
    let totalRowIndex = null
    if (originalData && totalColumnKey && originalData.length > 0) {
      const grandTotal = originalData.reduce((sum, item) => {
        return sum + (parseFloat(item[totalColumnKey]) || 0)
      }, 0)

      totalRow = []
      headers.forEach((header) => {
        if (header.key === 'tiket' && ticketSubHeaders) {
          ticketSubHeaders.forEach(() => {
            totalRow.push('')
          })
        } else if (header.key === 'total_formatted') {
          totalRow.push(grandTotal.toLocaleString('id-ID'))
        } else if (header.key === 'no') {
          totalRow.push('TOTAL')
        } else {
          totalRow.push('')
        }
      })
    }

    // Gabungkan semua data
    let sheetData = [...titleRows]

    console.log(headerTexts, 'headerTexts')
    console.log(subHeaderTexts, 'subHeaderTexts')

    if (ticketSubHeaders && ticketSubHeaders.length > 0) {
      sheetData.push(headerTexts, subHeaderTexts, ...tableData)
    } else {
      sheetData.push(headerTexts, ...tableData)
    }

    // Hitung index untuk jumlah dan total row
    if (jumlahRow) {
      jumlahRowIndex = sheetData.length
      sheetData.push(jumlahRow)
    }
    if (totalRow) {
      totalRowIndex = sheetData.length
      sheetData.push(totalRow)
    }

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData)

    // Set lebar kolom
    worksheet['!cols'] = columnWidths

    // Set merge ranges untuk header
    if (mergeRanges.length > 0) {
      worksheet['!merges'] = mergeRanges
    }

    // Tambahkan merge cells untuk baris JUMLAH dan TOTAL
    if (!worksheet['!merges']) {
      worksheet['!merges'] = []
    }

    // Merge cells untuk baris JUMLAH
    if (jumlahRow && jumlahRowIndex !== null) {
      // Cari kolom 'no' dan kolom sebelum tiket
      let noColIndex = -1
      let beforeTicketColIndex = -1
      let actualColIndex = 0

      headers.forEach((header, index) => {
        if (header.key === 'no') {
          noColIndex = actualColIndex
        }
        if (header.key === 'tiket') {
          beforeTicketColIndex = actualColIndex - 1
          return false // break
        }

        // Increment actual column index
        if (header.key === 'tiket' && ticketSubHeaders) {
          actualColIndex += ticketSubHeaders.length
        } else {
          actualColIndex += 1
        }
      })

      // Merge dari kolom 'no' sampai kolom sebelum tiket
      if (noColIndex >= 0 && beforeTicketColIndex > noColIndex) {
        worksheet['!merges'].push({
          s: { r: jumlahRowIndex, c: noColIndex },
          e: { r: jumlahRowIndex, c: beforeTicketColIndex },
        })
      }
    }

    // Merge cells untuk baris TOTAL
    if (totalRow && totalRowIndex !== null) {
      // Cari kolom 'no' dan kolom sebelum total_formatted
      let noColIndex = -1
      let beforeTotalColIndex = -1
      let actualColIndex = 0

      headers.forEach((header, index) => {
        if (header.key === 'no') {
          noColIndex = actualColIndex
        }
        if (header.key === 'total_formatted') {
          beforeTotalColIndex = actualColIndex - 1
          return false // break
        }

        // Increment actual column index
        if (header.key === 'tiket' && ticketSubHeaders) {
          actualColIndex += ticketSubHeaders.length
        } else {
          actualColIndex += 1
        }
      })

      // Merge dari kolom 'no' sampai kolom sebelum total_formatted
      if (noColIndex >= 0 && beforeTotalColIndex > noColIndex) {
        worksheet['!merges'].push({
          s: { r: totalRowIndex, c: noColIndex },
          e: { r: totalRowIndex, c: beforeTotalColIndex },
        })
      }
    }

    // Styling
    const range = XLSX.utils.decode_range(worksheet['!ref'])
    for (let R = 0; R <= range.e.r; ++R) {
      for (let C = 0; C <= range.e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C })
        const cell = worksheet[cellRef]
        if (!cell) continue

        // Title row styling
        if (R < titleRows.length) {
          cell.s = {
            font: { bold: true, sz: 12 },
          }
          continue
        }

        // Header level 1 styling
        if (R === titleRows.length) {
          cell.s = {
            font: { bold: true },
            alignment: { horizontal: 'center', vertical: 'middle' },
            border: useBorder ? borderStyle() : undefined,
            // fill: { fgColor: { rgb: 'D9E2F3' } },
          }
          continue
        }

        // Header level 2 styling (sub headers)
        if (ticketSubHeaders && R === titleRows.length + 1) {
          cell.s = {
            font: { bold: true, sz: 10 },
            alignment: { horizontal: 'center', vertical: 'middle' },
            border: useBorder ? borderStyle() : undefined,
            // fill: { fgColor: { rgb: 'E8F4FD' } },
          }
          continue
        }

        // Jumlah row styling
        if (jumlahRow && R === jumlahRowIndex) {
          cell.s = {
            font: { bold: true, sz: 11 },
            // fill: { fgColor: { rgb: 'FFF2CC' } },
            alignment: { horizontal: 'left' },
            border: useBorder ? borderStyle() : undefined,
          }
          continue
        }

        // Total row styling
        if (totalRow && R === totalRowIndex) {
          cell.s = {
            font: { bold: true, sz: 11 },
            // fill: { fgColor: { rgb: 'E8F4FD' } },
            alignment: { horizontal: 'left' },
            border: useBorder ? borderStyle() : undefined,
          }
          continue
        }

        // Body row styling
        if (R > titleRows.length + (ticketSubHeaders ? 1 : 0) && useBorder) {
          cell.s = {
            border: borderStyle(),
            alignment: { horizontal: 'left' },
          }
        }
      }
    }

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1')

    const sanitizedFilename = filename.replace(/[<>:"/\\|?*]/g, '_')
    XLSX.writeFile(workbook, sanitizedFilename)

    return true
  } catch (error) {
    console.error('Error in exportToExcel:', error)
    throw error
  }
}

function borderStyle() {
  return {
    top: { style: 'thin', color: { rgb: '000000' } },
    bottom: { style: 'thin', color: { rgb: '000000' } },
    left: { style: 'thin', color: { rgb: '000000' } },
    right: { style: 'thin', color: { rgb: '000000' } },
  }
}

export function exportToCsv(
  titleRows = [],
  headers = [],
  tableData = [],
  filename = 'data.csv',
  namePage,
) {
  const headerTexts = headers.map((h) => h.text)

  if (tableData.length && typeof tableData[0] === 'object' && !Array.isArray(tableData[0])) {
    tableData = tableData.map((obj) => headers.map((h) => obj[h.key]))
  }

  // Gabungkan semua data (tanpa styling karena CSV)
  const sheetData = [...titleRows, headerTexts, ...tableData]

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData)
  const csv = XLSX.utils.sheet_to_csv(worksheet)

  // Trigger download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Export data ke PDF dengan judul dan tabel
 *
 * @param {Object} options
 * @param {Array<Array>} titleRows - Baris judul di atas tabel
 * @param {Array<Object>} headers - Header tabel (text + key)
 * @param {Array<Object>} tableData - Data isi tabel (array of object)
 * @param {string} filename - Nama file PDF
 */
export function exportToPdf(
  titleRows = [],
  headers = [],
  tableData = [],
  filename = 'data.pdf',
  namePage,
) {
  // Use landscape orientation for tables with many columns
  const isWideTable = headers.length > 6
  const orientation = isWideTable ? 'landscape' : 'portrait'
  const doc = new jsPDF(orientation, 'mm', 'a4')

  let startY = 10
  const titleFontSize = 10
  doc.setFontSize(titleFontSize)

  // Tambah title (jika ada)
  titleRows.forEach((row) => {
    doc.text(row[0] || '', 14, startY)
    startY += 6
  })

  // Mapping data untuk autoTable
  const head = [headers.map((h) => h.text)]
  const body = tableData.map((row) => headers.map((h) => row[h.key]))

  // Calculate optimal font size based on number of columns
  const dynamicFontSize = Math.max(5, Math.min(9, Math.floor(12 - headers.length * 0.3)))

  // Calculate column widths dynamically
  const columnStyles = {}
  headers.forEach((header, index) => {
    // Set narrower widths for columns with many columns
    const columnWidth = isWideTable ? 'auto' : header.width ? header.width / 4 : 'auto'
    columnStyles[index] = { cellWidth: columnWidth }
  })

  autoTable(doc, {
    startY,
    head,
    body,
    styles: {
      fontSize: dynamicFontSize,
      cellPadding: isWideTable ? 1 : 3,
      overflow: 'linebreak',
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [230, 230, 230],
      textColor: 20,
      fontStyle: 'bold',
      minCellHeight: 8,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    columnStyles: columnStyles,
    margin: isWideTable
      ? { top: 10, left: 10, right: 10, bottom: 10 }
      : { top: 10, left: 14, right: 14 },
    didDrawPage: function (data) {
      // Add page number at the bottom
      const pageCount = doc.internal.getNumberOfPages()
      const pageSize = doc.internal.pageSize
      const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
      doc.setFontSize(8)
      doc.text(
        'Halaman ' + data.pageNumber + ' dari ' + pageCount,
        data.settings.margin.left,
        pageHeight - 10,
      )
    },
    willDrawCell: function (data) {
      // Adjust cell height for data cells if needed
      if (data.section === 'body') {
        data.cell.styles.minCellHeight = 6
      }
    },
  })

  doc.save(filename)
}
