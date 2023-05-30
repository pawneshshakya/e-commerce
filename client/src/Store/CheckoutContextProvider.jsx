import React,{createContext} from "react"

export const Checkout = createContext()
async function addCheckout(item){
    var rawdata = await fetch("/checkout",{
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
async function updateCheckout(item){
    var rawdata = await fetch("/checkout/"+item._id,{
        method:"put",
        headers:{
            "content-type":"application/json",
            "authorization": localStorage.getItem("token"),
            "username": localStorage.getItem("username")
        },
        body:JSON.stringify(item)
    })
    return await rawdata.json()
}
async function getCheckout(){
    var rawdata = await fetch("/checkout",{
        method: "get",
        headers: {
            "content-type": "application/json",
            "authorization":localStorage.getItem("token"),
            "username":localStorage.getItem("username")
        }
    })
    return await rawdata.json()
}
async function getCheckoutUser(){
    var rawdata = await fetch("/checkoutUser/"+localStorage.getItem("userid"),{
        method: "get",
        headers: {
            "content-type": "application/json",
            "authorization":localStorage.getItem("token"),
            "username":localStorage.getItem("username")
        }
    })
    return await rawdata.json()
}
async function getSingleCheckout(item){
    var rawdata = await fetch("/checkout/"+item._id,{
        method: "get",
        headers: {
            "content-type": "application/json",
            "authorization":localStorage.getItem("token"),
            "username":localStorage.getItem("username")
        }
    })
    return await rawdata.json()
}
export default function CheckoutContextProvider(props){
    return <Checkout.Provider value={
            {
                add:addCheckout,
                getCheckout:getCheckout,
                getSingle:getSingleCheckout,
                update:updateCheckout,
                getCheckoutUser:getCheckoutUser
            }
        }>
        {props.children}
    </Checkout.Provider>
}