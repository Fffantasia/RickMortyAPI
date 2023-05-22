import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BiSearchAlt } from 'react-icons/bi';
import { IconContext } from 'react-icons';
import logo from './rick-and-morty.png';
// animacion de subida al cambiar pagina y modificar botones de cambio pagina (van mal cuando hace el filter si solo hay una pagina)
function App() {
  const [page, setPage] = useState(1);
  const [path, setPath] = useState(`https://rickandmortyapi.com/api/character/?page=1`);
  const [filter, setFilter] = useState('');
  const [isFaded, setFaded] = useState(false);
  const [character, setCharacter] = useState(null);
  const [info, setInfo] = useState(null);
  const [error, setError] = useState(false);

  useEffect(()=>{
    const fetchData = async()=>{
      const result = await axios(path);
      setCharacter(result.data.results);
      setInfo(result.data.info);
    }
    fetchData();
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    setFaded(true);
  },[page])
  useEffect(()=>{
    const fetchData = async()=>{
      try{
        const result = await axios(`https://rickandmortyapi.com/api/character/?name=${filter}`);
        setCharacter(result.data.results);
        setInfo(result.data.info);
        setError(false);
      }catch(error){
        setError(true);
      }
    }
    fetchData();
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    setPage(1);
  },[filter])

  function buttonRender(){
    if(page > 1 && page < info.pages){
      return(<div className="button-cont">
              <button onClick={() => page_prev()} className="button-prev">Previous</button>
              <button onClick={() => page_next()} className="button-next">Next</button>
            </div>)}
    else if(page == 1){
      return(<div className="button-cont">
              <button onClick={() => page_next()} className="button-next">Next</button>
            </div>)}
    else if(page == info.pages){
      return(<div className="button-cont">
              <button onClick={() => page_prev()} className="button-prev">Previous</button>
            </div>)}
  }
  function page_prev(){
    setPage(page - 1);
    setPath(info.prev);
  }
  function page_next(){
    setPage(page + 1);
    setPath(info.next)
  }
  function search(e){
    setFilter(e.target.value);
  }
  function showBody(char){
    let body = document.getElementById(`body-${char.id}`)
    body.classList.remove("hidden")
  }
  function hideBody(char){
    let body = document.getElementById(`body-${char.id}`)
    body.classList.add("hidden")
  }
  if(error){
    return(
      <div className='App'>
        <div className='menu-cont'>
          <div className='logo-cont'><img src={logo}/></div>
          <div className='navbar-cont'>
            <IconContext.Provider value={{color: "#16acc9", size: 60}}><BiSearchAlt style={{stroke: "#d1d94b", strokeWidth: "1"}}/></IconContext.Provider>
            <div className='navbar'>
              <form action="">
                <input className='search' type="text" placeholder="Search..." onChange={search}></input>
              </form>
            </div>
          </div>
        </div>
        <div className='error-cont'>
          <p className='error-text'>No cards available to be displayed</p>
        </div>
      </div>)
  }
  else if(character){
    return (
      <div className='App'>
        <div className='menu-cont'>
          <div className='logo-cont'><img src={logo}/></div>
          <div className='navbar-cont'>
            <IconContext.Provider value={{color: "#16acc9", size: 60}}><BiSearchAlt style={{stroke: "#d1d94b", strokeWidth: "1"}}/></IconContext.Provider>
            <div className='navbar'>
              <form action="">
                <input className='search' type="text" placeholder="Search..." onChange={search}></input>
              </form>
            </div>
          </div>
        </div>
        <div className='page-cont'>
          {character.map(char => (
            <div className={isFaded ? 'card-cont fade' : 'card-cont'} onMouseLeave={() => hideBody(char)} onAnimationEnd={() => setFaded(false)}>
              <div className="img-cont" onMouseEnter={() => showBody(char)}>
                <img src={char.image}/>
              </div>
              <div id={"body-" + char.id} className="body-cont hidden" onMouseLeave={() => hideBody(char)}>
                <h2>{char.name}</h2>
                <p>{char.species}</p>
              </div>
            </div>
          ))}
          {buttonRender()}
        </div>
      </div>)}
  else{
    return(<div className='loading-cont'>
            <p className='loading-text'>Loading...</p>
          </div>)
  }
}

export default App;
