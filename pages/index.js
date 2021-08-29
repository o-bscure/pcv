import Link from 'next/link'
import Head from 'next/head'

export default function Home() {
  return (
        <div className="grid grid-rows-2 h-screen w-screen bg-gray-200 place-items-center">
            <h1 className="font-sans font-semibold text-5xl">PCV VIEWER</h1>
            <div className="grid grid-cols-4 grid-rows-2 bg-gray-200 w-full h-full place-items-center">
                <span/>
                <Link href="/upload">
                    <button className="rounded-lg border-4 border-indigo-600 p-5 w-40 text-3xl focus:outline-none hover:border-red-400 hover:bg-indigo-300"><p>Upload</p></button>
                </Link>
                <Link href="/view">
                    <button className="rounded-lg border-4 border-red-600 p-5 w-40 text-3xl focus:outline-none hover:border-green-400 hover:bg-red-300"><p>View</p></button>
                </Link>
                <span/>
            </div>
        </div>
  )
}
