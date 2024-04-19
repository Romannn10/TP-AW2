import os from 'node:os';
import fsp from 'node:fs/promises';
import path from 'node:path';

//crea directorio para almacenar el reporte

const crearDirectorio = (datos) => {
    return new Promise(async (resolver, rechazar) => {
        try {
            await fsp.mkdir(datos.nombre);
            resolver();
        } catch (error) {
            rechazar(error);
        }
    });
    
};

//crea y abre archivo para escribir los datos

const abrirArchivo = (datos) => {
    return new Promise(async (resolver, rechazar) => {
        //prueba abrir archivo
        let manejador;
        try {
            manejador = await fsp.open(datos.ruta, 'a');
            resolver(manejador);
        } catch (error) {
            //si hay error cierra el archivo
            manejador.close();
            //no deja avanzar
            rechazar(error);

        }
    });
};

//apunta los datos en el archivo 
const escribirReporte = (datos) => {
    return new Promise(async (resolver, rechazar) => {
        //prueba escribir el archivo
        try {
            //escribe los datos
            const escritura = await datos.manejador.write(datos.contenido);
            datos.manejador.close();
            resolver(escritura);
        //si hay errir cierra
        } catch (error) {
            
            rechazar(error);
        }
    });

};

//funcion principal
const crearReporte = (datos) => {
    return new Promise(async (resolver, rechazar) => {
        //intenta crear directorio
        try {
            await crearDirectorio({ nombre: datos.crearDirectorio});
        } catch (error) {
            console.log('el directorio ya existe')
        }

        //creamos ruta
        const ruta = path.join(datos.directorio, datos.archivo);

        //abrimos archivo para apuntar, si no existe el recurso, se crea
        let manejador;
        try {
            manejador = await abrirArchivo({ ruta });

        } catch (error) {
            rechazar(error);
        }

        //obtenemos datos del estado del servidor
        const fechaActual = new Date(Date.now());
        const inicioActividad = new Date(Date.now() - os.uptime() * 1000);

        //obtenemos y formateamos datos
        const cpus = JSON.stringify(os.cpus());
        const memoriaTotal = os.totalmem() /1024 /1024;
        const memoriaLibre = os.freemem() / 1024 / 1024;
        const memoriaEnUso = memoriaTotal - memoriaLibre;
        const interfacesDeRed = JSON.stringify(os.networkInterfaces());
        //variable que almacena los datos 
        let contenidoLog = '';
        contenidoLog += `---------------------------------`
        contenidoLog += os.EOL;
        contenidoLog += `Fecha: ${fechaActual}`;
        contenidoLog += os.EOL;
        contenidoLog += `Inicio de actividad: ${inicioActividad}`;
        contenidoLog += os.EOL;
        contenidoLog += `Tiempo de actividad: ${os.uptime()} segundos`;
        contenidoLog += os.EOL;
        contenidoLog += `Estado de los CPU: ${os.EOL}${cpus}`;
        contenidoLog += os.EOL;
        contenidoLog += `Memoria RAM total: ${memoriaTotal}Mb`;
        contenidoLog += os.EOL;
        contenidoLog += `Memoria RAM utilizada: ${memoriaEnUso}Mb`;
        contenidoLog += os.EOL;
        contenidoLog += `Interfaces de red: ${os.EOL}${interfacesDeRed}`;
        contenidoLog += os.EOL;

        //escribimos datos
        let escritura;
        try{
            escritura = await escribirReporte({
                manejador,
                contenido: contenidoLog,
            });
            resolver(escritura);
        } catch (error) {
            rechazar(error);
        }
    });
};

//exportamos funcion
export default crearReporte;




