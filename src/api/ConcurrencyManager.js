const ConcurrencyManager = (axios, MAX_CONCURRENT = 10, customRequestHandler, customResopnseHandler) => {
  if (MAX_CONCURRENT < 1)
    throw "Concurrency Manager Error: minimun concurrent requests is 1";
  let instance = {
    queue: [],
    running: [],
    shiftInitial: () => {
      setTimeout(() => {
        if (instance.running.length < MAX_CONCURRENT) {
          instance.shift();
        }
      }, 0)
    },
    push: reqHandler => {
      instance.queue.push(reqHandler)
      instance.shiftInitial()
    },
    shift: () => {
      if (instance.queue.length) {
        const queued = instance.queue.shift()
        queued.resolver(queued.request)
        instance.running.push(queued)
      }
    },
    // Use as interceptor. Queue outgoing requests
    requestHandler: req => {
      return new Promise(resolve => {
        instance.push({ request: req, resolver: resolve })
      })
    },
    // Use as interceptor. Execute queued request upon receiving a response
    responseHandler: res => {
      // console.log('responseHandler')
      instance.running.shift()
      instance.shift()
      return res;
    },
    errorResponseHandler: error => {
      // console.log(`errorResponseHandler - ${error}`)
      instance.running.shift()
      instance.shift()
      return Promise.reject(error)
    },
    interceptors: {
      request: null,
      response: null
    },
    detach: () => {
      axios.interceptors.request.eject(instance.interceptors.request)
      axios.interceptors.response.eject(instance.interceptors.response)
    }
  }

  // queue concurrent requests
  instance.interceptors.request = [
    axios.interceptors.request.use(
    instance.requestHandler
  ), axios.interceptors.request.use(
    customRequestHandler
  )]

  instance.interceptors.response = [axios.interceptors.response.use(
    instance.responseHandler,
    instance.errorResponseHandler
  ), axios.interceptors.response.use(
    null,
    customResopnseHandler
  )]
  return instance
}

export default ConcurrencyManager