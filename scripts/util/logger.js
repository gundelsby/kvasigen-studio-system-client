// https://developer.mozilla.org/en-US/docs/Web/API/console#outputting_text_to_the_console

const colors = {
  neutral: '07a0c3',
  warning: 'ffb000',
  error: 'f71735',
  success: '66ff66',
  background: '282828',
};

export default function getLogger(id) {
  return {
    log: (...args) => {
      const { message, leftovers } = parseArgs(args);
      console.log(
        `%c${id}:`,
        `color: #${colors.neutral}`,
        `${message}`,
        leftovers.length > 0 ? leftovers : undefined,
      );
    },
    warn: (...args) => {
      const { message, leftovers } = parseArgs(args);
      console.log(
        `%c${id}:`,
        `color: #${colors.warning}`,
        `${message}`,
        leftovers.length > 0 ? leftovers : undefined,
      );
    },
    error: (...args) => {
      const { message, leftovers } = parseArgs(args);
      console.log(
        `%c${id}:`,
        `color: #${colors.error}`,
        `${message}`,
        leftovers.length > 0 ? leftovers : undefined,
      );
    },
    success: (...args) => {
      const { message, leftovers } = parseArgs(args);
      console.log(
        `%c${id}:`,
        `color: #${colors.success}`,
        `${message}`,
        leftovers.length > 0 ? leftovers : undefined,
      );
    },
  };
}

function parseArgs(args) {
  const message = typeof args[0] === 'string' ? args[0] : '';
  const leftovers = message ? args.slice(1) : args.slice();

  return { message, leftovers };
}
