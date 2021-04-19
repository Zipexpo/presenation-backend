const DB = require('./index')
const dbName = require('./index').dbName

async function createScore(scores) {
    try {
        const client = DB.scoreConn()

        const r = await client.insertMany(scores)
        return r.insertedIds
    } catch (e) {
        console.log(e)
    }
}

async function getScoreByPresenterID(id) {
    return await getScores({presenter_id: id})
}

async function getScoreByScorerID(id) {
    return await getScores({user_id: id})
}

async function getScores(filter = {}) {
    const client = DB.scoreConn()

    const r = await client.find(filter).toArray()
    return r
}

async function getPresenterAvgScore(id,students) {
    let data = await getScores({presenter_id: id});
    students.sort((a,b)=>a.studentid-b.studentid);
    let comments = data.length > 0 ? []: null
    let avg = data.length > 0 ? {}: null
    let keys = data.length > 0 ? Object.keys(data[0]).filter(key => key.indexOf('criteria_') === 0) : []
    let flatData = {};
    // Calculate average
    for (let key of keys) {
        avg.presenter_id = data[0].presenter_id;
        avg[key] = 0;
        flatData[key] =[]
    }
    data = data.filter(d=>students[d.user_id-1]);
    data.forEach(e => {
        for (let key of keys) {
            avg[key] += e[key];
            flatData[key].push({level:students[e.user_id-1].level,value:e[key]});
        }
    })

    if (avg) {
        for (let key of keys) {
            avg[key] = parseFloat((avg[key]/(data.length)).toFixed(2))
        }
        delete avg.scorer_name
        delete avg.user_id
    }

    console.log('avg ', avg)

    // Get comments
    comments = data.filter(d => d.comment.trim().length > 0).map(d => ({user_id:d.user_id,comment:d.comment}));

    return {
        avg: avg ? avg : "",
        data: flatData,
        count: data.length,
        comments: comments ? comments : ""
    }
}

module.exports = {
    getScoreByPresenterID: getScoreByPresenterID,
    getScoreByUserID: getScoreByScorerID,
    createScore: createScore,
    getScores: getScores,
    getPresenterAvgScore: getPresenterAvgScore
}
