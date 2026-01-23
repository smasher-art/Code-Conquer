import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ScrollToTop() {
  const {pathname} = useNavigate();

  useEffect(()=>{
    window.scrollTo({
      top:0,
      left:0,
      behavior: "smooth"
    })
  },[pathname])

  return null;
}
