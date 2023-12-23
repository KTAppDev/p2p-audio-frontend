import Image from "next/image";
import AudioCapture from "@/components/AudioCapture";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <AudioCapture />
    </main>
  );
}
