"use client";

import getBrowser from "@/lib/detectBrowser";
import React, { useEffect, useRef, useState } from "react";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AudioCaptureProps {}

let mimeType = "";
switch (getBrowser()) {
  case "Firefox":
    mimeType = "audio/webm; codecs=opus";
    break;
  case "Chrome":
    mimeType = "audio/webm; codecs=opus";
    break;
  // case "Safari":
  //   mimeType = "audio/mp4; codecs=mp4a.40.2";
  //   break;
  default:
    mimeType = "audio/webm; codecs=opus"; // Default to Opus
}

const AudioCapture: React.FC<AudioCaptureProps> = () => {
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [audioRecorder, setAudioRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setAudioStream(stream);

        const recorder = new MediaRecorder(stream, {
          mimeType: mimeType,
        });

        setAudioRecorder(recorder);

        const socket = new WebSocket("ws://localhost:8080/ws");
        setWs(socket);

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            // Send audio data over WebSocket
            console.log(event.data);
            socket.send(event.data);
          }
        };

        // Additional code to send a steady stream at a regular interval
        const sendDataInterval = setInterval(() => {
          // Check if recorder is active before sending data
          if (recorder.state === "recording") {
            recorder.requestData(); // Trigger ondataavailable event
          }
        }, 1000); // Adjust the interval (in milliseconds) as needed
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    };

    initAudio();

    return () => {
      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
      }

      if (audioRecorder) {
        audioRecorder.stop();
      }

      if (ws) {
        ws.close();
      }
    };
  }, []);

  const startCapture = () => {
    if (audioRecorder) {
      audioRecorder.start();
    }
  };

  const stopCapture = () => {
    if (audioRecorder) {
      audioRecorder.stop();
    }
  };

  return (
    <div
      key="1"
      className="h-screen flex flex-col items-center justify-center bg-gray-100"
    >
      <main className="flex flex-col items-center justify-center gap-8 p-8 bg-white rounded shadow-lg">
        <h1 className="text-3xl font-semibold text-center">
          Audio Capture and Transfer
        </h1>
        <p className="text-center text-gray-500 dark:text-gray-400">
          Please provide your audio input for real-time processing.
        </p>
        <div className="w-full max-w-xl">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Real-time Audio Input Visualization</CardTitle>
              <CardDescription>
                Below visualization represents your real-time audio input.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <img
                alt="A real-time audio input visualization"
                className="w-full aspect-[16/9]"
                height="500"
                src="/placeholder.svg"
                width="500"
              />
            </CardContent>
          </Card>
        </div>
        <div className="flex items-center gap-4">
          <Button size="lg" onClick={startCapture}>
            <MicIcon className="w-5 h-5 mr-2" />
            Start Capture
          </Button>
          <Button size="lg" variant="outline" onClick={stopCapture}>
            <StopCircleIcon className="w-5 h-5 mr-2" />
            Stop Capture
          </Button>
        </div>
        <div className="w-full max-w-xl">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Transfer Status</CardTitle>
              <CardDescription>
                The audio data transfer status over WebSockets is shown below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge>
                  <CheckIcon className="w-4 h-4" />
                </Badge>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Audio data is successfully being transferred for processing.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="mt-auto p-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© 2023 AudioCapture Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};
export default AudioCapture;
function MicIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

function StopCircleIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <rect width="6" height="6" x="9" y="9" />
    </svg>
  );
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
