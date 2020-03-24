import * as _ from 'lodash'
import * as stackTrace from 'stack-trace'
// take a console.* function and prepend output with caller information.
const write_log = (writer: Function) => (...args: any[]): void => {
    // stackTrace.get has wrong line numbers, so use parse.
    const stack_trace = stackTrace.parse(new Error())
    // use index 1 to get caller information.
    const filename = stack_trace[1].getFileName()
    const line = stack_trace[1].getLineNumber()
    // function name is dotted series like exports.a.b.c, so get the last segment.
    let function_name
    const function_full_name = stack_trace[1].getFunctionName()
    if (function_full_name) {
      const function_name_segments = function_full_name.split('.')
      function_name = function_name_segments[function_name_segments.length - 1]
    }
  
    const location = `[${filename}:${line}${function_name ? ' '+function_name : ''}]`
  
    // handle first parameter that is format string.
    if (args.length > 0 && _.isString(args[0]) && /^%[^%]|[^%]%[^%]/.test(args[0])) {
      writer(`${location} ${args[0]}`, ...args.slice(1))
    } else {
      writer(location, ...args)
    }
}
  
export default {
  info: write_log(console.info),
  error: write_log(console.error)
}