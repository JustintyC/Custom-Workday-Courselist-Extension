import React, { useEffect, useState } from 'react'
import "./BottomMenu.css"

export default function BottomMenu() {
    const [ menuOpen, setMenuOpen ] = useState(false);
    const [ menuContent, setMenuContent ] = useState({});

    useEffect(() => {
        const handleMenuRequest = (e) => {
            setMenuOpen(true);
            setMenuContent({
                instructors: e.detail.instructors,
            });
            console.log(e.detail.instructors);
        };

        window.addEventListener("menuRequest", handleMenuRequest);

        return () => {
            window.removeEventListener("menuRequest", handleMenuRequest);
        };
    }, []);

    return (
        <>
            {menuOpen && (
                <div id="bottomMenu">
                    <button onClick={() => setMenuOpen(false)} 
                        style={{ position: "fixed", right: "5px", top: "5px"}}>
                        x
                    </button>
                    {menuContent.instructors 
                    && menuContent.instructors.map((instructor, index) => (
                        <h1 key={index}>{instructor}</h1>
                    ))}
                </div>
            )}
        </>
    );
}
