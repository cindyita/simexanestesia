import { useEffect } from "react";
import Papa from "papaparse";

export default function CsvImporter({ file, onData, options = {} }) {
  useEffect(() => {
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      ...options,
      complete: (results) => {
        if (onData) {
            onData(results.data);
            console.log(results.data);
        } 
      },
    });
  }, [file]);

  return null;
}
