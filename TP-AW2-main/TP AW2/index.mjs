import http from 'node:http';
import crearReporte from './manejoDeReportes.mjs';
let fecha = new Date();
const archivo =`log-(${fecha.getDate(fecha)}-${fecha.getMonth(fecha)+1}-${fecha.getFullYear(fecha)}).txt`
const archivoSplit = archivo.split('-')

//creamos constante con el puerto
const puerto = 3000;
//creamos directorio
const directorio = 'reportes';
//creamos el nombre y extension del archivo


const servidor = http.createServer(async (req, res) => {
    //ruta tiene que ser log
    if (req.url === '/log') {
        //metodo post
        if  (req.method === 'POST') {
            //creo reporte
            let reporte;
            try{
                if ()
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