import { useEffect, useState, useRef } from "react";
import '../styles/memoryCard.css';

function Card({id, selectPokemon}){
    const img = useRef("");
    const [doneCardFetch, setdoneCardFetch] = useState(false);

    useEffect(()=>{
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
            .then(resp => resp.json())
            .then(json => {
                let art = json.sprites.other;
                art = art["official-artwork"]["front_default"];
                img.current = art;
                setdoneCardFetch(true);
            })
        
    }, [id])

    return(
        <div className="pokemonCard" data-id={id}>
            {doneCardFetch &&
            <img 
                src={img.current}
                onClick={()=> {
                    selectPokemon(id);
                }}
            />}
        </div>
    )
}

export default Card;