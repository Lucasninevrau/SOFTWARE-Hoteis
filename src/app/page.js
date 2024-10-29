'use client';

import { Card, Col, Row, Button, Form, InputGroup, Modal } from "react-bootstrap";
import Pagina from "./components/Pagina";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaStar, FaStarHalfAlt, FaSearch, FaUserFriends, FaCalendarAlt } from 'react-icons/fa'; 
import DatePicker from "react-datepicker"; // Importando o calendário
import "react-datepicker/dist/react-datepicker.css"; // Importando o estilo do calendário
import styles from './home.module.css';

export default function Home() {
  
  const [hoteis, setHoteis] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [location, setLocation] = useState(""); 
  const [checkInDate, setCheckInDate] = useState(null); // Estado para armazenar a data de entrada
  const [checkOutDate, setCheckOutDate] = useState(null); // Estado para armazenar a data de saída

  const [showCheckInModal, setShowCheckInModal] = useState(false); // Controla a abertura do modal de entrada
  const [showCheckOutModal, setShowCheckOutModal] = useState(false); // Controla a abertura do modal de saída

  useEffect(() => {
    const hoteisCadastrados = JSON.parse(localStorage.getItem('hoteis')) || [];
    setHoteis(hoteisCadastrados);

    const localStorageLocation = localStorage.getItem('location') || '';
    setLocation(localStorageLocation);
  }, []);

  const loadMore = () => {
    setVisibleCount(prevCount => prevCount + 4);
  };

  const renderStars = (estrelas) => {
    const fullStars = Math.floor(estrelas);
    const halfStars = estrelas % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    return (
      <>
        {Array(fullStars).fill(<FaStar color="gold" />)}
        {halfStars ? <FaStarHalfAlt color="gold" /> : null}
        {Array(emptyStars).fill(<FaStar color="lightgray" />)}
      </>
    );
  };

  const filteredHoteis = hoteis.filter(hotel => {
    const lowerCaseTerm = searchTerm.toLowerCase();
    const lowerCaseLocation = location.toLowerCase();

    return (
      (hotel.nome.toLowerCase().includes(lowerCaseTerm) || 
      hotel.localizacao.toLowerCase().includes(lowerCaseTerm)) &&
      hotel.localizacao.toLowerCase().includes(lowerCaseLocation)
    );
  });

  // Função para salvar a data de entrada
  const handleSaveCheckIn = () => {
    setShowCheckInModal(false); // Fecha o modal
  };

  // Função para salvar a data de saída
  const handleSaveCheckOut = () => {
    setShowCheckOutModal(false); // Fecha o modal
  };

  return (
    <Pagina>

      {/* Barra de Pesquisa Estilizada */}
      <div className={`p-3 mb-4 ${styles.searchBar}`}>
        <Row className="align-items-center">
          {/* Coluna 1: Pesquisa de Localização */}
          <Col md={3}>
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Para onde?"
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
              />
            </InputGroup>
          </Col>

          {/* Coluna 2: Data de Entrada */}
          <Col md={2}>
            <InputGroup>
              <InputGroup.Text>
                <FaCalendarAlt />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder={checkInDate ? checkInDate.toLocaleDateString() : "--/--/----"}
                onClick={() => setShowCheckInModal(true)} // Abre o modal de entrada
                readOnly
              />
            </InputGroup>
          </Col>

          {/* Coluna 3: Data de Saída */}
          <Col md={2}>
            <InputGroup>
              <InputGroup.Text>
                <FaCalendarAlt />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder={checkOutDate ? checkOutDate.toLocaleDateString() : "--/--/----"}
                onClick={() => setShowCheckOutModal(true)} // Abre o modal de saída
                readOnly
              />
            </InputGroup>
          </Col>

          {/* Coluna 4: Hóspedes e Quartos */}
          <Col md={3}>
            <InputGroup>
              <InputGroup.Text>
                <FaUserFriends />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="2 hóspedes, 1 quarto"
                readOnly
              />
            </InputGroup>
          </Col>

          {/* Coluna 5: Botão de Pesquisa */}
          <Col md={2}>
            <Button variant="primary" className="w-100">
              Pesquisar
            </Button>
          </Col>
        </Row>
      </div>

      {/* Modal para selecionar a data de entrada */}
      <Modal show={showCheckInModal} onHide={() => setShowCheckInModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Selecione a data de entrada</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Data de entrada</p>
          <DatePicker
            selected={checkInDate}
            onChange={(date) => setCheckInDate(date)} // Atualiza a data de entrada
            dateFormat="dd/MM/yyyy"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCheckInModal(false)}>
            Fechar
          </Button>
          <Button variant="primary" onClick={handleSaveCheckIn}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para selecionar a data de saída */}
      <Modal show={showCheckOutModal} onHide={() => setShowCheckOutModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Selecione a data de saída</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Data de saída</p>
          <DatePicker
            selected={checkOutDate}
            onChange={(date) => setCheckOutDate(date)} // Atualiza a data de saída
            dateFormat="dd/MM/yyyy"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCheckOutModal(false)}>
            Fechar
          </Button>
          <Button variant="primary" onClick={handleSaveCheckOut}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Renderiza os hotéis filtrados */}
      <Row>
        {filteredHoteis.slice(0, visibleCount).map(hotel => (
          <Col
            key={hotel.id}
            xs={12}    
            sm={6}     
            md={4}     
            lg={3}     
            className="mb-5"
          >
            <Link href={`/hoteis/${hotel.id}`} style={{ textDecoration: 'none' }}>
              <Card className={`h-100 ${styles.cardHover}`}>
                <Card.Img variant="top" src={hotel.urlPrincipal} />
                <Card.Body className="d-flex flex-column justify-content-between" style={{ minHeight: "230px" }}>
                  <div>
                    <Card.Title className="mt-2">{hotel.nome}</Card.Title>
                    <Card.Text>
                      {renderStars(hotel.estrelas)}
                    </Card.Text>
                    <Card.Text>
                     <strong> Localização:</strong> {hotel.localizacao}
                    </Card.Text>
                    <Card.Text>
                    <strong> Tipo:</strong>  {hotel.tipo}
                    </Card.Text>
                  </div>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>

      {/* Botão "Ver mais" */}
      {visibleCount < filteredHoteis.length && (
        <div className="text-center">
          <Button variant="light" onClick={loadMore} style={{ opacity: 0.7 }}>
            Ver mais
          </Button>
        </div>
      )}
    </Pagina>
  );
}
