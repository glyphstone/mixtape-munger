class BasicLogger {
    info(message) {
      console.info(`Info: ${message}`)
    }
    warn(message) {
      console.warn(`Warn: ${message}`)
    }
  
    error(message) {
      console.error(`Error: ${message}`)
    }
  }

exports.BasicLogger = BasicLogger