import http from 'node:http';
import crearReporte from './manejoDeReportes.mjs';
//creamos constante con el puerto
const puerto = 3000;
//creamos directorio
const directorio = 'reportes';
//creamos el nombre y extension del archivo
const archivo = 'log.txt';

const servidor = http.createServer(async (req, res) => {
    //ruta tiene que ser log
    if (req.url === '/log') {
        //metodo post
        if  (req.method === 'POST') {
            //creo reporte
            let reporte;
            try{
                //pasamos el nombre de directorio y archivo como objeto
                reporte = await crearReporte({ directorio, archivo });
            } catch (error) {
                console.log(error);
            }
            if (reporte) {
                res.statusCode = 201;
                res.end();

            } else {
                res.statusCode = 500;
                res.end();
            }
        } else {
            //si metodo no es post devolvemos 404
            res.statusCode = 404;
            res.end();
        }
    } else {
        //si la ruta no esta configurada, 404
        res.statusCode = 404;
        res.end();
    }
});
servidor.listen(puerto);