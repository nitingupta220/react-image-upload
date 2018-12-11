import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { Button } from '@material-ui/core';

class App extends Component {
	state = {
		selectedFile: null
	};

	fileSelectedHandler = (event) => {
		console.log(event.target.files[0]);
		this.setState({
			selectedFile: event.target.files[0]
		});
	};

	fileUploadHandler = () => {
		const fd = new FormData();
		fd.append('image', this.state.selectedFile, this.state.selectedFile.name);
		axios
			.post('https://us-central1-handy-record-185005.cloudfunctions.net/uploadFile', fd, {
				onUploadProgress: progressEvent => {
					console.log(
						'Upload Progress: ' + Math.round(progressEvent.loaded / progressEvent.total * 100) + '%'
					);
				}
			})
			.then((res) => {
				console.log(res);
			});
	};

	render() {
		return (
			<div className="App">
				<input
					type="file"
					style={{ display: 'none' }}
					onChange={this.fileSelectedHandler}
					ref={(fileInput) => (this.fileInput = fileInput)}
				/>
				<Button
					variant="contained"
					color="primary"
					onClick={() => this.fileInput.click()}
					style={{ margin: '20px' }}
				>
					Pick File
				</Button>
				<Button
					variant="contained"
					color="secondary"
					onClick={this.fileUploadHandler}
					style={{ margin: '20px' }}
				>
					Upload
				</Button>
			</div>
		);
	}
}

export default App;
