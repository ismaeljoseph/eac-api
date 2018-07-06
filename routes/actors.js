const router = require('koa-router')({prefix: '/actors'})
const apiRender = require('../utils').apiRender

const Actor = require('../models/actor')

router
  .get('/', async ctx => {
    const actors = await Actor.find().limit(100)
    apiRender(ctx, actors)
  })

  .get('/search/:q', async ctx => {
    // Perform a _logical AND_ search
    const words = ctx.params.q.replace(/\s+/, ' ').split(' ').map(w => `"${w}"`).join(' ')
    const criteria = {
      $text: {
        $search: words
      }
    }
    // Filter with certain domains
    const domains = ctx.request.query.domains && ctx.request.query.domains.split(',')
    if (domains) {
      criteria.domains = {
        $in: domains
      }
    }
    // Search within 100km
    const from = ctx.request.query.from
    let actors
    if (from) {
      const location = from.split(',').map(v => Number(v))
      criteria.loc = {
        $geoWithin: {
          $centerSphere: [location, 100 / 3963.2]
        }
      }
      actors = await Actor.find(criteria).limit(100)
      // Calculate the distance and sort
      actors.forEach(actor => {
        actor.location = location
      })
      actors.sort((a, b) => a.distance - b.distance)
    } else {
      actors = await Actor.find(criteria).limit(100)
    }
    apiRender(ctx, actors)
  })

  .get('/:id', async ctx => {
    const actor = await Actor.findOne({
      _id: ctx.params.id
    })
    actor.location = ctx.request.query.from
    apiRender(ctx, actor)
  })

module.exports = router