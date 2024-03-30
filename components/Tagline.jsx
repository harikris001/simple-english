import { React, useEffect } from 'react'; // Import useEffect hook
import gsap from "gsap";
import { TextPlugin } from "gsap/dist/TextPlugin"; // Import specific plugins

gsap.registerPlugin(TextPlugin);

function Tagline() {

    useEffect(() => {
        // Create GSAP animation on component mount
        const words = [" Simple.", " Concise.", " Perfect."]
        const cursor = gsap.to('.cursor', { opacity: 0, ease: "power2.inOut", repeat: -1 });
        let boxTL = gsap.timeline()
        boxTL.to('.box', { duration: 1, width: "36vw", delay: 0.5, ease: "power4.inOut" }).from('.f-text', { duration: 1, y: "5vh", ease: "power3.out", onComplete: () => parentTL.play() })
        let parentTL = gsap.timeline({ repeat: -1, }).pause()
        words.forEach(word => {
            let childTL = gsap.timeline({ repeat: 1, yoyo: true, repeatDelay: 1 })
            childTL.to('.a-text', { duration: 1, text: word })
            parentTL.add(childTL)
        })
        // Cleanup function to clear animation on component unmount
    }); // Empty dependency array ensures the effect runs only once after initial render

    return (
        <div className='flex items-center'><h1>
        <span className='box'></span>
        <span className='f-text'>Rewrite your Messages to make them</span>
        <span className='a-text'></span>
        <span className='cursor'>|</span>
      </h1></div>
    )
}

export default Tagline