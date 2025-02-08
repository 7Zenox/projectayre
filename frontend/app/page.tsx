"use client";

import React, { useState, useRef } from 'react';
import { FaGithub } from 'react-icons/fa';
import axios from 'axios';

export default function ProjectAyre() {
	const [file, setFile] = useState(null);
	const [question, setQuestion] = useState('');
	const [response, setResponse] = useState('');
	const [imagePreview, setImagePreview] = useState(null);

	const fileInputRef = useRef(null);

	const handleFileChange = (event) => {
		const selectedFile = event.target.files[0];
		if (selectedFile) {
			setFile(selectedFile);
			setImagePreview(URL.createObjectURL(selectedFile));
			handleSubmit(selectedFile);
		}
	};

	const handleSubmit = async (selectedFile) => {
		if (!selectedFile || !question) return;

		const formData = new FormData();
		formData.append('image', selectedFile);
		formData.append('query', question);

		try {
			const response = await axios.post('http://localhost:7644/predict/', formData);
			if (response.status === 200) {
				setResponse(response.data.prediction);
			}
		} catch (error) {
			console.error('Error:', error);
		}
	};

	const handleUploadClick = () => {
		setFile(null);
		setImagePreview(null);
		setResponse('');

		setTimeout(() => {
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
				fileInputRef.current.click();
			}
		}, 0);
	};

	return (
		<div className="min-h-screen bg-black text-white relative overflow-hidden" style={{ fontFamily: "var(--font-inconsolata)" }}>
			{/* Main content container */}
			<div className="flex flex-col md:grid md:grid-cols-[1fr_3fr] gap-4 px-10 mt-10">
				{/* Left column - will contain title, image preview, and input sections */}
				<div className="flex flex-col">
					{/* Title Section */}
					<div className="mb-6">
						<h1 className="text-[#FF0054] text-4xl font-bold" style={{ fontFamily: "var(--font-basement-grotesque)" }}>
							PROJECT://<br />AYRE.
						</h1>
						<div className="text-sm text-gray-400 mt-4">
							<p>An image may be worth a thousand words, but it can also raise a thousand questions. How can we answer yours?</p>
						</div>
					</div>

					{/* Right section (Image Preview) - now between title and input on mobile */}
					<div className="mb-10 md:hidden">
						<div className="relative flex items-center justify-center rounded-lg p-6 w-full h-full">
							{imagePreview && (
								<div
									className="absolute inset-0 bg-cover bg-center filter blur-lg opacity-30"
									style={{ backgroundImage: `url(${imagePreview})` }}
								></div>
							)}

							<div className="relative z-10 w-full h-96 max-h-96">
								{imagePreview ? (
									<img
										src={imagePreview}
										alt="Preview"
										className="rounded-lg object-contain w-full h-full"
									/>
								) : (
									<div className="text-center">
										<label className="cursor-pointer flex flex-col items-center">
											<div className="w-32 h-32 border-dashed border-gray-600 rounded-lg flex items-center justify-center mb-4">
												<svg
													className="w-8 h-8 text-gray-400"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M12 4v16m8-8H4"
													></path>
												</svg>
											</div>
											<input
												type="file"
												className="hidden"
												ref={fileInputRef}
												onChange={handleFileChange}
												accept="image/*"
											/>
										</label>
									</div>
								)}
							</div>
						</div>

						{/* Upload button for mobile */}
						<div className="flex justify-center items-center px-4">
							<button
								className="bg-transparent border border-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
								onClick={handleUploadClick}
							>
								{imagePreview ? 'Upload Another Image' : 'Upload Image'}
							</button>
						</div>
					</div>

					{/* Input and Output Section */}
					<div className="space-y-6">
						{/* Question input */}
						<div className="space-y-4">
							<div className="flex items-center gap-2">
								<span className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-sm">Q</span>
								<span className="text-gray-400">Ask a Question</span>
							</div>
							<textarea
								className="w-full bg-transparent border border-gray-700 rounded-lg p-4 focus:outline-none focus:border-[#FF0054] h-32 text-xs"
								placeholder="How many people can be seen in this image?"
								value={question}
								onChange={(e) => setQuestion(e.target.value)}
							/>
							<button
								onClick={() => handleSubmit(file)}
								className="bg-[#FF0054] text-white px-4 py-2 rounded-lg hover:bg-[#D80048] transition-colors w-full"
							>
								Ask AYRE
							</button>
						</div>

						{/* Response output */}
						<div className="space-y-4">
							<div className="flex items-center gap-2">
								<span className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-sm">A</span>
								<span className="text-gray-400">AYRE's response...</span>
							</div>
							<div className="min-h-[300px] md:min-h-[200px] text-sm">
								{response || "How would I know? Use your own eyes silly! (sigh... just type a question)"}
							</div>
						</div>
					</div>
				</div>

				{/* Right column - Desktop image preview */}
				<div className="hidden md:flex flex-col justify-between w-full h-full">
					{/* Row 1 - Raven quote and GitHub link */}
					<div className="flex justify-between items-start px-4 py-2">
						<div className="text-gray-600 top-0 left-0 text-xs">
							"Raven. You took on my hopes... My selfish dream. <br />
							Now, I want to see the future that you choose. <br />
							Whatever waits ahead... I'll... support you."
						</div>
						{/* GitHub link - only visible on desktop */}
						<a href="https://github.com/projectayre/ayre" target="_blank" rel="noopener noreferrer" className="text-white text-3xl hover:text-gray-400">
							<FaGithub />
						</a>
					</div>

					{/* Row 2 - Image preview */}
					<div className="relative flex items-center justify-center rounded-lg p-6 w-full h-full">
						{imagePreview && (
							<div
								className="absolute inset-0 bg-cover bg-center filter blur-lg opacity-30"
								style={{ backgroundImage: `url(${imagePreview})` }}
							></div>
						)}

						<div className="relative z-10 w-full h-96 max-h-96">
							{imagePreview ? (
								<img
									src={imagePreview}
									alt="Preview"
									className="rounded-lg object-contain w-full h-full"
								/>
							) : (
								<div className="text-center">
									<label className="cursor-pointer flex flex-col items-center">
										<div className="w-32 h-32 border-dashed border-gray-600 rounded-lg flex items-center justify-center mb-4">
											<svg
												className="w-8 h-8 text-gray-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M12 4v16m8-8H4"
												></path>
											</svg>
										</div>
										<input
											type="file"
											className="hidden"
											ref={fileInputRef}
											onChange={handleFileChange}
											accept="image/*"
										/>
									</label>
								</div>
							)}
						</div>
					</div>

					{/* Row 3 - Upload controls */}
					<div className="flex justify-center items-center px-4 py-4">
						<button
							className="bg-transparent border border-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
							onClick={handleUploadClick}
						>
							{imagePreview ? 'Upload Another Image' : 'Upload Image'}
						</button>
					</div>
				</div>
			</div>

			{/* Footer - Mobile GitHub icon */}
			<footer className="absolute bottom-6 left-6 right-6 flex justify-between text-sm text-gray-400">
				{/* GitHub icon visible only on mobile */}
				<div className="md:hidden">
					<a href="https://github.com/projectayre/ayre" target="_blank" rel="noopener noreferrer">
						<FaGithub className="text-white text-xl hover:text-gray-400" />
					</a>
				</div>

				{/* Footer text, right-aligned */}
				<div className="flex-grow text-right">
					\{"\[T]/"} by&nbsp;
					<a href="https://github.com/hauntedcupoftea" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
						Anand
					</a>,&nbsp;
					<a href="https://github.com/7Zenox" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
						Vasu
					</a>, and&nbsp;
					<a href="https://github.com/AmeeMadhani/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
						Amee
					</a>
				</div>
			</footer>
		</div>
	);
}