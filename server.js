let http = require("http"); // -------------------------------- Appelle http dans la bibliothèqe de node.js
let url = require("url"); // ---------------------------------- Appelle url dans la bibliothèqe de node.js
let ejs = require("ejs");
let fs = require("fs");


const {
    parse
} = require('querystring');

let Student = [];
let Sujet = [];



http.createServer(function (request, reponse) {
    let page = url.parse(request.url).pathname;
    reponse.writeHead(200);


    if (page == '/') {
        ejs.renderFile("views/index.ejs", {
            name: Student,
            subject: Sujet
        }, function (err, str) {
            reponse.write(str);
            reponse.end();
        });
    }


    if (page == 'style.css') {fs.readFile('style.css', function (err, data) {
            reponse.write(data);
            reponse.end();
        });
    }


    if (request.method === 'POST' && page == "/actionStudent") {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            let lol = parse(body);
            Student.push(lol.student);


        });
    }


    if (page == '/actionStudent') {
        reponse.writeHead(301, {
            'Location': '/'
        })
    }


    if (request.method === 'POST' && page == "/actionSujet") {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            if (Student.length > 0) {
                let lol = parse(body);
                let index = Math.floor(Math.random() * Student.length)

                let ramdomStudent = Student[index]

                Sujet.push({
                    Sujet: lol.sujet,
                    student: ramdomStudent
                });
                Student.splice(index, 1)
            }
        });
    }


    if (page == '/actionSujet') {
        reponse.writeHead(301, {
            'Location': '/'
        })
    }


    let donneesStudent = JSON.stringify(Student)
    fs.writeFileSync('student.json', donneesStudent)

    let donneesSujet = JSON.stringify(Sujet)
    fs.writeFileSync('sujet.json', donneesSujet)


    reponse.end();
    console.log('Node.js server running on port 1337.')
}).listen(1337);