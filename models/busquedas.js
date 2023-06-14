const fs = require('fs');
const axios = require('axios');


class Busquedas {
    historial = [];
    dbPath = './db/database.json';

    constructor() {
        //TODO: LEER DB SI EXISTENCE
        this.leerDB();

    }

    get historialCapitalizado() {
        
        return this.historial.map(lugar =>{

            let palabras = lugar.split(' ');
            palabras = palabras.map(p =>{

            })

        })
    }

    get paramsMapBox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    };

    get paramsOpenWeather() {
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'

        }
    };

    async buscarCiudad(lugar = '') {
        try {
            //peticion http
            const instance = axios.create({
                baseURL: `https://api.mapbox.com`,
                params: this.paramsMapBox
            });

            const resp = await instance.get(`/geocoding/v5/mapbox.places/${lugar}.json`);

            return resp.data.features.map(lugar => ({
                id: lugar.id,
                name: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));

        } catch (error) {
            return [];
        }
    };

    async climaCiudad(lat, lon) {
        try {
            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org',
                params: { ...this.paramsOpenWeather, lat, lon }

            });

            const resp = await instance.get(`/data/2.5/weather?lat=${lat}&lon=${lon}`)
            const { weather, main } = resp.data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
        } catch (error) {
            return [];
        }
    }

    agregarHistorial(lugar = '') {
        //Evita duplicados
        if (this.historial.includes(lugar.toLocaleLowerCase())) {
            return;
        }

        this.historial.unshift(lugar.toLocaleLowerCase());
        this.guarderDB();
    }

    guarderDB() {

        const payload = {
            historial: this.historial
        };

        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }

    leerDB() {

        if(!fs.existsSync(this.dbPath)) {
            return
        };

        const info = fs.readFileSync(this.dbPath,{encoding: 'utf8'});
        const data = JSON.parse(info);

        this.historial = data.historial;
    }
}




module.exports = Busquedas;