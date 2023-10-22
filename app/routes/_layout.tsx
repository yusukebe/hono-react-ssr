import type { LayoutHandler } from '@sonikjs/react'

const handler: LayoutHandler = ({ children, head }) => {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {head.createTags()}
      </head>
      <body>
        <div className="wrapper">
          <nav>
            <a href="/">Top</a>
          </nav>
          {children}
        </div>
      </body>
    </html>
  )
}

export default handler
