self.onmessage = (e) => {
  const code = e.data
  const logs = []

  const console = {
    log: (...args) => {
      logs.push(args.join(" "))
    },
  }

  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function("console", code)
    fn(console)

    self.postMessage({ logs })
  } catch (err) {
    self.postMessage({ error: err.message })
  }
}
