import { isMainThread } from "worker_threads"

const app = required('../app')

describe('GET /games endpoint', () => {
  it('should return an array of Google apps', () => {
    return supertest(app)
      .get('/games')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array')
        expect(res.body).to.have.lengthOf.at.least(1)
      })
  })

  // should I break this into 2 seperate tests?
  it('should allow sorting by rating or app', () => {
    return supertest(app)
      .get('/games')
      .expect(200)
      .expect('Content-Type', /json/)
      .query({ sort: 'Rating' || 'App'}) // can i set sort to variable 'sortKeys'?
      .then(res => {
        expect(res.body).to.be.an('array')
        let sorted = true

        let i = 0
        while(i < res.body.length - 1) {
          const gameAtI = res.body[i]
          const gameAtIPlus1 = res.body[i + 1]

          if (gameAtIPlus1.App < gameAtI.App || gameAtIPlus1.Rating < gameAtI.Rating) {
            sorted = false
            break
          }
          i++
        }
        expect(sorted).to.be.true
      })
  })

  it('should throw an error if sort does not include sortKeys', () => {
    return supertest(app)
      .get('/games')
      .query({ sort: 'MISTAKE' }) // what exactly does this mean?
      .expect(400, 'Sort must be one of Rating or App') // does this need to match the message from
  })

  it('should allow filter by genre', () => {
    return supertest(app)
      .get('/games')
      .expect(200)
      .expect('Content-Type', /json/)
      .query({ genres: allowedGenres }) // can i set genres to variable 'allowedGenres'?
      .then(res => {
        expect(res.body).to.be.an('array')
        // do i need anything else?
      })
  })

  it('should throw an error if genre does not include allowedGenres', () => {
    return supertest(app)
      .get('./games')
      .query({ genres: 'MISTAKE' }) 
      .expect(400, `must include genre of 'allowedGenres'`)
  })
})

// 