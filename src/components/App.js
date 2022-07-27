import React, { useEffect, useState } from "react"
import AppRouter from "components/Router"
import {authService} from "../fbinstance"

function App() {
  const [init, setInit] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userObj, setUserObj] = useState(null)
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj({
          displayName : user.displayName,
          uid : user.uid,
          updateProfile : (args) => user.updateProfile(args)
        })
      } else{
        setUserObj(null)
      }
      setInit(true)
    })
  }, [])

  const refreshUser = () => {
    const user = authService.currentUser
    // user 객체를 그대로 저장하면 데이터가 너무 크기 때문에 렌더링에 문제가 생길 수 있어서 이렇게 필요한 데이터만 뽑아서 준다.
    setUserObj({   
      displayName : user.displayName, 
      uid : user.uid,
      updateProfile : (args) => user.updateProfile(args)})
  }

  return(
    <>
      { init ? <AppRouter refreshUser={refreshUser} isLoggedIn={Boolean(userObj)} userObj = {userObj}/> : "Initializing"}
    </>
  )
}

export default App