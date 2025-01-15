import React from 'react'
import { NavLink, useRouteError } from 'react-router-dom'

function ErrorPage() {
    const error = useRouteError()
    console.log(error)
  return (
    <div>
      <h2>Oops! Error occuttrd</h2>
      {error && <p>{error.data}</p>}
      <NavLink to="/">
      <button>Go Home</button>
      </NavLink>
    </div>
  )
}

export default ErrorPage
