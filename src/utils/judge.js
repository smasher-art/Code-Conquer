// Auto-judge utility for comparing user output with expected output

export function normalizeOutput(output) {
  // output is an array of { type, message }
  // Extract just the log/warn messages, ignoring errors for now
  const lines = output
    .filter(item => item.type === "log" || item.type === "warn")
    .map(item => item.message.trim())
    .filter(line => line.length > 0) // Remove empty lines

  return lines
}

export function judgeOutput(userOutput, expectedOutput) {
  // userOutput: array of log lines
  // expectedOutput: array of expected strings
  // Returns { isCorrect: boolean, feedback: string }
  // Special-case UI-rendered lessons where expectedOutput is a placeholder
  if (Array.isArray(expectedOutput) && expectedOutput.length === 1 && expectedOutput[0] === '(rendered)') {
    return {
      isCorrect: true,
      feedback: 'Rendered (UI-based) — manual verification',
    }
  }

  const normalized = normalizeOutput(userOutput)

  // Check if output matches
  if (normalized.length !== expectedOutput.length) {
    return {
      isCorrect: false,
      feedback: `Expected ${expectedOutput.length} line(s), got ${normalized.length}`,
    }
  }

  // Compare line by line
  for (let i = 0; i < normalized.length; i++) {
    if (normalized[i] !== expectedOutput[i]) {
      return {
        isCorrect: false,
        feedback: `Line ${i + 1} mismatch.\nExpected: "${expectedOutput[i]}"\nGot: "${normalized[i]}"`,
      }
    }
  }

  return {
    isCorrect: true,
    feedback: "Accepted! 🎉",
  }
}
