import React,{createContext} from "react"

export const Wishlist = createContext()
async function addWishlist(item){
    var rawdata = await fetch("/wishlist",{
        method:"post",
        headers:{
            "content-type":"application/json",
            "authorization": localStorage.getItem("token"),
            "username": localStorage.getItem("username")
        },
        body:JSON.stringify(item)
    })
    return await rawdata.json()
}
async function getWishlist(){
    var rawdata = await fetch("/wishlist/"+localStorage.getItem("userid"),{
        method: "get",
        headers: {
            "content-type": "application/json",
            "authorization":localStorage.getItem("token"),
            "username":localStorage.getItem("username")
        }
    })
    return await rawdata.json()
}
async function deleteWishlist(item){
    var rawdata = await fetch("/wishlist/"+item._id,{
        method:"delete",
        headers: {
            "content-type": "application/json",
            "authorization":localStorage.getItem("token"),
            "username":localStorage.getItem("username")
        }
    })
    return await rawdata.json()
}
export default function WishlistContextProvider(props){
    return <Wishlist.Provider value={
            {
                addWishlist:addWishlist,
                getWishlist:getWishlist,
                deleteData:deleteWishlist
            }
        }>
        {props.children}
    </Wishlist.Provider>
}