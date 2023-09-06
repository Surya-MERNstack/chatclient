import React, { useContext } from 'react'
import { UserContext } from './UserContext'
import RegisterAndLoginForm from './RegisterAndLoginForm'
import Chat from './Chat'

const Routes = () => {
    const {username, id} = useContext(UserContext)

    console.log(username, id)

    if(username){
        return <Chat/>
    }

  return (
    <div>
      <RegisterAndLoginForm/>
    </div>
  )
}

export default Routes
