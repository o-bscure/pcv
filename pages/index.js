import Link from 'next/link'
import Head from 'next/head'

export default function Home() {
  return (
        <div className="grid grid-rows-2 h-screen w-screen bg-gray-400 place-items-center">
            <h1 className="font-sans font-semibold text-5xl">PCV VIEWER</h1>
            <div className="grid grid-cols-4 grid-rows-2 w-full h-full place-items-center">
                <span/>
                <Link href="/upload">
                    <button className="rounded-lg border-4 border-indigo-700 p-5 w-40 text-3xl bg-gray-800 text-gray-300 
                    focus:outline-none hover:border-green-500"><p>Upload</p></button>
                </Link>
                <Link href="/view">
                    <button className="rounded-lg border-4 border-red-700 p-5 w-40 text-3xl bg-gray-800 text-gray-300
                    focus:outline-none hover:border-yellow-500 hover:bg-gray-800"><p>View</p></button>
                </Link>
                <span/>
            </div>
        </div>
  )
}
