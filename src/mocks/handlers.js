import {rest} from 'msw'

export const handlers = [
  rest.get('https://moralesbang.dev/successful', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ message: 'Hello World' })
    )
  }),
  rest.post('https://moralesbang.dev/failure', (req, res, ctx) => {
    return res(
      ctx.status(404)
    )
  })
]
