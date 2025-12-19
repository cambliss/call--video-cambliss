export default function WaitingRoom({ onJoin }: { onJoin: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <h2 className="text-2xl text-yellow-400 mb-4">Waiting for host to let you in...</h2>
      <p className="text-white">Please wait while the host approves your entry.</p>
    </div>
  );
}
