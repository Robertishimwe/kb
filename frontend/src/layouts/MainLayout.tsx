import * as React from 'react'
import { ReactNode, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { Book, Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality here
    console.log('Searching for:', searchQuery)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Book className="h-8 w-8 text-red-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">KnowledgeBase</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              {['ARTICLES', 'CATEGORIES', 'SUPPORT', 'ABOUT'].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className={`text-sm font-medium ${
                    location.pathname === `/${item.toLowerCase()}`
                      ? 'text-red-600'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>
      <div className="bg-gray-100 border-b border-gray-200">
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="flex-grow relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search knowledge base..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
              />
            </div>
            <Button type="submit" className="ml-4 bg-red-600 hover:bg-red-700 text-white">
              Search
            </Button>
          </form>
        </div> */}
      </div>
      <main className="flex-grow bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
      <footer className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            © 2024 KnowledgeBase. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}




























// import * as React from 'react'
// import { ReactNode, useState } from 'react'
// import { Link } from 'react-router-dom';
// import { usePathname } from 'next/navigation'
// import { Book, Search } from 'lucide-react'
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"

// interface LayoutProps {
//   children: ReactNode
// }

// export function Layout({ children }: LayoutProps) {
//   const pathname = usePathname()
//   const [searchQuery, setSearchQuery] = useState('')

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault()
//     // Implement search functionality here
//     console.log('Searching for:', searchQuery)
//   }

//   return (
//     <div className="min-h-screen flex flex-col">
//       <header className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <div className="flex items-center">
//               <Book className="h-8 w-8 text-red-600" />
//               <span className="ml-2 text-2xl font-bold text-gray-900">KnowledgeBase</span>
//             </div>
//             <nav className="hidden md:flex space-x-8">
//               {['ARTICLES', 'CATEGORIES', 'SUPPORT', 'ABOUT'].map((item) => (
//                 <Link
//                   key={item}
//                   href={`/${item.toLowerCase()}`}
//                   className={`text-sm font-medium ${
//                     pathname === `/${item.toLowerCase()}`
//                       ? 'text-red-600'
//                       : 'text-gray-500 hover:text-gray-900'
//                   }`}
//                 >
//                   {item}
//                 </Link>
//               ))}
//             </nav>
//           </div>
//         </div>
//       </header>
//       <div className="bg-gray-100 border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <form onSubmit={handleSearch} className="flex items-center">
//             <div className="flex-grow relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <Input
//                 type="text"
//                 placeholder="Search knowledge base..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10 pr-4 py-2 w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
//               />
//             </div>
//             <Button type="submit" className="ml-4 bg-red-600 hover:bg-red-700 text-white">
//               Search
//             </Button>
//           </form>
//         </div>
//       </div>
//       <main className="flex-grow bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           {children}
//         </div>
//       </main>
//       <footer className="bg-gray-100 border-t border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <p className="text-center text-sm text-gray-500">
//             © 2024 KnowledgeBase. All rights reserved.
//           </p>
//         </div>
//       </footer>
//     </div>
//   )
// }