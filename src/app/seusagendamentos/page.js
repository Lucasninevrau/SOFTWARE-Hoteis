"use client";

import { useEffect, useState } from "react";
import { Col, Row, Alert, Modal, Button } from "react-bootstrap";
import Pagina from "../components/Pagina";
import { BsFillTrashFill } from "react-icons/bs";

export default function SeusAgendamentos() {
  const [reservas, setReservas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [reservaIndex, setReservaIndex] = useState(null);

  useEffect(() => {
    const reservasArmazenadas = JSON.parse(localStorage.getItem("reservas")) || [];
    setReservas(reservasArmazenadas);
  }, []);

  const handleDeleteReserva = (index) => {
    setReservaIndex(index);
    setShowModal(true);
  };

  const confirmarCancelamento = () => {
    const novasReservas = reservas.filter((_, i) => i !== reservaIndex);
    localStorage.setItem("reservas", JSON.stringify(novasReservas));
    setReservas(novasReservas);
    setShowModal(false);
    setReservaIndex(null);
  };

  const cancelarCancelamento = () => {
    setShowModal(false);
    setReservaIndex(null);
  };

  return (
    <Pagina>
      <div className="container mt-4">
        <h1>Seus Agendamentos</h1>
        {reservas.length > 0 ? (
          <Row>
            {reservas.map((reserva, index) => (
              <Col md={6} key={index} className="mb-4">
                <Row className="border rounded p-3 shadow-sm">
                  <Col xs={5} className="d-flex align-items-center">
                    <div style={{ position: "relative", width: "100%" }}>
                      <img
                        src={reserva.quarto.urlImagem}
                        alt={reserva.quarto.nome}
                        className="img-fluid rounded"
                      />
                      <BsFillTrashFill
                        className="text-danger"
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          cursor: "pointer",
                          fontSize: "1.5rem",
                          zIndex: 10,
                        }}
                        onClick={() => handleDeleteReserva(index)}
                        title="Apagar Reserva"
                      />
                    </div>
                  </Col>
                  <Col xs={7}>
                    <h5>{reserva.quarto.nome}</h5>
                    <p>
                      <strong>Valor Total:</strong> R$ {reserva.valorTotal}
                      <br />
                      <strong>Data de Entrada:</strong> {reserva.dataEntrada}
                      <br />
                      <strong>Data de Saída:</strong> {reserva.dataSaida}
                      <br />
                      <strong>Horário de Entrada:</strong> {reserva.horaSelecionadaEntrada}
                      <br />
                      <strong>Horário de Saída:</strong> {reserva.horaSelecionadaSaida}
                      <br />
                      <strong>Valor Total:</strong> R$ {reserva.valorTotal}
                    </p>
                  </Col>
                </Row>
              </Col>
            ))}
          </Row>
        ) : (
          <Alert variant="warning">Você ainda não possui reservas confirmadas.</Alert>
        )}

        {/* Modal de confirmação para cancelamento */}
        <Modal show={showModal} onHide={cancelarCancelamento}>
          <Modal.Header closeButton>
            <Modal.Title>Cancelar Reserva</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Tem certeza que deseja cancelar sua reserva? Você poderá ser multado por isso.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cancelarCancelamento}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmarCancelamento}>
              Confirmar Cancelamento
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
x    </Pagina>
  );
}
