import { Hono } from 'hono'
import { renderToString } from 'react-dom/server'

const app = new Hono()

app.get('/', (c) => {
  return c.html(
    renderToString(
      <html>
        <body>
          <h1>Hello</h1>
        </body>
      </html>
    )
  )
})

export default app
