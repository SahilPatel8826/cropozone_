import React, { useEffect,useState } from 'react';
import { Link ,useNavigate,useLocation} from 'react-router-dom';
import AuthShell from "../components/Common/AuthShell";
import image from "../assets/auth-field.webp";
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import { registerUser } from '../redux/slices/authSlice';
// import { useDispatch } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from '../redux/slices/cartSlice';

const Register = () => {
  const [name, setName] = useState("");
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
      const navigate = useNavigate();
      const location = useLocation();
      const {user,guestId,loading,error} = useSelector((state)=>state.auth);
      const {cart} = useSelector((state)=>state.cart)
  
      //Get redirect parameter and check if it's checkout or something
      const redirect = new URLSearchParams(location.search).get("redirect")||"/";
      const isCheckoutRedirect = redirect.includes("checkout");
      useEffect(()=>{
          if(user){
              if(cart?.products?.length > 0 && guestId){
                  dispatch(mergeCart({guestId,user})).then(()=>{
                      navigate(isCheckoutRedirect?"/checkout":"/");
  
                  })
              }else{
                  navigate(isCheckoutRedirect?"/checkout":"/")
              }
          }
      },[user,guestId,cart,navigate,isCheckoutRedirect,dispatch])
  

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser({ name, email, password }));
  };

  return (
    <AuthShell
      image={image}
      title="Create your account"
      subtitle="Buy and sell crops directly. It takes a minute."
      caption="Where farmers and traders meet."
      footer={<>Already registered? <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className='font-semibold text-paddy underline'>Sign in</Link></>}
    >
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label htmlFor='name' className='mb-1.5 block text-sm font-semibold'>Name</label>
          <input id='name' type='text' required autoComplete='name' value={name} onChange={(e) => setName(e.target.value)} className='field' placeholder='Your full name' />
        </div>
        <div>
          <label htmlFor='email' className='mb-1.5 block text-sm font-semibold'>Email</label>
          <input id='email' type='email' required autoComplete='email' value={email} onChange={(e) => setEmail(e.target.value)} className='field' placeholder='you@example.com' />
        </div>
        <div>
          <label htmlFor='password' className='mb-1.5 block text-sm font-semibold'>Password</label>
          <div className='relative'>
            <input id='password' type={show ? 'text' : 'password'} required minLength={6} autoComplete='new-password' value={password} onChange={(e) => setPassword(e.target.value)} className='field pr-11' placeholder='At least 6 characters' />
            <button type='button' onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'} className='absolute right-3 top-1/2 -translate-y-1/2 text-soil-soft'>
              {show ? <HiOutlineEyeSlash className='h-5 w-5' /> : <HiOutlineEye className='h-5 w-5' />}
            </button>
          </div>
        </div>
        {error && <p role='alert' className='rounded-lg bg-chilli/10 px-3 py-2 text-sm font-medium text-chilli'>{error}</p>}
        <button type='submit' disabled={loading} className='btn-dark w-full disabled:opacity-60'>{loading ? 'Creating account…' : 'Create account'}</button>
      </form>
    </AuthShell>
  );
};

export default Register;
