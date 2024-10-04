import * as React from 'react'
import { useState } from 'react'
import { PlusCircle, X } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Toast } from "@/components/ui/toast"
import { Layout } from '../layouts/MainLayout'

export default function AddKBEntry() {
  const [title, setTitle] = useState('')
  const [issue, setIssue] = useState('')
  const [environment, setEnvironment] = useState('')
  const [resolution, setResolution] = useState('')
  const [product, setProduct] = useState('')
  const [products, setProducts] = useState<string[]>([])

  const handleAddProduct = () => {
    if (product && !products.includes(product)) {
      setProducts([...products, product])
      setProduct('')
    }
  }

  const handleRemoveProduct = (productToRemove: string) => {
    setProducts(products.filter(p => p !== productToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend API
    console.log({ title, issue, environment, resolution, products })
    Toast({
      title: "Knowledge Base Entry Added",
      // description: "Your new KB entry has been successfully created.",
    })
    // Reset form fields
    setTitle('')
    setIssue('')
    setEnvironment('')
    setResolution('')
    setProducts([])
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Knowledge Base Entry</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-lg rounded-lg p-6">
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="issue" className="text-sm font-medium text-gray-700">Issue</Label>
            <Textarea
              id="issue"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="environment" className="text-sm font-medium text-gray-700">Environment</Label>
            <Input
              id="environment"
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="resolution" className="text-sm font-medium text-gray-700">Resolution</Label>
            <Textarea
              id="resolution"
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="mt-1"
              rows={6}
              required
            />
          </div>
          <div>
            <Label htmlFor="product" className="text-sm font-medium text-gray-700">Products</Label>
            <div className="flex mt-1">
              <Input
                id="product"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="flex-grow"
                placeholder="Add a product"
              />
              <Button type="button" onClick={handleAddProduct} className="ml-2 bg-red-600 hover:bg-red-700 text-white">
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {products.map((p) => (
                <Badge key={p} variant="secondary" className="text-sm py-1 px-2">
                  {p}
                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(p)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
            Create Knowledge Base Entry
          </Button>
        </form>
      </div>
    </Layout>
  )
}
