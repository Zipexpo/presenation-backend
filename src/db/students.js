const fs = require('fs')
const csv = require('csv-parser');

const DB = require('./index')
const dbName = require('./index').dbName
const scoreDB = require('./scores')

async function getStudents(filter = {}) {
    const client = DB.studentConn()
    const r = await client.find(filter).toArray()
    return r
}

async function putStudent(id, student) {
    try {
        const client = DB.studentConn()

        const r = await client.updateOne({id: id}, {$set: student})
        return r
    } catch (e) {
        console.log(e)
        return e
    }
}

async function createStudents(students) {
    try {
        const client = DB.studentConn()

        const r = await client.insertMany(students)

        return r.insertedIds
    } catch (err) {
        console.log(err.stack);
    }
}

async function removeStudents(filter = {}) {
    try {
        const client = DB.studentConn()

        const r = await client.deleteMany(filter)
        return r.deletedCount
    } catch (err) {
        console.log(err.stack);
    }
}

async function seedStudents() {
    const r = await removeStudents()
    console.log('removed : ', r)
    let data = []
    fs.createReadStream('src/db/presentation.csv')
        .pipe(csv())
        .on('data', (row) => {
            data.push(row)
        })
        .on('end', () => {
            createStudents(data).then(res => {
                console.log('inserted ids', res)
            })
        });
}


module.exports = {
    getStudents: getStudents,
    putStudent: putStudent,
    createStudents: createStudents,
    removeStudents: removeStudents,
    seedStudents: seedStudents
}


