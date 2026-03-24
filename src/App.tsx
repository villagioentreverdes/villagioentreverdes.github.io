import { useState, useEffect, useCallback, useRef } from 'react';
import { Menu, X, MapPin, Phone, Instagram, ZoomIn, MessageCircle, ChevronLeft, ChevronRight, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MEDIA_ASSETS = {
  logoVerde: '/midias/imagem.logo-villagio-verde.png',
  logoBranco: '/midias/imagem.logo-villagio-branco.png',
  logoCompleto: '/midias/imagem.logo-villagio-completo.png',
  logoDomus: '/midias/imagem.logo-domus-inc.png',
  heroVideo: '/midias/video.hero.mp4',
  heroPoster: '/midias/imagem.hero-poster.jpg',
  oVillagio: '/midias/imagem.o-villagio.jpg',
  oEmpreendimento: '/midias/imagem.o-empreendimento.jpg',
  comodidades: {
    portaria: '/midias/imagem.comodidade-portaria.jpg',
    lazerNatureza: '/midias/imagem.comodidade-lazer-natureza.jpg',
    beachTennis: '/midias/imagem.comodidade-beach-tennis.jpg',
    academiaArLivre: '/midias/imagem.comodidade-academia-ar-livre.jpg',
    miniMercado: '/midias/imagem.comodidade-mini-mercado.jpg',
    petPlace: '/midias/imagem.comodidade-pet-place.jpg',
    parquinhoInfantil: '/midias/imagem.comodidade-parquinho-infantil.jpg',
    espacoZen: '/midias/imagem.comodidade-espaco-zen.jpg',
  },
  galeria: Array.from({ length: 12 }, (_, i) => `/midias/imagem.galeria-${String(i + 1).padStart(2, '0')}.jpg`),
  plantas: {
    inferior: '/midias/imagem.planta-inferior.jpg',
    superior: '/midias/imagem.planta-superior.jpg',
  },
  localizacaoVideo: '/midias/video.localizacao.mp4',
  localizacaoPoster: '/midias/imagem.localizacao-poster.jpg',
};

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formState, setFormState] = useState({ name: '', phone: '', email: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  const scrollGallery = (direction: 'left' | 'right') => {
    if (galleryRef.current) {
      const scrollAmount = window.innerWidth * 0.8;
      galleryRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (window.innerWidth < 1024) return;
    
    let animationFrameId: number;
    const scrollContainer = carouselRef.current;
    
    const scroll = () => {
      if (scrollContainer && !isCarouselHovered) {
        scrollContainer.scrollLeft += 0.5;
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [isCarouselHovered]);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      const response = await fetch('https://formsubmit.co/ajax/imobiliariadomussolucoes@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formState)
      });
      
      if (response.ok) {
        setFormStatus('success');
        setFormState({ name: '', phone: '', email: '' });
      } else {
        setFormStatus('error');
      }
    } catch {
      setFormStatus('error');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen || selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen, selectedImage]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSelectedImage(null);
      setIsMobileMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="font-sans bg-[#F9F6F0] text-gray-800 antialiased selection:bg-[#A64322] selection:text-white">
      {/* Navbar */}
      <nav
        className={`fixed w-full z-50 top-0 left-0 transition-all duration-500 ${
          isScrolled ? 'bg-[#F8F2E3] py-4 shadow-sm' : 'bg-transparent py-6 md:py-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <a href="#" className="flex items-center z-50">
            <img 
              src={isScrolled ? MEDIA_ASSETS.logoVerde : MEDIA_ASSETS.logoBranco} 
              alt="Villagio Entre Verdes" 
              className="h-10 md:h-12 w-auto object-contain transition-all duration-500"
            />
          </a>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-10">
            {[
              { name: 'O Villagio', id: 'o-villagio' },
              { name: 'O Empreendimento', id: 'o-empreendimento' },
              { name: 'Comodidades', id: 'comodidades' },
              { name: 'Localização', id: 'localizacao' },
              { name: 'Planta 115m²', id: 'planta-115m2' },
              { name: 'Galeria', id: 'galeria' }
            ].map((item) => (
              <a
                key={item.name}
                href={`#${item.id}`}
                className={`font-sans text-[0.65rem] tracking-[0.2em] uppercase hover:text-[#A64322] transition-colors duration-300 ${isScrolled ? 'text-gray-600' : 'text-white/80'}`}
              >
                {item.name}
              </a>
            ))}
            <a
              href="#agende-sua-visita"
              className={`font-sans px-8 py-3 rounded-full text-[0.65rem] tracking-[0.2em] uppercase transition-all duration-300 ${
                isScrolled 
                  ? 'bg-[#A64322] text-white hover:bg-[#8A361A]' 
                  : 'bg-white text-[#A64322] hover:bg-white/90'
              }`}
            >
              Agende sua visita
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`lg:hidden z-50 focus:outline-none transition-colors duration-300 ${isScrolled || isMobileMenuOpen ? 'text-gray-800' : 'text-white'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 w-full h-screen bg-[#F8F2E3] flex flex-col items-center justify-center space-y-8 pt-20 z-40"
            >
              {[
                { name: 'O Villagio', id: 'o-villagio' },
                { name: 'O Empreendimento', id: 'o-empreendimento' },
                { name: 'Comodidades', id: 'comodidades' },
                { name: 'Localização', id: 'localizacao' },
                { name: 'Planta 115m²', id: 'planta-115m2' },
                { name: 'Galeria', id: 'galeria' },
                { name: 'Plantão de Vendas', id: 'plantao-de-vendas' }
              ].map((item) => (
                <a
                  key={item.name}
                  href={`#${item.id}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-serif text-[#556B2F] hover:text-[#A64322] transition-colors"
                >
                  {item.name}
                </a>
              ))}
              <a
                href="#agende-sua-visita"
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-sans mt-8 bg-[#A64322] text-white px-10 py-4 rounded-full text-sm tracking-widest uppercase"
              >
                Agende sua visita
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={MEDIA_ASSETS.heroPoster}
            className="w-full h-full object-cover"
          >
            <source src={MEDIA_ASSETS.heroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 flex flex-col items-center justify-center"
          >
            <div className="flex flex-col items-center">
              <span className="font-serif text-2xl md:text-3xl text-white tracking-[0.25em] uppercase font-light">Villagio</span>
              <span className="font-sans text-[0.65rem] md:text-xs text-white/70 tracking-[0.5em] uppercase font-light mt-2 block">Entre Verdes</span>
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-[6rem] text-white font-serif font-light mb-16 leading-[1.1] tracking-tight"
          >
            VIVA A SERENIDADE
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <a href="#agende-sua-visita" className="font-sans inline-flex items-center justify-center text-center bg-[#A64322] hover:bg-[#8A361A] text-white px-12 py-4 rounded-full text-[0.7rem] uppercase tracking-[0.2em] transition-all hover:scale-[1.02] shadow-xl w-full sm:w-auto">
              Agende sua visita
            </a>
            <a href="https://wa.me/5519998836542" target="_blank" rel="noopener noreferrer" className="font-sans inline-flex items-center justify-center bg-transparent border border-white/40 hover:bg-white/10 text-white px-12 py-4 rounded-full text-[0.7rem] uppercase tracking-[0.2em] transition-all hover:scale-[1.02] w-full sm:w-auto">
              Fale Conosco
            </a>
          </motion.div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section id="o-villagio" className="py-24 md:py-40 bg-[#F8F2E3] relative">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="lg:col-span-5 order-2 lg:order-1"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#556B2F] mb-8 leading-[1.1] tracking-tight">
                O Villagio<br/>Entre Verdes
              </h2>
              <div className="w-16 h-[1px] bg-[#A64322]/60 mb-10"></div>
              <p className="text-xl md:text-2xl text-[#556B2F] font-serif italic mb-10 leading-relaxed">
                A tradução de um novo ritmo de viver.
              </p>
              <p className="font-sans text-base md:text-lg text-gray-800 font-light leading-[1.8] mb-6">
                Um encontro entre natureza e sofisticação, onde o tempo desacelera, o bem-estar se torna essencial e o morar ganha significado.
              </p>
              <p className="font-sans text-base md:text-lg text-gray-800 font-light leading-[1.8]">
                Um espaço que resgata o senso de comunidade, sem renunciar à privacidade, e transforma o cotidiano em uma experiência mais consciente, equilibrada e valiosa.
              </p>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="lg:col-span-6 lg:col-start-7 order-1 lg:order-2"
            >
              <div className="p-3 md:p-5 bg-white shadow-xl rounded-sm">
                <div className="overflow-hidden rounded-sm relative aspect-[4/5] md:aspect-[3/4]">
                  <img 
                    src={MEDIA_ASSETS.oVillagio} 
                    alt="O Villagio Entre Verdes" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s]" 
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="o-empreendimento" className="py-24 md:py-40 bg-[#556B2F]">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="lg:col-span-6 relative h-[60vh] md:h-[80vh] cursor-pointer group overflow-hidden bg-gray-100 shadow-2xl rounded-sm"
              onClick={() => setSelectedImage(MEDIA_ASSETS.oEmpreendimento)}
            >
              <img 
                src={MEDIA_ASSETS.oEmpreendimento} 
                alt="O Empreendimento" 
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" 
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
                  e.currentTarget.parentElement!.onclick = () => setSelectedImage("https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80");
                }}
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <div className="bg-white/95 text-[#556B2F] px-8 py-4 rounded-full flex items-center backdrop-blur-md uppercase tracking-widest text-sm font-sans">
                  <ZoomIn className="w-4 h-4 mr-3" /> Ampliar
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="lg:col-span-6"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-8 leading-[1.1] tracking-tight">
                O<br/>Empreendimento
              </h2>
              <div className="w-16 h-[1px] bg-[#A64322] mb-10"></div>
              <p className="font-sans text-base md:text-lg text-white/90 font-light leading-[1.8] mb-6">
                O Villagio Entre Verdes foi planejado com foco em qualidade construtiva, conforto e valorização.
              </p>
              <p className="font-sans text-base md:text-lg text-white/90 font-light leading-[1.8] mb-6">
                Com apenas 20 unidades, oferece casas de dois pavimentos, 3 suítes e quintal privativo, com plantas inteligentes e excelente aproveitamento dos espaços. A obra segue um padrão elevado de execução, com acabamentos de qualidade e atenção aos detalhes.
              </p>
              <p className="font-sans text-base md:text-lg text-white/90 font-light leading-[1.8] mb-12">
                Um empreendimento sólido, pensado para entregar segurança, durabilidade e bem-estar em cada metro quadrado.
              </p>
              
              <div className="grid grid-cols-2 gap-y-10 gap-x-6">
                <div className="border-l border-[#A64322] pl-5">
                  <div className="text-4xl md:text-5xl font-serif text-white mb-2">20</div>
                  <div className="font-sans text-[0.65rem] md:text-xs uppercase tracking-[0.2em] text-white/70 font-medium">Casas Exclusivas</div>
                </div>
                <div className="border-l border-[#A64322] pl-5">
                  <div className="text-4xl md:text-5xl font-serif text-white mb-2">115m²</div>
                  <div className="font-sans text-[0.65rem] md:text-xs uppercase tracking-[0.2em] text-white/70 font-medium">Com quintal privativo</div>
                </div>
                <div className="border-l border-[#A64322] pl-5">
                  <div className="text-4xl md:text-5xl font-serif text-white mb-2">3</div>
                  <div className="font-sans text-[0.65rem] md:text-xs uppercase tracking-[0.2em] text-white/70 font-medium">Suítes</div>
                </div>
                <div className="border-l border-[#A64322] pl-5">
                  <div className="text-4xl md:text-5xl font-serif text-white mb-2">2</div>
                  <div className="font-sans text-[0.65rem] md:text-xs uppercase tracking-[0.2em] text-white/70 font-medium">Vagas exclusivas</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section id="comodidades" className="py-24 md:py-40 bg-[#F8F2E3] text-[#556B2F]">
        <div className="max-w-[100vw] overflow-hidden">
          <div className="max-w-7xl mx-auto px-8 md:px-16 mb-16">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="text-left"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-8 tracking-tight">As Comodidades</h2>
              <div className="w-16 h-[1px] bg-[#A64322]/60"></div>
            </motion.div>
          </div>

          <div 
            className="relative group"
            onMouseEnter={() => setIsCarouselHovered(true)}
            onMouseLeave={() => setIsCarouselHovered(false)}
          >
            {/* Desktop Navigation Arrows */}
            <button 
              onClick={() => scrollCarousel('left')}
              className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-[#556B2F] p-4 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => scrollCarousel('right')}
              className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-[#556B2F] p-4 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <ChevronRight size={24} />
            </button>

            <motion.div 
              ref={carouselRef}
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col lg:flex-row lg:overflow-x-auto lg:snap-x lg:snap-mandatory gap-8 lg:gap-6 px-8 md:px-16 pb-12 hide-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {[
                { 
                  title: "Portaria remota e segurança 24 horas", 
                  desc: "Mais segurança e tranquilidade para o dia a dia, com controle de entrada e um ambiente reservado para os moradores.",
                  img: MEDIA_ASSETS.comodidades.portaria 
                },
                { 
                  title: "Área de lazer integrada à natureza", 
                  desc: "Ambientes planejados para proporcionar bem-estar, convivência e momentos de descanso em meio ao verde.",
                  img: MEDIA_ASSETS.comodidades.lazerNatureza 
                },
                { 
                  title: "Quadra de beach tennis", 
                  desc: "Um convite ao movimento e ao lazer, unindo esporte, socialização e qualidade de vida em um ambiente descontraído e sofisticado.",
                  img: MEDIA_ASSETS.comodidades.beachTennis 
                },
                { 
                  title: "Academia ao ar livre", 
                  desc: "Treinar cercado pela natureza transforma o exercício em uma experiência de equilíbrio, energia e bem-estar.",
                  img: MEDIA_ASSETS.comodidades.academiaArLivre 
                },
                { 
                  title: "Mini mercado", 
                  desc: "Praticidade no dia a dia com conveniência a poucos passos de casa, trazendo mais conforto e autonomia para os moradores.",
                  img: MEDIA_ASSETS.comodidades.miniMercado, 
                  note: "*Preparado para mini mercado" 
                },
                { 
                  title: "Pet place", 
                  desc: "Um espaço pensado para que os pets também tenham liberdade, conforto e qualidade de vida.",
                  img: MEDIA_ASSETS.comodidades.petPlace 
                },
                { 
                  title: "Parquinho infantil", 
                  desc: "Um ambiente seguro e acolhedor para as crianças crescerem, brincarem e criarem memórias.",
                  img: MEDIA_ASSETS.comodidades.parquinhoInfantil 
                },
                { 
                  title: "Espaço zen", 
                  desc: "Um refúgio pensado para desacelerar, respirar e se reconectar. Um ambiente de silêncio, contemplação e equilíbrio, onde o bem-estar se torna parte da rotina.",
                  img: MEDIA_ASSETS.comodidades.espacoZen 
                }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  variants={fadeInUp}
                  className="lg:snap-start shrink-0 w-full lg:w-[400px] group relative bg-white overflow-hidden transition-all duration-500 flex flex-col rounded-sm shadow-lg"
                >
                  <div className="h-64 md:h-72 relative overflow-hidden">
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                  </div>
                  <div className="p-8 flex flex-col flex-grow justify-between bg-white">
                    <div>
                      <h3 className="text-xl font-serif text-[#556B2F] leading-tight mb-4">{item.title}</h3>
                      <p className="font-sans text-sm text-gray-600 font-light leading-relaxed mb-4">{item.desc}</p>
                    </div>
                    {item.note && (
                      <p className="font-sans text-xs text-gray-500 font-light mt-auto pt-4 border-t border-gray-100">{item.note}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="localizacao" className="relative py-32 md:py-48 bg-[#556B2F] overflow-hidden flex items-center justify-center min-h-[80vh]">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={MEDIA_ASSETS.localizacaoPoster}
            className="w-full h-full object-cover"
          >
            <source src={MEDIA_ASSETS.localizacaoVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 text-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="max-w-4xl mx-auto flex flex-col items-center"
          >
            <h2 className="text-5xl md:text-7xl font-serif text-white mb-8 tracking-tight">A Localização</h2>
            <div className="w-16 h-[1px] bg-[#A64322] mb-12"></div>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed font-light">
              O Villagio Entre Verdes está em uma das localizações mais estratégicas de Sumaré.
            </p>
            <p className="text-lg md:text-xl text-white/80 mb-16 leading-relaxed font-light">
              Próximo à Rua Marcelo Pedroni, ao lado do parque linear da represa Marcelo Pedroni e cercado por condomínios de alto padrão, une valorização, conveniência e qualidade de vida. Uma região privilegiada, que conecta você ao melhor da cidade sem abrir mão do contato com a natureza.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
              <div className="flex flex-col items-center">
                <div className="text-5xl md:text-6xl font-serif text-white mb-4">40 min</div>
                <div className="text-xs md:text-sm uppercase tracking-[0.3em] text-white/70 font-medium">de Campinas</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-5xl md:text-6xl font-serif text-white mb-4">1h20</div>
                <div className="text-xs md:text-sm uppercase tracking-[0.3em] text-white/70 font-medium">de São Paulo</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Floor Plan Section */}
      <section id="planta-115m2" className="py-32 md:py-48 bg-[#F8F2E3]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="lg:col-span-5"
            >
              <h2 className="text-5xl md:text-7xl font-serif text-[#2C4C3B] mb-12 tracking-tight">Planta 115m²</h2>
              <div className="w-12 h-[1px] bg-[#A64322] mb-12"></div>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed font-light">
                A planta de 115m² do Villagio Entre Verdes foi pensada para unir conforto, funcionalidade e sofisticação. Com dois pavimentos, separa de forma inteligente as áreas sociais e íntimas, garantindo mais privacidade no dia a dia.
              </p>
              <p className="text-xl text-gray-600 mb-12 leading-relaxed font-light">
                No piso inferior, os ambientes são integrados, com sala de estar, jantar e cozinha em conceito aberto, trazendo amplitude e iluminação natural. No superior, são 3 suítes bem distribuídas, com destaque para a suíte master, que conta com espaço para closet.
              </p>
              <p className="text-xl text-gray-600 mb-16 leading-relaxed font-light italic">
                Um projeto que valoriza cada detalhe para proporcionar uma rotina mais prática, confortável e elegante.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-16">
                {[
                  "3 suítes",
                  "2 vagas",
                  "Closet",
                  "Cozinha integrada",
                  "Quintal privativo",
                  "Preparação para ar-condicionado"
                ].map((item, index) => (
                  <div key={index} className="flex items-center text-[#2C4C3B]">
                    <div className="w-1.5 h-1.5 bg-[#A64322] rounded-full mr-4"></div>
                    <span className="font-light tracking-wide">{item}</span>
                  </div>
                ))}
              </div>

              <a href="https://wa.me/5519998836542" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center text-center bg-transparent border border-[#2C4C3B] text-[#2C4C3B] hover:bg-[#2C4C3B] hover:text-white px-10 py-4 rounded-full text-xs uppercase tracking-[0.2em] transition-all">
                Agende sua visita
              </a>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10"
            >
              <div className="bg-white p-8 md:p-10 flex flex-col items-center justify-center group rounded-2xl shadow-xl shadow-black/5 border border-gray-100/50">
                <h4 className="font-serif text-2xl text-[#2C4C3B] mb-8 tracking-wide">Pavimento Inferior</h4>
                <div 
                  className="relative w-full aspect-[3/4] overflow-hidden bg-white flex items-center justify-center cursor-pointer"
                  onClick={() => setSelectedImage(MEDIA_ASSETS.plantas.inferior)}
                >
                  <img 
                    src={MEDIA_ASSETS.plantas.inferior} 
                    alt="Planta Inferior" 
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" 
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
                      e.currentTarget.className = "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center">
                    <ZoomIn className="text-[#2C4C3B] opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-12 h-12 drop-shadow-sm" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 md:p-10 flex flex-col items-center justify-center group rounded-2xl shadow-xl shadow-black/5 border border-gray-100/50">
                <h4 className="font-serif text-2xl text-[#2C4C3B] mb-8 tracking-wide">Pavimento Superior</h4>
                <div 
                  className="relative w-full aspect-[3/4] overflow-hidden bg-white flex items-center justify-center cursor-pointer"
                  onClick={() => setSelectedImage(MEDIA_ASSETS.plantas.superior)}
                >
                  <img 
                    src={MEDIA_ASSETS.plantas.superior} 
                    alt="Planta Superior" 
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" 
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
                      e.currentTarget.className = "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center">
                    <ZoomIn className="text-[#2C4C3B] opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-12 h-12 drop-shadow-sm" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section (Horizontal Scroll) */}
      <section id="galeria" className="py-32 md:py-48 bg-[#556B2F]">
        <div className="max-w-[100vw] overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16 flex justify-between items-end">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="text-left"
            >
              <h2 className="text-5xl md:text-7xl font-serif text-white mb-8 tracking-tight">Galeria</h2>
              <div className="w-12 h-[1px] bg-[#F8F2E3]"></div>
            </motion.div>
            
            <div className="hidden md:flex gap-4">
              <button 
                onClick={() => scrollGallery('left')} 
                className="p-4 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={() => scrollGallery('right')} 
                className="p-4 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
                aria-label="Próxima"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div ref={galleryRef} className="flex overflow-x-auto snap-x snap-mandatory gap-8 px-6 md:px-12 pb-16 pt-8 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth' }}>
            {MEDIA_ASSETS.galeria.map((imgSrc, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="snap-center shrink-0 w-[85vw] md:w-[700px] h-[50vh] md:h-[75vh] cursor-pointer overflow-hidden group relative bg-[#2C4C3B] rounded-xl shadow-2xl shadow-black/30"
                onClick={() => setSelectedImage(imgSrc)}
              >
                <img 
                  src={imgSrc} 
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" 
                  alt={`Galeria ${index + 1}`} 
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
                    e.currentTarget.parentElement!.onclick = () => setSelectedImage("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80");
                  }}
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <div className="bg-white/95 text-[#556B2F] px-8 py-4 rounded-full flex items-center backdrop-blur-md uppercase tracking-widest text-xs font-sans font-medium">
                    <ZoomIn className="w-4 h-4 mr-3" /> Ampliar
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Plantão de Vendas Section */}
      <section id="plantao-de-vendas" className="py-32 md:py-48 bg-[#F8F2E3]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="lg:col-span-5 order-2 lg:order-1"
            >
              <h2 className="text-5xl md:text-7xl font-serif text-[#2C4C3B] mb-12 tracking-tight">Plantão de Vendas</h2>
              <div className="w-12 h-[1px] bg-[#A64322] mb-12"></div>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed font-light">
                Nosso plantão de vendas está pronto para te receber com conforto e atenção em cada detalhe.
              </p>
              <p className="text-xl text-gray-600 mb-12 leading-relaxed font-light">
                Venha tomar um café e conhecer de perto o Villagio Entre Verdes — um projeto pensado para quem valoriza qualidade de vida, natureza e exclusividade.
              </p>
              
              <div className="bg-white p-8 md:p-10 rounded-xl shadow-xl border border-gray-100 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#A64322] transition-all duration-300 group-hover:w-3"></div>
                <div className="flex items-start">
                  <div className="bg-[#F8F2E3] p-4 rounded-full mr-6 shrink-0">
                    <MapPin className="w-8 h-8 text-[#A64322]" />
                  </div>
                  <div>
                    <h4 className="font-serif text-2xl text-[#2C4C3B] mb-3">Endereço</h4>
                    <p className="text-gray-700 text-lg leading-relaxed font-medium">
                      R. Marcelo Pedroni, 506<br/>
                      <span className="text-gray-500 font-light">Vila Miranda, Sumaré/SP</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="lg:col-span-7 order-1 lg:order-2 h-[50vh] md:h-[70vh] w-full rounded-2xl overflow-hidden shadow-2xl bg-gray-200"
            >
              {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? (
                <iframe 
                  src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent("R. Marcelo Pedroni, 506 - Vila Miranda, Sumaré - SP, Brasil")}`}
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale hover:grayscale-0 transition-all duration-1000"
                ></iframe>
              ) : (
                <div className="w-full h-full bg-[#2C4C3B] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                  <MapPin className="w-16 h-16 text-[#F8F2E3] mb-6 relative z-10" />
                  <h3 className="text-3xl font-serif text-white mb-4 relative z-10">Localização Privilegiada</h3>
                  <p className="text-[#F8F2E3] text-lg mb-8 max-w-md relative z-10 font-light">
                    R. Marcelo Pedroni, 506<br/>Vila Miranda, Sumaré/SP
                  </p>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("R. Marcelo Pedroni, 506 - Vila Miranda, Sumaré - SP, Brasil")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-[#A64322] text-white px-8 py-4 rounded-full font-medium tracking-wide hover:bg-[#8A361A] transition-colors relative z-10 shadow-lg"
                  >
                    Abrir no Google Maps
                  </a>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Agende sua Visita Section */}
      <section id="agende-sua-visita" className="py-32 md:py-48 bg-[#F9F6F0]">
        <div className="max-w-5xl mx-auto px-6 md:px-12 text-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="bg-white p-12 md:p-24 shadow-xl border border-gray-100"
          >
            <h2 className="text-5xl md:text-7xl font-serif text-[#2C4C3B] mb-8 tracking-tight">Agende sua visita</h2>
            <div className="w-12 h-[1px] bg-[#A64322] mx-auto mb-10"></div>
            <p className="text-xl text-gray-600 mb-16 leading-relaxed font-light max-w-2xl mx-auto">
              Dê o primeiro passo para viver a serenidade. Entre em contato e descubra todos os detalhes do seu novo lar.
            </p>
            
            <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto flex flex-col gap-6 mb-12 text-left">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                <input 
                  type="text" 
                  id="name" 
                  required 
                  value={formState.name}
                  onChange={(e) => setFormState({...formState, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#2C4C3B] focus:border-[#2C4C3B] outline-none transition-colors"
                  placeholder="Seu nome"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Telefone / WhatsApp</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    required 
                    value={formState.phone}
                    onChange={(e) => setFormState({...formState, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#2C4C3B] focus:border-[#2C4C3B] outline-none transition-colors"
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                  <input 
                    type="email" 
                    id="email" 
                    required 
                    value={formState.email}
                    onChange={(e) => setFormState({...formState, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#2C4C3B] focus:border-[#2C4C3B] outline-none transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={formStatus === 'submitting'}
                className="mt-4 inline-flex items-center justify-center text-center bg-[#2C4C3B] hover:bg-[#1A2E23] text-white px-12 py-5 rounded-full text-xs uppercase tracking-[0.2em] transition-all hover:scale-[1.02] shadow-xl w-full disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {formStatus === 'submitting' ? 'Enviando...' : 'Enviar Mensagem'}
              </button>

              {formStatus === 'success' && (
                <p className="text-green-600 text-center mt-4 font-medium">Mensagem enviada com sucesso! Entraremos em contato em breve.</p>
              )}
              {formStatus === 'error' && (
                <p className="text-red-600 text-center mt-4 font-medium">Ocorreu um erro ao enviar. Por favor, tente novamente ou use o WhatsApp.</p>
              )}
            </form>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 border-t border-gray-100">
              <p className="text-gray-500 font-light">Ou se preferir, fale diretamente pelo WhatsApp:</p>
              <a 
                href="https://wa.me/5519998836542" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center justify-center bg-transparent border border-[#2C4C3B] text-[#2C4C3B] hover:bg-[#2C4C3B] hover:text-white px-8 py-3 rounded-full text-xs uppercase tracking-[0.2em] transition-all hover:scale-[1.02]"
              >
                <Phone className="w-4 h-4 mr-3" /> (19) 99883-6542
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2C4C3B] text-white/90 py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
            <div className="md:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex flex-col mb-8">
                  <img 
                    src={MEDIA_ASSETS.logoCompleto} 
                    alt="Villagio Entre Verdes" 
                    className="h-24 w-auto object-contain opacity-90 brightness-0 invert self-start"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      e.currentTarget.nextElementSibling?.classList.add('flex');
                    }}
                  />
                  <div className="hidden flex-col">
                    <span className="font-serif text-3xl font-semibold tracking-widest text-white">
                      VILLAGIO
                    </span>
                    <span className="text-xs font-sans tracking-[0.3em] font-light text-white/70">
                      ENTRE VERDES
                    </span>
                  </div>
                </div>
                <div className="flex space-x-6 mt-8">
                  <a href="https://instagram.com/villagioentreverdes" target="_blank" rel="noopener noreferrer" className="flex items-center text-white/70 hover:text-white transition-colors">
                    <Instagram className="w-5 h-5 mr-3" />
                    <span className="font-light tracking-wide">@villagioentreverdes</span>
                  </a>
                </div>
              </div>
              
              <div className="mt-16 md:mt-auto pt-8">
                <h4 className="text-white/50 font-medium mb-4 uppercase tracking-widest text-[0.65rem]">Desenvolvimento</h4>
                <img src={MEDIA_ASSETS.logoDomus} alt="Domus Inc" className="h-8 w-auto object-contain brightness-0 invert opacity-80" />
              </div>
            </div>
            
            <div className="md:col-span-4">
              <h4 className="text-white font-medium mb-8 uppercase tracking-widest text-xs">Desenvolvimento</h4>
              <p className="font-light text-white/70 mb-3 text-sm">Villagio Entre Verdes SPE LTDA – CNPJ 58.49.479/0001-97</p>
              <p className="font-light text-white/70 mb-3 text-sm">Domus Incorporadora</p>
              <p className="font-light text-white/70 mb-3 text-sm">Nexus Construtora</p>
              <p className="font-light text-white/70 mb-3 text-sm">Arquitetura: Isabela Formigoni Interiores</p>
              <p className="font-light text-white/70 text-sm">Vendas: Domus Soluções Imobiliárias – CRECI 39490-J SP</p>
            </div>

            <div className="md:col-span-3">
              <h4 className="text-white font-medium mb-8 uppercase tracking-widest text-xs">Contato</h4>
              <a href="https://wa.me/5519998836542" target="_blank" rel="noopener noreferrer" className="font-light text-white/70 hover:text-white transition-colors mb-4 flex items-center w-fit">
                <Phone className="w-4 h-4 mr-4 text-[#A64322]" /> (19) 99883-6542
              </a>
              <a href="mailto:imobiliariadomussolucoes@gmail.com" className="font-light text-white/70 hover:text-white transition-colors mb-4 flex items-center w-fit">
                <Mail className="w-4 h-4 mr-4 text-[#A64322]" /> imobiliariadomussolucoes@gmail.com
              </a>
              <a href="https://maps.google.com/?q=R.+Marcelo+Pedroni,+506+-+Vila+Miranda,+Sumaré/SP" target="_blank" rel="noopener noreferrer" className="font-light text-white/70 hover:text-white transition-colors flex items-start mt-6 w-fit">
                <MapPin className="w-4 h-4 mr-4 text-[#A64322] mt-1 shrink-0" />
                <span>
                  R. Marcelo Pedroni, 506<br/>
                  Vila Miranda, Sumaré/SP
                </span>
              </a>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-12">
            <p className="font-light text-[0.65rem] md:text-xs text-white/40 leading-relaxed text-justify">
              Condomínio "RESIDENCIAL VILLAGIO ENTRE VERDES", aprovado pela Prefeitura do Município de Sumaré/SP (protocolo n⁰. 8029/2025), com alvará de aprovação n. 236/2025, expedido em 03/06/2025, será constituído de 20 (vinte) unidades autônomas (casas) assobradadas, destinadas ao uso exclusivamente residencial, todas do mesmo modelo TIPO, diferenciando-se somente na área de terreno. Todas as imagens que constam neste material são meramente ilustrativas e possuem caráter de sugestão de decoração, não representando como o empreendimento será entregue.
            </p>
          </div>
        </div>
      </footer>

      {/* Global Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12 backdrop-blur-md cursor-zoom-out"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
            >
              <X size={40} strokeWidth={1} />
            </button>
            <motion.img
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              src={selectedImage}
              alt="Ampliada"
              className="max-w-full max-h-[90vh] object-contain shadow-2xl cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/5519998836542" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#20bd5a] hover:scale-110 transition-all duration-300 flex items-center justify-center"
        aria-label="Fale conosco pelo WhatsApp"
      >
        <MessageCircle size={32} />
      </a>
    </div>
  );
}

export default App;
