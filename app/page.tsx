import { AppleHelloEnglishEffect } from "./components/apple-text";
import { UptimeDetector } from "./components/uptime-detector";
import { Toaster } from "react-hot-toast";

const AppleHelloEffectDemo = () => {
  return (
    <>
      <Toaster />
      <UptimeDetector />
      <div className="flex w-full h-screen flex-col justify-center items-center gap-16">
        <AppleHelloEnglishEffect speed={1.1} />
      </div>
    </>
  );
};
export default AppleHelloEffectDemo;
