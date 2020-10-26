const express = require('express')
const bodyparser = require('body-parser');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const db = require("./models/index");
const Role = db.role;
const dbConfig = require('./config/db.config');

const app = express();

app.use(bodyparser.json());

var corsOptions = {
    origin: "http://localhost:8081"
  };
  app.use(cors(corsOptions));

  db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

  function initial() {
    Role.estimatedDocumentCount((err, count) => {
      if (!err && count === 0) {
        new Role({
          name: "user"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'user' to roles collection");
        });
  
        new Role({
          name: "moderator"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'moderator' to roles collection");
        });
  
        new Role({
          name: "admin"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'admin' to roles collection");
        });
      }
    });
  }

  const swaggerOptions = {
    swaggerDefinition: {
      info: {
        version: "1.0.0",
        title: "Customer API",
        description: "Customer API Information",
        contact: {
          name: "Amazing Developer"
        },
        servers: ["http://localhost:5000"]
      }
    },
    //
    apis: ['.routes/*.js']
  };
  
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use("/documentation", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// const config = require('./dbconfig');
// mongoose.connect(config.dburl);
// mongoose.connection.on('connected', ()=>{
// console.log('db connected');
// })
// mongoose.connection.on('error', err=>{
//     console.log('error ', err);
// })
/**
 * @swagger
 * /Users:
 * /get:
 *
 */

app.use((req, res, next)=>{
  console.log('req came ', req);
  next();
})
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);




const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});