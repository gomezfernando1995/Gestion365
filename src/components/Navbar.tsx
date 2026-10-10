import { useState } from 'react'
import Logo from './../assets/logo.png'


const navbarLinks = [
    {
        id: 1,
        title: "Inicio",
        link: "/"
    },
    {
        id: 2,
        title: "Nosotros",
        link: "#"
    },
    {
        id: 3,
        title: "Contacto",
        link: "/contact"
    },
]

const navbarRedes = [
    {
        id: 1,
        title: "Instagram",
        link: "https://www.instagram.com/instbeltran/",
        icon: "bi bi-instagram"
    },
    {
        id: 2,
        title: "Git",
        link: "https://github.com/gomezfernando1995",
        icon: "bi bi-github"
    },
    {
        id: 3,
        title: "Sitio Oficial",
        link: "https://ibeltran.com.ar",
        icon: "bi bi-file-earmark"
    }
]

{/* bg-linear-to-r from-gray-900 via-gray-800 to-blue-900  */ }

const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 w-full bg-blue-950/50  backdrop-blur-md z-50">

            <div className='flex justify-between items-center sm:px-12 sm:py-6  px-4 py-3'>

                {/*Logo navbar*/}
                <div>
                    <img src={Logo} alt="Logo del sitio" className='w-45' />
                </div>

                {/* Botton Hamburgesa - Solo mobile*/}
                <button onClick={() => setIsOpen(!isOpen)} className='text-white md:hidden'>
                    <svg
                        className='w-6 h-6'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                    >
                        {isOpen ? (<path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='m6 18L18 6M6 6l12 12'
                        ></path>) : (<path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M4 6h16M4 12h16M4 18h16 '
                        ></path>)}

                    </svg>
                </button>

                {/*Navegacion desktop */}
                <div className='hidden md:block'>
                    <ul className='flex sm:space-x-8 space-x-4 '>
                        {navbarLinks.map((link) => (
                            <li key={link.id}>
                                <a
                                    className='text-white sm:text-lg text-sm hover:text-blue-400'
                                    href={link.link}>{link.title}</a>
                            </li>
                        ))}
                    </ul>
                </div>
                {/*Navegacion desktop */}
                <div className='hidden md:block'>
                    <ul className='flex space-x-4'>
                        {navbarRedes.map((redes) => (
                            <li key={redes.id}>
                                <a
                                    href={redes.link}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='inline-block'
                                >
                                    <i className={`${redes.icon} text-white sm:text-2xl text-lg hover:text-blue-400`}    >
                                    </i>
                                </a>

                            </li>
                        ))}
                    </ul>
                </div>

            </div>
            {/* Menu Mobile */}
            <div className={`md:hidden absolute w-full  from-gray-900 via-gray-800 to-blue-900 transition-all duration-300 
                ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>

                <ul className='flex flex-col px-4 py-2'>
                    {navbarLinks.map((link) => (
                        <li key={link.id} className='py-2 text-center'>
                            <a
                                className='text-white hover:text-blue-400'
                                href={link.link} onClick={() => setIsOpen(false)}
                            >
                                {link.title}
                            </a>
                        </li>
                    ))}
                </ul>

                <ul className='flex space-x-4 px-4 py-4 border-t border-blue-900 justify-center'>
                    {navbarRedes.map((redes) => (
                        <li key={redes.id}>
                            <a
                                target='_blank'
                                rel='noopener noreferrer'
                                className='inline-block'
                                href={redes.link}
                                onClick={() => setIsOpen(false)}
                            >
                                <i className={`${redes.icon} text-white sm:text-2xl text-lg hover:text-blue-400`}    >
                                </i>
                            </a>

                        </li>
                    ))}
                </ul>

            </div>
        </nav >
    )
}

export default Navbar