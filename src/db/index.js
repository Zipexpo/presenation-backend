const MongoClient = require('mongodb').MongoClient;
const fs = require('fs')
const csv = require('csv-parser');

const studentDB = require('./students')

const uri = require('../../config/keys').mongoURI;
const dbName = 'CS5331-VirtualReality-Fall2020'
let client = null
let studentConn = null
let scoreConn = null

function createClient() {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
    client.connect().then(async res => {
        const db = client.db(dbName)
        studentConn = db.collection('new-group')
        scoreConn = db.collection('new-group-p2-final')
        console.log('Connected to DB')
        // seedStudents()
    }).catch(err => console.log('Failed to connect to DB -' +
        ' ', err))
}

async function seedStudents() {
    const r = await studentConn.deleteMany({})
    console.log('removed : ', r)
    let data = []
    fs.createReadStream('src/db/project2_final_order.csv')
        .pipe(csv())
        .on('data', (row) => {
            data.push(row)
        })
        .on('end', () => {
            studentConn.insertMany(data).then(res => {
                console.log('inserted ids', res)
            })
        });
}

function getClient() {
    return client
}

function getStudentConn() {
    return studentConn
}

function getScoreConn() {
    return scoreConn
}

module.exports = {
    createClient: createClient,
    studentConn: getStudentConn,
    scoreConn: getScoreConn,
    client: getClient,
    dbName: dbName
}
