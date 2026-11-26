import {createStudioServer} from './server.js';
createStudioServer().listen(Number(process.env.PORT)||3000,'0.0.0.0',()=>console.log('ManeeFlow ready'));
