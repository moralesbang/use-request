export function validService (hookName, service) {
  if (service?.constructor.name !== 'Function') {
    throw Error(`🚨 You must to provide a valid service for ${hookName}`)
  }
}