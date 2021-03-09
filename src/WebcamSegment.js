import React from 'react'
import { Segment } from 'semantic-ui-react'

export default function WebSegment(props) {
    const { peer, stream } = props
    const videoRef = React.useRef()

    React.useEffect(() => {
        videoRef.current.srcObject = stream
    }, [stream])

    return (
        <Segment>
            <h2>{peer}</h2>

            <video ref={videoRef} autoPlay/>
        </Segment>
    )
}