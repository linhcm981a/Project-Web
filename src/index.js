const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");
const { engine } = require("express-handlebars");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const app = express();
const port = 3000;

const route = require("./routes");
const db = require("./config/db");

//connect db
db.connect();
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan("combined"));

app.use(methodOverride("_method"));

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    helpers: {
      sum: (a, b) => a + b,
      multiplication: (a, b) => a * b,
        checkcurrent: (current) => {
            if (current == 1) {
                return true;
            }else{
                return false;
            }
        },
        items: (current) => {
            var i = (Number(current) > 3 ? Number(current) - 2 : 1);
            if (i != 1) {
                return true;
            }
        },
        for: (current, pages, kq, type) => {
            kq = []
            var i = (Number(current) > 3 ? Number(current) - 2 : 1);
            for (; i <= (Number(current) + 2) && i <= pages; i++) {
                kq.push({
                    location: i,
                    type
                });
            }
            
            return kq;
        },
        for1: (current, pages, kq) => {
            kq = []
            var vt=0;
            var i = (Number(current) > 3 ? Number(current) - 2 : 1);
            for (; i <= (Number(current) + 2) && i <= pages; i++) {
                kq[vt]=i;
                vt++;
            }
            
            return kq;
        },
        checklast: (current, pages) => {           
            if ((Number(current) + 2) < pages) {
                return true;
            } else {
                return false;
            }
        },
        lastitems: (current, pages) => {
            if (current == pages) {
                return true;
            }else{
                return false;
            }
        },
    },
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources", "views"));

app.use(cookieParser());

//route init
app.set("trust proxy", 1);
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 1000 * 60 * 60 },
  })
);

//route init
route(app);

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
