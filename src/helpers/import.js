// import Papa from 'papaparse';

// async function GetData(artist) {
//     const data = Papa.parse(await fetchCsv());
//     console.log(data);
//     return data;
// }

// async function fetchCsv() {
//     const response = await fetch('data/mycsv.csv');
//     const reader = response.body.getReader();
//     const result = await reader.read();
//     const decoder = new TextDecoder('utf-8');
//     const csv = await decoder.decode(result.value);
//     console.log('csv', csv);
//     return csv;
// }

import XLSX from "xlsx";

export function processTabularData(dataString) {
  const dataStringLines = dataString.split(/\r\n|\n/);
  const headers = dataStringLines[0].split(
    /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
  );

  const list = [];
  for (let i = 1; i < dataStringLines.length; i++) {
    const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
    if (headers && row.length === headers.length) {
      const obj = {};
      for (let j = 0; j < headers.length; j++) {
        let d = row[j];
        if (d.length > 0) {
          if (d[0] === '"') d = d.substring(1, d.length - 1);
          if (d[d.length - 1] === '"') d = d.substring(d.length - 2, 1);
        }
        if (headers[j]) {
          obj[headers[j]] = d;
        }
      }

      // remove the blank rows
      if (Object.values(obj).filter((x) => x).length > 0) {
        list.push(obj);
      }
    }
  }

  // prepare columns list from headers
  const columns = headers.map((c) => ({
    field: c,
    label: c,
  }));

  return { columns, data: list };
}

export function readExcelFile(file) {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = (evt) => {
        /* Parse data */
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        /* Get first worksheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        /* Convert array of arrays */
        const dataString = XLSX.utils.sheet_to_csv(ws, { header: 1 });
        const result = processTabularData(dataString);
        const { columns, data } = result;

        console.log("columns", columns);
        console.log("data", data);
        resolve(result);
      };
      reader.readAsBinaryString(file);
    } catch (e) {
      reject(e);
    }
  });
}
