import HalftoneWaves from "@/components/halftone-waves"
import UserInfoPanel from "@/components/user-info-panel"

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black">
      <HalftoneWaves />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 overflow-auto">
        <div className="w-full max-w-3xl text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Who am I<span className="text-blue-400">?</span>
          </h1>
          <p className="text-gray-400 mt-2">Discover everything your browser knows about you</p>
        </div>
        <UserInfoPanel />
      </div>
    </main>
  )
}
