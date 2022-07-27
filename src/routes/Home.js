import Nweet from "components/Nweet"
import NweetFactory from "components/NweetFactory"
import { dbService, storageService } from "fbinstance"
import React, { useEffect, useState } from "react"

const Home = ({userObj}) => {
    const [nweets, setNweets] = useState([])

    useEffect(() => {
        dbService.collection("nweets").onSnapshot(snapshot => {
            const nweetArry = snapshot.docs.map(doc => ({id : doc.id, ...doc.data()})) // snapshot : 실시간 확인 가능
            setNweets(nweetArry)
        })
    }, [])
    
    let keyNum = 0

    return (
        <div className="container">
            <NweetFactory userObj={userObj}/>
            <div style={{ marginTop: 30 }}> {/* 반복문을 돌릴 때는 key 속성 값을 주어야 한다. */}
                {nweets.map((nweet) => {
                    return (
                        <Nweet key={keyNum} nweetObj = {nweet} isOwner = {nweet.creatorId === userObj.uid} />
                    )
                })}
            </div>
        </div>
    )
  
}

export default Home