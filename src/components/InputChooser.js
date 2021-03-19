import React from 'react'

import { Segment, Header, Dropdown, Divider } from 'semantic-ui-react'

export default function InputChooser(props) {
	const [videoInputOptions, setVideoInputOptions] = React.useState()
	const [audioInputOptions, setAudioInputOptions] = React.useState()

	const [videoInput, setVideoInput] = React.useState()
	const [audioInput, setAudioInput] = React.useState()

	React.useEffect(async () => {
		try {
			const inputDevices = await navigator.mediaDevices.enumerateDevices()

			const audioinput = inputDevices.filter(v => v.kind === "audioinput")
			const videoinput = inputDevices.filter(v => v.kind === "videoinput")

			const mappedAudioInput = audioinput.map(audioDevice => ({
				key: audioDevice.deviceId,
				text: audioDevice.label,
				value: audioDevice.deviceId
			}))
			setAudioInputOptions(mappedAudioInput)

			const mappedVideoInput = videoinput.map(videoDevice => ({
				key: videoDevice.deviceId,
				text: videoDevice.label,
				value: videoDevice.deviceId
			}))
			setVideoInputOptions(mappedVideoInput)
		} catch (error) {
			console.error(error)
		}
	}, [])

	const videoInputChange = (event) => {
		console.log(event)
		setVideoInput(event.target.value)
	}

	const audioInputChange = (event) => {
		console.log(event)
		setAudioInput(event.target.value)
	}

	return (
		<Segment>
			<Header as='h2'>Choose Input</Header>
			<Dropdown
				button
				className="icon"
				floating
				labeled
				icon="video"
				options={videoInputOptions}
				search
				text={videoInput ? videoInput : "Select video"}
				onChange={videoInputChange}
			/>
			<Divider/>
			<Dropdown
				button
				className="icon"
				floating
				labeled
				icon="microphone"
				options={audioInputOptions}
				search
				text="Select audio"
				onChange={audioInputChange}
			/>
		</Segment>
	)
}