import { useState, useEffect } from 'react'
import { Filter, ChevronDown, ArrowUpDown, PlusCircle, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Link } from 'react-router-dom'
import { Layout } from '../layouts/MainLayout'
import api from "../utils/api"


export default function KnowledgeBaseList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredEntries, setFilteredEntries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await  api.get(`/api/kb/search?query=${searchQuery}`)
      
      // fetch(`https://kb-3.onrender.com/api/kb/search?query=${searchQuery}`)
      console.log(response)
      // if (!response.ok) {
      //   throw new Error('Failed to fetch search results')
      // }
      const data= []
      setFilteredEntries(data)
    } catch (err) {
      console.log(">>>>>>>>>>>>>>>>>",err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Knowledge Base Articles</h1>
        <Link to="/add">
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Entry
          </Button>
        </Link>
      </div>
      
      {/* Search Form */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex items-center">
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search knowledge base..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <Button type="submit" className="ml-4 bg-red-600 hover:bg-red-700 text-white">
            Search
          </Button>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-4">
          <p className="text-gray-600">Loading...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Results */}
      {!loading && !error && filteredEntries.length > 0 && (
        <Accordion type="single" collapsible className="space-y-4">
          {filteredEntries.map((entry) => (
            <AccordionItem key={entry.id} value={entry.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-col items-start">
                    <h2 className="text-xl font-semibold text-gray-900">{entry.title}</h2>
                    <div className="flex items-center mt-2 space-x-2">
                      {entry.products.map((product) => (
                        <Badge key={product} variant="secondary" className="text-xs">
                          {product}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <ChevronDown className="h-5 w-5 text-gray-500 transform transition-transform" />
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Issue</h3>
                    <p className="text-gray-600">{entry.issue}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Environment</h3>
                    <p className="text-gray-600">{entry.environment}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Resolution</h3>
                    <pre className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-100 p-4 rounded-lg">
                      {entry.resolution}
                    </pre>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {/* No Results */}
      {!loading && !error && filteredEntries.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No entries found. Try a different query.</p>
        </div>
      )}
    </Layout>
  )
}






















//from gpt
// import * as React from 'react';
// import { useState, useEffect } from 'react';
// import { Filter, ChevronDown, ArrowUpDown, PlusCircle } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from '@/components/ui/accordion';
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Badge } from '@/components/ui/badge';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Link } from 'react-router-dom';
// import { Layout } from '../layouts/MainLayout';

// interface KBEntry {
//   id: string;
//   title: string;
//   resolution: string;
//   environment: string;
//   issue: string;
//   products: string[];
//   createdAt: string;
//   updatedAt: string;
// }

// export default function KnowledgeBaseList() {
//   const [entries, setEntries] = useState<KBEntry[]>([]);
//   const [filteredEntries, setFilteredEntries] = useState<KBEntry[]>([]);
//   const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const allProducts = Array.from(new Set(entries.flatMap(entry => entry.products)));

//   // Fetch data from the API when search query changes
//   useEffect(() => {
//     const fetchEntries = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await fetch(`http://localhost:3000/api/kb/search?query=${searchQuery}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch results');
//         }
//         const data: KBEntry[] = await response.json();
//         setEntries(data);
//         setFilteredEntries(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (searchQuery) {
//       fetchEntries();
//     }
//   }, [searchQuery]);

//   // Filter the entries based on selected products
//   useEffect(() => {
//     let result = entries;

//     if (selectedProducts.length > 0) {
//       result = result.filter(entry =>
//         entry.products.some(product => selectedProducts.includes(product))
//       );
//     }

//     setFilteredEntries(result);
//   }, [selectedProducts, entries]);

//   const handleSearch = (event: React.FormEvent) => {
//     event.preventDefault();
//     const query = (event.target as HTMLFormElement).search.value;
//     setSearchQuery(query);
//   };

//   return (
//     <Layout>
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">Knowledge Base Articles</h1>
//         <Link to="/add">
//           <Button className="bg-red-600 hover:bg-red-700 text-white">
//             <PlusCircle className="mr-2 h-4 w-4" />
//             Add New Entry
//           </Button>
//         </Link>
//       </div>

//       {/* Search Bar */}
//       <form onSubmit={handleSearch} className="mb-4">
//         <input
//           name="search"
//           placeholder="Search knowledge base..."
//           className="px-4 py-2 border rounded-md w-full sm:w-auto"
//         />
//         <Button type="submit" className="ml-2">
//           Search
//         </Button>
//       </form>

//       {/* Filter by Products */}
//       <div className="mb-6 flex flex-wrap gap-4">
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline" className="w-full sm:w-auto">
//               <Filter className="mr-2 h-4 w-4" />
//               Filter by Product
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent className="w-56">
//             <DropdownMenuLabel>Select Products</DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <ScrollArea className="h-[200px]">
//               {allProducts.map((product) => (
//                 <DropdownMenuItem key={product} className="flex items-center space-x-2">
//                   <Checkbox
//                     id={product}
//                     checked={selectedProducts.includes(product)}
//                     onCheckedChange={(checked) => {
//                       setSelectedProducts(
//                         checked
//                           ? [...selectedProducts, product]
//                           : selectedProducts.filter((p) => p !== product)
//                       );
//                     }}
//                   />
//                   <label htmlFor={product} className="flex-grow cursor-pointer">
//                     {product}
//                   </label>
//                 </DropdownMenuItem>
//               ))}
//             </ScrollArea>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>

//       {/* Loading and Error States */}
//       {loading && <p className="text-center">Loading...</p>}
//       {error && <p className="text-center text-red-600">{error}</p>}

//       {/* Results Accordion */}
//       {!loading && !error && (
//         <Accordion type="single" collapsible className="space-y-4">
//           {filteredEntries.map((entry) => (
//             <AccordionItem key={entry.id} value={entry.id} className="border border-gray-200 rounded-lg overflow-hidden">
//               <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
//                 <div className="flex justify-between items-center w-full">
//                   <div className="flex flex-col items-start">
//                     <h2 className="text-xl font-semibold text-gray-900">{entry.title}</h2>
//                     <div className="flex items-center mt-2 space-x-2">
//                       {entry.products.map((product) => (
//                         <Badge key={product} variant="secondary" className="text-xs">
//                           {product}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                   <ChevronDown className="h-5 w-5 text-gray-500 transform transition-transform" />
//                 </div>
//               </AccordionTrigger>
//               <AccordionContent className="px-6 py-4">
//                 <div className="space-y-4">
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-700">Issue</h3>
//                     <p className="text-gray-600">{entry.issue}</p>
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-700">Environment</h3>
//                     <p className="text-gray-600">{entry.environment}</p>
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-700">Resolution</h3>
//                     <pre className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-100 p-4 rounded-lg">{entry.resolution}</pre>
//                   </div>
//                   <div className="flex justify-between text-sm text-gray-500">
//                     <span className="flex items-center">
//                       Created: {new Date(entry.createdAt).toLocaleDateString()}
//                     </span>
//                     <span className="flex items-center">
//                       Updated: {new Date(entry.updatedAt).toLocaleDateString()}
//                     </span>
//                   </div>
//                 </div>
//               </AccordionContent>
//             </AccordionItem>
//           ))}
//         </Accordion>
//       )}

//       {filteredEntries.length === 0 && !loading && !error && (
//         <div className="text-center py-8 bg-gray-50 rounded-lg">
//           <p className="text-gray-600">No entries found. Try a different search or filter.</p>
//         </div>
//       )}
//     </Layout>
//   );
// }










































































//From claud
// import * as React from 'react'
// import { useState, useEffect } from 'react';
// import { Filter, ChevronDown, Calendar, Clock, ArrowUpDown, PlusCircle, Search } from 'lucide-react';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Link } from 'react-router-dom';
// import { Layout } from '../layouts/MainLayout';
// import { Alert, AlertDescription } from "@/components/ui/alert";

// interface KBEntry {
//   id: string;
//   title: string;
//   resolution: string;
//   environment: string;
//   issue: string;
//   products: string[];
//   createdAt: string;
//   updatedAt: string;
// }

// export default function KnowledgeBaseList() {
//   const [entries, setEntries] = useState<KBEntry[]>([]);
//   const [filteredEntries, setFilteredEntries] = useState<KBEntry[]>([]);
//   const [sortConfig, setSortConfig] = useState<{ key: keyof KBEntry; direction: 'asc' | 'desc' } | null>(null);
//   const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const allProducts = Array.from(new Set(entries.flatMap(entry => entry.products)));

//   useEffect(() => {
//     fetchEntries();
//   }, []);

//   useEffect(() => {
//     applyFiltersAndSort();
//   }, [entries, selectedProducts, sortConfig, searchQuery]);

//   const fetchEntries = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(`https://3000-idx-kb-1727883793634.cluster-kc2r6y3mtba5mswcmol45orivs.cloudworkstations.dev/api/kb/search?query=${encodeURIComponent(searchQuery)}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch entries');
//       }
//       const data = await response.json();
//       setEntries(data);
//     } catch (err) {
//       setError('An error occurred while fetching entries. Please try again.');
//       console.error('Error fetching entries:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const applyFiltersAndSort = () => {
//     let result = entries;

//     // Apply search filter
//     if (searchQuery) {
//       result = result.filter(entry =>
//         entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         entry.issue.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     // Apply product filter
//     if (selectedProducts.length > 0) {
//       result = result.filter(entry =>
//         entry.products.some(product => selectedProducts.includes(product))
//       );
//     }

//     // Apply sorting
//     if (sortConfig !== null) {
//       result.sort((a, b) => {
//         if (a[sortConfig.key] < b[sortConfig.key]) {
//           return sortConfig.direction === 'asc' ? -1 : 1;
//         }
//         if (a[sortConfig.key] > b[sortConfig.key]) {
//           return sortConfig.direction === 'asc' ? 1 : -1;
//         }
//         return 0;
//       });
//     }

//     setFilteredEntries(result);
//   };

//   const handleSort = (key: keyof KBEntry) => {
//     let direction: 'asc' | 'desc' = 'asc';
//     if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   };

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     fetchEntries();
//   };

//   return (
//     <Layout>
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">Knowledge Base Articles</h1>
//         <Link to="/add">
//           <Button className="bg-red-600 hover:bg-red-700 text-white">
//             <PlusCircle className="mr-2 h-4 w-4" />
//             Add New Entry
//           </Button>
//         </Link>
//       </div>

//       <form onSubmit={handleSearch} className="mb-6">
//         <div className="flex gap-2">
//           <Input
//             type="text"
//             placeholder="Search knowledge base..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="flex-grow"
//           />
//           <Button type="submit" disabled={isLoading}>
//             <Search className="mr-2 h-4 w-4" />
//             Search
//           </Button>
//         </div>
//       </form>

//       <div className="mb-6 flex flex-wrap gap-4">
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline" className="w-full sm:w-auto">
//               <Filter className="mr-2 h-4 w-4" />
//               Filter by Product
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent className="w-56">
//             <DropdownMenuLabel>Select Products</DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <ScrollArea className="h-[200px]">
//               {allProducts.map((product) => (
//                 <DropdownMenuItem key={product} className="flex items-center space-x-2">
//                   <Checkbox
//                     id={product}
//                     checked={selectedProducts.includes(product)}
//                     onCheckedChange={(checked) => {
//                       setSelectedProducts(
//                         checked
//                           ? [...selectedProducts, product]
//                           : selectedProducts.filter((p) => p !== product)
//                       );
//                     }}
//                   />
//                   <label htmlFor={product} className="flex-grow cursor-pointer">
//                     {product}
//                   </label>
//                 </DropdownMenuItem>
//               ))}
//             </ScrollArea>
//           </DropdownMenuContent>
//         </DropdownMenu>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline" className="w-full sm:w-auto">
//               <ArrowUpDown className="mr-2 h-4 w-4" />
//               Sort
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent className="w-56">
//             <DropdownMenuLabel>Sort by</DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem onClick={() => handleSort('title')}>Title</DropdownMenuItem>
//             <DropdownMenuItem onClick={() => handleSort('createdAt')}>Created Date</DropdownMenuItem>
//             <DropdownMenuItem onClick={() => handleSort('updatedAt')}>Updated Date</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>

//       {isLoading && (
//         <div className="text-center py-8">
//           <p className="text-gray-600">Loading...</p>
//         </div>
//       )}

//       {error && (
//         <Alert variant="destructive" className="mb-6">
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}

//       {!isLoading && !error && (
//         <Accordion type="single" collapsible className="space-y-4">
//           {filteredEntries.map((entry) => (
//             <AccordionItem key={entry.id} value={entry.id} className="border border-gray-200 rounded-lg overflow-hidden">
//               <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
//                 <div className="flex justify-between items-center w-full">
//                   <div className="flex flex-col items-start">
//                     <h2 className="text-xl font-semibold text-gray-900">{entry.title}</h2>
//                     <div className="flex items-center mt-2 space-x-2">
//                       {entry.products.map((product) => (
//                         <Badge key={product} variant="secondary" className="text-xs">
//                           {product}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                   <ChevronDown className="h-5 w-5 text-gray-500 transform transition-transform" />
//                 </div>
//               </AccordionTrigger>
//               <AccordionContent className="px-6 py-4">
//                 <div className="space-y-4">
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-700">Issue</h3>
//                     <p className="text-gray-600">{entry.issue}</p>
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-700">Environment</h3>
//                     <p className="text-gray-600">{entry.environment}</p>
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-700">Resolution</h3>
//                     <pre className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-100 p-4 rounded-lg">{entry.resolution}</pre>
//                   </div>
//                   <div className="flex justify-between text-sm text-gray-500">
//                     <span className="flex items-center">
//                       <Calendar className="w-4 h-4 mr-1" />
//                       Created: {new Date(entry.createdAt).toLocaleDateString()}
//                     </span>
//                     <span className="flex items-center">
//                       <Clock className="w-4 h-4 mr-1" />
//                       Updated: {new Date(entry.updatedAt).toLocaleDateString()}
//                     </span>
//                   </div>
//                 </div>
//               </AccordionContent>
//             </AccordionItem>
//           ))}
//         </Accordion>
//       )}

//       {!isLoading && !error && filteredEntries.length === 0 && (
//         <div className="text-center py-8 bg-gray-50 rounded-lg">
//           <p className="text-gray-600">No entries found. Try a different search query or filter.</p>
//         </div>
//       )}
//     </Layout>
//   );
// }
























































// import * as React from 'react'
// import { useState, useEffect } from 'react'
// import { Filter, ChevronDown, ChevronUp, Calendar, Clock, ArrowUpDown, PlusCircle } from 'lucide-react'
// import { Button } from "@/components/ui/button"
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Badge } from "@/components/ui/badge"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Link, useLocation } from 'react-router-dom'
// import { Layout } from '../layouts/MainLayout'

// interface KBEntry {
//   id: string
//   title: string
//   resolution: string
//   environment: string
//   issue: string
//   products: string[]
//   createdAt: string
//   updatedAt: string
// }

// const mockEntries: KBEntry[] = [
//   {
//     id: '1',
//     title: 'How to reset your password',
//     resolution: 'Follow these steps to reset your password:\n1. Go to the login page\n2. Click on "Forgot Password"\n3. Enter your email\n4. Check your email for reset link\n5. Click the link and enter new password',
//     environment: 'Web Application',
//     issue: 'User unable to log in due to forgotten password',
//     products: ['User Authentication System'],
//     createdAt: '2023-04-15T10:30:00Z',
//     updatedAt: '2023-04-15T10:30:00Z',
//   },
//   {
//     id: '2',
//     title: 'Troubleshooting network connectivity issues',
//     resolution: '1. Check Wi-Fi connection\n2. Restart router\n3. Check network cables\n4. Contact IT support if issue persists',
//     environment: 'Office Network',
//     issue: 'Users experiencing intermittent network disconnections',
//     products: ['Network Infrastructure'],
//     createdAt: '2023-04-16T14:45:00Z',
//     updatedAt: '2023-04-16T14:45:00Z',
//   },
//   {
//     id: '3',
//     title: 'Setting up two-factor authentication',
//     resolution: '1. Go to account settings\n2. Enable 2FA\n3. Choose method (SMS, authenticator app)\n4. Follow prompts to complete setup',
//     environment: 'Mobile and Web Applications',
//     issue: 'Enhancing account security',
//     products: ['User Authentication System', 'Mobile App'],
//     createdAt: '2023-04-17T09:15:00Z',
//     updatedAt: '2023-04-17T09:15:00Z',
//   },
// ]

// export default function KnowledgeBaseList() {
//   const [filteredEntries, setFilteredEntries] = useState(mockEntries)
//   const [sortConfig, setSortConfig] = useState<{ key: keyof KBEntry; direction: 'asc' | 'desc' } | null>(null)
//   const [selectedProducts, setSelectedProducts] = useState<string[]>([])

//   const allProducts = Array.from(new Set(mockEntries.flatMap(entry => entry.products)))

//   useEffect(() => {
//     let result = mockEntries

//     // Apply product filter
//     if (selectedProducts.length > 0) {
//       result = result.filter(entry =>
//         entry.products.some(product => selectedProducts.includes(product))
//       )
//     }

//     // Apply sorting
//     if (sortConfig !== null) {
//       result.sort((a, b) => {
//         if (a[sortConfig.key] < b[sortConfig.key]) {
//           return sortConfig.direction === 'asc' ? -1 : 1
//         }
//         if (a[sortConfig.key] > b[sortConfig.key]) {
//           return sortConfig.direction === 'asc' ? 1 : -1
//         }
//         return 0
//       })
//     }

//     setFilteredEntries(result)
//   }, [selectedProducts, sortConfig])

//   const handleSort = (key: keyof KBEntry) => {
//     let direction: 'asc' | 'desc' = 'asc'
//     if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc'
//     }
//     setSortConfig({ key, direction })
//   }

//   return (
//     <Layout>
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">Knowledge Base Articles</h1>
//         <Link to="/add">
//           <Button className="bg-red-600 hover:bg-red-700 text-white">
//             <PlusCircle className="mr-2 h-4 w-4" />
//             Add New Entry
//           </Button>
//         </Link>
//       </div>
//       <div className="mb-6 flex flex-wrap gap-4">
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline" className="w-full sm:w-auto">
//               <Filter className="mr-2 h-4 w-4" />
//               Filter by Product
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent className="w-56">
//             <DropdownMenuLabel>Select Products</DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <ScrollArea className="h-[200px]">
//               {allProducts.map((product) => (
//                 <DropdownMenuItem key={product} className="flex items-center space-x-2">
//                   <Checkbox
//                     id={product}
//                     checked={selectedProducts.includes(product)}
//                     onCheckedChange={(checked) => {
//                       setSelectedProducts(
//                         checked
//                           ? [...selectedProducts, product]
//                           : selectedProducts.filter((p) => p !== product)
//                       )
//                     }}
//                   />
//                   <label htmlFor={product} className="flex-grow cursor-pointer">
//                     {product}
//                   </label>
//                 </DropdownMenuItem>
//               ))}
//             </ScrollArea>
//           </DropdownMenuContent>
//         </DropdownMenu>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline" className="w-full sm:w-auto">
//               <ArrowUpDown className="mr-2 h-4 w-4" />
//               Sort
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent className="w-56">
//             <DropdownMenuLabel>Sort by</DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem onClick={() => handleSort('title')}>Title</DropdownMenuItem>
//             <DropdownMenuItem onClick={() => handleSort('createdAt')}>Created Date</DropdownMenuItem>
//             <DropdownMenuItem onClick={() => handleSort('updatedAt')}>Updated Date</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//       <Accordion type="single" collapsible className="space-y-4">
//         {filteredEntries.map((entry) => (
//           <AccordionItem key={entry.id} value={entry.id} className="border border-gray-200 rounded-lg overflow-hidden">
//             <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
//               <div className="flex justify-between items-center w-full">
//                 <div className="flex flex-col items-start">
//                   <h2 className="text-xl font-semibold text-gray-900">{entry.title}</h2>
//                   <div className="flex items-center mt-2 space-x-2">
//                     {entry.products.map((product) => (
//                       <Badge key={product} variant="secondary" className="text-xs">
//                         {product}
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>
//                 <ChevronDown className="h-5 w-5 text-gray-500 transform transition-transform" />
//               </div>
//             </AccordionTrigger>
//             <AccordionContent className="px-6 py-4">
//               <div className="space-y-4">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-700">Issue</h3>
//                   <p className="text-gray-600">{entry.issue}</p>
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-700">Environment</h3>
//                   <p className="text-gray-600">{entry.environment}</p>
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-700">Resolution</h3>
//                   <pre className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-100 p-4 rounded-lg">{entry.resolution}</pre>
//                 </div>
//                 <div className="flex justify-between text-sm text-gray-500">
//                   <span className="flex items-center">
//                     <Calendar className="w-4 h-4 mr-1" />
//                     Created: {new Date(entry.createdAt).toLocaleDateString()}
//                   </span>
//                   <span className="flex items-center">
//                     <Clock className="w-4 h-4 mr-1" />
//                     Updated: {new Date(entry.updatedAt).toLocaleDateString()}
//                   </span>
//                 </div>
//               </div>
//             </AccordionContent>
//           </AccordionItem>
//         ))}
//       </Accordion>
//       {filteredEntries.length === 0 && (
//         <div className="text-center py-8 bg-gray-50 rounded-lg">
//           <p className="text-gray-600">No entries found. Try a different filter.</p>
//         </div>
//       )}
//     </Layout>
//   )
// }