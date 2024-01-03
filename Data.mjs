import fs from 'fs';
import { createConnection } from 'mysql';
import { writeToPath } from 'fast-csv';
import { sampleCorrelation } from 'simple-statistics';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'arbresremarquable',
};

const loadFromDatabase = () => {
  return new Promise((resolve, reject) => {
    const connection = createConnection(dbConfig);
    const query = 'SELECT hauteurenm, circonferenceencm FROM arbres';

    connection.query(query, (error, results) => {
      if (error) {
        connection.end();
        reject(error);
      } else {
        connection.end();
        resolve(results);
      }
    });
  });
};

const processData = (data) => {
  const filteredData = data.filter(row => row.hauteurenm !== null && row.circonferenceencm !== null);
  console.log("Filtered data:", filteredData);

  const sizes = filteredData.map(row => Number(row.hauteurenm));
  const circonferences = filteredData.map(row => Number(row.circonferenceencm));
  const correlation = sampleCorrelation(sizes, circonferences);

  console.log(`Corrélation entre taille et circonférence après traitement : ${correlation}`);
  console.log(`Nombre de lignes avant traitement : ${data.length}`);
  console.log(`Nombre de lignes après traitement : ${filteredData.length}`);
  
  return filteredData;
};

const exportCSV = (data, outputPath) => {
  const csvStream = writeToPath(outputPath, data, { headers: true });
  
  return new Promise((resolve, reject) => {
    csvStream
      .on('finish', () => {
        resolve();
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};


const outputFilePath = 'C:\\Users\\21651\\Desktop\\Fetch\\output.csv';

loadFromDatabase()
  .then(processData)
  .then((processedData) => exportCSV(processedData, outputFilePath))
  .then(() => console.log('Traitement terminé et résultats exportés.'))
  .catch((error) => console.error('Une erreur s\'est produite :', error));
