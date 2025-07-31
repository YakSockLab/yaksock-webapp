import Image from "next/image"

export const SplashScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-white">
      <div className="flex flex-col items-center gap-4">
        <Image src="/splash-icon.svg" alt="Splash Icon" width={56} height={107} />
        <Image src="/Yak.Sock.svg" alt="Yak.Sock Logo" width={224} height={40} />
        <p className="text-sm text-[#111111]">
          약과 약 사이 안 맞는 조합을 알려주는, <span className="text-[#3E39BF] font-semibold">약속</span>
        </p>
      </div>
    </div>
  )
}
