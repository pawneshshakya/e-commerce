import React,{createContext} from "react"

export const Newslatter = createContext()
async function addNewslatter(item){
    var rawdata = await fetch("/newslatter",{
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
async function getNewslatter(){
    var rawdata = await fetch("/newslatter",{
        method: "get",
        headers: {
            "content-type": "application/json",
            "authorization":localStorage.getItem("token"),
            "username":localStorage.getItem("username")
        }
    })
    return await rawdata.json()
}
async function deleteNewslatter(item){
    var rawdata = await fetch("/newslatter/"+item._id,{
        method:"delete",
        headers: {
            "content-type": "application/json",
            "authorization":localStorage.getItem("token"),
            "username":localStorage.getItem("username")
        }
    })
    return await rawdata.json()
}
export default function NewslatterContextProvider(props){
    return <Newslatter.Provider value={
            {
                add:addNewslatter,
                getNewslatter:getNewslatter,
                deleteData:deleteNewslatter
            }
        }>
        {props.children}
    </Newslatter.Provider>
}