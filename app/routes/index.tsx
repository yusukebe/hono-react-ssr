import type { Context } from 'sonik'

export default function Index(c: Context) {
  return c.render(
    <div>
      <h2>Hello!</h2>
    </div>,
    {
      title: 'React SSR'
    }
  )
}
