self.onmessage = (e) => {
  const code = e.data
  const logs = []

  const pushLog = (type, args) => {
    logs.push({
      type,
      message: args
        .map(arg =>
          typeof arg === "string"
            ? arg
            : JSON.stringify(arg, null, 2)
        )
        .join("\n"),
    })
  }

  const console = {
    log: (...args) => pushLog("log", args),
    warn: (...args) => pushLog("warn", args),
    error: (...args) => pushLog("error", args),
  }

  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function("console", code)
    fn(console)

    self.postMessage({ logs })
  } catch (err) {
    self.postMessage({
      logs: [
        {
          type: "runtime",
          message: err.message,
        },
      ],
    })
  }
}
