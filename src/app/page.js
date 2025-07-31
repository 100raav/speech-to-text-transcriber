"use client";
import axios from 'axios';
import { useState } from "react";

export default function page() {
  const [selectedFile, setSelectedFile] = useState(null);
  console.log("🚀 ~ page ~ selectedFile:", selectedFile)
  const [transcription, setTranscription] = useState("");
  console.log("🚀 ~ page ~ transcription:", transcription)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    // console.log("🚀 ~ handleFileChange ~ file:", file)
    if (file) {
      setSelectedFile(file);
      setTranscription(""); // Reset transcription when a new file is selected
     
    } else {
      setSelectedFile(null);
      // Optional: Show an error message to the user
      console.error("Please select a valid audio file.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert("Please select an audio file first..");
      return;
    }
    const formData = new FormData()
    formData.append('file', selectedFile);
     try {
        const responseAPI = await axios.post("http://localhost:3000/api/transcribe",formData,{
          header: {
            'Content-Type' : "multipart/form-data",
          }
        })
        console.log("🚀 ~ handleFileChange ~ responseAPI:", responseAPI.data)
        setTranscription(responseAPI.data.name);
        
      } catch (error) {
        console.log("🚀 ~ handleFileChange ~ error:", error)
        
      }
    setIsSubmitting(true);

    // Simulate an API call for transcription
    // In a real application, you would send the file to your backend here.
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 2-second delay

    // const mockTranscription = `This is a simulated transcription of the audio file named "${selectedFile.name}". In a real-world scenario, this text would be the output from a speech-to-text API. The process involves sending the audio data to a server, where a model processes it and returns the recognized text.`;

    // setTranscription(mockTranscription);
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white font-sans p-4">
      <div className="w-full max-w-2xl">
        {/* Main Upload Rectangle */}
        <div className="bg-gray-900 border border-gray-700/50 rounded-2xl shadow-2xl shadow-purple-500/10 backdrop-blur-sm p-8 transition-all duration-300">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-100">
            Audio Transcription
          </h1>
          <p className="text-center text-gray-400 mb-8">
            Upload your audio file to get a transcription.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="audio-upload" className="cursor-pointer">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-xl p-10 text-gray-400 hover:bg-gray-800 hover:border-gray-500 transition-colors duration-300">
                  {selectedFile ? (
                    <>
                      {/* <FileAudio className="w-12 h-12 mb-3 text-purple-400" /> */}
                      <span className="font-medium text-gray-200">
                        {selectedFile.name}
                      </span>
                    </>
                  ) : (
                    <>
                      {/* <Upload className="w-12 h-12 mb-3" /> */}
                      <span className="font-medium text-gray-200">
                        Click to upload an audio file
                      </span>
                      <span className="text-sm">MP3, WAV, M4A, etc.</span>
                    </>
                  )}
                </div>
              </label>
              <input
                id="audio-upload"
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <button
              type="submit"
              disabled={!selectedFile || isSubmitting}
              className="w-full bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-400 flex items-center justify-center transition-all duration-300"
            >
              {isSubmitting ? (
                <>
                  {/* <loader-circle className="animate-spin mr-2" /> */}
                  Transcribing...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </div>

        {/* Transcription Result Rectangle */}
        {transcription && (
          <div className="mt-8 bg-gray-900/80 border border-gray-700/50 rounded-2xl shadow-lg backdrop-blur-sm p-8 animate-fade-in">
            <h2 className="text-2xl font-semibold text-gray-100 mb-4 flex items-center">
              {/* <Circle className="w-6 h-6 mr-3 text-green-400" /> */}
              Transcription Result
            </h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {transcription}
            </p>
          </div>
        )}
      </div>
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
