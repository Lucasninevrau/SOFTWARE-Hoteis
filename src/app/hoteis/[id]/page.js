'use client';

import Pagina from "@/app/components/Pagina";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, Carousel, Col, Form, Image, Row, Alert } from "react-bootstrap";
import { BsHeart, BsHeartFill, BsFillCheckCircleFill } from "react-icons/bs";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

export default function Page() {
  const [hotel, setHotel] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [tamanhos, setTamanhos] = useState([]);
  const [listaDesejos, setListaDesejos] = useState([]);
  const [quartosDisponiveis, setQuartosDisponiveis] = useState([]);
  const [imagemSelecionada, setImagemSelecionada] = useState('');
  const [mensagem, setMensagem] = useState('');
  const router = useRouter();
  const { id } = useParams();

  // Referência para a seção "Quartos Disponíveis"
  const quartosRef = useRef(null);

  useEffect(() => {
    const hoteis = JSON.parse(localStorage.getItem('hoteis')) || [];
    const hotelEncontrado = hoteis.find(hotel => hotel.id === parseInt(id));

    if (hotelEncontrado) {
      setHotel(hotelEncontrado);
      setTamanhoSelecionado(hotelEncontrado.tamanho || '');
      setImagemSelecionada(hotelEncontrado.urlImagem || '');
    } else {
      router.push('/');
    }

    const tamanhosSalvos = JSON.parse(localStorage.getItem('tamanhos')) || [];
    setTamanhos(tamanhosSalvos);

    const desejosSalvos = JSON.parse(localStorage.getItem('listaDesejos')) || [];
    setListaDesejos(desejosSalvos);

    const todosHoteis = JSON.parse(localStorage.getItem('hoteis')) || [];
    const todosQuartos = todosHoteis.flatMap(hotel => hotel.quartos || []);
    setQuartosDisponiveis(todosQuartos);
  }, [id, router]);

  const handleSelect = (selectedIndex) => {
    setSelectedIndex(selectedIndex);
    setImagemSelecionada(imagens[selectedIndex]);
  };

  const rolarParaQuartosDisponiveis = () => {
    if (quartosRef.current) {
      quartosRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDesejoClick = () => {
    let novaListaDesejos = [...listaDesejos];
    const jaNaLista = listaDesejos.some(item => item.id === hotel.id);

    if (jaNaLista) {
      novaListaDesejos = novaListaDesejos.filter(item => item.id !== hotel.id);
      setMensagem('Hotel removido da lista de desejos.');
    } else {
      novaListaDesejos.push(hotel);
      setMensagem('Hotel adicionado à lista de desejos!');
    }

    setListaDesejos(novaListaDesejos);
    localStorage.setItem('listaDesejos', JSON.stringify(novaListaDesejos));

    setTimeout(() => {
      setMensagem('');
    }, 3000);
  };

  const estaNaListaDesejos = listaDesejos.some(item => item.id === hotel?.id);

  const handleReservarQuarto = (quarto) => {
    localStorage.setItem('quartoReservado', JSON.stringify(quarto));
    router.push('/agendamento');
  };

  if (!hotel) {
    return <div>Carregando...</div>;
  }

  const renderStars = (estrelas) => {
    const fullStars = Math.floor(estrelas);
    const halfStars = estrelas % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    return (
      <>
        {Array(fullStars).fill(<FaStar color="gold" size={40} />)}
        {halfStars ? <FaStarHalfAlt color="gold" size={40} /> : null}
        {Array(emptyStars).fill(<FaStar color="lightgray" size={40} />)}
      </>
    );
  };

  const imagens = [hotel.urlPrincipal, hotel.urlAdicional1, hotel.urlAdicional2, hotel.urlAdicional3];

  return (
    <Pagina>
      <Row>
        <Col md={8}>
          <Row className="justify-content-end align-items-center">
            <Col md={2}>
              <Row className="flex-column">
                {imagens.map((src, idx) => (
                  <Col key={idx} onClick={() => handleSelect(idx)} className="mb-2">
                    <Image
                      src={src}
                      alt={`Imagem ${idx + 1}`}
                      thumbnail
                      style={{
                        cursor: 'pointer',
                        border: idx === selectedIndex ? '2px solid #007bff' : 'none',
                      }}
                    />
                  </Col>
                ))}
              </Row>
            </Col>
            <Col md={8}>
              <Row className="mb-3">
                <Col md={12}>
                  <Carousel className="w-100" activeIndex={selectedIndex} onSelect={handleSelect} indicators={false}>
                    {imagens.map((src, idx) => (
                      <Carousel.Item key={idx}>
                        <Image src={src} alt={`Imagem ${idx + 1}`} className="d-block w-100" />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col md={4}>
          <h1>{hotel.nome}</h1>
          <p>{renderStars(hotel.estrelas)}</p>

          {mensagem && <Alert variant="success">{mensagem}</Alert>}

          <Form.Group as={Row} className="mb-3">
            <div className="mb-4 mt-2">
              <div className="d-flex align-items-center">
                <BsFillCheckCircleFill className="text-success me-2" /> <span>Café da manhã incluído</span>
              </div>
              <div className="d-flex align-items-center">
                <BsFillCheckCircleFill className="text-success me-2" /> <span>Estacionamento grátis sem manobrista</span>
              </div>
              <div className="d-flex align-items-center">
                <BsFillCheckCircleFill className="text-success me-2" /> <span>2 camas de solteiro</span>
              </div>
              <div className="d-flex align-items-center">
                <BsFillCheckCircleFill className="text-success me-2" /> <span>Acomoda 2 pessoas</span>
              </div>
              <div className="d-flex align-items-center">
                <BsFillCheckCircleFill className="text-success me-2" /> <span>Wi-Fi grátis</span>
              </div>
            </div>
          </Form.Group>

          <Button variant="success" className="w-100 mb-3" onClick={rolarParaQuartosDisponiveis}>
            Ver Quartos Disponíveis
          </Button>

          <Button variant="secondary" className="w-100" onClick={() => router.push('/')}>Voltar</Button>

          {estaNaListaDesejos ? (
            <BsHeartFill
              className="heart-icon w-100 mb-3 mt-4"
              size={25}
              onClick={handleDesejoClick}
              style={{
                color: 'red',
                cursor: 'pointer',
              }}
            />
          ) : (
            <BsHeart
              className="heart-icon w-100 mb-3 mt-4"
              size={25}
              onClick={handleDesejoClick}
              style={{
                color: '#000',
                cursor: 'pointer',
              }}
            />
          )}
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={12}>
          <div className="card">
            <Image src={imagemSelecionada} alt="Imagem Selecionada" className="card-img-top" />
          </div>
        </Col>
      </Row>

      <Row className="mt-4" ref={quartosRef}>
        <Col md={12}>
          <h2>Quartos Disponíveis</h2>
          <Row>
            {quartosDisponiveis.map((quarto) => (
              <Col md={4} key={quarto.id} className="mb-3 d-flex">
                <div className="card h-100 d-flex flex-column">
                  <Image src={quarto.urlImagem} alt={quarto.nome} className="card-img-top" style={{ objectFit: 'cover', height: '200px' }} />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{quarto.nome}</h5>
                    <p className="card-text">Preço: R$ {quarto.precoPorNoite}</p>
                    <Button variant="primary" onClick={() => handleReservarQuarto(quarto)} className="mt-auto">
                      Reservar
                    </Button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Pagina>
  );
}
