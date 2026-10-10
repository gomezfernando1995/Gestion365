import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

const Header = () => {
  return (
     <header className="h-16 bg-white shadow flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>

      <div className="flex items-center gap-4">
        {/* Cuadro de búsqueda 
        <div className="relative w-96">
          <MagnifyingGlassIcon  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar incidente..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
          />
        </div>
        <div className="relative">
          <BellIcon className="h-6 w-6 text-gray-600 cursor-pointer hover:text-blue-600" />
          <span className="absolute top-0 right-0 bg-red-500 rounded-full w-2 h-2"></span>
        </div>

        <img
          src="https://i.pravatar.cc/40"
          alt="User"
          className="rounded-full w-10 h-10 border border-gray-300"
        />
        */}
      </div>
      
    </header>
  )
}

export default Header