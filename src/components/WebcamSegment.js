import React from 'react'
import { Segment } from 'semantic-ui-react'

export default function WebSegment(props) {
	const { peer, stream } = props
	const [volume, setVolume] = React.useState(0.5)
    const videoRef = React.useRef()

    React.useEffect(() => {
        videoRef.current.srcObject = stream
    }, [stream])

    return (
        <Segment>
            <h2>{peer}</h2>

            <video volume={volume} ref={videoRef} autoPlay/>
        </Segment>
    )
}