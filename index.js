import express from "express";
import morgan from 'morgan';
import fs from 'fs';
import bodyParser from "body-parser";
import qrImage from "qr-image";
import url from "url";
import path from "path";

const app = express();
const port = 8080;
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const filename = 'qr.png';
const basePath = __dirname + '/public/images/';
const imgPath = path.normalize('/images/qr.png');
let inputURL = '';

const getURL = (req, res, next) => {
    inputURL = req.body["inputURL"];
    next();
};

const validateURL = () => {
    try {
        new url.URL(inputURL);
        return true;
    } catch {
        return false;
    }
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(getURL);
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/submit", (req, res) => {
    if(validateURL()) {
        let qr_png = qrImage.image(inputURL, { type: 'png' });
        qr_png.pipe(fs.createWriteStream(basePath + filename));
        res.render("index.ejs", { flag: 1, inputURL: inputURL, imgPath: imgPath });
    } else {
        res.render("index.ejs", { flag: 1 });
    }
});

app.listen(port, () => {
    console.log(`Listening to port: ${port}.`);
});