import React, { useState, useEffect, useContext } from 'react'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Link } from 'react-router-dom'

import pic from "../assets/images/noimage.png"
import { User } from "../Store/UserContextProvider"
import { Wishlist } from "../Store/WishlistContextProvider"
import { Checkout } from "../Store/CheckoutContextProvider"
export default function Profile() {
    var [user, setuser] = useState({})
    var [wishlist, setwishlist] = useState([])
    var [orders, setorders] = useState([])
    var { getSingle } = useContext(User)
    var { getWishlist, deleteData } = useContext(Wishlist)
    var { getCheckoutUser } = useContext(Checkout)
    async function getAPIData() {
        var item = {
            _id: localStorage.getItem("userid")
        }
        var response = await getSingle()
        setuser(response.data)
        response = await getWishlist()
        setwishlist(response.data)

        response = await getCheckoutUser()
        setorders(response.data)
    }
    async function deleteRecord(_id) {
        if (window.confirm("Are Your Sure to Delete : ")) {
            var item = {
                _id: _id
            }
            await deleteData(item)
            getAPIData()
        }
    }
    useEffect(() => {
        getAPIData()
    },[])
    return (
        <div className='container-fluid mt-2'>
            <div className='row'>
                <div className='col-md-6 col-12'>
                    {user.pic ?
                        <img src={`./public/uploads/${user.pic}`} height="520px" width="500px" alt='' /> :
                        <img src={pic} height="520px" width="500px"  alt=''/>
                    }
                </div>
                <div className='col-md-6 col-12'>
                    <h5 className='background text-light text-center p-1'>Buyer Profile Section</h5>
                    <table className='table'>
                        <tbody>
                            <tr>
                                <th>Full Name</th>
                                <td>{user.name}</td>
                            </tr>
                            <tr>
                                <th>User Name</th>
                                <td>{user.username}</td>
                            </tr>
                            <tr>
                                <th>Email Address</th>
                                <td>{user.email}</td>
                            </tr>
                            <tr>
                                <th>Phone</th>
                                <td>{user.phone}</td>
                            </tr>
                            <tr>
                                <th>House Number or Building Number</th>
                                <td>{user.addressline1}</td>
                            </tr>
                            <tr>
                                <th>Street Number or Near By</th>
                                <td>{user.addressline2}</td>
                            </tr>
                            <tr>
                                <th>Village or Locality</th>
                                <td>{user.addressline3}</td>
                            </tr>
                            <tr>
                                <th>PIN</th>
                                <td>{user.pin}</td>
                            </tr>
                            <tr>
                                <th>City</th>
                                <td>{user.city}</td>
                            </tr>
                            <tr>
                                <th>State</th>
                                <td>{user.state}</td>
                            </tr>
                            <tr>
                                <th colSpan={2}><Link to="/update-profile" className='text-decoration-none p-1 d-block text-center rounded background text-light mybtn w-100 btn-sm'>Update Profile</Link></th>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            {
                wishlist.length>=1 ?
                    <>
                        <h5 className='background text-light text-center p-2 mt-2'>Wishlist Section</h5>
                        <div className='table-responsive'>
                            <table className='table'>
                                <tbody>
                                    <tr>
                                        <th></th>
                                        <th>Name</th>
                                        <th>Maincategory</th>
                                        <th>Subcategory</th>
                                        <th>Brand</th>
                                        <th>Color</th>
                                        <th>Size</th>
                                        <th>Price</th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                    {
                                        wishlist.map((item, index) => {
                                            return <tr key={index}>
                                                <td><img src={`./public/uploads/${item.pic}`} width="100px" height="70px" className="rounded" alt='' /></td>
                                                <td>{item.name}</td>
                                                <td>{item.maincategory}</td>
                                                <td>{item.subcategory}</td>
                                                <td>{item.brand}</td>
                                                <td>{item.color}</td>
                                                <td>{item.size}</td>
                                                <td>&#8377;{item.price ? item.price.toFixed(0) : ""}</td>
                                                <td><Link className='btn mybtn text-danger' to={`/single-product/${item.productid}`}><AddShoppingCartIcon /></Link></td>
                                                <td><button className='btn mybtn text-danger' onClick={() => deleteRecord(item._id)}><DeleteForeverIcon /></button></td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </> :
                    <h5 className='background text-light text-center p-2 mt-2'>No Items in Wishlist</h5>
            }
            {
                orders.length >= 1 ?
                    <>
                        <h5 className='background text-light text-center p-2 mt-2'>Order History Section</h5>
                        {
                            orders.map((item, index) => {
                                return <div className='row' key={index}>
                                    <div className='col-lg-3 col-md-4 col-12'>
                                        <div className='table-responsive'>
                                            <table className='table'>
                                                <tbody>
                                                    <tr>
                                                        <th>Order Id</th>
                                                        <td>{item._id}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Payment Mode</th>
                                                        <td>{item.paymentmode}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Order Status</th>
                                                        <td>{item.orderstatus}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Payment Status</th>
                                                        <td>{item.paymentstatus}</td>
                                                    </tr>
                                                    {
                                                        item.rppid?<tr>
                                                        <th>RPPID</th>
                                                        <td>{item.rppid}</td>
                                                    </tr>:""
                                                    }
                                                    <tr>
                                                        <th>Total</th>
                                                        <td>&#8377;{item.totalamount}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Shipping</th>
                                                        <td>&#8377;{item.shippingamount}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Final</th>
                                                        <td>&#8377;{item.finalamount}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Date</th>
                                                        <td>{`${new Date(item.date).getDate()}/${new Date(item.date).getMonth()+1}/${new Date(item.date).getFullYear()}`}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className='col-lg-9 col-md-8 col-12'>
                                        <h5 className='background text-light text-center p-2 mt-2'>Products in Order</h5>
                                        <div className='table-responsive'>
                                            <table className='table'>
                                                <tbody>
                                                    <tr>
                                                        <th></th>
                                                        <th>Name</th>
                                                        <th>Maincategory</th>
                                                        <th>Subcategory</th>
                                                        <th>Brand</th>
                                                        <th>Color</th>
                                                        <th>Size</th>
                                                        <th>Price</th>
                                                        <th></th>
                                                        <th></th>
                                                    </tr>
                                                    {
                                                        item.products && item.products.map((item, index) => {
                                                            return <tr key={index}>
                                                                <td><img src={`./public/uploads/${item.pic}`} width="100px" height="70px" className="rounded"  alt=''/></td>
                                                                <td>{item.name}</td>
                                                                <td>{item.maincategory}</td>
                                                                <td>{item.subcategory}</td>
                                                                <td>{item.brand}</td>
                                                                <td>{item.color}</td>
                                                                <td>{item.size}</td>
                                                                <td>&#8377;{item.price ? item.price.toFixed(0) : ""}</td>
                                                            </tr>
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <hr style={{ border: "5px solid lightgray" }} />
                                </div>
                            })
                        }
                    </> :
                    <h5 className='background text-light text-center p-2 mt-2'>No Order History</h5>
            }
        </div>
    )
}
