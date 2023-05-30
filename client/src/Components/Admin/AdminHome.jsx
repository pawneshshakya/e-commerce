import React, { useState, useEffect, useContext } from 'react'

import pic from "../../assets/images/noimage.png"
import LeftNav from './LeftNav'
import { Link } from 'react-router-dom'

import { User } from '../../Store/UserContextProvider'
export default function AdminHome() {
    var [user, setuser] = useState({})
    var { getSingle } = useContext(User)
    async function getAPIData() {
        var response = await getSingle()
        if (response.result === "Done")
            setuser(response.data)
        else
            alert(response.message)
    }
    useEffect(() => {
        getAPIData()
    }, [])
    return (
        <div className='container-fluid mt-2'>
            <div className='row'>
                <div className='col-lg-2 col-md-4 col-sm-6 col-12'>
                    <LeftNav />
                </div>
                <div className='col-lg-10 col-md-8 col-sm-6 col-12'>
                    <div className='row'>
                        <div className='col-md-6 col-12'>
                            {
                                user.pic ? <img src={`/public/uploads/${user.pic}`} width="100%" height="500px" alt='' /> : <img src={pic} width="100%" height="500px" alt='' />
                            }
                        </div>
                        <div className='col-md-6 col-12'>
                            <h5 className='background text-light text-center p-1'>Admin Home Page</h5>
                            <table className='table table-striped table-hover'>
                                <tbody>
                                    <tr>
                                        <th>Name</th>
                                        <td>{user.name}</td>
                                    </tr>
                                    <tr>
                                        <th>User Name</th>
                                        <td>{user.username}</td>
                                    </tr>
                                    <tr>
                                        <th>Role</th>
                                        <td>{user.role}</td>
                                    </tr>
                                    <tr>
                                        <th>Email ID</th>
                                        <td>{user.email}</td>
                                    </tr>
                                    <tr>
                                        <th>Phone</th>
                                        <td>{user.phone}</td>
                                    </tr>
                                    <tr>
                                        <th colSpan={2}><Link to="/update-profile" className='text-decoration-none p-1 d-block text-center rounded background text-light mybtn w-100 btn-sm'>Update Profile</Link></th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
