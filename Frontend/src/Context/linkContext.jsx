import { useState } from "react";
import { createContext } from "react";

export const LinksContext = createContext();


const LinksProvider=({children})=>{
    const [targetLink,setTargetLink]=useState('')
    const [tinyLink,setTinyLink]=useState('')
    const [code, setcode] = useState('');
    const [clicks,setClicks]=useState('')
    const [links, setLinks] = useState([]);


    const values={
    targetLink,setTargetLink,
    tinyLink,setTinyLink,
    code, setcode,
    clicks,setClicks,
    links,setLinks
    }

    return <LinksContext.Provider value={values}>{children}</LinksContext.Provider>

    
}


export default LinksProvider

