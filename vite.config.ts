import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import stylex from '@stylexjs/unplugin'

function canonicalUiPath(base: string): Plugin {
  const route = `${base.replace(/\/$/, '')}/ui`
  const redirect = (req: { url?: string }, res: { writeHead: (status: number, headers: Record<string, string>) => unknown; end: () => unknown }, next: () => void) => {
    const [path, ...query] = (req.url ?? '').split('?')
    if (path !== route) return next()
    res.writeHead(308, { Location: `${route}/${query.length ? `?${query.join('?')}` : ''}` })
    res.end()
  }
  return {
    name: 'otherstates-ui-path',
    configureServer: server => { server.middlewares.use(redirect) },
    configurePreviewServer: server => { server.middlewares.use(redirect) },
  }
}

// Two pages, one set of component styles. The StyleX plugin appends every compiled rule to a single CSS
// file, so that file has to be one both pages load: the base stylesheet, split into its own "base" chunk.
export default defineConfig({
  plugins: [canonicalUiPath('/'), stylex.vite({
    useCSSLayers: true,
    cssInjectionTarget: file => /(?:^|\/)base(?:-[^/]+)?\.css$/.test(file),
    unstable_moduleResolution: { type: 'commonJS' },
  }), react()],
  build: { rolldownOptions: {
    input: { home: 'index.html', ui: 'ui/index.html' },
    output: { codeSplitting: { groups: [{ name: 'base', test: /src\/ui\/base\.css$/ }] } },
    // Our own modules have no side effects beyond their CSS (no src file is imported only for what it
    // does on load), so the homepage keeps just the components it renders instead of the whole barrel.
    treeshake: { moduleSideEffects: id => /\.css(\?|$)/.test(id) || /node_modules/.test(id) },
  } },
})
