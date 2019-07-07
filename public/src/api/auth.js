export async function authentication (login, password) {
  const response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      login: login,
      password: password
    })
  })

  const { auth, token } = await response.json()

  if (auth) {
    localStorage.setItem('jwt', token)
  } else {
    console.log('invalid credentials')
  }
}

export function isAuthentified () {
  const jwt = localStorage.getItem('jwt')
  return !!jwt
}
