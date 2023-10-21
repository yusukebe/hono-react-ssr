import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'
import { Suspense } from 'react'
import { renderToReadableStream, renderToString } from 'react-dom/server'
import { suspend } from 'suspend-react'

declare module 'hono' {
  interface ContextRenderer {
    (node: React.ReactNode, props?: { stream?: boolean }): Promise<Response>
  }
}

const app = new Hono()

const renderer = createMiddleware(async (c, next) => {
  c.setRenderer(async (content, props) => {
    const layout = (
      <html>
        <body>
          <nav>
            <a href="/">Top</a>
          </nav>
          {content}
        </body>
      </html>
    )

    if (props?.stream) {
      const stream = await renderToReadableStream(layout)
      return new Response(stream, {
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'Content-Type': 'text/html'
        }
      })
    }

    const html = renderToString(layout)
    return c.html(html)
  })
  await next()
})

app.get('*', renderer)

app.get('/', (c) => {
  return c.render(
    <div>
      <h1>Hello!</h1>
      <a href="/streaming">React SSR Streaming</a>
    </div>
  )
})

function Component() {
  const data = suspend(async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/todos')
    return res.json<{ id: number; title: string }[]>()
  }, [])
  return (
    <ul>
      {data.map((todo) => {
        return <li key={todo.id}>{todo.title}</li>
      })}
    </ul>
  )
}

app.get('/streaming', (c) => {
  return c.render(
    <div>
      <h1>React Streaming</h1>
      <Suspense fallback={<div>loading...</div>}>
        <Component />
      </Suspense>
    </div>,
    {
      stream: true
    }
  )
})

export default app
