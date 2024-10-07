import { useState } from 'react'
import { PlusCircle, X } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Layout } from '../layouts/MainLayout'
import api from "../utils/api"
import { useNavigate } from 'react-router-dom'

export default function AddKBEntry() {
  const [title, setTitle] = useState('')
  const [issue, setIssue] = useState('')
  const [environment, setEnvironment] = useState('')
  const [resolution, setResolution] = useState('')
  const [product, setProduct] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleAddProduct = () => {
    if (product && !products.includes(product)) {
      setProducts([...products, product])
      setProduct('')
    }
  }

  const handleRemoveProduct = (productToRemove) => {
    setProducts(products.filter(p => p !== productToRemove))
  }

  const validateForm = () => {
    if (!title.trim()) return "Title is required"
    if (!issue.trim()) return "Issue is required"
    if (!environment.trim()) return "Environment is required"
    if (!resolution.trim()) return "Resolution is required"
    if (products.length === 0) return "At least one product is required"
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      setLoading(false)
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive"
      })
      return
    }

    const payload = {
      title,
      environment,
      issue,
      products: products.join(', '),
      resolution
    }

    try {
      const response = await api.post('/api/kb/entries', payload)
      
      if (response.status !== 201) {
        throw new Error('Failed to create KB entry')
      }

      setSuccess(true)
      toast({
        title: "Knowledge Base Entry Added",
        description: "Your new KB entry has been successfully created.",
      })

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/articles', { state: { searchQuery: title } })
      }, 3000)

    } catch (err) {
      setError(err.message)
      toast({
        title: "Error",
        description: "Failed to create KB entry. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Knowledge Base Entry Added Successfully!</h1>
          <p className="text-lg text-gray-700">Redirecting to articles page in 3 seconds...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Knowledge Base Entry</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-lg rounded-lg p-6">
          {/* Form fields remain the same */}
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
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
          <Button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Knowledge Base Entry'}
          </Button>
        </form>
      </div>
    </Layout>
  )
}















































































// import { useState } from 'react'
// import { PlusCircle, X } from 'lucide-react'
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { useToast } from "@/hooks/use-toast"
// import { Layout } from '../layouts/MainLayout'
// import api from "../utils/api"

// export default function AddKBEntry() {
//   const [title, setTitle] = useState('')
//   const [issue, setIssue] = useState('')
//   const [environment, setEnvironment] = useState('')
//   const [resolution, setResolution] = useState('')
//   const [product, setProduct] = useState('')
//   const [products, setProducts] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)
//   const { toast } = useToast()

//   const handleAddProduct = () => {
//     if (product && !products.includes(product)) {
//       setProducts([...products, product])
//       setProduct('')
//     }
//   }

//   const handleRemoveProduct = (productToRemove) => {
//     setProducts(products.filter(p => p !== productToRemove))
//   }

//   const validateForm = () => {
//     if (!title.trim()) return "Title is required"
//     if (!issue.trim()) return "Issue is required"
//     if (!environment.trim()) return "Environment is required"
//     if (!resolution.trim()) return "Resolution is required"
//     if (products.length === 0) return "At least one product is required"
//     return null
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     setError(null)

//     const validationError = validateForm()
//     if (validationError) {
//       setError(validationError)
//       setLoading(false)
//       toast({
//         title: "Validation Error",
//         description: validationError,
//         variant: "destructive"
//       })
//       return
//     }

//     const payload = {
//       title,
//       environment,
//       issue,
//       products: products.join(', '),
//       resolution
//     }

//     try {
//       const response = await api.post('/api/kb/entries', payload)
      
//       if (response.status !== 201) {
//         throw new Error('Failed to create KB entry')
//       }

//       toast({
//         title: "Knowledge Base Entry Added",
//         description: "Your new KB entry has been successfully created.",
//       })

//       // Reset form fields
//       setTitle('')
//       setIssue('')
//       setEnvironment('')
//       setResolution('')
//       setProducts([])
//     } catch (err) {
//       setError(err.message)
//       toast({
//         title: "Error",
//         description: "Failed to create KB entry. Please try again.",
//         variant: "destructive"
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <Layout>
//       <div className="max-w-3xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Knowledge Base Entry</h1>
//         <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-lg rounded-lg p-6">
//           <div>
//             <Label htmlFor="title" className="text-sm font-medium text-gray-700">Title</Label>
//             <Input
//               id="title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="mt-1"
//               required
//             />
//           </div>
//           <div>
//             <Label htmlFor="issue" className="text-sm font-medium text-gray-700">Issue</Label>
//             <Textarea
//               id="issue"
//               value={issue}
//               onChange={(e) => setIssue(e.target.value)}
//               className="mt-1"
//               required
//             />
//           </div>
//           <div>
//             <Label htmlFor="environment" className="text-sm font-medium text-gray-700">Environment</Label>
//             <Input
//               id="environment"
//               value={environment}
//               onChange={(e) => setEnvironment(e.target.value)}
//               className="mt-1"
//               required
//             />
//           </div>
//           <div>
//             <Label htmlFor="resolution" className="text-sm font-medium text-gray-700">Resolution</Label>
//             <Textarea
//               id="resolution"
//               value={resolution}
//               onChange={(e) => setResolution(e.target.value)}
//               className="mt-1"
//               rows={6}
//               required
//             />
//           </div>
//           <div>
//             <Label htmlFor="product" className="text-sm font-medium text-gray-700">Products</Label>
//             <div className="flex mt-1">
//               <Input
//                 id="product"
//                 value={product}
//                 onChange={(e) => setProduct(e.target.value)}
//                 className="flex-grow"
//                 placeholder="Add a product"
//               />
//               <Button type="button" onClick={handleAddProduct} className="ml-2 bg-red-600 hover:bg-red-700 text-white">
//                 <PlusCircle className="h-4 w-4" />
//               </Button>
//             </div>
//             <div className="mt-2 flex flex-wrap gap-2">
//               {products.map((p) => (
//                 <Badge key={p} variant="secondary" className="text-sm py-1 px-2">
//                   {p}
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveProduct(p)}
//                     className="ml-1 text-gray-500 hover:text-gray-700"
//                   >
//                     <X className="h-3 w-3" />
//                   </button>
//                 </Badge>
//               ))}
//             </div>
//           </div>
//           {error && (
//             <div className="text-red-600 text-sm">{error}</div>
//           )}
//           <Button 
//             type="submit" 
//             className="w-full bg-red-600 hover:bg-red-700 text-white"
//             disabled={loading}
//           >
//             {loading ? 'Creating...' : 'Create Knowledge Base Entry'}
//           </Button>
//         </form>
//       </div>
//     </Layout>
//   )
// }









































