import React, { useEffect } from "react";
import { logout } from "../../store/actions/Auth";
import { useDispatch } from "react-redux";


const Logout = () => {

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(logout())
  }, [])


  return (
    <h1>
      Logout
    </h1>
  );

}

export default Logout;

