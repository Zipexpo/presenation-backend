const router = require('express').Router()
const db = require('../db/scores')
const studentDB = require('../db/students')

router.post('', async (req, res) => {
    const r = await db.createScore([req.body])
    res.status(200).send(r)
})

router.get('', (req, res) => {
    db.getScores().then(scores => res.status(200).send(scores)).catch(err => res.status(500).send(err))
})

router.get('/:id', async (req, res) => {
    const students = await studentDB.getStudentList()
    const data = await db.getPresenterAvgScore(req.params.id,students);
    res.status(200).send(data)
})

module.exports = router