// import { useState } from 'react'
// import { PlusCircle, X } from 'lucide-react'
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { Toast } from "@/components/ui/toast"
// import { Layout } from '../layouts/MainLayout'
// import api from "../utils/api"

// export default function AddKBEntry() {
//   const [title, setTitle] = useState('')
//   const [issue, setIssue] = useState('')
//   const [environment, setEnvironment] = useState('')
//   const [resolution, setResolution] = useState('')
//   const [product, setProduct] = useState('')
//   const [products, setProducts] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)

//   const handleAddProduct = () => {
//     if (product && !products.includes(product)) {
//       setProducts([...products, product])
//       setProduct('')
//     }
//   }

//   const handleRemoveProduct = (productToRemove) => {
//     setProducts(products.filter(p => p !== productToRemove))
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     setError(null)

//     const payload = {
//       title,
//       environment,
//       issue,
//       products: products.join(', '),
//       resolution
//     }

//     try {
//       const response = await api.post('/api/kb/entries', payload)
      
//       if (response.status !== 201) {
//         throw new Error('Failed to create KB entry')
//       }

//       Toast({
//         title: "Knowledge Base Entry Added",
//         description: "Your new KB entry has been successfully created.",
//       })

//       // Reset form fields
//       setTitle('')
//       setIssue('')
//       setEnvironment('')
//       setResolution('')
//       setProducts([])
//     } catch (err) {
//       setError(err.message)
//       Toast({
//         title: "Error",
//         description: "Failed to create KB entry. Please try again.",
//         variant: "destructive"
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <Layout>
//       <div className="max-w-3xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Knowledge Base Entry</h1>
//         <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-lg rounded-lg p-6">
//           <div>
//             <Label htmlFor="title" className="text-sm font-medium text-gray-700">Title</Label>
//             <Input
//               id="title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="mt-1"
//               required
//             />
//           </div>
//           <div>
//             <Label htmlFor="issue" className="text-sm font-medium text-gray-700">Issue</Label>
//             <Textarea
//               id="issue"
//               value={issue}
//               onChange={(e) => setIssue(e.target.value)}
//               className="mt-1"
//               required
//             />
//           </div>
//           <div>
//             <Label htmlFor="environment" className="text-sm font-medium text-gray-700">Environment</Label>
//             <Input
//               id="environment"
//               value={environment}
//               onChange={(e) => setEnvironment(e.target.value)}
//               className="mt-1"
//               required
//             />
//           </div>
//           <div>
//             <Label htmlFor="resolution" className="text-sm font-medium text-gray-700">Resolution</Label>
//             <Textarea
//               id="resolution"
//               value={resolution}
//               onChange={(e) => setResolution(e.target.value)}
//               className="mt-1"
//               rows={6}
//               required
//             />
//           </div>
//           <div>
//             <Label htmlFor="product" className="text-sm font-medium text-gray-700">Products</Label>
//             <div className="flex mt-1">
//               <Input
//                 id="product"
//                 value={product}
//                 onChange={(e) => setProduct(e.target.value)}
//                 className="flex-grow"
//                 placeholder="Add a product"
//               />
//               <Button type="button" onClick={handleAddProduct} className="ml-2 bg-red-600 hover:bg-red-700 text-white">
//                 <PlusCircle className="h-4 w-4" />
//               </Button>
//             </div>
//             <div className="mt-2 flex flex-wrap gap-2">
//               {products.map((p) => (
//                 <Badge key={p} variant="secondary" className="text-sm py-1 px-2">
//                   {p}
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveProduct(p)}
//                     className="ml-1 text-gray-500 hover:text-gray-700"
//                   >
//                     <X className="h-3 w-3" />
//                   </button>
//                 </Badge>
//               ))}
//             </div>
//           </div>
//           {error && (
//             <div className="text-red-600 text-sm">{error}</div>
//           )}
//           <Button 
//             type="submit" 
//             className="w-full bg-red-600 hover:bg-red-700 text-white"
//             disabled={loading}
//           >
//             {loading ? 'Creating...' : 'Create Knowledge Base Entry'}
//           </Button>
//         </form>
//       </div>
//     </Layout>
//   )
// }





































































































































































