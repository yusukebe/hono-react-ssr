import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'
import { renderToString } from 'react-dom/server'

declare module 'hono' {
  interface ContextRenderer {
    (node: React.ReactNode): Response
  }
}

const app = new Hono()

const renderer = createMiddleware(async (c, next) => {
  c.setRenderer((content) => {
    return c.html(
      renderToString(
        <html>
          <body>{content}</body>
        </html>
      )
    )
  })
  await next()
})

app.get('*', renderer)

app.get('/', (c) => {
  return c.render(<h1>Hello!</h1>)
})

export default app
