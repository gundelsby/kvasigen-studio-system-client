// https://developer.mozilla.org/en-US/docs/Web/API/console#outputting_text_to_the_console

const colors = {
  neutral: '07a0c3',
  warning: 'ffb000',
  error: 'f71735',
  success: '66ff66',
  background: '282828',
};

/**
 * Create a logger
 *
 * @param {string} id - module id for this logger
 */
export default function getLogger(id) {
  //no-op logger when not in a browser (annoying when running tests)
  // eslint-disable-next-line no-undef
  if (!globalThis.window) {
    return {
      log: () => {},
      warn: () => {},
      error: () => {},
      success: () => {},
    };
  }

  return {
    log: (...args) => {
      const { message, leftovers } = parseArgs(args);
      console.log(...buildArgs(id, colors.neutral, message, leftovers));
    },
    warn: (...args) => {
      const { message, leftovers } = parseArgs(args);
      console.warn(...buildArgs(id, colors.warning, message, leftovers));
    },
    error: (...args) => {
      const { message, leftovers } = parseArgs(args);
      console.error(...buildArgs(id, colors.error, message, leftovers));
    },
    success: (...args) => {
      const { message, leftovers } = parseArgs(args);
      console.log(...buildArgs(id, colors.success, message, leftovers));
    },
  };
}

function parseArgs(args) {
  const message = typeof args[0] === 'string' ? args[0] : null;
  const leftovers = message ? args.slice(1) : args.slice();

  return { message, leftovers };
}

function buildArgs(id, colorCode, message, args) {
  const logArgs = [`%c${id}:`, `color: #${colorCode}`];

  if (message) {
    logArgs.push(message);
  }

  if (args.length > 0) {
    logArgs.push(...args);
  }

  return logArgs;
}
