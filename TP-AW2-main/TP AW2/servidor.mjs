import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import fsp from 'node:fs/promises';

const servidor = http.createServer(async (req, res) => {
    if (req.url === '/log') {
        if (req.method === 'POST') {
        try{
           await fsp.mkdir('reportes');
      } catch (error){
           console.log('el directorio ya existe')

    }
    const fechaActual = new Date(Date.now());
    const inicioActividad = new Date(Date.now() - os.uptime() * 1000);
    const cpus = JSON.stringify(os.cpus());
    const memoriaTotal = os.totalmem() /1024 / 1024;
    const memoriaLibre = os.freemem() / 1024 /1024;
    const memoriaEnUso = memoriaTotal - memoriaLibre;
    const interfacesDeRed = JSON.stringify(os.networkInterfaces());
    let contenidoLog = '';
    contenidoLog += `---------------------------------`;
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
    //creamos ruta
    const ruta = path.join('reportes', 'log.txt');
    let escritura;

   
    try{
        const manejador = await fsp.open(ruta, 'a')
        //escribimos datos
        escritura = await manejador.write(contenidoLog);
        //cerramos el manejador del archivo abierto
        manejador.close();

    }catch(error) {
        console.log(error);
    }
    if(escritura) {
        res.statusCode = 201;
        res.end();
    } else {
        res.statusCode = 500;
        res.end();
    }
        } else {
            res.statusCode = 404;
            res.end();
        }
    } else {
        res.statusCode = 404;
        res.end();
    }
    
    
} )
servidor.listen(3000);