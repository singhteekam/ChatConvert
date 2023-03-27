const express= require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const fs = require('fs');
const multer = require('multer');
const cors= require("cors");
// const bodyParser = require('body-parser');
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());



// Configure the bodyParser middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//     extended: true
// }));

// This middleware informs the express application to serve our compiled React files
    // app.use(express.static(path.join(__dirname, '/frontend/build')));

    // app.get('*', function (req, res) {
    //     res.sendFile(path.join(__dirname, '/frontend/build/index.html'), function (err){
    //         res.status(500).send(err);
    //     });
    // });


// // Catch any bad requests
// app.get('*', (req, res) => {
//     res.status(200).json({
//         msg: 'Catch All'
//     });
// });


// const data = fs.readFileSync('chat.txt', 'utf8');
// const lines = data.split('\n');

const upload = multer({ dest: 'uploads/' });

let messages=[];

app.get('/', (req, res) => {
    console.log(messages[0]);
    res.send(messages);
});

async function deleteFile(filePath) {
    try {
        await fs.promises.unlink(filePath);
        console.log('File deleted successfully!');
    } catch (error) {
        console.error(error);
    }
}

app.post('/process-file', upload.single('file'), (req, res) => {
    fs.readFile('uploads/' + req.file.filename, 'utf8', (err, data) => {
        if (err) throw err;

        const lines = data.split('\n');
        let id = -1;
        const allMessages = lines.map(line => {
            const parts = line.split(' - ');
            if (parts.length === 1) {
                return { message: parts[0] };
            }
            const [timestamp, sender, extraMessage] = parts;
            const [date, time] = timestamp.split(', ');
            const [senderName, message] = sender.split(': ');
            id++;
            return {
                id,
                date,
                time,
                sender: senderName,
                message,
                extraMessage
            };
        });

        allMessages.shift(); 

        function deepCopy(arr) {
            return JSON.parse(JSON.stringify(arr));
        }
        // Deleting file from upload folder permanently. No file backup is maintained. 
        //The uploaded file will be deleted immediately after displaying the chat messages.
        deleteFile('uploads/' + req.file.filename);  
        messages = deepCopy(allMessages);
        // console.log(messages[1]);
        // res.redirect('/');
        res.send(messages)
    });
});



app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
