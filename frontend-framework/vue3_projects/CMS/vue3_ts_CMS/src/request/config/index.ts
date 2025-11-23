let baseURL = ''
if (import.meta.env.DEV) {
  baseURL = 'http://localhost:8080/v3-ts-cms/'
} else {
  baseURL = '/v3-ts-cms'
}

export { baseURL }
