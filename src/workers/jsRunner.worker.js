self.onmessage = (e) => {
  const code = e.data
  const logs = []

  const pushLog = (type, args) => {
    // Convert each argument to string, preserving formatting
    const messages = args.map(arg => {
      if (typeof arg === "string") {
        return arg
      } else if (arg === null) {
        return "null"
      } else if (arg === undefined) {
        return "undefined"
      } else if (typeof arg === "object") {
        return JSON.stringify(arg, null, 2)
      } else {
        return String(arg)
      }
    })

    // Join multiple args with space (like console.log)
    const fullMessage = messages.join(" ")

    logs.push({
      type,
      message: fullMessage,
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
