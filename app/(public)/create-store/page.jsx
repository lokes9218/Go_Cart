'use client'
import { assets } from "@/assets/assets"
import { useEffect, useState } from "react"
import Image from "next/image"
import toast from "react-hot-toast"
import Loading from "@/components/Loading"
import {useAuth, useUser} from "@clerk/nextjs"
import {useRouter} from "next/navigation"
export default function CreateStore() {
    const {user} = useUser()
    const { getToken } = useAuth()
    const router = useRouter()
    const [alreadySubmitted, setAlreadySubmitted] = useState(false)
    const [status, setStatus] = useState("")
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")

    const [storeInfo, setStoreInfo] = useState({
        name: "",
        username: "",
        description: "",
        email: "",
        contact: "",
        address: "",
        image: ""
    })

    const onChangeHandler = (e) => {
        setStoreInfo({ ...storeInfo, [e.target.name]: e.target.value })
    }

    const fetchSellerStatus = async () => {
        try {
            // Logic to check if the store is already submitted
            const token = await getToken()
            const response = await fetch("/api/inngest/store/dashboard", {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            })
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch seller status")
            }

            if (data.store) {
                setAlreadySubmitted(true)
                if (data.store.status === "pending") {
                    setStatus("pending")
                    setMessage("Your store details have been submitted and are pending review. We will notify you once the review process is complete.")
                }
                else if (data.store.status === "approved") {
                    setStatus("approved")
                    setMessage("Congratulations! Your store has been approved. You can now access your dashboard and start adding products.")
                    setTimeout(() => {
                        router.push("/store/dashboard")
                    }, 5000)
                }
                else if (data.store.status === "rejected") {
                    setStatus("rejected")
                    setMessage("We regret to inform you that your store application has been rejected. For more information, please contact our support team.")
                }
            }
        }
        catch (error) {
            toast.error(error.message || "Failed to fetch seller status")
        }
        finally {
            setLoading(false)
        }
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        // Logic to submit the store details
        const token = await getToken()
        const formdata = new FormData()
        formdata.append("name", storeInfo.name)
        formdata.append("username", storeInfo.username)
        formdata.append("description", storeInfo.description)
        formdata.append("email", storeInfo.email)
        formdata.append("contact", storeInfo.contact)
        formdata.append("address", storeInfo.address)
        formdata.append("image", storeInfo.image)
        const response = await fetch("/api/inngest/store/create", {
            method: "POST",
            body: formdata,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || "Failed to submit store details")
        }

        setAlreadySubmitted(true)
        setStatus("pending")
        setMessage("Your store details have been submitted successfully and are pending review. We will notify you once the review process is complete.")
    }

    useEffect(() => {
        fetchSellerStatus()
    }, [])

    return !loading ? (
        <>
            {!alreadySubmitted ? (
                <div className="mx-6 min-h-[70vh] my-16">
                    <form onSubmit={e => toast.promise(onSubmitHandler(e), { loading: "Submitting data..." })} className="max-w-7xl mx-auto flex flex-col items-start gap-3 text-slate-500">
                        {/* Title */}
                        <div>
                            <h1 className="text-3xl ">Add Your <span className="text-slate-800 font-medium">Store</span></h1>
                            <p className="max-w-lg">To become a seller on GoCart, submit your store details for review. Your store will be activated after admin verification.</p>
                        </div>

                        <label className="mt-10 cursor-pointer">
                            Store Logo
                            <Image src={storeInfo.image ? URL.createObjectURL(storeInfo.image) : assets.upload_area} className="rounded-lg mt-2 h-16 w-auto" alt="" width={150} height={100} />
                            <input type="file" accept="image/*" onChange={(e) => setStoreInfo({ ...storeInfo, image: e.target.files[0] })} hidden />
                        </label>

                        <p>Username</p>
                        <input name="username" onChange={onChangeHandler} value={storeInfo.username} type="text" placeholder="Enter your store username" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" />

                        <p>Name</p>
                        <input name="name" onChange={onChangeHandler} value={storeInfo.name} type="text" placeholder="Enter your store name" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" />

                        <p>Description</p>
                        <textarea name="description" onChange={onChangeHandler} value={storeInfo.description} rows={5} placeholder="Enter your store description" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded resize-none" />

                        <p>Email</p>
                        <input name="email" onChange={onChangeHandler} value={storeInfo.email} type="email" placeholder="Enter your store email" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" />

                        <p>Contact Number</p>
                        <input name="contact" onChange={onChangeHandler} value={storeInfo.contact} type="text" placeholder="Enter your store contact number" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" />

                        <p>Address</p>
                        <textarea name="address" onChange={onChangeHandler} value={storeInfo.address} rows={5} placeholder="Enter your store address" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded resize-none" />

                        <button className="bg-slate-800 text-white px-12 py-2 rounded mt-10 mb-40 active:scale-95 hover:bg-slate-900 transition ">Submit</button>
                    </form>
                </div>
            ) : (
                <div className="min-h-[80vh] flex flex-col items-center justify-center">
                    <p className="sm:text-2xl lg:text-3xl mx-5 font-semibold text-slate-500 text-center max-w-2xl">{message}</p>
                    {status === "approved" && <p className="mt-5 text-slate-400">redirecting to dashboard in <span className="font-semibold">5 seconds</span></p>}
                </div>
            )}
        </>
    ) : (<Loading />)
}