import React, { useEffect, useRef } from 'react';
import gsap from "gsap";
import { TextPlugin } from "gsap/dist/TextPlugin";

gsap.registerPlugin(TextPlugin);

function Tagline() {
    const animationRef = useRef(null); // Reference to store animation timeline

    useEffect(() => {
        const words = [" Simple.", " Concise.", " Perfect."]
        const cursor = gsap.to('.cursor', { opacity: 0, ease: "power2.inOut", repeat: -1 });
        let boxTL = gsap.timeline()
        boxTL.to('.box', { duration: 1, width: "calc(18 * var(--twa-fs))", delay: 0.5, ease: "power4.inOut" }).from('.f-text', { duration: 1, y: "5vh", ease: "power3.out", onComplete: () => parentTL.play() })
        let parentTL = gsap.timeline({ repeat: -1 }).pause()
        words.forEach(word => {
            let childTL = gsap.timeline({ repeat: 1, yoyo: true, repeatDelay: 1 })
            childTL.to('.a-text', { duration: 1, text: word })
            parentTL.add(childTL)
        })

        animationRef.current = parentTL; // Store the animation timeline in the ref

        // Pause the animation when the component is unmounted
        return () => {
            if (animationRef.current) {
                animationRef.current.pause();
            }
        };
    }, []); // Empty dependency array ensures the effect runs only once after initial render

    return (
        <div className='flex items-center'>
            <h1>
                <span className='box'></span>
                <span className='f-text'>Rewrite your Messages to make them</span>
                <span className='a-text'></span>
                <span className='cursor'>|</span>
            </h1>
        </div>
    );
}

export default Tagline;
