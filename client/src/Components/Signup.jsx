import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'

import { useNavigate } from 'react-router-dom'

import pic from "../assets/images/signup.jpg"
import { User } from '../Store/UserContextProvider'
export default function Signup() {
    var [user, setuser] = useState({
        name: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        cpassword: ""
    })
    var { add } = useContext(User)
    var navigate = useNavigate()
    function getData(e) {
        var name = e.target.name
        var value = e.target.value
        setuser((old) => {
            return {
                ...old,
                [name]: value
            }
        })
    }
    async function postData(e) {
        e.preventDefault()
        if (user.password === user.cpassword) {
            var item = {
                name: user.name,
                username: user.username,
                email: user.email,
                phone: user.phone,
                password: user.password,
                addressline1: "",
                addressline2: "",
                addressline3: "",
                pin: "",
                city: "",
                state: "",
                pic: "",
                role: "User"
            }
            const response = await add(item)
            if (response.result === "Done")
                navigate("/login")
            else
                alert(response.message)
        }
        else
            alert("Password and Confirm Password Doesn't Matched!!!!")
    }
    return (
        <div className='container-fluid mt-2'>
            <div className='row'>
                <div className='col-md-6 col-12'>
                    <img src={pic} height="500px" width="100%" alt="" />
                </div>
                <div className='col-md-6 col-12'>
                    <h5 className='background text-light text-center p-2'>SignUp Section</h5>
                    <form onSubmit={postData}>
                        <div className='row mb-3'>
                            <div className="col-md-6 col-12">
                                <label className="form-label">Full Name<span className='text-danger'>*</span></label>
                                <input type="text" required className="form-control" onChange={getData} name="name" placeholder='Enter User Full Name' />
                            </div>
                            <div className="col-md-6 col-12">
                                <label className="form-label">User Name<span className='text-danger'>*</span></label>
                                <input type="text" required className="form-control" onChange={getData} name="username" placeholder='Enter User Name' />
                            </div>
                        </div>
                        <div className='row mb-3'>
                            <div className="col-md-6 col-12">
                                <label className="form-label">Email Id<span className='text-danger'>*</span></label>
                                <input type="email" required className="form-control" onChange={getData} name="email" placeholder='Enter Email Address' />
                            </div>
                            <div className="col-md-6 col-12">
                                <label className="form-label">Phone<span className='text-danger'>*</span></label>
                                <input type="text" required className="form-control" onChange={getData} name="phone" placeholder='Enter Phone Number' />
                            </div>
                        </div>
                        <div className='row mb-3'>
                            <div className="col-md-6 col-12">
                                <label className="form-label">Password<span className='text-danger'>*</span></label>
                                <input type="password" required className="form-control" onChange={getData} name="password" placeholder='Enter Your Password' />
                            </div>
                            <div className="col-md-6 col-12">
                                <label className="form-label">Confirm Password<span className='text-danger'>*</span></label>
                                <input type="password" required className="form-control" onChange={getData} name="cpassword" placeholder='Confirm Password' />
                            </div>
                        </div>
                        <button type="submit" className="background mybtn text-light  w-100 btn-sm p-1">Signup</button>
                        <Link to="/login" className='text-decoration-none mt-2'>Already Have an Account?Login</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
