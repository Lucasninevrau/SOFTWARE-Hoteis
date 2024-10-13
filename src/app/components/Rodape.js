'use client';

import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

export default function Rodape() {
    return (
        <footer style={{ backgroundColor: "#dcdcdc", color: "#fff", padding: "40px 0" }}>
            <Container>
                {/* Seção de navegação rápida */}
                <Row className="text-center text-md-start">
                    <Col md={3} className="mb-4">
                        <h5 style={{ color: '#3e4144', fontWeight: 'bold' }}>Sobre Nós</h5>
                        <p style={{ color: '#3e4144' }}>Oferecendo produtos de qualidade, nossa missão é garantir sua satisfação.</p>
                    </Col>
                    <Col md={3} className="mb-4">
                        <h5 style={{ color: '#3e4144', fontWeight: 'bold' }}>Links Úteis</h5>
                        <ul className="list-unstyled">
                            <li><a href="/informacoes#politica-de-privacidade" style={{ color: '#3e4144', textDecoration: 'none' }}>Política de Privacidade</a></li>
                            <li><a href="/informacoes#termos-de-servico" style={{ color: '#3e4144', textDecoration: 'none' }}>Termos de Serviço</a>
                            </li>
                            <li><a href="/informacoes#suporte" style={{ color: '#3e4144', textDecoration: 'none' }}>Suporte</a></li>
                            <li><a href="/informacoes#contato" style={{ color: '#3e4144', textDecoration: 'none' }}>Contato</a></li>
                        </ul>
                    </Col>
                    <Col md={3} className="mb-4">
                        <h5 style={{ color: '#3e4144', fontWeight: 'bold' }}>Produtos</h5>
                        <ul className="list-unstyled">
                            <li><a href="/" style={{ color: '#3e4144', textDecoration: 'none' }}>Lista de Produtos</a></li>

                        </ul>
                    </Col>
                    <Col md={3} className="mb-4 text-center">
                        <h5 style={{ color: '#3e4144', fontWeight: 'bold' }}>Siga-nos</h5>
                        <div className="d-flex justify-content-center">
                            <a href="#" style={{ color: '#3e4144', margin: '0 10px' }}><FaFacebookF size={24} /></a>
                            <a href="#" style={{ color: '#3e4144', margin: '0 10px' }}><FaInstagram size={24} /></a>
                            <a href="#" style={{ color: '#3e4144', margin: '0 10px' }}><FaTwitter size={24} /></a>
                            <a href="#" style={{ color: '#3e4144', margin: '0 10px' }}><FaLinkedinIn size={24} /></a>
                        </div>
                    </Col>
                </Row>

                {/* Divisória */}
                <hr style={{ borderColor: "#6c757d", margin: "20px 0" }} />

                {/* Copyright e Informações Finais */}
                <Row className="text-center">
                    <Col>
                        <p style={{ margin: 0, color: '#3e4144', fontSize: '14px' }}>
                            Copyright © 2024 - Todos os direitos reservados.
                        </p>
                        <p style={{ margin: 0, color: '#3e4144', fontSize: '14px' }}>
                            Coded with ❤️ by Davi Maciel, Lucas Fernandes, Rafaela Leite, João Pedro Loiola, Eduardo Caetano.
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}
