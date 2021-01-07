import React, {useState} from 'react'
import {create} from 'apisauce'
import { useRequest } from 'use-request'

const githubApi = create({
  baseURL: 'https://api.github.com/',
  timeout: 3000
})

const fetchUserRepos = username => githubApi.get(`/users/${username}/repos`)

const handleSubmit = callback => event => {
  event.preventDefault()
  callback()
}

function Repos() {
  const [username, setUsername] = useState('')
  const [repos, getRepos] = useRequest({ service: fetchUserRepos, payload: 'moralesbang' })

  if (repos.fetching) {
    return <div role='alert'>Loading...</div>
  }

  return (
    <div>
      <h2>Repos</h2>
      <form onSubmit={handleSubmit(() => getRepos(username))}>
        <input name='username' type='text' onChange={(event) => setUsername(event.target.value)} />
        <button type='submit'>Request</button>
      </form>
      { repos.data?.length ? (
        <>
          <ul>
            {repos.data?.map(repo => <li key={repo.id}>{repo.name}</li>)}
          </ul></>
      ) : <span role='img' aria-label='smiley emoji'>😄</span> }
    </div>
  )
}

function App () {
  const [showComponent, setShowComponent] = useState(true)
  return (
    <>
      {showComponent && <Repos />}
      <button type='button' onClick={() => setShowComponent(!showComponent)}>Toogle Component</button>
    </>
  )
}

export default App
