import React, { createContext } from "react"

export const User = createContext()
async function login(item) {
    var rawdata = await fetch("/login", {
        method: "post",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(item)
    })
    return await rawdata.json()
}
async function addUser(item) {
    var rawdata = await fetch("/user", {
        method: "post",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(item)
    })
    return await rawdata.json()
}
async function updateUser(item) {
    var rawdata = await fetch("/user/" + localStorage.getItem("userid"), {
        method: "put",
        headers: {
            "authorization":localStorage.getItem("token"),
            "username":localStorage.getItem("username")
        },
        body: item
    })
    return await rawdata.json()
}
async function getUser() {
    var rawdata = await fetch("/user", {
        method: "get",
        headers: {
            "content-type": "application/json",
            "authorization":localStorage.getItem("token"),
            "username":localStorage.getItem("username")
        }
    })
    return await rawdata.json()
}
async function getSingleUser() {
    var rawdata = await fetch("/user/" + localStorage.getItem("userid"),{
        method: "get",
        headers: {
            "content-type": "application/json",
            "authorization":localStorage.getItem("token"),
            "username":localStorage.getItem("username")
        }
    })
    return await rawdata.json()
}
async function deleteUser(item) {
    var rawdata = await fetch("/user/" + item._id, {
        method: "delete",
        headers: {
            "content-type": "application/json",
            "authorization":localStorage.getItem("token"),
            "username":localStorage.getItem("username")
        }
    })
    return await rawdata.json()
}
export default function UserContextProvider(props) {
    return <User.Provider value={
        {
            login: login,
            add: addUser,
            getUser: getUser,
            deleteData: deleteUser,
            getSingle: getSingleUser,
            update: updateUser
        }
    }>
        {props.children}
    </User.Provider>
}