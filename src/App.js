import React from 'react'
import Peer from 'peerjs'
import randomWords from 'random-words'

import { Header, Grid, Button, Segment, Divider, Input, Form, Confirm } from 'semantic-ui-react'

import InputChooser from './components/InputChooser'
import WebcamSegment from './components/WebcamSegment'

export default function App() {
	const [peer, setPeer] = React.useState()

	const [videoStreams, setVideoStreams] = React.useState([])
	const [incomingCall, setIncomingCall] = React.useState()
	const [targetId, setTargetId] = React.useState()

	React.useEffect(() => {
		const id = randomWords({exactly: 3, join: '-'})
		const peer = new Peer(id)

		peer.on('call', async (call) => setIncomingCall(call))

		setPeer(peer)
	}, [])

	const acceptCall = async () => {
		try {
			const validated = await validateMediaDevices()

			if (!validated) {
				console.log("Camera doesnt work")
				return
			}

			const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
			incomingCall.answer(stream)

			incomingCall.on('stream', (stream) => addVideoStream(incomingCall.peer, stream))
		} catch (error) {
			console.error(error)
		} finally {
			setIncomingCall(null)
		}
	}

	const connectSubmit = async () => {
		try {
			const validated = await validateMediaDevices()

			if (!validated) {
				console.log("Camera doesnt work")
				return
			}

			const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
			const call = peer.call(targetId, stream)

			call.on('stream', (stream) => addVideoStream(targetId, stream))
		} catch (error) {
			console.error(error)
		}
	}

	const validateMediaDevices = async () => {
		if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
			console.log("enumerateDevices() not supported.")
			return Promise.reject()
		}
		  
		// List cameras and microphones.
		try {
			const devices = await navigator.mediaDevices.enumerateDevices()
			for (let device of devices) {
				console.log(device)

				if (device.kind === "videoinput") {
					return Promise.resolve(true)
				}
			}
		} catch (error) {
			return Promise.reject(new Error("Failed listing devices"))
		}
	}

	const addVideoStream = (peer, stream) => {
		setVideoStreams(previous => {
			const exist = false

			for (let videoStream of videoStreams) {
				if (videoStream.peer === peer) {
					exist = true
				}
			}

			if (exist) {
				return previous
			} else {
				return [...previous, { peer, stream }]
			}
			
		})
	}

	return (
		<Grid padded>
			<Grid.Row columns="equal" stretched>
				<Grid.Column width="7">
					<Segment>
						<Header as='h2'>Your ID</Header>
						{peer ? peer.id : "..."}

						<Divider/>
					</Segment>
					<Segment>
						<Header as='h2'>Join peer</Header>
						
						<Form onSubmit={connectSubmit}>
							<Form.Field>
								<Input label="Peer ID" fluid onChange={(event) => setTargetId(event.target.value)}/>
							</Form.Field>
							<Form.Field>
								<Button>Connect</Button>
							</Form.Field>
						</Form>
					</Segment>
					<InputChooser/>
				</Grid.Column>
				<Grid.Column>
					{
						incomingCall &&
							<Confirm
								cancelButton="Reject call"
								confirmButton="Accept call"
								content={`Do you want to accept the video call from ${incomingCall.peer}?`}
								open={!!incomingCall}
								onCancel={() => setIncomingCall(false)}
								onConfirm={() => acceptCall()}
							/>
					}

					{
						videoStreams.map(videoStream => 
							<WebcamSegment peer={videoStream.peer} stream={videoStream.stream} key={videoStream.peer}/>
						)
					}
				</Grid.Column>
			</Grid.Row>
		</Grid>
	)
}