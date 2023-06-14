require('dotenv').config()

const { leerInput, inquirerMenu, pausa, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

const main = async () => {

    const busquedas = new Busquedas();
    let opt;

    do {
        opt = await inquirerMenu();
        switch (opt) {
            case 1:
                // Mostrar mensajes para
                const lugar = await leerInput('Ciudad: ');
                //Buscar los lugares que
                const lugares = await busquedas.buscarCiudad(lugar);
                //Seleccionar el lugar de
                const id = await listarLugares(lugares);

                if (id === '0') continue;
                const lugarSelect = lugares.find(l => l.id === id);
                //Guardar en DB
                busquedas.agregarHistorial(lugarSelect.name);
                //Clima
                const clima = await busquedas.climaCiudad(lugarSelect.lat, lugarSelect.lng)

                //Mostrar resultados
                console.log('\n==========================='.green);
                console.log('Información del la ciudad'.green);
                console.log('===========================\n'.green);
                console.log('Ciudad:', lugarSelect.name.green);
                console.log('Como esta el clima:', clima.desc.green);
                console.log('Temperatura:', clima.temp);
                console.log('Mínima:', clima.min);
                console.log('Máxima:', clima.max);
                console.log('Lat:', lugarSelect.lat);
                console.log('Lng:', lugarSelect.lng);
                break;
            case 2:
                busquedas.historial.forEach((lugar, i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${lugar}`)
                })
                break;
            default:
                break;
        }
        if ( opt !== 0 ) await pausa();
    } while (opt !== 0);

}

main();