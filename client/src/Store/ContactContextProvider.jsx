import React, { createContext } from "react"

export const Contact = createContext()
async function addContact(item) {
    var rawdata = await fetch("/contact", {
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
async function updateContact(item) {
    var rawdata = await fetch("/contact/" + item._id, {
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
async function getContact() {
    var rawdata = await fetch("/contact",{
        method: "get",
        headers: {
            "content-type": "application/json",
            "authorization":localStorage.getItem("token"),
            "username":localStorage.getItem("username")
        }
    })
    return await rawdata.json()
}
async function getSingleContact(item) {
    var rawdata = await fetch("/contact/" + item._id,{
        method: "get",
        headers: {
            "content-type": "application/json",
            "authorization":localStorage.getItem("token"),
            "username":localStorage.getItem("username")
        }
    })
    return await rawdata.json()
}
async function deleteContact(item) {
    var rawdata = await fetch("/contact/" + item._id, {
        method: "delete",
        headers: {
            "content-type": "application/json",
            "authorization":localStorage.getItem("token"),
            "username":localStorage.getItem("username")
        }
    })
    return await rawdata.json()
}
export default function ContactContextProvider(props) {
    return <Contact.Provider value={
        {
            add: addContact,
            getContact: getContact,
            deleteData: deleteContact,
            getSingle: getSingleContact,
            update: updateContact
        }
    }>
        {props.children}
    </Contact.Provider>
}