import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminHome from './Admin/AdminHome'
import AdminAddMaincategory from './Admin/AdminAddMaincategory'
import AdminMaincategory from './Admin/AdminMaincategory'
import AdminUpdateMaincategory from './Admin/AdminUpdateMaincategory'
import AdminAddSubcategory from './Admin/AdminAddSubcategory'
import AdminSubcategory from './Admin/AdminSubcategory'
import AdminUpdateSubcategory from './Admin/AdminUpdateSubcategory'
import AdminAddBrand from './Admin/AdminAddBrand'
import AdminBrand from './Admin/AdminBrand'
import AdminUpdateBrand from './Admin/AdminUpdateBrand'
import AdminAddProduct from './Admin/AdminAddProduct'
import AdminProduct from './Admin/AdminProduct'
import AdminUpdateProduct from './Admin/AdminUpdateProduct'

import Footer from './Footer'

import Home from './Home'
import Navbar from './Navbar'
import Shop from './Shop'
import SingleProductPage from './SingleProductPage'
import Login from './Login'
import Signup from './Signup'
import Profile from './Profile'
import UpdateProfile from './UpdateProfile'
import ContactUS from './Contact'
import AdminContact from './Admin/AdminContact'
import AdminSingleContact from './Admin/AdminSingleContact'
import AdminUserList from './Admin/AdminUserList'
import AdminNewslatter from './Admin/AdminNewslatter'
import Cart from './Cart'
import Checkout from './Checkout'
import Confirmation from './Confirmation'
import AdminCheckout from './Admin/AdminCheckout'
import AdminSingleCheckout from './Admin/AdminSingleCheckout'
import ForgetUsername from './ForgetUsername'
import ForgetOTP from './ForgetOTP'
import ForgetPassword from './ForgetPassword'
export default function App() {
    return (
        <>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/shop/:mc/:sc/:br/' element={<Shop />} />
                    <Route path='/single-product/:_id/' element={<SingleProductPage />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/signup' element={<Signup />} />
                    <Route path='/update-profile' element={<UpdateProfile />} />
                    <Route path='/contact' element={<ContactUS />} />
                    <Route path='/forget-password-username' element={<ForgetUsername />} />
                    <Route path='/forget-password-otp' element={<ForgetOTP />} />
                    <Route path='/forget-password' element={<ForgetPassword />} />


                    <Route path='/profile' element={!(localStorage.getItem("login"))?<Login/>:<Profile />} />
                    <Route path='/cart' element={!(localStorage.getItem("login"))?<Login/>:<Cart />} />
                    <Route path='/checkout' element={!(localStorage.getItem("login"))?<Login/>:<Checkout />} />
                    <Route path='/confirmation' element={!(localStorage.getItem("login"))?<Login/>:<Confirmation />} />

                    <Route path='/admin-home' element={!(localStorage.getItem("login"))?<Login/>:localStorage.getItem("role")==="User"?<Profile/>:<AdminHome />} />
                    <Route path='/admin-maincategory' element={!(localStorage.getItem("login"))?<Login/>:localStorage.getItem("role")==="User"?<Profile/>:<AdminMaincategory />} />
                    <Route path='/admin-add-maincategory' element={!(localStorage.getItem("login"))?<Login/>:localStorage.getItem("role")==="User"?<Profile/>:<AdminAddMaincategory />} />
                    <Route path='/admin-update-maincategory/:_id' element={!(localStorage.getItem("login"))?<Login/>:localStorage.getItem("role")==="User"?<Profile/>:<AdminUpdateMaincategory />} />
                    <Route path='/admin-subcategory' element={!(localStorage.getItem("login"))?<Login/>:localStorage.getItem("role")==="User"?<Profile/>:<AdminSubcategory />} />
                    <Route path='/admin-add-subcategory' element={!(localStorage.getItem("login"))?<Login/>:localStorage.getItem("role")==="User"?<Profile/>:<AdminAddSubcategory />} />
                    <Route path='/admin-update-subcategory/:_id' element={!(localStorage.getItem("login"))?<Login/>:localStorage.getItem("role")==="User"?<Profile/>:<AdminUpdateSubcategory />} />
                    <Route path='/admin-brand' element={!(localStorage.getItem("login"))?<Login/>:localStorage.getItem("role")==="User"?<Profile/>:<AdminBrand />} />
                    <Route path='/admin-add-brand' element={!(localStorage.getItem("login"))?<Login/>:localStorage.getItem("role")==="User"?<Profile/>:<AdminAddBrand />} />
                    <Route path='/admin-update-brand/:_id' element={!(localStorage.getItem("login"))?<Login/>:localStorage.getItem("role")==="User"?<Profile/>:<AdminUpdateBrand />} />
                    <Route path='/admin-product' element={!(localStorage.getItem("login"))?<Login/>:localStorage.getItem("role")==="User"?<Profile/>:<AdminProduct />} />
                    <Route path='/admin-add-product' element={!(localStorage.getItem("login"))?<Login/>:localStorage.getItem("role")==="User"?<Profile/>:<AdminAddProduct />} />
                    <Route path='/admin-update-product/:_id' element={!(localStorage.getItem("login"))?<Login/>:localStorage.getItem("role")==="User"?<Profile/>:<AdminUpdateProduct />} />
                    <Route path='/admin-contact' element={!(localStorage.getItem("login"))?<Login/>:localStorage.getItem("role")==="User"?<Profile/>:<AdminContact/>} />
                    <Route path='/admin-single-contact/:_id' element={!(localStorage.getItem("login"))?<Login/>:localStorage.getItem("role")==="User"?<Profile/>:<AdminSingleContact/>} />
                    <Route path='/admin-userlist' element={!(localStorage.getItem("login"))?<Login/>:localStorage.getItem("role")==="User"?<Profile/>:<AdminUserList/>} />
                    <Route path='/admin-newslatter' element={!(localStorage.getItem("login"))?<Login/>:localStorage.getItem("role")==="User"?<Profile/>:<AdminNewslatter/>} />
                    <Route path='/admin-checkout' element={!(localStorage.getItem("login"))?<Login/>:localStorage.getItem("role")==="User"?<Profile/>:<AdminCheckout/>} />
                    <Route path='/admin-single-checkout/:_id' element={!(localStorage.getItem("login"))?<Login/>:localStorage.getItem("role")==="User"?<Profile/>:<AdminSingleCheckout/>} />
                </Routes>
                <Footer />
            </BrowserRouter>
        </>
    )
}
