"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Col, Row, Form, Alert, Modal } from "react-bootstrap";
import Pagina from "../components/Pagina";
import { BsStarFill, BsCheckCircle } from "react-icons/bs"; // Ícones para estrela e check

export default function Agendamento() {
  const [quartoReservado, setQuartoReservado] = useState(null);
  const [dataEntrada, setDataEntrada] = useState("");
  const [dataSaida, setDataSaida] = useState("");
  const [horariosDisponiveisEntrada, setHorariosDisponiveisEntrada] = useState([]);
  const [horariosDisponiveisSaida, setHorariosDisponiveisSaida] = useState([]);
  const [horaSelecionadaEntrada, setHoraSelecionadaEntrada] = useState(null);
  const [horaSelecionadaSaida, setHoraSelecionadaSaida] = useState(null);
  const [valorTotal, setValorTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const horasBase = [
    "09:00", "09:15", "09:30", "09:45", "10:00",
    "10:15", "10:30", "10:45", "11:00", "11:15",
    "11:30", "13:00", "14:00", "14:15", "14:30",
    "14:45", "15:00", "15:15", "15:30", "15:45",
    "16:45", "17:45", "18:45",
  ];

  useEffect(() => {
    const quarto = JSON.parse(localStorage.getItem("quartoReservado"));
    if (quarto) {
      setQuartoReservado(quarto);
    }
  }, []);

  useEffect(() => {
    if (dataEntrada && dataSaida && quartoReservado) {
      calcularValorTotal();
    }
  }, [dataEntrada, dataSaida, quartoReservado]);

  const calcularValorTotal = () => {
    const entrada = new Date(dataEntrada);
    const saida = new Date(dataSaida);

    if (saida <= entrada) {
      alert("A data de saída deve ser posterior à data de entrada.");
      setValorTotal(0);
      return;
    }

    const dias = Math.ceil((saida - entrada) / (1000 * 60 * 60 * 24));
    const total = quartoReservado.precoPorNoite * dias;
    setValorTotal(total);
  };

  const handleConfirmarReserva = () => {
    const reservas = JSON.parse(localStorage.getItem("reservas")) || [];

    const conflito = reservas.some((reserva) => {
      const reservaEntrada = new Date(reserva.dataEntrada);
      const reservaSaida = new Date(reserva.dataSaida);
      const entrada = new Date(dataEntrada);
      const saida = new Date(dataSaida);
      return reserva.quarto.id === quartoReservado.id && (
        (entrada >= reservaEntrada && entrada <= reservaSaida) ||
        (saida >= reservaEntrada && saida <= reservaSaida) ||
        (entrada <= reservaEntrada && saida >= reservaSaida)
      );
    });

    if (conflito) {
      alert("Este quarto já está reservado nas datas selecionadas. Por favor, escolha outras datas.");
      return;
    }

    const novaReserva = {
      quarto: quartoReservado,
      dataEntrada,
      dataSaida,
      horaSelecionadaEntrada,
      horaSelecionadaSaida,
      valorTotal,
    };

    reservas.push(novaReserva);
    localStorage.setItem("reservas", JSON.stringify(reservas));
    setShowModal(true);
  };

  const handleFecharModal = () => {
    setShowModal(false);
    router.push("/seusagendamentos");
  };

  const handleCancelarReserva = () => {
    localStorage.removeItem("quartoReservado");
    setQuartoReservado(null);
  };

  const handleDataEntradaChange = (e) => {
    setDataEntrada(e.target.value);
    setHorariosDisponiveisEntrada(horasBase);
  };

  const handleDataSaidaChange = (e) => {
    setDataSaida(e.target.value);
    setHorariosDisponiveisSaida(horasBase);
  };

  return (
    <Pagina>
      <div className="container mt-4">
        <h1>Agendamento do Quarto</h1>
        {quartoReservado ? (
          <Row className="align-items-center">
            <Col md={4}>
              <img src={quartoReservado.urlImagem} alt={quartoReservado.nome} className="img-fluid rounded" />
            </Col>
            <Col md={8}>
              <h3>{quartoReservado.nome}</h3>
              <div className="d-flex align-items-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <BsStarFill key={i} color="gold" />
                ))}
              </div>
              <ul className="list-unstyled">
                <li><BsCheckCircle className="text-success" /> Café da manhã incluído</li>
                <li><BsCheckCircle className="text-success" /> Estacionamento grátis sem manobrista</li>
                <li><BsCheckCircle className="text-success" /> 2 camas de solteiro</li>
                <li><BsCheckCircle className="text-success" /> Acomoda 2 pessoas</li>
                <li><BsCheckCircle className="text-success" /> Wi-Fi grátis</li>
              </ul>
              <p><strong>Preço por noite:</strong> R$ {quartoReservado.precoPorNoite}</p>
              <p><strong>Valor Total:</strong> R$ {valorTotal}</p>
            </Col>
          </Row>
        ) : (
          <Alert variant="warning">Você não tem nenhum quarto reservado.</Alert>
        )}

        {/* Formulário de Agendamento */}
        {quartoReservado && (
          <Form className="mt-4">
            <Row>
              <Col md={6}>
                <Form.Group controlId="dataEntrada">
                  <Form.Label>Data de Entrada</Form.Label>
                  <Form.Control type="date" value={dataEntrada} onChange={handleDataEntradaChange} />
                </Form.Group>
                {dataEntrada && (
                  <div className="mt-3">
                    <Form.Label>Horários Disponíveis para Entrada</Form.Label>
                    <div className="d-flex flex-wrap gap-2">
                      {horariosDisponiveisEntrada.map((hora) => (
                        <Button
                          key={hora}
                          variant={horaSelecionadaEntrada === hora ? "primary" : "outline-primary"}
                          onClick={() => setHoraSelecionadaEntrada(hora)}
                        >
                          {hora}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </Col>
              <Col md={6}>
                <Form.Group controlId="dataSaida">
                  <Form.Label>Data de Saída</Form.Label>
                  <Form.Control type="date" value={dataSaida} onChange={handleDataSaidaChange} />
                </Form.Group>
                {dataSaida && (
                  <div className="mt-3">
                    <Form.Label>Horários Disponíveis para Saída</Form.Label>
                    <div className="d-flex flex-wrap gap-2">
                      {horariosDisponiveisSaida.map((hora) => (
                        <Button
                          key={hora}
                          variant={horaSelecionadaSaida === hora ? "primary" : "outline-primary"}
                          onClick={() => setHoraSelecionadaSaida(hora)}
                        >
                          {hora}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </Col>
            </Row>
            <Button
              variant="success"
              className="mt-4 w-100"
              disabled={!dataEntrada || !dataSaida || !horaSelecionadaEntrada || !horaSelecionadaSaida || valorTotal === 0}
              onClick={handleConfirmarReserva}
            >
              Confirmar Reserva
            </Button>
            <Button
              variant="danger"
              className="mt-2 w-100"
              onClick={handleCancelarReserva}
            >
              Cancelar Reserva
            </Button> <br></br>
          </Form>
        )}
        <br></br>

        {/* Modal de confirmação */}
        <Modal show={showModal} onHide={handleFecharModal}>
          <Modal.Header closeButton>
            <Modal.Title>Reserva Confirmada</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Sua reserva foi confirmada com sucesso!</p>
            <p><strong>Quarto:</strong> {quartoReservado?.nome}</p>
            <p><strong>Data de Entrada:</strong> {dataEntrada}</p>
            <p><strong>Data de Saída:</strong> {dataSaida}</p>
            <p><strong>Horário de Entrada:</strong> {horaSelecionadaEntrada}</p>
            <p><strong>Horário de Saída:</strong> {horaSelecionadaSaida}</p>
            <p><strong>Valor Total:</strong> R$ {valorTotal}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={handleFecharModal}>Ok</Button>
          </Modal.Footer>
        </Modal>
      </div>
     
        <br></br>
        <br></br>
        <br></br>
    </Pagina>
  );
}
