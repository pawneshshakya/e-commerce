import React, { createContext } from "react"

export const Maincategory = createContext()
async function addMaincategory(item) {
    var rawdata = await fetch("/maincategory", {
        method: "post",
        headers: {
            "content-type": "application/json",
            "authorization": localStorage.getItem("token"),
            "username": localStorage.getItem("username")
        },
        body: JSON.stringify(item)
    })
    return await rawdata.json()
}
async function updateMaincategory(item) {
    var rawdata = await fetch("/maincategory/" + item._id, {
        method: "put",
        headers: {
            "content-type": "application/json",
            "authorization": localStorage.getItem("token"),
            "username": localStorage.getItem("username")
        },
        body: JSON.stringify(item)
    })
    return await rawdata.json()
}
async function getMaincategory(item) {
    var rawdata = await fetch("/maincategory",{
        method: "get",
        headers: {
            "content-type": "application/json",
            "authorization":localStorage.getItem("token"),
            "username":localStorage.getItem("username")
        }
    })
    return await rawdata.json()
}
async function getSingleMaincategory(item) {
    var rawdata = await fetch("/maincategory/" + item._id,{
        method: "get",
        headers: {
            "content-type": "application/json",
            "authorization":localStorage.getItem("token"),
            "username":localStorage.getItem("username")
        }
    })
    return await rawdata.json()
}
async function deleteMaincategory(item) {
    var rawdata = await fetch("/maincategory/" + item._id, {
        method: "delete",
        headers: {
            "content-type": "application/json",
            "authorization":localStorage.getItem("token"),
            "username":localStorage.getItem("username")
        }
    })
    return await rawdata.json()
}
export default function MaincategoryContextProvider(props) {
    return <Maincategory.Provider value={
        {
            add: addMaincategory,
            getMaincategory: getMaincategory,
            deleteData: deleteMaincategory,
            getSingle: getSingleMaincategory,
            update: updateMaincategory
        }
    }>
        {props.children}
    </Maincategory.Provider>
}