// import * as React from 'react'
// import { useState } from 'react'
// import { PlusCircle, X } from 'lucide-react'
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { Toast } from "@/components/ui/toast"
// import { Layout } from '../layouts/MainLayout'

// export default function AddKBEntry() {
//   const [title, setTitle] = useState('')
//   const [issue, setIssue] = useState('')
//   const [environment, setEnvironment] = useState('')
//   const [resolution, setResolution] = useState('')
//   const [product, setProduct] = useState('')
//   const [products, setProducts] = useState([])

//   const handleAddProduct = () => {
//     if (product && !products.includes(product)) {
//       setProducts([...products, product])
//       setProduct('')
//     }
//   }

//   const handleRemoveProduct = (productToRemove) => {
//     setProducts(products.filter(p => p !== productToRemove))
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     // Here you would typically send the data to your backend API
//     console.log({ title, issue, environment, resolution, products })
//     Toast({
//       title: "Knowledge Base Entry Added",
//       // description: "Your new KB entry has been successfully created.",
//     })
//     // Reset form fields
//     setTitle('')
//     setIssue('')
//     setEnvironment('')
//     setResolution('')
//     setProducts([])
//   }

//   return (
//     <Layout>
//       <div className="max-w-3xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Knowledge Base Entry</h1>
//         <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-lg rounded-lg p-6">
//           <div>
//             <Label htmlFor="title" className="text-sm font-medium text-gray-700">Title</Label>
//             <Input
//               id="title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="mt-1"
//               required
//             />
//           </div>
//           <div>
//             <Label htmlFor="issue" className="text-sm font-medium text-gray-700">Issue</Label>
//             <Textarea
//               id="issue"
//               value={issue}
//               onChange={(e) => setIssue(e.target.value)}
//               className="mt-1"
//               required
//             />
//           </div>
//           <div>
//             <Label htmlFor="environment" className="text-sm font-medium text-gray-700">Environment</Label>
//             <Input
//               id="environment"
//               value={environment}
//               onChange={(e) => setEnvironment(e.target.value)}
//               className="mt-1"
//               required
//             />
//           </div>
//           <div>
//             <Label htmlFor="resolution" className="text-sm font-medium text-gray-700">Resolution</Label>
//             <Textarea
//               id="resolution"
//               value={resolution}
//               onChange={(e) => setResolution(e.target.value)}
//               className="mt-1"
//               rows={6}
//               required
//             />
//           </div>
//           <div>
//             <Label htmlFor="product" className="text-sm font-medium text-gray-700">Products</Label>
//             <div className="flex mt-1">
//               <Input
//                 id="product"
//                 value={product}
//                 onChange={(e) => setProduct(e.target.value)}
//                 className="flex-grow"
//                 placeholder="Add a product"
//               />
//               <Button type="button" onClick={handleAddProduct} className="ml-2 bg-red-600 hover:bg-red-700 text-white">
//                 <PlusCircle className="h-4 w-4" />
//               </Button>
//             </div>
//             <div className="mt-2 flex flex-wrap gap-2">
//               {products.map((p) => (
//                 <Badge key={p} variant="secondary" className="text-sm py-1 px-2">
//                   {p}
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveProduct(p)}
//                     className="ml-1 text-gray-500 hover:text-gray-700"
//                   >
//                     <X className="h-3 w-3" />
//                   </button>
//                 </Badge>
//               ))}
//             </div>
//           </div>
//           <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
//             Create Knowledge Base Entry
//           </Button>
//         </form>
//       </div>
//     </Layout>
//   )
// }
