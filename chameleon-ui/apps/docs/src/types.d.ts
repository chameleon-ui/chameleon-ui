declare module '*?raw' {
  const source: string
  export default source
}

declare module '@chameleon-ui/components/catalog.json' {
  const catalog: {
    locales: string[]
    components: Array<{
      n: number
      slug: string
      name: string
      requirement: string
      family?: string
    }>
  }
  export default catalog
}
