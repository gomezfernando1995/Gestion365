
import { Link } from 'react-router-dom'


const Hero = () => {
  return (
    <section className=' relative z-10 mt-36  flex flex-col items-center text-center p-10'>

      <div className='grid grid-cols-1 md:grid-cols-1'>

        {/*  <img src={Logo} alt="logo" />/*  }
        {/*TEXTO*/}
        <div className='p-10 '>
          <p className=' text-white text-5xl text '> Gestion365 Soporte de TI sin fricciones</p>
          <p className='py-10 text-white text-xl max-w-3xl mx-auto  '>Gestiona incidentes, centraliza reportes y elimina el caos de los correos electrónicos con una plataforma de tickets intuitiva</p>

          <div className='flex justify-center gap-4 '>
            <Link to="/login"
              className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-900 items-center"
            > Ingresar
            </Link>
            <Link to="/contact"
              className='bg-white px-5 py-3  rounded-xl hover:bg-blue-100 items-center '
            > Quiero una cuenta !
            </Link>

          </div>
        </div>

        {/*IMAGEN*/}
      </div>
    </section>
  )
}

export default Hero