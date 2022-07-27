import { dbService, storageService } from "fbinstance"
import React, { useState } from "react"
import { v4 as uuidv4} from "uuid"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFactory = ({userObj}) => {
    const [attachment, setAttachment] = useState("")
    const [nweet, setNweet] = useState("")
    const onSubmit = async (event) => {
        if (nweet === "") {
            return;
          }
      
        event.preventDefault()
        let attachmentUrl = ""
        if (attachment != "") {
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`)
            const response = await attachmentRef.putString(attachment, "data_url")
            console.log(response)
            attachmentUrl = await response.ref.getDownloadURL()
        }
        const nweetObj = {
            text: nweet,
            creatorId : userObj.uid,
            createdAt : Date.now(),
            attachmentUrl
        }
        await dbService.collection("nweets").add(nweetObj)
        setNweet("")
    }
    const onChange = (event) => {
        const {target: {value }} = event
        setNweet(value)
    }

    const onFileChange = (event) =>  {
        const {target : {files}} = event
        const theFile = files[0]
        const reader = new FileReader()
        reader.onloadend = (finishedEvent) => {
            const {currentTarget : {result}} = finishedEvent
            setAttachment(result)
        }
        reader.readAsDataURL(theFile)
    }

    const onClearAttachment = () => setAttachment("");

    return (
        <div> {/* 반복문을 돌릴 때는 key 속성 값을 주어야 한다. */}
            <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input
                className="factoryInput__input"
                value={nweet}
                onChange={onChange}
                type="text"
                placeholder="What's on your mind?"
                maxLength={120}
                />
                <input type="submit" value="&rarr;" className="factoryInput__arrow" />
            </div>
            <label htmlfor="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
                <input id="attach-file"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{
                opacity: 0,
                }}/>
            
                {attachment && 
                    <div className="factoryForm__attachment">
                        <img
                            src={attachment}
                            style={{
                            backgroundImage: attachment,
                            }}
                        />
                        <div className="factoryForm__clear" onClick={onClearAttachment}>
                            <span>Remove</span>
                            <FontAwesomeIcon icon={faTimes} />
                        </div>
                    </div>
                } 
            </form>
        </div>
    )
}

export default NweetFactory