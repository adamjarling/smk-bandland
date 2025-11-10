import ICalEvents from "./ical-events";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="flex min-h-screen w-full flex-col items-center justify-between py-16 px-16 sm:items-start">
        <div>
          <Image
            className=""
            src="/smk-logo.svg"
            alt="SMK Logo"
            width={100}
            height={20}
            priority
          />
        </div>
        <ICalEvents />
      </main>
    </div>
  );
}
