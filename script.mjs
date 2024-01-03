    import fetch from 'node-fetch';
    import { createConnection } from 'mysql';
    
    fetch('https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/arbresremarquablesparis/records?limit=20')
      .then(response => response.json())
      .then(data => {
        const connection = createConnection({
          host: 'localhost',
          user: 'root',
          password: '',
          database: 'arbresremarquable'
        });
    
        connection.connect((err) => {
          if (err) {
            console.error('Error connecting to database:', err);
            return;
          }
          console.log('Connected to the database!');
    
          const createTableQuery = `
          CREATE TABLE IF NOT EXISTS arbres (
            idbase INT NOT NULL,
            typeemplacement VARCHAR(255),
            domanialite VARCHAR(255),
            arrondissement VARCHAR(255),
            complementadresse VARCHAR(255),
            numero VARCHAR(255),
            adresse VARCHAR(255),
            idemplacement VARCHAR(255),
            libellefrancais VARCHAR(255),
            genre VARCHAR(255),
            espece VARCHAR(255),
            varieteoucultivar VARCHAR(255),
            circonferenceencm INT,
            hauteurenm INT,
            stadedeveloppement VARCHAR(255),
            remarquable VARCHAR(255),
            lon DECIMAL(10, 8),
            lat DECIMAL(10, 8),
            PRIMARY KEY (idbase)
        )
          `;
          
          connection.query(createTableQuery, (err, result) => {
            if (err) {
              console.error('Error creating table:', err);
              connection.end();
              return;
            }
            console.log('Table "arbres" created successfully!');

            const insertQuery = `INSERT INTO arbres (
                idbase,
                typeemplacement,
                domanialite,
                arrondissement,
                complementadresse,
                numero,
                adresse,
                idemplacement,
                libellefrancais,
                genre,
                espece,
                varieteoucultivar,
                circonferenceencm,
                hauteurenm,
                stadedeveloppement,
                remarquable,
                lon,
                lat
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            
    
            data.results.forEach(tree => {
                const {
                    arbres_idbase,
                    arbres_typeemplacement,
                    arbres_domanialite,
                    arbres_arrondissement,
                    arbres_complementadresse,
                    arbres_numero,
                    arbres_adresse,
                    arbres_idemplacement,
                    arbres_libellefrancais,
                    arbres_genre,
                    arbres_espece,
                    arbres_varieteoucultivar,
                    arbres_circonferenceencm,
                    arbres_hauteurenm,
                    arbres_stadedeveloppement,
                    com_resume,
                    geom_x_y: { lon, lat }
                } = tree;
            
                const values = [
                    arbres_idbase,
                    arbres_typeemplacement,
                    arbres_domanialite,
                    arbres_arrondissement,
                    arbres_complementadresse,
                    arbres_numero,
                    arbres_adresse,
                    arbres_idemplacement,
                    arbres_libellefrancais,
                    arbres_genre,
                    arbres_espece,
                    arbres_varieteoucultivar,
                    arbres_circonferenceencm,
                    arbres_hauteurenm,
                    arbres_stadedeveloppement,
                    com_resume,
                    lon,
                    lat
                ];
            
                connection.query(insertQuery, values, (err, result) => {
                    if (err) {
                        console.error('Error inserting data:', err);
                        return;
                    }
                    console.log('Data inserted successfully:', result);
                });
            });
            
            connection.end();
            
          });
        });
      })
      .catch(error => {
        console.error('Error fetching dataset:', error);
      });
    