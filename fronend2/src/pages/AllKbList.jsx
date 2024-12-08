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
import { Link, useLocation } from 'react-router-dom'
import { Layout } from '../layouts/MainLayout'
import api from "../utils/api"

export default function AllKnowledgeBaseList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredEntries, setFilteredEntries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const location = useLocation()

  useEffect(() => {
    // Check if there's a search query in the location state
    if (location.state && location.state.searchQuery) {
      setSearchQuery(location.state.searchQuery)
      handleSearch(location.state.searchQuery)
    } else {
      // If no search query, default to 'layer7'
      setSearchQuery('layer7')
      handleSearch('layer7')
    }
  }, [location])

  const handleSearch = async (query) => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.get(`/api/kb/getAllEntries`)
      
      if (response.status !== 200) {
        throw new Error('Failed to fetch search results')
      }
      
      const data = await response.data
      setFilteredEntries(data)
    } catch (err) {
      console.error("Error fetching search results:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSearch(searchQuery)
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Knowledge Base Articles
        </h1>
        <Link to="/add">
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Entry
          </Button>
        </Link>
      </div>

      {/* Search Form */}
      <div className="mb-6">
        <form onSubmit={handleSubmit} className="flex items-center">
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
          <Button
            type="submit"
            className="ml-4 bg-red-600 hover:bg-red-700 text-white"
          >
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
            <AccordionItem
              key={entry.id}
              value={entry.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-col items-start">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {entry.title}
                    </h2>
                    <div className="mb-4">
                      <strong>Products:</strong>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {entry.products.split(',').map((product) => (
                          <Badge key={product.trim()} variant="secondary" className="text-xs">
                            {product.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <ChevronDown className="h-5 w-5 text-gray-500 transform transition-transform" />
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">
                      Issue
                    </h3>
                    <p className="text-gray-600">{entry.issue}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">
                      Environment
                    </h3>
                    <p className="text-gray-600">{entry.environment}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">
                      Resolution
                    </h3>
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
          <p className="text-gray-600">
            No entries found. Try a different query.
          </p>
        </div>
      )}
    </Layout>
  )
}
