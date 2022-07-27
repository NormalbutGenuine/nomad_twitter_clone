import { authService } from "fbinstance"
import React, { useState } from "react"

const AuthForm = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [newAccount, setNewAccount] = useState(true)
    const [error, setError] = useState("")

    const onChange = (event) => { // 인풋 창에 값을 넣을 때마다
        const {target: {name, value}} = event
        if (name === "email") {
            setEmail(value)
        } else if(name==="password") {
            setPassword(value)
        }
    }
    const onSubmit = async (event) => {
        event.preventDefault(); // 기본으로 설정된 액션을 실행시키지 않음
        try {
            let data = ""
            if (newAccount) {
                // create account
                data = await authService.createUserWithEmailAndPassword(email, password)
            } else{
                // log in
                data = await authService.signInWithEmailAndPassword(email, password)
            }
            console.log(data)
        } catch(error){
            setError(error.message)
        }
        
    }
    const toggleAccount = () => setNewAccount(prev => !prev)


    return (
        <>
            <form onSubmit={onSubmit} className="container">
                    <input type="email" placeholder="Email" required value={email} name="email" onChange={onChange} className="authInput"/>
                    <input type="password" placeholder="Password" required value={password} name="password" onChange={onChange} className="authInput"/>
                    <input type="submit" value={newAccount ? "Create Account" : "Log in"} />
                    {error && <span className="authError">{error}</span>}
            </form>
            <span onClick={toggleAccount} className="authInput authSubmit">{newAccount ? "Sign in." : "Create ACcount"}</span>
        </>
    )
}

export default AuthForm