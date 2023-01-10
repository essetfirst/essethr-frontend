import XLSX from "xlsx";
import moment from "moment";

/**
 * @desc get table data as json
 * @param data
 * @param columns
 */
export const getTableDataForExport = (data, columns) =>
  data.map((record) =>
    columns.reduce(
      (recordToDownload, column) => ({
        ...recordToDownload,
        [column.label]: record[column.field] || "N/A",
      }),
      {}
    )
  );

/**
 * @desc make .xlsx file from given data
 * @param rows
 * @param filename
 */
export const makeExcel = async (data, filename) => {
  // TODO: implement using XLSX
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws);
  const wopts = { bookType: "xlsx", bookSST: false, type: "array" };
  const wbout = await XLSX.write(wb, wopts);
  downloadFile(wbout, `${filename}_${moment().format("YYYY-MM-DD")}.xlsx`, {
    type: "application/octet-stream",
  });
};

/**
 * @desc make .csv file from given data
 * @param rows
 * @param filename
 */
export const makeCsv = async (rows, filename) => {
  const separator = ";";
  const keys = Object.keys(rows[0]);

  const csvContent = `${keys.join(separator)}\n${rows
    .map((row) =>
      keys
        .map((k) => {
          let cell = row[k] === null || row[k] === undefined ? "" : row[k];

          cell =
            cell instanceof Date
              ? cell.toLocaleString()
              : cell.toString().replace(/"/g, '""');

          if (cell.search(/("|,|\n)/g) >= 0) {
            cell = `"${cell}"`;
          }
          return cell;
        })
        .join(separator)
    )
    .join("\n")}`;

  downloadFile(csvContent, filename, { type: "text/csv;charset=utf-8;" });
};

export const downloadFile = (content, filename, contentOptions) => {
  const blob = new Blob([content], contentOptions);
  if (navigator.msSaveBlob) {
    // In case of IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    const link = document.createElement("a");
    if (link.download !== undefined) {
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};
