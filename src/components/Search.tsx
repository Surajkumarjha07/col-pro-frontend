import { BiSearch } from 'react-icons/bi'

export default function Search({searchQuery, setSearchQuery}: {searchQuery: string, setSearchQuery: (text: string) => void}) {
  return (
    <>
        <div className="relative w-full max-w-md">
          <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xl" />
          <input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none"
          />
        </div>
    </>
  )
}
